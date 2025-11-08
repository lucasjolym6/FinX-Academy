"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useQuizResult(user: User | null, lessonId: string | undefined, moduleId: string | undefined) {
  const [quizPassed, setQuizPassed] = useState<boolean | null>(null); // null = pas de quiz ou pas encore chargé
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !lessonId || !moduleId) {
      setQuizPassed(null);
      setLoading(false);
      return;
    }

    async function fetchQuizResult() {
      if (!user || !lessonId || !moduleId) return;

      setLoading(true);
      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("quiz_results")
        .select("passed")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .eq("module_id", moduleId)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors de la récupération du résultat du quiz:", error);
        setQuizPassed(null);
        setLoading(false);
        return;
      }

      // Si pas de résultat, le quiz n'a pas été passé
      if (!data) {
        setQuizPassed(false);
        setLoading(false);
        return;
      }

      setQuizPassed(data.passed);
      setLoading(false);
    }

    fetchQuizResult();
  }, [user, lessonId, moduleId]);

  return { quizPassed, loading };
}

