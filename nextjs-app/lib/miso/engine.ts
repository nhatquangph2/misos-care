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
import type {
  UserInputData,
  MisoAnalysisResult,
  Big5Percentiles,
  VIAPercentiles,
  VIAAnalysis,
} from '@/types/miso-v3'

// ============================================
// VIA ANALYSIS HELPER
// ============================================

function analyzeVIAForDASS(
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
  }

  const VIA_HIGH = 70
  const VIA_LOW = 30
  const DASS_HIGH = { D: 20, A: 14, S: 25 }

  const hope = viaPercentiles.Hope ?? 50
  const zest = viaPercentiles.Zest ?? 50

  // Hope analysis
  if (hope > VIA_HIGH) {
    analysis.protective_factors.push('Hope')
  } else if (hope < VIA_LOW) {
    analysis.risk_factors.push('Low Hope')
    analysis.build_strengths.push({
      strength: 'Hope',
      priority: 'HIGH',
      interventions: ['hope_therapy', 'goal_setting', 'best_possible_self'],
    })
  }

  // Zest analysis
  if (zest > VIA_HIGH) {
    analysis.protective_factors.push('Zest')
  } else if (zest < VIA_LOW) {
    analysis.risk_factors.push('Low Zest')
    analysis.build_strengths.push({
      strength: 'Zest',
      priority: 'HIGH',
      interventions: ['physical_activation', 'behavioral_activation', 'sleep_hygiene'],
    })
  }

  // Depression-specific
  if (dassRaw.D > DASS_HIGH.D) {
    if (hope < VIA_LOW) {
      analysis.interpretation += 'Trầm cảm liên quan đến thiếu Hope. '
      analysis.priority_intervention = 'hope_therapy'
    }
    if (zest < VIA_LOW) {
      analysis.interpretation += 'Trầm cảm liên quan đến thiếu Zest (anhedonia). '
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
      analysis.risk_factors.push('Low Control + High N')
      analysis.interpretation += 'Nguy cơ impulsive coping cao. '
      analysis.flags = ['IMPULSIVE_COPING_RISK']
    } else if (control > 0.5) {
      analysis.interpretation += 'Healthy Neurotic pattern. '
      analysis.protective_factors.push('Strong Control')
    }
  }

  // Transcendence for extreme stress
  if (dassRaw.S > 33) {
    const spirituality = viaPercentiles.Spirituality ?? 50
    const gratitude = viaPercentiles.Gratitude ?? 50

    if (spirituality > VIA_HIGH || gratitude > VIA_HIGH) {
      analysis.interpretation += 'Stress cực độ nhưng có Transcendence. Growth potential. '
      analysis.prognosis = 'GROWTH_POTENTIAL'
    } else {
      analysis.interpretation += 'Stress cực độ, thiếu Transcendence. Collapse risk. '
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
        raw_scores: userData.dass21_raw,
      })
    }

    if (history.big5 && userData.big5_raw) {
      const big5Temp = analyzeBig5Stability(history.big5, {
        timestamp: new Date(),
        raw_scores: userData.big5_raw,
      })
      result.temporal.big5 = big5Temp

      if (big5Temp.discrepancy) {
        result.discrepancies.push(big5Temp.discrepancy)
      }
    }
  }

  // STEP 3: Route by Completeness Level
  if (result.completeness.level === 'MINIMAL') {
    // LITE MODE
    const liteResult = analyzeDASS21Only(userData.dass21_raw!)
    result.profile = { mode: 'LITE', ...liteResult }
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

  // Use MBTI priors if Big5 missing
  if (!userData.big5_raw && userData.mbti && normalized.mbti_priors) {
    big5Percentiles = normalized.mbti_priors as Partial<Big5Percentiles>
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
    result.via_analysis = analyzeVIAForDASS(viaPercentiles, userData.dass21_raw, big5Percentiles)
  }

  // STEP 8: Intervention Allocation
  result.interventions = allocateInterventions(
    result.profile,
    result.discrepancies,
    result.via_analysis || null,
    userData.mbti
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
  parts.push(`Mode: ${result.completeness.mode}`)

  // Profile
  if ('name' in result.profile) {
    parts.push(`Profile: ${result.profile.name} (${result.profile.risk_level})`)
  }

  // Effectiveness
  if (result.temporal.dass21?.intervention_effectiveness) {
    parts.push(`Effectiveness: ${result.temporal.dass21.intervention_effectiveness}`)
  }

  // Discrepancies
  if (result.discrepancies.length > 0) {
    const names = result.discrepancies.slice(0, 2).map((d) => d.name)
    parts.push(`Notes: ${names.join(', ')}`)
  }

  // Priority intervention
  if (result.interventions.immediate && result.interventions.immediate.length > 0) {
    const imm = result.interventions.immediate[0]
    parts.push(`Priority: ${imm.type}`)
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
