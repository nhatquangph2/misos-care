-- =====================================================
-- COMPREHENSIVE SCHEMA VERIFICATION FOR MISO/VIA SYSTEM
-- Run this in Supabase SQL Editor to ensure all required columns exist
-- Date: 2025-12-25
-- =====================================================

-- 1. PERSONALITY_PROFILES TABLE COLUMNS
-- =====================================================

-- VIA Character Strengths (REQUIRED for VIA test)
ALTER TABLE personality_profiles 
ADD COLUMN IF NOT EXISTS via_signature_strengths JSONB;

ALTER TABLE personality_profiles 
ADD COLUMN IF NOT EXISTS via_top_virtue TEXT;

-- SISRI-24 Spiritual Intelligence (REQUIRED for SISRI-24 test)
ALTER TABLE personality_profiles 
ADD COLUMN IF NOT EXISTS sisri24_scores JSONB;

-- BFI-2 Complete Score (REQUIRED for Big5/BFI-2 test)
ALTER TABLE personality_profiles 
ADD COLUMN IF NOT EXISTS bfi2_score JSONB;

-- Big5 Raw Scores (REQUIRED for MISO V3)
ALTER TABLE personality_profiles 
ADD COLUMN IF NOT EXISTS big5_openness_raw DECIMAL(3,2);

ALTER TABLE personality_profiles 
ADD COLUMN IF NOT EXISTS big5_conscientiousness_raw DECIMAL(3,2);

ALTER TABLE personality_profiles 
ADD COLUMN IF NOT EXISTS big5_extraversion_raw DECIMAL(3,2);

ALTER TABLE personality_profiles 
ADD COLUMN IF NOT EXISTS big5_agreeableness_raw DECIMAL(3,2);

ALTER TABLE personality_profiles 
ADD COLUMN IF NOT EXISTS big5_neuroticism_raw DECIMAL(3,2);


-- 2. VIA_RESULTS TABLE (if used for storing VIA history)
-- =====================================================
CREATE TABLE IF NOT EXISTS via_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ranked_strengths TEXT[],
  score JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_via_results_user_date
ON via_results(user_id, created_at DESC);


-- 3. MBTI_RESULTS TABLE (if used for storing MBTI history)
-- =====================================================
CREATE TABLE IF NOT EXISTS mbti_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mbti_results_user_date
ON mbti_results(user_id, created_at DESC);


-- 4. SISRI24_RESULTS TABLE (if used for storing SISRI-24 history)
-- =====================================================
CREATE TABLE IF NOT EXISTS sisri24_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scores JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sisri24_results_user_date
ON sisri24_results(user_id, created_at DESC);


-- 5. BFI2_TEST_HISTORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bfi2_test_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score JSONB NOT NULL,
  raw_scores JSONB,
  completion_time_seconds INTEGER,
  quality_warnings TEXT[],
  raw_responses JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bfi2_user_date
ON bfi2_test_history(user_id, completed_at DESC);


-- 6. MISO_ANALYSIS_LOGS TABLE (REQUIRED for MISO V3)
-- =====================================================
CREATE TABLE IF NOT EXISTS miso_analysis_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_result JSONB NOT NULL,
  bvs DECIMAL,
  rcs DECIMAL,
  profile_id TEXT,
  risk_level TEXT,
  completeness_level TEXT,
  dass21_depression INTEGER,
  dass21_anxiety INTEGER,
  dass21_stress INTEGER,
  big5_neuroticism DECIMAL,
  big5_extraversion DECIMAL,
  big5_openness DECIMAL,
  big5_agreeableness DECIMAL,
  big5_conscientiousness DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_miso_logs_user_date
ON miso_analysis_logs(user_id, created_at DESC);


-- 7. PREDICTION_FEEDBACK TABLE (for MISO V3 prediction tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS prediction_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bvs DECIMAL,
  rcs DECIMAL,
  predicted_dass_d INTEGER,
  predicted_dass_a INTEGER,
  predicted_dass_s INTEGER,
  actual_dass_d INTEGER,
  actual_dass_a INTEGER,
  actual_dass_s INTEGER,
  delta_d INTEGER,
  delta_a INTEGER,
  delta_s INTEGER,
  mae DECIMAL,
  segment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 8. RLS POLICIES (ensure users can access their own data)
-- =====================================================

-- Enable RLS on tables if not already enabled
ALTER TABLE via_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE mbti_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE sisri24_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE bfi2_test_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE miso_analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies (use IF NOT EXISTS pattern with DO block)
DO $$
BEGIN
  -- VIA Results policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'via_results' AND policyname = 'via_results_select_own') THEN
    CREATE POLICY via_results_select_own ON via_results FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'via_results' AND policyname = 'via_results_insert_own') THEN
    CREATE POLICY via_results_insert_own ON via_results FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- MBTI Results policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mbti_results' AND policyname = 'mbti_results_select_own') THEN
    CREATE POLICY mbti_results_select_own ON mbti_results FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mbti_results' AND policyname = 'mbti_results_insert_own') THEN
    CREATE POLICY mbti_results_insert_own ON mbti_results FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- SISRI24 Results policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sisri24_results' AND policyname = 'sisri24_results_select_own') THEN
    CREATE POLICY sisri24_results_select_own ON sisri24_results FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sisri24_results' AND policyname = 'sisri24_results_insert_own') THEN
    CREATE POLICY sisri24_results_insert_own ON sisri24_results FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- BFI2 Test History policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bfi2_test_history' AND policyname = 'bfi2_history_select_own') THEN
    CREATE POLICY bfi2_history_select_own ON bfi2_test_history FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bfi2_test_history' AND policyname = 'bfi2_history_insert_own') THEN
    CREATE POLICY bfi2_history_insert_own ON bfi2_test_history FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- MISO Analysis Logs policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'miso_analysis_logs' AND policyname = 'miso_logs_select_own') THEN
    CREATE POLICY miso_logs_select_own ON miso_analysis_logs FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'miso_analysis_logs' AND policyname = 'miso_logs_insert_own') THEN
    CREATE POLICY miso_logs_insert_own ON miso_analysis_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Prediction Feedback policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prediction_feedback' AND policyname = 'prediction_select_own') THEN
    CREATE POLICY prediction_select_own ON prediction_feedback FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'prediction_feedback' AND policyname = 'prediction_insert_own') THEN
    CREATE POLICY prediction_insert_own ON prediction_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;


-- 9. REFRESH SCHEMA CACHE
-- =====================================================
NOTIFY pgrst, 'reload schema';


-- 10. VERIFICATION
-- =====================================================
SELECT 
  'personality_profiles' as table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'personality_profiles'
  AND column_name IN ('via_signature_strengths', 'via_top_virtue', 'sisri24_scores', 'bfi2_score', 'big5_openness_raw')
ORDER BY column_name;
