/**
 * Big Five (BFI-2) Comprehensive Knowledge Base
 * 
 * PRIMARY SOURCES:
 * ================
 * 
 * FOUNDATIONAL:
 * - Costa, P. T., & McCrae, R. R. (1992). NEO-PI-R Professional Manual.
 *   Psychological Assessment Resources. [α = .86-.92]
 * - Soto, C. J., & John, O. P. (2017). The next Big Five Inventory (BFI-2).
 *   Journal of Personality and Social Psychology, 113(1), 117-143.
 *   DOI: 10.1037/pspp0000096 [BFI-2 development, α = .83-.92]
 * 
 * META-ANALYSES - JOB PERFORMANCE:
 * - Barrick, M. R., & Mount, M. K. (1991). The Big Five personality dimensions
 *   and job performance. Personnel Psychology, 44(1), 1-26.
 *   [C r = .22, N r = -.13, E r = .13 for sales] - GOLD STANDARD
 * - Wilmot, M. P., & Ones, D. S. (2019). A century of research on conscientiousness
 *   at work. PNAS, 116(46), 23004-23010. DOI: 10.1073/pnas.1908430116
 *   [C accounts for >15% variance in performance]
 * - Judge, T. A., Bono, J. E., Ilies, R., & Gerhardt, M. W. (2002). Personality
 *   and leadership. Journal of Applied Psychology, 87(4), 765-780.
 *   DOI: 10.1037/0021-9010.87.4.765 [E r = .31, O r = .24, N r = -.24 for leadership]
 * 
 * META-ANALYSES - ACADEMIC PERFORMANCE:
 * - Poropat, A. E. (2009). A meta-analysis of the five-factor model and academic
 *   performance. Psychological Bulletin, 135(2), 322-338. DOI: 10.1037/a0014996
 *   [C r = .22 (as strong as IQ!), O r = .12, A r = .07]
 * - Richardson, M., Abraham, C., & Bond, R. (2012). Psychological correlates of
 *   university students' academic performance. Psychological Bulletin, 138(2), 353-387.
 *   DOI: 10.1037/a0026838 [Self-efficacy r = .31, Effort regulation r = .32]
 * 
 * META-ANALYSES - MENTAL HEALTH:
 * - Kotov, R., Gamez, W., Schmidt, F., & Watson, D. (2010). Linking "Big" personality
 *   traits to anxiety, depressive, and substance use disorders. Psychological Bulletin,
 *   136(5), 768-821. DOI: 10.1037/a0020327 - GOLD STANDARD
 *   [N d = 1.33 for MDD, E d = -1.00, C d = -0.90]
 * 
 * META-ANALYSES - LIFE OUTCOMES:
 * - Roberts, B. W., Kuncel, N. R., Shiner, R., Caspi, A., & Goldberg, L. R. (2007).
 *   The power of personality. Perspectives on Psychological Science, 2(4), 313-345.
 *   DOI: 10.1111/j.1745-6916.2007.00047.x
 *   [Personality = IQ in predicting mortality, divorce]
 * - Soto, C. J. (2019). How replicable are links between personality traits and
 *   consequential life outcomes? Psychological Science, 30(5), 711-727.
 *   DOI: 10.1177/0956797619831612 [C → longevity, E → happiness, N → mental health]
 * 
 * PERSONALITY DEVELOPMENT:
 * - Roberts, B. W., Walton, K. E., & Viechtbauer, W. (2006). Patterns of mean-level
 *   change in personality traits across the life course. Psychological Bulletin, 132(1), 1-25.
 *   DOI: 10.1037/0033-2909.132.1.1 [Maturity principle: ↓N, ↑A, ↑C with age]
 * - Hudson, N. W., & Fraley, R. C. (2015). Volitional personality trait change.
 *   Journal of Personality and Social Psychology, 109(3), 490-507.
 *   DOI: 10.1037/pspp0000021 [Intentional change possible with effort]
 */

// ============================================
// TYPES
// ============================================

export interface Big5Domain {
    id: 'O' | 'C' | 'E' | 'A' | 'N'
    name: string
    nameVi: string
    description: string
    descriptionVi: string
    highPole: string
    lowPole: string
    // Facets (BFI-2 has 3 facets per domain)
    facets: Big5Facet[]
    // Life outcomes from Roberts et al. (2007)
    lifeOutcomes: { outcome: string; direction: 'positive' | 'negative'; effectSize: number }[]
    // Career implications
    careerImplications: string[]
    careerImplicationsVi: string[]
    // Relationship patterns
    relationshipPatterns: string[]
    relationshipPatternsVi: string[]
    // Health correlations
    healthCorrelations: string[]
    // Development tips
    developmentTips: string[]
    developmentTipsVi: string[]
}

export interface Big5Facet {
    id: string
    name: string
    nameVi: string
    domain: 'O' | 'C' | 'E' | 'A' | 'N'
    description: string
    descriptionVi: string
    highBehaviors: string[]
    lowBehaviors: string[]
}

export interface Big5TScore {
    range: [number, number]
    label: string
    labelVi: string
    percentile: string
    interpretation: string
    interpretationVi: string
}

// ============================================
// T-SCORE INTERPRETATION
// ============================================

export const BIG5_TSCORE_RANGES: Big5TScore[] = [
    {
        range: [0, 34],
        label: 'Very Low',
        labelVi: 'Rất thấp',
        percentile: 'Below 5th',
        interpretation: 'Significantly below average. This trait is notably less prominent.',
        interpretationVi: 'Thấp hơn đáng kể so với trung bình. Đặc điểm này ít nổi bật.'
    },
    {
        range: [35, 44],
        label: 'Low',
        labelVi: 'Thấp',
        percentile: '5th-25th',
        interpretation: 'Below average range. Less characteristic than most people.',
        interpretationVi: 'Dưới mức trung bình. Ít đặc trưng hơn hầu hết mọi người.'
    },
    {
        range: [45, 55],
        label: 'Average',
        labelVi: 'Trung bình',
        percentile: '25th-75th',
        interpretation: 'Typical range. Shows flexibility depending on situation.',
        interpretationVi: 'Phạm vi điển hình. Cho thấy sự linh hoạt tùy thuộc vào tình huống.'
    },
    {
        range: [56, 65],
        label: 'High',
        labelVi: 'Cao',
        percentile: '75th-95th',
        interpretation: 'Above average. This trait is more prominent than most.',
        interpretationVi: 'Trên mức trung bình. Đặc điểm này nổi bật hơn hầu hết.'
    },
    {
        range: [66, 100],
        label: 'Very High',
        labelVi: 'Rất cao',
        percentile: 'Above 95th',
        interpretation: 'Significantly above average. This trait is highly characteristic.',
        interpretationVi: 'Cao hơn đáng kể so với trung bình. Đặc điểm này rất đặc trưng.'
    }
]

// ============================================
// BIG FIVE DOMAINS WITH FACETS
// ============================================

export const BIG5_DOMAINS: Big5Domain[] = [
    {
        id: 'O',
        name: 'Openness to Experience',
        nameVi: 'Cởi mở với Trải nghiệm',
        description: 'Reflects imagination, creativity, intellectual curiosity, and preference for variety.',
        descriptionVi: 'Phản ánh trí tưởng tượng, sáng tạo, tò mò trí tuệ và sở thích đa dạng.',
        highPole: 'Creative, curious, open-minded',
        lowPole: 'Practical, conventional, prefer routine',
        facets: [
            {
                id: 'O_intellectual_curiosity',
                name: 'Intellectual Curiosity',
                nameVi: 'Tò mò Trí tuệ',
                domain: 'O',
                description: 'Interest in ideas, learning, and philosophical discussions',
                descriptionVi: 'Quan tâm đến ý tưởng, học hỏi và thảo luận triết học',
                highBehaviors: ['Loves learning new things', 'Enjoys complex problems', 'Reads widely'],
                lowBehaviors: ['Prefers practical knowledge', 'Focuses on concrete facts', 'Less interested in theory']
            },
            {
                id: 'O_aesthetic_sensitivity',
                name: 'Aesthetic Sensitivity',
                nameVi: 'Nhạy cảm Thẩm mỹ',
                domain: 'O',
                description: 'Appreciation of art, beauty, and emotional experiences',
                descriptionVi: 'Đánh giá cao nghệ thuật, cái đẹp và trải nghiệm cảm xúc',
                highBehaviors: ['Moved by art and music', 'Notices beauty in nature', 'Values emotional depth'],
                lowBehaviors: ['Less interested in art', 'Pragmatic about beauty', 'Prefers function over form']
            },
            {
                id: 'O_creative_imagination',
                name: 'Creative Imagination',
                nameVi: 'Trí tưởng tượng Sáng tạo',
                domain: 'O',
                description: 'Tendency toward fantasy, imagination, and original thinking',
                descriptionVi: 'Xu hướng về tưởng tượng, sáng tạo và suy nghĩ độc đáo',
                highBehaviors: ['Vivid daydreams', 'Generates novel ideas', 'Sees possibilities'],
                lowBehaviors: ['Grounded in reality', 'Practical thinking', 'Follows established methods']
            }
        ],
        lifeOutcomes: [
            { outcome: 'Creativity/artistic achievement', direction: 'positive', effectSize: 0.35 },
            { outcome: 'Political liberalism', direction: 'positive', effectSize: 0.30 },
            { outcome: 'Job performance (non-routine)', direction: 'positive', effectSize: 0.15 },
            { outcome: 'Drug experimentation', direction: 'positive', effectSize: 0.20 }
        ],
        careerImplications: [
            'Thrives in roles requiring innovation and creativity',
            'Good fit for research, arts, and entrepreneurship',
            'May struggle with highly repetitive work',
            'Values intellectual stimulation in work'
        ],
        careerImplicationsVi: [
            'Phát triển trong các vai trò đòi hỏi đổi mới và sáng tạo',
            'Phù hợp với nghiên cứu, nghệ thuật và khởi nghiệp',
            'Có thể gặp khó khăn với công việc lặp đi lặp lại',
            'Đánh giá cao sự kích thích trí tuệ trong công việc'
        ],
        relationshipPatterns: [
            'Seeks partners who can engage intellectually',
            'Values shared cultural and aesthetic interests',
            'Open to unconventional relationship structures',
            'May prioritize personal growth over stability'
        ],
        relationshipPatternsVi: [
            'Tìm kiếm đối tác có thể tham gia về mặt trí tuệ',
            'Đánh giá cao sở thích văn hóa và thẩm mỹ chung',
            'Cởi mở với các cấu trúc mối quan hệ phi truyền thống',
            'Có thể ưu tiên phát triển cá nhân hơn sự ổn định'
        ],
        healthCorrelations: [
            'Higher openness linked to willingness to try alternative medicine',
            'More likely to engage in risky behaviors (mixed health effects)',
            'Associated with lower prejudice/discrimination stress'
        ],
        developmentTips: [
            'Try one new experience weekly',
            'Read outside your usual genres',
            'Take a creative class',
            'Travel to unfamiliar places',
            'Engage with different perspectives'
        ],
        developmentTipsVi: [
            'Thử một trải nghiệm mới hàng tuần',
            'Đọc ngoài thể loại thường đọc',
            'Tham gia lớp sáng tạo',
            'Du lịch đến những nơi xa lạ',
            'Tiếp xúc với các quan điểm khác nhau'
        ]
    },
    {
        id: 'C',
        name: 'Conscientiousness',
        nameVi: 'Tận tâm',
        description: 'Reflects organization, dependability, self-discipline, and goal-directed behavior.',
        descriptionVi: 'Phản ánh tổ chức, đáng tin cậy, tự kỷ luật và hành vi hướng đến mục tiêu.',
        highPole: 'Organized, disciplined, reliable',
        lowPole: 'Flexible, spontaneous, less structured',
        facets: [
            {
                id: 'C_organization',
                name: 'Organization',
                nameVi: 'Tổ chức',
                domain: 'C',
                description: 'Tendency toward orderliness, planning, and structure',
                descriptionVi: 'Xu hướng sắp xếp ngăn nắp, lập kế hoạch và cấu trúc',
                highBehaviors: ['Keeps things tidy', 'Uses lists and systems', 'Plans ahead'],
                lowBehaviors: ['Flexible with mess', 'Spontaneous', 'Goes with the flow']
            },
            {
                id: 'C_productiveness',
                name: 'Productiveness',
                nameVi: 'Năng suất',
                domain: 'C',
                description: 'Drive to accomplish tasks and achieve goals',
                descriptionVi: 'Động lực để hoàn thành nhiệm vụ và đạt được mục tiêu',
                highBehaviors: ['Gets things done', 'Works efficiently', 'Goal-oriented'],
                lowBehaviors: ['More relaxed about deadlines', 'Takes time to complete tasks', 'Less driven']
            },
            {
                id: 'C_responsibility',
                name: 'Responsibility',
                nameVi: 'Trách nhiệm',
                domain: 'C',
                description: 'Reliability, dependability, and meeting obligations',
                descriptionVi: 'Độ tin cậy, đáng tin cậy và hoàn thành nghĩa vụ',
                highBehaviors: ['Keeps promises', 'Shows up on time', 'Follows through'],
                lowBehaviors: ['More casual about commitments', 'May forget obligations', 'Flexible with rules']
            }
        ],
        lifeOutcomes: [
            { outcome: 'Job performance', direction: 'positive', effectSize: 0.22 },
            { outcome: 'Academic achievement', direction: 'positive', effectSize: 0.22 },
            { outcome: 'Longevity', direction: 'positive', effectSize: 0.15 },
            { outcome: 'Marital stability', direction: 'positive', effectSize: 0.12 },
            { outcome: 'Lower substance abuse', direction: 'positive', effectSize: 0.25 }
        ],
        careerImplications: [
            'Excels in roles requiring reliability and attention to detail',
            'Strong predictor of job performance across occupations',
            'Good fit for management, finance, healthcare',
            'May struggle with ambiguous or unstructured roles'
        ],
        careerImplicationsVi: [
            'Xuất sắc trong các vai trò đòi hỏi độ tin cậy và chú ý đến chi tiết',
            'Dự báo mạnh về hiệu suất công việc qua các ngành nghề',
            'Phù hợp với quản lý, tài chính, chăm sóc sức khỏe',
            'Có thể gặp khó khăn với vai trò mơ hồ hoặc không có cấu trúc'
        ],
        relationshipPatterns: [
            'Reliable and dependable partner',
            'Values commitment and follow-through',
            'May have high expectations of partner',
            'Provides stability in relationships'
        ],
        relationshipPatternsVi: [
            'Đối tác đáng tin cậy và đáng dựa vào',
            'Đánh giá cao cam kết và theo đuổi đến cùng',
            'Có thể có kỳ vọng cao với đối tác',
            'Mang lại sự ổn định trong các mối quan hệ'
        ],
        healthCorrelations: [
            'Strong predictor of longevity (r = .15)',
            'More likely to engage in preventive health behaviors',
            'Less likely to smoke, abuse substances',
            'Better medication adherence'
        ],
        developmentTips: [
            'Create daily routines and habits',
            'Use planning tools (calendars, to-do lists)',
            'Set specific, measurable goals',
            'Practice completing tasks before starting new ones',
            'Build accountability systems'
        ],
        developmentTipsVi: [
            'Tạo thói quen và routine hàng ngày',
            'Sử dụng công cụ lập kế hoạch (lịch, danh sách)',
            'Đặt mục tiêu cụ thể, đo lường được',
            'Thực hành hoàn thành nhiệm vụ trước khi bắt đầu mới',
            'Xây dựng hệ thống trách nhiệm giải trình'
        ]
    },
    {
        id: 'E',
        name: 'Extraversion',
        nameVi: 'Hướng ngoại',
        description: 'Reflects sociability, assertiveness, positive emotions, and energy from social interaction.',
        descriptionVi: 'Phản ánh tính xã hội, quyết đoán, cảm xúc tích cực và năng lượng từ tương tác xã hội.',
        highPole: 'Outgoing, energetic, talkative',
        lowPole: 'Reserved, reflective, enjoy solitude',
        facets: [
            {
                id: 'E_sociability',
                name: 'Sociability',
                nameVi: 'Tính xã hội',
                domain: 'E',
                description: 'Enjoyment of and engagement with social situations',
                descriptionVi: 'Niềm vui và tham gia vào các tình huống xã hội',
                highBehaviors: ['Enjoys parties', 'Makes new friends easily', 'Seeks social stimulation'],
                lowBehaviors: ['Prefers small gatherings', 'Needs alone time', 'More selective socially']
            },
            {
                id: 'E_assertiveness',
                name: 'Assertiveness',
                nameVi: 'Quyết đoán',
                domain: 'E',
                description: 'Tendency to take charge and speak up',
                descriptionVi: 'Xu hướng đảm nhận và lên tiếng',
                highBehaviors: ['Takes leadership roles', 'Expresses opinions', 'Comfortable in spotlight'],
                lowBehaviors: ['Lets others lead', 'More reserved in groups', 'Listens more than talks']
            },
            {
                id: 'E_energy_level',
                name: 'Energy Level',
                nameVi: 'Mức năng lượng',
                domain: 'E',
                description: 'General activity level and enthusiasm',
                descriptionVi: 'Mức hoạt động chung và sự nhiệt huyết',
                highBehaviors: ['Always on the go', 'Energetic and lively', 'Thrives on activity'],
                lowBehaviors: ['More calm and relaxed', 'Prefers slower pace', 'Conserves energy']
            }
        ],
        lifeOutcomes: [
            { outcome: 'Subjective well-being/happiness', direction: 'positive', effectSize: 0.35 },
            { outcome: 'Leadership emergence', direction: 'positive', effectSize: 0.31 },
            { outcome: 'Social relationships', direction: 'positive', effectSize: 0.30 },
            { outcome: 'Sales performance', direction: 'positive', effectSize: 0.20 }
        ],
        careerImplications: [
            'Excels in roles requiring social interaction',
            'Natural fit for sales, management, teaching',
            'Benefits from collaborative work environments',
            'May find isolated work draining'
        ],
        careerImplicationsVi: [
            'Xuất sắc trong các vai trò đòi hỏi tương tác xã hội',
            'Phù hợp tự nhiên với bán hàng, quản lý, giảng dạy',
            'Hưởng lợi từ môi trường làm việc hợp tác',
            'Có thể thấy công việc cô lập mệt mỏi'
        ],
        relationshipPatterns: [
            'Active social life with partner',
            'Expressive with affection',
            'May need lots of social stimulation',
            'Brings energy and excitement to relationships'
        ],
        relationshipPatternsVi: [
            'Cuộc sống xã hội sôi động với đối tác',
            'Biểu cảm với tình cảm',
            'Có thể cần nhiều kích thích xã hội',
            'Mang năng lượng và hào hứng vào các mối quan hệ'
        ],
        healthCorrelations: [
            'Higher extraversion linked to better immune function',
            'Lower risk of depression (especially social aspects)',
            'May engage in more risky behaviors due to sensation-seeking',
            'Better social support networks (protective factor)'
        ],
        developmentTips: [
            'Join social clubs or groups',
            'Practice initiating conversations',
            'Take on small leadership roles',
            'Challenge yourself to speak up in meetings',
            'Schedule regular social activities'
        ],
        developmentTipsVi: [
            'Tham gia câu lạc bộ hoặc nhóm xã hội',
            'Thực hành khởi xướng cuộc trò chuyện',
            'Đảm nhận vai trò lãnh đạo nhỏ',
            'Thử thách bản thân lên tiếng trong các cuộc họp',
            'Lên lịch các hoạt động xã hội thường xuyên'
        ]
    },
    {
        id: 'A',
        name: 'Agreeableness',
        nameVi: 'Dễ chịu',
        description: 'Reflects cooperativeness, trust, altruism, and concern for social harmony.',
        descriptionVi: 'Phản ánh tính hợp tác, tin tưởng, vị tha và quan tâm đến hài hòa xã hội.',
        highPole: 'Cooperative, trusting, helpful',
        lowPole: 'Competitive, skeptical, challenging',
        facets: [
            {
                id: 'A_compassion',
                name: 'Compassion',
                nameVi: 'Lòng trắc ẩn',
                domain: 'A',
                description: 'Concern for others\' well-being and suffering',
                descriptionVi: 'Quan tâm đến hạnh phúc và đau khổ của người khác',
                highBehaviors: ['Empathetic', 'Helps those in need', 'Feels for others'],
                lowBehaviors: ['More detached', 'Focuses on self', 'Less emotionally affected by others']
            },
            {
                id: 'A_respectfulness',
                name: 'Respectfulness',
                nameVi: 'Tôn trọng',
                domain: 'A',
                description: 'Politeness and consideration for others',
                descriptionVi: 'Lịch sự và quan tâm đến người khác',
                highBehaviors: ['Polite', 'Considerate', 'Avoids offending'],
                lowBehaviors: ['Blunt', 'Speaks mind freely', 'Less concerned with tact']
            },
            {
                id: 'A_trust',
                name: 'Trust',
                nameVi: 'Tin tưởng',
                domain: 'A',
                description: 'Tendency to believe in others\' good intentions',
                descriptionVi: 'Xu hướng tin vào ý định tốt của người khác',
                highBehaviors: ['Gives benefit of doubt', 'Believes people are good', 'Trusts easily'],
                lowBehaviors: ['Skeptical of motives', 'Cautious with trust', 'Verifies claims']
            }
        ],
        lifeOutcomes: [
            { outcome: 'Relationship quality', direction: 'positive', effectSize: 0.25 },
            { outcome: 'Team performance', direction: 'positive', effectSize: 0.20 },
            { outcome: 'Lower conflict', direction: 'positive', effectSize: 0.22 },
            { outcome: 'Salary (negative correlation)', direction: 'negative', effectSize: -0.10 }
        ],
        careerImplications: [
            'Excels in helping professions and team roles',
            'Good fit for HR, counseling, customer service',
            'May struggle in highly competitive environments',
            'Strong in conflict resolution'
        ],
        careerImplicationsVi: [
            'Xuất sắc trong các nghề giúp đỡ và vai trò nhóm',
            'Phù hợp với HR, tư vấn, dịch vụ khách hàng',
            'Có thể gặp khó khăn trong môi trường cạnh tranh cao',
            'Mạnh trong giải quyết xung đột'
        ],
        relationshipPatterns: [
            'Prioritizes partner happiness',
            'Avoids conflict (sometimes to a fault)',
            'Nurturing and supportive',
            'May have difficulty with boundaries'
        ],
        relationshipPatternsVi: [
            'Ưu tiên hạnh phúc của đối tác',
            'Tránh xung đột (đôi khi quá mức)',
            'Nuôi dưỡng và hỗ trợ',
            'Có thể gặp khó khăn với ranh giới'
        ],
        healthCorrelations: [
            'Lower agreeableness linked to cardiovascular risk (hostility)',
            'High agreeableness may lead to stress from prioritizing others',
            'Better social support networks',
            'Less conflict-related stress'
        ],
        developmentTips: [
            'Practice active listening',
            'Look for collaborative solutions',
            'Show appreciation to others regularly',
            'Give others benefit of the doubt',
            'Volunteer for helping organizations'
        ],
        developmentTipsVi: [
            'Thực hành lắng nghe tích cực',
            'Tìm kiếm các giải pháp hợp tác',
            'Thể hiện sự trân trọng với người khác thường xuyên',
            'Cho người khác cơ hội',
            'Tình nguyện cho các tổ chức giúp đỡ'
        ]
    },
    {
        id: 'N',
        name: 'Negative Emotionality (Neuroticism)',
        nameVi: 'Cảm xúc Tiêu cực (Bất ổn cảm xúc)',
        description: 'Reflects tendency to experience negative emotions like anxiety, sadness, and irritability.',
        descriptionVi: 'Phản ánh xu hướng trải nghiệm cảm xúc tiêu cực như lo âu, buồn bã và cáu kỉnh.',
        highPole: 'Sensitive, prone to stress, emotional',
        lowPole: 'Emotionally stable, calm, resilient',
        facets: [
            {
                id: 'N_anxiety',
                name: 'Anxiety',
                nameVi: 'Lo âu',
                domain: 'N',
                description: 'Tendency toward worry and nervousness',
                descriptionVi: 'Xu hướng lo lắng và bồn chồn',
                highBehaviors: ['Worries frequently', 'Feels nervous', 'Anticipates problems'],
                lowBehaviors: ['Calm under pressure', 'Rarely worries', 'Takes things in stride']
            },
            {
                id: 'N_depression',
                name: 'Depression',
                nameVi: 'Trầm cảm',
                domain: 'N',
                description: 'Tendency toward sadness and low mood',
                descriptionVi: 'Xu hướng buồn bã và tâm trạng thấp',
                highBehaviors: ['Feels sad often', 'Gets discouraged', 'Dwells on problems'],
                lowBehaviors: ['Generally positive mood', 'Bounces back', 'Optimistic outlook']
            },
            {
                id: 'N_emotional_volatility',
                name: 'Emotional Volatility',
                nameVi: 'Biến động Cảm xúc',
                domain: 'N',
                description: 'Tendency toward mood swings and emotional reactivity',
                descriptionVi: 'Xu hướng thay đổi tâm trạng và phản ứng cảm xúc',
                highBehaviors: ['Mood changes quickly', 'Easily upset', 'Emotional reactions'],
                lowBehaviors: ['Stable emotions', 'Even-keeled', 'Predictable reactions']
            }
        ],
        lifeOutcomes: [
            { outcome: 'Mental health problems', direction: 'positive', effectSize: 0.50 },
            { outcome: 'Relationship conflict', direction: 'positive', effectSize: 0.25 },
            { outcome: 'Job dissatisfaction', direction: 'positive', effectSize: 0.30 },
            { outcome: 'Physical health complaints', direction: 'positive', effectSize: 0.20 }
        ],
        careerImplications: [
            'May struggle in high-stress environments',
            'Benefits from supportive work cultures',
            'May excel in detail-oriented work (anxiety as vigilance)',
            'Important to develop coping strategies'
        ],
        careerImplicationsVi: [
            'Có thể gặp khó khăn trong môi trường căng thẳng cao',
            'Hưởng lợi từ văn hóa làm việc hỗ trợ',
            'Có thể xuất sắc trong công việc chú ý đến chi tiết (lo âu như cảnh giác)',
            'Quan trọng để phát triển chiến lược đối phó'
        ],
        relationshipPatterns: [
            'May seek reassurance frequently',
            'Sensitive to relationship threats',
            'Benefits from stable, supportive partners',
            'May experience relationship anxiety'
        ],
        relationshipPatternsVi: [
            'Có thể tìm kiếm sự trấn an thường xuyên',
            'Nhạy cảm với các mối đe dọa mối quan hệ',
            'Hưởng lợi từ đối tác ổn định, hỗ trợ',
            'Có thể trải nghiệm lo âu về mối quan hệ'
        ],
        healthCorrelations: [
            'Strongest personality predictor of mental health issues (d = 1.33 for depression)',
            'Higher neuroticism linked to more physical complaints',
            'May engage in less healthy coping (smoking, drinking)',
            'Higher stress hormones (cortisol)'
        ],
        developmentTips: [
            'Practice mindfulness and meditation',
            'Develop emotional regulation skills',
            'Build regular relaxation routines',
            'Challenge negative thought patterns (CBT)',
            'Exercise regularly for mood regulation',
            'Seek therapy if significantly impacting life'
        ],
        developmentTipsVi: [
            'Thực hành chánh niệm và thiền',
            'Phát triển kỹ năng điều chỉnh cảm xúc',
            'Xây dựng các thói quen thư giãn thường xuyên',
            'Thách thức các mẫu suy nghĩ tiêu cực (CBT)',
            'Tập thể dục thường xuyên để điều chỉnh tâm trạng',
            'Tìm kiếm trị liệu nếu ảnh hưởng đáng kể đến cuộc sống'
        ]
    }
]

// ============================================
// META-ANALYSIS EFFECT SIZES
// ============================================

export const BIG5_META_ANALYSIS_EFFECTS = {
    jobPerformance: {
        source: 'Barrick & Mount (1991); Wilmot & Ones (2019)',
        effects: {
            O: { r: 0.07, context: 'Stronger for creative jobs' },
            C: { r: 0.22, context: 'Strongest predictor across jobs' },
            E: { r: 0.13, context: 'Stronger for sales/management' },
            A: { r: 0.07, context: 'Important for teamwork' },
            N: { r: -0.13, context: 'Negative impact on performance' }
        }
    },
    academicPerformance: {
        source: 'Poropat (2009)',
        effects: {
            O: { r: 0.12, context: 'Intellectual curiosity helps' },
            C: { r: 0.22, context: 'As strong as intelligence' },
            E: { r: 0.00, context: 'No consistent effect' },
            A: { r: 0.07, context: 'Small positive effect' },
            N: { r: -0.03, context: 'Small negative effect' }
        }
    },
    leadership: {
        source: 'Judge et al. (2002)',
        effects: {
            O: { r: 0.24, context: 'Vision and creativity' },
            C: { r: 0.28, context: 'Reliability and organization' },
            E: { r: 0.31, context: 'Strongest predictor' },
            A: { r: 0.08, context: 'Weak effect' },
            N: { r: -0.24, context: 'Emotional stability important' }
        }
    },
    mentalHealth: {
        source: 'Kotov et al. (2010)',
        effects: {
            O: { d: 0.00, context: 'Generally not related' },
            C: { d: -0.90, context: 'Protective factor' },
            E: { d: -1.00, context: 'Strong protective factor' },
            A: { d: -0.52, context: 'Moderate protective factor' },
            N: { d: 1.33, context: 'Strongest risk factor' }
        }
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Interpret T-score
 */
export function interpretTScore(tScore: number): Big5TScore {
    for (const range of BIG5_TSCORE_RANGES) {
        if (tScore >= range.range[0] && tScore <= range.range[1]) {
            return range
        }
    }
    return BIG5_TSCORE_RANGES[2] // Default to average
}

/**
 * Get domain by ID
 */
export function getBig5Domain(id: 'O' | 'C' | 'E' | 'A' | 'N'): Big5Domain {
    return BIG5_DOMAINS.find(d => d.id === id)!
}

/**
 * Calculate profile narrative
 */
export function generateBig5Narrative(scores: { O: number; C: number; E: number; A: number; N: number }): string {
    const traits: string[] = []

    if (scores.O > 60) traits.push('curious and creative')
    if (scores.O < 40) traits.push('practical and conventional')
    if (scores.C > 60) traits.push('organized and disciplined')
    if (scores.C < 40) traits.push('flexible and spontaneous')
    if (scores.E > 60) traits.push('outgoing and energetic')
    if (scores.E < 40) traits.push('reserved and reflective')
    if (scores.A > 60) traits.push('cooperative and trusting')
    if (scores.A < 40) traits.push('skeptical and challenging')
    if (scores.N > 60) traits.push('sensitive to stress')
    if (scores.N < 40) traits.push('emotionally stable')

    if (traits.length === 0) return 'Your personality profile is balanced across all dimensions.'

    return `Your personality profile suggests you are ${traits.join(', ')}.`
}

/**
 * Get career recommendations based on Big5
 */
export function getCareersForBig5Profile(scores: { O: number; C: number; E: number; A: number; N: number }): string[] {
    const careers: string[] = []

    // High O + High C = Research
    if (scores.O > 60 && scores.C > 60) {
        careers.push('Researcher', 'Data Scientist', 'Architect', 'UX Designer')
    }

    // High E + High A = People-focused
    if (scores.E > 60 && scores.A > 60) {
        careers.push('HR Manager', 'Teacher', 'Counselor', 'Sales Manager')
    }

    // High C + Low N = Reliable professional
    if (scores.C > 60 && scores.N < 40) {
        careers.push('Surgeon', 'Pilot', 'Financial Analyst', 'Project Manager')
    }

    // High O + High E = Creative leadership
    if (scores.O > 60 && scores.E > 60) {
        careers.push('Entrepreneur', 'Marketing Director', 'Creative Director', 'Consultant')
    }

    // High C + High A = Service-oriented
    if (scores.C > 60 && scores.A > 60) {
        careers.push('Nurse', 'Social Worker', 'Teacher', 'Customer Service Manager')
    }

    // Low E = Independent work
    if (scores.E < 40 && scores.C > 50) {
        careers.push('Software Developer', 'Writer', 'Accountant', 'Analyst')
    }

    return [...new Set(careers)].slice(0, 6)
}
