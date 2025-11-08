-- ============================================
-- Script pour ajouter les policies DELETE manquantes
-- ============================================
-- Ce script ajoute les policies DELETE pour permettre aux utilisateurs
-- de supprimer leurs propres données lors de la réinitialisation du compte.
-- ============================================

-- Policies DELETE pour lesson_completion
DROP POLICY IF EXISTS "Users can delete own lesson completion" ON lesson_completion;
CREATE POLICY "Users can delete own lesson completion"
  ON lesson_completion FOR DELETE
  USING (auth.uid() = user_id);

-- Policies DELETE pour quiz_results
DROP POLICY IF EXISTS "Users can delete own quiz results" ON quiz_results;
CREATE POLICY "Users can delete own quiz results"
  ON quiz_results FOR DELETE
  USING (auth.uid() = user_id);

-- Policies DELETE pour exam_results
DROP POLICY IF EXISTS "Users can delete own exam results" ON exam_results;
CREATE POLICY "Users can delete own exam results"
  ON exam_results FOR DELETE
  USING (auth.uid() = user_id);

-- Policies DELETE pour course_progress
DROP POLICY IF EXISTS "Users can delete own course progress" ON course_progress;
CREATE POLICY "Users can delete own course progress"
  ON course_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Policies DELETE pour user_badges
DROP POLICY IF EXISTS "Users can delete own badges" ON user_badges;
CREATE POLICY "Users can delete own badges"
  ON user_badges FOR DELETE
  USING (auth.uid() = user_id);

