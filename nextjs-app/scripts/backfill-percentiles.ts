
/**
 * HOST: scripts/backfill-percentiles.ts
 * PURPOSE: Repair database inconsistencies by calculating missing percentiles from raw scores.
 */

import { createClient } from '@supabase/supabase-js'
import { normalizeBig5 } from '../lib/miso/normalization'
import path from 'path'
import fs from 'fs'

// Manual .env parser (No external deps)
const envPath = path.resolve(__dirname, '../.env.local')
const env: Record<string, string> = {}
if (fs.existsSync(envPath)) {
    const data = fs.readFileSync(envPath, 'utf8')
    data.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
            let val = match[2].trim()
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            env[match[1].trim()] = val
        }
    })
}

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'] || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Environment Variables! Ensure .env.local exists.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function backfillData() {
    console.log('🏥 Starting Database Health Check & Repair...')

    // Fetch profiles with raw data
    const { data: profiles, error } = await supabase
        .from('personality_profiles')
        .select('*')
        .not('big5_openness_raw', 'is', null)

    if (error) {
        console.error('Error fetching data:', error)
        return
    }

    console.log(`🔍 Found ${profiles?.length || 0} profiles with raw data. Checking for inconsistencies...`)

    let updatedCount = 0

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

        // Skip if incomplete raw data coverage
        if (big5_raw.O === undefined || big5_raw.C === undefined || big5_raw.E === undefined || big5_raw.A === undefined || big5_raw.N === undefined) {
            continue
        }

        // Recalculate based on server-side logic
        const { normalized } = normalizeBig5(big5_raw)

        // Check vs DB values
        // Openness
        if (p.big5_openness == null || (p.big5_openness === 0 && normalized.O.percentile > 0)) {
            updates.big5_openness = normalized.O.percentile
            needsUpdate = true
        }
        // Conscientiousness
        if (p.big5_conscientiousness == null || (p.big5_conscientiousness === 0 && normalized.C.percentile > 0)) {
            updates.big5_conscientiousness = normalized.C.percentile
            needsUpdate = true
        }
        // Extraversion
        if (p.big5_extraversion == null || (p.big5_extraversion === 0 && normalized.E.percentile > 0)) {
            updates.big5_extraversion = normalized.E.percentile
            needsUpdate = true
        }
        // Agreeableness
        if (p.big5_agreeableness == null || (p.big5_agreeableness === 0 && normalized.A.percentile > 0)) {
            updates.big5_agreeableness = normalized.A.percentile
            needsUpdate = true
        }
        // Neuroticism
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
                console.log(`✅ Fixed Profile ${p.user_id}: Updated missing percentiles.`)
                updatedCount++
            } else {
                console.error(`❌ Failed to update ${p.user_id}:`, updateError.message)
            }
        }
    }

    if (updatedCount === 0) {
        console.log('✨ All profiles are healthy! No repairs needed.')
    } else {
        console.log(`🎉 Maintenance Complete! Fixed ${updatedCount} inconsistencies.`)
    }
}

backfillData().catch(console.error)
