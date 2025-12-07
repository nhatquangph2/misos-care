// DASS21 - Depression, Anxiety and Stress Scale (21 questions)
// Standardized mental health assessment tool
// Each subscale has 7 questions scored on 0-3 scale

export interface DASS21Question {
  id: string;
  subscale: 'depression' | 'anxiety' | 'stress';
  text: string;
  questionNumber: number; // 1-21
}

export interface DASS21QuestionResponse {
  questionId: string;
  score: number; // 0-3 scale
}

// Response scale
export const DASS21_SCALE = {
  0: 'Không áp dụng cho tôi',
  1: 'Áp dụng cho tôi ở mức độ nào đó',
  2: 'Áp dụng cho tôi ở mức độ đáng kể',
  3: 'Áp dụng cho tôi rất nhiều',
} as const;

export const DASS21_SUBSCALES = {
  depression: 'Trầm cảm',
  anxiety: 'Lo âu',
  stress: 'Stress',
} as const;

// DASS21 Questions Database
// Note: Questions are presented in mixed order as per original DASS21
export const DASS21_QUESTIONS: DASS21Question[] = [
  // Question 1 - Stress
  {
    id: 'dass21_01',
    subscale: 'stress',
    questionNumber: 1,
    text: 'Tôi thấy khó để thư giãn',
  },
  // Question 2 - Anxiety
  {
    id: 'dass21_02',
    subscale: 'anxiety',
    questionNumber: 2,
    text: 'Tôi nhận thấy khô miệng',
  },
  // Question 3 - Depression
  {
    id: 'dass21_03',
    subscale: 'depression',
    questionNumber: 3,
    text: 'Tôi dường như không thể trải nghiệm bất kỳ cảm xúc tích cực nào',
  },
  // Question 4 - Anxiety
  {
    id: 'dass21_04',
    subscale: 'anxiety',
    questionNumber: 4,
    text: 'Tôi gặp khó khăn trong việc hô hấp (thở nhanh, khó thở dù không gắng sức)',
  },
  // Question 5 - Depression
  {
    id: 'dass21_05',
    subscale: 'depression',
    questionNumber: 5,
    text: 'Tôi thấy khó để bắt đầu làm mọi việc',
  },
  // Question 6 - Stress
  {
    id: 'dass21_06',
    subscale: 'stress',
    questionNumber: 6,
    text: 'Tôi có xu hướng phản ứng thái quá trong các tình huống',
  },
  // Question 7 - Anxiety
  {
    id: 'dass21_07',
    subscale: 'anxiety',
    questionNumber: 7,
    text: 'Tôi bị run (ví dụ: run tay)',
  },
  // Question 8 - Stress
  {
    id: 'dass21_08',
    subscale: 'stress',
    questionNumber: 8,
    text: 'Tôi cảm thấy mình tiêu tốn nhiều năng lượng thần kinh',
  },
  // Question 9 - Anxiety
  {
    id: 'dass21_09',
    subscale: 'anxiety',
    questionNumber: 9,
    text: 'Tôi lo lắng về các tình huống mà mình có thể hoảng sợ và tự làm mình xấu hổ',
  },
  // Question 10 - Depression
  {
    id: 'dass21_10',
    subscale: 'depression',
    questionNumber: 10,
    text: 'Tôi cảm thấy không có gì để mong đợi',
  },
  // Question 11 - Stress
  {
    id: 'dass21_11',
    subscale: 'stress',
    questionNumber: 11,
    text: 'Tôi thấy mình dễ bị kích động',
  },
  // Question 12 - Stress
  {
    id: 'dass21_12',
    subscale: 'stress',
    questionNumber: 12,
    text: 'Tôi thấy khó để thư giãn',
  },
  // Question 13 - Depression
  {
    id: 'dass21_13',
    subscale: 'depression',
    questionNumber: 13,
    text: 'Tôi cảm thấy buồn chán và u ám',
  },
  // Question 14 - Stress
  {
    id: 'dass21_14',
    subscale: 'stress',
    questionNumber: 14,
    text: 'Tôi không chấp nhận được việc bị cản trở',
  },
  // Question 15 - Anxiety
  {
    id: 'dass21_15',
    subscale: 'anxiety',
    questionNumber: 15,
    text: 'Tôi cảm thấy mình gần như hoảng loạn',
  },
  // Question 16 - Depression
  {
    id: 'dass21_16',
    subscale: 'depression',
    questionNumber: 16,
    text: 'Tôi không thể hào hứng với bất cứ điều gì',
  },
  // Question 17 - Depression
  {
    id: 'dass21_17',
    subscale: 'depression',
    questionNumber: 17,
    text: 'Tôi cảm thấy mình không đáng giá làm người',
  },
  // Question 18 - Stress
  {
    id: 'dass21_18',
    subscale: 'stress',
    questionNumber: 18,
    text: 'Tôi cảm thấy mình khá nhạy cảm',
  },
  // Question 19 - Anxiety
  {
    id: 'dass21_19',
    subscale: 'anxiety',
    questionNumber: 19,
    text: 'Tôi nhận thấy tim mình đập mạnh mà không gắng sức (như tim đập nhanh, nhịp tim không đều)',
  },
  // Question 20 - Anxiety
  {
    id: 'dass21_20',
    subscale: 'anxiety',
    questionNumber: 20,
    text: 'Tôi cảm thấy sợ hãi mà không có lý do rõ ràng',
  },
  // Question 21 - Depression
  {
    id: 'dass21_21',
    subscale: 'depression',
    questionNumber: 21,
    text: 'Tôi cảm thấy cuộc sống không có ý nghĩa',
  },
];

// Severity thresholds (multiplied by 2 for DASS21 to match DASS42 scale)
export interface SeverityLevel {
  level: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely-severe';
  label: string;
  color: string;
}

export const DEPRESSION_SEVERITY: Record<string, SeverityLevel> = {
  normal: { level: 'normal', label: 'Bình thường', color: '#10b981' },
  mild: { level: 'mild', label: 'Nhẹ', color: '#84cc16' },
  moderate: { level: 'moderate', label: 'Trung bình', color: '#f59e0b' },
  severe: { level: 'severe', label: 'Nặng', color: '#ef4444' },
  'extremely-severe': { level: 'extremely-severe', label: 'Rất nặng', color: '#dc2626' },
};

export const ANXIETY_SEVERITY: Record<string, SeverityLevel> = {
  normal: { level: 'normal', label: 'Bình thường', color: '#10b981' },
  mild: { level: 'mild', label: 'Nhẹ', color: '#84cc16' },
  moderate: { level: 'moderate', label: 'Trung bình', color: '#f59e0b' },
  severe: { level: 'severe', label: 'Nặng', color: '#ef4444' },
  'extremely-severe': { level: 'extremely-severe', label: 'Rất nặng', color: '#dc2626' },
};

export const STRESS_SEVERITY: Record<string, SeverityLevel> = {
  normal: { level: 'normal', label: 'Bình thường', color: '#10b981' },
  mild: { level: 'mild', label: 'Nhẹ', color: '#84cc16' },
  moderate: { level: 'moderate', label: 'Trung bình', color: '#f59e0b' },
  severe: { level: 'severe', label: 'Nặng', color: '#ef4444' },
  'extremely-severe': { level: 'extremely-severe', label: 'Rất nặng', color: '#dc2626' },
};

// DASS21 Scoring Algorithm
export interface DASS21SubscaleScore {
  subscale: 'depression' | 'anxiety' | 'stress';
  subscaleName: string;
  rawScore: number; // 0-21 (sum of 7 questions)
  normalizedScore: number; // Multiplied by 2 to match DASS42
  severity: SeverityLevel;
}

export function getSeverityLevel(
  subscale: 'depression' | 'anxiety' | 'stress',
  normalizedScore: number
): SeverityLevel {
  if (subscale === 'depression') {
    if (normalizedScore < 10) return DEPRESSION_SEVERITY.normal;
    if (normalizedScore < 14) return DEPRESSION_SEVERITY.mild;
    if (normalizedScore < 21) return DEPRESSION_SEVERITY.moderate;
    if (normalizedScore < 28) return DEPRESSION_SEVERITY.severe;
    return DEPRESSION_SEVERITY['extremely-severe'];
  }

  if (subscale === 'anxiety') {
    if (normalizedScore < 8) return ANXIETY_SEVERITY.normal;
    if (normalizedScore < 10) return ANXIETY_SEVERITY.mild;
    if (normalizedScore < 15) return ANXIETY_SEVERITY.moderate;
    if (normalizedScore < 20) return ANXIETY_SEVERITY.severe;
    return ANXIETY_SEVERITY['extremely-severe'];
  }

  // stress
  if (normalizedScore < 15) return STRESS_SEVERITY.normal;
  if (normalizedScore < 19) return STRESS_SEVERITY.mild;
  if (normalizedScore < 26) return STRESS_SEVERITY.moderate;
  if (normalizedScore < 34) return STRESS_SEVERITY.severe;
  return STRESS_SEVERITY['extremely-severe'];
}

export function calculateDASS21(responses: DASS21QuestionResponse[]): {
  subscaleScores: DASS21SubscaleScore[];
  overallAssessment: string;
  needsCrisisIntervention: boolean;
} {
  const subscaleScores: Record<string, number> = {
    depression: 0,
    anxiety: 0,
    stress: 0,
  };

  // Calculate raw scores for each subscale
  responses.forEach(response => {
    const question = DASS21_QUESTIONS.find(q => q.id === response.questionId);
    if (!question) return;

    subscaleScores[question.subscale] += response.score; // 0-3 per question
  });

  // Create subscale score objects with severity
  const results: DASS21SubscaleScore[] = Object.entries(subscaleScores).map(
    ([subscale, rawScore]) => {
      const normalizedScore = rawScore * 2; // Multiply by 2 to match DASS42 scale
      const severity = getSeverityLevel(
        subscale as 'depression' | 'anxiety' | 'stress',
        normalizedScore
      );

      return {
        subscale: subscale as 'depression' | 'anxiety' | 'stress',
        subscaleName: DASS21_SUBSCALES[subscale as keyof typeof DASS21_SUBSCALES],
        rawScore,
        normalizedScore,
        severity,
      };
    }
  );

  // Determine overall assessment
  const hasSevere = results.some(
    r => r.severity.level === 'severe' || r.severity.level === 'extremely-severe'
  );
  const hasModerate = results.some(r => r.severity.level === 'moderate');

  let overallAssessment = '';
  let needsCrisisIntervention = false;

  if (hasSevere) {
    overallAssessment =
      'Kết quả cho thấy bạn đang trải qua mức độ căng thẳng cao. Chúng tôi khuyến nghị bạn tìm kiếm sự hỗ trợ từ chuyên gia sức khỏe tâm thần.';
    needsCrisisIntervention = true;
  } else if (hasModerate) {
    overallAssessment =
      'Kết quả cho thấy bạn đang có dấu hiệu căng thẳng ở mức trung bình. Hãy chú ý chăm sóc sức khỏe tinh thần của bạn.';
  } else {
    overallAssessment =
      'Kết quả cho thấy tình trạng sức khỏe tinh thần của bạn đang ở mức bình thường. Hãy duy trì lối sống lành mạnh.';
  }

  // Check for critical depression score (suicidal risk)
  const depressionScore = results.find(r => r.subscale === 'depression');
  if (depressionScore && depressionScore.normalizedScore >= 28) {
    needsCrisisIntervention = true;
  }

  return {
    subscaleScores: results,
    overallAssessment,
    needsCrisisIntervention,
  };
}

// Crisis resources
export const CRISIS_RESOURCES = {
  vietnam: {
    hotline: '1800 599 104',
    hotlineName: 'Tổng đài tư vấn sức khỏe tâm thần',
    emergency: '113',
    emergencyName: 'Cấp cứu khẩn cấp',
  },
};

// Export question count
export const DASS21_QUESTION_COUNT = DASS21_QUESTIONS.length; // 21

// QuestionFlow compatible format
export interface DASS21QuestionFlow {
  id: number
  question: string
  options: {
    value: number
    label: string
    description: string
  }[]
}

// Convert DASS21 questions to QuestionFlow format
export const DASS21_QUESTIONS_FLOW: DASS21QuestionFlow[] = DASS21_QUESTIONS.map((q) => ({
  id: q.questionNumber,
  question: q.text,
  options: [
    { value: 0, label: 'Không áp dụng cho tôi', description: 'Không xảy ra' },
    { value: 1, label: 'Áp dụng cho tôi ở mức độ nào đó', description: 'Thỉnh thoảng' },
    { value: 2, label: 'Áp dụng cho tôi ở mức độ đáng kể', description: 'Khá thường xuyên' },
    { value: 3, label: 'Áp dụng cho tôi rất nhiều', description: 'Hầu như luôn luôn' },
  ],
}))
