/**
 * Test Scoring Service
 * Algorithms for calculating test results
 */

import { BaseService } from './base.service'
import type { MBTIType, SeverityLevel } from '@/types/enums'
import { MBTI_QUESTIONS, MBTI_DESCRIPTIONS } from '@/constants/tests/mbti-questions'
import { PHQ9_SEVERITY, CRISIS_THRESHOLD, PHQ9_RECOMMENDATIONS, type PHQ9SeverityData } from '@/constants/tests/phq9-questions'
import { SISRI_24_QUESTIONS, SISRI_24_SCORING, SISRI_24_DIMENSIONS, type SISRI24Dimension } from '@/constants/tests/sisri-24-questions'
import {
  DASS21_QUESTIONS,
  DASS21_SUBSCALES,
  type DASS21QuestionResponse,
  type SeverityLevel as DASS21SeverityLevel,
  DEPRESSION_SEVERITY,
  ANXIETY_SEVERITY,
  STRESS_SEVERITY,
} from '@/constants/tests/dass21-questions'

// =====================================================
// INTERFACES
// =====================================================

export interface MBTIAnswer {
  questionId: number
  value: number // 1-5
}

export interface MBTIResult {
  type: MBTIType
  scores: {
    E: number
    I: number
    S: number
    N: number
    T: number
    F: number
    J: number
    P: number
  }
  percentages: {
    EI: number
    SN: number
    TF: number
    JP: number
  }
}

export interface PHQ9Answer {
  questionId: number
  value: number // 0-3
}

export interface PHQ9Result {
  totalScore: number
  severity: SeverityLevel
  severityLabel: string
  severityColor: string
  severityDescription: string
  crisisFlag: boolean
  crisisReason: string | null
  question9Score: number
}

export interface Big5Answer {
  questionId: number
  value: number // 1-5
  dimension: 'O' | 'C' | 'E' | 'A' | 'N'
}

export interface Big5Result {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export interface SISRI24Answer {
  questionId: number
  value: number // 1-5
}

export interface SISRI24Result {
  dimensionScores: {
    CET: number
    PMP: number
    TA: number
    CSE: number
  }
  dimensionPercentages: {
    CET: number
    PMP: number
    TA: number
    CSE: number
  }
  dimensionLevels: {
    CET: string
    PMP: string
    TA: string
    CSE: string
  }
  totalScore: number
  totalPercentage: number
  overallLevel: string
  overallDescription: string
}

export interface DASS21SubscaleScore {
  subscale: 'depression' | 'anxiety' | 'stress'
  subscaleName: string
  rawScore: number
  normalizedScore: number
  severity: DASS21SeverityLevel
}

export interface DASS21Result {
  subscaleScores: DASS21SubscaleScore[]
  overallAssessment: string
  needsCrisisIntervention: boolean
}

export class TestService extends BaseService {
  /**
   * MBTI Scoring
   */
  calculateMBTI(answers: MBTIAnswer[]): MBTIResult {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

    answers.forEach((answer) => {
      const question = MBTI_QUESTIONS.find((q) => q.id === answer.questionId)
      if (!question) return

      const score = answer.value
      if (question.dimension === 'EI') {
        if (question.direction === 'positive') scores.E += score
        else scores.I += score
      } else if (question.dimension === 'SN') {
        if (question.direction === 'positive') scores.S += score
        else scores.N += score
      } else if (question.dimension === 'TF') {
        if (question.direction === 'positive') scores.T += score
        else scores.F += score
      } else if (question.dimension === 'JP') {
        if (question.direction === 'positive') scores.J += score
        else scores.P += score
      }
    })

    const EITotal = scores.E + scores.I
    const SNTotal = scores.S + scores.N
    const TFTotal = scores.T + scores.F
    const JPTotal = scores.J + scores.P

    const percentages = {
      EI: EITotal > 0 ? Math.round((scores.E / EITotal) * 100) : 50,
      SN: SNTotal > 0 ? Math.round((scores.S / SNTotal) * 100) : 50,
      TF: TFTotal > 0 ? Math.round((scores.T / TFTotal) * 100) : 50,
      JP: JPTotal > 0 ? Math.round((scores.J / JPTotal) * 100) : 50,
    }

    const type = [
      scores.E >= scores.I ? 'E' : 'I',
      scores.S >= scores.N ? 'S' : 'N',
      scores.T >= scores.F ? 'T' : 'F',
      scores.J >= scores.P ? 'J' : 'P',
    ].join('') as MBTIType

    return { type, scores, percentages }
  }

  /**
   * PHQ-9 SCORING
   */
  calculatePHQ9(answers: PHQ9Answer[]): PHQ9Result {
    const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0)
    const question9Answer = answers.find((a) => a.questionId === 9)
    const question9Score = question9Answer?.value || 0

    let severity: SeverityLevel = 'normal'
    let severityData: PHQ9SeverityData = PHQ9_SEVERITY.minimal

    if (totalScore >= PHQ9_SEVERITY.severe.min) {
      severity = 'severe'
      severityData = PHQ9_SEVERITY.severe
    } else if (totalScore >= PHQ9_SEVERITY.moderatelySevere.min) {
      severity = 'severe'
      severityData = PHQ9_SEVERITY.moderatelySevere
    } else if (totalScore >= PHQ9_SEVERITY.moderate.min) {
      severity = 'moderate'
      severityData = PHQ9_SEVERITY.moderate
    } else if (totalScore >= PHQ9_SEVERITY.mild.min) {
      severity = 'mild'
      severityData = PHQ9_SEVERITY.mild
    }

    let crisisFlag = false
    let crisisReason: string | null = null

    if (question9Score >= CRISIS_THRESHOLD.question9) {
      crisisFlag = true
      crisisReason = `Câu hỏi 9 (ý nghĩ tự hại): Điểm ${question9Score}/3 - CẦN HỖ TRỢ NGAY`
    } else if (totalScore >= CRISIS_THRESHOLD.totalScore) {
      crisisFlag = true
      crisisReason = `Tổng điểm cao (${totalScore}/27) - Nên gặp chuyên gia ngay`
    }

    return {
      totalScore,
      severity,
      severityLabel: severityData.label,
      severityColor: severityData.color,
      severityDescription: severityData.description,
      crisisFlag,
      crisisReason,
      question9Score,
    }
  }

  /**
   * BIG FIVE SCORING (Simplified)
   */
  calculateBig5(answers: Big5Answer[]): Big5Result {
    const scores = { O: 0, C: 0, E: 0, A: 0, N: 0 }
    const counts = { O: 0, C: 0, E: 0, A: 0, N: 0 }

    answers.forEach((answer) => {
      scores[answer.dimension] += answer.value
      counts[answer.dimension]++
    })

    return {
      openness: counts.O > 0 ? Math.round(((scores.O / counts.O - 1) / 4) * 100) : 50,
      conscientiousness: counts.C > 0 ? Math.round(((scores.C / counts.C - 1) / 4) * 100) : 50,
      extraversion: counts.E > 0 ? Math.round(((scores.E / counts.E - 1) / 4) * 100) : 50,
      agreeableness: counts.A > 0 ? Math.round(((scores.A / counts.A - 1) / 4) * 100) : 50,
      neuroticism: counts.N > 0 ? Math.round(((scores.N / counts.N - 1) / 4) * 100) : 50,
    }
  }

  /**
   * SISRI-24 SCORING
   */
  calculateSISRI24(answers: SISRI24Answer[]): SISRI24Result {
    const dimensionScores = { CET: 0, PMP: 0, TA: 0, CSE: 0 }

    answers.forEach((answer) => {
      const question = SISRI_24_QUESTIONS.find((q) => q.id === answer.questionId)
      if (!question) return

      let score = answer.value
      if (question.isReversed) score = 4 - score
      dimensionScores[question.dimension] += score
    })

    const maxScores = SISRI_24_SCORING.maxScoresPerDimension
    const dimensionPercentages = {
      CET: Math.round((dimensionScores.CET / maxScores.CET) * 100),
      PMP: Math.round((dimensionScores.PMP / maxScores.PMP) * 100),
      TA: Math.round((dimensionScores.TA / maxScores.TA) * 100),
      CSE: Math.round((dimensionScores.CSE / maxScores.CSE) * 100),
    }

    const getDimensionLevel = (percentage: number): string => {
      const ranges = SISRI_24_SCORING.interpretationRanges
      if (percentage >= ranges.veryHigh.min) return ranges.veryHigh.label
      if (percentage >= ranges.high.min) return ranges.high.label
      if (percentage >= ranges.moderate.min) return ranges.moderate.label
      if (percentage >= ranges.low.min) return ranges.low.label
      return ranges.veryLow.label
    }

    const dimensionLevels = {
      CET: getDimensionLevel(dimensionPercentages.CET),
      PMP: getDimensionLevel(dimensionPercentages.PMP),
      TA: getDimensionLevel(dimensionPercentages.TA),
      CSE: getDimensionLevel(dimensionPercentages.CSE),
    }

    const totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0)
    const totalPercentage = Math.round((totalScore / SISRI_24_SCORING.maxTotalScore) * 100)

    const interp = SISRI_24_SCORING.overallInterpretation
    let overallResult = { level: interp.veryLow.label, desc: interp.veryLow.description }

    if (totalScore >= interp.veryHigh.min) overallResult = { level: interp.veryHigh.label, desc: interp.veryHigh.description }
    else if (totalScore >= interp.high.min) overallResult = { level: interp.high.label, desc: interp.high.description }
    else if (totalScore >= interp.moderate.min) overallResult = { level: interp.moderate.label, desc: interp.moderate.description }
    else if (totalScore >= interp.low.min) overallResult = { level: interp.low.label, desc: interp.low.description }

    return {
      dimensionScores,
      dimensionPercentages,
      dimensionLevels,
      totalScore,
      totalPercentage,
      overallLevel: overallResult.level,
      overallDescription: overallResult.desc,
    }
  }

  /**
   * Get MBTI type description
   */
  getMBTIDescription(type: MBTIType) {
    return MBTI_DESCRIPTIONS[type] || {
      name: 'Không xác định',
      description: 'Không tìm thấy mô tả for loại tính cách này.',
      strengths: [],
      careers: [],
    }
  }

  /**
   * Get PHQ-9 recommendations
   */
  getPHQ9Recommendations(severity: SeverityLevel) {
    const severityMap: Partial<Record<SeverityLevel, keyof typeof PHQ9_RECOMMENDATIONS>> = {
      normal: 'minimal',
      mild: 'mild',
      moderate: 'moderate',
      severe: 'severe',
      extremely_severe: 'severe',
    }
    const key = severityMap[severity] || 'minimal'
    return PHQ9_RECOMMENDATIONS[key]
  }

  /**
   * Check if test result should trigger crisis alert
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shouldTriggerCrisisAlert(testType: string, result: any): boolean {
    if (testType === 'PHQ9') return (result as PHQ9Result).crisisFlag
    if (testType === 'DASS21') return (result as DASS21Result).needsCrisisIntervention
    return false
  }

  /**
   * Get severity level for DASS-21 subscale
   */
  private getDASS21SeverityLevel(
    subscale: 'depression' | 'anxiety' | 'stress',
    normalizedScore: number
  ): DASS21SeverityLevel {
    if (subscale === 'depression') {
      if (normalizedScore < 10) return DEPRESSION_SEVERITY.normal
      if (normalizedScore < 14) return DEPRESSION_SEVERITY.mild
      if (normalizedScore < 21) return DEPRESSION_SEVERITY.moderate
      if (normalizedScore < 28) return DEPRESSION_SEVERITY.severe
      return DEPRESSION_SEVERITY['extremely-severe']
    }
    if (subscale === 'anxiety') {
      if (normalizedScore < 8) return ANXIETY_SEVERITY.normal
      if (normalizedScore < 10) return ANXIETY_SEVERITY.mild
      if (normalizedScore < 15) return ANXIETY_SEVERITY.moderate
      if (normalizedScore < 20) return ANXIETY_SEVERITY.severe
      return ANXIETY_SEVERITY['extremely-severe']
    }
    if (normalizedScore < 15) return STRESS_SEVERITY.normal
    if (normalizedScore < 19) return STRESS_SEVERITY.mild
    if (normalizedScore < 26) return STRESS_SEVERITY.moderate
    if (normalizedScore < 34) return STRESS_SEVERITY.severe
    return STRESS_SEVERITY['extremely-severe']
  }

  /**
   * Calculate DASS-21 scores
   */
  calculateDASS21(responses: DASS21QuestionResponse[]): DASS21Result {
    const subscaleScores: Record<string, number> = { depression: 0, anxiety: 0, stress: 0 }

    responses.forEach((response) => {
      const question = DASS21_QUESTIONS.find((q) => q.id === response.questionId)
      if (!question) return
      subscaleScores[question.subscale] += response.score
    })

    const results: DASS21SubscaleScore[] = Object.entries(subscaleScores).map(
      ([subscale, rawScore]) => {
        const normalizedScore = rawScore * 2
        const severity = this.getDASS21SeverityLevel(subscale as any, normalizedScore)
        return {
          subscale: subscale as any,
          subscaleName: DASS21_SUBSCALES[subscale as keyof typeof DASS21_SUBSCALES],
          rawScore,
          normalizedScore,
          severity,
        }
      }
    )

    const hasSevere = results.some((r) => r.severity.level === 'severe' || r.severity.level === 'extremely-severe')
    const hasModerate = results.some((r) => r.severity.level === 'moderate')

    let overallAssessment = ''
    let needsCrisisIntervention = false

    if (hasSevere) {
      overallAssessment = 'Kết quả cho thấy bạn đang trải qua mức độ căng thẳng cao. Chúng tôi khuyến nghị bạn tìm kiếm sự hỗ trợ chuyên môn.'
      needsCrisisIntervention = true
    } else if (hasModerate) {
      overallAssessment = 'Kết quả cho thấy bạn đang có dấu hiệu căng thẳng ở mức trung bình. Hãy chú ý chăm sóc sức khỏe tinh thần.'
    } else {
      overallAssessment = 'Kết quả cho thấy tình trạng sức khỏe tinh thần of bạn đang ở mức bình thường.'
    }

    const depressionScore = results.find((r) => r.subscale === 'depression')
    if (depressionScore && depressionScore.normalizedScore >= 28) {
      needsCrisisIntervention = true
    }

    return { subscaleScores: results, overallAssessment, needsCrisisIntervention }
  }
}

export const testService = new TestService()

export const calculateMBTI = (a: MBTIAnswer[]) => testService.calculateMBTI(a)
export const calculatePHQ9 = (a: PHQ9Answer[]) => testService.calculatePHQ9(a)
export const calculateBig5 = (a: Big5Answer[]) => testService.calculateBig5(a)
export const calculateSISRI24 = (a: SISRI24Answer[]) => testService.calculateSISRI24(a)
export const getMBTIDescription = (t: MBTIType) => testService.getMBTIDescription(t)
export const getPHQ9Recommendations = (s: SeverityLevel) => testService.getPHQ9Recommendations(s)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shouldTriggerCrisisAlert = (t: string, r: any) => testService.shouldTriggerCrisisAlert(t, r)
export const calculateDASS21 = (r: DASS21QuestionResponse[]) => testService.calculateDASS21(r)
