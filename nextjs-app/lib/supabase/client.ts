/**
 * Supabase Client for Client Components
 * Use this in Client Components (with 'use client')
 */

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export function createClient() {
  // Use placeholder values during build if env vars not available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}
