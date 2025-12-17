/**
 * MISO V3 - Main Export
 * Central export point for all MISO V3 modules
 */

// Main Engine
export { runMisoAnalysis, quickAnalyze, fullAnalyze } from './engine'

// Normalization
export {
  NormalizationEngine,
  rawToZScore,
  zScoreToPercentile,
  rawToPercentile,
  normalizeBig5,
  normalizeDASS21,
  normalizeVIA,
  mbtiToBig5Priors,
  getMBTIRiskProfile,
} from './normalization'

// Scoring
export {
  calculateBVS,
  calculateRCS,
  predictDASS,
  calculateDelta,
  calculateAllDeltas,
  calculateControlComposite,
  calculateAllScores,
} from './scoring'

// Classification
export {
  classifyBig5Profile,
  getProfileById,
  getProfileDescription,
  isHighRiskProfile,
  getAllProfiles,
} from './classifier'

// Discrepancy
export {
  detectDiscrepancies,
  prioritizeDiscrepancies,
  getHighestPriorityDiscrepancy,
  hasCriticalDiscrepancy,
} from './discrepancy'

// Interventions
export { allocateInterventions, formatInterventionPlan, INTERVENTION_LIBRARY } from './interventions'

// Temporal
export {
  analyzeDASSTrend,
  analyzeBig5Stability,
  getTrajectory,
  recommendRetestDays,
  generateProgressSummary,
} from './temporal'

// Lite Mode
export { analyzeDASS21Only, assessDataCompleteness } from './lite-mode'

// Constants
export * from './constants'

// Types (re-export from types file)
export type {
  UserInputData,
  MisoAnalysisResult,
  Big5Percentiles,
  DASS21RawScores,
  VIAPercentiles,
  Big5ProfileData,
  Discrepancy,
  InterventionPlan,
  DASSTemporalAnalysis,
  Big5StabilityCheck,
  LiteModeAnalysis,
} from '@/types/miso-v3'
