/**
 * Debug API: Compare Dashboard vs Detail Page Data
 * Returns side-by-side comparison of data sources
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runMisoAnalysis } from '@/lib/miso/engine'
import { getPersonalizedRecommendations } from '@/services/recommendation.service'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        // Get personality profile
        const { data: profile } = await supabase
            .from('personality_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (!profile) {
            return NextResponse.json({ error: 'No personality profile' }, { status: 404 })
        }

        // Get cached analysis (DASHBOARD PATH)
        const { data: cachedAnalysis } = await supabase
            .from('miso_analysis_logs')
            .select('analysis_result, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        // Get DASS scores
        const { data: dassRecord } = await supabase
            .from('mental_health_records')
            .select('subscale_scores')
            .eq('user_id', user.id)
            .eq('test_type', 'DASS21')
            .order('completed_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        // DETAIL PAGE PATH: Run fresh analysis
        const big5_raw = {
            O: profile.big5_openness_raw || profile.big5_openness || 50,
            C: profile.big5_conscientiousness_raw || profile.big5_conscientiousness || 50,
            E: profile.big5_extraversion_raw || profile.big5_extraversion || 50,
            A: profile.big5_agreeableness_raw || profile.big5_agreeableness || 50,
            N: profile.big5_neuroticism_raw || profile.big5_neuroticism || 50,
        }

        const freshMisoResult = await runMisoAnalysis({
            big5_raw,
            mbti: profile.mbti_type || undefined,
            dass21_raw: dassRecord?.subscale_scores as any
        }, user.id)

        const freshRecommendations = getPersonalizedRecommendations(freshMisoResult)

        // DASHBOARD PATH: Use cached or fallback
        let dashboardRecommendations = null
        let dashboardBig5Source = 'none'

        if (cachedAnalysis?.analysis_result) {
            const cached = cachedAnalysis.analysis_result as any
            // Polyfill like dashboard does
            if (!cached.normalized) cached.normalized = {}
            if (!cached.normalized.big5 || !cached.normalized.big5.O) {
                cached.normalized.big5 = {
                    O: profile.big5_openness ?? 50,
                    C: profile.big5_conscientiousness ?? 50,
                    E: profile.big5_extraversion ?? 50,
                    A: profile.big5_agreeableness ?? 50,
                    N: profile.big5_neuroticism ?? 50
                }
                dashboardBig5Source = 'polyfill_from_profile_percentile'
            } else {
                dashboardBig5Source = 'cached_analysis'
            }
            dashboardRecommendations = getPersonalizedRecommendations(cached)
        } else {
            // Fallback like dashboard does
            const minimal = {
                normalized: {
                    big5: {
                        O: profile.big5_openness ?? 50,
                        C: profile.big5_conscientiousness ?? 50,
                        E: profile.big5_extraversion ?? 50,
                        A: profile.big5_agreeableness ?? 50,
                        N: profile.big5_neuroticism ?? 50
                    }
                }
            }
            dashboardRecommendations = getPersonalizedRecommendations(minimal as any)
            dashboardBig5Source = 'fallback_from_profile_percentile'
        }

        return NextResponse.json({
            profile: {
                mbti: profile.mbti_type,
                big5_raw: big5_raw,
                big5_percentile: {
                    O: profile.big5_openness,
                    C: profile.big5_conscientiousness,
                    E: profile.big5_extraversion,
                    A: profile.big5_agreeableness,
                    N: profile.big5_neuroticism
                }
            },
            hasCachedAnalysis: !!cachedAnalysis,
            cachedAnalysisDate: cachedAnalysis?.created_at,
            dashboardPath: {
                source: dashboardBig5Source,
                hollandCode: dashboardRecommendations?.career?.hollandCode,
                mentalToughnessScore: dashboardRecommendations?.sports?.mentalToughnessScore,
                topCareer: dashboardRecommendations?.career?.careers?.[0]?.titleVi
            },
            detailPagePath: {
                source: 'fresh_runMisoAnalysis',
                hollandCode: freshRecommendations?.career?.hollandCode,
                mentalToughnessScore: freshRecommendations?.sports?.mentalToughnessScore,
                topCareer: freshRecommendations?.career?.careers?.[0]?.titleVi,
                normalizedBig5: freshMisoResult.normalized?.big5 ?
                    Object.fromEntries(
                        Object.entries(freshMisoResult.normalized.big5).map(([k, v]: [string, any]) => [
                            k,
                            typeof v === 'object' ? v.percentile : v
                        ])
                    ) : null
            }
        })

    } catch (error: any) {
        return NextResponse.json({
            error: 'Unexpected error',
            message: error?.message,
            stack: error?.stack
        }, { status: 500 })
    }
}
