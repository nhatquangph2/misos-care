// MBTI Test Questions (60 questions)
// Based on Myers-Briggs Type Indicator dimensions
// Each dimension has 15 questions scored on 1-5 scale

export interface MBTIQuestion {
  id: string;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  text: string;
  reverse: boolean; // true if higher score means opposite preference
}

export interface MBTIQuestionResponse {
  questionId: string;
  score: number; // 1-5 scale
}

// Response scale
export const MBTI_SCALE = {
  1: 'Hoàn toàn không đồng ý',
  2: 'Không đồng ý',
  3: 'Trung lập',
  4: 'Đồng ý',
  5: 'Hoàn toàn đồng ý',
} as const;

// MBTI Questions Database
export const MBTI_QUESTIONS: MBTIQuestion[] = [
  // ============================================
  // E/I: Extraversion vs Introversion (15 questions)
  // ============================================
  {
    id: 'ei_01',
    dimension: 'EI',
    text: 'Tôi cảm thấy tràn đầy năng lượng khi ở trong nhóm đông người',
    reverse: false, // High score = Extraversion
  },
  {
    id: 'ei_02',
    dimension: 'EI',
    text: 'Tôi thích dành thời gian một mình để suy ngẫm và nạp lại năng lượng',
    reverse: true, // High score = Introversion
  },
  {
    id: 'ei_03',
    dimension: 'EI',
    text: 'Tôi thường là người chủ động bắt chuyện với người lạ',
    reverse: false,
  },
  {
    id: 'ei_04',
    dimension: 'EI',
    text: 'Tôi cảm thấy kiệt sức sau các buổi gặp gỡ xã hội',
    reverse: true,
  },
  {
    id: 'ei_05',
    dimension: 'EI',
    text: 'Tôi thích làm việc trong môi trường nhiều tương tác',
    reverse: false,
  },
  {
    id: 'ei_06',
    dimension: 'EI',
    text: 'Tôi thích suy nghĩ kỹ trước khi nói ra ý kiến',
    reverse: true,
  },
  {
    id: 'ei_07',
    dimension: 'EI',
    text: 'Tôi dễ dàng kết bạn mới trong các sự kiện',
    reverse: false,
  },
  {
    id: 'ei_08',
    dimension: 'EI',
    text: 'Tôi thích các hoạt động yên tĩnh hơn là ồn ào',
    reverse: true,
  },
  {
    id: 'ei_09',
    dimension: 'EI',
    text: 'Tôi thường chia sẻ suy nghĩ của mình ngay khi có ý tưởng',
    reverse: false,
  },
  {
    id: 'ei_10',
    dimension: 'EI',
    text: 'Tôi thích có thời gian riêng tư để tập trung làm việc',
    reverse: true,
  },
  {
    id: 'ei_11',
    dimension: 'EI',
    text: 'Tôi cảm thấy thoải mái khi là trung tâm của sự chú ý',
    reverse: false,
  },
  {
    id: 'ei_12',
    dimension: 'EI',
    text: 'Tôi cần thời gian một mình sau khi giao tiếp nhiều',
    reverse: true,
  },
  {
    id: 'ei_13',
    dimension: 'EI',
    text: 'Tôi thích tham gia các buổi tiệc và sự kiện đông người',
    reverse: false,
  },
  {
    id: 'ei_14',
    dimension: 'EI',
    text: 'Tôi thích làm việc độc lập hơn là trong nhóm',
    reverse: true,
  },
  {
    id: 'ei_15',
    dimension: 'EI',
    text: 'Tôi dễ dàng bày tỏ cảm xúc và suy nghĩ với người khác',
    reverse: false,
  },

  // ============================================
  // S/N: Sensing vs Intuition (15 questions)
  // ============================================
  {
    id: 'sn_01',
    dimension: 'SN',
    text: 'Tôi tập trung vào thực tế và chi tiết cụ thể',
    reverse: false, // High score = Sensing
  },
  {
    id: 'sn_02',
    dimension: 'SN',
    text: 'Tôi thích suy nghĩ về các khả năng và ý tưởng mới',
    reverse: true, // High score = Intuition
  },
  {
    id: 'sn_03',
    dimension: 'SN',
    text: 'Tôi tin vào kinh nghiệm thực tế hơn là lý thuyết trừu tượng',
    reverse: false,
  },
  {
    id: 'sn_04',
    dimension: 'SN',
    text: 'Tôi thích tưởng tượng về tương lai và các viễn cảnh mới',
    reverse: true,
  },
  {
    id: 'sn_05',
    dimension: 'SN',
    text: 'Tôi chú ý đến các chi tiết nhỏ trong công việc',
    reverse: false,
  },
  {
    id: 'sn_06',
    dimension: 'SN',
    text: 'Tôi thích tìm hiểu ý nghĩa sâu xa đằng sau sự việc',
    reverse: true,
  },
  {
    id: 'sn_07',
    dimension: 'SN',
    text: 'Tôi thích làm theo hướng dẫn cụ thể từng bước',
    reverse: false,
  },
  {
    id: 'sn_08',
    dimension: 'SN',
    text: 'Tôi thích khám phá các khái niệm và ý tưởng trừu tượng',
    reverse: true,
  },
  {
    id: 'sn_09',
    dimension: 'SN',
    text: 'Tôi tập trung vào hiện tại hơn là tương lai',
    reverse: false,
  },
  {
    id: 'sn_10',
    dimension: 'SN',
    text: 'Tôi thích suy nghĩ về các mẫu hình và xu hướng tổng quát',
    reverse: true,
  },
  {
    id: 'sn_11',
    dimension: 'SN',
    text: 'Tôi thích các công việc thực tế, có kết quả rõ ràng',
    reverse: false,
  },
  {
    id: 'sn_12',
    dimension: 'SN',
    text: 'Tôi thích suy nghĩ về các khả năng chưa được khám phá',
    reverse: true,
  },
  {
    id: 'sn_13',
    dimension: 'SN',
    text: 'Tôi dựa vào kinh nghiệm quá khứ để đưa ra quyết định',
    reverse: false,
  },
  {
    id: 'sn_14',
    dimension: 'SN',
    text: 'Tôi thích đổi mới và thử nghiệm cách làm mới',
    reverse: true,
  },
  {
    id: 'sn_15',
    dimension: 'SN',
    text: 'Tôi chú ý đến các sự kiện cụ thể hơn là ý nghĩa của chúng',
    reverse: false,
  },

  // ============================================
  // T/F: Thinking vs Feeling (15 questions)
  // ============================================
  {
    id: 'tf_01',
    dimension: 'TF',
    text: 'Tôi đưa ra quyết định dựa trên logic và phân tích',
    reverse: false, // High score = Thinking
  },
  {
    id: 'tf_02',
    dimension: 'TF',
    text: 'Tôi cân nhắc cảm xúc của người khác khi ra quyết định',
    reverse: true, // High score = Feeling
  },
  {
    id: 'tf_03',
    dimension: 'TF',
    text: 'Tôi đánh giá cao sự công bằng và chính xác',
    reverse: false,
  },
  {
    id: 'tf_04',
    dimension: 'TF',
    text: 'Tôi thích tạo sự hài hòa trong nhóm',
    reverse: true,
  },
  {
    id: 'tf_05',
    dimension: 'TF',
    text: 'Tôi thường phê bình trực tiếp khi thấy sai sót',
    reverse: false,
  },
  {
    id: 'tf_06',
    dimension: 'TF',
    text: 'Tôi dễ dàng cảm thông với cảm xúc của người khác',
    reverse: true,
  },
  {
    id: 'tf_07',
    dimension: 'TF',
    text: 'Tôi ưu tiên hiệu quả hơn là mối quan hệ',
    reverse: false,
  },
  {
    id: 'tf_08',
    dimension: 'TF',
    text: 'Tôi đưa ra quyết định dựa trên giá trị cá nhân',
    reverse: true,
  },
  {
    id: 'tf_09',
    dimension: 'TF',
    text: 'Tôi thích tranh luận và đưa ra lập luận logic',
    reverse: false,
  },
  {
    id: 'tf_10',
    dimension: 'TF',
    text: 'Tôi quan tâm đến cảm giác của mọi người',
    reverse: true,
  },
  {
    id: 'tf_11',
    dimension: 'TF',
    text: 'Tôi đánh giá cao sự khách quan trong mọi tình huống',
    reverse: false,
  },
  {
    id: 'tf_12',
    dimension: 'TF',
    text: 'Tôi thích động viên và giúp đỡ người khác',
    reverse: true,
  },
  {
    id: 'tf_13',
    dimension: 'TF',
    text: 'Tôi tập trung vào sự thật hơn là ảnh hưởng đến người khác',
    reverse: false,
  },
  {
    id: 'tf_14',
    dimension: 'TF',
    text: 'Tôi dễ bị tác động bởi cảm xúc của người khác',
    reverse: true,
  },
  {
    id: 'tf_15',
    dimension: 'TF',
    text: 'Tôi thích phân tích và giải quyết vấn đề một cách hệ thống',
    reverse: false,
  },

  // ============================================
  // J/P: Judging vs Perceiving (15 questions)
  // ============================================
  {
    id: 'jp_01',
    dimension: 'JP',
    text: 'Tôi thích lên kế hoạch chi tiết trước khi hành động',
    reverse: false, // High score = Judging
  },
  {
    id: 'jp_02',
    dimension: 'JP',
    text: 'Tôi thích linh hoạt và ứng biến với tình huống',
    reverse: true, // High score = Perceiving
  },
  {
    id: 'jp_03',
    dimension: 'JP',
    text: 'Tôi thích hoàn thành công việc sớm hơn deadline',
    reverse: false,
  },
  {
    id: 'jp_04',
    dimension: 'JP',
    text: 'Tôi thường làm việc tốt nhất dưới áp lực deadline',
    reverse: true,
  },
  {
    id: 'jp_05',
    dimension: 'JP',
    text: 'Tôi thích có lịch trình rõ ràng cho ngày làm việc',
    reverse: false,
  },
  {
    id: 'jp_06',
    dimension: 'JP',
    text: 'Tôi thích giữ các lựa chọn mở để có thể thay đổi',
    reverse: true,
  },
  {
    id: 'jp_07',
    dimension: 'JP',
    text: 'Tôi cảm thấy thoải mái khi mọi thứ được tổ chức ngăn nắp',
    reverse: false,
  },
  {
    id: 'jp_08',
    dimension: 'JP',
    text: 'Tôi không ngại thay đổi kế hoạch đột xuất',
    reverse: true,
  },
  {
    id: 'jp_09',
    dimension: 'JP',
    text: 'Tôi thích đưa ra quyết định nhanh chóng và tiến hành',
    reverse: false,
  },
  {
    id: 'jp_10',
    dimension: 'JP',
    text: 'Tôi thích dành thời gian khám phá trước khi quyết định',
    reverse: true,
  },
  {
    id: 'jp_11',
    dimension: 'JP',
    text: 'Tôi thích có danh sách công việc cụ thể',
    reverse: false,
  },
  {
    id: 'jp_12',
    dimension: 'JP',
    text: 'Tôi thích làm nhiều việc cùng lúc thay vì tuần tự',
    reverse: true,
  },
  {
    id: 'jp_13',
    dimension: 'JP',
    text: 'Tôi cảm thấy khó chịu khi công việc chưa hoàn thành',
    reverse: false,
  },
  {
    id: 'jp_14',
    dimension: 'JP',
    text: 'Tôi thích tự do sáng tạo hơn là tuân theo quy trình',
    reverse: true,
  },
  {
    id: 'jp_15',
    dimension: 'JP',
    text: 'Tôi thích kết thúc dứt điểm hơn là để ngỏ',
    reverse: false,
  },
];

// MBTI Scoring Algorithm
export interface MBTIDimensionScore {
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  score: number; // -15 to +15 (negative = first letter, positive = second letter)
  preference: string; // E or I, S or N, etc.
}

export function calculateMBTI(responses: MBTIQuestionResponse[]): {
  type: string;
  dimensions: MBTIDimensionScore[];
} {
  const dimensionScores: Record<string, number> = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0,
  };

  // Calculate scores for each dimension
  responses.forEach(response => {
    const question = MBTI_QUESTIONS.find(q => q.id === response.questionId);
    if (!question) return;

    const score = response.score; // 1-5
    const normalizedScore = score - 3; // Convert to -2 to +2

    if (question.reverse) {
      // Reverse scored: higher score means first letter (E, S, T, J)
      dimensionScores[question.dimension] -= normalizedScore;
    } else {
      // Normal scored: higher score means first letter
      dimensionScores[question.dimension] -= normalizedScore;
    }
  });

  // Determine preference for each dimension
  const dimensions: MBTIDimensionScore[] = [
    {
      dimension: 'EI',
      score: dimensionScores.EI,
      preference: dimensionScores.EI <= 0 ? 'E' : 'I',
    },
    {
      dimension: 'SN',
      score: dimensionScores.SN,
      preference: dimensionScores.SN <= 0 ? 'S' : 'N',
    },
    {
      dimension: 'TF',
      score: dimensionScores.TF,
      preference: dimensionScores.TF <= 0 ? 'T' : 'F',
    },
    {
      dimension: 'JP',
      score: dimensionScores.JP,
      preference: dimensionScores.JP <= 0 ? 'J' : 'P',
    },
  ];

  const type = dimensions.map(d => d.preference).join('');

  return { type, dimensions };
}

// Export question count
export const MBTI_QUESTION_COUNT = MBTI_QUESTIONS.length; // 60
