/**
 * SISRI-24 Test Page
 * Spiritual Intelligence Self-Report Inventory - 24 Questions
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OceanQuestionFlow } from '@/components/features/tests/OceanQuestionFlow'
import { SISRI_24_QUESTIONS } from '@/constants/tests/sisri-24-questions'
import { calculateSISRI24 } from '@/services/test.service'

export default function SISRI24TestPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
    setIsLoading(true)

    try {
      // Calculate results
      const result = calculateSISRI24(answers)

      // Store results in localStorage (temporary - will use Supabase later)
      localStorage.setItem('sisri24_result', JSON.stringify(result))
      localStorage.setItem('sisri24_answers', JSON.stringify(answers))
      localStorage.setItem('sisri24_completed_at', new Date().toISOString())

      // Navigate to results page
      router.push('/tests/sisri24/results')
    } catch (error) {
      console.error('Error calculating SISRI-24:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-lg text-muted-foreground">Đang tính toán kết quả của bạn...</p>
        </div>
      </div>
    )
  }

  return (
    <OceanQuestionFlow
      questions={SISRI_24_QUESTIONS}
      testTitle="SISRI-24 - Trí tuệ Tâm linh"
      onComplete={handleComplete}
      testType="personality"
    />
  )
}
