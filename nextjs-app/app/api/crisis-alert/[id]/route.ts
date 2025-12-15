/**
 * API Route: Update Crisis Alert Status
 * PATCH /api/crisis-alert/[id] - Update alert status (for mentors/admins)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface UpdateAlertRequest {
  status: 'acknowledged' | 'in_progress' | 'resolved'
  notes?: string
  followUpDate?: string
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

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
        { error: 'Forbidden', message: 'Bạn không có quyền cập nhật cảnh báo' },
        { status: 403 }
      )
    }

    const body: UpdateAlertRequest = await request.json()
    const { status, notes, followUpDate } = body

    // Update alert
    const updateData: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
      handled_by: user.id,
    }

    if (notes) {
      updateData.handler_notes = notes
    }

    if (followUpDate) {
      updateData.follow_up_date = followUpDate
    }

    if (status === 'acknowledged') {
      updateData.acknowledged_at = new Date().toISOString()
    } else if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString()
    }

    const { data: alert, error: updateError } = await (supabase as any)
      .from('crisis_alerts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating crisis alert:', updateError)
      return NextResponse.json(
        { error: 'Database Error', message: updateError.message },
        { status: 500 }
      )
    }

    // Create activity log
    await (supabase as any).from('crisis_alert_logs').insert({
      alert_id: id,
      action: status,
      performed_by: user.id,
      notes: notes,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Cảnh báo đã được cập nhật',
      data: alert,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch alert with user info
    const { data: alert, error } = await (supabase as any)
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
        ),
        handler:handled_by (
          id,
          full_name
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Not Found' },
        { status: 404 }
      )
    }

    // Check authorization (user can see their own, mentors can see their mentees')
    if (alert.user_id !== user.id) {
      // Check if user is mentor/admin
      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single() as { data: { role: string } | null }

      if (!userProfile || !['mentor', 'admin'].includes(userProfile.role)) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }

      // If mentor, check if this is their mentee
      if (userProfile.role === 'mentor') {
        const { data: relationship } = await supabase
          .from('mentor_relationships')
          .select('id')
          .eq('mentor_id', user.id)
          .eq('mentee_id', alert.user_id)
          .eq('status', 'active')
          .single()

        if (!relationship) {
          return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
          )
        }
      }
    }

    // Fetch activity logs
    const { data: logs } = await (supabase as any)
      .from('crisis_alert_logs')
      .select(`
        *,
        performed_by_user:performed_by (
          id,
          full_name
        )
      `)
      .eq('alert_id', id)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      success: true,
      data: {
        ...alert,
        logs: logs || [],
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
