import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { calculateLevel } from "@/lib/gamification";
import type { User } from "@supabase/supabase-js";

export type CompleteLessonParams = {
  user: User;
  courseId: string; // ex: "finance-entreprise", "finance-marche", "strategie"
  lessonId: string; // identifiant de la leçon actuelle
  lessonIndex: number; // position de la leçon dans le parcours (ex: 1, 2, 3)
  totalLessons: number; // nombre total de leçons dans le parcours
  xpEarned?: number; // XP à donner pour cette leçon (par défaut 20)
};

/**
 * Complète une leçon pour un utilisateur et met à jour toute la gamification
 * 
 * @param params - Paramètres de complétion de la leçon
 * @returns {Promise<{success: boolean, xpEarned: number, newLevel?: number, badgeUnlocked?: string}>}
 */
export async function completeLessonForUser(params: CompleteLessonParams) {
  const {
    user,
    courseId,
    lessonId,
    lessonIndex,
    totalLessons,
    xpEarned = 20, // Par défaut 20 XP par leçon
  } = params;

  const supabase = createSupabaseBrowserClient();

  try {
    // 1. Récupérer la progression actuelle du parcours
    const { data: existingProgress, error: progressError } = await supabase
      .from("course_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    // Calculer le nouveau pourcentage de progression
    // On utilise max pour ne jamais revenir en arrière
    const newProgressPercent = Math.min(
      100,
      Math.round((lessonIndex / totalLessons) * 100)
    );
    const currentProgress = existingProgress?.progress || 0;
    const finalProgress = Math.max(currentProgress, newProgressPercent);

    // 2. Upsert dans course_progress
    const { error: upsertError } = await supabase
      .from("course_progress")
      .upsert(
        {
          user_id: user.id,
          course_id: courseId,
          progress: finalProgress,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,course_id",
        }
      );

    if (upsertError) {
      console.error("Erreur lors de la mise à jour de la progression:", upsertError);
      throw new Error(`Erreur lors de la mise à jour de la progression: ${upsertError.message}`);
    }

    // 3. Récupérer le profil actuel
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("xp, level")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Erreur lors de la récupération du profil:", profileError);
      throw new Error(`Erreur lors de la récupération du profil: ${profileError.message}`);
    }

    // 4. Calculer le nouvel XP et niveau
    const currentXP = profile.xp || 0;
    const newXP = currentXP + xpEarned;
    // Toujours recalculer le niveau à partir de l'XP pour éviter les incohérences
    const oldLevel = calculateLevel(currentXP);
    const newLevel = calculateLevel(newXP);

    // 5. Mettre à jour le profil avec le nouvel XP et niveau
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        xp: newXP,
        level: newLevel,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Erreur lors de la mise à jour du profil:", updateError);
      throw new Error(`Erreur lors de la mise à jour du profil: ${updateError.message}`);
    }

    // 6. Vérifier et créer des badges si nécessaire
    let badgeUnlocked: string | undefined;

    // Récupérer les badges existants
    const { data: existingBadges, error: badgesError } = await supabase
      .from("user_badges")
      .select("badge_code")
      .eq("user_id", user.id);

    if (!badgesError && existingBadges) {
      // Badge "first_lesson" : première leçon terminée
      const hasFirstLessonBadge = existingBadges.some((b) => b.badge_code === "first_lesson");
      
      if (!hasFirstLessonBadge) {
        // Créer le badge "first_lesson" (première leçon terminée)
        const { error: badgeError } = await supabase
          .from("user_badges")
          .insert({
            user_id: user.id,
            badge_code: "first_lesson",
          });

        if (!badgeError) {
          badgeUnlocked = "first_lesson";
        }
      }
    }

    // Badge "course_completed" : si le parcours atteint 100%
    if (finalProgress === 100) {
      const badgeCode = `course_completed_${courseId}`;
      const hasCourseBadge = existingBadges?.some((b) => b.badge_code === badgeCode);

      if (!hasCourseBadge) {
        const { error: courseBadgeError } = await supabase
          .from("user_badges")
          .insert({
            user_id: user.id,
            badge_code: badgeCode,
          });

        if (!courseBadgeError) {
          badgeUnlocked = badgeCode;
        }
      }
    }

    return {
      success: true,
      xpEarned,
      newXP,
      newLevel,
      oldLevel,
      levelUp: newLevel > oldLevel,
      badgeUnlocked,
      progress: finalProgress,
    };
  } catch (error) {
    console.error("Erreur lors de la complétion de la leçon:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
    };
  }
}

