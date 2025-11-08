"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useWeeklyProgress(user: User | null) {
  const [completedThisWeek, setCompletedThisWeek] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const weeklyGoal = 3; // Objectif par défaut : 3 leçons par semaine

  useEffect(() => {
    if (!user) {
      setCompletedThisWeek(0);
      setLoading(false);
      return;
    }

    async function fetchWeeklyProgress() {
      if (!user) return;
      
      const supabase = createSupabaseBrowserClient();
      
      // Calculer le début de la semaine (lundi)
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = dimanche, 1 = lundi, etc.
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Si dimanche, on remonte de 6 jours
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - daysToMonday);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const startOfWeekISO = startOfWeek.toISOString();

      const { count, error } = await supabase
        .from("lesson_completion")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("completed_at", startOfWeekISO);

      if (error) {
        console.error("Erreur lors de la récupération de la progression hebdomadaire:", error);
        setLoading(false);
        return;
      }

      setCompletedThisWeek(count || 0);
      setLoading(false);
    }

    fetchWeeklyProgress();
  }, [user]);

  const progressPercent = Math.min(100, Math.round((completedThisWeek / weeklyGoal) * 100));

  return {
    completedThisWeek,
    weeklyGoal,
    progressPercent,
    loading,
  };
}

