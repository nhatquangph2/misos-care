/**
 * Big5 Personality Test Page
 * OCEAN personality assessment
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScrollableQuestionFlow } from '@/components/features/tests/ScrollableQuestionFlow'
import { BIG5_QUESTIONS_FLOW, BIG5_QUESTIONS, calculateBig5 } from '@/constants/tests/big5-questions'
import type { Big5QuestionResponse } from '@/constants/tests/big5-questions'

export default function Big5TestPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
    setIsLoading(true)

    try {
      // Convert to Big5QuestionResponse format
      const big5Answers: Big5QuestionResponse[] = answers.map((a) => {
        // Map answer index to question ID
        const question = BIG5_QUESTIONS[a.questionId - 1]
        return {
          questionId: question.id,
          score: a.value,
        }
      })

      // Calculate results
      const result = calculateBig5(big5Answers)

      // Store results in localStorage (temporary - will use Supabase later)
      localStorage.setItem('big5_result', JSON.stringify(result))
      localStorage.setItem('big5_answers', JSON.stringify(answers))
      localStorage.setItem('big5_completed_at', new Date().toISOString())

      // Navigate to results page
      router.push('/tests/big5/results')
    } catch (error) {
      console.error('Error calculating Big5:', error)
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
    <ScrollableQuestionFlow
      questions={BIG5_QUESTIONS_FLOW}
      onComplete={handleComplete}
      testTitle="Big Five - OCEAN Personality"
      testType="personality"
    />
  )
}
