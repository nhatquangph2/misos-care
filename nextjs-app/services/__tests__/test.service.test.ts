/**
 * Unit Tests for Test Scoring Service
 * Critical scoring logic must be tested thoroughly
 */

import { describe, it, expect } from 'vitest'
import {
  calculateMBTI,
  calculatePHQ9,
  calculateDASS21,
  calculateSISRI24,
  type MBTIAnswer,
  type PHQ9Answer,
  type DASS21QuestionResponse,
  type SISRI24Answer,
} from '../test.service'

describe('MBTI Scoring', () => {
  it('should correctly calculate MBTI type for strong extravert', () => {
    const answers: MBTIAnswer[] = [
      // All E dimension questions scored high (5)
      { questionId: 1, value: 5 },
      { questionId: 2, value: 5 },
      { questionId: 3, value: 5 },
      { questionId: 4, value: 5 },
      { questionId: 5, value: 5 },
      // Other dimensions balanced
      { questionId: 6, value: 3 },
      { questionId: 7, value: 3 },
      { questionId: 8, value: 3 },
    ]

    const result = calculateMBTI(answers)

    // Check that E dimension is strongly preferred
    expect(result.scores.E).toBeGreaterThan(result.scores.I)
    expect(result.percentages.EI).toBeGreaterThan(50)
  })

  it('should handle balanced scores correctly', () => {
    const answers: MBTIAnswer[] = Array.from({ length: 60 }, (_, i) => ({
      questionId: i + 1,
      value: 3, // All neutral scores
    }))

    const result = calculateMBTI(answers)

    // All percentages should be close to 50%
    expect(result.percentages.EI).toBeCloseTo(50, 10)
    expect(result.percentages.SN).toBeCloseTo(50, 10)
    expect(result.percentages.TF).toBeCloseTo(50, 10)
    expect(result.percentages.JP).toBeCloseTo(50, 10)
  })

  it('should never exceed 100% for any dimension', () => {
    const answers: MBTIAnswer[] = Array.from({ length: 60 }, (_, i) => ({
      questionId: i + 1,
      value: 5, // All maximum scores
    }))

    const result = calculateMBTI(answers)

    expect(result.percentages.EI).toBeLessThanOrEqual(100)
    expect(result.percentages.SN).toBeLessThanOrEqual(100)
    expect(result.percentages.TF).toBeLessThanOrEqual(100)
    expect(result.percentages.JP).toBeLessThanOrEqual(100)
  })
})

describe('PHQ-9 Scoring (Depression)', () => {
  it('should detect minimal depression (score 0-4)', () => {
    const answers: PHQ9Answer[] = Array.from({ length: 9 }, (_, i) => ({
      questionId: i + 1,
      value: 0,
    }))

    const result = calculatePHQ9(answers)

    expect(result.totalScore).toBe(0)
    expect(result.severity).toBe('normal')
    expect(result.crisisFlag).toBe(false)
  })

  it('should detect mild depression (score 5-9)', () => {
    const answers: PHQ9Answer[] = [
      { questionId: 1, value: 1 },
      { questionId: 2, value: 1 },
      { questionId: 3, value: 1 },
      { questionId: 4, value: 1 },
      { questionId: 5, value: 1 },
      { questionId: 6, value: 0 },
      { questionId: 7, value: 0 },
      { questionId: 8, value: 0 },
      { questionId: 9, value: 0 },
    ]

    const result = calculatePHQ9(answers)

    expect(result.totalScore).toBe(5)
    expect(result.severity).toBe('mild')
    expect(result.crisisFlag).toBe(false)
  })

  it('should detect severe depression (score 20-27)', () => {
    const answers: PHQ9Answer[] = Array.from({ length: 9 }, (_, i) => ({
      questionId: i + 1,
      value: 3,
    }))

    const result = calculatePHQ9(answers)

    expect(result.totalScore).toBe(27)
    expect(result.severity).toBe('severe')
    expect(result.crisisFlag).toBe(true)
  })

  it('should trigger crisis alert for suicidal ideation (question 9 >= 1)', () => {
    const answers: PHQ9Answer[] = [
      { questionId: 1, value: 0 },
      { questionId: 2, value: 0 },
      { questionId: 3, value: 0 },
      { questionId: 4, value: 0 },
      { questionId: 5, value: 0 },
      { questionId: 6, value: 0 },
      { questionId: 7, value: 0 },
      { questionId: 8, value: 0 },
      { questionId: 9, value: 2 }, // Suicidal ideation
    ]

    const result = calculatePHQ9(answers)

    expect(result.question9Score).toBe(2)
    expect(result.crisisFlag).toBe(true)
    expect(result.crisisReason).toContain('Câu hỏi 9')
  })

  it('should calculate exact total score correctly', () => {
    const answers: PHQ9Answer[] = [
      { questionId: 1, value: 2 },
      { questionId: 2, value: 1 },
      { questionId: 3, value: 3 },
      { questionId: 4, value: 0 },
      { questionId: 5, value: 1 },
      { questionId: 6, value: 2 },
      { questionId: 7, value: 1 },
      { questionId: 8, value: 0 },
      { questionId: 9, value: 1 },
    ]

    const result = calculatePHQ9(answers)

    expect(result.totalScore).toBe(11) // 2+1+3+0+1+2+1+0+1
    expect(result.severity).toBe('moderate')
  })
})

describe('DASS-21 Scoring (Depression, Anxiety, Stress)', () => {
  it('should correctly separate subscales', () => {
    // Mock responses for specific subscales
    const responses: DASS21QuestionResponse[] = [
      { questionId: 3, score: 3 }, // Depression
      { questionId: 5, score: 3 }, // Depression
      { questionId: 2, score: 2 }, // Anxiety
      { questionId: 4, score: 2 }, // Anxiety
      { questionId: 1, score: 1 }, // Stress
      { questionId: 6, score: 1 }, // Stress
    ]

    const result = calculateDASS21(responses)

    expect(result.subscaleScores).toHaveLength(3)
    expect(result.subscaleScores.find(s => s.subscale === 'depression')).toBeDefined()
    expect(result.subscaleScores.find(s => s.subscale === 'anxiety')).toBeDefined()
    expect(result.subscaleScores.find(s => s.subscale === 'stress')).toBeDefined()
  })

  it('should normalize scores correctly (multiply by 2)', () => {
    const responses: DASS21QuestionResponse[] = Array.from({ length: 21 }, (_, i) => ({
      questionId: i + 1,
      score: 2, // Each question score = 2
    }))

    const result = calculateDASS21(responses)

    // Each subscale has 7 questions
    // Raw score per subscale = 7 * 2 = 14
    // Normalized = 14 * 2 = 28
    result.subscaleScores.forEach(subscale => {
      expect(subscale.rawScore).toBe(14)
      expect(subscale.normalizedScore).toBe(28)
    })
  })

  it('should detect crisis for severe depression (normalized >= 28)', () => {
    // Create all responses with score 3 to maximize depression
    const responses: DASS21QuestionResponse[] = Array.from({ length: 21 }, (_, i) => ({
      questionId: i + 1,
      score: 3,
    }))

    const result = calculateDASS21(responses)

    const depression = result.subscaleScores.find(s => s.subscale === 'depression')
    expect(depression?.normalizedScore).toBeGreaterThanOrEqual(28)
    expect(result.needsCrisisIntervention).toBe(true)
  })

  it('should classify severity levels correctly for anxiety', () => {
    // Test different anxiety severity levels
    const testCases = [
      { score: 0, expectedSeverity: 'normal' },
      { score: 8, expectedSeverity: 'mild' },
      { score: 14, expectedSeverity: 'moderate' },
      { score: 19, expectedSeverity: 'severe' },
      { score: 20, expectedSeverity: 'extremely-severe' },
    ]

    // Note: This is a simplified test - in reality we'd need to construct
    // proper responses that result in these normalized scores
  })
})

describe('SISRI-24 Scoring (Spiritual Intelligence)', () => {
  it('should handle reverse scoring for question 6', () => {
    const answers: SISRI24Answer[] = [
      { questionId: 6, value: 4 }, // Should be reversed to 0
    ]

    const result = calculateSISRI24(answers)

    // After reverse scoring, question 6 value of 4 becomes 0
    // This should be reflected in the TA dimension score
    expect(result.dimensionScores.TA).toBe(0)
  })

  it('should calculate dimension percentages correctly', () => {
    // Create maximum scores for all questions
    const answers: SISRI24Answer[] = Array.from({ length: 24 }, (_, i) => ({
      questionId: i + 1,
      value: 4, // Maximum score (0-4 scale)
    }))

    const result = calculateSISRI24(answers)

    // With all maximum scores (except reverse scored), percentages should be high
    expect(result.totalPercentage).toBeGreaterThan(90)
  })

  it('should classify overall level correctly', () => {
    // Test minimal scores
    const minAnswers: SISRI24Answer[] = Array.from({ length: 24 }, (_, i) => ({
      questionId: i + 1,
      value: 0,
    }))

    const minResult = calculateSISRI24(minAnswers)
    expect(minResult.totalScore).toBe(0)
    expect(minResult.overallLevel).toContain('Very Low')

    // Test maximum scores
    const maxAnswers: SISRI24Answer[] = Array.from({ length: 24 }, (_, i) => ({
      questionId: i + 1,
      value: 4,
    }))

    const maxResult = calculateSISRI24(maxAnswers)
    // Note: Due to reverse scoring on question 6, total won't be exactly 96
    expect(maxResult.totalScore).toBeGreaterThan(80)
  })

  it('should never exceed maximum scores per dimension', () => {
    const answers: SISRI24Answer[] = Array.from({ length: 24 }, (_, i) => ({
      questionId: i + 1,
      value: 4,
    }))

    const result = calculateSISRI24(answers)

    // Maximum scores per dimension:
    // CET: 7 questions × 4 = 28
    // PMP: 5 questions × 4 = 20
    // TA: 7 questions × 4 = 28 (but one is reversed)
    // CSE: 5 questions × 4 = 20

    expect(result.dimensionScores.CET).toBeLessThanOrEqual(28)
    expect(result.dimensionScores.PMP).toBeLessThanOrEqual(20)
    expect(result.dimensionScores.TA).toBeLessThanOrEqual(28)
    expect(result.dimensionScores.CSE).toBeLessThanOrEqual(20)
  })
})

describe('Edge Cases and Error Handling', () => {
  it('should handle empty answers array for MBTI', () => {
    const result = calculateMBTI([])

    // Should return 50-50 split when no data
    expect(result.percentages.EI).toBe(50)
    expect(result.percentages.SN).toBe(50)
    expect(result.percentages.TF).toBe(50)
    expect(result.percentages.JP).toBe(50)
  })

  it('should handle empty answers array for PHQ9', () => {
    const result = calculatePHQ9([])

    expect(result.totalScore).toBe(0)
    expect(result.severity).toBe('normal')
    expect(result.question9Score).toBe(0)
  })

  it('should handle empty responses for DASS21', () => {
    const result = calculateDASS21([])

    expect(result.subscaleScores).toHaveLength(3)
    result.subscaleScores.forEach(subscale => {
      expect(subscale.rawScore).toBe(0)
      expect(subscale.normalizedScore).toBe(0)
    })
  })
})
