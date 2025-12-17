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

  // Convert Big5 scores from database (0-100 percentage) to BFI-2 scale (1-5)
  const convertToScale = (percentage: number | null): number => {
    if (percentage === null || percentage === undefined) return 3; // Default to middle
    return 1 + (percentage / 100) * 4; // Convert 0-100 to 1-5
  };

  // Construct BFI2Score from personality profile
  const bfi2Score: BFI2Score = {
    domains: {
      E: convertToScale(personality.big5_extraversion),
      A: convertToScale(personality.big5_agreeableness),
      C: convertToScale(personality.big5_conscientiousness),
      N: convertToScale(personality.big5_neuroticism),
      O: convertToScale(personality.big5_openness),
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
    facets: {} as any,
    // Raw scores - estimated from percentages (not accurate, users should retake test)
    raw_scores: {
      N: Math.round((personality.big5_neuroticism || 50) / 100 * 32 + 8), // 8-40 range
      E: Math.round((personality.big5_extraversion || 50) / 100 * 32 + 8),
      O: Math.round((personality.big5_openness || 50) / 100 * 40 + 10), // 10-50 range
      A: Math.round((personality.big5_agreeableness || 50) / 100 * 36 + 9), // 9-45 range
      C: Math.round((personality.big5_conscientiousness || 50) / 100 * 36 + 9),
    }
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

  // Debug logging
  console.log('🔍 Personality data:', personality);
  console.log('🔍 Big5 openness value:', personality?.big5_openness);
  console.log('🔍 Big5 openness type:', typeof personality?.big5_openness);

  // If user has Big5 profile, use detailed counseling service
  // Check if at least one Big5 dimension exists (not null/undefined)
  const hasBig5Data = personality && (
    personality.big5_openness !== null ||
    personality.big5_conscientiousness !== null ||
    personality.big5_extraversion !== null ||
    personality.big5_agreeableness !== null ||
    personality.big5_neuroticism !== null
  );

  console.log('🔍 Has Big5 data:', hasBig5Data);

  if (hasBig5Data) {
    const big5Recs = generateBig5Recommendations(personality);
    console.log('🔍 Big5 recommendations count:', big5Recs.length);
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

  // Daily journaling - always show (helps with emotional processing)
  recommendations.push({
    id: 'daily-journaling',
    type: 'habit',
    title: 'Ghi Nhật Ký Cảm Xúc',
    description: 'Viết nhật ký 10-15 phút mỗi ngày giúp bạn xử lý cảm xúc, giảm căng thẳng và tăng khả năng tự nhận thức.',
    priority: 'high',
    icon: '📝',
  });

  // Only add other generic recommendations if user doesn't have Big5 data yet
  if (!hasBig5Data) {
    // Behavioral Activation (evidence-based for depression/anxiety)
    recommendations.push({
      id: 'behavioral-activation',
      type: 'habit',
      title: 'Kích Hoạt Hành Vi',
      description: 'Lập lịch và thực hiện các hoạt động có ý nghĩa mỗi ngày (gặp bạn, sở thích, công việc). Phương pháp CBT hiệu quả cao cho trầm cảm và lo âu.',
      priority: 'medium',
      icon: '🎯',
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

    // Social connection based on MBTI
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
    recommendations.push({
      id: 'take-big5',
      type: 'test',
      title: 'Khám Phá Tính Cách Big5',
      description: 'Hoàn thành bài test Big Five để hiểu rõ hơn về 5 chiều tính cách chính của bạn: Cởi mở, Tận tâm, Hòa đồng, Dễ chịu và Ổn định cảm xúc.',
      priority: 'high',
      icon: '🌟',
      actionText: 'Làm Big5 Test',
      actionUrl: '/tests/big5',
    });
  }

  console.log('🔍 Total recommendations generated:', recommendations.length);
  console.log('🔍 Recommendations:', recommendations.map(r => ({ id: r.id, title: r.title })));

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
