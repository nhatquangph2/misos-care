/**
 * MISO V3 - Discrepancy Detection
 * Detects 6 types of psychological discrepancies (D1-D6)
 * Section 6 of specification
 */

import {
  DASS21_SEVERITY_THRESHOLDS,
  DISCREPANCY_THRESHOLDS,
} from './constants'
import type {
  Big5Percentiles,
  VIAPercentiles,
  DASS21RawScores,
  Discrepancy,
  DiscrepancyID,
  DiscrepancySeverity,
} from '@/types/miso-v3'

const {
  DELTA_ACUTE_STRESS,
  DELTA_REPRESSIVE,
  N_LOW_THRESHOLD,
  N_VERY_LOW_THRESHOLD,
  N_VERY_HIGH_THRESHOLD,
  VIA_HIGH_THRESHOLD,
  VIA_LOW_THRESHOLD,
} = DISCREPANCY_THRESHOLDS

// ============================================
// HELPER FUNCTIONS
// ============================================

function isHighDASS(score: number, scale: 'D' | 'A' | 'S'): boolean {
  const thresholds = DASS21_SEVERITY_THRESHOLDS[scale]
  return score >= thresholds.SEVERE[0]
}

function isNormalDASS(score: number, scale: 'D' | 'A' | 'S'): boolean {
  const thresholds = DASS21_SEVERITY_THRESHOLDS[scale]
  return score <= thresholds.NORMAL[1]
}

// ============================================
// DISCREPANCY DETECTION
// ============================================

/**
 * Detect all discrepancies
 * Returns array of detected discrepancies
 */
export function detectDiscrepancies(input: {
  big5_percentiles: Partial<Big5Percentiles>
  via_percentiles?: Partial<VIAPercentiles>
  dass_raw: Partial<DASS21RawScores>
  mbti?: string
  delta?: number // Overall delta from prediction
}): Discrepancy[] {
  const discrepancies: Discrepancy[] = []

  const {
    big5_percentiles: { N = 50, E = 50, O = 50, A = 50, C = 50 },
    via_percentiles = {},
    dass_raw,
    mbti,
    delta,
  } = input

  const { D = 0, A: anxiety = 0, S = 0 } = dass_raw
  const dassTotal = D + anxiety + S

  // ============================================
  // D1: ACUTE SITUATIONAL STRESS
  // ============================================
  // Low N but High Anxiety → Probably a specific stressor, not personality
  if (N < N_LOW_THRESHOLD && isHighDASS(anxiety, 'A')) {
    discrepancies.push({
      id: 'D1',
      name: 'Căng thẳng tình huống cấp tính',
      severity: 'MODERATE',
      interpretation:
        'Lo âu cao nhưng Neuroticism thấp. Đây có thể là stress cấp tính từ sự kiện cụ thể (exams, deadline, conflict) chứ không phải vấn đề nhân cách mạn tính.',
      interventions: ['problem_solving', 'short_term_relaxation', 'time_management'],
      avoid: ['personality_restructuring', 'long_term_therapy'],
      prognosis: 'GOOD',
    })
  }

  // ============================================
  // D2: REPRESSIVE COPING
  // ============================================
  // Very low N + Normal D/A + High Stress
  // Suppressing emotions, but body is reacting
  if (
    N < N_VERY_LOW_THRESHOLD &&
    isNormalDASS(D, 'D') &&
    isNormalDASS(anxiety, 'A') &&
    isHighDASS(S, 'S')
  ) {
    discrepancies.push({
      id: 'D2',
      name: 'Cơ chế kìm nén (Repressive Coping)',
      severity: 'MODERATE',
      interpretation:
        'Kìm nén cảm xúc. Điểm N rất thấp nhưng Stress cao. Tâm lý tự nhận "ổn" nhưng cơ thể đang phản ứng. Nguy cơ: somatization (đau đầu, đau dạ dày).',
      interventions: ['somatic_therapy', 'body_scan', 'interoception_training', 'expressive_writing'],
      avoid: ['direct_CBT', 'emotional_confrontation'],
    })
  }

  // ============================================
  // D3: SOMATIZATION
  // ============================================
  // Extension of D2: If also have somatic complaints (inferred)
  // Note: Would need additional somatic symptom data to detect fully
  // This is a placeholder for when we have that data

  // ============================================
  // D4: SEVERE DISTRESS
  // ============================================
  // Very high N + Very high total DASS
  if (N > N_VERY_HIGH_THRESHOLD && dassTotal > 60) {
    let subtype: string | undefined
    let interventions: string[]

    // D4a: Hostile/Distressed (Low A)
    if (A < 30) {
      subtype = 'Thù địch/Khó chịu'
      interventions = ['forgiveness_work', 'anger_management', 'compassion_focused_therapy']

      discrepancies.push({
        id: 'D4a',
        name: 'Suy sụp nặng - Dạng Thù địch',
        severity: 'HIGH',
        interpretation:
          'Suy sụp cao độ kết hợp với thù địch (A thấp). Có thể phóng đại triệu chứng hoặc đổ lỗi cho người khác. Cần xử lý cả distress và hostility.',
        interventions,
        subtype,
      })
    }
    // D4b: Reassurance Seeking (High A)
    else if (A > 70) {
      subtype = 'Tìm kiếm sự trấn an'
      interventions = ['validation_then_autonomy', 'self_efficacy_building', 'gradual_independence']

      discrepancies.push({
        id: 'D4b',
        name: 'Suy sụp nặng - Dạng Tìm kiếm trấn an',
        severity: 'HIGH',
        interpretation:
          'Suy sụp cao độ kết hợp với tính cách dễ dãi/phụ thuộc (A cao). Có xu hướng tìm kiếm trấn an liên tục. Cần validation trước, sau đó dần xây dựng tự chủ.',
        interventions,
        subtype,
      })
    }
    // Generic D4 (neither hostile nor reassurance-seeking)
    else {
      discrepancies.push({
        id: 'D4',
        name: 'Suy sụp nghiêm trọng',
        severity: 'HIGH',
        interpretation:
          'Neuroticism và DASS đều rất cao. Suy sụp cảm xúc nghiêm trọng. Có thể có xu hướng phóng đại triệu chứng hoặc vấn đề lâm sàng thực sự. Cần đánh giá kỹ.',
        interventions: ['professional_referral', 'crisis_support', 'medication_evaluation'],
      })
    }
  }

  // ============================================
  // D5: HOPE-DEPRESSION PARADOX
  // ============================================
  // High Hope but High Depression = "Smiling Depression"
  const hope = via_percentiles.Hope ?? 50
  if (hope > VIA_HIGH_THRESHOLD && isHighDASS(D, 'D')) {
    discrepancies.push({
      id: 'D5',
      name: 'Nghịch lý Hy vọng - Trầm cảm',
      severity: 'HIGH',
      interpretation:
        'Điểm Hope cao nhưng trầm cảm nặng. Có thể là "Smiling Depression" - che giấu đau khổ sau vẻ ngoài lạc quan. Đặc biệt nguy hiểm vì ít người nghi ngờ.',
      interventions: ['safety_screening', 'deeper_assessment', 'authentic_expression_encouragement'],
      flags: ['MONITOR_CLOSELY', 'SMILING_DEPRESSION'],
    })
  }

  // ============================================
  // D6: UNEXPECTED RESILIENCE
  // ============================================
  // Vulnerable MBTI type but low DASS
  const vulnerableTypes = ['INFP', 'INFJ', 'ISFP']
  if (mbti && vulnerableTypes.includes(mbti.toUpperCase()) && dassTotal < 15) {
    discrepancies.push({
      id: 'D6',
      name: 'Khả năng phục hồi bất ngờ',
      severity: 'POSITIVE',
      interpretation:
        `MBTI ${mbti.toUpperCase()} thường có nguy cơ cao nhưng điểm DASS rất thấp. VIA strengths (đặc biệt Hope, Zest) đang bảo vệ hiệu quả. Đây là protective factors tốt!`,
      action: 'Xác định các yếu tố bảo vệ',
      interventions: ['strength_amplification', 'maintain_current_strategies'],
    })
  }

  // ============================================
  // T1: BIG5 TEMPORAL INSTABILITY
  // ============================================
  // Note: This would be detected in temporal.ts
  // Included here for completeness

  return discrepancies
}

// ============================================
// DISCREPANCY PRIORITIZATION
// ============================================

/**
 * Sort discrepancies by priority (severity + flags)
 */
export function prioritizeDiscrepancies(discrepancies: Discrepancy[]): Discrepancy[] {
  const severityOrder: Record<DiscrepancySeverity, number> = {
    CRITICAL: 5,
    HIGH: 4,
    MODERATE: 3,
    WARNING: 2,
    POSITIVE: 1,
  }

  return discrepancies.sort((a, b) => {
    // First by severity
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]
    if (severityDiff !== 0) return severityDiff

    // Then by flags (more flags = higher priority)
    const aFlags = a.flags?.length || 0
    const bFlags = b.flags?.length || 0
    return bFlags - aFlags
  })
}

/**
 * Get highest priority discrepancy
 */
export function getHighestPriorityDiscrepancy(
  discrepancies: Discrepancy[]
): Discrepancy | null {
  if (discrepancies.length === 0) return null
  const sorted = prioritizeDiscrepancies(discrepancies)
  return sorted[0]
}

/**
 * Check if any critical discrepancies exist
 */
export function hasCriticalDiscrepancy(discrepancies: Discrepancy[]): boolean {
  return discrepancies.some((d) => d.severity === 'CRITICAL' || d.severity === 'HIGH')
}

/**
 * Get discrepancy description in Vietnamese
 */
export const DISCREPANCY_DESCRIPTIONS: Record<DiscrepancyID, string> = {
  D1: 'Stress cấp tính từ sự kiện cụ thể, không phải vấn đề nhân cách mạn tính.',
  D2: 'Kìm nén cảm xúc. Tâm lý "ổn" nhưng cơ thể phản ứng.',
  D3: 'Cảm xúc biểu hiện thành triệu chứng cơ thể (đau đầu, đau bụng).',
  D4: 'Suy sụp nghiêm trọng. Cần đánh giá kỹ.',
  D4a: 'Suy sụp + Thù địch. Đổ lỗi cho người khác.',
  D4b: 'Suy sụp + Tìm kiếm trấn an liên tục.',
  D5: 'Smiling Depression. Che giấu đau khổ sau vẻ lạc quan.',
  D6: 'Kiên cường bất ngờ. VIA đang bảo vệ tốt.',
  T1: 'Big5 thay đổi quá nhanh. Có thể do mood hoặc không nhất quán.',
}

/**
 * Get intervention explanation
 */
export const INTERVENTION_EXPLANATIONS: Record<string, string> = {
  problem_solving: 'Tập trung giải quyết vấn đề cụ thể gây stress',
  somatic_therapy: 'Liệu pháp tập trung vào kết nối tâm lý-cơ thể',
  forgiveness_work: 'Thực hành tha thứ và giảm thù địch',
  safety_screening: 'Đánh giá nguy cơ tự hại',
  identify_protective_factors: 'Xác định điểm mạnh đang bảo vệ',
}
