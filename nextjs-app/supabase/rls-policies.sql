-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Protect data access at database level
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE personality_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_alerts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can read their own data
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own data (during signup)
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- =====================================================
-- PERSONALITY PROFILES POLICIES
-- =====================================================

-- Users can read their own personality profile
CREATE POLICY "Users can view own personality profile"
ON personality_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own personality profile
CREATE POLICY "Users can create own personality profile"
ON personality_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own personality profile
CREATE POLICY "Users can update own personality profile"
ON personality_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- MENTAL HEALTH RECORDS POLICIES
-- =====================================================

-- Users can read their own mental health records
CREATE POLICY "Users can view own mental health records"
ON mental_health_records FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own mental health records
CREATE POLICY "Users can create own mental health records"
ON mental_health_records FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Note: No UPDATE/DELETE - records should be immutable for audit purposes

-- =====================================================
-- CHAT SESSIONS POLICIES
-- =====================================================

-- Users can read their own chat sessions
CREATE POLICY "Users can view own chat sessions"
ON chat_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own chat sessions
CREATE POLICY "Users can create own chat sessions"
ON chat_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own chat sessions
CREATE POLICY "Users can update own chat sessions"
ON chat_sessions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own chat sessions
CREATE POLICY "Users can delete own chat sessions"
ON chat_sessions FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- CHAT MESSAGES POLICIES
-- =====================================================

-- Users can read messages from their own sessions
CREATE POLICY "Users can view own chat messages"
ON chat_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
  )
);

-- Users can create messages in their own sessions
CREATE POLICY "Users can create messages in own sessions"
ON chat_messages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = session_id
    AND chat_sessions.user_id = auth.uid()
  )
);

-- Note: No UPDATE/DELETE - messages should be immutable

-- =====================================================
-- MENTORS TABLE POLICIES
-- =====================================================

-- Everyone (authenticated) can view active mentors
CREATE POLICY "Authenticated users can view active mentors"
ON mentors FOR SELECT
TO authenticated
USING (is_active = true);

-- Only service role can manage mentors (admin operation)
-- No policies for INSERT/UPDATE/DELETE - handled by admin/service role

-- =====================================================
-- BOOKINGS TABLE POLICIES
-- =====================================================

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own bookings
CREATE POLICY "Users can create own bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings (for cancellation, notes)
CREATE POLICY "Users can update own bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Mentors can view their bookings
CREATE POLICY "Mentors can view their bookings"
ON bookings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM mentors
    WHERE mentors.id = bookings.mentor_id
    AND mentors.email = auth.jwt() ->> 'email' -- Assuming mentor login uses same email
  )
);

-- =====================================================
-- BOOKING REVIEWS POLICIES
-- =====================================================

-- Users can view reviews for any booking (public)
CREATE POLICY "Users can view all booking reviews"
ON booking_reviews FOR SELECT
TO authenticated
USING (true);

-- Users can create review for their own completed bookings
CREATE POLICY "Users can create review for own bookings"
ON booking_reviews FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = booking_id
    AND bookings.user_id = auth.uid()
    AND bookings.status = 'completed'
  )
);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
ON booking_reviews FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PRODUCTS TABLE POLICIES
-- =====================================================

-- Everyone (authenticated) can view active products
CREATE POLICY "Authenticated users can view active products"
ON products FOR SELECT
TO authenticated
USING (is_active = true);

-- No INSERT/UPDATE/DELETE for users - admin only via service role

-- =====================================================
-- COMMUNITY GROUPS POLICIES
-- =====================================================

-- Everyone can view public groups
CREATE POLICY "Users can view public groups"
ON community_groups FOR SELECT
TO authenticated
USING (is_private = false OR id IN (
  SELECT group_id FROM group_members
  WHERE user_id = auth.uid() AND status = 'active'
));

-- No INSERT/UPDATE/DELETE for regular users - managed by admin

-- =====================================================
-- GROUP MEMBERS POLICIES
-- =====================================================

-- Users can view members of groups they belong to
CREATE POLICY "Users can view members of their groups"
ON group_members FOR SELECT
TO authenticated
USING (
  group_id IN (
    SELECT group_id FROM group_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Users can join groups (insert own membership)
CREATE POLICY "Users can join groups"
ON group_members FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can leave groups (delete own membership)
CREATE POLICY "Users can leave groups"
ON group_members FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- COMMUNITY POSTS POLICIES
-- =====================================================

-- Users can view approved posts in groups they belong to
CREATE POLICY "Users can view approved posts in their groups"
ON community_posts FOR SELECT
TO authenticated
USING (
  moderation_status = 'approved'
  AND group_id IN (
    SELECT group_id FROM group_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Users can view their own posts (any status)
CREATE POLICY "Users can view own posts"
ON community_posts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create posts in groups they belong to
CREATE POLICY "Users can create posts in their groups"
ON community_posts FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND group_id IN (
    SELECT group_id FROM group_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Users can update their own posts (within time limit)
CREATE POLICY "Users can update own posts"
ON community_posts FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  AND created_at > NOW() - INTERVAL '1 hour' -- Can only edit within 1 hour
)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
ON community_posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Moderators can update posts in their groups
CREATE POLICY "Moderators can update posts in their groups"
ON community_posts FOR UPDATE
TO authenticated
USING (
  group_id IN (
    SELECT group_id FROM group_members
    WHERE user_id = auth.uid()
    AND role IN ('moderator', 'admin')
    AND status = 'active'
  )
);

-- =====================================================
-- POST REPORTS POLICIES
-- =====================================================

-- Users can view their own reports
CREATE POLICY "Users can view own reports"
ON post_reports FOR SELECT
TO authenticated
USING (auth.uid() = reported_by);

-- Users can create reports
CREATE POLICY "Users can create reports"
ON post_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reported_by);

-- Moderators can view reports for their groups
CREATE POLICY "Moderators can view reports in their groups"
ON post_reports FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM community_posts
    JOIN group_members ON community_posts.group_id = group_members.group_id
    WHERE community_posts.id = post_reports.post_id
    AND group_members.user_id = auth.uid()
    AND group_members.role IN ('moderator', 'admin')
    AND group_members.status = 'active'
  )
);

-- Moderators can update report status
CREATE POLICY "Moderators can update reports in their groups"
ON post_reports FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM community_posts
    JOIN group_members ON community_posts.group_id = group_members.group_id
    WHERE community_posts.id = post_reports.post_id
    AND group_members.user_id = auth.uid()
    AND group_members.role IN ('moderator', 'admin')
    AND group_members.status = 'active'
  )
);

-- =====================================================
-- CRISIS ALERTS POLICIES
-- =====================================================

-- Users can view their own crisis alerts
CREATE POLICY "Users can view own crisis alerts"
ON crisis_alerts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- System can create crisis alerts (via service role or edge functions)
-- No user INSERT policy - handled by backend

-- Users can update resolution status of their own alerts
CREATE POLICY "Users can update own crisis alerts"
ON crisis_alerts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- ADMIN HELPER FUNCTIONS (Optional)
-- For checking admin status in RLS policies
-- =====================================================

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND email IN ('admin@misoscare.com', 'support@misoscare.com') -- Update with actual admin emails
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- END OF RLS POLICIES
-- =====================================================

-- Note: For production, you may want to add more granular policies,
-- especially for admin operations. Consider using a separate
-- 'admin_users' table or role-based access control (RBAC).
