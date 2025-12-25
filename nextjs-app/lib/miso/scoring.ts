/**
 * MISO V3 - Scoring Engine
 * Calculates BVS, RCS, and Predicted DASS scores
 */

import { BVS_WEIGHTS, RCS_WEIGHTS, RCS_MBTI_J_BONUS, DEFAULT_PREDICTION_COEFFICIENTS } from './constants'
import type { Big5Percentiles, VIAPercentiles, CalibrationCoefficients } from '@/types/miso-v3'

// ============================================
// BASE VULNERABILITY SCORE (BVS)
// ============================================

/**
 * Calculate Base Vulnerability Score
 * BVS = (0.50 × Z_N) - (0.25 × Z_C) - (0.15 × Z_E) - (0.10 × Z_A)
 *
 * Higher BVS = Higher vulnerability to mental health issues
 */
export function calculateBVS(percentiles: Partial<Big5Percentiles>): number {
  const { N = 50, C = 50, E = 50, A = 50 } = percentiles

  // Convert percentiles to Z-scores (approximate)
  // Z ≈ (percentile - 50) / 15
  const z_N = (N - 50) / 15
  const z_C = (C - 50) / 15
  const z_E = (E - 50) / 15
  const z_A = (A - 50) / 15

  const bvs =
    BVS_WEIGHTS.N * z_N +
    BVS_WEIGHTS.C * z_C +
    BVS_WEIGHTS.E * z_E +
    BVS_WEIGHTS.A * z_A

  return Math.round(bvs * 1000) / 1000 // Round to 3 decimals
}

// ============================================
// RESILIENCE CAPACITY SCORE (RCS)
// ============================================

/**
 * Calculate Resilience Capacity Score
 * RCS = Weighted sum of 6 key strengths
 * Optional: +0.1 bonus if MBTI type ends with J
 *
 * Higher RCS = Higher resilience/protective factors
 */
export function calculateRCS(
  viaPercentiles: Partial<VIAPercentiles>,
  mbti?: string
): number {
  // Get core resilience strengths
  const hope = viaPercentiles.Hope ?? 50
  const zest = viaPercentiles.Zest ?? 50
  const selfReg = viaPercentiles['Self-Regulation'] ?? 50
  const gratitude = viaPercentiles.Gratitude ?? 50
  const curiosity = viaPercentiles.Curiosity ?? 50
  const love = viaPercentiles.Love ?? 50

  // Convert to Z-scores
  const z_hope = (hope - 50) / 15
  const z_zest = (zest - 50) / 15
  const z_selfReg = (selfReg - 50) / 15
  const z_gratitude = (gratitude - 50) / 15
  const z_curiosity = (curiosity - 50) / 15
  const z_love = (love - 50) / 15

  // Weighted Sum
  let rcs =
    RCS_WEIGHTS.Hope * z_hope +
    RCS_WEIGHTS.Zest * z_zest +
    RCS_WEIGHTS.SelfReg * z_selfReg +
    RCS_WEIGHTS.Gratitude * z_gratitude +
    RCS_WEIGHTS.Curiosity * z_curiosity +
    RCS_WEIGHTS.Love * z_love

  // J-type bonus (planning/structure aids resilience)
  if (mbti && mbti.length === 4 && mbti[3].toUpperCase() === 'J') {
    rcs += RCS_MBTI_J_BONUS
  }

  return Math.round(rcs * 1000) / 1000 // Round to 3 decimals
}

// ============================================
// PREDICTED DASS SCORES
// ============================================

/**
 * Predict DASS scores based on BVS and RCS
 * Predicted_DASS = α + (β1 × BVS) - (β2 × RCS)
 *
 * Uses calibrated coefficients if available
 */
export function predictDASS(
  bvs: number,
  rcs: number,
  coefficients: CalibrationCoefficients = DEFAULT_PREDICTION_COEFFICIENTS
): {
  D: number
  A: number
  S: number
} {
  // Check if we have per-scale coefficients (more accurate)
  if (coefficients.per_scale) {
    const D =
      coefficients.per_scale.D.alpha +
      coefficients.per_scale.D.beta1 * bvs -
      coefficients.per_scale.D.beta2 * rcs

    const A =
      coefficients.per_scale.A.alpha +
      coefficients.per_scale.A.beta1 * bvs -
      coefficients.per_scale.A.beta2 * rcs

    const S =
      coefficients.per_scale.S.alpha +
      coefficients.per_scale.S.beta1 * bvs -
      coefficients.per_scale.S.beta2 * rcs

    return {
      D: clampDASS(D),
      A: clampDASS(A),
      S: clampDASS(S),
    }
  }

  // Use global coefficients
  const base = coefficients.alpha + coefficients.beta1 * bvs - coefficients.beta2 * rcs

  // Adjust by scale (empirical ratios)
  const predictions = {
    D: base,
    A: base * 0.9, // Anxiety typically slightly lower
    S: base * 1.1, // Stress typically slightly higher
  }

  return {
    D: clampDASS(predictions.D),
    A: clampDASS(predictions.A),
    S: clampDASS(predictions.S),
  }
}

/**
 * Clamp DASS score to valid range [0, 42]
 */
function clampDASS(score: number): number {
  const clamped = Math.max(0, Math.min(42, score))
  return Math.round(clamped * 10) / 10 // Round to 1 decimal
}

// ============================================
// DELTA (DISCREPANCY INDICATOR)
// ============================================

/**
 * Calculate Delta (difference between actual and predicted)
 * Delta = Actual - Predicted
 *
 * Large positive delta (>+10): Acute stressor or hidden trauma
 * Large negative delta (<-10): Repressive coping or exceptional resilience
 */
export function calculateDelta(actual: number, predicted: number): number {
  return Math.round((actual - predicted) * 10) / 10
}

export function calculateAllDeltas(
  actualDASS: { D: number; A: number; S: number },
  predictedDASS: { D: number; A: number; S: number }
): {
  D: number
  A: number
  S: number
  total: number
  interpretation: string
} {
  const deltaD = calculateDelta(actualDASS.D, predictedDASS.D)
  const deltaA = calculateDelta(actualDASS.A, predictedDASS.A)
  const deltaS = calculateDelta(actualDASS.S, predictedDASS.S)
  const deltaTotal = deltaD + deltaA + deltaS

  let interpretation = 'Within normal range'

  if (deltaTotal > 15) {
    interpretation = 'Acute stressor or hidden trauma detected'
  } else if (deltaTotal < -15) {
    interpretation = 'Repressive coping or exceptional resilience'
  } else if (Math.abs(deltaD) > 10) {
    interpretation = 'Significant discrepancy in Depression'
  } else if (Math.abs(deltaA) > 10) {
    interpretation = 'Significant discrepancy in Anxiety'
  } else if (Math.abs(deltaS) > 10) {
    interpretation = 'Significant discrepancy in Stress'
  }

  return {
    D: deltaD,
    A: deltaA,
    S: deltaS,
    total: Math.round(deltaTotal * 10) / 10,
    interpretation,
  }
}

// ============================================
// CONTROL COMPOSITE
// ============================================

/**
 * Calculate Control Composite
 * Control = (Z_SelfReg + Z_Prudence + Z_C) / 3
 *
 * Used to distinguish between:
 * - Healthy Neurotic (High N + High Control)
 * - Impulsive Neurotic (High N + Low Control)
 */
export function calculateControlComposite(
  viaPercentiles: Partial<VIAPercentiles>,
  big5Percentiles: Partial<Big5Percentiles>
): number {
  const selfReg = viaPercentiles['Self-Regulation'] ?? 50
  const prudence = viaPercentiles.Prudence ?? 50
  const C = big5Percentiles.C ?? 50

  const z_sr = (selfReg - 50) / 15
  const z_pr = (prudence - 50) / 15
  const z_c = (C - 50) / 15

  const control = (z_sr + z_pr + z_c) / 3

  return Math.round(control * 1000) / 1000
}

// ============================================
// COMPREHENSIVE SCORING
// ============================================

export interface ComprehensiveScores {
  BVS: number
  RCS: number
  predicted_dass: {
    D: number
    A: number
    S: number
  }
  delta?: {
    D: number
    A: number
    S: number
    total: number
    interpretation: string
  }
  control_composite?: number
}

/**
 * Calculate all scores in one go
 */
export function calculateAllScores(input: {
  big5_percentiles?: Partial<Big5Percentiles>
  via_percentiles?: Partial<VIAPercentiles>
  mbti?: string
  actual_dass?: { D: number; A: number; S: number }
  coefficients?: CalibrationCoefficients
}): ComprehensiveScores {
  const { big5_percentiles = {}, via_percentiles = {}, mbti, actual_dass, coefficients } = input

  // Calculate BVS
  const BVS = calculateBVS(big5_percentiles)

  // Calculate RCS
  const RCS = calculateRCS(via_percentiles, mbti)

  // Predict DASS
  const predicted_dass = predictDASS(BVS, RCS, coefficients)

  // Build result
  const result: ComprehensiveScores = {
    BVS,
    RCS,
    predicted_dass,
  }

  // Calculate delta if actual DASS provided
  if (actual_dass) {
    result.delta = calculateAllDeltas(actual_dass, predicted_dass)
  }

  // Calculate control composite if we have the data
  if (via_percentiles.Prudence !== undefined || big5_percentiles.C !== undefined) {
    result.control_composite = calculateControlComposite(via_percentiles, big5_percentiles)
  }

  return result
}
