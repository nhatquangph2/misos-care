/**
 * MBTI Knowledge Base
 * 
 * PRIMARY SOURCES:
 * ================
 * 
 * MBTI-BIG5 MAPPING (CRITICAL - all values in big5Mapping are from):
 * - McCrae, R. R., & Costa, P. T. (1989). Reinterpreting the Myers-Briggs Type Indicator
 *   from the perspective of the five-factor model of personality.
 *   Journal of Personality, 57(1), 17-40. DOI: 10.1111/j.1467-6494.1989.tb00759.x
 *   [E-I ↔ Extraversion r = .74, S-N ↔ Openness r = .72,
 *    T-F ↔ Agreeableness r = -.44, J-P ↔ Conscientiousness r = -.49]
 *   [This study shows MBTI dimensions are largely redundant with Big Five]
 * 
 * VALIDITY CONCERNS (values in MBTI_SCIENTIFIC_CONTEXT.validityConcerns):
 * - Pittenger, D. J. (1993). Measuring the MBTI... and coming up short.
 *   Journal of Career Planning and Employment, 54(1), 48-52.
 *   [Test-retest reliability: 35-50% get different type after 5 weeks]
 * - Boyle, G. J. (1995). Myers-Briggs Type Indicator (MBTI): Some psychometric limitations.
 *   Australian Psychologist, 30(1), 71-74. DOI: 10.1080/00050069508259607
 * - Gardner, W. L., & Martinko, M. J. (1996). Using the Myers-Briggs Type Indicator to
 *   study managers: A literature review and research agenda.
 *   Journal of Management, 22(1), 45-83. DOI: 10.1177/014920639602200103
 * 
 * CRITICAL REVIEWS:
 * - Murphy Paul, A. (2004). The Cult of Personality Testing. Free Press.
 *   [Book-length critique of MBTI and personality testing]
 * - Grant, A. M. (2013). Goodbye to MBTI, the fad that won't die.
 *   Psychology Today. [Popular critique]
 * 
 * APPROPRIATE USES:
 * - Based on consensus from I/O psychology literature that MBTI should NOT be used for:
 *   personnel selection, clinical diagnosis, or any high-stakes decisions.
 * - Acceptable uses: self-reflection, team communication exercises, career exploration.
 * 
 * NOTE: This knowledge base includes MBTI for practical use cases (many Vietnamese users
 * know their MBTI type) while emphasizing scientific limitations and preferring Big5.
 */

// ============================================
// TYPES
// ============================================

export interface MBTIDimension {
    id: string
    pole1: { code: string; name: string; nameVi: string }
    pole2: { code: string; name: string; nameVi: string }
    description: string
    descriptionVi: string
    // Correlation with Big5 from McCrae & Costa (1989)
    big5Correlation: { trait: string; r: number }
}

export interface MBTIType {
    code: string
    name: string
    nameVi: string
    nickname: string
    nicknameVi: string
    description: string
    descriptionVi: string
    // Cognitive functions stack
    cognitiveStack: string[]
    // Strengths and weaknesses
    strengths: string[]
    strengthsVi: string[]
    weaknesses: string[]
    weaknessesVi: string[]
    // Career fit
    careerFit: string[]
    careerFitVi: string[]
    // Communication style
    communicationStyle: string
    communicationStyleVi: string
    // Under stress behaviors
    underStress: string
    underStressVi: string
    // Growth areas
    growthAreas: string[]
    growthAreasVi: string[]
    // Big5 typical profile (approximate)
    typicalBig5: { O: string; C: string; E: string; A: string; N: string }
}

// ============================================
// SCIENTIFIC CONTEXT
// ============================================

export const MBTI_SCIENTIFIC_CONTEXT = {
    validityConcerns: [
        'Test-retest reliability is low: 35-50% of people get different type after 5 weeks (Pittenger, 1993)',
        'Dichotomies force continuous traits into categories, losing information',
        'Types do not show bimodal distributions as theory predicts',
        'Limited predictive validity for job performance',
        'Not recommended by APA for selection/clinical decisions'
    ],
    validityConcernsVi: [
        'Độ tin cậy test-retest thấp: 35-50% người nhận được loại khác sau 5 tuần (Pittenger, 1993)',
        'Phân đôi buộc các đặc điểm liên tục thành các danh mục, mất thông tin',
        'Các loại không hiển thị phân phối hai modal như lý thuyết dự đoán',
        'Khả năng dự đoán hạn chế cho hiệu suất công việc',
        'Không được APA khuyến nghị cho quyết định tuyển chọn/lâm sàng'
    ],
    appropriateUses: [
        'Self-reflection and personal development',
        'Team building exercises (with caveats)',
        'Understanding communication preferences',
        'Career exploration (not selection)',
        'Conversation starter about personality'
    ],
    appropriateUsesVi: [
        'Tự suy ngẫm và phát triển cá nhân',
        'Bài tập xây dựng đội nhóm (có lưu ý)',
        'Hiểu sở thích giao tiếp',
        'Khám phá nghề nghiệp (không phải tuyển chọn)',
        'Khởi đầu cuộc trò chuyện về tính cách'
    ],
    big5Mapping: {
        'E-I': { big5Trait: 'Extraversion', r: 0.74, source: 'McCrae & Costa (1989)' },
        'S-N': { big5Trait: 'Openness', r: 0.72, source: 'McCrae & Costa (1989)' },
        'T-F': { big5Trait: 'Agreeableness', r: -0.44, source: 'McCrae & Costa (1989)' },
        'J-P': { big5Trait: 'Conscientiousness', r: -0.49, source: 'McCrae & Costa (1989)' }
    }
}

// ============================================
// MBTI DIMENSIONS
// ============================================

export const MBTI_DIMENSIONS: MBTIDimension[] = [
    {
        id: 'E-I',
        pole1: { code: 'E', name: 'Extraversion', nameVi: 'Hướng ngoại' },
        pole2: { code: 'I', name: 'Introversion', nameVi: 'Hướng nội' },
        description: 'Where you get your energy: from the outer world (E) or inner world (I)',
        descriptionVi: 'Nơi bạn lấy năng lượng: từ thế giới bên ngoài (E) hay thế giới bên trong (I)',
        big5Correlation: { trait: 'Extraversion', r: 0.74 }
    },
    {
        id: 'S-N',
        pole1: { code: 'S', name: 'Sensing', nameVi: 'Giác quan' },
        pole2: { code: 'N', name: 'Intuition', nameVi: 'Trực giác' },
        description: 'How you take in information: through senses and facts (S) or patterns and possibilities (N)',
        descriptionVi: 'Cách bạn tiếp nhận thông tin: thông qua giác quan và sự kiện (S) hay các mẫu và khả năng (N)',
        big5Correlation: { trait: 'Openness', r: 0.72 }
    },
    {
        id: 'T-F',
        pole1: { code: 'T', name: 'Thinking', nameVi: 'Tư duy' },
        pole2: { code: 'F', name: 'Feeling', nameVi: 'Cảm xúc' },
        description: 'How you make decisions: through logic and analysis (T) or values and people-focus (F)',
        descriptionVi: 'Cách bạn đưa ra quyết định: thông qua logic và phân tích (T) hay giá trị và con người (F)',
        big5Correlation: { trait: 'Agreeableness', r: -0.44 }
    },
    {
        id: 'J-P',
        pole1: { code: 'J', name: 'Judging', nameVi: 'Đánh giá' },
        pole2: { code: 'P', name: 'Perceiving', nameVi: 'Nhận thức' },
        description: 'How you approach the outer world: structured and decided (J) or flexible and adaptable (P)',
        descriptionVi: 'Cách bạn tiếp cận thế giới bên ngoài: có cấu trúc và quyết đoán (J) hay linh hoạt và thích ứng (P)',
        big5Correlation: { trait: 'Conscientiousness', r: -0.49 }
    }
]

// ============================================
// 16 MBTI TYPES
// ============================================

export const MBTI_TYPES: MBTIType[] = [
    // ANALYSTS
    {
        code: 'INTJ',
        name: 'INTJ',
        nameVi: 'INTJ',
        nickname: 'The Architect',
        nicknameVi: 'Kiến trúc sư',
        description: 'Strategic, independent thinkers with a plan for everything. Combine imagination with reliability.',
        descriptionVi: 'Người suy nghĩ chiến lược, độc lập với kế hoạch cho mọi thứ. Kết hợp trí tưởng tượng với độ tin cậy.',
        cognitiveStack: ['Ni', 'Te', 'Fi', 'Se'],
        strengths: ['Strategic thinking', 'Independence', 'Determination', 'Curiosity', 'Originality'],
        strengthsVi: ['Tư duy chiến lược', 'Độc lập', 'Quyết tâm', 'Tò mò', 'Độc đáo'],
        weaknesses: ['Arrogant', 'Dismissive of emotions', 'Overly critical', 'Combative'],
        weaknessesVi: ['Kiêu ngạo', 'Bác bỏ cảm xúc', 'Quá phê phán', 'Hay tranh cãi'],
        careerFit: ['Scientist', 'Engineer', 'Strategist', 'Architect', 'Investment Banker'],
        careerFitVi: ['Nhà khoa học', 'Kỹ sư', 'Chiến lược gia', 'Kiến trúc sư', 'Nhà đầu tư ngân hàng'],
        communicationStyle: 'Direct, logical, may seem cold. Values efficiency in communication.',
        communicationStyleVi: 'Trực tiếp, logic, có thể có vẻ lạnh lùng. Đánh giá cao hiệu quả trong giao tiếp.',
        underStress: 'May indulge in sensory pleasures, become uncharacteristically impulsive',
        underStressVi: 'Có thể đắm chìm trong thú vui giác quan, trở nên bốc đồng bất thường',
        growthAreas: ['Develop emotional intelligence', 'Practice patience with others', 'Accept imperfection'],
        growthAreasVi: ['Phát triển trí tuệ cảm xúc', 'Thực hành kiên nhẫn với người khác', 'Chấp nhận sự không hoàn hảo'],
        typicalBig5: { O: 'High', C: 'High', E: 'Low', A: 'Low-Mid', N: 'Low-Mid' }
    },
    {
        code: 'INTP',
        name: 'INTP',
        nameVi: 'INTP',
        nickname: 'The Logician',
        nicknameVi: 'Nhà logic',
        description: 'Innovative inventors with an unquenchable thirst for knowledge. Value logic above all.',
        descriptionVi: 'Nhà phát minh sáng tạo với khát khao kiến thức không thể dập tắt. Đánh giá logic trên hết.',
        cognitiveStack: ['Ti', 'Ne', 'Si', 'Fe'],
        strengths: ['Analytical', 'Original', 'Open-minded', 'Curious', 'Objective'],
        strengthsVi: ['Phân tích', 'Độc đáo', 'Cởi mở', 'Tò mò', 'Khách quan'],
        weaknesses: ['Absent-minded', 'Condescending', 'Insensitive', 'Impatient'],
        weaknessesVi: ['Đãng trí', 'Kẻ cả', 'Vô cảm', 'Thiếu kiên nhẫn'],
        careerFit: ['Software Developer', 'Philosopher', 'Mathematician', 'Researcher', 'Data Scientist'],
        careerFitVi: ['Lập trình viên', 'Triết gia', 'Nhà toán học', 'Nhà nghiên cứu', 'Nhà khoa học dữ liệu'],
        communicationStyle: 'Precise, theoretical, may seem detached. Loves intellectual debates.',
        communicationStyleVi: 'Chính xác, lý thuyết, có thể có vẻ tách biệt. Thích tranh luận trí tuệ.',
        underStress: 'May become emotionally reactive, hypersensitive about relationships',
        underStressVi: 'Có thể trở nên phản ứng cảm xúc, quá nhạy cảm về các mối quan hệ',
        growthAreas: ['Follow through on ideas', 'Develop social skills', 'Practice completion'],
        growthAreasVi: ['Theo đuổi ý tưởng đến cùng', 'Phát triển kỹ năng xã hội', 'Thực hành hoàn thành'],
        typicalBig5: { O: 'High', C: 'Low', E: 'Low', A: 'Low', N: 'Mid' }
    },
    {
        code: 'ENTJ',
        name: 'ENTJ',
        nameVi: 'ENTJ',
        nickname: 'The Commander',
        nicknameVi: 'Chỉ huy',
        description: 'Bold, imaginative and strong-willed leaders, always finding a way – or making one.',
        descriptionVi: 'Lãnh đạo táo bạo, giàu trí tưởng tượng và ý chí mạnh mẽ, luôn tìm cách hoặc tạo ra cách.',
        cognitiveStack: ['Te', 'Ni', 'Se', 'Fi'],
        strengths: ['Efficient', 'Energetic', 'Self-confident', 'Strong-willed', 'Strategic'],
        strengthsVi: ['Hiệu quả', 'Năng động', 'Tự tin', 'Ý chí mạnh mẽ', 'Chiến lược'],
        weaknesses: ['Stubborn', 'Intolerant', 'Impatient', 'Arrogant', 'Cold'],
        weaknessesVi: ['Cứng đầu', 'Không khoan dung', 'Thiếu kiên nhẫn', 'Kiêu ngạo', 'Lạnh lùng'],
        careerFit: ['Executive', 'Entrepreneur', 'Lawyer', 'Consultant', 'University Professor'],
        careerFitVi: ['Lãnh đạo điều hành', 'Doanh nhân', 'Luật sư', 'Tư vấn viên', 'Giáo sư đại học'],
        communicationStyle: 'Direct, commanding, may seem harsh. Focused on efficiency and results.',
        communicationStyleVi: 'Trực tiếp, chỉ huy, có thể có vẻ khắc nghiệt. Tập trung vào hiệu quả và kết quả.',
        underStress: 'May become controlling, obsess over minor details, emotional outbursts',
        underStressVi: 'Có thể trở nên kiểm soát, ám ảnh về chi tiết nhỏ, bùng nổ cảm xúc',
        growthAreas: ['Listen more', 'Value emotions', 'Delegate effectively'],
        growthAreasVi: ['Lắng nghe nhiều hơn', 'Đánh giá cảm xúc', 'Ủy quyền hiệu quả'],
        typicalBig5: { O: 'High', C: 'High', E: 'High', A: 'Low', N: 'Low' }
    },
    {
        code: 'ENTP',
        name: 'ENTP',
        nameVi: 'ENTP',
        nickname: 'The Debater',
        nicknameVi: 'Người tranh luận',
        description: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
        descriptionVi: 'Người suy nghĩ thông minh và tò mò không thể cưỡng lại thử thách trí tuệ.',
        cognitiveStack: ['Ne', 'Ti', 'Fe', 'Si'],
        strengths: ['Quick-thinking', 'Knowledgeable', 'Charismatic', 'Original', 'Excellent brainstormer'],
        strengthsVi: ['Suy nghĩ nhanh', 'Hiểu biết', 'Lôi cuốn', 'Độc đáo', 'Brainstorm xuất sắc'],
        weaknesses: ['Argumentative', 'Insensitive', 'Intolerant', 'Unfocused'],
        weaknessesVi: ['Hay tranh cãi', 'Vô cảm', 'Không khoan dung', 'Thiếu tập trung'],
        careerFit: ['Entrepreneur', 'Lawyer', 'Consultant', 'Engineer', 'Journalist'],
        careerFitVi: ['Doanh nhân', 'Luật sư', 'Tư vấn viên', 'Kỹ sư', 'Nhà báo'],
        communicationStyle: 'Witty, challenging, loves debate. May argue for fun.',
        communicationStyleVi: 'Dí dỏm, thách thức, thích tranh luận. Có thể tranh cãi cho vui.',
        underStress: 'May become obsessive about minor issues, withdrawn, pessimistic',
        underStressVi: 'Có thể trở nên ám ảnh về các vấn đề nhỏ, thu mình, bi quan',
        growthAreas: ['Follow through on projects', 'Consider others\' feelings', 'Focus'],
        growthAreasVi: ['Theo đuổi dự án đến cùng', 'Xem xét cảm xúc của người khác', 'Tập trung'],
        typicalBig5: { O: 'High', C: 'Low', E: 'High', A: 'Low', N: 'Low-Mid' }
    },

    // DIPLOMATS
    {
        code: 'INFJ',
        name: 'INFJ',
        nameVi: 'INFJ',
        nickname: 'The Advocate',
        nicknameVi: 'Người ủng hộ',
        description: 'Quiet and mystical, yet very inspiring and tireless idealists.',
        descriptionVi: 'Trầm lặng và huyền bí, nhưng rất truyền cảm hứng và là những người lý tưởng không mệt mỏi.',
        cognitiveStack: ['Ni', 'Fe', 'Ti', 'Se'],
        strengths: ['Insightful', 'Principled', 'Creative', 'Passionate', 'Altruistic'],
        strengthsVi: ['Sáng suốt', 'Có nguyên tắc', 'Sáng tạo', 'Đam mê', 'Vị tha'],
        weaknesses: ['Sensitive to criticism', 'Perfectionistic', 'Burns out easily', 'Private'],
        weaknessesVi: ['Nhạy cảm với phê bình', 'Cầu toàn', 'Dễ kiệt sức', 'Riêng tư'],
        careerFit: ['Counselor', 'Writer', 'Nonprofit Director', 'HR Manager', 'Psychologist'],
        careerFitVi: ['Tư vấn viên', 'Nhà văn', 'Giám đốc phi lợi nhuận', 'Quản lý HR', 'Nhà tâm lý học'],
        communicationStyle: 'Warm but reserved. Seeks deep, meaningful conversations.',
        communicationStyleVi: 'Ấm áp nhưng dè dặt. Tìm kiếm các cuộc trò chuyện sâu sắc, có ý nghĩa.',
        underStress: 'May become uncharacteristically critical, obsess over external details',
        underStressVi: 'Có thể trở nên phê phán bất thường, ám ảnh về các chi tiết bên ngoài',
        growthAreas: ['Set boundaries', 'Accept imperfection', 'Engage with present moment'],
        growthAreasVi: ['Đặt ranh giới', 'Chấp nhận sự không hoàn hảo', 'Tương tác với hiện tại'],
        typicalBig5: { O: 'High', C: 'Mid-High', E: 'Low', A: 'High', N: 'Mid-High' }
    },
    {
        code: 'INFP',
        name: 'INFP',
        nameVi: 'INFP',
        nickname: 'The Mediator',
        nicknameVi: 'Người hòa giải',
        description: 'Poetic, kind and altruistic, always eager to help a good cause.',
        descriptionVi: 'Thơ mộng, tử tế và vị tha, luôn háo hức giúp đỡ một mục đích tốt.',
        cognitiveStack: ['Fi', 'Ne', 'Si', 'Te'],
        strengths: ['Empathetic', 'Generous', 'Open-minded', 'Creative', 'Passionate'],
        strengthsVi: ['Đồng cảm', 'Hào phóng', 'Cởi mở', 'Sáng tạo', 'Đam mê'],
        weaknesses: ['Unrealistic', 'Self-isolating', 'Unfocused', 'Sensitive'],
        weaknessesVi: ['Không thực tế', 'Tự cô lập', 'Thiếu tập trung', 'Nhạy cảm'],
        careerFit: ['Writer', 'Artist', 'Therapist', 'Human Rights Worker', 'Librarian'],
        careerFitVi: ['Nhà văn', 'Nghệ sĩ', 'Nhà trị liệu', 'Nhân viên nhân quyền', 'Thủ thư'],
        communicationStyle: 'Warm, authentic, may take time to open up.',
        communicationStyleVi: 'Ấm áp, chân thật, có thể mất thời gian để mở lòng.',
        underStress: 'May become harsh, critical, focused on external efficiency',
        underStressVi: 'Có thể trở nên khắc nghiệt, phê phán, tập trung vào hiệu quả bên ngoài',
        growthAreas: ['Take action on ideas', 'Set practical goals', 'Develop resilience'],
        growthAreasVi: ['Hành động theo ý tưởng', 'Đặt mục tiêu thực tế', 'Phát triển khả năng phục hồi'],
        typicalBig5: { O: 'High', C: 'Low', E: 'Low', A: 'High', N: 'High' }
    },
    {
        code: 'ENFJ',
        name: 'ENFJ',
        nameVi: 'ENFJ',
        nickname: 'The Protagonist',
        nicknameVi: 'Nhân vật chính',
        description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.',
        descriptionVi: 'Lãnh đạo lôi cuốn và truyền cảm hứng, có thể mê hoặc người nghe.',
        cognitiveStack: ['Fe', 'Ni', 'Se', 'Ti'],
        strengths: ['Receptive', 'Reliable', 'Passionate', 'Charismatic', 'Natural leaders'],
        strengthsVi: ['Tiếp thu', 'Đáng tin cậy', 'Đam mê', 'Lôi cuốn', 'Lãnh đạo tự nhiên'],
        weaknesses: ['Overly idealistic', 'Too selfless', 'Sensitive to criticism', 'Too intense'],
        weaknessesVi: ['Quá lý tưởng', 'Quá vị tha', 'Nhạy cảm với phê bình', 'Quá căng thẳng'],
        careerFit: ['Teacher', 'Coach', 'HR Director', 'Nonprofit Leader', 'Politician'],
        careerFitVi: ['Giáo viên', 'Huấn luyện viên', 'Giám đốc HR', 'Lãnh đạo phi lợi nhuận', 'Chính trị gia'],
        communicationStyle: 'Warm, encouraging, emotionally expressive. Naturally persuasive.',
        communicationStyleVi: 'Ấm áp, khuyến khích, biểu cảm cảm xúc. Có khả năng thuyết phục tự nhiên.',
        underStress: 'May become overly critical, withdrawn, coldly logical',
        underStressVi: 'Có thể trở nên quá phê phán, thu mình, logic lạnh lùng',
        growthAreas: ['Set boundaries', 'Accept criticism', 'Care for self first'],
        growthAreasVi: ['Đặt ranh giới', 'Chấp nhận phê bình', 'Chăm sóc bản thân trước'],
        typicalBig5: { O: 'High', C: 'Mid-High', E: 'High', A: 'High', N: 'Mid' }
    },
    {
        code: 'ENFP',
        name: 'ENFP',
        nameVi: 'ENFP',
        nickname: 'The Campaigner',
        nicknameVi: 'Người vận động',
        description: 'Enthusiastic, creative free spirits who can always find a reason to smile.',
        descriptionVi: 'Tinh thần tự do nhiệt huyết, sáng tạo, luôn tìm được lý do để cười.',
        cognitiveStack: ['Ne', 'Fi', 'Te', 'Si'],
        strengths: ['Curious', 'Perceptive', 'Enthusiastic', 'Excellent communicators', 'Festive'],
        strengthsVi: ['Tò mò', 'Nhạy bén', 'Nhiệt huyết', 'Giao tiếp xuất sắc', 'Vui vẻ'],
        weaknesses: ['Unfocused', 'Disorganized', 'Overly accommodating', 'Overly optimistic'],
        weaknessesVi: ['Thiếu tập trung', 'Thiếu tổ chức', 'Quá chiều người', 'Quá lạc quan'],
        careerFit: ['Journalist', 'Actor', 'Consultant', 'Counselor', 'Entrepreneur'],
        careerFitVi: ['Nhà báo', 'Diễn viên', 'Tư vấn viên', 'Cố vấn', 'Doanh nhân'],
        communicationStyle: 'Warm, enthusiastic, loves brainstorming. May jump between topics.',
        communicationStyleVi: 'Ấm áp, nhiệt huyết, thích brainstorm. Có thể nhảy giữa các chủ đề.',
        underStress: 'May obsess over details, become rigid about organization',
        underStressVi: 'Có thể ám ảnh về chi tiết, trở nên cứng nhắc về tổ chức',
        growthAreas: ['Follow through on commitments', 'Develop focus', 'Accept routine'],
        growthAreasVi: ['Theo đuổi cam kết', 'Phát triển sự tập trung', 'Chấp nhận thói quen'],
        typicalBig5: { O: 'High', C: 'Low', E: 'High', A: 'High', N: 'Mid' }
    },

    // SENTINELS
    {
        code: 'ISTJ',
        name: 'ISTJ',
        nameVi: 'ISTJ',
        nickname: 'The Logistician',
        nicknameVi: 'Nhà hậu cần',
        description: 'Practical and fact-minded individuals, whose reliability cannot be doubted.',
        descriptionVi: 'Cá nhân thực tế và chú trọng sự kiện, độ tin cậy không thể nghi ngờ.',
        cognitiveStack: ['Si', 'Te', 'Fi', 'Ne'],
        strengths: ['Honest', 'Direct', 'Responsible', 'Calm', 'Orderly'],
        strengthsVi: ['Trung thực', 'Trực tiếp', 'Có trách nhiệm', 'Bình tĩnh', 'Có trật tự'],
        weaknesses: ['Stubborn', 'Insensitive', 'Judgmental', 'Inflexible'],
        weaknessesVi: ['Cứng đầu', 'Vô cảm', 'Hay phán xét', 'Thiếu linh hoạt'],
        careerFit: ['Accountant', 'Military Officer', 'Judge', 'Auditor', 'Administrator'],
        careerFitVi: ['Kế toán viên', 'Sĩ quan quân đội', 'Thẩm phán', 'Kiểm toán viên', 'Quản trị viên'],
        communicationStyle: 'Direct, factual, may seem cold. Values efficiency.',
        communicationStyleVi: 'Trực tiếp, thực tế, có thể có vẻ lạnh lùng. Đánh giá cao hiệu quả.',
        underStress: 'May become anxious about possibilities, catastrophize',
        underStressVi: 'Có thể trở nên lo lắng về các khả năng, bi quan hóa',
        growthAreas: ['Be more flexible', 'Consider emotions', 'Try new approaches'],
        growthAreasVi: ['Linh hoạt hơn', 'Xem xét cảm xúc', 'Thử các phương pháp mới'],
        typicalBig5: { O: 'Low', C: 'High', E: 'Low', A: 'Mid', N: 'Low' }
    },
    {
        code: 'ISFJ',
        name: 'ISFJ',
        nameVi: 'ISFJ',
        nickname: 'The Defender',
        nicknameVi: 'Người bảo vệ',
        description: 'Very dedicated and warm protectors, always ready to defend their loved ones.',
        descriptionVi: 'Người bảo vệ tận tụy và ấm áp, luôn sẵn sàng bảo vệ người thân.',
        cognitiveStack: ['Si', 'Fe', 'Ti', 'Ne'],
        strengths: ['Supportive', 'Reliable', 'Patient', 'Observant', 'Loyal'],
        strengthsVi: ['Hỗ trợ', 'Đáng tin cậy', 'Kiên nhẫn', 'Tinh ý', 'Trung thành'],
        weaknesses: ['Humble to a fault', 'Reluctant to change', 'Takes things personally', 'Overworks'],
        weaknessesVi: ['Khiêm tốn quá mức', 'Miễn cưỡng thay đổi', 'Nhận mọi thứ cá nhân', 'Làm việc quá sức'],
        careerFit: ['Nurse', 'Teacher', 'HR Manager', 'Social Worker', 'Librarian'],
        careerFitVi: ['Y tá', 'Giáo viên', 'Quản lý HR', 'Nhân viên xã hội', 'Thủ thư'],
        communicationStyle: 'Warm, detailed, caring. May avoid conflict.',
        communicationStyleVi: 'Ấm áp, chi tiết, quan tâm. Có thể tránh xung đột.',
        underStress: 'May become anxious about future, pessimistic about possibilities',
        underStressVi: 'Có thể trở nên lo lắng về tương lai, bi quan về các khả năng',
        growthAreas: ['Set boundaries', 'Ask for help', 'Express needs'],
        growthAreasVi: ['Đặt ranh giới', 'Yêu cầu giúp đỡ', 'Bày tỏ nhu cầu'],
        typicalBig5: { O: 'Low', C: 'High', E: 'Low', A: 'High', N: 'Mid' }
    },
    {
        code: 'ESTJ',
        name: 'ESTJ',
        nameVi: 'ESTJ',
        nickname: 'The Executive',
        nicknameVi: 'Giám đốc điều hành',
        description: 'Excellent administrators, unsurpassed at managing things – or people.',
        descriptionVi: 'Nhà quản trị xuất sắc, vượt trội trong việc quản lý mọi thứ - hoặc con người.',
        cognitiveStack: ['Te', 'Si', 'Ne', 'Fi'],
        strengths: ['Dedicated', 'Strong-willed', 'Direct', 'Honest', 'Patient'],
        strengthsVi: ['Tận tụy', 'Ý chí mạnh mẽ', 'Trực tiếp', 'Trung thực', 'Kiên nhẫn'],
        weaknesses: ['Inflexible', 'Uncomfortable with emotions', 'Stubborn', 'Judgemental'],
        weaknessesVi: ['Thiếu linh hoạt', 'Khó chịu với cảm xúc', 'Cứng đầu', 'Hay phán xét'],
        careerFit: ['Manager', 'Judge', 'Financial Officer', 'Military Leader', 'Coach'],
        careerFitVi: ['Quản lý', 'Thẩm phán', 'Giám đốc tài chính', 'Lãnh đạo quân sự', 'Huấn luyện viên'],
        communicationStyle: 'Direct, clear, commanding. Focused on efficiency.',
        communicationStyleVi: 'Trực tiếp, rõ ràng, chỉ huy. Tập trung vào hiệu quả.',
        underStress: 'May become emotionally reactive, take things personally',
        underStressVi: 'Có thể trở nên phản ứng cảm xúc, nhận mọi thứ cá nhân',
        growthAreas: ['Consider feelings', 'Be more flexible', 'Accept new ideas'],
        growthAreasVi: ['Xem xét cảm xúc', 'Linh hoạt hơn', 'Chấp nhận ý tưởng mới'],
        typicalBig5: { O: 'Low', C: 'High', E: 'High', A: 'Low-Mid', N: 'Low' }
    },
    {
        code: 'ESFJ',
        name: 'ESFJ',
        nameVi: 'ESFJ',
        nickname: 'The Consul',
        nicknameVi: 'Người tham vấn',
        description: 'Extraordinarily caring, social and popular, always eager to help.',
        descriptionVi: 'Quan tâm phi thường, xã hội và phổ biến, luôn háo hức giúp đỡ.',
        cognitiveStack: ['Fe', 'Si', 'Ne', 'Ti'],
        strengths: ['Strong practical skills', 'Loyal', 'Sensitive', 'Warm', 'Good at connecting'],
        strengthsVi: ['Kỹ năng thực tế mạnh', 'Trung thành', 'Nhạy cảm', 'Ấm áp', 'Giỏi kết nối'],
        weaknesses: ['Worried about status', 'Inflexible', 'Vulnerable to criticism', 'Needy'],
        weaknessesVi: ['Lo lắng về địa vị', 'Thiếu linh hoạt', 'Dễ bị tổn thương bởi phê bình', 'Cần người khác'],
        careerFit: ['Event Planner', 'Nurse', 'Teacher', 'Sales Representative', 'HR'],
        careerFitVi: ['Nhà tổ chức sự kiện', 'Y tá', 'Giáo viên', 'Đại diện bán hàng', 'HR'],
        communicationStyle: 'Warm, supportive, socially skilled. Naturally connects with others.',
        communicationStyleVi: 'Ấm áp, hỗ trợ, có kỹ năng xã hội. Kết nối tự nhiên với người khác.',
        underStress: 'May become coldly analytical, detached, overly critical',
        underStressVi: 'Có thể trở nên phân tích lạnh lùng, tách biệt, quá phê phán',
        growthAreas: ['Develop independence', 'Accept criticism', 'Try new things'],
        growthAreasVi: ['Phát triển sự độc lập', 'Chấp nhận phê bình', 'Thử những điều mới'],
        typicalBig5: { O: 'Low', C: 'High', E: 'High', A: 'High', N: 'Mid' }
    },

    // EXPLORERS
    {
        code: 'ISTP',
        name: 'ISTP',
        nameVi: 'ISTP',
        nickname: 'The Virtuoso',
        nicknameVi: 'Người tài hoa',
        description: 'Bold and practical experimenters, masters of all kinds of tools.',
        descriptionVi: 'Người thử nghiệm táo bạo và thực tế, bậc thầy của tất cả các loại công cụ.',
        cognitiveStack: ['Ti', 'Se', 'Ni', 'Fe'],
        strengths: ['Optimistic', 'Creative', 'Practical', 'Relaxed', 'Crisis handler'],
        strengthsVi: ['Lạc quan', 'Sáng tạo', 'Thực tế', 'Thoải mái', 'Xử lý khủng hoảng'],
        weaknesses: ['Stubborn', 'Insensitive', 'Private', 'Easily bored', 'Risk-taker'],
        weaknessesVi: ['Cứng đầu', 'Vô cảm', 'Riêng tư', 'Dễ chán', 'Chấp nhận rủi ro'],
        careerFit: ['Mechanic', 'Engineer', 'Pilot', 'Chef', 'Forensic Scientist'],
        careerFitVi: ['Thợ cơ khí', 'Kỹ sư', 'Phi công', 'Đầu bếp', 'Nhà khoa học pháp y'],
        communicationStyle: 'Brief, action-oriented. Shows love through actions.',
        communicationStyleVi: 'Ngắn gọn, hướng hành động. Thể hiện tình yêu qua hành động.',
        underStress: 'May become emotionally reactive, seek social validation',
        underStressVi: 'Có thể trở nên phản ứng cảm xúc, tìm kiếm xác nhận xã hội',
        growthAreas: ['Express feelings', 'Consider others\' emotions', 'Commit to plans'],
        growthAreasVi: ['Bày tỏ cảm xúc', 'Xem xét cảm xúc của người khác', 'Cam kết với kế hoạch'],
        typicalBig5: { O: 'Mid', C: 'Low', E: 'Low', A: 'Low', N: 'Low' }
    },
    {
        code: 'ISFP',
        name: 'ISFP',
        nameVi: 'ISFP',
        nickname: 'The Adventurer',
        nicknameVi: 'Người phiêu lưu',
        description: 'Flexible and charming artists, always ready to explore and experience something new.',
        descriptionVi: 'Nghệ sĩ linh hoạt và quyến rũ, luôn sẵn sàng khám phá và trải nghiệm điều mới.',
        cognitiveStack: ['Fi', 'Se', 'Ni', 'Te'],
        strengths: ['Charming', 'Sensitive', 'Imaginative', 'Passionate', 'Curious'],
        strengthsVi: ['Quyến rũ', 'Nhạy cảm', 'Giàu trí tưởng tượng', 'Đam mê', 'Tò mò'],
        weaknesses: ['Fiercely independent', 'Unpredictable', 'Easily stressed', 'Overly competitive'],
        weaknessesVi: ['Độc lập mãnh liệt', 'Khó đoán', 'Dễ căng thẳng', 'Quá cạnh tranh'],
        careerFit: ['Artist', 'Fashion Designer', 'Chef', 'Nurse', 'Veterinarian'],
        careerFitVi: ['Nghệ sĩ', 'Nhà thiết kế thời trang', 'Đầu bếp', 'Y tá', 'Bác sĩ thú y'],
        communicationStyle: 'Warm but reserved. Expresses through art/actions.',
        communicationStyleVi: 'Ấm áp nhưng dè dặt. Bày tỏ thông qua nghệ thuật/hành động.',
        underStress: 'May become harshly critical, coldly efficient',
        underStressVi: 'Có thể trở nên phê phán khắc nghiệt, hiệu quả lạnh lùng',
        growthAreas: ['Set long-term goals', 'Develop planning skills', 'Voice opinions'],
        growthAreasVi: ['Đặt mục tiêu dài hạn', 'Phát triển kỹ năng lập kế hoạch', 'Bày tỏ ý kiến'],
        typicalBig5: { O: 'High', C: 'Low', E: 'Low', A: 'High', N: 'Mid' }
    },
    {
        code: 'ESTP',
        name: 'ESTP',
        nameVi: 'ESTP',
        nickname: 'The Entrepreneur',
        nicknameVi: 'Doanh nhân',
        description: 'Smart, energetic and very perceptive, who truly enjoy living on the edge.',
        descriptionVi: 'Thông minh, năng động và rất nhạy bén, thực sự thích sống trên bờ vực.',
        cognitiveStack: ['Se', 'Ti', 'Fe', 'Ni'],
        strengths: ['Bold', 'Rational', 'Practical', 'Original', 'Perceptive', 'Direct'],
        strengthsVi: ['Táo bạo', 'Lý trí', 'Thực tế', 'Độc đáo', 'Nhạy bén', 'Trực tiếp'],
        weaknesses: ['Insensitive', 'Impatient', 'Risk-prone', 'Unstructured', 'Defiant'],
        weaknessesVi: ['Vô cảm', 'Thiếu kiên nhẫn', 'Hay rủi ro', 'Thiếu cấu trúc', 'Thách thức'],
        careerFit: ['Entrepreneur', 'Salesperson', 'Firefighter', 'Paramedic', 'Coach'],
        careerFitVi: ['Doanh nhân', 'Nhân viên bán hàng', 'Lính cứu hỏa', 'Nhân viên cấp cứu', 'Huấn luyện viên'],
        communicationStyle: 'Direct, energetic, action-oriented. May seem blunt.',
        communicationStyleVi: 'Trực tiếp, năng động, hướng hành động. Có thể có vẻ cùn nhụt.',
        underStress: 'May become pessimistic about future, paranoid',
        underStressVi: 'Có thể trở nên bi quan về tương lai, hoang tưởng',
        growthAreas: ['Think before acting', 'Consider feelings', 'Plan for future'],
        growthAreasVi: ['Suy nghĩ trước khi hành động', 'Xem xét cảm xúc', 'Lên kế hoạch cho tương lai'],
        typicalBig5: { O: 'Mid', C: 'Low', E: 'High', A: 'Low', N: 'Low' }
    },
    {
        code: 'ESFP',
        name: 'ESFP',
        nameVi: 'ESFP',
        nickname: 'The Entertainer',
        nicknameVi: 'Người giải trí',
        description: 'Spontaneous, energetic people who love life and want everyone to have fun.',
        descriptionVi: 'Người tự phát, năng động yêu cuộc sống và muốn mọi người vui vẻ.',
        cognitiveStack: ['Se', 'Fi', 'Te', 'Ni'],
        strengths: ['Bold', 'Original', 'Practical', 'Observant', 'Excellent people skills'],
        strengthsVi: ['Táo bạo', 'Độc đáo', 'Thực tế', 'Tinh ý', 'Kỹ năng xã hội xuất sắc'],
        weaknesses: ['Sensitive', 'Conflict-averse', 'Easily bored', 'Poor planners', 'Unfocused'],
        weaknessesVi: ['Nhạy cảm', 'Tránh xung đột', 'Dễ chán', 'Lên kế hoạch kém', 'Thiếu tập trung'],
        careerFit: ['Event Planner', 'Actor', 'Tour Guide', 'Coach', 'Sales Representative'],
        careerFitVi: ['Nhà tổ chức sự kiện', 'Diễn viên', 'Hướng dẫn viên du lịch', 'Huấn luyện viên', 'Đại diện bán hàng'],
        communicationStyle: 'Warm, fun, socially savvy. Keeps conversations light.',
        communicationStyleVi: 'Ấm áp, vui vẻ, am hiểu xã hội. Giữ các cuộc trò chuyện nhẹ nhàng.',
        underStress: 'May become pessimistic, withdrawn, obsess over hidden meanings',
        underStressVi: 'Có thể trở nên bi quan, thu mình, ám ảnh về ý nghĩa ẩn',
        growthAreas: ['Develop discipline', 'Plan ahead', 'Embrace solitude'],
        growthAreasVi: ['Phát triển kỷ luật', 'Lên kế hoạch trước', 'Chấp nhận sự cô đơn'],
        typicalBig5: { O: 'Mid', C: 'Low', E: 'High', A: 'High', N: 'Low-Mid' }
    }
]

// ============================================
// HELPER FUNCTIONS  
// ============================================

/**
 * Get MBTI type by code
 */
export function getMBTIType(code: string): MBTIType | undefined {
    return MBTI_TYPES.find(t => t.code.toUpperCase() === code.toUpperCase())
}

/**
 * Estimate MBTI from Big5 scores
 */
export function estimateMBTIFromBig5(big5: { O: number; C: number; E: number; A: number }): string {
    const e = big5.E >= 50 ? 'E' : 'I'
    const s = big5.O < 50 ? 'S' : 'N'
    const t = big5.A < 50 ? 'T' : 'F'
    const j = big5.C >= 50 ? 'J' : 'P'
    return e + s + t + j
}

/**
 * Get compatible types for collaboration
 */
export function getCompatibleTypes(code: string): string[] {
    const type = getMBTIType(code)
    if (!type) return []

    // Same cognitive functions but different order = good collaboration
    const compatibilityMap: Record<string, string[]> = {
        'INTJ': ['ENTP', 'ENFP', 'ISTJ', 'ISFJ'],
        'INTP': ['ENTJ', 'ENFJ', 'ISTP', 'ISFP'],
        'ENTJ': ['INTP', 'INFP', 'ESTJ', 'ESFJ'],
        'ENTP': ['INTJ', 'INFJ', 'ESTP', 'ESFP'],
        'INFJ': ['ENTP', 'ENFP', 'ISTJ', 'ISFJ'],
        'INFP': ['ENTJ', 'ENFJ', 'ISTP', 'ISFP'],
        'ENFJ': ['INTP', 'INFP', 'ESTJ', 'ESFJ'],
        'ENFP': ['INTJ', 'INFJ', 'ESTP', 'ESFP'],
        'ISTJ': ['ESTP', 'ESFP', 'INTJ', 'INFJ'],
        'ISFJ': ['ESTP', 'ESFP', 'INTJ', 'INFJ'],
        'ESTJ': ['ISTP', 'ISFP', 'ENTJ', 'ENFJ'],
        'ESFJ': ['ISTP', 'ISFP', 'ENTJ', 'ENFJ'],
        'ISTP': ['ESTJ', 'ESFJ', 'INTP', 'INFP'],
        'ISFP': ['ESTJ', 'ESFJ', 'INTP', 'INFP'],
        'ESTP': ['ISTJ', 'ISFJ', 'ENTP', 'ENFP'],
        'ESFP': ['ISTJ', 'ISFJ', 'ENTP', 'ENFP']
    }

    return compatibilityMap[code.toUpperCase()] || []
}
