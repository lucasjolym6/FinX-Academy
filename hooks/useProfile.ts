"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/supabase/profile";

/**
 * Hook pour récupérer le profil d'un utilisateur
 * 
 * @param user - L'utilisateur connecté (peut être null)
 * @returns {Object} Objet contenant le profil et l'état de chargement
 * @returns {Profile | null} profile - Le profil de l'utilisateur ou null
 * @returns {boolean} loading - Indique si le chargement est en cours
 */
export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors de la récupération du profil:", error);
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error("Erreur inattendue lors de la récupération du profil:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading };
}

