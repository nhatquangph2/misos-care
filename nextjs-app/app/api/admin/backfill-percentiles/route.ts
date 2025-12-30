
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
            let needsUpdate = false
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

            // Compare
            if (p.big5_openness == null || (p.big5_openness === 0 && normalized.O.percentile > 0)) {
                updates.big5_openness = normalized.O.percentile
                needsUpdate = true
            }
            if (p.big5_conscientiousness == null || (p.big5_conscientiousness === 0 && normalized.C.percentile > 0)) {
                updates.big5_conscientiousness = normalized.C.percentile
                needsUpdate = true
            }
            if (p.big5_extraversion == null || (p.big5_extraversion === 0 && normalized.E.percentile > 0)) {
                updates.big5_extraversion = normalized.E.percentile
                needsUpdate = true
            }
            if (p.big5_agreeableness == null || (p.big5_agreeableness === 0 && normalized.A.percentile > 0)) {
                updates.big5_agreeableness = normalized.A.percentile
                needsUpdate = true
            }
            if (p.big5_neuroticism == null || (p.big5_neuroticism === 0 && normalized.N.percentile > 0)) {
                updates.big5_neuroticism = normalized.N.percentile
                needsUpdate = true
            }

            if (needsUpdate) {
                updates.last_updated = new Date().toISOString()
                const { error: updateError } = await supabase
                    .from('personality_profiles')
                    .update(updates)
                    .eq('id', p.id)

                if (!updateError) {
                    updatedCount++
                    logs.push(`Fixed user ${p.user_id}`)
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
