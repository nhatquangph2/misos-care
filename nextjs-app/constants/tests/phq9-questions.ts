/**
 * PHQ-9 (Patient Health Questionnaire-9)
 * Bộ câu hỏi sàng lọc trầm cảm tiêu chuẩn WHO
 * 9 câu hỏi đầy đủ theo chuẩn y khoa
 */

export interface PHQ9Question {
  id: number
  question: string
  options: {
    value: number
    label: string
    description: string
  }[]
}

export const PHQ9_QUESTIONS: PHQ9Question[] = [
  {
    id: 1,
    question: 'Ít quan tâm hoặc hứng thú với các hoạt động',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 2,
    question: 'Cảm thấy chán nản, trầm cảm hoặc vô vọng',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 3,
    question: 'Khó ngủ, ngủ không yên giấc hoặc ngủ quá nhiều',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 4,
    question: 'Cảm thấy mệt mỏi hoặc thiếu năng lượng',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 5,
    question: 'Ăn không ngon hoặc ăn quá nhiều',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 6,
    question: 'Cảm thấy tồi tệ về bản thân - hoặc cảm thấy là một kẻ thất bại hoặc đã làm cho bản thân hoặc gia đình thất vọng',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 7,
    question: 'Khó tập trung vào các việc như đọc báo hoặc xem tivi',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 8,
    question: 'Di chuyển hoặc nói chuyện chậm chạp đến mức người khác có thể nhận ra? Hoặc ngược lại - bồn chồn hoặc không yên đến mức bạn di chuyển nhiều hơn bình thường',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 9,
    question: '⚠️ QUAN TRỌNG: Có suy nghĩ rằng tốt hơn là chết đi hoặc tự làm hại bản thân theo một cách nào đó',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
]

// PHQ-9 Scoring and Severity Levels
export const PHQ9_SEVERITY = {
  minimal: { min: 0, max: 4, label: 'Tối thiểu', color: 'green', description: 'Không hoặc rất ít triệu chứng trầm cảm' },
  mild: { min: 5, max: 9, label: 'Nhẹ', color: 'yellow', description: 'Triệu chứng trầm cảm nhẹ' },
  moderate: { min: 10, max: 14, label: 'Trung bình', color: 'orange', description: 'Triệu chứng trầm cảm trung bình' },
  moderatelySevere: { min: 15, max: 19, label: 'Khá nặng', color: 'red', description: 'Triệu chứng trầm cảm khá nặng' },
  severe: { min: 20, max: 27, label: 'Nặng', color: 'darkred', description: 'Triệu chứng trầm cảm nặng' },
} as const

export type PHQ9SeverityData = typeof PHQ9_SEVERITY[keyof typeof PHQ9_SEVERITY]

// Crisis detection: Question 9 (suicidal ideation) scoring
export const CRISIS_THRESHOLD = {
  question9: 1, // Any score > 0 on question 9 triggers crisis alert
  totalScore: 15, // Total score >= 15 (moderately severe) triggers alert
}

// Recommendations based on severity
export const PHQ9_RECOMMENDATIONS = {
  minimal: {
    title: 'Tuyệt vời! Sức khỏe tinh thần của bạn rất tốt',
    actions: [
      'Tiếp tục duy trì lối sống lành mạnh',
      'Tập thể dục đều đặn',
      'Duy trì mối quan hệ xã hội tốt',
      'Thực hành kỹ thuật thư giãn cơ (PMR)',
    ],
  },
  mild: {
    title: 'Có một số dấu hiệu nhẹ',
    actions: [
      'Theo dõi triệu chứng của bạn',
      'Cải thiện thói quen ngủ',
      'Tăng cường hoạt động thể chất',
      'Cân nhắc nói chuyện với bạn bè hoặc gia đình',
      'Thử các kỹ thuật thư giãn',
    ],
  },
  moderate: {
    title: 'Nên quan tâm và theo dõi',
    actions: [
      'Nên gặp chuyên gia sức khỏe tinh thần',
      'Xem xét liệu pháp tâm lý (CBT, DBT)',
      'Tránh rượu và chất kích thích',
      'Thiết lập thói quen hàng ngày',
      'Tìm kiếm hỗ trợ từ người thân',
    ],
  },
  moderatelySevere: {
    title: '⚠️ Cần chú ý nghiêm túc',
    actions: [
      '🏥 Nên gặp bác sĩ hoặc nhà tâm lý học NGAY',
      'Cân nhắc điều trị kết hợp (liệu pháp + thuốc)',
      'Xây dựng mạng lưới hỗ trợ',
      'Tránh đưa ra quyết định quan trọng',
      'Gọi hotline hỗ trợ nếu cần: 1900 1267',
    ],
  },
  severe: {
    title: '🚨 CẦN HỖ TRỢ KHẨN CẤP',
    actions: [
      '🚨 LIÊN HỆ NGAY với chuyên gia y tế',
      '📞 Hotline khủng hoảng: 1900 1267',
      '🏥 Đến phòng cấp cứu nếu có suy nghĩ tự hại',
      'KHÔNG ở một mình - tìm kiếm sự hỗ trợ ngay lập tức',
      'Loại bỏ các phương tiện tự hại',
    ],
  },
}

// Hotlines (Vietnam)
export const CRISIS_HOTLINES = [
  { name: 'Tổng đài hỗ trợ sức khỏe tâm thần', phone: '1900 1267', description: 'Tư vấn tâm lý 24/7', isPrimary: true },
  { name: 'Cấp cứu', phone: '115', description: 'Cấp cứu y tế' },
  { name: 'Công an', phone: '113', description: 'Công an - Khẩn cấp' },
]
