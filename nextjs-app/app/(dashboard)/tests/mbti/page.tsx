/**
 * MBTI Test Page
 * Complete MBTI personality test with results
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OceanTestFlow } from '@/components/features/tests/OceanTestFlow'
import { MBTI_QUESTIONS } from '@/constants/tests/mbti-questions'
import { calculateMBTI } from '@/services/test.service'
import type { MBTIAnswer } from '@/services/test.service'

export default function MBTITestPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
    setIsLoading(true)

    try {
      // Convert to MBTIAnswer format
      const mbtiAnswers: MBTIAnswer[] = answers.map((a) => ({
        questionId: a.questionId,
        value: a.value,
      }))

      // Calculate results
      const result = calculateMBTI(mbtiAnswers)

      // Store results in localStorage (temporary - will use Supabase later)
      localStorage.setItem('mbti_result', JSON.stringify(result))
      localStorage.setItem('mbti_answers', JSON.stringify(answers))
      localStorage.setItem('mbti_completed_at', new Date().toISOString())

      // Navigate to results page
      router.push('/tests/mbti/results')
    } catch (error) {
      console.error('Error calculating MBTI:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-xl font-semibold text-foreground">Đang phân tích kết quả...</p>
          <p className="text-sm text-muted-foreground mt-3">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    )
  }

  return (
    <OceanTestFlow
      questions={MBTI_QUESTIONS}
      onComplete={handleComplete}
      testTitle="MBTI - 16 Personalities"
      testType="personality"
    />
  )
}
