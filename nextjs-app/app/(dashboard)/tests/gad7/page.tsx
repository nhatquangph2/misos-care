/**
 * GAD-7 Test Page
 * Generalized Anxiety Disorder screening
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OceanTestFlow } from "@/components/features/tests/OceanTestFlow"
import { GAD7_QUESTIONS, getGAD7Severity } from '@/constants/tests/gad7-questions'

export default function GAD7TestPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
    setIsLoading(true)

    try {
      // Calculate total score
      const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0)

      // Determine severity level
      const severity = getGAD7Severity(totalScore)

      // Check for crisis (severe anxiety)
      const needsCrisisIntervention = totalScore >= 15

      const result = {
        totalScore,
        severity,
        needsCrisisIntervention,
      }

      // Store results in localStorage
      localStorage.setItem('gad7_result', JSON.stringify(result))
      localStorage.setItem('gad7_answers', JSON.stringify(answers))
      localStorage.setItem('gad7_completed_at', new Date().toISOString())

      // Navigate to results page
      router.push('/tests/gad7/results')
    } catch (error) {
      console.error('Error calculating GAD-7:', error)
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
    <OceanTestFlow
      questions={GAD7_QUESTIONS}
      onComplete={handleComplete}
      testTitle="GAD-7 - Sàng lọc Lo âu"
      testType="mental-health"
    />
  )
}
