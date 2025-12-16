/**
 * Unified Profile Integration System
 *
 * Integrates 4 assessments into coherent psychological profile:
 * - MBTI: Personality Framework (Khung xe)
 * - Big Five (BFI-2): Current State Dashboard (Bảng điều khiển)
 * - VIA Character Strengths: Toolkit (Bộ công cụ)
 * - Multiple Intelligences: Engine Types (Loại động cơ)
 *
 * Analogy: The Car Model
 * ┌─────────────────────────────────────┐
 * │  MBTI (Framework)                   │  ← Khung xe: Cấu trúc cơ bản
 * │  • Processing style (Ti/Te, Fi/Fe)  │
 * │  • Information gathering (Si/Se, Ni/Ne) │
 * └─────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────┐
 * │  Big-5 (Dashboard)                  │  ← Bảng điều khiển: Trạng thái hiện tại
 * │  • N: Fuel gauge (Mức độ stress)    │
 * │  • E: Speedometer (Năng lượng xã hội) │
 * │  • C: Maintenance light (Kỷ luật)   │
 * │  • A: Steering (Quan hệ)            │
 * │  • O: GPS (Tò mò, học hỏi)          │
 * └─────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────┐
 * │  VIA (Toolkit)                      │  ← Bộ công cụ: Điểm mạnh sẵn có
 * │  • Top 5 strengths = Primary tools  │
 * │  • Middle strengths = Backup tools  │
 * │  • Lower strengths = Need development │
 * └─────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────┐
 * │  Multiple Intelligences (Engine)    │  ← Động cơ: Cách xử lý thông tin
 * │  • Dominant intelligences = Primary cylinders │
 * │  • Secondary = Support cylinders    │
 * │  • Can develop weaker cylinders     │
 * └─────────────────────────────────────┘
 */

import { BFI2Score } from '@/constants/tests/bfi2-questions'

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface MBTIResult {
  type: string // e.g., "INTJ"
  dimensions: {
    EI: 'E' | 'I'
    SN: 'S' | 'N'
    TF: 'T' | 'F'
    JP: 'J' | 'P'
  }
  functions: {
    dominant: string // e.g., "Ni" (Introverted Intuition)
    auxiliary: string // e.g., "Te" (Extraverted Thinking)
    tertiary: string
    inferior: string
  }
  completedAt: number
}

export interface VIAResult {
  strengths: {
    rank: number
    name: string
    score: number
    category: 'signature' | 'middle' | 'lower' // Top 5 / Middle 14 / Bottom 5
  }[]
  topFive: string[] // Signature strengths
  completedAt: number
}

export interface MultipleIntelligencesResult {
  scores: {
    linguistic: number // Ngôn ngữ
    logicalMathematical: number // Logic-Toán học
    spatial: number // Không gian
    musicalRhythmic: number // Âm nhạc
    bodilyKinesthetic: number // Vận động
    interpersonal: number // Giao tiếp
    intrapersonal: number // Nội tâm
    naturalistic: number // Tự nhiên
  }
  dominant: string[] // Top 2-3 intelligences
  completedAt: number
}

export interface UnifiedProfile {
  mbti?: MBTIResult
  big5?: BFI2Score
  via?: VIAResult
  multipleIntelligences?: MultipleIntelligencesResult
  completionStatus: {
    mbti: boolean
    big5: boolean
    via: boolean
    mi: boolean
    completionPercentage: number
  }
  generatedAt: number
}

// ============================================
// INTEGRATION LOGIC
// ============================================

/**
 * Calculate profile completion status
 */
export function getCompletionStatus(profile: UnifiedProfile): UnifiedProfile['completionStatus'] {
  const completed = [
    profile.mbti !== undefined,
    profile.big5 !== undefined,
    profile.via !== undefined,
    profile.multipleIntelligences !== undefined,
  ]

  const completionPercentage = (completed.filter(Boolean).length / 4) * 100

  return {
    mbti: completed[0],
    big5: completed[1],
    via: completed[2],
    mi: completed[3],
    completionPercentage,
  }
}

/**
 * Get missing assessments
 */
export function getMissingAssessments(profile: UnifiedProfile): string[] {
  const missing: string[] = []
  if (!profile.mbti) missing.push('MBTI')
  if (!profile.big5) missing.push('Big Five (BFI-2)')
  if (!profile.via) missing.push('VIA Character Strengths')
  if (!profile.multipleIntelligences) missing.push('Multiple Intelligences')
  return missing
}

// ============================================
// CROSS-TEST INSIGHTS
// ============================================

export interface CrossTestInsight {
  title: string
  description: string
  evidenceFrom: string[] // Which tests support this insight
  actionableAdvice: string[]
  category: 'strength' | 'risk' | 'opportunity' | 'contradiction'
}

/**
 * Generate insights by cross-referencing multiple tests
 */
export function generateCrossTestInsights(profile: UnifiedProfile): CrossTestInsight[] {
  const insights: CrossTestInsight[] = []

  // Ensure we have at least 2 tests completed
  const completionStatus = getCompletionStatus(profile)
  if (completionStatus.completionPercentage < 50) {
    return []
  }

  // INSIGHT 1: MBTI + Big5 Alignment Check
  if (profile.mbti && profile.big5) {
    const { type } = profile.mbti
    const { tScores } = profile.big5

    // Example: INTJ should have low E, high O, high C
    if (type === 'INTJ') {
      if (tScores.domains.E > 55) {
        insights.push({
          title: '⚠️ Mâu thuẫn: INTJ nhưng Extraversion cao',
          description:
            'MBTI cho thấy bạn là INTJ (Hướng nội), nhưng Big-5 cho thấy Extraversion cao. Điều này có thể do: (1) Bạn đang trong giai đoạn thay đổi, (2) Bạn thích hợp xã hội nhưng cần thời gian một mình để nạp năng lượng, hoặc (3) Một trong hai test không phản ánh chính xác.',
          evidenceFrom: ['MBTI: INTJ (Introvert)', 'Big-5: Extraversion T-score > 55'],
          actionableAdvice: [
            '🔍 Quan sát bản thân: Sau khi giao tiếp xã hội, bạn cảm thấy nạp năng lượng hay kiệt sức?',
            '📊 Làm lại MBTI sau 6 tháng để xem có thay đổi không',
            '🎯 Nếu đúng là Extravert: Tận dụng năng lượng xã hội để networking, teamwork',
            '🎯 Nếu đúng là Introvert: Đặt ranh giới rõ ràng cho thời gian riêng tư',
          ],
          category: 'contradiction',
        })
      }
    }

    // ENFP/ENTP + High O = Strong creativity potential
    if ((type === 'ENFP' || type === 'ENTP') && tScores.domains.O > 60) {
      insights.push({
        title: '✅ Tiềm năng sáng tạo cao',
        description:
          `MBTI ${type} (Ne dominant - khám phá nhiều khả năng) kết hợp với Big-5 Openness cao tạo ra tiềm năng sáng tạo và đổi mới đặc biệt mạnh.`,
        evidenceFrom: [`MBTI: ${type} (Ne dominant)`, 'Big-5: Openness T-score > 60'],
        actionableAdvice: [
          '🎨 Careers: Innovation roles, R&D, Creative fields, Entrepreneurship',
          '💡 Leverage: Brainstorming, idea generation, connecting disparate concepts',
          '⚠️ Watch out: May start many projects without finishing (low C risk)',
          '🛠️ Develop: Project management skills to channel creativity into results',
        ],
        category: 'strength',
      })
    }

    // ISTJ/ISFJ + High C + Low N = Reliability powerhouse
    if ((type === 'ISTJ' || type === 'ISFJ') && tScores.domains.C > 60 && tScores.domains.N < 45) {
      insights.push({
        title: '✅ "The Reliable Rock" - Đáng tin cậy tuyệt đối',
        description:
          `MBTI ${type} (Si dominant - chi tiết, trách nhiệm) + Conscientiousness cao + Neuroticism thấp = Người có thể dựa vào trong mọi tình huống.`,
        evidenceFrom: [`MBTI: ${type} (Si dominant)`, 'Big-5: C > 60, N < 45'],
        actionableAdvice: [
          '💼 Careers: Operations, Finance, Healthcare, Project Management, Quality Assurance',
          '💪 Strength: Consistency, follow-through, thriving under pressure',
          '⚠️ Risk: May be taken for granted, may take on too much responsibility',
          '🗣️ Develop: Assertiveness to say no, delegation skills',
        ],
        category: 'strength',
      })
    }
  }

  // INSIGHT 2: Big5 + VIA Strengths Alignment
  if (profile.big5 && profile.via) {
    const { tScores } = profile.big5
    const { topFive } = profile.via

    // High A + Compassion/Kindness in VIA = Caregiving excellence
    if (tScores.domains.A > 60 && (topFive.includes('Kindness') || topFive.includes('Love'))) {
      insights.push({
        title: '✅ Caregiving Excellence - Chăm sóc người khác xuất sắc',
        description:
          'Big-5 Agreeableness cao kết hợp với VIA Kindness/Love trong top 5 cho thấy bạn có năng khiếu tự nhiên trong việc chăm sóc và hỗ trợ người khác.',
        evidenceFrom: ['Big-5: Agreeableness > 60', 'VIA: Kindness/Love in top 5'],
        actionableAdvice: [
          '💼 Careers: Counseling, Healthcare, Social Work, Teaching, HR',
          '⚠️ Burnout Risk: Dễ kiệt sức vì quá quan tâm người khác, bỏ quên bản thân',
          '🛡️ Protection: Đặt ranh giới rõ ràng, học cách nói "không" khi cần',
          '💪 Self-care: Dành 30min/ngày cho bản thân (non-negotiable)',
        ],
        category: 'strength',
      })
    }

    // High O + Curiosity/Creativity in VIA = Innovation powerhouse
    if (tScores.domains.O > 60 && (topFive.includes('Curiosity') || topFive.includes('Creativity'))) {
      insights.push({
        title: '✅ Innovation Powerhouse - Sáng tạo và đổi mới',
        description:
          'Big-5 Openness cao + VIA Curiosity/Creativity = Khả năng sáng tạo và học hỏi vượt trội.',
        evidenceFrom: ['Big-5: Openness > 60', 'VIA: Curiosity/Creativity in top 5'],
        actionableAdvice: [
          '💼 Careers: Research, Design, Innovation, Education, Arts',
          '📚 Learning: Thrive in exploratory learning, struggle with rote memorization',
          '🎯 Optimize: Seek roles with autonomy and intellectual challenge',
          '⚠️ Risk: May get bored easily, need variety and novelty',
        ],
        category: 'strength',
      })
    }

    // High C + Self-Regulation/Perseverance in VIA = Achievement machine
    if (tScores.domains.C > 60 && (topFive.includes('Perseverance') || topFive.includes('Self-Regulation'))) {
      insights.push({
        title: '✅ Achievement Machine - Máy đạt mục tiêu',
        description:
          'Big-5 Conscientiousness cao + VIA Perseverance/Self-Regulation = Khả năng đạt mục tiêu dài hạn vượt trội.',
        evidenceFrom: ['Big-5: Conscientiousness > 60', 'VIA: Perseverance/Self-Regulation in top 5'],
        actionableAdvice: [
          '🎯 Leverage: Set ambitious long-term goals, excel at delayed gratification',
          '💼 Careers: Roles requiring sustained effort (Entrepreneurship, Research, Medicine)',
          '⚠️ Risk: Perfectionism, burnout from overwork',
          '⚖️ Balance: Schedule rest as rigorously as you schedule work',
        ],
        category: 'strength',
      })
    }

    // High N + Low Hope/Zest in VIA = Depression risk
    if (tScores.domains.N > 60 && !topFive.includes('Hope') && !topFive.includes('Zest')) {
      insights.push({
        title: '⚠️ Nguy cơ trầm cảm - Cần chú ý',
        description:
          'Big-5 Neuroticism cao (dễ lo âu) kết hợp với thiếu Hope & Zest trong top strengths cho thấy nguy cơ trầm cảm.',
        evidenceFrom: ['Big-5: Neuroticism > 60', 'VIA: Hope & Zest NOT in top 5'],
        actionableAdvice: [
          '🩺 Nên gặp chuyên gia sức khỏe tâm thần để đánh giá (CBT/medication evaluation)',
          '🏃 Exercise 30min x3/tuần: Hiệu quả ngang antidepressant cho trầm cảm nhẹ',
          '☀️ Morning sunlight 30min: Điều hòa circadian rhythm, tăng serotonin',
          '📊 Behavioral Activation: Lên lịch hoạt động thú vị REGARDLESS of motivation',
          '🎯 Develop Hope: Set small achievable goals → build momentum',
        ],
        category: 'risk',
      })
    }
  }

  // INSIGHT 3: MBTI + Multiple Intelligences = Career fit
  if (profile.mbti && profile.multipleIntelligences) {
    const { type } = profile.mbti
    const { dominant } = profile.multipleIntelligences

    // INTP/INTJ + Logical-Mathematical dominant = Theoretical genius
    if ((type === 'INTP' || type === 'INTJ') && dominant.includes('logicalMathematical')) {
      insights.push({
        title: '✅ Theoretical Genius - Thiên tài lý thuyết',
        description:
          `MBTI ${type} (Ti/Te + Ni - tư duy logic hệ thống) + Logical-Mathematical intelligence dominant = Xuất sắc trong lý thuyết, toán học, khoa học.`,
        evidenceFrom: [`MBTI: ${type}`, 'MI: Logical-Mathematical dominant'],
        actionableAdvice: [
          '💼 Ideal Careers: Theoretical Physics, Mathematics, Computer Science, Economics, Philosophy',
          '🎯 Leverage: Complex problem-solving, building theoretical frameworks',
          '⚠️ Communication gap: May struggle explaining to non-technical audience',
          '🗣️ Develop: Teaching skills, ability to simplify complex ideas',
        ],
        category: 'strength',
      })
    }

    // ESFP/ESTP + Bodily-Kinesthetic + Interpersonal = Performance excellence
    if ((type === 'ESFP' || type === 'ESTP') &&
        (dominant.includes('bodilyKinesthetic') || dominant.includes('interpersonal'))) {
      insights.push({
        title: '✅ Performance Excellence - Xuất sắc trong biểu diễn',
        description:
          `MBTI ${type} (Se dominant - sống trong hiện tại, hành động) + Bodily-Kinesthetic/Interpersonal intelligence = Xuất sắc trong performance, sports, entertainment.`,
        evidenceFrom: [`MBTI: ${type}`, 'MI: Bodily-Kinesthetic/Interpersonal dominant'],
        actionableAdvice: [
          '💼 Ideal Careers: Sports, Dance, Theater, Sales, Event Management, Emergency Services',
          '🎯 Leverage: Quick reactions, reading rooms, physical coordination',
          '⚠️ Academic struggle: May find traditional classroom boring',
          '📚 Learning adaptation: Learn by doing, hands-on practice, movement',
        ],
        category: 'strength',
      })
    }

    // INFJ/INFP + Intrapersonal + Linguistic = Writing/Counseling gift
    if ((type === 'INFJ' || type === 'INFP') &&
        dominant.includes('intrapersonal') && dominant.includes('linguistic')) {
      insights.push({
        title: '✅ Deep Understanding Gift - Tài năng hiểu sâu con người',
        description:
          `MBTI ${type} (Ni/Fi - hiểu sâu cảm xúc) + Intrapersonal + Linguistic intelligence = Xuất sắc trong viết lách, tư vấn, nghệ thuật sâu sắc.`,
        evidenceFrom: [`MBTI: ${type}`, 'MI: Intrapersonal + Linguistic'],
        actionableAdvice: [
          '💼 Ideal Careers: Writing (fiction/poetry), Psychology, Counseling, Philosophy, Ministry',
          '🎯 Leverage: Deep self-awareness, articulating complex emotions, empathy',
          '⚠️ Isolation risk: May spend too much time in own head',
          '👥 Balance: Schedule regular social connection to stay grounded',
        ],
        category: 'strength',
      })
    }
  }

  // INSIGHT 4: All 4 tests together - Holistic recommendations
  if (profile.mbti && profile.big5 && profile.via && profile.multipleIntelligences) {
    insights.push({
      title: '🎉 Complete Profile - Phân tích toàn diện',
      description:
        'Bạn đã hoàn thành cả 4 bài test! Giờ bạn có bức tranh toàn diện về tính cách (MBTI), trạng thái hiện tại (Big-5), điểm mạnh (VIA), và cách xử lý thông tin (MI).',
      evidenceFrom: ['MBTI', 'Big-5', 'VIA', 'Multiple Intelligences'],
      actionableAdvice: [
        '📊 Review tất cả insights để tìm patterns xuyên suốt các tests',
        '🎯 Xác định top 3 strengths từ profile tổng hợp',
        '⚠️ Xác định top 2 risk factors cần chú ý',
        '💼 Career matching: Tìm nghề phù hợp với cả 4 chiều',
        '📚 Learning optimization: Thiết kế phong cách học tối ưu',
        '🧠 Personal development plan: Lập kế hoạch phát triển dựa trên complete profile',
      ],
      category: 'opportunity',
    })
  }

  return insights
}

// ============================================
// CAREER MATCHING (Integration of all 4 tests)
// ============================================

export interface IntegratedCareerMatch {
  career: string
  fitScore: number // 0-100
  reasoning: {
    mbtiMatch: string
    big5Match: string
    viaMatch: string
    miMatch: string
  }
  strengths: string[]
  challenges: string[]
  developmentAreas: string[]
}

/**
 * Generate career recommendations based on complete profile
 */
export function getIntegratedCareerMatches(profile: UnifiedProfile): IntegratedCareerMatch[] {
  const matches: IntegratedCareerMatch[] = []

  // Need at least MBTI + Big5 for basic career matching
  if (!profile.mbti || !profile.big5) {
    return []
  }

  // Example: Research Scientist
  if (
    ['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(profile.mbti.type) &&
    profile.big5.tScores.domains.O > 55 &&
    profile.big5.tScores.domains.C > 50
  ) {
    const viaMatch = profile.via?.topFive.includes('Curiosity') || profile.via?.topFive.includes('Love of Learning')
    const miMatch = profile.multipleIntelligences?.dominant.includes('logicalMathematical')

    matches.push({
      career: 'Research Scientist / Nhà Nghiên Cứu',
      fitScore: 75 + (viaMatch ? 10 : 0) + (miMatch ? 15 : 0),
      reasoning: {
        mbtiMatch: `${profile.mbti.type}: Analytical thinking, theoretical frameworks`,
        big5Match: `Openness ${profile.big5.tScores.domains.O > 60 ? 'High' : 'Moderate'} (curiosity), Conscientiousness ${profile.big5.tScores.domains.C > 60 ? 'High' : 'Moderate'} (persistence)`,
        viaMatch: viaMatch ? 'Curiosity/Love of Learning in top strengths' : 'Not particularly strength-aligned',
        miMatch: miMatch ? 'Logical-Mathematical intelligence dominant' : 'Other intelligences dominant',
      },
      strengths: [
        'Deep analytical thinking',
        'Persistence through complex problems',
        'Innovative hypothesis generation',
      ],
      challenges: [
        'May struggle with grant writing / communication',
        'Politics in academia',
        'Balancing depth vs breadth',
      ],
      developmentAreas: [
        'Scientific writing and communication',
        'Collaboration and networking',
        'Project management',
      ],
    })
  }

  // Add more career matches based on different profile combinations...
  // (This would be expanded with comprehensive career database)

  return matches.sort((a, b) => b.fitScore - a.fitScore)
}

// ============================================
// PERSONALIZED RECOMMENDATION ENGINE
// ============================================

export interface PersonalizedRecommendation {
  area: 'career' | 'learning' | 'relationships' | 'mental-health' | 'personal-growth'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  basedOn: string[] // Which test results support this
  actionSteps: string[]
}

/**
 * Generate personalized recommendations based on complete profile
 */
export function getPersonalizedRecommendations(profile: UnifiedProfile): PersonalizedRecommendation[] {
  const recommendations: PersonalizedRecommendation[] = []

  const completionStatus = getCompletionStatus(profile)

  // If profile incomplete, recommend completing tests first
  if (completionStatus.completionPercentage < 100) {
    const missing = getMissingAssessments(profile)
    recommendations.push({
      area: 'personal-growth',
      title: 'Hoàn thiện Profile',
      description: `Bạn đang thiếu ${missing.join(', ')}. Hoàn thành để nhận phân tích toàn diện hơn.`,
      priority: 'high',
      basedOn: ['Completion Status'],
      actionSteps: missing.map(test => `Complete ${test} assessment`),
    })
  }

  // Mental health priority check
  if (profile.big5 && profile.big5.tScores.domains.N > 65) {
    recommendations.push({
      area: 'mental-health',
      title: 'Ưu tiên sức khỏe tinh thần',
      description: 'Điểm Neuroticism rất cao cho thấy cần chú ý sức khỏe cảm xúc.',
      priority: 'high',
      basedOn: ['Big-5: Neuroticism > 65'],
      actionSteps: [
        'Gặp chuyên gia tâm lý để đánh giá (CBT/ACT)',
        'Exercise 30min x3/tuần',
        'Sleep 7-9h mỗi đêm',
        'Xác định và giải quyết nguồn gốc stress cụ thể',
      ],
    })
  }

  // Career optimization
  if (completionStatus.completionPercentage >= 50) {
    recommendations.push({
      area: 'career',
      title: 'Career Optimization',
      description: 'Dựa trên profile, bạn phù hợp với các ngành nghề sau...',
      priority: 'medium',
      basedOn: ['MBTI', 'Big-5', 'VIA', 'MI'].filter(test =>
        (test === 'MBTI' && profile.mbti) ||
        (test === 'Big-5' && profile.big5) ||
        (test === 'VIA' && profile.via) ||
        (test === 'MI' && profile.multipleIntelligences)
      ),
      actionSteps: [
        'Review integrated career matches',
        'Informational interviews with professionals in top 3 careers',
        'Skill gap analysis for target career',
        'Create 6-month career transition plan if needed',
      ],
    })
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}
