
/**
 * API Route: Backfill Percentiles
 * GET /api/admin/backfill-percentiles
 * Trigger this to repair database inconsistencies
 */

import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient as createAuthClient } from '@/lib/supabase/server'
import { normalizeBig5 } from '@/lib/miso/normalization'

export async function GET() {
    try {
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

        let supabase
        let mode = 'GLOBAL'

        if (serviceKey && supabaseUrl) {
            // GLOBAL MODE: Fix everyone
            supabase = createServiceClient(supabaseUrl, serviceKey)
        } else {
            // SELF-HEAL MODE: Fix current user only
            mode = 'USER_ONLY (Service Key missing)'
            supabase = await createAuthClient()
        }

        // 1. Fetch Inconsistent Records (Raw exists)
        let query = supabase
            .from('personality_profiles')
            .select('*')
            .not('big5_openness_raw', 'is', null)

        // If in User Mode, RLS automatically restricts this to the current user

        const { data: profiles, error } = await query

        if (error) {
            return NextResponse.json({
                error: error.message,
                hint: mode === 'GLOBAL' ? 'Check DB permissions' : 'You might not be logged in'
            }, { status: 500 })
        }

        let updatedCount = 0
        const logs = []

        for (const p of profiles || []) {
            const updates: any = {}

            const big5_raw = {
                O: p.big5_openness_raw,
                C: p.big5_conscientiousness_raw,
                E: p.big5_extraversion_raw,
                A: p.big5_agreeableness_raw,
                N: p.big5_neuroticism_raw,
            }

            if (big5_raw.O === undefined || big5_raw.C === undefined) continue

            const { normalized } = normalizeBig5(big5_raw)

            // ALWAYS update percentiles from fresh normalization to ensure consistency
            // This fixes the issue where old percentiles were calculated with different logic
            const newO = Math.round(normalized.O.percentile * 10) / 10
            const newC = Math.round(normalized.C.percentile * 10) / 10
            const newE = Math.round(normalized.E.percentile * 10) / 10
            const newA = Math.round(normalized.A.percentile * 10) / 10
            const newN = Math.round(normalized.N.percentile * 10) / 10

            // Check if any value actually changed (to avoid unnecessary updates)
            const changed =
                Math.abs((p.big5_openness || 0) - newO) > 0.5 ||
                Math.abs((p.big5_conscientiousness || 0) - newC) > 0.5 ||
                Math.abs((p.big5_extraversion || 0) - newE) > 0.5 ||
                Math.abs((p.big5_agreeableness || 0) - newA) > 0.5 ||
                Math.abs((p.big5_neuroticism || 0) - newN) > 0.5

            if (changed) {
                updates.big5_openness = newO
                updates.big5_conscientiousness = newC
                updates.big5_extraversion = newE
                updates.big5_agreeableness = newA
                updates.big5_neuroticism = newN
                updates.last_updated = new Date().toISOString()

                const { error: updateError } = await supabase
                    .from('personality_profiles')
                    .update(updates)
                    .eq('id', p.id)

                if (!updateError) {
                    updatedCount++
                    logs.push({
                        userId: p.user_id?.substring(0, 8) + '...',
                        before: { O: p.big5_openness, C: p.big5_conscientiousness, E: p.big5_extraversion, A: p.big5_agreeableness, N: p.big5_neuroticism },
                        after: { O: newO, C: newC, E: newE, A: newA, N: newN }
                    })
                }
            }
        }

        return NextResponse.json({
            success: true,
            updatedCount,
            message: `Successfully repaired ${updatedCount} profiles.`,
            logs
        })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
