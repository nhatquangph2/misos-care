-- =====================================================
-- MIGRATION: Fix Missing User Record
-- Date: 2025-12-29
-- Issue: User exists in auth.users but not in public.users
-- =====================================================

-- =====================================================
-- 1. INSERT MISSING USER RECORD
-- =====================================================

-- Insert the specific user that's missing
INSERT INTO public.users (id, email, name, created_at, updated_at)
VALUES (
  '76279f0a-fd21-40ca-99a2-6aa116c7fb74', 
  'nhatquangph2@gmail.com', 
  'Nhật Quang',  -- You can change this name
  NOW(), 
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- =====================================================
-- 2. CREATE TRIGGER TO AUTO-CREATE USER PROFILE
-- This ensures new users automatically get a profile
-- =====================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create user profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 3. SYNC ALL EXISTING AUTH USERS TO PUBLIC.USERS
-- This catches any other users that might be missing
-- =====================================================

INSERT INTO public.users (id, email, name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'name', 
    au.raw_user_meta_data->>'full_name', 
    split_part(au.email, '@', 1)
  ) as name,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. VERIFY THE FIX
-- =====================================================

-- This should now return the user data
-- SELECT * FROM public.users WHERE id = '76279f0a-fd21-40ca-99a2-6aa116c7fb74';

COMMENT ON FUNCTION public.handle_new_user() IS 
'Automatically creates a user profile in public.users when a new user signs up via Supabase Auth';
