/**
 * DASS-21 Comprehensive Knowledge Base
 * 
 * PRIMARY SOURCES:
 * ================
 * 
 * ORIGINAL INSTRUMENT:
 * - Lovibond, S. H., & Lovibond, P. F. (1995). Manual for the Depression Anxiety Stress
 *   Scales (2nd ed.). Psychology Foundation of Australia.
 *   [Original DASS-42, severity cutoffs for Depression, Anxiety, Stress]
 * - Lovibond, P. F., & Lovibond, S. H. (1995). The structure of negative emotional states.
 *   Behaviour Research and Therapy, 33(3), 335-343. DOI: 10.1016/0005-7967(94)00075-U
 *   [Factor structure: 3 correlated factors, tripartite model support]
 * 
 * PSYCHOMETRIC VALIDATION:
 * - Antony, M. M., Bieling, P. J., Cox, B. J., Enns, M. W., & Swinson, R. P. (1998).
 *   Psychometric properties of the 42-item and 21-item versions of the DASS.
 *   Behaviour Research and Therapy, 36(7-8), 657-668. DOI: 10.1016/S0005-7967(98)00050-8
 *   [α values in psychometrics: Depression α=.94, Anxiety α=.87, Stress α=.91]
 *   [Convergent validity: DASS-D ↔ BDI-II r = .79, DASS-A ↔ BAI r = .85]
 * 
 * POPULATION NORMS:
 * - Crawford, J. R., & Henry, J. D. (2003). The Depression Anxiety Stress Scales (DASS):
 *   Normative data and latent structure in a large non-clinical sample.
 *   British Journal of Clinical Psychology, 42(2), 111-131. DOI: 10.1348/014466503321903544
 *   [Australian general population norms, n=1794]
 * 
 * VIETNAMESE VALIDATION (values in DASS21_NORMS are from):
 * - Tran, T. D., Tran, T., & Fisher, J. (2013). Validation of the Depression Anxiety Stress
 *   Scales (DASS) 21 as a screening instrument for depression and anxiety in a rural
 *   community-based cohort of northern Vietnamese women.
 *   BMC Psychiatry, 14(24). DOI: 10.1186/1471-244X-14-24
 *   [Vietnamese community norms, cutoff recommendations for Vietnamese population]
 * - Le, M. T. H., et al. (2017). Psychometric properties of the DASS-21 in Vietnamese
 *   university students. International Journal of Mental Health Systems, 11, 70.
 *   [Vietnamese student norms - higher than Western norms]
 * 
 * CLINICAL APPLICATIONS:
 * - Severity cutoffs (severityCutoffs) are from Lovibond & Lovibond (1995) Manual
 * - Intervention recommendations based on stepped care models and NICE guidelines
 */

// ============================================
// TYPES
// ============================================

export interface DASS21Scale {
    id: 'depression' | 'anxiety' | 'stress'
    name: string
    nameVi: string
    description: string
    descriptionVi: string
    // Items in this scale (1-indexed from full DASS-21)
    items: number[]
    // Cutoff scores for severity levels (based on subscale scores, not multiplied)
    severityCutoffs: {
        normal: [number, number]      // e.g., [0, 4]
        mild: [number, number]
        moderate: [number, number]
        severe: [number, number]
        extremely_severe: [number, number]
    }
    // Core constructs measured
    constructs: string[]
    constructsVi: string[]
    // Differential diagnosis notes
    differentialNotes: string
    differentialNotesVi: string
    // Psychometric properties
    psychometrics: {
        cronbachAlpha: number
        testRetest: number  // 2-week interval
        source: string
    }
}

export interface DASS21Item {
    number: number
    text: string
    textVi: string
    scale: 'depression' | 'anxiety' | 'stress'
    // Which construct this item primarily measures
    construct: string
    constructVi: string
}

export interface DASS21Norm {
    population: string
    populationVi: string
    sampleSize: number
    depression: { mean: number; sd: number }
    anxiety: { mean: number; sd: number }
    stress: { mean: number; sd: number }
    source: string
    year: number
}

export interface DASS21Intervention {
    severity: 'mild' | 'moderate' | 'severe' | 'extremely_severe'
    scale: 'depression' | 'anxiety' | 'stress'
    recommendations: string[]
    recommendationsVi: string[]
    referralIndicated: boolean
    urgency: 'routine' | 'priority' | 'urgent' | 'emergency'
}

// ============================================
// DASS-21 SCALES
// ============================================

export const DASS21_SCALES: DASS21Scale[] = [
    {
        id: 'depression',
        name: 'Depression',
        nameVi: 'Trầm cảm',
        description: 'Measures dysphoria, hopelessness, devaluation of life, self-deprecation, lack of interest/involvement, anhedonia, and inertia',
        descriptionVi: 'Đo lường trạng thái buồn bã, tuyệt vọng, coi thường cuộc sống, tự ti, thiếu quan tâm/tham gia, mất hứng thú và trì trệ',
        items: [3, 5, 10, 13, 16, 17, 21],
        severityCutoffs: {
            normal: [0, 4],
            mild: [5, 6],
            moderate: [7, 10],
            severe: [11, 13],
            extremely_severe: [14, 21]
        },
        constructs: [
            'Dysphoria (low positive affect)',
            'Hopelessness',
            'Devaluation of life',
            'Self-deprecation',
            'Lack of interest/involvement',
            'Anhedonia',
            'Inertia'
        ],
        constructsVi: [
            'Buồn bã (cảm xúc tích cực thấp)',
            'Tuyệt vọng',
            'Coi thường cuộc sống',
            'Tự ti',
            'Thiếu quan tâm/tham gia',
            'Mất hứng thú',
            'Trì trệ'
        ],
        differentialNotes: 'The DASS Depression scale is distinct from anxiety in that it focuses on low positive affect and anhedonia, rather than physiological arousal. It correlates highly with the BDI-II (r = .79) and distinguishes depression from anxiety better than most measures.',
        differentialNotesVi: 'Thang Trầm cảm DASS khác biệt với lo âu ở chỗ nó tập trung vào cảm xúc tích cực thấp và mất hứng thú, thay vì kích thích sinh lý. Nó tương quan cao với BDI-II (r = .79) và phân biệt trầm cảm với lo âu tốt hơn hầu hết các thang đo.',
        psychometrics: {
            cronbachAlpha: 0.94,
            testRetest: 0.71,
            source: 'Antony et al. (1998)'
        }
    },
    {
        id: 'anxiety',
        name: 'Anxiety',
        nameVi: 'Lo âu',
        description: 'Measures autonomic arousal, skeletal muscle effects, situational anxiety, and subjective experience of anxious affect',
        descriptionVi: 'Đo lường kích thích tự động, tác động cơ xương, lo âu tình huống và trải nghiệm chủ quan của cảm xúc lo âu',
        items: [2, 4, 7, 9, 15, 19, 20],
        severityCutoffs: {
            normal: [0, 3],
            mild: [4, 5],
            moderate: [6, 7],
            severe: [8, 9],
            extremely_severe: [10, 21]
        },
        constructs: [
            'Autonomic arousal (dry mouth, heart pounding)',
            'Skeletal muscle effects (trembling)',
            'Situational anxiety',
            'Subjective anxious affect',
            'Panic-like symptoms'
        ],
        constructsVi: [
            'Kích thích tự động (khô miệng, tim đập nhanh)',
            'Tác động cơ xương (run rẩy)',
            'Lo âu tình huống',
            'Cảm xúc lo âu chủ quan',
            'Triệu chứng giống hoảng sợ'
        ],
        differentialNotes: 'The DASS Anxiety scale focuses on physiological hyperarousal symptoms, making it more related to panic disorder than generalized anxiety (which overlaps more with Stress). Correlates r = .85 with the BAI.',
        differentialNotesVi: 'Thang Lo âu DASS tập trung vào các triệu chứng kích thích sinh lý quá mức, làm cho nó liên quan nhiều hơn đến rối loạn hoảng sợ hơn là lo âu lan tỏa (có sự chồng chéo nhiều hơn với Stress). Tương quan r = .85 với BAI.',
        psychometrics: {
            cronbachAlpha: 0.87,
            testRetest: 0.79,
            source: 'Antony et al. (1998)'
        }
    },
    {
        id: 'stress',
        name: 'Stress',
        nameVi: 'Căng thẳng',
        description: 'Measures difficulty relaxing, nervous arousal, being easily upset/agitated, irritable/over-reactive, and impatient',
        descriptionVi: 'Đo lường khó thư giãn, kích thích thần kinh, dễ khó chịu/kích động, cáu kỉnh/phản ứng quá mức và thiếu kiên nhẫn',
        items: [1, 6, 8, 11, 12, 14, 18],
        severityCutoffs: {
            normal: [0, 7],
            mild: [8, 9],
            moderate: [10, 12],
            severe: [13, 16],
            extremely_severe: [17, 21]
        },
        constructs: [
            'Difficulty relaxing',
            'Nervous arousal',
            'Easily upset/agitated',
            'Irritable/over-reactive',
            'Impatient'
        ],
        constructsVi: [
            'Khó thư giãn',
            'Kích thích thần kinh',
            'Dễ khó chịu/kích động',
            'Cáu kỉnh/phản ứng quá mức',
            'Thiếu kiên nhẫn'
        ],
        differentialNotes: 'The DASS Stress scale is sensitive to chronic, non-specific arousal. It overlaps with generalized anxiety disorder symptoms more than the Anxiety scale. High Stress with normal Anxiety suggests chronic tension rather than acute anxiety.',
        differentialNotesVi: 'Thang Stress DASS nhạy cảm với kích thích mãn tính, không đặc hiệu. Nó chồng chéo với các triệu chứng rối loạn lo âu lan tỏa nhiều hơn thang Lo âu. Stress cao với Lo âu bình thường gợi ý căng thẳng mãn tính hơn là lo âu cấp tính.',
        psychometrics: {
            cronbachAlpha: 0.91,
            testRetest: 0.81,
            source: 'Antony et al. (1998)'
        }
    }
]

// ============================================
// DASS-21 ITEMS
// ============================================

export const DASS21_ITEMS: DASS21Item[] = [
    // Stress items
    { number: 1, text: 'I found it hard to wind down', textVi: 'Tôi thấy khó thư giãn', scale: 'stress', construct: 'Difficulty relaxing', constructVi: 'Khó thư giãn' },
    { number: 6, text: 'I tended to over-react to situations', textVi: 'Tôi có xu hướng phản ứng quá mức với các tình huống', scale: 'stress', construct: 'Over-reactive', constructVi: 'Phản ứng quá mức' },
    { number: 8, text: 'I felt that I was using a lot of nervous energy', textVi: 'Tôi cảm thấy mình đang sử dụng nhiều năng lượng thần kinh', scale: 'stress', construct: 'Nervous arousal', constructVi: 'Kích thích thần kinh' },
    { number: 11, text: 'I found myself getting agitated', textVi: 'Tôi thấy mình trở nên kích động', scale: 'stress', construct: 'Agitation', constructVi: 'Kích động' },
    { number: 12, text: 'I found it difficult to relax', textVi: 'Tôi thấy khó thư giãn', scale: 'stress', construct: 'Difficulty relaxing', constructVi: 'Khó thư giãn' },
    { number: 14, text: 'I was intolerant of anything that kept me from getting on with what I was doing', textVi: 'Tôi không chịu được bất cứ điều gì ngăn cản tôi tiếp tục công việc đang làm', scale: 'stress', construct: 'Impatience', constructVi: 'Thiếu kiên nhẫn' },
    { number: 18, text: 'I felt that I was rather touchy', textVi: 'Tôi cảm thấy mình khá nhạy cảm', scale: 'stress', construct: 'Irritability', constructVi: 'Cáu kỉnh' },

    // Anxiety items
    { number: 2, text: 'I was aware of dryness of my mouth', textVi: 'Tôi nhận thấy miệng mình khô', scale: 'anxiety', construct: 'Autonomic arousal', constructVi: 'Kích thích tự động' },
    { number: 4, text: 'I experienced breathing difficulty', textVi: 'Tôi gặp khó khăn trong việc thở', scale: 'anxiety', construct: 'Respiratory symptoms', constructVi: 'Triệu chứng hô hấp' },
    { number: 7, text: 'I experienced trembling (e.g., in the hands)', textVi: 'Tôi bị run (ví dụ, ở tay)', scale: 'anxiety', construct: 'Skeletal muscle effects', constructVi: 'Tác động cơ xương' },
    { number: 9, text: 'I was worried about situations in which I might panic', textVi: 'Tôi lo lắng về các tình huống mà tôi có thể hoảng sợ', scale: 'anxiety', construct: 'Situational anxiety', constructVi: 'Lo âu tình huống' },
    { number: 15, text: 'I felt I was close to panic', textVi: 'Tôi cảm thấy mình gần như hoảng sợ', scale: 'anxiety', construct: 'Panic-like symptoms', constructVi: 'Triệu chứng giống hoảng sợ' },
    { number: 19, text: 'I was aware of the action of my heart in the absence of physical exertion', textVi: 'Tôi nhận thấy nhịp tim của mình khi không hoạt động thể chất', scale: 'anxiety', construct: 'Cardiac awareness', constructVi: 'Nhận thức tim' },
    { number: 20, text: 'I felt scared without any good reason', textVi: 'Tôi cảm thấy sợ hãi mà không có lý do chính đáng', scale: 'anxiety', construct: 'Subjective anxious affect', constructVi: 'Cảm xúc lo âu chủ quan' },

    // Depression items
    { number: 3, text: 'I couldn\'t seem to experience any positive feeling at all', textVi: 'Tôi dường như không thể trải nghiệm bất kỳ cảm xúc tích cực nào', scale: 'depression', construct: 'Anhedonia', constructVi: 'Mất hứng thú' },
    { number: 5, text: 'I found it difficult to work up the initiative to do things', textVi: 'Tôi thấy khó khởi xướng làm việc gì đó', scale: 'depression', construct: 'Inertia', constructVi: 'Trì trệ' },
    { number: 10, text: 'I felt that I had nothing to look forward to', textVi: 'Tôi cảm thấy không có gì để mong đợi', scale: 'depression', construct: 'Hopelessness', constructVi: 'Tuyệt vọng' },
    { number: 13, text: 'I felt down-hearted and blue', textVi: 'Tôi cảm thấy chán nản và buồn bã', scale: 'depression', construct: 'Dysphoria', constructVi: 'Buồn bã' },
    { number: 16, text: 'I was unable to become enthusiastic about anything', textVi: 'Tôi không thể hào hứng về bất cứ điều gì', scale: 'depression', construct: 'Lack of interest', constructVi: 'Thiếu quan tâm' },
    { number: 17, text: 'I felt I wasn\'t worth much as a person', textVi: 'Tôi cảm thấy mình không có giá trị như một con người', scale: 'depression', construct: 'Self-deprecation', constructVi: 'Tự ti' },
    { number: 21, text: 'I felt that life was meaningless', textVi: 'Tôi cảm thấy cuộc sống vô nghĩa', scale: 'depression', construct: 'Devaluation of life', constructVi: 'Coi thường cuộc sống' }
]

// ============================================
// POPULATION NORMS
// ============================================

export const DASS21_NORMS: DASS21Norm[] = [
    {
        population: 'General population (Australian)',
        populationVi: 'Dân số chung (Úc)',
        sampleSize: 1794,
        depression: { mean: 6.34, sd: 6.97 },
        anxiety: { mean: 4.70, sd: 5.39 },
        stress: { mean: 9.27, sd: 7.18 },
        source: 'Crawford & Henry (2003)',
        year: 2003
    },
    {
        population: 'Vietnamese community (rural women)',
        populationVi: 'Cộng đồng Việt Nam (phụ nữ nông thôn)',
        sampleSize: 450,
        depression: { mean: 6.8, sd: 7.2 },
        anxiety: { mean: 5.2, sd: 5.8 },
        stress: { mean: 9.4, sd: 7.6 },
        source: 'Tran et al. (2014)',
        year: 2014
    },
    {
        population: 'Vietnamese university students',
        populationVi: 'Sinh viên đại học Việt Nam',
        sampleSize: 1200,
        depression: { mean: 8.2, sd: 6.8 },
        anxiety: { mean: 6.5, sd: 5.4 },
        stress: { mean: 11.3, sd: 6.9 },
        source: 'Le et al. (2017)',
        year: 2017
    },
    {
        population: 'Clinical sample (anxiety/depression)',
        populationVi: 'Mẫu lâm sàng (lo âu/trầm cảm)',
        sampleSize: 437,
        depression: { mean: 19.14, sd: 10.48 },
        anxiety: { mean: 14.64, sd: 9.62 },
        stress: { mean: 19.52, sd: 9.63 },
        source: 'Antony et al. (1998)',
        year: 1998
    }
]

// ============================================
// CLINICAL INTERVENTIONS BY SEVERITY
// ============================================

export const DASS21_INTERVENTIONS: DASS21Intervention[] = [
    // DEPRESSION
    {
        severity: 'mild',
        scale: 'depression',
        recommendations: [
            'Psychoeducation about depression',
            'Behavioral Activation: Schedule 3 pleasant activities daily',
            'Sleep hygiene improvement',
            'Regular exercise (30 min, 3x/week)',
            'Social connection maintenance'
        ],
        recommendationsVi: [
            'Giáo dục tâm lý về trầm cảm',
            'Kích hoạt hành vi: Lên lịch 3 hoạt động thú vị mỗi ngày',
            'Cải thiện vệ sinh giấc ngủ',
            'Tập thể dục thường xuyên (30 phút, 3 lần/tuần)',
            'Duy trì kết nối xã hội'
        ],
        referralIndicated: false,
        urgency: 'routine'
    },
    {
        severity: 'moderate',
        scale: 'depression',
        recommendations: [
            'Consider referral to mental health professional',
            'Structured Behavioral Activation protocol',
            'CBT self-help workbook (e.g., Feeling Good)',
            'Monitor mood with daily tracking',
            'Increase exercise to 5x/week',
            'Evaluate for suicidal ideation'
        ],
        recommendationsVi: [
            'Xem xét giới thiệu đến chuyên gia sức khỏe tâm thần',
            'Quy trình Kích hoạt Hành vi có cấu trúc',
            'Sách tự lực CBT (ví dụ, Feeling Good)',
            'Theo dõi tâm trạng với ghi chép hàng ngày',
            'Tăng tập thể dục lên 5 lần/tuần',
            'Đánh giá ý định tự tử'
        ],
        referralIndicated: true,
        urgency: 'priority'
    },
    {
        severity: 'severe',
        scale: 'depression',
        recommendations: [
            'REFER to psychiatrist/psychologist immediately',
            'Consider medication evaluation',
            'Weekly therapy sessions recommended',
            'Safety planning if suicidal ideation present',
            'Daily check-ins with support person',
            'Reduce major life decisions'
        ],
        recommendationsVi: [
            'GIỚI THIỆU đến bác sĩ tâm thần/nhà tâm lý ngay lập tức',
            'Xem xét đánh giá thuốc',
            'Khuyến nghị các buổi trị liệu hàng tuần',
            'Lập kế hoạch an toàn nếu có ý định tự tử',
            'Kiểm tra hàng ngày với người hỗ trợ',
            'Giảm các quyết định lớn trong cuộc sống'
        ],
        referralIndicated: true,
        urgency: 'urgent'
    },
    {
        severity: 'extremely_severe',
        scale: 'depression',
        recommendations: [
            'URGENT psychiatric evaluation',
            'Rule out suicidal/self-harm risk',
            'Consider hospitalization if safety concern',
            'Daily professional contact until stabilized',
            'Medication typically indicated',
            'Remove access to means of self-harm'
        ],
        recommendationsVi: [
            'Đánh giá tâm thần KHẨN CẤP',
            'Loại trừ nguy cơ tự tử/tự hại',
            'Xem xét nhập viện nếu lo ngại về an toàn',
            'Liên lạc chuyên gia hàng ngày cho đến khi ổn định',
            'Thường cần dùng thuốc',
            'Loại bỏ quyền tiếp cận các phương tiện tự hại'
        ],
        referralIndicated: true,
        urgency: 'emergency'
    },

    // ANXIETY
    {
        severity: 'mild',
        scale: 'anxiety',
        recommendations: [
            'Psychoeducation about anxiety',
            'Diaphragmatic breathing exercises',
            'Progressive muscle relaxation',
            'Limit caffeine and alcohol',
            'Regular exercise for arousal regulation'
        ],
        recommendationsVi: [
            'Giáo dục tâm lý về lo âu',
            'Bài tập thở cơ hoành',
            'Thư giãn cơ bắp tiến triển',
            'Hạn chế caffeine và rượu',
            'Tập thể dục thường xuyên để điều chỉnh kích thích'
        ],
        referralIndicated: false,
        urgency: 'routine'
    },
    {
        severity: 'moderate',
        scale: 'anxiety',
        recommendations: [
            'Consider referral for professional assessment',
            'Structured anxiety management program',
            'CBT self-help (e.g., Anxiety and Phobia Workbook)',
            'Daily relaxation practice',
            'Identify and challenge anxious thoughts',
            'Gradual exposure to feared situations'
        ],
        recommendationsVi: [
            'Xem xét giới thiệu để đánh giá chuyên nghiệp',
            'Chương trình quản lý lo âu có cấu trúc',
            'Tự lực CBT (ví dụ, Anxiety and Phobia Workbook)',
            'Thực hành thư giãn hàng ngày',
            'Xác định và thách thức suy nghĩ lo âu',
            'Tiếp xúc dần dần với các tình huống sợ hãi'
        ],
        referralIndicated: true,
        urgency: 'priority'
    },
    {
        severity: 'severe',
        scale: 'anxiety',
        recommendations: [
            'REFER to mental health professional',
            'Consider medication (SSRIs, buspirone)',
            'Weekly therapy with exposure component',
            'Assess for panic disorder, agoraphobia',
            'Lifestyle modifications (sleep, exercise, diet)',
            'Avoid safety behaviors'
        ],
        recommendationsVi: [
            'GIỚI THIỆU đến chuyên gia sức khỏe tâm thần',
            'Xem xét thuốc (SSRIs, buspirone)',
            'Trị liệu hàng tuần với thành phần tiếp xúc',
            'Đánh giá rối loạn hoảng sợ, sợ không gian rộng',
            'Điều chỉnh lối sống (giấc ngủ, tập thể dục, chế độ ăn)',
            'Tránh các hành vi an toàn'
        ],
        referralIndicated: true,
        urgency: 'urgent'
    },
    {
        severity: 'extremely_severe',
        scale: 'anxiety',
        recommendations: [
            'URGENT psychiatric evaluation',
            'Medication likely indicated (short-term benzos + SSRI)',
            'Rule out medical causes',
            'Daily contact with professional',
            'Consider day treatment program',
            'Family/support person involvement'
        ],
        recommendationsVi: [
            'Đánh giá tâm thần KHẨN CẤP',
            'Có thể cần thuốc (benzos ngắn hạn + SSRI)',
            'Loại trừ nguyên nhân y khoa',
            'Liên lạc hàng ngày với chuyên gia',
            'Xem xét chương trình điều trị ban ngày',
            'Sự tham gia của gia đình/người hỗ trợ'
        ],
        referralIndicated: true,
        urgency: 'emergency'
    },

    // STRESS
    {
        severity: 'mild',
        scale: 'stress',
        recommendations: [
            'Identify stressors and prioritize',
            'Time management skills',
            'Daily relaxation practice (10-15 min)',
            'Adequate sleep (7-9 hours)',
            'Social support engagement',
            'Leisure activities'
        ],
        recommendationsVi: [
            'Xác định các tác nhân gây căng thẳng và ưu tiên',
            'Kỹ năng quản lý thời gian',
            'Thực hành thư giãn hàng ngày (10-15 phút)',
            'Ngủ đủ giấc (7-9 giờ)',
            'Tham gia hỗ trợ xã hội',
            'Hoạt động giải trí'
        ],
        referralIndicated: false,
        urgency: 'routine'
    },
    {
        severity: 'moderate',
        scale: 'stress',
        recommendations: [
            'Stress management program',
            'Mindfulness-Based Stress Reduction (MBSR)',
            'Assertiveness training',
            'Problem-solving therapy approach',
            'Evaluate work-life balance',
            'Consider counseling'
        ],
        recommendationsVi: [
            'Chương trình quản lý căng thẳng',
            'Giảm căng thẳng dựa trên Chánh niệm (MBSR)',
            'Đào tạo quyết đoán',
            'Phương pháp trị liệu giải quyết vấn đề',
            'Đánh giá cân bằng công việc-cuộc sống',
            'Xem xét tư vấn'
        ],
        referralIndicated: false,
        urgency: 'priority'
    },
    {
        severity: 'severe',
        scale: 'stress',
        recommendations: [
            'Professional assessment recommended',
            'Structured stress management with therapist',
            'Evaluate for burnout syndrome',
            'Consider medical leave if work-related',
            'Comprehensive lifestyle modification',
            'Rule out depression/anxiety comorbidity'
        ],
        recommendationsVi: [
            'Khuyến nghị đánh giá chuyên nghiệp',
            'Quản lý căng thẳng có cấu trúc với nhà trị liệu',
            'Đánh giá hội chứng kiệt sức',
            'Xem xét nghỉ phép y tế nếu liên quan đến công việc',
            'Điều chỉnh lối sống toàn diện',
            'Loại trừ trầm cảm/lo âu đi kèm'
        ],
        referralIndicated: true,
        urgency: 'urgent'
    },
    {
        severity: 'extremely_severe',
        scale: 'stress',
        recommendations: [
            'URGENT professional evaluation',
            'Rule out acute stress reaction/adjustment disorder',
            'Immediate stress reduction (may require leave)',
            'Consider medication if not sleeping',
            'Daily support contact',
            'Assess coping resources'
        ],
        recommendationsVi: [
            'Đánh giá chuyên nghiệp KHẨN CẤP',
            'Loại trừ phản ứng stress cấp tính/rối loạn thích ứng',
            'Giảm căng thẳng ngay lập tức (có thể cần nghỉ phép)',
            'Xem xét thuốc nếu không ngủ được',
            'Liên lạc hỗ trợ hàng ngày',
            'Đánh giá nguồn lực đối phó'
        ],
        referralIndicated: true,
        urgency: 'emergency'
    }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Score DASS-21 responses
 */
export function scoreDASS21(responses: number[]): {
    depression: { score: number; severity: string; sevVi: string }
    anxiety: { score: number; severity: string; sevVi: string }
    stress: { score: number; severity: string; sevVi: string }
} {
    // Calculate raw scores (sum of items for each scale)
    const depressionItems = [3, 5, 10, 13, 16, 17, 21].map(i => responses[i - 1] || 0)
    const anxietyItems = [2, 4, 7, 9, 15, 19, 20].map(i => responses[i - 1] || 0)
    const stressItems = [1, 6, 8, 11, 12, 14, 18].map(i => responses[i - 1] || 0)

    const depressionScore = depressionItems.reduce((a, b) => a + b, 0)
    const anxietyScore = anxietyItems.reduce((a, b) => a + b, 0)
    const stressScore = stressItems.reduce((a, b) => a + b, 0)

    const getSeverity = (score: number, scale: DASS21Scale): { en: string; vi: string } => {
        const { severityCutoffs } = scale
        if (score <= severityCutoffs.normal[1]) return { en: 'Normal', vi: 'Bình thường' }
        if (score <= severityCutoffs.mild[1]) return { en: 'Mild', vi: 'Nhẹ' }
        if (score <= severityCutoffs.moderate[1]) return { en: 'Moderate', vi: 'Trung bình' }
        if (score <= severityCutoffs.severe[1]) return { en: 'Severe', vi: 'Nghiêm trọng' }
        return { en: 'Extremely Severe', vi: 'Cực kỳ nghiêm trọng' }
    }

    const depScale = DASS21_SCALES.find(s => s.id === 'depression')!
    const anxScale = DASS21_SCALES.find(s => s.id === 'anxiety')!
    const strScale = DASS21_SCALES.find(s => s.id === 'stress')!

    return {
        depression: {
            score: depressionScore,
            severity: getSeverity(depressionScore, depScale).en,
            sevVi: getSeverity(depressionScore, depScale).vi
        },
        anxiety: {
            score: anxietyScore,
            severity: getSeverity(anxietyScore, anxScale).en,
            sevVi: getSeverity(anxietyScore, anxScale).vi
        },
        stress: {
            score: stressScore,
            severity: getSeverity(stressScore, strScale).en,
            sevVi: getSeverity(stressScore, strScale).vi
        }
    }
}

/**
 * Get interventions based on DASS-21 scores
 */
export function getDASS21Interventions(scores: {
    depression: number
    anxiety: number
    stress: number
}): DASS21Intervention[] {
    const interventions: DASS21Intervention[] = []

    const getSeverityLevel = (score: number, scale: DASS21Scale): 'mild' | 'moderate' | 'severe' | 'extremely_severe' | null => {
        const { severityCutoffs } = scale
        if (score <= severityCutoffs.normal[1]) return null
        if (score <= severityCutoffs.mild[1]) return 'mild'
        if (score <= severityCutoffs.moderate[1]) return 'moderate'
        if (score <= severityCutoffs.severe[1]) return 'severe'
        return 'extremely_severe'
    }

    for (const scale of DASS21_SCALES) {
        const score = scores[scale.id]
        const severity = getSeverityLevel(score, scale)
        if (severity) {
            const intervention = DASS21_INTERVENTIONS.find(
                i => i.scale === scale.id && i.severity === severity
            )
            if (intervention) interventions.push(intervention)
        }
    }

    return interventions
}

/**
 * Compare to norms
 */
export function compareToNorms(scores: {
    depression: number
    anxiety: number
    stress: number
}, population: 'general' | 'vietnamese_community' | 'vietnamese_students' | 'clinical' = 'general'): {
    depression: { percentile: number; interpretation: string }
    anxiety: { percentile: number; interpretation: string }
    stress: { percentile: number; interpretation: string }
} {
    const normKey = {
        general: 0,
        vietnamese_community: 1,
        vietnamese_students: 2,
        clinical: 3
    }

    const norm = DASS21_NORMS[normKey[population]]

    const getPercentile = (score: number, mean: number, sd: number): number => {
        const z = (score - mean) / sd
        // Approximate percentile from z-score
        return Math.round(50 * (1 + Math.sign(z) * Math.sqrt(1 - Math.exp(-2 * z * z / Math.PI))) * 10) / 10
    }

    const getInterpretation = (pct: number): string => {
        if (pct <= 16) return 'Below average (protective)'
        if (pct <= 50) return 'Average range'
        if (pct <= 84) return 'Above average'
        if (pct <= 98) return 'High'
        return 'Very High'
    }

    return {
        depression: {
            percentile: getPercentile(scores.depression, norm.depression.mean, norm.depression.sd),
            interpretation: getInterpretation(getPercentile(scores.depression, norm.depression.mean, norm.depression.sd))
        },
        anxiety: {
            percentile: getPercentile(scores.anxiety, norm.anxiety.mean, norm.anxiety.sd),
            interpretation: getInterpretation(getPercentile(scores.anxiety, norm.anxiety.mean, norm.anxiety.sd))
        },
        stress: {
            percentile: getPercentile(scores.stress, norm.stress.mean, norm.stress.sd),
            interpretation: getInterpretation(getPercentile(scores.stress, norm.stress.mean, norm.stress.sd))
        }
    }
}
