/**
 * BFI-2 Counseling Service
 * Tư vấn dựa trên profile Big Five: Career, Mental Health, Relationships, Learning
 */

import { BFI2_DOMAINS, BFI2_FACETS, type BFI2Score } from '@/constants/tests/bfi2-questions'
import { interpretTScore } from './bfi2-scoring.service'
import { BaseService } from './base.service'

// ============================================
// INTERFACES
// ============================================

export interface CareerRecommendation {
  category: string
  careers: string[]
  reason: string
  strengths: string[]
  developmentAreas: string[]
}

export interface MentalHealthInsight {
  type: 'risk' | 'strength' | 'neutral'
  title: string
  description: string
  recommendations: string[]
}

export interface LearningStyleRecommendation {
  overallStyle: string
  dimensions: {
    social: string
    cognitive: string
    structure: string
  }
  description: string
  researchBasis: string
  strengths: string[]
  challenges: string[]
  bestMethods: string[]
  avoidMethods: string[]
  studyEnvironment: string[]
  timeManagement: string[]
  examPreparation: string[]
}

export interface RelationshipInsight {
  communicationStyle: string
  conflictStyle: string
  strengths: string[]
  challenges: string[]
  tips: string[]
}

export interface SportsRecommendation {
  category: string
  activities: string[]
  reason: string
  benefits: string[]
  tips: string[]
}

export interface HobbyRecommendation {
  category: string
  hobbies: string[]
  reason: string
  benefits: string[]
  tips: string[]
}

export interface MusicInstrumentRecommendation {
  category: string
  instruments: string[]
  reason: string
  benefits: string[]
  learningTips: string[]
  researchBacking: string
}

export class BFI2CounselingService extends BaseService {
  /**
   * Tư vấn hướng nghiệp dựa trên Big Five profile
   * Based on: Mammadov (2022), Roberts et al. (2007)
   */
  getCareerCounseling(score: BFI2Score): CareerRecommendation[] {
    const recommendations: CareerRecommendation[] = []

    const { tScores } = score
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

  /**
   * Phân tích sức khỏe tinh thần và risk factors
   * Based on: Angelini (2023), Kotov et al. (2010)
   */
  getMentalHealthInsights(score: BFI2Score): MentalHealthInsight[] {
    const insights: MentalHealthInsight[] = []

    const { tScores, facets } = score
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
          'Bất Ổn Cảm Xúc cao kết hợp with Hướng Nội có thể dẫn đến cảm giác cô đơn và lo âu trong các tình huống xã hội.',
        recommendations: [
          '🔍 Xác định tình huống xã hội nào gây lo âu cụ thể (họp nhóm, gặp người lạ, nói trước đám đông) (CBT: Trigger identification)',
          '🎯 Phân tích nguyên nhân: Sợ bị đánh giá? Thiếu kỹ năng? Kinh nghiệm tiêu cực trước đây? (Cognitive analysis)',
          '📚 Học kỹ năng giao tiếp cụ thể cho tình huống đó (Skills training: conversation, assertiveness)',
          '🎭 Luyện tập với người tin cậy trước khi thử tình huống thật (Exposure therapy: graded hierarchy)',
          '💼 Tìm môi trường làm việc phù hợp with người hướng nội (Behavioral: modify environment)',
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
          '📚 Chia sẻ quan điểm cởi mở with cộng đồng',
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
          '🗣️ Nói chuyện with người có kinh nghiệm đã vượt qua tình huống tương tự (Social modeling)',
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
          '💬 Kết nối with support groups (Social activation, reduces isolation)',
          '🎯 Behavioral activation: Lên lịch hoạt động thú vị REGARDLESS of motivation (BA protocol)',
          '🏃 Exercise 30min x3/tuần: Hiệu quả ngang antidepressant cho trầm cảm nhẹ (Neuroscience: BDNF increase)',
        ],
      })
    }

    // LUÔN thêm insights tổng quan dựa trên từng domain
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
          'Bạn có khả năng quản lý cảm xúc xuất sắc, hiếm khi lo âu hay căng thẳng. Đây là một điểm mạnh lớn giúp bạn đối mặt with thử thách.',
        recommendations: [
          '💪 Sử dụng sự ổn định này để hỗ trợ người khác',
          '⚠️ Chú ý không đánh giá thấp stress của người xung quanh',
          '🎯 Phát huy trong các vai trò lãnh đạo hoặc làm việc dưới áp lực',
        ],
      })
    }

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
          'Bạn là người hướng ngoại mạnh. Bạn nạp năng lượng từ tương tác with người khác và cảm thấy thoải mái trong đám đông.',
        recommendations: [
          '👥 Tham gia các hoạt động nhóm, câu lạc bộ, cộng đồng',
          '⚖️ Cân bằng giữa giao lưu và thời gian nghỉ ngơi',
          '🏃 Kết hợp thể thao nhóm thay vì tập một mình',
          '💼 Lựa chọn công việc có nhiều tương tác with người',
        ],
      })
    }

    if (insights.length === 0) {
      insights.push({
        type: 'strength',
        title: '✅ Tính cách cân bằng',
        description:
          'Profile tính cách của bạn tương đối cân bằng, không có yếu tố nguy cơ nổi bật. Đây là một dấu hiệu tốt cho sức khỏe tinh thần.',
        recommendations: [
          '🎯 Đặt mục tiêu SMART for từng lĩnh vực',
          '📊 Xây dựng kế hoạch hành động: Chia mục tiêu thành bước nhỏ hàng tuần (Behavioral activation)',
          '💬 Duy trì giao tiếp thẳng thắn và xây dựng (Communication skills: assertiveness)',
          '🔍 Định kỳ đánh giá lại và điều chỉnh hướng đi (Evidence-based review)',
          '📚 Học kỹ năng mới phục vụ mục tiêu dài hạn (Skills development)',
        ],
      })
    }

    return insights
  }

  /**
   * Gợi ý phong cách học tập dựa trên Big Five
   */
  getLearningStyleRecommendations(score: BFI2Score): LearningStyleRecommendation {
    const { tScores } = score
    const domainLevels = {
      E: interpretTScore(tScores.domains.E).level,
      O: interpretTScore(tScores.domains.O).level,
      C: interpretTScore(tScores.domains.C).level,
      A: interpretTScore(tScores.domains.A).level,
      N: interpretTScore(tScores.domains.N).level,
    }

    const isHighE = domainLevels.E === 'high' || domainLevels.E === 'very-high'
    const isLowE = domainLevels.E === 'low' || domainLevels.E === 'very-low'
    const socialDimension = isHighE ? 'Học qua tương tác xã hội' : isLowE ? 'Học độc lập' : 'Linh hoạt xã hội'

    const isHighO = domainLevels.O === 'high' || domainLevels.O === 'very-high'
    const isLowO = domainLevels.O === 'low' || domainLevels.O === 'very-low'
    const cognitiveDimension = isHighO ? 'Tư duy trừu tượng' : isLowO ? 'Tư duy cụ thể' : 'Cân bằng nhận thức'

    const isHighC = domainLevels.C === 'high' || domainLevels.C === 'very-high'
    const isLowC = domainLevels.C === 'low' || domainLevels.C === 'very-low'
    const structureDimension = isHighC ? 'Có kế hoạch chặt chẽ' : isLowC ? 'Linh hoạt tự phát' : 'Cân bằng cấu trúc'

    const overallStyle = `${socialDimension} • ${cognitiveDimension} • ${structureDimension}`

    let description = ''
    let researchBasis = ''

    if (isHighE && isHighO && isHighC) {
      description = 'Bạn là người học tốt nhất khi kết hợp làm việc nhóm, khám phá ý tưởng sáng tạo, và có kế hoạch rõ ràng.'
      researchBasis = 'Nghiên cứu của Komarraju et al. (2011) cho thấy sự kết hợp E+O+C dự báo thành tích học tập xuất sắc.'
    } else if (isLowE && isHighO && isHighC) {
      description = 'Bạn là người học sâu độc lập. Bạn thích nghiên cứu một mình, khám phá ý tưởng phức tạp, và theo kế hoạch chặt chẽ.'
      researchBasis = 'Vedel (2014) phát hiện O+C là predictor mạnh nhất of GPA.'
    } else if (isHighE && isLowO && isHighC) {
      description = 'Bạn học tốt qua làm việc nhóm with cấu trúc rõ ràng. Bạn thích phương pháp thực hành, có kế hoạch.'
      researchBasis = 'Chamorro-Premuzic & Furnham (2008) cho thấy nhóm này thành công trong học tập theo nhóm có tổ chức.'
    } else if (isLowE && isHighO) {
      description = 'Bạn là người tư duy độc lập và sâu sắc. Bạn thích đọc sách, suy ngẫm, và khám phá ý tưởng trừu tượng một mình.'
      researchBasis = 'Bidjerano & Dai (2007): Người hướng nội + cởi mở có khả năng self-regulated learning cao.'
    } else if (isHighC) {
      description = 'Bạn là người học có kỷ luật và kế hoạch. Bạn cần cấu trúc, deadline.'
      researchBasis = 'C là predictor mạnh nhất of thành tích học tập.'
    } else {
      description = 'Bạn có phong cách học cân bằng, linh hoạt thích nghi with nhiều phương pháp khác nhau.'
      researchBasis = 'Profile cân bằng cho phép bạn phát huy thế mạnh of nhiều phương pháp học tập.'
    }

    const strengths: string[] = []
    if (isHighC) strengths.push('Kỷ luật và kiên trì', 'Hoàn thành đúng hạn', 'Tổ chức tốt')
    if (isHighO) strengths.push('Tư duy sáng tạo', 'Hiểu khái niệm nhanh', 'Kết nối ý tưởng tốt')
    if (isHighE) strengths.push('Học qua thảo luận', 'Giải thích for người khác', 'Động lực từ nhóm')
    if (isLowE) strengths.push('Tập trung sâu', 'Nghiên cứu độc lập', 'Không bị phân tâm')
    if (strengths.length === 0) strengths.push('Linh hoạt thích nghi', 'Học đa dạng phương pháp')

    const challenges: string[] = []
    if (domainLevels.N === 'high' || domainLevels.N === 'very-high') challenges.push('Lo âu khi thi cử', 'Căng thẳng khi học nhóm')
    if (isLowC) challenges.push('Trì hoãn công việc', 'Khó theo kế hoạch dài hạn')
    if (isHighC && domainLevels.N === 'high') challenges.push('Stress khi không đạt hoàn hảo')
    if (isLowE) challenges.push('Khó hòa nhập nhóm học tập', 'Ít cơ hội networking')
    if (isLowO) challenges.push('Khó with lý thuyết trừu tượng', 'Cần ví dụ cụ thể')

    const bestMethods: string[] = []
    if (isHighE) bestMethods.push('👥 Nhóm học tập 3-5 người', '🗣️ Giảng dạy lại for bạn bè', '💬 Thảo luận & tranh luận', '🎤 Thuyết trình')
    if (isLowE) bestMethods.push('📚 Đọc sách & nghiên cứu độc lập', '🎧 Nghe bài giảng & podcast', '✍️ Viết tóm tắt', '🏠 Học trong không gian yên tĩnh')
    if (isHighO) bestMethods.push('🗺️ Vẽ sơ đồ tư duy', '🔗 Kết nối lý thuyết with thực tế', '❓ Đặt câu hỏi "Tại sao?"', '📖 Đọc tài liệu mở rộng')
    if (isLowO) bestMethods.push('📝 Làm bài tập thực hành nhiều', '🎯 Học qua ví dụ cụ thể', '👨‍🏫 Theo hướng dẫn từng bước', '🔁 Lặp lại & thực hành')
    if (isHighC) bestMethods.push('📅 Lập lịch học cụ thể', '✅ Sử dụng checklist', '🃏 Thẻ ghi nhớ Spaced Repetition', '🏛️ Môi trường ngăn nắp')
    if (isLowC) bestMethods.push('🎨 Học qua dự án & trải nghiệm', '🔀 Xen kẽ nhiều môn học', '🎥 Tài liệu YouTube/blog', '🧪 Thử nghiệm & khám phá')

    const avoidMethods: string[] = []
    if (isHighE) avoidMethods.push('Học một mình thời gian dài', 'Đọc im lặng không tương tác')
    if (isLowE) avoidMethods.push('Thuyết trình trước đám đông', 'Làm việc nhóm bắt buộc')
    if (isHighO) avoidMethods.push('Học vẹt không hiểu', 'Bài tập lặp đi lặp lại')
    if (isLowO) avoidMethods.push('Lý thuyết trừu tượng không ví dụ', 'Triết học quá phức tạp')
    if (isHighC) avoidMethods.push('Học tự phát', 'Deadline mơ hồ')
    if (isLowC) avoidMethods.push('Lịch học quá cứng nhắc', 'Yêu cầu hoàn hảo mọi chi tiết')

    const studyEnvironment: string[] = []
    if (isHighE) studyEnvironment.push('🏫 Thư viện nhóm hoặc quán cà phê', '💡 Không gian mở')
    else if (isLowE) studyEnvironment.push('🏠 Phòng riêng yên tĩnh', '🤫 Không bị làm phiền')
    if (isHighC) studyEnvironment.push('🗂️ Bàn học ngăn nắp', '📌 Lịch trình rõ ràng')
    if (domainLevels.N === 'low' || domainLevels.N === 'very-low') studyEnvironment.push('🎵 Có thể có nhạc nền nhẹ')

    const timeManagement: string[] = []
    if (isHighC) timeManagement.push('⏰ Pomodoro Technique', '📊 Time blocking', '✅ Task quan trọng buổi sáng', '📝 Review mỗi cuối tuần')
    else if (isLowC) timeManagement.push('🎯 Đặt mục tiêu ngắn hạn', '⏳ Sử dụng timer', '🔔 Nhắc nhở app/alarm', '🏆 Thưởng cho bản thân')

    const examPreparation: string[] = []
    if (isHighC) examPreparation.push('📅 Bắt đầu trước 2-3 tuần', '📋 Tạo study guide', '🔄 Ôn theo lịch', '✅ Practice tests')
    else examPreparation.push('⚡ Học tập trung 3-5 ngày cuối', '🎯 Tập trung điểm chính (80/20)', '👥 Học nhóm tăng động lực', '📝 Làm đề cũ')
    if (domainLevels.N === 'high' || domainLevels.N === 'very-high') {
      examPreparation.push('🎯 Chuẩn bị kỹ để tự tin', '📝 Viết ra worst-case scenario', '💪 Nhắc bản thân "Tôi có thể"', '😴 Ngủ đủ giấc', '🎬 Hình dung thành công')
    }

    return {
      overallStyle,
      dimensions: { social: socialDimension, cognitive: cognitiveDimension, structure: structureDimension },
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

  /**
   * Phân tích phong cách giao tiếp và quan hệ
   */
  getRelationshipInsights(score: BFI2Score): RelationshipInsight {
    const { tScores, facets } = score
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

    if (domainLevels.E === 'high' || domainLevels.E === 'very-high') {
      communicationStyle = 'Expressive & Outgoing'
      strengths.push('Giao tiếp rõ ràng và tự tin', 'Dễ dàng kết nối')
      challenges.push('Có thể nói nhiều hơn lắng nghe')
    } else {
      communicationStyle = 'Reserved & Thoughtful'
      strengths.push('Lắng nghe tốt', 'Suy nghĩ kỹ trước khi nói')
      challenges.push('Có thể khó bày tỏ cảm xúc')
    }

    if (domainLevels.A === 'high' || domainLevels.A === 'very-high') {
      conflictStyle = 'Accommodating & Compromising'
      strengths.push('Giải quyết xung đột hòa bình', 'Thấu cảm')
      challenges.push('Có thể bỏ qua nhu cầu bản thân')
      tips.push('Học assertive khi cần', 'Đặt boundaries rõ ràng')
    } else {
      conflictStyle = 'Direct & Competitive'
      strengths.push('Nói thẳng vấn đề', 'Không sợ confrontation')
      challenges.push('Có thể gây tổn thương cảm xúc')
      tips.push('Thực hành empathy', 'Lựa chọn từ nhẹ nhàng hơn')
    }

    if (domainLevels.N === 'high' || domainLevels.N === 'very-high') {
      strengths.push('Nhạy cảm with cảm xúc')
      challenges.push('Có thể overreact trong xung đột')
      tips.push('Thực hành emotional regulation', 'Pause trước khi respond')
    } else {
      strengths.push('Bình tĩnh trong căng thẳng')
      challenges.push('Có thể bị cho là "lạnh lùng"')
      tips.push('Chia sẻ cảm xúc nhiều hơn')
    }

    if (facets.Tru < 2.5) {
      challenges.push('Khó tin tưởng người khác')
      tips.push('Thử "trust but verify"', 'Chữa lành traumas')
    }

    if (facets.Com > 4.0) {
      strengths.push('Rất quan tâm chăm sóc')
      challenges.push('Dễ bị kiệt sức cảm xúc')
      tips.push('Chăm sóc bản thân là ưu tiên', 'Học cách nói "không"')
    }

    return { communicationStyle, conflictStyle, strengths, challenges, tips }
  }

  /**
   * Đề xuất môn thể thao phù hợp
   */
  getSportsRecommendations(score: BFI2Score, mbtiType?: string): SportsRecommendation[] {
    const recommendations: SportsRecommendation[] = []
    const { tScores } = score
    const domainLevels = {
      E: interpretTScore(tScores.domains.E).level,
      O: interpretTScore(tScores.domains.O).level,
      C: interpretTScore(tScores.domains.C).level,
      N: interpretTScore(tScores.domains.N).level,
    }

    if (domainLevels.E === 'high' || domainLevels.E === 'very-high') {
      recommendations.push({
        category: 'Thể thao đồng đội',
        activities: ['Bóng đá', 'Bóng rổ', 'Bóng chuyền', 'Cầu lông đôi', 'Tennis đôi', 'Nhảy nhóm'],
        reason: 'Bạn có năng lượng cao và thích tương tác xã hội.',
        benefits: ['Tăng kỹ năng giao tiếp', 'Giải phóng năng lượng', 'Xây dựng bạn bè'],
        tips: ['Tham gia CLB thể thao', 'Tổ chức trận đấu cuối tuần'],
      })
    }

    if (domainLevels.E === 'low' || domainLevels.E === 'very-low') {
      recommendations.push({
        category: 'Thể thao cá nhân',
        activities: ['Chạy bộ', 'Bơi lội', 'Yoga', 'Leo núi', 'Đạp xe', 'Gym cá nhân'],
        reason: 'Bạn thích không gian riêng tư và tập trung vào bản thân.',
        benefits: ['Thời gian tĩnh lặng', 'Kiểm soát nhịp độ', 'Cải thiện sức bền'],
        tips: ['Tập vào giờ ít người', 'Nghe podcast/nhạc khi tập'],
      })
    }

    if (domainLevels.O === 'high' || domainLevels.O === 'very-high') {
      recommendations.push({
        category: 'Thể thao mạo hiểm & sáng tạo',
        activities: ['Rock climbing', 'Lướt ván', 'Nhảy dù', 'Võ thuật', 'Khiêu vũ', 'Parkour'],
        reason: 'Bạn thích trải nghiệm mới và thử thách.',
        benefits: ['Phát triển tư duy sáng tạo', 'Tăng adrenaline', 'Học kỹ năng mới'],
        tips: ['Tham gia khóa học mới mỗi 3-6 tháng', 'Kết nối cộng đồng mạo hiểm'],
      })
    }

    if (domainLevels.C === 'high' || domainLevels.C === 'very-high') {
      recommendations.push({
        category: 'Thể thao có mục tiêu rõ ràng',
        activities: ['Marathon', 'Triathlon', 'Cử tạ', 'Yoga (Ashtanga)', 'Võ thuật truyền thống'],
        reason: 'Bạn thích kế hoạch rõ ràng và theo dõi tiến độ.',
        benefits: ['Cảm giác hoàn thành', 'Cải thiện kỷ luật', 'Kết quả đo lường được'],
        tips: ['Lập kế hoạch 12 tuần', 'Sử dụng app theo dõi'],
      })
    }

    if (domainLevels.N === 'high' || domainLevels.N === 'very-high') {
      recommendations.push({
        category: 'Thể thao giảm căng thẳng',
        activities: ['Bơi lội', 'Đạp xe nhẹ', 'Đi bộ đường dài', 'Tai Chi', 'Pilates'],
        reason: 'Các hoạt động nhẹ nhàng giúp điều hòa cảm xúc.',
        benefits: ['Giảm lo âu', 'Ngủ ngon hơn', 'Tăng cảm giác kiểm soát'],
        tips: ['Tập trong môi trường yên tĩnh', 'Tránh thi đấu căng thẳng'],
      })
    }

    if (mbtiType) {
      if (mbtiType.includes('S') && mbtiType.includes('J')) {
        recommendations.push({
          category: 'Thể thao truyền thống',
          activities: ['Golf', 'Quần vợt', 'Cầu lông', 'Bơi lội', 'Chạy bộ'],
          reason: `Phù hợp with MBTI ${mbtiType} thích quy tắc rõ ràng.`,
          benefits: ['Kỹ thuật rõ ràng', 'Cộng đồng ổn định'],
          tips: ['Tham gia CLB uy tín'],
        })
      }
      if (mbtiType.includes('N') && mbtiType.includes('P')) {
        recommendations.push({
          category: 'Thể thao sáng tạo & linh hoạt',
          activities: ['Skateboarding', 'Bouldering', 'Parkour', 'Breakdancing', 'Surfing'],
          reason: `Phù hợp with MBTI ${mbtiType} thích tự do sáng tạo.`,
          benefits: ['Không gò bó', 'Thử thách mới'],
          tips: ['Khám phá nhiều môn'],
        })
      }
    }

    return recommendations
  }

  /**
   * Đề xuất sở thích phù hợp
   */
  getHobbyRecommendations(score: BFI2Score, mbtiType?: string): HobbyRecommendation[] {
    const recommendations: HobbyRecommendation[] = []
    const { tScores } = score
    const domainLevels = {
      E: interpretTScore(tScores.domains.E).level,
      A: interpretTScore(tScores.domains.A).level,
      C: interpretTScore(tScores.domains.C).level,
      O: interpretTScore(tScores.domains.O).level,
    }

    if (domainLevels.O === 'high' || domainLevels.O === 'very-high') {
      recommendations.push({
        category: 'Sở thích sáng tạo',
        hobbies: ['Vẽ tranh', 'Chơi nhạc cụ', 'Viết lách', 'Nhiếp ảnh', 'Thiết kế', 'Làm phim', 'Nấu ăn'],
        reason: 'Sở thích sáng tạo giúp bạn thể hiện bản thân.',
        benefits: ['Phát triển tư duy', 'Giảm stress', 'Side-hustle potential'],
        tips: ['Dành 1-2h mỗi tuần', 'Tham gia cộng đồng online'],
      })
    }

    if (domainLevels.C === 'high' || domainLevels.C === 'very-high') {
      recommendations.push({
        category: 'Sở thích xây dựng kỹ năng',
        hobbies: ['Học ngôn ngữ', 'Lập trình', 'Cờ vua', 'Làm vườn', 'DIY', 'Đọc sách non-fiction', 'Đầu tư'],
        reason: 'Các sở thích này giúp bạn phát triển năng lực.',
        benefits: ['Kỹ năng lâu dài', 'Cảm giác thành tựu', 'Mở rộng sự nghiệp'],
        tips: ['Đặt mục tiêu SMART', 'Theo dõi tiến độ'],
      })
    }

    if (domainLevels.E === 'high' || domainLevels.E === 'very-high') {
      recommendations.push({
        category: 'Sở thích xã hội',
        hobbies: ['CLB sách', 'Tình nguyện', 'Networking', 'Nhảy nhóm', 'Board games', 'Du lịch nhóm'],
        reason: 'Các hoạt động xã hội giúp bạn nạp năng lượng.',
        benefits: ['Mở rộng quan hệ', 'Phát triển giao tiếp', 'Tạo kỷ niệm'],
        tips: ['Sử dụng Meetup', 'Duy trì ít nhất 1 buổi/tuần'],
      })
    }

    if (domainLevels.E === 'low' || domainLevels.E === 'very-low') {
      recommendations.push({
        category: 'Sở thích cá nhân',
        hobbies: ['Đọc sách', 'Viết nhật ký', 'Game solo', 'Podcast', 'Thiền', 'Làm mô hình', 'Nghiên cứu sâu'],
        reason: 'Sở thích cá nhân giúp bạn thư giãn.',
        benefits: ['Không gian suy nghĩ sâu', 'Kiểm soát nhịp độ', 'Kiến thức chuyên sâu'],
        tips: ['Tạo không gian yên tĩnh', 'Đặt lịch "me time"'],
      })
    }

    if (domainLevels.A === 'high' || domainLevels.A === 'very-high') {
      recommendations.push({
        category: 'Sở thích giúp đỡ người khác',
        hobbies: ['Tình nguyện', 'Nuôi thú cưng', 'Dạy kèm', 'Mentor', 'Chăm sóc cây', 'Từ thiện'],
        reason: 'Các hoạt động này mang lại ý nghĩa cho cuộc sống.',
        benefits: ['Thỏa mãn tâm hồn', 'Quan hệ chân thành', 'Đóng góp xã hội'],
        tips: ['Tìm tổ chức phù hợp giá trị', 'Cam kết dài hạn'],
      })
    }

    if (mbtiType) {
      if (mbtiType.includes('NT')) {
        recommendations.push({
          category: 'Sở thích tri thức',
          hobbies: ['Nghiên cứu khoa học', 'Triết học', 'Chiến lược', 'AI/ML', 'Sách lý thuyết'],
          reason: `Phù hợp with MBTI ${mbtiType} thích logic.`,
          benefits: ['Tư duy phê phán', 'Hiểu hệ thống'],
          tips: ['Tham gia diễn đàn học thuật'],
        })
      }
      if (mbtiType.includes('SF')) {
        recommendations.push({
          category: 'Sở thích thực tế',
          hobbies: ['Làm bánh', 'Handcraft', 'Chăm sóc cây', 'Trang trí', 'Chụp ảnh gia đình'],
          reason: `Phù hợp with MBTI ${mbtiType} thích giá trị thực tế.`,
          benefits: ['Tạo sản phẩm hữu ích', 'Chia sẻ yêu thương'],
          tips: ['Làm quà handmade'],
        })
      }
    }

    return recommendations
  }

  /**
   * Đề xuất nhạc cụ phù hợp
   */
  getMusicInstrumentRecommendations(score: BFI2Score, mbtiType?: string): MusicInstrumentRecommendation[] {
    const recommendations: MusicInstrumentRecommendation[] = []
    const { tScores } = score
    const domainLevels = {
      E: interpretTScore(tScores.domains.E).level,
      C: interpretTScore(tScores.domains.C).level,
      N: interpretTScore(tScores.domains.N).level,
      O: interpretTScore(tScores.domains.O).level,
    }

    if (domainLevels.O === 'high' || domainLevels.O === 'very-high') {
      recommendations.push({
        category: 'Nhạc cụ sáng tạo & phức tạp',
        instruments: ['Piano Classical/Jazz', 'Violin', 'Saxophone', 'Electric Guitar', 'Synthesizer', 'Đàn Tranh', 'Cello'],
        reason: 'Các nhạc cụ này cho phép sáng tạo và biểu đạt cảm xúc sâu sắc.',
        benefits: ['Tư duy sáng tạo', 'Biểu đạt cảm xúc', 'Học kỹ năng mới'],
        learningTips: ['Thử nghiệm nhiều thể loại', 'Học lý thuyết âm nhạc', 'Jam sessions'],
        researchBacking: 'Corrigall et al. (2013)',
      })
    }

    if (domainLevels.E === 'high' || domainLevels.E === 'very-high') {
      recommendations.push({
        category: 'Nhạc cụ hòa tấu & biểu diễn',
        instruments: ['Drums', 'Saxophone', 'Trumpet', 'Acoustic Guitar', 'Keyboard', 'Bass'],
        reason: 'Phù hợp để chơi trong band và biểu diễn trước đám đông.',
        benefits: ['Giao lưu band', 'Năng lượng cao', 'Sôi động'],
        learningTips: ['Tham gia band sớm', 'Học bài hát phổ biến', 'Open mic'],
        researchBacking: 'Greenberg et al. (2015)',
      })
    }

    if (domainLevels.E === 'low' || domainLevels.E === 'very-low') {
      recommendations.push({
        category: 'Nhạc cụ độc tấu & suy ngẫm',
        instruments: ['Piano Solo', 'Classical Guitar', 'Flute', 'Đàn Bầu', 'Harp', 'Cello Solo'],
        reason: 'Cho phép bạn tập luyện độc lập, tạo âm thanh sâu lắng.',
        benefits: ['Khám phá nội tâm', 'Kiểm soát tiến độ', 'Tĩnh lặng'],
        learningTips: ['Tập không gian yên tĩnh', 'Học bản nhạc chậm', 'Ghi âm tự đánh giá'],
        researchBacking: 'Rentfrow & Gosling (2003)',
      })
    }

    if (domainLevels.C === 'high' || domainLevels.C === 'very-high') {
      recommendations.push({
        category: 'Nhạc cụ kỹ thuật cao',
        instruments: ['Piano Classical', 'Violin', 'Cello', 'Oboe', 'Classical Guitar', 'Flute'],
        reason: 'Đòi hỏi luyện tập kỷ luật, chính xác.',
        benefits: ['Cảm giác thành tựu', 'Phát triển kỷ luật', 'Tiến bộ đo lường'],
        learningTips: ['Theo giáo trình ABRSM/RCM', 'Luyện tập 30-60p mỗi ngày', 'Mục tiêu Grade cụ thể'],
        researchBacking: 'Kỷ luật trong âm nhạc cổ điển',
      })
    }

    if (domainLevels.N === 'high' || domainLevels.N === 'very-high') {
      recommendations.push({
        category: 'Nhạc cụ biểu cảm',
        instruments: ['Acoustic Guitar', 'Piano Ballad', 'Violin Romantic', 'Cello', 'Ukulele'],
        reason: 'Âm nhạc giúp bạn xử lý và biểu đạt cảm xúc.',
        benefits: ['Giảm stress', 'Biểu đạt cảm xúc', 'Điều hòa mood'],
        learningTips: ['Chọn nhạc có ý nghĩa', 'Không áp lực hoàn hảo', 'Công cụ self-care'],
        researchBacking: 'Music therapy research',
      })
    }

    if (mbtiType) {
      if (mbtiType.includes('NT')) {
        recommendations.push({
          category: 'Nhạc cụ phân tích (NT)',
          instruments: ['Piano Theory', 'Synthesizer Composition', 'Jazz Guitar'],
          reason: `Phù hợp with MBTI ${mbtiType} thích cấu trúc.`,
          benefits: ['Tư duy logic', 'Hiểu hệ thống'],
          learningTips: ['Lý thuyết song song thực hành', 'Phân tích cấu trúc tác phẩm'],
          researchBacking: 'NT types and complex music',
        })
      }
      if (mbtiType.includes('SF')) {
        recommendations.push({
          category: 'Nhạc cụ thực tế (SF)',
          instruments: ['Acoustic Guitar', 'Piano Pop', 'Ukulele', 'Đàn Bầu'],
          reason: `Phù hợp with MBTI ${mbtiType} thích âm nhạc gần gũi.`,
          benefits: ['Dễ học', 'Mang niềm vui for mọi người'],
          learningTips: ['Học bài quen thuộc trước', 'Chơi for người thân'],
          researchBacking: 'SF types and conventional music',
        })
      }
      if (mbtiType.includes('N') && mbtiType.includes('P')) {
        recommendations.push({
          category: 'Nhạc cụ ứng biến (NP)',
          instruments: ['Synthesizer', 'Electric Guitar', 'Saxophone Jazz', 'Hang Drum'],
          reason: `Phù hợp with MBTI ${mbtiType} thích sáng tạo tự do.`,
          benefits: ['Sáng tạo không giới hạn', 'Khám phá âm thanh mới'],
          learningTips: ['Học improvisation', 'Thử nghiệm effects'],
          researchBacking: 'NP types and unconventional music',
        })
      }
    }

    return recommendations
  }
}

export const bfi2CounselingService = new BFI2CounselingService()

export const getCareerCounseling = (s: BFI2Score) => bfi2CounselingService.getCareerCounseling(s)
export const getMentalHealthInsights = (s: BFI2Score) => bfi2CounselingService.getMentalHealthInsights(s)
export const getLearningStyleRecommendations = (s: BFI2Score) => bfi2CounselingService.getLearningStyleRecommendations(s)
export const getRelationshipInsights = (s: BFI2Score) => bfi2CounselingService.getRelationshipInsights(s)
export const getSportsRecommendations = (s: BFI2Score, m?: string) => bfi2CounselingService.getSportsRecommendations(s, m)
export const getHobbyRecommendations = (s: BFI2Score, m?: string) => bfi2CounselingService.getHobbyRecommendations(s, m)
export const getMusicInstrumentRecommendations = (s: BFI2Score, m?: string) => bfi2CounselingService.getMusicInstrumentRecommendations(s, m)
