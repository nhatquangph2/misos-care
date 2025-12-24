/**
 * Test Selection Page
 * Main page for users to choose which psychological test to take
 */

'use client'

import { TestSelectionCard } from '@/components/features/tests/TestSelectionCard'
import { useRouter } from 'next/navigation'
import { Brain, Heart, Activity, Check, AlertTriangle } from 'lucide-react'
import { ProductTour } from '@/components/onboarding/ProductTour'
import { testPageTour } from '@/lib/tours/test-tour'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useState, useEffect } from 'react'

export default function TestsPage() {
  const router = useRouter()
  const [testTourCompleted, setTestTourCompleted] = useLocalStorage('test-tour-completed', false)
  const [startTour, setStartTour] = useState(false)

  useEffect(() => {
    if (!testTourCompleted) {
      const timer = setTimeout(() => setStartTour(true), 800)
      return () => clearTimeout(timer)
    }
  }, [testTourCompleted])

  const tests = [
    {
      id: 'via',
      title: 'VIA - Điểm Mạnh Tính Cách',
      description: 'Khám phá 5 điểm mạnh đặc trưng của bạn từ 24 giá trị tính cách. Bài test khoa học giúp bạn hiểu rõ bản thân và phát huy tiềm năng',
      questionCount: 48,
      estimatedMinutes: 10,
      testType: 'personality' as const,
      difficulty: 'easy' as const,
      recommended: true,
      route: '/tests/via',
      className: 'test-card-via',
    },
    {
      id: 'mbti',
      title: 'MBTI - 16 Personalities',
      description: 'Khám phá loại tính cách của bạn qua 16 nhóm tính cách khác nhau',
      questionCount: 60,
      estimatedMinutes: 12,
      testType: 'personality' as const,
      difficulty: 'medium' as const,
      recommended: true,
      route: '/tests/mbti',
      className: 'test-card-mbti',
    },
    {
      id: 'big5',
      title: 'Big Five - Hải Dương Tính Cách',
      description: 'Đánh giá 5 đặc điểm tính cách chính: Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Ổn định cảm xúc',
      questionCount: 60,
      estimatedMinutes: 10,
      testType: 'personality' as const,
      difficulty: 'medium' as const,
      recommended: true,
      route: '/tests/big5',
    },
    {
      id: 'dass21',
      title: 'Kiểm tra Sức khỏe Tinh thần Tổng quát',
      description: 'Đánh giá 3-trong-1: Trầm cảm, Lo âu và Căng thẳng. Bài test toàn diện để hiểu rõ tình trạng tinh thần của bạn',
      questionCount: 21,
      estimatedMinutes: 7,
      testType: 'mental-health' as const,
      difficulty: 'easy' as const,
      recommended: true,
      route: '/tests/dass21',
    },
    {
      id: 'sisri24',
      title: 'SISRI-24 - Trí tuệ Tâm linh',
      description: 'Đánh giá trí tuệ tâm linh qua 4 chiều kích: Tư duy hiện sinh, Ý nghĩa cá nhân, Nhận thức siêu việt, Mở rộng ý thức',
      questionCount: 24,
      estimatedMinutes: 6,
      testType: 'personality' as const,
      difficulty: 'medium' as const,
      recommended: false,
      route: '/tests/sisri24',
    },
  ]

  const handleStartTest = (route: string) => {
    router.push(route)
  }

  return (
    <div className="min-h-screen">
      <ProductTour
        steps={testPageTour.getConfig().steps as any}
        tourKey="test-page"
        startTrigger={startTour}
        onComplete={() => {
          setStartTour(false)
          setTestTourCompleted(true)
        }}
      />
      {/* Hero Section */}
      <div id="test-categories" className="container mx-auto px-6 py-12">
        <div className="text-center mb-12 relative">
          <div className="blob-purple absolute -top-10 left-1/2 -translate-x-1/2" />
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Khám phá <span className="gradient-text">bản thân</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Chọn bài test phù hợp để hiểu rõ hơn về tính cách và sức khỏe tinh thần của bạn
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
          <div className="glass-card shape-organic-1 p-6 text-center group cursor-pointer">
            <Brain className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            <div className="text-3xl font-heading font-bold mb-1 text-slate-800 dark:text-slate-100">5</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Bài test khả dụng</div>
          </div>
          <div className="glass-card shape-organic-2 p-6 text-center group cursor-pointer">
            <Heart className="w-8 h-8 mx-auto mb-3 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
            <div className="text-3xl font-heading font-bold mb-1 text-slate-800 dark:text-slate-100">0</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Bài test đã hoàn thành</div>
          </div>
          <div className="glass-card shape-organic-1 p-6 text-center group cursor-pointer">
            <Activity className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            <div className="text-3xl font-heading font-bold mb-1 text-slate-800 dark:text-slate-100">~45</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Phút để hoàn thành</div>
          </div>
        </div>

        {/* Test Cards Grid */}
        <div id="test-search" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tests.map((test) => (
            <TestSelectionCard
              key={test.id}
              title={test.title}
              description={test.description}
              questionCount={test.questionCount}
              estimatedMinutes={test.estimatedMinutes}
              testType={test.testType}
              difficulty={test.difficulty}
              recommended={test.recommended}
              onStart={() => handleStartTest(test.route)}
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-4xl mx-auto glass-card shape-organic-3 p-8">
          <h3 className="text-2xl font-heading font-bold mb-6">Lưu ý <span className="gradient-text">quan trọng</span></h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3 items-start p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl backdrop-blur-sm">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed"><strong className="font-semibold text-slate-800 dark:text-slate-100">Trung thực:</strong> <span className="text-slate-600 dark:text-slate-400">Trả lời theo cảm nhận thật sự của bạn, không phải theo cách bạn muốn trở thành</span></span>
            </li>
            <li className="flex gap-3 items-start p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl backdrop-blur-sm">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed"><strong className="font-semibold text-slate-800 dark:text-slate-100">Không có đúng/sai:</strong> <span className="text-slate-600 dark:text-slate-400">Mỗi câu trả lời đều phản ánh một khía cạnh của bạn</span></span>
            </li>
            <li className="flex gap-3 items-start p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl backdrop-blur-sm">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed"><strong className="font-semibold text-slate-800 dark:text-slate-100">Bảo mật:</strong> <span className="text-slate-600 dark:text-slate-400">Tất cả kết quả được mã hóa và chỉ bạn mới xem được</span></span>
            </li>
            <li className="flex gap-3 items-start p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl backdrop-blur-sm">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed"><strong className="font-semibold text-slate-800 dark:text-slate-100">Không thay thế chẩn đoán y khoa:</strong> <span className="text-slate-600 dark:text-slate-400">Kết quả chỉ mang tính tham khảo. Nếu có vấn đề nghiêm trọng, hãy gặp chuyên gia</span></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
