/**
 * API Route: Submit Test Results
 * POST /api/tests/submit
 * Saves test results to database and triggers crisis alerts if needed
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CRISIS_THRESHOLD } from '@/constants/tests/phq9-questions'
import { normalizeBig5 } from '@/lib/miso/normalization'

export type TestType = 'PHQ9' | 'GAD7' | 'DASS21' | 'PSS' | 'MBTI' | 'BIG5' | 'SISRI24' | 'VIA'

interface SubmitTestRequest {
  testType: TestType
  answers: { questionId: number; value: number }[]
  result: {
    totalScore?: number
    severity?: string
    severityLevel?: string
    crisisFlag?: boolean
    crisisReason?: string
    // MBTI specific
    type?: string
    percentages?: Record<string, number>
    // Big5 specific
    dimensions?: Record<string, number>
    // SISRI24 specific
    dimensionScores?: Record<string, number>
    // DASS-21 specific
    subscaleScores?: any[] // Array of { subscale: string, normalizedScore: number }
    // VIA specific
    signatureStrengths?: any[]
    topVirtue?: string
    strengthScores?: any[] // Added for full result storage
    // NEW: MISO V3
    raw_scores?: any
    score?: any
    completion_time_seconds?: number
    quality_warnings?: string[]
    responses?: any
  }
  completedAt?: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Bạn cần đăng nhập để lưu kết quả' },
        { status: 401 }
      )
    }

    const body: SubmitTestRequest = await request.json()
    const { testType, answers, result, completedAt } = body

    // Validate required fields
    if (!testType || !answers || !result) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    // Determine if this is a mental health test or personality test
    const mentalHealthTests = ['PHQ9', 'GAD7', 'DASS21', 'PSS']
    const personalityTests = ['MBTI', 'BIG5', 'SISRI24', 'VIA']

    let savedRecord = null
    let crisisAlertTriggered = false

    if (mentalHealthTests.includes(testType)) {
      // Save to mental_health_records table
      const { data, error } = await supabase
        .from('mental_health_records')
        .insert({
          user_id: user.id,
          test_type: testType,
          test_version: '1.0',
          total_score: result.totalScore || 0,
          severity_level: result.severityLevel || 'normal',
          crisis_flag: result.crisisFlag || false,
          crisis_reason: result.crisisReason || null,
          // Extract subscale scores for DASS-21
          subscale_scores: result.subscaleScores ?
            (Array.isArray(result.subscaleScores) ?
              result.subscaleScores.reduce((acc: any, curr: any) => {
                acc[curr.subscale] = curr.normalizedScore;
                return acc;
              }, {}) :
              result.subscaleScores
            ) : null,
          raw_responses: answers,
          completed_at: completedAt || new Date().toISOString(),
        } as any)
        .select()
        .single()

      if (error) {
        console.error('Error saving mental health record:', error)
        return NextResponse.json(
          { error: 'Database Error', message: error.message },
          { status: 500 }
        )
      }

      savedRecord = data

      // Check for crisis alert
      if (result.crisisFlag) {
        crisisAlertTriggered = true
        // Trigger crisis alert (will be handled by crisis-alert service)
        await triggerCrisisAlert(supabase, user.id, testType, result)
      }
    } else if (personalityTests.includes(testType)) {
      // Save to personality_profiles table
      const profileData: Record<string, any> = {
        user_id: user.id,
        updated_at: new Date().toISOString(),
      }

      if (testType === 'MBTI' && result.type) {
        profileData.mbti_type = result.type
        profileData.mbti_scores = result.percentages
      } else if (testType === 'BIG5' && result.dimensions) {
        // Big5 dimensions are stored as separate columns (percentage for backward compatibility)
        if (result.dimensions.openness !== undefined) profileData.big5_openness = result.dimensions.openness
        if (result.dimensions.conscientiousness !== undefined) profileData.big5_conscientiousness = result.dimensions.conscientiousness
        if (result.dimensions.extraversion !== undefined) profileData.big5_extraversion = result.dimensions.extraversion
        if (result.dimensions.agreeableness !== undefined) profileData.big5_agreeableness = result.dimensions.agreeableness
        if (result.dimensions.neuroticism !== undefined) profileData.big5_neuroticism = result.dimensions.neuroticism

        // NEW: Store raw scores (1-5 scale) for MISO V3 integration
        if (result.raw_scores) {
          profileData.big5_openness_raw = result.raw_scores.O
          profileData.big5_conscientiousness_raw = result.raw_scores.C
          profileData.big5_extraversion_raw = result.raw_scores.E
          profileData.big5_agreeableness_raw = result.raw_scores.A
          profileData.big5_neuroticism_raw = result.raw_scores.N

          // FUTURE-PROOFING: Force recalculation of percentiles on backend
          // This guarantees data consistency regardless of frontend logic
          try {
            const { normalized } = normalizeBig5(result.raw_scores)
            // Prioritize our backend calculation over frontend's result.dimensions
            if (normalized?.O) profileData.big5_openness = normalized.O.percentile
            if (normalized?.C) profileData.big5_conscientiousness = normalized.C.percentile
            if (normalized?.E) profileData.big5_extraversion = normalized.E.percentile
            if (normalized?.A) profileData.big5_agreeableness = normalized.A.percentile
            if (normalized?.N) profileData.big5_neuroticism = normalized.N.percentile
          } catch (e) {
            console.error('Failed to normalize Big5 on backend:', e)
          }
        }

        // NEW: Store complete BFI-2 score object
        if (result.score) {
          profileData.bfi2_score = result.score
        }

        // NEW: Save to bfi2_test_history table for temporal analysis
        if (result.score && result.raw_scores) {
          const historyData = {
            user_id: user.id,
            score: result.score,
            raw_scores: result.raw_scores,
            completion_time_seconds: result.completion_time_seconds,
            quality_warnings: result.quality_warnings || [],
            raw_responses: result.responses || null,
            completed_at: new Date().toISOString(),
          }

          const { error: historyError } = await supabase
            .from('bfi2_test_history')
            .insert(historyData)

          if (historyError) {
            console.error('Error saving BFI-2 test history:', historyError)
            // Don't fail the request, just log
          }
        }
      } else if (testType === 'SISRI24' && result.dimensionScores) {
        profileData.sisri24_scores = result.dimensionScores
      } else if (testType === 'VIA' && result.signatureStrengths) {
        // VIA Character Strengths
        profileData.via_signature_strengths = result.signatureStrengths
        profileData.via_top_virtue = result.topVirtue

        // --- NEW: Save detailed results to via_results table ---
        if (result.strengthScores) {
          const viaInsertData = {
            user_id: user.id,
            ranked_strengths: result.strengthScores.map((s: any) => s.strength),
            score: result.strengthScores.reduce((acc: any, s: any) => {
              acc[s.strength] = s.percentageScore;
              return acc;
            }, {}),
            all_strengths: result.strengthScores, // Full detail for robust parsing
            responses: answers, // NEW: Save raw responses
            created_at: new Date().toISOString()
          };

          const { error: viaError } = await supabase
            .from('via_results')
            .insert(viaInsertData);

          if (viaError) {
            console.error('Error saving via_results:', viaError);
          }
        }
        // -------------------------------------------------------
      }

      // Upsert personality profile
      const { data, error } = await supabase
        .from('personality_profiles')
        .upsert(profileData as any, { onConflict: 'user_id' })
        .select()
        .single()

      if (error) {
        console.error('Error saving personality profile:', error)
        return NextResponse.json(
          { error: 'Database Error', message: error.message },
          { status: 500 }
        )
      }

      savedRecord = data
    }

    // === GAMIFICATION: Thưởng Bubbles cho việc hoàn thành test ===
    let bubblesAwarded = 0
    try {
      // Cộng 50 bubbles cho mỗi bài test hoàn thành
      const { error: gamificationError } = await (supabase.rpc as any)('increment_bubbles', {
        user_id_param: user.id,
        amount_param: 50
      })

      if (!gamificationError) {
        bubblesAwarded = 50
        // Update streak days
        await (supabase.rpc as any)('update_streak_days', {
          user_id_param: user.id
        })
      } else {
        console.error('Error awarding bubbles:', gamificationError)
      }
    } catch (gamificationError) {
      console.error('Gamification error:', gamificationError)
      // Don't fail the request if gamification fails
    }
    // === End Gamification ===

    return NextResponse.json({
      success: true,
      message: 'Kết quả đã được lưu thành công',
      data: savedRecord,
      crisisAlertTriggered,
      bubblesAwarded, // Thông báo cho client biết được thưởng bao nhiêu bubbles
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Đã xảy ra lỗi không mong muốn' },
      { status: 500 }
    )
  }
}

/**
 * Trigger crisis alert for high-risk mental health results
 */
async function triggerCrisisAlert(
  supabase: any,
  userId: string,
  testType: string,
  result: any
) {
  try {
    // Insert crisis alert record
    await supabase.from('crisis_alerts').insert({
      user_id: userId,
      test_type: testType,
      severity_level: result.severityLevel || 'severe',
      crisis_reason: result.crisisReason || 'High severity score detected',
      total_score: result.totalScore,
      status: 'pending',
      created_at: new Date().toISOString(),
    })

    // TODO: Send notifications (email, push, etc.)
    // This will be expanded in the Crisis Alert System

    console.log(`Crisis alert triggered for user ${userId} on test ${testType}`)
  } catch (error) {
    console.error('Error triggering crisis alert:', error)
    // Don't throw - we don't want to fail the main request
  }
}
