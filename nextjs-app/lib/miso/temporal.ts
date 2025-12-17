/**
 * MISO V3 - Temporal Analysis Engine
 * Analyzes trends, stability, and intervention effectiveness
 * Section 9 of specification
 */

import { DASS21_RCI, BIG5_STABILITY_THRESHOLDS } from './constants'
import type {
  TrendDirection,
  InterventionEffectiveness,
  DASSTemporalAnalysis,
  Big5StabilityCheck,
  Discrepancy,
} from '@/types/miso-v3'

// ============================================
// TYPE DEFINITIONS
// ============================================

interface TestRecord {
  timestamp: Date
  raw_scores: {
    [key: string]: number
  }
}

// ============================================
// DASS-21 TREND ANALYSIS
// ============================================

/**
 * Analyze DASS-21 trends over time
 */
export function analyzeDASSTrend(
  history: TestRecord[],
  current: TestRecord
): DASSTemporalAnalysis {
  if (!history || history.length === 0) {
    return {
      status: 'FIRST_TEST',
      is_baseline: true,
      trends: {},
      flags: [],
      intervention_effectiveness: null,
      recommendations: [],
    }
  }

  const result: DASSTemporalAnalysis = {
    trends: {},
    flags: [],
    intervention_effectiveness: null,
    recommendations: [],
  }

  // Get most recent previous test
  const previous = history[0]
  const daysBetween = Math.floor(
    (current.timestamp.getTime() - previous.timestamp.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Analyze each scale
  const scales = ['D', 'A', 'S'] as const
  for (const scale of scales) {
    const curr = current.raw_scores[scale] || 0
    const prev = previous.raw_scores[scale] || 0
    const change = curr - prev
    const rci = DASS21_RCI[scale]

    let direction: TrendDirection
    let significant = false

    if (change <= -rci) {
      direction = 'IMPROVED'
      significant = true
    } else if (change >= rci) {
      direction = 'WORSENED'
      significant = true
    } else {
      direction = 'STABLE'
      significant = false
    }

    result.trends[scale] = {
      previous: prev,
      current: curr,
      change: Math.round(change * 10) / 10,
      days: daysBetween,
      direction,
      significant,
    }

    // Rapid deterioration flag (within 7 days)
    if (direction === 'WORSENED' && daysBetween <= 7) {
      result.flags.push(`RAPID_DETERIORATION_${scale}`)
    }
  }

  // Calculate intervention effectiveness
  const improved = Object.values(result.trends).filter((t) => t.direction === 'IMPROVED').length
  const worsened = Object.values(result.trends).filter((t) => t.direction === 'WORSENED').length

  if (improved >= 2 && worsened === 0) {
    result.intervention_effectiveness = 'HIGHLY_EFFECTIVE'
    result.recommendations = ['continue_current', 'celebrate_progress']
  } else if (improved >= 1 && worsened === 0) {
    result.intervention_effectiveness = 'EFFECTIVE'
    result.recommendations = ['maintain_and_expand']
  } else if (worsened >= 2) {
    result.intervention_effectiveness = 'INEFFECTIVE'
    result.flags.push('INTERVENTION_REVIEW_NEEDED')
    result.recommendations = ['reassess', 'consider_professional']
  } else if (worsened === 1) {
    result.intervention_effectiveness = 'PARTIAL_DETERIORATION'
    const worsenedScale = Object.keys(result.trends).find(
      (k) => (result.trends as any)[k]?.direction === 'WORSENED'
    )
    if (worsenedScale) {
      result.recommendations = [`focus_on_${worsenedScale.toLowerCase()}`]
    }
  } else {
    result.intervention_effectiveness = 'MIXED'
    result.recommendations = ['targeted_adjustment']
  }

  return result
}

// ============================================
// BIG FIVE STABILITY ANALYSIS
// ============================================

/**
 * Analyze Big5 stability (should be stable over short periods)
 */
export function analyzeBig5Stability(
  history: TestRecord[],
  current: TestRecord
): Big5StabilityCheck {
  if (!history || history.length === 0) {
    return {
      status: 'FIRST_TEST',
      is_baseline: true,
      stability: 'STABLE',
      stability_check: {},
      flags: [],
      use_baseline: false,
      overall_stability: 'STABLE',
    }
  }

  const result: Big5StabilityCheck = {
    stability_check: {},
    flags: [],
    overall_stability: 'STABLE',
    use_baseline: false,
    stability: 'STABLE',
  }

  // Get baseline (oldest record)
  const baseline = history[history.length - 1]
  const daysSinceBaseline = Math.floor(
    (current.timestamp.getTime() - baseline.timestamp.getTime()) / (1000 * 60 * 60 * 24)
  )

  const traits = ['N', 'E', 'O', 'A', 'C']
  const unstable: string[] = []

  for (const trait of traits) {
    const baseVal = baseline.raw_scores[trait] || 0
    const currVal = current.raw_scores[trait] || 0
    const change = Math.abs(currVal - baseVal)

    let isStable = true
    let flag: string | null = null

    // Determine threshold based on time
    const thresholds = BIG5_STABILITY_THRESHOLDS
    if (daysSinceBaseline < 30) {
      if (change > thresholds.short_term[trait as keyof typeof thresholds.short_term]) {
        isStable = false
        flag = 'UNSTABLE_SHORT_TERM'
        unstable.push(trait)
      }
    } else if (daysSinceBaseline < 90) {
      if (change > thresholds.medium_term[trait as keyof typeof thresholds.medium_term]) {
        isStable = false
        flag = 'UNSTABLE_MEDIUM_TERM'
        unstable.push(trait)
      }
    }

    result.stability_check[trait] = {
      baseline: baseVal,
      current: currVal,
      change: currVal - baseVal,
      days: daysSinceBaseline,
      is_stable: isStable,
      flag,
    }
  }

  // Overall assessment
  if (unstable.length >= 3) {
    result.overall_stability = 'HIGHLY_UNSTABLE'
    result.stability = 'HIGHLY_UNSTABLE'
    result.flags = ['BIG5_INCONSISTENCY', 'MOOD_INFLUENCE_POSSIBLE']
    result.use_baseline = true
    result.discrepancy = {
      id: 'T1',
      name: 'Big5 Temporal Instability',
      severity: 'WARNING',
      interpretation: `Traits ${unstable.join(', ')} thay đổi bất thường trong ${daysSinceBaseline} ngày. Có thể do mood hiện tại ảnh hưởng hoặc không nhất quán khi trả lời.`,
    }
  } else if (unstable.length >= 1) {
    result.overall_stability = 'PARTIALLY_UNSTABLE'
    result.stability = 'PARTIALLY_UNSTABLE'
    result.flags = [`UNSTABLE: ${unstable.join(', ')}`]
  }

  return result
}

// ============================================
// TRAJECTORY VISUALIZATION
// ============================================

/**
 * Get data points for trend visualization
 */
export function getTrajectory(
  history: TestRecord[],
  subscale: string,
  windowDays: number = 90
): {
  status: string
  data_points?: Array<{
    timestamp: string
    days_ago: number
    score: number
  }>
  trend?: TrendDirection
  average?: number
  min?: number
  max?: number
  latest?: number
} {
  if (!history || history.length < 2) {
    return { status: 'INSUFFICIENT_DATA' }
  }

  const now = new Date()
  const cutoff = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000)
  const filtered = history.filter((h) => h.timestamp >= cutoff)

  if (filtered.length < 2) {
    return { status: 'INSUFFICIENT_DATA_IN_WINDOW' }
  }

  const points = filtered.map((h) => ({
    timestamp: h.timestamp.toISOString(),
    days_ago: Math.floor((now.getTime() - h.timestamp.getTime()) / (1000 * 60 * 60 * 24)),
    score: h.raw_scores[subscale] || 0,
  }))

  const scores = points.map((p) => p.score)

  // Simple trend calculation
  let trend: TrendDirection
  const first = scores[scores.length - 1]
  const last = scores[0]

  if (first < last - 2) {
    trend = 'IMPROVED'
  } else if (first > last + 2) {
    trend = 'WORSENED'
  } else {
    trend = 'STABLE'
  }

  return {
    status: 'OK',
    data_points: points,
    trend,
    average: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
    min: Math.min(...scores),
    max: Math.max(...scores),
    latest: scores[0],
  }
}

// ============================================
// RETEST RECOMMENDATION
// ============================================

/**
 * Recommend when to retest based on current severity
 */
export function recommendRetestDays(dassScores: { D: number; A: number; S: number }): number {
  const total = dassScores.D + dassScores.A + dassScores.S

  // Crisis: 7 days
  if (dassScores.D >= 28 || dassScores.A >= 20 || dassScores.S >= 34) {
    return 7
  }

  // Severe: 14 days
  if (dassScores.D >= 21 || dassScores.A >= 15 || dassScores.S >= 26) {
    return 14
  }

  // Moderate: 30 days
  if (dassScores.D >= 14 || dassScores.A >= 10 || dassScores.S >= 19) {
    return 30
  }

  // Normal: 90 days
  return 90
}

// ============================================
// PROGRESS SUMMARY
// ============================================

export interface ProgressSummary {
  overall_direction: TrendDirection
  significant_changes: string[]
  intervention_working: boolean
  next_steps: string[]
  retest_in_days: number
}

/**
 * Generate progress summary
 */
export function generateProgressSummary(
  temporalAnalysis: DASSTemporalAnalysis,
  currentDASS: { D: number; A: number; S: number }
): ProgressSummary {
  const significant: string[] = []

  for (const [scale, trend] of Object.entries(temporalAnalysis.trends)) {
    if (trend.significant) {
      const direction = trend.direction === 'IMPROVED' ? 'Cải thiện' : 'Xấu đi'
      significant.push(`${scale}: ${direction} ${Math.abs(trend.change)} điểm`)
    }
  }

  // Determine overall direction
  const improved = Object.values(temporalAnalysis.trends).filter((t) => t.direction === 'IMPROVED')
    .length
  const worsened = Object.values(temporalAnalysis.trends).filter((t) => t.direction === 'WORSENED')
    .length

  let overall: TrendDirection
  if (improved > worsened) overall = 'IMPROVED'
  else if (worsened > improved) overall = 'WORSENED'
  else overall = 'STABLE'

  const interventionWorking =
    temporalAnalysis.intervention_effectiveness === 'HIGHLY_EFFECTIVE' ||
    temporalAnalysis.intervention_effectiveness === 'EFFECTIVE'

  return {
    overall_direction: overall,
    significant_changes: significant,
    intervention_working: interventionWorking,
    next_steps: temporalAnalysis.recommendations,
    retest_in_days: recommendRetestDays(currentDASS),
  }
}
