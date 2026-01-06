/**
 * Enhanced Intervention Types
 * Shared type definitions for intervention modules
 */

export interface VIAInterventionRecommendation {
    viaStrength: {
        id: string
        name: string
        nameVi: string
        userPercentile: number
    }
    targetDisorder: {
        name: string
        nameVi: string
        effectSize: number
    }
    interventionStrategy: {
        name: string
        nameVi: string
        description: string
        descriptionVi: string
        exercises: string[]
        exercisesVi: string[]
    }
    evidenceSource: string
}

export interface EvidenceBasedTreatment {
    disorder: string
    disorderVi: string
    treatments: Array<{
        name: string
        nameVi: string
        effectSize: number
        evidenceLevel: 'A' | 'B' | 'C'
        recommendation: string
        recommendationVi: string
    }>
    viaBoosts: VIAInterventionRecommendation[]
    transdiagnosticTargets: Array<{
        process: string
        processVi: string
        correlation: number
        interventions: string[]
    }>
}

export interface MBTILearningProfile {
    mbtiType: string
    typeName: string
    typeNameVi: string
    learningStyle: {
        preferredApproach: string
        preferredApproachVi: string
        strengths: string[]
        strengthsVi: string[]
        challenges: string[]
        challengesVi: string[]
    }
    recommendedTechniques: Array<{
        techniqueId: string
        techniqueName: string
        techniqueNameVi: string
        effectSize: number
        compatibilityScore: number
        whyCompatible: string
        whyCompatibleVi: string
    }>
    studyEnvironment: {
        ideal: string
        idealVi: string
        avoid: string
        avoidVi: string
    }
    cognitiveFunction: {
        dominant: string
        auxiliary: string
        implication: string
        implicationVi: string
    }
}

export interface TransdiagnosticRecommendation {
    process: {
        id: string
        name: string
        nameVi: string
        descriptionVi: string
        riskLevel: 'low' | 'moderate' | 'high'
    }
    correlations: {
        depression: number
        anxiety: number
    }
    interventions: Array<{
        name: string
        nameVi: string
        howToApply: string
    }>
    source: string
}

export interface DASSSeverityRecommendation {
    scale: 'depression' | 'anxiety' | 'stress'
    scaleVi: string
    severity: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe'
    severityVi: string
    score: number
    recommendations: string[]
    recommendationsVi: string[]
    referralIndicated: boolean
    referralVi?: string
    urgency: 'routine' | 'priority' | 'urgent' | 'emergency'
    urgencyVi: string
}

export interface FlowStateRecommendation {
    condition: {
        id: string
        name: string
        nameVi: string
    }
    currentStatus: 'blocked' | 'improving' | 'optimal'
    tips: string[]
    tipsVi: string[]
    blockers: string[]
    blockersVi: string[]
}

export interface ExerciseMentalHealthRecommendation {
    condition: string
    conditionVi: string
    effectSize: number
    dosage: string
    dosageVi: string
    mechanism: string
    mechanismVi: string
    source: string
}

export interface ComprehensiveKnowledgeContext {
    transdiagnostic: TransdiagnosticRecommendation[]
    dassSeverity: DASSSeverityRecommendation[]
    viaInterventions: VIAInterventionRecommendation[]
    flowState: FlowStateRecommendation[]
    exerciseEffects: ExerciseMentalHealthRecommendation[]
    mbtiLearning: MBTILearningProfile | null
}

// Common input types
export interface Big5Profile {
    O: number
    C: number
    E: number
    A: number
    N: number
}

export interface DASSProfile {
    D: number
    A: number
    S: number
}
