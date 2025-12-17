/**
 * MISO V3 - Intervention Allocation System
 * Section 8 of specification
 */

import type {
  Big5ProfileData,
  Discrepancy,
  VIAAnalysis,
  MBTIRiskProfile,
  InterventionPlan,
  Intervention,
  CommunicationStyle,
} from '@/types/miso-v3'
import { getMBTIRiskProfile } from './normalization'

// ============================================
// INTERVENTION LIBRARY
// ============================================

export const INTERVENTION_LIBRARY = {
  // IMMEDIATE (Crisis/Safety)
  safety_screening: {
    category: 'immediate' as const,
    name: 'Sàng lọc nguy cơ tự hại',
    when: ['SUICIDE_RISK', 'CRISIS'],
    description: 'Đánh giá nguy cơ tự hại và kế hoạch an toàn',
    resources: ['Hotline: 1800-599-920'],
  },
  crisis_support: {
    category: 'immediate' as const,
    name: 'Hỗ trợ khủng hoảng',
    when: ['CRISIS'],
    description: 'Can thiệp khủng hoảng ngay lập tức',
  },
  grounding: {
    category: 'immediate' as const,
    name: 'Kỹ thuật grounding',
    when: ['High_Anxiety', 'Panic'],
    description: '5-4-3-2-1: 5 thứ nhìn, 4 nghe, 3 cảm nhận, 2 ngửi, 1 nếm',
  },
  breathing_4_7_8: {
    category: 'immediate' as const,
    name: 'Thở 4-7-8',
    when: ['Anxiety', 'Panic'],
    description: 'Hít vào 4s, giữ 7s, thở ra 8s. Lặp lại 3-4 lần',
  },

  // SHORT-TERM (1-4 weeks)
  behavioral_activation: {
    category: 'short_term' as const,
    name: 'Behavioral Activation',
    when: ['Depression', 'Low_Zest'],
    description: 'Lên lịch hoạt động thú vị bất kể động lực',
    steps: [
      'Liệt kê 10 hoạt động từng thích',
      'Chọn 3 hoạt động dễ nhất',
      'Lên lịch cụ thể (ngày, giờ)',
      'Làm bất kể cảm giác như thế nào',
    ],
  },
  micro_habits: {
    category: 'short_term' as const,
    name: 'Micro-habits',
    when: ['Low_C', 'Low_SelfReg'],
    description: 'Xây dựng thói quen nhỏ (1-2 phút/ngày)',
    examples: ['Uống 1 cốc nước sau khi thức dậy', 'Viết 1 câu nhật ký trước khi ngủ'],
  },
  sleep_hygiene: {
    category: 'short_term' as const,
    name: 'Sleep Hygiene',
    when: ['Low_Zest', 'Depression'],
    description: 'Cải thiện chất lượng giấc ngủ',
    steps: [
      'Ngủ và dậy cùng giờ mỗi ngày',
      'Tránh màn hình 1h trước khi ngủ',
      'Phòng tối, mát, yên tĩnh',
      'Nếu không ngủ được sau 20 phút, ra khỏi giường',
    ],
  },
  relaxation: {
    category: 'short_term' as const,
    name: 'Progressive Muscle Relaxation',
    when: ['High_Stress', 'Healthy_Neurotic'],
    description: 'Thư giãn cơ bắp từng bước',
  },
  social_connection: {
    category: 'short_term' as const,
    name: 'Social Connection',
    when: ['Low_E', 'Depression'],
    description: 'Kết nối xã hội nhẹ nhàng, không áp lực',
    steps: ['Nhắn tin 1 người/ngày', 'Coffee 1-1 với người an toàn', 'Join 1 group hoạt động nhẹ'],
  },
  boundary_setting: {
    category: 'short_term' as const,
    name: 'Boundary Setting',
    when: ['INFJ', 'INFP', 'Burnout'],
    description: 'Đặt ranh giới rõ ràng',
    steps: ['Xác định năng lượng còn lại', 'Nói "không" 1 lần/ngày', 'Block thời gian riêng tư'],
  },
  problem_solving: {
    category: 'short_term' as const,
    name: 'Problem-Solving',
    when: ['Acute_Stress'],
    description: 'Giải quyết vấn đề có cấu trúc',
    steps: ['Define vấn đề cụ thể', 'Brainstorm giải pháp (không filter)', 'Chọn 1 thử nghiệm'],
  },

  // LONG-TERM (1-3 months)
  hope_therapy: {
    category: 'long_term' as const,
    name: 'Hope Therapy',
    when: ['Low_Hope', 'Depression'],
    description: 'Xây dựng lại hy vọng',
    techniques: ['Goal-setting', 'Pathways thinking', 'Best possible self'],
  },
  mindfulness: {
    category: 'long_term' as const,
    name: 'Mindfulness',
    when: ['High_N', 'Rumination'],
    description: 'Thiền chánh niệm',
    types: ['Body scan', 'Breath awareness', 'Loving-kindness'],
  },
  self_regulation_training: {
    category: 'long_term' as const,
    name: 'Self-Regulation Training',
    when: ['Low_SelfReg', 'Low_C'],
    description: 'Tăng khả năng tự kiểm soát',
  },
  forgiveness_work: {
    category: 'long_term' as const,
    name: 'Forgiveness Work',
    when: ['Low_Forgiveness', 'Hostility'],
    description: 'Thực hành tha thứ',
  },
  gratitude_practice: {
    category: 'long_term' as const,
    name: 'Gratitude Practice',
    when: ['Depression', 'Stress'],
    description: '3 điều biết ơn mỗi ngày',
  },
  somatic_therapy: {
    category: 'long_term' as const,
    name: 'Somatic Therapy',
    when: ['Repressive_Coping', 'Somatization'],
    description: 'Liệu pháp tập trung vào cơ thể',
  },
  acceptance_commitment: {
    category: 'long_term' as const,
    name: 'ACT (Acceptance & Commitment Therapy)',
    when: ['Rigid_Neurotic', 'Avoidance'],
    description: 'Chấp nhận và hành động theo giá trị',
  },
  zest_building: {
    category: 'long_term' as const,
    name: 'Zest Building',
    when: ['Low_Zest'],
    description: 'Xây dựng năng lượng sống',
    techniques: ['Physical activity', 'Novel experiences', 'Flow activities'],
  },
}

// ============================================
// INTERVENTION ALLOCATION
// ============================================

/**
 * Allocate interventions based on profile, discrepancies, and VIA
 */
export function allocateInterventions(
  profile: Big5ProfileData,
  discrepancies: Discrepancy[],
  viaAnalysis: VIAAnalysis | null,
  mbti?: string
): InterventionPlan {
  const plan: InterventionPlan = {
    immediate: [],
    short_term: [],
    long_term: [],
    avoid: [],
    communication_style: 'neutral',
    framing: 'neutral',
  }

  // ==========================================
  // PRIORITY 1: SAFETY & CRISIS
  // ==========================================
  if (profile.flags?.includes('SUICIDE_RISK_SCREEN')) {
    plan.immediate.push({
      type: 'safety_screening',
      priority: 'CRITICAL',
    })
  }

  if (profile.flags?.includes('PRIORITY_CASE')) {
    plan.immediate.push({
      type: 'crisis_support',
      priority: 'CRITICAL',
    })
  }

  // ==========================================
  // PRIORITY 2: DISCREPANCY-BASED
  // ==========================================
  for (const disc of discrepancies) {
    if (disc.id === 'D1') {
      // Acute stress
      plan.short_term.push({ type: 'problem_solving' })
      plan.avoid.push('personality_restructuring')
    } else if (disc.id === 'D2') {
      // Repressive coping
      plan.long_term.push({ type: 'somatic_therapy' })
      plan.avoid.push('traditional_CBT')
    } else if (disc.id === 'D4a') {
      // Hostile
      plan.long_term.push({ type: 'forgiveness_work' })
    } else if (disc.id === 'D5') {
      // Hope-Depression Paradox
      plan.immediate.push({ type: 'safety_screening', priority: 'HIGH' })
    }
  }

  // ==========================================
  // PRIORITY 3: PROFILE-BASED
  // ==========================================
  switch (profile.id) {
    case 'B1': // Healthy Neurotic
      plan.short_term.push({ type: 'relaxation' })
      plan.avoid.push('more_discipline', 'more_structure')
      break

    case 'B2': // Vulnerable
    case 'B4': // Misery Triad
      plan.short_term.push({ type: 'behavioral_activation' }, { type: 'micro_habits' })
      if (profile.id === 'B4') {
        plan.immediate.push({ type: 'crisis_support', priority: 'HIGH' })
      }
      break

    case 'B3': // Introverted Neurotic
      plan.short_term.push({ type: 'social_connection' }, { type: 'zest_building' })
      plan.long_term.push({ type: 'hope_therapy' })
      break

    case 'B6': // Agitated Neurotic
      plan.immediate.push({ type: 'grounding' })
      plan.long_term.push({ type: 'mindfulness' })
      break

    case 'B7': // Rigid Neurotic
      plan.long_term.push({ type: 'acceptance_commitment' })
      plan.avoid.push('traditional_CBT', 'insight_therapy')
      break

    case 'B8': // Sensitive Neurotic
      plan.long_term.push({ type: 'mindfulness' })
      break
  }

  // ==========================================
  // PRIORITY 4: VIA-BASED
  // ==========================================
  if (viaAnalysis) {
    for (const build of viaAnalysis.build_strengths) {
      const strengthName = build.strength.toLowerCase().replace(/-/g, '_')
      plan.long_term.push({
        type: `build_${strengthName}`,
        interventions: build.interventions,
      })
    }

    if (viaAnalysis.priority_intervention) {
      const existing = plan.long_term.find((i) => i.type === viaAnalysis.priority_intervention)
      if (!existing) {
        plan.long_term.unshift({
          type: viaAnalysis.priority_intervention,
          priority: 'HIGH',
        })
      }
    }
  }

  // ==========================================
  // PRIORITY 5: MBTI ADJUSTMENTS
  // ==========================================
  if (mbti) {
    const mbtiProfile = getMBTIRiskProfile(mbti)
    plan.communication_style = mbtiProfile.communication_style

    // Add MBTI-specific interventions
    if (['INFJ', 'INFP'].includes(mbti.toUpperCase())) {
      plan.short_term.push({ type: 'boundary_setting' })
    }

    // Framing based on J/P
    if (mbti.length === 4) {
      plan.framing = mbti[3].toUpperCase() === 'J' ? 'plan_oriented' : 'exploration_oriented'
    }
  }

  return plan
}

// ============================================
// COMMUNICATION STYLE MAPPING
// ============================================

export const COMMUNICATION_GUIDELINES: Record<CommunicationStyle, string[]> = {
  value_focused: [
    'Nhấn mạnh ý nghĩa và giá trị',
    'Nói về tác động lên người khác',
    'Tôn trọng giá trị cá nhân',
  ],
  meaning_focused: ['Nói về ý nghĩa sâu xa', 'Kết nối với mục đích lớn', 'Tôn trọng nội tâm'],
  logic_focused: ['Đưa ra lý do logic', 'Data và evidence', 'Phân tích rõ ràng'],
  strategy_focused: ['Nói về hiệu quả', 'Long-term plan', 'Systems thinking'],
  duty_focused: ['Nhấn mạnh trách nhiệm', 'Chăm sóc người khác', 'Làm đúng việc'],
  experience_focused: ['Trải nghiệm thực tế', 'Cảm giác cụ thể', 'Hành động ngay'],
  possibility_focused: ['Nhiều khả năng', 'Tương lai sáng tạo', 'Linh hoạt'],
  people_focused: ['Tác động lên người', 'Harmony', 'Cùng nhau'],
  practical_focused: ['Thực tế', 'Cách làm cụ thể', 'Hiệu quả ngay'],
  procedure_focused: ['Quy trình rõ ràng', 'Bước tiếp theo', 'Tuân thủ'],
  debate_focused: ['Thách thức', 'Tranh luận', 'Nhiều góc độ'],
  action_focused: ['Hành động nhanh', 'Kết quả ngay', 'Năng động'],
  harmony_focused: ['Hài hòa', 'Cùng nhau', 'Không xung đột'],
  efficiency_focused: ['Nhanh', 'Hiệu quả', 'Kết quả đo được'],
  goal_focused: ['Mục tiêu rõ ràng', 'Chiến lược đạt mục tiêu', 'Thách thức'],
  results_focused: ['Kết quả cụ thể', 'Hành động', 'Ngay lập tức'],
  neutral: ['Cân bằng', 'Tùy tình huống', 'Linh hoạt'],
}

// ============================================
// INTERVENTION FORMATTER
// ============================================

export function formatInterventionPlan(plan: InterventionPlan): string {
  let output = '# KẾ HOẠCH CAN THIỆP\n\n'

  if (plan.immediate.length > 0) {
    output += '## NGAY LẬP TỨC\n'
    for (const intervention of plan.immediate) {
      output += `- ${intervention.type} ${intervention.priority ? `(${intervention.priority})` : ''}\n`
    }
    output += '\n'
  }

  if (plan.short_term.length > 0) {
    output += '## NGẮN HẠN (1-4 tuần)\n'
    for (const intervention of plan.short_term) {
      output += `- ${intervention.type}\n`
    }
    output += '\n'
  }

  if (plan.long_term.length > 0) {
    output += '## DÀI HẠN (1-3 tháng)\n'
    for (const intervention of plan.long_term) {
      output += `- ${intervention.type}\n`
    }
    output += '\n'
  }

  if (plan.avoid.length > 0) {
    output += '## TRÁNH\n'
    for (const avoid of plan.avoid) {
      output += `- ${avoid}\n`
    }
    output += '\n'
  }

  output += `\n**Phong cách giao tiếp:** ${plan.communication_style}\n`
  output += `**Framing:** ${plan.framing}\n`

  return output
}
