/**
 * Unit Tests for MISO V3 Meta-Analysis Engine
 * Critical analysis logic must be tested thoroughly
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { runMisoAnalysis, quickAnalyze, fullAnalyze } from '../engine'
import type { UserInputData } from '@/types/miso-v3'

describe('MISO V3 Engine - Data Completeness', () => {
  it('should detect NONE completeness with no data', async () => {
    const userData: UserInputData = {}

    const result = await runMisoAnalysis(userData, 'test-user-1')

    expect(result.completeness.level).toBe('NONE')
    expect(result.summary).toContain('Cần DASS-21')
  })

  it('should detect MINIMAL completeness with only DASS-21', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 10, A: 8, S: 12 },
    }

    const result = await runMisoAnalysis(userData, 'test-user-2')

    expect(result.completeness.level).toBe('MINIMAL')
    expect(result.profile.mode).toBe('LITE')
  })

  it('should detect FULL completeness with Big5 + DASS-21', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 10, A: 8, S: 12 },
      big5_raw: {
        N: 35,
        E: 40,
        O: 30,
        A: 25,
        C: 20,
      },
    }

    const result = await runMisoAnalysis(userData, 'test-user-3')

    expect(result.completeness.level).toBe('FULL')
    expect(result.profile.mode).toBe('FULL')
  })
})

describe('MISO V3 Engine - LITE Mode', () => {
  it('should provide immediate actions for high depression in LITE mode', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 28, A: 10, S: 15 }, // Severe depression
    }

    const result = await runMisoAnalysis(userData, 'test-user-4')

    expect(result.profile.mode).toBe('LITE')
    expect(result.interventions.immediate).toBeDefined()
    expect(result.interventions.immediate!.length).toBeGreaterThan(0)
  })

  it('should provide first aid recommendations for crisis', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 35, A: 25, S: 30 }, // Extremely severe across all
    }

    const result = await runMisoAnalysis(userData, 'test-user-5')

    expect(result.interventions.first_aid).toBeDefined()
    expect(result.interventions.first_aid!.length).toBeGreaterThan(0)
  })

  it('should identify priority concern correctly', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 5, A: 20, S: 8 }, // High anxiety
    }

    const result = await runMisoAnalysis(userData, 'test-user-6')

    if ('priority_concern' in result.profile) {
      expect(result.profile.priority_concern).toBe('anxiety')
    }
  })
})

describe('MISO V3 Engine - FULL Mode', () => {
  it('should calculate BVS and RCS scores with complete data', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 10, A: 8, S: 12 },
      big5_raw: {
        N: 35,
        E: 40,
        O: 30,
        A: 25,
        C: 20,
      },
      via_raw: {
        Hope: 80,
        Zest: 70,
        'Self-Regulation': 60,
      },
    }

    const result = await runMisoAnalysis(userData, 'test-user-7')

    expect(result.scores).toBeDefined()
    expect(result.scores?.BVS).toBeDefined()
    expect(result.scores?.RCS).toBeDefined()
  })

  it('should detect discrepancies between trait and state', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 28, A: 10, S: 12 }, // High depression state
      big5_raw: {
        N: 20, // Low neuroticism trait
        E: 60,
        O: 50,
        A: 50,
        C: 50,
      },
    }

    const result = await runMisoAnalysis(userData, 'test-user-8')

    expect(result.discrepancies.length).toBeGreaterThan(0)
    // Should detect Low-N + High-D discrepancy (situational crisis)
  })

  it('should classify Big5 profile correctly', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 5, A: 5, S: 5 },
      big5_raw: {
        N: 80, // High neuroticism
        E: 30, // Low extraversion
        O: 50,
        A: 50,
        C: 30, // Low conscientiousness
      },
    }

    const result = await runMisoAnalysis(userData, 'test-user-9')

    expect(result.profile).toBeDefined()
    if ('name' in result.profile) {
      expect(result.profile.name).toBeDefined()
      expect(result.profile.risk_level).toBeDefined()
    }
  })
})

describe('MISO V3 Engine - VIA Analysis', () => {
  it('should identify protective factors from high VIA strengths', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 10, A: 8, S: 12 },
      big5_raw: {
        N: 40,
        E: 50,
        O: 50,
        A: 50,
        C: 50,
      },
      via_raw: {
        Hope: 85, // High protective factor
        Zest: 80, // High protective factor
      },
    }

    const result = await runMisoAnalysis(userData, 'test-user-10')

    expect(result.via_analysis).toBeDefined()
    expect(result.via_analysis?.protective_factors.length).toBeGreaterThan(0)
  })

  it('should identify risk factors from low VIA strengths', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 20, A: 15, S: 18 },
      big5_raw: {
        N: 60,
        E: 50,
        O: 50,
        A: 50,
        C: 50,
      },
      via_raw: {
        Hope: 20, // Low risk factor
        Zest: 15, // Low risk factor
      },
    }

    const result = await runMisoAnalysis(userData, 'test-user-11')

    expect(result.via_analysis).toBeDefined()
    expect(result.via_analysis?.risk_factors.length).toBeGreaterThan(0)
  })

  it('should recommend building strengths for low VIA', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 22, A: 12, S: 15 },
      big5_raw: {
        N: 50,
        E: 50,
        O: 50,
        A: 50,
        C: 50,
      },
      via_raw: {
        Hope: 25, // Should recommend building
        Zest: 20, // Should recommend building
      },
    }

    const result = await runMisoAnalysis(userData, 'test-user-12')

    expect(result.via_analysis).toBeDefined()
    expect(result.via_analysis?.build_strengths.length).toBeGreaterThan(0)
  })
})

describe('MISO V3 Engine - Temporal Analysis', () => {
  it('should detect DASS-21 trend improvement', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 10, A: 8, S: 12 },
      big5_raw: {
        N: 50,
        E: 50,
        O: 50,
        A: 50,
        C: 50,
      },
    }

    const history = {
      dass21: [
        {
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          raw_scores: { D: 20, A: 18, S: 22 }, // Higher scores = worse
        },
        {
          timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          raw_scores: { D: 15, A: 12, S: 17 },
        },
      ],
    }

    const result = await runMisoAnalysis(userData, 'test-user-13', history)

    expect(result.temporal.dass21).toBeDefined()
    expect(result.temporal.dass21?.trend).toBe('improving')
  })

  it('should detect DASS-21 trend deterioration', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 25, A: 20, S: 22 }, // Current: worse
    }

    const history = {
      dass21: [
        {
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          raw_scores: { D: 10, A: 8, S: 12 }, // Previous: better
        },
      ],
    }

    const result = await runMisoAnalysis(userData, 'test-user-14', history)

    expect(result.temporal.dass21).toBeDefined()
    expect(result.temporal.dass21?.trend).toBe('worsening')
  })
})

describe('MISO V3 Engine - Intervention Allocation', () => {
  it('should prioritize interventions based on severity', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 30, A: 25, S: 28 }, // All severe
      big5_raw: {
        N: 75,
        E: 30,
        O: 50,
        A: 50,
        C: 25,
      },
    }

    const result = await runMisoAnalysis(userData, 'test-user-15')

    expect(result.interventions.immediate).toBeDefined()
    expect(result.interventions.immediate!.length).toBeGreaterThan(0)

    // First intervention should address most severe issue
    const firstIntervention = result.interventions.immediate![0]
    expect(firstIntervention).toBeDefined()
    expect(firstIntervention.priority).toBe('CRITICAL')
  })

  it('should recommend MBTI-appropriate interventions', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 15, A: 12, S: 14 },
      mbti: 'INTJ',
    }

    const result = await runMisoAnalysis(userData, 'test-user-16')

    expect(result.interventions.immediate).toBeDefined()
    // INTJ should get more analytical/structured interventions
  })
})

describe('Quick Analyze Function', () => {
  it('should work with minimal DASS-21 data', async () => {
    const result = await quickAnalyze(
      { D: 10, A: 8, S: 12 },
      'test-user-quick'
    )

    expect(result.completeness.level).toBe('MINIMAL')
    expect(result.profile.mode).toBe('LITE')
  })
})

describe('Full Analyze Function', () => {
  it('should work with complete data', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 10, A: 8, S: 12 },
      big5_raw: {
        N: 50,
        E: 50,
        O: 50,
        A: 50,
        C: 50,
      },
      via_raw: {
        Hope: 60,
        Zest: 65,
      },
      mbti: 'ENFP',
    }

    const result = await fullAnalyze(userData, 'test-user-full')

    expect(result.completeness.level).toBe('FULL')
    expect(result.profile.mode).toBe('FULL')
    expect(result.scores).toBeDefined()
  })
})

describe('Edge Cases and Boundary Conditions', () => {
  it('should handle extreme DASS-21 scores', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 42, A: 42, S: 42 }, // Maximum possible
    }

    const result = await runMisoAnalysis(userData, 'test-user-extreme')

    expect(result.interventions.first_aid).toBeDefined()
    expect(result.interventions.first_aid!.length).toBeGreaterThan(0)
  })

  it('should handle zero DASS-21 scores', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 0, A: 0, S: 0 }, // Perfect mental health
    }

    const result = await runMisoAnalysis(userData, 'test-user-zero')

    expect(result.completeness.level).toBe('MINIMAL')
    // Should not trigger any crisis interventions
    if (result.interventions.first_aid) {
      expect(result.interventions.first_aid.length).toBe(0)
    }
  })

  it('should generate valid summary string', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 10, A: 8, S: 12 },
      big5_raw: {
        N: 50,
        E: 50,
        O: 50,
        A: 50,
        C: 50,
      },
    }

    const result = await runMisoAnalysis(userData, 'test-user-summary')

    expect(result.summary).toBeDefined()
    expect(typeof result.summary).toBe('string')
    expect(result.summary.length).toBeGreaterThan(0)
  })

  it('should include version and timestamp in result', async () => {
    const userData: UserInputData = {
      dass21_raw: { D: 10, A: 8, S: 12 },
    }

    const result = await runMisoAnalysis(userData, 'test-user-meta')

    expect(result.version).toBe('3.0')
    expect(result.timestamp).toBeDefined()
    expect(result.user_id).toBe('test-user-meta')
  })
})
