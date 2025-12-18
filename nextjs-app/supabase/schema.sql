-- =====================================================
-- MISO'S CARE - DATABASE SCHEMA
-- Complete Schema for Mental Health & Personality App
-- Version: 1.0.0
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE
-- Core user information (extends Supabase auth.users)
-- =====================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  name TEXT NOT NULL,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. PERSONALITY PROFILES TABLE
-- Stores MBTI, Big Five, Enneagram results
-- =====================================================

CREATE TABLE personality_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- MBTI (Myers-Briggs Type Indicator)
  mbti_type TEXT CHECK (mbti_type IN (
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  )),
  mbti_scores JSONB, -- {E: 60, I: 40, S: 45, N: 55, T: 70, F: 30, J: 65, P: 35}

  -- Big Five (BFI-2) - Percentage Scores (0-100) [LEGACY - for backward compatibility]
  big5_openness DECIMAL(5,2) CHECK (big5_openness BETWEEN 0 AND 100),
  big5_conscientiousness DECIMAL(5,2) CHECK (big5_conscientiousness BETWEEN 0 AND 100),
  big5_extraversion DECIMAL(5,2) CHECK (big5_extraversion BETWEEN 0 AND 100),
  big5_agreeableness DECIMAL(5,2) CHECK (big5_agreeableness BETWEEN 0 AND 100),
  big5_neuroticism DECIMAL(5,2) CHECK (big5_neuroticism BETWEEN 0 AND 100),

  -- Big Five (BFI-2) - Raw Scores (1-5 scale) [NEW - for MISO V3 integration]
  -- These are the actual BFI-2 domain scores after reverse scoring
  big5_openness_raw DECIMAL(3,2) CHECK (big5_openness_raw BETWEEN 1 AND 5),
  big5_conscientiousness_raw DECIMAL(3,2) CHECK (big5_conscientiousness_raw BETWEEN 1 AND 5),
  big5_extraversion_raw DECIMAL(3,2) CHECK (big5_extraversion_raw BETWEEN 1 AND 5),
  big5_agreeableness_raw DECIMAL(3,2) CHECK (big5_agreeableness_raw BETWEEN 1 AND 5),
  big5_neuroticism_raw DECIMAL(3,2) CHECK (big5_neuroticism_raw BETWEEN 1 AND 5),

  -- Complete BFI-2 Score Object (includes domains, facets, T-scores, percentiles)
  -- Format: {domains: {E, A, C, N, O}, facets: {...}, tScores: {...}, percentiles: {...}, raw_scores: {...}}
  bfi2_score JSONB,

  -- Enneagram (Optional - for future)
  enneagram_type INTEGER CHECK (enneagram_type BETWEEN 1 AND 9),
  enneagram_wing TEXT,

  -- Metadata
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id) -- One profile per user
);

-- =====================================================
-- 3. BFI-2 TEST HISTORY TABLE
-- Complete history of Big Five Inventory-2 test attempts
-- =====================================================

CREATE TABLE bfi2_test_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Complete score object from calculateBFI2Score()
  score JSONB NOT NULL,

  -- Denormalized raw scores for easy querying & MISO V3 integration
  -- Format: {N: 2.8, E: 3.2, O: 3.4, A: 3.8, C: 3.5}
  raw_scores JSONB NOT NULL,

  -- Test metadata
  completion_time_seconds INTEGER, -- How long it took to complete
  quality_warnings TEXT[], -- Data quality issues detected

  -- Raw responses (for audit/research)
  raw_responses JSONB, -- [{itemId: 1, value: 3}, ...]

  -- Timestamps
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_bfi2_user_date
ON bfi2_test_history(user_id, completed_at DESC);

COMMENT ON TABLE bfi2_test_history IS
'Complete history of BFI-2 (Big Five) test attempts. Each row represents one complete test session. The most recent test is used for personality_profiles. Enables MISO V3 temporal analysis, data recovery, and research.';

COMMENT ON COLUMN bfi2_test_history.score IS
'Complete BFI2Score object: {domains, facets, tScores, percentiles, raw_scores}';

COMMENT ON COLUMN bfi2_test_history.raw_scores IS
'Raw domain scores (1-5 scale): {N, E, O, A, C}. Denormalized for MISO V3 integration.';

-- =====================================================
-- 4. MENTAL HEALTH RECORDS TABLE
-- Stores test results (DASS-21, PHQ-9, GAD-7, etc.)
-- =====================================================

CREATE TABLE mental_health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Test information
  test_type TEXT NOT NULL CHECK (test_type IN ('DASS21', 'PHQ9', 'GAD7', 'PSS')),
  test_version TEXT DEFAULT '1.0',

  -- Scores
  total_score INTEGER NOT NULL,
  -- For DASS-21: Stores NORMALIZED scores (0-42) with English keys
  -- Format: {"depression": 24, "anxiety": 16, "stress": 28}
  -- total_score for DASS-21 = sum of normalized scores (0-126)
  subscale_scores JSONB,

  -- Severity levels
  severity_level TEXT NOT NULL CHECK (severity_level IN ('normal', 'mild', 'moderate', 'severe', 'extremely_severe')),

  -- Crisis detection
  crisis_flag BOOLEAN DEFAULT FALSE,
  crisis_reason TEXT, -- E.g., "PHQ-9 Question 9 score > 1"

  -- Raw responses (for audit/research)
  raw_responses JSONB, -- [{question: 1, answer: 3}, ...]

  -- Metadata
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Index for performance
  INDEX idx_user_test_date ON mental_health_records(user_id, completed_at DESC)
);

-- =====================================================
-- 4. CHAT SESSIONS TABLE
-- Manages chat conversations with AI
-- =====================================================

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Session info
  title TEXT, -- Auto-generated or user-defined
  context_summary TEXT, -- AI-generated summary of conversation

  -- Session state
  is_active BOOLEAN DEFAULT TRUE,
  message_count INTEGER DEFAULT 0,

  -- Metadata
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_user_active_sessions ON chat_sessions(user_id, is_active, last_message_at DESC)
);

-- =====================================================
-- 5. CHAT MESSAGES TABLE
-- Individual messages in chat sessions
-- =====================================================

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,

  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- AI metadata (for assistant messages)
  model TEXT, -- e.g., "gpt-4o-mini"
  tokens_used INTEGER,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,

  -- Crisis detection
  contains_crisis_keyword BOOLEAN DEFAULT FALSE,
  moderation_flagged BOOLEAN DEFAULT FALSE,
  moderation_categories JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_session_messages ON chat_messages(session_id, created_at ASC)
);

-- =====================================================
-- 6. MENTORS TABLE
-- Professional mentors available for booking
-- =====================================================

CREATE TABLE mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic info
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  credentials TEXT, -- Education, certifications

  -- Specializations
  specialties TEXT[] NOT NULL, -- ['Career Counseling', 'Relationship', 'Anxiety']
  personality_match TEXT[], -- MBTI types they work best with: ['INFP', 'INFJ']

  -- Pricing
  hourly_rate DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'VND',

  -- Availability (stored as JSON for flexibility)
  availability JSONB, -- {monday: ['09:00', '10:00', '14:00'], tuesday: [...]}

  -- Stats
  rating DECIMAL(3,2) DEFAULT 5.0 CHECK (rating BETWEEN 0 AND 5),
  total_sessions INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  verified BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. BOOKINGS TABLE
-- Mentor session bookings
-- =====================================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE RESTRICT,

  -- Session details
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,

  -- Pricing
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'VND',

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  cancellation_reason TEXT,
  cancelled_by TEXT CHECK (cancelled_by IN ('user', 'mentor', 'admin')),

  -- Payment
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
  payment_method TEXT, -- 'vnpay', 'momo', 'stripe'
  payment_transaction_id TEXT,
  paid_at TIMESTAMPTZ,

  -- Meeting
  meeting_link TEXT,
  meeting_platform TEXT, -- 'google_meet', 'zoom', 'teams'

  -- Notes
  user_notes TEXT,
  mentor_notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent double booking
  UNIQUE(mentor_id, session_date, session_time),

  INDEX idx_user_bookings ON bookings(user_id, session_date DESC),
  INDEX idx_mentor_schedule ON bookings(mentor_id, session_date, session_time)
);

-- =====================================================
-- 8. BOOKING REVIEWS TABLE (Optional)
-- User reviews for mentor sessions
-- =====================================================

CREATE TABLE booking_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,

  -- Review content
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_mentor_reviews ON booking_reviews(mentor_id, created_at DESC)
);

-- =====================================================
-- 9. PRODUCTS TABLE
-- Merchandise/products for sale
-- =====================================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Product info
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'journal', 'keychain', 'sticker', 'book', 'accessory'

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'VND',

  -- Images
  image_url TEXT,
  images JSONB, -- Array of image URLs

  -- External link (for Shopee/Lazada)
  external_link TEXT,

  -- Inventory (optional)
  stock_quantity INTEGER,

  -- Stats
  click_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. COMMUNITY GROUPS TABLE
-- Personality-based community groups
-- =====================================================

CREATE TABLE community_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Group info
  personality_type TEXT CHECK (personality_type IN (
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
    'general' -- For non-personality-specific groups
  )),
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,

  -- Rules
  rules JSONB, -- [{rule: 'Be respectful', order: 1}, ...]

  -- Stats
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,

  -- Settings
  is_private BOOLEAN DEFAULT FALSE,
  requires_approval BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. GROUP MEMBERS TABLE
-- Track group membership
-- =====================================================

CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Role
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),

  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'banned')),

  -- Metadata
  joined_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(group_id, user_id),

  INDEX idx_user_groups ON group_members(user_id, status),
  INDEX idx_group_members ON group_members(group_id, status)
);

-- =====================================================
-- 12. COMMUNITY POSTS TABLE
-- Posts within community groups
-- =====================================================

CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Content
  content TEXT NOT NULL,
  images JSONB, -- Array of image URLs

  -- Moderation
  moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  moderation_reason TEXT,
  moderated_at TIMESTAMPTZ,
  moderated_by UUID REFERENCES users(id),

  -- Stats
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_group_posts ON community_posts(group_id, moderation_status, created_at DESC),
  INDEX idx_user_posts ON community_posts(user_id, created_at DESC)
);

-- =====================================================
-- 13. POST REPORTS TABLE (Optional)
-- User reports for inappropriate content
-- =====================================================

CREATE TABLE post_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Report details
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'harassment', 'inappropriate', 'misinformation', 'other')),
  description TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(post_id, reported_by), -- One report per user per post

  INDEX idx_pending_reports ON post_reports(status, created_at) WHERE status = 'pending'
);

-- =====================================================
-- 14. CRISIS ALERTS TABLE
-- Track and manage crisis situations
-- =====================================================

CREATE TABLE crisis_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Trigger info
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('test_score', 'chat_content', 'community_post', 'manual')),
  trigger_source_id UUID, -- ID of test/message/post that triggered alert

  -- Severity
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),

  -- Crisis details
  details JSONB, -- {test_type: 'PHQ9', question_9_score: 2, total_score: 23}

  -- Intervention
  intervention_sent BOOLEAN DEFAULT FALSE,
  intervention_type TEXT, -- 'modal', 'email', 'sms', 'notification'

  -- Resolution
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_unresolved_alerts ON crisis_alerts(user_id, resolved, created_at DESC) WHERE NOT resolved
);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personality_profiles_updated_at BEFORE UPDATE ON personality_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mentors_updated_at BEFORE UPDATE ON mentors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_groups_updated_at BEFORE UPDATE ON community_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update chat session last_message_at when new message is added
CREATE OR REPLACE FUNCTION update_chat_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET last_message_at = NOW(),
      message_count = message_count + 1
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_session_on_new_message
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_chat_session_last_message();

-- Update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE community_groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
    UPDATE community_groups SET member_count = member_count - 1 WHERE id = OLD.group_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'active' AND OLD.status != 'active' THEN
    UPDATE community_groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.status != 'active' AND OLD.status = 'active' THEN
    UPDATE community_groups SET member_count = member_count - 1 WHERE id = NEW.group_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_group_members_count
AFTER INSERT OR UPDATE OR DELETE ON group_members
FOR EACH ROW
EXECUTE FUNCTION update_group_member_count();

-- =====================================================
-- 15. USER GOALS TABLE
-- Personal goals and objectives for mental health
-- =====================================================

CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Goal info
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('mental_health', 'personality_growth', 'habits', 'relationships', 'career', 'custom')),

  -- Target
  target_metric TEXT, -- e.g., 'stress_level', 'test_frequency', 'meditation_days'
  target_value DECIMAL(10,2), -- e.g., 15 (stress score), 3 (tests per month)
  current_value DECIMAL(10,2) DEFAULT 0,

  -- Timeline
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_date DATE NOT NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),

  -- Motivation
  motivation_text TEXT, -- Why this goal is important
  reward_text TEXT, -- What user will do when achieved

  -- Tracking
  completed_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_user_active_goals ON user_goals(user_id, status, target_date) WHERE status = 'active'
);

-- =====================================================
-- 16. ACTION PLANS TABLE
-- Specific actions to achieve goals
-- =====================================================

CREATE TABLE action_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Action info
  title TEXT NOT NULL,
  description TEXT,
  action_type TEXT NOT NULL CHECK (action_type IN ('daily_habit', 'weekly_habit', 'one_time', 'test_schedule', 'custom')),

  -- Frequency (for habits)
  frequency_type TEXT CHECK (frequency_type IN ('daily', 'weekly', 'monthly', 'custom')),
  frequency_value INTEGER, -- e.g., 3 times per week
  frequency_days TEXT[], -- e.g., ['monday', 'wednesday', 'friday']

  -- Reminders
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_time TIME,
  reminder_days TEXT[], -- Days to remind

  -- Progress tracking
  total_completions INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_at TIMESTAMPTZ,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_user_active_plans ON action_plans(user_id, is_active, created_at DESC) WHERE is_active = TRUE
);

-- =====================================================
-- 17. ACTION COMPLETIONS TABLE
-- Track individual completions of action plans
-- =====================================================

CREATE TABLE action_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_plan_id UUID NOT NULL REFERENCES action_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Completion info
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  completion_date DATE DEFAULT CURRENT_DATE,

  -- Notes
  notes TEXT,
  mood TEXT CHECK (mood IN ('great', 'good', 'okay', 'bad', 'terrible')),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate completions on same day
  UNIQUE(action_plan_id, completion_date),

  INDEX idx_user_completions ON action_completions(user_id, completion_date DESC),
  INDEX idx_action_completions ON action_completions(action_plan_id, completion_date DESC)
);

-- =====================================================
-- 18. TEST REMINDERS TABLE
-- Scheduled reminders for taking tests
-- =====================================================

CREATE TABLE test_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Test info
  test_type TEXT NOT NULL CHECK (test_type IN ('DASS21', 'PHQ9', 'GAD7', 'PSS', 'MBTI', 'BIG5', 'SISRI24')),

  -- Schedule
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly')),
  next_reminder_date DATE NOT NULL,
  last_completed_date DATE,

  -- Reminder settings
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_time TIME DEFAULT '09:00',
  reminder_method TEXT[] DEFAULT ARRAY['notification'], -- ['notification', 'email']

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_upcoming_reminders ON test_reminders(user_id, next_reminder_date) WHERE is_active = TRUE AND reminder_enabled = TRUE
);

-- =====================================================
-- TRIGGERS FOR NEW TABLES
-- =====================================================

CREATE TRIGGER update_user_goals_updated_at
BEFORE UPDATE ON user_goals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_action_plans_updated_at
BEFORE UPDATE ON action_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_reminders_updated_at
BEFORE UPDATE ON test_reminders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Update action plan stats when completion is added
CREATE OR REPLACE FUNCTION update_action_plan_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE action_plans
    SET total_completions = total_completions + 1,
        last_completed_at = NEW.completed_at,
        current_streak = CASE
          WHEN last_completed_at IS NULL OR DATE(last_completed_at) = DATE(NEW.completed_at) - INTERVAL '1 day'
          THEN current_streak + 1
          ELSE 1
        END,
        longest_streak = GREATEST(longest_streak,
          CASE
            WHEN last_completed_at IS NULL OR DATE(last_completed_at) = DATE(NEW.completed_at) - INTERVAL '1 day'
            THEN current_streak + 1
            ELSE 1
          END
        )
    WHERE id = NEW.action_plan_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_action_stats_on_completion
AFTER INSERT ON action_completions
FOR EACH ROW
EXECUTE FUNCTION update_action_plan_stats();

-- =====================================================
-- END OF SCHEMA
-- =====================================================
