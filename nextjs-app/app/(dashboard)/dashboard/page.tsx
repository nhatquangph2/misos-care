'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useFadeIn, useStagger } from '@/hooks/useGSAP'
import { createClient } from '@/lib/supabase/client'
import { useMascotStore } from '@/stores/mascotStore'
import { ArrowRight, TrendingUp, Target, Brain, Heart, Sparkles, Fish, Star } from 'lucide-react'
import { ProductTour } from '@/components/onboarding/ProductTour'
import { dashboardTour } from '@/lib/tours/dashboard-tour'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { ScientificAnalysisCard } from '@/components/miso/ScientificAnalysisCard'
import type { MisoAnalysisResult } from '@/types/miso-v3'

interface DashboardStats {
  testsCompleted: number
  personalityType?: string
  latestMentalHealthScore?: {
    type: string
    severity: string
    date: string
  }
  currentStreak: number
  activeGoals: number
  topStrength?: string
}

// Define specific interfaces for DB responses to avoid 'any'
interface UserData {
  name: string
  [key: string]: unknown
}

interface PersonalityProfile {
  mbti_type: string | null
  [key: string]: unknown
}

interface MentalHealthRecord {
  test_type: string
  severity_level: string
  completed_at: string
  [key: string]: unknown
}

export default function DashboardPage() {
  const fadeRef = useFadeIn()
  const staggerRef = useStagger(0.1)
  const supabase = createClient()

  const [user, setUser] = useState<UserData | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    testsCompleted: 0,
    currentStreak: 0,
    activeGoals: 0,
  })
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [scientificAnalysis, setScientificAnalysis] = useState<MisoAnalysisResult['scientific_analysis'] | undefined>(undefined)
  const [hasPriorAnalysis, setHasPriorAnalysis] = useState(false)
  const [dashboardTourCompleted, setDashboardTourCompleted] = useLocalStorage('dashboard-tour-completed', false)
  const [startTour, setStartTour] = useState(false)

  const { userStats, setMood, addMessage } = useMascotStore()

  const loadDashboardData = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      // Get user profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()

      if (userData) {
        setUser(userData as UserData)
      }

      // Get personality profile
      const { data: personality } = await supabase
        .from('personality_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle()

      // Get mental health records count
      const { count } = await supabase
        .from('mental_health_records')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUser.id)

      // Get latest mental health record
      const { data: latestRecords } = await supabase
        .from('mental_health_records')
        .select('*')
        .eq('user_id', authUser.id)
        .order('completed_at', { ascending: false })
        .limit(1)

      const latestRecord = latestRecords?.[0] as MentalHealthRecord | undefined

      // Get active goals count
      const { count: goalsCount } = await supabase
        .from('user_goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUser.id)
        .eq('status', 'active')



      // We need to calculate top strength from via_results if they are raw answers, 
      // OR if we store the calculated result somewhere. 
      // Based on previous analysis, via_results stores questions/answers? 
      // Actually `via_results` table usually stores the final result in many systems, 
      // but here we used `analyzeVIAForDASS` which calculates from percentiles.
      // Let's check `via-scoring.service.ts` or similar to see how results are saved.
      // Assuming for now we can't easily calc full VIA on client without logic, 
      // but maybe we can fetch the `miso_analysis` result if saved?
      // Actually, Miso Analysis result is saved in `miso_analysis_history` or similar? 
      // Let's stick to a simpler approach: check if we have VIA answers, 
      // and if we do, maybe we can show a placeholder or fetch the latest Miso Analysis.

      // Let's try to fetch the latest Miso Analysis which contains the calculated VIA
      const { data: latestAnalysis } = await supabase
        .from('miso_analysis_logs')
        .select('analysis_result')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      let topVia = undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (latestAnalysis?.analysis_result) {
        setHasPriorAnalysis(true)
        const result = latestAnalysis.analysis_result as any

        // Extract VIA top strength
        if (result.via_analysis?.signature_strengths?.length > 0) {
          topVia = result.via_analysis.signature_strengths[0].name
        }

        // Extract Scientific Analysis
        if (result.scientific_analysis) {
          setScientificAnalysis(result.scientific_analysis)
        }
      }

      setStats({
        testsCompleted: count || 0,
        personalityType: (personality as unknown as PersonalityProfile)?.mbti_type || undefined,
        topStrength: topVia,
        latestMentalHealthScore: latestRecord ? {
          type: latestRecord.test_type,
          severity: latestRecord.severity_level,
          date: new Date(latestRecord.completed_at).toLocaleDateString('vi-VN'),
        } : undefined,
        currentStreak: userStats.currentStreak,
        activeGoals: goalsCount || 0,
      })

      // Set mascot mood based on latest score
      if (latestRecord) {
        const severity = latestRecord.severity_level
        if (severity === 'normal' || severity === 'mild') {
          setMood('happy')
        } else if (severity === 'severe' || severity === 'extremely_severe') {
          setMood('concerned')
        } else {
          setMood('encouraging')
        }
      } else {
        setMood('waving')
        addMessage('Chào mừng bạn đến với Miso\'s Care! Hãy bắt đầu với một bài test nhé 🌊', 'mascot', 'dashboard')
      }

    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, userStats.currentStreak, setMood, addMessage])

  const handleReanalyze = async () => {
    setAnalyzing(true)
    try {
      const response = await fetch('/api/miso/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Empty body triggers fetch from DB
      })

      const data = await response.json()

      if (data.success && data.analysis?.scientific_analysis) {
        setScientificAnalysis(data.analysis.scientific_analysis)
        // Optionally refresh full stats
        loadDashboardData()
      }
    } catch (error) {
      console.error('Re-analysis failed:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  useEffect(() => {
    // Trigger tour for first-time visitors after data loads
    if (!loading && !dashboardTourCompleted && stats.testsCompleted >= 0) {
      const timer = setTimeout(() => setStartTour(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [loading, dashboardTourCompleted, stats.testsCompleted])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" ref={fadeRef}>
      <ProductTour
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        steps={dashboardTour.getConfig().steps as any}
        tourKey="dashboard"
        startTrigger={startTour}
        onComplete={() => {
          setStartTour(false)
          setDashboardTourCompleted(true)
        }}
      />
      {/* Welcome Section */}
      <div id="dashboard-welcome" className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Xin chào, {user?.name || 'bạn'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Chào mừng trở lại với Miso&apos;s Care. Hãy cùng chăm sóc sức khỏe tinh thần của bạn!
        </p>
      </div>

      {/* Stats Cards */}
      <div id="stats-summary" className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8" ref={staggerRef}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Bài test đã làm
            </CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.testsCompleted}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tổng số bài test</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Loại tính cách
            </CardTitle>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {stats.personalityType || '—'}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">MBTI Type</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Điểm Mạnh Nhất
            </CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
              {stats.topStrength || '—'}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">VIA Signature Strength</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Streak hiện tại
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.currentStreak}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ngày liên tiếp</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Mục tiêu
            </CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.activeGoals}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Đang thực hiện</p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Mental Health Status */}
      {stats.latestMentalHealthScore && (
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Tình trạng sức khỏe tinh thần gần nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div>
                <Badge variant="outline" className="text-sm">
                  {stats.latestMentalHealthScore.type}
                </Badge>
              </div>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Mức độ: </span>
                <Badge
                  variant={
                    stats.latestMentalHealthScore.severity === 'normal' ? 'default' :
                      stats.latestMentalHealthScore.severity === 'mild' ? 'secondary' :
                        'destructive'
                  }
                >
                  {stats.latestMentalHealthScore.severity}
                </Badge>
              </div>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stats.latestMentalHealthScore.date}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deep Intelligence Analysis */}
      {scientificAnalysis ? (
        <div className="mb-8" id="scientific-analysis">
          <ScientificAnalysisCard analysis={scientificAnalysis} />
        </div>
      ) : ((stats.testsCompleted > 0 || hasPriorAnalysis) && !loading) ? (
        <div className="mb-8 p-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-full">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Nâng cấp Phân tích Chuyên sâu (V3)</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Hệ thống MISO vừa được nâng cấp với trí tuệ khoa học mới (ZPD & SDT).
                Cập nhật phân tích của bạn để xem các chỉ số mới này.
              </p>
            </div>
          </div>
          <Button onClick={handleReanalyze} disabled={analyzing} className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white">
            {analyzing ? 'Đang cập nhật...' : 'Cập nhật ngay'}
            {!analyzing && <TrendingUp className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      ) : null}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Hành động nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/tests">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-blue-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Làm bài test
                </CardTitle>
                <CardDescription>
                  Khám phá tính cách và sức khỏe tinh thần
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Bắt đầu ngay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-purple-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Xem hồ sơ
                </CardTitle>
                <CardDescription>
                  Theo dõi tiến trình và kết quả
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Xem chi tiết
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/goals">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-green-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Đặt mục tiêu
                </CardTitle>
                <CardDescription>
                  Tạo kế hoạch cải thiện bản thân
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Tạo mục tiêu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/gamification">
            <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-cyan-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Fish className="h-5 w-5 text-cyan-500" />
                  Vườn Cảm Xúc
                </CardTitle>
                <CardDescription>
                  Nuôi dưỡng sinh vật biển & làm nhiệm vụ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Khám phá ngay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recommendations */}
      {stats.testsCompleted === 0 && (
        <Card id="recommended-tests" className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-none">
          <CardHeader>
            <CardTitle className="text-xl">Bắt đầu hành trình của bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300">
              Chúng tôi khuyến nghị bạn bắt đầu với:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-blue-400 font-bold">1.</span>
                <div className="text-gray-800 dark:text-gray-200">
                  <strong>MBTI Test</strong> - Khám phá loại tính cách của bạn
                  <Link href="/tests/mbti" className="ml-2 text-blue-600 dark:text-blue-400 hover:underline">
                    Làm ngay →
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-blue-400 font-bold">2.</span>
                <div className="text-gray-800 dark:text-gray-200">
                  <strong>PHQ-9</strong> - Đánh giá mức độ trầm cảm
                  <Link href="/tests/phq9" className="ml-2 text-blue-600 dark:text-blue-400 hover:underline">
                    Làm ngay →
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-blue-400 font-bold">3.</span>
                <div className="text-gray-800 dark:text-gray-200">
                  <strong>GAD-7</strong> - Đánh giá mức độ lo âu
                  <Link href="/tests/gad7" className="ml-2 text-blue-600 dark:text-blue-400 hover:underline">
                    Làm ngay →
                  </Link>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
