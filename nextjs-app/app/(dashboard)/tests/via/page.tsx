/**
 * VIA Character Strengths Test Page
 * Values in Action - Discover your signature character strengths
 * Based on VIA Institute on Character methodology
 */

'use client'

import { OceanTestFlow } from '@/components/features/tests/OceanTestFlow'
import { VIA_QUESTIONS_FLOW } from '@/constants/tests/via-questions'
import { calculateVIA } from '@/services/via-scoring.service'
import { useTestSubmit } from '@/hooks/useTestSubmit'
import type { VIAAnswer } from '@/services/via-scoring.service'

export default function VIATestPage() {
  const { submitTest, isSubmitting } = useTestSubmit()

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
    try {
      // Convert to VIAAnswer format
      const viaAnswers: VIAAnswer[] = answers.map((a) => ({
        questionId: a.questionId,
        value: a.value,
      }))

      // Calculate results
      const result = calculateVIA(viaAnswers)

      // Submit using centralized hook (handles API, localStorage, navigation)
      await submitTest({
        testType: 'VIA',
        answers,
        result,
        nextRoute: '/tests/via/results',
      })
    } catch (error) {
      console.error('Error in VIA test:', error)
      // Hook already handles error display
    }
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-xl font-semibold text-foreground">Đang phân tích điểm mạnh của bạn...</p>
          <p className="text-sm text-muted-foreground mt-3">Miso đang khám phá những giá trị đặc biệt trong bạn 🌟</p>
        </div>
      </div>
    )
  }

  return (
    <OceanTestFlow
      questions={VIA_QUESTIONS_FLOW}
      onComplete={handleComplete}
      testTitle="VIA - Khám phá Điểm mạnh Tính cách"
      testType="personality"
    />
  )
}
