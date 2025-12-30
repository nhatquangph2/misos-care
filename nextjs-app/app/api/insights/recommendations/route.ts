/**
 * API: Fresh Personalized Recommendations
 * Runs fresh MISO analysis and returns recommendations
 * Used by dashboard to ensure consistency with detail pages
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runMisoAnalysis } from '@/lib/miso/engine'
import { getPersonalizedRecommendations, type PersonalizedRecommendations } from '@/services/recommendation.service'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({
                success: false,
                error: 'Not authenticated'
            }, { status: 401 })
        }

        // Get personality profile
        const { data: profile, error: profileError } = await supabase
            .from('personality_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (profileError || !profile) {
            return NextResponse.json({
                success: true,
                recommendations: null,
                reason: 'No personality profile found'
            })
        }

        // Check if we have Big5 data (required for recommendations)
        const hasRawBig5 = profile.big5_openness_raw || profile.big5_openness
        if (!hasRawBig5) {
            return NextResponse.json({
                success: true,
                recommendations: null,
                reason: 'No Big5 data available'
            })
        }

        // Get DASS scores for holistic analysis
        const { data: dassRecord } = await supabase
            .from('mental_health_records')
            .select('subscale_scores')
            .eq('user_id', user.id)
            .eq('test_type', 'DASS21')
            .order('completed_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        // Build Big5 raw scores (same logic as detail pages)
        const big5_raw = {
            O: profile.big5_openness_raw || profile.big5_openness || 50,
            C: profile.big5_conscientiousness_raw || profile.big5_conscientiousness || 50,
            E: profile.big5_extraversion_raw || profile.big5_extraversion || 50,
            A: profile.big5_agreeableness_raw || profile.big5_agreeableness || 50,
            N: profile.big5_neuroticism_raw || profile.big5_neuroticism || 50,
        }

        // Run fresh MISO analysis (SAME as detail pages)
        const misoResult = await runMisoAnalysis({
            big5_raw,
            mbti: profile.mbti_type || undefined,
            dass21_raw: dassRecord?.subscale_scores as any
        }, user.id)

        // Generate personalized recommendations
        const recommendations = getPersonalizedRecommendations(misoResult)

        // Also return scientific analysis if available
        const scientificAnalysis = misoResult.scientific_analysis || null

        // Return VIA top strength if available
        let topStrength = null
        if (misoResult.via_analysis?.signature_strengths && misoResult.via_analysis.signature_strengths.length > 0) {
            topStrength = misoResult.via_analysis.signature_strengths[0].name
        }

        return NextResponse.json({
            success: true,
            recommendations,
            scientificAnalysis,
            topStrength,
            mbtiType: profile.mbti_type,
            // Debug info (can be removed in production)
            _debug: {
                big5_raw_used: big5_raw,
                hasDass: !!dassRecord
            }
        })

    } catch (error: any) {
        console.error('Fresh recommendations API error:', error)
        return NextResponse.json({
            success: false,
            error: error?.message || 'Unknown error',
            recommendations: null
        }, { status: 500 })
    }
}
