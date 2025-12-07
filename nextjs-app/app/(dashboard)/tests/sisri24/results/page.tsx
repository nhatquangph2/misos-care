/**
 * SISRI-24 Results Page
 * Display Spiritual Intelligence results with 4 dimensions
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { useFadeIn, useStagger } from '@/hooks/useGSAP'
import { SISRI_24_DIMENSIONS } from '@/constants/tests/sisri-24-questions'
import type { SISRI24Result } from '@/services/test.service'
import { Home, Share2, Download, RefreshCw, Sparkles, Brain, Eye, Lightbulb } from 'lucide-react'

export default function SISRI24ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<SISRI24Result | null>(null)
  const [completedAt, setCompletedAt] = useState<string>('')

  const pageRef = useFadeIn(0.8)
  const cardsRef = useStagger(0.15)

  useEffect(() => {
    // Load results from localStorage
    const storedResult = localStorage.getItem('sisri24_result')
    const storedDate = localStorage.getItem('sisri24_completed_at')

    if (!storedResult) {
      router.push('/tests')
      return
    }

    setResult(JSON.parse(storedResult))
    if (storedDate) {
      const date = new Date(storedDate)
      setCompletedAt(date.toLocaleDateString('vi-VN'))
    }
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const getDimensionColor = (dimension: keyof typeof result.dimensionScores) => {
    const colors = {
      CET: 'from-purple-500 to-indigo-500',
      PMP: 'from-blue-500 to-cyan-500',
      TA: 'from-pink-500 to-rose-500',
      CSE: 'from-amber-500 to-orange-500',
    }
    return colors[dimension]
  }

  const getDimensionIcon = (dimension: keyof typeof result.dimensionScores) => {
    const icons = {
      CET: Brain,
      PMP: Lightbulb,
      TA: Sparkles,
      CSE: Eye,
    }
    const Icon = icons[dimension]
    return <Icon className="w-6 h-6" />
  }

  const getLevelColor = (level: string) => {
    if (level.includes('Rất cao')) return 'bg-green-500'
    if (level.includes('Cao')) return 'bg-blue-500'
    if (level.includes('Trung bình')) return 'bg-yellow-500'
    if (level.includes('Thấp')) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 py-12"
    >
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Trí tuệ Tâm linh của bạn
          </h1>

          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Điểm tổng: {result.totalScore}/96 ({result.totalPercentage}%)
          </p>

          <Badge className={`text-lg px-4 py-1 ${getLevelColor(result.overallLevel)}`}>
            {result.overallLevel}
          </Badge>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
            {result.overallDescription}
          </p>

          {completedAt && (
            <p className="text-sm text-muted-foreground mt-2">
              Hoàn thành vào {completedAt}
            </p>
          )}
        </div>

        {/* Overall Progress */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle>Tổng quan Trí tuệ Tâm linh</CardTitle>
            <CardDescription>Điểm tổng thể của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={result.totalPercentage} className="h-4" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0</span>
                <span className="font-semibold text-foreground">{result.totalScore} / 96</span>
                <span>96</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Four Dimensions */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-6 mb-8">
          {Object.entries(result.dimensionScores).map(([dimension, score]) => {
            const dim = dimension as keyof typeof result.dimensionScores
            const dimInfo = SISRI_24_DIMENSIONS[dim]
            const percentage = result.dimensionPercentages[dim]
            const level = result.dimensionLevels[dim]

            return (
              <Card key={dimension} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getDimensionColor(dim)} rounded-lg flex items-center justify-center text-white`}>
                      {getDimensionIcon(dim)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{dimInfo.nameVi}</CardTitle>
                      <CardDescription className="text-xs">{dimInfo.name}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Score and Level */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">
                          {score}
                          <span className="text-lg text-muted-foreground">
                            /{dim === 'CET' || dim === 'TA' ? '28' : '20'}
                          </span>
                        </p>
                        <Badge className={`mt-1 ${getLevelColor(level)}`}>{level}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{percentage}%</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <Progress value={percentage} className="h-3" />

                    {/* Description */}
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {dimInfo.description}
                      </p>
                      <Separator className="my-3" />
                      <p className="text-sm font-medium">
                        {percentage >= 70 ? dimInfo.highScore : dimInfo.lowScore}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed Interpretations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Chi tiết 4 Chiều kích Trí tuệ Tâm linh</CardTitle>
            <CardDescription>Hiểu rõ hơn về từng khía cạnh</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(SISRI_24_DIMENSIONS).map(([key, info]) => (
              <div key={key} className="space-y-3">
                <h3 className="font-semibold text-lg">{info.nameVi} ({info.name})</h3>
                <p className="text-muted-foreground">{info.description}</p>

                {/* Tinh thần R connection */}
                {'spiritR' in info && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                      🌟 Tinh thần R:
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">{info.spiritR}</p>
                  </div>
                )}

                {/* Long description */}
                {'longDescription' in info && (
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {info.longDescription}
                  </p>
                )}

                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Điểm thấp:</p>
                    <p className="text-sm text-red-600 dark:text-red-300">{info.lowScore}</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Điểm cao:</p>
                    <p className="text-sm text-green-600 dark:text-green-300">{info.highScore}</p>
                  </div>
                </div>

                {/* Gen Z note */}
                {'genZNote' in info && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-1">
                      💡 Ý nghĩa với Gen Z:
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300">{info.genZNote}</p>
                  </div>
                )}

                {/* Vietnam note for PMP */}
                {'vietnamNote' in info && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                      🇻🇳 Bối cảnh Việt Nam:
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-300">{info.vietnamNote}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2">
          <CardHeader>
            <CardTitle>Khuyến nghị Phát triển</CardTitle>
            <CardDescription>Cách nâng cao Trí tuệ Tâm linh</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium">Thực hành thiền định hàng ngày</p>
                  <p className="text-sm text-muted-foreground">Dành 10-20 phút mỗi ngày để tĩnh tâm và quan sát nội tâm</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium">Tìm kiếm ý nghĩa trong cuộc sống</p>
                  <p className="text-sm text-muted-foreground">Viết nhật ký, suy ngẫm về mục đích và giá trị cá nhân</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium">Kết nối với thiên nhiên</p>
                  <p className="text-sm text-muted-foreground">Dành thời gian ngoài trời, cảm nhận sự kết nối với vũ trụ</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">4</span>
                </div>
                <div>
                  <p className="font-medium">Đọc sách về triết học và tâm linh</p>
                  <p className="text-sm text-muted-foreground">Khám phá các tác phẩm về tư tưởng, đạo đức và ý nghĩa cuộc sống</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => router.push('/tests')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Home className="mr-2 h-5 w-5" />
            Về trang chủ
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/tests/sisri24')}>
            <RefreshCw className="mr-2 h-5 w-5" />
            Làm lại test
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.print()}>
            <Download className="mr-2 h-5 w-5" />
            Tải kết quả (PDF)
          </Button>
          <Button size="lg" variant="outline" onClick={() => alert('Tính năng chia sẻ đang được phát triển')}>
            <Share2 className="mr-2 h-5 w-5" />
            Chia sẻ
          </Button>
        </div>

        {/* Note */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground">
              <strong>Lưu ý:</strong> Kết quả SISRI-24 giúp bạn hiểu rõ hơn về trí tuệ tâm linh của mình.
              Đây không phải là đánh giá tín ngưỡng hay niềm tin tôn giáo, mà là khả năng sử dụng các nguồn lực tâm linh
              để giải quyết vấn đề và tìm kiếm ý nghĩa trong cuộc sống.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
