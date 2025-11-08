"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { UserBadge } from "@/lib/supabase/profile";

/**
 * Hook pour récupérer les badges d'un utilisateur
 * 
 * @param user - L'utilisateur connecté (peut être null)
 * @returns {Object} Objet contenant les badges et l'état de chargement
 * @returns {UserBadge[]} badges - Liste des badges débloqués
 * @returns {boolean} loading - Indique si le chargement est en cours
 */
export function useUserBadges(user: User | null) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      if (!user) {
        setBadges([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("user_badges")
          .select("*")
          .eq("user_id", user.id)
          .order("unlocked_at", { ascending: false });

        if (error) {
          console.error("Erreur lors de la récupération des badges:", error);
          setBadges([]);
        } else {
          setBadges(data || []);
        }
      } catch (err) {
        console.error("Erreur inattendue lors de la récupération des badges:", err);
        setBadges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [user]);

  return { badges, loading };
}

