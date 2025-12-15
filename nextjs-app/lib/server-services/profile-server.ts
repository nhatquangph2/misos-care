/**
 * Server-side Profile Service
 * Use this in Server Components, Server Actions, and API Routes
 */

import { createClient as createServerClient } from '@/lib/supabase/server';
import type {
  PersonalityProfile,
  MentalHealthRecord,
  ProfileSummary,
  Recommendation,
  MentalHealthTrend
} from '@/types/profile';

/**
 * Get user's personality profile (server-side)
 */
export async function getPersonalityProfileServer(userId: string): Promise<PersonalityProfile | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
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
 * Get user's mental health history (server-side)
 */
export async function getMentalHealthHistoryServer(
  userId: string,
  limit: number = 30
): Promise<MentalHealthRecord[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('mental_health_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data || [];
}

/**
 * Calculate mental health trends over time
 */
function calculateTrends(records: MentalHealthRecord[]): MentalHealthTrend[] {
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
        dayData.depression = score;
        break;
      case 'GAD7':
        dayData.anxiety = score;
        break;
      case 'PSS':
        dayData.stress = score;
        break;
      case 'DASS21':
        const subscales = record.subscale_scores as Record<string, number> | null;
        if (subscales) {
          if (subscales.depression !== undefined) dayData.depression = subscales.depression;
          if (subscales.anxiety !== undefined) dayData.anxiety = subscales.anxiety;
          if (subscales.stress !== undefined) dayData.stress = subscales.stress;
        } else {
          dayData.stress = score;
        }
        break;
    }
  });

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
 * Generate personalized recommendations
 */
function generateRecommendations(
  personality: PersonalityProfile | null,
  records: MentalHealthRecord[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  const recentRecords = records.slice(0, 3);
  const hasHighSeverity = recentRecords.some(
    r => r.severity_level === 'severe' || r.severity_level === 'extremely-severe' || r.severity_level === 'critical'
  );

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

  recommendations.push({
    id: 'daily-journaling',
    type: 'habit',
    title: 'Ghi Nhật Ký Cảm Xúc',
    description: 'Viết nhật ký 10-15 phút mỗi ngày giúp bạn xử lý cảm xúc, giảm căng thẳng và tăng khả năng tự nhận thức.',
    priority: 'high',
    icon: '📝',
  });

  return recommendations;
}

/**
 * Get profile summary with trends and recommendations (server-side)
 */
export async function getProfileSummaryServer(userId: string): Promise<ProfileSummary> {
  const [personality, mentalHealthRecords] = await Promise.all([
    getPersonalityProfileServer(userId),
    getMentalHealthHistoryServer(userId, 30),
  ]);

  const trends = calculateTrends(mentalHealthRecords);
  const recommendations = generateRecommendations(personality, mentalHealthRecords);

  return {
    personality,
    mentalHealthRecords,
    trends,
    recommendations,
  };
}
