/**
 * Debug API: Sports Data Inspector
 * Returns raw sports recommendation data as JSON for debugging
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runMisoAnalysis } from '@/lib/miso/engine'
import { getPersonalizedRecommendations } from '@/services/recommendation.service'
import { getFlowStateRecommendations } from '@/services/enhanced-intervention.service'

export async function GET() {
    const debugLog: string[] = []

    try {
        debugLog.push('1. Starting debug...')

        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({
                error: 'Not authenticated',
                authError: authError?.message,
                debugLog
            }, { status: 401 })
        }

        debugLog.push(`2. User authenticated: ${user.id.substring(0, 8)}...`)

        // Get personality profile
        const { data: profile, error: profileError } = await supabase
            .from('personality_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (profileError || !profile) {
            return NextResponse.json({
                error: 'No personality profile found',
                profileError: profileError?.message,
                debugLog
            }, { status: 404 })
        }

        debugLog.push('3. Profile found')

        // Get DASS scores
        const { data: dassRecord } = await supabase
            .from('mental_health_records')
            .select('subscale_scores')
            .eq('user_id', user.id)
            .eq('test_type', 'DASS21')
            .order('completed_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        debugLog.push(`4. DASS record: ${dassRecord ? 'Found' : 'Not found'}`)

        // Build Big5 raw
        const big5_raw = {
            O: profile.big5_openness_raw || profile.big5_openness || 50,
            C: profile.big5_conscientiousness_raw || profile.big5_conscientiousness || 50,
            E: profile.big5_extraversion_raw || profile.big5_extraversion || 50,
            A: profile.big5_agreeableness_raw || profile.big5_agreeableness || 50,
            N: profile.big5_neuroticism_raw || profile.big5_neuroticism || 50,
        }

        debugLog.push(`5. Big5 raw: ${JSON.stringify(big5_raw)}`)

        // Run MISO Analysis
        let misoResult
        try {
            misoResult = await runMisoAnalysis({
                big5_raw,
                mbti: profile.mbti_type || undefined,
                dass21_raw: dassRecord?.subscale_scores as any
            }, user.id)
            debugLog.push('6. MISO analysis completed')
        } catch (misoError: any) {
            return NextResponse.json({
                error: 'MISO analysis failed',
                misoError: misoError?.message || String(misoError),
                stack: misoError?.stack,
                debugLog
            }, { status: 500 })
        }

        // Get recommendations
        let recommendations
        try {
            recommendations = getPersonalizedRecommendations(misoResult)
            debugLog.push('7. Recommendations generated')
        } catch (recError: any) {
            return NextResponse.json({
                error: 'Recommendations failed',
                recError: recError?.message || String(recError),
                stack: recError?.stack,
                debugLog
            }, { status: 500 })
        }

        // Get Flow States
        let flowStates
        try {
            flowStates = getFlowStateRecommendations(big5_raw)
            debugLog.push(`8. Flow states generated: ${flowStates.length} items`)
        } catch (flowError: any) {
            return NextResponse.json({
                error: 'Flow states failed',
                flowError: flowError?.message || String(flowError),
                stack: flowError?.stack,
                debugLog
            }, { status: 500 })
        }

        // Check for non-serializable data
        const checkSerializable = (obj: any, path: string): string[] => {
            const issues: string[] = []
            if (obj === null || obj === undefined) return issues
            if (typeof obj === 'function') {
                issues.push(`Function at ${path}`)
            } else if (typeof obj === 'symbol') {
                issues.push(`Symbol at ${path}`)
            } else if (typeof obj === 'object') {
                if (obj instanceof Date) {
                    // Dates serialize to ISO strings, OK
                } else if (Array.isArray(obj)) {
                    obj.forEach((item, i) => {
                        issues.push(...checkSerializable(item, `${path}[${i}]`))
                    })
                } else {
                    Object.keys(obj).forEach(key => {
                        issues.push(...checkSerializable(obj[key], `${path}.${key}`))
                    })
                }
            }
            return issues
        }

        const sportsIssues = checkSerializable(recommendations.sports, 'sports')
        const flowIssues = checkSerializable(flowStates, 'flowStates')

        debugLog.push(`9. Serialization check: sports=${sportsIssues.length} issues, flow=${flowIssues.length} issues`)

        return NextResponse.json({
            success: true,
            debugLog,
            serializationIssues: {
                sports: sportsIssues,
                flowStates: flowIssues
            },
            data: {
                sports: recommendations.sports,
                flowStates: flowStates,
            },
            input: {
                big5_raw,
                mbti: profile.mbti_type,
                hasDass: !!dassRecord
            }
        })

    } catch (error: any) {
        return NextResponse.json({
            error: 'Unexpected error',
            message: error?.message || String(error),
            stack: error?.stack,
            debugLog
        }, { status: 500 })
    }
}
