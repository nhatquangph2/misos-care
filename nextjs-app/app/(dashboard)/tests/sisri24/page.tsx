/**
 * SISRI-24 Test Page
 * Spiritual Intelligence Self-Report Inventory - 24 Questions
 */

'use client'

import { OceanTestFlow } from '@/components/features/tests/OceanTestFlow'
import { SISRI_24_QUESTIONS } from '@/constants/tests/sisri-24-questions'
import { calculateSISRI24 } from '@/services/test.service'
import { useTestSubmit } from '@/hooks/useTestSubmit'

export default function SISRI24TestPage() {
  const { submitTest, isSubmitting } = useTestSubmit()

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
    try {
      // Calculate results
      const result = calculateSISRI24(answers)

      // Submit using centralized hook (handles API, localStorage, navigation)
      await submitTest({
        testType: 'SISRI24',
        answers,
        result,
        nextRoute: '/tests/sisri24/results',
      })
    } catch (error) {
      console.error('Error in SISRI-24 test:', error)
      // Hook already handles error display
    }
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-xl font-semibold text-foreground">Đang phân tích trí tuệ tâm linh...</p>
          <p className="text-sm text-muted-foreground mt-3">Miso đang khám phá chiều sâu tâm linh của bạn</p>
        </div>
      </div>
    )
  }

  return (
    <OceanTestFlow
      questions={SISRI_24_QUESTIONS}
      testTitle="SISRI-24 - Trí tuệ Tâm linh"
      onComplete={handleComplete}
      testType="personality"
    />
  )
}
