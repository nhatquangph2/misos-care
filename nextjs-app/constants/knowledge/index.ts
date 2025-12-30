/**
 * MISO Care Knowledge Base
 * Professor-Level Academic Research Integration
 * 
 * This module exports all knowledge domains for use in MISO analysis,
 * AI consultation, and personalized recommendations.
 */

// ============================================
// ASSESSMENT TOOLS
// ============================================

// DASS-21 (Depression, Anxiety, Stress Scales)
export * from './dass21-knowledge'

// VIA Character Strengths (24 Strengths, 6 Virtues)
export * from './via-knowledge'

// MBTI (16 Types, 4 Dimensions)
export * from './mbti-knowledge'

// Big Five / BFI-2 (5 Domains, 15 Facets)
export * from './big5-knowledge'

// ============================================
// APPLIED DOMAINS
// ============================================

// Career Guidance (Holland RIASEC, O*NET, Career Development)
export * from './career-holland'

// Clinical Psychology (DSM-5, ICD-11, HiTOP, Transdiagnostic)
export * from './clinical-psychology'

// Learning Sciences (Cognitive Load, Spaced Repetition, Self-Regulated Learning)
export * from './learning-sciences'

// Sports Psychology (Mental Toughness, Flow, Exercise-Mental Health)
export * from './sports-psychology'

// ============================================
// KNOWLEDGE BASE METADATA
// ============================================

export const KNOWLEDGE_BASE_METADATA = {
    version: '1.0.0',
    lastUpdated: '2025-12-30',
    domains: [
        {
            id: 'career',
            name: 'Career Guidance',
            nameVi: 'Hướng nghiệp',
            sources: [
                'Holland (1997) - RIASEC Theory',
                'Larson et al. (2002) - Big5-RIASEC Meta-analysis',
                'O*NET Database (U.S. Department of Labor)',
                'Super (1990) - Career Development Theory',
                'Savickas (2005) - Career Adaptability'
            ],
            componentCount: {
                hollandTypes: 6,
                careers: 20,
                correlationMappings: 30
            }
        },
        {
            id: 'clinical',
            name: 'Clinical Psychology',
            nameVi: 'Tâm lý Lâm sàng',
            sources: [
                'Kotov et al. (2010) - Big5-Psychopathology Meta-analysis (GOLD STANDARD)',
                'DSM-5 (APA, 2013)',
                'ICD-11 (WHO, 2019)',
                'HiTOP Consortium (Kotov et al., 2017)',
                'Aldao et al. (2010) - Emotion Regulation Meta-analysis'
            ],
            componentCount: {
                disorders: 8,
                transdiagnosticProcesses: 7,
                treatmentEffectSizes: 40
            }
        },
        {
            id: 'learning',
            name: 'Learning Sciences',
            nameVi: 'Khoa học Học tập',
            sources: [
                'Dunlosky et al. (2013) - Learning Techniques Review (GOLD STANDARD)',
                'Sweller et al. (2019) - Cognitive Load Theory',
                'Zimmerman (2002) - Self-Regulated Learning',
                'Cepeda et al. (2006) - Spaced Practice Meta-analysis',
                'Roediger & Karpicke (2006) - Testing Effect'
            ],
            componentCount: {
                learningTechniques: 8,
                cognitiveLoadPrinciples: 8,
                selfRegulatedLearningPhases: 3
            }
        },
        {
            id: 'sports',
            name: 'Sports Psychology',
            nameVi: 'Tâm lý Thể thao',
            sources: [
                'Jones et al. (2002) - Mental Toughness 4Cs',
                'Horsburgh et al. (2009) - MT-Big5 Correlations',
                'Csikszentmihalyi (1990) - Flow Theory',
                'Schuch et al. (2016) - Exercise-Depression Meta-analysis',
                'Stubbs et al. (2017) - Exercise-Anxiety Meta-analysis'
            ],
            componentCount: {
                mentalToughnessDimensions: 4,
                flowConditions: 6,
                sportRecommendations: 6,
                exerciseEffects: 6
            }
        }
    ],
    totalCitations: 100,
    evidenceLevels: {
        A: 'Strong evidence (multiple meta-analyses, large RCTs)',
        B: 'Moderate evidence (single meta-analysis, multiple RCTs)',
        C: 'Preliminary evidence (limited studies, case series)'
    }
}

// ============================================
// UNIFIED KNOWLEDGE QUERY FUNCTIONS
// ============================================

import { HOLLAND_TYPES, CAREER_DATABASE, calculateHollandFromBig5, findMatchingCareers } from './career-holland'
import { BIG5_DISORDER_MAPPINGS, TRANSDIAGNOSTIC_PROCESSES, screenDisordersFromBig5 } from './clinical-psychology'
import { LEARNING_TECHNIQUES, getRecommendedLearningTechniques, getStudyAdvice } from './learning-sciences'
import { MENTAL_TOUGHNESS_DIMENSIONS, SPORT_RECOMMENDATIONS, getMentalToughnessProfile, getRecommendedSports } from './sports-psychology'

export interface Big5Profile {
    O: number  // 0-100 percentile
    C: number
    E: number
    A: number
    N: number
}

import { VIAAnalysis } from '@/types/miso-v3'

/**
 * Get comprehensive personalized recommendations across all domains
 */
export function getComprehensiveRecommendations(
    big5: Big5Profile,
    mbti?: string,
    via?: VIAAnalysis
) {
    return {
        career: {
            hollandCode: calculateHollandFromBig5(big5),
            matchingCareers: findMatchingCareers(
                calculateHollandFromBig5(big5).code,
                big5,
                { limit: 5 }
            )
        },
        mentalHealth: {
            riskScreening: screenDisordersFromBig5(big5),
            transdiagnosticRisks: TRANSDIAGNOSTIC_PROCESSES.filter(p => {
                // High rumination risk if high N
                if (p.id === 'rumination' && big5.N > 70) return true
                // High avoidance risk if high N + low E
                if (p.id === 'avoidance' && big5.N > 70 && big5.E < 40) return true
                return false
            })
        },
        learning: {
            recommendedTechniques: getRecommendedLearningTechniques(big5).slice(0, 5),
            personalizedAdvice: getStudyAdvice(big5)
        },
        sports: {
            mentalToughnessProfile: getMentalToughnessProfile(big5),
            recommendedSports: getRecommendedSports(big5).slice(0, 5)
        }
    }
}

/**
 * Get effect size for a specific intervention
 */
export function getEvidenceForIntervention(intervention: string): {
    effectSize?: number
    source?: string
    evidenceLevel?: 'A' | 'B' | 'C'
} | null {
    // Search across domains
    const learningTechnique = LEARNING_TECHNIQUES.find(t =>
        t.id === intervention || t.name.toLowerCase().includes(intervention.toLowerCase())
    )

    if (learningTechnique) {
        return {
            effectSize: learningTechnique.effectSize,
            source: learningTechnique.effectSizeSource,
            evidenceLevel: learningTechnique.effectivenessLevel === 'high' ? 'A' :
                learningTechnique.effectivenessLevel === 'moderate' ? 'B' : 'C'
        }
    }

    return null
}
