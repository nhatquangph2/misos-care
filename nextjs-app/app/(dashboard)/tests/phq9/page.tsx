/**
 * PHQ-9 Test Page
 * Patient Health Questionnaire for Depression
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OceanTestFlow } from '@/components/features/tests/OceanTestFlow'
import { PHQ9_QUESTIONS, PHQ9_SEVERITY, CRISIS_THRESHOLD } from '@/constants/tests/phq9-questions'

export default function PHQ9TestPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
    setIsLoading(true)

    try {
      // Calculate total score
      const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0)

      // Determine severity level
      let severity: typeof PHQ9_SEVERITY[keyof typeof PHQ9_SEVERITY] = PHQ9_SEVERITY.minimal
      if (totalScore >= PHQ9_SEVERITY.severe.min) severity = PHQ9_SEVERITY.severe
      else if (totalScore >= PHQ9_SEVERITY.moderatelySevere.min) severity = PHQ9_SEVERITY.moderatelySevere
      else if (totalScore >= PHQ9_SEVERITY.moderate.min) severity = PHQ9_SEVERITY.moderate
      else if (totalScore >= PHQ9_SEVERITY.mild.min) severity = PHQ9_SEVERITY.mild

      // Check for crisis (question 9 - suicidal ideation)
      const question9Answer = answers.find((a) => a.questionId === 9)
      const hasSuicidalIdeation = question9Answer && question9Answer.value > 0
      const needsCrisisIntervention = hasSuicidalIdeation || totalScore >= CRISIS_THRESHOLD.totalScore

      const result = {
        totalScore,
        severity,
        hasSuicidalIdeation,
        needsCrisisIntervention,
      }

      // Store results in localStorage
      localStorage.setItem('phq9_result', JSON.stringify(result))
      localStorage.setItem('phq9_answers', JSON.stringify(answers))
      localStorage.setItem('phq9_completed_at', new Date().toISOString())

      // Navigate to results page
      router.push('/tests/phq9/results')
    } catch (error) {
      console.error('Error calculating PHQ-9:', error)
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
      questions={PHQ9_QUESTIONS}
      onComplete={handleComplete}
      testTitle="PHQ-9 - Sàng lọc Trầm cảm"
      testType="mental-health"
    />
  )
}
