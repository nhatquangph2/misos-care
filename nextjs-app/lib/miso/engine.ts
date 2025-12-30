/**
 * MISO V3 - Main Meta-Analysis Engine
 * Complete processing pipeline integrating all modules
 * Section 12 of specification
 */

import { NormalizationEngine } from './normalization'
import { calculateAllScores } from './scoring'
import { classifyBig5Profile } from './classifier'
import { detectDiscrepancies, prioritizeDiscrepancies } from './discrepancy'
import { allocateInterventions } from './interventions'
import { analyzeDASSTrend, analyzeBig5Stability } from './temporal'
import { analyzeDASS21Only, assessDataCompleteness } from './lite-mode'
import { predictDASSFromBig5, applyVIACompensation, calculateResidualDistress } from './mechanisms'
import { findVIAProblemMatches } from './mbti-via-integration'
import { calculateZPD, assessSDTNeeds } from './scientific-scoring'
import type {
  UserInputData,
  MisoAnalysisResult,
  Big5Percentiles,
  VIAPercentiles,
  VIAAnalysis,
} from '@/types/miso-v3'
import { VIA_STRENGTH_DETAILS } from '@/constants/tests/via-questions'


// ============================================
// VIA ANALYSIS HELPER
// ============================================

export function analyzeFullVIA(
  viaPercentiles: Partial<VIAPercentiles>,
  dassRaw: { D: number; A: number; S: number },
  big5Percentiles: Partial<Big5Percentiles>
): VIAAnalysis {
  const analysis: VIAAnalysis = {
    protective_factors: [],
    risk_factors: [],
    build_strengths: [],
    interpretation: '',
    priority_intervention: null,
    // Initialize new fields
    signature_strengths: [],
    weaknesses: [],
    virtue_profile: [],
  }

  const VIA_HIGH = 70
  const VIA_LOW = 30
  const DASS_HIGH = { D: 20, A: 14, S: 25 }

  // 1. FULL RANKING ANALYSIS
  // ============================================
  const strengthScores = Object.entries(viaPercentiles).map(([key, score]) => {
    // Normalize key to match VIA_STRENGTH_DETAILS keys (snake_case vs CamelCase/kebab)
    // Keys in viaPercentiles seem to be 'Hope', 'Zest', 'Self-Regulation' etc.
    // VIA_STRENGTH_DETAILS keys are 'hope', 'zest', 'self_regulation'
    let normKey = key.toLowerCase().replace(/-/g, '_').replace(/ /g, '_')
    if (normKey === 'self_regulation') normKey = 'self_regulation'; // Ensure match

    // Handle potential key mismatches manual mapping if needed, but assuming simple transform works
    const info = VIA_STRENGTH_DETAILS[normKey]

    return {
      strength: normKey,
      originalKey: key,
      name: info?.title || key,
      percentile: typeof score === 'number' ? score : 50,
      virtue: info?.virtue || 'Không xác định',
      description: info?.desc || '',
    }
  })

  // Sort by percentile descending
  strengthScores.sort((a, b) => b.percentile - a.percentile)

  // Identify Signature Strengths (Top 5)
  analysis.signature_strengths = strengthScores.slice(0, 5).map(s => ({
    strength: s.strength,
    name: s.name,
    percentile: s.percentile,
    virtue: s.virtue,
    description: s.description
  }))

  // Identify Weaknesses (Bottom 5 or < 30)
  // FIXED: Ensure weaknesses don't overlap with signatures if total strengths are few
  const lowStrengths = strengthScores.filter(s => s.percentile < 30)

  // If we have enough strengths (> 10), take bottom 5. 
  // If few strengths, only take those that are actually low (< 30) and not in signatures
  let bottomCandidates = strengthScores.slice(-5)
  if (strengthScores.length <= 10) {
    bottomCandidates = lowStrengths.filter(ls =>
      !analysis.signature_strengths?.some(ss => ss.strength === ls.strength)
    )
  }

  analysis.weaknesses = bottomCandidates.map(s => ({
    strength: s.strength,
    name: s.name,
    percentile: s.percentile
  }))

  // Virtue Profile
  const virtueMap: Record<string, { total: number, count: number }> = {}
  strengthScores.forEach(s => {
    if (!virtueMap[s.virtue]) virtueMap[s.virtue] = { total: 0, count: 0 }
    virtueMap[s.virtue].total += s.percentile
    virtueMap[s.virtue].count++
  })

  analysis.virtue_profile = Object.entries(virtueMap).map(([virtue, data]) => ({
    virtue,
    name: virtue,
    score: Math.round(data.total / data.count)
  })).sort((a, b) => b.score - a.score)


  // 2. DASS-SPECIFIC INTERGRATION (Legacy Logic Preserved)
  // ============================================
  const hope = viaPercentiles.Hope ?? 50
  const zest = viaPercentiles.Zest ?? 50

  // Hope analysis
  if (hope > VIA_HIGH) {
    analysis.protective_factors.push('Hy vọng (Hope)')
  } else if (hope < VIA_LOW) {
    analysis.risk_factors.push('Hy vọng thấp')
    analysis.build_strengths.push({
      strength: 'Hope',
      priority: 'HIGH',
      interventions: ['hope_therapy', 'goal_setting', 'best_possible_self'],
    })
  }

  // Zest analysis
  if (zest > VIA_HIGH) {
    analysis.protective_factors.push('Nhiệt huyết (Zest)')
  } else if (zest < VIA_LOW) {
    analysis.risk_factors.push('Nhiệt huyết thấp')
    analysis.build_strengths.push({
      strength: 'Zest',
      priority: 'HIGH',
      interventions: ['physical_activation', 'behavioral_activation', 'sleep_hygiene'],
    })
  }

  // Depression-specific
  if (dassRaw.D > DASS_HIGH.D) {
    if (hope < VIA_LOW) {
      analysis.interpretation += 'Cần can thiệp nhận thức để cải thiện Trầm cảm và Hy vọng. '
      analysis.priority_intervention = 'hope_therapy'
    }
    if (zest < VIA_LOW) {
      analysis.interpretation += 'Triệu chứng mất hứng thú (anhedonia) rõ rệt. '
      if (!analysis.priority_intervention) {
        analysis.priority_intervention = 'behavioral_activation'
      }
    }
  }

  // Control Composite for High N
  const N = big5Percentiles.N ?? 50
  if (N > 75) {
    const selfReg = viaPercentiles['Self-Regulation'] ?? 50
    const prudence = viaPercentiles.Prudence ?? 50
    const C = big5Percentiles.C ?? 50

    const z_sr = (selfReg - 50) / 15
    const z_pr = (prudence - 50) / 15
    const z_c = (C - 50) / 15
    const control = (z_sr + z_pr + z_c) / 3

    analysis.control_composite = Math.round(control * 100) / 100

    if (control < -0.5) {
      analysis.risk_factors.push('Khả năng kiểm soát kém + Nhạy cảm cảm xúc cao')
      analysis.interpretation += 'Nguy cơ ứng phó bốc đồng cao (Impulsive Coping). '
      analysis.flags = ['IMPULSIVE_COPING_RISK']
    } else if (control > 0.5) {
      analysis.interpretation += 'Khả năng kiểm soát tốt giúp giảm nhẹ tác động của tính nhạy cảm (Neuroticism). '
      analysis.protective_factors.push('Khả năng tự kiểm soát mạnh mẽ')
    }
  }

  // Transcendence for extreme stress
  if (dassRaw.S > 33) {
    const spirituality = viaPercentiles.Spirituality ?? 50
    const gratitude = viaPercentiles.Gratitude ?? 50

    if (spirituality > VIA_HIGH || gratitude > VIA_HIGH) {
      analysis.interpretation += 'Stress cao nhưng có yếu tố Transcendence bảo vệ. Tiềm năng tăng trưởng hậu sang chấn (PTG). '
      analysis.prognosis = 'GROWTH_POTENTIAL'
    } else {
      analysis.interpretation += 'Stress cực độ và thiếu yếu tố tinh thần bảo vệ. Nguy cơ suy sụp. '
      analysis.prognosis = 'COLLAPSE_RISK'
    }
  }

  return analysis
}

// ============================================
// MAIN ENGINE
// ============================================

/**
 * Complete MISO V3 Meta-Analysis Pipeline
 */
export async function runMisoAnalysis(
  userData: UserInputData,
  userId: string,
  history?: {
    dass21?: Array<{ timestamp: Date; raw_scores: any }>
    big5?: Array<{ timestamp: Date; raw_scores: any }>
  }
): Promise<MisoAnalysisResult> {
  const result: MisoAnalysisResult = {
    version: '3.0',
    timestamp: new Date().toISOString(),
    user_id: userId,
    completeness: assessDataCompleteness(userData),
    normalized: {
      big5: undefined,
      dass21: undefined,
      via: undefined,
    },
    temporal: {
      dass21: undefined,
      big5: undefined,
    },
    profile: { mode: 'LITE' },
    scores: undefined,
    predictions: undefined,
    discrepancies: [],
    via_analysis: undefined,
    interventions: { immediate: [], first_aid: [] },
    summary: '',
  }

  // STEP 0: Check completeness
  if (result.completeness.level === 'NONE') {
    result.summary = 'Cần DASS-21 để bắt đầu phân tích'
    return result
  }

  // STEP 1: Normalize all data
  const normalizer = new NormalizationEngine()
  const normalized = normalizer.normalize(userData)

  if (normalized.errors.length > 0) {
    console.warn('Normalization errors:', normalized.errors)
  }

  result.normalized = {
    big5: normalized.big5?.normalized,
    dass21: normalized.dass21?.normalized,
    via: normalized.via?.normalized,
  }

  // STEP 2: Temporal Analysis
  if (history) {
    if (history.dass21 && userData.dass21_raw) {
      result.temporal.dass21 = analyzeDASSTrend(history.dass21, {
        timestamp: new Date(),
        raw_scores: userData.dass21_raw as any,
      })
    }

    if (history.big5 && userData.big5_raw) {
      const big5Temp = analyzeBig5Stability(history.big5, {
        timestamp: new Date(),
        raw_scores: userData.big5_raw as any,
      })
      result.temporal.big5 = big5Temp

      if (big5Temp.discrepancy) {
        result.discrepancies.push(big5Temp.discrepancy)
      }
    }
  }

  // STEP 3: Route by Completeness Level
  // Allow BASIC (DASS + Big5) or MINIMAL (DASS only) to proceed, but handle them differently
  const isBasicOrHigher = ['BASIC', 'STANDARD', 'COMPREHENSIVE', 'COMPLETE'].includes(result.completeness.level);

  if (result.completeness.level === 'MINIMAL' && !isBasicOrHigher) {
    // LITE MODE (Only DASS)
    const liteResult = analyzeDASS21Only(userData.dass21_raw!)
    result.profile = liteResult as any
    result.interventions = {
      immediate: liteResult.immediate_actions,
      first_aid: liteResult.first_aid,
    }
    result.summary = `Mode: LITE | Priority: ${liteResult.priority_concern || 'N/A'}`
    return result
  }

  // FULL MODE - Get percentiles
  let big5Percentiles = normalized.big5?.percentiles || {}
  const viaPercentiles = normalized.via?.percentiles || {}

  // Fallback to MBTI priors if Big5 is missing OR if normalization produced no percentiles (invalid raw data)
  if (Object.keys(big5Percentiles).length === 0 && userData.mbti && normalized.mbti_priors) {
    big5Percentiles = normalized.mbti_priors as Partial<Big5Percentiles>
  }

  // STEP 3.1: SCIENTIFIC SCORING (Deep Intelligence)
  // ============================================
  if (Object.keys(big5Percentiles).length > 0 && userData.dass21_raw) {
    const zpd = calculateZPD(userData.dass21_raw, big5Percentiles)
    const sdt = assessSDTNeeds(big5Percentiles, viaPercentiles)

    result.scientific_analysis = {
      zpd,
      sdt
    }
  }


  // STEP 3.5: Causal Pathway Analysis (Deep Integration)
  // ============================================
  if (Object.keys(big5Percentiles).length > 0 && userData.dass21_raw) {
    const { predicted, activeMechanisms } = predictDASSFromBig5(big5Percentiles as Big5Percentiles)

    let adjusted = predicted
    let activeCompensations: any[] = []

    // Apply VIA compensation if available
    if (Object.keys(viaPercentiles).length > 0) {
      const compensation = applyVIACompensation(
        predicted,
        big5Percentiles as Big5Percentiles,
        viaPercentiles as VIAPercentiles
      )
      adjusted = compensation.adjusted
      activeCompensations = compensation.activeCompensations
    }

    // Calculate residual (actual - predicted)
    const { residual, interpretation } = calculateResidualDistress(
      userData.dass21_raw,
      adjusted
    )

    // Find VIA-problem matches
    const viaProblemMatches = Object.keys(viaPercentiles).length > 0
      ? findVIAProblemMatches(userData.dass21_raw, viaPercentiles as Record<string, number>)
      : []

    // Store in result
    result.mechanisms = {
      active: activeMechanisms.map(m => ({
        id: m.id,
        pathway: m.pathway,
        strength: m.strength,
        predictedDASS: m.predictedDASS,
      })),
      compensations: activeCompensations.map(c => {
        const normKey = c.strength.toLowerCase().replace(/-/g, '_').replace(/ /g, '_')
        const info = VIA_STRENGTH_DETAILS[normKey]
        return {
          id: c.id,
          condition: c.condition,
          mechanism: c.mechanism,
          strength: info?.title || c.strength,
          percentile: c.percentile,
        }
      }),
      residual: {
        D: residual.D,
        A: residual.A,
        S: residual.S,
        interpretation,
      },
      via_problem_matches: viaProblemMatches.slice(0, 3).map(m => ({
        id: m.id,
        intervention: m.intervention,
        technique: m.technique,
        expected_effect: m.expected_effect,
      })),
    }
  }


  // STEP 4: Calculate Scores
  if (Object.keys(big5Percentiles).length > 0) {
    const scores = calculateAllScores({
      big5_percentiles: big5Percentiles,
      via_percentiles: viaPercentiles,
      mbti: userData.mbti,
      actual_dass: userData.dass21_raw,
    })

    result.scores = {
      BVS: scores.BVS,
      RCS: scores.RCS,
    }

    result.predictions = {
      predictions: scores.predicted_dass,
      coefficients: {
        alpha: 10.0,
        beta1: 5.0,
        beta2: 3.0,
      },
      segment: 'vn',
    }
  }

  // STEP 5: Profile Classification
  result.profile = classifyBig5Profile(big5Percentiles)

  // STEP 6: Discrepancy Detection
  if (userData.dass21_raw) {
    const discrepancies = detectDiscrepancies({
      big5_percentiles: big5Percentiles,
      via_percentiles: viaPercentiles,
      dass_raw: userData.dass21_raw,
      mbti: userData.mbti,
    })
    result.discrepancies.push(...discrepancies)
    result.discrepancies = prioritizeDiscrepancies(result.discrepancies)
  }

  // STEP 7: VIA Analysis
  if (Object.keys(viaPercentiles).length > 0 && userData.dass21_raw) {
    result.via_analysis = analyzeFullVIA(viaPercentiles, userData.dass21_raw, big5Percentiles)
  }

  // STEP 8: Intervention Allocation (with Smart Scoring if data available)
  result.interventions = allocateInterventions(
    result.profile,
    result.discrepancies,
    result.via_analysis || null,
    userData.mbti,
    // Smart scoring context (Phase 2)
    result.mechanisms && Object.keys(big5Percentiles).length > 0 && userData.dass21_raw
      ? {
        big5_percentiles: big5Percentiles as { N: number; E: number; O: number; A: number; C: number },
        dass_raw: userData.dass21_raw,
        mechanisms: result.mechanisms,
        scientific_analysis: result.scientific_analysis,
      }
      : undefined
  )

  // STEP 9: Generate Summary
  result.summary = generateSummary(result)

  return result
}

// ============================================
// SUMMARY GENERATION
// ============================================

function generateSummary(result: MisoAnalysisResult): string {
  const parts: string[] = []

  // Mode
  const modeMap: Record<string, string> = { 'FULL': 'Đầy đủ', 'LITE': 'Rút gọn', 'BASIC': 'Cơ bản' };
  parts.push(`Chế độ: ${modeMap[result.completeness.mode || 'LITE'] || result.completeness.mode}`);

  // Profile
  if ('name' in result.profile) {
    parts.push(`Hồ sơ: ${result.profile.name} (${result.profile.risk_level})`);
  }

  // Effectiveness
  if (result.temporal.dass21?.intervention_effectiveness) {
    parts.push(`Hiệu quả: ${result.temporal.dass21.intervention_effectiveness}`);
  }

  // Discrepancies
  if (result.discrepancies.length > 0) {
    const names = result.discrepancies.slice(0, 2).map((d) => d.name);
    parts.push(`Lưu ý: ${names.join(', ')}`);
  }

  // Priority intervention
  if (result.interventions.immediate && result.interventions.immediate.length > 0) {
    const imm = result.interventions.immediate[0] as { name?: string, type: string };
    parts.push(`Ưu tiên: ${imm.name || imm.type}`);
  }

  return parts.join(' | ')
}

// ============================================
// EXPORT HELPERS
// ============================================

/**
 * Quick analysis - single function for common use case
 */
export async function quickAnalyze(
  dassScores: { D: number; A: number; S: number },
  userId: string
): Promise<MisoAnalysisResult> {
  return runMisoAnalysis(
    {
      dass21_raw: dassScores,
    },
    userId
  )
}

/**
 * Full analysis with all data
 */
export async function fullAnalyze(
  userData: UserInputData,
  userId: string,
  history?: any
): Promise<MisoAnalysisResult> {
  return runMisoAnalysis(userData, userId, history)
}
