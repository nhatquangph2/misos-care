/**
 * Enhanced Intervention Service
 * Tích hợp sâu Knowledge Base vào Recommendations
 * 
 * OPTION 1: VIA-based intervention matching + Treatment effect sizes
 * OPTION 2: MBTI-personalized learning
 * 
 * SOURCES:
 * - Kotov et al. (2010) DOI: 10.1037/a0020327 - Treatment effect sizes
 * - Park et al. (2004) DOI: 10.1521/jscp.23.5.603.50748 - VIA well-being
 * - Seligman et al. (2005) DOI: 10.1037/0003-066X.60.5.410 - Signature strengths interventions
 * - McCrae & Costa (1989) DOI: 10.1111/j.1467-6494.1989.tb00759.x - MBTI-Big5 mapping
 */

import { VIA_STRENGTHS, type VIAStrength } from '@/constants/knowledge/via-knowledge'
import { BIG5_DISORDER_MAPPINGS, TRANSDIAGNOSTIC_PROCESSES } from '@/constants/knowledge/clinical-psychology'
import { MBTI_TYPES, MBTI_SCIENTIFIC_CONTEXT } from '@/constants/knowledge/mbti-knowledge'
import { LEARNING_TECHNIQUES } from '@/constants/knowledge/learning-sciences'
import { FLOW_STATE_CONDITIONS, EXERCISE_MENTAL_HEALTH } from '@/constants/knowledge/sports-psychology'
import type { Big5Profile } from '@/constants/knowledge'

// ============================================
// TYPES
// ============================================

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
        effectSize: number  // How much this VIA strength can help
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
        effectSize: number  // Hedges' g
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
        compatibilityScore: number  // 0-100
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

// ============================================
// VIA-DASS COMPENSATION MAPPING
// ============================================

const VIA_DASS_COMPENSATION_MAP: Record<string, {
    targetSymptoms: string[]
    compensationMechanism: string
    compensationMechanismVi: string
    effectivenessRating: number  // 1-5
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
    }
}

// ============================================
// MBTI LEARNING STYLE MAPPING
// ============================================

const MBTI_LEARNING_PREFERENCES: Record<string, {
    preferredApproach: string
    preferredApproachVi: string
    idealTechniques: string[]  // technique IDs from learning-sciences.ts
    strengths: string[]
    strengthsVi: string[]
    challenges: string[]
    challengesVi: string[]
    studyEnvironment: { ideal: string; idealVi: string; avoid: string; avoidVi: string }
}> = {
    INTJ: {
        preferredApproach: 'System-building, conceptual frameworks, independent deep work',
        preferredApproachVi: 'Xây dựng hệ thống, khung khái niệm, làm việc sâu độc lập',
        idealTechniques: ['elaborative_interrogation', 'practice_testing', 'distributed_practice'],
        strengths: ['Strategic planning', 'Synthesizing information', 'Long-term focus'],
        strengthsVi: ['Lập kế hoạch chiến lược', 'Tổng hợp thông tin', 'Tập trung dài hạn'],
        challenges: ['Patience with basics', 'Collaborative learning', 'Requesting help'],
        challengesVi: ['Kiên nhẫn với cơ bản', 'Học hợp tác', 'Yêu cầu giúp đỡ'],
        studyEnvironment: {
            ideal: 'Quiet, structured, minimal interruptions, access to comprehensive resources',
            idealVi: 'Yên tĩnh, có cấu trúc, ít bị gián đoạn, có nguồn tài liệu toàn diện',
            avoid: 'Noisy group settings, surface-level discussions',
            avoidVi: 'Nhóm ồn ào, thảo luận hời hợt'
        }
    },
    INTP: {
        preferredApproach: 'Exploring theoretical possibilities, logical analysis, self-directed inquiry',
        preferredApproachVi: 'Khám phá khả năng lý thuyết, phân tích logic, tự nghiên cứu',
        idealTechniques: ['elaborative_interrogation', 'practice_testing', 'interleaved_practice'],
        strengths: ['Abstract reasoning', 'Problem-solving', 'Pattern recognition'],
        strengthsVi: ['Lập luận trừu tượng', 'Giải quyết vấn đề', 'Nhận dạng mẫu'],
        challenges: ['Completing routine tasks', 'Following structured curricula', 'Deadlines'],
        challengesVi: ['Hoàn thành công việc thường ngày', 'Theo chương trình có cấu trúc', 'Deadline'],
        studyEnvironment: {
            ideal: 'Freedom to explore tangents, access to diverse sources, unstructured time',
            idealVi: 'Tự do khám phá nhánh, tiếp cận nguồn đa dạng, thời gian không cấu trúc',
            avoid: 'Rigid schedules, rote memorization requirements',
            avoidVi: 'Lịch trình cứng nhắc, yêu cầu thuộc lòng'
        }
    },
    ENTJ: {
        preferredApproach: 'Goal-oriented, efficient, structured with clear objectives',
        preferredApproachVi: 'Hướng mục tiêu, hiệu quả, có cấu trúc với mục tiêu rõ ràng',
        idealTechniques: ['practice_testing', 'distributed_practice', 'self_explanation'],
        strengths: ['Leadership in groups', 'Meeting deadlines', 'Organizing material'],
        strengthsVi: ['Lãnh đạo nhóm', 'Đáp ứng deadline', 'Tổ chức tài liệu'],
        challenges: ['Patience with process', 'Accepting feedback', 'Collaborative equals'],
        challengesVi: ['Kiên nhẫn với quy trình', 'Chấp nhận phản hồi', 'Đồng nghiệp bình đẳng'],
        studyEnvironment: {
            ideal: 'Structured, results-oriented, competitive, with clear metrics',
            idealVi: 'Có cấu trúc, hướng kết quả, cạnh tranh, có số liệu rõ ràng',
            avoid: 'Ambiguous goals, lack of structure',
            avoidVi: 'Mục tiêu mơ hồ, thiếu cấu trúc'
        }
    },
    ENTP: {
        preferredApproach: 'Debate, exploration, connecting disparate ideas',
        preferredApproachVi: 'Tranh luận, khám phá, kết nối ý tưởng khác biệt',
        idealTechniques: ['elaborative_interrogation', 'interleaved_practice', 'practice_testing'],
        strengths: ['Quick understanding', 'Creative connections', 'Challenging assumptions'],
        strengthsVi: ['Hiểu nhanh', 'Kết nối sáng tạo', 'Thách thức giả định'],
        challenges: ['Follow-through', 'Routine practice', 'Detail work'],
        challengesVi: ['Theo đuổi đến cùng', 'Luyện tập thường xuyên', 'Công việc chi tiết'],
        studyEnvironment: {
            ideal: 'Dynamic, debate-friendly, variety of topics, intellectual stimulation',
            idealVi: 'Năng động, thân thiện tranh luận, đa dạng chủ đề, kích thích trí tuệ',
            avoid: 'Monotonous repetition, isolation',
            avoidVi: 'Lặp lại đơn điệu, cô lập'
        }
    },
    INFJ: {
        preferredApproach: 'Meaning-focused, connecting to larger purpose, quiet reflection',
        preferredApproachVi: 'Tập trung ý nghĩa, kết nối mục đích lớn, suy ngẫm yên tĩnh',
        idealTechniques: ['elaborative_interrogation', 'self_explanation', 'distributed_practice'],
        strengths: ['Deep understanding', 'Connecting ideas to values', 'Insightful synthesis'],
        strengthsVi: ['Hiểu sâu', 'Kết nối ý tưởng với giá trị', 'Tổng hợp sâu sắc'],
        challenges: ['Perfectionism', 'Overwhelm with details', 'Self-criticism'],
        challengesVi: ['Cầu toàn', 'Quá tải với chi tiết', 'Tự phê bình'],
        studyEnvironment: {
            ideal: 'Quiet, meaningful material, personal relevance, time for reflection',
            idealVi: 'Yên tĩnh, tài liệu có ý nghĩa, liên quan cá nhân, thời gian suy ngẫm',
            avoid: 'Shallow content, competitive environments',
            avoidVi: 'Nội dung hời hợt, môi trường cạnh tranh'
        }
    },
    INFP: {
        preferredApproach: 'Values-aligned, creative expression, self-paced exploration',
        preferredApproachVi: 'Phù hợp giá trị, thể hiện sáng tạo, khám phá theo nhịp riêng',
        idealTechniques: ['elaborative_interrogation', 'self_explanation', 'distributed_practice'],
        strengths: ['Creative interpretation', 'Intrinsic motivation', 'Authenticity'],
        strengthsVi: ['Giải thích sáng tạo', 'Động lực nội tại', 'Chân thực'],
        challenges: ['Structure', 'Deadlines', 'Objective evaluation'],
        challengesVi: ['Cấu trúc', 'Deadline', 'Đánh giá khách quan'],
        studyEnvironment: {
            ideal: 'Personal space, creative freedom, values-aligned content',
            idealVi: 'Không gian riêng, tự do sáng tạo, nội dung phù hợp giá trị',
            avoid: 'Rigid structure, meaningless material',
            avoidVi: 'Cấu trúc cứng nhắc, tài liệu vô nghĩa'
        }
    },
    ENFJ: {
        preferredApproach: 'Group learning, teaching others, inspiring discussions',
        preferredApproachVi: 'Học nhóm, dạy người khác, thảo luận truyền cảm hứng',
        idealTechniques: ['practice_testing', 'self_explanation', 'distributed_practice'],
        strengths: ['Teaching others', 'Group facilitation', 'Connecting to people'],
        strengthsVi: ['Dạy người khác', 'Điều phối nhóm', 'Kết nối với người'],
        challenges: ['Solo work', 'Self-focus', 'Accepting imperfection'],
        challengesVi: ['Làm việc một mình', 'Tập trung bản thân', 'Chấp nhận không hoàn hảo'],
        studyEnvironment: {
            ideal: 'Collaborative, meaningful, with opportunities to help others',
            idealVi: 'Hợp tác, có ý nghĩa, có cơ hội giúp người khác',
            avoid: 'Complete isolation, purely technical content',
            avoidVi: 'Cô lập hoàn toàn, nội dung thuần kỹ thuật'
        }
    },
    ENFP: {
        preferredApproach: 'Enthusiastic exploration, creative connections, variety',
        preferredApproachVi: 'Khám phá nhiệt tình, kết nối sáng tạo, đa dạng',
        idealTechniques: ['elaborative_interrogation', 'interleaved_practice', 'practice_testing'],
        strengths: ['Enthusiasm', 'Creative connections', 'Big picture thinking'],
        strengthsVi: ['Nhiệt tình', 'Kết nối sáng tạo', 'Tư duy toàn cảnh'],
        challenges: ['Focus', 'Routine', 'Follow-through'],
        challengesVi: ['Tập trung', 'Thói quen', 'Theo đuổi đến cùng'],
        studyEnvironment: {
            ideal: 'Dynamic, social, varied content, creative expression',
            idealVi: 'Năng động, xã hội, nội dung đa dạng, thể hiện sáng tạo',
            avoid: 'Monotony, isolation, rigid structure',
            avoidVi: 'Đơn điệu, cô lập, cấu trúc cứng nhắc'
        }
    },
    ISTJ: {
        preferredApproach: 'Systematic, structured, practical applications, step-by-step',
        preferredApproachVi: 'Có hệ thống, có cấu trúc, ứng dụng thực tế, từng bước',
        idealTechniques: ['distributed_practice', 'practice_testing', 'self_explanation'],
        strengths: ['Reliability', 'Detail-oriented', 'Following procedures'],
        strengthsVi: ['Đáng tin cậy', 'Chú trọng chi tiết', 'Tuân theo quy trình'],
        challenges: ['Abstract concepts', 'Changing methods', 'Ambiguity'],
        challengesVi: ['Khái niệm trừu tượng', 'Thay đổi phương pháp', 'Mơ hồ'],
        studyEnvironment: {
            ideal: 'Quiet, organized, clear expectations, proven methods',
            idealVi: 'Yên tĩnh, có tổ chức, kỳ vọng rõ ràng, phương pháp đã kiểm chứng',
            avoid: 'Chaos, unclear goals, constant change',
            avoidVi: 'Hỗn loạn, mục tiêu không rõ ràng, thay đổi liên tục'
        }
    },
    ISFJ: {
        preferredApproach: 'Practical, helpful, structured with clear purpose',
        preferredApproachVi: 'Thực tế, hữu ích, có cấu trúc với mục đích rõ ràng',
        idealTechniques: ['distributed_practice', 'practice_testing', 'self_explanation'],
        strengths: ['Reliability', 'Supportive learning', 'Detail retention'],
        strengthsVi: ['Đáng tin cậy', 'Học hỗ trợ', 'Nhớ chi tiết'],
        challenges: ['Self-advocacy', 'Abstract concepts', 'Change'],
        challengesVi: ['Tự bảo vệ quan điểm', 'Khái niệm trừu tượng', 'Thay đổi'],
        studyEnvironment: {
            ideal: 'Supportive, structured, clear application, small groups',
            idealVi: 'Hỗ trợ, có cấu trúc, ứng dụng rõ ràng, nhóm nhỏ',
            avoid: 'Competitive, abstract, changing expectations',
            avoidVi: 'Cạnh tranh, trừu tượng, kỳ vọng thay đổi'
        }
    },
    ESTJ: {
        preferredApproach: 'Efficient, organized, practical, results-focused',
        preferredApproachVi: 'Hiệu quả, có tổ chức, thực tế, tập trung kết quả',
        idealTechniques: ['practice_testing', 'distributed_practice', 'self_explanation'],
        strengths: ['Organization', 'Meeting deadlines', 'Practical application'],
        strengthsVi: ['Tổ chức', 'Đáp ứng deadline', 'Ứng dụng thực tế'],
        challenges: ['Patience with process', 'Abstract theory', 'Flexibility'],
        challengesVi: ['Kiên nhẫn với quy trình', 'Lý thuyết trừu tượng', 'Linh hoạt'],
        studyEnvironment: {
            ideal: 'Structured, efficient, clear outcomes, no-nonsense',
            idealVi: 'Có cấu trúc, hiệu quả, kết quả rõ ràng, không rườm rà',
            avoid: 'Ambiguity, lack of direction, theoretical only',
            avoidVi: 'Mơ hồ, thiếu định hướng, chỉ lý thuyết'
        }
    },
    ESFJ: {
        preferredApproach: 'Collaborative, structured, supportive, with social connection',
        preferredApproachVi: 'Hợp tác, có cấu trúc, hỗ trợ, có kết nối xã hội',
        idealTechniques: ['practice_testing', 'distributed_practice', 'self_explanation'],
        strengths: ['Group study', 'Helping others learn', 'Organized notes'],
        strengthsVi: ['Học nhóm', 'Giúp người khác học', 'Ghi chú có tổ chức'],
        challenges: ['Independent work', 'Abstract theory', 'Criticism'],
        challengesVi: ['Làm việc độc lập', 'Lý thuyết trừu tượng', 'Phê bình'],
        studyEnvironment: {
            ideal: 'Supportive groups, clear expectations, practical application',
            idealVi: 'Nhóm hỗ trợ, kỳ vọng rõ ràng, ứng dụng thực tế',
            avoid: 'Isolation, conflict, abstract-only content',
            avoidVi: 'Cô lập, xung đột, nội dung chỉ trừu tượng'
        }
    },
    ISTP: {
        preferredApproach: 'Hands-on, practical experimentation, logical analysis',
        preferredApproachVi: 'Thực hành, thí nghiệm thực tế, phân tích logic',
        idealTechniques: ['practice_testing', 'interleaved_practice', 'self_explanation'],
        strengths: ['Practical skills', 'Troubleshooting', 'Independent learning'],
        strengthsVi: ['Kỹ năng thực tế', 'Khắc phục sự cố', 'Học độc lập'],
        challenges: ['Long-term planning', 'Abstract theory', 'Group work'],
        challengesVi: ['Lập kế hoạch dài hạn', 'Lý thuyết trừu tượng', 'Làm việc nhóm'],
        studyEnvironment: {
            ideal: 'Hands-on, flexible, practical problems, independence',
            idealVi: 'Thực hành, linh hoạt, vấn đề thực tế, độc lập',
            avoid: 'Rigid lecture, group dependence, abstract-only',
            avoidVi: 'Bài giảng cứng nhắc, phụ thuộc nhóm, chỉ trừu tượng'
        }
    },
    ISFP: {
        preferredApproach: 'Personal, aesthetic, values-aligned, experiential',
        preferredApproachVi: 'Cá nhân, thẩm mỹ, phù hợp giá trị, trải nghiệm',
        idealTechniques: ['distributed_practice', 'self_explanation', 'elaborative_interrogation'],
        strengths: ['Creative application', 'Personal projects', 'Aesthetic sense'],
        strengthsVi: ['Ứng dụng sáng tạo', 'Dự án cá nhân', 'Cảm quan thẩm mỹ'],
        challenges: ['Structure', 'Competition', 'Abstract theory'],
        challengesVi: ['Cấu trúc', 'Cạnh tranh', 'Lý thuyết trừu tượng'],
        studyEnvironment: {
            ideal: 'Personal space, creative freedom, hands-on, values-aligned',
            idealVi: 'Không gian riêng, tự do sáng tạo, thực hành, phù hợp giá trị',
            avoid: 'Competitive, rigid, theoretical-only',
            avoidVi: 'Cạnh tranh, cứng nhắc, chỉ lý thuyết'
        }
    },
    ESTP: {
        preferredApproach: 'Action-oriented, practical, real-world application',
        preferredApproachVi: 'Hướng hành động, thực tế, ứng dụng thế giới thực',
        idealTechniques: ['practice_testing', 'interleaved_practice', 'self_explanation'],
        strengths: ['Quick learning', 'Practical application', 'Adaptability'],
        strengthsVi: ['Học nhanh', 'Ứng dụng thực tế', 'Khả năng thích ứng'],
        challenges: ['Long-term focus', 'Abstract concepts', 'Routine practice'],
        challengesVi: ['Tập trung dài hạn', 'Khái niệm trừu tượng', 'Luyện tập thường xuyên'],
        studyEnvironment: {
            ideal: 'Active, hands-on, immediate feedback, variety',
            idealVi: 'Năng động, thực hành, phản hồi ngay lập tức, đa dạng',
            avoid: 'Long lectures, theoretical-only, monotony',
            avoidVi: 'Bài giảng dài, chỉ lý thuyết, đơn điệu'
        }
    },
    ESFP: {
        preferredApproach: 'Fun, social, experiential, varied activities',
        preferredApproachVi: 'Vui vẻ, xã hội, trải nghiệm, hoạt động đa dạng',
        idealTechniques: ['interleaved_practice', 'practice_testing', 'distributed_practice'],
        strengths: ['Social learning', 'Practical skills', 'Energy'],
        strengthsVi: ['Học xã hội', 'Kỹ năng thực tế', 'Năng lượng'],
        challenges: ['Focus', 'Routine', 'Long-term planning'],
        challengesVi: ['Tập trung', 'Thói quen', 'Lập kế hoạch dài hạn'],
        studyEnvironment: {
            ideal: 'Social, active, fun, immediate application',
            idealVi: 'Xã hội, năng động, vui vẻ, ứng dụng ngay',
            avoid: 'Isolation, monotony, theory-heavy',
            avoidVi: 'Cô lập, đơn điệu, nhiều lý thuyết'
        }
    }
}

// ============================================
// MAIN SERVICE FUNCTIONS
// ============================================

/**
 * Option 1: Get VIA-based intervention recommendations
 * Uses user's VIA strengths to compensate for DASS symptoms
 */
export function getVIAInterventionRecommendations(
    viaStrengths: Record<string, number>,  // percentiles
    dassProfile: { D: number; A: number; S: number }  // raw scores
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
 * Option 1: Get evidence-based treatments with VIA boosts
 */
export function getEvidenceBasedTreatments(
    dassProfile: { D: number; A: number; S: number },
    viaStrengths?: Record<string, number>
): EvidenceBasedTreatment[] {
    const treatments: EvidenceBasedTreatment[] = []

    // Find relevant disorders based on DASS
    const relevantDisorders = BIG5_DISORDER_MAPPINGS.filter(d => {
        if (dassProfile.D >= 14 && d.disorder.toLowerCase().includes('depress')) return true
        if (dassProfile.A >= 10 && d.disorder.toLowerCase().includes('anxiety')) return true
        return false
    })

    for (const disorder of relevantDisorders.slice(0, 3)) {
        const treatment: EvidenceBasedTreatment = {
            disorder: disorder.disorder,
            disorderVi: disorder.disorderVi,
            treatments: [],
            viaBoosts: [],
            transdiagnosticTargets: []
        }

        // Add treatments with effect sizes
        if (disorder.treatmentEffectSizes.cbt) {
            treatment.treatments.push({
                name: 'Cognitive Behavioral Therapy (CBT)',
                nameVi: 'Liệu pháp Nhận thức Hành vi (CBT)',
                effectSize: disorder.treatmentEffectSizes.cbt,
                evidenceLevel: 'A',
                recommendation: `Well-established treatment with effect size g=${disorder.treatmentEffectSizes.cbt}`,
                recommendationVi: `Liệu pháp đã được chứng minh với hiệu ứng g=${disorder.treatmentEffectSizes.cbt}`
            })
        }

        if (disorder.treatmentEffectSizes.other) {
            for (const other of disorder.treatmentEffectSizes.other) {
                treatment.treatments.push({
                    name: other.name,
                    nameVi: other.name === 'Behavioral Activation' ? 'Kích hoạt Hành vi'
                        : other.name === 'Exercise' ? 'Tập thể dục'
                            : other.name,
                    effectSize: other.effect,
                    evidenceLevel: other.effect >= 0.7 ? 'A' : 'B',
                    recommendation: `Effect size g=${other.effect}`,
                    recommendationVi: `Hiệu ứng g=${other.effect}`
                })
            }
        }

        // Add VIA boosts if available
        if (viaStrengths) {
            treatment.viaBoosts = getVIAInterventionRecommendations(viaStrengths, dassProfile)
        }

        // Add transdiagnostic targets
        const relevantProcesses = TRANSDIAGNOSTIC_PROCESSES.filter(p => {
            const depressionCorr = p.disorderCorrelations.depression
            const anxietyCorr = p.disorderCorrelations.anxiety
            return (dassProfile.D >= 14 && depressionCorr > 0.3) ||
                (dassProfile.A >= 10 && anxietyCorr > 0.3)
        })

        for (const process of relevantProcesses.slice(0, 3)) {
            treatment.transdiagnosticTargets.push({
                process: process.name,
                processVi: process.nameVi,
                correlation: Math.max(process.disorderCorrelations.depression, process.disorderCorrelations.anxiety),
                interventions: process.interventions
            })
        }

        treatments.push(treatment)
    }

    return treatments
}

/**
 * Option 2: Get MBTI-personalized learning recommendations
 */
export function getMBTILearningProfile(mbtiType: string): MBTILearningProfile | null {
    const typeUpper = mbtiType.toUpperCase()
    const prefs = MBTI_LEARNING_PREFERENCES[typeUpper]
    if (!prefs) return null

    const mbtiInfo = MBTI_TYPES.find(t => t.code === typeUpper)
    if (!mbtiInfo) return null

    // Get technique details with compatibility scores
    const recommendedTechniques = prefs.idealTechniques.map((techId, index) => {
        const technique = LEARNING_TECHNIQUES.find(t => t.id === techId)
        if (!technique) return null

        // Higher rank = higher compatibility
        const compatibilityScore = 100 - (index * 15)

        return {
            techniqueId: techId,
            techniqueName: technique.name,
            techniqueNameVi: technique.nameVi,
            effectSize: technique.effectSize || 0,
            compatibilityScore,
            whyCompatible: getWhyCompatible(typeUpper, techId),
            whyCompatibleVi: getWhyCompatibleVi(typeUpper, techId)
        }
    }).filter((t): t is NonNullable<typeof t> => t !== null)

    return {
        mbtiType: typeUpper,
        typeName: mbtiInfo.name,
        typeNameVi: mbtiInfo.nameVi,
        learningStyle: {
            preferredApproach: prefs.preferredApproach,
            preferredApproachVi: prefs.preferredApproachVi,
            strengths: prefs.strengths,
            strengthsVi: prefs.strengthsVi,
            challenges: prefs.challenges,
            challengesVi: prefs.challengesVi
        },
        recommendedTechniques,
        studyEnvironment: prefs.studyEnvironment,
        cognitiveFunction: {
            dominant: mbtiInfo.cognitiveStack[0],
            auxiliary: mbtiInfo.cognitiveStack[1],
            implication: `Your ${mbtiInfo.cognitiveStack[0]} dominant function means you process information ${getCognitiveFunctionImplication(mbtiInfo.cognitiveStack[0])}`,
            implicationVi: `Chức năng chủ đạo ${mbtiInfo.cognitiveStack[0]} có nghĩa bạn xử lý thông tin ${getCognitiveFunctionImplicationVi(mbtiInfo.cognitiveStack[0])}`
        }
    }
}

// Helper functions
function getWhyCompatible(mbtiType: string, techniqueId: string): string {
    const mappings: Record<string, Record<string, string>> = {
        'elaborative_interrogation': {
            'INTJ': 'Matches your drive to understand systems deeply',
            'INTP': 'Satisfies your need to explore logical connections',
            'INFJ': 'Connects learning to deeper meaning',
            'default': 'Engages analytical thinking'
        },
        'practice_testing': {
            'ENTJ': 'Provides clear metrics for progress',
            'ESTJ': 'Offers structured, measurable outcomes',
            'ISTJ': 'Confirms retention systematically',
            'default': 'Validates understanding'
        },
        'distributed_practice': {
            'ISTJ': 'Fits your preference for consistent routines',
            'ISFJ': 'Builds reliable, long-term habits',
            'INTJ': 'Supports strategic, long-term planning',
            'default': 'Builds lasting knowledge'
        }
    }
    return mappings[techniqueId]?.[mbtiType] || mappings[techniqueId]?.['default'] || 'Matches your learning style'
}

function getWhyCompatibleVi(mbtiType: string, techniqueId: string): string {
    const mappings: Record<string, Record<string, string>> = {
        'elaborative_interrogation': {
            'INTJ': 'Phù hợp nhu cầu hiểu hệ thống sâu',
            'INTP': 'Thỏa mãn nhu cầu khám phá logic',
            'INFJ': 'Kết nối học tập với ý nghĩa sâu xa',
            'default': 'Thu hút tư duy phân tích'
        },
        'practice_testing': {
            'ENTJ': 'Cung cấp số liệu rõ ràng về tiến độ',
            'ESTJ': 'Kết quả có cấu trúc, đo lường được',
            'ISTJ': 'Xác nhận ghi nhớ có hệ thống',
            'default': 'Xác nhận hiểu biết'
        },
        'distributed_practice': {
            'ISTJ': 'Phù hợp với thói quen nhất quán',
            'ISFJ': 'Xây dựng thói quen đáng tin cậy, lâu dài',
            'INTJ': 'Hỗ trợ lập kế hoạch chiến lược dài hạn',
            'default': 'Xây dựng kiến thức lâu bền'
        }
    }
    return mappings[techniqueId]?.[mbtiType] || mappings[techniqueId]?.['default'] || 'Phù hợp với phong cách học của bạn'
}

function getCognitiveFunctionImplication(dominant: string): string {
    const map: Record<string, string> = {
        'Ni': 'through abstract patterns and future possibilities',
        'Ne': 'by exploring multiple possibilities and connections',
        'Si': 'through detailed comparison with past experience',
        'Se': 'through hands-on, immediate experience',
        'Ti': 'through logical analysis and categorization',
        'Te': 'through systematic organization and efficiency',
        'Fi': 'by connecting to personal values and meaning',
        'Fe': 'by considering social harmony and others\' needs'
    }
    return map[dominant] || 'in your unique way'
}

function getCognitiveFunctionImplicationVi(dominant: string): string {
    const map: Record<string, string> = {
        'Ni': 'qua các mẫu trừu tượng và khả năng tương lai',
        'Ne': 'bằng cách khám phá nhiều khả năng và kết nối',
        'Si': 'qua so sánh chi tiết với kinh nghiệm quá khứ',
        'Se': 'qua trải nghiệm thực hành, ngay lập tức',
        'Ti': 'qua phân tích logic và phân loại',
        'Te': 'qua tổ chức có hệ thống và hiệu quả',
        'Fi': 'bằng cách kết nối với giá trị cá nhân và ý nghĩa',
        'Fe': 'bằng cách xem xét hài hòa xã hội và nhu cầu người khác'
    }
    return map[dominant] || 'theo cách riêng của bạn'
}

// ============================================
// OPTION 3: TRANSDIAGNOSTIC PROCESS TARGETING
// ============================================

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

const TRANSDIAGNOSTIC_INTERVENTIONS_VI: Record<string, { name: string; howToApply: string }[]> = {
    rumination: [
        { name: 'Tái tập trung Chú ý', howToApply: 'Khi nhận thấy suy nghĩ lặp đi lặp lại, chuyển chú ý sang hoạt động cụ thể trong 5 phút' },
        { name: 'Hành vi Kích hoạt', howToApply: 'Lên lịch hoạt động thú vị để ngắt chu kỳ suy nghĩ tiêu cực' },
        { name: 'Viết Nhật ký Có cấu trúc', howToApply: 'Viết trong 20 phút về nỗi lo, sau đó đóng sổ và không nghĩ thêm' }
    ],
    avoidance: [
        { name: 'Tiếp xúc Dần dần', howToApply: 'Tạo danh sách sợ hãi từ nhẹ đến nặng, bắt đầu với mức dễ nhất' },
        { name: 'Thư giãn Ứng dụng', howToApply: 'Học kỹ thuật thư giãn trước khi đối mặt tình huống sợ hãi' },
        { name: 'Thử nghiệm Hành vi', howToApply: 'Thử xem điều tồi tệ có xảy ra không khi đối mặt tình huống' }
    ],
    suppression: [
        { name: 'Kỹ thuật Tách rời Nhận thức', howToApply: 'Nhận thấy suy nghĩ như là suy nghĩ, không phải sự thật - "Tôi đang có suy nghĩ rằng..."' },
        { name: 'Chánh niệm', howToApply: 'Quan sát suy nghĩ mà không phán xét, để chúng đi qua như mây trên trời' },
        { name: 'Chấp nhận Suy nghĩ', howToApply: 'Cho phép suy nghĩ không mong muốn tồn tại mà không cố gắng kiểm soát' }
    ],
    worry: [
        { name: 'Thời gian Lo lắng Có lịch', howToApply: 'Dành 20 phút mỗi ngày để lo lắng, ngoài thời gian đó hoãn lại' },
        { name: 'Viết Kịch bản Tồi tệ Nhất', howToApply: 'Viết chi tiết điều tồi tệ nhất có thể xảy ra, sau đó lập kế hoạch đối phó' },
        { name: 'Phân biệt Lo lắng Có ích vs Vô ích', howToApply: 'Hỏi: Lo lắng này có giúp tôi giải quyết vấn đề không?' }
    ],
    perfectionism: [
        { name: 'Thử nghiệm Không hoàn hảo', howToApply: 'Cố ý làm một việc "đủ tốt" thay vì hoàn hảo và quan sát kết quả' },
        { name: 'Tự Từ bi', howToApply: 'Nói với bản thân như nói với người bạn đang gặp khó khăn' },
        { name: 'Làm rõ Giá trị', howToApply: 'Xác định điều gì thực sự quan trọng, không chỉ là tiêu chuẩn bên ngoài' }
    ],
    intolerance_uncertainty: [
        { name: 'Tiếp xúc với Không chắc chắn', howToApply: 'Cố ý tạo tình huống nhỏ không chắc chắn và quan sát cảm xúc' },
        { name: 'Đánh giá Xác suất Thực tế', howToApply: 'Ước tính xác suất thực sự của điều tồi tệ xảy ra' },
        { name: 'Liệu pháp Siêu nhận thức', howToApply: 'Nhận ra lo lắng về lo lắng và buông bỏ nhu cầu kiểm soát' }
    ]
}

export function getTransdiagnosticRecommendations(
    big5: { O: number; C: number; E: number; A: number; N: number }
): TransdiagnosticRecommendation[] {
    const { TRANSDIAGNOSTIC_PROCESSES } = require('@/constants/knowledge/clinical-psychology')
    const recommendations: TransdiagnosticRecommendation[] = []

    for (const process of TRANSDIAGNOSTIC_PROCESSES) {
        // Calculate risk based on Big5 correlations
        let riskScore = 0
        riskScore += (big5.N / 100) * Math.abs(process.big5Correlations.N)
        riskScore += ((100 - big5.E) / 100) * Math.abs(process.big5Correlations.E) * (process.big5Correlations.E < 0 ? 1 : -1)
        riskScore += ((100 - big5.C) / 100) * Math.abs(process.big5Correlations.C) * (process.big5Correlations.C < 0 ? 1 : -1)

        const riskLevel = riskScore > 0.5 ? 'high' : riskScore > 0.3 ? 'moderate' : 'low'

        if (riskLevel !== 'low') {
            const interventionsVi = TRANSDIAGNOSTIC_INTERVENTIONS_VI[process.id] || []

            recommendations.push({
                process: {
                    id: process.id,
                    name: process.name,
                    nameVi: process.nameVi,
                    descriptionVi: process.descriptionVi,
                    riskLevel
                },
                correlations: {
                    depression: process.disorderCorrelations.depression,
                    anxiety: process.disorderCorrelations.anxiety
                },
                interventions: process.interventions.slice(0, 3).map((name: string, i: number) => ({
                    name,
                    nameVi: interventionsVi[i]?.name || name,
                    howToApply: interventionsVi[i]?.howToApply || ''
                })),
                source: 'Aldao et al. (2010). DOI: 10.1016/j.cpr.2009.11.004'
            })
        }
    }

    return recommendations.sort((a, b) => {
        const order = { high: 3, moderate: 2, low: 1 }
        return order[b.process.riskLevel] - order[a.process.riskLevel]
    })
}

// ============================================
// OPTION 4: DASS SEVERITY-BASED INTERVENTIONS
// ============================================

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

const SEVERITY_VI: Record<string, string> = {
    'normal': 'Bình thường',
    'mild': 'Nhẹ',
    'moderate': 'Trung bình',
    'severe': 'Nặng',
    'extremely_severe': 'Cực kỳ nặng'
}

const URGENCY_VI: Record<string, string> = {
    'routine': 'Thường quy',
    'priority': 'Ưu tiên',
    'urgent': 'Khẩn cấp',
    'emergency': 'Cấp cứu'
}

const SCALE_VI: Record<string, string> = {
    'depression': 'Trầm cảm',
    'anxiety': 'Lo âu',
    'stress': 'Căng thẳng'
}

export function getDASSSeverityRecommendations(
    dassProfile: { D: number; A: number; S: number }
): DASSSeverityRecommendation[] {
    const { DASS21_SCALES, DASS21_INTERVENTIONS } = require('@/constants/knowledge/dass21-knowledge')
    const results: DASSSeverityRecommendation[] = []

    const profiles = [
        { scale: 'depression' as const, score: dassProfile.D },
        { scale: 'anxiety' as const, score: dassProfile.A },
        { scale: 'stress' as const, score: dassProfile.S }
    ]

    for (const { scale, score } of profiles) {
        const scaleInfo = DASS21_SCALES.find((s: { id: string }) => s.id === scale)
        if (!scaleInfo) continue

        // Determine severity
        let severity: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe' = 'normal'
        const cutoffs = scaleInfo.severityCutoffs

        if (score >= cutoffs.extremely_severe[0]) severity = 'extremely_severe'
        else if (score >= cutoffs.severe[0]) severity = 'severe'
        else if (score >= cutoffs.moderate[0]) severity = 'moderate'
        else if (score >= cutoffs.mild[0]) severity = 'mild'

        // Get intervention for this severity
        const intervention = DASS21_INTERVENTIONS.find(
            (i: { scale: string; severity: string }) => i.scale === scale && i.severity === severity
        )

        if (severity !== 'normal') {
            results.push({
                scale,
                scaleVi: SCALE_VI[scale],
                severity,
                severityVi: SEVERITY_VI[severity],
                score,
                recommendations: intervention?.recommendations || [],
                recommendationsVi: intervention?.recommendationsVi || [],
                referralIndicated: intervention?.referralIndicated || severity === 'severe' || severity === 'extremely_severe',
                referralVi: intervention?.referralVi,
                urgency: intervention?.urgency || 'routine',
                urgencyVi: URGENCY_VI[intervention?.urgency || 'routine']
            })
        }
    }

    return results.sort((a, b) => {
        const order = { extremely_severe: 5, severe: 4, moderate: 3, mild: 2, normal: 1 }
        return order[b.severity] - order[a.severity]
    })
}

// ============================================
// OPTION 5: EXPANDED VIA (14 MORE STRENGTHS)
// ============================================

// Add remaining 14 VIA strengths to compensation map
const VIA_DASS_COMPENSATION_EXPANDED: Record<string, {
    targetSymptoms: string[]
    compensationMechanism: string
    compensationMechanismVi: string
    effectivenessRating: number
}> = {
    // Already in original map: hope, zest, gratitude, self_regulation, love, curiosity, perseverance, humor, bravery, social_intelligence

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
    honesty: {
        targetSymptoms: ['Depression', 'Inauthenticity', 'Social anxiety'],
        compensationMechanism: 'Authenticity reduces cognitive dissonance; genuine expression builds connection',
        compensationMechanismVi: 'Chân thật giảm bất hòa nhận thức; thể hiện chân thực xây dựng kết nối',
        effectivenessRating: 3
    },
    kindness: {
        targetSymptoms: ['Depression', 'Self-focus', 'Isolation'],
        compensationMechanism: 'Helping others provides meaning; reduces self-focused rumination',
        compensationMechanismVi: 'Giúp đỡ người khác tạo ý nghĩa; giảm suy nghĩ tự tập trung',
        effectivenessRating: 4
    },
    teamwork: {
        targetSymptoms: ['Depression', 'Isolation', 'Purposelessness'],
        compensationMechanism: 'Group belonging provides support; shared purpose combats isolation',
        compensationMechanismVi: 'Thuộc về nhóm cung cấp hỗ trợ; mục đích chung chống cô lập',
        effectivenessRating: 3
    },
    fairness: {
        targetSymptoms: ['Stress', 'Anger', 'Injustice sensitivity'],
        compensationMechanism: 'Commitment to fairness provides moral anchor; reduces helplessness',
        compensationMechanismVi: 'Cam kết công bằng cung cấp neo đạo đức; giảm bất lực',
        effectivenessRating: 2
    },
    leadership: {
        targetSymptoms: ['Depression', 'Powerlessness', 'Low self-efficacy'],
        compensationMechanism: 'Taking charge builds agency; organizing others provides purpose',
        compensationMechanismVi: 'Đảm nhiệm xây dựng tự chủ; tổ chức người khác tạo mục đích',
        effectivenessRating: 3
    },
    forgiveness: {
        targetSymptoms: ['Anger', 'Resentment', 'Chronic stress'],
        compensationMechanism: 'Releasing grudges reduces stress; forgiveness frees emotional resources',
        compensationMechanismVi: 'Buông bỏ oán giận giảm căng thẳng; tha thứ giải phóng nguồn lực cảm xúc',
        effectivenessRating: 4
    },
    humility: {
        targetSymptoms: ['Anxiety', 'Performance pressure', 'Perfectionism'],
        compensationMechanism: 'Accepting limitations reduces pressure; humility allows help-seeking',
        compensationMechanismVi: 'Chấp nhận hạn chế giảm áp lực; khiêm tốn cho phép tìm kiếm giúp đỡ',
        effectivenessRating: 3
    },
    prudence: {
        targetSymptoms: ['Anxiety', 'Impulsivity', 'Regret'],
        compensationMechanism: 'Careful planning reduces anxiety; prevents impulsive decisions',
        compensationMechanismVi: 'Lập kế hoạch cẩn thận giảm lo âu; ngăn quyết định bốc đồng',
        effectivenessRating: 3
    },
    appreciation_of_beauty: {
        targetSymptoms: ['Depression', 'Anhedonia', 'Meaninglessness'],
        compensationMechanism: 'Awe experiences counter depression; beauty appreciation activates positive emotions',
        compensationMechanismVi: 'Trải nghiệm kinh ngạc chống trầm cảm; trân trọng vẻ đẹp kích hoạt cảm xúc tích cực',
        effectivenessRating: 3
    },
    spirituality: {
        targetSymptoms: ['Depression', 'Meaninglessness', 'Existential anxiety'],
        compensationMechanism: 'Transcendent meaning provides hope; spiritual practices reduce anxiety',
        compensationMechanismVi: 'Ý nghĩa siêu việt cung cấp hy vọng; thực hành tâm linh giảm lo âu',
        effectivenessRating: 4
    }
}

// Merge all VIA mappings
const FULL_VIA_DASS_MAP = { ...VIA_DASS_COMPENSATION_MAP, ...VIA_DASS_COMPENSATION_EXPANDED }

export function getFullVIAInterventionRecommendations(
    viaStrengths: Record<string, number>,
    dassProfile: { D: number; A: number; S: number }
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
        const compensation = FULL_VIA_DASS_MAP[strengthId]
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

// ============================================
// OPTION 6: FLOW STATE INTEGRATION
// ============================================

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

export function getFlowStateRecommendations(
    big5: { O: number; C: number; E: number; A: number; N: number }
): FlowStateRecommendation[] {
    const recommendations: FlowStateRecommendation[] = []

    // Determine which flow conditions might be challenged based on Big5
    for (const condition of FLOW_STATE_CONDITIONS.slice(0, 5)) { // Top 5 most important
        let status: 'blocked' | 'improving' | 'optimal' = 'improving'

        // Analyze Big5 impact on this flow condition
        if (condition.id === 'challenge_skill_balance') {
            if (big5.N > 70) status = 'blocked' // High anxiety disrupts balance
            else if (big5.C > 70) status = 'optimal' // High C helps maintain
        }
        else if (condition.id === 'clear_goals') {
            if (big5.C > 70) status = 'optimal'
            else if (big5.C < 40) status = 'blocked'
        }
        else if (condition.id === 'concentration') {
            if (big5.N > 70 || big5.E > 80) status = 'blocked'
            else if (big5.C > 60 && big5.N < 50) status = 'optimal'
        }

        recommendations.push({
            condition: {
                id: condition.id,
                name: condition.name,
                nameVi: condition.nameVi
            },
            currentStatus: status,
            tips: condition.howToAchieve || [],
            tipsVi: condition.howToAchieveVi || [],
            blockers: condition.blockers || [],
            blockersVi: condition.blockersVi || []
        })
    }

    return recommendations
}

// ============================================
// OPTION 7: EXERCISE MENTAL HEALTH EFFECTS
// ============================================

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

export function getExerciseMentalHealthEffects(
    dassProfile: { D: number; A: number; S: number }
): ExerciseMentalHealthRecommendation[] {
    const recommendations: ExerciseMentalHealthRecommendation[] = []

    // Get relevant exercise recommendations based on DASS profile
    for (const effect of EXERCISE_MENTAL_HEALTH || []) {
        const isRelevant =
            (dassProfile.D >= 10 && effect.condition.toLowerCase().includes('depress')) ||
            (dassProfile.A >= 8 && effect.condition.toLowerCase().includes('anxiety')) ||
            (dassProfile.S >= 15 && effect.condition.toLowerCase().includes('stress'))

        if (isRelevant) {
            recommendations.push({
                condition: effect.condition,
                conditionVi: effect.conditionVi,
                effectSize: effect.effectSize,
                dosage: effect.dosage,
                dosageVi: effect.dosageVi,
                mechanism: effect.mechanism,
                mechanismVi: effect.mechanismVi,
                source: effect.source
            })
        }
    }

    return recommendations
}

// ============================================
// OPTION 8: COMPREHENSIVE AI CONTEXT BUILDER
// ============================================

export interface ComprehensiveKnowledgeContext {
    transdiagnostic: TransdiagnosticRecommendation[]
    dassSeverity: DASSSeverityRecommendation[]
    viaInterventions: VIAInterventionRecommendation[]
    flowState: FlowStateRecommendation[]
    exerciseEffects: ExerciseMentalHealthRecommendation[]
    mbtiLearning: MBTILearningProfile | null
}

export function buildComprehensiveAIContext(
    big5: { O: number; C: number; E: number; A: number; N: number },
    dassProfile: { D: number; A: number; S: number },
    viaStrengths: Record<string, number>,
    mbtiType?: string
): string {
    let context = '\n--- BỐI CẢNH NGHIÊN CỨU TOÀN DIỆN ---\n'

    // 1. DASS Severity
    const dassSeverity = getDASSSeverityRecommendations(dassProfile)
    if (dassSeverity.length > 0) {
        context += '\n📊 MỨC ĐỘ NGHIÊM TRỌNG (DASS-21, Lovibond 1995):\n'
        for (const rec of dassSeverity) {
            context += `• ${rec.scaleVi}: ${rec.severityVi} (${rec.score}) - ${rec.urgencyVi}\n`
            if (rec.recommendationsVi.length > 0) {
                context += `  Khuyến nghị: ${rec.recommendationsVi[0]}\n`
            }
        }
    }

    // 2. Transdiagnostic Processes
    const transdiagnostic = getTransdiagnosticRecommendations(big5)
    if (transdiagnostic.length > 0) {
        context += '\n🎯 QUÁ TRÌNH XUYÊN CHẨN ĐOÁN (Aldao 2010):\n'
        for (const rec of transdiagnostic.slice(0, 3)) {
            context += `• ${rec.process.nameVi}: Rủi ro ${rec.process.riskLevel === 'high' ? 'CAO' : 'TRUNG BÌNH'}\n`
            if (rec.interventions.length > 0 && rec.interventions[0].howToApply) {
                context += `  Can thiệp: ${rec.interventions[0].nameVi} - ${rec.interventions[0].howToApply}\n`
            }
        }
    }

    // 3. VIA Interventions
    const viaInterventions = getFullVIAInterventionRecommendations(viaStrengths, dassProfile)
    if (viaInterventions.length > 0) {
        context += '\n💪 SỨC MẠNH VIA CÓ THỂ GIÚP (Seligman 2005):\n'
        for (const rec of viaInterventions.slice(0, 3)) {
            context += `• ${rec.viaStrength.nameVi} (${rec.viaStrength.userPercentile}%): ${rec.interventionStrategy.descriptionVi}\n`
        }
    }

    // 4. MBTI Learning (if available)
    if (mbtiType) {
        const mbtiProfile = getMBTILearningProfile(mbtiType)
        if (mbtiProfile) {
            context += `\n📚 PHONG CÁCH HỌC TẬP ${mbtiType} (McCrae 1989):\n`
            context += `• Tiếp cận: ${mbtiProfile.learningStyle.preferredApproachVi}\n`
            context += `• Điểm mạnh: ${mbtiProfile.learningStyle.strengthsVi.join(', ')}\n`
        }
    }

    // 5. Exercise recommendations if needed
    if (dassProfile.D >= 10 || dassProfile.A >= 8 || dassProfile.S >= 15) {
        context += '\n🏃 VẬN ĐỘNG CHO SỨC KHỎE TÂM THẦN (Schuch 2016):\n'
        context += `• Tập thể dục có hiệu ứng SMD=-0.80 trong giảm trầm cảm\n`
        context += `• 150 phút/tuần cường độ vừa hoặc 75 phút/tuần cường độ cao\n`
    }

    context += '\n--- HẾT BỐI CẢNH ---\n'
    return context
}

// ============================================
// EXPORTS
// ============================================

export const enhancedInterventionService = {
    // Original Options 1-2
    getVIAInterventionRecommendations,
    getEvidenceBasedTreatments,
    getMBTILearningProfile,
    // Options 3-5
    getTransdiagnosticRecommendations,
    getDASSSeverityRecommendations,
    getFullVIAInterventionRecommendations,
    // Options 6-8
    getFlowStateRecommendations,
    getExerciseMentalHealthEffects,
    buildComprehensiveAIContext
}

export default enhancedInterventionService
