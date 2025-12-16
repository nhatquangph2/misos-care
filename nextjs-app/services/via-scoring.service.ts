/**
 * VIA Character Strengths Scoring Service
 * Algorithms for calculating VIA test results
 * Based on VIA Institute on Character methodology
 */

import { VIA_QUESTIONS, VIA_STRENGTH_DETAILS, type VIAVirtue } from '@/constants/tests/via-questions'

export interface VIAAnswer {
  questionId: number
  value: number // 1-5 Likert scale
}

export interface VIAStrengthScore {
  strength: string
  strengthName: string
  virtue: string
  virtueName: string
  rawScore: number // Sum of 2 questions (2-10)
  percentageScore: number // 0-100
  rank: number // 1-24 (1 is strongest)
  isSignature: boolean // Top 5 strengths
  icon: string
  color: string
  advice: string
}

export interface VIAVirtueScore {
  virtue: VIAVirtue
  virtueName: string
  averageScore: number // Average of all strengths in this virtue
  percentageScore: number // 0-100
  strengths: string[] // List of strength keys in this virtue
}

export interface VIAResult {
  strengthScores: VIAStrengthScore[]
  virtueScores: VIAVirtueScore[]
  signatureStrengths: VIAStrengthScore[] // Top 5
  overallProfile: string
  topVirtue: VIAVirtue
}

/**
 * Calculate VIA Character Strengths scores
 */
export function calculateVIA(answers: VIAAnswer[]): VIAResult {
  // Step 1: Calculate raw scores for each strength (24 strengths, 2 questions each)
  const strengthRawScores: Record<string, number> = {}
  const strengthQuestionCounts: Record<string, number> = {}

  answers.forEach((answer) => {
    const question = VIA_QUESTIONS.find((q) => q.id === answer.questionId)
    if (!question) return

    if (!strengthRawScores[question.strength]) {
      strengthRawScores[question.strength] = 0
      strengthQuestionCounts[question.strength] = 0
    }

    strengthRawScores[question.strength] += answer.value
    strengthQuestionCounts[question.strength]++
  })

  // Step 2: Convert to strength scores with metadata
  const strengthScores: VIAStrengthScore[] = Object.entries(strengthRawScores).map(
    ([strengthKey, rawScore]) => {
      const questionCount = strengthQuestionCounts[strengthKey] || 2
      const maxPossibleScore = questionCount * 5 // Max is 10 for 2 questions
      const percentageScore = Math.round((rawScore / maxPossibleScore) * 100)

      const strengthInfo = VIA_STRENGTH_DETAILS[strengthKey]
      const question = VIA_QUESTIONS.find((q) => q.strength === strengthKey)

      return {
        strength: strengthKey,
        strengthName: strengthInfo?.title || strengthKey,
        virtue: question?.virtue || 'wisdom',
        virtueName: strengthInfo?.virtue || 'Trí tuệ',
        rawScore,
        percentageScore,
        rank: 0, // Will be calculated below
        isSignature: false, // Will be calculated below
        icon: strengthInfo?.icon || '⭐',
        color: strengthInfo?.color || 'text-gray-500',
        advice: strengthInfo?.advice || '',
      }
    }
  )

  // Step 3: Sort by percentage score and assign ranks
  strengthScores.sort((a, b) => b.percentageScore - a.percentageScore)
  strengthScores.forEach((score, index) => {
    score.rank = index + 1
    score.isSignature = index < 5 // Top 5 are signature strengths
  })

  // Step 4: Calculate virtue scores (average of strengths in each virtue)
  const virtueMap: Record<string, { scores: number[]; strengths: string[] }> = {
    wisdom: { scores: [], strengths: [] },
    courage: { scores: [], strengths: [] },
    humanity: { scores: [], strengths: [] },
    justice: { scores: [], strengths: [] },
    temperance: { scores: [], strengths: [] },
    transcendence: { scores: [], strengths: [] },
  }

  strengthScores.forEach((score) => {
    if (virtueMap[score.virtue]) {
      virtueMap[score.virtue].scores.push(score.percentageScore)
      virtueMap[score.virtue].strengths.push(score.strength)
    }
  })

  const virtueScores: VIAVirtueScore[] = Object.entries(virtueMap).map(
    ([virtueKey, data]) => {
      const averageScore =
        data.scores.length > 0
          ? data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length
          : 0

      return {
        virtue: virtueKey as VIAVirtue,
        virtueName: getVirtueName(virtueKey as VIAVirtue),
        averageScore: Math.round(averageScore),
        percentageScore: Math.round(averageScore),
        strengths: data.strengths,
      }
    }
  )

  // Sort virtues by score
  virtueScores.sort((a, b) => b.percentageScore - a.percentageScore)

  // Step 5: Identify signature strengths (top 5)
  const signatureStrengths = strengthScores.filter((s) => s.isSignature)

  // Step 6: Generate overall profile description
  const topVirtue = virtueScores[0]?.virtue || 'wisdom'
  const overallProfile = generateOverallProfile(signatureStrengths, topVirtue)

  return {
    strengthScores,
    virtueScores,
    signatureStrengths,
    overallProfile,
    topVirtue,
  }
}

/**
 * Get virtue display name
 */
function getVirtueName(virtue: VIAVirtue): string {
  const virtueNames: Record<VIAVirtue, string> = {
    wisdom: 'Trí tuệ & Kiến thức',
    courage: 'Lòng can đảm',
    humanity: 'Tính nhân văn',
    justice: 'Công lý',
    temperance: 'Sự điều độ',
    transcendence: 'Siêu việt',
  }
  return virtueNames[virtue]
}

/**
 * Generate overall profile description based on top strengths
 */
function generateOverallProfile(
  signatureStrengths: VIAStrengthScore[],
  topVirtue: VIAVirtue
): string {
  if (signatureStrengths.length === 0) {
    return 'Kết quả chưa đầy đủ để phân tích.'
  }

  const topStrengthNames = signatureStrengths
    .slice(0, 3)
    .map((s) => s.strengthName)
    .join(', ')

  const virtueDescriptions: Record<VIAVirtue, string> = {
    wisdom:
      'Bạn là người có óc tư duy sắc bén, luôn tìm kiếm kiến thức và hiểu biết sâu sắc về thế giới.',
    courage:
      'Bạn có một trái tim dũng cảm, không ngại đối mặt với thử thách và luôn trung thực với chính mình.',
    humanity:
      'Bạn là người ấm áp và nhân ái, luôn quan tâm đến cảm xúc và hạnh phúc của người xung quanh.',
    justice:
      'Bạn có tinh thần công bằng cao, luôn đóng góp cho cộng đồng và làm việc tốt cho nhóm.',
    temperance:
      'Bạn là người biết điều độ, kiềm chế và tha thứ, luôn giữ được sự cân bằng trong cuộc sống.',
    transcendence:
      'Bạn có khả năng kết nối với điều cao cả hơn, nhìn thấy vẻ đẹp trong cuộc sống và lan tỏa niềm vui.',
  }

  return `Điểm mạnh đặc trưng của bạn là: ${topStrengthNames}. ${virtueDescriptions[topVirtue]} Những điểm mạnh này giúp bạn tạo ra giá trị độc đáo trong công việc và cuộc sống.`
}

/**
 * Get recommendations for developing specific strengths
 */
export function getStrengthRecommendations(strengthKey: string): string {
  const strengthInfo = VIA_STRENGTH_DETAILS[strengthKey]
  return strengthInfo?.advice || 'Hãy tìm cơ hội để thực hành điểm mạnh này mỗi ngày.'
}

/**
 * Check if two VIA profiles are compatible (for relationships/team building)
 * Returns a compatibility score from 0-100
 */
export function calculateVIACompatibility(
  profile1: VIAResult,
  profile2: VIAResult
): number {
  // Simple algorithm: Check overlap in top 10 strengths
  const top10Profile1 = new Set(
    profile1.strengthScores.slice(0, 10).map((s) => s.strength)
  )
  const top10Profile2 = new Set(
    profile2.strengthScores.slice(0, 10).map((s) => s.strength)
  )

  let overlap = 0
  top10Profile1.forEach((strength) => {
    if (top10Profile2.has(strength)) {
      overlap++
    }
  })

  // Also check virtue compatibility
  const virtueCompatibility =
    profile1.topVirtue === profile2.topVirtue ? 20 : 0

  const strengthCompatibility = (overlap / 10) * 80

  return Math.round(strengthCompatibility + virtueCompatibility)
}
