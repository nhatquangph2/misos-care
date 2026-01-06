/**
 * Enhanced Intervention Service - Modular Export
 * Re-exports all intervention modules from a single entry point
 *
 * This file maintains backward compatibility while using the new modular structure.
 * The original enhanced-intervention.service.ts (1,258 lines) has been split into:
 * - types.ts: Shared type definitions
 * - via-intervention.ts: VIA-DASS compensation matching
 * - mbti-learning.ts: MBTI learning style profiles
 * - (transdiagnostic, dass-severity, flow-state, exercise modules can be added)
 */

// Re-export types
export type {
    VIAInterventionRecommendation,
    EvidenceBasedTreatment,
    MBTILearningProfile,
    TransdiagnosticRecommendation,
    DASSSeverityRecommendation,
    FlowStateRecommendation,
    ExerciseMentalHealthRecommendation,
    ComprehensiveKnowledgeContext,
    Big5Profile,
    DASSProfile,
} from './types'

// Re-export VIA intervention functions
export {
    getVIAInterventionRecommendations,
    getFullVIAInterventionRecommendations,
} from './via-intervention'

// Re-export MBTI learning functions
export {
    getMBTILearningProfile,
} from './mbti-learning'

// Note: The following functions remain in the original file for now
// and can be migrated to separate modules as needed:
// - getEvidenceBasedTreatments
// - getTransdiagnosticRecommendations
// - getDASSSeverityRecommendations
// - getFlowStateRecommendations
// - getExerciseMentalHealthEffects
// - buildComprehensiveAIContext
