"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ensureUserProfile } from "@/lib/supabase/profile";
import type { User } from "@supabase/supabase-js";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const supabase = createSupabaseBrowserClient();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "login") {
        // Connexion
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
        } else if (data.user) {
          // Créer ou vérifier le profil utilisateur
          await ensureUserProfile(data.user);
          setSuccess("Connexion réussie ! Bienvenue 👋");
          setEmail("");
          setPassword("");
        }
      } else {
        // Inscription
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
        } else if (data.user) {
          // Créer ou vérifier le profil utilisateur
          await ensureUserProfile(data.user);
          setSuccess(
            "Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte. 📧"
          );
          setEmail("");
          setPassword("");
        }
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Déconnexion réussie");
      setUser(null);
    }
  };

  // Si l'utilisateur est connecté, afficher ses informations
  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Connecté</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              className="w-full bg-gray-100 text-primary font-semibold rounded-lg py-3 hover:bg-gray-200 transition-all"
            >
              Se déconnecter
            </button>
            <a
              href="/dashboard"
              className="block w-full bg-primary text-white font-semibold rounded-lg py-3 hover:bg-primary-dark transition-all text-center"
            >
              Aller au Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6">
        {/* Toggle entre Connexion et Inscription */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setMode("login");
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 rounded-md font-semibold transition-all ${
              mode === "login"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 rounded-md font-semibold transition-all ${
              mode === "signup"
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="votre@email.com"
            />
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
              <p className="font-semibold">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Message de succès */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
              <p className="font-semibold">Succès</p>
              <p className="text-sm">{success}</p>
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white rounded-lg py-3 mt-4 w-full hover:bg-primary-dark transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Chargement...
              </span>
            ) : mode === "login" ? (
              "Se connecter"
            ) : (
              "Créer mon compte"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

