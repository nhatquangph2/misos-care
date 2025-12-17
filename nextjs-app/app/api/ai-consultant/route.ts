/**
 * AI Consultant API Endpoint
 * Handles consultation requests with strict scientific constraints
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAIConsultation, type ConsultationRequest } from '@/services/ai-consultant.service'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json() as ConsultationRequest

    // Validate request
    if (!body.userProfile || !body.issue || !body.specificSituation) {
      return NextResponse.json(
        { error: 'Missing required fields: userProfile, issue, specificSituation' },
        { status: 400 }
      )
    }

    // Validate issue type
    const validIssues = ['stress', 'anxiety', 'depression', 'procrastination', 'relationships', 'general']
    if (!validIssues.includes(body.issue)) {
      return NextResponse.json(
        { error: `Invalid issue type. Must be one of: ${validIssues.join(', ')}` },
        { status: 400 }
      )
    }

    // Call AI consultation service
    const result = await getAIConsultation(body) as any

    // Log consultation for analytics (optional - don't await to keep response fast)
    (supabase.from('ai_consultations') as any).insert({
      user_id: user.id,
      issue_type: body.issue,
      situation: body.specificSituation,
    }).catch((err: any) => {
      // Don't fail if logging fails
      console.warn('Failed to log consultation:', err)
    })

    return NextResponse.json({
      success: true,
      data: result,
    })

  } catch (error) {
    console.error('AI Consultant API Error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'AI Consultant API is running',
    version: '1.0.0',
    endpoints: {
      POST: '/api/ai-consultant',
    },
    requiredFields: ['userProfile', 'issue', 'specificSituation'],
    validIssues: ['stress', 'anxiety', 'depression', 'procrastination', 'relationships', 'general'],
  })
}
