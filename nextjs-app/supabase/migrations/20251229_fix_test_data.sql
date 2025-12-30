-- =====================================================
-- MIGRATION: Fix Test Data Issues
-- Date: 2025-12-29
-- Issues:
--   1. DASS-21 Record 4: has raw_responses but no subscale_scores
--   2. VIA: responses empty, scores all 0 (backfill from all_strengths)
-- NOTE: bfi2_test_history empty is a CODE issue, not data issue
-- =====================================================

-- =====================================================
-- 1. FIX DASS-21 RECORD WITH MISSING SUBSCALE_SCORES
-- Calculate subscale_scores from raw_responses
-- =====================================================

-- First, let's identify the record and calculate scores
-- DASS-21 question mapping:
-- Depression: 3, 5, 10, 13, 16, 17, 21
-- Anxiety: 2, 4, 7, 9, 15, 19, 20
-- Stress: 1, 6, 8, 11, 12, 14, 18

-- For record id: 289e9997-3958-43c8-94e8-421e8f0f646e
-- We need to calculate from raw_responses and multiply by 2 for normalized score

DO $$
DECLARE
  record_id UUID := '289e9997-3958-43c8-94e8-421e8f0f646e';
  raw_responses JSONB;
  depression_raw INTEGER := 0;
  anxiety_raw INTEGER := 0;
  stress_raw INTEGER := 0;
  depression_questions INTEGER[] := ARRAY[3, 5, 10, 13, 16, 17, 21];
  anxiety_questions INTEGER[] := ARRAY[2, 4, 7, 9, 15, 19, 20];
  stress_questions INTEGER[] := ARRAY[1, 6, 8, 11, 12, 14, 18];
  response JSONB;
  question_id INTEGER;
  value INTEGER;
BEGIN
  -- Get raw responses
  SELECT mhr.raw_responses INTO raw_responses
  FROM mental_health_records mhr
  WHERE mhr.id = record_id;
  
  IF raw_responses IS NOT NULL THEN
    -- Calculate scores for each subscale
    FOR i IN 0..json_array_length(raw_responses::json)-1 LOOP
      response := raw_responses->i;
      question_id := (response->>'questionId')::INTEGER;
      value := (response->>'value')::INTEGER;
      
      IF question_id = ANY(depression_questions) THEN
        depression_raw := depression_raw + value;
      ELSIF question_id = ANY(anxiety_questions) THEN
        anxiety_raw := anxiety_raw + value;
      ELSIF question_id = ANY(stress_questions) THEN
        stress_raw := stress_raw + value;
      END IF;
    END LOOP;
    
    -- Update the record with normalized scores (multiply by 2)
    UPDATE mental_health_records
    SET 
      subscale_scores = jsonb_build_object(
        'depression', depression_raw * 2,
        'anxiety', anxiety_raw * 2,
        'stress', stress_raw * 2
      ),
      total_score = (depression_raw + anxiety_raw + stress_raw) * 2
    WHERE id = record_id;
    
    RAISE NOTICE 'Updated DASS-21 record % with depression=%, anxiety=%, stress=%', 
      record_id, depression_raw * 2, anxiety_raw * 2, stress_raw * 2;
  END IF;
END $$;

-- =====================================================
-- 2. FIX VIA RESULTS - Backfill scores from all_strengths
-- =====================================================

-- Update VIA records where score has all zeros but all_strengths has data
UPDATE via_results
SET 
  score = (
    SELECT jsonb_object_agg(
      strength->>'strength',
      (strength->>'percentageScore')::NUMERIC
    )
    FROM jsonb_array_elements(all_strengths) AS strength
  ),
  responses = COALESCE(responses, '{}'::JSONB)
WHERE 
  user_id = '76279f0a-fd21-40ca-99a2-6aa116c7fb74'
  AND all_strengths IS NOT NULL
  AND jsonb_array_length(all_strengths) > 0;

-- =====================================================
-- 3. VERIFY FIXES
-- =====================================================

-- Check DASS-21 record is fixed:
-- SELECT id, total_score, subscale_scores FROM mental_health_records 
-- WHERE id = '289e9997-3958-43c8-94e8-421e8f0f646e';

-- Check VIA record is fixed:
-- SELECT id, score FROM via_results 
-- WHERE user_id = '76279f0a-fd21-40ca-99a2-6aa116c7fb74';

-- =====================================================
-- 4. BACKFILL bfi2_test_history FROM personality_profiles
-- For users who took Big5 before history tracking was added
-- =====================================================

INSERT INTO bfi2_test_history (user_id, score, raw_scores, completed_at, created_at)
SELECT 
  pp.user_id,
  pp.bfi2_score as score,
  jsonb_build_object(
    'O', pp.big5_openness_raw,
    'C', pp.big5_conscientiousness_raw,
    'E', pp.big5_extraversion_raw,
    'A', pp.big5_agreeableness_raw,
    'N', pp.big5_neuroticism_raw
  ) as raw_scores,
  pp.updated_at as completed_at,
  NOW() as created_at
FROM personality_profiles pp
WHERE pp.bfi2_score IS NOT NULL
  AND pp.big5_openness_raw IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM bfi2_test_history bth 
    WHERE bth.user_id = pp.user_id
  )
ON CONFLICT DO NOTHING;

COMMENT ON TABLE mental_health_records IS 'Mental health test results with normalized subscale scores';
COMMENT ON TABLE via_results IS 'VIA Character Strengths test results with full strength scores';
COMMENT ON TABLE bfi2_test_history IS 'Big Five Inventory-2 test history for temporal analysis';
