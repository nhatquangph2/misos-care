/**
 * BFI-2 Results Page - Comprehensive Personality Analysis
 * Features:
 * - Radar Chart for 5 Domains
 * - 15 Facets Breakdown
 * - Career Counseling
 * - Mental Health Insights
 * - Learning Style Recommendations
 * - Relationship Insights
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Brain,
  Home,
  RefreshCw,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Briefcase,
  Heart,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
} from 'lucide-react'

import type { BFI2Score } from '@/constants/tests/bfi2-questions'
import { BFI2_DOMAINS, BFI2_FACETS } from '@/constants/tests/bfi2-questions'
import { interpretTScore, getLevelColor } from '@/services/bfi2-scoring.service'
import {
  getCareerCounseling,
  getMentalHealthInsights,
  getLearningStyleRecommendations,
  getRelationshipInsights,
} from '@/services/bfi2-counseling.service'
import { saveBFI2Results } from '@/services/personality-profile.service'
import { exportBFI2ToPDF, generateShareableLink, copyToClipboard } from '@/services/pdf-export.service'
import { createClient } from '@/lib/supabase/client'
import { Download, Link as LinkIcon } from 'lucide-react'

interface QualityReport {
  isValid: boolean
  warnings: string[]
  completionTime?: number
  straightlining?: number
}

export default function BFI2ResultsPage() {
  const router = useRouter()
  const [score, setScore] = useState<BFI2Score | null>(null)
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null)
  const [completedAt, setCompletedAt] = useState<string>('')
  const [completedAtRaw, setCompletedAtRaw] = useState<Date | null>(null)
  const [completionTime, setCompletionTime] = useState<number>(0)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    // Load results from localStorage
    const storedScore = localStorage.getItem('bfi2_result')
    const storedQuality = localStorage.getItem('bfi2_quality_report')
    const storedDate = localStorage.getItem('bfi2_completed_at')
    const storedTime = localStorage.getItem('bfi2_completion_time')

    if (!storedScore) {
      router.push('/tests/big5')
      return
    }

    const parsedScore = JSON.parse(storedScore)
    setScore(parsedScore)

    if (storedQuality) setQualityReport(JSON.parse(storedQuality))

    const completedDate = storedDate ? new Date(storedDate) : new Date()
    setCompletedAtRaw(completedDate)
    if (storedDate) {
      setCompletedAt(completedDate.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }))
    }

    const completionTimeNum = storedTime ? parseInt(storedTime) : 0
    if (storedTime) setCompletionTime(completionTimeNum)

    // Auto-save results to database
    const saveResults = async () => {
      try {
        setSaveStatus('saving')
        await saveBFI2Results({
          score: parsedScore,
          completedAt: completedDate,
          completionTime: completionTimeNum,
        })
        setSaveStatus('saved')
      } catch (error) {
        console.error('Failed to save results:', error)
        setSaveStatus('error')
        setSaveError(error instanceof Error ? error.message : 'Không thể lưu kết quả')
      }
    }

    // Only auto-save if user is authenticated
    saveResults()

    // Get user name for PDF
    const getUserName = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single()
        if (userData && 'name' in userData) {
          setUserName((userData as any).name)
        }
      }
    }

    getUserName()
  }, [router])

  const handleExportPDF = async () => {
    if (!score) return

    setIsExporting(true)
    try {
      await exportBFI2ToPDF({
        score,
        userName: userName || undefined,
        completedAt: completedAtRaw || new Date(),
      })
    } catch (error) {
      console.error('Export PDF error:', error)
      alert('Không thể xuất PDF. Vui lòng thử lại sau.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    if (!score) return

    const shareLink = generateShareableLink(score)
    const copied = await copyToClipboard(shareLink)

    if (copied) {
      alert('Đã sao chép link chia sẻ! Bạn có thể gửi link này cho bạn bè.')
    } else {
      alert('Không thể sao chép link. Vui lòng thử lại.')
    }
  }

  if (!score) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải kết quả...</p>
        </div>
      </div>
    )
  }

  // Generate insights
  const careerRecommendations = getCareerCounseling(score)
  const mentalHealthInsights = getMentalHealthInsights(score)
  const learningStyle = getLearningStyleRecommendations(score)
  const relationshipInsights = getRelationshipInsights(score)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Brain className="w-14 h-14 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Phân Tích Nhân Cách BFI-2
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Big Five Inventory-2: Đánh giá toàn diện 5 đặc điểm tính cách và 15 khía cạnh
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            {completedAt && (
              <Badge variant="outline" className="text-sm px-4 py-2">
                📅 {completedAt}
              </Badge>
            )}
            {completionTime > 0 && (
              <Badge variant="outline" className="text-sm px-4 py-2">
                ⏱️ {Math.floor(completionTime / 60)} phút {completionTime % 60} giây
              </Badge>
            )}
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

        {/* Save Error Alert */}
        {saveStatus === 'error' && saveError && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Không thể lưu kết quả</AlertTitle>
            <AlertDescription>
              <p>{saveError}</p>
              <p className="mt-2 text-sm">
                Kết quả vẫn được lưu tạm thời trên thiết bị của bạn. Bạn có thể thử lại sau.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Quality Warning */}
        {qualityReport && !qualityReport.isValid && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Cảnh báo chất lượng dữ liệu</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {qualityReport.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm">
                Kết quả có thể không chính xác. Hãy cân nhắc làm lại test một cách cẩn thận hơn.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* HƯỚNG DẪN ĐỌC KẾT QUẢ */}
        <Card className="mb-8 shadow-xl border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="text-xl flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Hướng Dẫn Đọc Kết Quả
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="font-bold text-primary text-lg">1.</span>
                <div>
                  <h4 className="font-semibold mb-1">5 Đặc điểm tính cách chính (Big Five)</h4>
                  <p className="text-muted-foreground">
                    <strong>Hướng Ngoại (E)</strong> - Mức độ năng động, giao tiếp xã hội<br />
                    <strong>Dễ Chịu (A)</strong> - Mức độ hòa đồng, hợp tác với người khác<br />
                    <strong>Tận Tâm (C)</strong> - Mức độ có kế hoạch, kỷ luật, trách nhiệm<br />
                    <strong className="text-orange-600">Bất Ổn Cảm Xúc (N)</strong> - Mức độ lo âu, căng thẳng (càng THẤP càng TỐT)<br />
                    <strong>Cởi Mở (O)</strong> - Mức độ sáng tạo, tò mò, cởi mở với điều mới
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-bold text-primary text-lg">2.</span>
                <div>
                  <h4 className="font-semibold mb-1">T-Score là gì?</h4>
                  <p className="text-muted-foreground">
                    T-Score là điểm chuẩn hóa so với dân số. <strong>Trung bình = 50</strong>.
                    Điểm <strong>cao hơn 55</strong> = cao hơn đa số người,
                    điểm <strong>thấp hơn 45</strong> = thấp hơn đa số người.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-bold text-primary text-lg">3.</span>
                <div>
                  <h4 className="font-semibold mb-1">Lưu ý quan trọng về Bất Ổn Cảm Xúc (N)</h4>
                  <p className="text-muted-foreground text-orange-700 dark:text-orange-400">
                    ⚠️ <strong>Khác với 4 đặc điểm kia:</strong> Điểm N <strong>CÀNG CAO CÀNG KHÓ KHĂN</strong>.
                    Nếu bạn có N cao, đừng lo lắng - điều này rất phổ biến và có nhiều cách để cải thiện
                    (xem phần "Sức Khỏe Tinh Thần" bên dưới).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-bold text-primary text-lg">4.</span>
                <div>
                  <h4 className="font-semibold mb-1">Kết quả này cho bạn biết gì?</h4>
                  <p className="text-muted-foreground">
                    • <strong>Nghề nghiệp phù hợp</strong> dựa trên điểm mạnh tính cách<br />
                    • <strong>Điểm cần lưu ý</strong> về sức khỏe tinh thần và cảm xúc<br />
                    • <strong>Cách học tập hiệu quả</strong> phù hợp với bạn<br />
                    • <strong>Phong cách quan hệ</strong> trong giao tiếp và làm việc nhóm
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5 DOMAINS OVERVIEW */}
        <Card className="mb-8 shadow-xl border-2">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              5 Đặc Điểm Tính Cách Chính (Big Five Domains)
            </CardTitle>
            <CardDescription>
              Điểm T-score: Trung bình = 50, Cao &gt; 55, Thấp &lt; 45
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              {BFI2_DOMAINS.map((domain) => {
                const tScore = score.tScores.domains[domain.code]
                const rawScore = score.domains[domain.code]
                const percentile = score.percentiles.domains[domain.code]
                const interpretation = interpretTScore(tScore, domain.code) // Truyền domain để có giải thích đúng
                const colorClasses = getLevelColor(interpretation.level, domain.code) // Truyền domain code để xử lý màu N đúng

                return (
                  <div key={domain.code} className="space-y-3 p-4 rounded-lg border bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold">{domain.name}</h3>
                          <span className="text-sm text-muted-foreground">({domain.nameEn})</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{domain.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={colorClasses + " text-sm px-3 py-1"}>
                            {interpretation.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            • Phân vị thứ {percentile} (cao hơn {percentile}% dân số)
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-3xl font-bold text-primary">{Math.round(tScore)}</div>
                        <div className="text-xs text-muted-foreground">T-Score</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {rawScore.toFixed(2)}/5.0
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border">
                      <div
                        className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                          domain.code === 'N'
                            ? 'bg-gradient-to-r from-red-400 to-orange-400' // N: đỏ = cao = xấu
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500' // Các domain khác: tím = cao = tốt
                        }`}
                        style={{ width: `${(rawScore / 5) * 100}%` }}
                      />
                      <div className="absolute inset-0 flex items-center px-4">
                        <span className="text-sm font-semibold text-white mix-blend-difference">
                          {rawScore.toFixed(2)} / 5.00
                        </span>
                      </div>
                    </div>

                    <div className="text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded border-l-4 border-primary">
                      <strong>Ý nghĩa:</strong> {interpretation.description}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 15 FACETS BREAKDOWN */}
        <Card className="mb-8 shadow-xl border-2">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="w-6 h-6" />
              15 Khía Cạnh Chi Tiết (Facets)
            </CardTitle>
            <CardDescription>
              Phân tích sâu hơn về từng đặc điểm tính cách
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {BFI2_DOMAINS.map((domain) => (
                <div key={domain.code} className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-2">{domain.name}</h3>
                  {BFI2_FACETS.filter((f) => f.domain === domain.code).map((facet) => {
                    const facetScore = score.facets[facet.code]
                    const tScore = score.tScores.facets[facet.code]
                    const interpretation = interpretTScore(tScore)
                    const colorClasses = getLevelColor(interpretation.level)

                    return (
                      <div key={facet.code} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{facet.name}</span>
                          <Badge variant="outline" className={`text-xs ${colorClasses}`}>
                            {facetScore.toFixed(1)}
                          </Badge>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all"
                            style={{ width: `${(facetScore / 5) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{facet.description}</p>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CAREER COUNSELING */}
        <Card className="mb-8 shadow-xl border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Tư Vấn Hướng Nghiệp
            </CardTitle>
            <CardDescription>
              Các ngành nghề phù hợp dựa trên profile tính cách của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {careerRecommendations.map((rec, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-3 bg-white dark:bg-gray-800">
                <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  {rec.category}
                </h3>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Điểm Mạnh
                    </h4>
                    <ul className="space-y-1">
                      {rec.strengths.map((strength, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <Lightbulb className="w-4 h-4" />
                      Cần Phát Triển
                    </h4>
                    <ul className="space-y-1">
                      {rec.developmentAreas.map((area, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <Target className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Nghề nghiệp gợi ý:</h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.careers.map((career, i) => (
                      <Badge key={i} variant="secondary">
                        {career}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* MENTAL HEALTH INSIGHTS */}
        <Card className="mb-8 shadow-xl border-2">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Heart className="w-6 h-6" />
              Sức Khỏe Tinh Thần
            </CardTitle>
            <CardDescription>
              Nhận diện risk factors và điểm mạnh trong quản lý cảm xúc
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {mentalHealthInsights.map((insight, idx) => {
              const bgColor = insight.type === 'risk'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200'
                : insight.type === 'strength'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200'

              return (
                <Alert key={idx} className={bgColor}>
                  <div className="space-y-3">
                    <AlertTitle className="text-lg">{insight.title}</AlertTitle>
                    <AlertDescription>{insight.description}</AlertDescription>

                    {insight.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Khuyến nghị:</h4>
                        <ul className="space-y-1">
                          {insight.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-xs mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Alert>
              )
            })}
          </CardContent>
        </Card>

        {/* LEARNING STYLE */}
        <Card className="mb-8 shadow-xl border-2">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Phong Cách Học Tập
            </CardTitle>
            <CardDescription>
              Phương pháp học tập hiệu quả dựa trên tính cách và nghiên cứu khoa học
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Phong cách tổng quan */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border-2 border-amber-200">
              <h3 className="font-bold text-xl mb-2 text-amber-900 dark:text-amber-100">{learningStyle.overallStyle}</h3>
              <p className="text-sm mb-2">{learningStyle.description}</p>
              <p className="text-xs text-muted-foreground italic">📚 {learningStyle.researchBasis}</p>
            </div>

            {/* 3 Chiều phong cách */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-semibold text-sm mb-1">📱 Chiều xã hội</h4>
                <p className="text-sm">{learningStyle.dimensions.social}</p>
              </div>
              <div className="border rounded-lg p-3 bg-purple-50 dark:bg-purple-900/20">
                <h4 className="font-semibold text-sm mb-1">🧠 Chiều nhận thức</h4>
                <p className="text-sm">{learningStyle.dimensions.cognitive}</p>
              </div>
              <div className="border rounded-lg p-3 bg-green-50 dark:bg-green-900/20">
                <h4 className="font-semibold text-sm mb-1">📅 Chiều tổ chức</h4>
                <p className="text-sm">{learningStyle.dimensions.structure}</p>
              </div>
            </div>

            {/* Điểm mạnh và thách thức */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Điểm mạnh trong học tập
                </h4>
                <ul className="space-y-1">
                  {learningStyle.strengths.map((strength, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {learningStyle.challenges.length > 0 && (
                <div className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Thách thức cần lưu ý
                  </h4>
                  <ul className="space-y-1">
                    {learningStyle.challenges.map((challenge, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-orange-600">!</span>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Phương pháp học tốt nhất và nên tránh */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  Phương pháp học hiệu quả
                </h4>
                <ul className="space-y-2">
                  {learningStyle.bestMethods.map((method, i) => (
                    <li key={i} className="text-sm">
                      {method}
                    </li>
                  ))}
                </ul>
              </div>

              {learningStyle.avoidMethods.length > 0 && (
                <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Phương pháp nên tránh
                  </h4>
                  <ul className="space-y-2">
                    {learningStyle.avoidMethods.map((method, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-red-600">✗</span>
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Môi trường học tập */}
            <div className="border rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Home className="w-5 h-5 text-indigo-600" />
                Môi trường học tập lý tưởng
              </h4>
              <ul className="space-y-1">
                {learningStyle.studyEnvironment.map((env, i) => (
                  <li key={i} className="text-sm">
                    {env}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quản lý thời gian và chuẩn bị thi */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Quản lý thời gian học
                </h4>
                <ul className="space-y-2">
                  {learningStyle.timeManagement.map((tip, i) => (
                    <li key={i} className="text-sm">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-pink-50 dark:bg-pink-900/20">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-pink-600" />
                  Chuẩn bị thi cử
                </h4>
                <ul className="space-y-2">
                  {learningStyle.examPreparation.map((tip, i) => (
                    <li key={i} className="text-sm">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RELATIONSHIP INSIGHTS */}
        <Card className="mb-8 shadow-xl border-2">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="w-6 h-6" />
              Quan Hệ & Giao Tiếp
            </CardTitle>
            <CardDescription>
              Phong cách tương tác và giải quyết xung đột
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Phong Cách Giao Tiếp</h3>
                <p className="text-sm px-4 py-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                  {relationshipInsights.communicationStyle}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Giải Quyết Xung Đột</h3>
                <p className="text-sm px-4 py-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  {relationshipInsights.conflictStyle}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Điểm Mạnh</h4>
                <ul className="space-y-2">
                  {relationshipInsights.strengths.map((strength, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Thách Thức</h4>
                <ul className="space-y-2">
                  {relationshipInsights.challenges.map((challenge, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {relationshipInsights.tips.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Lời Khuyên</h4>
                <ul className="space-y-2">
                  {relationshipInsights.tips.map((tip, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            onClick={() => router.push('/dashboard')}
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
            onClick={handleExportPDF}
            size="lg"
            disabled={isExporting}
            className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Đang xuất...' : 'Tải PDF'}
          </Button>

          <Button
            onClick={handleShare}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            Sao chép link chia sẻ
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Lưu ý quan trọng:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Kết quả này dựa trên BFI-2 (Big Five Inventory-2), một công cụ đánh giá tính cách được nghiên cứu và validate rộng rãi.
                </li>
                <li>
                  Tính cách là phổ liên tục (spectrum), không phải nhị phân. Không có "tốt" hay "xấu", chỉ có "khác biệt".
                </li>
                <li>
                  Kết quả phản ánh bạn tại thời điểm hiện tại và có thể thay đổi theo thời gian.
                </li>
                <li>
                  Các khuyến nghị về sức khỏe tinh thần chỉ mang tính tham khảo. Nếu có vấn đề nghiêm trọng, hãy tham khảo ý kiến chuyên gia.
                </li>
                <li>
                  Điểm chuẩn (norms) hiện tại dựa trên dữ liệu quốc tế và sẽ được cập nhật với dữ liệu Việt Nam.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
