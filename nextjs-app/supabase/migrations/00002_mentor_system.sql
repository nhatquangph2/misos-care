-- Create Mentors table
CREATE TABLE IF NOT EXISTS public.mentors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT, -- e.g. "Psychologist", "Life Coach"
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    education TEXT[], -- Array of strings e.g. ["PhD Psychology", "Certified Coach"]
    languages TEXT[], -- Array of strings e.g. ["Vietnamese", "English"]
    specialties TEXT[], -- Array of strings
    personality_match TEXT[], -- Array of strings (MBTI types)
    experience_years INTEGER DEFAULT 0,
    hourly_rate NUMERIC NOT NULL,
    currency TEXT DEFAULT 'VND',
    availability JSONB, -- { "monday": ["09:00", "15:00"] }
    rating NUMERIC DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Mentors
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active mentors
CREATE POLICY "Everyone can view active mentors" 
    ON public.mentors FOR SELECT 
    USING (is_active = true);

-- Create Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mentor_id UUID REFERENCES public.mentors(id) ON DELETE RESTRICT NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    total_price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'VND',
    status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    cancellation_reason TEXT,
    cancelled_by TEXT, -- user, mentor, system
    payment_status TEXT DEFAULT 'unpaid', -- unpaid, paid, refunded
    payment_method TEXT,
    payment_transaction_id TEXT,
    paid_at TIMESTAMPTZ,
    meeting_link TEXT,
    meeting_platform TEXT, -- google_meet, zoom
    user_notes TEXT,
    mentor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own bookings
CREATE POLICY "Users can view own bookings" 
    ON public.bookings FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookings
CREATE POLICY "Users can create bookings" 
    ON public.bookings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create Booking Reviews table
CREATE TABLE IF NOT EXISTS public.booking_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Reviews
ALTER TABLE public.booking_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "everyone_can_view_reviews" ON public.booking_reviews FOR SELECT USING (true);
CREATE POLICY "users_can_create_reviews" ON public.booking_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mentors_specialties ON public.mentors USING GIN (specialties);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor_id ON public.bookings(mentor_id);
