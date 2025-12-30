-- ==============================================================================
-- MIGRATION: COMPLETE VIA RESULTS TABLE SETUP
-- Purpose: Create storage for full VIA test history (all 24 strengths, not just top 5)
-- Run this in Supabase SQL Editor
-- ==============================================================================

-- 1. Create via_results table if it doesn't exist
CREATE TABLE IF NOT EXISTS via_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ranked_strengths TEXT[], -- Array of strength names in rank order
  score JSONB,             -- Key-value map of strength -> score
  all_strengths JSONB,     -- Full detailed array with ranks, raw scores, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure all_strengths column exists (in case table existed from previous migration)
ALTER TABLE via_results 
ADD COLUMN IF NOT EXISTS all_strengths JSONB;

-- 3. Add Index for performance
CREATE INDEX IF NOT EXISTS idx_via_results_user_date 
ON via_results(user_id, created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE via_results ENABLE ROW LEVEL SECURITY;

-- 5. Add Policies (Users can only see/create their own results)
DO $$
BEGIN
  -- Select Policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'via_results' AND policyname = 'via_results_select_own'
  ) THEN
    CREATE POLICY via_results_select_own ON via_results 
    FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- Insert Policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'via_results' AND policyname = 'via_results_insert_own'
  ) THEN
    CREATE POLICY via_results_insert_own ON via_results 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 6. Refresh Schema Cache
NOTIFY pgrst, 'reload schema';
