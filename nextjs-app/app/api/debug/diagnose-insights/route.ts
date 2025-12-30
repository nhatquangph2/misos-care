
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runMisoAnalysis } from '@/lib/miso/engine'
import { getPersonalizedRecommendations } from '@/services/recommendation.service'

/**
 * Diagnostic API to debug why Insight Pages return null
 * GET /api/debug/diagnose-insights
 */
export async function GET() {
    const logs: any[] = []
    const log = (step: string, data: any) => logs.push({ step, data })

    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        log('User ID', user.id)

        // 1. Fetch Profile
        const { data: profile, error: profileError } = await supabase
            .from('personality_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (profileError) {
            log('Profile Fetch Error', profileError)
            return NextResponse.json({ logs, error: 'DB Error' })
        }
        if (!profile) {
            log('Profile Not Found', 'No row in personality_profiles')
            return NextResponse.json({ logs, result: 'NULL PROFILE' })
        }

        log('Profile Raw Data', {
            big5_openness: profile.big5_openness,
            big5_openness_raw: profile.big5_openness_raw,
            // Check others
            C: profile.big5_conscientiousness,
            E: profile.big5_extraversion,
            A: profile.big5_agreeableness,
            N: profile.big5_neuroticism,
        })

        // 2. Construct Raw Input (The Fix Logic)
        const big5_raw = {
            O: profile.big5_openness || profile.big5_openness_raw || 50,
            C: profile.big5_conscientiousness || profile.big5_conscientiousness_raw || 50,
            E: profile.big5_extraversion || profile.big5_extraversion_raw || 50,
            A: profile.big5_agreeableness || profile.big5_agreeableness_raw || 50,
            N: profile.big5_neuroticism || profile.big5_neuroticism_raw || 50,
        }
        log('Constructed Big5 Raw Input', big5_raw)

        // 3. Run Miso Analysis
        try {
            const misoResult = await runMisoAnalysis({
                big5_raw,
                mbti: profile.mbti_type || undefined,
            }, user.id)

            log('Miso Result Normalized', misoResult.normalized)
            log('Miso Result Completeness', misoResult.completeness)

            // 4. Generate Recommendations
            try {
                const recommendations = await getPersonalizedRecommendations(
                    misoResult,
                    profile.mbti_type || undefined,  // Pass MBTI
                    undefined // VIA
                )

                log('Recommendations Generated', {
                    hasCareer: !!recommendations.career,
                    hasLearning: !!recommendations.learning,
                    hasSports: !!recommendations.sports,
                    hasClinical: !!recommendations.clinical,
                    careerData: recommendations.career ? 'Present' : 'NULL',
                })

                return NextResponse.json({
                    success: true,
                    finalStatus: recommendations.career ? 'SUCCESS' : 'FAILURE (Career is null)',
                    logs
                })

            } catch (recError: any) {
                log('Recommendation Service Error', recError.message)
                return NextResponse.json({ logs, error: recError.message })
            }

        } catch (misoError: any) {
            log('Miso Analysis Error', misoError.message)
            return NextResponse.json({ logs, error: misoError.message })
        }

    } catch (e: any) {
        return NextResponse.json({
            error: 'Unexpected Error',
            details: e.message,
            logs
        }, { status: 500 })
    }
}
