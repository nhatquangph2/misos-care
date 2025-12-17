/**
 * MISO V3 - Complete Type Definitions
 * Meta-Analysis Integration System for Optimal Mental Health
 * Version: 3.0
 */

// ============================================
// ENUMS
// ============================================

export type Big5ProfileID = 'B0' | 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7' | 'B8'
export type DiscrepancyID = 'D1' | 'D2' | 'D3' | 'D4' | 'D4a' | 'D4b' | 'D5' | 'D6' | 'T1'
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY_LOW'
export type DataCompletenessLevel = 'NONE' | 'MINIMAL' | 'BASIC' | 'STANDARD' | 'COMPREHENSIVE' | 'COMPLETE'
export type AnalysisMode = 'LITE' | 'BASIC' | 'STANDARD' | 'FULL' | 'FULL_PLUS'
export type ConfidenceLevel = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'MEDIUM_LOW' | 'LOW'
export type SeverityLevel = 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE' | 'EXTREMELY_SEVERE'
export type InterventionCategory = 'immediate' | 'short_term' | 'long_term'
export type InterventionPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
export type TrendDirection = 'IMPROVED' | 'WORSENED' | 'STABLE'
export type InterventionEffectiveness = 'HIGHLY_EFFECTIVE' | 'EFFECTIVE' | 'MIXED' | 'PARTIAL_DETERIORATION' | 'INEFFECTIVE'
export type DiscrepancySeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'WARNING' | 'POSITIVE'
export type CommunicationStyle =
  | 'value_focused'
  | 'meaning_focused'
  | 'logic_focused'
  | 'strategy_focused'
  | 'duty_focused'
  | 'experience_focused'
  | 'possibility_focused'
  | 'people_focused'
  | 'practical_focused'
  | 'procedure_focused'
  | 'debate_focused'
  | 'action_focused'
  | 'harmony_focused'
  | 'efficiency_focused'
  | 'goal_focused'
  | 'results_focused'
  | 'neutral'

// ============================================
// RAW INPUT TYPES
// ============================================

export interface Big5RawScores {
  N: number // Neuroticism (8-40 for BFI-44)
  E: number // Extraversion (8-40)
  O: number // Openness (10-50)
  A: number // Agreeableness (9-45)
  C: number // Conscientiousness (9-45)
}

export interface DASS21RawScores {
  // IMPORTANT: These are NORMALIZED scores (0-42), NOT raw (0-21)
  // DASS-21 raw scores (7 questions × 0-3) = 0-21
  // Normalized scores = raw × 2 = 0-42 (to match DASS-42 scale)
  D: number // Depression (0-42 normalized)
  A: number // Anxiety (0-42 normalized)
  S: number // Stress (0-42 normalized)
}

export interface VIARawScores {
  Hope: number // 1-5 Likert scale
  Zest: number
  'Self-Regulation': number
  Gratitude: number
  Spirituality?: number
  Forgiveness?: number
  Prudence?: number
  Love?: number
  Kindness?: number
  Perspective?: number
  Curiosity?: number
  Creativity?: number
  Perseverance?: number
}

// ============================================
// NORMALIZED SCORES
// ============================================

export interface NormalizedScore {
  raw: number
  z_score: number
  percentile: number
  category: 'VERY_LOW' | 'LOW' | 'AVERAGE' | 'HIGH' | 'VERY_HIGH'
}

export interface Big5Percentiles {
  N: number // 0-100
  E: number
  O: number
  A: number
  C: number
}

export interface DASS21Normalized {
  D: NormalizedScore
  A: NormalizedScore
  S: NormalizedScore
}

export interface VIAPercentiles {
  Hope: number
  Zest: number
  'Self-Regulation': number
  Gratitude: number
  Spirituality?: number
  Forgiveness?: number
  Prudence?: number
  [key: string]: number | undefined
}

// ============================================
// BIG FIVE PROFILE
// ============================================

export interface Big5ProfileData {
  id: Big5ProfileID
  name: string
  risk_level: RiskLevel
  predicted_dass: {
    D: SeverityLevel
    A: SeverityLevel
    S: SeverityLevel
  }
  mechanism: string
  interventions: string[]
  flags: string[]
  avoid?: string[]
}

// ============================================
// DISCREPANCY ANALYSIS
// ============================================

export interface Discrepancy {
  id: DiscrepancyID
  name: string
  severity: DiscrepancySeverity
  interpretation: string
  interventions?: string[]
  avoid?: string[]
  flags?: string[]
  prognosis?: string
  action?: string
  subtype?: string
}

// ============================================
// VIA ANALYSIS
// ============================================

export interface VIAAnalysis {
  protective_factors: string[]
  risk_factors: string[]
  build_strengths: {
    strength: string
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    interventions: string[]
  }[]
  interpretation: string
  priority_intervention: string | null
  control_composite?: number
  flags?: string[]
  prognosis?: string
}

// ============================================
// TEMPORAL ANALYSIS
// ============================================

export interface TrendData {
  previous: number
  current: number
  change: number
  days: number
  direction: TrendDirection
  significant: boolean
}

export interface DASSTemporalAnalysis {
  status?: string
  is_baseline?: boolean
  trends: {
    D?: TrendData
    A?: TrendData
    S?: TrendData
  }
  flags: string[]
  intervention_effectiveness: InterventionEffectiveness | null
  recommendations: string[]
}

export interface Big5StabilityCheck {
  status?: string
  is_baseline?: boolean
  stability: 'STABLE' | 'PARTIALLY_UNSTABLE' | 'HIGHLY_UNSTABLE'
  stability_check: {
    [trait: string]: {
      baseline: number
      current: number
      change: number
      days: number
      is_stable: boolean
      flag: string | null
    }
  }
  flags: string[]
  use_baseline: boolean
  overall_stability: string
  discrepancy?: Discrepancy
}

// ============================================
// INTERVENTIONS
// ============================================

export interface Intervention {
  type: string
  priority?: InterventionPriority
  interventions?: string[]
}

export interface InterventionPlan {
  immediate: Intervention[]
  short_term: Intervention[]
  long_term: Intervention[]
  avoid: string[]
  communication_style: CommunicationStyle
  framing: 'plan_oriented' | 'exploration_oriented' | 'neutral'
}

// ============================================
// LITE MODE (DASS-only)
// ============================================

export interface LiteModeAnalysis {
  mode: 'LITE_ANALYSIS'
  severity: {
    D: {
      score: number
      level: SeverityLevel
      range: string
    }
    A: {
      score: number
      level: SeverityLevel
      range: string
    }
    S: {
      score: number
      level: SeverityLevel
      range: string
    }
  }
  priority_concern: 'D' | 'A' | 'S' | null
  immediate_actions: {
    type: string
    priority: InterventionPriority
    message: string
    resources?: { name: string; number: string }[]
    exercise?: { name: string; steps: string[] }
  }[]
  first_aid: {
    target: string
    title: string
    tips: string[]
  }[]
  next_steps: {
    priority: InterventionPriority
    action: string
    message: string
    tests?: string[]
    unlocks?: string[]
  }[]
  confidence: ConfidenceLevel
}

// ============================================
// CALIBRATION & PREDICTION
// ============================================

export interface CalibrationCoefficients {
  alpha: number
  beta1: number // BVS coefficient
  beta2: number // RCS coefficient
  per_scale?: {
    D: { alpha: number; beta1: number; beta2: number }
    A: { alpha: number; beta1: number; beta2: number }
    S: { alpha: number; beta1: number; beta2: number }
  }
}

export interface PredictionResult {
  predictions: {
    D: number
    A: number
    S: number
  }
  coefficients: CalibrationCoefficients
  segment: string
}

export interface FeedbackRecord {
  id: string
  user_id: string
  timestamp: Date
  bvs: number
  rcs: number
  predicted_dass: {
    D: number
    A: number
    S: number
  }
  actual_dass: {
    D: number
    A: number
    S: number
  }
  delta: {
    D: number
    A: number
    S: number
  }
  mae: number
  segment: string
}

// ============================================
// DATA COMPLETENESS
// ============================================

export interface DataCompleteness {
  level: DataCompletenessLevel
  mode: AnalysisMode | null
  confidence: ConfidenceLevel
  features: string[]
  has: {
    dass: boolean
    big5: boolean
    via: boolean
    mbti: boolean
  }
  missing_for_upgrade?: {
    missing: string[]
    benefit: string
  }
  message?: string
  next?: string
}

// ============================================
// MAIN ANALYSIS RESULT
// ============================================

export interface MisoAnalysisResult {
  version: string
  timestamp: string
  user_id: string

  // Data completeness
  completeness: DataCompleteness

  // Normalized data
  normalized: {
    big5?: {
      [trait: string]: NormalizedScore
    }
    dass21?: DASS21Normalized
    via?: {
      [strength: string]: NormalizedScore
    }
  }

  // Temporal analysis
  temporal: {
    dass21?: DASSTemporalAnalysis
    big5?: Big5StabilityCheck
  }

  // Profile classification
  profile: Big5ProfileData | { mode: 'LITE'; [key: string]: any }

  // Scores
  scores?: {
    BVS: number // Base Vulnerability Score
    RCS: number // Resilience Capacity Score
  }

  // Predictions
  predictions?: PredictionResult

  // Discrepancies
  discrepancies: Discrepancy[]

  // VIA analysis
  via_analysis?: VIAAnalysis

  // Interventions
  interventions: InterventionPlan | {
    immediate: any[]
    first_aid: any[]
  }

  // Summary
  summary: string
}

// ============================================
// USER INPUT DATA
// ============================================

export interface UserInputData {
  dass21_raw?: DASS21RawScores
  big5_raw?: Big5RawScores
  via_raw?: VIARawScores
  mbti?: string // e.g., "INTJ"
}

// ============================================
// MBTI PROFILES
// ============================================

export interface MBTIRiskProfile {
  risk_level: RiskLevel
  risks: string[]
  interventions: string[]
  communication_style: CommunicationStyle
}

// ============================================
// DATABASE RECORDS
// ============================================

export interface MisoAnalysisLog {
  id: string
  user_id: string
  analysis_result: MisoAnalysisResult
  bvs: number | null
  rcs: number | null
  profile_id: Big5ProfileID | null
  risk_level: RiskLevel | null
  completeness_level: DataCompletenessLevel
  created_at: string
}

export interface PredictionFeedback {
  id: string
  user_id: string
  bvs: number
  rcs: number
  predicted_dass_d: number
  predicted_dass_a: number
  predicted_dass_s: number
  actual_dass_d: number
  actual_dass_a: number
  actual_dass_s: number
  delta_d: number
  delta_a: number
  delta_s: number
  mae: number
  segment: string
  created_at: string
}
