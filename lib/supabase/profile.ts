import { createSupabaseBrowserClient } from "./client";
import { calculateLevel } from "@/lib/gamification";
import type { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string | null;
  xp: number;
  level: number;
  created_at: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_code: string;
  unlocked_at: string;
}

/**
 * Vérifie et crée un profil utilisateur s'il n'existe pas
 * 
 * @param user - L'utilisateur Supabase
 * @returns Le profil créé ou existant
 */
export async function ensureUserProfile(user: User): Promise<Profile | null> {
  if (!user) {
    return null;
  }

  const supabase = createSupabaseBrowserClient();

  // Vérifier si le profil existe
  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error("Erreur lors de la vérification du profil:", fetchError);
    return null;
  }

  // Si le profil existe, le retourner
  if (existingProfile) {
    return existingProfile;
  }

  // Sinon, créer le profil
  const username = user.email?.split("@")[0] || null;
  const initialLevel = calculateLevel(0);

  const { data: newProfile, error: createError } = await supabase
    .from("profiles")
    .insert([
      {
        id: user.id,
        username,
        xp: 0,
        level: initialLevel,
      },
    ])
    .select()
    .single();

  if (createError) {
    console.error("Erreur lors de la création du profil:", createError);
    return null;
  }

  return newProfile;
}

