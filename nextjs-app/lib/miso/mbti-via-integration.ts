/**
 * MISO V3 Deep Integration - MBTI Moderators & VIA-Problem Mapping
 */

// ============================================
// MBTI MODERATORS
// ============================================

export interface MBTIModerator {
    type: string
    moderators: Record<string, number> // e.g., 'N_to_A': 0.7 means 30% reduction
    strengths_amplifiers: Record<string, number> // VIA strengths that work better for this type
    vulnerabilities?: string[]
    intervention_preferences?: string[]
}

export const MBTI_MODERATORS: Record<string, MBTIModerator> = {
    INTJ: {
        type: 'INTJ',
        moderators: {
            N_to_A: 0.7, // Logical reframing reduces anxiety from high N
            E_to_D: 1.2, // Overthinking isolation increases depression risk
        },
        strengths_amplifiers: {
            Judgment: 1.5,
            Perspective: 1.3,
            'Love of Learning': 1.2,
        },
        intervention_preferences: ['strategic_planning', 'problem_solving', 'systems_thinking'],
    },
    INFP: {
        type: 'INFP',
        moderators: {
            N_to_D: 1.3, // Value conflicts amplify depression
            A_to_S: 0.8, // Low A less stressful (value-driven)
        },
        strengths_amplifiers: {
            'Appreciation of Beauty': 1.4,
            Kindness: 1.2,
            Creativity: 1.3,
        },
        vulnerabilities: ['value_threat', 'authenticity_conflict'],
        intervention_preferences: ['expressive_writing', 'value_clarification', 'creative_expression'],
    },
    INFJ: {
        type: 'INFJ',
        moderators: {
            N_to_D: 1.2,
            E_to_D: 1.1,
        },
        strengths_amplifiers: {
            'Love': 1.3,
            'Social Intelligence': 1.2,
            Perspective: 1.3,
        },
        vulnerabilities: ['boundary_issues', 'perfectionism'],
        intervention_preferences: ['boundary_setting', 'self_compassion', 'meaning_making'],
    },
    INTP: {
        type: 'INTP',
        moderators: {
            N_to_A: 0.8,
            E_to_D: 1.1,
        },
        strengths_amplifiers: {
            Curiosity: 1.5,
            Judgment: 1.4,
            'Love of Learning': 1.4,
        },
        intervention_preferences: ['intellectual_engagement', 'problem_solving', 'systems_analysis'],
    },
    ENTJ: {
        type: 'ENTJ',
        moderators: {
            N_to_A: 0.6, // Action-oriented reduces anxiety
            C_to_S: 1.1, // High standards can increase stress
        },
        strengths_amplifiers: {
            Leadership: 1.5,
            Bravery: 1.3,
            Judgment: 1.2,
        },
        intervention_preferences: ['goal_setting', 'strategic_action', 'efficiency_optimization'],
    },
    ENTP: {
        type: 'ENTP',
        moderators: {
            N_to_A: 0.7,
            C_to_S: 0.9, // Low C less stressful for exploratory types
        },
        strengths_amplifiers: {
            Creativity: 1.4,
            Curiosity: 1.5,
            Humor: 1.3,
        },
        intervention_preferences: ['brainstorming', 'debate', 'novel_experiences'],
    },
    ENFP: {
        type: 'ENFP',
        moderators: {
            N_to_A: 0.9,
            E_to_D: 0.5, // Strong protection from high E
        },
        strengths_amplifiers: {
            Zest: 1.5,
            Hope: 1.4,
            Creativity: 1.3,
        },
        intervention_preferences: ['exploration', 'social_connection', 'possibility_thinking'],
    },
    ENFJ: {
        type: 'ENFJ',
        moderators: {
            E_to_D: 0.6,
            A_to_S: 1.2, // High empathy can increase interpersonal stress
        },
        strengths_amplifiers: {
            Love: 1.4,
            'Social Intelligence': 1.5,
            Leadership: 1.3,
        },
        vulnerabilities: ['over_responsibility', 'people_pleasing'],
        intervention_preferences: ['relationship_building', 'group_activities', 'mentorship'],
    },
    ISTJ: {
        type: 'ISTJ',
        moderators: {
            N_to_A: 0.8,
            C_to_S: 0.7, // Structure reduces stress
        },
        strengths_amplifiers: {
            Honesty: 1.4,
            Prudence: 1.5,
            Fairness: 1.2,
        },
        intervention_preferences: ['structured_routines', 'duty_focus', 'procedure_following'],
    },
    ISFJ: {
        type: 'ISFJ',
        moderators: {
            N_to_A: 0.9,
            A_to_S: 1.1,
        },
        strengths_amplifiers: {
            Kindness: 1.5,
            Teamwork: 1.4,
            Gratitude: 1.2,
        },
        vulnerabilities: ['conflict_avoidance', 'self_neglect'],
        intervention_preferences: ['helping_others', 'tradition', 'caring_activities'],
    },
    ESTJ: {
        type: 'ESTJ',
        moderators: {
            N_to_A: 0.7,
            C_to_S: 0.8,
        },
        strengths_amplifiers: {
            Leadership: 1.4,
            Honesty: 1.3,
            Fairness: 1.2,
        },
        intervention_preferences: ['action_plans', 'efficiency', 'practical_solutions'],
    },
    ESFJ: {
        type: 'ESFJ',
        moderators: {
            E_to_D: 0.6,
            A_to_S: 1.1,
        },
        strengths_amplifiers: {
            Kindness: 1.4,
            'Social Intelligence': 1.4,
            Teamwork: 1.5,
        },
        intervention_preferences: ['social_harmony', 'community_involvement', 'helping_others'],
    },
    ISTP: {
        type: 'ISTP',
        moderators: {
            N_to_A: 0.7,
            E_to_D: 1.0,
        },
        strengths_amplifiers: {
            Bravery: 1.3,
            Judgment: 1.2,
            'Self-Regulation': 1.2,
        },
        intervention_preferences: ['hands_on_activities', 'problem_solving', 'physical_action'],
    },
    ISFP: {
        type: 'ISFP',
        moderators: {
            N_to_D: 1.2,
            E_to_D: 1.1,
        },
        strengths_amplifiers: {
            'Appreciation of Beauty': 1.5,
            Kindness: 1.3,
            Creativity: 1.3,
        },
        vulnerabilities: ['conflict_avoidance', 'value_pressure'],
        intervention_preferences: ['creative_expression', 'nature', 'aesthetic_experiences'],
    },
    ESTP: {
        type: 'ESTP',
        moderators: {
            N_to_A: 0.5, // Action dampens anxiety
            E_to_D: 0.4,
        },
        strengths_amplifiers: {
            Bravery: 1.5,
            Zest: 1.4,
            'Social Intelligence': 1.2,
        },
        intervention_preferences: ['physical_activity', 'social_engagement', 'immediate_action'],
    },
    ESFP: {
        type: 'ESFP',
        moderators: {
            E_to_D: 0.5,
            C_to_S: 1.3, // Spontaneity can increase stress if too unstructured
        },
        strengths_amplifiers: {
            Zest: 1.5,
            Humor: 1.4,
            Kindness: 1.2,
        },
        intervention_preferences: ['fun_activities', 'social_fun', 'experiential_learning'],
    },
}

// ============================================
// VIA-PROBLEM CROSS-MAPPING
// ============================================

export interface VIAProblemSolution {
    id: string
    condition: string // e.g., 'High Anxiety + Creativity'
    intervention: string
    technique: string
    mechanism: string
    expected_effect: number // 0-1 scale
    evidence_level: 'A' | 'B' | 'C'
}

export const VIA_PROBLEM_SOLUTIONS: VIAProblemSolution[] = [
    {
        id: 'HighA_Creativity',
        condition: 'Lo âu cao (A ≥ 10) + Sáng tạo (> 75%)',
        intervention: 'Quản lý lo âu bằng sáng tạo',
        technique: 'Vẽ nỗi lo âu của bạn như một nhân vật, đặt cho nó một giọng nói hài hước. Sau đó, hãy thử trò chuyện với nhân vật đó.',
        mechanism: 'Khách quan hóa + Khoảng cách sáng tạo giúp giảm bớt cảm giác bị đe dọa',
        expected_effect: 0.6,
        evidence_level: 'C',
    },
    {
        id: 'HighD_LoveOfLearning',
        condition: 'Trầm cảm cao (D ≥ 14) + Ham học hỏi (> 75%)',
        intervention: 'Kích hoạt tò mò',
        technique: 'Học 1 sự thật mới thú vị mỗi ngày về một điều gì đó đẹp đẽ hoặc có ý nghĩa',
        mechanism: 'Sự tò mò giúp ngắt quãng sự suy nghĩ quẩn quanh, mang lại sự tham gia tinh thần',
        expected_effect: 0.5,
        evidence_level: 'C',
    },
    {
        id: 'HighS_SocialInt',
        condition: 'Căng thẳng cao (S ≥ 15) + Trí tuệ xã hội (> 75%)',
        intervention: 'Kết nối vi mô',
        technique: 'Dành 2 phút kết nối chân thành với 1 người tin tưởng trong những khoảnh khắc căng thẳng',
        mechanism: 'Sự hỗ trợ xã hội tức thời giúp giảm nhẹ áp lực mà không gây quá tải',
        expected_effect: 0.4,
        evidence_level: 'B',
    },
    {
        id: 'HighD_Humor',
        condition: 'Trầm cảm cao (D ≥ 14) + Hài hước (> 75%)',
        intervention: 'Ghi chép hài hước',
        technique: 'Tìm 1 điều vô lý hoặc mỉa mai về ngày của bạn và viết nó xuống',
        mechanism: 'Giải thể nhận thức (Cognitive defusion) thông qua sự hài hước',
        expected_effect: 0.5,
        evidence_level: 'C',
    },
    {
        id: 'HighA_Spirituality',
        condition: 'Lo âu cao (A ≥ 10) + Tâm linh (> 75%)',
        intervention: 'Thực hành siêu việt',
        technique: 'Dành 5 phút kết nối tâm trí với một điều gì đó lớn lao hơn (thiên nhiên, vũ trụ, ý nghĩa cuộc sống)',
        mechanism: 'Sự thay đổi quan điểm giúp giảm cảm giác bị đe dọa',
        expected_effect: 0.55,
        evidence_level: 'B',
    },
    {
        id: 'HighD_Hope',
        condition: 'Trầm cảm vừa (D 10-20) + Hy vọng (> 70%)',
        intervention: 'Hình dung tương lai',
        technique: 'Viết một bức thư từ chính bản thân bạn trong tương lai - người đã vượt qua được giai đoạn này',
        mechanism: 'Tư duy về lộ trình + Góc nhìn thời gian',
        expected_effect: 0.6,
        evidence_level: 'B',
    },
    {
        id: 'HighS_SelfReg',
        condition: 'Stress cao (S ≥ 15) + Tự điều chỉnh (> 75%)',
        intervention: 'Nghỉ giải lao chiến lược',
        technique: 'Lên lịch 3 lần nghỉ hoàn toàn 2 phút trong ngày',
        mechanism: 'Ngắt kích hoạt có kiểm soát sử dụng thế mạnh tự điều tiết',
        expected_effect: 0.5,
        evidence_level: 'B',
    },
    {
        id: 'HighA_Bravery',
        condition: 'Lo âu vừa (A 8-14) + Lòng dũng cảm (> 75%)',
        intervention: 'Tiếp xúc có kiểm soát với lòng dũng cảm',
        technique: 'Đối mặt với 1 nỗi sợ nhỏ mỗi ngày, coi đó như một thử thách lòng can đảm',
        mechanism: 'Định nghĩa lại lo âu như một cơ hội để rèn luyện lòng can đảm',
        expected_effect: 0.65,
        evidence_level: 'A',
    },
    {
        id: 'HighD_Gratitude',
        condition: 'Trầm cảm nhẹ (D 5-13) + Lòng biết ơn (> 70%)',
        intervention: 'Thực hành lòng biết ơn tăng cường',
        technique: 'Mỗi ngày: Viết 3 điều biết ơn + tại sao chúng quan trọng + bạn đã góp phần tạo ra chúng như thế nào',
        mechanism: 'Lòng biết ơn chủ động + Cảm giác về quyền tự quyết (agency)',
        expected_effect: 0.55,
        evidence_level: 'A',
    },
    {
        id: 'HighS_Perseverance',
        condition: 'Stress cao (S ≥ 15) + Sự bền bỉ (> 75%)',
        intervention: 'Theo dõi cột mốc nhỏ',
        technique: 'Chia nhỏ công việc áp lực thành 5 mục tiêu siêu nhỏ, ăn mừng mỗi khi hoàn thành 1 mục tiêu',
        mechanism: 'Sự kiên trì được áp dụng vào quản lý căng thẳng',
        expected_effect: 0.5,
        evidence_level: 'C',
    },
    {
        id: 'HighA_Kindness',
        condition: 'Lo âu cao (A ≥ 10) + Lòng tốt (> 75%)',
        intervention: 'Trắc ẩn với bản thân đang lo âu',
        technique: 'Nói chuyện với chính bản thân mình đang lo âu như cách bạn nói với một đứa trẻ đang sợ hãi',
        mechanism: 'Lòng tự trắc ẩn thông qua thế mạnh tử tế tự nhiên',
        expected_effect: 0.5,
        evidence_level: 'B',
    },
    {
        id: 'HighD_Perspective',
        condition: 'Trầm cảm vừa (D 10-20) + Góc nhìn (> 75%)',
        intervention: 'Ghi chép trí tuệ',
        technique: 'Viết về tình trạng của bạn dưới góc nhìn của một người cố vấn khôn ngoan',
        mechanism: 'Tạo khoảng cách tâm lý thông qua việc thay đổi điểm nhìn',
        expected_effect: 0.55,
        evidence_level: 'C',
    },
]

/**
 * Find matching VIA-problem solutions for user's profile
 */
export function findVIAProblemMatches(
    dass: { D: number; A: number; S: number },
    viaPercentiles: Record<string, number>
): VIAProblemSolution[] {
    const matches: VIAProblemSolution[] = []

    for (const solution of VIA_PROBLEM_SOLUTIONS) {
        let isMatch = false

        // Check anxiety-based solutions
        if (solution.id.startsWith('HighA_') && dass.A >= 10) {
            const strengthName = solution.id.replace('HighA_', '').replace(/_/g, ' ')
            const viaKey = Object.keys(viaPercentiles).find(
                (k) => k.toLowerCase().replace(/-/g, ' ') === strengthName.toLowerCase()
            )
            if (viaKey && viaPercentiles[viaKey] > 75) {
                isMatch = true
            }
        }
        // Check depression-based solutions
        else if (solution.id.startsWith('HighD_') && dass.D >= 10) {
            const strengthName = solution.id.replace('HighD_', '').replace(/_/g, ' ')
            const viaKey = Object.keys(viaPercentiles).find(
                (k) => k.toLowerCase().replace(/-/g, ' ') === strengthName.toLowerCase()
            )
            if (viaKey && viaPercentiles[viaKey] > 70) {
                isMatch = true
            }
        }
        // Check stress-based solutions
        else if (solution.id.startsWith('HighS_') && dass.S >= 15) {
            const strengthName = solution.id.replace('HighS_', '').replace(/_/g, ' ')
            const viaKey = Object.keys(viaPercentiles).find(
                (k) => k.toLowerCase().replace(/-/g, ' ') === strengthName.toLowerCase()
            )
            if (viaKey && viaPercentiles[viaKey] > 75) {
                isMatch = true
            }
        }

        if (isMatch) {
            matches.push(solution)
        }
    }

    // Sort by expected effect
    return matches.sort((a, b) => b.expected_effect - a.expected_effect)
}
