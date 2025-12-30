import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Debug API to check MISO analysis data
 * GET /api/debug/check-miso
 */
export async function GET() {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const results: Record<string, unknown> = {
            userId: user.id,
            timestamp: new Date().toISOString()
        }

        // Check miso_analysis_logs table
        const { data: misoLogs, error: misoError } = await supabase
            .from('miso_analysis_logs')
            .select('id, created_at, bvs, rcs, profile_id, risk_level, completeness_level')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)

        results.miso_analysis_logs = {
            count: misoLogs?.length || 0,
            error: misoError?.message || null,
            logs: misoLogs?.map(log => ({
                id: log.id,
                created_at: log.created_at,
                bvs: log.bvs,
                rcs: log.rcs,
                profile_id: log.profile_id,
                risk_level: log.risk_level,
                completeness_level: log.completeness_level
            })) || []
        }

        // Check if the latest log has analysis_result
        if (misoLogs && misoLogs.length > 0) {
            const { data: fullLog, error: fullError } = await supabase
                .from('miso_analysis_logs')
                .select('analysis_result')
                .eq('id', misoLogs[0].id)
                .single()

            results.latestAnalysis = {
                hasAnalysisResult: !!fullLog?.analysis_result,
                error: fullError?.message || null,
                analysisResultKeys: fullLog?.analysis_result ? Object.keys(fullLog.analysis_result as object) : []
            }
        }

        // Check RLS policy
        const { count: totalCount, error: countError } = await supabase
            .from('miso_analysis_logs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

        results.rlsCheck = {
            totalLogsForUser: totalCount,
            error: countError?.message || null
        }

        return NextResponse.json(results, { status: 200 })

    } catch (error) {
        console.error('Debug check-miso error:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
