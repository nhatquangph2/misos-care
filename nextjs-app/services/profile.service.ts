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
   */
  private calculateTrends(records: MentalHealthRecord[]): MentalHealthTrend[] {
    // Group records by date
    const recordsByDate = new Map<string, { depression?: number; anxiety?: number; stress?: number }>();

    records.forEach(record => {
      const date = new Date(record.created_at).toISOString().split('T')[0];

      if (!recordsByDate.has(date)) {
        recordsByDate.set(date, {});
      }

      const dayData = recordsByDate.get(date)!;

      if (record.test_type === 'DASS21-depression') {
        dayData.depression = record.score;
      } else if (record.test_type === 'DASS21-anxiety') {
        dayData.anxiety = record.score;
      } else if (record.test_type === 'DASS21-stress') {
        dayData.stress = record.score;
      }
    });

    // Convert to array and sort by date
    const trends: MentalHealthTrend[] = Array.from(recordsByDate.entries())
      .map(([date, data]) => ({
        date,
        depression: data.depression || 0,
        anxiety: data.anxiety || 0,
        stress: data.stress || 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return trends;
  }

  /**
   * Generate personalized recommendations
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

    // Critical recommendations
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

    // MBTI-based recommendations
    if (personality?.mbti_type) {
      const mbtiRecs = this.getMBTIRecommendations(personality.mbti_type);
      recommendations.push(...mbtiRecs);
    }

    // General wellness recommendations
    recommendations.push({
      id: 'daily-journaling',
      type: 'habit',
      title: 'Ghi Nhật Ký Hàng Ngày',
      description: 'Viết nhật ký 5-10 phút mỗi ngày giúp bạn nhận diện cảm xúc và giảm stress hiệu quả.',
      priority: 'medium',
      icon: '📝',
    });

    recommendations.push({
      id: 'mindfulness',
      type: 'activity',
      title: 'Thiền & Chánh Niệm',
      description: 'Luyện tập thiền 10 phút mỗi ngày giúp cải thiện tập trung và giảm lo âu.',
      priority: 'medium',
      icon: '🧘',
    });

    recommendations.push({
      id: 'exercise',
      type: 'activity',
      title: 'Vận Động Thể Chất',
      description: 'Tập thể dục 30 phút mỗi ngày giúp cải thiện tâm trạng và giảm triệu chứng trầm cảm.',
      priority: 'medium',
      icon: '🏃',
    });

    recommendations.push({
      id: 'social-connection',
      type: 'activity',
      title: 'Kết Nối Xã Hội',
      description: 'Duy trì mối quan hệ với bạn bè và gia đình là yếu tố quan trọng cho sức khỏe tinh thần.',
      priority: 'medium',
      icon: '👥',
    });

    // Check if needs retake
    if (this.shouldRetakeTest(personality?.test_completed_at ?? null)) {
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
   * Get MBTI-specific recommendations
   */
  private getMBTIRecommendations(mbtiType: string): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Introvert recommendations (I)
    if (mbtiType.includes('I')) {
      recommendations.push({
        id: 'quiet-time',
        type: 'habit',
        title: 'Thời Gian Riêng Tư',
        description: 'Bạn là người hướng nội. Hãy dành ít nhất 30 phút mỗi ngày cho bản thân để nạp lại năng lượng.',
        priority: 'medium',
        icon: '🌙',
      });
    }

    // Extrovert recommendations (E)
    if (mbtiType.includes('E')) {
      recommendations.push({
        id: 'social-activities',
        type: 'activity',
        title: 'Hoạt Động Nhóm',
        description: 'Bạn là người hướng ngoại. Tham gia các hoạt động nhóm sẽ giúp bạn cảm thấy tràn đầy năng lượng.',
        priority: 'medium',
        icon: '🎉',
      });
    }

    // Feeling types (F)
    if (mbtiType.includes('F')) {
      recommendations.push({
        id: 'emotional-expression',
        type: 'habit',
        title: 'Bày Tỏ Cảm Xúc',
        description: 'Bạn nhạy cảm với cảm xúc. Hãy tìm cách bày tỏ cảm xúc qua viết lách, nghệ thuật hoặc chia sẻ với người thân.',
        priority: 'medium',
        icon: '💭',
      });
    }

    // Judging types (J)
    if (mbtiType.includes('J')) {
      recommendations.push({
        id: 'planning',
        type: 'habit',
        title: 'Lập Kế Hoạch',
        description: 'Bạn thích có kế hoạch rõ ràng. Sử dụng planner hoặc app để tổ chức công việc hàng ngày.',
        priority: 'low',
        icon: '📅',
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
