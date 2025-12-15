/**
 * API Route: Submit Test Results
 * POST /api/tests/submit
 * Saves test results to database and triggers crisis alerts if needed
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CRISIS_THRESHOLD } from '@/constants/tests/phq9-questions'

export type TestType = 'PHQ9' | 'GAD7' | 'DASS21' | 'PSS' | 'MBTI' | 'BIG5' | 'SISRI24'

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
    const personalityTests = ['MBTI', 'BIG5', 'SISRI24']

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
        profileData.mbti_percentages = result.percentages
      } else if (testType === 'BIG5' && result.dimensions) {
        profileData.big5_scores = result.dimensions
      } else if (testType === 'SISRI24' && result.dimensionScores) {
        profileData.sisri24_scores = result.dimensionScores
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

    return NextResponse.json({
      success: true,
      message: 'Kết quả đã được lưu thành công',
      data: savedRecord,
      crisisAlertTriggered,
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
