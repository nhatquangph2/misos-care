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

  -- Constraints
  CONSTRAINT valid_profile_id CHECK (profile_id IN ('B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8')),
  CONSTRAINT valid_risk_level CHECK (risk_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'VERY_LOW')),
  CONSTRAINT valid_completeness CHECK (completeness_level IN ('NONE', 'MINIMAL', 'BASIC', 'STANDARD', 'COMPREHENSIVE', 'COMPLETE'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_miso_logs_user_id ON miso_analysis_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_miso_logs_created_at ON miso_analysis_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_miso_logs_user_created ON miso_analysis_logs(user_id, created_at DESC);

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

  -- Segmentation
  segment TEXT DEFAULT 'vn',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_dass_range_d CHECK (actual_dass_d >= 0 AND actual_dass_d <= 42),
  CONSTRAINT valid_dass_range_a CHECK (actual_dass_a >= 0 AND actual_dass_a <= 42),
  CONSTRAINT valid_dass_range_s CHECK (actual_dass_s >= 0 AND actual_dass_s <= 42)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_prediction_user_id ON prediction_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_prediction_created_at ON prediction_feedback(created_at DESC);

-- Enable RLS
ALTER TABLE miso_analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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
