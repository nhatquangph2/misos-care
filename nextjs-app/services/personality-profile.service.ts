/**
 * Personality Profile Service
 * Handles saving and retrieving BFI-2 (Big Five) test results
 */

import { createClient } from '@/lib/supabase/client'
import type { BFI2Score } from '@/constants/tests/bfi2-questions'

export interface PersonalityProfile {
  id: string
  user_id: string
  big5_openness: number
  big5_conscientiousness: number
  big5_extraversion: number
  big5_agreeableness: number
  big5_neuroticism: number
  mbti_type?: string | null
  last_updated: string
  created_at: string
}

export interface SaveBFI2Result {
  score: BFI2Score
  completedAt?: Date
  completionTime?: number
}

/**
 * Save BFI-2 test results to user's personality profile
 * Creates new profile if doesn't exist, updates if exists
 */
export async function saveBFI2Results({ score, completedAt, completionTime }: SaveBFI2Result) {
  const supabase = createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  // Prepare profile data
  const profileData = {
    user_id: user.id,
    big5_openness: score.domains.O,
    big5_conscientiousness: score.domains.C,
    big5_extraversion: score.domains.E,
    big5_agreeableness: score.domains.A,
    big5_neuroticism: score.domains.N,
    last_updated: completedAt?.toISOString() || new Date().toISOString(),
  }

  // Upsert (insert or update) personality profile
  const { data, error } = await supabase
    .from('personality_profiles')
    .upsert(profileData as any, {
      onConflict: 'user_id',
      ignoreDuplicates: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving BFI-2 results:', error)
    throw new Error(`Failed to save results: ${error.message}`)
  }

  return data
}

/**
 * Get user's personality profile
 */
export async function getPersonalityProfile(): Promise<PersonalityProfile | null> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('personality_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No profile found
      return null
    }
    console.error('Error fetching personality profile:', error)
    throw new Error(`Failed to fetch profile: ${error.message}`)
  }

  return data
}

/**
 * Check if user has completed BFI-2 test
 */
export async function hasBFI2Profile(): Promise<boolean> {
  const profile = await getPersonalityProfile()
  return profile !== null
}

/**
 * Save MBTI type to user's personality profile
 * Creates new profile if doesn't exist, updates if exists
 */
export async function saveMBTIResult(mbtiType: string, completedAt?: Date) {
  const supabase = createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  // Prepare profile data
  const profileData = {
    user_id: user.id,
    mbti_type: mbtiType,
    last_updated: completedAt?.toISOString() || new Date().toISOString(),
  }

  // Upsert (insert or update) personality profile
  const { data, error } = await supabase
    .from('personality_profiles')
    .upsert(profileData as any, {
      onConflict: 'user_id',
      ignoreDuplicates: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving MBTI results:', error)
    throw new Error(`Failed to save results: ${error.message}`)
  }

  return data
}

/**
 * Delete user's personality profile
 */
export async function deletePersonalityProfile() {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('personality_profiles')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting personality profile:', error)
    throw new Error(`Failed to delete profile: ${error.message}`)
  }
}
