# 🚀 DASS-21 Migration Quick Start Guide

## ⚡ Fastest Method (Recommended)

### Option 1: Supabase Dashboard SQL Editor (5 minutes)

**Bước 1:** Mở Supabase SQL Editor
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
```

**Bước 2:** Click "New Query"

**Bước 3:** Copy toàn bộ nội dung file này:
```
nextjs-app/supabase/migrations/20251218_normalize_dass21_scores.sql
```

**Bước 4:** Paste vào editor và click **"Run"**

**Bước 5:** Xem kết quả trong Messages panel:
```
NOTICE:  Starting DASS-21 data normalization migration...
NOTICE:  Converting record xxx: OLD format detected
NOTICE:  Record xxx: Converted from raw (12 + 8 + 14 = 34) to normalized (24 + 16 + 28 = 68)
...
NOTICE:  Migration completed! Updated X records
```

✅ **Done!** Migration hoàn tất.

---

## 🔧 Option 2: Using Supabase CLI (If installed)

### Install Supabase CLI (if not yet)
```bash
npm install -g supabase
```

### Run Migration
```bash
cd nextjs-app
supabase migration up
```

---

## 💻 Option 3: Using psql (Advanced)

### Bước 1: Get Connection String

Vào Supabase Dashboard:
```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/database
```

Copy **Connection string** (dạng Transaction hoặc Session)

### Bước 2: Run Migration

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres" \
  -f nextjs-app/supabase/migrations/20251218_normalize_dass21_scores.sql
```

---

## ✅ Verification (Kiểm tra sau khi chạy)

### 1. Check Sample Records

Run query này trong Supabase SQL Editor:

```sql
SELECT
  id,
  test_type,
  subscale_scores,
  total_score,
  completed_at
FROM mental_health_records
WHERE test_type = 'DASS21'
ORDER BY completed_at DESC
LIMIT 5;
```

**Expected Result:**
```json
{
  "subscale_scores": {
    "depression": 24,  // English keys
    "anxiety": 16,     // Normalized (0-42)
    "stress": 28
  },
  "total_score": 68   // Sum of normalized
}
```

### 2. Check Statistics

```sql
SELECT
  COUNT(*) as total_records,
  AVG(total_score) as avg_total,
  MIN(total_score) as min_total,
  MAX(total_score) as max_total
FROM mental_health_records
WHERE test_type = 'DASS21';
```

**Expected:**
- `total_score` should be in range **0-126** (not 0-63)
- If you had old data with Vietnamese keys, count should match

### 3. Test New DASS-21

1. Go to `/tests/dass21`
2. Take a new test
3. Check database:
   ```sql
   SELECT subscale_scores FROM mental_health_records
   WHERE test_type = 'DASS21'
   ORDER BY created_at DESC LIMIT 1;
   ```
4. Should see: `{"depression": XX, "anxiety": XX, "stress": XX}`

### 4. Check Chart

1. Go to `/profile`
2. Look at "Mental Health Trends" chart
3. Should see 3 lines (Depression, Anxiety, Stress)
4. Lines should display with correct values (not zeros)

---

## 🆘 Troubleshooting

### Issue: "Permission Denied"

**Solution:** Make sure you're using the correct credentials. Try Session pooler instead of Transaction pooler.

### Issue: "Table not found"

**Solution:** Your database might not have `mental_health_records` table yet. Run the main schema first:
```bash
supabase db reset
```

### Issue: "No records updated"

**Cause:** No DASS-21 records in database yet, or all already in new format.

**Verification:**
```sql
SELECT COUNT(*) FROM mental_health_records WHERE test_type = 'DASS21';
```

If count is 0, that's normal - migration will apply to future records automatically.

---

## 📊 What This Migration Does

### Before
```json
{
  "subscale_scores": {
    "Trầm cảm": 12,  // Vietnamese, raw (0-21)
    "Lo âu": 8,
    "Stress": 14
  },
  "total_score": 34
}
```

### After
```json
{
  "subscale_scores": {
    "depression": 24,  // English, normalized (0-42)
    "anxiety": 16,
    "stress": 28
  },
  "total_score": 68
}
```

### Changes
- ✅ Vietnamese → English keys
- ✅ Raw (0-21) → Normalized (0-42) by multiplying ×2
- ✅ Total score updated (0-126 instead of 0-63)
- ✅ Backward compatible - old code still works

---

## 🎯 Quick Copy-Paste Script

### For Mac/Linux Terminal:

```bash
# Navigate to project
cd /Users/tranhuykhiem/.claude-worktrees/misos-care/focused-ramanujan

# Run interactive migration helper
./run-dass21-migration.sh
```

Choose option based on your preference:
- **Option 1:** Use Supabase CLI (if installed)
- **Option 2:** Use psql with connection string
- **Option 3:** Show SQL to copy to Supabase Dashboard

---

## 📞 Need Help?

If you encounter any issues:

1. Check `DASS21_FIXES_README.md` for full documentation
2. Check git commit `8bae615` for exact changes
3. Verify your Supabase project is accessible
4. Make sure you have the right permissions (postgres user)

---

**Last Updated:** 2025-12-18
**Migration File:** `nextjs-app/supabase/migrations/20251218_normalize_dass21_scores.sql`
**Status:** ✅ Ready to Run
