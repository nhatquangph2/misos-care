-- Migration: Add VIA columns to personality_profiles table
-- Run this in Supabase SQL Editor

-- Add via_signature_strengths column (JSONB to store array of strength objects)
ALTER TABLE personality_profiles 
ADD COLUMN IF NOT EXISTS via_signature_strengths JSONB;

-- Add via_top_virtue column (TEXT to store top virtue name)
ALTER TABLE personality_profiles 
ADD COLUMN IF NOT EXISTS via_top_virtue TEXT;

-- Optional: Add comment for documentation
COMMENT ON COLUMN personality_profiles.via_signature_strengths IS 'Array of VIA signature strengths with percentages';
COMMENT ON COLUMN personality_profiles.via_top_virtue IS 'Top VIA virtue (wisdom, courage, humanity, justice, temperance, transcendence)';

-- Refresh schema cache (important for Supabase)
NOTIFY pgrst, 'reload schema';
