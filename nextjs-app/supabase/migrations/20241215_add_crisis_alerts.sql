-- =====================================================
-- Crisis Alerts System Migration
-- =====================================================

-- Create crisis_alerts table
CREATE TABLE IF NOT EXISTS crisis_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL,
  severity_level TEXT NOT NULL DEFAULT 'severe',
  crisis_reason TEXT,
  total_score INTEGER,
  question_9_score INTEGER, -- For PHQ-9 suicidal ideation tracking
  user_contact_info JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'in_progress', 'resolved')),
  handled_by UUID REFERENCES users(id),
  handler_notes TEXT,
  follow_up_date TIMESTAMPTZ,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create crisis_alert_logs table for activity tracking
CREATE TABLE IF NOT EXISTS crisis_alert_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES crisis_alerts(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  performed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crisis_alerts_user_id ON crisis_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_crisis_alerts_status ON crisis_alerts(status);
CREATE INDEX IF NOT EXISTS idx_crisis_alerts_created_at ON crisis_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crisis_alert_logs_alert_id ON crisis_alert_logs(alert_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- RLS Policies for crisis_alerts
ALTER TABLE crisis_alerts ENABLE ROW LEVEL SECURITY;

-- Users can view their own alerts
CREATE POLICY "Users can view own crisis alerts" ON crisis_alerts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own alerts
CREATE POLICY "Users can create own crisis alerts" ON crisis_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mentors/Admins can view all alerts (handled in API layer)
CREATE POLICY "Service role can view all crisis alerts" ON crisis_alerts
  FOR ALL USING (true);

-- RLS Policies for crisis_alert_logs
ALTER TABLE crisis_alert_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view crisis alert logs" ON crisis_alert_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM crisis_alerts
      WHERE crisis_alerts.id = crisis_alert_logs.alert_id
      AND crisis_alerts.user_id = auth.uid()
    )
  );

-- RLS Policies for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- System can create notifications for any user
CREATE POLICY "Service role can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- Add sisri24_scores to personality_profiles if not exists
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'personality_profiles'
    AND column_name = 'sisri24_scores'
  ) THEN
    ALTER TABLE personality_profiles ADD COLUMN sisri24_scores JSONB;
  END IF;
END $$;
