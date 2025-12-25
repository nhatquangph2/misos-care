/**
 * VIA Character Strengths Scoring Service
 * Algorithms for calculating VIA test results
 * Based on VIA Institute on Character methodology
 */

import { BaseService } from './base.service'
import { VIA_QUESTIONS, VIA_STRENGTH_DETAILS, type VIAVirtue } from '@/constants/tests/via-questions'

// ============================================
// INTERFACES
// ============================================

export interface VIAAnswer {
  questionId: number
  value: number
}

export interface VIAStrengthScore {
  strength: string
  strengthName: string
  virtue: string
  virtueName: string
  rawScore: number
  percentageScore: number
  rank: number
  isSignature: boolean
  icon: string
  color: string
  advice: string
}

export interface VIAVirtueScore {
  virtue: VIAVirtue
  virtueName: string
  averageScore: number
  percentageScore: number
  strengths: string[]
}

export interface VIAResult {
  strengthScores: VIAStrengthScore[]
  virtueScores: VIAVirtueScore[]
  signatureStrengths: VIAStrengthScore[]
  overallProfile: string
  topVirtue: VIAVirtue
}

export class ViaScoringService extends BaseService {
  /**
   * Calculate VIA Character Strengths scores
   */
  calculateVIA(answers: VIAAnswer[]): VIAResult {
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

    const strengthScores: VIAStrengthScore[] = Object.entries(strengthRawScores).map(
      ([strengthKey, rawScore]) => {
        const questionCount = strengthQuestionCounts[strengthKey] || 2
        const percentageScore = Math.round((rawScore / (questionCount * 5)) * 100)
        const info = VIA_STRENGTH_DETAILS[strengthKey]
        const question = VIA_QUESTIONS.find((q) => q.strength === strengthKey)

        return {
          strength: strengthKey,
          strengthName: info?.title || strengthKey,
          virtue: question?.virtue || 'wisdom',
          virtueName: info?.virtue || 'Trí tuệ',
          rawScore,
          percentageScore,
          rank: 0,
          isSignature: false,
          icon: info?.icon || '⭐',
          color: info?.color || 'text-gray-500',
          advice: info?.advice || '',
        }
      }
    )

    strengthScores.sort((a, b) => b.percentageScore - a.percentageScore)
    strengthScores.forEach((score, index) => {
      score.rank = index + 1
      score.isSignature = index < 5
    })

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
        const avg = data.scores.length > 0 ? data.scores.reduce((s, x) => s + x, 0) / data.scores.length : 0
        return {
          virtue: virtueKey as VIAVirtue,
          virtueName: this.getVirtueName(virtueKey as VIAVirtue),
          averageScore: Math.round(avg),
          percentageScore: Math.round(avg),
          strengths: data.strengths,
        }
      }
    )

    virtueScores.sort((a, b) => b.percentageScore - a.percentageScore)
    const signatureStrengths = strengthScores.filter((s) => s.isSignature)
    const topVirtue = virtueScores[0]?.virtue || 'wisdom'

    return {
      strengthScores,
      virtueScores,
      signatureStrengths,
      overallProfile: this.generateOverallProfile(signatureStrengths, topVirtue),
      topVirtue,
    }
  }

  getVirtueName(virtue: VIAVirtue): string {
    const names: Record<VIAVirtue, string> = {
      wisdom: 'Trí tuệ & Kiến thức',
      courage: 'Lòng can đảm',
      humanity: 'Tính nhân văn',
      justice: 'Công lý',
      temperance: 'Sự điều độ',
      transcendence: 'Siêu việt',
    }
    return names[virtue]
  }

  private generateOverallProfile(signatureStrengths: VIAStrengthScore[], topVirtue: VIAVirtue): string {
    if (signatureStrengths.length === 0) return 'Kết quả chưa đầy đủ.'
    const topNames = signatureStrengths.slice(0, 3).map((s) => s.strengthName).join(', ')
    const descs: Record<VIAVirtue, string> = {
      wisdom: 'Bạn là người tư duy sắc bén, luôn tìm kiếm hiểu biết sâu sắc.',
      courage: 'Bạn có trái tim dũng cảm, không ngại thử thách and trung thực.',
      humanity: 'Bạn ấm áp and nhân ái, luôn quan tâm đến người dân.',
      justice: 'Bạn có tinh thần công bằng cao, đóng góp cho cộng đồng.',
      temperance: 'Bạn biết điều độ, kiềm chế and tha thứ.',
      transcendence: 'Bạn kết nối with điều cao cả, lan tỏa niềm vui.',
    }
    return `Điểm mạnh: ${topNames}. ${descs[topVirtue]} Những điểm này tạo ra giá trị độc đáo cho bạn.`
  }

  getStrengthRecommendations(strengthKey: string): string {
    return VIA_STRENGTH_DETAILS[strengthKey]?.advice || 'Hãy thực hành điểm mạnh này mỗi ngày.'
  }

  calculateVIACompatibility(profile1: VIAResult, profile2: VIAResult): number {
    const top10_1 = new Set(profile1.strengthScores.slice(0, 10).map((s) => s.strength))
    const top10_2 = new Set(profile2.strengthScores.slice(0, 10).map((s) => s.strength))
    let overlap = 0
    top10_1.forEach((s) => { if (top10_2.has(s)) overlap++ })
    const virtueComp = profile1.topVirtue === profile2.topVirtue ? 20 : 0
    return Math.round((overlap / 10) * 80 + virtueComp)
  }
}

export const viaScoringService = new ViaScoringService()

export const calculateVIA = (a: VIAAnswer[]) => viaScoringService.calculateVIA(a)
export const getStrengthRecommendations = (k: string) => viaScoringService.getStrengthRecommendations(k)
export const calculateVIACompatibility = (p1: VIAResult, p2: VIAResult) => viaScoringService.calculateVIACompatibility(p1, p2)
