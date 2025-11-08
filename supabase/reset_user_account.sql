-- ============================================
-- Script pour réinitialiser un compte utilisateur à zéro
-- ============================================
-- ⚠️ ATTENTION : Ce script supprime TOUTES les données de l'utilisateur
-- Remplacez 'USER_EMAIL' par votre email ou 'USER_ID' par votre UUID
-- ============================================

-- Option 1 : Réinitialiser par email
-- Remplacez 'votre-email@example.com' par votre email
DO $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Récupérer l'UUID de l'utilisateur depuis son email
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = 'votre-email@example.com';

  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non trouvé avec cet email';
  END IF;

  -- Supprimer les résultats des examens
  DELETE FROM exam_results WHERE user_id = user_uuid;
  
  -- Supprimer les résultats des quiz
  DELETE FROM quiz_results WHERE user_id = user_uuid;
  
  -- Supprimer les leçons complétées
  DELETE FROM lesson_completion WHERE user_id = user_uuid;
  
  -- Supprimer les badges
  DELETE FROM user_badges WHERE user_id = user_uuid;
  
  -- Supprimer la progression des cours
  DELETE FROM course_progress WHERE user_id = user_uuid;
  
  -- Réinitialiser le profil (XP = 0, niveau = 1)
  UPDATE profiles
  SET xp = 0, level = 1
  WHERE id = user_uuid;

  RAISE NOTICE 'Compte réinitialisé pour l''utilisateur %', user_uuid;
END $$;

-- ============================================
-- Option 2 : Réinitialiser par UUID directement
-- Remplacez 'VOTRE-UUID-ICI' par votre UUID
-- ============================================
/*
DO $$
DECLARE
  user_uuid UUID := 'VOTRE-UUID-ICI';
BEGIN
  -- Supprimer les résultats des examens
  DELETE FROM exam_results WHERE user_id = user_uuid;
  
  -- Supprimer les résultats des quiz
  DELETE FROM quiz_results WHERE user_id = user_uuid;
  
  -- Supprimer les leçons complétées
  DELETE FROM lesson_completion WHERE user_id = user_uuid;
  
  -- Supprimer les badges
  DELETE FROM user_badges WHERE user_id = user_uuid;
  
  -- Supprimer la progression des cours
  DELETE FROM course_progress WHERE user_id = user_uuid;
  
  -- Réinitialiser le profil (XP = 0, niveau = 1)
  UPDATE profiles
  SET xp = 0, level = 1
  WHERE id = user_uuid;

  RAISE NOTICE 'Compte réinitialisé pour l''utilisateur %', user_uuid;
END $$;
*/

-- ============================================
-- Option 3 : Réinitialiser le compte de l'utilisateur connecté
-- (À exécuter depuis une fonction sécurisée)
-- ============================================
/*
CREATE OR REPLACE FUNCTION reset_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_uuid UUID := auth.uid();
BEGIN
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Vous devez être connecté';
  END IF;

  -- Supprimer les résultats des examens
  DELETE FROM exam_results WHERE user_id = user_uuid;
  
  -- Supprimer les résultats des quiz
  DELETE FROM quiz_results WHERE user_id = user_uuid;
  
  -- Supprimer les leçons complétées
  DELETE FROM lesson_completion WHERE user_id = user_uuid;
  
  -- Supprimer les badges
  DELETE FROM user_badges WHERE user_id = user_uuid;
  
  -- Supprimer la progression des cours
  DELETE FROM course_progress WHERE user_id = user_uuid;
  
  -- Réinitialiser le profil (XP = 0, niveau = 1)
  UPDATE profiles
  SET xp = 0, level = 1
  WHERE id = user_uuid;

  RAISE NOTICE 'Votre compte a été réinitialisé';
END $$;
*/

