-- Fix RLS Policies for user_ocean_items
-- Problem: Users cannot buy items (INSERT) because likely no policy exists.

-- 1. Ensure RLS is enabled
ALTER TABLE user_ocean_items ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts (if any partial ones exist)
DROP POLICY IF EXISTS "Users can view own ocean items" ON user_ocean_items;
DROP POLICY IF EXISTS "Users can insert own ocean items" ON user_ocean_items;
DROP POLICY IF EXISTS "Users can update own ocean items" ON user_ocean_items;
DROP POLICY IF EXISTS "Users can delete own ocean items" ON user_ocean_items;

-- 3. Re-create Policies

-- SELECT: Already seemed to work, but good to ensure
CREATE POLICY "Users can view own ocean items"
ON user_ocean_items FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: The missing piece!
CREATE POLICY "Users can insert own ocean items"
ON user_ocean_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: For placement toggling
CREATE POLICY "Users can update own ocean items"
ON user_ocean_items FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE: If we ever implementation removing items
CREATE POLICY "Users can delete own ocean items"
ON user_ocean_items FOR DELETE
USING (auth.uid() = user_id);

-- 4. Just in case table doesn't exist (unlikely given Select works)
-- We won't add CREATE TABLE here to avoid errors if it does exist with different schema.
-- Assuming table exists.
