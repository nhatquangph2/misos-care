-- Migration: Add BIG-5 Raw Scores to personality_profiles
-- Date: 2025-12-18
-- Purpose: Store raw scores (1-5 scale) alongside percentage for data integrity
--          Fix MISO V3 integration and enable proper analysis

-- =====================================================
-- ADD RAW SCORE COLUMNS TO personality_profiles
-- =====================================================

-- Add raw score columns (DECIMAL for precision)
ALTER TABLE personality_profiles
  ADD COLUMN IF NOT EXISTS big5_openness_raw DECIMAL(3,2) CHECK (big5_openness_raw BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS big5_conscientiousness_raw DECIMAL(3,2) CHECK (big5_conscientiousness_raw BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS big5_extraversion_raw DECIMAL(3,2) CHECK (big5_extraversion_raw BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS big5_agreeableness_raw DECIMAL(3,2) CHECK (big5_agreeableness_raw BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS big5_neuroticism_raw DECIMAL(3,2) CHECK (big5_neuroticism_raw BETWEEN 1 AND 5);

-- Add full BFI-2 score object (JSONB) for complete data retention
ALTER TABLE personality_profiles
  ADD COLUMN IF NOT EXISTS bfi2_score JSONB;

COMMENT ON COLUMN personality_profiles.big5_openness_raw IS
'Raw BFI-2 Openness score (1-5 scale). Mean of 12 items after reverse scoring.';

COMMENT ON COLUMN personality_profiles.big5_conscientiousness_raw IS
'Raw BFI-2 Conscientiousness score (1-5 scale). Mean of 12 items after reverse scoring.';

COMMENT ON COLUMN personality_profiles.big5_extraversion_raw IS
'Raw BFI-2 Extraversion score (1-5 scale). Mean of 12 items after reverse scoring.';

COMMENT ON COLUMN personality_profiles.big5_agreeableness_raw IS
'Raw BFI-2 Agreeableness score (1-5 scale). Mean of 12 items after reverse scoring.';

COMMENT ON COLUMN personality_profiles.big5_neuroticism_raw IS
'Raw BFI-2 Negative Emotionality score (1-5 scale). Mean of 12 items after reverse scoring.';

COMMENT ON COLUMN personality_profiles.bfi2_score IS
'Complete BFI-2 score object including domains, facets, T-scores, and percentiles.
Format: {
  "domains": {"E": 3.2, "A": 3.8, "C": 3.5, "N": 2.8, "O": 3.4},
  "facets": {"Soc": 3.1, "Ass": 3.0, ...},
  "tScores": {"domains": {"E": 50, "A": 55, ...}, "facets": {...}},
  "percentiles": {"domains": {"E": 50, "A": 60, ...}}
}';

-- =====================================================
-- MIGRATE EXISTING DATA (Best Effort Recovery)
-- =====================================================

DO $$
DECLARE
  record_row RECORD;
  old_percentage DECIMAL;
  estimated_raw DECIMAL;
  updated_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'Starting BIG-5 raw score recovery migration...';

  -- Loop through all profiles with Big-5 percentage data
  FOR record_row IN
    SELECT id, user_id,
           big5_openness, big5_conscientiousness, big5_extraversion,
           big5_agreeableness, big5_neuroticism
    FROM personality_profiles
    WHERE big5_openness IS NOT NULL
      AND big5_openness_raw IS NULL  -- Only migrate records without raw scores
  LOOP
    RAISE NOTICE 'Converting profile %: User %', record_row.id, record_row.user_id;

    -- Reverse the conversion formula: percentage = ((raw - 1) / 4) * 100
    -- Therefore: raw = (percentage / 100) * 4 + 1

    UPDATE personality_profiles
    SET
      big5_openness_raw = ROUND(((big5_openness / 100.0) * 4 + 1)::numeric, 2),
      big5_conscientiousness_raw = ROUND(((big5_conscientiousness / 100.0) * 4 + 1)::numeric, 2),
      big5_extraversion_raw = ROUND(((big5_extraversion / 100.0) * 4 + 1)::numeric, 2),
      big5_agreeableness_raw = ROUND(((big5_agreeableness / 100.0) * 4 + 1)::numeric, 2),
      big5_neuroticism_raw = ROUND(((big5_neuroticism / 100.0) * 4 + 1)::numeric, 2)
    WHERE id = record_row.id;

    updated_count := updated_count + 1;

    RAISE NOTICE 'Profile %: Estimated raw scores from percentages (O: %, C: %, E: %, A: %, N: %)',
      record_row.id,
      ROUND(((record_row.big5_openness / 100.0) * 4 + 1)::numeric, 2),
      ROUND(((record_row.big5_conscientiousness / 100.0) * 4 + 1)::numeric, 2),
      ROUND(((record_row.big5_extraversion / 100.0) * 4 + 1)::numeric, 2),
      ROUND(((record_row.big5_agreeableness / 100.0) * 4 + 1)::numeric, 2),
      ROUND(((record_row.big5_neuroticism / 100.0) * 4 + 1)::numeric, 2);
  END LOOP;

  RAISE NOTICE 'Migration completed! Updated % profiles with estimated raw scores', updated_count;
  RAISE NOTICE 'NOTE: These are ESTIMATES reverse-calculated from percentages.';
  RAISE NOTICE 'Users should retake the test for accurate raw scores.';
END $$;

-- =====================================================
-- CREATE TEST HISTORY TABLE
-- =====================================================

-- This replaces the non-existent bfi2_results table
CREATE TABLE IF NOT EXISTS bfi2_test_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Complete score object
  score JSONB NOT NULL,
  -- Convenience columns for querying (denormalized from score JSONB)
  raw_scores JSONB NOT NULL, -- {N: 2.8, E: 3.2, O: 3.4, A: 3.8, C: 3.5}

  -- Test metadata
  completion_time_seconds INTEGER, -- How long it took to complete
  quality_warnings TEXT[], -- Data quality issues detected

  -- Raw responses (for audit/research)
  raw_responses JSONB, -- [{itemId: 1, value: 3}, ...]

  -- Timestamps
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for performance (separate from table definition)
CREATE INDEX IF NOT EXISTS idx_bfi2_user_date
ON bfi2_test_history(user_id, completed_at DESC);

COMMENT ON TABLE bfi2_test_history IS
'Complete history of BFI-2 (Big Five) test attempts.
Each row represents one complete test session.
The most recent test is used for personality_profiles.
This enables:
- MISO V3 temporal analysis (track changes over time)
- Data recovery and re-analysis
- Research and quality control';

COMMENT ON COLUMN bfi2_test_history.score IS
'Complete BFI2Score object from calculateBFI2Score().
Includes domains, facets, tScores, percentiles.';

COMMENT ON COLUMN bfi2_test_history.raw_scores IS
'Raw domain scores (1-5 scale) for easy querying: {N, E, O, A, C}.
Denormalized from score.domains for MISO V3 integration.';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Show sample of migrated data
SELECT
  id,
  user_id,
  big5_openness AS pct_O,
  big5_openness_raw AS raw_O,
  big5_neuroticism AS pct_N,
  big5_neuroticism_raw AS raw_N,
  last_updated
FROM personality_profiles
WHERE big5_openness IS NOT NULL
ORDER BY last_updated DESC
LIMIT 5;

-- Show statistics
SELECT
  COUNT(*) as total_profiles,
  COUNT(big5_openness) as with_percentage,
  COUNT(big5_openness_raw) as with_raw,
  AVG(big5_openness_raw) as avg_openness_raw,
  AVG(big5_neuroticism_raw) as avg_neuroticism_raw
FROM personality_profiles;

-- Verify new table
SELECT COUNT(*) as test_history_count
FROM bfi2_test_history;
