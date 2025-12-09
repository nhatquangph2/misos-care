/**
 * PSS-10 Results Page
 * Display perceived stress results
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFadeIn } from '@/hooks/useGSAP'
import { PSS_RECOMMENDATIONS, STRESS_HOTLINES } from '@/constants/tests/pss-questions'
import { saveMentalHealthRecord } from '@/services/mental-health-records.service'
import { Home, RefreshCw, Share2, Brain, AlertTriangle, Phone, CheckCircle2 } from 'lucide-react'

interface PSSResult {
  totalScore: number
  severity: {
    min: number
    max: number
    label: string
    color: string
    description: string
  }
  needsCrisisIntervention: boolean
}

export default function PSSResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<PSSResult | null>(null)
  const [completedAt, setCompletedAt] = useState<string>('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)

  const pageRef = useFadeIn(0.8)

  useEffect(() => {
    // Load results from localStorage
    const storedResult = localStorage.getItem('pss_result')
    const storedDate = localStorage.getItem('pss_completed_at')

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

        // Map severity label to severity level
        const severityMap: Record<string, 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe'> = {
          'Thấp': 'normal',
          'Trung bình': 'moderate',
          'Cao': 'severe'
        }

        await saveMentalHealthRecord({
          testType: 'PSS',
          totalScore: parsedResult.totalScore,
          severityLevel: severityMap[parsedResult.severity.label] || 'normal',
          crisisFlag: parsedResult.needsCrisisIntervention,
          crisisReason: parsedResult.needsCrisisIntervention ? 'High stress levels' : undefined,
          completedAt: storedDate ? new Date(storedDate) : new Date(),
        })

        setSaveStatus('saved')
      } catch (error) {
        console.error('Failed to save PSS results:', error)
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

  const getSeverityColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800 border-green-300'
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'red': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const recommendations = PSS_RECOMMENDATIONS[
    result.severity.label === 'Thấp' ? 'low' :
    result.severity.label === 'Trung bình' ? 'moderate' :
    'high'
  ]

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
            Kết quả PSS-10
          </h1>

          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Thang đo Căng thẳng Cảm nhận
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Đánh giá mức độ căng thẳng trong tháng qua
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
            <AlertTitle className="text-lg font-bold">Mức độ căng thẳng cao - Cần chú ý</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-3">
                Kết quả cho thấy bạn đang ở mức độ căng thẳng cao. Chúng tôi khuyến nghị bạn tìm kiếm sự hỗ trợ từ chuyên gia sức khỏe tinh thần.
                Vui lòng liên hệ với các số hotline sau:
              </p>
              <div className="space-y-2">
                {STRESS_HOTLINES.map((hotline) => (
                  <div key={hotline.phone} className="flex items-center gap-2 p-2 bg-white/10 rounded">
                    <Phone className="w-4 h-4" />
                    <span className="font-bold">{hotline.phone}</span>
                    <span>- {hotline.name}</span>
                    {hotline.description && <span className="text-sm">({hotline.description})</span>}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Score Card */}
        <Card className={`mb-8 shadow-xl border-2 ${getSeverityColor(result.severity.color)}`}>
          <CardHeader>
            <CardTitle className="text-center">Điểm số của bạn</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold mb-4">{result.totalScore}</div>
            <Badge
              variant="secondary"
              className="text-2xl px-6 py-3 mb-4"
            >
              {result.severity.label}
            </Badge>
            <p className="text-lg text-muted-foreground mt-2">
              {result.severity.description}
            </p>
            <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-6 max-w-md mx-auto">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-teal-500"
                style={{ width: `${(result.totalScore / 40) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Thang điểm: 0-40</p>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8 shadow-xl border-2">
          <CardHeader>
            <CardTitle>{recommendations.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recommendations.actions.map((action, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

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
            onClick={() => router.push('/tests/pss')}
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
              <strong>Lưu ý:</strong> PSS-10 là công cụ đo lường căng thẳng cảm nhận, không phải là công cụ chẩn đoán.
              Kết quả này chỉ mang tính tham khảo. Để có đánh giá chính xác, vui lòng tham khảo ý kiến chuyên gia sức khỏe tinh thần.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
