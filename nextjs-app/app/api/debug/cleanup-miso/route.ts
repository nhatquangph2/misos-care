/**
 * Debug: Cleanup null MISO analysis records
 * DELETE /api/debug/cleanup-miso
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Find and delete records where bvs, rcs, and profile_id are all null
        const { data: nullRecords, error: findError } = await supabase
            .from('miso_analysis_logs')
            .select('id, created_at, bvs, rcs, profile_id, completeness_level')
            .eq('user_id', user.id)
            .is('bvs', null)
            .is('rcs', null)
            .is('profile_id', null)

        if (findError) {
            return NextResponse.json({
                error: 'Failed to find null records',
                details: findError.message
            }, { status: 500 })
        }

        if (!nullRecords || nullRecords.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No null records found to delete',
                deletedCount: 0
            })
        }

        // Delete the null records
        const idsToDelete = nullRecords.map(r => r.id)
        const { error: deleteError } = await supabase
            .from('miso_analysis_logs')
            .delete()
            .in('id', idsToDelete)

        if (deleteError) {
            return NextResponse.json({
                error: 'Failed to delete null records',
                details: deleteError.message
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${nullRecords.length} null records`,
            deletedCount: nullRecords.length,
            deletedRecords: nullRecords.map(r => ({
                id: r.id,
                created_at: r.created_at,
                completeness_level: r.completeness_level
            }))
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 })
    }
}

// Also support GET to preview what would be deleted
export async function GET(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find records where bvs, rcs, and profile_id are all null
    const { data: nullRecords, error: findError } = await supabase
        .from('miso_analysis_logs')
        .select('id, created_at, bvs, rcs, profile_id, completeness_level')
        .eq('user_id', user.id)
        .is('bvs', null)
        .is('rcs', null)
        .is('profile_id', null)
        .order('created_at', { ascending: false })

    if (findError) {
        return NextResponse.json({
            error: 'Failed to find null records',
            details: findError.message
        }, { status: 500 })
    }

    return NextResponse.json({
        success: true,
        message: 'Preview of null records that would be deleted',
        count: nullRecords?.length || 0,
        records: nullRecords
    })
}
