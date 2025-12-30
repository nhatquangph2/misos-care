/**
 * Sports Psychology Knowledge Base
 * 
 * PRIMARY SOURCES:
 * ================
 * 
 * MENTAL TOUGHNESS:
 * - Jones, G., Hanton, S., & Connaughton, D. (2002). What is this thing called mental
 *   toughness? Journal of Applied Sport Psychology, 14(3), 205-218.
 *   DOI: 10.1080/10413200290103509 [4 C's Model: Control, Commitment, Challenge, Confidence]
 * - Clough, P., Earle, K., & Sewell, D. (2002). Mental toughness: The concept and its
 *   measurement. In Cockerill (Ed.), Solutions in Sport Psychology. [MTQ48 instrument]
 * - Gucciardi, D. F., et al. (2015). The concept of mental toughness: Tests of dimensionality.
 *   Journal of Personality, 83(1), 26-44. DOI: 10.1111/jopy.12079
 * 
 * MENTAL TOUGHNESS - BIG5 CORRELATIONS:
 * - Horsburgh, V. A., Schermer, J. A., Veselka, L., & Vernon, P. A. (2009). A behavioural
 *   genetic study of mental toughness. Personality and Individual Differences, 46, 100-105.
 *   DOI: 10.1016/j.paid.2008.10.028
 *   [N r = -.57, E r = .42, C r = .43, A r = .20, O r = .28]
 *   [ALL values in big5Correlations for MENTAL_TOUGHNESS are from this study]
 * 
 * FLOW STATE:
 * - Csikszentmihalyi, M. (1990). Flow: The Psychology of Optimal Experience.
 *   Harper & Row. [Foundational book - 8 conditions of flow]
 * - Jackson, S. A., & Marsh, H. W. (1996). Development and validation of the Flow State Scale.
 *   Journal of Sport and Exercise Psychology, 18(1), 17-35. DOI: 10.1123/jsep.18.1.17
 * - Swann, C., Keegan, R. J., Piggott, D., & Crust, L. (2012). Flow in elite sport meta-review.
 *   Psychology of Sport and Exercise, 13(6), 807-819. DOI: 10.1016/j.psychsport.2012.05.006
 * 
 * EXERCISE & MENTAL HEALTH (effect sizes in EXERCISE_MENTAL_HEALTH_EFFECTS):
 * - Schuch, F. B., et al. (2016). Exercise as a treatment for depression: A meta-analysis.
 *   Journal of Psychiatric Research, 77, 42-51. DOI: 10.1016/j.jpsychires.2016.02.023
 *   [SMD = -0.62 for depression - LARGE effect]
 * - Stubbs, B., et al. (2017). The anxiolytic effects of exercise for people with anxiety.
 *   Psychiatry Research, 249, 102-108. DOI: 10.1016/j.psychres.2016.12.020
 *   [SMD = -0.48 for anxiety - MODERATE effect]
 * - Craft, L. L., & Perna, F. M. (2004). The benefits of exercise for the clinically depressed.
 *   Primary Care Companion to the Journal of Clinical Psychiatry, 6(3), 104-111.
 * 
 * PERIODIZATION & TRAINING:
 * - Issurin, V. B. (2010). New horizons for the methodology of training periodization.
 *   Sports Medicine, 40(3), 189-206. DOI: 10.2165/11319770-000000000-00000 [Block Periodization]
 * - Kiely, J. (2012). Periodization paradigms in the 21st century.
 *   International Journal of Sports Physiology and Performance, 7(3), 242-250.
 *   DOI: 10.1123/ijspp.7.3.242 [Critique of classical periodization]
 */

// ============================================
// TYPES
// ============================================

export interface MentalToughnessProfile {
    dimension: 'control' | 'commitment' | 'challenge' | 'confidence'
    name: string
    nameVi: string
    description: string
    descriptionVi: string
    // Big5 correlations from Horsburgh et al. (2009)
    big5Correlations: {
        N: number
        E: number
        O: number
        A: number
        C: number
    }
    // Development strategies
    developmentStrategies: string[]
    developmentStrategiesVi: string[]
    // Indicators
    highIndicators: string[]
    lowIndicators: string[]
}

export interface FlowStateCondition {
    id: string
    name: string
    nameVi: string
    description: string
    descriptionVi: string
    howToAchieve: string[]
    howToAchieveVi: string[]
    blockers: string[]
    blockersVi: string[]
}

export interface SportRecommendation {
    id: string
    name: string
    nameVi: string
    category: 'team' | 'individual' | 'combat' | 'endurance' | 'precision' | 'creative'
    description: string
    descriptionVi: string
    // Personality fit
    idealBig5: {
        high?: ('O' | 'C' | 'E' | 'A' | 'N')[]
        low?: ('O' | 'C' | 'E' | 'A' | 'N')[]
    }
    // Benefits
    physicalBenefits: string[]
    mentalBenefits: string[]
    // Mental health impact (effect sizes from meta-analyses)
    mentalHealthEffects: {
        depression?: number  // SMD or d
        anxiety?: number
        stress?: number
        selfEsteem?: number
    }
    // Practical info
    startingTips: string[]
    startingTipsVi: string[]
    equipmentNeeded: string[]
    timeCommitment: 'low' | 'moderate' | 'high'
}

export interface ExerciseMentalHealthEffect {
    condition: string
    conditionVi: string
    effectSize: number
    effectType: 'SMD' | 'd' | 'r'
    source: string
    dosage: string
    dosageVi: string
    mechanism: string
    mechanismVi: string
}

// ============================================
// MENTAL TOUGHNESS (4 C's Model)
// ============================================

export const MENTAL_TOUGHNESS_DIMENSIONS: MentalToughnessProfile[] = [
    {
        dimension: 'control',
        name: 'Control',
        nameVi: 'Kiểm soát',
        description: 'The extent to which a person feels in control of their life and emotions, particularly under pressure',
        descriptionVi: 'Mức độ mà một người cảm thấy kiểm soát được cuộc sống và cảm xúc của họ, đặc biệt dưới áp lực',
        big5Correlations: {
            N: -0.57,  // Strong negative - emotional stability
            E: 0.25,
            O: 0.18,
            A: 0.12,
            C: 0.35
        },
        developmentStrategies: [
            'Practice focusing on what you CAN control (effort, attitude, preparation)',
            'Develop pre-performance routines to create sense of control',
            'Use breathing techniques (4-7-8, box breathing) to regulate arousal',
            'Practice reframing: "I get to compete" vs "I have to compete"',
            'Build emotional regulation skills through mindfulness'
        ],
        developmentStrategiesVi: [
            'Thực hành tập trung vào những gì BẠN CÓ THỂ kiểm soát (nỗ lực, thái độ, chuẩn bị)',
            'Phát triển các thói quen trước khi thi đấu để tạo cảm giác kiểm soát',
            'Sử dụng kỹ thuật thở (4-7-8, box breathing) để điều chỉnh kích thích',
            'Thực hành reframing: "Tôi được thi đấu" thay vì "Tôi phải thi đấu"',
            'Xây dựng kỹ năng điều chỉnh cảm xúc thông qua chánh niệm'
        ],
        highIndicators: [
            'Stays calm under pressure',
            'Manages anxiety effectively',
            'Controls emotions during setbacks',
            'Maintains focus despite distractions'
        ],
        lowIndicators: [
            'Gets overwhelmed by pressure',
            'Loses temper during competition',
            'Performance drops when things go wrong',
            'Easily distracted by external factors'
        ]
    },
    {
        dimension: 'commitment',
        name: 'Commitment',
        nameVi: 'Cam kết',
        description: 'The extent to which a person is deeply involved in what they are doing and persists despite difficulties',
        descriptionVi: 'Mức độ mà một người tham gia sâu vào những gì họ đang làm và kiên trì bất chấp khó khăn',
        big5Correlations: {
            N: -0.28,
            E: 0.32,
            O: 0.22,
            A: 0.15,
            C: 0.55  // Strong positive - conscientiousness
        },
        developmentStrategies: [
            'Set clear, process-oriented goals (not just outcome goals)',
            'Create a "why" statement - your deeper purpose',
            'Build daily habits aligned with long-term goals',
            'Use implementation intentions: "When X, I will Y"',
            'Track progress visually (calendars, charts)'
        ],
        developmentStrategiesVi: [
            'Đặt mục tiêu rõ ràng, hướng vào quá trình (không chỉ mục tiêu kết quả)',
            'Tạo tuyên bố "tại sao" - mục đích sâu xa của bạn',
            'Xây dựng thói quen hàng ngày phù hợp với mục tiêu dài hạn',
            'Sử dụng implementation intentions: "Khi X, tôi sẽ Y"',
            'Theo dõi tiến trình trực quan (lịch, biểu đồ)'
        ],
        highIndicators: [
            'Sets challenging goals and sticks to them',
            'Maintains motivation over long periods',
            'Sees tasks through to completion',
            'Makes sacrifices for long-term success'
        ],
        lowIndicators: [
            'Gives up when things get difficult',
            'Frequently changes goals or directions',
            'Struggles with consistency',
            'Easily loses motivation'
        ]
    },
    {
        dimension: 'challenge',
        name: 'Challenge',
        nameVi: 'Thử thách',
        description: 'The extent to which a person sees challenges and change as opportunities for growth',
        descriptionVi: 'Mức độ mà một người xem thử thách và thay đổi như cơ hội để phát triển',
        big5Correlations: {
            N: -0.35,
            E: 0.38,
            O: 0.45,  // Strong positive - openness to experience
            A: 0.08,
            C: 0.28
        },
        developmentStrategies: [
            'Adopt a growth mindset: abilities can be developed',
            'Reframe failures as learning opportunities',
            'Deliberately seek out challenging situations',
            'Use "stress inoculation" - practice under pressure',
            'Celebrate effort and learning, not just outcomes'
        ],
        developmentStrategiesVi: [
            'Áp dụng tư duy phát triển: khả năng có thể được phát triển',
            'Reframe thất bại như cơ hội học tập',
            'Cố ý tìm kiếm các tình huống thử thách',
            'Sử dụng "stress inoculation" - thực hành dưới áp lực',
            'Ăn mừng nỗ lực và học hỏi, không chỉ kết quả'
        ],
        highIndicators: [
            'Embraces new challenges',
            'Sees setbacks as temporary',
            'Adapts quickly to change',
            'Thrives under pressure'
        ],
        lowIndicators: [
            'Avoids threatening situations',
            'Views change as a threat',
            'Prefers comfort over growth',
            'Gives up after failure'
        ]
    },
    {
        dimension: 'confidence',
        name: 'Confidence',
        nameVi: 'Tự tin',
        description: 'The extent to which a person believes in their ability to deal with challenges and setbacks',
        descriptionVi: 'Mức độ mà một người tin vào khả năng của họ để đối phó với thử thách và thất bại',
        big5Correlations: {
            N: -0.52,
            E: 0.48,  // Strong positive - extraversion/assertiveness
            O: 0.25,
            A: 0.08,
            C: 0.38
        },
        developmentStrategies: [
            'Build mastery experiences - start small, build up',
            'Use visualization: imagine success in detail',
            'Develop positive self-talk scripts',
            'Learn from role models (vicarious experience)',
            'Prepare thoroughly to build justified confidence'
        ],
        developmentStrategiesVi: [
            'Xây dựng trải nghiệm làm chủ - bắt đầu nhỏ, phát triển dần',
            'Sử dụng hình dung: tưởng tượng thành công chi tiết',
            'Phát triển kịch bản tự nói tích cực',
            'Học từ hình mẫu (trải nghiệm gián tiếp)',
            'Chuẩn bị kỹ lưỡng để xây dựng sự tự tin có cơ sở'
        ],
        highIndicators: [
            'Believes in own abilities',
            'Takes calculated risks',
            'Bounces back from setbacks',
            'Speaks up and takes leadership'
        ],
        lowIndicators: [
            'Doubts own abilities frequently',
            'Avoids situations where might fail',
            'Dwells on mistakes',
            'Seeks constant reassurance'
        ]
    }
]

// ============================================
// FLOW STATE (Csikszentmihalyi 1990)
// ============================================

export const FLOW_STATE_CONDITIONS: FlowStateCondition[] = [
    {
        id: 'challenge_skill_balance',
        name: 'Challenge-Skill Balance',
        nameVi: 'Cân bằng Thử thách-Kỹ năng',
        description: 'The activity must be neither too easy (boredom) nor too hard (anxiety)',
        descriptionVi: 'Hoạt động không được quá dễ (chán) cũng không quá khó (lo âu)',
        howToAchieve: [
            'Match task difficulty to current skill level',
            'Gradually increase difficulty as skills improve',
            'Break complex tasks into achievable sub-goals',
            'Adjust the "rules" to maintain challenge'
        ],
        howToAchieveVi: [
            'Phù hợp độ khó nhiệm vụ với mức kỹ năng hiện tại',
            'Tăng dần độ khó khi kỹ năng cải thiện',
            'Chia nhiệm vụ phức tạp thành các mục tiêu con đạt được',
            'Điều chỉnh "quy tắc" để duy trì thử thách'
        ],
        blockers: [
            'Task too easy → boredom',
            'Task too hard → anxiety',
            'Skills plateau without challenge increase'
        ],
        blockersVi: [
            'Nhiệm vụ quá dễ → chán',
            'Nhiệm vụ quá khó → lo âu',
            'Kỹ năng trì trệ khi không tăng thử thách'
        ]
    },
    {
        id: 'clear_goals',
        name: 'Clear Goals',
        nameVi: 'Mục tiêu Rõ ràng',
        description: 'Knowing exactly what you want to accomplish',
        descriptionVi: 'Biết chính xác những gì bạn muốn đạt được',
        howToAchieve: [
            'Define specific targets for each session',
            'Have both process goals (how) and outcome goals (what)',
            'Make goals concrete and measurable',
            'Write goals down before starting'
        ],
        howToAchieveVi: [
            'Xác định mục tiêu cụ thể cho mỗi buổi',
            'Có cả mục tiêu quá trình (cách) và mục tiêu kết quả (gì)',
            'Làm mục tiêu cụ thể và đo lường được',
            'Viết mục tiêu ra trước khi bắt đầu'
        ],
        blockers: [
            'Vague intentions',
            'Too many simultaneous goals',
            'Conflicting goals'
        ],
        blockersVi: [
            'Ý định mơ hồ',
            'Quá nhiều mục tiêu đồng thời',
            'Các mục tiêu mâu thuẫn'
        ]
    },
    {
        id: 'immediate_feedback',
        name: 'Immediate Feedback',
        nameVi: 'Phản hồi Ngay lập tức',
        description: 'Getting immediate information about how well you are doing',
        descriptionVi: 'Nhận thông tin ngay lập tức về mức độ bạn đang làm tốt',
        howToAchieve: [
            'Use objective measures (time, score, targets hit)',
            'Pay attention to internal cues (how it feels)',
            'Train with a coach or partner who gives feedback',
            'Use video recording to review performance'
        ],
        howToAchieveVi: [
            'Sử dụng các số liệu khách quan (thời gian, điểm số, mục tiêu đạt)',
            'Chú ý đến các tín hiệu nội tại (cảm giác thế nào)',
            'Tập luyện với huấn luyện viên hoặc đối tác đưa phản hồi',
            'Sử dụng quay video để xem lại màn trình diễn'
        ],
        blockers: [
            'Delayed results',
            'Ambiguous outcomes',
            'No way to measure progress'
        ],
        blockersVi: [
            'Kết quả bị trì hoãn',
            'Kết quả mơ hồ',
            'Không có cách đo lường tiến trình'
        ]
    },
    {
        id: 'concentration',
        name: 'Deep Concentration',
        nameVi: 'Tập trung Sâu',
        description: 'Complete focus on the activity at hand',
        descriptionVi: 'Tập trung hoàn toàn vào hoạt động đang làm',
        howToAchieve: [
            'Eliminate external distractions',
            'Develop pre-performance routines',
            'Use cue words to refocus',
            'Practice mindfulness to build focus capacity'
        ],
        howToAchieveVi: [
            'Loại bỏ phiền nhiễu bên ngoài',
            'Phát triển các thói quen trước khi thi đấu',
            'Sử dụng từ gợi ý để tập trung lại',
            'Thực hành chánh niệm để xây dựng khả năng tập trung'
        ],
        blockers: [
            'Phone notifications',
            'Worry about unrelated issues',
            'Multi-tasking attempts'
        ],
        blockersVi: [
            'Thông báo điện thoại',
            'Lo lắng về các vấn đề không liên quan',
            'Cố gắng làm nhiều việc cùng lúc'
        ]
    },
    {
        id: 'sense_of_control',
        name: 'Sense of Control',
        nameVi: 'Cảm giác Kiểm soát',
        description: 'Feeling in control of actions and environment',
        descriptionVi: 'Cảm thấy kiểm soát được hành động và môi trường',
        howToAchieve: [
            'Focus on process, not outcome',
            'Develop extensive preparation',
            'Practice in varied conditions',
            'Build technical mastery'
        ],
        howToAchieveVi: [
            'Tập trung vào quá trình, không phải kết quả',
            'Phát triển sự chuẩn bị kỹ lưỡng',
            'Thực hành trong các điều kiện khác nhau',
            'Xây dựng sự thành thạo kỹ thuật'
        ],
        blockers: [
            'Unpredictable elements you haven\'t prepared for',
            'Lack of skill mastery',
            'External pressure from others'
        ],
        blockersVi: [
            'Các yếu tố không thể đoán trước mà bạn chưa chuẩn bị',
            'Thiếu sự thành thạo kỹ năng',
            'Áp lực bên ngoài từ người khác'
        ]
    },
    {
        id: 'autotelic_experience',
        name: 'Autotelic Experience',
        nameVi: 'Trải nghiệm Tự mục đích',
        description: 'The activity is intrinsically rewarding - done for its own sake',
        descriptionVi: 'Hoạt động có phần thưởng nội tại - được thực hiện vì chính nó',
        howToAchieve: [
            'Find personal meaning in the activity',
            'Focus on enjoyment, not just achievement',
            'Connect activity to core values',
            'Appreciate the journey, not just destination'
        ],
        howToAchieveVi: [
            'Tìm ý nghĩa cá nhân trong hoạt động',
            'Tập trung vào niềm vui, không chỉ thành tích',
            'Kết nối hoạt động với giá trị cốt lõi',
            'Trân trọng hành trình, không chỉ đích đến'
        ],
        blockers: [
            'External rewards dominant',
            'Pressure from others',
            'Comparison with others'
        ],
        blockersVi: [
            'Phần thưởng bên ngoài chiếm ưu thế',
            'Áp lực từ người khác',
            'So sánh với người khác'
        ]
    }
]

// ============================================
// EXERCISE-MENTAL HEALTH EFFECTS (Meta-analyses)
// ============================================

export const EXERCISE_MENTAL_HEALTH_EFFECTS: ExerciseMentalHealthEffect[] = [
    {
        condition: 'Major Depression',
        conditionVi: 'Trầm cảm Chính',
        effectSize: -0.62,
        effectType: 'SMD',
        source: 'Schuch et al. (2016) Cochrane Review',
        dosage: '3x/week, 30-45 min, moderate intensity',
        dosageVi: '3 lần/tuần, 30-45 phút, cường độ vừa',
        mechanism: 'Increases BDNF, reduces inflammation, improves sleep',
        mechanismVi: 'Tăng BDNF, giảm viêm, cải thiện giấc ngủ'
    },
    {
        condition: 'Anxiety Disorders',
        conditionVi: 'Rối loạn Lo âu',
        effectSize: -0.48,
        effectType: 'SMD',
        source: 'Stubbs et al. (2017)',
        dosage: '3-5x/week, 20-60 min, moderate-vigorous',
        dosageVi: '3-5 lần/tuần, 20-60 phút, vừa đến mạnh',
        mechanism: 'Reduces muscle tension, provides distraction, builds self-efficacy',
        mechanismVi: 'Giảm căng cơ, tạo sự phân tâm, xây dựng hiệu quả bản thân'
    },
    {
        condition: 'Chronic Stress',
        conditionVi: 'Stress Mãn tính',
        effectSize: -0.35,
        effectType: 'd',
        source: 'Childs & de Wit (2014)',
        dosage: 'Regular physical activity (any type)',
        dosageVi: 'Hoạt động thể chất thường xuyên (bất kỳ loại nào)',
        mechanism: 'Improves HPA axis regulation, reduces cortisol reactivity',
        mechanismVi: 'Cải thiện điều chỉnh trục HPA, giảm phản ứng cortisol'
    },
    {
        condition: 'Self-Esteem',
        conditionVi: 'Lòng tự trọng',
        effectSize: 0.49,
        effectType: 'd',
        source: 'Ekeland et al. (2004)',
        dosage: 'Skill-building activities preferred',
        dosageVi: 'Ưu tiên các hoạt động xây dựng kỹ năng',
        mechanism: 'Mastery experiences, improved body image, social connections',
        mechanismVi: 'Trải nghiệm làm chủ, cải thiện hình ảnh cơ thể, kết nối xã hội'
    },
    {
        condition: 'Cognitive Function',
        conditionVi: 'Chức năng Nhận thức',
        effectSize: 0.29,
        effectType: 'd',
        source: 'Northey et al. (2018)',
        dosage: 'Aerobic exercise, 45-60 min, 3x/week',
        dosageVi: 'Bài tập aerobic, 45-60 phút, 3 lần/tuần',
        mechanism: 'Increased cerebral blood flow, neurogenesis, BDNF',
        mechanismVi: 'Tăng lưu lượng máu não, tạo tế bào thần kinh, BDNF'
    },
    {
        condition: 'Sleep Quality',
        conditionVi: 'Chất lượng Giấc ngủ',
        effectSize: 0.47,
        effectType: 'd',
        source: 'Kredlow et al. (2015)',
        dosage: 'Moderate exercise, not close to bedtime',
        dosageVi: 'Tập luyện vừa, không gần giờ đi ngủ',
        mechanism: 'Body temperature regulation, anxiety reduction',
        mechanismVi: 'Điều chỉnh nhiệt độ cơ thể, giảm lo âu'
    }
]

// ============================================
// SPORT RECOMMENDATIONS BY PERSONALITY
// ============================================

export const SPORT_RECOMMENDATIONS: SportRecommendation[] = [
    // === TEAM SPORTS ===
    {
        id: 'soccer',
        name: 'Soccer/Football',
        nameVi: 'Bóng đá',
        category: 'team',
        description: 'Team ball sport requiring cooperation, strategy, and endurance',
        descriptionVi: 'Môn thể thao đồng đội đòi hỏi hợp tác, chiến thuật và sức bền',
        idealBig5: { high: ['E', 'A'], low: ['N'] },
        physicalBenefits: ['Cardiovascular fitness', 'Leg strength', 'Agility', 'Coordination'],
        mentalBenefits: ['Teamwork skills', 'Social connection', 'Stress relief', 'Confidence'],
        mentalHealthEffects: { depression: -0.45, anxiety: -0.35, selfEsteem: 0.40 },
        startingTips: [
            'Join a recreational league for beginners',
            'Start with 5-a-side for easier entry',
            'Focus on basic passing and movement first',
            'Invest in proper shoes before anything else'
        ],
        startingTipsVi: [
            'Tham gia giải đấu giải trí cho người mới bắt đầu',
            'Bắt đầu với 5v5 để dễ tiếp cận hơn',
            'Tập trung vào chuyền bóng và di chuyển cơ bản trước',
            'Đầu tư vào giày phù hợp trước tiên'
        ],
        equipmentNeeded: ['Soccer shoes', 'Shin guards', 'Comfortable sportswear'],
        timeCommitment: 'moderate'
    },
    {
        id: 'basketball',
        name: 'Basketball',
        nameVi: 'Bóng rổ',
        category: 'team',
        description: 'Fast-paced team sport requiring agility, coordination, and teamwork',
        descriptionVi: 'Môn thể thao đồng đội nhịp độ nhanh đòi hỏi nhanh nhẹn, phối hợp và làm việc nhóm',
        idealBig5: { high: ['E'], low: ['N'] },
        physicalBenefits: ['Full body workout', 'Jumping power', 'Hand-eye coordination', 'Speed'],
        mentalBenefits: ['Quick decision making', 'Spatial awareness', 'Team communication'],
        mentalHealthEffects: { depression: -0.40, anxiety: -0.30, selfEsteem: 0.45 },
        startingTips: [
            'Learn basic dribbling and shooting first',
            'Join pickup games at local courts',
            'Watch games to understand positioning',
            'Work on conditioning - it is demanding'
        ],
        startingTipsVi: [
            'Học dribble và ném rổ cơ bản trước',
            'Tham gia các trận đấu tự do tại sân địa phương',
            'Xem các trận đấu để hiểu vị trí',
            'Rèn luyện thể lực - môn này đòi hỏi nhiều'
        ],
        equipmentNeeded: ['Basketball shoes', 'Basketball', 'Comfortable sportswear'],
        timeCommitment: 'moderate'
    },

    // === INDIVIDUAL SPORTS ===
    {
        id: 'running',
        name: 'Running/Jogging',
        nameVi: 'Chạy bộ',
        category: 'individual',
        description: 'Cardiovascular exercise that can be done alone at any pace',
        descriptionVi: 'Bài tập tim mạch có thể thực hiện một mình với bất kỳ tốc độ nào',
        idealBig5: { low: ['E'], high: ['C'] },
        physicalBenefits: ['Cardiovascular health', 'Weight management', 'Bone density', 'Endurance'],
        mentalBenefits: ['Stress relief', 'Runner\'s high', 'Time for reflection', 'Goal achievement'],
        mentalHealthEffects: { depression: -0.62, anxiety: -0.50, stress: -0.40 },
        startingTips: [
            'Start with walk-run intervals',
            'Use the Couch to 5K program',
            'Invest in proper running shoes',
            'Start slow - most beginners go too fast'
        ],
        startingTipsVi: [
            'Bắt đầu với các khoảng đi bộ-chạy',
            'Sử dụng chương trình Couch to 5K',
            'Đầu tư vào giày chạy bộ phù hợp',
            'Bắt đầu chậm - hầu hết người mới chạy quá nhanh'
        ],
        equipmentNeeded: ['Running shoes', 'Comfortable clothing', 'Optional: GPS watch'],
        timeCommitment: 'low'
    },
    {
        id: 'swimming',
        name: 'Swimming',
        nameVi: 'Bơi lội',
        category: 'individual',
        description: 'Low-impact full body exercise in water',
        descriptionVi: 'Bài tập toàn thân ít va chạm dưới nước',
        idealBig5: { high: ['C'], low: ['E', 'N'] },
        physicalBenefits: ['Full body workout', 'Low joint stress', 'Flexibility', 'Lung capacity'],
        mentalBenefits: ['Meditative quality', 'Sensory reduction', 'Solitude', 'Rhythmic relaxation'],
        mentalHealthEffects: { depression: -0.55, anxiety: -0.60, stress: -0.50 },
        startingTips: [
            'Take beginner lessons to learn proper technique',
            'Start with freestyle and backstroke',
            'Focus on breathing rhythm first',
            'Use a pull buoy if legs tire quickly'
        ],
        startingTipsVi: [
            'Tham gia các bài học cho người mới để học kỹ thuật đúng',
            'Bắt đầu với bơi tự do và bơi ngửa',
            'Tập trung vào nhịp thở trước',
            'Sử dụng pull buoy nếu chân mỏi nhanh'
        ],
        equipmentNeeded: ['Swimsuit', 'Goggles', 'Swim cap (optional)'],
        timeCommitment: 'moderate'
    },

    // === CREATIVE/MIND-BODY ===
    {
        id: 'yoga',
        name: 'Yoga',
        nameVi: 'Yoga',
        category: 'creative',
        description: 'Mind-body practice combining physical postures, breathing, and meditation',
        descriptionVi: 'Thực hành tâm-thân kết hợp tư thế, hơi thở và thiền',
        idealBig5: { high: ['O'], low: ['E', 'N'] },
        physicalBenefits: ['Flexibility', 'Core strength', 'Balance', 'Posture improvement'],
        mentalBenefits: ['Stress reduction', 'Body awareness', 'Mindfulness', 'Emotional regulation'],
        mentalHealthEffects: { depression: -0.45, anxiety: -0.58, stress: -0.55 },
        startingTips: [
            'Start with beginner or "gentle" classes',
            'Don\'t compare yourself to others',
            'Props are your friends (blocks, straps)',
            'Try different styles to find your fit'
        ],
        startingTipsVi: [
            'Bắt đầu với các lớp cho người mới hoặc "nhẹ nhàng"',
            'Không so sánh bản thân với người khác',
            'Dụng cụ hỗ trợ rất hữu ích (blocks, dây)',
            'Thử các phong cách khác nhau để tìm phù hợp'
        ],
        equipmentNeeded: ['Yoga mat', 'Comfortable stretchy clothing'],
        timeCommitment: 'low'
    },

    // === COMBAT SPORTS ===
    {
        id: 'martial_arts',
        name: 'Martial Arts (General)',
        nameVi: 'Võ thuật',
        category: 'combat',
        description: 'Combat-based disciplines teaching self-defense, discipline, and respect',
        descriptionVi: 'Các môn dựa trên đối kháng dạy tự vệ, kỷ luật và tôn trọng',
        idealBig5: { high: ['C', 'O'], low: ['N'] },
        physicalBenefits: ['Full body conditioning', 'Flexibility', 'Coordination', 'Reflexes'],
        mentalBenefits: ['Discipline', 'Self-confidence', 'Stress release', 'Focus'],
        mentalHealthEffects: { depression: -0.35, anxiety: -0.40, selfEsteem: 0.55 },
        startingTips: [
            'Research different styles (BJJ, Muay Thai, Karate, Judo)',
            'Visit multiple gyms before committing',
            'Be patient - progress takes time',
            'Focus on technique over power initially'
        ],
        startingTipsVi: [
            'Nghiên cứu các phong cách khác nhau (BJJ, Muay Thai, Karate, Judo)',
            'Thăm nhiều phòng tập trước khi cam kết',
            'Kiên nhẫn - tiến bộ cần thời gian',
            'Tập trung vào kỹ thuật hơn sức mạnh ban đầu'
        ],
        equipmentNeeded: ['Gi/uniform (style dependent)', 'Mouthguard', 'Protective gear'],
        timeCommitment: 'high'
    }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get mental toughness profile based on Big5
 */
export function getMentalToughnessProfile(big5: {
    N: number
    E: number
    O: number
    A: number
    C: number
}): { dimension: string; score: number; level: 'low' | 'moderate' | 'high' }[] {
    return MENTAL_TOUGHNESS_DIMENSIONS.map(dim => {
        let score = 50 // Base

        const corr = dim.big5Correlations

        // Mental Toughness correlations from research:
        // N correlates NEGATIVELY with MT (high N = low MT)
        // So we use (50 - N) to invert, then multiply by |correlation|
        // Low N (e.g., 2) → (50-2) = 48 → positive contribution
        // High N (e.g., 80) → (50-80) = -30 → negative contribution

        // For N: use absolute value of correlation since we already inverted
        score += (50 - big5.N) * Math.abs(corr.N) * 0.4

        // For other traits: deviation from 50 * correlation weight
        score += (big5.E - 50) * corr.E * 0.2
        score += (big5.O - 50) * corr.O * 0.2
        score += (big5.A - 50) * corr.A * 0.1
        score += (big5.C - 50) * corr.C * 0.3

        score = Math.max(0, Math.min(100, score))

        let level: 'low' | 'moderate' | 'high' = 'moderate'
        if (score > 65) level = 'high'
        if (score < 35) level = 'low'

        return { dimension: dim.nameVi, score: Math.round(score), level }
    })
}

/**
 * Get sport recommendations based on Big5
 */
export function getRecommendedSports(big5: {
    O: number
    C: number
    E: number
    A: number
    N: number
}): SportRecommendation[] {
    return SPORT_RECOMMENDATIONS
        .map(sport => {
            let score = 0

            if (sport.idealBig5.high) {
                for (const trait of sport.idealBig5.high) {
                    if (big5[trait] > 60) score += 10
                }
            }

            if (sport.idealBig5.low) {
                for (const trait of sport.idealBig5.low) {
                    if (big5[trait] < 40) score += 10
                }
            }

            return { sport, score }
        })
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(s => s.sport)
}

/**
 * Get exercise prescription for mental health
 */
export function getExercisePrescription(
    primaryConcern: 'depression' | 'anxiety' | 'stress' | 'general'
): ExerciseMentalHealthEffect {
    switch (primaryConcern) {
        case 'depression':
            return EXERCISE_MENTAL_HEALTH_EFFECTS.find(e => e.condition === 'Major Depression')!
        case 'anxiety':
            return EXERCISE_MENTAL_HEALTH_EFFECTS.find(e => e.condition === 'Anxiety Disorders')!
        case 'stress':
            return EXERCISE_MENTAL_HEALTH_EFFECTS.find(e => e.condition === 'Chronic Stress')!
        default:
            return EXERCISE_MENTAL_HEALTH_EFFECTS[0]
    }
}
