-- Table pour sauvegarder les résultats des examens finaux
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL, -- ex: "finance-entreprise/fondamentaux"
  exam_case_id INTEGER NOT NULL, -- ID du cas d'examen (1-10)
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  passed BOOLEAN NOT NULL DEFAULT false,
  answers JSONB, -- Sauvegarde des réponses sélectionnées
  questions_count INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, module_id, exam_case_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_exam_results_user_id ON exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_module ON exam_results(module_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_user_module ON exam_results(user_id, module_id);

-- Activer RLS
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Policies pour exam_results
DROP POLICY IF EXISTS "Users can view own exam results" ON exam_results;
CREATE POLICY "Users can view own exam results"
  ON exam_results FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own exam results" ON exam_results;
CREATE POLICY "Users can insert own exam results"
  ON exam_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own exam results" ON exam_results;
CREATE POLICY "Users can update own exam results"
  ON exam_results FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own exam results" ON exam_results;
CREATE POLICY "Users can delete own exam results"
  ON exam_results FOR DELETE
  USING (auth.uid() = user_id);

