
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runMisoAnalysis } from '@/lib/miso/engine'
import { getPersonalizedRecommendations } from '@/services/recommendation.service'
import { BIG5_NORMS, DASS21_NORMS } from '@/lib/miso/constants'

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

        log('DEBUG: BIG5_NORMS Checks', {
            Defined: !!BIG5_NORMS,
            Keys: BIG5_NORMS ? Object.keys(BIG5_NORMS) : 'None',
            SampleN: BIG5_NORMS?.['N']
        })

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

        // 1.5 Fetch DASS Record (Mirroring Page Logic)
        const { data: dassRecord, error: dassError } = await supabase
            .from('mental_health_records')
            .select('subscale_scores')
            .eq('user_id', user.id)
            .eq('test_type', 'DASS21')
            .order('completed_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        log('DASS Record Fetch', { found: !!dassRecord, error: dassError })

        log('Profile Raw Data', {
            big5_openness: profile.big5_openness,
            big5_openness_raw: profile.big5_openness_raw,
        })

        // 2. Construct Raw Input (New Priority: Raw First)
        const big5_raw = {
            O: profile.big5_openness_raw || profile.big5_openness || 50,
            C: profile.big5_conscientiousness_raw || profile.big5_conscientiousness || 50,
            E: profile.big5_extraversion_raw || profile.big5_extraversion || 50,
            A: profile.big5_agreeableness_raw || profile.big5_agreeableness || 50,
            N: profile.big5_neuroticism_raw || profile.big5_neuroticism || 50,
        }
        log('Constructed Big5 Raw Input (Raw Priority)', big5_raw)

        // 3. Run Miso Analysis
        try {
            const misoResult = await runMisoAnalysis({
                big5_raw,
                mbti: profile.mbti_type || undefined,
                dass21_raw: dassRecord?.subscale_scores as any // Explicit pass
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
