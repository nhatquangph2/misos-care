/**
 * Test Scoring Service
 * Algorithms for calculating test results
 */

import type { MBTIType, SeverityLevel } from '@/types/enums'
import { MBTI_QUESTIONS } from '@/constants/tests/mbti-questions'
import { PHQ9_SEVERITY, CRISIS_THRESHOLD } from '@/constants/tests/phq9-questions'
import { SISRI_24_QUESTIONS, SISRI_24_SCORING, SISRI_24_DIMENSIONS, type SISRI24Dimension } from '@/constants/tests/sisri-24-questions'

// =====================================================
// MBTI SCORING
// =====================================================

export interface MBTIAnswer {
  questionId: number
  value: number // 1-5
}

export interface MBTIResult {
  type: MBTIType
  scores: {
    E: number // Extraversion
    I: number // Introversion
    S: number // Sensing
    N: number // iNtuition
    T: number // Thinking
    F: number // Feeling
    J: number // Judging
    P: number // Perceiving
  }
  percentages: {
    EI: number // E percentage (0-100)
    SN: number // S percentage
    TF: number // T percentage
    JP: number // J percentage
  }
}

export function calculateMBTI(answers: MBTIAnswer[]): MBTIResult {
  const scores = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  }

  // Calculate raw scores
  answers.forEach((answer) => {
    const question = MBTI_QUESTIONS.find((q) => q.id === answer.questionId)
    if (!question) return

    const score = answer.value // 1-5

    if (question.dimension === 'EI') {
      if (question.direction === 'positive') {
        scores.E += score
      } else {
        scores.I += score
      }
    } else if (question.dimension === 'SN') {
      if (question.direction === 'positive') {
        scores.S += score
      } else {
        scores.N += score
      }
    } else if (question.dimension === 'TF') {
      if (question.direction === 'positive') {
        scores.T += score
      } else {
        scores.F += score
      }
    } else if (question.dimension === 'JP') {
      if (question.direction === 'positive') {
        scores.J += score
      } else {
        scores.P += score
      }
    }
  })

  // Calculate percentages
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

  // Determine type (letter with higher score)
  const type = [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P',
  ].join('') as MBTIType

  return {
    type,
    scores,
    percentages,
  }
}

// =====================================================
// PHQ-9 SCORING (Depression)
// =====================================================

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
  question9Score: number // Track suicidal ideation specifically
}

export function calculatePHQ9(answers: PHQ9Answer[]): PHQ9Result {
  // Calculate total score
  const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0)

  // Get question 9 score (suicidal ideation)
  const question9Answer = answers.find((a) => a.questionId === 9)
  const question9Score = question9Answer?.value || 0

  // Determine severity
  let severity: SeverityLevel = 'normal'
  let severityData = PHQ9_SEVERITY.minimal

  if (totalScore >= PHQ9_SEVERITY.severe.min) {
    severity = 'severe'
    severityData = PHQ9_SEVERITY.severe
  } else if (totalScore >= PHQ9_SEVERITY.moderatelySevere.min) {
    severity = 'severe' // Map moderately severe to severe
    severityData = PHQ9_SEVERITY.moderatelySevere
  } else if (totalScore >= PHQ9_SEVERITY.moderate.min) {
    severity = 'moderate'
    severityData = PHQ9_SEVERITY.moderate
  } else if (totalScore >= PHQ9_SEVERITY.mild.min) {
    severity = 'mild'
    severityData = PHQ9_SEVERITY.mild
  }

  // Crisis detection
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

// =====================================================
// BIG FIVE SCORING (Simplified)
// =====================================================

export interface Big5Answer {
  questionId: number
  value: number // 1-5
  dimension: 'O' | 'C' | 'E' | 'A' | 'N' // Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
}

export interface Big5Result {
  openness: number // 0-100
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

export function calculateBig5(answers: Big5Answer[]): Big5Result {
  const scores = {
    O: 0,
    C: 0,
    E: 0,
    A: 0,
    N: 0,
  }

  const counts = {
    O: 0,
    C: 0,
    E: 0,
    A: 0,
    N: 0,
  }

  // Calculate average for each dimension
  answers.forEach((answer) => {
    scores[answer.dimension] += answer.value
    counts[answer.dimension]++
  })

  // Convert to 0-100 scale (1-5 → 0-100)
  return {
    openness: counts.O > 0 ? Math.round(((scores.O / counts.O - 1) / 4) * 100) : 50,
    conscientiousness: counts.C > 0 ? Math.round(((scores.C / counts.C - 1) / 4) * 100) : 50,
    extraversion: counts.E > 0 ? Math.round(((scores.E / counts.E - 1) / 4) * 100) : 50,
    agreeableness: counts.A > 0 ? Math.round(((scores.A / counts.A - 1) / 4) * 100) : 50,
    neuroticism: counts.N > 0 ? Math.round(((scores.N / counts.N - 1) / 4) * 100) : 50,
  }
}

// =====================================================
// SISRI-24 SCORING (Spiritual Intelligence)
// =====================================================

export interface SISRI24Answer {
  questionId: number
  value: number // 1-5
}

export interface SISRI24Result {
  dimensionScores: {
    CET: number // Critical Existential Thinking (6-30)
    PMP: number // Personal Meaning Production (6-30)
    TA: number // Transcendental Awareness (6-30)
    CSE: number // Conscious State Expansion (6-30)
  }
  dimensionPercentages: {
    CET: number // 0-100
    PMP: number
    TA: number
    CSE: number
  }
  dimensionLevels: {
    CET: string // Very Low, Low, Moderate, High, Very High
    PMP: string
    TA: string
    CSE: string
  }
  totalScore: number // 24-120
  totalPercentage: number // 0-100
  overallLevel: string
  overallDescription: string
}

export function calculateSISRI24(answers: SISRI24Answer[]): SISRI24Result {
  const dimensionScores = {
    CET: 0,
    PMP: 0,
    TA: 0,
    CSE: 0,
  }

  // Calculate dimension scores with reverse scoring for question 6
  answers.forEach((answer) => {
    const question = SISRI_24_QUESTIONS.find((q) => q.id === answer.questionId)
    if (!question) return

    let score = answer.value // 0-4 scale

    // Reverse scoring for question 6 (TA dimension)
    // 0 -> 4, 1 -> 3, 2 -> 2, 3 -> 1, 4 -> 0
    if (question.isReversed) {
      score = 4 - score
    }

    dimensionScores[question.dimension] += score
  })

  // Calculate percentages using correct max scores
  // CET: 7 questions × 4 = 28 max
  // PMP: 5 questions × 4 = 20 max
  // TA: 7 questions × 4 = 28 max
  // CSE: 5 questions × 4 = 20 max
  const maxScores = SISRI_24_SCORING.maxScoresPerDimension
  const dimensionPercentages = {
    CET: Math.round((dimensionScores.CET / maxScores.CET) * 100),
    PMP: Math.round((dimensionScores.PMP / maxScores.PMP) * 100),
    TA: Math.round((dimensionScores.TA / maxScores.TA) * 100),
    CSE: Math.round((dimensionScores.CSE / maxScores.CSE) * 100),
  }

  // Determine level for each dimension (based on percentage)
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

  // Calculate total score (max 96)
  const totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0)
  const totalPercentage = Math.round((totalScore / SISRI_24_SCORING.maxTotalScore) * 100)

  // Determine overall level
  const getOverallLevel = (total: number) => {
    const interp = SISRI_24_SCORING.overallInterpretation
    if (total >= interp.veryHigh.min) return { level: interp.veryHigh.label, desc: interp.veryHigh.description }
    if (total >= interp.high.min) return { level: interp.high.label, desc: interp.high.description }
    if (total >= interp.moderate.min) return { level: interp.moderate.label, desc: interp.moderate.description }
    if (total >= interp.low.min) return { level: interp.low.label, desc: interp.low.description }
    return { level: interp.veryLow.label, desc: interp.veryLow.description }
  }

  const overallResult = getOverallLevel(totalScore)

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

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get MBTI type description
 */
export function getMBTIDescription(type: MBTIType) {
  // Import from mbti-questions.ts
  return {
    name: 'To be implemented',
    description: 'Full description from MBTI_DESCRIPTIONS',
  }
}

/**
 * Get PHQ-9 recommendations based on severity
 */
export function getPHQ9Recommendations(severity: SeverityLevel) {
  // Import from phq9-questions.ts
  return {
    title: 'Recommendations',
    actions: ['Action 1', 'Action 2'],
  }
}

/**
 * Check if test result should trigger crisis alert
 */
export function shouldTriggerCrisisAlert(testType: string, result: any): boolean {
  if (testType === 'PHQ9') {
    const phq9Result = result as PHQ9Result
    return phq9Result.crisisFlag
  }

  // Add other test types as needed
  return false
}
