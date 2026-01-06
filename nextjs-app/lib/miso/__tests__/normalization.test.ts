/**
 * MISO V3 Normalization Engine Tests
 * Tests for Z-score conversion, percentile calculation, and data normalization
 */

import { describe, it, expect } from 'vitest'
import {
    rawToZScore,
    zScoreToPercentile,
    rawToPercentile,
    createNormalizedScore,
    normalizeBig5,
    normalizeDASS21,
    normalizeVIA,
    mbtiToBig5Priors,
    getMBTIRiskProfile,
    validateMBTI,
    validateBig5Scores,
    validateDASS21Scores,
    NormalizationEngine,
} from '../normalization'

describe('rawToZScore', () => {
    it('should return 0 for a raw score equal to mean', () => {
        const norm = { mean: 10, sd: 2, range: [0, 20] as [number, number] }
        expect(rawToZScore(10, norm)).toBe(0)
    })

    it('should return 1 for a raw score one SD above mean', () => {
        const norm = { mean: 10, sd: 2, range: [0, 20] as [number, number] }
        expect(rawToZScore(12, norm)).toBe(1)
    })

    it('should return -1 for a raw score one SD below mean', () => {
        const norm = { mean: 10, sd: 2, range: [0, 20] as [number, number] }
        expect(rawToZScore(8, norm)).toBe(-1)
    })

    it('should clip extreme Z-scores to [-3.5, 3.5]', () => {
        const norm = { mean: 10, sd: 1, range: [0, 20] as [number, number] }
        expect(rawToZScore(20, norm)).toBe(3.5)
        expect(rawToZScore(0, norm)).toBe(-3.5)
    })
})

describe('zScoreToPercentile', () => {
    it('should return 50 for Z = 0', () => {
        const result = zScoreToPercentile(0)
        expect(result).toBeCloseTo(50, 0)
    })

    it('should return approximately 84 for Z = 1', () => {
        const result = zScoreToPercentile(1)
        expect(result).toBeCloseTo(84, 0)
    })

    it('should return approximately 16 for Z = -1', () => {
        const result = zScoreToPercentile(-1)
        expect(result).toBeCloseTo(16, 0)
    })

    it('should return approximately 98 for Z = 2', () => {
        const result = zScoreToPercentile(2)
        expect(result).toBeCloseTo(98, 0)
    })

    it('should return approximately 2 for Z = -2', () => {
        const result = zScoreToPercentile(-2)
        expect(result).toBeCloseTo(2, 0)
    })

    it('should clamp to [0, 100]', () => {
        expect(zScoreToPercentile(10)).toBeLessThanOrEqual(100)
        expect(zScoreToPercentile(-10)).toBeGreaterThanOrEqual(0)
    })
})

describe('rawToPercentile', () => {
    it('should convert raw score to percentile correctly', () => {
        const norm = { mean: 50, sd: 10, range: [0, 100] as [number, number] }
        const result = rawToPercentile(60, norm) // 1 SD above mean
        expect(result).toBeCloseTo(84, 0)
    })
})

describe('createNormalizedScore', () => {
    it('should create complete normalized score object', () => {
        const norm = { mean: 3.5, sd: 0.7, range: [1, 5] as [number, number] }
        const result = createNormalizedScore(4.2, norm)

        expect(result).toHaveProperty('raw')
        expect(result).toHaveProperty('z_score')
        expect(result).toHaveProperty('percentile')
        expect(result).toHaveProperty('category')
        expect(result.raw).toBe(4.2)
        expect(result.z_score).toBeGreaterThan(0)
        expect(result.percentile).toBeGreaterThan(50)
    })

    it('should categorize correctly', () => {
        const norm = { mean: 50, sd: 10, range: [0, 100] as [number, number] }

        const veryLow = createNormalizedScore(25, norm)
        const veryHigh = createNormalizedScore(75, norm)

        // Score 25 with mean 50, SD 10 = Z of -2.5 = ~0.6 percentile = VERY_LOW
        expect(veryLow.category).toBe('VERY_LOW')
        // Score 75 with mean 50, SD 10 = Z of +2.5 = ~99 percentile = VERY_HIGH  
        expect(veryHigh.category).toBe('VERY_HIGH')
    })
})

describe('normalizeBig5', () => {
    it('should normalize BFI-2 average scores (1-5 scale)', () => {
        const result = normalizeBig5({ N: 2.5, E: 3.8, O: 4.0, A: 3.5, C: 3.2 })

        expect(result.normalized).toBeDefined()
        expect(result.percentiles).toBeDefined()
        expect(Object.keys(result.normalized)).toHaveLength(5)
    })

    it('should auto-convert BFI-2 sum scores to averages', () => {
        // BFI-2 has 12 items per domain, so 36 would be average of 3.0
        const result = normalizeBig5({ N: 36 })

        expect(result.normalized.N).toBeDefined()
        expect(result.normalized.N.raw).toBeCloseTo(3.0, 1)
    })

    it('should handle partial data', () => {
        const result = normalizeBig5({ N: 3.0, C: 4.0 })

        expect(result.normalized.N).toBeDefined()
        expect(result.normalized.C).toBeDefined()
        expect(result.normalized.E).toBeUndefined()
    })
})

describe('normalizeDASS21', () => {
    it('should normalize DASS-21 raw scores', () => {
        const result = normalizeDASS21({ D: 10, A: 8, S: 12 })

        expect(result.normalized.D).toBeDefined()
        expect(result.normalized.A).toBeDefined()
        expect(result.normalized.S).toBeDefined()
        expect(result.percentiles.D).toBeDefined()
    })

    it('should handle severe scores', () => {
        const result = normalizeDASS21({ D: 28, A: 20, S: 33 })

        expect(result.percentiles.D).toBeGreaterThan(90)
        expect(result.percentiles.A).toBeGreaterThan(90)
        expect(result.percentiles.S).toBeGreaterThan(90)
    })
})

describe('mbtiToBig5Priors', () => {
    it('should map INTJ to Big5 priors correctly', () => {
        const result = mbtiToBig5Priors('INTJ')

        expect(result).not.toBeNull()
        expect(result?.E).toBe(30) // Introvert
        expect(result?.O).toBe(70) // iNtuitive
        expect(result?.A).toBe(30) // Thinking
        expect(result?.C).toBe(70) // Judging
        expect(result?._source).toBe('mbti_inferred')
    })

    it('should return null for invalid MBTI', () => {
        expect(mbtiToBig5Priors('')).toBeNull()
        expect(mbtiToBig5Priors('XXX')).toBeNull()
    })

    it('should set higher N for INFP types', () => {
        const infp = mbtiToBig5Priors('INFP')
        const estj = mbtiToBig5Priors('ESTJ')

        expect(infp?.N).toBeGreaterThan(estj?.N || 0)
    })
})

describe('getMBTIRiskProfile', () => {
    it('should return VERY_HIGH risk for INFP', () => {
        const result = getMBTIRiskProfile('INFP')
        expect(result.risk_level).toBe('VERY_HIGH')
        expect(result.risks).toContain('Trầm cảm')
    })

    it('should return VERY_LOW risk for ESTJ', () => {
        const result = getMBTIRiskProfile('ESTJ')
        expect(result.risk_level).toBe('VERY_LOW')
    })

    it('should return default for unknown type', () => {
        const result = getMBTIRiskProfile('XXXX')
        expect(result.risk_level).toBe('MEDIUM')
    })
})

describe('validateMBTI', () => {
    it('should validate correct MBTI types', () => {
        expect(validateMBTI('INTJ').valid).toBe(true)
        expect(validateMBTI('ESFP').valid).toBe(true)
        expect(validateMBTI('infj').valid).toBe(true)
    })

    it('should reject invalid MBTI types', () => {
        expect(validateMBTI('XXXX').valid).toBe(false)
        expect(validateMBTI('INT').valid).toBe(false)
        expect(validateMBTI('INTJP').valid).toBe(false)
    })
})

describe('validateBig5Scores', () => {
    it('should validate scores in range', () => {
        const result = validateBig5Scores({ N: 3.5, E: 4.0, O: 2.5 })
        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
    })

    it('should reject scores out of range', () => {
        const result = validateBig5Scores({ N: 150 })
        expect(result.valid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
    })
})

describe('validateDASS21Scores', () => {
    it('should validate scores in range [0, 42]', () => {
        const result = validateDASS21Scores({ D: 14, A: 10, S: 21 })
        expect(result.valid).toBe(true)
    })

    it('should reject scores above 42', () => {
        const result = validateDASS21Scores({ D: 50 })
        expect(result.valid).toBe(false)
    })
})

describe('NormalizationEngine', () => {
    it('should normalize all data types', () => {
        const engine = new NormalizationEngine()
        const result = engine.normalize({
            big5_raw: { N: 3.0, E: 3.5, O: 4.0, A: 3.8, C: 3.2 },
            dass21_raw: { D: 10, A: 8, S: 12 },
            mbti: 'INFP',
        })

        expect(result.big5).toBeDefined()
        expect(result.dass21).toBeDefined()
        expect(result.errors).toHaveLength(0)
    })

    it('should use MBTI priors when Big5 is missing', () => {
        const engine = new NormalizationEngine()
        const result = engine.normalize({
            mbti: 'INTJ',
        })

        expect(result.mbti_priors).toBeDefined()
        expect(result.mbti_priors?._source).toBe('mbti_inferred')
    })

    it('should collect validation errors', () => {
        const engine = new NormalizationEngine()
        const result = engine.normalize({
            dass21_raw: { D: 100, A: -5, S: 50 }, // Invalid scores
        })

        expect(result.errors.length).toBeGreaterThan(0)
    })
})
