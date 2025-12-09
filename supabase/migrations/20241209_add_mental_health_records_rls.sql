-- Enable RLS on mental_health_records table
ALTER TABLE mental_health_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own mental health records" ON mental_health_records;
DROP POLICY IF EXISTS "Users can insert their own mental health records" ON mental_health_records;
DROP POLICY IF EXISTS "Users can update their own mental health records" ON mental_health_records;
DROP POLICY IF EXISTS "Users can delete their own mental health records" ON mental_health_records;

-- Policy: Users can view their own records
CREATE POLICY "Users can view their own mental health records"
ON mental_health_records
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own records
CREATE POLICY "Users can insert their own mental health records"
ON mental_health_records
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own records
CREATE POLICY "Users can update their own mental health records"
ON mental_health_records
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own records
CREATE POLICY "Users can delete their own mental health records"
ON mental_health_records
FOR DELETE
USING (auth.uid() = user_id);

-- Also check personality_profiles RLS
ALTER TABLE personality_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own personality profile" ON personality_profiles;
DROP POLICY IF EXISTS "Users can insert their own personality profile" ON personality_profiles;
DROP POLICY IF EXISTS "Users can update their own personality profile" ON personality_profiles;
DROP POLICY IF EXISTS "Users can delete their own personality profile" ON personality_profiles;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own personality profile"
ON personality_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own personality profile"
ON personality_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own personality profile"
ON personality_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete their own personality profile"
ON personality_profiles
FOR DELETE
USING (auth.uid() = user_id);
