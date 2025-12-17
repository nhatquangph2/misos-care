/**
 * MISO V3 - Big Five Profile Classifier
 * Classifies users into 8 profiles (B1-B8) based on Big Five percentiles
 * Section 4 of specification
 */

import { PROFILE_THRESHOLDS } from './constants'
import type { Big5Percentiles, Big5ProfileData, SeverityLevel, RiskLevel } from '@/types/miso-v3'

const { HIGH_PERCENTILE, LOW_PERCENTILE } = PROFILE_THRESHOLDS

// ============================================
// PROFILE CLASSIFICATION
// ============================================

/**
 * Classify user into one of 8 Big Five profiles
 * Priority order matters: Check highest risk first
 */
export function classifyBig5Profile(percentiles: Partial<Big5Percentiles>): Big5ProfileData {
  const { N = 50, E = 50, O = 50, A = 50, C = 50 } = percentiles

  // B4: Misery Triad (HIGHEST PRIORITY - Critical risk)
  // High N + Low E + Low C
  if (N > HIGH_PERCENTILE && E < LOW_PERCENTILE && C < LOW_PERCENTILE) {
    return {
      id: 'B4',
      name: 'Misery Triad',
      risk_level: 'CRITICAL',
      predicted_dass: {
        D: 'EXTREMELY_SEVERE',
        A: 'EXTREMELY_SEVERE',
        S: 'EXTREMELY_SEVERE',
      },
      mechanism:
        'Combined vulnerability: Dysregulation (low C) + Isolation (low E) + High negative affect (high N). Highest MDD risk.',
      interventions: [
        'safety_screening',
        'hope_therapy',
        'social_connection',
        'behavioral_activation',
        'micro_habits',
      ],
      flags: ['SUICIDE_RISK_SCREEN', 'PRIORITY_CASE'],
    }
  }

  // B3: Introverted Neurotic
  // High N + Low E
  if (N > HIGH_PERCENTILE && E < LOW_PERCENTILE) {
    return {
      id: 'B3',
      name: 'Introverted Neurotic',
      risk_level: 'HIGH',
      predicted_dass: {
        D: 'EXTREMELY_SEVERE',
        A: 'SEVERE',
        S: 'SEVERE',
      },
      mechanism:
        'Isolation mechanism: Lacks positive emotions (low E) to balance negative affect (high N). Prone to melancholic depression.',
      interventions: ['zest_building', 'hope_therapy', 'social_connection'],
      flags: ['DEPRESSION_RISK_HIGH'],
    }
  }

  // B2: Vulnerable
  // High N + Low C
  if (N > HIGH_PERCENTILE && C < LOW_PERCENTILE) {
    return {
      id: 'B2',
      name: 'Vulnerable',
      risk_level: 'HIGH',
      predicted_dass: {
        D: 'SEVERE',
        A: 'SEVERE',
        S: 'MODERATE',
      },
      mechanism:
        'Dysregulation mechanism: High anxiety (N) without self-control (C) leads to avoidance and paralysis.',
      interventions: ['self_regulation', 'behavioral_activation', 'micro_habits'],
      flags: ['INTERNALIZING_RISK', 'IMPULSIVE_COPING_RISK'],
    }
  }

  // B1: Healthy Neurotic
  // High N + High C
  if (N > HIGH_PERCENTILE && C > HIGH_PERCENTILE) {
    return {
      id: 'B1',
      name: 'Healthy Neurotic',
      risk_level: 'MEDIUM',
      predicted_dass: {
        D: 'NORMAL',
        A: 'MODERATE',
        S: 'SEVERE',
      },
      mechanism:
        'Vigilance mechanism: Anxiety (N) is channeled into preparation and structure (C). Functional but stressed.',
      interventions: ['relaxation', 'letting_go', 'self_compassion'],
      flags: ['FUNCTIONAL_STRAIN', 'BURNOUT_WATCH'],
      avoid: ['more_discipline', 'more_structure'],
    }
  }

  // B6: Agitated Neurotic
  // High N + High E
  if (N > HIGH_PERCENTILE && E > HIGH_PERCENTILE) {
    return {
      id: 'B6',
      name: 'Agitated Neurotic',
      risk_level: 'MEDIUM',
      predicted_dass: {
        D: 'MODERATE',
        A: 'SEVERE',
        S: 'SEVERE',
      },
      mechanism:
        'Agitation mechanism: High energy (E) combined with anxiety (N) creates restlessness and overstimulation.',
      interventions: ['grounding', 'anxiety_management', 'mindfulness'],
      flags: ['ANXIETY_PRIORITY'],
    }
  }

  // B8: Sensitive Neurotic
  // High N + High O
  if (N > HIGH_PERCENTILE && O > HIGH_PERCENTILE) {
    return {
      id: 'B8',
      name: 'Sensitive Neurotic',
      risk_level: 'MEDIUM',
      predicted_dass: {
        D: 'MODERATE',
        A: 'SEVERE',
        S: 'MODERATE',
      },
      mechanism:
        'Sensitivity mechanism: High openness amplifies emotional experiences, leading to rumination and overthinking.',
      interventions: ['mindfulness', 'emotional_awareness', 'cognitive_defusion'],
      flags: [],
    }
  }

  // B7: Rigid Neurotic
  // High N + Low O
  if (N > HIGH_PERCENTILE && O < LOW_PERCENTILE) {
    return {
      id: 'B7',
      name: 'Rigid Neurotic',
      risk_level: 'MEDIUM',
      predicted_dass: {
        D: 'MODERATE',
        A: 'MODERATE',
        S: 'SEVERE',
      },
      mechanism:
        'Rigidity mechanism: Strong psychological defenses (low O) against anxiety (N). Resistant to change.',
      interventions: ['behavioral_experiments', 'acceptance_commitment'],
      flags: ['CBT_RESISTANT'],
      avoid: ['traditional_CBT', 'insight_therapy'],
    }
  }

  // B5: Resilient
  // Low N + High C + High E
  if (N < LOW_PERCENTILE && C > HIGH_PERCENTILE && E > HIGH_PERCENTILE) {
    return {
      id: 'B5',
      name: 'Resilient',
      risk_level: 'LOW',
      predicted_dass: {
        D: 'NORMAL',
        A: 'NORMAL',
        S: 'NORMAL',
      },
      mechanism:
        'Stability mechanism: Low threat response (N), good self-control (C), and social resources (E) create robust resilience.',
      interventions: ['growth_challenge', 'meaning_seeking'],
      flags: [],
    }
  }

  // B0: Balanced (default)
  return {
    id: 'B0',
    name: 'Balanced',
    risk_level: 'LOW',
    predicted_dass: {
      D: 'NORMAL',
      A: 'NORMAL',
      S: 'NORMAL',
    },
    mechanism: 'No concerning patterns detected. Traits within average range.',
    interventions: ['maintenance', 'strengths_development'],
    flags: [],
  }
}

// ============================================
// PROFILE DESCRIPTIONS
// ============================================

export const PROFILE_DESCRIPTIONS: Record<string, string> = {
  B1: 'Người lo lắng có hiệu suất. Bạn biến căng thẳng thành năng suất nhưng có nguy cơ kiệt sức.',
  B2: 'Dễ bị tổn thương. Cảm xúc mạnh nhưng thiếu cơ chế kiểm soát. Cần xây dựng kỹ năng tự điều tiết.',
  B3: 'Người hướng nội lo âu. Thiếu năng lượng tích cực để cân bằng cảm xúc tiêu cực. Nguy cơ trầm cảm cao.',
  B4: 'Tam giác khổ đau. Kết hợp của tất cả yếu tố nguy hiểm: mất kiểm soát + cô lập + lo âu cao. CẦN ƯU TIÊN.',
  B5: 'Kiên cường. Ổn định cảm xúc, tự chủ tốt, và năng lượng xã hội. Nguy cơ thấp.',
  B6: 'Người bồn chồn lo âu. Năng lượng cao nhưng hướng vào lo lắng thay vì hành động tích cực.',
  B7: 'Người cứng nhắc lo âu. Phòng thủ mạnh nhưng kháng cự với thay đổi. Khó điều trị bằng CBT truyền thống.',
  B8: 'Người nhạy cảm sâu sắc. Cảm xúc phong phú nhưng dễ suy nghĩ quá mức. Cần mindfulness.',
  B0: 'Cân bằng. Không có mẫu hình đáng lo ngại. Duy trì thói quen tốt.',
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get profile by ID
 */
export function getProfileById(id: string): Big5ProfileData | null {
  // Create a dummy percentile that matches the profile
  const dummyPercentiles: Record<string, Partial<Big5Percentiles>> = {
    B1: { N: 80, C: 80, E: 50, O: 50, A: 50 },
    B2: { N: 80, C: 20, E: 50, O: 50, A: 50 },
    B3: { N: 80, E: 20, C: 50, O: 50, A: 50 },
    B4: { N: 80, E: 20, C: 20, O: 50, A: 50 },
    B5: { N: 20, C: 80, E: 80, O: 50, A: 50 },
    B6: { N: 80, E: 80, C: 50, O: 50, A: 50 },
    B7: { N: 80, O: 20, C: 50, E: 50, A: 50 },
    B8: { N: 80, O: 80, C: 50, E: 50, A: 50 },
    B0: { N: 50, E: 50, O: 50, A: 50, C: 50 },
  }

  const percentile = dummyPercentiles[id]
  if (!percentile) return null

  return classifyBig5Profile(percentile)
}

/**
 * Get profile description in Vietnamese
 */
export function getProfileDescription(profileId: string): string {
  return PROFILE_DESCRIPTIONS[profileId] || PROFILE_DESCRIPTIONS.B0
}

/**
 * Check if profile is high risk
 */
export function isHighRiskProfile(profile: Big5ProfileData): boolean {
  return profile.risk_level === 'CRITICAL' || profile.risk_level === 'HIGH'
}

/**
 * Get all profiles for reference
 */
export function getAllProfiles(): Big5ProfileData[] {
  return ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B0'].map(
    (id) => getProfileById(id)!
  )
}
