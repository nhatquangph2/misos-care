-- Verification Script for Gamification System
-- Run this AFTER the main migration to verify everything works

-- 1. Check if table exists
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'user_gamification'
ORDER BY ordinal_position;

-- Expected: 7 columns (user_id, bubbles, ocean_level, streak_days, last_interaction_at, created_at, updated_at)

-- 2. Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'user_gamification';

-- Expected: 3 policies (SELECT, UPDATE, INSERT)

-- 3. Check functions exist
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name IN ('increment_bubbles', 'update_streak_days', 'calculate_ocean_level')
  AND routine_schema = 'public';

-- Expected: 3 functions

-- 4. Test calculate_ocean_level function
SELECT
  calculate_ocean_level(0) as level_1_min,    -- Should return 1
  calculate_ocean_level(99) as level_1_max,   -- Should return 1
  calculate_ocean_level(100) as level_2_min,  -- Should return 2
  calculate_ocean_level(299) as level_2_max,  -- Should return 2
  calculate_ocean_level(300) as level_3_min,  -- Should return 3
  calculate_ocean_level(599) as level_3_max,  -- Should return 3
  calculate_ocean_level(600) as level_4_min,  -- Should return 4
  calculate_ocean_level(999) as level_4_max,  -- Should return 4
  calculate_ocean_level(1000) as level_5_min, -- Should return 5
  calculate_ocean_level(5000) as level_5_high; -- Should return 5

-- 5. Check indexes
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'user_gamification';

-- Expected: 3 indexes (PRIMARY KEY + 2 custom indexes)

-- ✅ If all queries return expected results, migration is successful!
