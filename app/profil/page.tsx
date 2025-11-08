"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import { useUserBadges } from "@/hooks/useUserBadges";
import { useCompletedLessonsCount } from "@/hooks/useCompletedLessonsCount";
import { useWeeklyProgress } from "@/hooks/useWeeklyProgress";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getXpForCurrentLevel, getXpForNextLevel, calculateLevel } from "@/lib/gamification";
import { badgeDefinitions } from "@/data/badges";
import type { Profile } from "@/lib/supabase/profile";
import type { UserBadge } from "@/lib/supabase/profile";

/**
 * Fonction pour extraire les initiales d'un nom ou email
 */
function getInitials(username: string | null, email: string | null): string {
  if (username) {
    const parts = username.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  }
  if (email) {
    const emailPrefix = email.split("@")[0];
    return emailPrefix.substring(0, 2).toUpperCase();
  }
  return "U";
}

/**
 * Fonction pour formater la date en français
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Fonction pour obtenir le label d'un badge depuis son code
 */
function getBadgeLabel(badgeCode: string): { title: string; icon: string } {
  const badge = badgeDefinitions[badgeCode];
  if (badge) {
    return { title: badge.title, icon: badge.icon };
  }
  // Fallback pour les codes de badges qui ne sont pas dans la définition
  // Par exemple : course_completed_finance-entreprise
  if (badgeCode.startsWith("course_completed_")) {
    const courseName = badgeCode.replace("course_completed_", "").replace(/-/g, " ");
    return {
      title: `Parcours ${courseName} complété`,
      icon: "✅",
    };
  }
  if (badgeCode === "first_lesson") {
    return { title: "Premier Pas", icon: "🎯" };
  }
  return { title: badgeCode, icon: "🏆" };
}

export default function ProfilPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading } = useProfile(user);
  const { badges: userBadges, loading: badgesLoading } = useUserBadges(user);
  const { count: completedLessonsCount, loading: lessonsCountLoading } = useCompletedLessonsCount(user);
  const { completedThisWeek, weeklyGoal, progressPercent: weeklyProgressPercent, loading: weeklyProgressLoading } = useWeeklyProgress(user);

  // État pour l'édition du username
  const [username, setUsername] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Initialiser le username quand le profil est chargé
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || user?.email?.split("@")[0] || "");
    }
  }, [profile, user]);

  // Synchroniser le niveau dans la base de données si nécessaire
  useEffect(() => {
    const syncLevel = async () => {
      if (!user || !profile) return;
      
      const calculatedLevel = calculateLevel(profile.xp);
      // Si le niveau en base de données est différent du niveau calculé, le mettre à jour
      if (profile.level !== calculatedLevel) {
        const supabase = createSupabaseBrowserClient();
        await supabase
          .from("profiles")
          .update({ level: calculatedLevel })
          .eq("id", profile.id);
      }
    };
    
    syncLevel();
  }, [user, profile]);

  // État de chargement global
  const loading = userLoading || profileLoading || badgesLoading || lessonsCountLoading || weeklyProgressLoading;

  // Cas 1 : Chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 xl:px-16 py-10 md:py-16">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement du profil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cas 2 : Pas connecté
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 xl:px-16 py-10 md:py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">Profil</h1>
            <p className="text-gray-700 mb-6">Tu dois être connecté pour voir ton profil.</p>
            <button
              onClick={() => router.push("/auth")}
              className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-900 transition-all"
            >
              Aller à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cas 3 : Connecté mais profil non trouvé (ne devrait pas arriver si ensureUserProfile fonctionne)
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 xl:px-16 py-10 md:py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">Profil</h1>
            <p className="text-gray-700 mb-6">Profil introuvable. Veuillez réessayer plus tard.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-900 transition-all"
            >
              Retour au dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cas 4 : Connecté + profil trouvé → Afficher la page profil complète
  const currentXP = profile.xp;
  // Toujours recalculer le niveau à partir de l'XP pour éviter les incohérences
  const currentLevel = calculateLevel(currentXP);
  const xpForCurrentLevel = getXpForCurrentLevel(currentXP);
  const xpForNextLevel = getXpForNextLevel(currentXP);
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  const initials = getInitials(profile.username, user.email || null);
  const displayUsername = profile.username || user.email?.split("@")[0] || "Utilisateur";
  const displayEmail = user.email || "";

  // Fonction pour sauvegarder le username
  const handleSaveUsername = async () => {
    if (!user || !profile) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from("profiles")
        .update({ username: username.trim() || null })
        .eq("id", profile.id);

      if (error) {
        console.error("Erreur lors de la mise à jour du username:", error);
        setSaveMessage({ type: "error", text: "Erreur lors de la sauvegarde" });
      } else {
        setSaveMessage({ type: "success", text: "Profil mis à jour avec succès !" });
        // Recharger le profil après 1 seconde
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      console.error("Erreur inattendue:", err);
      setSaveMessage({ type: "error", text: "Une erreur inattendue s'est produite" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 xl:px-16 py-10 md:py-16">
        {/* Titre principal */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Mon profil</h1>
          <p className="text-gray-500 mt-1">
            Personnalise ton compte et suis ta progression sur FinX Academy.
          </p>
        </div>

        {/* Grille en deux colonnes */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Colonne de gauche (2/3) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Carte profil */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold flex-shrink-0">
                {initials}
              </div>

              {/* Infos */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-primary mb-1">{displayUsername}</h2>
                <p className="text-gray-600 text-sm mb-2">{displayEmail}</p>
                <p className="text-gray-500 text-sm">
                  Membre depuis le {formatDate(profile.created_at)}
                </p>
              </div>
            </div>

            {/* Bandeau de stats rapides */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {/* Stat 1 : Parcours suivis */}
              <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Parcours suivis</p>
                <p className="text-xl font-bold text-gray-900">3</p>
                <p className="text-xs text-gray-400 mt-1">Finance d&apos;entreprise, Finance de marché, Stratégie</p>
              </div>

              {/* Stat 2 : Leçons terminées */}
              <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Leçons terminées</p>
                <p className="text-xl font-bold text-gray-900">{completedLessonsCount}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {completedLessonsCount === 0
                    ? "Aucune leçon terminée"
                    : completedLessonsCount === 1
                    ? "1 leçon complétée"
                    : `${completedLessonsCount} leçons complétées`}
                </p>
              </div>

              {/* Stat 3 : Badges débloqués */}
              <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Badges</p>
                <p className="text-xl font-bold text-gray-900">{userBadges.length}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {userBadges.length === 0 ? "Aucun badge débloqué" : `${userBadges.length} badge${userBadges.length > 1 ? "s" : ""} obtenu${userBadges.length > 1 ? "s" : ""}`}
                </p>
              </div>

              {/* Stat 4 : Streak */}
              <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Streak (jours)</p>
                <p className="text-xl font-bold text-gray-900">0</p>
                {/* TODO: brancher sur table Supabase activity_log ou user_streaks */}
                <p className="text-xs text-gray-400 mt-1">Placeholder</p>
              </div>
            </section>

            {/* Informations du profil (username) */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations du profil</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d&apos;utilisateur
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={user.email?.split("@")[0] || "Utilisateur"}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                    <button
                      onClick={handleSaveUsername}
                      disabled={isSaving || username.trim() === (profile.username || "")}
                      className="bg-primary text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? "Enregistrement..." : "Enregistrer"}
                    </button>
                  </div>
                </div>

                {/* Message de succès/erreur */}
                {saveMessage && (
                  <div
                    className={`text-sm px-4 py-2 rounded-lg ${
                      saveMessage.type === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {saveMessage.text}
                  </div>
                )}
              </div>
            </div>

            {/* Mes badges */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mes badges</h3>

              {badgesLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Chargement des badges...</p>
                </div>
              ) : userBadges.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Tu n&apos;as pas encore débloqué de badges. Termine des leçons et des quiz pour en gagner 🏅
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {userBadges.map((badge) => {
                    const badgeInfo = getBadgeLabel(badge.badge_code);
                    return (
                      <div
                        key={badge.id}
                        className="bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent rounded-xl p-4 text-center hover:scale-105 transition-all"
                      >
                        <div className="text-4xl mb-2">{badgeInfo.icon}</div>
                        <h4 className="font-semibold text-primary text-sm mb-1">{badgeInfo.title}</h4>
                        <p className="text-xs text-gray-600">
                          {new Date(badge.unlocked_at).toLocaleDateString("fr-FR", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Paramètres du compte */}
            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Paramètres du compte</h3>
              <p className="text-sm text-gray-600 mb-4">
                Réinitialisez votre compte pour supprimer toutes vos données (XP, badges, progression, quiz, examens).
              </p>
              <Link
                href="/reset-account"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all"
              >
                <span>⚠️</span>
                Réinitialiser mon compte
              </Link>
            </div>
          </div>

          {/* Colonne de droite (1/3) */}
          <div className="space-y-6 lg:col-span-1">
            {/* Progression FinX Academy */}
            <div className="bg-gradient-to-r from-[#0A2540] to-[#122f5e] text-white rounded-2xl p-6 shadow-lg">
              <p className="text-sm text-gray-300 mb-4">Progression FinX Academy</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Niveau</p>
                  <p className="text-3xl font-bold">{currentLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">XP</p>
                  <p className="text-3xl font-bold">{currentXP.toLocaleString()}</p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                <div
                  className="bg-[#F5B301] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                />
              </div>
              <p className="text-xs text-gray-300 mt-2">
                {xpNeededForNextLevel - xpInCurrentLevel} XP avant le niveau {currentLevel + 1}
              </p>
            </div>

            {/* Objectif de la semaine */}
            <div className="bg-white rounded-2xl shadow p-5 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Objectif de la semaine</h3>
              <p className="text-sm text-gray-600 mb-4">
                Définis un objectif simple pour garder le rythme d&apos;apprentissage.
              </p>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  {weeklyGoal} leçons à terminer cette semaine
                </p>
                
                {/* Barre de progression */}
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Leçons complétées</span>
                  <span className="font-semibold">
                    {completedThisWeek} / {weeklyGoal}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#F5B301] h-2 transition-all duration-300"
                    style={{ width: `${weeklyProgressPercent}%` }}
                  />
                </div>
                {weeklyProgressPercent >= 100 && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    🎉 Objectif atteint cette semaine !
                  </p>
                )}
              </div>
              
              <p className="text-sm text-gray-500">
                {completedThisWeek === 0
                  ? "Commence une leçon aujourd'hui pour lancer ta semaine 🚀"
                  : completedThisWeek < weeklyGoal
                  ? `Continue ainsi ! ${weeklyGoal - completedThisWeek} leçon${weeklyGoal - completedThisWeek > 1 ? "s" : ""} restante${weeklyGoal - completedThisWeek > 1 ? "s" : ""} 💪`
                  : "Objectif atteint ! Continue à progresser 🌟"}
              </p>
            </div>

            {/* Activité récente */}
            <div className="bg-white rounded-2xl shadow p-5 md:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Activité récente
              </h2>
              
              {/* TODO: remplacer par de vraies données d'activité depuis Supabase (table activity_log) */}
              <div className="space-y-3">
                {/* Item 1 : Inscription */}
                <div className="flex items-start gap-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-[#F5B301] mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Inscription sur FinX Academy</p>
                    <p className="text-xs text-gray-500">{formatDate(profile.created_at)}</p>
                  </div>
                </div>

                {/* Item 2 : Création du profil */}
                <div className="flex items-start gap-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-[#F5B301] mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Création du profil</p>
                    <p className="text-xs text-gray-500">{formatDate(profile.created_at)}</p>
                  </div>
                </div>

                {/* Item 3 : Objectif hebdomadaire */}
                <div className="flex items-start gap-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-[#F5B301] mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Objectif hebdomadaire : 3 leçons</p>
                    <p className="text-xs text-gray-500">Défini automatiquement</p>
                  </div>
                </div>

                {/* Item 4 : Premier badge (si débloqué) */}
                {userBadges.length > 0 && (
                  <div className="flex items-start gap-3 py-2">
                    <div className="w-2 h-2 rounded-full bg-[#F5B301] mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        Badge débloqué : {getBadgeLabel(userBadges[0].badge_code).title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(userBadges[0].unlocked_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
