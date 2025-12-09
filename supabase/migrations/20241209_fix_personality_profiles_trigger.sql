-- =====================================================
-- FIX PERSONALITY_PROFILES TRIGGER
-- The trigger is referencing 'updated_at' but the table uses 'last_updated'
-- Run this in Supabase Dashboard SQL Editor
-- =====================================================

-- Step 1: Drop the existing trigger that's causing the error
DROP TRIGGER IF EXISTS set_updated_at ON personality_profiles;
DROP TRIGGER IF EXISTS update_personality_profiles_updated_at ON personality_profiles;

-- Step 2: Create the correct trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 3: Create the trigger with correct field name
DROP TRIGGER IF EXISTS update_personality_profiles_last_updated ON personality_profiles;
CREATE TRIGGER update_personality_profiles_last_updated
    BEFORE UPDATE ON personality_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated_column();

-- Step 4: Verify the table structure
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'personality_profiles'
-- ORDER BY ordinal_position;
