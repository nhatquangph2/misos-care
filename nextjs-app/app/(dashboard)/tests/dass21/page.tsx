/**
 * DASS-21 Test Page
 * Depression, Anxiety and Stress Scale
 */

'use client'

import { OceanTestFlow } from '@/components/features/tests/OceanTestFlow'
import { DASS21_QUESTIONS_FLOW, DASS21_QUESTIONS } from '@/constants/tests/dass21-questions'
import { calculateDASS21 } from '@/services/test.service'
import { useTestSubmit } from '@/hooks/useTestSubmit'
import type { DASS21QuestionResponse } from '@/constants/tests/dass21-questions'

export default function DASS21TestPage() {
  const { submitTest, isSubmitting } = useTestSubmit()

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
    try {
      // Convert to DASS21QuestionResponse format
      const dass21Answers: DASS21QuestionResponse[] = answers.map((a) => {
        // Map answer index to question ID
        const question = DASS21_QUESTIONS[a.questionId - 1]
        return {
          questionId: question.id,
          score: a.value,
        }
      })

      // Calculate results
      const result = calculateDASS21(dass21Answers)

      // Submit using centralized hook (handles API, localStorage, navigation)
      await submitTest({
        testType: 'DASS21',
        answers,
        result,
        nextRoute: '/tests/dass21/results',
      })
    } catch (error) {
      console.error('Error in DASS-21 test:', error)
      // Hook already handles error display
    }
  }

  if (isSubmitting) {
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
      questions={DASS21_QUESTIONS_FLOW}
      onComplete={handleComplete}
      testTitle="DASS-21 - Trầm cảm, Lo âu, Stress"
      testType="mental-health"
    />
  )
}
