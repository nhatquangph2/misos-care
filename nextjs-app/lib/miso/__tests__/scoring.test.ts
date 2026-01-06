/**
 * MISO V3 Scoring Engine Tests
 * Tests for BVS, RCS, and DASS prediction calculations
 */

import { describe, it, expect } from 'vitest'
import {
    calculateBVS,
    calculateRCS,
    predictDASS,
    calculateDelta,
    calculateAllDeltas,
    calculateControlComposite,
    calculateAllScores,
} from '../scoring'

describe('calculateBVS', () => {
    it('should return 0 for average percentiles (50th percentile)', () => {
        const result = calculateBVS({ N: 50, E: 50, O: 50, A: 50, C: 50 })
        expect(result).toBe(0)
    })

    it('should return positive BVS for high Neuroticism', () => {
        const result = calculateBVS({ N: 80, E: 50, O: 50, A: 50, C: 50 })
        expect(result).toBeGreaterThan(0)
    })

    it('should return negative BVS for high Conscientiousness', () => {
        const result = calculateBVS({ N: 50, E: 50, O: 50, A: 50, C: 80 })
        expect(result).toBeLessThan(0)
    })

    it('should handle partial data with defaults', () => {
        const result = calculateBVS({ N: 70 })
        expect(typeof result).toBe('number')
        expect(result).not.toBeNaN()
    })

    it('should calculate correctly for high-risk profile', () => {
        // High N, Low C, Low E, Low A = high vulnerability
        const result = calculateBVS({ N: 85, C: 25, E: 30, A: 30 })
        expect(result).toBeGreaterThan(0.5)
    })

    it('should calculate correctly for low-risk profile', () => {
        // Low N, High C, High E, High A = low vulnerability
        const result = calculateBVS({ N: 20, C: 80, E: 70, A: 75 })
        expect(result).toBeLessThan(-0.3)
    })
})

describe('calculateRCS', () => {
    it('should return 0 for average VIA percentiles', () => {
        const result = calculateRCS({
            Hope: 50,
            Zest: 50,
            'Self-Regulation': 50,
            Gratitude: 50,
            Curiosity: 50,
            Love: 50,
        })
        expect(result).toBe(0)
    })

    it('should return positive RCS for high Hope and Zest', () => {
        const result = calculateRCS({
            Hope: 80,
            Zest: 80,
        })
        expect(result).toBeGreaterThan(0)
    })

    it('should add J-type bonus for INTJ', () => {
        const viaScores = { Hope: 60, Zest: 60 }
        const withoutMBTI = calculateRCS(viaScores)
        const withJType = calculateRCS(viaScores, 'INTJ')
        const withPType = calculateRCS(viaScores, 'INTP')

        expect(withJType).toBeGreaterThan(withoutMBTI)
        expect(withPType).toBe(withoutMBTI)
    })

    it('should handle empty VIA data', () => {
        const result = calculateRCS({})
        expect(result).toBe(0)
    })
})

describe('predictDASS', () => {
    it('should predict higher DASS for high BVS and low RCS', () => {
        const highRisk = predictDASS(1.5, -0.5)
        const lowRisk = predictDASS(-0.5, 1.5)

        expect(highRisk.D).toBeGreaterThan(lowRisk.D)
        expect(highRisk.A).toBeGreaterThan(lowRisk.A)
        expect(highRisk.S).toBeGreaterThan(lowRisk.S)
    })

    it('should clamp DASS scores to valid range [0, 42]', () => {
        // Extreme high risk
        const result = predictDASS(3.0, -3.0)
        expect(result.D).toBeLessThanOrEqual(42)
        expect(result.A).toBeLessThanOrEqual(42)
        expect(result.S).toBeLessThanOrEqual(42)

        // Extreme low risk
        const result2 = predictDASS(-3.0, 3.0)
        expect(result2.D).toBeGreaterThanOrEqual(0)
        expect(result2.A).toBeGreaterThanOrEqual(0)
        expect(result2.S).toBeGreaterThanOrEqual(0)
    })

    it('should return reasonable values for neutral scores', () => {
        const result = predictDASS(0, 0)
        expect(result.D).toBeGreaterThan(0)
        expect(result.D).toBeLessThan(20)
    })
})

describe('calculateDelta', () => {
    it('should calculate positive delta when actual > predicted', () => {
        expect(calculateDelta(20, 10)).toBe(10)
    })

    it('should calculate negative delta when actual < predicted', () => {
        expect(calculateDelta(5, 15)).toBe(-10)
    })

    it('should return 0 when actual equals predicted', () => {
        expect(calculateDelta(10, 10)).toBe(0)
    })
})

describe('calculateAllDeltas', () => {
    it('should identify acute stressor when total delta > 15', () => {
        const result = calculateAllDeltas(
            { D: 30, A: 20, S: 25 },
            { D: 10, A: 10, S: 10 }
        )
        expect(result.interpretation).toContain('Acute stressor')
    })

    it('should identify repressive coping when total delta < -15', () => {
        const result = calculateAllDeltas(
            { D: 5, A: 3, S: 5 },
            { D: 15, A: 15, S: 15 }
        )
        expect(result.interpretation).toContain('Repressive coping')
    })

    it('should identify significant Depression discrepancy', () => {
        const result = calculateAllDeltas(
            { D: 25, A: 10, S: 10 },
            { D: 10, A: 10, S: 10 }
        )
        expect(result.interpretation).toContain('Depression')
    })
})

describe('calculateControlComposite', () => {
    it('should return 0 for average values', () => {
        const result = calculateControlComposite(
            { 'Self-Regulation': 50, Prudence: 50 },
            { C: 50 }
        )
        expect(result).toBe(0)
    })

    it('should return positive for high control traits', () => {
        const result = calculateControlComposite(
            { 'Self-Regulation': 80, Prudence: 75 },
            { C: 85 }
        )
        expect(result).toBeGreaterThan(0.5)
    })

    it('should return negative for low control traits', () => {
        const result = calculateControlComposite(
            { 'Self-Regulation': 20, Prudence: 25 },
            { C: 15 }
        )
        expect(result).toBeLessThan(-0.5)
    })
})

describe('calculateAllScores', () => {
    it('should calculate comprehensive scores with all data', () => {
        const result = calculateAllScores({
            big5_percentiles: { N: 70, E: 50, O: 60, A: 55, C: 45 },
            via_percentiles: { Hope: 65, Zest: 60, Gratitude: 70 },
            mbti: 'INFJ',
            actual_dass: { D: 15, A: 12, S: 18 },
        })

        expect(result.BVS).toBeDefined()
        expect(result.RCS).toBeDefined()
        expect(result.predicted_dass).toBeDefined()
        expect(result.delta).toBeDefined()
        expect(result.delta?.interpretation).toBeDefined()
    })

    it('should work with minimal data', () => {
        const result = calculateAllScores({
            big5_percentiles: { N: 60 },
        })

        expect(result.BVS).toBeDefined()
        expect(result.RCS).toBe(0) // No VIA data
        expect(result.predicted_dass).toBeDefined()
        expect(result.delta).toBeUndefined() // No actual DASS
    })
})
