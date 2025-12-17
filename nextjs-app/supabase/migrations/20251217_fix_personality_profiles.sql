-- Fix personality_profiles table: Add updated_at column if missing
-- Created: 2025-12-17

-- Add updated_at column if it doesn't exist
ALTER TABLE personality_profiles
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists, then create new one
DROP TRIGGER IF EXISTS update_personality_profiles_updated_at ON personality_profiles;
CREATE TRIGGER update_personality_profiles_updated_at
    BEFORE UPDATE ON personality_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
