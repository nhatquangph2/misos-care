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

// Helper to hydrate intervention with library details
function hydrateIntervention(type: string, priority?: Intervention['priority'], subInterventions?: string[]): Intervention {
  const libEntry = INTERVENTION_LIBRARY[type as keyof typeof INTERVENTION_LIBRARY]

  return {
    type,
    priority,
    interventions: subInterventions,
    details: libEntry ? {
      name: libEntry.name,
      description: libEntry.description,
      steps: 'steps' in libEntry ? libEntry.steps : undefined,
      resources: 'resources' in libEntry ? libEntry.resources : undefined,
      examples: 'examples' in libEntry ? libEntry.examples : undefined,
      techniques: 'techniques' in libEntry ? libEntry.techniques : undefined,
      // @ts-ignore
      category: libEntry.category,

      // Evidence
      evidence_level: (libEntry as any).evidence_level,
      effect_size: (libEntry as any).effect_size,
      sources: (libEntry as any).sources,

      // Deep V3 Metadata
      sdt_targets: (libEntry as any).sdt_targets,
      perma_domain: (libEntry as any).perma_domain,
      zpd_complexity: (libEntry as any).zpd_complexity,
      act_quadrant: (libEntry as any).act_quadrant,
    } : undefined
  }
}


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
    evidence_level: 'A',
    sources: ['WHO Suicide Prevention Guidelines'],
    sdt_targets: ['competence'],
    perma_domain: ['M'],
    zpd_complexity: 1, // High support needed
  },
  crisis_support: {
    category: 'immediate' as const,
    name: 'Hỗ trợ khủng hoảng',
    when: ['CRISIS'],
    description: 'Can thiệp khủng hoảng ngay lập tức',
    evidence_level: 'A',
  },
  grounding: {
    category: 'immediate' as const,
    name: 'Kỹ thuật grounding',
    when: ['High_Anxiety', 'Panic'],
    description: '5-4-3-2-1: 5 thứ nhìn, 4 nghe, 3 cảm nhận, 2 ngửi, 1 nếm',
    evidence_level: 'B',
    effect_size: 0.5,
    sources: ['Systematic Review of Grounding Techniques (2018)'],
  },
  breathing_4_7_8: {
    category: 'immediate' as const,
    name: 'Thở 4-7-8',
    when: ['Anxiety', 'Panic'],
    description: 'Hít vào 4s, giữ 7s, thở ra 8s. Lặp lại 3-4 lần',
    evidence_level: 'B',
    effect_size: 0.6,
  },

  // SHORT-TERM (1-4 weeks)
  behavioral_activation: {
    category: 'short_term' as const,
    name: 'Kích hoạt hành vi',
    when: ['Depression', 'Low_Zest'],
    description: 'Lên lịch hoạt động thú vị bất kể động lực',
    steps: [
      'Liệt kê 10 hoạt động từng thích',
      'Chọn 3 hoạt động dễ nhất',
      'Lên lịch cụ thể (ngày, giờ)',
      'Làm bất kể cảm giác như thế nào',
    ],
    evidence_level: 'A',
    effect_size: 0.78,
    sources: ['doi:10.1016/j.cpr.2020.101889'],
    sdt_targets: ['competence', 'autonomy'],
    perma_domain: ['E', 'A'],
    zpd_complexity: 2,
    act_quadrant: 'upper_right', // Toward move
  },
  micro_habits: {
    category: 'short_term' as const,
    name: 'Thói quen nhỏ (Micro-habits)',
    when: ['Low_C', 'Low_SelfReg'],
    description: 'Xây dựng thói quen nhỏ (1-2 phút/ngày)',
    examples: ['Uống 1 cốc nước sau khi thức dậy', 'Viết 1 câu nhật ký trước khi ngủ'],
    evidence_level: 'C',
    sources: ['Fogg Behavior Model'],
  },
  sleep_hygiene: {
    category: 'short_term' as const,
    name: 'Vệ sinh giấc ngủ (Sleep Hygiene)',
    when: ['Low_Zest', 'Depression'],
    description: 'Cải thiện chất lượng giấc ngủ',
    steps: [
      'Ngủ và dậy cùng giờ mỗi ngày',
      'Tránh màn hình 1h trước khi ngủ',
      'Phòng tối, mát, yên tĩnh',
      'Nếu không ngủ được sau 20 phút, ra khỏi giường',
    ],
    evidence_level: 'A',
    effect_size: 0.45,
  },
  relaxation: {
    category: 'short_term' as const,
    name: 'Thư giãn cơ bắp tiến triển (PMR)',
    when: ['High_Stress', 'Healthy_Neurotic'],
    description: 'Thư giãn cơ bắp từng bước',
    evidence_level: 'A',
    effect_size: 0.55,
  },
  social_connection: {
    category: 'short_term' as const,
    name: 'Kết nối xã hội (Social Connection)',
    when: ['Low_E', 'Depression'],
    description: 'Kết nối xã hội nhẹ nhàng, không áp lực',
    steps: ['Nhắn tin 1 người/ngày', 'Coffee 1-1 với người an toàn', 'Join 1 group hoạt động nhẹ'],
    evidence_level: 'B',
  },
  boundary_setting: {
    category: 'short_term' as const,
    name: 'Thiết lập ranh giới (Boundary Setting)',
    when: ['INFJ', 'INFP', 'Burnout'],
    description: 'Đặt ranh giới rõ ràng',
    steps: ['Xác định năng lượng còn lại', 'Nói "không" 1 lần/ngày', 'Block thời gian riêng tư'],
    evidence_level: 'C',
  },
  problem_solving: {
    category: 'short_term' as const,
    name: 'Giải quyết vấn đề (Problem-Solving)',
    when: ['Acute_Stress'],
    description: 'Giải quyết vấn đề có cấu trúc',
    steps: ['Define vấn đề cụ thể', 'Brainstorm giải pháp (không filter)', 'Chọn 1 thử nghiệm'],
    evidence_level: 'B',
  },

  // LONG-TERM (1-3 months)
  hope_therapy: {
    category: 'long_term' as const,
    name: 'Liệu pháp Hy vọng (Hope Therapy)',
    when: ['Low_Hope', 'Depression'],
    description: 'Xây dựng lại hy vọng',
    techniques: ['Goal-setting', 'Pathways thinking', 'Best possible self'],
    evidence_level: 'B',
    effect_size: 0.48,
    sources: ['doi:10.1007/s10902-020-00267-3'],
    sdt_targets: ['competence'],
    perma_domain: ['P', 'A'],
    zpd_complexity: 2,
    act_quadrant: 'lower_right', // Identifying values/goals
  },
  mindfulness: {
    category: 'long_term' as const,
    name: 'Chánh niệm (Mindfulness)',
    when: ['High_N', 'Rumination'],
    description: 'Thiền chánh niệm',
    types: ['Body scan', 'Breath awareness', 'Loving-kindness'],
    evidence_level: 'A',
    effect_size: 0.63,
  },
  self_regulation_training: {
    category: 'long_term' as const,
    name: 'Rèn luyện Tự chủ (Self-Regulation)',
    when: ['Low_SelfReg', 'Low_C'],
    description: 'Tăng khả năng tự kiểm soát',
    evidence_level: 'B',
  },
  forgiveness_work: {
    category: 'long_term' as const,
    name: 'Thực hành Tha thứ (Forgiveness)',
    when: ['Low_Forgiveness', 'Hostility'],
    description: 'Thực hành tha thứ',
    evidence_level: 'B',
  },
  gratitude_practice: {
    category: 'long_term' as const,
    name: 'Thực hành Biết ơn (Gratitude)',
    when: ['Depression', 'Stress'],
    description: '3 điều biết ơn mỗi ngày',
    evidence_level: 'A',
    effect_size: 0.35,
  },
  somatic_therapy: {
    category: 'long_term' as const,
    name: 'Trị liệu Thân nghiệm (Somatic Therapy)',
    when: ['Repressive_Coping', 'Somatization'],
    description: 'Liệu pháp tập trung vào cơ thể',
    evidence_level: 'C',
  },
  acceptance_commitment: {
    category: 'long_term' as const,
    name: 'Liệu pháp Chấp nhận & Cam kết (ACT)',
    when: ['Rigid_Neurotic', 'Avoidance'],
    description: 'Chấp nhận và hành động theo giá trị',
    evidence_level: 'A',
    effect_size: 0.70,
  },
  zest_building: {
    category: 'long_term' as const,
    name: 'Xây dựng sự Hăng hái (Zest Building)',
    when: ['Low_Zest'],
    description: 'Xây dựng năng lượng sống',
    techniques: ['Physical activity', 'Novel experiences', 'Flow activities'],
    evidence_level: 'C',
    sdt_targets: ['autonomy'],
    perma_domain: ['E', 'P'],
    zpd_complexity: 2,
  },

  // ============================================
  // DEEP INTELLEGENCE (NEW V3)
  // ============================================

  values_clarification: {
    category: 'long_term' as const,
    name: 'Xác định Giá trị cốt lõi (Values)',
    when: ['Lost_Purpose', 'Mid_Life_Crisis'],
    description: 'Xác định điều gì thực sự quan trọng',
    steps: [
      'Tưởng tượng bữa tiệc sinh nhật 80 tuổi của bạn',
      'Mọi người sẽ nói gì về bạn?',
      'Viết xuống 3 giá trị quan trọng nhất từ đó (VD: Tự do, Yêu thương)',
      'Chọn 1 hành động nhỏ hôm nay để sống với giá trị đó',
    ],
    evidence_level: 'B',
    sdt_targets: ['autonomy'],
    perma_domain: ['M'],
    zpd_complexity: 3, // Requires abstract thinking
    act_quadrant: 'lower_right',
  },

  defusion_leaves_on_stream: {
    category: 'short_term' as const,
    name: 'Lá trên dòng suối (Defusion)',
    when: ['Rumination', 'Overthinking'],
    description: 'Tách rời khỏi suy nghĩ tiêu cực',
    steps: [
      'Nhắm mắt lại và tưởng tượng một dòng suối',
      'Mỗi khi có suy nghĩ, đặt nó lên một chiếc lá',
      'Để chiếc lá trôi đi nhẹ nhàng, đừng cố níu giữ',
      'Nếu bị cuốn theo suy nghĩ, nhẹ nhàng quay lại bờ suối',
    ],
    evidence_level: 'A',
    sdt_targets: ['autonomy'], // Freeing self from thought control
    perma_domain: ['P'],
    zpd_complexity: 2,
    act_quadrant: 'upper_left', // Handling internal barriers
  },

  best_possible_self: {
    category: 'long_term' as const,
    name: 'Phiên bản tốt nhất (Best Possible Self)',
    when: ['Low_Optimism', 'Depression'],
    description: 'Viết về tương lai lý tưởng để tăng lạc quan',
    steps: [
      'Dành 15 phút viết về cuộc sống của bạn trong 5 năm tới',
      'Hãy tưởng tượng mọi thứ diễn ra tốt đẹp nhất có thể',
      'Mô tả chi tiết cảm xúc và hoàn cảnh',
      'Viết mỗi ngày trong 1 tuần',
    ],
    evidence_level: 'A',
    effect_size: 0.6,
    sdt_targets: ['competence', 'autonomy'],
    perma_domain: ['P', 'M', 'A'],
    zpd_complexity: 2,
  },

  autonomy_mapping: {
    category: 'short_term' as const,
    name: 'Bản đồ Tự chủ (Autonomy Mapping)',
    when: ['Burnout', 'Feeling_Trapped'],
    description: 'Lấy lại quyền kiểm soát cuộc sống',
    steps: [
      'Vẽ vòng tròn: "Những gì tôi kiểm soát được" và "Không kiểm soát được"',
      'Liệt kê các áp lực hiện tại vào 2 vùng này',
      'Chọn 1 việc trong vùng kiểm soát để thay đổi ngay',
      'Chấp nhận buông bỏ 1 việc ngoài vùng kiểm soát',
    ],
    evidence_level: 'C',
    sdt_targets: ['autonomy'],
    perma_domain: ['A'],
    zpd_complexity: 2,
    act_quadrant: 'upper_right',
  },
}

// ============================================
// INTERVENTION ALLOCATION
// ============================================

/**
 * Allocate interventions based on profile, discrepancies, and VIA
 * Phase 2: Enhanced with optional smart scoring
 */
export function allocateInterventions(
  profile: Big5ProfileData,
  discrepancies: Discrepancy[],
  viaAnalysis: VIAAnalysis | null,
  mbti?: string,
  scoringContext?: {
    big5_percentiles?: { N: number; E: number; O: number; A: number; C: number }
    dass_raw?: { D: number; A: number; S: number }
    mechanisms?: {
      active: Array<{ id: string; pathway: string; strength: number; predictedDASS: any }>
      compensations: Array<{ id: string; mechanism: string; strength: string; percentile: number }>
    }
    // Scientific Context
    scientific_analysis?: {
      zpd: { capacity: number; level: 1 | 2 | 3 }
      sdt: { autonomy: number; competence: number; relatedness: number }
    }
  }
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
  // SMART SCORING PATH (Phase 2)
  // ==========================================
  if (scoringContext?.big5_percentiles && scoringContext?.dass_raw && scoringContext?.mechanisms) {
    // Use scoring system
    try {
      const { scoreAllInterventions } = require('./intervention-scoring')

      const context = {
        big5: scoringContext.big5_percentiles,
        via_percentiles: (viaAnalysis?.signature_strengths || []).reduce((acc: Record<string, number>, s: any) => {
          acc[s.strength] = s.percentile
          return acc
        }, {}),
        mbti: mbti || '',
        dass_raw: scoringContext.dass_raw,
        mechanisms: scoringContext.mechanisms,
        via_signature_strengths: viaAnalysis?.signature_strengths || [],
      }

      const scoredInterventions = scoreAllInterventions(context)

      // Take top 3 from each category
      const immediate = scoredInterventions.filter((s: any) => s.intervention.category === 'immediate').slice(0, 2)
      const shortTerm = scoredInterventions.filter((s: any) => s.intervention.category === 'short_term').slice(0, 3)
      const longTerm = scoredInterventions.filter((s: any) => s.intervention.category === 'long_term').slice(0, 3)

      // Convert to plan format with full intervention metadata
      plan.immediate = immediate.map((s: any) => ({
        type: s.intervention.type,
        priority: s.rank === 1 ? 'HIGH' as const : 'MEDIUM' as const,
        // Full intervention object for UI display
        intervention: {
          type: s.intervention.type,
          name: s.intervention.name,
          description: s.intervention.description,
          evidence_level: s.intervention.evidence_level,
          energy_required: s.intervention.energy_required,
          time_commitment: s.intervention.time_commitment,
          steps: s.intervention.steps,
        },
        score: s.score,
        reasoning: s.reasoning,
        rank: s.rank,
      }))

      plan.short_term = shortTerm.map((s: any) => ({
        type: s.intervention.type,
        intervention: {
          type: s.intervention.type,
          name: s.intervention.name,
          description: s.intervention.description,
          evidence_level: s.intervention.evidence_level,
          energy_required: s.intervention.energy_required,
          time_commitment: s.intervention.time_commitment,
          steps: s.intervention.steps,
        },
        score: s.score,
        reasoning: s.reasoning,
        rank: s.rank,
      }))

      plan.long_term = longTerm.map((s: any) => ({
        type: s.intervention.type,
        intervention: {
          type: s.intervention.type,
          name: s.intervention.name,
          description: s.intervention.description,
          evidence_level: s.intervention.evidence_level,
          energy_required: s.intervention.energy_required,
          time_commitment: s.intervention.time_commitment,
          steps: s.intervention.steps,
        },
        score: s.score,
        reasoning: s.reasoning,
        rank: s.rank,
      }))

      // Set communication style based on MBTI
      if (mbti) {
        const mbtiProfile = getMBTIRiskProfile(mbti)
        plan.communication_style = mbtiProfile.communication_style
        plan.framing = mbti[3]?.toUpperCase() === 'J' ? 'plan_oriented' : 'exploration_oriented'
      }

      return plan
      return plan
    } catch (error) {
      console.warn('Scoring system failed, falling back to rule-based:', error)
      // Fall through to rule-based logic
    }
  } else if (scoringContext?.scientific_analysis) {
    // === DEEP INTELLIGENCE SCORING (V3) ===
    // If we have scientific analysis but not full mechanism data (e.g. partial data)
    // Or we want to enhance the rule-based selection.

    // For now, let's filter the rule-based output at the end or apply sorting.
    // But since we are modifying the MAIN engine, we should probably implement sorting AFTER rule-based.
  }

  // ==========================================
  // RULE-BASED PATH (Fallback / Existing Logic)
  // ==========================================

  // PRIORITY 1: SAFETY & CRISIS
  if (profile.flags?.includes('SUICIDE_RISK_SCREEN')) {
    plan.immediate.push(hydrateIntervention('safety_screening', 'CRITICAL'))
  }

  if (profile.flags?.includes('PRIORITY_CASE')) {
    plan.immediate.push(hydrateIntervention('crisis_support', 'CRITICAL'))
  }

  // PRIORITY 2: DISCREPANCY-BASED
  for (const disc of discrepancies) {
    if (disc.id === 'D1') {
      // Acute stress
      plan.short_term.push(hydrateIntervention('problem_solving'))
      plan.avoid.push('personality_restructuring')
    } else if (disc.id === 'D2') {
      // Repressive coping
      plan.long_term.push(hydrateIntervention('somatic_therapy'))
      plan.avoid.push('traditional_CBT')
    } else if (disc.id === 'D4a') {
      // Hostile
      plan.long_term.push(hydrateIntervention('forgiveness_work'))
    } else if (disc.id === 'D5') {
      // Hope-Depression Paradox
      plan.immediate.push(hydrateIntervention('safety_screening', 'HIGH'))
    }
  }

  // PRIORITY 3: PROFILE-BASED
  switch (profile.id) {
    case 'B1': // Healthy Neurotic
      plan.short_term.push(hydrateIntervention('relaxation'))
      plan.avoid.push('more_discipline', 'more_structure')
      break

    case 'B2': // Vulnerable
    case 'B4': // Misery Triad
      plan.short_term.push(
        hydrateIntervention('behavioral_activation'),
        hydrateIntervention('micro_habits')
      )
      if (profile.id === 'B4') {
        plan.immediate.push(hydrateIntervention('crisis_support', 'HIGH'))
      }
      break

    case 'B3': // Introverted Neurotic
      plan.short_term.push(
        hydrateIntervention('social_connection'),
        hydrateIntervention('zest_building')
      )
      plan.long_term.push(hydrateIntervention('hope_therapy'))
      break

    case 'B6': // Agitated Neurotic
      plan.immediate.push(hydrateIntervention('grounding'))
      plan.long_term.push(hydrateIntervention('mindfulness'))
      break

    case 'B7': // Rigid Neurotic
      plan.long_term.push(hydrateIntervention('acceptance_commitment'))
      plan.avoid.push('traditional_CBT', 'insight_therapy')
      break

    case 'B8': // Sensitive Neurotic
      plan.long_term.push(hydrateIntervention('mindfulness'))
      break
  }

  // PRIORITY 4: VIA-BASED
  if (viaAnalysis) {
    for (const build of viaAnalysis.build_strengths) {
      const strengthName = build.strength.toLowerCase().replace(/-/g, '_')
      const libKey = `build_${strengthName}` as keyof typeof INTERVENTION_LIBRARY

      if (INTERVENTION_LIBRARY[libKey]) {
        plan.long_term.push(hydrateIntervention(libKey, undefined, build.interventions))
      } else {
        plan.long_term.push({
          type: `build_${strengthName}`,
          interventions: build.interventions,
        })
      }
    }

    if (viaAnalysis.priority_intervention) {
      const existing = plan.long_term.find((i) => i.type === viaAnalysis.priority_intervention)
      if (!existing) {
        plan.long_term.unshift(hydrateIntervention(viaAnalysis.priority_intervention, 'HIGH'))
      }
    }
  }

  // PRIORITY 5: MBTI ADJUSTMENTS
  if (mbti) {
    const mbtiProfile = getMBTIRiskProfile(mbti)
    plan.communication_style = mbtiProfile.communication_style

    // Add MBTI-specific interventions
    if (['INFJ', 'INFP'].includes(mbti.toUpperCase())) {
      plan.short_term.push(hydrateIntervention('boundary_setting'))
    }

    // Framing based on J/P
    if (mbti.length === 4) {
      plan.framing = mbti[3].toUpperCase() === 'J' ? 'plan_oriented' : 'exploration_oriented'
    }
  }

  // PRIORITY 6: SCIENTIFIC RESCORING (ZPD & SDT)
  // Sort and filter the selected interventions based on scientific fit
  if (scoringContext?.scientific_analysis) {
    const { getSDTBoost, getZPDPenalty } = require('./scientific-scoring')
    const { zpd, sdt } = scoringContext.scientific_analysis

    // Helper to score an intervention
    const scoreInt = (int: Intervention) => {
      let score = 50 // Base
      score += getSDTBoost(int, sdt)
      score += getZPDPenalty(int, zpd.level)
      if (int.priority === 'CRITICAL') score += 100
      if (int.priority === 'HIGH') score += 50
      return score
    }

    // Sort lists
    plan.immediate.sort((a, b) => scoreInt(b) - scoreInt(a))
    plan.short_term.sort((a, b) => scoreInt(b) - scoreInt(a))
    plan.long_term.sort((a, b) => scoreInt(b) - scoreInt(a))

    // Filter out items with very low ZPD fit (score < 0 due to penalty)
    // ONLY if we have enough items
    if (plan.long_term.length > 5) {
      plan.long_term = plan.long_term.filter(i => scoreInt(i) > 20)
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
  logic_focused: ['Đưa ra lý do logic', 'Dữ liệu và bằng chứng', 'Phân tích rõ ràng'],
  strategy_focused: ['Nói về hiệu quả', 'Kế hoạch dài hạn', 'Tư duy hệ thống'],
  duty_focused: ['Nhấn mạnh trách nhiệm', 'Chăm sóc người khác', 'Làm đúng việc'],
  experience_focused: ['Trải nghiệm thực tế', 'Cảm giác cụ thể', 'Hành động ngay'],
  possibility_focused: ['Nhiều khả năng', 'Tương lai sáng tạo', 'Linh hoạt'],
  people_focused: ['Tác động lên con người', 'Sự hài hòa', 'Cùng nhau'],
  practical_focused: ['Tính thực tế', 'Cách làm cụ thể', 'Hiệu quả ngay'],
  procedure_focused: ['Quy trình rõ ràng', 'Bước tiếp theo', 'Tuân thủ'],
  debate_focused: ['Thách thức', 'Tranh luận', 'Nhiều góc độ'],
  action_focused: ['Hành động nhanh', 'Kết quả ngay', 'Năng động'],
  harmony_focused: ['Hài hòa', 'Đồng thuận', 'Tránh xung đột'],
  efficiency_focused: ['Nhanh chóng', 'Hiệu quả tối ưu', 'Kết quả đo lường được'],
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
