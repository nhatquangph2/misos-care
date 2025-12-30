import {
    Big5Percentiles,
    Intervention,
    DASS21RawScores,
    VIAPercentiles,
} from '@/types/miso-v3'

// ============================================
// TYPES
// ============================================

export interface ScientificScore {
    zpd_capacity: number // 0-100
    zpd_level: 1 | 2 | 3
    sdt_needs: {
        autonomy: number // 0-100 (100 = fully satisfied)
        competence: number
        relatedness: number
    }
}

// ============================================
// ZONE OF PROXIMAL DEVELOPMENT (ZPD)
// ============================================

/**
 * Calculate user's "Capacity for Change" based on distress and personality.
 * Determines the complexity level of interventions they can handle.
 */
export function calculateZPD(
    dass: DASS21RawScores,
    big5: Partial<Big5Percentiles>
): { capacity: number; level: 1 | 2 | 3 } {
    let capacity = 100

    // 1. Distress Penalty (Higher DASS = Lower Capacity)
    // Max DASS score per scale is 42. Total potential ~126.
    const totalDistress = (dass.D + dass.A + dass.S)

    if (totalDistress > 90) ctx_penalty = 50 // Crisis
    else if (totalDistress > 60) ctx_penalty = 30 // Severe
    else if (totalDistress > 30) ctx_penalty = 15 // Moderate
    else ctx_penalty = 0

    capacity -= ctx_penalty

    // 2. Personality Adjustments
    // Neuroticism drains capacity
    if (big5.N && big5.N > 70) capacity -= 10
    if (big5.N && big5.N > 90) capacity -= 10

    // Conscientiousness adds capacity (executive function)
    if (big5.C && big5.C > 60) capacity += 10
    if (big5.C && big5.C < 30) capacity -= 10

    // Clamp 0-100
    capacity = Math.max(0, Math.min(100, capacity))

    // Determine Level
    // Level 1: Low Capacity (Need Scaffolding) - < 40
    // Level 2: Medium Capacity (Balanced) - 40-75
    // Level 3: High Capacity (Autonomous Growth) - > 75
    let level: 1 | 2 | 3 = 2
    if (capacity < 40) level = 1
    if (capacity > 75) level = 3

    return { capacity, level }
}

let ctx_penalty = 0 // Helper

// ============================================
// SELF-DETERMINATION THEORY (SDT)
// ============================================

/**
 * Infer SDT Needs Satisfaction from Personality and Strengths.
 * Represents how "satisfied" these needs likely are.
 * Lower score = Thwarted need = Higher priority for intervention.
 */
export function assessSDTNeeds(
    big5: Partial<Big5Percentiles>,
    via: Partial<VIAPercentiles>
): { autonomy: number; competence: number; relatedness: number } {
    // Defaults assume average satisfaction (50)
    const needs = {
        autonomy: 50,
        competence: 50,
        relatedness: 50,
    }

    // --- AUTONOMY (Volition, Choice) ---
    // High Openness (+), High Neuroticism (-)
    if (big5.O) needs.autonomy += (big5.O - 50) * 0.3
    if (big5.N) needs.autonomy -= (big5.N - 50) * 0.3
    // VIA: Creativity, Curiosity
    if (via.Creativity) needs.autonomy += (via.Creativity - 50) * 0.2

    // --- COMPETENCE (Mastery, Efficacy) ---
    // High Conscientiousness (+), High Neuroticism (-)
    if (big5.C) needs.competence += (big5.C - 50) * 0.5
    if (big5.N) needs.competence -= (big5.N - 50) * 0.2
    // VIA: Perseverance, Perspective
    if (via.Perseverance) needs.competence += (via.Perseverance - 50) * 0.3

    // --- RELATEDNESS (Connection, Belonging) ---
    // High Extraversion (+), High Agreeableness (+)
    if (big5.E) needs.relatedness += (big5.E - 50) * 0.4
    if (big5.A) needs.relatedness += (big5.A - 50) * 0.4
    // VIA: Love, Kindness, Teamwork
    if (via.Love) needs.relatedness += (via.Love - 50) * 0.3
    if (via.Kindness) needs.relatedness += (via.Kindness - 50) * 0.2

    // Clamp 0-100
    needs.autonomy = Math.max(0, Math.min(100, Math.round(needs.autonomy)))
    needs.competence = Math.max(0, Math.min(100, Math.round(needs.competence)))
    needs.relatedness = Math.max(0, Math.min(100, Math.round(needs.relatedness)))

    return needs
}

// ============================================
// SCORING HELPERS
// ============================================

/**
 * Calculate boost for an intervention based on SDT targeting.
 * If intervention targets a LOW satisfaction need, it gets a high boost.
 */
export function getSDTBoost(
    intervention: Intervention,
    needs: { autonomy: number; competence: number; relatedness: number }
): number {
    if (!intervention.details?.sdt_targets) return 0

    let boost = 0
    const THRESHOLD = 40 // Needs below this are considered "Thwarted"

    if (intervention.details.sdt_targets.includes('autonomy')) {
        if (needs.autonomy < THRESHOLD) boost += 15
        else if (needs.autonomy < 60) boost += 5
    }

    if (intervention.details.sdt_targets.includes('competence')) {
        if (needs.competence < THRESHOLD) boost += 15
        else if (needs.competence < 60) boost += 5
    }

    if (intervention.details.sdt_targets.includes('relatedness')) {
        if (needs.relatedness < THRESHOLD) boost += 15
        else if (needs.relatedness < 60) boost += 5
    }

    return boost
}

/**
 * Calculate penalty if intervention is too complex for user's ZPD.
 */
export function getZPDPenalty(
    intervention: Intervention,
    userZPDLevel: 1 | 2 | 3
): number {
    const complexity = intervention.details?.zpd_complexity || 2 // Default to 2

    // If user is Level 1 (Crisis/Low Capacity) and Intervention is Level 3 (Abstract)
    if (userZPDLevel === 1 && complexity === 3) return -50 // Heavy penalty, almost disqualify

    // If user is Level 1 and Intervention is Level 2
    if (userZPDLevel === 1 && complexity === 2) return -10 // Slight penalty

    // If user is Level 2 and Intervention is Level 3
    if (userZPDLevel === 2 && complexity === 3) return 0 // Challenging but okay

    // If user is Level 3, no penalties for complexity (they can do anything)
    return 0
}
