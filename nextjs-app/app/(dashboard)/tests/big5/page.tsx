/**
 * Big Five Personality Test Page - BFI-2 Version
 * Big Five Inventory-2: 60 items, 5 domains, 15 facets
 * Chuẩn hóa theo nghiên cứu Soto & John (2017)
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ScrollableQuestionFlow } from '@/components/features/tests/ScrollableQuestionFlow'
import { BFI2_QUESTIONS_FLOW } from '@/constants/tests/bfi2-questions'
import { calculateBFI2Score } from '@/services/bfi2-scoring.service'
import type { BFI2Response } from '@/constants/tests/bfi2-questions'

export default function Big5TestPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)

  // Track start time để tính completion time
  useEffect(() => {
    setStartTime(Date.now())
  }, [])

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
    setIsLoading(true)

    try {
      // Tính thời gian hoàn thành (giây)
      const completionTime = Math.floor((Date.now() - startTime) / 1000)

      // Convert to BFI2Response format
      const bfi2Responses: BFI2Response[] = answers.map((a) => ({
        itemId: a.questionId,
        value: a.value,
      }))

      // Calculate results với quality check
      const { score, qualityReport } = calculateBFI2Score(bfi2Responses, completionTime)

      // Kiểm tra data quality
      if (!qualityReport.isValid) {
        const continueAnyway = confirm(
          `⚠️ Cảnh báo chất lượng dữ liệu:\n\n${qualityReport.warnings.join('\n')}\n\nBạn có muốn tiếp tục xem kết quả không?`
        )
        if (!continueAnyway) {
          setIsLoading(false)
          return
        }
      }

      // Store results in localStorage
      localStorage.setItem('bfi2_result', JSON.stringify(score))
      localStorage.setItem('bfi2_responses', JSON.stringify(bfi2Responses))
      localStorage.setItem('bfi2_quality_report', JSON.stringify(qualityReport))
      localStorage.setItem('bfi2_completed_at', new Date().toISOString())
      localStorage.setItem('bfi2_completion_time', completionTime.toString())

      // Navigate to results page
      router.push('/tests/big5/results')
    } catch (error) {
      console.error('Error calculating BFI-2:', error)
      alert('Có lỗi xảy ra khi tính toán kết quả. Vui lòng thử lại.')
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
      questions={BFI2_QUESTIONS_FLOW}
      onComplete={handleComplete}
      testTitle="Big Five Inventory-2 (BFI-2)"
      testType="personality"
    />
  )
}
