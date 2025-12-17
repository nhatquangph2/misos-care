/**
 * MISO V3 - Lite Mode Analysis
 * DASS-21 only analysis for cold start
 * Section 10 of specification
 */

import { DASS21_SEVERITY_THRESHOLDS, RETEST_SCHEDULE } from './constants'
import type { DASS21RawScores, LiteModeAnalysis, SeverityLevel, InterventionPriority } from '@/types/miso-v3'

// ============================================
// SEVERITY CLASSIFICATION
// ============================================

function classifySeverity(score: number, scale: 'D' | 'A' | 'S'): SeverityLevel {
  const thresholds = DASS21_SEVERITY_THRESHOLDS[scale]

  for (const [level, [min, max]] of Object.entries(thresholds)) {
    if (score >= min && score <= max) {
      return level as SeverityLevel
    }
  }

  return 'NORMAL'
}

function getSeverityRange(level: SeverityLevel, scale: 'D' | 'A' | 'S'): string {
  const thresholds = DASS21_SEVERITY_THRESHOLDS[scale]
  const range = thresholds[level]
  return `${range[0]}-${range[1]}`
}

// ============================================
// LITE MODE ANALYSIS
// ============================================

/**
 * Analyze DASS-21 only (when no other data available)
 */
export function analyzeDASS21Only(dass: DASS21RawScores): LiteModeAnalysis {
  const result: LiteModeAnalysis = {
    mode: 'LITE_ANALYSIS',
    severity: {
      D: {
        score: dass.D,
        level: classifySeverity(dass.D, 'D'),
        range: '',
      },
      A: {
        score: dass.A,
        level: classifySeverity(dass.A, 'A'),
        range: '',
      },
      S: {
        score: dass.S,
        level: classifySeverity(dass.S, 'S'),
        range: '',
      },
    },
    priority_concern: null,
    immediate_actions: [],
    first_aid: [],
    next_steps: [],
    confidence: 'LOW',
  }

  // Add ranges
  result.severity.D.range = getSeverityRange(result.severity.D.level, 'D')
  result.severity.A.range = getSeverityRange(result.severity.A.level, 'A')
  result.severity.S.range = getSeverityRange(result.severity.S.level, 'S')

  // Determine priority concern
  const severityRank: Record<SeverityLevel, number> = {
    EXTREMELY_SEVERE: 5,
    SEVERE: 4,
    MODERATE: 3,
    MILD: 2,
    NORMAL: 1,
  }

  const maxScale = Object.entries(result.severity)
    .sort(([, a], [, b]) => severityRank[b.level] - severityRank[a.level])[0]

  if (severityRank[maxScale[1].level] >= 4) {
    result.priority_concern = maxScale[0] as 'D' | 'A' | 'S'
  }

  // Generate immediate actions
  result.immediate_actions = getImmediateActions(result.severity)

  // Generate first aid content
  result.first_aid = getFirstAid(result.severity)

  // Generate next steps
  result.next_steps = getNextSteps(result.severity)

  return result
}

// ============================================
// IMMEDIATE ACTIONS
// ============================================

function getImmediateActions(severity: LiteModeAnalysis['severity']): LiteModeAnalysis['immediate_actions'] {
  const actions: LiteModeAnalysis['immediate_actions'] = []

  // Crisis check - Extremely severe depression
  if (severity.D.level === 'EXTREMELY_SEVERE') {
    actions.push({
      type: 'CRISIS_ALERT',
      priority: 'CRITICAL',
      message:
        'Điểm trầm cảm rất cao. Nếu có suy nghĩ tự hại, vui lòng liên hệ hotline ngay.',
      resources: [
        { name: 'Hotline Sức khỏe Tâm thần Quốc gia', number: '1800-599-920' },
        { name: 'Hotline Hỗ trợ Tâm lý', number: '1900-0000' },
      ],
    })
  }

  // High anxiety
  if (severity.A.level === 'SEVERE' || severity.A.level === 'EXTREMELY_SEVERE') {
    actions.push({
      type: 'GROUNDING',
      priority: 'HIGH',
      message: 'Lo âu cao. Thử kỹ thuật thở 4-7-8 ngay để giảm căng thẳng.',
      exercise: {
        name: 'Thở 4-7-8',
        steps: ['Hít vào qua mũi 4 giây', 'Giữ hơi 7 giây', 'Thở ra qua miệng 8 giây', 'Lặp lại 3-4 lần'],
      },
    })
  }

  // High stress
  if (severity.S.level === 'SEVERE' || severity.S.level === 'EXTREMELY_SEVERE') {
    actions.push({
      type: 'DECOMPRESSION',
      priority: 'HIGH',
      message: 'Stress rất cao. Hãy làm bài thư giãn cơ nhanh.',
      exercise: {
        name: 'Progressive Muscle Relaxation',
        steps: [
          'Nắm chặt tay 5 giây, thả lỏng',
          'Nhăn mặt 5 giây, thả lỏng',
          'Nâng vai lên tai 5 giây, thả xuống',
          'Thở sâu 3 lần',
        ],
      },
    })
  }

  return actions
}

// ============================================
// FIRST AID CONTENT
// ============================================

function getFirstAid(severity: LiteModeAnalysis['severity']): LiteModeAnalysis['first_aid'] {
  const content: LiteModeAnalysis['first_aid'] = []

  // Depression
  if (
    severity.D.level === 'MODERATE' ||
    severity.D.level === 'SEVERE' ||
    severity.D.level === 'EXTREMELY_SEVERE'
  ) {
    content.push({
      target: 'depression',
      title: 'Đối phó Trầm cảm',
      tips: [
        'Duy trì 1 hoạt động nhỏ mỗi ngày (đi bộ 5 phút, tắm, gọi điện cho bạn)',
        'Kết nối với 1 người tin tưởng - đừng cô lập',
        'KHÔNG đưa quyết định lớn khi tâm trạng xuống thấp',
        'Ngủ đủ 7-9h và ăn đều đặn dù không có hứng',
        'Nhớ rằng: cảm giác này sẽ qua, chỉ là tạm thời',
      ],
    })
  }

  // Anxiety
  if (
    severity.A.level === 'MODERATE' ||
    severity.A.level === 'SEVERE' ||
    severity.A.level === 'EXTREMELY_SEVERE'
  ) {
    content.push({
      target: 'anxiety',
      title: 'Đối phó Lo âu',
      tips: [
        'Thở sâu: Hít vào 4s, giữ 4s, thở ra 4s, lặp lại',
        'Grounding 5-4-3-2-1: 5 thứ nhìn, 4 nghe, 3 cảm nhận, 2 ngửi, 1 nếm',
        'Hạn chế caffeine (cà phê, trà, nước tăng lực)',
        'Viết ra lo lắng để "xả" khỏi đầu',
        'Tập thể dục 30 phút giúp giải phóng endorphin',
      ],
    })
  }

  // Stress
  if (
    severity.S.level === 'MODERATE' ||
    severity.S.level === 'SEVERE' ||
    severity.S.level === 'EXTREMELY_SEVERE'
  ) {
    content.push({
      target: 'stress',
      title: 'Đối phó Căng thẳng',
      tips: [
        'Liệt kê 3 việc QUAN TRỌNG NHẤT hôm nay, bỏ qua việc khác',
        'Học nói "KHÔNG" với yêu cầu không cần thiết',
        'Nghỉ 5-10 phút mỗi 1-2 giờ làm việc',
        'Vận động cơ thể (đi bộ, yoga, gym)',
        'Tách biệt công việc và thời gian cá nhân',
      ],
    })
  }

  return content
}

// ============================================
// NEXT STEPS
// ============================================

function getNextSteps(severity: LiteModeAnalysis['severity']): LiteModeAnalysis['next_steps'] {
  const steps: LiteModeAnalysis['next_steps'] = []

  const severityRank: Record<SeverityLevel, number> = {
    EXTREMELY_SEVERE: 5,
    SEVERE: 4,
    MODERATE: 3,
    MILD: 2,
    NORMAL: 1,
  }

  const maxLevel = Math.max(
    severityRank[severity.D.level],
    severityRank[severity.A.level],
    severityRank[severity.S.level]
  )

  // Professional referral if severe
  if (maxLevel >= 4) {
    steps.push({
      priority: 'HIGH',
      action: 'professional_referral',
      message: 'Với mức độ này, NÊN GẶP chuyên gia tâm lý/tâm thần để được hỗ trợ chuyên sâu.',
    })
  }

  // Always suggest deeper assessment
  steps.push({
    priority: 'MEDIUM',
    action: 'complete_assessment',
    message:
      'Hoàn thành thêm các bài test khác (Big Five, VIA Strengths) để có phân tích CÁ NHÂN HÓA sâu hơn.',
    tests: ['Big Five (BFI-2)', 'VIA Character Strengths', 'MBTI'],
    unlocks: [
      'Phân tích tính cách chi tiết',
      'Can thiệp dựa trên điểm mạnh',
      'Dự đoán xu hướng',
      'Kế hoạch phát triển cá nhân',
    ],
  })

  // Retest schedule
  const retestDays =
    maxLevel === 5 ? RETEST_SCHEDULE.CRISIS
    : maxLevel === 4 ? RETEST_SCHEDULE.SEVERE
    : maxLevel === 3 ? RETEST_SCHEDULE.MODERATE
    : RETEST_SCHEDULE.NORMAL

  steps.push({
    priority: 'LOW',
    action: 'schedule_retest',
    message: `Làm lại DASS-21 sau ${retestDays} ngày để theo dõi tiến triển.`,
  })

  return steps
}

// ============================================
// DATA COMPLETENESS ASSESSMENT
// ============================================

export interface DataCompleteness {
  level: 'NONE' | 'MINIMAL' | 'BASIC' | 'STANDARD' | 'COMPREHENSIVE' | 'COMPLETE'
  mode: 'LITE' | 'BASIC' | 'STANDARD' | 'FULL' | 'FULL_PLUS' | null
  confidence: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'MEDIUM_LOW' | 'LOW'
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

/**
 * Assess data completeness level
 */
export function assessDataCompleteness(data: {
  dass21_raw?: any
  big5_raw?: any
  via_raw?: any
  mbti?: string
}): DataCompleteness {
  const hasDASS = !!data.dass21_raw
  const hasBig5 = !!data.big5_raw
  const hasVIA = !!data.via_raw
  const hasMBTI = !!data.mbti

  // No DASS = cannot analyze
  if (!hasDASS) {
    return {
      level: 'NONE',
      mode: null,
      confidence: 'LOW',
      features: [],
      has: { dass: false, big5: false, via: false, mbti: false },
      message: 'Cần ít nhất DASS-21 để phân tích',
      next: 'complete_dass21',
    }
  }

  // Determine level
  let level: DataCompleteness['level']
  let mode: DataCompleteness['mode']
  let confidence: DataCompleteness['confidence']
  let features: string[]

  if (hasDASS && hasBig5 && hasVIA && hasMBTI) {
    level = 'COMPLETE'
    mode = 'FULL_PLUS'
    confidence = 'VERY_HIGH'
    features = ['severity', 'profile', 'BVS/RCS', 'discrepancy', 'strengths', 'cross_validation']
  } else if (hasDASS && hasBig5 && hasVIA) {
    level = 'COMPREHENSIVE'
    mode = 'FULL'
    confidence = 'HIGH'
    features = ['severity', 'profile', 'BVS/RCS', 'discrepancy', 'strength_interventions']
  } else if (hasDASS && hasBig5) {
    level = 'STANDARD'
    mode = 'STANDARD'
    confidence = 'MEDIUM'
    features = ['severity', 'profile', 'BVS', 'discrepancy']
  } else if (hasDASS && hasMBTI) {
    level = 'BASIC'
    mode = 'BASIC'
    confidence = 'MEDIUM_LOW'
    features = ['severity', 'mbti_profile', 'basic_recommendations']
  } else {
    level = 'MINIMAL'
    mode = 'LITE'
    confidence = 'LOW'
    features = ['severity', 'first_aid', 'crisis']
  }

  // Determine what's missing for upgrade
  let missing_for_upgrade: DataCompleteness['missing_for_upgrade']

  if (level === 'MINIMAL') {
    missing_for_upgrade = {
      missing: ['Big Five'],
      benefit: 'Mở khóa phân tích tính cách và dự đoán xu hướng',
    }
  } else if (level === 'BASIC') {
    missing_for_upgrade = {
      missing: ['Big Five'],
      benefit: 'Mở khóa điểm dễ bị tổn thương (BVS) và phân loại profile',
    }
  } else if (level === 'STANDARD') {
    missing_for_upgrade = {
      missing: ['VIA Strengths'],
      benefit: 'Mở khóa can thiệp dựa trên điểm mạnh (RCS)',
    }
  } else if (level === 'COMPREHENSIVE') {
    missing_for_upgrade = {
      missing: ['MBTI'],
      benefit: 'Mở khóa tối ưu hóa giao tiếp và phong cách học tập',
    }
  } else {
    missing_for_upgrade = {
      missing: [],
      benefit: 'Hoàn hảo! Đã có đầy đủ dữ liệu.',
    }
  }

  return {
    level,
    mode,
    confidence,
    features,
    has: { dass: hasDASS, big5: hasBig5, via: hasVIA, mbti: hasMBTI },
    missing_for_upgrade,
  }
}
