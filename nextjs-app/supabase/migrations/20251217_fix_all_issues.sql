-- Fix all MISO V3 integration issues
-- Created: 2025-12-17

-- 1. Fix personality_profiles: Add updated_at
ALTER TABLE personality_profiles
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_personality_profiles_updated_at ON personality_profiles;
CREATE TRIGGER update_personality_profiles_updated_at
    BEFORE UPDATE ON personality_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. Fix miso_analysis_logs: Change foreign key to reference auth.users
ALTER TABLE miso_analysis_logs
DROP CONSTRAINT IF EXISTS miso_analysis_logs_user_id_fkey;

ALTER TABLE miso_analysis_logs
ADD CONSTRAINT miso_analysis_logs_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Fix prediction_feedback: Change foreign key to reference auth.users
ALTER TABLE prediction_feedback
DROP CONSTRAINT IF EXISTS prediction_feedback_user_id_fkey;

ALTER TABLE prediction_feedback
ADD CONSTRAINT prediction_feedback_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Verify the changes
SELECT
    'miso_analysis_logs' as table_name,
    COUNT(*) as row_count
FROM miso_analysis_logs
UNION ALL
SELECT
    'prediction_feedback' as table_name,
    COUNT(*) as row_count
FROM prediction_feedback;
