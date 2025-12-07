/**
 * PSS-10 Test Page
 * Perceived Stress Scale
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScrollableQuestionFlow } from "@/components/features/tests/ScrollableQuestionFlow"
import { PSS_QUESTIONS, calculatePSSScore, getPSSSeverity } from '@/constants/tests/pss-questions'

export default function PSSTestPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
    setIsLoading(true)

    try {
      // Calculate total score with reverse scoring
      const totalScore = calculatePSSScore(answers)

      // Determine severity level
      const severity = getPSSSeverity(totalScore)

      // Check for crisis (high stress)
      const needsCrisisIntervention = totalScore >= 27

      const result = {
        totalScore,
        severity,
        needsCrisisIntervention,
      }

      // Store results in localStorage
      localStorage.setItem('pss_result', JSON.stringify(result))
      localStorage.setItem('pss_answers', JSON.stringify(answers))
      localStorage.setItem('pss_completed_at', new Date().toISOString())

      // Navigate to results page
      router.push('/tests/pss/results')
    } catch (error) {
      console.error('Error calculating PSS:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Đang phân tích kết quả...</p>
          <p className="text-sm text-muted-foreground mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollableQuestionFlow
      questions={PSS_QUESTIONS}
      onComplete={handleComplete}
      testTitle="PSS-10 - Thang đo Căng thẳng"
      testType="mental-health"
    />
  )
}
