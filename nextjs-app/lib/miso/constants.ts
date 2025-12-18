/**
 * MISO V3 - Normative Data Constants
 * All normative data from research literature (Section 2 of spec)
 */

// ============================================
// BIG FIVE NORMATIVE DATA
// ============================================

export interface NormData {
  mean: number
  sd: number
  range: [number, number]
}

export const BIG5_NORMS_VN: Record<string, NormData> = {
  N: {
    mean: 25.8,
    sd: 5.9,
    range: [8, 40],
  },
  E: {
    mean: 25.2,
    sd: 5.8,
    range: [8, 40],
  },
  O: {
    mean: 36.1,
    sd: 5.5,
    range: [10, 50],
  },
  A: {
    mean: 36.8,
    sd: 5.2,
    range: [9, 45],
  },
  C: {
    mean: 35.2,
    sd: 6.0,
    range: [9, 45],
  },
}

// International norms for reference
export const BIG5_NORMS_INTL: Record<string, NormData> = {
  N: {
    mean: 24.3,
    sd: 6.4,
    range: [8, 40],
  },
  E: {
    mean: 27.9,
    sd: 6.1,
    range: [8, 40],
  },
  O: {
    mean: 38.4,
    sd: 6.0,
    range: [10, 50],
  },
  A: {
    mean: 35.4,
    sd: 5.6,
    range: [9, 45],
  },
  C: {
    mean: 34.5,
    sd: 6.3,
    range: [9, 45],
  },
}

// ============================================
// DASS-21 NORMATIVE DATA
// ============================================

export const DASS21_NORMS_VN: Record<string, NormData> = {
  D: {
    mean: 7.2,
    sd: 7.5,
    range: [0, 42],
  },
  A: {
    mean: 5.8,
    sd: 5.6,
    range: [0, 42],
  },
  S: {
    mean: 11.4,
    sd: 8.3,
    range: [0, 42],
  },
}

export const DASS21_NORMS_INTL: Record<string, NormData> = {
  D: {
    mean: 6.34,
    sd: 6.97,
    range: [0, 42],
  },
  A: {
    mean: 4.70,
    sd: 4.91,
    range: [0, 42],
  },
  S: {
    mean: 10.11,
    sd: 7.91,
    range: [0, 42],
  },
}

// Severity Thresholds (from DASS-21 manual)
export const DASS21_SEVERITY_THRESHOLDS = {
  D: {
    NORMAL: [0, 9],
    MILD: [10, 13],
    MODERATE: [14, 20],
    SEVERE: [21, 27],
    EXTREMELY_SEVERE: [28, 42],
  },
  A: {
    NORMAL: [0, 7],
    MILD: [8, 9],
    MODERATE: [10, 14],
    SEVERE: [15, 19],
    EXTREMELY_SEVERE: [20, 42],
  },
  S: {
    NORMAL: [0, 14],
    MILD: [15, 18],
    MODERATE: [19, 25],
    SEVERE: [26, 33],
    EXTREMELY_SEVERE: [34, 42],
  },
} as const

// ============================================
// VIA STRENGTHS NORMATIVE DATA
// ============================================

export const VIA_NORMS: Record<string, NormData> = {
  Hope: {
    mean: 3.75,
    sd: 0.67,
    range: [1, 5],
  },
  Zest: {
    mean: 3.50,
    sd: 0.72,
    range: [1, 5],
  },
  'Self-Regulation': {
    mean: 3.25,
    sd: 0.70,
    range: [1, 5],
  },
  Gratitude: {
    mean: 3.84,
    sd: 0.64,
    range: [1, 5],
  },
  Spirituality: {
    mean: 3.40,
    sd: 0.85,
    range: [1, 5],
  },
  Forgiveness: {
    mean: 3.78,
    sd: 0.62,
    range: [1, 5],
  },
  Prudence: {
    mean: 3.45,
    sd: 0.62,
    range: [1, 5],
  },
  Love: {
    mean: 3.98,
    sd: 0.63,
    range: [1, 5],
  },
  Kindness: {
    mean: 4.03,
    sd: 0.55,
    range: [1, 5],
  },
  Perspective: {
    mean: 3.82,
    sd: 0.56,
    range: [1, 5],
  },
  Curiosity: {
    mean: 3.70,
    sd: 0.68,
    range: [1, 5],
  },
  Creativity: {
    mean: 3.55,
    sd: 0.74,
    range: [1, 5],
  },
  Perseverance: {
    mean: 3.68,
    sd: 0.65,
    range: [1, 5],
  },
}

// Clinical correlations (for reference)
export const VIA_DASS_CORRELATIONS = {
  Hope: -0.50, // Negative correlation with Depression
  Zest: -0.55, // Strong negative correlation with Depression
  'Self-Regulation': -0.35, // Negative correlation with Anxiety
  Gratitude: -0.40, // Negative correlation with Depression
  Spirituality: -0.25, // Buffer for extreme stress
  Forgiveness: -0.30, // Buffer for interpersonal stress
}

// ============================================
// TEMPORAL ANALYSIS CONSTANTS
// ============================================

// Reliable Change Index (RCI) thresholds
// RCI = 1.96 × SD × √2 × √(1 - reliability)
// reliability ≈ 0.88 for DASS-21
export const DASS21_RCI = {
  D: 5.0, // Change ≥5 points is clinically significant
  A: 4.0, // Change ≥4 points is clinically significant
  S: 5.5, // Change ≥5.5 points is clinically significant
}

// Big5 stability thresholds (test-retest > 0.80/year)
export const BIG5_STABILITY_THRESHOLDS = {
  short_term: {
    // < 30 days - should be very stable
    N: 8,
    E: 8,
    O: 7,
    A: 7,
    C: 8,
  },
  medium_term: {
    // < 90 days
    N: 12,
    E: 12,
    O: 10,
    A: 10,
    C: 12,
  },
}

// ============================================
// SCORING WEIGHTS
// ============================================

// Base Vulnerability Score (BVS) weights
export const BVS_WEIGHTS = {
  N: 0.40, // Neuroticism increases vulnerability
  C: -0.20, // Conscientiousness decreases vulnerability
  E: -0.15, // Extraversion decreases vulnerability
}

// Resilience Capacity Score (RCS) components
export const RCS_COMPONENTS = ['Hope', 'Zest', 'Self-Regulation', 'Gratitude']
export const RCS_MBTI_J_BONUS = 0.1 // Bonus for J types (planning/structure)

// Default prediction coefficients
// Predicted_DASS = α + (β1 × BVS) - (β2 × RCS)
export const DEFAULT_PREDICTION_COEFFICIENTS = {
  alpha: 10.0, // Baseline
  beta1: 5.0, // BVS weight
  beta2: 3.0, // RCS weight
}

// ============================================
// PERCENTILE CATEGORIES
// ============================================

export const PERCENTILE_THRESHOLDS = {
  VERY_LOW: 10,
  LOW: 25,
  AVERAGE_LOW: 50,
  AVERAGE_HIGH: 75,
  HIGH: 90,
} as const

export function getPercentileCategory(percentile: number): string {
  if (percentile < PERCENTILE_THRESHOLDS.VERY_LOW) return 'VERY_LOW'
  if (percentile < PERCENTILE_THRESHOLDS.LOW) return 'LOW'
  if (percentile < PERCENTILE_THRESHOLDS.AVERAGE_HIGH) return 'AVERAGE'
  if (percentile < PERCENTILE_THRESHOLDS.HIGH) return 'HIGH'
  return 'VERY_HIGH'
}

// ============================================
// Z-SCORE TO PERCENTILE LOOKUP (for performance)
// ============================================

export const Z_SCORE_PERCENTILE_MAP: Record<string, number> = {
  '-3.0': 0.1,
  '-2.5': 0.6,
  '-2.0': 2.3,
  '-1.5': 6.7,
  '-1.0': 15.9,
  '-0.5': 30.9,
  '0.0': 50.0,
  '0.5': 69.1,
  '1.0': 84.1,
  '1.5': 93.3,
  '2.0': 97.7,
  '2.5': 99.4,
  '3.0': 99.9,
}

// ============================================
// CALIBRATION SETTINGS
// ============================================

export const CALIBRATION_SETTINGS = {
  MINIMUM_SAMPLES: 100, // Minimum samples before calibration
  OPTIMAL_SAMPLES: 1000, // Optimal samples for good calibration
  MAX_DAYS_BETWEEN: 90, // Max days between calibrations
  MINIMUM_IMPROVEMENT_PCT: 5.0, // Minimum 5% MAE improvement to update
}

// ============================================
// CRISIS DETECTION THRESHOLDS
// ============================================

export const CRISIS_THRESHOLDS = {
  DASS_D_CRITICAL: 28, // Extremely severe depression
  DASS_A_CRITICAL: 20, // Extremely severe anxiety
  DASS_S_CRITICAL: 34, // Extremely severe stress
  DASS_TOTAL_CRITICAL: 60, // Combined severe distress
}

// ============================================
// PROFILE CLASSIFICATION THRESHOLDS
// ============================================

export const PROFILE_THRESHOLDS = {
  HIGH_PERCENTILE: 75,
  LOW_PERCENTILE: 25,
}

// ============================================
// DISCREPANCY DETECTION THRESHOLDS
// ============================================

export const DISCREPANCY_THRESHOLDS = {
  DELTA_ACUTE_STRESS: 10, // Delta > +10 suggests acute stressor
  DELTA_REPRESSIVE: -10, // Delta < -10 suggests repressive coping
  N_LOW_THRESHOLD: 40, // For D1 detection
  N_VERY_LOW_THRESHOLD: 25, // For D2/D3 detection
  N_VERY_HIGH_THRESHOLD: 90, // For D4 detection
  VIA_HIGH_THRESHOLD: 75, // High VIA strength
  VIA_LOW_THRESHOLD: 30, // Low VIA strength
}

// ============================================
// INTERVENTION TIMING
// ============================================

export const RETEST_SCHEDULE = {
  CRISIS: 7, // Retest after 7 days if in crisis
  SEVERE: 14, // Retest after 14 days if severe
  MODERATE: 30, // Retest after 30 days if moderate
  NORMAL: 90, // Retest after 90 days if normal
}

// ============================================
// EXPORT DEFAULT NORMS (for easy switching)
// ============================================

// Use Vietnam norms by default
export const BIG5_NORMS = BIG5_NORMS_VN
export const DASS21_NORMS = DASS21_NORMS_VN
