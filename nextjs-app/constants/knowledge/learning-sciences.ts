/**
 * Learning Sciences Knowledge Base
 * 
 * PRIMARY SOURCES:
 * ================
 * 
 * LEARNING TECHNIQUES (GOLD STANDARD REVIEW):
 * - Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013).
 *   Improving students' learning with effective learning techniques: Promising directions
 *   from cognitive and educational psychology. Psychological Science in the Public Interest,
 *   14(1), 4-58. DOI: 10.1177/1529100612453266
 *   [ALL effectivenessLevel ratings in LEARNING_TECHNIQUES are directly from this paper]
 *   [HIGH: Practice Testing, Distributed Practice]
 *   [MODERATE: Interleaved Practice, Elaborative Interrogation, Self-Explanation]
 *   [LOW: Summarization, Highlighting, Rereading, Keyword Mnemonic, Imagery]
 * 
 * COGNITIVE LOAD THEORY:
 * - Sweller, J. (1988). Cognitive load during problem solving.
 *   Cognitive Science, 12(2), 257-285. DOI: 10.1207/s15516709cog1202_4 [Foundational]
 * - Sweller, J., van Merriënboer, J. J. G., & Paas, F. (2019). Cognitive architecture
 *   and instructional design: 20 years later. Educational Psychology Review, 31(2), 261-292.
 *   DOI: 10.1007/s10648-019-09465-5 [Updated review]
 * - Kalyuga, S. (2011). Cognitive load theory: How many types of load does it really need?
 *   Educational Psychology Review, 23(1), 1-19. DOI: 10.1007/s10648-010-9150-7
 *   [Intrinsic, Extraneous, Germane load types]
 * 
 * SPACED PRACTICE & TESTING EFFECT:
 * - Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006).
 *   Distributed practice in verbal recall tasks: A review and quantitative synthesis.
 *   Psychological Bulletin, 132(3), 354-380. DOI: 10.1037/0033-2909.132.3.354
 *   [d = 0.42-0.85 for spacing effect - values used in effectSize fields]
 * - Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning.
 *   Psychological Science, 17(3), 249-255. DOI: 10.1111/j.1467-9280.2006.01693.x
 *   [Testing effect - retrieval practice superiority]
 * - Rowland, C. A. (2014). The effect of testing versus restudy on retention.
 *   Psychological Bulletin, 140(6), 1432-1463. DOI: 10.1037/a0037559
 *   [Practice testing effect size d = 0.67]
 * 
 * SELF-REGULATED LEARNING:
 * - Zimmerman, B. J. (2002). Becoming a self-regulated learner: An overview.
 *   Theory Into Practice, 41(2), 64-70. DOI: 10.1207/s15430421tip4102_2
 *   [Cyclical model: Forethought, Performance, Self-Reflection - structure of SRL_PHASES]
 * - Pintrich, P. R. (2000). The role of goal orientation in self-regulated learning.
 *   In Handbook of Self-Regulation. Academic Press. [MSLQ instrument]
 * - Dent, A. L., & Koenka, A. C. (2016). Self-regulated learning and academic achievement
 *   meta-analysis. Educational Psychology Review, 28(3), 425-474. DOI: 10.1007/s10648-015-9320-8
 *   [r = .22-.28 for SRL → academic achievement]
 * 
 * GROWTH MINDSET (included with caveats about effect size):
 * - Dweck, C. S. (2006). Mindset: The New Psychology of Success. Random House.
 * - Sisk, V. F., et al. (2018). Growth mindsets and academic achievement meta-analyses.
 *   Psychological Science, 29(4), 549-571. DOI: 10.1177/0956797617739704
 *   [r = .10 - WEAK effect, smaller than popularized claims]
 * - Yeager, D. S., et al. (2019). National growth mindset experiment.
 *   Nature, 573, 364-369. DOI: 10.1038/s41586-019-1466-y [Effect mainly for lower-achievers]
 */

// ============================================
// TYPES
// ============================================

export type EffectivenessLevel = 'high' | 'moderate' | 'low'
export type CognitiveLoadType = 'intrinsic' | 'extraneous' | 'germane'

export interface LearningTechnique {
    id: string
    name: string
    nameVi: string
    description: string
    descriptionVi: string
    effectivenessLevel: EffectivenessLevel
    // Effect size from Dunlosky et al. (2013) or other meta-analyses
    effectSize?: number
    effectSizeSource?: string
    // What conditions make it effective
    effectiveWhen: string[]
    effectiveWhenVi: string[]
    // Limitations
    limitations: string[]
    limitationsVi: string[]
    // How to implement
    howToImplement: string[]
    howToImplementVi: string[]
    // Big5 compatibility
    big5Compatibility: {
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
    // Time required
    timeRequired: 'minimal' | 'moderate' | 'substantial'
    // Materials needed
    materialsNeeded: string[]
}

export interface CognitiveLoadPrinciple {
    id: string
    name: string
    nameVi: string
    loadType: CognitiveLoadType
    description: string
    descriptionVi: string
    principle: string
    principleVi: string
    examples: string[]
    examplesVi: string[]
    evidenceLevel: 'A' | 'B' | 'C'
}

export interface SelfRegulatedLearningPhase {
    phase: 'forethought' | 'performance' | 'self_reflection'
    phaseName: string
    phaseNameVi: string
    processes: Array<{
        name: string
        nameVi: string
        description: string
        descriptionVi: string
        strategies: string[]
        strategiesVi: string[]
    }>
}

// ============================================
// LEARNING TECHNIQUES (Dunlosky et al. 2013)
// ============================================

export const LEARNING_TECHNIQUES: LearningTechnique[] = [
    // === HIGH UTILITY ===
    {
        id: 'practice_testing',
        name: 'Practice Testing (Retrieval Practice)',
        nameVi: 'Luyện tập Kiểm tra (Thực hành Truy xuất)',
        description: 'Self-testing or taking practice tests over to-be-learned material',
        descriptionVi: 'Tự kiểm tra hoặc làm bài kiểm tra thực hành về nội dung cần học',
        effectivenessLevel: 'high',
        effectSize: 0.67,
        effectSizeSource: 'Rowland (2014) meta-analysis',
        effectiveWhen: [
            'Used with feedback',
            'Spaced over time',
            'Covers material comprehensively',
            'Uses varied question types'
        ],
        effectiveWhenVi: [
            'Sử dụng kèm phản hồi',
            'Phân bố theo thời gian',
            'Bao phủ nội dung toàn diện',
            'Sử dụng nhiều dạng câu hỏi'
        ],
        limitations: [
            'Requires initial learning first',
            'May be less effective for complex synthesis'
        ],
        limitationsVi: [
            'Cần học sơ bộ trước',
            'Có thể kém hiệu quả với tổng hợp phức tạp'
        ],
        howToImplement: [
            '1. After studying, close your materials',
            '2. Write down or recite everything you remember',
            '3. Check against materials for accuracy',
            '4. Focus on what you missed',
            '5. Repeat after a delay'
        ],
        howToImplementVi: [
            '1. Sau khi học, đóng tài liệu lại',
            '2. Viết ra hoặc đọc lại mọi thứ bạn nhớ',
            '3. Kiểm tra độ chính xác với tài liệu',
            '4. Tập trung vào phần đã bỏ lỡ',
            '5. Lặp lại sau một khoảng thời gian'
        ],
        big5Compatibility: { highC: true, lowC: true, highN: true },
        timeRequired: 'moderate',
        materialsNeeded: ['Flashcards', 'Practice tests', 'Blank paper']
    },
    {
        id: 'distributed_practice',
        name: 'Distributed Practice (Spaced Learning)',
        nameVi: 'Thực hành Phân tán (Học theo Khoảng cách)',
        description: 'Spreading learning over time rather than massing it in a single session',
        descriptionVi: 'Phân bố việc học theo thời gian thay vì nhồi nhét trong một lần',
        effectivenessLevel: 'high',
        effectSize: 0.71,
        effectSizeSource: 'Cepeda et al. (2006)',
        effectiveWhen: [
            'Retention is important',
            'Material needs to be remembered long-term',
            'Schedule permits planning ahead',
            'Combined with retrieval practice'
        ],
        effectiveWhenVi: [
            'Cần ghi nhớ lâu dài',
            'Nội dung cần nhớ trong thời gian dài',
            'Lịch trình cho phép lên kế hoạch trước',
            'Kết hợp với thực hành truy xuất'
        ],
        limitations: [
            'Requires planning and discipline',
            'May feel less productive initially'
        ],
        limitationsVi: [
            'Cần lên kế hoạch và kỷ luật',
            'Có thể cảm thấy ít hiệu quả ban đầu'
        ],
        howToImplement: [
            '1. Plan study sessions across multiple days',
            '2. Use the "10-3-1" rule: review after 10 mins, 3 days, 1 week',
            '3. Use spaced repetition software (Anki, Quizlet)',
            '4. Schedule reviews in calendar',
            '5. Focus on difficult items more frequently'
        ],
        howToImplementVi: [
            '1. Lên kế hoạch các buổi học qua nhiều ngày',
            '2. Sử dụng quy tắc "10-3-1": ôn sau 10 phút, 3 ngày, 1 tuần',
            '3. Sử dụng phần mềm lặp lại theo khoảng (Anki, Quizlet)',
            '4. Đặt lịch ôn tập trong calendar',
            '5. Tập trung vào các mục khó thường xuyên hơn'
        ],
        big5Compatibility: { highC: true },
        timeRequired: 'substantial',
        materialsNeeded: ['Spaced repetition app', 'Calendar', 'Study planner']
    },

    // === MODERATE UTILITY ===
    {
        id: 'interleaved_practice',
        name: 'Interleaved Practice',
        nameVi: 'Thực hành Xen kẽ',
        description: 'Mixing different topics, subjects, or types of problems within a single study session',
        descriptionVi: 'Kết hợp các chủ đề, môn học hoặc loại bài tập khác nhau trong một buổi học',
        effectivenessLevel: 'moderate',
        effectSize: 0.43,
        effectSizeSource: 'Rohrer & Taylor (2007)',
        effectiveWhen: [
            'Learning similar concepts that can be confused',
            'Developing discrimination skills',
            'Preparing for exams with mixed problems'
        ],
        effectiveWhenVi: [
            'Học các khái niệm tương tự có thể nhầm lẫn',
            'Phát triển kỹ năng phân biệt',
            'Chuẩn bị thi với các bài tập hỗn hợp'
        ],
        limitations: [
            'Feels harder than blocked practice',
            'May not work for complete beginners'
        ],
        limitationsVi: [
            'Cảm giác khó hơn học theo khối',
            'Có thể không hiệu quả cho người mới bắt đầu'
        ],
        howToImplement: [
            '1. Instead of doing 20 of one type, do 5 each of 4 types',
            '2. Mix related but distinct concepts',
            '3. Randomize order of practice items',
            '4. Expect it to feel harder (this is good!)',
            '5. Focus on identifying problem types'
        ],
        howToImplementVi: [
            '1. Thay vì làm 20 bài một loại, làm 5 bài mỗi loại trong 4 loại',
            '2. Kết hợp các khái niệm liên quan nhưng khác biệt',
            '3. Ngẫu nhiên hóa thứ tự các bài tập',
            '4. Chấp nhận cảm giác khó hơn (điều này tốt!)',
            '5. Tập trung vào việc nhận dạng loại bài'
        ],
        big5Compatibility: { highO: true, highC: true },
        timeRequired: 'moderate',
        materialsNeeded: ['Mixed problem sets', 'Shuffled flashcards']
    },
    {
        id: 'elaborative_interrogation',
        name: 'Elaborative Interrogation',
        nameVi: 'Câu hỏi Khai triển',
        description: 'Generating explanations for why stated facts are true',
        descriptionVi: 'Tạo ra các giải thích cho lý do tại sao các sự kiện được nêu là đúng',
        effectivenessLevel: 'moderate',
        effectSize: 0.42,
        effectSizeSource: 'Dunlosky et al. (2013)',
        effectiveWhen: [
            'Learning factual information',
            'Learner has prior knowledge to connect',
            'Materials allow for "why" questions'
        ],
        effectiveWhenVi: [
            'Học thông tin thực tế',
            'Người học có kiến thức nền để kết nối',
            'Tài liệu cho phép đặt câu hỏi "tại sao"'
        ],
        limitations: [
            'Less effective without prior knowledge',
            'Time-consuming'
        ],
        limitationsVi: [
            'Kém hiệu quả khi không có kiến thức nền',
            'Tốn thời gian'
        ],
        howToImplement: [
            '1. Read a fact or concept',
            '2. Ask "Why is this true?" or "Why does this make sense?"',
            '3. Generate your own explanation',
            '4. Connect to what you already know',
            '5. Verify your explanation is accurate'
        ],
        howToImplementVi: [
            '1. Đọc một sự kiện hoặc khái niệm',
            '2. Hỏi "Tại sao điều này đúng?" hoặc "Tại sao điều này hợp lý?"',
            '3. Tạo ra giải thích của riêng bạn',
            '4. Kết nối với những gì bạn đã biết',
            '5. Xác minh giải thích của bạn chính xác'
        ],
        big5Compatibility: { highO: true },
        timeRequired: 'moderate',
        materialsNeeded: ['Study materials', 'Notebook']
    },
    {
        id: 'self_explanation',
        name: 'Self-Explanation',
        nameVi: 'Tự Giải thích',
        description: 'Explaining how new information relates to known information or steps in problem solving',
        descriptionVi: 'Giải thích cách thông tin mới liên quan đến thông tin đã biết hoặc các bước giải quyết vấn đề',
        effectivenessLevel: 'moderate',
        effectSize: 0.59,
        effectSizeSource: 'Bisra et al. (2018)',
        effectiveWhen: [
            'Learning procedures or processes',
            'Studying worked examples',
            'Material is at appropriate difficulty level'
        ],
        effectiveWhenVi: [
            'Học các quy trình hoặc quá trình',
            'Nghiên cứu các ví dụ mẫu',
            'Tài liệu ở mức độ khó phù hợp'
        ],
        limitations: [
            'Requires understanding, not just memorization',
            'Can be difficult for novices'
        ],
        limitationsVi: [
            'Cần hiểu, không chỉ ghi nhớ',
            'Có thể khó với người mới'
        ],
        howToImplement: [
            '1. Study a worked example or concept',
            '2. Explain each step aloud or in writing',
            '3. Ask "What does this mean?" at each step',
            '4. Connect to prior knowledge',
            '5. Identify gaps in understanding'
        ],
        howToImplementVi: [
            '1. Nghiên cứu một ví dụ mẫu hoặc khái niệm',
            '2. Giải thích từng bước bằng lời hoặc viết',
            '3. Hỏi "Điều này có nghĩa gì?" ở mỗi bước',
            '4. Kết nối với kiến thức đã có',
            '5. Xác định các lỗ hổng trong hiểu biết'
        ],
        big5Compatibility: { highO: true, highC: true },
        timeRequired: 'moderate',
        materialsNeeded: ['Worked examples', 'Audio recorder or notebook']
    },

    // === LOW UTILITY ===
    {
        id: 'highlighting',
        name: 'Highlighting/Underlining',
        nameVi: 'Đánh dấu/Gạch chân',
        description: 'Marking potentially important portions of to-be-learned materials',
        descriptionVi: 'Đánh dấu các phần có thể quan trọng của tài liệu cần học',
        effectivenessLevel: 'low',
        effectSize: 0.08,
        effectSizeSource: 'Dunlosky et al. (2013)',
        effectiveWhen: [
            'Used sparingly and selectively',
            'Combined with other techniques',
            'As a first-pass organization tool'
        ],
        effectiveWhenVi: [
            'Sử dụng tiết kiệm và có chọn lọc',
            'Kết hợp với các kỹ thuật khác',
            'Như công cụ tổ chức ban đầu'
        ],
        limitations: [
            'Passive - does not involve generation',
            'Often overused (highlighting everything)',
            'Creates illusion of learning'
        ],
        limitationsVi: [
            'Thụ động - không tạo ra sản phẩm',
            'Thường bị lạm dụng (đánh dấu mọi thứ)',
            'Tạo ảo giác về việc học'
        ],
        howToImplement: [
            'If you must use it:',
            '1. Limit to one sentence per paragraph',
            '2. Highlight after reading the full section',
            '3. Follow up with retrieval practice',
            '4. Use different colors for different categories'
        ],
        howToImplementVi: [
            'Nếu bạn phải sử dụng:',
            '1. Giới hạn một câu mỗi đoạn',
            '2. Đánh dấu sau khi đọc hết phần',
            '3. Theo dõi bằng thực hành truy xuất',
            '4. Sử dụng màu khác nhau cho các danh mục khác nhau'
        ],
        big5Compatibility: { lowC: true },
        timeRequired: 'minimal',
        materialsNeeded: ['Highlighters', 'Text materials']
    },
    {
        id: 'rereading',
        name: 'Rereading',
        nameVi: 'Đọc lại',
        description: 'Restudying text material after an initial reading',
        descriptionVi: 'Học lại tài liệu văn bản sau lần đọc đầu tiên',
        effectivenessLevel: 'low',
        effectSize: 0.15,
        effectSizeSource: 'Dunlosky et al. (2013)',
        effectiveWhen: [
            'Material is very complex',
            'First reading was rushed',
            'Spaced rather than massed'
        ],
        effectiveWhenVi: [
            'Tài liệu rất phức tạp',
            'Lần đọc đầu tiên vội vàng',
            'Phân bố thay vì liên tục'
        ],
        limitations: [
            'Extremely passive',
            'Creates strong illusion of learning',
            'Diminishing returns after 2nd reading',
            'Time inefficient'
        ],
        limitationsVi: [
            'Cực kỳ thụ động',
            'Tạo ảo giác mạnh về việc học',
            'Hiệu quả giảm dần sau lần đọc thứ 2',
            'Kém hiệu quả về thời gian'
        ],
        howToImplement: [
            'Generally avoid - use retrieval practice instead',
            'If needed: Read, wait a day, then re-read actively'
        ],
        howToImplementVi: [
            'Thường nên tránh - sử dụng thực hành truy xuất thay thế',
            'Nếu cần: Đọc, đợi một ngày, sau đó đọc lại chủ động'
        ],
        big5Compatibility: { lowC: true, highN: true },
        timeRequired: 'substantial',
        materialsNeeded: ['Text materials']
    },
    {
        id: 'summarization',
        name: 'Summarization',
        nameVi: 'Tóm tắt',
        description: 'Writing summaries of to-be-learned texts',
        descriptionVi: 'Viết tóm tắt các văn bản cần học',
        effectivenessLevel: 'low',
        effectSize: 0.30,
        effectSizeSource: 'Dunlosky et al. (2013)',
        effectiveWhen: [
            'Student is trained in summarization',
            'Summarizing is followed by testing',
            'Material is lengthy prose'
        ],
        effectiveWhenVi: [
            'Học sinh được đào tạo về kỹ năng tóm tắt',
            'Việc tóm tắt được theo sau bởi kiểm tra',
            'Tài liệu là văn xuôi dài'
        ],
        limitations: [
            'Quality highly variable',
            'Most students do not summarize well',
            'Can become copy-paste exercise'
        ],
        limitationsVi: [
            'Chất lượng rất biến đổi',
            'Hầu hết học sinh không tóm tắt tốt',
            'Có thể trở thành bài tập copy-paste'
        ],
        howToImplement: [
            '1. Read the full section first',
            '2. Close the book',
            '3. Write main ideas from memory',
            '4. Check and correct',
            '5. Limit to key concepts only'
        ],
        howToImplementVi: [
            '1. Đọc toàn bộ phần trước',
            '2. Đóng sách lại',
            '3. Viết các ý chính từ trí nhớ',
            '4. Kiểm tra và sửa',
            '5. Giới hạn chỉ các khái niệm chính'
        ],
        big5Compatibility: { highC: true, highO: true },
        timeRequired: 'substantial',
        materialsNeeded: ['Notebook', 'Text materials']
    }
]

// ============================================
// COGNITIVE LOAD PRINCIPLES
// ============================================

export const COGNITIVE_LOAD_PRINCIPLES: CognitiveLoadPrinciple[] = [
    // === REDUCE EXTRANEOUS LOAD ===
    {
        id: 'coherence_effect',
        name: 'Coherence Effect',
        nameVi: 'Hiệu ứng Nhất quán',
        loadType: 'extraneous',
        description: 'Learning is improved when extraneous material is excluded',
        descriptionVi: 'Việc học được cải thiện khi loại bỏ tài liệu không liên quan',
        principle: 'Eliminate interesting but irrelevant content, sounds, graphics',
        principleVi: 'Loại bỏ nội dung, âm thanh, hình ảnh thú vị nhưng không liên quan',
        examples: [
            'Remove decorative images from slides',
            'Eliminate background music during learning',
            'Cut anecdotes that don\'t illustrate main points'
        ],
        examplesVi: [
            'Loại bỏ hình ảnh trang trí khỏi slides',
            'Loại bỏ nhạc nền khi học',
            'Cắt bỏ các câu chuyện không minh họa điểm chính'
        ],
        evidenceLevel: 'A'
    },
    {
        id: 'signaling_effect',
        name: 'Signaling Effect',
        nameVi: 'Hiệu ứng Báo hiệu',
        loadType: 'extraneous',
        description: 'Learning is improved when cues highlight essential material',
        descriptionVi: 'Việc học được cải thiện khi các dấu hiệu làm nổi bật tài liệu thiết yếu',
        principle: 'Use headings, bold, arrows to guide attention',
        principleVi: 'Sử dụng tiêu đề, in đậm, mũi tên để hướng dẫn sự chú ý',
        examples: [
            'Bold key terms',
            'Use numbered steps',
            'Add visual cues pointing to important elements'
        ],
        examplesVi: [
            'In đậm các thuật ngữ chính',
            'Sử dụng các bước được đánh số',
            'Thêm các dấu hiệu trực quan chỉ vào các yếu tố quan trọng'
        ],
        evidenceLevel: 'A'
    },
    {
        id: 'redundancy_effect',
        name: 'Redundancy Effect',
        nameVi: 'Hiệu ứng Dư thừa',
        loadType: 'extraneous',
        description: 'Learning is harmed when identical information is presented in multiple formats',
        descriptionVi: 'Việc học bị ảnh hưởng khi thông tin giống hệt nhau được trình bày ở nhiều định dạng',
        principle: 'Don\'t read slides word-for-word; don\'t show text that matches narration exactly',
        principleVi: 'Không đọc slides từng chữ; không hiển thị văn bản khớp chính xác với lời nói',
        examples: [
            'Use visuals with narration, not narration + matching text',
            'Don\'t include transcript on screen while speaking',
            'Choose one modality for same information'
        ],
        examplesVi: [
            'Sử dụng hình ảnh với lời nói, không phải lời nói + văn bản khớp',
            'Không bao gồm bản ghi trên màn hình khi nói',
            'Chọn một phương thức cho cùng một thông tin'
        ],
        evidenceLevel: 'A'
    },
    {
        id: 'contiguity_effect',
        name: 'Spatial Contiguity Effect',
        nameVi: 'Hiệu ứng Liền kề Không gian',
        loadType: 'extraneous',
        description: 'Learning is improved when related text and graphics are placed near each other',
        descriptionVi: 'Việc học được cải thiện khi văn bản và đồ họa liên quan được đặt gần nhau',
        principle: 'Integrate text into graphics rather than separating them',
        principleVi: 'Tích hợp văn bản vào đồ họa thay vì tách riêng chúng',
        examples: [
            'Label parts of a diagram directly on the diagram',
            'Don\'t put explanations on a separate page from the figure',
            'Place text next to the relevant visual element'
        ],
        examplesVi: [
            'Ghi nhãn các phần của sơ đồ trực tiếp trên sơ đồ',
            'Không đặt giải thích trên một trang riêng biệt với hình',
            'Đặt văn bản bên cạnh yếu tố trực quan liên quan'
        ],
        evidenceLevel: 'A'
    },

    // === MANAGE INTRINSIC LOAD ===
    {
        id: 'segmenting_effect',
        name: 'Segmenting Effect',
        nameVi: 'Hiệu ứng Phân đoạn',
        loadType: 'intrinsic',
        description: 'Learning is improved when complex lessons are broken into parts',
        descriptionVi: 'Việc học được cải thiện khi các bài học phức tạp được chia thành các phần',
        principle: 'Break complex material into learner-paced segments',
        principleVi: 'Chia tài liệu phức tạp thành các phần theo tốc độ người học',
        examples: [
            'Pause videos at logical break points',
            'Allow learner to control pace',
            'Present one concept at a time'
        ],
        examplesVi: [
            'Tạm dừng video tại các điểm ngắt logic',
            'Cho phép người học kiểm soát tốc độ',
            'Trình bày từng khái niệm một'
        ],
        evidenceLevel: 'A'
    },
    {
        id: 'pretraining_effect',
        name: 'Pretraining Effect',
        nameVi: 'Hiệu ứng Đào tạo trước',
        loadType: 'intrinsic',
        description: 'Learning is improved when names and characteristics of key concepts are taught first',
        descriptionVi: 'Việc học được cải thiện khi tên và đặc điểm của các khái niệm chính được dạy trước',
        principle: 'Teach component concepts before teaching how they work together',
        principleVi: 'Dạy các khái niệm thành phần trước khi dạy cách chúng hoạt động cùng nhau',
        examples: [
            'Teach vocabulary before reading comprehension',
            'Teach component names before the process',
            'Build schema first, then details'
        ],
        examplesVi: [
            'Dạy từ vựng trước đọc hiểu',
            'Dạy tên các thành phần trước quy trình',
            'Xây dựng schema trước, sau đó là chi tiết'
        ],
        evidenceLevel: 'A'
    },

    // === PROMOTE GERMANE LOAD ===
    {
        id: 'worked_example_effect',
        name: 'Worked Example Effect',
        nameVi: 'Hiệu ứng Ví dụ Mẫu',
        loadType: 'germane',
        description: 'Learning is improved when worked examples are studied rather than solving equivalent problems',
        descriptionVi: 'Việc học được cải thiện khi nghiên cứu các ví dụ mẫu thay vì giải các bài toán tương đương',
        principle: 'For novices, studying worked examples beats problem-solving',
        principleVi: 'Đối với người mới, nghiên cứu ví dụ mẫu hiệu quả hơn giải bài tập',
        examples: [
            'Show step-by-step solutions first',
            'Fade scaffolding as expertise develops',
            'Use completion problems as intermediate step'
        ],
        examplesVi: [
            'Hiển thị các giải pháp từng bước trước',
            'Giảm dần sự hỗ trợ khi chuyên môn phát triển',
            'Sử dụng các bài tập hoàn thành như bước trung gian'
        ],
        evidenceLevel: 'A'
    },
    {
        id: 'generation_effect',
        name: 'Generation Effect',
        nameVi: 'Hiệu ứng Tạo sinh',
        loadType: 'germane',
        description: 'Learning is improved when learners actively generate information',
        descriptionVi: 'Việc học được cải thiện khi người học chủ động tạo ra thông tin',
        principle: 'Active generation beats passive reading',
        principleVi: 'Tạo sinh chủ động hiệu quả hơn đọc thụ động',
        examples: [
            'Complete sentences with missing words',
            'Generate examples of concepts',
            'Create questions from material'
        ],
        examplesVi: [
            'Hoàn thành câu với các từ còn thiếu',
            'Tạo ví dụ về các khái niệm',
            'Tạo câu hỏi từ tài liệu'
        ],
        evidenceLevel: 'A'
    }
]

// ============================================
// SELF-REGULATED LEARNING (Zimmerman 2002)
// ============================================

export const SELF_REGULATED_LEARNING_PHASES: SelfRegulatedLearningPhase[] = [
    {
        phase: 'forethought',
        phaseName: 'Forethought Phase',
        phaseNameVi: 'Giai đoạn Suy nghĩ trước',
        processes: [
            {
                name: 'Goal Setting',
                nameVi: 'Đặt Mục tiêu',
                description: 'Deciding on specific learning outcomes',
                descriptionVi: 'Quyết định các kết quả học tập cụ thể',
                strategies: [
                    'Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)',
                    'Break large goals into sub-goals',
                    'Prioritize goals based on importance'
                ],
                strategiesVi: [
                    'Đặt mục tiêu SMART (Cụ thể, Đo lường được, Đạt được, Liên quan, Có thời hạn)',
                    'Chia mục tiêu lớn thành các mục tiêu con',
                    'Ưu tiên mục tiêu dựa trên tầm quan trọng'
                ]
            },
            {
                name: 'Strategic Planning',
                nameVi: 'Lập Kế hoạch Chiến lược',
                description: 'Selecting learning strategies appropriate for the task',
                descriptionVi: 'Lựa chọn các chiến lược học tập phù hợp với nhiệm vụ',
                strategies: [
                    'Choose high-utility study methods (retrieval, spacing)',
                    'Plan when, where, and how long to study',
                    'Prepare necessary materials in advance'
                ],
                strategiesVi: [
                    'Chọn các phương pháp học tập hiệu quả cao (truy xuất, phân bố)',
                    'Lên kế hoạch khi nào, ở đâu và học bao lâu',
                    'Chuẩn bị các tài liệu cần thiết trước'
                ]
            },
            {
                name: 'Self-Efficacy Beliefs',
                nameVi: 'Niềm tin về Hiệu quả Bản thân',
                description: 'Beliefs about one\'s capability to learn the material',
                descriptionVi: 'Niềm tin về khả năng học tài liệu của bản thân',
                strategies: [
                    'Focus on past successes',
                    'Break tasks into manageable pieces',
                    'Use positive self-talk'
                ],
                strategiesVi: [
                    'Tập trung vào những thành công trong quá khứ',
                    'Chia nhiệm vụ thành các phần có thể quản lý',
                    'Sử dụng tự nói tích cực'
                ]
            }
        ]
    },
    {
        phase: 'performance',
        phaseName: 'Performance Phase',
        phaseNameVi: 'Giai đoạn Thực hiện',
        processes: [
            {
                name: 'Attention Focusing',
                nameVi: 'Tập trung Chú ý',
                description: 'Maintaining concentration on the task',
                descriptionVi: 'Duy trì sự tập trung vào nhiệm vụ',
                strategies: [
                    'Eliminate distractions (phone, notifications)',
                    'Use Pomodoro technique (25 min work, 5 min break)',
                    'Create a dedicated study environment'
                ],
                strategiesVi: [
                    'Loại bỏ phiền nhiễu (điện thoại, thông báo)',
                    'Sử dụng kỹ thuật Pomodoro (25 phút làm việc, 5 phút nghỉ)',
                    'Tạo môi trường học tập chuyên dụng'
                ]
            },
            {
                name: 'Self-Instruction',
                nameVi: 'Tự Hướng dẫn',
                description: 'Guiding oneself through the learning process',
                descriptionVi: 'Hướng dẫn bản thân trong quá trình học',
                strategies: [
                    'Talk through problem steps aloud',
                    'Ask yourself guiding questions',
                    'Use self-explanation while reading'
                ],
                strategiesVi: [
                    'Nói qua các bước giải quyết vấn đề',
                    'Tự hỏi mình các câu hỏi hướng dẫn',
                    'Sử dụng tự giải thích khi đọc'
                ]
            },
            {
                name: 'Self-Monitoring',
                nameVi: 'Tự Theo dõi',
                description: 'Tracking one\'s understanding and progress',
                descriptionVi: 'Theo dõi sự hiểu biết và tiến trình của bản thân',
                strategies: [
                    'Check understanding after each section',
                    'Note confusion points for later review',
                    'Track time spent on tasks'
                ],
                strategiesVi: [
                    'Kiểm tra sự hiểu biết sau mỗi phần',
                    'Ghi chú các điểm nhầm lẫn để xem lại sau',
                    'Theo dõi thời gian dành cho các nhiệm vụ'
                ]
            }
        ]
    },
    {
        phase: 'self_reflection',
        phaseName: 'Self-Reflection Phase',
        phaseNameVi: 'Giai đoạn Tự Phản ánh',
        processes: [
            {
                name: 'Self-Evaluation',
                nameVi: 'Tự Đánh giá',
                description: 'Comparing one\'s performance to a standard',
                descriptionVi: 'So sánh hiệu suất của bản thân với một tiêu chuẩn',
                strategies: [
                    'Practice test yourself without looking at notes',
                    'Compare answers to correct solutions',
                    'Grade your own work honestly'
                ],
                strategiesVi: [
                    'Tự kiểm tra mà không nhìn vào ghi chú',
                    'So sánh câu trả lời với giải pháp đúng',
                    'Chấm điểm công việc của mình một cách trung thực'
                ]
            },
            {
                name: 'Causal Attribution',
                nameVi: 'Quy kết Nguyên nhân',
                description: 'Attributing successes/failures to specific causes',
                descriptionVi: 'Quy kết thành công/thất bại cho các nguyên nhân cụ thể',
                strategies: [
                    'Attribute success to effort, not just ability',
                    'View failures as learning opportunities',
                    'Identify controllable factors to improve'
                ],
                strategiesVi: [
                    'Quy kết thành công cho nỗ lực, không chỉ khả năng',
                    'Xem thất bại như cơ hội học tập',
                    'Xác định các yếu tố có thể kiểm soát để cải thiện'
                ]
            },
            {
                name: 'Adaptive Inference',
                nameVi: 'Suy luận Thích ứng',
                description: 'Drawing conclusions about what to change',
                descriptionVi: 'Rút ra kết luận về những gì cần thay đổi',
                strategies: [
                    'Modify study methods based on what worked',
                    'Adjust time allocation for difficult topics',
                    'Seek help for persistent challenges'
                ],
                strategiesVi: [
                    'Điều chỉnh phương pháp học dựa trên những gì hiệu quả',
                    'Điều chỉnh phân bổ thời gian cho các chủ đề khó',
                    'Tìm kiếm sự giúp đỡ cho các thử thách dai dẳng'
                ]
            }
        ]
    }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get recommended learning techniques based on Big5 profile
 */
export function getRecommendedLearningTechniques(big5: {
    O: number
    C: number
    E: number
    A: number
    N: number
}): LearningTechnique[] {
    return LEARNING_TECHNIQUES.filter(technique => {
        const fit = technique.big5Compatibility
        let score = 0

        if (fit.highO && big5.O > 60) score++
        if (fit.lowO && big5.O < 40) score++
        if (fit.highC && big5.C > 60) score++
        if (fit.lowC && big5.C < 40) score++
        if (fit.highE && big5.E > 60) score++
        if (fit.lowE && big5.E < 40) score++
        if (fit.highN && big5.N > 60) score++
        if (fit.lowN && big5.N < 40) score++

        // Prioritize high utility techniques
        if (technique.effectivenessLevel === 'high') score += 2
        if (technique.effectivenessLevel === 'moderate') score += 1

        return score > 0
    }).sort((a, b) => {
        const order = { high: 3, moderate: 2, low: 1 }
        return order[b.effectivenessLevel] - order[a.effectivenessLevel]
    })
}

/**
 * Get study advice based on profile
 */
export function getStudyAdvice(big5: {
    O: number
    C: number
    E: number
    N: number
}): string[] {
    const advice: string[] = []

    // High O - likes abstraction, variety
    if (big5.O > 70) {
        advice.push('Bạn thích sự đa dạng - hãy sử dụng Interleaved Practice để kết hợp nhiều chủ đề.')
        advice.push('Kết nối ý tưởng mới với kiến thức đã có bằng Elaborative Interrogation.')
    }

    // Low O - prefers concrete, structured
    if (big5.O < 30) {
        advice.push('Bạn thích sự cụ thể - tập trung vào ví dụ mẫu (Worked Examples) trước khi lý thuyết.')
        advice.push('Sử dụng quy trình có cấu trúc rõ ràng cho mỗi buổi học.')
    }

    // High C - disciplined, organized
    if (big5.C > 70) {
        advice.push('Bạn có kỷ luật tốt - tối ưu hóa với Distributed Practice và Spaced Repetition.')
        advice.push('Lên lịch học cố định và theo dõi tiến trình chi tiết.')
    }

    // Low C - struggles with structure
    if (big5.C < 30) {
        advice.push('Việc duy trì kỷ luật có thể khó - hãy bắt đầu với các buổi học ngắn (10-15 phút).')
        advice.push('Sử dụng Gamification và rewards để duy trì động lực.')
        advice.push('Tìm accountability partner hoặc nhóm học.')
    }

    // High N - anxious about exams
    if (big5.N > 70) {
        advice.push('Lo lắng về thi cử có thể cản trở - sử dụng Practice Testing thường xuyên để quen với áp lực.')
        advice.push('Chuẩn bị kỹ lưỡng trước để xây dựng sự tự tin.')
        advice.push('Thực hành kỹ thuật thư giãn trước và trong khi học.')
    }

    return advice
}
