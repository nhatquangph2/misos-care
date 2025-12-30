/**
 * Debug: Test MISO Analysis with detailed logging
 * GET /api/debug/test-analyze
 */

import { NextRequest, NextResponse } from 'next/server'
import { runMisoAnalysis, assessDataCompleteness } from '@/lib/miso'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const debugLog: any[] = []

    try {
        // Step 1: Check DASS-21 data
        debugLog.push({ step: 1, action: 'Checking DASS-21 data' })
        const { data: latestDass, error: dassError } = await supabase
            .from('mental_health_records')
            .select('subscale_scores, total_score, completed_at')
            .eq('user_id', user.id)
            .eq('test_type', 'DASS21')
            .order('completed_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        debugLog.push({
            step: 1.1,
            latestDass,
            dassError: dassError?.message
        })

        // Step 2: Check Big5 data  
        debugLog.push({ step: 2, action: 'Checking Big5 data' })
        const { data: profile, error: profileError } = await supabase
            .from('personality_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()

        debugLog.push({
            step: 2.1,
            hasProfile: !!profile,
            profileHasBig5: profile ? !!(profile.big5_neuroticism || profile.big5_neuroticism_raw) : false,
            profileMbti: profile?.mbti_type,
            profileError: profileError?.message
        })

        // Step 2.5: Check bfi2_test_history
        debugLog.push({ step: 2.5, action: 'Checking bfi2_test_history' })
        const { data: bfiHistory, error: bfiError } = await supabase
            .from('bfi2_test_history')
            .select('raw_scores, completed_at')
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        debugLog.push({
            step: 2.6,
            hasBfiHistory: !!bfiHistory,
            bfiRawScores: (bfiHistory as any)?.raw_scores,
            bfiError: bfiError?.message
        })

        // Step 3: Check VIA data
        debugLog.push({ step: 3, action: 'Checking VIA data' })
        const { data: viaResult, error: viaError } = await supabase
            .from('via_results')
            .select('all_strengths, score')  // Use columns that actually exist
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        debugLog.push({
            step: 3.1,
            hasVia: !!viaResult,
            viaHasAllStrengths: !!(viaResult?.all_strengths),
            viaHasScore: !!(viaResult?.score),
            viaError: viaError?.message
        })

        // Step 4: Build userData
        let dass21_raw = null
        let big5_raw = null
        let via_raw = null
        let mbti = null

        if (latestDass?.subscale_scores) {
            const s = latestDass.subscale_scores as any
            dass21_raw = { D: s.depression ?? 0, A: s.anxiety ?? 0, S: s.stress ?? 0 }
        }

        if (profile) {
            mbti = profile.mbti_type
            if (profile.big5_neuroticism !== undefined || profile.big5_neuroticism_raw !== undefined) {
                big5_raw = {
                    N: profile.big5_neuroticism_raw ?? profile.big5_neuroticism ?? 0,
                    E: profile.big5_extraversion_raw ?? profile.big5_extraversion ?? 0,
                    O: profile.big5_openness_raw ?? profile.big5_openness ?? 0,
                    A: profile.big5_agreeableness_raw ?? profile.big5_agreeableness ?? 0,
                    C: profile.big5_conscientiousness_raw ?? profile.big5_conscientiousness ?? 0,
                }
            }
        }

        // Fallback to bfi2_test_history
        if (!big5_raw && bfiHistory) {
            const scores = (bfiHistory as any).raw_scores
            if (scores?.N !== undefined) {
                big5_raw = { N: scores.N, E: scores.E, O: scores.O, A: scores.A, C: scores.C }
            }
        }

        const userData = { dass21_raw, big5_raw, via_raw, mbti }
        debugLog.push({ step: 4, userData })

        // Step 5: Check completeness
        debugLog.push({ step: 5, action: 'Checking completeness' })
        const completeness = assessDataCompleteness(userData)
        debugLog.push({ step: 5.1, completeness })

        // Step 6: Run analysis
        debugLog.push({ step: 6, action: 'Running MISO analysis' })
        const analysisResult = await runMisoAnalysis(userData, user.id)

        debugLog.push({
            step: 6.1,
            resultScores: analysisResult.scores,
            resultProfileId: analysisResult.profile?.['id'],
            resultProfileName: analysisResult.profile?.['name'],
            resultCompletenessLevel: analysisResult.completeness?.level,
            resultSummary: analysisResult.summary
        })

        // Step 7: Try to save to database
        debugLog.push({ step: 7, action: 'Saving to database' })
        const logData = {
            user_id: user.id,
            analysis_result: analysisResult,
            bvs: analysisResult.scores?.BVS ?? null,
            rcs: analysisResult.scores?.RCS ?? null,
            profile_id: analysisResult.profile?.['id'] ?? null,
            risk_level: analysisResult.profile?.['risk_level'] ?? null,
            completeness_level: analysisResult.completeness?.level ?? 'NONE',
        }

        debugLog.push({
            step: 7.1, logDataBeforeSave: {
                bvs: logData.bvs,
                rcs: logData.rcs,
                profile_id: logData.profile_id,
                risk_level: logData.risk_level,
                completeness_level: logData.completeness_level,
            }
        })

        const { error: saveError, data: savedLog } = await supabase
            .from('miso_analysis_logs')
            .insert(logData)
            .select('id, bvs, rcs, profile_id')
            .single()

        if (saveError) {
            debugLog.push({ step: 7.2, saveError: saveError.message, saveErrorDetails: saveError })
        } else {
            debugLog.push({ step: 7.2, savedLog })
        }

        return NextResponse.json({
            success: true,
            user_id: user.id,
            debugLog,
        })

    } catch (error) {
        debugLog.push({ step: 'ERROR', error: String(error) })
        return NextResponse.json({
            success: false,
            error: String(error),
            debugLog,
        }, { status: 500 })
    }
}
