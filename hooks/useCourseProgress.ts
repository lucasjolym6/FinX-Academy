"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { CourseProgress } from "@/lib/supabase/profile";

/**
 * Hook pour récupérer la progression des parcours d'un utilisateur
 * 
 * @param user - L'utilisateur connecté (peut être null)
 * @returns {Object} Objet contenant la progression des parcours et l'état de chargement
 * @returns {CourseProgress[]} progress - Liste des progressions de parcours
 * @returns {boolean} loading - Indique si le chargement est en cours
 */
export function useCourseProgress(user: User | null) {
  const [progress, setProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setProgress([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("course_progress")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (error) {
          console.error("Erreur lors de la récupération de la progression:", error);
          setProgress([]);
        } else {
          setProgress(data || []);
        }
      } catch (err) {
        console.error("Erreur inattendue lors de la récupération de la progression:", err);
        setProgress([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  return { progress, loading };
}

