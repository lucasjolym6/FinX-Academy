"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Hook pour récupérer la complétion de tous les modules en une seule requête
 * 
 * @param user - L'utilisateur connecté (peut être null)
 * @param courseIds - Liste des IDs de cours/modules à vérifier
 * @returns {Object} Objet contenant les complétions et le chargement
 */
export function useAllModuleCompletions(user: User | null, courseIds: string[]) {
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || courseIds.length === 0) {
      setCompletions({});
      setLoading(false);
      return;
    }

    async function fetchCompletions() {
      if (!user) return;

      setLoading(true);
      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("course_progress")
        .select("course_id, progress")
        .eq("user_id", user.id)
        .in("course_id", courseIds);

      if (error) {
        console.error("Erreur lors de la récupération des complétions:", error);
        setCompletions({});
        setLoading(false);
        return;
      }

      // Créer un objet avec les complétions (progress === 100)
      const completionsMap: Record<string, boolean> = {};
      courseIds.forEach((courseId) => {
        const progress = data?.find((p) => p.course_id === courseId);
        completionsMap[courseId] = progress?.progress === 100 || false;
      });

      setCompletions(completionsMap);
      setLoading(false);
    }

    fetchCompletions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // courseIds est stable grâce à useMemo dans le composant parent

  return { completions, loading };
}

