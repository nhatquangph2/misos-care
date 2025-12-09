/**
 * Mental Health Records Service
 * Handles saving and retrieving mental health test results
 * Supports: PHQ-9, GAD-7, DASS-21, PSS
 */

import { createClient } from '@/lib/supabase/client'

export type TestType = 'PHQ9' | 'GAD7' | 'DASS21' | 'PSS'
export type SeverityLevel = 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe'

export interface MentalHealthRecord {
  id: string
  user_id: string
  test_type: TestType
  test_version: string
  total_score: number
  subscale_scores: Record<string, number> | null
  severity_level: SeverityLevel
  crisis_flag: boolean
  crisis_reason: string | null
  raw_responses: any
  completed_at: string
  created_at: string
}

export interface SaveTestResultParams {
  testType: TestType
  totalScore: number
  severityLevel: SeverityLevel
  subscaleScores?: Record<string, number>
  rawResponses?: any
  crisisFlag?: boolean
  crisisReason?: string
  completedAt?: Date
}

/**
 * Save mental health test results to database
 */
export async function saveMentalHealthRecord(params: SaveTestResultParams) {
  const supabase = createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  // Prepare record data
  const recordData = {
    user_id: user.id,
    test_type: params.testType,
    test_version: '1.0',
    total_score: params.totalScore,
    subscale_scores: params.subscaleScores || null,
    severity_level: params.severityLevel,
    crisis_flag: params.crisisFlag || false,
    crisis_reason: params.crisisReason || null,
    raw_responses: params.rawResponses || null,
    completed_at: params.completedAt?.toISOString() || new Date().toISOString(),
  }

  // Insert new record
  const { data, error } = await supabase
    .from('mental_health_records')
    .insert(recordData as any)
    .select()
    .single()

  if (error) {
    console.error('Error saving mental health record:', error)
    throw new Error(`Failed to save results: ${error.message}`)
  }

  return data
}

/**
 * Get user's mental health records
 */
export async function getMentalHealthRecords(testType?: TestType): Promise<MentalHealthRecord[]> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return []
  }

  let query = supabase
    .from('mental_health_records')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  if (testType) {
    query = query.eq('test_type', testType)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching mental health records:', error)
    throw new Error(`Failed to fetch records: ${error.message}`)
  }

  return data || []
}

/**
 * Get latest mental health record for a specific test type
 */
export async function getLatestRecord(testType: TestType): Promise<MentalHealthRecord | null> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('mental_health_records')
    .select('*')
    .eq('user_id', user.id)
    .eq('test_type', testType)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No record found
      return null
    }
    console.error('Error fetching latest record:', error)
    return null
  }

  return data
}

/**
 * Get all mental health records summary
 */
export async function getMentalHealthSummary() {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('mental_health_records')
    .select('test_type, total_score, severity_level, completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  if (error) {
    console.error('Error fetching summary:', error)
    return null
  }

  return data
}

/**
 * Delete a mental health record
 */
export async function deleteMentalHealthRecord(recordId: string) {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('mental_health_records')
    .delete()
    .eq('id', recordId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting record:', error)
    throw new Error(`Failed to delete record: ${error.message}`)
  }
}
