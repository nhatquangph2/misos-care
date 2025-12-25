/**
 * MISO V3 Analysis API Route
 * POST /api/miso/analyze
 */

import { NextRequest, NextResponse } from 'next/server'
import { runMisoAnalysis } from '@/lib/miso'
import { createClient } from '@/lib/supabase/server'
import type { UserInputData } from '@/types/miso-v3'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body safely
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      // Body might be empty, which is fine if we fetch from DB
      body = {};
    }

    let { dass21_raw, big5_raw, via_raw, mbti, include_history } = body

    // 1. Fetch DASS-21 if missing
    if (!dass21_raw) {
      const { data: latestDass } = await supabase
        .from('mental_health_records')
        .select('subscale_scores, total_score')
        .eq('user_id', user.id)
        .eq('test_type', 'DASS21')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestDass?.subscale_scores) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const s = latestDass.subscale_scores as any;
        dass21_raw = {
          D: s.depression ?? 0,
          A: s.anxiety ?? 0,
          S: s.stress ?? 0
        };
      }
    }

    // Validate at least DASS-21
    if (!dass21_raw) {
      return NextResponse.json(
        { error: 'DASS-21 scores are required (none found in request or database)' },
        { status: 400 }
      )
    }

    // Prepare user data
    let userData: UserInputData = {
      dass21_raw,
      big5_raw,
      via_raw,
      mbti,
    }

    // Enrichment: If personality data is missing, trying to fetch from multiple DB sources
    if (!userData.big5_raw || !userData.via_raw || !userData.mbti) {
      // 1. Fetch from personality_profiles (MBTI + basic Big5)
      const { data: profile } = await supabase
        .from('personality_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profile) {
        if (!userData.mbti && profile.mbti_type) userData.mbti = profile.mbti_type;

        if (!userData.big5_raw && (profile.big5_neuroticism_raw !== undefined || profile.big5_neuroticism !== undefined)) {
          userData.big5_raw = {
            N: (profile.big5_neuroticism_raw ?? profile.big5_neuroticism) ?? 0,
            E: (profile.big5_extraversion_raw ?? profile.big5_extraversion) ?? 0,
            O: (profile.big5_openness_raw ?? profile.big5_openness) ?? 0,
            A: (profile.big5_agreeableness_raw ?? profile.big5_agreeableness) ?? 0,
            C: (profile.big5_conscientiousness_raw ?? profile.big5_conscientiousness) ?? 0,
          };
        }
      }

      // 2. Fetch from via_results (Support for full 24 strengths)
      if (!userData.via_raw) {
        const { data: viaResult } = await supabase
          .from('via_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (viaResult) {
          const viaMap: Record<string, number> = {};

          // Map of key format used in NormData/Engine
          const standardKeys = [
            'Creativity', 'Curiosity', 'Judgment', 'Love of Learning', 'Perspective',
            'Bravery', 'Perseverance', 'Honesty', 'Zest', 'Love', 'Kindness',
            'Social Intelligence', 'Teamwork', 'Fairness', 'Leadership',
            'Forgiveness', 'Humility', 'Prudence', 'Self-Regulation',
            'Appreciation of Beauty', 'Gratitude', 'Hope', 'Humor', 'Spirituality'
          ];

          // Priority 1: Check all_strengths JSONB
          if (viaResult.all_strengths) {
            const allS = viaResult.all_strengths as Record<string, number>;
            standardKeys.forEach(k => {
              if (allS[k] !== undefined) viaMap[k] = allS[k];
              // Also check lowercase/snake_case variants
              else {
                const variant = k.toLowerCase().replace(/ /g, '_').replace(/-/g, '_');
                if (allS[variant] !== undefined) viaMap[k] = allS[variant];
              }
            });
          }

          // Priority 2: Check explicit columns
          const columnKeys: Record<string, string> = {
            hope: 'Hope', zest: 'Zest', self_regulation: 'Self-Regulation',
            gratitude: 'Gratitude', spirituality: 'Spirituality', forgiveness: 'Forgiveness',
            prudence: 'Prudence', love: 'Love', kindness: 'Kindness',
            perspective: 'Perspective', curiosity: 'Curiosity', creativity: 'Creativity',
            perseverance: 'Perseverance'
          };

          Object.entries(columnKeys).forEach(([col, key]) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const val = (viaResult as any)[col];
            if (viaMap[key] === undefined && val !== undefined) {
              viaMap[key] = Number(val);
            }
          });

          if (Object.keys(viaMap).length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userData.via_raw = viaMap as any;
          }
        }

        // Fallback to signature strengths if still no VIA and no via_results record
        if (!userData.via_raw && profile?.via_signature_strengths) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const signatureStrengths = profile.via_signature_strengths as any[];
          if (Array.isArray(signatureStrengths) && signatureStrengths.length > 0) {
            const viaMap: Record<string, number> = {};
            const keyMapping: Record<string, string> = {
              'creativity': 'Creativity', 'curiosity': 'Curiosity', 'judgment': 'Judgment',
              'love_of_learning': 'Love of Learning', 'perspective': 'Perspective',
              'bravery': 'Bravery', 'perseverance': 'Perseverance', 'honesty': 'Honesty',
              'zest': 'Zest', 'love': 'Love', 'kindness': 'Kindness',
              'social_intelligence': 'Social Intelligence', 'teamwork': 'Teamwork',
              'fairness': 'Fairness', 'leadership': 'Leadership', 'forgiveness': 'Forgiveness',
              'humility': 'Humility', 'prudence': 'Prudence', 'self_regulation': 'Self-Regulation',
              'appreciation_of_beauty': 'Appreciation of Beauty', 'gratitude': 'Gratitude',
              'hope': 'Hope', 'humor': 'Humor', 'spirituality': 'Spirituality',
            };

            signatureStrengths.forEach((s: any) => {
              const rawKey = (s.strength || '').toLowerCase().replace(/-/g, '_');
              const key = keyMapping[rawKey] || s.strengthName || rawKey;
              const pctScore = s.percentageScore ?? s.percentile ?? 85; // High score for sig
              viaMap[key] = (pctScore / 100) * 4 + 1;
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userData.via_raw = viaMap as any;
          }
        }
      }
    }


    // Fetch history if requested
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let history: any = undefined
    if (include_history) {
      // Fetch DASS-21 history from mental_health_records
      const { data: dassHistory } = await supabase
        .from('mental_health_records')
        .select('subscale_scores, completed_at')
        .eq('user_id', user.id)
        .eq('test_type', 'DASS21')
        .order('completed_at', { ascending: false })
        .limit(10)

      // Fetch Big5 history
      const { data: big5History } = await supabase
        .from('bfi2_test_history')
        .select('raw_scores, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10)

      history = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dass21: dassHistory?.map((d: any) => ({
          timestamp: new Date(d.completed_at),
          raw_scores: {
            D: d.subscale_scores?.depression ?? 0,
            A: d.subscale_scores?.anxiety ?? 0,
            S: d.subscale_scores?.stress ?? 0
          },
        })),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        big5: big5History?.map((b: any) => ({
          timestamp: new Date(b.completed_at),
          raw_scores: b.raw_scores, // Direct access from bfi2_test_history
        })),
      }
    }

    // Run analysis
    console.log('🚀 Running MISO Analysis for user:', user.id);
    const analysisResult = await runMisoAnalysis(userData, user.id, history)
    console.log('✅ Analysis complete');

    // Save to database
    // @ts-ignore
    const logData = {
      user_id: user.id,
      analysis_result: analysisResult,
      bvs: analysisResult.scores?.BVS,
      rcs: analysisResult.scores?.RCS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile_id: ('profile' in analysisResult && analysisResult.profile && 'id' in analysisResult.profile) ? (analysisResult.profile as any).id : null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      risk_level: ('profile' in analysisResult && analysisResult.profile && 'risk_level' in analysisResult.profile) ? (analysisResult.profile as any).risk_level : null,
      completeness_level: analysisResult.completeness.level,
      dass21_depression: userData.dass21_raw?.D,
      dass21_anxiety: userData.dass21_raw?.A,
      dass21_stress: userData.dass21_raw?.S,
      big5_neuroticism: userData.big5_raw?.N,
      big5_extraversion: userData.big5_raw?.E,
      big5_openness: userData.big5_raw?.O,
      big5_agreeableness: userData.big5_raw?.A,
      big5_conscientiousness: userData.big5_raw?.C,
    };

    console.log('💾 Saving analysis log...');
    const { error: saveError } = await supabase.from('miso_analysis_logs').insert(logData)

    if (saveError) {
      console.error('❌ Error saving analysis:', saveError)
    } else {
      console.log('✅ Analysis log saved');
    }

    // Save prediction feedback if we have predictions
    if (analysisResult.predictions && analysisResult.scores && userData.dass21_raw) {
      console.log('💾 Saving prediction feedback...');
      const actualD = userData.dass21_raw.D;
      const actualA = userData.dass21_raw.A;
      const actualS = userData.dass21_raw.S;
      const pred = analysisResult.predictions.predictions;

      // @ts-ignore
      const { error: feedbackError } = await supabase.from('prediction_feedback').insert({
        user_id: user.id,
        bvs: analysisResult.scores.BVS,
        rcs: analysisResult.scores.RCS,
        predicted_dass_d: pred.D,
        predicted_dass_a: pred.A,
        predicted_dass_s: pred.S,
        actual_dass_d: actualD,
        actual_dass_a: actualA,
        actual_dass_s: actualS,
        delta_d: actualD - (pred.D || 0),
        delta_a: actualA - (pred.A || 0),
        delta_s: actualS - (pred.S || 0),
        mae:
          (Math.abs(actualD - (pred.D || 0)) +
            Math.abs(actualA - (pred.A || 0)) +
            Math.abs(actualS - (pred.S || 0))) /
          3,
        segment: 'vn',
      })

      if (feedbackError) {
        console.error('❌ Error saving prediction feedback:', feedbackError)
      } else {
        console.log('✅ Prediction feedback saved');
      }
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
    })
  } catch (error: unknown) {
    console.error('🔥 MISO Analysis Critical Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    const stack = error instanceof Error ? error.stack : undefined
    return NextResponse.json(
      { error: 'Internal server error', details: message, stack },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve analysis history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const { data, error } = await supabase
      .from('miso_analysis_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      analyses: data,
    })
  } catch (error: unknown) {
    console.error('Get Analysis History Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', details: message },
      { status: 500 }
    )
  }
}
