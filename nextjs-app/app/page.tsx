'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Link as ScrollLink } from 'react-scroll'
import {
  Brain,
  Shield,
  Sparkles,
  ArrowRight,
  PlayCircle,
  Users,
  MessageSquare,
  HelpCircle,
  ChevronRight
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// New Components
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Testimonials } from '@/components/landing/Testimonials'
import { FAQ } from '@/components/landing/FAQ'
import { ComparisonTable } from '@/components/landing/ComparisonTable'
import { VideoDemo } from '@/components/landing/VideoDemo'
import { WelcomeModal } from '@/components/onboarding/WelcomeModal'
import { ProductTour } from '@/components/onboarding/ProductTour'
import { landingPageTour } from '@/lib/tours/landing-tour'
import { FloatingMiso } from '@/components/MisoCharacter'

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [startTour, setStartTour] = useState(false)

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

  const startProductTour = () => {
    setStartTour(true);
    // Reset localStorage to force tour to show again if it was dismissed
    localStorage.removeItem('tour_landing_completed');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <FloatingMiso emotion="happy" size="lg" />
          <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden bg-background">
        <WelcomeModal onStartTour={() => setStartTour(true)} />
        <ProductTour
          steps={landingPageTour.getConfig().steps as any}
          tourKey="landing"
          startTrigger={startTour}
          onComplete={() => setStartTour(false)}
        />
        {/* Navigation Header (Simple) */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐬</span>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">MisosCare</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <ScrollLink to="how-it-works" smooth={true} duration={500} className="hover:text-primary transition-colors cursor-pointer">Cách hoạt động</ScrollLink>
              <button onClick={startProductTour} className="hover:text-primary transition-colors cursor-pointer text-left font-medium">Hướng dẫn</button>
              <Link href="/about" className="hover:text-primary transition-colors">Về chúng tôi</Link>
              <Link href="/help" className="hover:text-primary transition-colors">Trợ giúp</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Đăng nhập</Button>
              </Link>
              <Link href="/tests">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Làm test ngay</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
          {/* Background blobs */}
          <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-3xl opacity-50 dark:bg-blue-900/20" />
          <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-100/50 blur-3xl opacity-50 dark:bg-indigo-900/20" />

          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-4 py-1.5 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
                <Sparkles className="h-4 w-4" />
                <span>Nền tảng AI phân tích tâm lý MISO V3 đã sẵn sàng</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-200">
                Thấu hiểu chính mình <br className="hidden md:block" />
                Cải thiện <span className="text-blue-600">tinh thần</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Sử dụng AI và các bài trắc nghiệm khoa học chuẩn quốc tế để khám phá bản thân,
                theo dõi sức khỏe tinh thần và nhận lộ trình phát triển cá nhân hóa.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/tests">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 group">
                    <Brain className="mr-2 h-5 w-5" />
                    Bắt đầu hành trình
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <ScrollLink to="video-demo" smooth={true} duration={500}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full glass-card hover:bg-muted/50">
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Xem demo
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Xem video giới thiệu 2 phút</p>
                    </TooltipContent>
                  </Tooltip>
                </ScrollLink>
              </div>

              <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Bảo mật tuyệt đối</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">Cộng đồng 10k+</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-semibold">Mentor hỗ trợ 1:1</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <div id="how-it-works">
          <HowItWorks />
        </div>

        {/* Comparison Table */}
        <ComparisonTable />

        {/* Video Demo */}
        <div id="video-demo">
          <VideoDemo />
        </div>

        {/* Testimonials */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />

        {/* Final CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="container px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 md:p-20 text-white shadow-2xl relative overflow-hidden"
            >
              {/* Decorative circle */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />

              <h2 className="text-4xl md:text-5xl font-bold mb-6">Sẵn sàng để thay đổi bản thân?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Bắt đầu làm bài test MBTI hoặc DASS-21 ngay hôm nay để có cái nhìn sâu sắc về tâm trí mình.
                Hoàn toàn miễn phí và bảo mật.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tests">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 h-14 rounded-full font-bold text-lg">
                    Làm bài test đầu tiên
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 h-14 rounded-full font-bold text-lg">
                    Tạo tài khoản miễn phí
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-50 dark:bg-slate-900 border-t py-12 md:py-20">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
              <div className="col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">🐬</span>
                  <span className="font-bold text-2xl">MisosCare</span>
                </div>
                <p className="text-muted-foreground mb-6 max-w-xs">
                  Nền tảng chăm sóc tinh thần toàn diện, thấu hiểu con người Việt thông qua khoa học dữ liệu và tâm lý học.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4">Sản phẩm</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li><button onClick={startProductTour} className="hover:text-primary transition-colors text-left w-full text-muted-foreground font-normal">Xem Hướng Dẫn (Tour)</button></li>
                  <li><Link href="/tests" className="hover:text-primary">Bài trắc nghiệm</Link></li>
                  <li><Link href="/ai-consultant" className="hover:text-primary">Tư vấn AI</Link></li>
                  <li><Link href="/dashboard" className="hover:text-primary">Hồ sơ cá nhân</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Công ty</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li><Link href="/about" className="hover:text-primary">Về chúng tôi</Link></li>
                  <li><Link href="/help" className="hover:text-primary">Trợ giúp</Link></li>
                  <li><Link href="/privacy" className="hover:text-primary">Bảo mật</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Kết nối</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li><Link href="#" className="hover:text-primary">Facebook</Link></li>
                  <li><Link href="#" className="hover:text-primary">TikTok</Link></li>
                  <li><Link href="#" className="hover:text-primary">Email</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
              <p>© 2025 MisosCare. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/privacy" className="hover:text-primary">Điều khoản</Link>
                <Link href="/privacy" className="hover:text-primary">Quyền riêng tư</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}
