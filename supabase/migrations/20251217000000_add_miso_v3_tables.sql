-- MISO V3 Database Schema Migration
-- Created: 2025-12-17
-- Purpose: Add tables for MISO V3 meta-analysis engine

-- =====================================================
-- TABLE: miso_analysis_logs
-- Purpose: Store snapshot analysis results over time
-- =====================================================

CREATE TABLE IF NOT EXISTS miso_analysis_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Full analysis result (JSON)
  analysis_result JSONB NOT NULL,

  -- Key metrics for querying
  bvs DECIMAL(10, 3), -- Base Vulnerability Score
  rcs DECIMAL(10, 3), -- Resilience Capacity Score
  profile_id TEXT, -- B0, B1, B2, etc.
  risk_level TEXT, -- CRITICAL, HIGH, MEDIUM, LOW, VERY_LOW
  completeness_level TEXT, -- NONE, MINIMAL, BASIC, STANDARD, COMPREHENSIVE, COMPLETE

  -- Raw scores for trend analysis
  dass21_depression INTEGER,
  dass21_anxiety INTEGER,
  dass21_stress INTEGER,

  big5_neuroticism INTEGER,
  big5_extraversion INTEGER,
  big5_openness INTEGER,
  big5_agreeableness INTEGER,
  big5_conscientiousness INTEGER,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes
  CONSTRAINT valid_profile_id CHECK (profile_id IN ('B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8')),
  CONSTRAINT valid_risk_level CHECK (risk_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'VERY_LOW')),
  CONSTRAINT valid_completeness CHECK (completeness_level IN ('NONE', 'MINIMAL', 'BASIC', 'STANDARD', 'COMPREHENSIVE', 'COMPLETE'))
);

-- Create indexes for common queries
CREATE INDEX idx_miso_logs_user_id ON miso_analysis_logs(user_id);
CREATE INDEX idx_miso_logs_created_at ON miso_analysis_logs(created_at DESC);
CREATE INDEX idx_miso_logs_profile_risk ON miso_analysis_logs(profile_id, risk_level);
CREATE INDEX idx_miso_logs_user_created ON miso_analysis_logs(user_id, created_at DESC);

-- =====================================================
-- TABLE: prediction_feedback
-- Purpose: Store prediction vs actual for calibration
-- =====================================================

CREATE TABLE IF NOT EXISTS prediction_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Input scores
  bvs DECIMAL(10, 3) NOT NULL,
  rcs DECIMAL(10, 3) NOT NULL,

  -- Predictions
  predicted_dass_d DECIMAL(10, 2) NOT NULL,
  predicted_dass_a DECIMAL(10, 2) NOT NULL,
  predicted_dass_s DECIMAL(10, 2) NOT NULL,

  -- Actual values
  actual_dass_d INTEGER NOT NULL,
  actual_dass_a INTEGER NOT NULL,
  actual_dass_s INTEGER NOT NULL,

  -- Deltas (actual - predicted)
  delta_d DECIMAL(10, 2) NOT NULL,
  delta_a DECIMAL(10, 2) NOT NULL,
  delta_s DECIMAL(10, 2) NOT NULL,

  -- Mean Absolute Error
  mae DECIMAL(10, 2) NOT NULL,

  -- Segmentation (for population-specific calibration)
  segment TEXT DEFAULT 'vn',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_dass_range_d CHECK (actual_dass_d >= 0 AND actual_dass_d <= 42),
  CONSTRAINT valid_dass_range_a CHECK (actual_dass_a >= 0 AND actual_dass_a <= 42),
  CONSTRAINT valid_dass_range_s CHECK (actual_dass_s >= 0 AND actual_dass_s <= 42)
);

-- Create indexes
CREATE INDEX idx_prediction_user_id ON prediction_feedback(user_id);
CREATE INDEX idx_prediction_created_at ON prediction_feedback(created_at DESC);
CREATE INDEX idx_prediction_segment ON prediction_feedback(segment);
CREATE INDEX idx_prediction_mae ON prediction_feedback(mae);

-- =====================================================
-- TABLE: calibration_coefficients
-- Purpose: Store calibrated coefficients per segment
-- =====================================================

CREATE TABLE IF NOT EXISTS calibration_coefficients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Segment identifier
  segment TEXT NOT NULL,

  -- Coefficients for prediction formula
  -- Predicted_DASS = alpha + (beta1 × BVS) - (beta2 × RCS)
  alpha DECIMAL(10, 3) NOT NULL,
  beta1 DECIMAL(10, 3) NOT NULL,
  beta2 DECIMAL(10, 3) NOT NULL,

  -- Per-scale coefficients (optional, for advanced calibration)
  coefficients_per_scale JSONB,

  -- Calibration metrics
  sample_size INTEGER NOT NULL,
  mae_improvement_pct DECIMAL(10, 2), -- Improvement over previous

  -- Status
  active BOOLEAN DEFAULT TRUE,

  -- Metadata
  calibrated_at TIMESTAMPTZ DEFAULT NOW(),
  calibration_trigger TEXT, -- 'OPTIMAL_SAMPLES', 'TIME_BASED', 'MANUAL'

  CONSTRAINT unique_active_segment UNIQUE (segment, active) WHERE active = TRUE
);

-- Create indexes
CREATE INDEX idx_calibration_segment_active ON calibration_coefficients(segment, active);
CREATE INDEX idx_calibration_created ON calibration_coefficients(calibrated_at DESC);

-- =====================================================
-- TABLE: bfi2_results (extending existing or creating)
-- Purpose: Store Big Five Inventory-2 test results
-- =====================================================

CREATE TABLE IF NOT EXISTS bfi2_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Raw domain scores
  neuroticism INTEGER NOT NULL,
  extraversion INTEGER NOT NULL,
  openness INTEGER NOT NULL,
  agreeableness INTEGER NOT NULL,
  conscientiousness INTEGER NOT NULL,

  -- Facet scores (optional, if using BFI-2)
  facet_scores JSONB,

  -- Raw responses
  raw_responses JSONB NOT NULL,

  -- Test metadata
  test_version TEXT DEFAULT 'BFI-44',
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_bfi_range_n CHECK (neuroticism >= 8 AND neuroticism <= 40),
  CONSTRAINT valid_bfi_range_e CHECK (extraversion >= 8 AND extraversion <= 40),
  CONSTRAINT valid_bfi_range_o CHECK (openness >= 10 AND openness <= 50),
  CONSTRAINT valid_bfi_range_a CHECK (agreeableness >= 9 AND agreeableness <= 45),
  CONSTRAINT valid_bfi_range_c CHECK (conscientiousness >= 9 AND conscientiousness <= 45)
);

CREATE INDEX idx_bfi2_user_id ON bfi2_results(user_id);
CREATE INDEX idx_bfi2_completed_at ON bfi2_results(completed_at DESC);
CREATE INDEX idx_bfi2_user_completed ON bfi2_results(user_id, completed_at DESC);

-- =====================================================
-- TABLE: dass21_results (extending existing or creating)
-- Purpose: Store DASS-21 test results with temporal tracking
-- =====================================================

CREATE TABLE IF NOT EXISTS dass21_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Raw subscale scores
  depression INTEGER NOT NULL,
  anxiety INTEGER NOT NULL,
  stress INTEGER NOT NULL,

  -- Severity levels
  depression_severity TEXT NOT NULL,
  anxiety_severity TEXT NOT NULL,
  stress_severity TEXT NOT NULL,

  -- Raw responses
  raw_responses JSONB NOT NULL,

  -- Crisis detection
  crisis_flag BOOLEAN DEFAULT FALSE,
  crisis_reason TEXT,

  -- Test metadata
  test_version TEXT DEFAULT 'DASS-21',
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_dass_range_d CHECK (depression >= 0 AND depression <= 42),
  CONSTRAINT valid_dass_range_a CHECK (anxiety >= 0 AND anxiety <= 42),
  CONSTRAINT valid_dass_range_s CHECK (stress >= 0 AND stress <= 42)
);

CREATE INDEX idx_dass21_user_id ON dass21_results(user_id);
CREATE INDEX idx_dass21_completed_at ON dass21_results(completed_at DESC);
CREATE INDEX idx_dass21_user_completed ON dass21_results(user_id, completed_at DESC);
CREATE INDEX idx_dass21_crisis ON dass21_results(crisis_flag) WHERE crisis_flag = TRUE;

-- =====================================================
-- TABLE: via_results (VIA Character Strengths)
-- Purpose: Store VIA-IS test results
-- =====================================================

CREATE TABLE IF NOT EXISTS via_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Raw strength scores (1-5 Likert scale)
  hope DECIMAL(3, 2),
  zest DECIMAL(3, 2),
  self_regulation DECIMAL(3, 2),
  gratitude DECIMAL(3, 2),
  spirituality DECIMAL(3, 2),
  forgiveness DECIMAL(3, 2),
  prudence DECIMAL(3, 2),
  love DECIMAL(3, 2),
  kindness DECIMAL(3, 2),
  perspective DECIMAL(3, 2),
  curiosity DECIMAL(3, 2),
  creativity DECIMAL(3, 2),
  perseverance DECIMAL(3, 2),

  -- Additional strengths (if full VIA-IS 24 strengths)
  all_strengths JSONB,

  -- Top 5 signature strengths
  signature_strengths TEXT[],

  -- Raw responses
  raw_responses JSONB NOT NULL,

  -- Test metadata
  test_version TEXT DEFAULT 'VIA-IS-24',
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_via_range CHECK (
    (hope IS NULL OR (hope >= 1 AND hope <= 5)) AND
    (zest IS NULL OR (zest >= 1 AND zest <= 5)) AND
    (self_regulation IS NULL OR (self_regulation >= 1 AND self_regulation <= 5))
  )
);

CREATE INDEX idx_via_user_id ON via_results(user_id);
CREATE INDEX idx_via_completed_at ON via_results(completed_at DESC);
CREATE INDEX idx_via_user_completed ON via_results(user_id, completed_at DESC);

-- =====================================================
-- FUNCTIONS: Helper functions for temporal analysis
-- =====================================================

-- Function to get latest test results for a user
CREATE OR REPLACE FUNCTION get_latest_miso_data(p_user_id UUID)
RETURNS TABLE (
  latest_dass21 UUID,
  latest_bfi2 UUID,
  latest_via UUID,
  mbti_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT id FROM dass21_results WHERE user_id = p_user_id ORDER BY completed_at DESC LIMIT 1),
    (SELECT id FROM bfi2_results WHERE user_id = p_user_id ORDER BY completed_at DESC LIMIT 1),
    (SELECT id FROM via_results WHERE user_id = p_user_id ORDER BY completed_at DESC LIMIT 1),
    (SELECT mbti_type FROM personality_profiles WHERE user_id = p_user_id LIMIT 1);
END;
$$ LANGUAGE plpgsql;

-- Function to get test history for temporal analysis
CREATE OR REPLACE FUNCTION get_test_history(
  p_user_id UUID,
  p_test_type TEXT,
  p_days_back INTEGER DEFAULT 90
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  CASE p_test_type
    WHEN 'dass21' THEN
      SELECT jsonb_agg(
        jsonb_build_object(
          'timestamp', completed_at,
          'raw_scores', jsonb_build_object(
            'D', depression,
            'A', anxiety,
            'S', stress
          )
        ) ORDER BY completed_at DESC
      ) INTO result
      FROM dass21_results
      WHERE user_id = p_user_id
        AND completed_at >= NOW() - (p_days_back || ' days')::INTERVAL;

    WHEN 'big5' THEN
      SELECT jsonb_agg(
        jsonb_build_object(
          'timestamp', completed_at,
          'raw_scores', jsonb_build_object(
            'N', neuroticism,
            'E', extraversion,
            'O', openness,
            'A', agreeableness,
            'C', conscientiousness
          )
        ) ORDER BY completed_at DESC
      ) INTO result
      FROM bfi2_results
      WHERE user_id = p_user_id
        AND completed_at >= NOW() - (p_days_back || ' days')::INTERVAL;
  END CASE;

  RETURN COALESCE(result, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE miso_analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE calibration_coefficients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bfi2_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE dass21_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE via_results ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own miso logs"
  ON miso_analysis_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own miso logs"
  ON miso_analysis_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own predictions"
  ON prediction_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions"
  ON prediction_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view active calibrations"
  ON calibration_coefficients FOR SELECT
  USING (active = TRUE);

CREATE POLICY "Users can view own BFI2 results"
  ON bfi2_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own BFI2 results"
  ON bfi2_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own DASS21 results"
  ON dass21_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own DASS21 results"
  ON dass21_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own VIA results"
  ON via_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own VIA results"
  ON via_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- DEFAULT CALIBRATION COEFFICIENTS
-- =====================================================

-- Insert default coefficients (from research)
INSERT INTO calibration_coefficients (
  segment,
  alpha,
  beta1,
  beta2,
  sample_size,
  active,
  calibration_trigger
) VALUES (
  'default',
  10.0,  -- α
  5.0,   -- β1 (BVS weight)
  3.0,   -- β2 (RCS weight)
  0,
  TRUE,
  'INITIAL'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE miso_analysis_logs IS 'Stores complete MISO V3 analysis snapshots for temporal tracking';
COMMENT ON TABLE prediction_feedback IS 'Stores predicted vs actual DASS scores for calibration engine';
COMMENT ON TABLE calibration_coefficients IS 'Stores calibrated prediction coefficients per population segment';
COMMENT ON TABLE bfi2_results IS 'Stores Big Five Inventory-2 (BFI-44) test results';
COMMENT ON TABLE dass21_results IS 'Stores Depression Anxiety Stress Scales (DASS-21) test results';
COMMENT ON TABLE via_results IS 'Stores VIA Character Strengths survey results';

COMMENT ON COLUMN miso_analysis_logs.bvs IS 'Base Vulnerability Score: Composite of N, C, E';
COMMENT ON COLUMN miso_analysis_logs.rcs IS 'Resilience Capacity Score: Composite of Hope, Zest, Self-Regulation, Gratitude';
COMMENT ON COLUMN miso_analysis_logs.profile_id IS 'Big Five Profile ID (B1-B8): Healthy Neurotic, Vulnerable, etc.';

COMMENT ON FUNCTION get_test_history(UUID, TEXT, INTEGER) IS 'Retrieves test history for temporal analysis with configurable lookback period';
