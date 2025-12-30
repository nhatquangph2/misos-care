import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Debug API to check all test data storage
 * GET /api/debug/check-tests
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

        // =====================================================
        // 1. DASS-21 (Mental Health)
        // =====================================================
        const { data: dass21Data, error: dass21Error } = await supabase
            .from('mental_health_records')
            .select('*')
            .eq('user_id', user.id)
            .eq('test_type', 'DASS21')
            .order('completed_at', { ascending: false })

        results.DASS21 = {
            table: 'mental_health_records',
            count: dass21Data?.length || 0,
            error: dass21Error?.message || null,
            latestTest: dass21Data?.[0] ? {
                id: dass21Data[0].id,
                total_score: dass21Data[0].total_score,
                subscale_scores: dass21Data[0].subscale_scores,
                severity_level: dass21Data[0].severity_level,
                has_raw_responses: !!dass21Data[0].raw_responses,
                completed_at: dass21Data[0].completed_at
            } : null,
            issues: []
        }

        // Check for data issues
        if (dass21Data) {
            const issues: string[] = []
            dass21Data.forEach((record, index) => {
                if (record.total_score === 0 && record.subscale_scores) {
                    const sum = Object.values(record.subscale_scores as Record<string, number>).reduce((a, b) => a + b, 0)
                    if (sum > 0) issues.push(`Record ${index}: total_score=0 but subscale_scores sum=${sum}`)
                }
                if (!record.subscale_scores && record.raw_responses) {
                    issues.push(`Record ${index}: has raw_responses but no subscale_scores`)
                }
            })
            results.DASS21 = { ...(results.DASS21 as object), issues }
        }

        // =====================================================
        // 2. BIG5 / BFI-2
        // =====================================================

        // Check personality_profiles for Big5
        const { data: profileData } = await supabase
            .from('personality_profiles')
            .select('big5_openness, big5_conscientiousness, big5_extraversion, big5_agreeableness, big5_neuroticism, big5_openness_raw, big5_conscientiousness_raw, big5_extraversion_raw, big5_agreeableness_raw, big5_neuroticism_raw, bfi2_score')
            .eq('user_id', user.id)
            .single()

        // Check bfi2_test_history
        const { data: bfi2History, error: bfi2Error } = await supabase
            .from('bfi2_test_history')
            .select('*')
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false })

        const big5Issues: string[] = []

        // Validate Big5 data
        if (profileData) {
            const hasPercentageScores = !!(profileData.big5_openness || profileData.big5_conscientiousness)
            const hasRawScores = !!(profileData.big5_openness_raw || profileData.big5_conscientiousness_raw)
            const hasBfi2Score = !!profileData.bfi2_score

            if (hasPercentageScores && !hasRawScores) {
                big5Issues.push('Has % scores but missing raw scores (1-5 scale)')
            }
            if (hasRawScores && !hasBfi2Score) {
                big5Issues.push('Has raw scores but missing bfi2_score object')
            }
        }

        if (bfi2History?.length === 0 && profileData?.bfi2_score) {
            big5Issues.push('bfi2_test_history is EMPTY but personality_profiles has bfi2_score - history not saved!')
        }

        results.BIG5 = {
            table: 'personality_profiles + bfi2_test_history',
            inProfile: {
                hasPercentageScores: !!(profileData?.big5_openness),
                hasRawScores: !!(profileData?.big5_openness_raw),
                hasBfi2Score: !!(profileData?.bfi2_score),
                percentageScores: profileData ? {
                    openness: profileData.big5_openness,
                    conscientiousness: profileData.big5_conscientiousness,
                    extraversion: profileData.big5_extraversion,
                    agreeableness: profileData.big5_agreeableness,
                    neuroticism: profileData.big5_neuroticism
                } : null,
                rawScores: profileData ? {
                    O: profileData.big5_openness_raw,
                    C: profileData.big5_conscientiousness_raw,
                    E: profileData.big5_extraversion_raw,
                    A: profileData.big5_agreeableness_raw,
                    N: profileData.big5_neuroticism_raw
                } : null
            },
            historyCount: bfi2History?.length || 0,
            historyError: bfi2Error?.message || null,
            latestHistory: bfi2History?.[0] || null,
            issues: big5Issues
        }

        // =====================================================
        // 3. MBTI
        // =====================================================
        const { data: mbtiData } = await supabase
            .from('personality_profiles')
            .select('mbti_type, mbti_scores')
            .eq('user_id', user.id)
            .single()

        results.MBTI = {
            table: 'personality_profiles',
            hasData: !!(mbtiData?.mbti_type),
            type: mbtiData?.mbti_type || null,
            scores: mbtiData?.mbti_scores || null,
            issues: mbtiData?.mbti_type && !mbtiData?.mbti_scores ? ['Has type but missing scores'] : []
        }

        // =====================================================
        // 4. VIA Character Strengths
        // =====================================================

        // Check personality_profiles for VIA
        const { data: viaProfileData } = await supabase
            .from('personality_profiles')
            .select('via_signature_strengths, via_top_virtue')
            .eq('user_id', user.id)
            .single()

        // Check via_results table
        const { data: viaResults, error: viaError } = await supabase
            .from('via_results')
            .select('*')
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false })

        const viaIssues: string[] = []

        if (viaResults && viaResults.length > 0) {
            const latest = viaResults[0]
            if (latest.responses && Object.keys(latest.responses).length === 0) {
                viaIssues.push('responses is empty {}')
            }
            if (latest.score) {
                const allZero = Object.values(latest.score as Record<string, number>).every(v => v === 0)
                if (allZero) {
                    viaIssues.push('all scores are 0')
                }
            }
            if (!latest.all_strengths || (Array.isArray(latest.all_strengths) && latest.all_strengths.length === 0)) {
                viaIssues.push('all_strengths is empty')
            }
        }

        results.VIA = {
            table: 'personality_profiles + via_results',
            inProfile: {
                hasSignatureStrengths: !!(viaProfileData?.via_signature_strengths),
                topVirtue: viaProfileData?.via_top_virtue || null,
                signatureStrengthsCount: Array.isArray(viaProfileData?.via_signature_strengths) ? viaProfileData.via_signature_strengths.length : 0
            },
            resultsCount: viaResults?.length || 0,
            resultsError: viaError?.message || null,
            latestResult: viaResults?.[0] ? {
                id: viaResults[0].id,
                ranked_strengths: viaResults[0].ranked_strengths,
                score: viaResults[0].score,
                all_strengths_count: Array.isArray(viaResults[0].all_strengths) ? viaResults[0].all_strengths.length : 0,
                has_responses: viaResults[0].responses && Object.keys(viaResults[0].responses).length > 0,
                completed_at: viaResults[0].completed_at
            } : null,
            issues: viaIssues
        }

        // =====================================================
        // 5. SISRI-24 (Spiritual Intelligence)
        // =====================================================
        const { data: sisriData } = await supabase
            .from('personality_profiles')
            .select('sisri24_scores')
            .eq('user_id', user.id)
            .single()

        results.SISRI24 = {
            table: 'personality_profiles',
            hasData: !!(sisriData?.sisri24_scores),
            scores: sisriData?.sisri24_scores || null,
            issues: []
        }

        // =====================================================
        // SUMMARY
        // =====================================================
        const allIssues: string[] = []
        Object.entries(results).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && 'issues' in value) {
                const issues = (value as { issues: string[] }).issues
                if (issues.length > 0) {
                    allIssues.push(`${key}: ${issues.join(', ')}`)
                }
            }
        })

        results.summary = {
            DASS21: { saved: ((results.DASS21 as { count: number }).count) > 0, count: (results.DASS21 as { count: number }).count },
            BIG5: { saved: !!(profileData?.big5_openness), historyCount: bfi2History?.length || 0 },
            MBTI: { saved: !!(mbtiData?.mbti_type) },
            VIA: { saved: ((results.VIA as { resultsCount: number }).resultsCount) > 0, count: (results.VIA as { resultsCount: number }).resultsCount },
            SISRI24: { saved: !!(sisriData?.sisri24_scores) },
            totalIssues: allIssues.length,
            issues: allIssues
        }

        return NextResponse.json(results, { status: 200 })

    } catch (error) {
        console.error('Debug check-tests error:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
