/**
 * Landing Page - Ocean Immersive Design
 * Main entry point for Miso's Care application
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white/60">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo & Mascot */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <motion.div
              className="text-8xl"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🐬
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold gradient-text">
              Đại dương của Miso
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium drop-shadow-lg">
            Khám phá bản thân, chăm sóc sức khỏe tinh thần
          </p>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Ứng dụng trắc nghiệm tính cách và sàng lọc sức khỏe tinh thần được thiết kế bởi các chuyên gia tâm lý,
            giúp bạn hiểu rõ hơn về bản thân và tìm ra hướng phát triển phù hợp.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/tests">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 border-0">
                <Brain className="mr-2 h-5 w-5" />
                Bắt đầu hành trình
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 glass-card border-white/20 text-white hover:bg-white/10">
                Đăng nhập / Đăng ký
              </Button>
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full shadow-lg border border-white/20">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-white/90">
              Hoàn toàn miễn phí • Bảo mật tuyệt đối • Không cần đăng nhập
            </span>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 drop-shadow-lg">
            Tại sao chọn Đại dương của Miso?
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Chúng tôi cung cấp các bài test chuẩn quốc tế với kết quả chính xác và chi tiết
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Brain,
              color: 'from-blue-500 to-cyan-500',
              title: 'Trắc nghiệm tính cách',
              description: 'MBTI, Big Five, SISRI-24 và nhiều bài test khác giúp bạn hiểu rõ bản thân',
              features: [
                '16 loại tính cách MBTI',
                'Big Five OCEAN model',
                'Trí tuệ tâm linh SISRI-24'
              ]
            },
            {
              icon: Heart,
              color: 'from-pink-500 to-purple-500',
              title: 'Sàng lọc sức khỏe tinh thần',
              description: 'Đánh giá mức độ trầm cảm, lo âu, stress một cách khoa học',
              features: [
                'PHQ-9 cho trầm cảm',
                'GAD-7 cho lo âu',
                'DASS-21 và PSS cho stress'
              ]
            },
            {
              icon: TrendingUp,
              color: 'from-purple-500 to-indigo-500',
              title: 'Theo dõi tiến trình',
              description: 'Lưu kết quả, xem xu hướng và nhận đề xuất cá nhân hóa',
              features: [
                'Lịch sử kết quả test',
                'Biểu đồ phân tích xu hướng',
                'Đề xuất và mục tiêu cá nhân'
              ]
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card shape-organic-1 border border-white/10 hover:shadow-xl hover:shadow-purple-500/20 transition-all h-full">
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} shape-organic-2 flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-white/70">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-white/80">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center"
        >
          {[
            { value: '7+', label: 'Bài test khoa học', color: 'text-blue-400' },
            { value: '100%', label: 'Miễn phí', color: 'text-purple-400' },
            { value: '5-15', label: 'Phút mỗi test', color: 'text-pink-400' },
            { value: '🔒', label: 'Bảo mật tuyệt đối', color: '' }
          ].map((stat, index) => (
            <div key={index}>
              <div className={`text-4xl font-bold ${stat.color || 'text-cyan-400'} mb-2 drop-shadow-lg`}>
                {stat.value}
              </div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-3xl mx-auto glass-card shape-organic-2 border border-white/20 relative overflow-hidden">
            <div className="blob-pink absolute -top-10 -right-10 opacity-40" />

            <CardHeader className="text-center relative z-10">
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="h-12 w-12 text-yellow-400" />
                </motion.div>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-heading text-white mb-4 drop-shadow-lg">
                Sẵn sàng khám phá bản thân?
              </CardTitle>
              <CardDescription className="text-lg text-white/80">
                Bắt đầu hành trình tự khám phá ngay hôm nay. Không cần đăng ký, hoàn toàn miễn phí!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="/tests">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg">
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
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-white/60 border-t border-white/10 relative z-10">
        <p className="mb-2">
          <span className="font-semibold text-white/90">Đại dương của Miso</span> - Chăm sóc sức khỏe tinh thần của bạn
        </p>
        <p className="text-sm">
          Các bài test chỉ mang tính tham khảo. Nếu có vấn đề nghiêm trọng, hãy tham khảo ý kiến chuyên gia.
        </p>
      </footer>
    </div>
  )
}
