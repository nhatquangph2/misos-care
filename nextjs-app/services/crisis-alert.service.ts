/**
 * Crisis Alert Service
 * Client-side service for crisis alert functionality
 */

import { CRISIS_HOTLINES } from '@/constants/tests/phq9-questions'

export interface CrisisAlertData {
  testType: string
  severityLevel: string
  crisisReason: string
  totalScore: number
  question9Score?: number
}

export interface CrisisAlertResponse {
  success: boolean
  message: string
  data?: {
    alertId: string
    hotlines: typeof CRISIS_HOTLINES
    emergencyContact?: {
      name: string
      phone: string
    }
  }
  error?: string
}

/**
 * Submit a crisis alert
 */
export async function submitCrisisAlert(data: CrisisAlertData): Promise<CrisisAlertResponse> {
  try {
    const response = await fetch('/api/crisis-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Không thể gửi cảnh báo',
        error: result.error,
      }
    }

    return result
  } catch (error) {
    console.error('Error submitting crisis alert:', error)
    return {
      success: false,
      message: 'Đã xảy ra lỗi khi gửi cảnh báo',
      error: 'Network Error',
    }
  }
}

/**
 * Get crisis alerts for mentors/admins
 */
export async function getCrisisAlerts(options?: {
  status?: 'pending' | 'acknowledged' | 'in_progress' | 'resolved'
  limit?: number
}) {
  try {
    const params = new URLSearchParams()
    if (options?.status) params.append('status', options.status)
    if (options?.limit) params.append('limit', options.limit.toString())

    const response = await fetch(`/api/crisis-alert?${params.toString()}`)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch alerts')
    }

    return result.data
  } catch (error) {
    console.error('Error fetching crisis alerts:', error)
    return []
  }
}

/**
 * Update crisis alert status
 */
export async function updateCrisisAlertStatus(
  alertId: string,
  data: {
    status: 'acknowledged' | 'in_progress' | 'resolved'
    notes?: string
    followUpDate?: string
  }
) {
  try {
    const response = await fetch(`/api/crisis-alert/${alertId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update alert')
    }

    return result
  } catch (error) {
    console.error('Error updating crisis alert:', error)
    throw error
  }
}

/**
 * Get crisis alert details
 */
export async function getCrisisAlertDetails(alertId: string) {
  try {
    const response = await fetch(`/api/crisis-alert/${alertId}`)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch alert details')
    }

    return result.data
  } catch (error) {
    console.error('Error fetching crisis alert details:', error)
    throw error
  }
}

/**
 * Check if test result should trigger crisis alert
 */
export function shouldTriggerCrisisAlert(
  testType: string,
  result: {
    totalScore?: number
    crisisFlag?: boolean
    question9Score?: number
    severityLevel?: string
  }
): boolean {
  if (testType === 'PHQ9') {
    // PHQ-9: Alert if question 9 > 0 OR total score >= 15
    if (result.question9Score && result.question9Score > 0) return true
    if (result.totalScore && result.totalScore >= 15) return true
    if (result.crisisFlag) return true
  }

  if (testType === 'GAD7') {
    // GAD-7: Alert if severe anxiety (score >= 15)
    if (result.totalScore && result.totalScore >= 15) return true
  }

  if (testType === 'DASS21') {
    // DASS-21: Alert if severe depression/anxiety/stress
    if (result.severityLevel === 'extremely_severe' || result.severityLevel === 'severe') {
      return true
    }
  }

  return result.crisisFlag || false
}

/**
 * Get primary crisis hotline
 */
export function getPrimaryCrisisHotline() {
  return CRISIS_HOTLINES.find(h => (h as any).isPrimary) || CRISIS_HOTLINES[0]
}

/**
 * Format phone number for tel: link
 */
export function formatPhoneLink(phone: string): string {
  return `tel:${phone.replace(/\s+/g, '')}`
}
