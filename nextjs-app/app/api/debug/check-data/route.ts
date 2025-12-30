import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check all important tables
    const results: Record<string, unknown> = {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    }

    // 1. Check users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    results.users = {
      data: userData,
      error: userError?.message || null,
      exists: !!userData
    }

    // 2. Check personality_profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('personality_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    results.personality_profiles = {
      data: profileData,
      error: profileError?.message || null,
      exists: !!profileData,
      hasMbti: !!profileData?.mbti_type,
      hasBig5: !!(profileData?.big5_openness || profileData?.bfi2_score),
      hasEnneagram: !!profileData?.enneagram_type
    }

    // 3. Check mental_health_records table
    const { data: mentalHealthData, error: mentalHealthError } = await supabase
      .from('mental_health_records')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
    
    results.mental_health_records = {
      data: mentalHealthData,
      error: mentalHealthError?.message || null,
      count: mentalHealthData?.length || 0,
      latestTest: mentalHealthData?.[0] || null
    }

    // 4. Check bfi2_test_history table
    const { data: bfi2Data, error: bfi2Error } = await supabase
      .from('bfi2_test_history')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
    
    results.bfi2_test_history = {
      data: bfi2Data,
      error: bfi2Error?.message || null,
      count: bfi2Data?.length || 0,
      latestTest: bfi2Data?.[0] || null
    }

    // 5. Check VIA results (if table exists)
    const { data: viaData, error: viaError } = await supabase
      .from('via_results')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
    
    results.via_results = {
      data: viaData,
      error: viaError?.message || null,
      count: viaData?.length || 0,
      latestTest: viaData?.[0] || null
    }

    // 6. Check user_goals table
    const { data: goalsData, error: goalsError } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', user.id)
    
    results.user_goals = {
      data: goalsData,
      error: goalsError?.message || null,
      count: goalsData?.length || 0
    }

    // 7. Check action_plans table
    const { data: plansData, error: plansError } = await supabase
      .from('action_plans')
      .select('*')
      .eq('user_id', user.id)
    
    results.action_plans = {
      data: plansData,
      error: plansError?.message || null,
      count: plansData?.length || 0
    }

    // 8. Check chat_sessions table
    const { data: chatData, error: chatError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('last_message_at', { ascending: false })
    
    results.chat_sessions = {
      data: chatData,
      error: chatError?.message || null,
      count: chatData?.length || 0
    }

    // 9. Check gamification_profiles table (if exists)
    const { data: gamificationData, error: gamificationError } = await supabase
      .from('gamification_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    results.gamification_profiles = {
      data: gamificationData,
      error: gamificationError?.message || null,
      exists: !!gamificationData
    }

    // Summary
    results.summary = {
      hasUser: !!userData,
      hasPersonalityProfile: !!profileData,
      hasMbti: !!profileData?.mbti_type,
      hasBig5: !!(profileData?.big5_openness || profileData?.bfi2_score),
      mentalHealthTestCount: mentalHealthData?.length || 0,
      bfi2TestCount: bfi2Data?.length || 0,
      viaTestCount: viaData?.length || 0,
      goalsCount: goalsData?.length || 0,
      chatSessionsCount: chatData?.length || 0,
      hasGamification: !!gamificationData
    }

    return NextResponse.json(results, { status: 200 })

  } catch (error) {
    console.error('Debug check-data error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
