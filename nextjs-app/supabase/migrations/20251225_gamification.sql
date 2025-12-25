-- Create tables for Gamification System
-- Tables: gamification_profiles, badges, user_badges

-- 1. Create gamification_profiles table
CREATE TABLE IF NOT EXISTS public.gamification_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    last_activity_date TIMESTAMP WITH TIME ZONE,
    longest_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    category TEXT CHECK (category IN ('achievement', 'streak', 'milestone', 'personality')),
    points_awarded INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create user_badges table (many-to-many)
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- 4. Enable RLS
ALTER TABLE public.gamification_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- 5. Policies

-- Profiles: Users can view their own profile, System (service_role) can manage
CREATE POLICY "Users can view own gamification profile" 
ON public.gamification_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification profile"
ON public.gamification_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all profiles"
ON public.gamification_profiles FOR ALL
USING (true)
WITH CHECK (true);

-- Badges: Public read, Service role manage
CREATE POLICY "Badges are publicly viewable"
ON public.badges FOR SELECT
USING (true);

CREATE POLICY "Service role can manage badges"
ON public.badges FOR ALL
USING (true)
WITH CHECK (true);

-- User Badges: Users can view own, Service role manage
CREATE POLICY "Users can view own earned badges"
ON public.user_badges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage user badges"
ON public.user_badges FOR ALL
USING (true)
WITH CHECK (true);

-- 6. Insert Default Badges (Seed Data)
INSERT INTO public.badges (slug, name, description, category, points_awarded, icon_url)
VALUES 
('pioneer', 'Pioneer', 'Joined the MISO platform early.', 'milestone', 50, '🚀'),
('streak_3', '3 Day Streak', 'Logged in for 3 consecutive days.', 'streak', 20, '🔥'),
('streak_7', 'Week Warrior', 'Logged in for 7 consecutive days.', 'streak', 100, '⚡'),
('miso_complete', 'Self-Aware', 'Completed full MISO analysis (DASS + Big5).', 'achievement', 150, '🧠'),
('first_step', 'First Step', 'Completed your first psychological test.', 'milestone', 30, '👣')
ON CONFLICT (slug) DO NOTHING;
