/**
 * MBTI Results Page
 * Display personality type with beautiful visualization
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
import { MBTI_DESCRIPTIONS } from '@/constants/tests/mbti-questions'
import type { MBTIResult } from '@/services/test.service'
import { saveMBTIResult } from '@/services/personality-profile.service'
import { createClient } from '@/lib/supabase/client'
import { Home, Share2, RefreshCw, Brain, Briefcase, Heart, AlertTriangle } from 'lucide-react'

export default function MBTIResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<MBTIResult | null>(null)
  const [completedAt, setCompletedAt] = useState<string>('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'unauthenticated'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)

  const pageRef = useFadeIn(0.8)
  const cardsRef = useStagger(0.15)

  useEffect(() => {
    const timer = setTimeout(() => {
      // Load results from localStorage
      const storedResult = localStorage.getItem('mbti_result')
      const storedDate = localStorage.getItem('mbti_completed_at')

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

      // Check authentication and auto-save results
      const checkAuthAndSave = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          // User not authenticated, redirect to login
          router.push('/auth/login?redirect=/tests/mbti/results')
          return
        }

        // User is authenticated, save results
        try {
          setSaveStatus('saving')
          await saveMBTIResult(
            parsedResult.type,
            storedDate ? new Date(storedDate) : new Date()
          )
          setSaveStatus('saved')
        } catch (error) {
          console.error('Failed to save MBTI results:', error)
          setSaveStatus('error')
          setSaveError(error instanceof Error ? error.message : 'Không thể lưu kết quả')
        }
      }

      checkAuthAndSave()
    }, 0)

    return () => clearTimeout(timer)
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const description = MBTI_DESCRIPTIONS[result.type]
  const { percentages } = result

  return (
    <div
      ref={pageRef}
      className="min-h-screen py-12"
    >
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="blob-purple absolute -top-20 left-1/2 -translate-x-1/2" />

          <div className="inline-block mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 shape-organic-3 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-purple-500/30">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-5xl font-heading font-bold mb-4 gradient-text">
            {result.type}
          </h1>

          <p className="text-2xl font-semibold text-foreground/80 mb-2">
            {description.name}
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description.description}
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
          </div>
        </div>

        {/* Login Required Alert */}
        {saveStatus === 'unauthenticated' && (
          <Alert className="mb-8 border-blue-300 bg-blue-50">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-900">Đăng nhập để lưu kết quả</AlertTitle>
            <AlertDescription className="text-blue-800">
              <p className="mb-3">
                Kết quả của bạn đang được lưu tạm thời trên thiết bị này. Để lưu vĩnh viễn vào hồ sơ cá nhân và truy cập từ bất kỳ thiết bị nào, vui lòng đăng nhập.
              </p>
              <Button
                onClick={() => router.push('/auth/login?redirect=/tests/mbti/results')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Đăng nhập ngay
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Save Error Alert */}
        {saveStatus === 'error' && saveError && (
          <Alert variant="destructive" className="mb-8 max-w-md mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Không thể lưu kết quả</AlertTitle>
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        {/* Dimension Bars */}
        <Card className="glass-card shape-organic-1 mb-8 shadow-xl border-2">
          <CardHeader>
            <CardTitle>Phân tích chi tiết</CardTitle>
            <CardDescription>Tỷ lệ phần trăm cho mỗi chiều tính cách</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* E vs I */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Extraversion (E)</span>
                <span className="font-medium">Introversion (I)</span>
              </div>
              <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  style={{ width: `${percentages.EI}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                  {percentages.EI}% - {100 - percentages.EI}%
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Hướng ngoại</span>
                <span>Hướng nội</span>
              </div>
            </div>

            {/* S vs N */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Sensing (S)</span>
                <span className="font-medium">iNtuition (N)</span>
              </div>
              <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  style={{ width: `${percentages.SN}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                  {percentages.SN}% - {100 - percentages.SN}%
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Giác quan</span>
                <span>Trực giác</span>
              </div>
            </div>

            {/* T vs F */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Thinking (T)</span>
                <span className="font-medium">Feeling (F)</span>
              </div>
              <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  style={{ width: `${percentages.TF}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                  {percentages.TF}% - {100 - percentages.TF}%
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Lý trí</span>
                <span>Cảm xúc</span>
              </div>
            </div>

            {/* J vs P */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Judging (J)</span>
                <span className="font-medium">Perceiving (P)</span>
              </div>
              <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  style={{ width: `${percentages.JP}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                  {percentages.JP}% - {100 - percentages.JP}%
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Nguyên tắc</span>
                <span>Linh hoạt</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strengths & Careers Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <Card className="glass-card shape-organic-1 shadow-lg border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <CardTitle>Điểm mạnh</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {description.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Career Suggestions */}
          <Card className="glass-card shape-organic-1 shadow-lg border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <CardTitle>Nghề nghiệp phù hợp</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {description.careers.map((career, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                    {career}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
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
            onClick={() => router.push('/tests/mbti')}
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
            className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
          >
            <Share2 className="w-4 h-4" />
            Chia sẻ kết quả
          </Button>
        </div>

        {/* Info Box */}
        <Card className="glass-card shape-organic-1 mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Lưu ý:</strong> Kết quả này chỉ mang tính tham khảo và phản ánh tính cách của bạn tại thời điểm hiện tại.
              Tính cách có thể thay đổi theo thời gian và hoàn cảnh. Để có đánh giá chính xác hơn, bạn nên làm test với 60 câu hỏi đầy đủ.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
