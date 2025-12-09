/**
 * Test History Service
 * Handles retrieving and analyzing test history across all test types
 * Combines personality tests and mental health assessments
 */

import { createClient } from '@/lib/supabase/client'
import type { MentalHealthRecord, TestType } from './mental-health-records.service'
import type { PersonalityProfile } from './personality-profile.service'

export interface TimelineEntry {
  id: string
  date: string
  type: 'personality' | 'mental_health'
  testName: string
  testType?: TestType | 'BFI2' | 'MBTI'
  score?: number
  severity?: string
  domains?: {
    E?: number
    A?: number
    C?: number
    N?: number
    O?: number
  }
  mbtiType?: string
  crisisFlag?: boolean
}

export interface TestHistorySummary {
  totalTests: number
  personalityTests: number
  mentalHealthTests: number
  lastTestDate: string | null
  hasCrisisHistory: boolean
  testsByType: {
    PHQ9: number
    GAD7: number
    DASS21: number
    PSS: number
    BFI2: number
    MBTI: number
  }
}

export interface TestTrend {
  testType: TestType | 'BFI2'
  dates: string[]
  scores: number[]
  severities: string[]
  trend: 'improving' | 'stable' | 'worsening' | 'insufficient_data'
  percentageChange?: number
}

export interface ComparisonData {
  testType: string
  date1: string
  date2: string
  score1: number
  score2: number
  scoreDifference: number
  severity1: string
  severity2: string
  severityChange: 'improved' | 'same' | 'worsened'
}

/**
 * Get complete timeline of all tests
 * Combines personality and mental health tests in chronological order
 */
export async function getTestTimeline(): Promise<TimelineEntry[]> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return []
  }

  const timeline: TimelineEntry[] = []

  // Fetch mental health records
  const { data: mentalHealthData, error: mhError } = await supabase
    .from('mental_health_records')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  if (!mhError && mentalHealthData) {
    mentalHealthData.forEach((record: MentalHealthRecord) => {
      const testNames: Record<string, string> = {
        PHQ9: 'PHQ-9: Trầm cảm',
        GAD7: 'GAD-7: Lo âu',
        DASS21: 'DASS-21: Trầm cảm, Lo âu, Stress',
        PSS: 'PSS: Stress'
      }

      timeline.push({
        id: record.id,
        date: record.completed_at,
        type: 'mental_health',
        testName: testNames[record.test_type] || record.test_type,
        testType: record.test_type,
        score: record.total_score,
        severity: record.severity_level,
        crisisFlag: record.crisis_flag
      })
    })
  }

  // Fetch personality profile
  const { data: personalityData, error: pError } = await supabase
    .from('personality_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!pError && personalityData) {
    const profile = personalityData as PersonalityProfile

    // Add BFI-2 entry
    if (profile.big5_openness !== null) {
      timeline.push({
        id: profile.id,
        date: profile.last_updated || profile.created_at,
        type: 'personality',
        testName: 'BFI-2: Big Five Inventory',
        testType: 'BFI2',
        domains: {
          E: profile.big5_extraversion,
          A: profile.big5_agreeableness,
          C: profile.big5_conscientiousness,
          N: profile.big5_neuroticism,
          O: profile.big5_openness
        }
      })
    }

    // Add MBTI entry if exists
    if (profile.mbti_type) {
      timeline.push({
        id: `${profile.id}-mbti`,
        date: profile.last_updated || profile.created_at,
        type: 'personality',
        testName: 'MBTI: Myers-Briggs Type Indicator',
        testType: 'MBTI',
        mbtiType: profile.mbti_type
      })
    }
  }

  // Sort timeline by date (newest first)
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return timeline
}

/**
 * Get summary statistics of test history
 */
export async function getTestHistorySummary(): Promise<TestHistorySummary> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      totalTests: 0,
      personalityTests: 0,
      mentalHealthTests: 0,
      lastTestDate: null,
      hasCrisisHistory: false,
      testsByType: {
        PHQ9: 0,
        GAD7: 0,
        DASS21: 0,
        PSS: 0,
        BFI2: 0,
        MBTI: 0
      }
    }
  }

  const summary: TestHistorySummary = {
    totalTests: 0,
    personalityTests: 0,
    mentalHealthTests: 0,
    lastTestDate: null,
    hasCrisisHistory: false,
    testsByType: {
      PHQ9: 0,
      GAD7: 0,
      DASS21: 0,
      PSS: 0,
      BFI2: 0,
      MBTI: 0
    }
  }

  // Get mental health records count
  const { data: mhData, count: mhCount } = await supabase
    .from('mental_health_records')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  if (mhData && mhCount) {
    summary.mentalHealthTests = mhCount
    summary.totalTests += mhCount

    // Count by test type
    const typedMhData = mhData as MentalHealthRecord[]
    typedMhData.forEach((record: MentalHealthRecord) => {
      const testType = record.test_type as keyof typeof summary.testsByType
      if (testType in summary.testsByType) {
        summary.testsByType[testType]++
      }
      if (record.crisis_flag) {
        summary.hasCrisisHistory = true
      }
    })

    // Get latest test date
    if (typedMhData.length > 0) {
      summary.lastTestDate = typedMhData[0].completed_at
    }
  }

  // Get personality profile
  const { data: pData } = await supabase
    .from('personality_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (pData) {
    const profile = pData as PersonalityProfile

    if (profile.big5_openness !== null) {
      summary.personalityTests++
      summary.totalTests++
      summary.testsByType.BFI2 = 1

      // Update last test date if personality test is newer
      const profileDate = profile.last_updated || profile.created_at
      if (!summary.lastTestDate || new Date(profileDate) > new Date(summary.lastTestDate)) {
        summary.lastTestDate = profileDate
      }
    }

    if (profile.mbti_type) {
      summary.personalityTests++
      summary.totalTests++
      summary.testsByType.MBTI = 1
    }
  }

  return summary
}

/**
 * Get trend analysis for a specific test type
 */
export async function getTestTrend(testType: TestType): Promise<TestTrend> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      testType,
      dates: [],
      scores: [],
      severities: [],
      trend: 'insufficient_data'
    }
  }

  const { data, error } = await supabase
    .from('mental_health_records')
    .select('completed_at, total_score, severity_level')
    .eq('user_id', user.id)
    .eq('test_type', testType)
    .order('completed_at', { ascending: true })

  type TrendRecord = {
    completed_at: string
    total_score: number
    severity_level: string
  }

  if (error || !data || data.length < 2) {
    return {
      testType,
      dates: (data as TrendRecord[] | null)?.map(r => r.completed_at) || [],
      scores: (data as TrendRecord[] | null)?.map(r => r.total_score) || [],
      severities: (data as TrendRecord[] | null)?.map(r => r.severity_level) || [],
      trend: 'insufficient_data'
    }
  }

  const typedData = data as TrendRecord[]
  const dates = typedData.map(r => r.completed_at)
  const scores = typedData.map(r => r.total_score)
  const severities = typedData.map(r => r.severity_level)

  // Calculate trend (simple: compare first vs last)
  const firstScore = scores[0]
  const lastScore = scores[scores.length - 1]
  const percentageChange = ((lastScore - firstScore) / firstScore) * 100

  let trend: 'improving' | 'stable' | 'worsening' = 'stable'

  // For mental health tests, lower scores are better
  if (percentageChange < -10) {
    trend = 'improving'
  } else if (percentageChange > 10) {
    trend = 'worsening'
  }

  return {
    testType,
    dates,
    scores,
    severities,
    trend,
    percentageChange
  }
}

/**
 * Get BFI-2 trend analysis (domain scores over time)
 * Note: Currently only tracks latest score, but ready for multiple entries
 */
export async function getBFI2Trend(): Promise<{
  domains: string[]
  scores: number[]
  lastUpdated: string | null
}> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      domains: [],
      scores: [],
      lastUpdated: null
    }
  }

  const { data } = await supabase
    .from('personality_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!data) {
    return {
      domains: [],
      scores: [],
      lastUpdated: null
    }
  }

  const profile = data as PersonalityProfile

  return {
    domains: ['Extraversion', 'Agreeableness', 'Conscientiousness', 'Neuroticism', 'Openness'],
    scores: [
      profile.big5_extraversion,
      profile.big5_agreeableness,
      profile.big5_conscientiousness,
      profile.big5_neuroticism,
      profile.big5_openness
    ],
    lastUpdated: profile.last_updated || profile.created_at
  }
}

/**
 * Compare two test results
 */
export async function compareTestResults(
  testType: TestType,
  date1: string,
  date2: string
): Promise<ComparisonData | null> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data } = await supabase
    .from('mental_health_records')
    .select('*')
    .eq('user_id', user.id)
    .eq('test_type', testType)
    .in('completed_at', [date1, date2])

  if (!data || data.length !== 2) {
    return null
  }

  const typedData = data as MentalHealthRecord[]
  const record1 = typedData.find(r => r.completed_at === date1)
  const record2 = typedData.find(r => r.completed_at === date2)

  if (!record1 || !record2) {
    return null
  }

  const severityOrder = ['normal', 'mild', 'moderate', 'severe', 'extremely_severe']
  const severity1Index = severityOrder.indexOf(record1.severity_level)
  const severity2Index = severityOrder.indexOf(record2.severity_level)

  let severityChange: 'improved' | 'same' | 'worsened' = 'same'
  if (severity2Index < severity1Index) {
    severityChange = 'improved'
  } else if (severity2Index > severity1Index) {
    severityChange = 'worsened'
  }

  return {
    testType,
    date1,
    date2,
    score1: record1.total_score,
    score2: record2.total_score,
    scoreDifference: record2.total_score - record1.total_score,
    severity1: record1.severity_level,
    severity2: record2.severity_level,
    severityChange
  }
}

/**
 * Get test history filtered by date range
 */
export async function getTestHistoryByDateRange(
  startDate: Date,
  endDate: Date
): Promise<TimelineEntry[]> {
  const timeline = await getTestTimeline()

  return timeline.filter(entry => {
    const entryDate = new Date(entry.date)
    return entryDate >= startDate && entryDate <= endDate
  })
}

/**
 * Get all mental health records for a specific test type
 */
export async function getTestTypeHistory(testType: TestType): Promise<MentalHealthRecord[]> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return []
  }

  const { data, error } = await supabase
    .from('mental_health_records')
    .select('*')
    .eq('user_id', user.id)
    .eq('test_type', testType)
    .order('completed_at', { ascending: false })

  if (error || !data) {
    return []
  }

  return data
}

/**
 * Export all test history as structured data for PDF
 */
export async function exportTestHistoryData() {
  const timeline = await getTestTimeline()
  const summary = await getTestHistorySummary()

  return {
    summary,
    timeline,
    exportedAt: new Date().toISOString()
  }
}
