// FILE: app/api/miso-debug/route.ts
import { NextResponse } from 'next/server'
import { getUnifiedProfile } from '@/services/unified-profile.service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Cần userId để test (vd: ?userId=...)' }, { status: 400 })
  }

  console.log(`🔍 Starting Smoke Test for User: ${userId}`)
  const t0 = performance.now()

  try {
    // 1. GỌI SERVICE CHÍNH (Core Injection Test)
    const profile = await getUnifiedProfile(userId)
    const t1 = performance.now()
    const executionTime = Math.round(t1 - t0)

    // 2. KIỂM TRA DỮ LIỆU (Assertion)
    const analysis = profile.miso_analysis
    const hasData = !!analysis
    const hasScores = !!analysis?.scores?.BVS && !!analysis?.scores?.RCS
    const hasProfile = !!analysis?.profile?.id

    // 3. ĐÁNH GIÁ KẾT QUẢ
    const testResult = {
      status: hasData && hasScores ? '✅ PASSED' : '❌ FAILED',
      performance: {
        execution_time_ms: executionTime,
        rating: executionTime < 100 ? 'EXCELLENT (<100ms)' : 'ACCEPTABLE'
      },
      integrity_check: {
        miso_object_exists: hasData,
        scores_calculated: hasScores,
        profile_classified: hasProfile,
      },
      debug_data: {
        profile_name: analysis?.profile?.name,
        BVS: analysis?.scores?.BVS,
        RCS: analysis?.scores?.RCS,
        discrepancies_found: analysis?.discrepancies?.length || 0,
        interventions_count: analysis?.interventions?.immediate?.length || 0
      }
    }

    return NextResponse.json(testResult)

  } catch (error: any) {
    return NextResponse.json({
      status: '❌ CRASHED',
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
