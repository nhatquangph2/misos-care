# MISO V3 - Meta-Analysis Integration System for Optimal Mental Health

## 🎯 Tổng quan

MISO V3 là hệ thống phân tích tâm lý meta-analysis tích hợp 4 công cụ đánh giá:
- **DASS-21**: Trầm cảm, Lo âu, Căng thẳng
- **Big Five (BFI-2)**: 5 chiều tính cách
- **VIA Character Strengths**: Điểm mạnh tính cách
- **MBTI**: Khung tham chiếu nhân cách

## ✅ Triển khai hoàn tất

### Giai đoạn 1: Nền tảng ✓
- ✅ `types/miso-v3.ts` - Đầy đủ TypeScript interfaces
- ✅ `supabase/migrations/20251217000000_add_miso_v3_tables.sql` - Database schema

### Giai đoạn 2: Math Engine ✓
- ✅ `lib/miso/constants.ts` - Normative data cho VN population
- ✅ `lib/miso/normalization.ts` - Z-score, percentile conversion, MBTI mapping

### Giai đoạn 3: Diagnostic Engine ✓
- ✅ `lib/miso/scoring.ts` - BVS, RCS, Predicted DASS
- ✅ `lib/miso/classifier.ts` - 8 Big Five Profiles (B1-B8)
- ✅ `lib/miso/discrepancy.ts` - 6 Discrepancy types (D1-D6)

### Giai đoạn 4: Intervention & Temporal ✓
- ✅ `lib/miso/interventions.ts` - Intervention library
- ✅ `lib/miso/temporal.ts` - RCI, trend analysis
- ✅ `lib/miso/lite-mode.ts` - DASS-only mode

### Giai đoạn 5: Integration ✓
- ✅ `lib/miso/engine.ts` - Main pipeline
- ✅ `lib/miso/index.ts` - Central exports
- ✅ `app/api/miso/analyze/route.ts` - API endpoint

## 📊 Data Completeness Levels

| Level | Data | Mode | Features |
|-------|------|------|----------|
| **MINIMAL** | DASS-21 only | LITE | Severity, First-aid, Crisis |
| **BASIC** | DASS + MBTI | BASIC | + MBTI profile |
| **STANDARD** | DASS + Big5 | STANDARD | + BVS, Discrepancy |
| **COMPREHENSIVE** | DASS + Big5 + VIA | FULL | + RCS, Strengths |
| **COMPLETE** | All 4 tests | FULL_PLUS | + Cross-validation |

## 🚀 Cách sử dụng

### 1. Import

```typescript
import { runMisoAnalysis, quickAnalyze } from '@/lib/miso'
```

### 2. Quick Analysis (DASS-21 only)

```typescript
const result = await quickAnalyze(
  { D: 12, A: 8, S: 14 }, // DASS scores
  userId
)

console.log(result.profile) // Profile classification
console.log(result.interventions) // Immediate actions
```

### 3. Full Analysis

```typescript
const result = await runMisoAnalysis(
  {
    dass21_raw: { D: 12, A: 8, S: 14 },
    big5_raw: { N: 28, E: 24, O: 38, A: 36, C: 32 },
    via_raw: { Hope: 3.5, Zest: 3.2, 'Self-Regulation': 3.0, Gratitude: 3.8 },
    mbti: 'INFP',
  },
  userId,
  history // Optional: previous test results
)

console.log(result.scores) // { BVS: 0.234, RCS: -0.156 }
console.log(result.profile) // B3: Introverted Neurotic
console.log(result.discrepancies) // [D5: Hope-Depression Paradox]
console.log(result.interventions) // Personalized intervention plan
```

### 4. API Endpoint

```bash
POST /api/miso/analyze
Content-Type: application/json

{
  "dass21_raw": { "D": 12, "A": 8, "S": 14 },
  "big5_raw": { "N": 28, "E": 24, "O": 38, "A": 36, "C": 32 },
  "via_raw": { "Hope": 3.5, "Zest": 3.2, "Self-Regulation": 3.0, "Gratitude": 3.8 },
  "mbti": "INFP",
  "include_history": true
}
```

Response:
```json
{
  "success": true,
  "analysis": {
    "version": "3.0",
    "completeness": { "level": "COMPLETE", "mode": "FULL_PLUS" },
    "scores": { "BVS": 0.234, "RCS": -0.156 },
    "profile": {
      "id": "B3",
      "name": "Introverted Neurotic",
      "risk_level": "HIGH"
    },
    "discrepancies": [...],
    "interventions": {...}
  }
}
```

## 🔑 Core Formulas

### Base Vulnerability Score (BVS)
```
BVS = (0.40 × Z_N) - (0.20 × Z_C) - (0.15 × Z_E)
```
- **High BVS** → Higher vulnerability to mental health issues
- **Low BVS** → More resilient

### Resilience Capacity Score (RCS)
```
RCS = (Z_Hope + Z_Zest + Z_SelfReg + Z_Gratitude) / 4
```
- **High RCS** → Strong protective factors
- **Low RCS** → Needs strength building

### Predicted DASS
```
Predicted = α + (β1 × BVS) - (β2 × RCS)
```
- Calibrated coefficients from real data
- **Delta** = Actual - Predicted
  - Delta > +10 → Acute stressor
  - Delta < -10 → Repressive coping

## 📋 8 Big Five Profiles

| ID | Profile | Condition | Risk | Intervention |
|----|---------|-----------|------|--------------|
| **B1** | Healthy Neurotic | N↑ C↑ | Medium | Relaxation |
| **B2** | Vulnerable | N↑ C↓ | High | Self-regulation |
| **B3** | Introverted Neurotic | N↑ E↓ | High | Social connection |
| **B4** | Misery Triad | N↑ E↓ C↓ | **CRITICAL** | All interventions |
| **B5** | Resilient | N↓ C↑ E↑ | Low | Growth challenge |
| **B6** | Agitated Neurotic | N↑ E↑ | Medium | Grounding |
| **B7** | Rigid Neurotic | N↑ O↓ | Medium | Behavioral therapy |
| **B8** | Sensitive Neurotic | N↑ O↑ | Medium | Mindfulness |

## 🚨 6 Discrepancy Types

| ID | Name | Pattern | Intervention |
|----|------|---------|--------------|
| **D1** | Acute Stress | Low N, High DASS_A | Problem-solving |
| **D2** | Repressive Coping | Low N, High DASS_S | Somatic therapy |
| **D4** | Severe Distress | High N+DASS | Crisis support |
| **D5** | Hope-Depression Paradox | High Hope, High DASS_D | Safety screening |
| **D6** | Unexpected Resilience | Vulnerable MBTI, Low DASS | Identify protective factors |
| **T1** | Big5 Instability | Rapid trait changes | Review consistency |

## 🔄 Temporal Analysis

### Reliable Change Index (RCI)
- **Depression**: ≥5 points = clinically significant
- **Anxiety**: ≥4 points
- **Stress**: ≥5.5 points

### Intervention Effectiveness
- **HIGHLY_EFFECTIVE**: ≥2 scales improved
- **EFFECTIVE**: ≥1 improved
- **MIXED**: Some improved, some worsened
- **INEFFECTIVE**: ≥2 worsened → Need reassessment

## 📦 Database Tables

### `miso_analysis_logs`
Stores complete analysis snapshots for temporal tracking.

### `prediction_feedback`
Stores predicted vs actual DASS for calibration engine.

### `calibration_coefficients`
Stores calibrated prediction coefficients per segment.

### `bfi2_results`, `dass21_results`, `via_results`
Test results with temporal tracking.

## 🛡️ Safety Features

### Fallback Mode
- System automatically switches to LITE mode if data incomplete
- Never crashes due to missing data

### Type Guards
- All inputs validated
- Scores clamped to valid ranges
- TypeScript ensures type safety

### Crisis Detection
- **B4 (Misery Triad)** → Automatic suicide risk screening
- **Extremely Severe DASS-D** → Crisis alert with hotline
- **D5 (Hope-Depression Paradox)** → "Smiling Depression" flag

## 📈 Next Steps

### Immediate
1. ✅ Run database migration
2. ✅ Test API endpoint
3. ⏳ Integrate into frontend dashboard

### Short-term
4. ⏳ Add visualization components
5. ⏳ Create intervention detail pages
6. ⏳ Build progress tracking UI

### Long-term
7. ⏳ Calibration engine auto-update
8. ⏳ Multi-language support
9. ⏳ AI-powered intervention recommendations

## 🔧 Running Migration

```bash
# Connect to Supabase
npx supabase login

# Run migration
npx supabase db push

# Or manually via Supabase dashboard:
# Copy content from supabase/migrations/20251217000000_add_miso_v3_tables.sql
# Paste into SQL Editor and run
```

## 📝 Testing

```typescript
// Test normalization
import { NormalizationEngine } from '@/lib/miso'

const engine = new NormalizationEngine()
const result = engine.normalize({
  big5_raw: { N: 28, E: 24, O: 38, A: 36, C: 32 },
  dass21_raw: { D: 12, A: 8, S: 14 },
})

console.log(result)

// Test profile classification
import { classifyBig5Profile } from '@/lib/miso'

const profile = classifyBig5Profile({
  N: 80, // High neuroticism
  E: 20, // Low extraversion
  C: 20, // Low conscientiousness
  O: 50,
  A: 50,
})

console.log(profile) // B4: Misery Triad
```

## 🎓 Academic References

1. **Big Five**: Costa & McCrae (1992), John et al. (2008)
2. **DASS-21**: Lovibond & Lovibond (1995)
3. **VIA**: Peterson & Seligman (2004)
4. **MBTI**: Myers & Briggs

## 📞 Support

Nếu có lỗi hoặc câu hỏi:
1. Check console logs for detailed errors
2. Verify database migration ran successfully
3. Ensure all test data is in valid ranges
4. Check API endpoint authentication

---

**Version**: 3.0
**Last Updated**: 2025-12-17
**Status**: ✅ Production Ready
