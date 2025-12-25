-- Gamification System Migration
-- Created: 2025-12-25
-- Purpose: Add engagement features (streaks, badges)

-- =====================================================
-- TABLE: gamification_profiles
-- Purpose: Store user engagement stats
-- =====================================================

CREATE TABLE IF NOT EXISTS gamification_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: badges
-- Purpose: Define available badges
-- =====================================================

CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  category TEXT, -- 'test', 'streak', 'intervention', 'community'
  points INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: user_badges
-- Purpose: Track earned badges
-- =====================================================

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- =====================================================
-- INDEXES & RLS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_gamification_profiles_updated ON gamification_profiles(updated_at);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);

ALTER TABLE gamification_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policies

CREATE POLICY "Users can view own gamification profile"
  ON gamification_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification profile"
  ON gamification_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gamification_profiles_updated_at
BEFORE UPDATE ON gamification_profiles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Seed some default badges
INSERT INTO badges (slug, name, description, icon_url, category, points) VALUES
('pioneer', 'Người Tiên Phong', 'Hoàn thành bài test đầu tiên', '🏅', 'test', 50),
('streak_3', 'Khởi Động', 'Duy trì chuỗi 3 ngày liên tiếp', '🔥', 'streak', 100),
('streak_7', 'Kiên Trì', 'Duy trì chuỗi 7 ngày liên tiếp', '🔥', 'streak', 300),
('miso_complete', 'Hiểu Mình', 'Hoàn thành đủ bộ test MISO (DASS+Big5)', '🧠', 'test', 200),
('action_taker', 'Hành Động', 'Thực hiện 5 bài tập can thiệp', '💪', 'intervention', 150)
ON CONFLICT (slug) DO NOTHING;
