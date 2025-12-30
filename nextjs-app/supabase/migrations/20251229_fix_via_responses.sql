-- =====================================================
-- MIGRATION: Fix VIA responses field
-- Date: 2025-12-29
-- Issue: VIA responses is empty {} for old records
-- Solution: Mark as backfilled since original raw data is lost
-- =====================================================

-- Update existing VIA records to indicate responses were not captured
-- We cannot recover the original raw responses, but we can mark the record
UPDATE via_results
SET responses = jsonb_build_object(
  '_backfilled', true,
  '_note', 'Original responses not captured. Scores derived from all_strengths data.',
  '_backfill_date', NOW()::TEXT
)
WHERE responses IS NULL 
   OR responses = '{}'::JSONB;

-- Verify the update
-- SELECT id, responses FROM via_results WHERE user_id = '76279f0a-fd21-40ca-99a2-6aa116c7fb74';

COMMENT ON COLUMN via_results.responses IS 'Raw question responses. May contain _backfilled flag for legacy records.';
