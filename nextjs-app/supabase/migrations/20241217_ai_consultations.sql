-- AI Consultations Table
-- Stores AI consultation history for analytics and user history

CREATE TABLE IF NOT EXISTS ai_consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL CHECK (issue_type IN ('stress', 'anxiety', 'depression', 'procrastination', 'relationships', 'general')),
  situation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_consultations_user_id ON ai_consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_consultations_created_at ON ai_consultations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_consultations_issue_type ON ai_consultations(issue_type);

-- Row Level Security (RLS)
ALTER TABLE ai_consultations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own consultations"
  ON ai_consultations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consultations"
  ON ai_consultations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consultations"
  ON ai_consultations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own consultations"
  ON ai_consultations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_consultations_updated_at
  BEFORE UPDATE ON ai_consultations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE ai_consultations IS 'Stores AI consultation history for analytics and user access';
COMMENT ON COLUMN ai_consultations.issue_type IS 'Type of issue: stress, anxiety, depression, procrastination, relationships, general';
COMMENT ON COLUMN ai_consultations.situation IS 'User-described situation/problem';
