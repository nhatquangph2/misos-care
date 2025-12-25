import { BaseService } from './base.service';
import type { MentalHealthRecord } from '@/types/database';
import type { TestType } from '@/types/enums';

export interface TimelineEntry {
  id: string;
  date: string;
  type: 'personality' | 'mental_health';
  testName: string;
  testType?: TestType | 'BFI2' | 'MBTI';
  score?: number;
  severity?: string;
  domains?: {
    E?: number;
    A?: number;
    C?: number;
    N?: number;
    O?: number;
  };
  mbtiType?: string;
  crisisFlag?: boolean;
}

export interface TestHistorySummary {
  totalTests: number;
  personalityTests: number;
  mentalHealthTests: number;
  lastTestDate: string | null;
  hasCrisisHistory: boolean;
  testsByType: {
    PHQ9: number;
    GAD7: number;
    DASS21: number;
    PSS: number;
    BFI2: number;
    MBTI: number;
  };
}

export interface TestTrend {
  testType: TestType | 'BFI2';
  dates: string[];
  scores: number[];
  severities: string[];
  trend: 'improving' | 'stable' | 'worsening' | 'insufficient_data';
  percentageChange?: number;
}

export interface ComparisonData {
  testType: string;
  date1: string;
  date2: string;
  score1: number;
  score2: number;
  scoreDifference: number;
  severity1: string;
  severity2: string;
  severityChange: 'improved' | 'same' | 'worsened';
}

export class TestHistoryService extends BaseService {
  async getTestTimeline(): Promise<TimelineEntry[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const timeline: TimelineEntry[] = [];

    const { data: mentalHealthData, error: mhError } = await this.supabase
      .from('mental_health_records')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (!mhError && mentalHealthData) {
      mentalHealthData.forEach((record) => {
        const testNames: Record<string, string> = {
          PHQ9: 'PHQ-9: Trầm cảm',
          GAD7: 'GAD-7: Lo âu',
          DASS21: 'DASS-21: Trầm cảm, Lo âu, Stress',
          PSS: 'PSS: Stress'
        };

        timeline.push({
          id: record.id,
          date: record.completed_at,
          type: 'mental_health',
          testName: testNames[record.test_type] || record.test_type,
          testType: record.test_type as TestType,
          score: record.total_score,
          severity: record.severity_level,
          crisisFlag: record.crisis_flag
        });
      });
    }

    const { data: profile, error: pError } = await this.supabase
      .from('personality_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!pError && profile) {
      if (profile.big5_openness !== null) {
        timeline.push({
          id: profile.id,
          date: profile.last_updated || profile.created_at,
          type: 'personality',
          testName: 'BFI-2: Big Five Inventory',
          testType: 'BFI2',
          domains: {
            E: profile.big5_extraversion ?? undefined,
            A: profile.big5_agreeableness ?? undefined,
            C: profile.big5_conscientiousness ?? undefined,
            N: profile.big5_neuroticism ?? undefined,
            O: profile.big5_openness ?? undefined
          }
        });
      }

      if (profile.mbti_type) {
        timeline.push({
          id: `${profile.id}-mbti`,
          date: profile.last_updated || profile.created_at,
          type: 'personality',
          testName: 'MBTI: Myers-Briggs Type Indicator',
          testType: 'MBTI',
          mbtiType: profile.mbti_type
        });
      }
    }

    return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTestHistorySummary(): Promise<TestHistorySummary> {
    const { data: { user } } = await this.supabase.auth.getUser();
    const empty: TestHistorySummary = { totalTests: 0, personalityTests: 0, mentalHealthTests: 0, lastTestDate: null, hasCrisisHistory: false, testsByType: { PHQ9: 0, GAD7: 0, DASS21: 0, PSS: 0, BFI2: 0, MBTI: 0 } };
    if (!user) return empty;

    const summary: TestHistorySummary = { ...empty };
    const { data: mhData, count: mhCount } = await this.supabase
      .from('mental_health_records')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (mhData && mhCount !== null) {
      summary.mentalHealthTests = mhCount;
      summary.totalTests += mhCount;
      mhData.forEach((record) => {
        const testType = record.test_type as keyof typeof summary.testsByType;
        if (testType in summary.testsByType) summary.testsByType[testType]++;
        if (record.crisis_flag) summary.hasCrisisHistory = true;
      });
      if (mhData.length > 0) summary.lastTestDate = mhData[0].completed_at;
    }

    const { data: profile } = await this.supabase
      .from('personality_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile) {
      if (profile.big5_openness !== null) {
        summary.personalityTests++;
        summary.totalTests++;
        summary.testsByType.BFI2 = 1;
        const profileDate = profile.last_updated || profile.created_at;
        if (!summary.lastTestDate || new Date(profileDate) > new Date(summary.lastTestDate)) summary.lastTestDate = profileDate;
      }
      if (profile.mbti_type) {
        summary.personalityTests++;
        summary.totalTests++;
        summary.testsByType.MBTI = 1;
      }
    }

    return summary;
  }

  async getTestTrend(testType: TestType): Promise<TestTrend> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return { testType, dates: [], scores: [], severities: [], trend: 'insufficient_data' };

    const { data, error } = await this.supabase
      .from('mental_health_records')
      .select('completed_at, total_score, severity_level')
      .eq('user_id', user.id)
      .eq('test_type', testType)
      .order('completed_at', { ascending: true });

    if (error || !data || data.length < 2) {
      const records = data || [];
      return {
        testType,
        dates: records.map(r => r.completed_at),
        scores: records.map(r => r.total_score),
        severities: records.map(r => r.severity_level),
        trend: 'insufficient_data'
      };
    }

    const scores = data.map(r => r.total_score);
    const firstScore = scores[0];
    const lastScore = scores[scores.length - 1];
    const percentageChange = ((lastScore - firstScore) / (firstScore || 1)) * 100;
    let trend: 'improving' | 'stable' | 'worsening' = 'stable';
    if (percentageChange < -10) trend = 'improving';
    else if (percentageChange > 10) trend = 'worsening';

    return {
      testType,
      dates: data.map(r => r.completed_at),
      scores,
      severities: data.map(r => r.severity_level),
      trend,
      percentageChange
    };
  }

  async getBFI2Trend(): Promise<{ domains: string[]; scores: number[]; lastUpdated: string | null }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return { domains: [], scores: [], lastUpdated: null };

    const { data: profile } = await this.supabase
      .from('personality_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile) return { domains: [], scores: [], lastUpdated: null };
    return {
      domains: ['Extraversion', 'Agreeableness', 'Conscientiousness', 'Neuroticism', 'Openness'],
      scores: [
        profile.big5_extraversion ?? 0,
        profile.big5_agreeableness ?? 0,
        profile.big5_conscientiousness ?? 0,
        profile.big5_neuroticism ?? 0,
        profile.big5_openness ?? 0
      ],
      lastUpdated: profile.last_updated || profile.created_at
    };
  }

  async compareTestResults(testType: TestType, date1: string, date2: string): Promise<ComparisonData | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data } = await this.supabase
      .from('mental_health_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('test_type', testType)
      .in('completed_at', [date1, date2]);

    if (!data || data.length !== 2) return null;
    const r1 = data.find(r => r.completed_at === date1);
    const r2 = data.find(r => r.completed_at === date2);
    if (!r1 || !r2) return null;

    const order = ['normal', 'mild', 'moderate', 'severe', 'extremely_severe'];
    const idx1 = order.indexOf(r1.severity_level);
    const idx2 = order.indexOf(r2.severity_level);
    let change: 'improved' | 'same' | 'worsened' = 'same';
    if (idx2 < idx1) change = 'improved';
    else if (idx2 > idx1) change = 'worsened';

    return {
      testType, date1, date2,
      score1: r1.total_score,
      score2: r2.total_score,
      scoreDifference: r2.total_score - r1.total_score,
      severity1: r1.severity_level,
      severity2: r2.severity_level,
      severityChange: change
    };
  }

  async getTestHistoryByDateRange(start: Date, end: Date): Promise<TimelineEntry[]> {
    const timeline = await this.getTestTimeline();
    return timeline.filter(e => {
      const d = new Date(e.date);
      return d >= start && d <= end;
    });
  }

  async getTestTypeHistory(testType: TestType): Promise<MentalHealthRecord[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.supabase
      .from('mental_health_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('test_type', testType)
      .order('completed_at', { ascending: false });

    return (error || !data) ? [] : (data as MentalHealthRecord[]);
  }

  async exportTestHistoryData() {
    const [timeline, summary] = await Promise.all([this.getTestTimeline(), this.getTestHistorySummary()]);
    return { summary, timeline, exportedAt: new Date().toISOString() };
  }
}

export const testHistoryService = new TestHistoryService();

export const getTestTimeline = () => testHistoryService.getTestTimeline();
export const getTestHistorySummary = () => testHistoryService.getTestHistorySummary();
export const getTestTrend = (t: TestType) => testHistoryService.getTestTrend(t);
export const getBFI2Trend = () => testHistoryService.getBFI2Trend();
export const compareTestResults = (t: TestType, d1: string, d2: string) => testHistoryService.compareTestResults(t, d1, d2);
export const getTestHistoryByDateRange = (s: Date, e: Date) => testHistoryService.getTestHistoryByDateRange(s, e);
export const getTestTypeHistory = (t: TestType) => testHistoryService.getTestTypeHistory(t);
export const exportTestHistoryData = () => testHistoryService.exportTestHistoryData();
