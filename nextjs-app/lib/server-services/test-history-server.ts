/**
 * Server-side Test History Service
 * Use this in Server Components, Server Actions, and API Routes
 */

import { createClient as createServerClient } from '@/lib/supabase/server';
import type { MentalHealthRecord, TestType } from '@/services/mental-health-records.service';
import type { PersonalityProfile } from '@/types/database';
import type { TimelineEntry } from '@/services/test-history.service';

/**
 * Get complete timeline of all tests (server-side)
 */
export async function getTestTimelineServer(userId: string): Promise<TimelineEntry[]> {
  const supabase = await createServerClient();
  const timeline: TimelineEntry[] = [];

  // Fetch mental health records
  const { data: mentalHealthData, error: mhError } = await supabase
    .from('mental_health_records')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (!mhError && mentalHealthData) {
    (mentalHealthData as MentalHealthRecord[]).forEach((record) => {
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
        testType: record.test_type,
        score: record.total_score,
        severity: record.severity_level,
        crisisFlag: record.crisis_flag
      });
    });
  }

  // Fetch personality profile
  const { data: personalityData, error: pError } = await supabase
    .from('personality_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!pError && personalityData) {
    const profile = personalityData as PersonalityProfile;

    // Add BFI-2 entry
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

    // Add MBTI entry if exists
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

  // Sort timeline by date (newest first)
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return timeline;
}
