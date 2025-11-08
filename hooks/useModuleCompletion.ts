"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Hook pour vérifier si un module est complété (progress === 100%)
 * 
 * @param user - L'utilisateur connecté (peut être null)
 * @param courseId - L'ID du cours/module (ex: "corp-basics")
 * @returns {Object} Objet contenant l'état de complétion et le chargement
 */
export function useModuleCompletion(user: User | null, courseId: string | undefined) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !courseId) {
      setIsCompleted(false);
      setLoading(false);
      return;
    }

    async function fetchCompletion() {
      if (!user || !courseId) return;

      setLoading(true);
      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("course_progress")
        .select("progress")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors de la récupération de la complétion du module:", error);
        setIsCompleted(false);
        setLoading(false);
        return;
      }

      // Un module est complété si la progression est à 100%
      setIsCompleted(data?.progress === 100 || false);
      setLoading(false);
    }

    fetchCompletion();
  }, [user, courseId]);

  return { isCompleted, loading };
}

