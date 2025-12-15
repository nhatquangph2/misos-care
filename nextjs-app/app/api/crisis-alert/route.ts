/**
 * API Route: Crisis Alert System
 * POST /api/crisis-alert - Create new crisis alert
 * GET /api/crisis-alert - Get crisis alerts (for mentors/admins)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CRISIS_HOTLINES } from '@/constants/tests/phq9-questions'

interface CrisisAlertRequest {
  testType: string
  severityLevel: string
  crisisReason: string
  totalScore: number
  question9Score?: number // For PHQ-9 suicidal ideation
  userInfo?: {
    name?: string
    phone?: string
    email?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: CrisisAlertRequest = await request.json()
    const { testType, severityLevel, crisisReason, totalScore, question9Score, userInfo } = body

    // Create crisis alert record
    const { data: alert, error: insertError } = await (supabase as any)
      .from('crisis_alerts')
      .insert({
        user_id: user.id,
        test_type: testType,
        severity_level: severityLevel,
        crisis_reason: crisisReason,
        total_score: totalScore,
        question_9_score: question9Score,
        user_contact_info: userInfo,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating crisis alert:', insertError)
      return NextResponse.json(
        { error: 'Database Error', message: insertError.message },
        { status: 500 }
      )
    }

    // Notify mentors/admins (if user has a mentor)
    await notifyMentors(supabase, user.id, alert)

    // Get emergency contact if available
    const { data: userProfile } = await supabase
      .from('users')
      .select('emergency_contact_name, emergency_contact_phone')
      .eq('id', user.id)
      .single() as { data: { emergency_contact_name?: string; emergency_contact_phone?: string } | null }

    return NextResponse.json({
      success: true,
      message: 'Cảnh báo khủng hoảng đã được ghi nhận',
      data: {
        alertId: alert.id,
        hotlines: CRISIS_HOTLINES,
        emergencyContact: userProfile?.emergency_contact_phone ? {
          name: userProfile.emergency_contact_name,
          phone: userProfile.emergency_contact_phone,
        } : null,
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is a mentor or admin
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null }

    if (!userProfile || !['mentor', 'admin'].includes(userProfile.role)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Bạn không có quyền xem cảnh báo khủng hoảng' },
        { status: 403 }
      )
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // pending, acknowledged, resolved
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get mentee IDs for this mentor
    let alertQuery = (supabase as any)
      .from('crisis_alerts')
      .select(`
        *,
        users:user_id (
          id,
          full_name,
          email,
          phone,
          emergency_contact_name,
          emergency_contact_phone
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    // If mentor, only show alerts for their mentees
    if (userProfile.role === 'mentor') {
      const { data: relationships } = await supabase
        .from('mentor_relationships')
        .select('mentee_id')
        .eq('mentor_id', user.id)
        .eq('status', 'active') as { data: { mentee_id: string }[] | null }

      if (relationships && relationships.length > 0) {
        const menteeIds = relationships.map(r => r.mentee_id)
        alertQuery = alertQuery.in('user_id', menteeIds)
      } else {
        // No mentees, return empty
        return NextResponse.json({ success: true, data: [] })
      }
    }

    if (status) {
      alertQuery = alertQuery.eq('status', status)
    }

    const { data: alerts, error } = await alertQuery

    if (error) {
      console.error('Error fetching crisis alerts:', error)
      return NextResponse.json(
        { error: 'Database Error' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: alerts || [],
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

/**
 * Notify user's mentors about crisis alert
 */
async function notifyMentors(supabase: any, userId: string, alert: any) {
  try {
    // Find active mentor relationships
    const { data: relationships } = await supabase
      .from('mentor_relationships')
      .select(`
        mentor_id,
        mentor:mentor_id (
          id,
          full_name,
          email,
          notification_preferences
        )
      `)
      .eq('mentee_id', userId)
      .eq('status', 'active')

    if (!relationships || relationships.length === 0) {
      console.log('No active mentors found for user:', userId)
      return
    }

    // Create notifications for each mentor
    for (const rel of relationships) {
      await supabase.from('notifications').insert({
        user_id: rel.mentor_id,
        type: 'crisis_alert',
        title: '🚨 Cảnh báo khủng hoảng từ mentee',
        message: `Một mentee của bạn vừa có kết quả test đáng lo ngại (${alert.test_type}: ${alert.total_score} điểm). Vui lòng kiểm tra và liên hệ ngay.`,
        data: {
          alertId: alert.id,
          menteeId: userId,
          testType: alert.test_type,
          severityLevel: alert.severity_level,
        },
        read: false,
        created_at: new Date().toISOString(),
      })

      // TODO: Send push notification / email
      console.log(`Notification sent to mentor: ${rel.mentor_id}`)
    }
  } catch (error) {
    console.error('Error notifying mentors:', error)
  }
}
