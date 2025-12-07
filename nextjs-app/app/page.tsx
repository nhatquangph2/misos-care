/**
 * Landing Page
 * Main entry point for Miso's Care application
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Brain,
  Heart,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)

      // Auto redirect authenticated users to dashboard
      if (user) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo & Mascot */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <div className="text-8xl animate-bounce">🐬</div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Miso's Care
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
            Khám phá bản thân, chăm sóc sức khỏe tinh thần
          </p>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Ứng dụng trắc nghiệm tính cách và sàng lọc sức khỏe tinh thần được thiết kế bởi các chuyên gia tâm lý,
            giúp bạn hiểu rõ hơn về bản thân và tìm ra hướng phát triển phù hợp.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/tests">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Brain className="mr-2 h-5 w-5" />
                Bắt đầu làm test ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2">
                Đăng nhập / Đăng ký
              </Button>
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-gray-200">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Hoàn toàn miễn phí • Bảo mật tuyệt đối • Không cần đăng nhập
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 backdrop-blur-sm">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tại sao chọn Miso's Care?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp các bài test chuẩn quốc tế với kết quả chính xác và chi tiết
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Trắc nghiệm tính cách</CardTitle>
              <CardDescription>
                MBTI, Big Five, SISRI-24 và nhiều bài test khác giúp bạn hiểu rõ bản thân
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>16 loại tính cách MBTI</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Big Five OCEAN model</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Trí tuệ tâm linh SISRI-24</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>Sàng lọc sức khỏe tinh thần</CardTitle>
              <CardDescription>
                Đánh giá mức độ trầm cảm, lo âu, stress một cách khoa học
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>PHQ-9 cho trầm cảm</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>GAD-7 cho lo âu</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>DASS-21 và PSS cho stress</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Theo dõi tiến trình</CardTitle>
              <CardDescription>
                Lưu kết quả, xem xu hướng và nhận đề xuất cá nhân hóa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Lịch sử kết quả test</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Biểu đồ phân tích xu hướng</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Đề xuất và mục tiêu cá nhân</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">7+</div>
            <div className="text-gray-600">Bài test khoa học</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-gray-600">Miễn phí</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-pink-600 mb-2">5-15</div>
            <div className="text-gray-600">Phút mỗi test</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">🔒</div>
            <div className="text-gray-600">Bảo mật tuyệt đối</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 border-none text-white">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Sparkles className="h-12 w-12" />
            </div>
            <CardTitle className="text-3xl md:text-4xl text-white mb-4">
              Sẵn sàng khám phá bản thân?
            </CardTitle>
            <CardDescription className="text-lg text-white/90">
              Bắt đầu hành trình tự khám phá ngay hôm nay. Không cần đăng ký, hoàn toàn miễn phí!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tests">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8">
                <Brain className="mr-2 h-5 w-5" />
                Làm test ngay
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white/30">
                Đăng nhập để lưu kết quả
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 border-t border-gray-200">
        <p className="mb-2">
          <span className="font-semibold text-gray-800">Miso's Care</span> - Chăm sóc sức khỏe tinh thần của bạn
        </p>
        <p className="text-sm">
          Các bài test chỉ mang tính tham khảo. Nếu có vấn đề nghiêm trọng, hãy tham khảo ý kiến chuyên gia.
        </p>
      </footer>
    </div>
  )
}
