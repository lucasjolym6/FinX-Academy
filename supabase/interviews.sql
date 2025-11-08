CREATE TABLE IF NOT EXISTS interview_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  career_path TEXT,
  job_id TEXT,
  job_title TEXT,
  total_questions INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  feedback_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS interview_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES interview_runs(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  duration_seconds INTEGER NOT NULL,
  recording_url TEXT NOT NULL,
  snapshot_url TEXT,
  transcript TEXT,
  feedback_json JSONB,
  visual_feedback_json JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  discarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE interview_responses
  ADD COLUMN IF NOT EXISTS visual_feedback_json JSONB;

CREATE INDEX IF NOT EXISTS idx_interview_runs_user_id ON interview_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_responses_run_id ON interview_responses(run_id);
CREATE INDEX IF NOT EXISTS idx_interview_responses_question_index ON interview_responses(run_id, question_index);
CREATE INDEX IF NOT EXISTS idx_interview_responses_recording ON interview_responses(run_id, question_index, recording_url);

ALTER TABLE interview_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own runs" ON interview_runs;
CREATE POLICY "Users select own runs"
  ON interview_runs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own runs" ON interview_runs;
CREATE POLICY "Users insert own runs"
  ON interview_runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own runs" ON interview_runs;
CREATE POLICY "Users update own runs"
  ON interview_runs FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own runs" ON interview_runs;
CREATE POLICY "Users delete own runs"
  ON interview_runs FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users select own responses" ON interview_responses;
CREATE POLICY "Users select own responses"
  ON interview_responses FOR SELECT
  USING (
    auth.uid() = (SELECT user_id FROM interview_runs WHERE interview_runs.id = interview_responses.run_id)
  );

DROP POLICY IF EXISTS "Users insert own responses" ON interview_responses;
CREATE POLICY "Users insert own responses"
  ON interview_responses FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM interview_runs WHERE interview_runs.id = run_id)
  );

DROP POLICY IF EXISTS "Users update own responses" ON interview_responses;
CREATE POLICY "Users update own responses"
  ON interview_responses FOR UPDATE
  USING (
    auth.uid() = (SELECT user_id FROM interview_runs WHERE interview_runs.id = interview_responses.run_id)
  );

DROP POLICY IF EXISTS "Users delete own responses" ON interview_responses;
CREATE POLICY "Users delete own responses"
  ON interview_responses FOR DELETE
  USING (
    auth.uid() = (SELECT user_id FROM interview_runs WHERE interview_runs.id = interview_responses.run_id)
  );

-----------------------------------------------------------------
-- Wallet FinX
-----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS wallet_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_credits NUMERIC(12,2) NOT NULL DEFAULT 0,
  bonus_credits NUMERIC(12,2) NOT NULL DEFAULT 0,
  lifetime_credits NUMERIC(12,2) NOT NULL DEFAULT 0,
  last_transaction_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE wallet_transaction_type AS ENUM ('credit', 'debit');
CREATE TYPE wallet_transaction_category AS ENUM (
  'reward',
  'purchase',
  'subscription',
  'simulation',
  'module',
  'manual_adjustment'
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallet_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type wallet_transaction_type NOT NULL,
  category wallet_transaction_category NOT NULL DEFAULT 'manual_adjustment',
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  balance_after NUMERIC(12,2) NOT NULL,
  label TEXT NOT NULL,
  metadata JSONB,
  reference_id TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_accounts_user_id ON wallet_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_occurred ON wallet_transactions(occurred_at DESC);

ALTER TABLE wallet_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own wallet" ON wallet_accounts;
CREATE POLICY "Users select own wallet"
  ON wallet_accounts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own wallet" ON wallet_accounts;
CREATE POLICY "Users insert own wallet"
  ON wallet_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own wallet" ON wallet_accounts;
CREATE POLICY "Users update own wallet"
  ON wallet_accounts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users select own wallet transactions" ON wallet_transactions;
CREATE POLICY "Users select own wallet transactions"
  ON wallet_transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own wallet transactions" ON wallet_transactions;
CREATE POLICY "Users insert own wallet transactions"
  ON wallet_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION trigger_update_wallet_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS wallet_accounts_set_timestamp ON wallet_accounts;
CREATE TRIGGER wallet_accounts_set_timestamp
  BEFORE UPDATE ON wallet_accounts
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_wallet_timestamp();

CREATE OR REPLACE FUNCTION public.create_wallet_for_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallet_accounts (user_id, total_credits, bonus_credits, lifetime_credits)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS wallet_after_profile_insert ON profiles;
CREATE TRIGGER wallet_after_profile_insert
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_wallet_for_new_profile();

CREATE OR REPLACE FUNCTION public.apply_wallet_transaction(
  p_user_id UUID,
  p_type wallet_transaction_type,
  p_category wallet_transaction_category,
  p_amount NUMERIC,
  p_label TEXT,
  p_metadata JSONB DEFAULT '{}',
  p_reference_id TEXT DEFAULT NULL
)
RETURNS wallet_transactions AS $$
DECLARE
  account wallet_accounts;
  new_balance NUMERIC(12,2);
  tx wallet_transactions;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  INSERT INTO wallet_accounts (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO account
  FROM wallet_accounts
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF p_type = 'credit' THEN
    new_balance := account.total_credits + p_amount;
  ELSE
    IF account.total_credits < p_amount THEN
      RAISE EXCEPTION 'Insufficient credits';
    END IF;
    new_balance := account.total_credits - p_amount;
  END IF;

  UPDATE wallet_accounts
  SET total_credits = new_balance,
      lifetime_credits = lifetime_credits + CASE WHEN p_type = 'credit' THEN p_amount ELSE 0 END,
      last_transaction_at = NOW()
  WHERE id = account.id
  RETURNING * INTO account;

  INSERT INTO wallet_transactions (
    wallet_id,
    user_id,
    type,
    category,
    amount,
    balance_after,
    label,
    metadata,
    reference_id,
    status
  )
  VALUES (
    account.id,
    p_user_id,
    p_type,
    p_category,
    p_amount,
    account.total_credits,
    p_label,
    COALESCE(p_metadata, '{}'),
    p_reference_id,
    'completed'
  )
  RETURNING * INTO tx;

  RETURN tx;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
