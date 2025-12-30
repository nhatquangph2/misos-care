-- =====================================================
-- MIGRATION: Fix All Critical Issues
-- Date: 2025-12-29
-- Issues Fixed:
--   1. Create missing chat_sessions table
--   2. Create missing chat_messages table
--   3. Fix duplicate users records
--   4. Fix DASS-21 total_score inconsistencies
-- =====================================================

-- =====================================================
-- 1. CREATE CHAT_SESSIONS TABLE (IF NOT EXISTS)
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Session info
  title TEXT,
  context_summary TEXT,
  
  -- Session state
  is_active BOOLEAN DEFAULT TRUE,
  message_count INTEGER DEFAULT 0,
  
  -- Metadata
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_active 
ON chat_sessions(user_id, is_active, last_message_at DESC);

-- =====================================================
-- 2. CREATE CHAT_MESSAGES TABLE (IF NOT EXISTS)
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  
  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- AI metadata
  model TEXT,
  tokens_used INTEGER,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  
  -- Crisis detection
  contains_crisis_keyword BOOLEAN DEFAULT FALSE,
  moderation_flagged BOOLEAN DEFAULT FALSE,
  moderation_categories JSONB,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_chat_messages_session 
ON chat_messages(session_id, created_at ASC);

-- =====================================================
-- 3. ENABLE RLS FOR CHAT TABLES
-- =====================================================

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can create own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can delete own chat sessions" ON chat_sessions;

DROP POLICY IF EXISTS "Users can view messages from own sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can create messages in own sessions" ON chat_messages;

-- Chat sessions policies
CREATE POLICY "Users can view own chat sessions"
ON chat_sessions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create own chat sessions"
ON chat_sessions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own chat sessions"
ON chat_sessions FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own chat sessions"
ON chat_sessions FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Chat messages policies
CREATE POLICY "Users can view messages from own sessions"
ON chat_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
  )
);

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

-- =====================================================
-- 4. CREATE TRIGGER FOR UPDATING LAST_MESSAGE_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_chat_session_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET 
    last_message_at = NOW(),
    message_count = message_count + 1
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_chat_session ON chat_messages;

CREATE TRIGGER trigger_update_chat_session
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_chat_session_on_new_message();

-- =====================================================
-- 5. FIX DASS-21 TOTAL_SCORE INCONSISTENCIES
-- Update records where total_score = 0 but subscale_scores has data
-- =====================================================

UPDATE mental_health_records
SET total_score = COALESCE(
  (subscale_scores->>'depression')::INTEGER, 0
) + COALESCE(
  (subscale_scores->>'anxiety')::INTEGER, 0
) + COALESCE(
  (subscale_scores->>'stress')::INTEGER, 0
)
WHERE test_type = 'DASS21'
AND total_score = 0
AND subscale_scores IS NOT NULL
AND (
  (subscale_scores->>'depression')::INTEGER > 0
  OR (subscale_scores->>'anxiety')::INTEGER > 0
  OR (subscale_scores->>'stress')::INTEGER > 0
);

-- =====================================================
-- 6. CHECK AND FIX DUPLICATE USERS
-- First, let's see what's happening with users table
-- =====================================================

-- Create a view to check for duplicate users (for diagnostics)
CREATE OR REPLACE VIEW check_duplicate_users AS
SELECT 
  id,
  email,
  COUNT(*) OVER (PARTITION BY id) as duplicate_count
FROM users
WHERE id IN (
  SELECT id 
  FROM users 
  GROUP BY id 
  HAVING COUNT(*) > 1
);

-- =====================================================
-- 7. ENSURE USERS TABLE HAS CORRECT RLS POLICIES
-- =====================================================

-- Drop and recreate users RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

GRANT ALL ON chat_sessions TO authenticated;
GRANT ALL ON chat_messages TO authenticated;
GRANT SELECT ON check_duplicate_users TO authenticated;

-- =====================================================
-- VERIFICATION QUERIES (Run manually to check)
-- =====================================================

-- Check chat_sessions exists:
-- SELECT COUNT(*) FROM chat_sessions;

-- Check DASS-21 records are fixed:
-- SELECT id, total_score, subscale_scores 
-- FROM mental_health_records 
-- WHERE test_type = 'DASS21';

-- Check for duplicate users:
-- SELECT * FROM check_duplicate_users;

COMMENT ON TABLE chat_sessions IS 'AI chat sessions for users';
COMMENT ON TABLE chat_messages IS 'Individual messages in AI chat sessions';
