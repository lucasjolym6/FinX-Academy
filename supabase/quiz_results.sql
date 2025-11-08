-- Table pour sauvegarder les résultats des quiz
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL, -- ex: "introduction-finance-entreprise"
  module_id TEXT NOT NULL, -- ex: "finance-entreprise/fondamentaux"
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  passed BOOLEAN NOT NULL DEFAULT false,
  answers JSONB, -- Sauvegarde des réponses sélectionnées
  questions_count INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, lesson_id, module_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_lesson ON quiz_results(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_module ON quiz_results(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_module ON quiz_results(user_id, module_id);

-- Activer RLS
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Policies pour quiz_results
DROP POLICY IF EXISTS "Users can view own quiz results" ON quiz_results;
CREATE POLICY "Users can view own quiz results"
  ON quiz_results FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz results" ON quiz_results;
CREATE POLICY "Users can insert own quiz results"
  ON quiz_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own quiz results" ON quiz_results;
CREATE POLICY "Users can update own quiz results"
  ON quiz_results FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own quiz results" ON quiz_results;
CREATE POLICY "Users can delete own quiz results"
  ON quiz_results FOR DELETE
  USING (auth.uid() = user_id);

