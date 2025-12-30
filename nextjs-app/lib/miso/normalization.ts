/**
 * MISO V3 - Normalization Engine
 * Converts raw scores to Z-scores and percentiles
 * Includes MBTI → Big5 mapping for cold start
 */

import {
  DASS21_NORMS as IMPORTED_DASS21_NORMS,
  VIA_NORMS,
  getPercentileCategory,
  type NormData,
} from './constants'

// EMERGENCY FALLBACK: Hardcode Norms to prevent import failure
const LOCAL_BIG5_NORMS: Record<string, NormData> = {
  N: { mean: 25.8, sd: 5.9, range: [8, 40] },
  E: { mean: 25.2, sd: 5.8, range: [8, 40] },
  O: { mean: 36.1, sd: 5.5, range: [10, 50] },
  A: { mean: 36.8, sd: 5.2, range: [9, 45] },
  C: { mean: 35.2, sd: 6.0, range: [9, 45] },
}

// EMERGENCY FALLBACK: Hardcode DASS21 Norms
const LOCAL_DASS21_NORMS: Record<string, NormData> = {
  D: { mean: 5.66, sd: 5.97, range: [0, 42] },
  A: { mean: 4.80, sd: 4.71, range: [0, 42] },
  S: { mean: 7.95, sd: 5.80, range: [0, 42] },
}

// Use imported if available, fallback to local
const DASS21_NORMS: Record<string, NormData> = IMPORTED_DASS21_NORMS && Object.keys(IMPORTED_DASS21_NORMS).length > 0
  ? IMPORTED_DASS21_NORMS
  : LOCAL_DASS21_NORMS

import type {
  Big5RawScores,
  DASS21RawScores,
  VIARawScores,
  NormalizedScore,
  Big5Percentiles,
  DASS21Normalized,
  VIAPercentiles,
  MBTIRiskProfile,
  CommunicationStyle,
  RiskLevel,
} from '@/types/miso-v3'

// ============================================
// CORE NORMALIZATION FUNCTIONS
// ============================================

/**
 * Convert raw score to Z-score
 * Z = (Raw - Mean) / SD
 */
export function rawToZScore(raw: number, norm: NormData): number {
  const z = (raw - norm.mean) / norm.sd
  // Clip to reasonable range (-3.5 to +3.5 SD)
  return Math.max(-3.5, Math.min(3.5, z))
}

/**
 * Convert Z-score to percentile using standard normal distribution
 * Uses error function approximation for speed
 */
export function zScoreToPercentile(z: number): number {
  // Approximation of cumulative normal distribution
  // Using Abramowitz & Stegun approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp((-z * z) / 2)
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))

  const percentile = z >= 0 ? (1 - p) * 100 : p * 100

  // Clip to valid range
  return Math.max(0, Math.min(100, percentile))
}

/**
 * Convert raw score directly to percentile
 */
export function rawToPercentile(raw: number, norm: NormData): number {
  const z = rawToZScore(raw, norm)
  return zScoreToPercentile(z)
}

/**
 * Create a fully normalized score object
 */
export function createNormalizedScore(
  raw: number,
  norm: NormData
): NormalizedScore {
  const z_score = rawToZScore(raw, norm)
  const percentile = zScoreToPercentile(z_score)
  const category = getPercentileCategory(percentile) as NormalizedScore['category']

  return {
    raw: Math.round(raw * 100) / 100, // Round to 2 decimals
    z_score: Math.round(z_score * 1000) / 1000, // Round to 3 decimals
    percentile: Math.round(percentile * 10) / 10, // Round to 1 decimal
    category,
  }
}

// ============================================
// BIG FIVE NORMALIZATION
// ============================================

export function normalizeBig5(rawScores: Partial<Big5RawScores>): {
  normalized: { [trait: string]: NormalizedScore }
  percentiles: Partial<Big5Percentiles>
} {
  const normalized: { [trait: string]: NormalizedScore } = {}
  const percentiles: Partial<Big5Percentiles> = {}

  const traits = ['N', 'E', 'O', 'A', 'C'] as const

  // Detect scale and rescale to BFI-44 (8-40 range) if needed
  // BFI-2 raw scores are typically 12-60
  // BFI-44 raw scores are typically 8-40 (O is 10-50)
  const needsScaling = Object.values(rawScores).some(v => v !== undefined && v !== null && v > 40)
  const isBFI2 = Object.values(rawScores).some(v => v !== undefined && v !== null && v > 10) &&
    Object.values(rawScores).every(v => v === undefined || v === null || v <= 60)

  for (const trait of traits) {
    let raw = rawScores[trait]
    if (raw !== undefined && raw !== null) {
      // Use local norms to guarantee availability
      const norm = LOCAL_BIG5_NORMS[trait]


      // Auto-scaling logic
      if (raw <= 6.0) {
        // Likely Average Score (1-5)
        // Map 1-5 to Norm Range
        const minRaw = 1;
        const maxRaw = 5;
        raw = ((raw - minRaw) / (maxRaw - minRaw)) * (norm.range[1] - norm.range[0]) + norm.range[0];
      } else if (raw > norm.range[1]) {
        if (raw <= 60) {
          // Likely BFI-2 Sum (12-60)
          raw = ((raw - 12) / 48) * (norm.range[1] - norm.range[0]) + norm.range[0]
        } else if (raw <= 100) {
          // Likely Percentage (0-100)
          raw = (raw / 100) * (norm.range[1] - norm.range[0]) + norm.range[0]
        }
      }

      normalized[trait] = createNormalizedScore(raw, norm)
      percentiles[trait] = normalized[trait].percentile
    }
  }

  return { normalized, percentiles }
}

// ============================================
// DASS-21 NORMALIZATION
// ============================================

export function normalizeDASS21(rawScores: Partial<DASS21RawScores>): {
  normalized: Partial<DASS21Normalized>
  percentiles: Partial<{ D: number; A: number; S: number }>
} {
  const normalized: Partial<DASS21Normalized> = {}
  const percentiles: Partial<{ D: number; A: number; S: number }> = {}

  const scales = ['D', 'A', 'S'] as const

  for (const scale of scales) {
    const raw = rawScores[scale]
    if (raw !== undefined && raw !== null) {
      const norm = DASS21_NORMS[scale]
      normalized[scale] = createNormalizedScore(raw, norm)
      percentiles[scale] = normalized[scale]!.percentile
    }
  }

  return { normalized, percentiles }
}

// ============================================
// VIA STRENGTHS NORMALIZATION
// ============================================

export function normalizeVIA(rawScores: Partial<VIARawScores>): {
  normalized: { [strength: string]: NormalizedScore }
  percentiles: Partial<VIAPercentiles>
} {
  const normalized: { [strength: string]: NormalizedScore } = {}
  const percentiles: Partial<VIAPercentiles> = {}

  for (const [strength, raw] of Object.entries(rawScores)) {
    if (raw !== undefined && raw !== null) {
      const norm = VIA_NORMS[strength]
      if (norm) {
        normalized[strength] = createNormalizedScore(raw, norm)
        percentiles[strength] = normalized[strength].percentile
      }
    }
  }

  return { normalized, percentiles }
}

// ============================================
// MBTI → BIG FIVE MAPPING (Section 5 of spec)
// ============================================

/**
 * Map MBTI type to Big5 percentile priors
 * Used when Big5 data is not available (cold start)
 */
export function mbtiToBig5Priors(
  mbti: string
): (Big5Percentiles & { _source: string; _confidence: string }) | null {
  if (!mbti || mbti.length !== 4) return null

  const type = mbti.toUpperCase()
  const priors: any = {
    N: 50,
    E: 50,
    O: 50,
    A: 50,
    C: 50,
    _source: 'mbti_inferred',
    _confidence: 'MEDIUM',
  }

  // E/I → Extraversion
  priors.E = type[0] === 'I' ? 30 : 70

  // S/N → Openness
  priors.O = type[1] === 'N' ? 70 : 30

  // T/F → Agreeableness
  priors.A = type[2] === 'F' ? 70 : 30

  // J/P → Conscientiousness
  priors.C = type[3] === 'J' ? 70 : 30

  // Neuroticism inference (MBTI doesn't measure this directly)
  // Based on empirical research patterns
  if (type.startsWith('INF')) {
    // INF types tend higher N
    priors.N = 70
  } else if (type.startsWith('INP')) {
    // INP types moderately higher N
    priors.N = 65
  } else if (type.startsWith('ISF')) {
    // ISF types slightly higher N
    priors.N = 60
  } else if (type.startsWith('E') && type[2] === 'T') {
    // ExT types tend lower N
    priors.N = 30
  } else if (type.startsWith('EST')) {
    // EST types lowest N
    priors.N = 25
  }

  return priors
}

/**
 * Get MBTI type risk profile
 * Based on empirical research (Section 5.3 of spec)
 */
export function getMBTIRiskProfile(mbti: string): MBTIRiskProfile {
  const type = mbti.toUpperCase()

  const profiles: Record<string, MBTIRiskProfile> = {
    INFP: {
      risk_level: 'VERY_HIGH' as RiskLevel,
      risks: ['Trầm cảm', 'Lo âu', 'Quá tải cảm xúc'],
      interventions: ['Liệu pháp hy vọng', 'Xây dựng cấu trúc', 'Thói quen nhỏ'],
      communication_style: 'value_focused' as CommunicationStyle,
    },
    INFJ: {
      risk_level: 'HIGH' as RiskLevel,
      risks: ['Kiệt sức do thấu cảm', 'Burnout'],
      interventions: ['Thiết lập ranh giới', 'Thời gian tĩnh tâm'],
      communication_style: 'meaning_focused' as CommunicationStyle,
    },
    ISFP: {
      risk_level: 'HIGH' as RiskLevel,
      risks: ['Trầm cảm', 'Né tránh'],
      interventions: ['Kích hoạt vận động', 'Xây dựng nhiệt huyết'],
      communication_style: 'experience_focused' as CommunicationStyle,
    },
    INTP: {
      risk_level: 'MEDIUM' as RiskLevel,
      risks: ['Tê liệt phân tích', 'Cô lập'],
      interventions: ['Tập trung hành động', 'Xây dựng cấu trúc'],
      communication_style: 'logic_focused' as CommunicationStyle,
    },
    ISFJ: {
      risk_level: 'MEDIUM' as RiskLevel,
      risks: ['Burnout', 'Lấy lòng người khác'],
      interventions: ['Tự chăm sóc', 'Thiết lập ranh giới'],
      communication_style: 'duty_focused' as CommunicationStyle,
    },
    ENFP: {
      risk_level: 'MEDIUM' as RiskLevel,
      risks: ['Quá tải', 'Phân tán'],
      interventions: ['Tập trung', 'Tự điều chỉnh'],
      communication_style: 'possibility_focused' as CommunicationStyle,
    },
    ENFJ: {
      risk_level: 'MEDIUM' as RiskLevel,
      risks: ['Cho đi quá mức'],
      interventions: ['Tự chăm sóc', 'Tập trung vào bản thân'],
      communication_style: 'people_focused' as CommunicationStyle,
    },
    INTJ: {
      risk_level: 'MEDIUM' as RiskLevel,
      risks: ['Cô lập', 'Cầu toàn'],
      interventions: ['Kết nối xã hội', 'Sự linh hoạt'],
      communication_style: 'strategy_focused' as CommunicationStyle,
    },
    ISTP: {
      risk_level: 'MEDIUM' as RiskLevel,
      risks: ['Mất kết nối'],
      interventions: ['Tham gia hoạt động', 'Xây dựng cấu trúc'],
      communication_style: 'practical_focused' as CommunicationStyle,
    },
    ISTJ: {
      risk_level: 'LOW' as RiskLevel,
      risks: ['Cứng nhắc'],
      interventions: ['Sự linh hoạt'],
      communication_style: 'procedure_focused' as CommunicationStyle,
    },
    ENTP: {
      risk_level: 'LOW' as RiskLevel,
      risks: ['Năng lượng phân tán'],
      interventions: ['Tập trung', 'Hoàn tất mục tiêu'],
      communication_style: 'debate_focused' as CommunicationStyle,
    },
    ESFP: {
      risk_level: 'LOW' as RiskLevel,
      risks: ['Bốc đồng'],
      interventions: ['Lập kế hoạch', 'Suy ngẫm'],
      communication_style: 'action_focused' as CommunicationStyle,
    },
    ESFJ: {
      risk_level: 'LOW' as RiskLevel,
      risks: ['Lấy lòng người khác'],
      interventions: ['Sự quyết đoán'],
      communication_style: 'harmony_focused' as CommunicationStyle,
    },
    ESTJ: {
      risk_level: 'VERY_LOW' as RiskLevel,
      risks: ['Cứng nhắc', 'Thù địch'],
      interventions: ['Sự linh hoạt', 'Sự thấu cảm'],
      communication_style: 'efficiency_focused' as CommunicationStyle,
    },
    ENTJ: {
      risk_level: 'VERY_LOW' as RiskLevel,
      risks: ['Kiệt sức nếu làm việc quá sức'],
      interventions: ['Sự cân bằng', 'Ủy thác công việc'],
      communication_style: 'goal_focused' as CommunicationStyle,
    },
    ESTP: {
      risk_level: 'VERY_LOW' as RiskLevel,
      risks: ['Chấp nhận rủi ro'],
      interventions: ['Sự thận trọng'],
      communication_style: 'results_focused' as CommunicationStyle,
    },
  }

  return (
    profiles[type] || {
      risk_level: 'MEDIUM' as RiskLevel,
      risks: ['general'],
      interventions: ['general_support'],
      communication_style: 'neutral' as CommunicationStyle,
    }
  )
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate raw score is within expected range
 */
export function validateRawScore(
  raw: number,
  norm: NormData | undefined,
  label: string
): { valid: boolean; error?: string } {
  // Defensive: if norm is undefined, skip validation (assume valid)
  if (!norm || !norm.range) {
    console.warn(`validateRawScore: No norm found for ${label}, skipping validation`)
    return { valid: true }
  }
  if (raw < norm.range[0] || raw > norm.range[1]) {
    return {
      valid: false,
      error: `${label} score ${raw} out of valid range [${norm.range[0]}, ${norm.range[1]}]`,
    }
  }
  return { valid: true }
}

/**
 * Validate Big5 raw scores
 */
export function validateBig5Scores(
  scores: Partial<Big5RawScores>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  for (const [trait, value] of Object.entries(scores)) {
    if (value !== undefined && value !== null) {
      // For Big5, we are lenient to support BFI-44 (max 40/50), BFI-2 (max 60) and % (max 100)
      if (value < 0 || value > 100) {
        errors.push(`Big5-${trait} score ${value} out of logical range [0, 100]`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validate DASS-21 raw scores
 */
export function validateDASS21Scores(
  scores: Partial<DASS21RawScores>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Only validate D, A, S keys - ignore other keys in subscale_scores
  const validKeys = ['D', 'A', 'S']
  for (const scale of validKeys) {
    const value = (scores as Record<string, number | undefined>)[scale]
    if (value !== undefined && value !== null) {
      const norm = DASS21_NORMS[scale]
      if (norm) {
        const validation = validateRawScore(value, norm, `DASS21-${scale}`)
        if (!validation.valid && validation.error) {
          errors.push(validation.error)
        }
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validate VIA raw scores
 */
export function validateVIAScores(
  scores: Partial<VIARawScores>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  for (const [strength, value] of Object.entries(scores)) {
    if (value !== undefined && value !== null) {
      const norm = VIA_NORMS[strength]
      if (norm) {
        const validation = validateRawScore(value, norm, `VIA-${strength}`)
        if (!validation.valid && validation.error) {
          errors.push(validation.error)
        }
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validate MBTI type format
 */
export function validateMBTI(mbti: string): { valid: boolean; error?: string } {
  if (mbti.length !== 4) {
    return { valid: false, error: 'MBTI must be 4 characters' }
  }

  const valid = [
    ['E', 'I'],
    ['S', 'N'],
    ['T', 'F'],
    ['J', 'P'],
  ]

  const type = mbti.toUpperCase()
  for (let i = 0; i < 4; i++) {
    if (!valid[i].includes(type[i])) {
      return {
        valid: false,
        error: `Invalid MBTI character '${type[i]}' at position ${i + 1}`,
      }
    }
  }

  return { valid: true }
}

// ============================================
// COMPREHENSIVE NORMALIZATION ENGINE
// ============================================

export class NormalizationEngine {
  /**
   * Normalize all available test data
   */
  normalize(data: {
    big5_raw?: Partial<Big5RawScores>
    dass21_raw?: Partial<DASS21RawScores>
    via_raw?: Partial<VIARawScores>
    mbti?: string
  }) {
    const result: any = {
      big5: null,
      dass21: null,
      via: null,
      mbti_priors: null,
      errors: [],
    }

    // Normalize Big5
    if (data.big5_raw) {
      const validation = validateBig5Scores(data.big5_raw)
      if (validation.valid) {
        result.big5 = normalizeBig5(data.big5_raw)
      } else {
        result.errors.push(...validation.errors)
      }
    }

    // Normalize DASS-21
    if (data.dass21_raw) {
      const validation = validateDASS21Scores(data.dass21_raw)
      if (validation.valid) {
        result.dass21 = normalizeDASS21(data.dass21_raw)
      } else {
        result.errors.push(...validation.errors)
      }
    }

    // Normalize VIA
    if (data.via_raw) {
      const validation = validateVIAScores(data.via_raw)
      if (validation.valid) {
        result.via = normalizeVIA(data.via_raw)
      } else {
        result.errors.push(...validation.errors)
      }
    }

    // MBTI priors (if no Big5)
    if (data.mbti && !data.big5_raw) {
      const validation = validateMBTI(data.mbti)
      if (validation.valid) {
        result.mbti_priors = mbtiToBig5Priors(data.mbti)
      } else if (validation.error) {
        result.errors.push(validation.error)
      }
    }

    return result
  }
}
