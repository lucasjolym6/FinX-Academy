"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Hook personnalisé pour récupérer l'utilisateur connecté
 * 
 * @returns {Object} Objet contenant l'utilisateur et l'état de chargement
 * @returns {User | null} user - L'utilisateur connecté ou null
 * @returns {boolean} loading - Indique si le chargement est en cours
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // Récupérer l'utilisateur connecté
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        setUser(null);
      } else {
        setUser(data?.user ?? null);
      }
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Nettoyer la subscription au démontage
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

