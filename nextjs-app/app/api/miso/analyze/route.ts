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

    // Parse request body
    const body = await request.json()
    const { dass21_raw, big5_raw, via_raw, mbti, include_history } = body

    // Validate at least DASS-21
    if (!dass21_raw) {
      return NextResponse.json(
        { error: 'DASS-21 scores are required' },
        { status: 400 }
      )
    }

    // Prepare user data
    const userData: UserInputData = {
      dass21_raw,
      big5_raw,
      via_raw,
      mbti,
    }

    // Fetch history if requested
    let history: any = undefined
    if (include_history) {
      // Fetch DASS-21 history
      const { data: dassHistory } = await supabase
        .from('dass21_results')
        .select('depression, anxiety, stress, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10)

      // Fetch Big5 history
      const { data: big5History } = await supabase
        .from('bfi2_results')
        .select('neuroticism, extraversion, openness, agreeableness, conscientiousness, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(10)

      history = {
        dass21: dassHistory?.map((d) => ({
          timestamp: new Date(d.completed_at),
          raw_scores: { D: d.depression, A: d.anxiety, S: d.stress },
        })),
        big5: big5History?.map((b) => ({
          timestamp: new Date(b.completed_at),
          raw_scores: {
            N: b.neuroticism,
            E: b.extraversion,
            O: b.openness,
            A: b.agreeableness,
            C: b.conscientiousness,
          },
        })),
      }
    }

    // Run analysis
    const analysisResult = await runMisoAnalysis(userData, user.id, history)

    // Save to database
    const { error: saveError } = await supabase.from('miso_analysis_logs').insert({
      user_id: user.id,
      analysis_result: analysisResult,
      bvs: analysisResult.scores?.BVS,
      rcs: analysisResult.scores?.RCS,
      profile_id: 'id' in analysisResult.profile ? analysisResult.profile.id : null,
      risk_level: 'risk_level' in analysisResult.profile ? analysisResult.profile.risk_level : null,
      completeness_level: analysisResult.completeness.level,
      dass21_depression: dass21_raw.D,
      dass21_anxiety: dass21_raw.A,
      dass21_stress: dass21_raw.S,
      big5_neuroticism: big5_raw?.N,
      big5_extraversion: big5_raw?.E,
      big5_openness: big5_raw?.O,
      big5_agreeableness: big5_raw?.A,
      big5_conscientiousness: big5_raw?.C,
    })

    if (saveError) {
      console.error('Error saving analysis:', saveError)
      // Don't fail the request, just log
    }

    // Save prediction feedback if we have predictions
    if (analysisResult.predictions && analysisResult.scores) {
      const { error: feedbackError } = await supabase.from('prediction_feedback').insert({
        user_id: user.id,
        bvs: analysisResult.scores.BVS,
        rcs: analysisResult.scores.RCS,
        predicted_dass_d: analysisResult.predictions.predictions.D,
        predicted_dass_a: analysisResult.predictions.predictions.A,
        predicted_dass_s: analysisResult.predictions.predictions.S,
        actual_dass_d: dass21_raw.D,
        actual_dass_a: dass21_raw.A,
        actual_dass_s: dass21_raw.S,
        delta_d: dass21_raw.D - analysisResult.predictions.predictions.D,
        delta_a: dass21_raw.A - analysisResult.predictions.predictions.A,
        delta_s: dass21_raw.S - analysisResult.predictions.predictions.S,
        mae:
          (Math.abs(dass21_raw.D - analysisResult.predictions.predictions.D) +
            Math.abs(dass21_raw.A - analysisResult.predictions.predictions.A) +
            Math.abs(dass21_raw.S - analysisResult.predictions.predictions.S)) /
          3,
        segment: 'vn',
      })

      if (feedbackError) {
        console.error('Error saving prediction feedback:', feedbackError)
      }
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
    })
  } catch (error: any) {
    console.error('MISO Analysis Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
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
  } catch (error: any) {
    console.error('Get Analysis History Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
