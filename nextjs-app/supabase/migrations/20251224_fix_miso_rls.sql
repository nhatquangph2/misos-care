-- Enable RLS for bfi2_test_history (missing in previous migration)
ALTER TABLE bfi2_test_history ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own BFI-2 history
DROP POLICY IF EXISTS "Users can view own bfi2 history" ON bfi2_test_history;
CREATE POLICY "Users can view own bfi2 history" ON bfi2_test_history
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own BFI-2 history
DROP POLICY IF EXISTS "Users can insert own bfi2 history" ON bfi2_test_history;
CREATE POLICY "Users can insert own bfi2 history" ON bfi2_test_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Verify RLS on mental_health_records (should already be there, but ensuring)
ALTER TABLE mental_health_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own mental health records" ON mental_health_records;
CREATE POLICY "Users can view own mental health records" ON mental_health_records
  FOR SELECT USING (auth.uid() = user_id);
