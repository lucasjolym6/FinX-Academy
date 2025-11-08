-- Table pour suivre les leçons complétées par utilisateur
CREATE TABLE IF NOT EXISTS lesson_completion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL, -- ex: "finance-entreprise/fondamentaux"
  lesson_slug TEXT NOT NULL, -- ex: "introduction-finance-entreprise"
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, module_id, lesson_slug)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_lesson_completion_user_id ON lesson_completion(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completion_module ON lesson_completion(module_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completion_user_module ON lesson_completion(user_id, module_id);

-- Activer RLS
ALTER TABLE lesson_completion ENABLE ROW LEVEL SECURITY;

-- Policies pour lesson_completion
DROP POLICY IF EXISTS "Users can view own lesson completion" ON lesson_completion;
CREATE POLICY "Users can view own lesson completion"
  ON lesson_completion FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lesson completion" ON lesson_completion;
CREATE POLICY "Users can insert own lesson completion"
  ON lesson_completion FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own lesson completion" ON lesson_completion;
CREATE POLICY "Users can update own lesson completion"
  ON lesson_completion FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own lesson completion" ON lesson_completion;
CREATE POLICY "Users can delete own lesson completion"
  ON lesson_completion FOR DELETE
  USING (auth.uid() = user_id);

