/**
 * Thư viện thuật ngữ chuyên môn - MisosCare Glossary
 * Giải thích các thuật ngữ tâm lý học và kỹ thuật sử dụng trong ứng dụng
 */

export interface GlossaryTerm {
    term: string;
    shortDefinition: string;
    fullDefinition?: string;
    category: 'psychology' | 'test' | 'mental_health' | 'technique' | 'general';
    relatedTerms?: string[];
}

export const glossaryTerms: Record<string, GlossaryTerm> = {
    // ===== MBTI & Personality =====
    'MBTI': {
        term: 'MBTI',
        shortDefinition: 'Trắc nghiệm tính cách 16 loại dựa trên lý thuyết Jung',
        fullDefinition: 'Myers-Briggs Type Indicator (MBTI) là công cụ đánh giá tính cách phổ biến nhất thế giới, phân loại con người thành 16 loại tính cách dựa trên 4 chiều: Hướng ngoại/Hướng nội (E/I), Giác quan/Trực giác (S/N), Lý trí/Cảm xúc (T/F), và Nguyên tắc/Linh hoạt (J/P).',
        category: 'test',
        relatedTerms: ['Big Five', 'Tính cách', 'Jung']
    },
    'Hướng ngoại': {
        term: 'Hướng ngoại (Extraversion)',
        shortDefinition: 'Xu hướng tập trung năng lượng ra bên ngoài',
        fullDefinition: 'Người hướng ngoại thường năng động, thích giao tiếp xã hội, và lấy năng lượng từ việc tương tác với người khác. Họ thường suy nghĩ to tiếng và hành động trước khi suy nghĩ.',
        category: 'psychology',
        relatedTerms: ['Hướng nội', 'MBTI', 'Big Five']
    },
    'Hướng nội': {
        term: 'Hướng nội (Introversion)',
        shortDefinition: 'Xu hướng tập trung năng lượng vào bên trong',
        fullDefinition: 'Người hướng nội thường trầm lắng, thích suy tư một mình, và cần thời gian riêng để nạp lại năng lượng sau khi giao tiếp xã hội. Họ thường suy nghĩ kỹ trước khi nói.',
        category: 'psychology',
        relatedTerms: ['Hướng ngoại', 'MBTI', 'Big Five']
    },

    // ===== Big Five =====
    'Big Five': {
        term: 'Big Five',
        shortDefinition: 'Mô hình 5 đặc điểm tính cách phổ quát',
        fullDefinition: 'Big Five (OCEAN) là mô hình khoa học được chấp nhận rộng rãi nhất về tính cách, gồm 5 yếu tố: Cởi mở (Openness), Tận tâm (Conscientiousness), Hướng ngoại (Extraversion), Dễ chịu (Agreeableness), và Nhạy cảm (Neuroticism).',
        category: 'test',
        relatedTerms: ['MBTI', 'Openness', 'Conscientiousness']
    },
    'Openness': {
        term: 'Cởi mở (Openness)',
        shortDefinition: 'Mức độ sẵn sàng trải nghiệm điều mới',
        fullDefinition: 'Đặc điểm này phản ánh mức độ tò mò, sáng tạo, và cởi mở với ý tưởng mới. Người có điểm cao thường thích nghệ thuật, ý tưởng trừu tượng và trải nghiệm mới lạ.',
        category: 'psychology',
        relatedTerms: ['Big Five', 'Sáng tạo']
    },
    'Conscientiousness': {
        term: 'Tận tâm (Conscientiousness)',
        shortDefinition: 'Mức độ tự kỷ luật và có tổ chức',
        fullDefinition: 'Đặc điểm này phản ánh khả năng kiểm soát bản thân, lập kế hoạch và hoàn thành mục tiêu. Người có điểm cao thường đáng tin cậy, có tổ chức và chú ý đến chi tiết.',
        category: 'psychology',
        relatedTerms: ['Big Five', 'Kỷ luật']
    },
    'Agreeableness': {
        term: 'Dễ chịu (Agreeableness)',
        shortDefinition: 'Mức độ hợp tác và quan tâm đến người khác',
        fullDefinition: 'Đặc điểm này phản ánh xu hướng đồng cảm, tin tưởng và hợp tác với người khác. Người có điểm cao thường thân thiện, vị tha và sẵn lòng giúp đỡ.',
        category: 'psychology',
        relatedTerms: ['Big Five', 'Đồng cảm']
    },
    'Neuroticism': {
        term: 'Nhạy cảm (Neuroticism)',
        shortDefinition: 'Xu hướng trải nghiệm cảm xúc tiêu cực',
        fullDefinition: 'Đặc điểm này phản ánh mức độ dễ bị ảnh hưởng bởi stress, lo âu và cảm xúc tiêu cực. Điểm cao không có nghĩa là bệnh tật - chỉ là xu hướng cảm xúc nhạy cảm hơn.',
        category: 'psychology',
        relatedTerms: ['Big Five', 'Lo âu', 'Stress']
    },

    // ===== Mental Health =====
    'DASS-21': {
        term: 'DASS-21',
        shortDefinition: 'Thang đo trầm cảm, lo âu và stress',
        fullDefinition: 'Depression Anxiety Stress Scale 21 là công cụ sàng lọc gồm 21 câu hỏi, đánh giá 3 trạng thái: Trầm cảm (Depression), Lo âu (Anxiety) và Stress trong 1 tuần qua. Đây là công cụ tự đánh giá, không thay thế chẩn đoán y tế.',
        category: 'mental_health',
        relatedTerms: ['Trầm cảm', 'Lo âu', 'Stress']
    },
    'Trầm cảm': {
        term: 'Trầm cảm (Depression)',
        shortDefinition: 'Trạng thái buồn bã, mất hứng thú kéo dài',
        fullDefinition: 'Trầm cảm là rối loạn tâm thần đặc trưng bởi tâm trạng buồn bã, mất hứng thú với hoạt động, thay đổi giấc ngủ/ăn uống, mệt mỏi và khó tập trung. Nếu kéo dài trên 2 tuần, nên tìm kiếm hỗ trợ chuyên môn.',
        category: 'mental_health',
        relatedTerms: ['DASS-21', 'Lo âu', 'Sức khỏe tâm thần']
    },
    'Lo âu': {
        term: 'Lo âu (Anxiety)',
        shortDefinition: 'Cảm giác bất an, lo lắng về tương lai',
        fullDefinition: 'Lo âu là phản ứng tự nhiên với stress, biểu hiện qua lo lắng quá mức, căng thẳng, bồn chồn và triệu chứng thể chất như tim đập nhanh. Lo âu trở thành vấn đề khi ảnh hưởng đến cuộc sống hàng ngày.',
        category: 'mental_health',
        relatedTerms: ['DASS-21', 'Stress', 'CBT']
    },
    'Stress': {
        term: 'Stress',
        shortDefinition: 'Phản ứng của cơ thể với áp lực/đe dọa',
        fullDefinition: 'Stress là phản ứng sinh lý và tâm lý khi đối mặt với yêu cầu hoặc thách thức. Stress ngắn hạn có thể hữu ích, nhưng stress mãn tính có thể gây hại cho sức khỏe thể chất và tinh thần.',
        category: 'mental_health',
        relatedTerms: ['DASS-21', 'Lo âu', 'Burnout']
    },

    // ===== VIA Character Strengths =====
    'VIA': {
        term: 'VIA Character Strengths',
        shortDefinition: '24 điểm mạnh tính cách theo tâm lý học tích cực',
        fullDefinition: 'VIA (Values in Action) là khung phân loại 24 điểm mạnh tính cách phổ quát, được phát triển bởi Martin Seligman. Bao gồm: Sáng tạo, Tò mò, Yêu học hỏi, Lãnh đạo, Hy vọng, Trí tuệ xã hội, v.v.',
        category: 'test',
        relatedTerms: ['Tâm lý học tích cực', 'Điểm mạnh ký danh']
    },
    'Điểm mạnh ký danh': {
        term: 'Điểm mạnh ký danh (Signature Strengths)',
        shortDefinition: '5 điểm mạnh nổi bật nhất của bạn',
        fullDefinition: 'Điểm mạnh ký danh là 5 điểm mạnh hàng đầu trong 24 điểm mạnh VIA. Khi sử dụng chúng, bạn cảm thấy tự nhiên, hào hứng và đích thực. Nghiên cứu cho thấy việc sử dụng điểm mạnh ký danh hàng ngày tăng hạnh phúc.',
        category: 'psychology',
        relatedTerms: ['VIA', 'Tâm lý học tích cực']
    },

    // ===== Therapeutic Approaches =====
    'CBT': {
        term: 'CBT (Trị liệu Nhận thức Hành vi)',
        shortDefinition: 'Phương pháp trị liệu thay đổi suy nghĩ và hành vi',
        fullDefinition: 'Cognitive Behavioral Therapy là phương pháp trị liệu tâm lý dựa trên nguyên lý: suy nghĩ ảnh hưởng đến cảm xúc và hành vi. CBT giúp nhận diện và thay đổi các mẫu suy nghĩ tiêu cực, được chứng minh hiệu quả với lo âu và trầm cảm.',
        category: 'technique',
        relatedTerms: ['ACT', 'Tâm lý trị liệu']
    },
    'ACT': {
        term: 'ACT (Trị liệu Chấp nhận Cam kết)',
        shortDefinition: 'Phương pháp chấp nhận cảm xúc và hành động theo giá trị',
        fullDefinition: 'Acceptance and Commitment Therapy là hình thức trị liệu giúp chấp nhận những gì ngoài tầm kiểm soát, cam kết hành động theo giá trị cá nhân. ACT sử dụng chánh niệm và linh hoạt tâm lý.',
        category: 'technique',
        relatedTerms: ['CBT', 'Chánh niệm', 'Giá trị']
    },
    'Chánh niệm': {
        term: 'Chánh niệm (Mindfulness)',
        shortDefinition: 'Trạng thái chú tâm vào hiện tại không phán xét',
        fullDefinition: 'Chánh niệm là thực hành chú ý có chủ đích đến hiện tại, quan sát suy nghĩ và cảm xúc mà không phán xét. Nghiên cứu cho thấy chánh niệm giúp giảm stress, lo âu và tăng sức khỏe tinh thần.',
        category: 'technique',
        relatedTerms: ['ACT', 'Thiền', 'Stress']
    },

    // ===== MISO Analysis =====
    'MISO': {
        term: 'MISO V3 Analysis',
        shortDefinition: 'Hệ thống phân tích đa chiều của MisosCare',
        fullDefinition: 'MISO (Misos Integrated Score Optimizer) là hệ thống độc quyền của MisosCare, tích hợp kết quả từ nhiều bài test (MBTI, Big5, DASS-21, VIA) để tạo ra phân tích toàn diện và đề xuất can thiệp cá nhân hóa.',
        category: 'general',
        relatedTerms: ['BVS', 'RCS']
    },
    'BVS': {
        term: 'BVS (Behavioral Vulnerability Score)',
        shortDefinition: 'Điểm đánh giá mức độ dễ tổn thương hành vi',
        fullDefinition: 'BVS là chỉ số trong MISO Analysis, đánh giá mức độ dễ tổn thương dựa trên sự kết hợp của các yếu tố tính cách (như Neuroticism cao) và triệu chứng sức khỏe tâm thần.',
        category: 'general',
        relatedTerms: ['MISO', 'RCS']
    },
    'RCS': {
        term: 'RCS (Resilience Capacity Score)',
        shortDefinition: 'Điểm đánh giá năng lực phục hồi',
        fullDefinition: 'RCS là chỉ số trong MISO Analysis, đánh giá khả năng phục hồi dựa trên các yếu tố bảo vệ như điểm mạnh tính cách VIA, Conscientiousness cao, và các nguồn lực đối phó.',
        category: 'general',
        relatedTerms: ['MISO', 'BVS']
    },

    // ===== General Psychology =====
    'Tâm lý học tích cực': {
        term: 'Tâm lý học tích cực (Positive Psychology)',
        shortDefinition: 'Ngành tâm lý học tập trung vào hạnh phúc và thịnh vượng',
        fullDefinition: 'Tâm lý học tích cực nghiên cứu những gì giúp con người và cộng đồng thịnh vượng. Thay vì chỉ tập trung vào bệnh lý, lĩnh vực này khám phá điểm mạnh, hạnh phúc và ý nghĩa cuộc sống.',
        category: 'psychology',
        relatedTerms: ['VIA', 'Hạnh phúc', 'Điểm mạnh']
    },
    'Đồng cảm': {
        term: 'Đồng cảm (Empathy)',
        shortDefinition: 'Khả năng hiểu và chia sẻ cảm xúc của người khác',
        fullDefinition: 'Đồng cảm bao gồm 3 thành phần: Nhận thức (hiểu quan điểm người khác), Cảm xúc (cảm nhận cảm xúc họ), và Từ bi (muốn giúp đỡ). Đồng cảm là nền tảng của kết nối xã hội và trí tuệ cảm xúc.',
        category: 'psychology',
        relatedTerms: ['Trí tuệ cảm xúc', 'Agreeableness']
    },
    'Trí tuệ cảm xúc': {
        term: 'Trí tuệ cảm xúc (Emotional Intelligence)',
        shortDefinition: 'Khả năng nhận biết và quản lý cảm xúc',
        fullDefinition: 'Trí tuệ cảm xúc (EQ) là khả năng nhận biết, hiểu và quản lý cảm xúc của bản thân và người khác. EQ bao gồm tự nhận thức, tự điều chỉnh, động lực, đồng cảm và kỹ năng xã hội.',
        category: 'psychology',
        relatedTerms: ['Đồng cảm', 'Chánh niệm']
    }
};

/**
 * Tìm thuật ngữ theo từ khóa (case-insensitive, hỗ trợ tìm theo term hoặc key)
 */
export function findTerm(keyword: string): GlossaryTerm | undefined {
    const lowerKeyword = keyword.toLowerCase();

    // Try exact key match first
    if (glossaryTerms[keyword]) {
        return glossaryTerms[keyword];
    }

    // Try case-insensitive key match
    const keyMatch = Object.keys(glossaryTerms).find(
        key => key.toLowerCase() === lowerKeyword
    );
    if (keyMatch) {
        return glossaryTerms[keyMatch];
    }

    // Try matching by term field
    const termMatch = Object.values(glossaryTerms).find(
        entry => entry.term.toLowerCase().includes(lowerKeyword)
    );

    return termMatch;
}

/**
 * Lấy tất cả thuật ngữ theo category
 */
export function getTermsByCategory(category: GlossaryTerm['category']): GlossaryTerm[] {
    return Object.values(glossaryTerms).filter(term => term.category === category);
}

/**
 * Lấy danh sách tất cả từ khóa để highlight trong text
 */
export function getAllTermKeywords(): string[] {
    return Object.keys(glossaryTerms);
}
