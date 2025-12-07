// Big Five Personality Test Questions (44 questions)
// Based on OCEAN model (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)
// Each trait has 8-9 questions scored on 1-5 scale

export interface Big5Question {
  id: string;
  trait: 'O' | 'C' | 'E' | 'A' | 'N';
  text: string;
  reverse: boolean; // true if higher score means lower trait
}

export interface Big5QuestionResponse {
  questionId: string;
  score: number; // 1-5 scale
}

// Response scale
export const BIG5_SCALE = {
  1: 'Hoàn toàn không đồng ý',
  2: 'Không đồng ý',
  3: 'Trung lập',
  4: 'Đồng ý',
  5: 'Hoàn toàn đồng ý',
} as const;

export const BIG5_TRAITS = {
  O: 'Openness (Cởi mở với trải nghiệm)',
  C: 'Conscientiousness (Tận tâm)',
  E: 'Extraversion (Hướng ngoại)',
  A: 'Agreeableness (Dễ chịu)',
  N: 'Neuroticism (Bất ổn cảm xúc)',
} as const;

// Big Five Questions Database
export const BIG5_QUESTIONS: Big5Question[] = [
  // ============================================
  // Openness (9 questions)
  // ============================================
  {
    id: 'o_01',
    trait: 'O',
    text: 'Tôi có trí tưởng tượng phong phú',
    reverse: false,
  },
  {
    id: 'o_02',
    trait: 'O',
    text: 'Tôi thích thử những điều mới và khác biệt',
    reverse: false,
  },
  {
    id: 'o_03',
    trait: 'O',
    text: 'Tôi thích các cuộc trò chuyện trí tuệ',
    reverse: false,
  },
  {
    id: 'o_04',
    trait: 'O',
    text: 'Tôi thích nghệ thuật và văn hóa',
    reverse: false,
  },
  {
    id: 'o_05',
    trait: 'O',
    text: 'Tôi thích làm theo cách truyền thống hơn là thử nghiệm',
    reverse: true,
  },
  {
    id: 'o_06',
    trait: 'O',
    text: 'Tôi tò mò về nhiều lĩnh vực khác nhau',
    reverse: false,
  },
  {
    id: 'o_07',
    trait: 'O',
    text: 'Tôi thích suy nghĩ về các ý tưởng trừu tượng',
    reverse: false,
  },
  {
    id: 'o_08',
    trait: 'O',
    text: 'Tôi không quan tâm nhiều đến nghệ thuật',
    reverse: true,
  },
  {
    id: 'o_09',
    trait: 'O',
    text: 'Tôi thích khám phá và tìm hiểu những điều mới',
    reverse: false,
  },

  // ============================================
  // Conscientiousness (9 questions)
  // ============================================
  {
    id: 'c_01',
    trait: 'C',
    text: 'Tôi luôn chuẩn bị kỹ lưỡng cho mọi việc',
    reverse: false,
  },
  {
    id: 'c_02',
    trait: 'C',
    text: 'Tôi chú ý đến chi tiết trong công việc',
    reverse: false,
  },
  {
    id: 'c_03',
    trait: 'C',
    text: 'Tôi hoàn thành công việc ngay lập tức',
    reverse: false,
  },
  {
    id: 'c_04',
    trait: 'C',
    text: 'Tôi thường để mọi thứ lộn xộn',
    reverse: true,
  },
  {
    id: 'c_05',
    trait: 'C',
    text: 'Tôi làm việc một cách có kế hoạch và có tổ chức',
    reverse: false,
  },
  {
    id: 'c_06',
    trait: 'C',
    text: 'Tôi thường trì hoãn công việc',
    reverse: true,
  },
  {
    id: 'c_07',
    trait: 'C',
    text: 'Tôi làm việc chăm chỉ và nỗ lực hết mình',
    reverse: false,
  },
  {
    id: 'c_08',
    trait: 'C',
    text: 'Tôi thường quên đặt lại đồ đạc về đúng vị trí',
    reverse: true,
  },
  {
    id: 'c_09',
    trait: 'C',
    text: 'Tôi là người đáng tin cậy và có trách nhiệm',
    reverse: false,
  },

  // ============================================
  // Extraversion (9 questions)
  // ============================================
  {
    id: 'e_01',
    trait: 'E',
    text: 'Tôi là tâm điểm của bữa tiệc',
    reverse: false,
  },
  {
    id: 'e_02',
    trait: 'E',
    text: 'Tôi cảm thấy thoải mái khi ở quanh nhiều người',
    reverse: false,
  },
  {
    id: 'e_03',
    trait: 'E',
    text: 'Tôi thích bắt chuyện với người lạ',
    reverse: false,
  },
  {
    id: 'e_04',
    trait: 'E',
    text: 'Tôi thường im lặng khi ở trong nhóm',
    reverse: true,
  },
  {
    id: 'e_05',
    trait: 'E',
    text: 'Tôi tràn đầy năng lượng và nhiệt huyết',
    reverse: false,
  },
  {
    id: 'e_06',
    trait: 'E',
    text: 'Tôi thích dành thời gian một mình',
    reverse: true,
  },
  {
    id: 'e_07',
    trait: 'E',
    text: 'Tôi thích tham gia vào các hoạt động nhóm',
    reverse: false,
  },
  {
    id: 'e_08',
    trait: 'E',
    text: 'Tôi ít nói trong các cuộc họp',
    reverse: true,
  },
  {
    id: 'e_09',
    trait: 'E',
    text: 'Tôi dễ dàng kết bạn mới',
    reverse: false,
  },

  // ============================================
  // Agreeableness (9 questions)
  // ============================================
  {
    id: 'a_01',
    trait: 'A',
    text: 'Tôi quan tâm và đồng cảm với người khác',
    reverse: false,
  },
  {
    id: 'a_02',
    trait: 'A',
    text: 'Tôi tôn trọng cảm xúc của người khác',
    reverse: false,
  },
  {
    id: 'a_03',
    trait: 'A',
    text: 'Tôi sẵn sàng giúp đỡ người khác',
    reverse: false,
  },
  {
    id: 'a_04',
    trait: 'A',
    text: 'Tôi thường chỉ trích người khác',
    reverse: true,
  },
  {
    id: 'a_05',
    trait: 'A',
    text: 'Tôi tin tưởng vào sự tốt bụng của con người',
    reverse: false,
  },
  {
    id: 'a_06',
    trait: 'A',
    text: 'Tôi thường không quan tâm đến vấn đề của người khác',
    reverse: true,
  },
  {
    id: 'a_07',
    trait: 'A',
    text: 'Tôi tạo cảm giác thoải mái cho người xung quanh',
    reverse: false,
  },
  {
    id: 'a_08',
    trait: 'A',
    text: 'Tôi hay cãi vã và tranh luận',
    reverse: true,
  },
  {
    id: 'a_09',
    trait: 'A',
    text: 'Tôi luôn cố gắng hiểu quan điểm của người khác',
    reverse: false,
  },

  // ============================================
  // Neuroticism (8 questions)
  // ============================================
  {
    id: 'n_01',
    trait: 'N',
    text: 'Tôi dễ bị căng thẳng và lo lắng',
    reverse: false,
  },
  {
    id: 'n_02',
    trait: 'N',
    text: 'Tôi thường cảm thấy buồn bã',
    reverse: false,
  },
  {
    id: 'n_03',
    trait: 'N',
    text: 'Tôi dễ cáu giận và bực bội',
    reverse: false,
  },
  {
    id: 'n_04',
    trait: 'N',
    text: 'Tôi thường bình tĩnh trong mọi tình huống',
    reverse: true,
  },
  {
    id: 'n_05',
    trait: 'N',
    text: 'Tôi dễ bị tổn thương về mặt cảm xúc',
    reverse: false,
  },
  {
    id: 'n_06',
    trait: 'N',
    text: 'Tôi hiếm khi cảm thấy lo lắng',
    reverse: true,
  },
  {
    id: 'n_07',
    trait: 'N',
    text: 'Tôi thường có tâm trạng thất thường',
    reverse: false,
  },
  {
    id: 'n_08',
    trait: 'N',
    text: 'Tôi kiểm soát cảm xúc tốt',
    reverse: true,
  },
];

// Big5 Scoring Algorithm
export interface Big5TraitScore {
  trait: 'O' | 'C' | 'E' | 'A' | 'N';
  traitName: string;
  score: number; // 0-100 (percentage)
  rawScore: number; // Sum of responses
  maxScore: number; // Maximum possible score
}

export function calculateBig5(responses: Big5QuestionResponse[]): Big5TraitScore[] {
  const traitScores: Record<string, { sum: number; count: number }> = {
    O: { sum: 0, count: 0 },
    C: { sum: 0, count: 0 },
    E: { sum: 0, count: 0 },
    A: { sum: 0, count: 0 },
    N: { sum: 0, count: 0 },
  };

  // Calculate raw scores for each trait
  responses.forEach(response => {
    const question = BIG5_QUESTIONS.find(q => q.id === response.questionId);
    if (!question) return;

    let score = response.score; // 1-5

    // Reverse scoring if needed
    if (question.reverse) {
      score = 6 - score; // 5->1, 4->2, 3->3, 2->4, 1->5
    }

    traitScores[question.trait].sum += score;
    traitScores[question.trait].count += 1;
  });

  // Convert to trait scores with percentages
  const results: Big5TraitScore[] = Object.entries(traitScores).map(
    ([trait, { sum, count }]) => {
      const maxScore = count * 5; // Maximum possible score
      const percentage = (sum / maxScore) * 100;

      return {
        trait: trait as 'O' | 'C' | 'E' | 'A' | 'N',
        traitName: BIG5_TRAITS[trait as keyof typeof BIG5_TRAITS],
        score: Math.round(percentage),
        rawScore: sum,
        maxScore,
      };
    }
  );

  return results;
}

// Interpretation helpers
export function getBig5Interpretation(trait: 'O' | 'C' | 'E' | 'A' | 'N', score: number): string {
  const interpretations: Record<string, { high: string; low: string }> = {
    O: {
      high: 'Bạn cởi mở với trải nghiệm mới, giàu trí tưởng tượng và tò mò.',
      low: 'Bạn thích sự ổn định, thực tế và các cách làm truyền thống.',
    },
    C: {
      high: 'Bạn có tổ chức, đáng tin cậy và làm việc có kế hoạch.',
      low: 'Bạn linh hoạt, tự phát và không thích bị ràng buộc.',
    },
    E: {
      high: 'Bạn năng động, hướng ngoại và thích giao lưu xã hội.',
      low: 'Bạn trầm tĩnh, thích không gian riêng tư và suy ngẫm nội tâm.',
    },
    A: {
      high: 'Bạn thân thiện, đồng cảm và quan tâm đến người khác.',
      low: 'Bạn độc lập, khách quan và ưu tiên logic.',
    },
    N: {
      high: 'Bạn nhạy cảm với cảm xúc và dễ bị ảnh hưởng bởi stress.',
      low: 'Bạn bình tĩnh, ổn định về mặt cảm xúc và ít lo lắng.',
    },
  };

  return score >= 50 ? interpretations[trait].high : interpretations[trait].low;
}

// Export question count
export const BIG5_QUESTION_COUNT = BIG5_QUESTIONS.length; // 44

// QuestionFlow compatible format
export interface Big5QuestionFlow {
  id: number
  question: string
  options: {
    value: number
    label: string
    description?: string
  }[]
}

// Convert Big5 questions to QuestionFlow format
export const BIG5_QUESTIONS_FLOW: Big5QuestionFlow[] = BIG5_QUESTIONS.map((q, index) => ({
  id: index + 1,
  question: q.text,
  options: [
    { value: 1, label: 'Hoàn toàn không đồng ý' },
    { value: 2, label: 'Không đồng ý' },
    { value: 3, label: 'Trung lập' },
    { value: 4, label: 'Đồng ý' },
    { value: 5, label: 'Hoàn toàn đồng ý' },
  ],
}))
