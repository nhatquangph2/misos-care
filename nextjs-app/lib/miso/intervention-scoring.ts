/**
 * MISO V3 Deep Integration - Phase 2: Smart Intervention Scoring
 * Enhanced intervention metadata and multi-dimensional scoring
 */

import type { ActiveMechanism, ActiveCompensation } from './mechanisms'
import { VIA_STRENGTH_DETAILS } from '@/constants/tests/via-questions'

// ============================================
// ENHANCED INTERVENTION METADATA
// ============================================

export interface InterventionMetadata {
    type: string
    category: 'immediate' | 'short_term' | 'long_term'
    name: string
    description: string
    evidence_level: 'A' | 'B' | 'C'
    effect_size?: number

    // Phase 2: Deep Integration metadata
    energy_required: 'low' | 'medium' | 'high'
    time_commitment: '5min' | '15min' | '30min' | 'daily' | 'weekly'

    mbti_affinity?: string[] // Which MBTI types benefit most
    via_amplifiers?: string[] // Which VIA strengths boost effectiveness

    targets_mechanisms?: string[] // Which Big5→DASS mechanisms this addresses
    contraindications?: string[] // When NOT to use this

    // Existing fields
    when?: string[]
    steps?: string[]
    resources?: string[]
    sources?: string[]
}

export const ENHANCED_INTERVENTIONS: Record<string, InterventionMetadata> = {
    // IMMEDIATE
    safety_screening: {
        type: 'safety_screening',
        category: 'immediate',
        name: 'Sàng lọc nguy cơ tự hại',
        description: 'Đánh giá nguy cơ tự hại và kế hoạch an toàn',
        evidence_level: 'A',
        energy_required: 'low',
        time_commitment: '15min',
        contraindications: [],
    },

    grounding: {
        type: 'grounding',
        category: 'immediate',
        name: 'Kỹ thuật grounding 5-4-3-2-1',
        description: '5 thứ nhìn, 4 nghe, 3 cảm nhận, 2 ngửi, 1 nếm',
        evidence_level: 'B',
        effect_size: 0.5,
        energy_required: 'low',
        time_commitment: '5min',
        when: ['High_Anxiety', 'Panic'],
        mbti_affinity: ['ISFJ', 'ISTJ', 'ESFJ', 'ESTJ'], // Sensing types excel at present-focus
        via_amplifiers: ['Self-Regulation', 'Mindfulness'],
        targets_mechanisms: ['High_N'],
    },

    breathing_4_7_8: {
        type: 'breathing_4_7_8',
        category: 'immediate',
        name: 'Thở 4-7-8',
        description: 'Hít vào 4s, giữ 7s, thở ra 8s',
        evidence_level: 'B',
        effect_size: 0.6,
        energy_required: 'low',
        time_commitment: '5min',
        mbti_affinity: ['INTJ', 'INTP', 'ENTJ', 'ENTP'], // Thinking types like structured approaches
        via_amplifiers: ['Self-Regulation'],
        targets_mechanisms: ['High_N'],
    },

    // SHORT-TERM
    behavioral_activation: {
        type: 'behavioral_activation',
        category: 'short_term',
        name: 'Kích hoạt hành vi',
        description: 'Lên lịch hoạt động thú vị bất kể động lực',
        evidence_level: 'A',
        effect_size: 0.78,
        energy_required: 'medium',
        time_commitment: 'daily',
        when: ['Depression', 'Low_Zest'],
        mbti_affinity: ['ESFP', 'ESTP', 'ENFP', 'ENTP'], // Extraverted types
        via_amplifiers: ['Creativity', 'Zest', 'Perseverance'],
        targets_mechanisms: ['High_N', 'Low_E'],
        contraindications: ['severe_depression_D>25'], // Too demanding if very severe
        steps: [
            'Liệt kê 10 hoạt động từng thích',
            'Chọn 3 hoạt động dễ nhất',
            'Lên lịch cụ thể (ngày, giờ)',
            'Làm bất kể cảm giác như thế nào',
        ],
    },

    micro_habits: {
        type: 'micro_habits',
        category: 'short_term',
        name: 'Thói quen nhỏ (Micro-habits)',
        description: 'Xây dựng thói quen nhỏ (1-2 phút/ngày)',
        evidence_level: 'C',
        energy_required: 'low',
        time_commitment: '5min',
        when: ['Low_C', 'Low_SelfReg'],
        mbti_affinity: ['INFP', 'INTP', 'ISFP', 'ISTP'], // Perceiving types struggle with structure
        via_amplifiers: ['Perseverance', 'Self-Regulation'],
        targets_mechanisms: ['Low_C'],
    },

    sleep_hygiene: {
        type: 'sleep_hygiene',
        category: 'short_term',
        name: 'Vệ sinh giấc ngủ (Sleep Hygiene)',
        description: 'Cải thiện chất lượng giấc ngủ',
        evidence_level: 'A',
        effect_size: 0.45,
        energy_required: 'low',
        time_commitment: 'daily',
        mbti_affinity: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'], // J types like routines
        via_amplifiers: ['Self-Regulation', 'Prudence'],
        targets_mechanisms: ['High_N', 'Low_C'],
    },

    social_connection: {
        type: 'social_connection',
        category: 'short_term',
        name: 'Kết nối xã hội (Social Connection)',
        description: 'Kết nối xã hội nhẹ nhàng, không áp lực',
        evidence_level: 'B',
        energy_required: 'medium',
        time_commitment: '15min',
        when: ['Low_E', 'Depression'],
        mbti_affinity: ['ENFJ', 'ESFJ', 'ENFP', 'ESFP'], // Fe/Fi dom extraverts
        via_amplifiers: ['Social Intelligence', 'Love', 'Kindness'],
        targets_mechanisms: ['Low_E'],
    },

    boundary_setting: {
        type: 'boundary_setting',
        category: 'short_term',
        name: 'Boundary Setting',
        description: 'Đặt ranh giới rõ ràng',
        evidence_level: 'C',
        energy_required: 'medium',
        time_commitment: 'weekly',
        when: ['INFJ', 'INFP', 'Burnout'],
        mbti_affinity: ['INFJ', 'INFP', 'ISFJ', 'ISFP'], // Fe/Fi prone to over-giving
        via_amplifiers: ['Bravery', 'Honesty', 'Self-Regulation'],
        targets_mechanisms: ['High_A'], // High Agreeableness can struggle with boundaries
    },

    // LONG-TERM
    hope_therapy: {
        type: 'hope_therapy',
        category: 'long_term',
        name: 'Liệu pháp Hy vọng (Hope Therapy)',
        description: 'Xây dựng lại hy vọng',
        evidence_level: 'B',
        effect_size: 0.48,
        energy_required: 'medium',
        time_commitment: 'weekly',
        when: ['Low_Hope', 'Depression'],
        mbti_affinity: ['ENFP', 'INFP', 'ENFJ', 'INFJ'], // NFs resonate with meaning-making
        via_amplifiers: ['Hope', 'Perspective', 'Zest'],
        targets_mechanisms: ['High_N', 'Low_E'],
    },

    mindfulness: {
        type: 'mindfulness',
        category: 'long_term',
        name: 'Chánh niệm (Mindfulness)',
        description: 'Thiền chánh niệm',
        evidence_level: 'A',
        effect_size: 0.63,
        energy_required: 'low',
        time_commitment: 'daily',
        when: ['High_N', 'Rumination'],
        mbti_affinity: ['INFJ', 'INFP', 'INTJ', 'INTP'], // Introverts
        via_amplifiers: ['Self-Regulation', 'Appreciation of Beauty', 'Spirituality'],
        targets_mechanisms: ['High_N'],
    },

    gratitude_practice: {
        type: 'gratitude_practice',
        category: 'long_term',
        name: 'Thực hành Biết ơn (Gratitude)',
        description: '3 điều biết ơn mỗi ngày',
        evidence_level: 'A',
        effect_size: 0.35,
        energy_required: 'low',
        time_commitment: '5min',
        mbti_affinity: ['ISFJ', 'ESFJ', 'INFJ', 'ENFJ'], // Feeling types
        via_amplifiers: ['Gratitude', 'Appreciation of Beauty', 'Love'],
        targets_mechanisms: ['High_N'],
    },

    acceptance_commitment: {
        type: 'acceptance_commitment',
        category: 'long_term',
        name: 'Liệu pháp Chấp nhận & Cam kết (ACT)',
        description: 'Chấp nhận và hành động theo giá trị',
        evidence_level: 'A',
        effect_size: 0.70,
        energy_required: 'high',
        time_commitment: 'weekly',
        when: ['Rigid_Neurotic', 'Avoidance'],
        mbti_affinity: ['INFP', 'ISFP', 'ENFP', 'ESFP'], // Value-driven types
        via_amplifiers: ['Bravery', 'Honesty', 'Perspective'],
        targets_mechanisms: ['High_N', 'Low_A'],
    },
}

// ============================================
// 6-DIMENSIONAL SCORING FUNCTION
// ============================================

export interface ScoringContext {
    big5: {
        N: number
        E: number
        O: number
        A: number
        C: number
    }
    via_percentiles: Record<string, number>
    mbti: string
    dass_raw: { D: number; A: number; S: number }
    mechanisms: {
        active: ActiveMechanism[]
        compensations: ActiveCompensation[]
    }
    via_signature_strengths: Array<{ strength: string; percentile: number }>
}

export interface ScoredIntervention {
    intervention: InterventionMetadata
    score: number
    reasoning: string[]
    rank: number
}

/**
 * Score intervention across 6 dimensions
 */
export function scoreIntervention(
    intervention: InterventionMetadata,
    context: ScoringContext
): ScoredIntervention {
    let score = 0
    const reasoning: string[] = []

    // 1. Evidence Base (30%)
    const evidenceScores = { A: 1.0, B: 0.7, C: 0.4 }
    const evidenceScore = evidenceScores[intervention.evidence_level] * 0.3
    score += evidenceScore
    reasoning.push(`Bằng chứng cấp ${intervention.evidence_level}: +${(evidenceScore * 100).toFixed(0)}%`)

    // 2. Mechanism Targeting (25%)
    if (intervention.targets_mechanisms) {
        for (const mechanism of context.mechanisms.active) {
            if (intervention.targets_mechanisms.includes(mechanism.id)) {
                const boost = 0.08 * mechanism.strength
                score += boost
                reasoning.push(`Nhắm vào cơ chế ${mechanism.id}: +${(boost * 100).toFixed(0)}%`)
            }
        }
    }

    // 3. VIA Amplification (20%)
    if (intervention.via_amplifiers) {
        for (const amplifier of intervention.via_amplifiers) {
            const strengthData = context.via_signature_strengths.find(
                (s) => s.strength.toLowerCase().replace(/_/g, ' ') === amplifier.toLowerCase().replace(/_/g, ' ')
            )
            if (strengthData && strengthData.percentile > 70) {
                const amplification = 0.05 + (strengthData.percentile / 100) * 0.15
                score += amplification
                const normKey = amplifier.toLowerCase().replace(/-/g, '_').replace(/ /g, '_')
                const info = VIA_STRENGTH_DETAILS[normKey]
                const displayName = info?.title || amplifier
                reasoning.push(`Điểm mạnh ${displayName} giúp tăng hiệu quả: +${(amplification * 100).toFixed(0)}%`)
            }
        }
    }

    // 4. MBTI Affinity (15%)
    if (intervention.mbti_affinity?.includes(context.mbti)) {
        score += 0.15
        reasoning.push(`Phù hợp với phong cách nhận thức ${context.mbti}: +15%`)
    }

    // 5. Severity Feasibility (10%)
    const maxSeverity = Math.max(context.dass_raw.D, context.dass_raw.A, context.dass_raw.S)
    if (maxSeverity >= 21) {
        // SEVERE
        if (intervention.energy_required === 'low' && intervention.time_commitment === '5min') {
            score += 0.10
            reasoning.push(`Yêu cầu năng lượng thấp phù hợp với tình trạng hiện tại: +10%`)
        } else if (intervention.energy_required === 'high') {
            score -= 0.15
            reasoning.push(`Quá sức so với tình trạng hiện tại: -15%`)
        }
    } else if (maxSeverity <= 7) {
        // MILD - can handle more demanding interventions
        if (intervention.energy_required === 'high') {
            score += 0.05
            reasoning.push(`Có thể thực hiện các bài tập yêu cầu năng lượng cao hơn: +5%`)
        }
    }

    // 6. Compensation Enhancement (bonus, up to +10%)
    for (const comp of context.mechanisms.compensations) {
        if (intervention.via_amplifiers?.includes(comp.strength)) {
            score += 0.05
            reasoning.push(`Dựa trên yếu tố bảo vệ ${comp.strength}: +5%`)
        }
    }

    // Contraindications check
    if (intervention.contraindications) {
        for (const contra of intervention.contraindications) {
            if (contra.includes('severe_depression') && context.dass_raw.D > 25) {
                score -= 0.3
                reasoning.push(`⚠️ Chống chỉ định cho trầm cảm nặng: -30%`)
            }
        }
    }

    return {
        intervention,
        score: Math.max(0, Math.min(score, 1.0)), // Cap between 0-1
        reasoning,
        rank: 0, // Will be set after sorting
    }
}

/**
 * Score all interventions and return ranked list
 */
export function scoreAllInterventions(
    context: ScoringContext
): ScoredIntervention[] {
    const scored = Object.values(ENHANCED_INTERVENTIONS).map((intervention) =>
        scoreIntervention(intervention, context)
    )

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score)

    // Assign ranks
    scored.forEach((item, index) => {
        item.rank = index + 1
    })

    return scored
}
