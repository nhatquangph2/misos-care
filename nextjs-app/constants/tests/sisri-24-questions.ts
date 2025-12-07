/**
 * SISRI-24 Test Questions - Official Version
 * The Spiritual Intelligence Self-Report Inventory © 2008 David King
 *
 * Bảng Tự Đánh Giá Trí Tuệ Tâm Linh
 * Vietnamese translation and cultural adaptation
 *
 * 24 questions assessing 4 dimensions of spiritual intelligence:
 * - CET: Critical Existential Thinking (7 questions)
 * - PMP: Personal Meaning Production (5 questions)
 * - TA: Transcendental Awareness (7 questions)
 * - CSE: Conscious State Expansion (5 questions)
 */

export interface SISRI24Question {
  id: number
  question: string
  questionEn: string // Original English version
  dimension: 'CET' | 'PMP' | 'TA' | 'CSE'
  isReversed?: boolean // For question 6 only
  options: {
    value: number
    label: string
  }[]
}

// Standard 0-4 scale options (Official SISRI-24 scale)
const STANDARD_OPTIONS = [
  { value: 0, label: 'Hoàn toàn không đúng với tôi' },
  { value: 1, label: 'Không đúng lắm với tôi' },
  { value: 2, label: 'Đúng một phần với tôi' },
  { value: 3, label: 'Rất đúng với tôi' },
  { value: 4, label: 'Hoàn toàn đúng với tôi' },
]

export const SISRI_24_QUESTIONS: SISRI24Question[] = [
  // Question 1 - CET
  {
    id: 1,
    question: 'Tôi thường tự đặt câu hỏi hoặc suy ngẫm sâu sắc về bản chất của thực tại.',
    questionEn: 'I have often questioned or pondered the nature of reality.',
    dimension: 'CET',
    options: STANDARD_OPTIONS,
  },

  // Question 2 - TA
  {
    id: 2,
    question: 'Tôi nhận ra những khía cạnh của bản thân sâu sắc hơn cơ thể vật lý của mình.',
    questionEn: 'I recognize aspects of myself that are deeper than my physical body.',
    dimension: 'TA',
    options: STANDARD_OPTIONS,
  },

  // Question 3 - CET
  {
    id: 3,
    question: 'Tôi dành thời gian để chiêm nghiệm về mục đích hoặc lý do cho sự tồn tại của mình.',
    questionEn: 'I have spent time contemplating the purpose or reason for my existence.',
    dimension: 'CET',
    options: STANDARD_OPTIONS,
  },

  // Question 4 - CSE
  {
    id: 4,
    question: 'Tôi có khả năng đi vào các trạng thái ý thức hoặc nhận thức cao hơn.',
    questionEn: 'I am able to enter higher states of consciousness or awareness.',
    dimension: 'CSE',
    options: STANDARD_OPTIONS,
  },

  // Question 5 - CET
  {
    id: 5,
    question: 'Tôi có khả năng suy ngẫm sâu sắc về những gì xảy ra sau cái chết.',
    questionEn: 'I am able to deeply contemplate what happens after death.',
    dimension: 'CET',
    options: STANDARD_OPTIONS,
  },

  // Question 6 - TA (REVERSED SCORING)
  {
    id: 6,
    question: 'Tôi thấy khó cảm nhận được bất cứ điều gì khác ngoài thế giới vật chất hữu hình.',
    questionEn: 'It is difficult for me to sense anything other than the physical and material.',
    dimension: 'TA',
    isReversed: true,
    options: STANDARD_OPTIONS,
  },

  // Question 7 - PMP
  {
    id: 7,
    question: 'Khả năng tìm kiếm ý nghĩa và mục đích sống giúp tôi thích nghi với những tình huống căng thẳng.',
    questionEn: 'My ability to find meaning and purpose in life helps me adapt to stressful situations.',
    dimension: 'PMP',
    options: STANDARD_OPTIONS,
  },

  // Question 8 - CSE
  {
    id: 8,
    question: 'Tôi có thể kiểm soát thời điểm mình đi vào các trạng thái ý thức hoặc nhận thức cao hơn.',
    questionEn: 'I can control when I enter higher states of consciousness or awareness.',
    dimension: 'CSE',
    options: STANDARD_OPTIONS,
  },

  // Question 9 - CET
  {
    id: 9,
    question: 'Tôi đã tự xây dựng những lý thuyết riêng của mình về những vấn đề như sự sống, cái chết, thực tại và sự tồn tại.',
    questionEn: 'I have developed my own theories about such things as life, death, reality, and existence.',
    dimension: 'CET',
    options: STANDARD_OPTIONS,
  },

  // Question 10 - TA
  {
    id: 10,
    question: 'Tôi nhận thức được một sự kết nối sâu sắc giữa bản thân mình và những người khác.',
    questionEn: 'I am aware of a deeper connection between myself and other people.',
    dimension: 'TA',
    options: STANDARD_OPTIONS,
  },

  // Question 11 - PMP
  {
    id: 11,
    question: 'Tôi có thể xác định rõ ràng mục đích hoặc lý do cho cuộc sống của mình.',
    questionEn: 'I am able to define a purpose or reason for my life.',
    dimension: 'PMP',
    options: STANDARD_OPTIONS,
  },

  // Question 12 - CSE
  {
    id: 12,
    question: 'Tôi có khả năng chuyển đổi tự do giữa các tầng bậc của ý thức hoặc nhận thức.',
    questionEn: 'I am able to move freely between levels of consciousness or awareness.',
    dimension: 'CSE',
    options: STANDARD_OPTIONS,
  },

  // Question 13 - CET
  {
    id: 13,
    question: 'Tôi thường xuyên suy ngẫm về ý nghĩa của các sự kiện xảy ra trong cuộc đời mình.',
    questionEn: 'I frequently contemplate the meaning of events in my life.',
    dimension: 'CET',
    options: STANDARD_OPTIONS,
  },

  // Question 14 - TA
  {
    id: 14,
    question: 'Tôi định nghĩa bản thân mình thông qua cái tôi sâu sắc, phi vật chất.',
    questionEn: 'I define myself by my deeper, non-physical self.',
    dimension: 'TA',
    options: STANDARD_OPTIONS,
  },

  // Question 15 - PMP
  {
    id: 15,
    question: 'Khi trải qua một thất bại, tôi vẫn có thể tìm thấy ý nghĩa trong đó.',
    questionEn: 'When I experience a failure, I am still able to find meaning in it.',
    dimension: 'PMP',
    options: STANDARD_OPTIONS,
  },

  // Question 16 - CSE
  {
    id: 16,
    question: 'Tôi thường nhìn nhận các vấn đề và lựa chọn rõ ràng hơn khi ở trong các trạng thái ý thức/nhận thức cao hơn.',
    questionEn: 'I often see issues and choices more clearly while in higher states of consciousness/awareness.',
    dimension: 'CSE',
    options: STANDARD_OPTIONS,
  },

  // Question 17 - CET
  {
    id: 17,
    question: 'Tôi thường suy ngẫm về mối quan hệ giữa con người và phần còn lại của vũ trụ.',
    questionEn: 'I have often contemplated the relationship between human beings and the rest of the universe.',
    dimension: 'CET',
    options: STANDARD_OPTIONS,
  },

  // Question 18 - TA
  {
    id: 18,
    question: 'Tôi nhận thức rất rõ về các khía cạnh phi vật chất của cuộc sống.',
    questionEn: 'I am highly aware of the nonmaterial aspects of life.',
    dimension: 'TA',
    options: STANDARD_OPTIONS,
  },

  // Question 19 - PMP
  {
    id: 19,
    question: 'Tôi có khả năng đưa ra các quyết định dựa trên mục đích sống của mình.',
    questionEn: 'I am able to make decisions according to my purpose in life.',
    dimension: 'PMP',
    options: STANDARD_OPTIONS,
  },

  // Question 20 - TA
  {
    id: 20,
    question: 'Tôi nhận ra những phẩm chất ở con người mang nhiều ý nghĩa hơn là cơ thể, tính cách hoặc cảm xúc của họ.',
    questionEn: 'I recognize qualities in people which are more meaningful than their body, personality, or emotions.',
    dimension: 'TA',
    options: STANDARD_OPTIONS,
  },

  // Question 21 - CET
  {
    id: 21,
    question: 'Tôi đã suy ngẫm sâu sắc về việc liệu có hay không tồn tại một sức mạnh hay thế lực tối cao nào đó (ví dụ: thượng đế, thần thánh, đấng siêu nhiên, nguồn năng lượng cao cấp, v.v.).',
    questionEn: 'I have deeply contemplated whether or not there is some greater power or force (e.g., god, goddess, divine being, higher energy, etc.).',
    dimension: 'CET',
    options: STANDARD_OPTIONS,
  },

  // Question 22 - TA
  {
    id: 22,
    question: 'Việc nhận biết các khía cạnh phi vật chất của cuộc sống giúp tôi cảm thấy tĩnh tại/cân bằng.',
    questionEn: 'Recognizing the nonmaterial aspects of life helps me feel centered.',
    dimension: 'TA',
    options: STANDARD_OPTIONS,
  },

  // Question 23 - PMP
  {
    id: 23,
    question: 'Tôi có thể tìm thấy ý nghĩa và mục đích trong những trải nghiệm hàng ngày của mình.',
    questionEn: 'I am able to find meaning and purpose in my everyday experiences.',
    dimension: 'PMP',
    options: STANDARD_OPTIONS,
  },

  // Question 24 - CSE
  {
    id: 24,
    question: 'Tôi đã phát triển những kỹ thuật của riêng mình để đi vào các trạng thái ý thức hoặc nhận thức cao hơn.',
    questionEn: 'I have developed my own techniques for entering higher states of consciousness or awareness.',
    dimension: 'CSE',
    options: STANDARD_OPTIONS,
  },
]

// Dimension descriptions (updated with official definitions and "Tinh thần R" connections)
export const SISRI_24_DIMENSIONS = {
  CET: {
    name: 'Critical Existential Thinking',
    nameVi: 'Tư duy Hiện sinh Phản biện',
    description:
      'Khả năng sử dụng logic để mổ xẻ các vấn đề tối hậu của sự tồn tại (Vũ trụ, Thực tại). Đòi hỏi phải tách rời định kiến, tự xây dựng hiểu biết riêng và không chấp nhận câu trả lời có sẵn.',
    longDescription:
      'Khả năng suy ngẫm sâu sắc về bản chất của sự tồn tại, thực tại, vũ trụ, cái chết và thời gian. Đây không chỉ là suy nghĩ vu vơ mà là khả năng phân tích và kiến tạo quan điểm cá nhân về các vấn đề cốt lõi của sự sống. Những cá nhân có điểm CET cao thường là những người có tư duy triết học, luôn đặt câu hỏi "Tại sao?" và "Để làm gì?" trước các hiện tượng của đời sống.',
    spiritR: 'Làm đến cuối cùng',
    lowScore: 'Ít quan tâm đến các câu hỏi triết học. Chấp nhận câu trả lời có sẵn mà không tự mình tìm tòi.',
    highScore: 'Thường xuyên suy ngẫm về mục đích tồn tại. Tự xây dựng quan điểm riêng về sự sống, cái chết và thực tại.',
    genZNote: 'Một bạn trẻ có CET cao sẽ không chấp nhận "bố mẹ bảo thế" cho định hướng nghề nghiệp. Họ trăn trở về ý nghĩa công việc, về tác động của họ đến xã hội.',
  },
  PMP: {
    name: 'Personal Meaning Production',
    nameVi: 'Kiến tạo Ý nghĩa Cá nhân',
    description:
      'Năng lực chủ động kiến tạo ý nghĩa và mục đích cá nhân từ mọi trải nghiệm. Giúp biến đau khổ thành thành tựu và duy trì mục đích sống bền vững.',
    longDescription:
      'Khả năng kiến tạo ý nghĩa và mục đích sống từ tất cả các trải nghiệm vật lý và tinh thần, bao gồm cả những trải nghiệm đau thương. Đây là năng lực "nhà giả kim" của tâm hồn, biến "chì" (khó khăn) thành "vàng" (ý nghĩa). Chuyển hóa những suy tư triết học trừu tượng của CET thành động lực sống cụ thể hằng ngày.',
    spiritR: 'Tìm niềm vui trong hoạn nạn • Tinh thần tích cực',
    lowScore: 'Khó khăn trong việc tìm ra ý nghĩa từ các trải nghiệm. Thiếu định hướng rõ ràng trong cuộc sống.',
    highScore: 'Có mục đích sống rõ ràng. Biết cách tạo ra ý nghĩa từ mọi trải nghiệm, kể cả thất bại.',
    genZNote: 'PMP là liều thuốc giải cho sự kiệt sức (burnout). Thay vì nhìn nhận công việc áp lực là sự bóc lột vô nghĩa, người có PMP cao tìm thấy bài học về sự kiên nhẫn hoặc cơ hội rèn luyện kỹ năng.',
    vietnamNote: '"Ý nghĩa cá nhân" đối với người Việt thường không tách rời khỏi lợi ích của gia đình và xã hội.',
  },
  TA: {
    name: 'Transcendental Awareness',
    nameVi: 'Nhận thức Siêu việt',
    description:
      'Khả năng tri giác vượt qua các giác quan vật lý để nhận biết các chiều kích thiêng liêng và sự kết nối toàn thể (interconnectedness) của vạn vật.',
    longDescription:
      'Khả năng nhận thức các khía cạnh siêu việt của bản thân (ví dụ: cái tôi cao hơn), của người khác và thế giới vật chất trong trạng thái tỉnh thức bình thường. Bao gồm cảm giác kết nối sâu sắc với vạn vật, thiên nhiên và nhân loại. Đây là khả năng nhìn thấy "bức tranh lớn" (holistic view), nhận ra mối liên kết vô hình giữa vạn vật. TA là cơ sở của lòng trắc ẩn và tư duy bền vững.',
    spiritR: 'Cảm tạ trong mọi sự • Nhìn và nhận một cách công bình',
    lowScore: 'Tập trung chủ yếu vào thế giới vật chất. Khó cảm nhận các khía cạnh phi vật chất của cuộc sống.',
    highScore: 'Nhận thức rõ ràng về chiều kích tâm linh. Cảm giác kết nối sâu sắc với vũ trụ và con người.',
    genZNote: 'TA giúp giới trẻ vượt thoát khỏi chủ nghĩa duy vật và áp lực hình ảnh cá nhân trên mạng xã hội. Giúp họ nhận ra giá trị của một con người không nằm ở số like hay thương hiệu quần áo.',
  },
  CSE: {
    name: 'Conscious State Expansion',
    nameVi: 'Mở rộng Trạng thái Ý thức',
    description:
      'Khả năng chủ động đi vào và thoát ra khỏi các trạng thái ý thức bậc cao, như trạng thái dòng chảy (flow) hoặc nhất tâm.',
    longDescription:
      'Khả năng chủ động tiến vào và thoát ra khỏi các trạng thái ý thức cao hơn (như sự tập trung sâu, dòng chảy - flow, sự tĩnh lặng tuyệt đối, sự hợp nhất). Điểm mấu chốt là tính kiểm soát và làm chủ (mastery) tâm trí để tìm kiếm sự sáng suốt hoặc giải quyết vấn đề. Khả năng thay đổi trạng thái sóng não (từ Beta sang Alpha, Theta) theo ý muốn là biểu hiện cao nhất của sự làm chủ bản thân.',
    spiritR: 'Cai trị tấm lòng mình',
    lowScore: 'Ít thực hành các kỹ thuật nâng cao ý thức. Hiếm khi trải nghiệm trạng thái flow hoặc nhất tâm.',
    highScore: 'Thường xuyên thực hành thiền định. Có khả năng kiểm soát và chuyển đổi trạng thái ý thức.',
    genZNote: 'Cần diễn giải CSE một cách thận trọng để tránh hiểu lầm về việc sử dụng chất kích thích. CSE ở đây chính là năng lực Chánh niệm (Mindfulness) và Thiền định.',
  },
}

// Scoring interpretation (Official SISRI-24 scoring)
export const SISRI_24_SCORING = {
  // Question count per dimension
  dimensionQuestionCounts: {
    CET: 7, // Questions: 1, 3, 5, 9, 13, 17, 21
    PMP: 5, // Questions: 7, 11, 15, 19, 23
    TA: 7,  // Questions: 2, 6*, 10, 14, 18, 20, 22
    CSE: 5, // Questions: 4, 8, 12, 16, 24
  },

  // Max score per dimension (with 0-4 scale)
  maxScoresPerDimension: {
    CET: 28, // 7 questions × 4 points max
    PMP: 20, // 5 questions × 4 points max
    TA: 28,  // 7 questions × 4 points max
    CSE: 20, // 5 questions × 4 points max
  },

  // Overall: 24 questions × 4 points = max 96 points
  maxTotalScore: 96,

  // Interpretation ranges (per dimension, normalized to percentage)
  interpretationRanges: {
    veryLow: { min: 0, max: 25, label: 'Rất thấp', color: 'red' },
    low: { min: 26, max: 45, label: 'Thấp', color: 'orange' },
    moderate: { min: 46, max: 65, label: 'Trung bình', color: 'yellow' },
    high: { min: 66, max: 85, label: 'Cao', color: 'blue' },
    veryHigh: { min: 86, max: 100, label: 'Rất cao', color: 'green' },
  },

  // Overall interpretation (out of 96)
  overallInterpretation: {
    veryLow: {
      min: 0,
      max: 24,
      label: 'Rất thấp',
      description: 'Trí tuệ tâm linh cần phát triển nhiều hơn'
    },
    low: {
      min: 25,
      max: 43,
      label: 'Thấp',
      description: 'Trí tuệ tâm linh đang ở mức khởi đầu'
    },
    moderate: {
      min: 44,
      max: 62,
      label: 'Trung bình',
      description: 'Trí tuệ tâm linh đang phát triển tốt'
    },
    high: {
      min: 63,
      max: 81,
      label: 'Cao',
      description: 'Trí tuệ tâm linh phát triển mạnh mẽ'
    },
    veryHigh: {
      min: 82,
      max: 96,
      label: 'Rất cao',
      description: 'Trí tuệ tâm linh xuất sắc'
    },
  },
}

export type SISRI24Dimension = keyof typeof SISRI_24_DIMENSIONS

// Helper to get question IDs by dimension
export const DIMENSION_QUESTION_IDS = {
  CET: [1, 3, 5, 9, 13, 17, 21],
  PMP: [7, 11, 15, 19, 23],
  TA: [2, 6, 10, 14, 18, 20, 22], // Note: Q6 is reversed
  CSE: [4, 8, 12, 16, 24],
}
