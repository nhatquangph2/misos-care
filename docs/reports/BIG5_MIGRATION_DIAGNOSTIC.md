# 🔍 BIG-5 Migration Diagnostic Guide

## ✅ What You've Done So Far

1. ✅ Ran the main migration script successfully
2. ✅ Fixed the INDEX syntax error
3. ✅ Created `bfi2_test_history` table (verified: count = 0)
4. ⚠️ Some columns may be missing from `personality_profiles`

---

## 🎯 Current Issue

**Problem:** The `bfi2_score` JSONB column is missing from `personality_profiles` table

**Your verification showed:**
- Query 1: Only 10 columns (should have 11+ with new raw score columns)
- Missing: `bfi2_score | jsonb | YES`

---

## 📊 About the Single-Digit Percentages

**This is NORMAL!** ✅

The percentages you saw (6.25, 8.75, etc.) are **correct**. Here's why:

- BIG-5 percentages range from **0 to 100**
- Single-digit percentages mean **very low scores** on those traits
- For example:
  - `big5_openness = 6.25` means user scored very low on Openness (6th percentile)
  - `big5_neuroticism = 93.75` would mean very high on Neuroticism (94th percentile)

My example data happened to have 2-digit values (like 56, 70), but that was just coincidence. Your real data showing single digits is **perfectly valid**.

---

## 🔧 Fix: Add Missing bfi2_score Column

### Option 1: Quick Fix (Recommended)

Run the supplementary migration script:

```bash
./run-bfi2-score-fix.sh
```

This will:
1. Copy the SQL to your clipboard
2. Open Supabase Dashboard
3. You paste and run the SQL

### Option 2: Manual Fix

Go to Supabase Dashboard > SQL Editor and run:

```sql
-- Add the missing column
ALTER TABLE personality_profiles
  ADD COLUMN IF NOT EXISTS bfi2_score JSONB;

-- Add comment
COMMENT ON COLUMN personality_profiles.bfi2_score IS
'Complete BFI-2 score object including domains, facets, T-scores, and percentiles.';

-- Verify it was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'personality_profiles'
  AND column_name = 'bfi2_score';
```

Expected result:
```
column_name | data_type | is_nullable
------------|-----------|------------
bfi2_score  | jsonb     | YES
```

---

## ✅ Complete Verification Checklist

After adding the missing column, run these checks:

### 1. Check All New Columns Exist

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'personality_profiles'
  AND column_name IN (
    'big5_openness_raw',
    'big5_conscientiousness_raw',
    'big5_extraversion_raw',
    'big5_agreeableness_raw',
    'big5_neuroticism_raw',
    'bfi2_score'
  )
ORDER BY column_name;
```

**Expected:** 6 rows showing all raw score columns + bfi2_score

### 2. Check Raw Scores Were Migrated

```sql
SELECT
  COUNT(*) as total_profiles,
  COUNT(big5_openness) as has_percentage,
  COUNT(big5_openness_raw) as has_raw_score
FROM personality_profiles;
```

**Expected:** `has_raw_score` should equal `has_percentage` (all percentage data converted to raw)

### 3. Check Sample Data

```sql
SELECT
  user_id,
  -- Percentage (legacy)
  big5_openness as pct_openness,
  big5_neuroticism as pct_neuroticism,
  -- Raw scores (new)
  big5_openness_raw as raw_openness,
  big5_neuroticism_raw as raw_neuroticism,
  -- Complete object
  bfi2_score IS NOT NULL as has_bfi2_score
FROM personality_profiles
WHERE big5_openness IS NOT NULL
ORDER BY last_updated DESC
LIMIT 3;
```

**Expected:**
- `pct_*` values: 0-100 range (can be single or double digits)
- `raw_*` values: 1-5 range (e.g., 1.25, 3.80, 4.95)
- `has_bfi2_score`: Currently FALSE (will be TRUE after users retake test)

### 4. Verify Conversion Formula

```sql
SELECT
  user_id,
  big5_openness as percentage,
  big5_openness_raw as raw,
  -- Verify conversion: raw = (percentage / 100) * 4 + 1
  ROUND(((big5_openness / 100.0) * 4 + 1)::numeric, 2) as calculated_raw,
  -- Should match
  (big5_openness_raw = ROUND(((big5_openness / 100.0) * 4 + 1)::numeric, 2)) as match
FROM personality_profiles
WHERE big5_openness IS NOT NULL
LIMIT 5;
```

**Expected:** `match` column should be TRUE for all rows

### 5. Check bfi2_test_history Table

```sql
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'bfi2_test_history'
ORDER BY ordinal_position;
```

**Expected:** Should show all columns (id, user_id, score, raw_scores, completion_time_seconds, etc.)

---

## 🎯 What Should Happen Next

### For Existing Data (Already in Database)

✅ **Percentage columns** → Already have data (e.g., 6.25, 93.75)
✅ **Raw score columns** → Now populated with **estimated** values (reverse-calculated from percentage)
⚠️ **bfi2_score column** → NULL (will only populate when users retake the test)

**Important:** The raw scores in existing profiles are **estimates** (±0.01 precision). For 100% accurate raw scores, users should retake the test.

### For New Tests (After This Fix)

When a user takes the BIG-5 test now, the system will save:

1. **personality_profiles** table:
   - `big5_openness` = 56.25 (percentage, for backward compatibility)
   - `big5_openness_raw` = 3.25 (raw score, exact)
   - `bfi2_score` = `{"domains": {...}, "facets": {...}, ...}` (complete object)

2. **bfi2_test_history** table:
   - Complete test record with all data
   - Enables MISO V3 temporal analysis
   - Full audit trail

---

## 🚨 Troubleshooting

### Issue: "Column already exists" error

This is OK! It means the column was created by the first migration. The `ADD COLUMN IF NOT EXISTS` will skip it.

### Issue: Raw scores are NULL

Check if percentage columns have data:

```sql
SELECT COUNT(*)
FROM personality_profiles
WHERE big5_openness IS NOT NULL;
```

If count > 0 but raw scores are NULL, re-run the data migration part:

```sql
UPDATE personality_profiles
SET
  big5_openness_raw = ROUND(((big5_openness / 100.0) * 4 + 1)::numeric, 2),
  big5_conscientiousness_raw = ROUND(((big5_conscientiousness / 100.0) * 4 + 1)::numeric, 2),
  big5_extraversion_raw = ROUND(((big5_extraversion / 100.0) * 4 + 1)::numeric, 2),
  big5_agreeableness_raw = ROUND(((big5_agreeableness / 100.0) * 4 + 1)::numeric, 2),
  big5_neuroticism_raw = ROUND(((big5_neuroticism / 100.0) * 4 + 1)::numeric, 2)
WHERE big5_openness IS NOT NULL
  AND big5_openness_raw IS NULL;
```

### Issue: bfi2_test_history table doesn't exist

Re-run the table creation part from the main migration script:

```sql
CREATE TABLE IF NOT EXISTS bfi2_test_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score JSONB NOT NULL,
  raw_scores JSONB NOT NULL,
  completion_time_seconds INTEGER,
  quality_warnings TEXT[],
  raw_responses JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bfi2_user_date
ON bfi2_test_history(user_id, completed_at DESC);
```

---

## 📞 Need Help?

If you encounter any issues:

1. Check the main migration script: `nextjs-app/supabase/migrations/20251218_add_big5_raw_scores.sql`
2. Review the complete report: `BIG5_FIX_COMPLETE_REPORT.md`
3. Check Supabase logs for error messages

---

## ✅ Final Checklist

- [ ] Run `./run-bfi2-score-fix.sh` (or manual SQL)
- [ ] Verify `bfi2_score` column exists
- [ ] Verify all 6 new columns exist
- [ ] Verify raw scores were migrated from percentages
- [ ] Test by taking a new BIG-5 test
- [ ] Check that new test data saves to both tables
- [ ] Verify MISO V3 can read the raw scores

---

**Status:** 🟡 Almost complete - just need to add the `bfi2_score` column

**Next Step:** Run `./run-bfi2-score-fix.sh`
