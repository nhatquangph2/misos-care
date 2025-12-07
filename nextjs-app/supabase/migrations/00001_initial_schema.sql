-- =====================================================
-- MISO'S CARE - INITIAL DATABASE SETUP
-- This file will create all necessary tables, triggers, and RLS policies
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PART 1: CORE TABLES
-- =====================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
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

-- 2. PERSONALITY PROFILES TABLE
CREATE TABLE IF NOT EXISTS personality_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mbti_type TEXT CHECK (mbti_type IN (
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  )),
  mbti_scores JSONB,
  big5_openness DECIMAL(5,2) CHECK (big5_openness BETWEEN 0 AND 100),
  big5_conscientiousness DECIMAL(5,2) CHECK (big5_conscientiousness BETWEEN 0 AND 100),
  big5_extraversion DECIMAL(5,2) CHECK (big5_extraversion BETWEEN 0 AND 100),
  big5_agreeableness DECIMAL(5,2) CHECK (big5_agreeableness BETWEEN 0 AND 100),
  big5_neuroticism DECIMAL(5,2) CHECK (big5_neuroticism BETWEEN 0 AND 100),
  enneagram_type INTEGER CHECK (enneagram_type BETWEEN 1 AND 9),
  enneagram_wing TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. MENTAL HEALTH RECORDS TABLE
CREATE TABLE IF NOT EXISTS mental_health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL CHECK (test_type IN ('DASS21', 'PHQ9', 'GAD7', 'PSS')),
  test_version TEXT DEFAULT '1.0',
  total_score INTEGER NOT NULL,
  subscale_scores JSONB,
  severity_level TEXT NOT NULL CHECK (severity_level IN ('normal', 'mild', 'moderate', 'severe', 'extremely_severe')),
  crisis_flag BOOLEAN DEFAULT FALSE,
  crisis_reason TEXT,
  raw_responses JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_test_date ON mental_health_records(user_id, completed_at DESC);

-- =====================================================
-- PART 2: GOALS & ACTION PLANS
-- =====================================================

-- 4. USER GOALS TABLE
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('mental_health', 'personality_growth', 'habits', 'relationships', 'career', 'custom')),
  target_metric TEXT,
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2) DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  motivation_text TEXT,
  reward_text TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_active_goals ON user_goals(user_id, status, target_date) WHERE status = 'active';

-- 5. ACTION PLANS TABLE
CREATE TABLE IF NOT EXISTS action_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  action_type TEXT NOT NULL CHECK (action_type IN ('daily_habit', 'weekly_habit', 'one_time', 'test_schedule', 'custom')),
  frequency_type TEXT CHECK (frequency_type IN ('daily', 'weekly', 'monthly', 'custom')),
  frequency_value INTEGER,
  frequency_days TEXT[],
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_time TIME,
  reminder_days TEXT[],
  total_completions INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_active_plans ON action_plans(user_id, is_active, created_at DESC) WHERE is_active = TRUE;

-- 6. ACTION COMPLETIONS TABLE
CREATE TABLE IF NOT EXISTS action_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_plan_id UUID NOT NULL REFERENCES action_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  completion_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  mood TEXT CHECK (mood IN ('great', 'good', 'okay', 'bad', 'terrible')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(action_plan_id, completion_date)
);

CREATE INDEX IF NOT EXISTS idx_user_completions ON action_completions(user_id, completion_date DESC);
CREATE INDEX IF NOT EXISTS idx_action_completions ON action_completions(action_plan_id, completion_date DESC);

-- 7. TEST REMINDERS TABLE
CREATE TABLE IF NOT EXISTS test_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL CHECK (test_type IN ('DASS21', 'PHQ9', 'GAD7', 'PSS', 'MBTI', 'BIG5', 'SISRI24')),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly')),
  next_reminder_date DATE NOT NULL,
  last_completed_date DATE,
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_time TIME DEFAULT '09:00',
  reminder_method TEXT[] DEFAULT ARRAY['notification'],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_upcoming_reminders ON test_reminders(user_id, next_reminder_date) WHERE is_active = TRUE AND reminder_enabled = TRUE;

-- =====================================================
-- PART 3: TRIGGERS & FUNCTIONS
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_personality_profiles_updated_at ON personality_profiles;
CREATE TRIGGER update_personality_profiles_updated_at
BEFORE UPDATE ON personality_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_goals_updated_at ON user_goals;
CREATE TRIGGER update_user_goals_updated_at
BEFORE UPDATE ON user_goals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_action_plans_updated_at ON action_plans;
CREATE TRIGGER update_action_plans_updated_at
BEFORE UPDATE ON action_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_test_reminders_updated_at ON test_reminders;
CREATE TRIGGER update_test_reminders_updated_at
BEFORE UPDATE ON test_reminders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Update action plan stats on completion
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

DROP TRIGGER IF EXISTS update_action_stats_on_completion ON action_completions;
CREATE TRIGGER update_action_stats_on_completion
AFTER INSERT ON action_completions
FOR EACH ROW EXECUTE FUNCTION update_action_plan_stats();

-- =====================================================
-- PART 4: ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE personality_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_reminders ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own data" ON users;
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Personality profiles policies
DROP POLICY IF EXISTS "Users can view own personality" ON personality_profiles;
CREATE POLICY "Users can view own personality" ON personality_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own personality" ON personality_profiles;
CREATE POLICY "Users can insert own personality" ON personality_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own personality" ON personality_profiles;
CREATE POLICY "Users can update own personality" ON personality_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Mental health records policies
DROP POLICY IF EXISTS "Users can view own records" ON mental_health_records;
CREATE POLICY "Users can view own records" ON mental_health_records
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own records" ON mental_health_records;
CREATE POLICY "Users can insert own records" ON mental_health_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Goals policies
DROP POLICY IF EXISTS "Users can manage own goals" ON user_goals;
CREATE POLICY "Users can manage own goals" ON user_goals
  FOR ALL USING (auth.uid() = user_id);

-- Action plans policies
DROP POLICY IF EXISTS "Users can manage own action plans" ON action_plans;
CREATE POLICY "Users can manage own action plans" ON action_plans
  FOR ALL USING (auth.uid() = user_id);

-- Action completions policies
DROP POLICY IF EXISTS "Users can manage own completions" ON action_completions;
CREATE POLICY "Users can manage own completions" ON action_completions
  FOR ALL USING (auth.uid() = user_id);

-- Test reminders policies
DROP POLICY IF EXISTS "Users can manage own reminders" ON test_reminders;
CREATE POLICY "Users can manage own reminders" ON test_reminders
  FOR ALL USING (auth.uid() = user_id);
