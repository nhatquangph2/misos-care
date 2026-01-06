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
    'INFJ': {
        term: 'INFJ - Người che chở',
        shortDefinition: 'Hướng nội, Trực giác, Cảm xúc, Nguyên tắc',
        fullDefinition: 'INFJ là một trong những loại tính cách hiếm nhất (<2% dân số). Họ thường sâu sắc, có tầm nhìn lý tưởng, đồng cảm mạnh mẽ và luôn tìm kiếm ý nghĩa sâu xa. INFJs thường là những người tư vấn, nhà văn, hoặc lãnh đạo có tầm nhìn.',
        category: 'psychology',
        relatedTerms: ['MBTI', 'Hướng nội', 'Trực giác']
    },
    'ENFP': {
        term: 'ENFP - Người truyền cảm hứng',
        shortDefinition: 'Hướng ngoại, Trực giác, Cảm xúc, Linh hoạt',
        fullDefinition: 'ENFP là những người nhiệt tình, sáng tạo và hay quan tâm đến người khác. Họ thích khám phá ý tưởng mới và tìm kiếm khả năng tiềm ẩn ở mọi người. ENFPs thường là những người động viên và truyền cảm hứng xuất sắc.',
        category: 'psychology',
        relatedTerms: ['MBTI', 'Hướng ngoại', 'Trực giác']
    },
    'INTJ': {
        term: 'INTJ - Nhà chiến lược',
        shortDefinition: 'Hướng nội, Trực giác, Lý trí, Nguyên tắc',
        fullDefinition: 'INTJ là những người có tư duy chiến lược, độc lập và quyết đoán. Họ thường có tầm nhìn dài hạn và khả năng lập kế hoạch xuất sắc. INTJs đánh giá cao năng lực và hiệu quả.',
        category: 'psychology',
        relatedTerms: ['MBTI', 'Hướng nội', 'Lý trí']
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
    'Trực giác': {
        term: 'Trực giác (Intuition)',
        shortDefinition: 'Tập trung vào ý tưởng, khả năng và tương lai',
        fullDefinition: 'Người có xu hướng trực giác thích nghĩ về các khả năng và ý nghĩa tiềm ẩn hơn là thực tế cụ thể. Họ nhìn bức tranh tổng thể và thường sáng tạo, có tầm nhìn xa.',
        category: 'psychology',
        relatedTerms: ['MBTI', 'Giác quan']
    },
    'Giác quan': {
        term: 'Giác quan (Sensing)',
        shortDefinition: 'Tập trung vào thực tế, chi tiết và hiện tại',
        fullDefinition: 'Người có xu hướng giác quan chú ý đến thông tin cụ thể từ 5 giác quan. Họ thực tế, tập trung vào hiện tại và tin vào kinh nghiệm trực tiếp.',
        category: 'psychology',
        relatedTerms: ['MBTI', 'Trực giác']
    },

    // ===== Big Five =====
    'Big Five': {
        term: 'Big Five',
        shortDefinition: 'Mô hình 5 đặc điểm tính cách phổ quát',
        fullDefinition: 'Big Five (OCEAN) là mô hình khoa học được chấp nhận rộng rãi nhất về tính cách, gồm 5 yếu tố: Cởi mở (Openness), Tận tâm (Conscientiousness), Hướng ngoại (Extraversion), Dễ chịu (Agreeableness), và Nhạy cảm (Neuroticism).',
        category: 'test',
        relatedTerms: ['MBTI', 'Openness', 'Conscientiousness']
    },
    'OCEAN': {
        term: 'OCEAN',
        shortDefinition: 'Viết tắt của 5 yếu tố Big Five: O-C-E-A-N',
        fullDefinition: 'OCEAN là cách viết tắt nhớ 5 yếu tố Big Five: Openness (Cởi mở), Conscientiousness (Tận tâm), Extraversion (Hướng ngoại), Agreeableness (Dễ chịu), Neuroticism (Nhạy cảm).',
        category: 'test',
        relatedTerms: ['Big Five']
    },
    'BFI-2': {
        term: 'BFI-2',
        shortDefinition: 'Phiên bản mới của thang đo Big Five',
        fullDefinition: 'Big Five Inventory-2 (BFI-2) là bản cập nhật của thang đo Big Five, với 60 câu hỏi đo lường 5 domain chính và 15 facet (khía cạnh nhỏ). Đây là công cụ được sử dụng phổ biến trong nghiên cứu tâm lý học.',
        category: 'test',
        relatedTerms: ['Big Five', 'OCEAN']
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
    'Extraversion': {
        term: 'Hướng ngoại (Extraversion)',
        shortDefinition: 'Mức độ năng động và xã hội trong Big Five',
        fullDefinition: 'Trong mô hình Big Five, Extraversion đo lường mức độ tích cực, năng động, và thích giao tiếp xã hội của một người. Bao gồm các facet như: Xã hội, Tích cực, Năng lượng.',
        category: 'psychology',
        relatedTerms: ['Big Five', 'Hướng ngoại']
    },

    // ===== Mental Health - DASS-21 =====
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
    'Burnout': {
        term: 'Kiệt sức (Burnout)',
        shortDefinition: 'Tình trạng cạn kiệt do stress công việc kéo dài',
        fullDefinition: 'Burnout là hội chứng do stress công việc mãn tính không được quản lý hiệu quả. Biểu hiện qua 3 chiều: cạn kiệt năng lượng, xa cách/tiêu cực với công việc, và giảm hiệu suất. Được WHO công nhận là hiện tượng nghề nghiệp.',
        category: 'mental_health',
        relatedTerms: ['Stress', 'Sức khỏe tâm thần']
    },
    'Sức khỏe tâm thần': {
        term: 'Sức khỏe tâm thần',
        shortDefinition: 'Trạng thái khỏe mạnh về tâm lý và cảm xúc',
        fullDefinition: 'Sức khỏe tâm thần không chỉ là việc không có rối loạn tâm thần, mà còn là trạng thái khỏe mạnh giúp một người nhận ra tiềm năng, đối phó với stress, làm việc hiệu quả và đóng góp cho cộng đồng.',
        category: 'mental_health',
        relatedTerms: ['DASS-21', 'Trầm cảm', 'Lo âu']
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
    'Sáng tạo': {
        term: 'Sáng tạo (Creativity)',
        shortDefinition: 'Điểm mạnh VIA - nghĩ ra cách mới để làm mọi việc',
        fullDefinition: 'Sáng tạo là khả năng tạo ra ý tưởng mới và hữu ích. Trong VIA, người có điểm mạnh này thích tìm cách làm mới mẻ, không hài lòng với cách làm thông thường.',
        category: 'psychology',
        relatedTerms: ['VIA', 'Openness']
    },
    'Tò mò': {
        term: 'Tò mò (Curiosity)',
        shortDefinition: 'Điểm mạnh VIA - ham khám phá và học hỏi',
        fullDefinition: 'Tò mò là sự quan tâm và hứng thú với mọi thứ xung quanh. Người có điểm mạnh này thích đặt câu hỏi, khám phá, và tìm hiểu về thế giới.',
        category: 'psychology',
        relatedTerms: ['VIA', 'Yêu học hỏi']
    },
    'Lòng dũng cảm': {
        term: 'Lòng dũng cảm (Bravery)',
        shortDefinition: 'Điểm mạnh VIA - hành động dù đối mặt nguy hiểm hay khó khăn',
        fullDefinition: 'Lòng dũng cảm là khả năng hành động mặc dù sợ hãi, không chùn bước trước thử thách, phản đối hoặc đau khổ. Bao gồm cả dũng cảm thể chất, đạo đức và tâm lý.',
        category: 'psychology',
        relatedTerms: ['VIA', 'Kiên trì']
    },
    'Kiên trì': {
        term: 'Kiên trì (Perseverance)',
        shortDefinition: 'Điểm mạnh VIA - hoàn thành những gì đã bắt đầu',
        fullDefinition: 'Kiên trì là khả năng tiếp tục nỗ lực dù gặp trở ngại, thất vọng hay chán nản. Người kiên trì có thể duy trì động lực và cam kết lâu dài.',
        category: 'psychology',
        relatedTerms: ['VIA', 'Lòng dũng cảm', 'Conscientiousness']
    },
    'Lòng biết ơn': {
        term: 'Lòng biết ơn (Gratitude)',
        shortDefinition: 'Điểm mạnh VIA - nhận thức và trân trọng điều tốt đẹp',
        fullDefinition: 'Lòng biết ơn là khả năng nhận ra và trân trọng những điều tốt đẹp trong cuộc sống. Nghiên cứu cho thấy thực hành biết ơn tăng cường hạnh phúc và sức khỏe tâm thần.',
        category: 'psychology',
        relatedTerms: ['VIA', 'Tâm lý học tích cực']
    },
    'Hy vọng': {
        term: 'Hy vọng (Hope)',
        shortDefinition: 'Điểm mạnh VIA - kỳ vọng tương lai tốt đẹp và hành động hướng tới nó',
        fullDefinition: 'Hy vọng là niềm tin rằng tương lai sẽ tốt đẹp, kết hợp với động lực để đạt được mục tiêu. Khác với lạc quan thụ động, hy vọng bao gồm cả hành động.',
        category: 'psychology',
        relatedTerms: ['VIA', 'Lạc quan']
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
    'Thiền': {
        term: 'Thiền (Meditation)',
        shortDefinition: 'Thực hành tập trung tâm trí để đạt trạng thái tĩnh lặng',
        fullDefinition: 'Thiền là các kỹ thuật tập trung tâm trí, bao gồm thiền chánh niệm, thiền thở, thiền quán tưởng. Thiền định giúp giảm stress, cải thiện tập trung và tăng cường sức khỏe tinh thần.',
        category: 'technique',
        relatedTerms: ['Chánh niệm', 'Stress']
    },
    'Giá trị': {
        term: 'Giá trị cá nhân (Values)',
        shortDefinition: 'Những gì quan trọng nhất và định hướng cuộc sống của bạn',
        fullDefinition: 'Giá trị là những nguyên tắc hoặc tiêu chuẩn quan trọng định hướng cuộc sống. Trong ACT, sống theo giá trị giúp tạo ý nghĩa và hạnh phúc lâu dài, khác với mục tiêu cụ thể.',
        category: 'psychology',
        relatedTerms: ['ACT', 'Ý nghĩa cuộc sống']
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
    },
    'Tự nhận thức': {
        term: 'Tự nhận thức (Self-awareness)',
        shortDefinition: 'Khả năng hiểu rõ bản thân, cảm xúc và hành vi',
        fullDefinition: 'Tự nhận thức là nền tảng của trí tuệ cảm xúc, cho phép bạn hiểu rõ điểm mạnh, điểm yếu, giá trị và cách bạn tác động đến người khác. Là bước đầu tiên để phát triển bản thân.',
        category: 'psychology',
        relatedTerms: ['Trí tuệ cảm xúc', 'Phát triển bản thân']
    },
    'Phát triển bản thân': {
        term: 'Phát triển bản thân (Personal Development)',
        shortDefinition: 'Quá trình cải thiện kỹ năng, kiến thức và nhận thức',
        fullDefinition: 'Phát triển bản thân là quá trình liên tục học hỏi, phát triển kỹ năng mới, và nâng cao nhận thức về bản thân. Bao gồm cả phát triển nghề nghiệp, cá nhân và tâm linh.',
        category: 'general',
        relatedTerms: ['Tự nhận thức', 'Tâm lý học tích cực']
    },

    // ===== Resilience & Coping =====
    'Khả năng phục hồi': {
        term: 'Khả năng phục hồi (Resilience)',
        shortDefinition: 'Khả năng vượt qua khó khăn và hồi phục',
        fullDefinition: 'Khả năng phục hồi là năng lực thích ứng tốt khi đối mặt với nghịch cảnh, chấn thương, bi kịch, hoặc nguồn stress đáng kể. Đây không phải đặc điểm bẩm sinh mà có thể phát triển.',
        category: 'psychology',
        relatedTerms: ['RCS', 'Stress', 'Đối phó']
    },
    'Đối phó': {
        term: 'Chiến lược đối phó (Coping)',
        shortDefinition: 'Cách thức xử lý stress và khó khăn',
        fullDefinition: 'Đối phó là các chiến lược tâm lý và hành vi để quản lý stress. Có 2 loại chính: Đối phó tập trung vào vấn đề (giải quyết nguyên nhân) và Đối phó tập trung vào cảm xúc (quản lý phản ứng).',
        category: 'psychology',
        relatedTerms: ['Stress', 'Khả năng phục hồi']
    },

    // ===== Career & Learning Insights =====
    'Định hướng nghề nghiệp': {
        term: 'Định hướng nghề nghiệp',
        shortDefinition: 'Phân tích tính cách để gợi ý lĩnh vực phù hợp',
        fullDefinition: 'Định hướng nghề nghiệp dựa trên tính cách giúp xác định các lĩnh vực công việc phù hợp với điểm mạnh và sở thích tự nhiên của bạn, dựa trên kết quả MBTI, Big Five và VIA.',
        category: 'general',
        relatedTerms: ['MBTI', 'Big Five', 'VIA']
    },
    'Phong cách học tập': {
        term: 'Phong cách học tập',
        shortDefinition: 'Cách thức tiếp thu và xử lý thông tin ưu thế',
        fullDefinition: 'Phong cách học tập mô tả cách bạn tiếp thu thông tin hiệu quả nhất. Có nhiều mô hình, bao gồm VARK (Thị giác, Thính giác, Đọc/Viết, Vận động) và liên hệ với MBTI.',
        category: 'general',
        relatedTerms: ['MBTI', 'Trực giác', 'Giác quan']
    },

    // ===== Gamification =====
    'Streak': {
        term: 'Chuỗi ngày (Streak)',
        shortDefinition: 'Số ngày liên tiếp hoàn thành hoạt động',
        fullDefinition: 'Streak là số ngày liên tiếp bạn thực hiện một hoạt động (như check-in hàng ngày). Duy trì streak giúp xây dựng thói quen và tăng động lực thông qua hiệu ứng cam kết.',
        category: 'general',
        relatedTerms: ['Gamification']
    },
    'Gamification': {
        term: 'Trò chơi hóa (Gamification)',
        shortDefinition: 'Áp dụng yếu tố game vào hoạt động phi game',
        fullDefinition: 'Gamification sử dụng các yếu tố trò chơi (điểm, huy hiệu, cấp độ, thử thách) để tăng động lực và gắn kết trong các hoạt động như học tập, sức khỏe, công việc.',
        category: 'general',
        relatedTerms: ['Streak', 'Vườn Cảm Xúc']
    },
    'Vườn Cảm Xúc': {
        term: 'Vườn Cảm Xúc (Sanctuary)',
        shortDefinition: 'Hệ thống gamification của MisosCare',
        fullDefinition: 'Vườn Cảm Xúc là tính năng gamification trong MisosCare, nơi bạn nuôi dưỡng một khu vườn ảo thông qua việc chăm sóc sức khỏe tinh thần hàng ngày. Hoàn thành hoạt động để mở khóa vật phẩm và phát triển vườn.',
        category: 'general',
        relatedTerms: ['Gamification', 'Streak']
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
