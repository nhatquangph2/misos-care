/**
 * MBTI Learning Style Module
 * Personalized learning recommendations based on MBTI type
 * 
 * SOURCES:
 * - McCrae & Costa (1989) DOI: 10.1111/j.1467-6494.1989.tb00759.x
 */

import { MBTI_TYPES } from '@/constants/knowledge/mbti-knowledge'
import { LEARNING_TECHNIQUES } from '@/constants/knowledge/learning-sciences'
import type { MBTILearningProfile } from './types'

// MBTI Learning Style Mapping
const MBTI_LEARNING_PREFERENCES: Record<string, {
    preferredApproach: string
    preferredApproachVi: string
    idealTechniques: string[]
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

/**
 * Get MBTI-personalized learning recommendations
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
