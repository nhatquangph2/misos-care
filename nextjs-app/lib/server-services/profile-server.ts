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
import {
  getCareerCounseling,
  getMentalHealthInsights,
  getLearningStyleRecommendations,
  getRelationshipInsights
} from '@/services/bfi2-counseling.service';
import type { BFI2Score } from '@/constants/tests/bfi2-questions';

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
 * Generate Big5-based detailed recommendations
 */
function generateBig5Recommendations(personality: PersonalityProfile): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Construct BFI2Score from personality profile
  const bfi2Score: BFI2Score = {
    domains: {
      E: personality.big5_extraversion || 3,
      A: personality.big5_agreeableness || 3,
      C: personality.big5_conscientiousness || 3,
      N: personality.big5_neuroticism || 3,
      O: personality.big5_openness || 3,
    },
    // Mock tScores - in production, calculate properly
    tScores: {
      domains: {
        E: 50,
        A: 50,
        C: 50,
        N: 50,
        O: 50,
      },
      facets: {} as any
    },
    percentiles: {
      domains: {
        E: 50,
        A: 50,
        C: 50,
        N: 50,
        O: 50,
      }
    },
    facets: {} as any
  };

  // Career counseling
  const careers = getCareerCounseling(bfi2Score);
  careers.slice(0, 2).forEach((career, idx) => {
    recommendations.push({
      id: `career-${idx}`,
      type: 'professional',
      title: `💼 ${career.category}`,
      description: `${career.reason}\n\n**Nghề nghiệp phù hợp:** ${career.careers.slice(0, 3).join(', ')}`,
      priority: idx === 0 ? 'high' : 'medium',
      icon: '💼',
    });
  });

  // Mental health insights
  const mentalHealth = getMentalHealthInsights(bfi2Score);
  mentalHealth.slice(0, 3).forEach((insight, idx) => {
    recommendations.push({
      id: `mental-${idx}`,
      type: insight.type === 'risk' ? 'professional' : 'habit',
      title: insight.title,
      description: `${insight.description}\n\n**Khuyến nghị:** ${insight.recommendations.slice(0, 2).join('; ')}`,
      priority: insight.type === 'risk' ? 'high' : 'medium',
      icon: insight.type === 'risk' ? '⚠️' : '✅',
    });
  });

  // Learning style
  const learning = getLearningStyleRecommendations(bfi2Score);
  recommendations.push({
    id: 'learning-style',
    type: 'activity',
    title: `📚 Phong cách học tập: ${learning.overallStyle.split('•')[0].trim()}`,
    description: `${learning.description}\n\n**Phương pháp tốt nhất:** ${learning.bestMethods.slice(0, 2).join('; ')}`,
    priority: 'medium',
    icon: '📚',
  });

  // Relationship insights
  const relationship = getRelationshipInsights(bfi2Score);
  recommendations.push({
    id: 'relationship',
    type: 'social',
    title: `💬 Giao tiếp: ${relationship.communicationStyle.split('(')[0].trim()}`,
    description: `**Phong cách xung đột:** ${relationship.conflictStyle}\n\n**Lời khuyên:** ${relationship.tips.slice(0, 2).join('; ')}`,
    priority: 'medium',
    icon: '💬',
  });

  return recommendations;
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
  personality: PersonalityProfile | null,
  records: MentalHealthRecord[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // If user has Big5 profile, use detailed counseling service
  if (personality?.big5_openness !== null && personality?.big5_openness !== undefined) {
    const big5Recs = generateBig5Recommendations(personality);
    recommendations.push(...big5Recs);
  }

  const recentRecords = records.slice(0, 3);
  const hasHighSeverity = recentRecords.some(
    r => r.severity_level === 'severe' || r.severity_level === 'extremely-severe' || r.severity_level === 'critical'
  );

  // High priority: Seek professional help
  if (hasHighSeverity) {
    recommendations.push({
      id: 'seek-professional',
      type: 'professional',
      title: 'Tìm Kiếm Hỗ Trợ Chuyên Nghiệp',
      description: 'Kết quả test gần đây cho thấy bạn đang trải qua giai đoạn khó khăn. Chúng tôi khuyến nghị bạn tìm kiếm sự hỗ trợ từ chuyên gia tâm lý.',
      priority: 'high',
      icon: '🏥',
      actionText: 'Tìm chuyên gia',
      actionUrl: '/mentor',
    });
  }

  // Daily journaling
  recommendations.push({
    id: 'daily-journaling',
    type: 'habit',
    title: 'Ghi Nhật Ký Cảm Xúc',
    description: 'Viết nhật ký 10-15 phút mỗi ngày giúp bạn xử lý cảm xúc, giảm căng thẳng và tăng khả năng tự nhận thức.',
    priority: 'high',
    icon: '📝',
  });

  // Mindfulness meditation
  recommendations.push({
    id: 'mindfulness-meditation',
    type: 'habit',
    title: 'Thiền Chánh Niệm',
    description: 'Luyện tập thiền 10-20 phút mỗi ngày giúp giảm căng thẳng, cải thiện tập trung và điều hòa cảm xúc.',
    priority: 'medium',
    icon: '🧘',
  });

  // Physical exercise
  recommendations.push({
    id: 'physical-exercise',
    type: 'habit',
    title: 'Tập Thể Dục Đều Đặn',
    description: 'Vận động 30 phút mỗi ngày giúp giải phóng endorphin, cải thiện tâm trạng và giảm triệu chứng trầm cảm, lo âu.',
    priority: 'medium',
    icon: '🏃',
  });

  // Sleep hygiene
  const hasAnxietyOrStress = recentRecords.some(
    r => r.test_type === 'GAD7' || r.test_type === 'PSS'
  );
  if (hasAnxietyOrStress) {
    recommendations.push({
      id: 'sleep-hygiene',
      type: 'habit',
      title: 'Cải Thiện Giấc Ngủ',
      description: 'Thiết lập thói quen ngủ đều đặn 7-8 tiếng mỗi đêm, tránh màn hình trước khi ngủ để cải thiện chất lượng giấc ngủ.',
      priority: 'medium',
      icon: '😴',
    });
  }

  // Social connection
  if (personality?.mbti_type && (personality.mbti_type.includes('E'))) {
    recommendations.push({
      id: 'social-connection',
      type: 'social',
      title: 'Kết Nối Xã Hội',
      description: 'Với tính cách hướng ngoại của bạn, hãy dành thời gian gặp gỡ bạn bè, tham gia hoạt động nhóm để nạp năng lượng.',
      priority: 'medium',
      icon: '👥',
    });
  }

  // Take regular tests
  if (records.length < 3) {
    recommendations.push({
      id: 'regular-testing',
      type: 'test',
      title: 'Theo Dõi Định Kỳ',
      description: 'Làm bài test sức khỏe tinh thần 2-4 tuần một lần để theo dõi tiến triển và phát hiện sớm các vấn đề.',
      priority: 'medium',
      icon: '📊',
      actionText: 'Làm bài test',
      actionUrl: '/tests',
    });
  }

  // Big5 personality test recommendation
  if (!personality?.big5_openness) {
    recommendations.push({
      id: 'take-big5',
      type: 'test',
      title: 'Khám Phá Tính Cách Big5',
      description: 'Hoàn thành bài test Big Five để hiểu rõ hơn về 5 chiều tính cách chính của bạn: Cởi mở, Tận tâm, Hòa đồng, Dễ chịu và Ổn định cảm xúc.',
      priority: 'low',
      icon: '🌟',
      actionText: 'Làm Big5 Test',
      actionUrl: '/tests/big5',
    });
  }

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
