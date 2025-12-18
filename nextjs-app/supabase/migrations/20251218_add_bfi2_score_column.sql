-- Supplementary Migration: Add bfi2_score JSONB column
-- Date: 2025-12-18
-- Purpose: Add missing bfi2_score column (if first migration didn't create it)

-- Add bfi2_score column if not exists
ALTER TABLE personality_profiles
  ADD COLUMN IF NOT EXISTS bfi2_score JSONB;

-- Add comment
COMMENT ON COLUMN personality_profiles.bfi2_score IS
'Complete BFI-2 score object including domains, facets, T-scores, and percentiles.
Format: {
  "domains": {"E": 3.2, "A": 3.8, "C": 3.5, "N": 2.8, "O": 3.4},
  "facets": {"Soc": 3.1, "Ass": 3.0, ...},
  "tScores": {"domains": {"E": 50, "A": 55, ...}, "facets": {...}},
  "percentiles": {"domains": {"E": 50, "A": 60, ...}}
}';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'personality_profiles'
  AND column_name = 'bfi2_score';
