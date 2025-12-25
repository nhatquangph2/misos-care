import { BFI2Score } from '@/constants/tests/bfi2-questions';
import { MisoAnalysisResult, UserInputData } from '@/types/miso-v3';
import { BaseService } from './base.service';
import {
  BFI2TestHistory,
  VIAResultRecord,
  MBTIResultRecord,
  SISRI24ResultRecord,
  PersonalityProfile
} from '@/types/database';


export interface MBTIResult {
  type: string;
  dimensions: {
    EI: 'E' | 'I';
    SN: 'S' | 'N';
    TF: 'T' | 'F';
    JP: 'J' | 'P';
  };
  functions: {
    dominant: string;
    auxiliary: string;
    tertiary: string;
    inferior: string;
  };
  completedAt: number;
}

export interface VIAResult {
  strengths: {
    rank: number;
    name: string;
    score: number;
    category: 'signature' | 'middle' | 'lower';
  }[];
  topFive: string[];
  completedAt: number;
}

export interface MultipleIntelligencesResult {
  scores: {
    linguistic: number;
    logicalMathematical: number;
    spatial: number;
    musicalRhythmic: number;
    bodilyKinesthetic: number;
    interpersonal: number;
    intrapersonal: number;
    naturalistic: number;
  };
  dominant: string[];
  completedAt: number;
}

export interface UnifiedProfile {
  mbti?: MBTIResult;
  big5?: BFI2Score;
  via?: VIAResult;
  multipleIntelligences?: MultipleIntelligencesResult;
  miso_analysis?: MisoAnalysisResult;
  legacy_profile?: PersonalityProfile;
  completionStatus: {
    mbti: boolean;
    big5: boolean;
    via: boolean;
    mi: boolean;
    completionPercentage: number;
  };
  generatedAt: number;
}

export interface CrossTestInsight {
  title: string;
  description: string;
  evidenceFrom: string[];
  actionableAdvice: string[];
  category: 'strength' | 'risk' | 'opportunity' | 'contradiction';
}

export class UnifiedProfileService extends BaseService {
  /**
   * Fetch all assessment results and build unified profile
   */
  async getUnifiedProfile(userId: string): Promise<UnifiedProfile> {
    const { runMisoAnalysis } = await import('@/lib/miso/engine');

    const [bfi2Res, viaRes, dassRes, mbtiRes, sisriRes, legacyProfileRes] = await Promise.all([
      this.supabase.from('bfi2_test_history').select('*').eq('user_id', userId).order('completed_at', { ascending: false }).limit(1).maybeSingle(),
      this.supabase.from('via_results').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      this.supabase.from('mental_health_records').select('*').eq('user_id', userId).eq('test_type', 'DASS21').order('completed_at', { ascending: false }).limit(1).maybeSingle(),
      this.supabase.from('mbti_results').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      this.supabase.from('sisri24_results').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      this.supabase.from('personality_profiles').select('*').eq('user_id', userId).maybeSingle()
    ]);

    const profile: Partial<UnifiedProfile> = {
      generatedAt: Date.now(),
      legacy_profile: legacyProfileRes.data as PersonalityProfile || undefined
    };

    // Mapping logic
    const bfi2Data = bfi2Res.data as BFI2TestHistory | null;
    if (bfi2Data?.score) {
      profile.big5 = bfi2Data.score as unknown as BFI2Score;
    } else if (profile.legacy_profile?.bfi2_score) {
      profile.big5 = profile.legacy_profile.bfi2_score as unknown as BFI2Score;
    } else if (profile.legacy_profile?.big5_neuroticism_raw !== undefined && profile.legacy_profile?.big5_neuroticism_raw !== null) {
      // Create minimal BFI2Score from old raw fields if available
      profile.big5 = {
        domains: {
          N: profile.legacy_profile.big5_neuroticism_raw || 0,
          E: profile.legacy_profile.big5_extraversion_raw || 0,
          O: profile.legacy_profile.big5_openness_raw || 0,
          A: profile.legacy_profile.big5_agreeableness_raw || 0,
          C: profile.legacy_profile.big5_conscientiousness_raw || 0,
        },
        facets: {},
        tScores: { domains: { N: 50, E: 50, O: 50, A: 50, C: 50 }, facets: {} },
        percentiles: { domains: { N: 50, E: 50, O: 50, A: 50, C: 50 } },
        raw_scores: {
          N: profile.legacy_profile.big5_neuroticism_raw || 0,
          E: profile.legacy_profile.big5_extraversion_raw || 0,
          O: profile.legacy_profile.big5_openness_raw || 0,
          A: profile.legacy_profile.big5_agreeableness_raw || 0,
          C: profile.legacy_profile.big5_conscientiousness_raw || 0,
        }
      };
    }

    const mbtiData = mbtiRes.data as MBTIResultRecord | null;
    if (mbtiData?.result) {
      profile.mbti = {
        ...(mbtiData.result as unknown as MBTIResult),
        completedAt: new Date(mbtiData.created_at).getTime()
      } as MBTIResult;
    } else if (profile.legacy_profile?.mbti_type) {
      profile.mbti = {
        type: profile.legacy_profile.mbti_type,
        dimensions: (profile.legacy_profile.mbti_scores as Record<string, unknown>)?.dimensions as Record<string, string> || {},
        functions: (profile.legacy_profile.mbti_scores as Record<string, unknown>)?.functions as Record<string, string> || {},
        completedAt: new Date(profile.legacy_profile.last_updated).getTime()
      } as MBTIResult;
    }

    const viaData = viaRes.data as unknown as VIAResultRecord | null;
    if (viaData?.ranked_strengths) {
      profile.via = {
        strengths: viaData.ranked_strengths.map((s, i) => {
          // Try to find score in viaData directly (column) or in score JSONB
          let scoreVal = 0;
          const colName = s.toLowerCase().replace(/ /g, '_').replace(/-/g, '_');
          if ((viaData as any)[colName] !== undefined) {
            scoreVal = Number((viaData as any)[colName]);
          } else if (viaData.score && typeof viaData.score === 'object') {
            const scores = viaData.score as Record<string, number>;
            scoreVal = scores[s] || scores[colName] || 0;
          }

          return {
            rank: i + 1,
            name: s,
            score: scoreVal,
            category: i < 5 ? ('signature' as const) : i < 19 ? ('middle' as const) : ('lower' as const)
          };
        }),
        topFive: viaData.ranked_strengths.slice(0, 5),
        completedAt: new Date(viaData.created_at || Date.now()).getTime()
      };
    }

    const sisriData = sisriRes.data as SISRI24ResultRecord | null;
    if (sisriData?.scores) {
      const scores = sisriData.scores as Record<string, number>;
      profile.multipleIntelligences = {
        scores: scores as unknown as MultipleIntelligencesResult['scores'],
        dominant: Object.entries(scores)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([k]) => k),
        completedAt: new Date(sisriData.created_at).getTime()
      };
    }

    // Fetch latest MISO analysis from logs instead of recalculating
    try {
      const { data: misoLog } = await this.supabase
        .from('miso_analysis_logs')
        .select('analysis_result')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (misoLog?.analysis_result) {
        profile.miso_analysis = misoLog.analysis_result as unknown as MisoAnalysisResult;
      }
    } catch (error) {
      console.error('Failed to fetch MISO analysis:', error);
    }

    const finalProfile = profile as UnifiedProfile;
    finalProfile.completionStatus = this.getCompletionStatus(finalProfile);
    return finalProfile;
  }

  getCompletionStatus(profile: UnifiedProfile): UnifiedProfile['completionStatus'] {
    const completed = [
      profile.mbti !== undefined,
      profile.big5 !== undefined,
      profile.via !== undefined,
      profile.multipleIntelligences !== undefined,
    ];
    const completionPercentage = (completed.filter(Boolean).length / 4) * 100;
    return {
      mbti: completed[0],
      big5: completed[1],
      via: completed[2],
      mi: completed[3],
      completionPercentage,
    };
  }

  getMissingAssessments(profile: UnifiedProfile): string[] {
    const missing: string[] = [];
    if (!profile.mbti) missing.push('MBTI');
    if (!profile.big5) missing.push('Big Five (BFI-2)');
    if (!profile.via) missing.push('VIA Character Strengths');
    if (!profile.multipleIntelligences) missing.push('Multiple Intelligences');
    return missing;
  }

  generateCrossTestInsights(): CrossTestInsight[] {
    return [];
  }
}

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export const unifiedProfileService = new UnifiedProfileService();

// Updated: Accept optional Supabase client for server-side usage
export const getUnifiedProfile = (
  id: string,
  supabase?: SupabaseClient<Database>
) => {
  // If a client is provided (from Server Component), use it
  const service = supabase
    ? new UnifiedProfileService(supabase)
    : unifiedProfileService;
  return service.getUnifiedProfile(id);
};

export const getCompletionStatus = (p: UnifiedProfile) => unifiedProfileService.getCompletionStatus(p);
export const getMissingAssessments = (p: UnifiedProfile) => unifiedProfileService.getMissingAssessments(p);
export const generateCrossTestInsights = () => unifiedProfileService.generateCrossTestInsights();

