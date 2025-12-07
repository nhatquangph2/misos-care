'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useFadeIn, useStagger } from '@/hooks/useGSAP'
import { createClient } from '@/lib/supabase/client'
import { useMascotStore } from '@/stores/mascotStore'
import { ArrowRight, TrendingUp, Target, Brain, Heart, Sparkles } from 'lucide-react'

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
}

export default function DashboardPage() {
  const fadeRef = useFadeIn()
  const staggerRef = useStagger(0.1)
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats>({
    testsCompleted: 0,
    currentStreak: 0,
    activeGoals: 0,
  })
  const [loading, setLoading] = useState(true)

  const { userStats, currentMood, setMood, addMessage } = useMascotStore()

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      // Get user profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setUser(userData)

      // Get personality profile
      const { data: personality } = await supabase
        .from('personality_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      // Get mental health records count
      const { data: mentalHealthRecords, count } = await supabase
        .from('mental_health_records')
        .select('*', { count: 'exact' })
        .eq('user_id', authUser.id)
        .order('completed_at', { ascending: false })

      // Get latest mental health record
      const latestRecord = mentalHealthRecords?.[0]

      // Get active goals count
      const { count: goalsCount } = await supabase
        .from('user_goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUser.id)
        .eq('status', 'active')

      setStats({
        testsCompleted: count || 0,
        personalityType: (personality as any)?.mbti_type,
        latestMentalHealthScore: latestRecord ? {
          type: (latestRecord as any).test_type,
          severity: (latestRecord as any).severity_level,
          date: new Date((latestRecord as any).completed_at).toLocaleDateString('vi-VN'),
        } : undefined,
        currentStreak: userStats.currentStreak,
        activeGoals: goalsCount || 0,
      })

      // Set mascot mood based on latest score
      if (latestRecord) {
        const severity = (latestRecord as any).severity_level
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
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" ref={fadeRef}>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Xin chào, {user?.name || 'bạn'}! 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Chào mừng trở lại với Miso's Care. Hãy cùng chăm sóc sức khỏe tinh thần của bạn!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" ref={staggerRef}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Bài test đã làm
            </CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.testsCompleted}</div>
            <p className="text-xs text-gray-500 mt-1">Tổng số bài test</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Loại tính cách
            </CardTitle>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.personalityType || '—'}
            </div>
            <p className="text-xs text-gray-500 mt-1">MBTI Type</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Streak hiện tại
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.currentStreak}</div>
            <p className="text-xs text-gray-500 mt-1">Ngày liên tiếp</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mục tiêu
            </CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.activeGoals}</div>
            <p className="text-xs text-gray-500 mt-1">Đang thực hiện</p>
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
            <div className="flex items-center gap-4">
              <div>
                <Badge variant="outline" className="text-sm">
                  {stats.latestMentalHealthScore.type}
                </Badge>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <span className="text-sm text-gray-600">Mức độ: </span>
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
              <Separator orientation="vertical" className="h-6" />
              <div className="text-sm text-gray-600">
                {stats.latestMentalHealthScore.date}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hành động nhanh</h2>
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
        </div>
      </div>

      {/* Recommendations */}
      {stats.testsCompleted === 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
          <CardHeader>
            <CardTitle className="text-xl">Bắt đầu hành trình của bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700">
              Chúng tôi khuyến nghị bạn bắt đầu với:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">1.</span>
                <div>
                  <strong>MBTI Test</strong> - Khám phá loại tính cách của bạn
                  <Link href="/tests/mbti" className="ml-2 text-blue-600 hover:underline">
                    Làm ngay →
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">2.</span>
                <div>
                  <strong>PHQ-9</strong> - Đánh giá mức độ trầm cảm
                  <Link href="/tests/phq9" className="ml-2 text-blue-600 hover:underline">
                    Làm ngay →
                  </Link>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">3.</span>
                <div>
                  <strong>GAD-7</strong> - Đánh giá mức độ lo âu
                  <Link href="/tests/gad7" className="ml-2 text-blue-600 hover:underline">
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
