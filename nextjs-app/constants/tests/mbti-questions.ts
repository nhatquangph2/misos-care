/**
 * MBTI Test Questions - Full 60 Questions
 * Based on Myers-Briggs Type Indicator dimensions
 * Each dimension has 15 questions for better accuracy
 */

export interface MBTIQuestion {
  id: number
  question: string
  dimension: 'EI' | 'SN' | 'TF' | 'JP' // E/I, S/N, T/F, J/P
  direction: 'positive' | 'negative' // positive = first letter, negative = second letter
  options: {
    value: number
    label: string
  }[]
}

// Standard 5-point scale options for all questions
const STANDARD_OPTIONS = [
  { value: 5, label: 'Hoàn toàn đồng ý' },
  { value: 4, label: 'Đồng ý' },
  { value: 3, label: 'Trung lập' },
  { value: 2, label: 'Không đồng ý' },
  { value: 1, label: 'Hoàn toàn không đồng ý' },
]

export const MBTI_QUESTIONS: MBTIQuestion[] = [
  // ============================================
  // E/I: Extraversion vs Introversion (15 questions)
  // ============================================
  {
    id: 1,
    question: 'Tôi cảm thấy tràn đầy năng lượng khi ở trong nhóm đông người',
    dimension: 'EI',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 2,
    question: 'Tôi thích dành thời gian một mình để suy ngẫm và nạp lại năng lượng',
    dimension: 'EI',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 3,
    question: 'Tôi thường là người chủ động bắt chuyện với người lạ',
    dimension: 'EI',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 4,
    question: 'Tôi cảm thấy kiệt sức sau các buổi gặp gỡ xã hội',
    dimension: 'EI',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 5,
    question: 'Tôi thích làm việc trong môi trường nhiều tương tác',
    dimension: 'EI',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 6,
    question: 'Tôi thích suy nghĩ kỹ trước khi nói ra ý kiến',
    dimension: 'EI',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 7,
    question: 'Tôi dễ dàng kết bạn mới trong các sự kiện',
    dimension: 'EI',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 8,
    question: 'Tôi thích các hoạt động yên tĩnh hơn là ồn ào',
    dimension: 'EI',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 9,
    question: 'Tôi thường chia sẻ suy nghĩ của mình ngay khi có ý tưởng',
    dimension: 'EI',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 10,
    question: 'Tôi thích có thời gian riêng tư để tập trung làm việc',
    dimension: 'EI',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 11,
    question: 'Tôi cảm thấy thoải mái khi là trung tâm của sự chú ý',
    dimension: 'EI',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 12,
    question: 'Tôi cần thời gian một mình sau khi giao tiếp nhiều',
    dimension: 'EI',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 13,
    question: 'Tôi thích tham gia các buổi tiệc và sự kiện đông người',
    dimension: 'EI',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 14,
    question: 'Tôi thích làm việc độc lập hơn là trong nhóm',
    dimension: 'EI',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 15,
    question: 'Tôi dễ dàng bày tỏ cảm xúc và suy nghĩ với người khác',
    dimension: 'EI',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },

  // ============================================
  // S/N: Sensing vs Intuition (15 questions)
  // ============================================
  {
    id: 16,
    question: 'Tôi tập trung vào thực tế và chi tiết cụ thể',
    dimension: 'SN',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 17,
    question: 'Tôi thích suy nghĩ về các khả năng và ý tưởng mới',
    dimension: 'SN',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 18,
    question: 'Tôi tin vào kinh nghiệm thực tế hơn là lý thuyết trừu tượng',
    dimension: 'SN',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 19,
    question: 'Tôi thích tưởng tượng về tương lai và các viễn cảnh mới',
    dimension: 'SN',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 20,
    question: 'Tôi chú ý đến các chi tiết nhỏ trong công việc',
    dimension: 'SN',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 21,
    question: 'Tôi thích tìm hiểu ý nghĩa sâu xa đằng sau sự việc',
    dimension: 'SN',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 22,
    question: 'Tôi thích làm theo hướng dẫn cụ thể từng bước',
    dimension: 'SN',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 23,
    question: 'Tôi thích khám phá các khái niệm và ý tưởng trừu tượng',
    dimension: 'SN',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 24,
    question: 'Tôi tập trung vào hiện tại hơn là tương lai',
    dimension: 'SN',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 25,
    question: 'Tôi thích suy nghĩ về các mẫu hình và xu hướng tổng quát',
    dimension: 'SN',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 26,
    question: 'Tôi thích các công việc thực tế, có kết quả rõ ràng',
    dimension: 'SN',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 27,
    question: 'Tôi thích suy nghĩ về các khả năng chưa được khám phá',
    dimension: 'SN',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 28,
    question: 'Tôi dựa vào kinh nghiệm quá khứ để đưa ra quyết định',
    dimension: 'SN',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 29,
    question: 'Tôi thích đổi mới và thử nghiệm cách làm mới',
    dimension: 'SN',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 30,
    question: 'Tôi chú ý đến các sự kiện cụ thể hơn là ý nghĩa của chúng',
    dimension: 'SN',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },

  // ============================================
  // T/F: Thinking vs Feeling (15 questions)
  // ============================================
  {
    id: 31,
    question: 'Tôi đưa ra quyết định dựa trên logic và phân tích',
    dimension: 'TF',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 32,
    question: 'Tôi cân nhắc cảm xúc của người khác khi ra quyết định',
    dimension: 'TF',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 33,
    question: 'Tôi đánh giá cao sự công bằng và chính xác',
    dimension: 'TF',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 34,
    question: 'Tôi thích tạo sự hài hòa trong nhóm',
    dimension: 'TF',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 35,
    question: 'Tôi thường phê bình trực tiếp khi thấy sai sót',
    dimension: 'TF',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 36,
    question: 'Tôi dễ dàng cảm thông với cảm xúc của người khác',
    dimension: 'TF',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 37,
    question: 'Tôi ưu tiên hiệu quả hơn là mối quan hệ',
    dimension: 'TF',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 38,
    question: 'Tôi đưa ra quyết định dựa trên giá trị cá nhân',
    dimension: 'TF',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 39,
    question: 'Tôi thích tranh luận và đưa ra lập luận logic',
    dimension: 'TF',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 40,
    question: 'Tôi quan tâm đến cảm giác của mọi người',
    dimension: 'TF',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 41,
    question: 'Tôi đánh giá cao sự khách quan trong mọi tình huống',
    dimension: 'TF',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 42,
    question: 'Tôi thích động viên và giúp đỡ người khác',
    dimension: 'TF',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 43,
    question: 'Tôi tập trung vào sự thật hơn là ảnh hưởng đến người khác',
    dimension: 'TF',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 44,
    question: 'Tôi dễ bị tác động bởi cảm xúc của người khác',
    dimension: 'TF',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 45,
    question: 'Tôi thích phân tích và giải quyết vấn đề một cách hệ thống',
    dimension: 'TF',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },

  // ============================================
  // J/P: Judging vs Perceiving (15 questions)
  // ============================================
  {
    id: 46,
    question: 'Tôi thích lên kế hoạch chi tiết trước khi hành động',
    dimension: 'JP',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 47,
    question: 'Tôi thích linh hoạt và ứng biến với tình huống',
    dimension: 'JP',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 48,
    question: 'Tôi thích hoàn thành công việc sớm hơn deadline',
    dimension: 'JP',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 49,
    question: 'Tôi thường làm việc tốt nhất dưới áp lực deadline',
    dimension: 'JP',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 50,
    question: 'Tôi thích có lịch trình rõ ràng cho ngày làm việc',
    dimension: 'JP',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 51,
    question: 'Tôi thích giữ các lựa chọn mở để có thể thay đổi',
    dimension: 'JP',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 52,
    question: 'Tôi cảm thấy thoải mái khi mọi thứ được tổ chức ngăn nắp',
    dimension: 'JP',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 53,
    question: 'Tôi không ngại thay đổi kế hoạch đột xuất',
    dimension: 'JP',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 54,
    question: 'Tôi thích đưa ra quyết định nhanh chóng và tiến hành',
    dimension: 'JP',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 55,
    question: 'Tôi thích dành thời gian khám phá trước khi quyết định',
    dimension: 'JP',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 56,
    question: 'Tôi thích có danh sách công việc cụ thể',
    dimension: 'JP',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 57,
    question: 'Tôi thích làm nhiều việc cùng lúc thay vì tuần tự',
    dimension: 'JP',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 58,
    question: 'Tôi cảm thấy khó chịu khi công việc chưa hoàn thành',
    dimension: 'JP',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
  {
    id: 59,
    question: 'Tôi thích tự do sáng tạo hơn là tuân theo quy trình',
    dimension: 'JP',
    direction: 'negative',
    options: STANDARD_OPTIONS,
  },
  {
    id: 60,
    question: 'Tôi thích kết thúc dứt điểm hơn là để ngỏ',
    dimension: 'JP',
    direction: 'positive',
    options: STANDARD_OPTIONS,
  },
]

// MBTI Type descriptions (for results page)
export const MBTI_DESCRIPTIONS: Record<string, { name: string; description: string; strengths: string[]; careers: string[] }> = {
  INTJ: {
    name: 'Kiến trúc sư',
    description: 'Người chiến lược sáng tạo với kế hoạch cho mọi việc.',
    strengths: ['Tư duy chiến lược', 'Độc lập', 'Quyết đoán', 'Cầu toàn'],
    careers: ['Nhà khoa học', 'Kỹ sư', 'Nhà chiến lược', 'Giáo sư'],
  },
  INTP: {
    name: 'Nhà logic học',
    description: 'Nhà phát minh sáng tạo với khát khao tri thức không ngừng.',
    strengths: ['Phân tích', 'Sáng tạo', 'Khách quan', 'Tò mò'],
    careers: ['Nhà nghiên cứu', 'Lập trình viên', 'Nhà toán học', 'Triết gia'],
  },
  ENTJ: {
    name: 'Nhà lãnh đạo',
    description: 'Lãnh đạo táo bạo, giàu trí tưởng tượng và ý chí mạnh mẽ.',
    strengths: ['Lãnh đạo', 'Tự tin', 'Có tổ chức', 'Quyết đoán'],
    careers: ['CEO', 'Luật sư', 'Giám đốc', 'Doanh nhân'],
  },
  ENTP: {
    name: 'Nhà tranh luận',
    description: 'Người tư duy nhanh nhạy và táo bạo, tìm kiếm thách thức trí tuệ.',
    strengths: ['Sáng tạo', 'Linh hoạt', 'Giao tiếp tốt', 'Nhiệt tình'],
    careers: ['Nhà tư vấn', 'Nhà phát minh', 'Nhà marketing', 'Luật sư'],
  },
  INFJ: {
    name: 'Người ủng hộ',
    description: 'Người lý tưởng hóa yên lặng nhưng đầy cảm hứng.',
    strengths: ['Thấu hiểu', 'Sáng tạo', 'Kiên định', 'Có tầm nhìn'],
    careers: ['Nhà tâm lý', 'Nhà văn', 'Giáo viên', 'Nghệ sĩ'],
  },
  INFP: {
    name: 'Người hòa giải',
    description: 'Người lý tưởng hóa thơ mộng, luôn tìm kiếm điều tốt đẹp.',
    strengths: ['Đồng cảm', 'Sáng tạo', 'Lý tưởng', 'Linh hoạt'],
    careers: ['Nhà văn', 'Tâm lý trị liệu', 'Nghệ sĩ', 'Giáo viên'],
  },
  ENFJ: {
    name: 'Người dẫn đường',
    description: 'Lãnh đạo lôi cuốn, truyền cảm hứng và đầy nhiệt huyết.',
    strengths: ['Giao tiếp', 'Lãnh đạo', 'Thấu cảm', 'Tổ chức'],
    careers: ['Giáo viên', 'Nhà tâm lý', 'Huấn luyện viên', 'HR Manager'],
  },
  ENFP: {
    name: 'Người truyền cảm hứng',
    description: 'Người nhiệt tình, sáng tạo và xã hội, luôn tìm cách giúp đỡ.',
    strengths: ['Nhiệt tình', 'Sáng tạo', 'Giao tiếp', 'Linh hoạt'],
    careers: ['Nhà tư vấn', 'Nhà báo', 'Diễn viên', 'Entrepreneur'],
  },
  ISTJ: {
    name: 'Người trách nhiệm',
    description: 'Người đáng tin cậy thực tế với tinh thần trách nhiệm cao.',
    strengths: ['Có tổ chức', 'Chi tiết', 'Đáng tin', 'Thực tế'],
    careers: ['Kế toán', 'Quản lý', 'Kỹ sư', 'Nhà phân tích'],
  },
  ISFJ: {
    name: 'Người bảo vệ',
    description: 'Người bảo vệ tận tâm, luôn sẵn sàng bảo vệ người thân.',
    strengths: ['Chăm sóc', 'Đáng tin', 'Chi tiết', 'Kiên nhẫn'],
    careers: ['Y tá', 'Giáo viên', 'Thư ký', 'Quản lý nhân sự'],
  },
  ESTJ: {
    name: 'Người điều hành',
    description: 'Quản lý xuất sắc, giỏi quản lý mọi thứ hoặc con người.',
    strengths: ['Tổ chức', 'Lãnh đạo', 'Thực tế', 'Quyết đoán'],
    careers: ['Giám đốc', 'Quân đội', 'Cảnh sát', 'Quản lý dự án'],
  },
  ESFJ: {
    name: 'Người quan tâm',
    description: 'Người quan tâm chăm sóc và hợp tác cao.',
    strengths: ['Hỗ trợ', 'Tổ chức', 'Trung thành', 'Thấu cảm'],
    careers: ['Giáo viên', 'Y tá', 'Công tác xã hội', 'Bán hàng'],
  },
  ISTP: {
    name: 'Người thợ thủ công',
    description: 'Người thợ táo bạo và thực tế, giỏi công cụ.',
    strengths: ['Thực tế', 'Linh hoạt', 'Kỹ thuật', 'Độc lập'],
    careers: ['Kỹ sư', 'Thợ cơ khí', 'Pilot', 'Kỹ thuật viên'],
  },
  ISFP: {
    name: 'Người phiêu lưu',
    description: 'Nghệ sĩ linh hoạt và quyến rũ, luôn sẵn sàng khám phá.',
    strengths: ['Nghệ thuật', 'Nhạy cảm', 'Linh hoạt', 'Cởi mở'],
    careers: ['Nghệ sĩ', 'Designer', 'Nhạc sĩ', 'Photographer'],
  },
  ESTP: {
    name: 'Người doanh nhân',
    description: 'Người năng động thông minh, sống trên bờ vực.',
    strengths: ['Hành động', 'Thực tế', 'Linh hoạt', 'Xã hội'],
    careers: ['Doanh nhân', 'Bán hàng', 'Marketing', 'VĐV'],
  },
  ESFP: {
    name: 'Người trình diễn',
    description: 'Người biểu diễn tự phát, nhiệt tình và thân thiện.',
    strengths: ['Nhiệt tình', 'Xã hội', 'Sáng tạo', 'Thực tế'],
    careers: ['Diễn viên', 'Nghệ sĩ', 'Hướng dẫn viên', 'Event Planner'],
  },
}
