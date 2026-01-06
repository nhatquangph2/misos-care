/**
 * VIA-DASS Intervention Module
 * Matches VIA character strengths to DASS symptoms for personalized interventions
 * 
 * SOURCES:
 * - Park et al. (2004) DOI: 10.1521/jscp.23.5.603.50748
 * - Seligman et al. (2005) DOI: 10.1037/0003-066X.60.5.410
 */

import { VIA_STRENGTHS } from '@/constants/knowledge/via-knowledge'
import type { VIAInterventionRecommendation, DASSProfile } from './types'

// VIA-DASS Compensation Mapping
const VIA_DASS_COMPENSATION_MAP: Record<string, {
    targetSymptoms: string[]
    compensationMechanism: string
    compensationMechanismVi: string
    effectivenessRating: number
}> = {
    hope: {
        targetSymptoms: ['Depression', 'Hopelessness', 'Suicidal ideation'],
        compensationMechanism: 'Future orientation counteracts despair; goal-setting activates motivation pathways',
        compensationMechanismVi: 'Định hướng tương lai chống lại tuyệt vọng; đặt mục tiêu kích hoạt động lực',
        effectivenessRating: 5
    },
    zest: {
        targetSymptoms: ['Depression', 'Fatigue', 'Anhedonia'],
        compensationMechanism: 'Energy and enthusiasm directly combat lethargy and loss of interest',
        compensationMechanismVi: 'Năng lượng và nhiệt huyết trực tiếp chống lại sự uể oải và mất hứng thú',
        effectivenessRating: 5
    },
    gratitude: {
        targetSymptoms: ['Depression', 'Negative thinking', 'Rumination'],
        compensationMechanism: 'Shifts attention from deficits to positives; interrupts rumination cycles',
        compensationMechanismVi: 'Chuyển sự chú ý từ thiếu sót sang tích cực; ngắt chu kỳ suy nghĩ tiêu cực',
        effectivenessRating: 5
    },
    self_regulation: {
        targetSymptoms: ['Anxiety', 'Impulsivity', 'Stress reactivity'],
        compensationMechanism: 'Executive control reduces emotional reactivity; enables coping implementation',
        compensationMechanismVi: 'Kiểm soát điều hành giảm phản ứng cảm xúc; cho phép thực hiện đối phó',
        effectivenessRating: 4
    },
    love: {
        targetSymptoms: ['Depression', 'Social isolation', 'Loneliness'],
        compensationMechanism: 'Social connection buffers against isolation; oxytocin release improves mood',
        compensationMechanismVi: 'Kết nối xã hội bảo vệ chống cô lập; giải phóng oxytocin cải thiện tâm trạng',
        effectivenessRating: 4
    },
    curiosity: {
        targetSymptoms: ['Depression', 'Anhedonia', 'Boredom'],
        compensationMechanism: 'Interest generation combats emotional flatness; novelty-seeking activates reward',
        compensationMechanismVi: 'Tạo hứng thú chống lại cảm xúc phẳng; tìm kiếm mới kích hoạt phần thưởng',
        effectivenessRating: 4
    },
    perseverance: {
        targetSymptoms: ['Depression', 'Learned helplessness', 'Giving up'],
        compensationMechanism: 'Persistence counters learned helplessness; goal pursuit maintains motivation',
        compensationMechanismVi: 'Kiên trì chống lại sự bất lực học được; theo đuổi mục tiêu duy trì động lực',
        effectivenessRating: 4
    },
    humor: {
        targetSymptoms: ['Depression', 'Stress', 'Pessimism'],
        compensationMechanism: 'Cognitive reframing through humor; social bonding and stress relief',
        compensationMechanismVi: 'Đổi góc nhìn qua hài hước; gắn kết xã hội và giảm stress',
        effectivenessRating: 3
    },
    bravery: {
        targetSymptoms: ['Anxiety', 'Avoidance', 'Phobias'],
        compensationMechanism: 'Approach behavior counters avoidance; fear extinction through exposure',
        compensationMechanismVi: 'Hành vi tiếp cận chống tránh né; dập tắt sợ hãi qua tiếp xúc',
        effectivenessRating: 4
    },
    social_intelligence: {
        targetSymptoms: ['Social anxiety', 'Interpersonal difficulties'],
        compensationMechanism: 'Social skills reduce interpersonal anxiety; accurate reading reduces uncertainty',
        compensationMechanismVi: 'Kỹ năng xã hội giảm lo âu giữa các cá nhân; đọc chính xác giảm bất định',
        effectivenessRating: 3
    },
    // Expanded VIA strengths
    creativity: {
        targetSymptoms: ['Depression', 'Anhedonia', 'Rigid thinking'],
        compensationMechanism: 'Novel solutions break cognitive rigidity; creative expression provides meaning',
        compensationMechanismVi: 'Giải pháp mới phá vỡ tư duy cứng nhắc; thể hiện sáng tạo tạo ý nghĩa',
        effectivenessRating: 3
    },
    judgment: {
        targetSymptoms: ['Anxiety', 'Catastrophizing', 'Cognitive distortions'],
        compensationMechanism: 'Critical thinking challenges irrational beliefs; balanced evaluation reduces worry',
        compensationMechanismVi: 'Tư duy phản biện thách thức niềm tin phi lý; đánh giá cân bằng giảm lo lắng',
        effectivenessRating: 4
    },
    love_of_learning: {
        targetSymptoms: ['Depression', 'Stagnation', 'Loss of purpose'],
        compensationMechanism: 'Learning provides purpose and growth; mastery experiences boost self-efficacy',
        compensationMechanismVi: 'Học hỏi tạo mục đích và tăng trưởng; trải nghiệm thành thạo tăng tự tin',
        effectivenessRating: 3
    },
    perspective: {
        targetSymptoms: ['Depression', 'Tunnel vision', 'Hopelessness'],
        compensationMechanism: 'Broader view reveals options; wisdom reframes difficulties',
        compensationMechanismVi: 'Góc nhìn rộng hơn cho thấy lựa chọn; trí tuệ đổi góc nhìn khó khăn',
        effectivenessRating: 4
    },
    kindness: {
        targetSymptoms: ['Depression', 'Self-focus', 'Isolation'],
        compensationMechanism: 'Helping others provides meaning; reduces self-focused rumination',
        compensationMechanismVi: 'Giúp đỡ người khác tạo ý nghĩa; giảm suy nghĩ tự tập trung',
        effectivenessRating: 4
    },
    forgiveness: {
        targetSymptoms: ['Anger', 'Resentment', 'Chronic stress'],
        compensationMechanism: 'Releasing grudges reduces stress; forgiveness frees emotional resources',
        compensationMechanismVi: 'Buông bỏ oán giận giảm căng thẳng; tha thứ giải phóng nguồn lực cảm xúc',
        effectivenessRating: 4
    },
    spirituality: {
        targetSymptoms: ['Depression', 'Meaninglessness', 'Existential anxiety'],
        compensationMechanism: 'Transcendent meaning provides hope; spiritual practices reduce anxiety',
        compensationMechanismVi: 'Ý nghĩa siêu việt cung cấp hy vọng; thực hành tâm linh giảm lo âu',
        effectivenessRating: 4
    }
}

/**
 * Get VIA-based intervention recommendations
 * Uses user's VIA strengths to compensate for DASS symptoms
 */
export function getVIAInterventionRecommendations(
    viaStrengths: Record<string, number>,
    dassProfile: DASSProfile
): VIAInterventionRecommendation[] {
    const recommendations: VIAInterventionRecommendation[] = []

    // Find user's top strengths (above 70th percentile)
    const topStrengths = Object.entries(viaStrengths)
        .filter(([, percentile]) => percentile >= 70)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)

    // Determine primary target based on DASS
    const primaryTarget = dassProfile.D >= dassProfile.A && dassProfile.D >= dassProfile.S
        ? 'Depression'
        : dassProfile.A >= dassProfile.S
            ? 'Anxiety'
            : 'Stress'

    // Match VIA strengths to compensation mechanisms
    for (const [strengthId, percentile] of topStrengths) {
        const compensation = VIA_DASS_COMPENSATION_MAP[strengthId]
        if (!compensation || !compensation.targetSymptoms.some(s =>
            s.toLowerCase().includes(primaryTarget.toLowerCase())
        )) continue

        const viaStrength = VIA_STRENGTHS.find(s => s.id === strengthId)
        if (!viaStrength) continue

        recommendations.push({
            viaStrength: {
                id: strengthId,
                name: viaStrength.name,
                nameVi: viaStrength.nameVi,
                userPercentile: percentile
            },
            targetDisorder: {
                name: primaryTarget,
                nameVi: primaryTarget === 'Depression' ? 'Trầm cảm'
                    : primaryTarget === 'Anxiety' ? 'Lo âu' : 'Căng thẳng',
                effectSize: compensation.effectivenessRating / 5 * viaStrength.wellbeingCorrelation
            },
            interventionStrategy: {
                name: `${viaStrength.name}-Based Intervention`,
                nameVi: `Can thiệp dựa trên ${viaStrength.nameVi}`,
                description: compensation.compensationMechanism,
                descriptionVi: compensation.compensationMechanismVi,
                exercises: viaStrength.developmentExercises,
                exercisesVi: viaStrength.developmentExercisesVi
            },
            evidenceSource: 'Seligman et al. (2005). DOI: 10.1037/0003-066X.60.5.410'
        })
    }

    return recommendations
}

/**
 * Get Full VIA Intervention Recommendations (with expanded strengths)
 */
export function getFullVIAInterventionRecommendations(
    viaStrengths: Record<string, number>,
    dassProfile: DASSProfile
): VIAInterventionRecommendation[] {
    const recommendations: VIAInterventionRecommendation[] = []

    const topStrengths = Object.entries(viaStrengths)
        .filter(([, percentile]) => percentile >= 60)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)

    const primaryTarget = dassProfile.D >= dassProfile.A && dassProfile.D >= dassProfile.S
        ? 'Depression'
        : dassProfile.A >= dassProfile.S
            ? 'Anxiety'
            : 'Stress'

    for (const [strengthId, percentile] of topStrengths) {
        const compensation = VIA_DASS_COMPENSATION_MAP[strengthId]
        if (!compensation) continue

        const isRelevant = compensation.targetSymptoms.some(s =>
            s.toLowerCase().includes(primaryTarget.toLowerCase()) ||
            (primaryTarget === 'Stress' && s.toLowerCase().includes('anxiety'))
        )
        if (!isRelevant) continue

        const viaStrength = VIA_STRENGTHS.find(s => s.id === strengthId)
        if (!viaStrength) continue

        recommendations.push({
            viaStrength: {
                id: strengthId,
                name: viaStrength.name,
                nameVi: viaStrength.nameVi,
                userPercentile: percentile
            },
            targetDisorder: {
                name: primaryTarget,
                nameVi: primaryTarget === 'Depression' ? 'Trầm cảm'
                    : primaryTarget === 'Anxiety' ? 'Lo âu' : 'Căng thẳng',
                effectSize: compensation.effectivenessRating / 5 * viaStrength.wellbeingCorrelation
            },
            interventionStrategy: {
                name: `${viaStrength.name}-Based Intervention`,
                nameVi: `Can thiệp dựa trên ${viaStrength.nameVi}`,
                description: compensation.compensationMechanism,
                descriptionVi: compensation.compensationMechanismVi,
                exercises: viaStrength.developmentExercises,
                exercisesVi: viaStrength.developmentExercisesVi
            },
            evidenceSource: 'Seligman et al. (2005). DOI: 10.1037/0003-066X.60.5.410'
        })
    }

    return recommendations
}
