-- =====================================================
-- MISO'S CARE - USER PROFILES & MENTOR SYSTEM
-- Migration: Add extended user profiles and mentor functionality
-- =====================================================

-- =====================================================
-- PART 1: EXTEND USERS TABLE
-- =====================================================

-- Add new columns to users table for extended profile
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Ho_Chi_Minh';

-- Contact information
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_secondary TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS zalo TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS facebook TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin TEXT;

-- Emergency contact
ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;

-- Role and status
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'mentor', 'admin'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'private' CHECK (profile_visibility IN ('private', 'mentors_only', 'public'));

-- Preferences
ALTER TABLE users ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'vi';
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS consent_data_sharing BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS consent_mentor_access BOOLEAN DEFAULT FALSE;

-- =====================================================
-- PART 2: MENTOR PROFILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS mentor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Professional info
  title TEXT, -- e.g., "Chuyên gia Tâm lý", "Tư vấn viên"
  specializations TEXT[], -- e.g., ['depression', 'anxiety', 'career']
  qualifications TEXT[],
  experience_years INTEGER DEFAULT 0,
  organization TEXT,

  -- Bio and description
  professional_bio TEXT,
  approach_description TEXT,

  -- Availability
  is_available BOOLEAN DEFAULT TRUE,
  max_mentees INTEGER DEFAULT 20,
  current_mentee_count INTEGER DEFAULT 0,

  -- Ratings (for future use)
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  total_reviews INTEGER DEFAULT 0,

  -- Verification
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- =====================================================
-- PART 3: MENTOR-USER RELATIONSHIPS
-- =====================================================

CREATE TABLE IF NOT EXISTS mentor_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Relationship status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'ended')),

  -- Request details
  request_message TEXT,
  request_date TIMESTAMPTZ DEFAULT NOW(),

  -- Response details
  response_message TEXT,
  response_date TIMESTAMPTZ,

  -- Access permissions
  can_view_test_results BOOLEAN DEFAULT TRUE,
  can_view_goals BOOLEAN DEFAULT TRUE,
  can_view_contact_info BOOLEAN DEFAULT FALSE,
  can_add_notes BOOLEAN DEFAULT TRUE,

  -- Relationship details
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  end_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(mentor_id, user_id)
);

-- =====================================================
-- PART 4: MENTOR NOTES
-- =====================================================

CREATE TABLE IF NOT EXISTS mentor_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  relationship_id UUID NOT NULL REFERENCES mentor_relationships(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Note content
  title TEXT,
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'session', 'observation', 'recommendation', 'follow_up')),

  -- Reference to specific records (optional)
  related_test_id UUID REFERENCES mental_health_records(id) ON DELETE SET NULL,
  related_goal_id UUID REFERENCES user_goals(id) ON DELETE SET NULL,

  -- Privacy
  is_private BOOLEAN DEFAULT TRUE, -- If true, only mentor can see
  shared_with_user BOOLEAN DEFAULT FALSE,

  -- Follow up
  requires_follow_up BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  follow_up_completed BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 5: USER CONSENT LOG
-- =====================================================

CREATE TABLE IF NOT EXISTS user_consent_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  consent_type TEXT NOT NULL CHECK (consent_type IN ('terms', 'privacy', 'data_sharing', 'mentor_access', 'marketing')),
  consent_given BOOLEAN NOT NULL,
  consent_version TEXT NOT NULL DEFAULT '1.0',

  ip_address TEXT,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 6: INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role) WHERE role IN ('mentor', 'admin');
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_available ON mentor_profiles(is_available, current_mentee_count) WHERE is_available = TRUE;
CREATE INDEX IF NOT EXISTS idx_mentor_relationships_status ON mentor_relationships(mentor_id, status);
CREATE INDEX IF NOT EXISTS idx_mentor_relationships_user ON mentor_relationships(user_id, status);
CREATE INDEX IF NOT EXISTS idx_mentor_notes_relationship ON mentor_notes(relationship_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mentor_notes_follow_up ON mentor_notes(mentor_id, requires_follow_up, follow_up_date) WHERE requires_follow_up = TRUE AND follow_up_completed = FALSE;

-- =====================================================
-- PART 7: TRIGGERS
-- =====================================================

-- Trigger for mentor_profiles updated_at
DROP TRIGGER IF EXISTS update_mentor_profiles_updated_at ON mentor_profiles;
CREATE TRIGGER update_mentor_profiles_updated_at
BEFORE UPDATE ON mentor_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for mentor_relationships updated_at
DROP TRIGGER IF EXISTS update_mentor_relationships_updated_at ON mentor_relationships;
CREATE TRIGGER update_mentor_relationships_updated_at
BEFORE UPDATE ON mentor_relationships
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for mentor_notes updated_at
DROP TRIGGER IF EXISTS update_mentor_notes_updated_at ON mentor_notes;
CREATE TRIGGER update_mentor_notes_updated_at
BEFORE UPDATE ON mentor_notes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update mentee count
CREATE OR REPLACE FUNCTION update_mentee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE mentor_profiles
    SET current_mentee_count = current_mentee_count + 1
    WHERE user_id = NEW.mentor_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- If status changed to active
    IF OLD.status != 'active' AND NEW.status = 'active' THEN
      UPDATE mentor_profiles
      SET current_mentee_count = current_mentee_count + 1
      WHERE user_id = NEW.mentor_id;
    -- If status changed from active to something else
    ELSIF OLD.status = 'active' AND NEW.status != 'active' THEN
      UPDATE mentor_profiles
      SET current_mentee_count = GREATEST(0, current_mentee_count - 1)
      WHERE user_id = NEW.mentor_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
    UPDATE mentor_profiles
    SET current_mentee_count = GREATEST(0, current_mentee_count - 1)
    WHERE user_id = OLD.mentor_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_mentee_count_trigger ON mentor_relationships;
CREATE TRIGGER update_mentee_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON mentor_relationships
FOR EACH ROW EXECUTE FUNCTION update_mentee_count();

-- =====================================================
-- PART 8: ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consent_log ENABLE ROW LEVEL SECURITY;

-- Mentor profiles policies
DROP POLICY IF EXISTS "Anyone can view available mentors" ON mentor_profiles;
CREATE POLICY "Anyone can view available mentors" ON mentor_profiles
  FOR SELECT USING (is_available = TRUE);

DROP POLICY IF EXISTS "Mentors can manage own profile" ON mentor_profiles;
CREATE POLICY "Mentors can manage own profile" ON mentor_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Mentor relationships policies
DROP POLICY IF EXISTS "Users can view own relationships" ON mentor_relationships;
CREATE POLICY "Users can view own relationships" ON mentor_relationships
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = mentor_id);

DROP POLICY IF EXISTS "Users can request mentor" ON mentor_relationships;
CREATE POLICY "Users can request mentor" ON mentor_relationships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Mentors can update relationship status" ON mentor_relationships;
CREATE POLICY "Mentors can update relationship status" ON mentor_relationships
  FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = user_id);

-- Mentor notes policies
DROP POLICY IF EXISTS "Mentors can manage own notes" ON mentor_notes;
CREATE POLICY "Mentors can manage own notes" ON mentor_notes
  FOR ALL USING (auth.uid() = mentor_id);

DROP POLICY IF EXISTS "Users can view shared notes" ON mentor_notes;
CREATE POLICY "Users can view shared notes" ON mentor_notes
  FOR SELECT USING (auth.uid() = user_id AND shared_with_user = TRUE);

-- Consent log policies
DROP POLICY IF EXISTS "Users can view own consent" ON user_consent_log;
CREATE POLICY "Users can view own consent" ON user_consent_log
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own consent" ON user_consent_log;
CREATE POLICY "Users can insert own consent" ON user_consent_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PART 9: MENTOR ACCESS POLICIES FOR USER DATA
-- =====================================================

-- Update mental_health_records policy to allow mentor access
DROP POLICY IF EXISTS "Mentors can view mentee records" ON mental_health_records;
CREATE POLICY "Mentors can view mentee records" ON mental_health_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM mentor_relationships mr
      WHERE mr.mentor_id = auth.uid()
        AND mr.user_id = mental_health_records.user_id
        AND mr.status = 'active'
        AND mr.can_view_test_results = TRUE
    )
  );

-- Update personality_profiles policy to allow mentor access
DROP POLICY IF EXISTS "Mentors can view mentee personality" ON personality_profiles;
CREATE POLICY "Mentors can view mentee personality" ON personality_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM mentor_relationships mr
      WHERE mr.mentor_id = auth.uid()
        AND mr.user_id = personality_profiles.user_id
        AND mr.status = 'active'
        AND mr.can_view_test_results = TRUE
    )
  );

-- Update user_goals policy to allow mentor access
DROP POLICY IF EXISTS "Mentors can view mentee goals" ON user_goals;
CREATE POLICY "Mentors can view mentee goals" ON user_goals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM mentor_relationships mr
      WHERE mr.mentor_id = auth.uid()
        AND mr.user_id = user_goals.user_id
        AND mr.status = 'active'
        AND mr.can_view_goals = TRUE
    )
  );

-- Allow mentors to view basic user info of their mentees
DROP POLICY IF EXISTS "Mentors can view mentee profile" ON users;
CREATE POLICY "Mentors can view mentee profile" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM mentor_relationships mr
      WHERE mr.mentor_id = auth.uid()
        AND mr.user_id = users.id
        AND mr.status = 'active'
    )
  );

-- =====================================================
-- PART 10: HELPER FUNCTIONS
-- =====================================================

-- Function to check if user is a mentor
CREATE OR REPLACE FUNCTION is_mentor(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users WHERE id = user_uuid AND role IN ('mentor', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has active mentor relationship
CREATE OR REPLACE FUNCTION has_active_mentor(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM mentor_relationships
    WHERE user_id = user_uuid AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get mentor's mentees
CREATE OR REPLACE FUNCTION get_mentees(mentor_uuid UUID)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  user_email TEXT,
  relationship_status TEXT,
  started_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id as user_id,
    COALESCE(u.full_name, u.name) as user_name,
    u.email as user_email,
    mr.status as relationship_status,
    mr.started_at
  FROM mentor_relationships mr
  JOIN users u ON u.id = mr.user_id
  WHERE mr.mentor_id = mentor_uuid
  ORDER BY mr.status, mr.started_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
