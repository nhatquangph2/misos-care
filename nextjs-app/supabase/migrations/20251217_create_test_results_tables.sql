-- =====================================================
-- CRITICAL FIX: Create Missing Test Results Tables
-- These tables are required for MISO V3 system and profile features
-- =====================================================

-- =====================================================
-- 1. BFI-2 (Big Five Inventory-2) Results Table
-- =====================================================
CREATE TABLE IF NOT EXISTS bfi2_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Raw responses (60 items, 1-5 scale)
  responses JSONB NOT NULL,

  -- Calculated score object with domains, facets, t-scores, percentiles, raw_scores
  score JSONB NOT NULL,

  -- Metadata
  test_version TEXT DEFAULT '1.0',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bfi2_user_id ON bfi2_results(user_id);
CREATE INDEX IF NOT EXISTS idx_bfi2_completed_at ON bfi2_results(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_bfi2_user_completed ON bfi2_results(user_id, completed_at DESC);

-- RLS Policies
ALTER TABLE bfi2_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own BFI-2 results"
  ON bfi2_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own BFI-2 results"
  ON bfi2_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 2. DASS-21 (Depression Anxiety Stress Scales) Results Table
-- =====================================================
CREATE TABLE IF NOT EXISTS dass21_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Raw responses (21 items, 0-3 scale)
  responses JSONB NOT NULL,

  -- Calculated score object with individual scores and severity
  score JSONB NOT NULL,

  -- Quick access fields
  depression INTEGER NOT NULL,
  anxiety INTEGER NOT NULL,
  stress INTEGER NOT NULL,

  -- Crisis detection
  crisis_flag BOOLEAN DEFAULT FALSE,
  crisis_indicators JSONB,

  -- Metadata
  test_version TEXT DEFAULT '1.0',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dass21_user_id ON dass21_results(user_id);
CREATE INDEX IF NOT EXISTS idx_dass21_completed_at ON dass21_results(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_dass21_user_completed ON dass21_results(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_dass21_crisis ON dass21_results(crisis_flag) WHERE crisis_flag = TRUE;

-- RLS Policies
ALTER TABLE dass21_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own DASS-21 results"
  ON dass21_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own DASS-21 results"
  ON dass21_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 3. VIA Character Strengths Results Table
-- =====================================================
CREATE TABLE IF NOT EXISTS via_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Raw responses (24 items per strength, 1-5 scale)
  responses JSONB NOT NULL,

  -- Calculated score object with all 24 character strengths
  score JSONB NOT NULL,

  -- Ranked strengths (for quick access)
  ranked_strengths JSONB NOT NULL,

  -- Metadata
  test_version TEXT DEFAULT '1.0',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_via_user_id ON via_results(user_id);
CREATE INDEX IF NOT EXISTS idx_via_completed_at ON via_results(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_via_user_completed ON via_results(user_id, completed_at DESC);

-- RLS Policies
ALTER TABLE via_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own VIA results"
  ON via_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own VIA results"
  ON via_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 4. MBTI Results Table
-- =====================================================
CREATE TABLE IF NOT EXISTS mbti_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Raw responses (60 items)
  responses JSONB NOT NULL,

  -- Calculated result object with type, scores, preferences
  result JSONB NOT NULL,

  -- Quick access field
  mbti_type TEXT NOT NULL CHECK (mbti_type IN (
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  )),

  -- Metadata
  test_version TEXT DEFAULT '1.0',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mbti_user_id ON mbti_results(user_id);
CREATE INDEX IF NOT EXISTS idx_mbti_completed_at ON mbti_results(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_mbti_user_completed ON mbti_results(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_mbti_type ON mbti_results(mbti_type);

-- RLS Policies
ALTER TABLE mbti_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own MBTI results"
  ON mbti_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MBTI results"
  ON mbti_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 5. SISRI-24 (Multiple Intelligences) Results Table
-- =====================================================
CREATE TABLE IF NOT EXISTS sisri24_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Raw responses (24 items, 1-5 scale)
  responses JSONB NOT NULL,

  -- Calculated scores for 8 intelligences
  scores JSONB NOT NULL,

  -- Metadata
  test_version TEXT DEFAULT '1.0',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sisri24_user_id ON sisri24_results(user_id);
CREATE INDEX IF NOT EXISTS idx_sisri24_completed_at ON sisri24_results(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_sisri24_user_completed ON sisri24_results(user_id, completed_at DESC);

-- RLS Policies
ALTER TABLE sisri24_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own SISRI-24 results"
  ON sisri24_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SISRI-24 results"
  ON sisri24_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- MIGRATION: Move existing data from personality_profiles
-- =====================================================

-- Note: This will attempt to migrate Big5 data if it exists in the old format
-- However, we cannot recreate raw scores from percentiles, so this is informational only
-- Users will need to retake tests to get proper raw data for MISO V3

DO $$
BEGIN
  -- Log migration status
  RAISE NOTICE 'Test results tables created successfully';
  RAISE NOTICE 'Note: Users must retake tests to populate these tables with raw data';
  RAISE NOTICE 'MISO V3 system requires raw test responses, not just calculated scores';
END $$;

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE bfi2_results IS 'Stores BFI-2 (Big Five Inventory-2) test results with raw responses and calculated scores';
COMMENT ON TABLE dass21_results IS 'Stores DASS-21 test results for depression, anxiety, and stress assessment';
COMMENT ON TABLE via_results IS 'Stores VIA Character Strengths test results';
COMMENT ON TABLE mbti_results IS 'Stores MBTI personality type assessment results';
COMMENT ON TABLE sisri24_results IS 'Stores SISRI-24 Multiple Intelligences test results';

COMMENT ON COLUMN bfi2_results.score IS 'Complete score object including domains, facets, t-scores, percentiles, and raw_scores for MISO V3';
COMMENT ON COLUMN dass21_results.score IS 'Complete score object with D/A/S subscales and severity levels';
COMMENT ON COLUMN via_results.score IS 'Complete score object with all 24 character strengths and raw_scores';
