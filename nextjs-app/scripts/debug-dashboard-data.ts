
import { createClient } from '@supabase/supabase-js'
import { getPersonalizedRecommendations } from '../services/recommendation.service'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function checkDashboardLogic() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role to bypass auth for script

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase env vars')
        return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('🔍 Finding a test user...')
    // Get a user who has analysis logs
    const { data: logs } = await supabase
        .from('miso_analysis_logs')
        .select('user_id')
        .limit(1)

    if (!logs || logs.length === 0) {
        console.log('❌ No analysis logs found.')
        return
    }

    const userId = logs[0].user_id
    console.log(`👤 Testing with user: ${userId}`)

    // 1. Fetch Personality
    console.log('--- Checking Personality Profile ---')
    const { data: personality } = await supabase
        .from('personality_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

    console.log('Personality Data:', personality ? '✅ Found' : '❌ Missing')
    if (personality) {
        console.log('MBTI:', personality.mbti_type)
        console.log('Big5 Openness:', personality.big5_openness)
    }

    // 2. Fetch Analysis & Recommendations
    console.log('\n--- Checking MISO Analysis & Recommendations ---')
    const { data: latestAnalysis } = await supabase
        .from('miso_analysis_logs')
        .select('analysis_result')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (latestAnalysis?.analysis_result) {
        console.log('Analysis Result: ✅ Found')
        const result = latestAnalysis.analysis_result

        try {
            console.log('Generating recommendations...')
            const recs = getPersonalizedRecommendations(result as any)
            console.log('Recommendations Generated:', recs ? '✅ Yes' : '❌ No')

            if (recs) {
                console.log('- Career:', recs.career ? '✅' : '❌')
                console.log('- Learning:', recs.learning ? '✅' : '❌')
                console.log('- Sports:', recs.sports ? '✅' : '❌')
                console.log('- Clinical:', recs.clinical ? '✅' : '❌')
            }
        } catch (error) {
            console.error('❌ Error generating recommendations:', error)
        }
    } else {
        console.log('Analysis Result: ❌ Missing')
    }
}

checkDashboardLogic()
