import { createClient } from '@/lib/supabase/client'
import { MisoAnalysisResult, MisoInput } from '@/types/miso-v3'

export const misoService = {
    /**
     * Run MISO analysis by calling the API
     */
    async runAnalysis(input: MisoInput): Promise<MisoAnalysisResult> {
        const response = await fetch('/api/miso/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        })

        if (!response.ok) {
            throw new Error('Failed to run MISO analysis')
        }

        const data = await response.json()
        return data.analysis
    },

    /**
     * Get latest analysis from database logs
     */
    async getLatestAnalysis(userId: string): Promise<MisoAnalysisResult | null> {
        const supabase = createClient()

        // Get latest log entry
        const { data, error } = await supabase
            .from('miso_analysis_logs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null // No data found
            console.error('Error fetching MISO analysis:', error)
            return null
        }

        // Transform log data back to MisoAnalysisResult structure
        // The column in DB is analysis_result
        return data.analysis_result as unknown as MisoAnalysisResult
    },

    /**
     * Check if user has sufficient data for analysis
     */
    async checkDataAvailability(userId: string): Promise<{
        hasDass: boolean
        hasBig5: boolean
        hasVia: boolean
        hasMbti: boolean
    }> {
        const supabase = createClient()

        // Check DASS-21
        const { count: dassCount } = await supabase
            .from('mental_health_records')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('test_type', 'DASS21')

        // Check Big Five
        const { count: big5Count } = await supabase
            .from('bfi2_test_history')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)

        // Check VIA
        const { count: viaCount } = await supabase
            .from('via_results')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)

        // Check MBTI
        const { data: profile } = await supabase
            .from('personality_profiles')
            .select('mbti_type')
            .eq('user_id', userId)
            .single()

        return {
            hasDass: (dassCount || 0) > 0,
            hasBig5: (big5Count || 0) > 0,
            hasVia: (viaCount || 0) > 0,
            hasMbti: !!profile?.mbti_type,
        }
    }
}
