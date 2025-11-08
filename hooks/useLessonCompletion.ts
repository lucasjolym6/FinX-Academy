"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface LessonCompletion {
  lesson_slug: string;
  completed_at: string;
}

export function useLessonCompletion(user: User | null, moduleId: string) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Réinitialiser les leçons complétées si l'utilisateur change ou n'est pas connecté
    if (!user || !moduleId) {
      setCompletedLessons(new Set());
      setLoading(false);
      return;
    }

    async function fetchCompletedLessons() {
      if (!user) return;
      
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      
      const { data, error } = await supabase
        .from("lesson_completion")
        .select("lesson_slug")
        .eq("user_id", user.id)
        .eq("module_id", moduleId);

      if (error) {
        console.error("Erreur lors de la récupération des leçons complétées:", error);
        setCompletedLessons(new Set());
        setLoading(false);
        return;
      }

      const completedSet = new Set(data?.map((l) => l.lesson_slug) || []);
      setCompletedLessons(completedSet);
      setLoading(false);
    }

    fetchCompletedLessons();
  }, [user, moduleId]);

  const isLessonCompleted = (lessonSlug: string): boolean => {
    return completedLessons.has(lessonSlug);
  };

  const isLessonUnlocked = (lessonOrder: number, lessons: Array<{ order: number; slug: string }>): boolean => {
    // La première leçon est toujours débloquée
    if (lessonOrder === 1) return true;

    // Trouver la leçon précédente
    const previousLesson = lessons.find((l) => l.order === lessonOrder - 1);
    if (!previousLesson) return true;

    // La leçon est débloquée si la précédente est complétée
    return isLessonCompleted(previousLesson.slug);
  };

  const completeLesson = async (lessonSlug: string): Promise<boolean> => {
    if (!user || !moduleId) return false;

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase
      .from("lesson_completion")
      .upsert(
        {
          user_id: user.id,
          module_id: moduleId,
          lesson_slug: lessonSlug,
        },
        {
          onConflict: "user_id,module_id,lesson_slug",
        }
      );

    if (error) {
      console.error("Erreur lors de la complétion de la leçon:", error);
      return false;
    }

    // Mettre à jour l'état local immédiatement
    setCompletedLessons((prev) => new Set([...prev, lessonSlug]));
    
    // Recharger depuis la base de données pour s'assurer de la synchronisation
    // Cela garantit que toutes les pages utilisant ce hook voient la mise à jour
    const { data: refreshData } = await supabase
      .from("lesson_completion")
      .select("lesson_slug")
      .eq("user_id", user.id)
      .eq("module_id", moduleId);
    
    if (refreshData) {
      const refreshedSet = new Set(refreshData.map((l) => l.lesson_slug));
      setCompletedLessons(refreshedSet);
    }
    
    return true;
  };

  return {
    completedLessons,
    isLessonCompleted,
    isLessonUnlocked,
    completeLesson,
    loading,
  };
}

