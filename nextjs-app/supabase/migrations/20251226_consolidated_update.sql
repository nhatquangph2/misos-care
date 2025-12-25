-- =================================================================
-- MISO V3 CONSOLIDATED UPDATE (2025-12-26)
-- Includes:
-- 1. Gamification Base (Profiles, Badges)
-- 2. Mentor System V2 (Reviews, Booking, Profiles Enhanced)
-- 3. Gamification Expansion (Ocean Garden, Daily Quests)
-- =================================================================

-- PART 1: GAMIFICATION BASE
-- =================================================================

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

CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    category TEXT CHECK (category IN ('achievement', 'streak', 'milestone', 'personality', 'test', 'intervention', 'community')),
    points_awarded INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

ALTER TABLE public.gamification_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Policies for Gamification
DO $$ BEGIN
    CREATE POLICY "Users can view own gamification profile" ON public.gamification_profiles FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own gamification profile" ON public.gamification_profiles FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Service role can manage all profiles" ON public.gamification_profiles FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Badges are publicly viewable" ON public.badges FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can view own earned badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- PART 2: MENTOR SYSTEM V2
-- =================================================================
CREATE TABLE IF NOT EXISTS specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_vi TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed specializations
INSERT INTO specializations (slug, name_vi, name_en) VALUES
('depression', 'Trầm cảm', 'Depression'),
('anxiety', 'Rối loạn lo âu', 'Anxiety Disorders'),
('stress', 'Quản lý căng thẳng', 'Stress Management'),
('relationships', 'Mối quan hệ', 'Relationships'),
('career', 'Định hướng nghề nghiệp', 'Career Counseling'),
('trauma', 'Sang chấn tâm lý', 'Trauma & PTSD'),
('grief', 'Tang chế & Mất mát', 'Grief & Loss'),
('self_esteem', 'Lòng tự trọng', 'Self-Esteem'),
('sleep', 'Rối loạn giấc ngủ', 'Sleep Disorders'),
('lgbtq', 'LGBTQ+', 'LGBTQ+ Issues')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS mentor_specializations (
    mentor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    specialization_id UUID REFERENCES public.specializations(id) ON DELETE CASCADE,
    years_experience INTEGER DEFAULT 1,
    PRIMARY KEY (mentor_id, specialization_id)
);

CREATE TABLE IF NOT EXISTS mentor_availabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    specific_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS mentor_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    price DECIMAL(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'VND',
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    meeting_link TEXT,
    user_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentor_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.mentor_bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(booking_id)
);

-- Update existing mentor_profiles if exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mentor_profiles') THEN
        ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS rating_avg DECIMAL(3, 2) DEFAULT 0;
        ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
        ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS price_per_session DECIMAL(12, 0) DEFAULT 200000;
        ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'VND';
        ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS organization TEXT;
    END IF;
END $$;

-- Enable RLS for Mentor Tables
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_reviews ENABLE ROW LEVEL SECURITY;

-- Simple policies for Mentor System (create if not exists blocks are tricky in SQL simple script, so using DO blocks for policies or assuming clean run relative to these tables)
DO $$ BEGIN
    CREATE POLICY "Public read specializations" ON specializations FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Public read mentor specs" ON mentor_specializations FOR SELECT USING (true);
    CREATE POLICY "Mentors manage own specs" ON mentor_specializations FOR ALL USING (auth.uid() = mentor_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- PART 3: GAMIFICATION EXPANSION
-- =================================================================
CREATE TABLE IF NOT EXISTS public.ocean_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('coral', 'fish', 'decoration', 'plant')),
    unlock_price INTEGER DEFAULT 0,
    image_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_ocean_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.ocean_items(id) ON DELETE CASCADE,
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    scale DECIMAL(3,2) DEFAULT 1.0,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('check_in', 'journal', 'meditate', 'breathing', 'mood_log', 'read_article')),
    reward_points INTEGER DEFAULT 10,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.ocean_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ocean_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Ocean items are viewable by everyone" ON public.ocean_items FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can manage their own quests" ON public.daily_quests FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed Data (Badges & Ocean Items)
INSERT INTO public.ocean_items (slug, name, type, unlock_price, image_url) VALUES 
('coral_brain', 'San hô trí não', 'coral', 0, '/assets/ocean/coral_brain.svg'),
('seaweed_green', 'Rong biển xanh', 'plant', 50, '/assets/ocean/seaweed_green.svg'),
('clown_fish', 'Cá hề', 'fish', 100, '/assets/ocean/clown_fish.svg'),
('rock_small', 'Đá cuội nhỏ', 'decoration', 20, '/assets/ocean/rock_small.svg'),
('chest_treasure', 'Rương kho báu', 'decoration', 500, '/assets/ocean/chest_treasure.svg')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.badges (slug, name, description, category, points_awarded, icon_url)
VALUES 
('pioneer', 'Pioneer', 'Joined the MISO platform early.', 'milestone', 50, '🚀'),
('streak_3', '3 Day Streak', 'Logged in for 3 consecutive days.', 'streak', 20, '🔥'),
('streak_7', 'Week Warrior', 'Logged in for 7 consecutive days.', 'streak', 100, '⚡'),
('miso_complete', 'Self-Aware', 'Completed full MISO analysis (DASS + Big5).', 'achievement', 150, '🧠'),
('first_step', 'First Step', 'Completed your first psychological test.', 'milestone', 30, '👣')
ON CONFLICT (slug) DO NOTHING;
