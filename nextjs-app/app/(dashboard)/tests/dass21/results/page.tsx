/**
 * DASS-21 Results Page
 * Display Depression, Anxiety and Stress scores
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFadeIn, useStagger } from '@/hooks/useGSAP'
import { DASS21_SUBSCALES, CRISIS_RESOURCES } from '@/constants/tests/dass21-questions'
import type { DASS21SubscaleScore } from '@/constants/tests/dass21-questions'
import { saveMentalHealthRecord } from '@/services/mental-health-records.service'
import { Home, RefreshCw, Share2, Brain, AlertTriangle, Phone } from 'lucide-react'

interface DASS21Result {
  subscaleScores: DASS21SubscaleScore[]
  overallAssessment: string
  needsCrisisIntervention: boolean
}

export default function DASS21ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<DASS21Result | null>(null)
  const [completedAt, setCompletedAt] = useState<string>('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)

  const pageRef = useFadeIn(0.8)
  const cardsRef = useStagger(0.15)

  useEffect(() => {
    // Load results from localStorage
    const storedResult = localStorage.getItem('dass21_result')
    const storedDate = localStorage.getItem('dass21_completed_at')

    if (!storedResult) {
      router.push('/tests')
      return
    }

    const parsedResult = JSON.parse(storedResult)
    setResult(parsedResult)
    if (storedDate) {
      const date = new Date(storedDate)
      setCompletedAt(date.toLocaleDateString('vi-VN'))
    }

    // Auto-save results to database
    const saveResults = async () => {
      try {
        setSaveStatus('saving')

        // Calculate total score and get worst severity level
        let totalScore = 0
        const subscaleScoresObj: Record<string, number> = {}
        let worstSeverity: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe' = 'normal'
        const severityOrder = ['normal', 'mild', 'moderate', 'severe', 'extremely_severe']

        parsedResult.subscaleScores.forEach((subscale: DASS21SubscaleScore) => {
          totalScore += subscale.rawScore
          subscaleScoresObj[subscale.subscaleName] = subscale.rawScore

          // Map severity level from object to string
          const severityMap: Record<string, 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe'> = {
            'normal': 'normal',
            'mild': 'mild',
            'moderate': 'moderate',
            'severe': 'severe',
            'extremely-severe': 'extremely_severe'
          }

          const severityValue = severityMap[subscale.severity.level] || 'normal'
          if (severityOrder.indexOf(severityValue) > severityOrder.indexOf(worstSeverity)) {
            worstSeverity = severityValue
          }
        })

        await saveMentalHealthRecord({
          testType: 'DASS21',
          totalScore: totalScore,
          severityLevel: worstSeverity,
          subscaleScores: subscaleScoresObj,
          crisisFlag: parsedResult.needsCrisisIntervention,
          crisisReason: parsedResult.needsCrisisIntervention ? 'Severe mental health symptoms' : undefined,
          completedAt: storedDate ? new Date(storedDate) : new Date(),
        })

        setSaveStatus('saved')
      } catch (error) {
        console.error('Failed to save DASS-21 results:', error)
        setSaveStatus('error')
        setSaveError(error instanceof Error ? error.message : 'Không thể lưu kết quả')
      }
    }

    saveResults()
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 py-12"
    >
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Kết quả DASS-21
          </h1>

          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Depression, Anxiety and Stress Scale
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Đánh giá mức độ trầm cảm, lo âu và stress
          </p>

          {completedAt && (
            <p className="text-sm text-muted-foreground mt-4">
              Hoàn thành ngày {completedAt}
            </p>
          )}

          {/* Save Status */}
          <div className="mt-4">
            {saveStatus === 'saved' && (
              <Badge variant="outline" className="text-sm px-4 py-2 bg-green-50 text-green-700 border-green-300">
                ✓ Đã lưu vào hồ sơ
              </Badge>
            )}
            {saveStatus === 'saving' && (
              <Badge variant="outline" className="text-sm px-4 py-2 bg-blue-50 text-blue-700 border-blue-300">
                ⏳ Đang lưu...
              </Badge>
            )}
            {saveStatus === 'error' && saveError && (
              <Alert variant="destructive" className="mt-4 max-w-md mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Không thể lưu kết quả</AlertTitle>
                <AlertDescription>{saveError}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Crisis Alert */}
        {result.needsCrisisIntervention && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold">Cần hỗ trợ khẩn cấp</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-3">
                Kết quả cho thấy bạn có thể cần sự hỗ trợ từ chuyên gia sức khỏe tinh thần.
                Vui lòng liên hệ ngay với các số hotline sau:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-white/10 rounded">
                  <Phone className="w-4 h-4" />
                  <span className="font-bold">{CRISIS_RESOURCES.vietnam.hotline}</span>
                  <span>- {CRISIS_RESOURCES.vietnam.hotlineName}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white/10 rounded">
                  <Phone className="w-4 h-4" />
                  <span className="font-bold">{CRISIS_RESOURCES.vietnam.emergency}</span>
                  <span>- {CRISIS_RESOURCES.vietnam.emergencyName}</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Overall Assessment */}
        <Card className="mb-8 shadow-xl border-2">
          <CardHeader>
            <CardTitle>Đánh giá tổng quan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{result.overallAssessment}</p>
          </CardContent>
        </Card>

        {/* Subscale Scores */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6 mb-8">
          {result.subscaleScores.map((score) => {
            const getSeverityColor = (level: string) => {
              switch (level) {
                case 'normal': return 'bg-green-100 text-green-800 border-green-300'
                case 'mild': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
                case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-300'
                case 'severe': return 'bg-red-100 text-red-800 border-red-300'
                case 'extremely-severe': return 'bg-red-200 text-red-900 border-red-400'
                default: return 'bg-gray-100 text-gray-800 border-gray-300'
              }
            }

            return (
              <Card key={score.subscale} className={`shadow-lg border-2 ${getSeverityColor(score.severity.level)}`}>
                <CardHeader>
                  <CardTitle className="text-xl">{score.subscaleName}</CardTitle>
                  <CardDescription className="text-sm">
                    Điểm: {score.normalizedScore}/42
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Badge
                      variant="secondary"
                      className="text-lg px-4 py-2 mb-3"
                      style={{ backgroundColor: score.severity.color, color: 'white' }}
                    >
                      {score.severity.label}
                    </Badge>
                    <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
                      <div
                        className="absolute left-0 top-0 h-full"
                        style={{
                          width: `${(score.normalizedScore / 42) * 100}%`,
                          backgroundColor: score.severity.color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {score.rawScore} điểm thô × 2 = {score.normalizedScore}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Separator className="my-8" />

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => router.push('/tests')}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Button>

          <Button
            onClick={() => router.push('/tests/dass21')}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Làm lại test
          </Button>

          <Button
            onClick={() => alert('Tính năng chia sẻ đang được phát triển!')}
            size="lg"
            className="gap-2 bg-gradient-to-r from-blue-500 to-teal-500"
          >
            <Share2 className="w-4 h-4" />
            Chia sẻ kết quả
          </Button>
        </div>

        {/* Info Box */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Lưu ý:</strong> DASS-21 là công cụ sàng lọc, không phải là công cụ chẩn đoán.
              Kết quả này chỉ mang tính tham khảo. Để có đánh giá chính xác, vui lòng tham khảo ý kiến chuyên gia sức khỏe tinh thần.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
