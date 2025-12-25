/**
 * MISO V3 Deep Integration - Causal Mechanisms
 * Defines psychological pathways: Trait → Process → Symptom
 */

import type { Big5Percentiles, VIAPercentiles, DASS21RawScores } from '@/types/miso-v3'

// ============================================
// BIG5 → DASS MECHANISMS
// ============================================

export interface Mechanism {
    id: string
    pathway: string
    predictedDASS: { D?: number; A?: number; S?: number }
    risk_threshold: number
    protective_threshold: number
    evidence_level: 'A' | 'B' | 'C'
    mechanism_type: 'risk' | 'protective'
}

export const BIG5_MECHANISMS: Record<string, Mechanism> = {
    High_N: {
        id: 'High_N',
        pathway: 'Nhạy cảm cảm xúc → Suy nghĩ quẩn quanh (Rumination) → Trầm cảm/Lo âu',
        predictedDASS: { D: 8, A: 6, S: 5 },
        risk_threshold: 80,
        protective_threshold: 20,
        evidence_level: 'A',
        mechanism_type: 'risk',
    },
    Low_E: {
        id: 'Low_E',
        pathway: 'Rút lui xã hội → Cô đơn → Trầm cảm',
        predictedDASS: { D: 5, A: 2, S: 1 },
        risk_threshold: 30,
        protective_threshold: 70,
        evidence_level: 'A',
        mechanism_type: 'risk',
    },
    Low_A: {
        id: 'Low_A',
        pathway: 'Xung đột liên cá nhân → Thái độ thù địch → Căng thẳng (Stress)',
        predictedDASS: { D: 1, A: 2, S: 4 },
        risk_threshold: 25,
        protective_threshold: 75,
        evidence_level: 'B',
        mechanism_type: 'risk',
    },
    Low_C: {
        id: 'Low_C',
        pathway: 'Thiếu tổ chức → Thất bại trong công việc/mục tiêu → Căng thẳng & Tuyệt vọng',
        predictedDASS: { D: 3, A: 1, S: 6 },
        risk_threshold: 30,
        protective_threshold: 70,
        evidence_level: 'A',
        mechanism_type: 'risk',
    },
    High_O: {
        id: 'High_O',
        pathway: 'Sự linh hoạt nhận thức → Thích nghi và đối phó tốt → Giảm lo âu',
        predictedDASS: { D: 0, A: -2, S: -1 },
        risk_threshold: 85,
        protective_threshold: 60,
        evidence_level: 'B',
        mechanism_type: 'protective',
    },
    High_A: {
        id: 'High_A',
        pathway: 'Lòng trắc ẩn → Hòa hợp xã hội → Giảm căng thẳng',
        predictedDASS: { D: -1, A: 0, S: -2 },
        risk_threshold: 85,
        protective_threshold: 70,
        evidence_level: 'B',
        mechanism_type: 'protective',
    },
    High_C: {
        id: 'High_C',
        pathway: 'Tính kỷ luật/tổ chức → Đạt được mục tiêu → Giảm cảm giác bất lực',
        predictedDASS: { D: -2, A: 0, S: -3 },
        risk_threshold: 85,
        protective_threshold: 70,
        evidence_level: 'A',
        mechanism_type: 'protective',
    },
}

// ============================================
// VIA COMPENSATORY PATHWAYS
// ============================================

export interface CompensatoryPathway {
    id: string
    condition: string
    mechanism: string
    DassAdjustment: { D?: number; A?: number; S?: number }
    caveat?: string
    evidence_level: 'A' | 'B' | 'C'
}

export const COMPENSATORY_PATHWAYS: CompensatoryPathway[] = [
    {
        id: 'Low_E_High_SocialInt',
        condition: 'Hướng nội (Low E < 30%) + Trí tuệ xã hội cao (VIA > 70%)',
        mechanism: 'Mặc dù hướng nội, kỹ năng xã hội tốt giúp giảm nguy cơ cô đơn',
        DassAdjustment: { D: -3, A: -1 },
        evidence_level: 'B',
    },
    {
        id: 'High_N_High_SelfReg',
        condition: 'Nhạy cảm cao (High N > 80%) + Tự điều chỉnh cao (VIA > 70%)',
        mechanism: 'Khả năng tự kiểm soát giúp kiềm chế các phản ứng cảm xúc thái quá',
        DassAdjustment: { A: -4, S: -3 },
        evidence_level: 'A',
    },
    {
        id: 'Low_C_High_Perseverance',
        condition: 'Thiếu kiên trì (Low C < 30%) + Sự bền bỉ cao (VIA > 70%)',
        mechanism: 'Sự bền bỉ (Grit) bù đắp cho việc thiếu tính tổ chức trong công việc',
        DassAdjustment: { S: -4, D: -2 },
        evidence_level: 'B',
    },
    {
        id: 'High_N_High_Hope',
        condition: 'Nhạy cảm cao (High N > 80%) + Hy vọng cao (VIA > 70%)',
        mechanism: 'Hy vọng đóng vai trò là "neo" cảm xúc bất chấp những biến động tâm trạng',
        DassAdjustment: { D: -5, A: -2 },
        caveat: 'Nếu điểm Trầm cảm vẫn cao dù đã có Hy vọng, cần lưu ý mẫu D5: Trầm cảm ẩn (Smiling Depression)',
        evidence_level: 'B',
    },
    {
        id: 'Low_A_High_Forgiveness',
        condition: 'Ít dễ chịu (Low A < 30%) + Lòng vị tha cao (VIA > 70%)',
        mechanism: 'Lòng vị tha giúp giảm căng thẳng liên cá nhân phát sinh từ tính cách ít dễ chịu',
        DassAdjustment: { S: -3, A: -1 },
        evidence_level: 'C',
    },
    {
        id: 'High_N_High_Mindfulness',
        condition: 'Nhạy cảm cao (High N > 80%) + Thưởng thức cái đẹp cao (VIA > 75%)',
        mechanism: 'Khả năng trân trọng thẩm mỹ tạo ra sự điều chỉnh cảm xúc thông qua trạng thái "đắm mình"',
        DassAdjustment: { A: -3, S: -2 },
        evidence_level: 'C',
    },
    {
        id: 'Low_E_High_Creativity',
        condition: 'Hướng nội (Low E < 30%) + Sáng tạo cao (VIA > 75%)',
        mechanism: 'Các hoạt động sáng tạo thay thế hiệu quả cho nhu cầu kết nối xã hội trực tiếp',
        DassAdjustment: { D: -2 },
        evidence_level: 'C',
    },
    {
        id: 'Low_C_High_Zest',
        condition: 'Thiếu kỷ luật (Low C < 30%) + Sự hăng hái (Zest) cao (VIA > 75%)',
        mechanism: 'Năng lượng và sự nhiệt huyết bù đắp cho việc thiếu cấu trúc và kế hoạch',
        DassAdjustment: { D: -3, S: -2 },
        evidence_level: 'C',
    },
]

// ============================================
// PREDICTION FUNCTIONS
// ============================================

export interface ActiveMechanism extends Mechanism {
    strength: number // 0-1, how strongly this mechanism is active
}

export interface ActiveCompensation extends CompensatoryPathway {
    strength: string // Which VIA strength is involved
    percentile: number
}

/**
 * Predict expected DASS scores based on Big5 profile
 */
export function predictDASSFromBig5(big5: Big5Percentiles): {
    predicted: { D: number; A: number; S: number }
    activeMechanisms: ActiveMechanism[]
} {
    // Population baseline (Vietnamese norms)
    const baseline = { D: 7, A: 5, S: 8 }
    const predicted = { ...baseline }
    const activeMechanisms: ActiveMechanism[] = []

    // Check each mechanism
    if (big5.N > BIG5_MECHANISMS.High_N.risk_threshold) {
        const strength = (big5.N - BIG5_MECHANISMS.High_N.risk_threshold) / 20 // 0-1
        predicted.D += BIG5_MECHANISMS.High_N.predictedDASS.D! * strength
        predicted.A += BIG5_MECHANISMS.High_N.predictedDASS.A! * strength
        predicted.S += BIG5_MECHANISMS.High_N.predictedDASS.S! * strength
        activeMechanisms.push({ ...BIG5_MECHANISMS.High_N, strength })
    }

    if (big5.E < BIG5_MECHANISMS.Low_E.risk_threshold) {
        const strength = (BIG5_MECHANISMS.Low_E.risk_threshold - big5.E) / 30
        predicted.D += BIG5_MECHANISMS.Low_E.predictedDASS.D! * strength
        predicted.A += BIG5_MECHANISMS.Low_E.predictedDASS.A! * strength
        predicted.S += BIG5_MECHANISMS.Low_E.predictedDASS.S! * strength
        activeMechanisms.push({ ...BIG5_MECHANISMS.Low_E, strength })
    }

    if (big5.A < BIG5_MECHANISMS.Low_A.risk_threshold) {
        const strength = (BIG5_MECHANISMS.Low_A.risk_threshold - big5.A) / 25
        predicted.D += BIG5_MECHANISMS.Low_A.predictedDASS.D! * strength
        predicted.A += BIG5_MECHANISMS.Low_A.predictedDASS.A! * strength
        predicted.S += BIG5_MECHANISMS.Low_A.predictedDASS.S! * strength
        activeMechanisms.push({ ...BIG5_MECHANISMS.Low_A, strength })
    }

    if (big5.C < BIG5_MECHANISMS.Low_C.risk_threshold) {
        const strength = (BIG5_MECHANISMS.Low_C.risk_threshold - big5.C) / 30
        predicted.D += BIG5_MECHANISMS.Low_C.predictedDASS.D! * strength
        predicted.A += BIG5_MECHANISMS.Low_C.predictedDASS.A! * strength
        predicted.S += BIG5_MECHANISMS.Low_C.predictedDASS.S! * strength
        activeMechanisms.push({ ...BIG5_MECHANISMS.Low_C, strength })
    }

    // Protective mechanisms
    if (big5.O > BIG5_MECHANISMS.High_O.protective_threshold) {
        const strength = (big5.O - BIG5_MECHANISMS.High_O.protective_threshold) / 40
        predicted.A += BIG5_MECHANISMS.High_O.predictedDASS.A! * strength // Negative adjustment
        predicted.S += BIG5_MECHANISMS.High_O.predictedDASS.S! * strength
        activeMechanisms.push({ ...BIG5_MECHANISMS.High_O, strength })
    }

    if (big5.A > BIG5_MECHANISMS.High_A.protective_threshold) {
        const strength = (big5.A - BIG5_MECHANISMS.High_A.protective_threshold) / 30
        predicted.D += BIG5_MECHANISMS.High_A.predictedDASS.D! * strength
        predicted.S += BIG5_MECHANISMS.High_A.predictedDASS.S! * strength
        activeMechanisms.push({ ...BIG5_MECHANISMS.High_A, strength })
    }

    if (big5.C > BIG5_MECHANISMS.High_C.protective_threshold) {
        const strength = (big5.C - BIG5_MECHANISMS.High_C.protective_threshold) / 30
        predicted.D += BIG5_MECHANISMS.High_C.predictedDASS.D! * strength
        predicted.S += BIG5_MECHANISMS.High_C.predictedDASS.S! * strength
        activeMechanisms.push({ ...BIG5_MECHANISMS.High_C, strength })
    }

    // Round and cap
    predicted.D = Math.max(0, Math.round(predicted.D))
    predicted.A = Math.max(0, Math.round(predicted.A))
    predicted.S = Math.max(0, Math.round(predicted.S))

    return { predicted, activeMechanisms }
}

/**
 * Apply VIA compensatory adjustments to predicted DASS
 */
export function applyVIACompensation(
    predictedDASS: { D: number; A: number; S: number },
    big5: Big5Percentiles,
    via: VIAPercentiles
): {
    adjusted: { D: number; A: number; S: number }
    activeCompensations: ActiveCompensation[]
} {
    const adjusted = { ...predictedDASS }
    const activeCompensations: ActiveCompensation[] = []

    // Check each compensation pattern
    for (const pathway of COMPENSATORY_PATHWAYS) {
        let isActive = false
        let viaStrength = ''
        let viaPercentile = 0

        // Pattern: Low_E_High_SocialInt
        if (pathway.id === 'Low_E_High_SocialInt') {
            if (big5.E < 30 && (via['Social Intelligence'] ?? 0) > 70) {
                isActive = true
                viaStrength = 'Social Intelligence'
                viaPercentile = via['Social Intelligence'] ?? 0
            }
        }
        // Pattern: High_N_High_SelfReg
        else if (pathway.id === 'High_N_High_SelfReg') {
            if (big5.N > 80 && (via['Self-Regulation'] ?? 0) > 70) {
                isActive = true
                viaStrength = 'Self-Regulation'
                viaPercentile = via['Self-Regulation'] ?? 0
            }
        }
        // Pattern: Low_C_High_Perseverance
        else if (pathway.id === 'Low_C_High_Perseverance') {
            if (big5.C < 30 && (via.Perseverance ?? 0) > 70) {
                isActive = true
                viaStrength = 'Perseverance'
                viaPercentile = via.Perseverance ?? 0
            }
        }
        // Pattern: High_N_High_Hope
        else if (pathway.id === 'High_N_High_Hope') {
            if (big5.N > 80 && (via.Hope ?? 0) > 70) {
                isActive = true
                viaStrength = 'Hope'
                viaPercentile = via.Hope ?? 0
            }
        }
        // Pattern: Low_A_High_Forgiveness
        else if (pathway.id === 'Low_A_High_Forgiveness') {
            if (big5.A < 30 && (via.Forgiveness ?? 0) > 70) {
                isActive = true
                viaStrength = 'Forgiveness'
                viaPercentile = via.Forgiveness ?? 0
            }
        }
        // Pattern: High_N_High_Mindfulness
        else if (pathway.id === 'High_N_High_Mindfulness') {
            if (big5.N > 80 && (via['Appreciation of Beauty'] ?? 0) > 75) {
                isActive = true
                viaStrength = 'Appreciation of Beauty'
                viaPercentile = via['Appreciation of Beauty'] ?? 0
            }
        }
        // Pattern: Low_E_High_Creativity
        else if (pathway.id === 'Low_E_High_Creativity') {
            if (big5.E < 30 && (via.Creativity ?? 0) > 75) {
                isActive = true
                viaStrength = 'Creativity'
                viaPercentile = via.Creativity ?? 0
            }
        }
        // Pattern: Low_C_High_Zest
        else if (pathway.id === 'Low_C_High_Zest') {
            if (big5.C < 30 && (via.Zest ?? 0) > 75) {
                isActive = true
                viaStrength = 'Zest'
                viaPercentile = via.Zest ?? 0
            }
        }

        if (isActive) {
            adjusted.D += pathway.DassAdjustment.D ?? 0
            adjusted.A += pathway.DassAdjustment.A ?? 0
            adjusted.S += pathway.DassAdjustment.S ?? 0

            activeCompensations.push({
                ...pathway,
                strength: viaStrength,
                percentile: viaPercentile,
            })
        }
    }

    // Cap at 0
    adjusted.D = Math.max(0, adjusted.D)
    adjusted.A = Math.max(0, adjusted.A)
    adjusted.S = Math.max(0, adjusted.S)

    return { adjusted, activeCompensations }
}

/**
 * Calculate residual distress (actual - predicted)
 */
export function calculateResidualDistress(
    actualDASS: DASS21RawScores,
    predictedDASS: { D: number; A: number; S: number }
): {
    residual: { D: number; A: number; S: number }
    interpretation: string
} {
    const residual = {
        D: actualDASS.D - predictedDASS.D,
        A: actualDASS.A - predictedDASS.A,
        S: actualDASS.S - predictedDASS.S,
    }

    const totalResidual = residual.D + residual.A + residual.S

    let interpretation = ''
    if (totalResidual > 10) {
        interpretation = 'Độ lệch dương lớn: Có khả năng do các yếu tố căng thẳng bên ngoài không nằm trong tính cách (Mẫu D1)'
    } else if (totalResidual < -10) {
        interpretation = 'Độ lệch âm lớn: Các yếu tố bảo vệ mạnh mẽ đang hoạt động hiệu quả (Mẫu D6)'
    } else {
        interpretation = 'Độ lệch trong phạm vi dự kiến: Tính cách giải thích tốt các triệu chứng hiện tại'
    }

    return { residual, interpretation }
}
