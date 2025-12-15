/**
 * API Route: Get Test History
 * GET /api/tests/history
 * Returns user's test history with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Bạn cần đăng nhập để xem lịch sử' },
        { status: 401 }
      )
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const testType = searchParams.get('testType')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch mental health records
    let mentalHealthQuery = supabase
      .from('mental_health_records')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (testType) {
      mentalHealthQuery = mentalHealthQuery.eq('test_type', testType)
    }

    const { data: mentalHealthRecords, error: mhError } = await mentalHealthQuery

    if (mhError) {
      console.error('Error fetching mental health records:', mhError)
    }

    // Fetch personality profile
    const { data: personalityProfile, error: ppError } = await supabase
      .from('personality_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (ppError && ppError.code !== 'PGRST116') {
      console.error('Error fetching personality profile:', ppError)
    }

    return NextResponse.json({
      success: true,
      data: {
        mentalHealthRecords: mentalHealthRecords || [],
        personalityProfile: personalityProfile || null,
      },
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Đã xảy ra lỗi không mong muốn' },
      { status: 500 }
    )
  }
}
