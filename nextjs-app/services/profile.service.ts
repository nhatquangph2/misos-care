// Profile Service - API calls for user profile and test results

import { BaseService } from './base.service';
import type {
  PersonalityProfile,
  MentalHealthRecord,
  ProfileSummary,
  Recommendation,
  MentalHealthTrend
} from '@/types/profile';

export class ProfileService extends BaseService {
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

    return data as any as PersonalityProfile | null;
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

    return (data as any) || [];
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
    const recordsByDate = new Map<string, { depression?: number; anxiety?: number; stress?: number }>();

    records.forEach(record => {
      const dateStr = record.completed_at || record.created_at;
      const date = new Date(dateStr).toISOString().split('T')[0];

      if (!recordsByDate.has(date)) {
        recordsByDate.set(date, {});
      }

      const dayData = recordsByDate.get(date)!;
      const score = record.total_score || (record as any).score || 0;

      switch (record.test_type) {
        case 'PHQ9':
        case 'PHQ-9' as any:
          dayData.depression = score;
          break;
        case 'GAD7':
        case 'GAD-7' as any:
          dayData.anxiety = score;
          break;
        case 'PSS':
        case 'PSS-10' as any:
          dayData.stress = score;
          break;
        case 'DASS21':
          const subscales = record.subscale_scores as Record<string, number> | null;
          if (subscales) {
            if (subscales.depression !== undefined) dayData.depression = subscales.depression;
            else if (subscales['Trầm cảm'] !== undefined) dayData.depression = subscales['Trầm cảm'] * 2;

            if (subscales.anxiety !== undefined) dayData.anxiety = subscales.anxiety;
            else if (subscales['Lo âu'] !== undefined) dayData.anxiety = subscales['Lo âu'] * 2;

            if (subscales.stress !== undefined) dayData.stress = subscales.stress;
            else if (subscales['Stress'] !== undefined) dayData.stress = subscales['Stress'] * 2;
          } else {
            dayData.stress = score;
          }
          break;
      }
    });

    return Array.from(recordsByDate.entries())
      .map(([date, data]) => ({
        date,
        depression: data.depression ?? 0,
        anxiety: data.anxiety ?? 0,
        stress: data.stress ?? 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    personality: PersonalityProfile | null,
    records: MentalHealthRecord[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const recentRecords = records.slice(0, 3);
    const hasHighSeverity = recentRecords.some(r => ['severe', 'extremely-severe', 'extremely_severe', 'critical'].includes(r.severity_level));
    const hasModerateSeverity = recentRecords.some(r => ['moderate', 'severe'].includes(r.severity_level));

    if (hasHighSeverity) {
      recommendations.push({
        id: 'seek-professional',
        type: 'professional',
        title: 'Tìm Kiếm Hỗ Trợ Chuyên Nghiệp',
        description: 'Kết quả test gần đây cho thấy bạn đang trải qua giai đoạn khó khăn. Hãy tìm chuyên gia tâm lý.',
        priority: 'high',
        icon: '🏥',
        actionText: 'Tìm chuyên gia',
        actionUrl: '/mentors',
      });
    }

    recommendations.push({
      id: 'daily-journaling',
      type: 'habit',
      title: 'Ghi Nhật Ký Cảm Xúc',
      description: 'Viết nhật ký giúp bạn xử lý cảm xúc and tăng tự nhận thức.',
      priority: 'high',
      icon: '📝',
    });

    if (hasModerateSeverity) {
      recommendations.push({
        id: 'gratitude-practice',
        type: 'habit',
        title: 'Nuôi Dưỡng Lòng Biết Ơn',
        description: 'Mỗi ngày viết ra 3 điều biết ơn để cải thiện tâm trạng.',
        priority: 'medium',
        icon: '🙏',
      });
    }

    recommendations.push({
      id: 'art-expression',
      type: 'activity',
      title: 'Nghệ Thuật & Sáng Tạo',
      description: 'Hoạt động nghệ thuật giúp bạn bày tỏ cảm xúc and giảm lo âu.',
      priority: 'medium',
      icon: '🎨',
    });

    recommendations.push({
      id: 'meaning-making',
      type: 'habit',
      title: 'Tìm Kiếm Ý Nghĩa',
      description: 'Suy ngẫm về giá trị quan trọng để tăng khả năng phục hồi.',
      priority: 'medium',
      icon: '🌟',
    });

    if (personality?.mbti_type) recommendations.push(...this.getMBTIRecommendations(personality.mbti_type));
    if (personality) recommendations.push(...this.getBigFiveRecommendations(personality));

    if (this.shouldRetakeTest(personality?.last_updated ?? null)) {
      recommendations.push({
        id: 'retake-test',
        type: 'resource',
        title: 'Làm Lại Bài Test',
        description: 'Đã hơn 3 tháng từ lần test cuối. Hãy cập nhật profile của bạn.',
        priority: 'low',
        icon: '🔄',
        actionText: 'Làm test',
        actionUrl: '/tests',
      });
    }

    return recommendations;
  }

  private getMBTIRecommendations(mbtiType: string): Recommendation[] {
    const recommendations: Recommendation[] = [];
    if (mbtiType.includes('I')) {
      recommendations.push({ id: 'quiet-time', type: 'habit', title: 'Thời Gian Riêng Tư', description: 'Người hướng nội cần thời gian một mình.', priority: 'high', icon: '🌙' });
      recommendations.push({ id: 'individual-sports', type: 'activity', title: 'Thể Thao Cá Nhân', description: 'Chạy bộ, bơi lội phù hợp.', priority: 'medium', icon: '🏃' });
    }
    if (mbtiType.includes('E')) {
      recommendations.push({ id: 'social-connection', type: 'activity', title: 'Kết Nối Xã Hội', description: 'Hòa nhập xã hội giúp tăng năng lượng.', priority: 'high', icon: '👥' });
    }
    return recommendations;
  }

  private getBigFiveRecommendations(personality: PersonalityProfile): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const HIGH = 3.5;
    const LOW = 2.5;
    const n = personality.big5_neuroticism;
    if (n && n > HIGH) {
      recommendations.push({ id: 'stress-reframing', type: 'habit', title: 'Nhìn Nhận Lại Căng Thẳng', description: 'Coi khó khăn là cơ hội phát triển.', priority: 'high', icon: '🔄' });
    }
    return recommendations;
  }

  private shouldRetakeTest(lastTestDate: string | null): boolean {
    if (!lastTestDate) return true;
    const daysSince = Math.floor((Date.now() - new Date(lastTestDate).getTime()) / (1000 * 60 * 60 * 24));
    return daysSince >= 90;
  }
}

export const profileService = new ProfileService();

export const getPersonalityProfile = (id: string) => profileService.getPersonalityProfile(id);
export const getMentalHealthHistory = (id: string, l?: number) => profileService.getMentalHealthHistory(id, l);
export const getProfileSummary = (id: string) => profileService.getProfileSummary(id);
