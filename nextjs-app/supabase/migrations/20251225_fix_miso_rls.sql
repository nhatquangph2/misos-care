-- Fix RLS for miso_analysis_logs - MUST RUN IN SUPABASE SQL EDITOR
-- This allows users to insert and read their own MISO analysis results

-- Enable RLS
ALTER TABLE miso_analysis_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own analysis logs
DROP POLICY IF EXISTS "miso_logs_select_own" ON miso_analysis_logs;
CREATE POLICY "miso_logs_select_own" ON miso_analysis_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own analysis logs
DROP POLICY IF EXISTS "miso_logs_insert_own" ON miso_analysis_logs;
CREATE POLICY "miso_logs_insert_own" ON miso_analysis_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Also fix prediction_feedback table
ALTER TABLE prediction_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "prediction_select_own" ON prediction_feedback;
CREATE POLICY "prediction_select_own" ON prediction_feedback
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "prediction_insert_own" ON prediction_feedback;
CREATE POLICY "prediction_insert_own" ON prediction_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Refresh schema
NOTIFY pgrst, 'reload schema';

-- Verify policies exist
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('miso_analysis_logs', 'prediction_feedback');
