"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const { profile } = useProfile(user);
  const [imageError, setImageError] = useState(false);

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
  };

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/parcours", label: "Parcours" },
    { href: "/entretien-ia", label: "Entretien IA" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profil", label: "Profil" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="flex h-16 items-center justify-between px-3 md:px-6">
        {/* Bloc gauche : Logo + Navigation */}
        <div className="flex items-center gap-6 pl-4 md:pl-6">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            {imageError ? (
              <div className="h-[72px] w-[72px] bg-primary rounded-lg flex items-center justify-center">
                <span className="text-accent font-bold text-2xl">F</span>
              </div>
            ) : (
              <Image
                src="/images/finx-logo-navbar.png"
                alt="FinX Academy"
                width={72}
                height={72}
                className="h-[72px] w-[72px] object-contain"
                priority
                unoptimized
                onError={() => setImageError(true)}
                style={{
                  objectFit: 'contain',
                  backgroundColor: 'transparent',
                }}
              />
            )}
          </Link>

          {/* Navigation principale */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 text-sm font-medium">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full transition text-gray-700 hover:text-gray-900 hover:bg-gray-100 ${
                    isActive ? "bg-yellow-50 text-yellow-600" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bloc droite : Utilisateur + Déconnexion */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <>
              {/* Avatar + nom (caché sur mobile) */}
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold text-gray-900">
                  {profile?.username || user.email?.split("@")[0] || "Utilisateur"}
                </span>
                <span className="text-xs text-gray-500 truncate max-w-[160px]">
                  {user.email}
                </span>
              </div>

              {/* Avatar rond (initiales) */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A2540] text-xs font-semibold text-white flex-shrink-0">
                {getInitials(profile?.username || null, user.email || null)}
              </div>

              {/* Bouton déconnexion */}
              <button
                onClick={handleSignOut}
                className="hidden md:inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="bg-accent text-primary font-semibold px-4 py-2 rounded-full hover:bg-accent-dark transition-all text-sm"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
