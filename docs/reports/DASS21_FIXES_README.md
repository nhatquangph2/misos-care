# DASS-21 System Fixes - Complete Documentation

**Date:** December 18, 2025
**Status:** ✅ COMPLETED
**Severity:** CRITICAL BUG FIXES

---

## 🎯 Executive Summary

This document details comprehensive fixes to the DASS-21 (Depression, Anxiety and Stress Scale) system, addressing **critical data consistency bugs** and **standardization issues** that prevented charts from displaying correctly and caused data mismatches across the system.

### Issues Fixed

| Issue | Severity | Impact | Status |
|-------|----------|--------|--------|
| Key Mismatch (Vietnamese vs English) | 🔴 CRITICAL | Charts not displaying data | ✅ FIXED |
| Raw vs Normalized confusion | 🟠 HIGH | Data inconsistency across system | ✅ FIXED |
| MISO V3 receiving wrong data | 🟠 HIGH | Incorrect BVS/RCS calculations | ✅ FIXED |
| AI Consultant missing DASS-21 | 🟡 MEDIUM | AI unaware of current mental health | ✅ FIXED |
| Chart scale mismatch | 🟠 HIGH | Incorrect severity colors | ✅ FIXED |

---

## 📊 What Changed

### Before (❌ Broken)

```typescript
// Saved to database
{
  "subscale_scores": {
    "Trầm cảm": 12,  // Vietnamese key, raw score (0-21)
    "Lo âu": 8,
    "Stress": 14
  },
  "total_score": 34  // Sum of raw scores
}

// Read by chart
subscales.depression  // ❌ undefined (key doesn't exist)
subscales.anxiety     // ❌ undefined
subscales.stress      // ❌ undefined
// Result: Chart shows all zeros!
```

### After (✅ Fixed)

```typescript
// Saved to database
{
  "subscale_scores": {
    "depression": 24,  // English key, normalized score (0-42)
    "anxiety": 16,
    "stress": 28
  },
  "total_score": 68  // Sum of normalized scores
}

// Read by chart
subscales.depression  // ✅ 24
subscales.anxiety     // ✅ 16
subscales.stress      // ✅ 28
// Result: Chart displays correctly!
```

---

## 🔧 Technical Changes

### 1. Database Schema (`supabase/schema.sql`)

**Updated:**
```sql
-- Old comment (ambiguous)
subscale_scores JSONB, -- For DASS-21: {depression: 12, anxiety: 8, stress: 14}

-- New comment (clear)
-- For DASS-21: Stores NORMALIZED scores (0-42) with English keys
-- Format: {"depression": 24, "anxiety": 16, "stress": 28}
-- total_score for DASS-21 = sum of normalized scores (0-126)
subscale_scores JSONB,
```

### 2. Results Page (`app/(dashboard)/tests/dass21/results/page.tsx`)

**Changed Lines 67-71:**

```typescript
// OLD (WRONG)
totalScore += subscale.rawScore  // Raw 0-21
subscaleScoresObj[subscale.subscaleName] = subscale.rawScore  // Vietnamese key

// NEW (CORRECT)
totalScore += subscale.normalizedScore  // Normalized 0-42
subscaleScoresObj[subscale.subscale] = subscale.normalizedScore  // English key
```

**Example output:**
```typescript
// Old
{ "Trầm cảm": 12, "Lo âu": 8, "Stress": 14 }  // total: 34

// New
{ "depression": 24, "anxiety": 16, "stress": 28 }  // total: 68
```

### 3. Profile Service (`services/profile.service.ts`)

**Added backward compatibility** for legacy data:

```typescript
// Try new format first
if (subscales.depression !== undefined) {
  dayData.depression = subscales.depression;  // Already normalized
}
// Fallback to legacy format
else if (subscales['Trầm cảm'] !== undefined) {
  dayData.depression = subscales['Trầm cảm'] * 2;  // Convert raw → normalized
}
```

This ensures:
- ✅ New data works correctly
- ✅ Old data still displays (auto-converted on read)
- ✅ No data loss during transition

### 4. AI Consultant (`services/ai-consultant.service.ts`)

**Added DASS-21 to ConsultationRequest interface:**

```typescript
export interface ConsultationRequest {
  userProfile: {
    big5Score: BFI2Score
    mbtiType?: string
    viaStrengths?: string[]
    // ✅ NEW: Current mental health state
    dass21Scores?: {
      depression: number      // 0-42 (normalized)
      anxiety: number         // 0-42 (normalized)
      stress: number          // 0-42 (normalized)
      depressionSeverity: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely-severe'
      anxietySeverity: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely-severe'
      stressSeverity: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely-severe'
    }
  }
  // ...
}
```

**Enhanced buildPersonalityContext():**

Now includes DASS-21 current state and compares with Big5 traits:

```typescript
CURRENT MENTAL HEALTH STATE (DASS-21):
- Depression: 24/42 (moderate)
- Anxiety: 16/42 (mild)
- Stress: 28/42 (moderate)
  ⚠️ MODERATE STRESS - Watch for burnout

PERSONALITY PROFILE (Big Five):
- High Negative Emotionality (trait: tends toward anxiety/stress)
  → Particularly high in Depression facet (trait)
  ℹ️ High depression trait but current state is moderate - decent coping
```

This allows AI to:
- ✅ Know current mental health state (DASS-21 scores)
- ✅ Compare state vs trait (current symptoms vs personality tendency)
- ✅ Provide more accurate, context-aware recommendations

### 5. MISO V3 Type Documentation (`types/miso-v3.ts`)

**Clarified DASS21RawScores interface:**

```typescript
export interface DASS21RawScores {
  // IMPORTANT: These are NORMALIZED scores (0-42), NOT raw (0-21)
  // DASS-21 raw scores (7 questions × 0-3) = 0-21
  // Normalized scores = raw × 2 = 0-42 (to match DASS-42 scale)
  D: number // Depression (0-42 normalized)
  A: number // Anxiety (0-42 normalized)
  S: number // Stress (0-42 normalized)
}
```

**Note:** Despite the name "RawScores", MISO V3 expects **normalized** scores. The "raw" refers to "raw user input" vs "percentile/z-score transformed".

---

## 🗄️ Database Migration

### Migration Script

**File:** `supabase/migrations/20251218_normalize_dass21_scores.sql`

This script automatically converts ALL existing DASS-21 records:

1. **Detects format:**
   - Vietnamese keys (`Trầm cảm`, `Lo âu`) → Old format
   - English keys with scores ≤ 21 → Raw scores that need normalization
   - English keys with scores > 21 → Already normalized (skip)

2. **Converts data:**
   - Changes Vietnamese → English keys
   - Multiplies raw scores (0-21) by 2 → normalized (0-42)
   - Updates total_score

3. **Example conversion:**
   ```sql
   -- Before
   subscale_scores: {"Trầm cảm": 12, "Lo âu": 8, "Stress": 14}
   total_score: 34

   -- After
   subscale_scores: {"depression": 24, "anxiety": 16, "stress": 28}
   total_score: 68
   ```

### Running the Migration

```bash
# Connect to your Supabase database
psql -h <your-db-host> -U postgres

# Run the migration
\i nextjs-app/supabase/migrations/20251218_normalize_dass21_scores.sql
```

**Expected output:**
```
NOTICE:  Starting DASS-21 data normalization migration...
NOTICE:  Converting record <uuid>: OLD format detected
NOTICE:  Record <uuid>: Converted from raw (12 + 8 + 14 = 34) to normalized (24 + 16 + 28 = 68)
...
NOTICE:  Migration completed! Updated X records
```

---

## 📐 DASS-21 Standard Reference

### Score Ranges

| Component | Raw (7 questions) | Normalized (×2) | Range |
|-----------|-------------------|-----------------|-------|
| Depression | 0-21 | 0-42 | 0-42 |
| Anxiety | 0-21 | 0-42 | 0-42 |
| Stress | 0-21 | 0-42 | 0-42 |
| **Total** | **0-63** | **0-126** | **0-126** |

### Severity Cutoffs (Normalized)

**Depression:**
- Normal: 0-9
- Mild: 10-13
- Moderate: 14-20
- Severe: 21-27
- Extremely Severe: 28+

**Anxiety:**
- Normal: 0-7
- Mild: 8-9
- Moderate: 10-14
- Severe: 15-19
- Extremely Severe: 20+

**Stress:**
- Normal: 0-14
- Mild: 15-18
- Moderate: 19-25
- Severe: 26-33
- Extremely Severe: 34+

### Why Normalize?

DASS-21 is a shortened version of DASS-42. To compare results with research literature and clinical norms (which use DASS-42), scores are multiplied by 2.

**Reference:** Lovibond & Lovibond (1995). Manual for the Depression Anxiety Stress Scales.

---

## ✅ Verification Checklist

After deploying these fixes, verify:

- [ ] **New tests save correctly**
  ```sql
  SELECT subscale_scores, total_score
  FROM mental_health_records
  WHERE test_type = 'DASS21'
  ORDER BY created_at DESC LIMIT 1;

  -- Should show:
  -- subscale_scores: {"depression": XX, "anxiety": XX, "stress": XX}
  -- total_score: 0-126 range
  ```

- [ ] **Charts display data**
  - Navigate to `/profile`
  - Check "Mental Health Trends" chart
  - Should show 3 lines (Depression, Anxiety, Stress)
  - Values should be 0-42 range

- [ ] **MISO V3 receives correct data**
  ```sql
  SELECT dass21_depression, dass21_anxiety, dass21_stress
  FROM miso_analysis_logs
  ORDER BY created_at DESC LIMIT 1;

  -- Should show normalized scores (0-42 each)
  ```

- [ ] **AI Consultant has DASS-21**
  - Use AI consultant feature
  - Check if personality context mentions current mental health state
  - Should see "CURRENT MENTAL HEALTH STATE (DASS-21)" section

- [ ] **Legacy data still works**
  ```sql
  -- Run migration script
  -- Check old records now have English keys + normalized scores
  SELECT id, subscale_scores, total_score
  FROM mental_health_records
  WHERE test_type = 'DASS21'
    AND created_at < '2025-12-18';
  ```

---

## 🎓 For Developers

### Data Format Standard

**Always use:**
- ✅ **Keys:** English (`depression`, `anxiety`, `stress`)
- ✅ **Scores:** Normalized 0-42
- ✅ **Total:** Sum of normalized (0-126)

**Never use:**
- ❌ Vietnamese keys (`Trầm cảm`, `Lo âu`)
- ❌ Raw scores without normalization
- ❌ Mixed formats

### When Reading DASS-21 Data

```typescript
// ✅ CORRECT: Try both formats for backward compatibility
if (subscales.depression !== undefined) {
  score = subscales.depression;  // New format (normalized)
} else if (subscales['Trầm cảm'] !== undefined) {
  score = subscales['Trầm cảm'] * 2;  // Legacy format (convert)
}
```

### When Writing DASS-21 Data

```typescript
// ✅ CORRECT: Always use English keys + normalized scores
const subscaleScores = {
  depression: normalizedDepressionScore,  // 0-42
  anxiety: normalizedAnxietyScore,        // 0-42
  stress: normalizedStressScore           // 0-42
}
```

---

## 📚 References

1. **DASS Manual:** Lovibond, S.H. & Lovibond, P.F. (1995). Manual for the Depression Anxiety & Stress Scales. Sydney: Psychology Foundation.

2. **Psychometric Properties:** Antony, M.M., et al. (1998). Psychometric properties of the 42-item and 21-item versions of the Depression Anxiety Stress Scales. Psychological Assessment, 10(2), 176-181.

3. **UK Norms:** Henry, J.D., & Crawford, J.R. (2005). The short-form version of the Depression Anxiety Stress Scales (DASS-21): Construct validity and normative data in a large non-clinical sample. British Journal of Clinical Psychology, 44(2), 227-239.

4. **Vietnam Norms:** Used in `lib/miso/constants.ts` (D: mean=7.2, sd=7.5; A: mean=5.8, sd=5.6; S: mean=11.4, sd=8.3)

---

## 🐛 Bug Tracking

**Original Issues:**
- #CRITICAL-001: Chart not displaying DASS-21 data
- #HIGH-002: MISO V3 receiving raw instead of normalized scores
- #HIGH-003: Data inconsistency between database and application
- #MEDIUM-004: AI Consultant not using current mental health state

**Resolution:** All issues resolved in this update (2025-12-18)

---

## 📞 Support

If you encounter issues after this update:

1. **Check migration ran successfully:**
   ```bash
   psql -c "SELECT COUNT(*) FROM mental_health_records WHERE test_type='DASS21' AND subscale_scores ? 'depression'"
   ```
   Should return total DASS-21 records count.

2. **Verify new tests:**
   - Take a new DASS-21 test
   - Check database immediately
   - Confirm English keys + normalized scores

3. **Clear cache:**
   - Browser: Clear localStorage
   - Server: Restart Next.js dev server

For persistent issues, check:
- `nextjs-app/app/(dashboard)/tests/dass21/results/page.tsx:67-71`
- `nextjs-app/services/profile.service.ts:114-136`

---

**END OF DOCUMENT**

*Generated: 2025-12-18*
*Version: 1.0*
*Status: Production Ready*
