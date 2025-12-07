/**
 * PSS-10 (Perceived Stress Scale-10)
 * Thang đo Căng thẳng Cảm nhận
 * 10 câu hỏi về mức độ căng thẳng trong tháng qua
 */

export interface PSSQuestion {
  id: number
  question: string
  reverse: boolean // true nếu là câu hỏi ngược (điểm cao = stress thấp)
  options: {
    value: number
    label: string
    description: string
  }[]
}

export const PSS_QUESTIONS: PSSQuestion[] = [
  {
    id: 1,
    question: 'Trong tháng qua, bạn có thường xuyên bị làm phiền vì điều gì đó xảy ra bất ngờ không?',
    reverse: false,
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không lần nào' },
      { value: 1, label: 'Hầu như không bao giờ', description: 'Rất hiếm khi' },
      { value: 2, label: 'Đôi khi', description: 'Thỉnh thoảng' },
      { value: 3, label: 'Khá thường xuyên', description: 'Nhiều lần' },
      { value: 4, label: 'Rất thường xuyên', description: 'Hầu như luôn luôn' },
    ],
  },
  {
    id: 2,
    question: 'Trong tháng qua, bạn có thường xuyên cảm thấy không thể kiểm soát những điều quan trọng trong cuộc sống không?',
    reverse: false,
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không lần nào' },
      { value: 1, label: 'Hầu như không bao giờ', description: 'Rất hiếm khi' },
      { value: 2, label: 'Đôi khi', description: 'Thỉnh thoảng' },
      { value: 3, label: 'Khá thường xuyên', description: 'Nhiều lần' },
      { value: 4, label: 'Rất thường xuyên', description: 'Hầu như luôn luôn' },
    ],
  },
  {
    id: 3,
    question: 'Trong tháng qua, bạn có thường xuyên cảm thấy lo lắng và căng thẳng không?',
    reverse: false,
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không lần nào' },
      { value: 1, label: 'Hầu như không bao giờ', description: 'Rất hiếm khi' },
      { value: 2, label: 'Đôi khi', description: 'Thỉnh thoảng' },
      { value: 3, label: 'Khá thường xuyên', description: 'Nhiều lần' },
      { value: 4, label: 'Rất thường xuyên', description: 'Hầu như luôn luôn' },
    ],
  },
  {
    id: 4,
    question: 'Trong tháng qua, bạn có thường xuyên cảm thấy tự tin về khả năng xử lý các vấn đề cá nhân không?',
    reverse: true, // Câu hỏi ngược
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không lần nào' },
      { value: 1, label: 'Hầu như không bao giờ', description: 'Rất hiếm khi' },
      { value: 2, label: 'Đôi khi', description: 'Thỉnh thoảng' },
      { value: 3, label: 'Khá thường xuyên', description: 'Nhiều lần' },
      { value: 4, label: 'Rất thường xuyên', description: 'Hầu như luôn luôn' },
    ],
  },
  {
    id: 5,
    question: 'Trong tháng qua, bạn có thường xuyên cảm thấy mọi việc đang diễn ra theo ý muốn của bạn không?',
    reverse: true, // Câu hỏi ngược
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không lần nào' },
      { value: 1, label: 'Hầu như không bao giờ', description: 'Rất hiếm khi' },
      { value: 2, label: 'Đôi khi', description: 'Thỉnh thoảng' },
      { value: 3, label: 'Khá thường xuyên', description: 'Nhiều lần' },
      { value: 4, label: 'Rất thường xuyên', description: 'Hầu như luôn luôn' },
    ],
  },
  {
    id: 6,
    question: 'Trong tháng qua, bạn có thường xuyên thấy mình không thể đối phó với tất cả những việc phải làm không?',
    reverse: false,
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không lần nào' },
      { value: 1, label: 'Hầu như không bao giờ', description: 'Rất hiếm khi' },
      { value: 2, label: 'Đôi khi', description: 'Thỉnh thoảng' },
      { value: 3, label: 'Khá thường xuyên', description: 'Nhiều lần' },
      { value: 4, label: 'Rất thường xuyên', description: 'Hầu như luôn luôn' },
    ],
  },
  {
    id: 7,
    question: 'Trong tháng qua, bạn có thường xuyên có thể kiểm soát được sự khó chịu trong cuộc sống không?',
    reverse: true, // Câu hỏi ngược
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không lần nào' },
      { value: 1, label: 'Hầu như không bao giờ', description: 'Rất hiếm khi' },
      { value: 2, label: 'Đôi khi', description: 'Thỉnh thoảng' },
      { value: 3, label: 'Khá thường xuyên', description: 'Nhiều lần' },
      { value: 4, label: 'Rất thường xuyên', description: 'Hầu như luôn luôn' },
    ],
  },
  {
    id: 8,
    question: 'Trong tháng qua, bạn có thường xuyên cảm thấy mình đang kiểm soát mọi thứ không?',
    reverse: true, // Câu hỏi ngược
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không lần nào' },
      { value: 1, label: 'Hầu như không bao giờ', description: 'Rất hiếm khi' },
      { value: 2, label: 'Đôi khi', description: 'Thỉnh thoảng' },
      { value: 3, label: 'Khá thường xuyên', description: 'Nhiều lần' },
      { value: 4, label: 'Rất thường xuyên', description: 'Hầu như luôn luôn' },
    ],
  },
  {
    id: 9,
    question: 'Trong tháng qua, bạn có thường xuyên cảm thấy tức giận vì những việc nằm ngoài tầm kiểm soát của bạn không?',
    reverse: false,
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không lần nào' },
      { value: 1, label: 'Hầu như không bao giờ', description: 'Rất hiếm khi' },
      { value: 2, label: 'Đôi khi', description: 'Thỉnh thoảng' },
      { value: 3, label: 'Khá thường xuyên', description: 'Nhiều lần' },
      { value: 4, label: 'Rất thường xuyên', description: 'Hầu như luôn luôn' },
    ],
  },
  {
    id: 10,
    question: 'Trong tháng qua, bạn có thường xuyên cảm thấy khó khăn đang chồng chất đến mức không thể vượt qua không?',
    reverse: false,
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không lần nào' },
      { value: 1, label: 'Hầu như không bao giờ', description: 'Rất hiếm khi' },
      { value: 2, label: 'Đôi khi', description: 'Thỉnh thoảng' },
      { value: 3, label: 'Khá thường xuyên', description: 'Nhiều lần' },
      { value: 4, label: 'Rất thường xuyên', description: 'Hầu như luôn luôn' },
    ],
  },
]

// PSS-10 Scoring and Severity Levels
export const PSS_SEVERITY = {
  low: { min: 0, max: 13, label: 'Thấp', color: 'green', description: 'Mức độ căng thẳng thấp' },
  moderate: { min: 14, max: 26, label: 'Trung bình', color: 'yellow', description: 'Mức độ căng thẳng trung bình' },
  high: { min: 27, max: 40, label: 'Cao', color: 'red', description: 'Mức độ căng thẳng cao' },
} as const

// Recommendations based on severity
export const PSS_RECOMMENDATIONS = {
  low: {
    title: 'Tuyệt vời! Mức độ căng thẳng của bạn ở mức thấp',
    actions: [
      'Tiếp tục duy trì lối sống lành mạnh hiện tại',
      'Thực hành chánh niệm và thiền định',
      'Duy trì hoạt động thể chất đều đặn',
      'Giữ gìn mối quan hệ xã hội tích cực',
      'Đảm bảo ngủ đủ giấc và ăn uống cân đối',
    ],
  },
  moderate: {
    title: 'Mức độ căng thẳng ở mức trung bình',
    actions: [
      'Xác định nguồn gốc của căng thẳng',
      'Thực hành kỹ thuật quản lý stress (hơi thở sâu, yoga)',
      'Tăng cường hoạt động thể chất',
      'Dành thời gian cho sở thích và thư giãn',
      'Cân nhắc nói chuyện với bạn bè hoặc người thân',
      'Hạn chế caffeine và rượu',
    ],
  },
  high: {
    title: '⚠️ Mức độ căng thẳng cao - Cần chú ý',
    actions: [
      '🏥 NÊN GẶP chuyên gia sức khỏe tinh thần',
      'Xem xét liệu pháp giảm stress (CBT, mindfulness)',
      'Thực hành thư giãn sâu hàng ngày',
      'Tìm kiếm hỗ trợ từ người thân và bạn bè',
      'Xem xét lại lịch trình và ưu tiên công việc',
      'Tránh rượu, thuốc lá và chất kích thích',
      '📞 Hotline hỗ trợ: 1800-xxxx',
    ],
  },
}

// Hotlines (Vietnam)
export const STRESS_HOTLINES = [
  { name: 'Tổng đài 108', phone: '108', description: 'Cấp cứu y tế' },
  { name: 'Tổng đài 113', phone: '113', description: 'Công an - Khẩn cấp' },
  { name: 'Viện Sức khỏe Tâm thần', phone: '024-3835-2141', description: 'Bệnh viện Tâm thần Trung ương' },
  { name: 'Tư vấn tâm lý', phone: '1800-xxxx', description: 'Hotline tư vấn 24/7 (nếu có)' },
]

// Calculate severity level from total score
export function getPSSSeverity(totalScore: number) {
  if (totalScore <= PSS_SEVERITY.low.max) return PSS_SEVERITY.low
  if (totalScore <= PSS_SEVERITY.moderate.max) return PSS_SEVERITY.moderate
  return PSS_SEVERITY.high
}

// Calculate PSS score with reverse scoring
export function calculatePSSScore(answers: { questionId: number; value: number }[]): number {
  let totalScore = 0

  answers.forEach((answer) => {
    const question = PSS_QUESTIONS.find((q) => q.id === answer.questionId)
    if (question) {
      // Reverse scoring for positive questions (4, 5, 7, 8)
      if (question.reverse) {
        totalScore += 4 - answer.value
      } else {
        totalScore += answer.value
      }
    }
  })

  return totalScore
}
