import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()

        // Get current user from auth
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const results: Record<string, unknown> = {
            authUser: {
                id: user.id,
                email: user.email,
                created_at: user.created_at
            }
        }

        // Check how many rows exist for this user_id
        const { data: allUsers, error: allUsersError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)

        results.usersQuery = {
            data: allUsers,
            error: allUsersError?.message || null,
            count: allUsers?.length || 0,
            hint: allUsers && allUsers.length > 1
                ? 'DUPLICATE FOUND! Multiple rows with same ID'
                : allUsers && allUsers.length === 1
                    ? 'OK - Single row exists'
                    : 'NO DATA - User record does not exist'
        }

        // Check if the user exists in auth.users but not in public.users
        // This would mean the profile was never created
        if (!allUsers || allUsers.length === 0) {
            results.diagnosis = {
                issue: 'User exists in auth.users but NOT in public.users',
                solution: 'Need to create user profile in public.users table',
                suggestedFix: `
          INSERT INTO public.users (id, email, name, created_at, updated_at)
          VALUES ('${user.id}', '${user.email}', '${user.email?.split('@')[0] || 'User'}', NOW(), NOW())
          ON CONFLICT (id) DO NOTHING;
        `
            }
        }

        // Also check if there might be an email constraint issue
        const { data: usersByEmail, error: emailError } = await supabase
            .from('users')
            .select('id, email, name, created_at')
            .eq('email', user.email || '')

        results.usersByEmail = {
            data: usersByEmail,
            error: emailError?.message || null,
            count: usersByEmail?.length || 0,
            hint: usersByEmail && usersByEmail.length > 1
                ? 'DUPLICATE EMAIL! Multiple rows with same email but different IDs'
                : 'OK'
        }

        // Check RLS policies by trying different queries
        // Without filter (should fail with RLS)
        const { count: totalCount, error: countError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })

        results.rlsCheck = {
            totalVisibleRows: totalCount,
            error: countError?.message || null,
            hint: totalCount === 1
                ? 'RLS is working correctly'
                : totalCount && totalCount > 1
                    ? 'RLS might be too permissive - seeing other users'
                    : 'No rows visible - RLS might be too restrictive'
        }

        return NextResponse.json(results, { status: 200 })

    } catch (error) {
        console.error('Debug check-users error:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
