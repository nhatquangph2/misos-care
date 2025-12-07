/**
 * Big5 Results Page
 * Display personality trait scores with visualization
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useFadeIn, useStagger } from '@/hooks/useGSAP'
import { getBig5Interpretation, BIG5_TRAITS } from '@/constants/tests/big5-questions'
import type { Big5TraitScore } from '@/constants/tests/big5-questions'
import { Home, RefreshCw, Share2, Brain } from 'lucide-react'

export default function Big5ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<Big5TraitScore[] | null>(null)
  const [completedAt, setCompletedAt] = useState<string>('')

  const pageRef = useFadeIn(0.8)
  const cardsRef = useStagger(0.15)

  useEffect(() => {
    // Load results from localStorage
    const storedResult = localStorage.getItem('big5_result')
    const storedDate = localStorage.getItem('big5_completed_at')

    if (!storedResult) {
      router.push('/tests')
      return
    }

    setResults(JSON.parse(storedResult))
    if (storedDate) {
      const date = new Date(storedDate)
      setCompletedAt(date.toLocaleDateString('vi-VN'))
    }
  }, [router])

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12"
    >
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Kết quả Big Five
          </h1>

          <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            OCEAN Personality Assessment
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Phân tích 5 đặc điểm tính cách chính của bạn
          </p>

          {completedAt && (
            <p className="text-sm text-muted-foreground mt-4">
              Hoàn thành ngày {completedAt}
            </p>
          )}
        </div>

        {/* Trait Scores */}
        <Card className="mb-8 shadow-xl border-2">
          <CardHeader>
            <CardTitle>Điểm số các đặc điểm</CardTitle>
            <CardDescription>Mức độ của bạn trên mỗi đặc điểm tính cách</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {results.map((trait) => {
              const color = trait.score >= 50 ? 'from-purple-500 to-purple-600' : 'from-gray-400 to-gray-500'

              return (
                <div key={trait.trait}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{trait.traitName}</span>
                    <span className="font-bold">{trait.score}%</span>
                  </div>
                  <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full bg-gradient-to-r ${color}`}
                      style={{ width: `${trait.score}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                      {trait.rawScore} / {trait.maxScore}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {getBig5Interpretation(trait.trait, trait.score)}
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Trait Descriptions */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-6 mb-8">
          {results.map((trait) => (
            <Card key={trait.trait} className="shadow-lg border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{BIG5_TRAITS[trait.trait]}</CardTitle>
                  <Badge variant={trait.score >= 50 ? "default" : "secondary"} className="text-lg px-3 py-1">
                    {trait.score}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {getBig5Interpretation(trait.trait, trait.score)}
                </p>
              </CardContent>
            </Card>
          ))}
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
            onClick={() => router.push('/tests/big5')}
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
        <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Lưu ý:</strong> Kết quả này chỉ mang tính tham khảo và phản ánh tính cách của bạn tại thời điểm hiện tại.
              Big Five là một trong những mô hình tính cách được nghiên cứu kỹ lưỡng nhất trong tâm lý học.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
