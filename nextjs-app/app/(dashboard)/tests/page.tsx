/**
 * Test Selection Page
 * Main page for users to choose which psychological test to take
 */

'use client'

import { TestSelectionCard } from '@/components/features/tests/TestSelectionCard'
import { useRouter } from 'next/navigation'
import { Brain, Heart, Activity, Check, AlertTriangle } from 'lucide-react'

export default function TestsPage() {
  const router = useRouter()

  const tests = [
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
    },
    {
      id: 'sisri24',
      title: 'SISRI-24 - Trí tuệ Tâm linh',
      description: 'Đánh giá trí tuệ tâm linh qua 4 chiều kích: Tư duy hiện sinh, Ý nghĩa cá nhân, Nhận thức siêu việt, Mở rộng ý thức',
      questionCount: 24,
      estimatedMinutes: 6,
      testType: 'personality' as const,
      difficulty: 'medium' as const,
      recommended: true,
      route: '/tests/sisri24',
    },
    {
      id: 'phq9',
      title: 'PHQ-9 - Đánh giá Trầm cảm',
      description: 'Bộ câu hỏi sàng lọc trầm cảm chuẩn quốc tế (WHO)',
      questionCount: 9,
      estimatedMinutes: 3,
      testType: 'mental-health' as const,
      difficulty: 'easy' as const,
      recommended: true,
      route: '/tests/phq9',
    },
    {
      id: 'big5',
      title: 'Big Five (OCEAN)',
      description: 'Đánh giá 5 đặc điểm tính cách chính: Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Lo âu',
      questionCount: 20,
      estimatedMinutes: 8,
      testType: 'personality' as const,
      difficulty: 'medium' as const,
      recommended: false,
      route: '/tests/big5',
    },
    {
      id: 'gad7',
      title: 'GAD-7 - Đánh giá Lo âu',
      description: 'Bộ câu hỏi đánh giá mức độ rối loạn lo âu tổng quát',
      questionCount: 7,
      estimatedMinutes: 2,
      testType: 'mental-health' as const,
      difficulty: 'easy' as const,
      recommended: false,
      route: '/tests/gad7',
    },
    {
      id: 'dass21',
      title: 'DASS-21 - Trầm cảm, Lo âu, Stress',
      description: 'Đánh giá toàn diện về trầm cảm, lo âu và căng thẳng',
      questionCount: 21,
      estimatedMinutes: 7,
      testType: 'mental-health' as const,
      difficulty: 'medium' as const,
      recommended: false,
      route: '/tests/dass21',
    },
    {
      id: 'pss',
      title: 'PSS - Đánh giá Stress',
      description: 'Thang đo căng thẳng tâm lý được công nhận',
      questionCount: 10,
      estimatedMinutes: 4,
      testType: 'mental-health' as const,
      difficulty: 'easy' as const,
      recommended: false,
      route: '/tests/pss',
    },
  ]

  const handleStartTest = (route: string) => {
    router.push(route)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/40 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 relative overflow-hidden">
      <div className="blob-purple -top-10 -left-10" />
      <div className="blob-blue top-20 right-0" />
      <div className="blob-pink bottom-0 left-10" />

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12 relative z-10 max-w-7xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 dark:text-white">
            Khám phá <span className="gradient-text">bản thân</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Chọn bài test phù hợp để hiểu rõ hơn về tính cách và sức khỏe tinh thần của bạn
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-5xl mx-auto">
          <div className="glass-card shape-organic-1 p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100/80 dark:bg-purple-900/40 mx-auto mb-3">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">7</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Bài test khả dụng</div>
          </div>
          <div className="glass-card shape-organic-2 p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-pink-100/80 dark:bg-pink-900/40 mx-auto mb-3">
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-300" />
            </div>
            <div className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">0</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Bài test đã hoàn thành</div>
          </div>
          <div className="glass-card shape-organic-1 p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100/80 dark:bg-blue-900/40 mx-auto mb-3">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">~31</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Phút để hoàn thành</div>
          </div>
        </div>

        {/* Test Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tests.map((test) => (
            <div key={test.id} className="glass-card shape-organic-2 hover:shadow-xl transition-all">
              <TestSelectionCard
                title={test.title}
                description={test.description}
                questionCount={test.questionCount}
                estimatedMinutes={test.estimatedMinutes}
                testType={test.testType}
                difficulty={test.difficulty}
                recommended={test.recommended}
                onStart={() => handleStartTest(test.route)}
              />
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-5xl mx-auto glass-card shape-organic-3 p-8 border border-white/60 dark:border-white/10">
          <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Lưu ý quan trọng</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3 items-start p-4 rounded-xl bg-white/50 dark:bg-slate-900/30 border border-white/40 dark:border-white/10">
              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed text-slate-700 dark:text-slate-200"><strong className="font-semibold text-slate-900 dark:text-white">Trung thực:</strong> <span className="text-slate-600 dark:text-slate-300">Trả lời theo cảm nhận thật sự của bạn, không phải theo cách bạn muốn trở thành</span></span>
            </li>
            <li className="flex gap-3 items-start p-4 rounded-xl bg-white/50 dark:bg-slate-900/30 border border-white/40 dark:border-white/10">
              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed text-slate-700 dark:text-slate-200"><strong className="font-semibold text-slate-900 dark:text-white">Không có đúng/sai:</strong> <span className="text-slate-600 dark:text-slate-300">Mỗi câu trả lời đều phản ánh một khía cạnh của bạn</span></span>
            </li>
            <li className="flex gap-3 items-start p-4 rounded-xl bg-white/50 dark:bg-slate-900/30 border border-white/40 dark:border-white/10">
              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed text-slate-700 dark:text-slate-200"><strong className="font-semibold text-slate-900 dark:text-white">Bảo mật:</strong> <span className="text-slate-600 dark:text-slate-300">Tất cả kết quả được mã hóa và chỉ bạn mới xem được</span></span>
            </li>
            <li className="flex gap-3 items-start p-4 rounded-xl bg-white/50 dark:bg-slate-900/30 border border-white/40 dark:border-white/10">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed text-slate-700 dark:text-slate-200"><strong className="font-semibold text-slate-900 dark:text-white">Không thay thế chẩn đoán y khoa:</strong> <span className="text-slate-600 dark:text-slate-300">Kết quả chỉ mang tính tham khảo. Nếu có vấn đề nghiêm trọng, hãy gặp chuyên gia</span></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
