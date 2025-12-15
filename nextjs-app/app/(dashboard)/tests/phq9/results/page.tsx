/**
 * PHQ-9 Results Page
 * Display depression screening results
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
import { PHQ9_RECOMMENDATIONS, CRISIS_HOTLINES } from '@/constants/tests/phq9-questions'
import { saveMentalHealthRecord } from '@/services/mental-health-records.service'
import { CrisisAlertModal } from '@/components/features/crisis/CrisisAlertModal'
import { Home, RefreshCw, Share2, Brain, AlertTriangle, Phone, CheckCircle2 } from 'lucide-react'

interface PHQ9Result {
  totalScore: number
  severity: {
    min: number
    max: number
    label: string
    color: string
    description: string
  }
  hasSuicidalIdeation: boolean
  needsCrisisIntervention: boolean
  question9Score?: number
}

export default function PHQ9ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<PHQ9Result | null>(null)
  const [completedAt, setCompletedAt] = useState<string>('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showCrisisModal, setShowCrisisModal] = useState(false)

  const pageRef = useFadeIn(0.8)

  useEffect(() => {
    // Load results from localStorage
    const storedResult = localStorage.getItem('phq9_result')
    const storedDate = localStorage.getItem('phq9_completed_at')

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

    // Show crisis modal if needed
    if (parsedResult.needsCrisisIntervention || parsedResult.hasSuicidalIdeation) {
      setShowCrisisModal(true)
    }

    // Auto-save results to database
    const saveResults = async () => {
      try {
        setSaveStatus('saving')

        // Map severity label to severity level
        const severityMap: Record<string, 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe'> = {
          'Tối thiểu': 'normal',
          'Nhẹ': 'mild',
          'Trung bình': 'moderate',
          'Khá nặng': 'severe',
          'Nặng': 'extremely_severe'
        }

        await saveMentalHealthRecord({
          testType: 'PHQ9',
          totalScore: parsedResult.totalScore,
          severityLevel: severityMap[parsedResult.severity.label] || 'normal',
          crisisFlag: parsedResult.needsCrisisIntervention,
          crisisReason: parsedResult.hasSuicidalIdeation ? 'Suicidal ideation reported' : parsedResult.needsCrisisIntervention ? 'Severe depression' : undefined,
          completedAt: storedDate ? new Date(storedDate) : new Date(),
        })

        setSaveStatus('saved')
      } catch (error) {
        console.error('Failed to save PHQ-9 results:', error)
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
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'red': return 'bg-red-100 text-red-800 border-red-300'
      case 'darkred': return 'bg-red-200 text-red-900 border-red-400'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const recommendations = PHQ9_RECOMMENDATIONS[
    result.severity.label === 'Tối thiểu' ? 'minimal' :
    result.severity.label === 'Nhẹ' ? 'mild' :
    result.severity.label === 'Trung bình' ? 'moderate' :
    result.severity.label === 'Khá nặng' ? 'moderatelySevere' :
    'severe'
  ]

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-background py-16"
    >
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="w-28 h-28 bg-gradient-to-br from-primary to-secondary rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20">
              <Brain className="w-14 h-14 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
            Kết quả PHQ-9
          </h1>

          <p className="text-2xl font-semibold text-foreground/80 mb-3">
            Sàng lọc Trầm cảm
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Đánh giá mức độ trầm cảm trong 2 tuần qua
          </p>

          {completedAt && (
            <p className="text-sm font-medium text-muted-foreground mt-6 bg-muted px-4 py-2 rounded-full inline-block">
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
          <Alert variant="destructive" className="mb-10 rounded-2xl border-2">
            <AlertTriangle className="h-6 w-6" />
            <AlertTitle className="text-xl font-bold">
              {result.hasSuicidalIdeation ? 'CẦN HỖ TRỢ KHẨN CẤP NGAY' : 'Cần hỗ trợ chuyên gia'}
            </AlertTitle>
            <AlertDescription className="mt-3">
              <p className="mb-3">
                {result.hasSuicidalIdeation
                  ? 'Bạn đã báo cáo có suy nghĩ tự hại. Đây là dấu hiệu nghiêm trọng. Vui lòng liên hệ NGAY với các số hotline sau hoặc đến cơ sở y tế gần nhất:'
                  : 'Kết quả cho thấy bạn có thể cần sự hỗ trợ từ chuyên gia sức khỏe tinh thần. Vui lòng liên hệ với các số hotline sau:'}
              </p>
              <div className="space-y-2">
                {CRISIS_HOTLINES.map((hotline) => (
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
        <Card className={`mb-10 ${getSeverityColor(result.severity.color)}`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl">Điểm số của bạn</CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-4">
            <div className="text-7xl font-bold mb-6 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">{result.totalScore}</div>
            <Badge
              variant="secondary"
              className="text-2xl px-8 py-4 mb-6 rounded-2xl font-bold"
            >
              {result.severity.label}
            </Badge>
            <p className="text-xl text-muted-foreground mt-4 font-medium leading-relaxed">
              {result.severity.description}
            </p>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden mt-8 max-w-md mx-auto">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                style={{ width: `${(result.totalScore / 27) * 100}%` }}
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-3">Thang điểm: 0-27</p>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-2xl">{recommendations.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recommendations.actions.map((action, index) => (
                <li key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-base leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Separator className="my-10" />

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => router.push('/tests')}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Button>

          <Button
            onClick={() => router.push('/tests/phq9')}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Làm lại test
          </Button>

          <Button
            onClick={() => alert('Tính năng chia sẻ đang được phát triển!')}
            size="lg"
            className="gap-2"
          >
            <Share2 className="w-5 h-5" />
            Chia sẻ kết quả
          </Button>
        </div>

        {/* Info Box */}
        <Card className="mt-10 bg-muted/30 border-border">
          <CardContent className="pt-8 pb-6">
            <p className="text-base text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Lưu ý:</strong> PHQ-9 là công cụ sàng lọc, không phải là công cụ chẩn đoán.
              Kết quả này chỉ mang tính tham khảo. Để có đánh giá chính xác, vui lòng tham khảo ý kiến chuyên gia sức khỏe tinh thần.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Crisis Alert Modal */}
      {result && (
        <CrisisAlertModal
          isOpen={showCrisisModal}
          onClose={() => setShowCrisisModal(false)}
          testType="PHQ9"
          result={{
            totalScore: result.totalScore,
            question9Score: result.question9Score,
            crisisReason: result.hasSuicidalIdeation
              ? 'Có suy nghĩ tự hại'
              : 'Điểm số cao - Trầm cảm nặng',
            severityLevel: result.severity.label === 'Nặng' ? 'extremely_severe' : 'severe',
          }}
        />
      )}
    </div>
  )
}
