// Profile Service - API calls for user profile and test results

import { createClient } from '@/lib/supabase/client';
import type {
  PersonalityProfile,
  MentalHealthRecord,
  ProfileSummary,
  Recommendation,
  MentalHealthTrend
} from '@/types/profile';

export class ProfileService {
  private supabase = createClient();

  /**
   * Get user's personality profile
   */
  async getPersonalityProfile(userId: string): Promise<PersonalityProfile | null> {
    const { data, error } = await this.supabase
      .from('personality_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }

  /**
   * Get user's mental health history
   */
  async getMentalHealthHistory(
    userId: string,
    limit: number = 30
  ): Promise<MentalHealthRecord[]> {
    const { data, error } = await this.supabase
      .from('mental_health_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  }

  /**
   * Get profile summary with trends and recommendations
   */
  async getProfileSummary(userId: string): Promise<ProfileSummary> {
    const [personality, mentalHealthRecords] = await Promise.all([
      this.getPersonalityProfile(userId),
      this.getMentalHealthHistory(userId, 30),
    ]);

    const trends = this.calculateTrends(mentalHealthRecords);
    const recommendations = this.generateRecommendations(
      personality,
      mentalHealthRecords
    );

    return {
      personality,
      mentalHealthRecords,
      trends,
      recommendations,
    };
  }

  /**
   * Calculate mental health trends over time
   * Maps different test types to depression/anxiety/stress:
   * - PHQ9 -> depression
   * - GAD7 -> anxiety
   * - DASS21 -> all three (from subscale_scores)
   * - PSS -> stress
   */
  private calculateTrends(records: MentalHealthRecord[]): MentalHealthTrend[] {
    // Group records by date
    const recordsByDate = new Map<string, { depression?: number; anxiety?: number; stress?: number }>();

    records.forEach(record => {
      // Use completed_at if available, otherwise created_at
      const dateStr = record.completed_at || record.created_at;
      const date = new Date(dateStr).toISOString().split('T')[0];

      if (!recordsByDate.has(date)) {
        recordsByDate.set(date, {});
      }

      const dayData = recordsByDate.get(date)!;
      const score = record.total_score || (record as any).score || 0;

      // Map test types to mental health categories
      switch (record.test_type) {
        case 'PHQ9':
          dayData.depression = score;
          break;
        case 'GAD7':
          dayData.anxiety = score;
          break;
        case 'PSS':
          dayData.stress = score;
          break;
        case 'DASS21':
          // DASS-21 has subscale scores for all three
          const subscales = record.subscale_scores as Record<string, number> | null;
          if (subscales) {
            if (subscales.depression !== undefined) dayData.depression = subscales.depression;
            if (subscales.anxiety !== undefined) dayData.anxiety = subscales.anxiety;
            if (subscales.stress !== undefined) dayData.stress = subscales.stress;
          } else {
            // If no subscales, use total score as general indicator
            dayData.stress = score;
          }
          break;
      }
    });

    // Convert to array and sort by date
    const trends: MentalHealthTrend[] = Array.from(recordsByDate.entries())
      .map(([date, data]) => ({
        date,
        depression: data.depression ?? 0,
        anxiety: data.anxiety ?? 0,
        stress: data.stress ?? 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return trends;
  }

  /**
   * Generate personalized recommendations based on evidence-based interventions
   */
  private generateRecommendations(
    personality: PersonalityProfile | null,
    records: MentalHealthRecord[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Check recent mental health status
    const recentRecords = records.slice(0, 3);
    const hasHighSeverity = recentRecords.some(
      r => r.severity_level === 'severe' || r.severity_level === 'extremely-severe' || r.severity_level === 'critical'
    );
    const hasModerateSeverity = recentRecords.some(
      r => r.severity_level === 'moderate' || r.severity_level === 'severe'
    );

    // Critical recommendations - Professional help
    if (hasHighSeverity) {
      recommendations.push({
        id: 'seek-professional',
        type: 'professional',
        title: 'Tìm Kiếm Hỗ Trợ Chuyên Nghiệp',
        description: 'Kết quả test gần đây cho thấy bạn đang trải qua giai đoạn khó khăn. Chúng tôi khuyến nghị bạn tìm kiếm sự hỗ trợ từ chuyên gia tâm lý.',
        priority: 'high',
        icon: '🏥',
        actionText: 'Tìm chuyên gia',
        actionUrl: '/mentors',
      });
    }

    // Evidence-based Core Interventions

    // 1. Journaling (Expressive Writing)
    recommendations.push({
      id: 'daily-journaling',
      type: 'habit',
      title: 'Ghi Nhật Ký Cảm Xúc',
      description: 'Viết nhật ký 10-15 phút mỗi ngày giúp bạn xử lý cảm xúc, giảm căng thẳng và tăng khả năng tự nhận thức.',
      priority: 'high',
      icon: '📝',
    });

    // 2. Gratitude Practice (for mild-moderate symptoms)
    if (hasModerateSeverity) {
      recommendations.push({
        id: 'gratitude-practice',
        type: 'habit',
        title: 'Nuôi Dưỡng Lòng Biết Ơn',
        description: 'Mỗi ngày viết ra 3 điều bạn biết ơn. Nghiên cứu cho thấy thực hành này giúp giảm căng thẳng và cải thiện tâm trạng.',
        priority: 'medium',
        icon: '🙏',
      });
    }

    // 3. Art & Creative Expression
    recommendations.push({
      id: 'art-expression',
      type: 'activity',
      title: 'Nghệ Thuật & Sáng Tạo',
      description: 'Vẽ, tô màu, làm thủ công hoặc bất kỳ hoạt động nghệ thuật nào giúp bạn bày tỏ cảm xúc và giảm lo âu.',
      priority: 'medium',
      icon: '🎨',
    });

    // 4. Meaning-Making (Logotherapy-inspired)
    recommendations.push({
      id: 'meaning-making',
      type: 'habit',
      title: 'Tìm Kiếm Ý Nghĩa',
      description: 'Dành thời gian suy ngẫm về những giá trị quan trọng và mục tiêu của bạn. Tìm ý nghĩa trong cuộc sống giúp tăng khả năng phục hồi.',
      priority: 'medium',
      icon: '🌟',
    });

    // MBTI-based recommendations
    if (personality?.mbti_type) {
      const mbtiRecs = this.getMBTIRecommendations(personality.mbti_type);
      recommendations.push(...mbtiRecs);
    }

    // Big Five-based recommendations
    if (personality) {
      const big5Recs = this.getBigFiveRecommendations(personality);
      recommendations.push(...big5Recs);
    }

    // Check if needs retake
    if (this.shouldRetakeTest(personality?.last_updated ?? null)) {
      recommendations.push({
        id: 'retake-test',
        type: 'resource',
        title: 'Làm Lại Bài Test',
        description: 'Đã hơn 3 tháng kể từ lần test cuối. Hãy làm lại để cập nhật thông tin về tính cách của bạn.',
        priority: 'low',
        icon: '🔄',
        actionText: 'Làm test',
        actionUrl: '/tests',
      });
    }

    return recommendations;
  }

  /**
   * Get MBTI-specific recommendations based on research
   * Research shows MBTI can guide personalized interventions for mental health
   */
  private getMBTIRecommendations(mbtiType: string): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Introvert recommendations (I)
    // Research: Introverts show lower life satisfaction (42%) vs extroverts (64%)
    // Intervention: Need quiet time for energy restoration
    if (mbtiType.includes('I')) {
      recommendations.push({
        id: 'quiet-time',
        type: 'habit',
        title: 'Thời Gian Riêng Tư',
        description: 'Người hướng nội cần thời gian một mình để phục hồi năng lượng. Dành 30-60 phút mỗi ngày cho hoạt động yên tĩnh như đọc sách, nghe nhạc.',
        priority: 'high',
        icon: '🌙',
      });

      // Individual sports for introverts
      // Research: Athletes low on extraversion prefer individual sports
      recommendations.push({
        id: 'individual-sports',
        type: 'activity',
        title: 'Thể Thao Cá Nhân',
        description: 'Người hướng nội thường thích môn thể thao cá nhân như chạy bộ, bơi lội, yoga, cầu lông. Bạn có thể tập một mình và tập trung vào bản thân.',
        priority: 'medium',
        icon: '🏃',
      });

      // Solo creative arts
      recommendations.push({
        id: 'solo-creative',
        type: 'activity',
        title: 'Sáng Tạo Cá Nhân',
        description: 'Viết nhật ký, vẽ, chơi nhạc cụ, hoặc nhiếp ảnh là những hoạt động lý tưởng giúp bạn thể hiện bản thân trong không gian riêng tư.',
        priority: 'medium',
        icon: '🎭',
      });
    }

    // Extrovert recommendations (E)
    // Research: Extroverts show higher life satisfaction with social engagement
    // Extroverts prefer gym (63%) over home (38%) and exercising with others
    if (mbtiType.includes('E')) {
      recommendations.push({
        id: 'social-connection',
        type: 'activity',
        title: 'Kết Nối Xã Hội',
        description: 'Người hướng ngoại phục hồi năng lượng qua tương tác. Duy trì liên hệ với bạn bè, tham gia hoạt động nhóm để cải thiện tâm trạng.',
        priority: 'high',
        icon: '👥',
      });

      // Team sports for extroverts
      // Research: High extraversion positively correlated with team sports
      recommendations.push({
        id: 'team-sports',
        type: 'activity',
        title: 'Thể Thao Đồng Đội',
        description: 'Bóng đá, bóng rổ, bóng chuyền hoặc nhóm tập gym giúp bạn tràn đầy năng lượng qua tương tác xã hội và tinh thần đồng đội.',
        priority: 'medium',
        icon: '⚽',
      });

      // Group creative activities
      recommendations.push({
        id: 'group-creative',
        type: 'activity',
        title: 'Sáng Tạo Nhóm',
        description: 'Tham gia lớp nhảy, kịch, hát nhóm, hoặc workshop nghệ thuật để kết hợp sự sáng tạo với năng lượng xã hội.',
        priority: 'medium',
        icon: '🎪',
      });
    }

    // Sensing types (S)
    // Research: Sensing students show 58% academic satisfaction vs 45% for Intuitive
    // Prefer concrete, practical activities
    if (mbtiType.includes('S')) {
      recommendations.push({
        id: 'structured-activities',
        type: 'habit',
        title: 'Hoạt Động Có Cấu Trúc',
        description: 'Bạn thích những hoạt động cụ thể, thực tế. Các hoạt động hàng ngày như nấu ăn, làm vườn, thủ công giúp tập trung và giảm stress hiệu quả.',
        priority: 'medium',
        icon: '🛠️',
      });

      // Practical crafts and arts
      recommendations.push({
        id: 'practical-arts',
        type: 'activity',
        title: 'Nghệ Thuật Thực Hành',
        description: 'Đan len, gốm sứ, mộc, nấu ăn sáng tạo - những hoạt động tạo ra sản phẩm cụ thể giúp bạn thư giãn và có thành tựu.',
        priority: 'low',
        icon: '🎨',
      });
    }

    // Intuitive types (N)
    // Research: Intuitive types prefer outdoor exercise (67%) vs indoor (37%)
    // Benefit from creative, meaning-focused activities
    if (mbtiType.includes('N')) {
      recommendations.push({
        id: 'creative-exploration',
        type: 'activity',
        title: 'Khám Phá Sáng Tạo',
        description: 'Bạn hướng về tương lai và ý tưởng. Dành thời gian cho hoạt động sáng tạo, học hỏi điều mới để nuôi dưỡng tinh thần.',
        priority: 'medium',
        icon: '💡',
      });

      // Outdoor varied activities
      recommendations.push({
        id: 'outdoor-activities',
        type: 'activity',
        title: 'Hoạt Động Ngoài Trời',
        description: 'Leo núi, đạp xe địa hình, khám phá thiên nhiên - môi trường đa dạng và thay đổi phù hợp với tính tò mò của bạn.',
        priority: 'medium',
        icon: '🏔️',
      });

      // Abstract/conceptual arts
      recommendations.push({
        id: 'conceptual-arts',
        type: 'activity',
        title: 'Nghệ Thuật Trừu Tượng',
        description: 'Viết sáng tác, vẽ trừu tượng, sáng tác nhạc - những hình thức cho phép bạn khám phá ý tưởng và biểu đạt tầm nhìn.',
        priority: 'low',
        icon: '🎼',
      });
    }

    // Feeling types (F)
    // F types are more emotionally sensitive and benefit from expressive activities
    if (mbtiType.includes('F')) {
      recommendations.push({
        id: 'emotional-expression',
        type: 'habit',
        title: 'Bày Tỏ Cảm Xúc',
        description: 'Bạn nhạy cảm với cảm xúc. Nghệ thuật trị liệu (vẽ, viết, âm nhạc) giúp bạn xử lý và bày tỏ cảm xúc một cách lành mạnh.',
        priority: 'high',
        icon: '💭',
      });
    }

    // Thinking types (T)
    // T types benefit from cognitive-focused interventions
    if (mbtiType.includes('T')) {
      recommendations.push({
        id: 'problem-solving',
        type: 'habit',
        title: 'Giải Quyết Vấn Đề',
        description: 'Bạn tiếp cận vấn đề một cách logic. Khi lo âu, hãy viết ra vấn đề và các giải pháp cụ thể để làm rõ suy nghĩ.',
        priority: 'medium',
        icon: '🧩',
      });
    }

    // Perceiving types (P)
    // Research: Perceiving types in suicidal/depressed populations
    // Need flexibility and spontaneity
    if (mbtiType.includes('P')) {
      recommendations.push({
        id: 'flexible-routine',
        type: 'habit',
        title: 'Thói Quen Linh Hoạt',
        description: 'Bạn thích sự linh hoạt. Tạo khung giờ chung chung thay vì lịch trình cứng nhắc để giảm căng thẳng.',
        priority: 'medium',
        icon: '🌊',
      });
    }

    return recommendations;
  }

  /**
   * Get Big Five personality-based recommendations
   * Research shows Big Five traits explain ~36% variance in depression
   * Note: Big Five scores are stored on 1-5 scale
   * - High: > 3.5 (equivalent to ~62.5% on percentage scale)
   * - Low: < 2.5 (equivalent to ~37.5% on percentage scale)
   */
  private getBigFiveRecommendations(personality: PersonalityProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Threshold constants for 1-5 scale
    const HIGH_THRESHOLD = 3.5;
    const LOW_THRESHOLD = 2.5;

    // High Neuroticism → CBT and stress management
    // Research: High neuroticism strongly correlates with anxiety/depression
    // Neuroticism associated with reduced willingness to exercise
    if (personality.big5_neuroticism && personality.big5_neuroticism > HIGH_THRESHOLD) {
      recommendations.push({
        id: 'stress-reframing',
        type: 'habit',
        title: 'Thay Đổi Cách Nhìn Về Căng Thẳng',
        description: 'Điểm Neuroticism cao của bạn cho thấy độ nhạy cảm với căng thẳng. Thực hành nhìn nhận những tình huống khó khăn như cơ hội phát triển.',
        priority: 'high',
        icon: '🔄',
      });

      // Low-stress activities for high neuroticism
      recommendations.push({
        id: 'gentle-exercise',
        type: 'activity',
        title: 'Vận Động Nhẹ Nhàng',
        description: 'Yoga, đi bộ, bơi thư giãn - những hoạt động không gây căng thẳng giúp giảm lo âu và cải thiện tâm trạng.',
        priority: 'medium',
        icon: '🧘',
      });
    }

    // Low Extraversion → Social support building
    // Research: Low extraversion linked to depression/anxiety
    if (personality.big5_extraversion && personality.big5_extraversion < LOW_THRESHOLD) {
      recommendations.push({
        id: 'gentle-socializing',
        type: 'activity',
        title: 'Giao Lưu Nhẹ Nhàng',
        description: 'Dù bạn ít hướng ngoại, kết nối xã hội vẫn quan trọng. Bắt đầu với gặp gỡ 1-2 người thân thiết thay vì nhóm đông.',
        priority: 'medium',
        icon: '☕',
      });
    }

    // High Extraversion → Group activities
    // Research: Extraversion predicts greater levels of physical activity and organized sport
    if (personality.big5_extraversion && personality.big5_extraversion > HIGH_THRESHOLD) {
      recommendations.push({
        id: 'group-fitness',
        type: 'activity',
        title: 'Tập Luyện Nhóm',
        description: 'Tham gia lớp fitness, dance, hoặc câu lạc bộ thể thao để kết hợp vận động với năng lượng xã hội của bạn.',
        priority: 'medium',
        icon: '💪',
      });
    }

    // High Conscientiousness → Structured exercise programs
    // Research: Conscientiousness strongest predictor of exercise adherence
    if (personality.big5_conscientiousness && personality.big5_conscientiousness > HIGH_THRESHOLD) {
      recommendations.push({
        id: 'structured-program',
        type: 'activity',
        title: 'Chương Trình Có Lịch',
        description: 'Đăng ký chương trình tập luyện có kế hoạch rõ ràng (gym, chạy marathon, martial arts) phù hợp với tính kỷ luật của bạn.',
        priority: 'medium',
        icon: '📋',
      });
    }

    // Low Conscientiousness → Flexible, fun activities
    if (personality.big5_conscientiousness && personality.big5_conscientiousness < LOW_THRESHOLD) {
      recommendations.push({
        id: 'small-goals',
        type: 'habit',
        title: 'Mục Tiêu Nhỏ Hàng Ngày',
        description: 'Đặt 1-2 mục tiêu nhỏ mỗi ngày và hoàn thành chúng. Điều này giúp tăng cảm giác kiểm soát và thành tựu.',
        priority: 'medium',
        icon: '🎯',
      });

      recommendations.push({
        id: 'flexible-fun',
        type: 'activity',
        title: 'Hoạt Động Linh Hoạt',
        description: 'Chơi thể thao giải trí, khiêu vũ tự do, parkour - những hoạt động vui vẻ không yêu cầu lịch trình cứng nhắc.',
        priority: 'low',
        icon: '🎮',
      });
    }

    // High Openness → Creative and varied activities
    // Research: High openness rated strenuous exercise lower, prefer variety
    if (personality.big5_openness && personality.big5_openness > HIGH_THRESHOLD) {
      recommendations.push({
        id: 'explore-meaning',
        type: 'activity',
        title: 'Khám Phá Ý Nghĩa Sâu Xa',
        description: 'Bạn có trí tò mò cao. Tìm hiểu triết học, tâm lý học, hoặc các lĩnh vực giúp bạn hiểu bản thân và cuộc sống sâu hơn.',
        priority: 'medium',
        icon: '📚',
      });

      recommendations.push({
        id: 'varied-activities',
        type: 'activity',
        title: 'Hoạt Động Đa Dạng',
        description: 'Thử các môn mới: leo núi, lướt ván, võ thuật mới. Sự đa dạng phù hợp với tính tò mò và khám phá của bạn.',
        priority: 'low',
        icon: '🎿',
      });
    }

    // High Agreeableness → Cooperative activities
    // Research: Agreeableness relates to positive experience in sport
    if (personality.big5_agreeableness && personality.big5_agreeableness > HIGH_THRESHOLD) {
      recommendations.push({
        id: 'cooperative-sports',
        type: 'activity',
        title: 'Thể Thao Hợp Tác',
        description: 'Bạn thích hợp tác. Tham gia môn thể thao đồng đội không cạnh tranh như yoga nhóm, đi bộ đường dài cùng nhau.',
        priority: 'low',
        icon: '🤝',
      });
    }

    // Low Agreeableness → Compassion practices
    if (personality.big5_agreeableness && personality.big5_agreeableness < LOW_THRESHOLD) {
      recommendations.push({
        id: 'self-compassion',
        type: 'habit',
        title: 'Tự Thương Xót Bản Thân',
        description: 'Thực hành đối xử tử tế với chính mình, đặc biệt khi mắc lỗi. Tự thương xót giúp giảm lo âu và tăng khả năng phục hồi.',
        priority: 'medium',
        icon: '💚',
      });
    }

    return recommendations;
  }

  /**
   * Check if user should retake test
   */
  private shouldRetakeTest(lastTestDate: string | null): boolean {
    if (!lastTestDate) return true;

    const lastTest = new Date(lastTestDate);
    const now = new Date();
    const daysSinceTest = Math.floor(
      (now.getTime() - lastTest.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceTest >= 90; // 3 months
  }
}

export const profileService = new ProfileService();
