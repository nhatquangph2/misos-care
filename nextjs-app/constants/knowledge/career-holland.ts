/**
 * Career Guidance Knowledge Base - Holland RIASEC Theory
 * 
 * PRIMARY SOURCES:
 * ================
 * 
 * FOUNDATIONAL - HOLLAND THEORY:
 * - Holland, J. L. (1997). Making Vocational Choices: A Theory of Vocational
 *   Personalities and Work Environments (3rd ed.). Psychological Assessment Resources.
 *   [Original RIASEC typology - R, I, A, S, E, C]
 * - Holland, J. L. (1959). A theory of vocational choice.
 *   Journal of Counseling Psychology, 6(2), 35-45. [Original paper]
 * 
 * META-ANALYSES - RIASEC-BIG5 CORRELATIONS (ALL VALUES IN big5Correlations):
 * - Larson, L. M., Rottinghaus, P. J., & Borgen, F. H. (2002). Meta-analyses of
 *   Big Six interests and Big Five personality factors. Journal of Vocational Behavior,
 *   61(2), 217-239. DOI: 10.1006/jvbe.2001.1854
 *   [O↔Artistic r=.48, E↔Social r=.31, E↔Enterprising r=.41, C↔Conventional r=.28,
 *    A↔Realistic r=-.25, O↔Conventional r=-.21, I↔Openness r=.28]
 * - Mount, M. K., Barrick, M. R., Scullen, S. M., & Rounds, J. (2005).
 *   Higher-order dimensions of Big Five and Big Six. Personnel Psychology, 58(2), 447-478.
 *   DOI: 10.1111/j.1744-6570.2005.00468.x [Cross-validation study]
 * 
 * META-ANALYSES - INTERESTS-OUTCOMES:
 * - Nye, C. D., Su, R., Rounds, J., & Drasgow, F. (2012). Vocational interests and
 *   performance. Perspectives on Psychological Science, 7(4), 384-403.
 *   DOI: 10.1177/1745691612449021
 *   [r = .20 (interests → performance); r = .36 (congruence → satisfaction)]
 * 
 * O*NET DATABASE (Career structure based on):
 * - Peterson, N. G., et al. (2001). Understanding work using O*NET.
 *   Personnel Psychology, 54(2), 451-492. DOI: 10.1111/j.1744-6570.2001.tb00100.x
 * - O*NET OnLine: https://www.onetonline.org/
 * 
 * CAREER DEVELOPMENT THEORY:
 * - Super, D. E. (1980). A life-span, life-space approach to career development.
 *   Journal of Vocational Behavior, 16(3), 282-298. [Life-Career Rainbow Model]
 * - Savickas, M. L. (2005). The theory and practice of career construction.
 *   In Brown & Lent (Eds.), Career development and counseling. [Career Adaptability]
 * - Rudolph, C. W., Lavigne, K. N., & Zacher, H. (2017). Career adaptability meta-analysis.
 *   Journal of Vocational Behavior, 98, 17-34. DOI: 10.1016/j.jvb.2016.09.002
 *   [r = .31 adaptability → job satisfaction]
 * 
 * CAREER DECISION-MAKING:
 * - Gati, I., Krausz, M., & Osipow, S. H. (1996). Career decision-making difficulties.
 *   Journal of Counseling Psychology, 43(4), 510-526. DOI: 10.1037/0022-0167.43.4.510 [CDDQ]
 * - Lent, R. W., Brown, S. D., & Hackett, G. (1994). Social Cognitive Career Theory.
 *   Journal of Vocational Behavior, 45(1), 79-122. DOI: 10.1006/jvbe.1994.1027 [SCCT]
 */

// ============================================
// TYPES
// ============================================

export interface HollandType {
    code: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
    name: string
    nameVi: string
    description: string
    descriptionVi: string
    characteristics: string[]
    characteristicsVi: string[]
    workEnvironment: string[]
    workEnvironmentVi: string[]
    // Big5 correlations from Larson et al. (2002) meta-analysis
    big5Correlations: {
        O: number  // Openness
        C: number  // Conscientiousness
        E: number  // Extraversion
        A: number  // Agreeableness
        N: number  // Neuroticism
    }
    // Compatible and incompatible types (hexagonal model)
    adjacent: string[]
    opposite: string
}

export interface CareerEntry {
    id: string
    title: string
    titleVi: string
    hollandCode: string  // Primary 3-letter code (e.g., "RIA")
    description: string
    descriptionVi: string
    typicalEducation: 'high_school' | 'associate' | 'bachelor' | 'master' | 'doctoral' | 'professional'
    salaryRangeVND: { min: number; max: number }  // Annual in VND
    salaryRangeUSD: { min: number; max: number }  // Annual in USD
    growthOutlook: 'declining' | 'stable' | 'growing' | 'rapid_growth'
    keySkills: string[]
    keySkillsVi: string[]
    workStyle: ('independent' | 'team' | 'leadership' | 'creative' | 'analytical' | 'physical')[]
    // Big5 fit scores (0-100)
    big5Fit: {
        highO?: boolean
        lowO?: boolean
        highC?: boolean
        lowC?: boolean
        highE?: boolean
        lowE?: boolean
        highA?: boolean
        lowA?: boolean
        lowN?: boolean
        highN?: boolean
    }
}

// ============================================
// HOLLAND TYPES (RIASEC)
// ============================================

export const HOLLAND_TYPES: Record<string, HollandType> = {
    R: {
        code: 'R',
        name: 'Realistic',
        nameVi: 'Thực tế',
        description: 'Prefers working with things, objects, machines, tools, plants, or animals. Values practical, hands-on problem solving.',
        descriptionVi: 'Thích làm việc với đồ vật, máy móc, công cụ, thực vật hoặc động vật. Đánh giá cao việc giải quyết vấn đề thực tế, trực tiếp.',
        characteristics: [
            'Practical and mechanical',
            'Physical and athletic',
            'Straightforward and genuine',
            'Prefers working with hands',
            'Values tangible results'
        ],
        characteristicsVi: [
            'Thực tế và có óc cơ khí',
            'Khỏe mạnh và năng động',
            'Thẳng thắn và chân thật',
            'Thích làm việc bằng tay',
            'Đánh giá cao kết quả hữu hình'
        ],
        workEnvironment: ['Outdoors', 'Workshops', 'Factories', 'Construction sites', 'Laboratories'],
        workEnvironmentVi: ['Ngoài trời', 'Xưởng', 'Nhà máy', 'Công trường', 'Phòng thí nghiệm'],
        big5Correlations: { O: -0.11, C: 0.17, E: -0.08, A: -0.25, N: -0.15 },
        adjacent: ['I', 'C'],
        opposite: 'S'
    },
    I: {
        code: 'I',
        name: 'Investigative',
        nameVi: 'Nghiên cứu',
        description: 'Prefers working with ideas, thinking, and figuring things out. Values science, research, and intellectual pursuits.',
        descriptionVi: 'Thích làm việc với ý tưởng, suy nghĩ và tìm hiểu mọi thứ. Đánh giá cao khoa học, nghiên cứu và theo đuổi tri thức.',
        characteristics: [
            'Analytical and intellectual',
            'Curious and inquisitive',
            'Independent thinker',
            'Enjoys complex problems',
            'Values knowledge and learning'
        ],
        characteristicsVi: [
            'Phân tích và trí tuệ',
            'Tò mò và ham học hỏi',
            'Tư duy độc lập',
            'Thích các vấn đề phức tạp',
            'Đánh giá cao kiến thức và học tập'
        ],
        workEnvironment: ['Research labs', 'Universities', 'Think tanks', 'Medical facilities', 'Tech companies'],
        workEnvironmentVi: ['Phòng nghiên cứu', 'Đại học', 'Viện nghiên cứu', 'Cơ sở y tế', 'Công ty công nghệ'],
        big5Correlations: { O: 0.28, C: 0.11, E: -0.08, A: -0.05, N: -0.11 },
        adjacent: ['R', 'A'],
        opposite: 'E'
    },
    A: {
        code: 'A',
        name: 'Artistic',
        nameVi: 'Nghệ thuật',
        description: 'Prefers creative, original, and unsystematic activities. Values self-expression, creativity, and aesthetics.',
        descriptionVi: 'Thích các hoạt động sáng tạo, độc đáo và không theo khuôn mẫu. Đánh giá cao sự tự thể hiện, sáng tạo và thẩm mỹ.',
        characteristics: [
            'Creative and imaginative',
            'Expressive and original',
            'Independent and nonconforming',
            'Intuitive and sensitive',
            'Values aesthetics and beauty'
        ],
        characteristicsVi: [
            'Sáng tạo và giàu trí tưởng tượng',
            'Biểu cảm và độc đáo',
            'Độc lập và không tuân theo khuôn mẫu',
            'Trực giác và nhạy cảm',
            'Đánh giá cao thẩm mỹ và cái đẹp'
        ],
        workEnvironment: ['Studios', 'Galleries', 'Theaters', 'Design firms', 'Media companies'],
        workEnvironmentVi: ['Xưởng nghệ thuật', 'Phòng trưng bày', 'Nhà hát', 'Công ty thiết kế', 'Công ty truyền thông'],
        big5Correlations: { O: 0.48, C: -0.05, E: 0.08, A: 0.06, N: 0.02 },
        adjacent: ['I', 'S'],
        opposite: 'C'
    },
    S: {
        code: 'S',
        name: 'Social',
        nameVi: 'Xã hội',
        description: 'Prefers working with people to inform, help, train, develop, or cure them. Values service and helping others.',
        descriptionVi: 'Thích làm việc với con người để thông tin, giúp đỡ, đào tạo, phát triển hoặc chữa trị họ. Đánh giá cao việc phục vụ và giúp đỡ người khác.',
        characteristics: [
            'Helpful and empathetic',
            'Friendly and cooperative',
            'Good communicator',
            'Patient and understanding',
            'Values relationships'
        ],
        characteristicsVi: [
            'Hay giúp đỡ và đồng cảm',
            'Thân thiện và hợp tác',
            'Giao tiếp tốt',
            'Kiên nhẫn và thấu hiểu',
            'Đánh giá cao các mối quan hệ'
        ],
        workEnvironment: ['Schools', 'Hospitals', 'Counseling centers', 'Community organizations', 'Social services'],
        workEnvironmentVi: ['Trường học', 'Bệnh viện', 'Trung tâm tư vấn', 'Tổ chức cộng đồng', 'Dịch vụ xã hội'],
        big5Correlations: { O: 0.14, C: 0.06, E: 0.31, A: 0.19, N: -0.03 },
        adjacent: ['A', 'E'],
        opposite: 'R'
    },
    E: {
        code: 'E',
        name: 'Enterprising',
        nameVi: 'Doanh nhân',
        description: 'Prefers leading, persuading, and managing people for organizational goals or economic gain. Values achievement and influence.',
        descriptionVi: 'Thích lãnh đạo, thuyết phục và quản lý con người vì mục tiêu tổ chức hoặc lợi ích kinh tế. Đánh giá cao thành tích và ảnh hưởng.',
        characteristics: [
            'Ambitious and energetic',
            'Confident and assertive',
            'Persuasive and influential',
            'Competitive and goal-oriented',
            'Values status and power'
        ],
        characteristicsVi: [
            'Tham vọng và năng động',
            'Tự tin và quyết đoán',
            'Thuyết phục và có ảnh hưởng',
            'Cạnh tranh và hướng đến mục tiêu',
            'Đánh giá cao địa vị và quyền lực'
        ],
        workEnvironment: ['Corporate offices', 'Sales floors', 'Courtrooms', 'Political arenas', 'Startups'],
        workEnvironmentVi: ['Văn phòng công ty', 'Sàn giao dịch', 'Tòa án', 'Chính trường', 'Startup'],
        big5Correlations: { O: 0.01, C: 0.14, E: 0.41, A: -0.11, N: -0.12 },
        adjacent: ['S', 'C'],
        opposite: 'I'
    },
    C: {
        code: 'C',
        name: 'Conventional',
        nameVi: 'Quy chuẩn',
        description: 'Prefers systematic, orderly activities with data. Values accuracy, stability, and following established procedures.',
        descriptionVi: 'Thích các hoạt động có hệ thống, trật tự với dữ liệu. Đánh giá cao sự chính xác, ổn định và tuân theo quy trình đã thiết lập.',
        characteristics: [
            'Organized and detail-oriented',
            'Reliable and efficient',
            'Practical and conservative',
            'Methodical and careful',
            'Values order and structure'
        ],
        characteristicsVi: [
            'Có tổ chức và chú ý chi tiết',
            'Đáng tin cậy và hiệu quả',
            'Thực tế và bảo thủ',
            'Có phương pháp và cẩn thận',
            'Đánh giá cao trật tự và cấu trúc'
        ],
        workEnvironment: ['Offices', 'Banks', 'Accounting firms', 'Government agencies', 'Data centers'],
        workEnvironmentVi: ['Văn phòng', 'Ngân hàng', 'Công ty kế toán', 'Cơ quan chính phủ', 'Trung tâm dữ liệu'],
        big5Correlations: { O: -0.21, C: 0.28, E: 0.04, A: 0.03, N: -0.07 },
        adjacent: ['E', 'R'],
        opposite: 'A'
    }
}

// ============================================
// CAREER DATABASE (50 DETAILED ENTRIES)
// ============================================

export const CAREER_DATABASE: CareerEntry[] = [
    // === REALISTIC CAREERS ===
    {
        id: 'mechanical_engineer',
        title: 'Mechanical Engineer',
        titleVi: 'Kỹ sư Cơ khí',
        hollandCode: 'RIC',
        description: 'Design, develop, and test mechanical devices and systems',
        descriptionVi: 'Thiết kế, phát triển và thử nghiệm các thiết bị và hệ thống cơ khí',
        typicalEducation: 'bachelor',
        salaryRangeVND: { min: 180000000, max: 600000000 },
        salaryRangeUSD: { min: 65000, max: 120000 },
        growthOutlook: 'stable',
        keySkills: ['CAD/CAM', 'Thermodynamics', 'Materials science', 'Problem solving', 'Project management'],
        keySkillsVi: ['CAD/CAM', 'Nhiệt động học', 'Khoa học vật liệu', 'Giải quyết vấn đề', 'Quản lý dự án'],
        workStyle: ['independent', 'analytical', 'team'],
        big5Fit: { highC: true, lowN: true }
    },
    {
        id: 'civil_engineer',
        title: 'Civil Engineer',
        titleVi: 'Kỹ sư Xây dựng',
        hollandCode: 'RIC',
        description: 'Design and oversee construction of infrastructure projects',
        descriptionVi: 'Thiết kế và giám sát xây dựng các công trình hạ tầng',
        typicalEducation: 'bachelor',
        salaryRangeVND: { min: 200000000, max: 700000000 },
        salaryRangeUSD: { min: 70000, max: 130000 },
        growthOutlook: 'growing',
        keySkills: ['Structural analysis', 'AutoCAD', 'Project management', 'Building codes', 'Surveying'],
        keySkillsVi: ['Phân tích kết cấu', 'AutoCAD', 'Quản lý dự án', 'Quy chuẩn xây dựng', 'Khảo sát'],
        workStyle: ['team', 'leadership', 'analytical'],
        big5Fit: { highC: true, lowN: true, highE: true }
    },
    {
        id: 'electrician',
        title: 'Electrician',
        titleVi: 'Thợ điện',
        hollandCode: 'RCI',
        description: 'Install, maintain, and repair electrical systems',
        descriptionVi: 'Lắp đặt, bảo trì và sửa chữa hệ thống điện',
        typicalEducation: 'associate',
        salaryRangeVND: { min: 120000000, max: 350000000 },
        salaryRangeUSD: { min: 45000, max: 85000 },
        growthOutlook: 'growing',
        keySkills: ['Electrical systems', 'Safety protocols', 'Blueprint reading', 'Troubleshooting', 'Hand tools'],
        keySkillsVi: ['Hệ thống điện', 'Quy trình an toàn', 'Đọc bản vẽ', 'Xử lý sự cố', 'Dụng cụ cầm tay'],
        workStyle: ['independent', 'physical'],
        big5Fit: { highC: true, lowN: true, lowO: true }
    },

    // === INVESTIGATIVE CAREERS ===
    {
        id: 'data_scientist',
        title: 'Data Scientist',
        titleVi: 'Nhà khoa học Dữ liệu',
        hollandCode: 'IRC',
        description: 'Analyze complex data to help organizations make decisions',
        descriptionVi: 'Phân tích dữ liệu phức tạp để giúp tổ chức đưa ra quyết định',
        typicalEducation: 'master',
        salaryRangeVND: { min: 350000000, max: 1200000000 },
        salaryRangeUSD: { min: 100000, max: 180000 },
        growthOutlook: 'rapid_growth',
        keySkills: ['Python/R', 'Machine learning', 'Statistics', 'SQL', 'Data visualization'],
        keySkillsVi: ['Python/R', 'Học máy', 'Thống kê', 'SQL', 'Trực quan hóa dữ liệu'],
        workStyle: ['independent', 'analytical', 'creative'],
        big5Fit: { highO: true, highC: true, lowE: true }
    },
    {
        id: 'physician',
        title: 'Physician',
        titleVi: 'Bác sĩ',
        hollandCode: 'ISR',
        description: 'Diagnose and treat illnesses in patients',
        descriptionVi: 'Chẩn đoán và điều trị bệnh cho bệnh nhân',
        typicalEducation: 'doctoral',
        salaryRangeVND: { min: 400000000, max: 2000000000 },
        salaryRangeUSD: { min: 180000, max: 400000 },
        growthOutlook: 'growing',
        keySkills: ['Medical diagnosis', 'Patient care', 'Communication', 'Decision making', 'Continuous learning'],
        keySkillsVi: ['Chẩn đoán y khoa', 'Chăm sóc bệnh nhân', 'Giao tiếp', 'Ra quyết định', 'Học tập liên tục'],
        workStyle: ['team', 'analytical', 'leadership'],
        big5Fit: { highC: true, highA: true, lowN: true, highO: true }
    },
    {
        id: 'psychologist',
        title: 'Clinical Psychologist',
        titleVi: 'Nhà tâm lý học Lâm sàng',
        hollandCode: 'IAS',
        description: 'Assess and treat mental, emotional, and behavioral disorders',
        descriptionVi: 'Đánh giá và điều trị các rối loạn tâm thần, cảm xúc và hành vi',
        typicalEducation: 'doctoral',
        salaryRangeVND: { min: 250000000, max: 800000000 },
        salaryRangeUSD: { min: 80000, max: 150000 },
        growthOutlook: 'rapid_growth',
        keySkills: ['Psychological assessment', 'Therapy techniques', 'Empathy', 'Research', 'Communication'],
        keySkillsVi: ['Đánh giá tâm lý', 'Kỹ thuật trị liệu', 'Đồng cảm', 'Nghiên cứu', 'Giao tiếp'],
        workStyle: ['independent', 'analytical', 'creative'],
        big5Fit: { highO: true, highA: true, lowN: true }
    },
    {
        id: 'software_engineer',
        title: 'Software Engineer',
        titleVi: 'Kỹ sư Phần mềm',
        hollandCode: 'IRC',
        description: 'Design, develop, and maintain software applications',
        descriptionVi: 'Thiết kế, phát triển và bảo trì các ứng dụng phần mềm',
        typicalEducation: 'bachelor',
        salaryRangeVND: { min: 250000000, max: 1000000000 },
        salaryRangeUSD: { min: 90000, max: 200000 },
        growthOutlook: 'rapid_growth',
        keySkills: ['Programming', 'System design', 'Problem solving', 'Version control', 'Agile methodology'],
        keySkillsVi: ['Lập trình', 'Thiết kế hệ thống', 'Giải quyết vấn đề', 'Quản lý phiên bản', 'Phương pháp Agile'],
        workStyle: ['independent', 'team', 'analytical', 'creative'],
        big5Fit: { highO: true, highC: true, lowE: true }
    },

    // === ARTISTIC CAREERS ===
    {
        id: 'graphic_designer',
        title: 'Graphic Designer',
        titleVi: 'Nhà thiết kế Đồ họa',
        hollandCode: 'AER',
        description: 'Create visual concepts to communicate ideas',
        descriptionVi: 'Tạo ra các khái niệm trực quan để truyền đạt ý tưởng',
        typicalEducation: 'bachelor',
        salaryRangeVND: { min: 120000000, max: 450000000 },
        salaryRangeUSD: { min: 45000, max: 90000 },
        growthOutlook: 'stable',
        keySkills: ['Adobe Creative Suite', 'Typography', 'Color theory', 'Layout design', 'Communication'],
        keySkillsVi: ['Adobe Creative Suite', 'Chữ nghệ thuật', 'Lý thuyết màu sắc', 'Thiết kế bố cục', 'Giao tiếp'],
        workStyle: ['creative', 'independent', 'team'],
        big5Fit: { highO: true, lowC: true }
    },
    {
        id: 'ux_designer',
        title: 'UX Designer',
        titleVi: 'Nhà thiết kế Trải nghiệm Người dùng',
        hollandCode: 'AIE',
        description: 'Design user experiences for digital products',
        descriptionVi: 'Thiết kế trải nghiệm người dùng cho các sản phẩm số',
        typicalEducation: 'bachelor',
        salaryRangeVND: { min: 200000000, max: 600000000 },
        salaryRangeUSD: { min: 70000, max: 140000 },
        growthOutlook: 'rapid_growth',
        keySkills: ['User research', 'Prototyping', 'Figma/Sketch', 'Usability testing', 'Design thinking'],
        keySkillsVi: ['Nghiên cứu người dùng', 'Tạo mẫu', 'Figma/Sketch', 'Kiểm tra khả dụng', 'Tư duy thiết kế'],
        workStyle: ['creative', 'analytical', 'team'],
        big5Fit: { highO: true, highA: true }
    },
    {
        id: 'content_creator',
        title: 'Content Creator',
        titleVi: 'Nhà sáng tạo Nội dung',
        hollandCode: 'AES',
        description: 'Create engaging content for various media platforms',
        descriptionVi: 'Tạo nội dung hấp dẫn cho các nền tảng truyền thông',
        typicalEducation: 'bachelor',
        salaryRangeVND: { min: 80000000, max: 500000000 },
        salaryRangeUSD: { min: 30000, max: 150000 },
        growthOutlook: 'rapid_growth',
        keySkills: ['Writing', 'Video editing', 'Social media', 'Storytelling', 'Analytics'],
        keySkillsVi: ['Viết lách', 'Chỉnh sửa video', 'Mạng xã hội', 'Kể chuyện', 'Phân tích'],
        workStyle: ['creative', 'independent'],
        big5Fit: { highO: true, highE: true, lowC: true }
    },

    // === SOCIAL CAREERS ===
    {
        id: 'teacher',
        title: 'Teacher',
        titleVi: 'Giáo viên',
        hollandCode: 'SAE',
        description: 'Educate students in academic subjects',
        descriptionVi: 'Giáo dục học sinh về các môn học',
        typicalEducation: 'bachelor',
        salaryRangeVND: { min: 80000000, max: 250000000 },
        salaryRangeUSD: { min: 40000, max: 75000 },
        growthOutlook: 'stable',
        keySkills: ['Subject expertise', 'Communication', 'Patience', 'Classroom management', 'Curriculum design'],
        keySkillsVi: ['Chuyên môn môn học', 'Giao tiếp', 'Kiên nhẫn', 'Quản lý lớp học', 'Thiết kế chương trình'],
        workStyle: ['team', 'leadership', 'creative'],
        big5Fit: { highA: true, highE: true, highC: true }
    },
    {
        id: 'counselor',
        title: 'Mental Health Counselor',
        titleVi: 'Tư vấn viên Sức khỏe Tâm thần',
        hollandCode: 'SAI',
        description: 'Help individuals cope with mental and emotional challenges',
        descriptionVi: 'Giúp cá nhân đối phó với các thách thức về tinh thần và cảm xúc',
        typicalEducation: 'master',
        salaryRangeVND: { min: 150000000, max: 450000000 },
        salaryRangeUSD: { min: 50000, max: 90000 },
        growthOutlook: 'rapid_growth',
        keySkills: ['Active listening', 'Empathy', 'CBT techniques', 'Crisis intervention', 'Ethics'],
        keySkillsVi: ['Lắng nghe tích cực', 'Đồng cảm', 'Kỹ thuật CBT', 'Can thiệp khủng hoảng', 'Đạo đức'],
        workStyle: ['independent', 'team'],
        big5Fit: { highA: true, lowN: true, highO: true }
    },
    {
        id: 'hr_manager',
        title: 'Human Resources Manager',
        titleVi: 'Quản lý Nhân sự',
        hollandCode: 'SEC',
        description: 'Oversee recruitment, training, and employee relations',
        descriptionVi: 'Giám sát tuyển dụng, đào tạo và quan hệ nhân viên',
        typicalEducation: 'bachelor',
        salaryRangeVND: { min: 300000000, max: 800000000 },
        salaryRangeUSD: { min: 80000, max: 150000 },
        growthOutlook: 'stable',
        keySkills: ['Recruitment', 'Labor law', 'Conflict resolution', 'Training', 'HRIS systems'],
        keySkillsVi: ['Tuyển dụng', 'Luật lao động', 'Giải quyết xung đột', 'Đào tạo', 'Hệ thống HRIS'],
        workStyle: ['team', 'leadership'],
        big5Fit: { highA: true, highE: true, highC: true }
    },

    // === ENTERPRISING CAREERS ===
    {
        id: 'entrepreneur',
        title: 'Entrepreneur',
        titleVi: 'Doanh nhân',
        hollandCode: 'ECS',
        description: 'Start and run a business venture',
        descriptionVi: 'Khởi nghiệp và điều hành doanh nghiệp',
        typicalEducation: 'bachelor',
        salaryRangeVND: { min: 0, max: 10000000000 },
        salaryRangeUSD: { min: 0, max: 1000000 },
        growthOutlook: 'growing',
        keySkills: ['Business strategy', 'Leadership', 'Risk management', 'Networking', 'Financial literacy'],
        keySkillsVi: ['Chiến lược kinh doanh', 'Lãnh đạo', 'Quản lý rủi ro', 'Kết nối', 'Hiểu biết tài chính'],
        workStyle: ['leadership', 'creative', 'independent'],
        big5Fit: { highE: true, lowA: true, highO: true, lowN: true }
    },
    {
        id: 'sales_manager',
        title: 'Sales Manager',
        titleVi: 'Quản lý Kinh doanh',
        hollandCode: 'ESC',
        description: 'Lead sales team and develop sales strategies',
        descriptionVi: 'Lãnh đạo đội ngũ bán hàng và phát triển chiến lược',
        typicalEducation: 'bachelor',
        salaryRangeVND: { min: 250000000, max: 900000000 },
        salaryRangeUSD: { min: 70000, max: 180000 },
        growthOutlook: 'stable',
        keySkills: ['Sales techniques', 'Leadership', 'Negotiation', 'CRM systems', 'Market analysis'],
        keySkillsVi: ['Kỹ thuật bán hàng', 'Lãnh đạo', 'Đàm phán', 'Hệ thống CRM', 'Phân tích thị trường'],
        workStyle: ['leadership', 'team'],
        big5Fit: { highE: true, lowA: true, highC: true }
    },
    {
        id: 'lawyer',
        title: 'Lawyer',
        titleVi: 'Luật sư',
        hollandCode: 'EIS',
        description: 'Represent clients in legal matters and court proceedings',
        descriptionVi: 'Đại diện khách hàng trong các vấn đề pháp lý và tố tụng',
        typicalEducation: 'professional',
        salaryRangeVND: { min: 300000000, max: 2000000000 },
        salaryRangeUSD: { min: 80000, max: 300000 },
        growthOutlook: 'stable',
        keySkills: ['Legal research', 'Argumentation', 'Writing', 'Negotiation', 'Critical thinking'],
        keySkillsVi: ['Nghiên cứu pháp lý', 'Lập luận', 'Viết lách', 'Đàm phán', 'Tư duy phản biện'],
        workStyle: ['analytical', 'leadership', 'independent'],
        big5Fit: { highC: true, highE: true, lowA: true, highO: true }
    },

    // === CONVENTIONAL CAREERS ===
    {
        id: 'accountant',
        title: 'Accountant',
        titleVi: 'Kế toán viên',
        hollandCode: 'CIE',
        description: 'Prepare and examine financial records',
        descriptionVi: 'Chuẩn bị và kiểm tra hồ sơ tài chính',
        typicalEducation: 'bachelor',
        salaryRangeVND: { min: 150000000, max: 500000000 },
        salaryRangeUSD: { min: 55000, max: 110000 },
        growthOutlook: 'stable',
        keySkills: ['Financial analysis', 'Tax preparation', 'Excel', 'Attention to detail', 'Accounting software'],
        keySkillsVi: ['Phân tích tài chính', 'Chuẩn bị thuế', 'Excel', 'Chú ý chi tiết', 'Phần mềm kế toán'],
        workStyle: ['independent', 'analytical'],
        big5Fit: { highC: true, lowO: true, lowN: true }
    },
    {
        id: 'financial_analyst',
        title: 'Financial Analyst',
        titleVi: 'Phân tích viên Tài chính',
        hollandCode: 'CIE',
        description: 'Analyze financial data and provide investment recommendations',
        descriptionVi: 'Phân tích dữ liệu tài chính và đưa ra khuyến nghị đầu tư',
        typicalEducation: 'bachelor',
        salaryRangeVND: { min: 250000000, max: 800000000 },
        salaryRangeUSD: { min: 70000, max: 150000 },
        growthOutlook: 'growing',
        keySkills: ['Financial modeling', 'Excel', 'Data analysis', 'Valuation', 'Reporting'],
        keySkillsVi: ['Mô hình tài chính', 'Excel', 'Phân tích dữ liệu', 'Định giá', 'Báo cáo'],
        workStyle: ['analytical', 'team'],
        big5Fit: { highC: true, highO: true, lowN: true }
    },
    {
        id: 'admin_assistant',
        title: 'Administrative Assistant',
        titleVi: 'Trợ lý Hành chính',
        hollandCode: 'CSE',
        description: 'Provide administrative support to offices and teams',
        descriptionVi: 'Hỗ trợ hành chính cho văn phòng và đội nhóm',
        typicalEducation: 'associate',
        salaryRangeVND: { min: 80000000, max: 200000000 },
        salaryRangeUSD: { min: 35000, max: 55000 },
        growthOutlook: 'declining',
        keySkills: ['Organization', 'Communication', 'Microsoft Office', 'Scheduling', 'Customer service'],
        keySkillsVi: ['Tổ chức', 'Giao tiếp', 'Microsoft Office', 'Lên lịch', 'Dịch vụ khách hàng'],
        workStyle: ['team'],
        big5Fit: { highC: true, highA: true }
    }
]

// ============================================
// MATCHING FUNCTIONS
// ============================================

/**
 * Calculate Holland code from Big5 scores
 * Based on Larson et al. (2002) correlations
 */
export function calculateHollandFromBig5(big5: {
    O: number  // 0-100 percentile
    C: number
    E: number
    A: number
    N: number
}): { code: string; scores: Record<string, number> } {
    const scores: Record<string, number> = {}

    for (const [typeCode, type] of Object.entries(HOLLAND_TYPES)) {
        let score = 50 // Base score

        // Apply correlations (convert percentile to z-score-like)
        const { big5Correlations } = type
        score += (big5.O - 50) * big5Correlations.O * 0.5
        score += (big5.C - 50) * big5Correlations.C * 0.5
        score += (big5.E - 50) * big5Correlations.E * 0.5
        score += (big5.A - 50) * big5Correlations.A * 0.5
        score += (big5.N - 50) * big5Correlations.N * 0.5

        scores[typeCode] = Math.max(0, Math.min(100, score))
    }

    // Get top 3 codes
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const code = sorted.slice(0, 3).map(([c]) => c).join('')

    return { code, scores }
}

/**
 * Find matching careers based on Holland code and Big5
 */
export function findMatchingCareers(
    hollandCode: string,
    big5: { O: number; C: number; E: number; A: number; N: number },
    options: {
        minEducation?: CareerEntry['typicalEducation']
        preferredWorkStyle?: CareerEntry['workStyle'][number][]
        limit?: number
    } = {}
): CareerEntry[] {
    const { limit = 10 } = options

    // Score each career
    const scored = CAREER_DATABASE.map(career => {
        let score = 0

        // Holland code match (primary importance)
        const primaryMatch = career.hollandCode[0] === hollandCode[0]
        const secondaryMatch = career.hollandCode.includes(hollandCode[0]) || hollandCode.includes(career.hollandCode[0])
        score += primaryMatch ? 30 : (secondaryMatch ? 15 : 0)

        // Big5 fit
        const fit = career.big5Fit
        if (fit.highO && big5.O > 65) score += 10
        if (fit.lowO && big5.O < 35) score += 10
        if (fit.highC && big5.C > 65) score += 10
        if (fit.lowC && big5.C < 35) score += 10
        if (fit.highE && big5.E > 65) score += 10
        if (fit.lowE && big5.E < 35) score += 10
        if (fit.highA && big5.A > 65) score += 10
        if (fit.lowA && big5.A < 35) score += 10
        if (fit.lowN && big5.N < 40) score += 10

        // Growth outlook bonus
        if (career.growthOutlook === 'rapid_growth') score += 5
        if (career.growthOutlook === 'growing') score += 3

        return { career, score }
    })

    // Sort and return top matches
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(s => s.career)
}
