-- Migration: Normalize DASS-21 scores in mental_health_records
-- Date: 2025-12-18
-- Purpose: Convert legacy DASS-21 data from raw (0-21) to normalized (0-42)
--          and change Vietnamese keys to English keys

-- =====================================================
-- DASS-21 DATA NORMALIZATION MIGRATION
-- =====================================================

DO $$
DECLARE
  record_row RECORD;
  old_subscales JSONB;
  new_subscales JSONB;
  old_total INTEGER;
  new_total INTEGER;
  depression_raw NUMERIC;
  anxiety_raw NUMERIC;
  stress_raw NUMERIC;
  depression_normalized INTEGER;
  anxiety_normalized INTEGER;
  stress_normalized INTEGER;
  updated_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'Starting DASS-21 data normalization migration...';

  -- Loop through all DASS21 records
  FOR record_row IN
    SELECT id, total_score, subscale_scores
    FROM mental_health_records
    WHERE test_type = 'DASS21'
      AND subscale_scores IS NOT NULL
  LOOP
    old_subscales := record_row.subscale_scores;
    old_total := record_row.total_score;
    new_subscales := '{}'::jsonb;

    -- Check if this record uses OLD format (Vietnamese keys)
    IF old_subscales ? 'Trầm cảm' OR old_subscales ? 'Lo âu' THEN
      RAISE NOTICE 'Converting record %: OLD format detected', record_row.id;

      -- Extract raw scores (0-21) from Vietnamese keys
      depression_raw := COALESCE((old_subscales->>'Trầm cảm')::numeric, 0);
      anxiety_raw := COALESCE((old_subscales->>'Lo âu')::numeric, 0);
      stress_raw := COALESCE((old_subscales->>'Stress')::numeric, 0);

      -- Convert to normalized (multiply by 2)
      depression_normalized := (depression_raw * 2)::integer;
      anxiety_normalized := (anxiety_raw * 2)::integer;
      stress_normalized := (stress_raw * 2)::integer;

      -- Build new JSONB with English keys and normalized scores
      new_subscales := jsonb_build_object(
        'depression', depression_normalized,
        'anxiety', anxiety_normalized,
        'stress', stress_normalized
      );

      -- Calculate new total score (sum of normalized)
      new_total := depression_normalized + anxiety_normalized + stress_normalized;

      -- Update the record
      UPDATE mental_health_records
      SET
        subscale_scores = new_subscales,
        total_score = new_total
      WHERE id = record_row.id;

      updated_count := updated_count + 1;

      RAISE NOTICE 'Record %: Converted from raw (% +  % + % = %) to normalized (% + % + % = %)',
        record_row.id,
        depression_raw, anxiety_raw, stress_raw, old_total,
        depression_normalized, anxiety_normalized, stress_normalized, new_total;

    -- Check if this record already uses NEW format (English keys)
    ELSIF old_subscales ? 'depression' THEN
      -- Check if scores are in raw range (0-21) - likely needs normalization
      depression_raw := COALESCE((old_subscales->>'depression')::numeric, 0);
      anxiety_raw := COALESCE((old_subscales->>'anxiety')::numeric, 0);
      stress_raw := COALESCE((old_subscales->>'stress')::numeric, 0);

      -- If all scores are ≤ 21, they're likely raw scores that need normalization
      IF depression_raw <= 21 AND anxiety_raw <= 21 AND stress_raw <= 21 THEN
        RAISE NOTICE 'Converting record %: English keys but RAW scores detected', record_row.id;

        depression_normalized := (depression_raw * 2)::integer;
        anxiety_normalized := (anxiety_raw * 2)::integer;
        stress_normalized := (stress_raw * 2)::integer;

        new_subscales := jsonb_build_object(
          'depression', depression_normalized,
          'anxiety', anxiety_normalized,
          'stress', stress_normalized
        );

        new_total := depression_normalized + anxiety_normalized + stress_normalized;

        UPDATE mental_health_records
        SET
          subscale_scores = new_subscales,
          total_score = new_total
        WHERE id = record_row.id;

        updated_count := updated_count + 1;

        RAISE NOTICE 'Record %: Converted from raw (% + % + % = %) to normalized (% + % + % = %)',
          record_row.id,
          depression_raw, anxiety_raw, stress_raw, old_total,
          depression_normalized, anxiety_normalized, stress_normalized, new_total;
      ELSE
        RAISE NOTICE 'Record %: Already in NEW format (normalized), skipping', record_row.id;
      END IF;

    ELSE
      RAISE NOTICE 'Record %: Unknown format, skipping', record_row.id;
    END IF;

  END LOOP;

  RAISE NOTICE 'Migration completed! Updated % records', updated_count;
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Show sample of converted records
SELECT
  id,
  test_type,
  total_score,
  subscale_scores,
  completed_at
FROM mental_health_records
WHERE test_type = 'DASS21'
ORDER BY completed_at DESC
LIMIT 5;

-- Show statistics
SELECT
  COUNT(*) as total_dass21_records,
  AVG(total_score) as avg_total_score,
  MIN(total_score) as min_total_score,
  MAX(total_score) as max_total_score
FROM mental_health_records
WHERE test_type = 'DASS21';

COMMENT ON TABLE mental_health_records IS
'Mental health test results.
DASS-21 subscale_scores format: {"depression": 0-42, "anxiety": 0-42, "stress": 0-42} (NORMALIZED scores).
total_score for DASS-21 = sum of normalized scores (0-126).
Updated: 2025-12-18 - Migrated to normalized scores with English keys.';
