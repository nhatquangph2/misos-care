/**
 * BFI-2 Counseling Service
 * Tư vấn dựa trên profile Big Five: Career, Mental Health, Relationships, Learning
 */

import { BFI2_DOMAINS, BFI2_FACETS, type BFI2Score } from '@/constants/tests/bfi2-questions'
import { interpretTScore } from './bfi2-scoring.service'

// ============================================
// CAREER COUNSELING
// ============================================

export interface CareerRecommendation {
  category: string
  careers: string[]
  reason: string
  strengths: string[]
  developmentAreas: string[]
}

/**
 * Tư vấn hướng nghiệp dựa trên Big Five profile
 * Based on: Mammadov (2022), Roberts et al. (2007)
 */
export function getCareerCounseling(score: BFI2Score): CareerRecommendation[] {
  const recommendations: CareerRecommendation[] = []

  const { domains, tScores } = score
  const domainLevels = {
    E: interpretTScore(tScores.domains.E).level,
    A: interpretTScore(tScores.domains.A).level,
    C: interpretTScore(tScores.domains.C).level,
    N: interpretTScore(tScores.domains.N).level,
    O: interpretTScore(tScores.domains.O).level,
  }

  // Pattern 1: High C + High O = Research & Innovation
  if (
    (domainLevels.C === 'high' || domainLevels.C === 'very-high') &&
    (domainLevels.O === 'high' || domainLevels.O === 'very-high')
  ) {
    recommendations.push({
      category: 'Nghiên cứu & Phát triển',
      careers: [
        'Nhà nghiên cứu khoa học',
        'Chuyên gia phân tích dữ liệu',
        'Kỹ sư nghiên cứu và phát triển',
        'Kiến trúc sư',
        'Nhà thiết kế trải nghiệm người dùng',
        'Quản lý sản phẩm',
      ],
      reason:
        'Sự kết hợp giữa tính Tận Tâm cao (khả năng tập trung, kiên trì) và Cởi Mở cao (tò mò, sáng tạo) rất phù hợp với các công việc đòi hỏi tư duy phân tích sâu và đổi mới.',
      strengths: [
        'Khả năng giải quyết vấn đề phức tạp',
        'Kiên nhẫn trong nghiên cứu dài hạn',
        'Tư duy đổi mới và sáng tạo',
      ],
      developmentAreas: ['Kỹ năng trình bày công trình', 'Mở rộng mạng lưới quan hệ chuyên môn'],
    })
  }

  // Pattern 2: High E + High A = People-Oriented Roles
  if (
    (domainLevels.E === 'high' || domainLevels.E === 'very-high') &&
    (domainLevels.A === 'high' || domainLevels.A === 'very-high')
  ) {
    recommendations.push({
      category: 'Tương tác con người & Dịch vụ',
      careers: [
        'Nhà tư vấn tâm lý',
        'Giáo viên / Giảng viên',
        'Quản lý nhân sự',
        'Quản lý chăm sóc khách hàng',
        'Nhân viên y tế (Điều dưỡng, Bác sĩ gia đình)',
        'Nhân viên xã hội',
      ],
      reason:
        'Hướng Ngoại cao giúp bạn tự tin giao tiếp, trong khi Dễ Chịu cao tạo ra khả năng thấu cảm và xây dựng lòng tin với người khác.',
      strengths: [
        'Kỹ năng giao tiếp xuất sắc',
        'Thấu cảm và quan tâm đến người khác',
        'Xây dựng mối quan hệ tốt',
      ],
      developmentAreas: [
        'Học cách đặt ranh giới (tránh kiệt sức)',
        'Phát triển kỹ năng đàm phán (đôi khi cần quyết đoán hơn)',
      ],
    })
  }

  // Pattern 3: High E + Low A = Leadership & Sales
  if (
    (domainLevels.E === 'high' || domainLevels.E === 'very-high') &&
    (domainLevels.A === 'low' || domainLevels.A === 'very-low')
  ) {
    recommendations.push({
      category: 'Lãnh đạo & Kinh doanh',
      careers: [
        'Giám đốc điều hành / Quản lý cấp cao',
        'Giám đốc kinh doanh',
        'Chủ doanh nghiệp / Khởi nghiệp',
        'Luật sư tranh tụng',
        'Chính trị gia',
        'Nhà đàm phán thương mại',
      ],
      reason:
        'Hướng Ngoại cao cung cấp năng lượng và khả năng gây ảnh hưởng, trong khi Dễ Chịu thấp giúp bạn đưa ra quyết định khó khăn mà không bị cảm xúc chi phối.',
      strengths: [
        'Khả năng lãnh đạo và ra quyết định nhanh',
        'Tự tin trong đàm phán và thuyết phục',
        'Không ngại xung đột',
      ],
      developmentAreas: [
        'Phát triển sự thấu cảm để giữ chân nhân tài',
        'Học cách lắng nghe và xây dựng văn hóa đội nhóm',
      ],
    })
  }

  // Pattern 4: High C + Low E = Technical & Analytical
  if (
    (domainLevels.C === 'high' || domainLevels.C === 'very-high') &&
    (domainLevels.E === 'low' || domainLevels.E === 'very-low')
  ) {
    recommendations.push({
      category: 'Kỹ thuật & Phân tích',
      careers: [
        'Kỹ sư phần mềm / Lập trình viên',
        'Chuyên viên phân tích dữ liệu',
        'Kế toán / Kiểm toán viên',
        'Kỹ sư (Cơ khí, Điện, Xây dựng)',
        'Chuyên gia phân tích tài chính',
        'Chuyên viên kiểm định chất lượng',
      ],
      reason:
        'Tận Tâm cao đảm bảo độ chính xác và khả năng làm việc độc lập, trong khi Hướng Nội giúp bạn tập trung sâu vào công việc kỹ thuật.',
      strengths: [
        'Chú ý đến chi tiết',
        'Làm việc độc lập hiệu quả',
        'Kiên trì với các nhiệm vụ phức tạp',
      ],
      developmentAreas: [
        'Phát triển kỹ năng thuyết trình',
        'Tăng cường hợp tác với đội nhóm',
      ],
    })
  }

  // Pattern 5: High O + Low C = Creative & Artistic
  if (
    (domainLevels.O === 'high' || domainLevels.O === 'very-high') &&
    (domainLevels.C === 'low' || domainLevels.C === 'very-low')
  ) {
    recommendations.push({
      category: 'Sáng tạo & Nghệ thuật',
      careers: [
        'Nghệ sĩ (Họa sĩ, Nhạc sĩ, Nhà văn)',
        'Nhà thiết kế đồ họa',
        'Người sáng tạo nội dung',
        'Nhiếp ảnh gia / Đạo diễn',
        'Nhà sáng tạo quảng cáo',
        'Nhà thiết kế trò chơi',
      ],
      reason:
        'Cởi Mở cao mang lại sự sáng tạo và tư duy phi truyền thống, trong khi Tận Tâm thấp cho phép linh hoạt và tự do trong quy trình làm việc.',
      strengths: [
        'Sáng tạo và độc đáo',
        'Linh hoạt thích nghi',
        'Tư duy đột phá không theo khuôn mẫu',
      ],
      developmentAreas: [
        'Phát triển kỹ năng quản lý thời gian',
        'Học cách hoàn thành dự án đúng deadline',
      ],
    })
  }

  // Pattern 6: Low N + High C = High-Pressure Roles
  if (
    (domainLevels.N === 'low' || domainLevels.N === 'very-low') &&
    (domainLevels.C === 'high' || domainLevels.C === 'very-high')
  ) {
    recommendations.push({
      category: 'Môi trường áp lực cao',
      careers: [
        'Bác sĩ phẫu thuật',
        'Phi công',
        'Cảnh sát / Lính cứu hỏa',
        'Nhà giao dịch tài chính',
        'Quản lý dự án lớn',
        'Quản lý ứng phó khẩn cấp',
      ],
      reason:
        'Bất Ổn Cảm Xúc thấp (ổn định tâm lý) kết hợp với Tận Tâm cao tạo ra khả năng làm việc hiệu quả trong các tình huống stress cao.',
      strengths: [
        'Bình tĩnh trong khủng hoảng',
        'Ra quyết định nhanh dưới áp lực',
        'Không bị cảm xúc chi phối',
      ],
      developmentAreas: [
        'Cẩn thận không đánh giá thấp rủi ro',
        'Chú ý đến cảm xúc của người khác',
      ],
    })
  }

  // Default recommendation nếu không có pattern rõ ràng
  if (recommendations.length === 0) {
    recommendations.push({
      category: 'Nghề nghiệp linh hoạt',
      careers: [
        'Quản lý dự án',
        'Chuyên viên phân tích kinh doanh',
        'Tư vấn viên',
        'Giáo viên',
        'Hành chính văn phòng',
      ],
      reason:
        'Tính cách của bạn cân bằng, phù hợp với nhiều loại công việc. Hãy khám phá dựa trên sở thích cá nhân.',
      strengths: ['Khả năng thích nghi', 'Làm việc tốt trong nhiều môi trường'],
      developmentAreas: ['Xác định rõ đam mê và mục tiêu dài hạn'],
    })
  }

  return recommendations
}

// ============================================
// MENTAL HEALTH INSIGHTS
// ============================================

export interface MentalHealthInsight {
  type: 'risk' | 'strength' | 'neutral'
  title: string
  description: string
  recommendations: string[]
}

/**
 * Phân tích sức khỏe tinh thần và risk factors
 * Based on: Angelini (2023), Kotov et al. (2010)
 */
export function getMentalHealthInsights(score: BFI2Score): MentalHealthInsight[] {
  const insights: MentalHealthInsight[] = []

  const { domains, tScores, facets } = score
  const domainLevels = {
    E: interpretTScore(tScores.domains.E).level,
    A: interpretTScore(tScores.domains.A).level,
    C: interpretTScore(tScores.domains.C).level,
    N: interpretTScore(tScores.domains.N).level,
    O: interpretTScore(tScores.domains.O).level,
  }

  // Risk Pattern 1: High N + High C = Burnout Risk
  if (
    (domainLevels.N === 'high' || domainLevels.N === 'very-high') &&
    (domainLevels.C === 'high' || domainLevels.C === 'very-high')
  ) {
    insights.push({
      type: 'risk',
      title: '⚠️ Nguy cơ kiệt sức',
      description:
        'Sự kết hợp giữa Bất Ổn Cảm Xúc cao (dễ lo âu) và Tận Tâm cao (luôn cầu toàn) tạo ra nguy cơ kiệt sức cao. Bạn có thể là người làm việc xuất sắc nhưng thường lo lắng về sự hoàn hảo.',
      recommendations: [
        '🎯 Xác định rõ nguồn gốc stress: Liệt kê 3 điều gây áp lực nhất (CBT: Concrete problem identification)',
        '🔍 Phân tích xem đâu là yêu cầu thực sự, đâu là tự áp đặt (Cognitive restructuring)',
        '📊 Ưu tiên công việc theo ma trận Eisenhower (quan trọng vs khẩn cấp) (Problem-Solving Therapy)',
        '🗣️ Thảo luận với quản lý về khối lượng công việc thực tế (Assertive communication skills)',
        '⚖️ Đàm phán lại deadline hoặc phân phối lại nhiệm vụ (Behavioral change: modify environment)',
        '💬 Tìm kiếm hỗ trợ chuyên môn (CBT/ACT therapist) để giải quyết vấn đề gốc rễ',
      ],
    })
  }

  // Risk Pattern 2: High N + Low E = Social Anxiety & Depression Risk
  if (
    (domainLevels.N === 'high' || domainLevels.N === 'very-high') &&
    (domainLevels.E === 'low' || domainLevels.E === 'very-low')
  ) {
    insights.push({
      type: 'risk',
      title: '⚠️ Nguy cơ lo âu xã hội và trầm cảm',
      description:
        'Bất Ổn Cảm Xúc cao kết hợp với Hướng Nội có thể dẫn đến cảm giác cô đơn và lo âu trong các tình huống xã hội.',
      recommendations: [
        '🔍 Xác định tình huống xã hội nào gây lo âu cụ thể (họp nhóm, gặp người lạ, nói trước đám đông) (CBT: Trigger identification)',
        '🎯 Phân tích nguyên nhân: Sợ bị đánh giá? Thiếu kỹ năng? Kinh nghiệm tiêu cực trước đây? (Cognitive analysis)',
        '📚 Học kỹ năng giao tiếp cụ thể cho tình huống đó (Skills training: conversation, assertiveness)',
        '🎭 Luyện tập với người tin cậy trước khi thử tình huống thật (Exposure therapy: graded hierarchy)',
        '💼 Tìm môi trường làm việc phù hợp với người hướng nội (Behavioral: modify environment)',
        '🩺 Tư vấn tâm lý CBT để xử lý trauma hoặc niềm tin tiêu cực về bản thân (Cognitive restructuring)',
      ],
    })
  }

  // Strength Pattern 1: Low N + High E = Emotional Resilience
  if (
    (domainLevels.N === 'low' || domainLevels.N === 'very-low') &&
    (domainLevels.E === 'high' || domainLevels.E === 'very-high')
  ) {
    insights.push({
      type: 'strength',
      title: '✅ Khả năng phục hồi cảm xúc cao',
      description:
        'Bạn có khả năng phục hồi tuyệt vời sau khó khăn. Sự ổn định cảm xúc và năng lượng tích cực giúp bạn vượt qua stress hiệu quả.',
      recommendations: [
        '🎯 Sử dụng năng lượng tích cực để hỗ trợ người khác (Behavioral: leverage strengths)',
        '💼 Phát huy thế mạnh trong các vai trò lãnh đạo (Career: match strengths to role)',
        '⚠️ Chú ý không đánh giá thấp căng thẳng của người khác (Social skills: empathy development)',
        '🧠 Duy trì thói quen: 7-9h ngủ, 150min exercise/tuần, dinh dưỡng cân bằng (Neuroscience: maintain brain health)',
      ],
    })
  }

  // Strength Pattern 2: High A + High O = Social Tolerance & Open-mindedness
  if (
    (domainLevels.A === 'high' || domainLevels.A === 'very-high') &&
    (domainLevels.O === 'high' || domainLevels.O === 'very-high')
  ) {
    insights.push({
      type: 'strength',
      title: '✅ Khoan dung và cởi mở cao',
      description:
        'Bạn có khả năng chấp nhận sự khác biệt và giảm thiểu định kiến. Điều này tạo ra mối quan hệ xã hội tốt và giảm xung đột.',
      recommendations: [
        '🌍 Tham gia các hoạt động đa văn hóa',
        '🤝 Đóng vai trò hòa giải trong nhóm',
        '📚 Chia sẻ quan điểm cởi mở với cộng đồng',
      ],
    })
  }

  // Risk Pattern 3: Low C + High N = Procrastination & Anxiety Loop
  if (
    (domainLevels.C === 'low' || domainLevels.C === 'very-low') &&
    (domainLevels.N === 'high' || domainLevels.N === 'very-high')
  ) {
    insights.push({
      type: 'risk',
      title: '⚠️ Vòng luẩn quẩn trì hoãn - lo âu',
      description:
        'Tận Tâm thấp dẫn đến trì hoãn, sau đó gây ra lo âu về deadline, tạo thành vòng luẩn quẩn tiêu cực.',
      recommendations: [
        '📅 Sử dụng Pomodoro Technique (25 phút tập trung)',
        '✂️ Chia công việc lớn thành tasks nhỏ',
        '🎯 Set deadline sớm hơn thực tế 2-3 ngày',
        '🤝 Tìm accountability partner',
        '🏆 Reward bản thân sau mỗi milestone',
      ],
    })
  }

  // Facet-specific: High Anxiety facet
  if (facets.Anx > 3.5) {
    insights.push({
      type: 'risk',
      title: '⚠️ Mức độ lo âu cao',
      description: 'Khía cạnh Lo Âu của bạn cao hơn mức trung bình.',
      recommendations: [
        '📝 Ghi chép 3 điều lo lắng nhất → phân loại: Thực tế vs Tưởng tượng (CBT: Worry categorization)',
        '🔍 Với lo âu thực tế: Lập kế hoạch hành động cụ thể để giải quyết (Problem-Solving Therapy)',
        '💭 Với lo âu tưởng tượng: Thách thức bằng câu hỏi "Bằng chứng nào hỗ trợ suy nghĩ này?" (Cognitive restructuring)',
        '🗣️ Nói chuyện với người có kinh nghiệm đã vượt qua tình huống tương tự (Social modeling)',
        '🎯 Tập trung vào những gì kiểm soát được, chấp nhận những gì không thể thay đổi (ACT: Control vs acceptance)',
        '💊 Nếu lo âu ảnh hưởng nghiêm trọng đến cuộc sống: Gặp bác sĩ tâm thần để đánh giá (CBT, medication if needed)',
      ],
    })
  }

  // Facet-specific: High Depression facet
  if (facets.Dep > 3.5) {
    insights.push({
      type: 'risk',
      title: '⚠️ Có dấu hiệu trầm cảm',
      description: 'Khía cạnh Trầm Cảm của bạn cao hơn mức trung bình.',
      recommendations: [
        '🩺 NÊN GẶP chuyên gia sức khỏe tâm thần (CBT/Medication evaluation)',
        '☀️ Ánh sáng mặt trời buổi sáng 30min (Circadian rhythm regulation, increases serotonin)',
        '💬 Kết nối với support groups (Social activation, reduces isolation)',
        '🎯 Behavioral activation: Lên lịch hoạt động thú vị REGARDLESS of motivation (BA protocol)',
        '🏃 Exercise 30min x3/tuần: Hiệu quả ngang antidepressant cho trầm cảm nhẹ (Neuroscience: BDNF increase)',
      ],
    })
  }

  // LUÔN thêm insights tổng quan dựa trên từng domain
  // Domain N (Negative Emotionality)
  if (domainLevels.N === 'very-high') {
    if (insights.length === 0 || !insights.some(i => i.title.includes('cảm xúc'))) {
      insights.push({
        type: 'risk',
        title: '⚠️ Cần chú ý sức khỏe cảm xúc',
        description:
          'Điểm Bất Ổn Cảm Xúc của bạn rất cao. Bạn có thể thường xuyên cảm thấy lo âu, căng thẳng hoặc buồn bã. Đây là điều hoàn toàn bình thường và có thể cải thiện được.',
        recommendations: [
          '📊 Theo dõi cảm xúc: Ghi lại tình huống → Cảm xúc → Suy nghĩ → Hành động (CBT: Thought record)',
          '🔍 Nhận diện patterns: Tình huống nào thường gây cảm xúc tiêu cực? (Behavioral analysis)',
          '🎯 Giải quyết vấn đề gốc: Nếu stress từ công việc → Đàm phán workload; Nếu từ mối quan hệ → Giao tiếp rõ ràng (Problem-Solving Therapy)',
          '🗣️ Học kỹ năng giải quyết xung đột và đàm phán (Skills training: assertiveness, communication)',
          '💼 Thay đổi hoàn cảnh nếu cần: Đổi công việc, môi trường sống, vòng tròn bạn bè (Behavioral: modify environment)',
          '🩺 Tư vấn CBT/DBT để xác định và xử lý nguyên nhân sâu xa (trauma, cognitive distortions)',
        ],
      })
    }
  } else if (domainLevels.N === 'very-low') {
    insights.push({
      type: 'strength',
      title: '✅ Sức khỏe cảm xúc rất tốt',
      description:
        'Bạn có khả năng quản lý cảm xúc xuất sắc, hiếm khi lo âu hay căng thẳng. Đây là một điểm mạnh lớn giúp bạn đối mặt với thử thách.',
      recommendations: [
        '💪 Sử dụng sự ổn định này để hỗ trợ người khác',
        '⚠️ Chú ý không đánh giá thấp stress của người xung quanh',
        '🎯 Phát huy trong các vai trò lãnh đạo hoặc làm việc dưới áp lực',
      ],
    })
  }

  // Domain E (Extraversion) - ảnh hưởng đến nhu cầu xã hội
  if (domainLevels.E === 'very-low' && !insights.some(i => i.title.includes('cô đơn'))) {
    insights.push({
      type: 'neutral',
      title: '💡 Nhu cầu không gian riêng tư',
      description:
        'Bạn là người hướng nội mạnh. Bạn nạp năng lượng từ thời gian ở một mình, không phải từ tương tác xã hội.',
      recommendations: [
        '🏡 Đảm bảo có thời gian riêng tư mỗi ngày để "recharge"',
        '👥 Giới hạn các hoạt động xã hội lớn (chọn lọc sự kiện quan trọng)',
        '📚 Tận hưởng các hoạt động độc lập: đọc sách, nghe nhạc, suy ngẫm',
        '⚖️ Cân bằng giữa một mình và duy trì mối quan hệ thân thiết',
      ],
    })
  } else if (domainLevels.E === 'very-high') {
    insights.push({
      type: 'neutral',
      title: '💡 Nhu cầu kết nối xã hội cao',
      description:
        'Bạn là người hướng ngoại mạnh. Bạn nạp năng lượng từ tương tác với người khác và cảm thấy thoải mái trong đám đông.',
      recommendations: [
        '👥 Tham gia các hoạt động nhóm, câu lạc bộ, cộng đồng',
        '⚖️ Cân bằng giữa giao lưu và thời gian nghỉ ngơi',
        '🏃 Kết hợp thể thao nhóm thay vì tập một mình',
        '💼 Lựa chọn công việc có nhiều tương tác với người',
      ],
    })
  }

  // Domain C (Conscientiousness) - ảnh hưởng đến stress
  if (domainLevels.C === 'very-high' && domainLevels.N === 'high') {
    if (!insights.some(i => i.title.includes('kiệt sức'))) {
      insights.push({
        type: 'risk',
        title: '⚠️ Nguy cơ kiệt sức cao',
        description:
          'Sự kết hợp giữa Tận Tâm rất cao (luôn cầu toàn) và Bất Ổn Cảm Xúc cao (dễ lo âu) tạo ra nguy cơ kiệt sức đáng kể.',
        recommendations: [
          '🔍 Xác định nguồn gốc cầu toàn: Kỳ vọng của ai? (Bản thân/Sếp/Xã hội/Gia đình) (CBT: Identify cognitive distortions)',
          '💬 Thảo luận rõ ràng về tiêu chuẩn "đủ tốt" với quản lý/khách hàng (Communication skills: clarity)',
          '📊 Áp dụng 80/20 rule: Tập trung vào 20% công việc tạo 80% giá trị (Behavioral: prioritization)',
          '⚖️ Đàm phán lại deadline hoặc giảm phạm vi dự án (Assertiveness training)',
          '🗣️ Học kỹ năng giao tiếp assertive để từ chối yêu cầu không hợp lý (Skills training)',
          '💼 Nếu môi trường làm việc toxic: Xem xét đổi công ty/ngành nghề (Behavioral: change environment)',
        ],
      })
    }
  }

  // Nếu vẫn chưa có insights nào, thêm message tích cực chung
  if (insights.length === 0) {
    insights.push({
      type: 'strength',
      title: '✅ Tính cách cân bằng',
      description:
        'Profile tính cách của bạn tương đối cân bằng, không có yếu tố nguy cơ nổi bật. Đây là một dấu hiệu tốt cho sức khỏe tinh thần.',
      recommendations: [
        '🎯 Đặt mục tiêu SMART (Specific, Measurable, Achievable, Relevant, Time-bound) cho từng lĩnh vực',
        '📊 Xây dựng kế hoạch hành động: Chia mục tiêu thành bước nhỏ hàng tuần (Behavioral activation)',
        '💬 Duy trì giao tiếp thẳng thắn và xây dựng (Communication skills: assertiveness)',
        '🔍 Định kỳ đánh giá lại và điều chỉnh hướng đi (Evidence-based review)',
        '📚 Học kỹ năng mới phục vụ mục tiêu dài hạn (Skills development)',
      ],
    })
  }

  return insights
}

// ============================================
// LEARNING STYLE RECOMMENDATIONS
// ============================================

export interface LearningStyleRecommendation {
  overallStyle: string // Phong cách tổng quan
  dimensions: {
    // 3 chiều độc lập của phong cách học
    social: string // "Xã hội" hoặc "Độc lập"
    cognitive: string // "Trừu tượng" hoặc "Cụ thể"
    structure: string // "Có kế hoạch" hoặc "Linh hoạt"
  }
  description: string // Mô tả chi tiết
  researchBasis: string // Cơ sở nghiên cứu
  strengths: string[] // Điểm mạnh trong học tập
  challenges: string[] // Thách thức cần lưu ý
  bestMethods: string[] // Phương pháp học tốt nhất
  avoidMethods: string[] // Phương pháp nên tránh
  studyEnvironment: string[] // Môi trường học tập lý tưởng
  timeManagement: string[] // Quản lý thời gian
  examPreparation: string[] // Chuẩn bị thi cử
}

/**
 * Gợi ý phong cách học tập dựa trên Big Five với research chi tiết
 *
 * Nghiên cứu khoa học nền tảng:
 * - Komarraju et al. (2011): Big Five và học tập đại học
 * - Vedel (2014): Meta-analysis của Big Five và thành tích học tập
 * - Mammadov (2022): Learning styles và Big Five personality
 * - Bidjerano & Dai (2007): Self-regulated learning và personality
 * - Chamorro-Premuzic & Furnham (2008): Personality và phong cách học
 */
export function getLearningStyleRecommendations(score: BFI2Score): LearningStyleRecommendation {
  const { domains, tScores, facets } = score
  const domainLevels = {
    E: interpretTScore(tScores.domains.E).level,
    O: interpretTScore(tScores.domains.O).level,
    C: interpretTScore(tScores.domains.C).level,
    A: interpretTScore(tScores.domains.A).level,
    N: interpretTScore(tScores.domains.N).level,
  }

  // XÁC ĐỊNH 3 CHIỀU CỦA PHONG CÁCH HỌC
  // Chiều 1: Xã hội (E) vs Độc lập
  const isHighE = domainLevels.E === 'high' || domainLevels.E === 'very-high'
  const isLowE = domainLevels.E === 'low' || domainLevels.E === 'very-low'
  const socialDimension = isHighE ? 'Học qua tương tác xã hội' : isLowE ? 'Học độc lập' : 'Linh hoạt xã hội'

  // Chiều 2: Trừu tượng (O) vs Cụ thể
  const isHighO = domainLevels.O === 'high' || domainLevels.O === 'very-high'
  const isLowO = domainLevels.O === 'low' || domainLevels.O === 'very-low'
  const cognitiveDimension = isHighO ? 'Tư duy trừu tượng' : isLowO ? 'Tư duy cụ thể' : 'Cân bằng nhận thức'

  // Chiều 3: Có kế hoạch (C) vs Linh hoạt
  const isHighC = domainLevels.C === 'high' || domainLevels.C === 'very-high'
  const isLowC = domainLevels.C === 'low' || domainLevels.C === 'very-low'
  const structureDimension = isHighC ? 'Có kế hoạch chặt chẽ' : isLowC ? 'Linh hoạt tự phát' : 'Cân bằng cấu trúc'

  // Tạo tên phong cách tổng quan
  const overallStyle = `${socialDimension} • ${cognitiveDimension} • ${structureDimension}`

  // MÔ TẢ VÀ CƠ SỞ KHOA HỌC
  let description = ''
  let researchBasis = ''

  if (isHighE && isHighO && isHighC) {
    description =
      'Bạn là người học tốt nhất khi kết hợp làm việc nhóm, khám phá ý tưởng sáng tạo, và có kế hoạch rõ ràng. Bạn vừa năng động xã hội, vừa ham học hỏi, vừa kỷ luật.'
    researchBasis =
      'Nghiên cứu của Komarraju et al. (2011) cho thấy sự kết hợp E+O+C dự báo thành tích học tập xuất sắc trong môi trường đại học.'
  } else if (isLowE && isHighO && isHighC) {
    description =
      'Bạn là người học sâu độc lập. Bạn thích nghiên cứu một mình, khám phá ý tưởng phức tạp, và theo kế hoạch chặt chẽ. Đây là phong cách của các nhà nghiên cứu.'
    researchBasis =
      'Vedel (2014) phát hiện O+C là predictor mạnh nhất của GPA, đặc biệt trong các ngành khoa học và nghệ thuật.'
  } else if (isHighE && isLowO && isHighC) {
    description =
      'Bạn học tốt qua làm việc nhóm với cấu trúc rõ ràng. Bạn thích phương pháp thực hành, có kế hoạch, và tương tác với bạn bè.'
    researchBasis =
      'Chamorro-Premuzic & Furnham (2008) cho thấy nhóm này thành công trong học tập theo nhóm có tổ chức.'
  } else if (isLowE && isHighO) {
    description =
      'Bạn là người tư duy độc lập và sâu sắc. Bạn thích đọc sách, suy ngẫm, và khám phá ý tưởng trừu tượng một mình.'
    researchBasis =
      'Bidjerano & Dai (2007): Người hướng nội + cởi mở có khả năng self-regulated learning cao.'
  } else if (isHighC) {
    description =
      'Bạn là người học có kỷ luật và kế hoạch. Bạn cần cấu trúc, deadline và môi trường ngăn nắp để đạt hiệu quả cao nhất.'
    researchBasis = 'C là predictor mạnh nhất của thành tích học tập qua nhiều nghiên cứu meta-analysis.'
  } else {
    description =
      'Bạn có phong cách học cân bằng, linh hoạt thích nghi với nhiều phương pháp khác nhau.'
    researchBasis =
      'Profile cân bằng cho phép bạn phát huy thế mạnh của nhiều phương pháp học tập khác nhau.'
  }

  // ĐIỂM MẠNH
  const strengths: string[] = []
  if (isHighC) strengths.push('Kỷ luật và kiên trì', 'Hoàn thành đúng hạn', 'Tổ chức tốt')
  if (isHighO) strengths.push('Tư duy sáng tạo', 'Hiểu khái niệm nhanh', 'Kết nối ý tưởng tốt')
  if (isHighE) strengths.push('Học qua thảo luận', 'Giải thích cho người khác', 'Động lực từ nhóm')
  if (isLowE) strengths.push('Tập trung sâu', 'Nghiên cứu độc lập', 'Không bị phân tâm')
  if (strengths.length === 0) strengths.push('Linh hoạt thích nghi', 'Học đa dạng phương pháp')

  // THÁCH THỨC
  const challenges: string[] = []
  if (domainLevels.N === 'high' || domainLevels.N === 'very-high') {
    challenges.push('Lo âu khi thi cử', 'Căng thẳng khi học nhóm')
  }
  if (isLowC) challenges.push('Trì hoãn công việc', 'Khó theo kế hoạch dài hạn')
  if (isHighC && domainLevels.N === 'high') challenges.push('Stress khi không đạt hoàn hảo')
  if (isLowE) challenges.push('Khó hòa nhập nhóm học tập', 'Ít cơ hội networking')
  if (isLowO) challenges.push('Khó với lý thuyết trừu tượng', 'Cần ví dụ cụ thể')

  // PHƯƠNG PHÁP TỐT NHẤT
  const bestMethods: string[] = []
  if (isHighE) {
    bestMethods.push(
      '👥 Nhóm học tập 3-5 người (study groups)',
      '🗣️ Giảng dạy lại cho bạn bè (peer teaching)',
      '💬 Thảo luận và tranh luận (debate)',
      '🎤 Thuyết trình và trình bày'
    )
  }
  if (isLowE) {
    bestMethods.push(
      '📚 Đọc sách và nghiên cứu độc lập',
      '🎧 Nghe bài giảng và podcast',
      '✍️ Viết tóm tắt và ghi chú chi tiết',
      '🏠 Học trong không gian yên tĩnh'
    )
  }
  if (isHighO) {
    bestMethods.push(
      '🗺️ Vẽ sơ đồ tư duy (mind mapping)',
      '🔗 Kết nối lý thuyết với thực tế',
      '❓ Đặt câu hỏi "Tại sao?" và "Nếu?"',
      '📖 Đọc tài liệu mở rộng ngoài giáo trình'
    )
  }
  if (isLowO) {
    bestMethods.push(
      '📝 Làm bài tập thực hành nhiều',
      '🎯 Học qua ví dụ cụ thể và case study',
      '👨‍🏫 Theo hướng dẫn từng bước (step-by-step)',
      '🔁 Lặp lại và thực hành (drill & practice)'
    )
  }
  if (isHighC) {
    bestMethods.push(
      '📅 Lập lịch học cụ thể cho từng tuần',
      '✅ Sử dụng checklist và theo dõi tiến độ',
      '🃏 Thẻ ghi nhớ và ôn tập có khoảng cách (spaced repetition)',
      '🏛️ Môi trường học ngăn nắp, không lộn xộn'
    )
  }
  if (isLowC) {
    bestMethods.push(
      '🎨 Học qua dự án và trải nghiệm (project-based)',
      '🔀 Xen kẽ nhiều môn học (interleaving)',
      '🎥 Tài liệu phi chính thức (YouTube, blog)',
      '🧪 Thử nghiệm và khám phá tự do'
    )
  }

  // PHƯƠNG PHÁP NÊN TRÁNH
  const avoidMethods: string[] = []
  if (isHighE) avoidMethods.push('Học một mình trong thời gian dài', 'Đọc im lặng không tương tác')
  if (isLowE) avoidMethods.push('Thuyết trình nhiều trước đám đông', 'Làm việc nhóm bắt buộc liên tục')
  if (isHighO) avoidMethods.push('Học vẹt không hiểu (rote memorization)', 'Bài tập lặp đi lặp lại không suy ngẫm')
  if (isLowO) avoidMethods.push('Lý thuyết trừu tượng không ví dụ', 'Triết học quá phức tạp')
  if (isHighC) avoidMethods.push('Học tự phát không kế hoạch', 'Deadline mơ hồ không rõ ràng')
  if (isLowC) avoidMethods.push('Lịch học quá cứng nhắc', 'Yêu cầu hoàn hảo mọi chi tiết')

  // MÔI TRƯỜNG HỌC TẬP LÝ TƯỞNG
  const studyEnvironment: string[] = []
  if (isHighE) {
    studyEnvironment.push('🏫 Thư viện nhóm hoặc quán cà phê (có người)', '💡 Không gian mở, năng lượng cao')
  } else if (isLowE) {
    studyEnvironment.push('🏠 Phòng riêng yên tĩnh', '🤫 Không bị làm phiền, cách ly')
  } else {
    studyEnvironment.push('⚖️ Cân bằng giữa yên tĩnh và năng lượng')
  }
  if (isHighC) {
    studyEnvironment.push('🗂️ Bàn học ngăn nắp, có tổ chức', '📌 Lịch trình và to-do list rõ ràng')
  }
  if (domainLevels.N === 'low' || domainLevels.N === 'very-low') {
    studyEnvironment.push('🎵 Có thể có nhạc nền nhẹ')
  }

  // QUẢN LÝ THỜI GIAN
  const timeManagement: string[] = []
  if (isHighC) {
    timeManagement.push(
      '⏰ Pomodoro Technique: Học 25 phút, nghỉ 5 phút',
      '📊 Time blocking: Phân bổ thời gian cụ thể cho từng môn',
      '✅ Hoàn thành task quan trọng vào buổi sáng',
      '📝 Review tiến độ mỗi cuối tuần'
    )
  } else if (isLowC) {
    timeManagement.push(
      '🎯 Đặt mục tiêu ngắn hạn (hôm nay làm gì)',
      '⏳ Sử dụng timer để tạo cảm giác cấp bách',
      '🔔 Nhắc nhở bằng app hoặc alarm',
      '🏆 Thưởng cho bản thân sau khi hoàn thành'
    )
  } else {
    timeManagement.push('⚖️ Kết hợp kế hoạch và linh hoạt', '📅 Lịch học có thể điều chỉnh')
  }

  // CHUẨN BỊ THI CỬ
  const examPreparation: string[] = []
  if (isHighC) {
    examPreparation.push(
      '📅 Bắt đầu ôn tập trước 2-3 tuần',
      '📋 Tạo study guide chi tiết',
      '🔄 Ôn theo lịch trình có kế hoạch',
      '✅ Practice tests nhiều lần'
    )
  } else {
    examPreparation.push(
      '⚡ Học tập trung trong 3-5 ngày cuối',
      '🎯 Tập trung vào điểm chính (80/20 rule)',
      '👥 Học nhóm để tăng động lực',
      '📝 Làm đề cũ để làm quen'
    )
  }
  if (domainLevels.N === 'high' || domainLevels.N === 'very-high') {
    examPreparation.push(
      '🎯 Chuẩn bị kỹ càng để tự tin: Làm đủ đề, nắm vững kiến thức',
      '📝 Viết ra worst-case scenario và cách đối phó → Giảm lo âu về điều chưa biết',
      '💪 Nhắc nhở bản thân: "Tôi đã chuẩn bị tốt, tôi có thể làm được"',
      '😴 Ngủ đủ giấc để não bộ hoạt động tốt nhất',
      '🎬 Hình dung tình huống thi thành công để xây dựng tự tin'
    )
  }
  if (isHighE) {
    examPreparation.push('👥 Ôn tập nhóm giúp củng cố kiến thức')
  } else {
    examPreparation.push('🏠 Tự ôn trong môi trường yên tĩnh')
  }

  return {
    overallStyle,
    dimensions: {
      social: socialDimension,
      cognitive: cognitiveDimension,
      structure: structureDimension,
    },
    description,
    researchBasis,
    strengths,
    challenges,
    bestMethods,
    avoidMethods,
    studyEnvironment,
    timeManagement,
    examPreparation,
  }
}

// ============================================
// RELATIONSHIP & COMMUNICATION INSIGHTS
// ============================================

export interface RelationshipInsight {
  communicationStyle: string
  conflictStyle: string
  strengths: string[]
  challenges: string[]
  tips: string[]
}

/**
 * Phân tích phong cách giao tiếp và quan hệ
 */
export function getRelationshipInsights(score: BFI2Score): RelationshipInsight {
  const { domains, tScores, facets } = score
  const domainLevels = {
    E: interpretTScore(tScores.domains.E).level,
    A: interpretTScore(tScores.domains.A).level,
    N: interpretTScore(tScores.domains.N).level,
  }

  let communicationStyle = ''
  let conflictStyle = ''
  const strengths: string[] = []
  const challenges: string[] = []
  const tips: string[] = []

  // Communication Style
  if (domainLevels.E === 'high' || domainLevels.E === 'very-high') {
    communicationStyle = 'Expressive & Outgoing (Biểu cảm và cởi mở)'
    strengths.push('Giao tiếp rõ ràng và tự tin', 'Dễ dàng kết nối với người mới')
    challenges.push('Có thể nói nhiều hơn lắng nghe')
  } else {
    communicationStyle = 'Reserved & Thoughtful (Kín đáo và suy nghĩ)'
    strengths.push('Lắng nghe tốt', 'Suy nghĩ kỹ trước khi nói')
    challenges.push('Có thể khó bày tỏ cảm xúc')
  }

  // Conflict Style
  if (domainLevels.A === 'high' || domainLevels.A === 'very-high') {
    conflictStyle = 'Accommodating & Compromising (Điều chỉnh và thỏa hiệp)'
    strengths.push('Giải quyết xung đột hòa bình', 'Thấu cảm với quan điểm người khác')
    challenges.push('Có thể bỏ qua nhu cầu bản thân')
    tips.push('Học cách assertive khi cần thiết', 'Đặt boundaries rõ ràng')
  } else {
    conflictStyle = 'Direct & Competitive (Trực tiếp và cạnh tranh)'
    strengths.push('Nói thẳng vấn đề', 'Không sợ confrontation')
    challenges.push('Có thể gây tổn thương cảm xúc người khác')
    tips.push('Thực hành empathy', 'Lựa chọn từ ngữ nhẹ nhàng hơn')
  }

  // Emotional Expression
  if (domainLevels.N === 'high' || domainLevels.N === 'very-high') {
    strengths.push('Nhạy cảm với cảm xúc của người khác')
    challenges.push('Có thể overreact trong xung đột')
    tips.push(
      'Thực hành emotional regulation',
      'Pause trước khi respond khi tức giận'
    )
  } else {
    strengths.push('Bình tĩnh trong các tình huống căng thẳng')
    challenges.push('Có thể bị cho là "lạnh lùng"')
    tips.push('Chia sẻ cảm xúc nhiều hơn với người thân')
  }

  // Facet-specific: Trust
  if (facets.Tru < 2.5) {
    challenges.push('Khó tin tưởng người khác')
    tips.push('Thử "trust but verify" approach', 'Chữa lành past traumas nếu có')
  }

  // Facet-specific: Compassion
  if (facets.Com > 4.0) {
    strengths.push('Rất quan tâm và chăm sóc người khác')
    challenges.push('Dễ bị kiệt sức cảm xúc')
    tips.push('Chăm sóc bản thân là ưu tiên', 'Học cách nói "không"')
  }

  return {
    communicationStyle,
    conflictStyle,
    strengths,
    challenges,
    tips,
  }
}
