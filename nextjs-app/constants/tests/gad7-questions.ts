/**
 * GAD-7 (Generalized Anxiety Disorder-7)
 * Bộ câu hỏi sàng lọc rối loạn lo âu lan tỏa
 * 7 câu hỏi đầy đủ theo chuẩn y khoa
 */

export interface GAD7Question {
  id: number
  question: string
  options: {
    value: number
    label: string
    description: string
  }[]
}

export const GAD7_QUESTIONS: GAD7Question[] = [
  {
    id: 1,
    question: 'Cảm thấy lo lắng, bồn chồn hoặc căng thẳng',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 2,
    question: 'Không thể ngừng lo lắng hoặc kiểm soát việc lo lắng',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 3,
    question: 'Lo lắng quá nhiều về nhiều thứ khác nhau',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 4,
    question: 'Khó thư giãn',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 5,
    question: 'Bồn chồn đến mức khó có thể ngồi yên',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 6,
    question: 'Dễ bực bội hoặc cáu kỉnh',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
  {
    id: 7,
    question: 'Cảm thấy sợ hãi như thể điều gì đó tồi tệ sắp xảy ra',
    options: [
      { value: 0, label: 'Không bao giờ', description: 'Không xảy ra' },
      { value: 1, label: 'Vài ngày', description: '1-2 ngày' },
      { value: 2, label: 'Hơn một nửa số ngày', description: '> 7 ngày' },
      { value: 3, label: 'Gần như mỗi ngày', description: 'Hầu như mỗi ngày' },
    ],
  },
]

// GAD-7 Scoring and Severity Levels
export const GAD7_SEVERITY = {
  minimal: { min: 0, max: 4, label: 'Tối thiểu', color: 'green', description: 'Không hoặc rất ít triệu chứng lo âu' },
  mild: { min: 5, max: 9, label: 'Nhẹ', color: 'yellow', description: 'Triệu chứng lo âu nhẹ' },
  moderate: { min: 10, max: 14, label: 'Trung bình', color: 'orange', description: 'Triệu chứng lo âu trung bình' },
  severe: { min: 15, max: 21, label: 'Nặng', color: 'red', description: 'Triệu chứng lo âu nặng' },
} as const

// Recommendations based on severity
export const GAD7_RECOMMENDATIONS = {
  minimal: {
    title: 'Tuyệt vời! Mức độ lo âu của bạn rất thấp',
    actions: [
      'Tiếp tục duy trì lối sống lành mạnh',
      'Thực hành thư giãn và chánh niệm',
      'Duy trì hoạt động thể chất đều đặn',
      'Ngủ đủ giấc và ăn uống cân đối',
    ],
  },
  mild: {
    title: 'Có một số dấu hiệu lo âu nhẹ',
    actions: [
      'Theo dõi triệu chứng của bạn',
      'Thực hành kỹ thuật thư giãn (hơi thở sâu, yoga)',
      'Tăng cường hoạt động thể chất',
      'Hạn chế caffeine và chất kích thích',
      'Tìm hiểu về kỹ thuật quản lý lo âu',
    ],
  },
  moderate: {
    title: 'Nên quan tâm và theo dõi',
    actions: [
      'Nên gặp chuyên gia sức khỏe tinh thần',
      'Xem xét liệu pháp nhận thức hành vi (CBT)',
      'Thực hành chánh niệm hàng ngày',
      'Tìm kiếm hỗ trợ từ người thân',
      'Tránh rượu và chất kích thích',
    ],
  },
  severe: {
    title: '⚠️ Cần chú ý nghiêm túc',
    actions: [
      '🏥 NÊN GẶP BÁC SĨ hoặc nhà tâm lý học NGAY',
      'Cân nhắc điều trị kết hợp (liệu pháp + thuốc)',
      'Xây dựng mạng lưới hỗ trợ mạnh mẽ',
      'Tránh đưa ra quyết định quan trọng khi lo âu',
      '📞 Hotline hỗ trợ: 1800-xxxx',
    ],
  },
}

// Hotlines (Vietnam)
export const ANXIETY_HOTLINES = [
  { name: 'Tổng đài 108', phone: '108', description: 'Cấp cứu y tế' },
  { name: 'Tổng đài 113', phone: '113', description: 'Công an - Khẩn cấp' },
  { name: 'Viện Sức khỏe Tâm thần', phone: '024-3835-2141', description: 'Bệnh viện Tâm thần Trung ương' },
  { name: 'Tư vấn tâm lý', phone: '1800-xxxx', description: 'Hotline tư vấn 24/7 (nếu có)' },
]

// Calculate severity level from total score
export function getGAD7Severity(totalScore: number) {
  if (totalScore <= GAD7_SEVERITY.minimal.max) return GAD7_SEVERITY.minimal
  if (totalScore <= GAD7_SEVERITY.mild.max) return GAD7_SEVERITY.mild
  if (totalScore <= GAD7_SEVERITY.moderate.max) return GAD7_SEVERITY.moderate
  return GAD7_SEVERITY.severe
}
