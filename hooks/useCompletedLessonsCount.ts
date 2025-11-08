"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useCompletedLessonsCount(user: User | null) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCount(0);
      setLoading(false);
      return;
    }

    async function fetchCompletedLessonsCount() {
      if (!user) return;
      
      const supabase = createSupabaseBrowserClient();
      
      const { count, error } = await supabase
        .from("lesson_completion")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (error) {
        console.error("Erreur lors de la récupération du nombre de leçons complétées:", error);
        setLoading(false);
        return;
      }

      setCount(count || 0);
      setLoading(false);
    }

    fetchCompletedLessonsCount();
  }, [user]);

  return { count, loading };
}

