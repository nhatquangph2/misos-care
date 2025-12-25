import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runMisoAnalysis } from '@/lib/miso/engine'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
    }

    console.log('[Miso-Debug] Starting diagnosis for user:', user.id)

    // 1. Check DASS-21 (The likely culprit)
    const dassRecords = await supabase
      .from('mental_health_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('test_type', 'DASS21')
      .order('completed_at', { ascending: false })

    console.log('[Miso-Debug] DASS Records found:', dassRecords.data?.length || 0)

    // 2. Check Big5 History
    const bfi2History = await supabase
      .from('bfi2_test_history')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    console.log('[Miso-Debug] BFI2 History Records found:', bfi2History.data?.length || 0)
    console.log('[Miso-Debug] BFI2 Query Error:', bfi2History.error)

    // 3. Check Legacy Profile
    const legacyProfile = await (supabase as any)
      .from('personality_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // 4. Trace the extraction logic
    const dassTop = dassRecords.data?.[0];
    const dassScores = (dassTop as any)?.subscale_scores;

    const bfi2Top = bfi2History.data?.[0];
    const bfi2RawAvg = (bfi2Top as any)?.raw_scores || (legacyProfile.data as any)?.bfi2_score?.raw_scores || {
      N: (Number((legacyProfile.data as any)?.big5_neuroticism) / 100 * 4) + 1,
      E: (Number((legacyProfile.data as any)?.big5_extraversion) / 100 * 4) + 1,
      O: (Number((legacyProfile.data as any)?.big5_openness) / 100 * 4) + 1,
      A: (Number((legacyProfile.data as any)?.big5_agreeableness) || 50 / 100 * 4) + 1,
      C: (Number((legacyProfile.data as any)?.big5_conscientiousness) || 50 / 100 * 4) + 1
    };

    // Scale to matched Engine norms
    const big5ItemCounts: Record<string, number> = { N: 8, E: 8, O: 10, A: 9, C: 9 }
    const bfi2RawSummed = bfi2RawAvg ? Object.fromEntries(
      Object.entries(bfi2RawAvg as any).map(([k, v]) => [k, (Number(v) || 3) * (big5ItemCounts[k] || 8)])
    ) : null;

    // 5. Simulate Engine Input
    const engineInput = {
      mbti: (legacyProfile.data as any)?.mbti_type,
      big5_raw: bfi2RawSummed,
      dass21_raw: dassScores ? {
        D: (dassScores as any).depression || 0,
        A: (dassScores as any).anxiety || 0,
        S: (dassScores as any).stress || 0
      } : undefined
    }

    let analysisResult = null;
    let engineError = null;
    try {
      analysisResult = await runMisoAnalysis(engineInput as any, user.id);
    } catch (e: any) {
      engineError = e.message;
    }

    return NextResponse.json({
      userId: user.id,
      mentalHealthRecordsTable: {
        count: dassRecords.data?.length,
        latestSubscales: dassScores,
        error: dassRecords.error
      },
      bfi2HistoryTable: {
        count: bfi2History.data?.length,
        error: bfi2History.error
      },
      personalityProfileTable: {
        found: !!legacyProfile.data,
        hasRawColumns: !!legacyProfile.data?.big5_openness_raw,
        error: legacyProfile.error
      },
      determinedEngineInput: engineInput,
      engineOutput: analysisResult,
      engineError
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
