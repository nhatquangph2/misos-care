/**
 * Big Five Personality Test Page - BFI-2 Version
 * Big Five Inventory-2: 60 items, 5 domains, 15 facets
 * Chuẩn hóa theo nghiên cứu Soto & John (2017)
 */

'use client'

import { useState, useEffect } from 'react'
import { OceanTestFlow } from '@/components/features/tests/OceanTestFlow'
import { BFI2_QUESTIONS_FLOW } from '@/constants/tests/bfi2-questions'
import { calculateBFI2Score } from '@/services/bfi2-scoring.service'
import { useTestSubmit } from '@/hooks/useTestSubmit'
import type { BFI2Response } from '@/constants/tests/bfi2-questions'

export default function Big5TestPage() {
  const { submitTest, isSubmitting } = useTestSubmit()
  const [startTime, setStartTime] = useState<number>(0)

  // Track start time để tính completion time
  useEffect(() => {
    setStartTime(Date.now())
  }, [])

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
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
          return
        }
      }

      const completedAt = new Date().toISOString()

      // Store quality report and completion time separately (not part of standard flow)
      localStorage.setItem('bfi2_result', JSON.stringify(score))
      localStorage.setItem('bfi2_responses', JSON.stringify(bfi2Responses))
      localStorage.setItem('bfi2_quality_report', JSON.stringify(qualityReport))
      localStorage.setItem('bfi2_completion_time', completionTime.toString())

      // Convert domain scores from 1-5 scale to 0-100 percentage for database
      const dimensionsPercentage = {
        openness: Math.round(((score.domains.O - 1) / 4) * 100),
        conscientiousness: Math.round(((score.domains.C - 1) / 4) * 100),
        extraversion: Math.round(((score.domains.E - 1) / 4) * 100),
        agreeableness: Math.round(((score.domains.A - 1) / 4) * 100),
        neuroticism: Math.round(((score.domains.N - 1) / 4) * 100),
      }

      // Submit using centralized hook (handles API, localStorage, navigation)
      await submitTest({
        testType: 'BIG5',
        answers,
        result: {
          dimensions: dimensionsPercentage, // Big5 domain scores in 0-100 format
        },
        nextRoute: '/tests/big5/results',
        completedAt,
      })
    } catch (error) {
      console.error('Error in Big5 test:', error)
      // Hook already handles error display
    }
  }

  if (isSubmitting) {
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
      questions={BFI2_QUESTIONS_FLOW}
      onComplete={handleComplete}
      testTitle="Big Five Inventory-2 (BFI-2)"
      testType="personality"
    />
  )
}
