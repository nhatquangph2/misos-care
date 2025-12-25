-- =====================================================
-- MISO'S CARE - MENTOR SYSTEM V2 (ENHANCED)
-- Migration: 20251226_mentor_system_v2.sql
-- Purpose: Complete implementation of Mentor Profile, Booking, and Review systems
-- =====================================================

-- =====================================================
-- 1. SPECIALIZATIONS (Catalog)
-- =====================================================
-- Normalized table for filtering/searching mentors

CREATE TABLE IF NOT EXISTS specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_vi TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed defaults
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

-- Junction table for Mentor <-> Specialization
CREATE TABLE IF NOT EXISTS mentor_specializations (
    mentor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    specialization_id UUID REFERENCES public.specializations(id) ON DELETE CASCADE,
    years_experience INTEGER DEFAULT 1,
    PRIMARY KEY (mentor_id, specialization_id)
);

-- =====================================================
-- 2. MENTOR AVAILABILITY (Scheduling)
-- =====================================================

CREATE TABLE IF NOT EXISTS mentor_availabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Recursive availability (e.g., Every Monday)
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday...
    
    -- Time slots (in mentor's local time, but stored strictly or converted)
    -- Simplest: Store start_time/end_time as TIME type for recurring
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Specific date override (if null, applies to all weeks)
    specific_date DATE,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- =====================================================
-- 3. MENTOR BOOKINGS (Appointments)
-- =====================================================

CREATE TABLE IF NOT EXISTS mentor_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Exact time of the session (UTC recommended)
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    
    -- Payment info (basic)
    price DECIMAL(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'VND',
    payment_status TEXT DEFAULT 'unpaid' 
        CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
        
    -- Meeting details
    meeting_link TEXT, -- Google Meet / Zoom link
    user_notes TEXT, -- What user wants to discuss
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. MENTOR REVIEWS (Feedback)
-- =====================================================

CREATE TABLE IF NOT EXISTS mentor_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.mentor_bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(booking_id) -- One review per booking
);

-- Note: We might need to sync rating changes to mentor_profiles table 
-- but that can be done via a trigger or computed on query.
-- For performance, let's add cached columns to mentor_profiles if they exist 
-- (assuming mentor_profiles table exists from previous migration 20241210)

DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mentor_profiles') THEN
        ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS rating_avg DECIMAL(3, 2) DEFAULT 0;
        ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
        ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS price_per_session DECIMAL(12, 0) DEFAULT 200000;
        ALTER TABLE mentor_profiles ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'VND';
    END IF;
END $$;


-- =====================================================
-- 5. RLS POLICIES
-- =====================================================

-- Specializations: Public read
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read specializations" ON specializations FOR SELECT USING (true);

-- Mentor Specializations: Public read, Mentor write own
ALTER TABLE mentor_specializations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read mentor specs" ON mentor_specializations FOR SELECT USING (true);
CREATE POLICY "Mentors manage own specs" ON mentor_specializations FOR ALL USING (auth.uid() = mentor_id);

-- Availabilities: Public read, Mentor write own
ALTER TABLE mentor_availabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read availabilities" ON mentor_availabilities FOR SELECT USING (true);
CREATE POLICY "Mentors manage own slots" ON mentor_availabilities FOR ALL USING (auth.uid() = mentor_id);

-- Bookings: Users read own, Mentors read own
ALTER TABLE mentor_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own bookings" ON mentor_bookings FOR SELECT 
    USING (auth.uid() = user_id OR auth.uid() = mentor_id);
    
CREATE POLICY "Users create bookings" ON mentor_bookings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Mentors update own bookings" ON mentor_bookings FOR UPDATE
    USING (auth.uid() = mentor_id OR auth.uid() = user_id);

-- Reviews: Public read, User write own linked to booking
ALTER TABLE mentor_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON mentor_reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Users write reviews" ON mentor_reviews FOR INSERT 
    WITH CHECK (auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM mentor_bookings WHERE id = booking_id AND status = 'completed' AND user_id = auth.uid())
    );

-- =====================================================
-- 6. INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_mentor_specs_mentor ON mentor_specializations(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_avail_mentor ON mentor_availabilities(mentor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor_time ON mentor_bookings(mentor_id, start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON mentor_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_mentor ON mentor_reviews(mentor_id);
