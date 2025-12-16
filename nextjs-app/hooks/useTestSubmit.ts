/**
 * useTestSubmit Hook
 * Centralized test submission logic with API integration, localStorage backup, and gamification
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SubmitTestParams {
  testType: string // 'MBTI', 'DASS21', 'BIG5', etc.
  answers: any[]
  result: any
  nextRoute: string // Where to navigate after success
  completedAt?: string
}

interface SubmitResponse {
  success: boolean
  message?: string
  bubblesAwarded?: number
  crisisDetected?: boolean
  data?: any
}

export function useTestSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const submitTest = async ({
    testType,
    answers,
    result,
    nextRoute,
    completedAt = new Date().toISOString(),
  }: SubmitTestParams): Promise<SubmitResponse> => {
    setIsSubmitting(true)

    try {
      // 1. Backup to localStorage first (for immediate results display)
      const storageKey = `${testType.toLowerCase()}_result`
      const answersKey = `${testType.toLowerCase()}_answers`
      const completedKey = `${testType.toLowerCase()}_completed_at`

      localStorage.setItem(storageKey, JSON.stringify(result))
      localStorage.setItem(answersKey, JSON.stringify(answers))
      localStorage.setItem(completedKey, completedAt)

      // 2. Submit to API
      const response = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: testType.toUpperCase(),
          answers,
          result,
          completedAt,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API submission failed:', data.message)
        // Don't block user - localStorage backup exists
        // Just log and continue
      } else {
        // 3. Show gamification feedback
        if (data.bubblesAwarded && data.bubblesAwarded > 0) {
          // TODO: Replace with toast notification
          console.log(`🎉 +${data.bubblesAwarded} Bubbles!`)
          // Could also trigger a BubbleRewardAnimation component here
        }

        // 4. Handle crisis detection
        if (data.crisisDetected) {
          console.warn('⚠️ Crisis intervention needed')
          // Crisis alert will be shown on results page
        }
      }

      // 5. Navigate to results page
      router.push(nextRoute)

      return {
        success: true,
        bubblesAwarded: data.bubblesAwarded,
        crisisDetected: data.crisisDetected,
        data,
      }
    } catch (error) {
      console.error('Test submission error:', error)

      // Even if API fails, we have localStorage backup
      // So still navigate to results page
      const continueAnyway = confirm(
        'Không thể lưu kết quả vào hệ thống. Bạn có muốn xem kết quả tạm thời không?'
      )

      if (continueAnyway) {
        router.push(nextRoute)
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submitTest, isSubmitting }
}
