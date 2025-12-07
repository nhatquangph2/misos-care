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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Khám phá bản thân
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Chọn bài test phù hợp để hiểu rõ hơn về tính cách và sức khỏe tinh thần của bạn
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border">
            <Brain className="w-8 h-8 mx-auto mb-3 text-primary" />
            <div className="text-3xl font-bold mb-1">7</div>
            <div className="text-sm font-medium text-muted-foreground">Bài test khả dụng</div>
          </div>
          <div className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border">
            <Heart className="w-8 h-8 mx-auto mb-3 text-secondary" />
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-sm font-medium text-muted-foreground">Bài test đã hoàn thành</div>
          </div>
          <div className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border">
            <Activity className="w-8 h-8 mx-auto mb-3 text-accent" />
            <div className="text-3xl font-bold mb-1">~31</div>
            <div className="text-sm font-medium text-muted-foreground">Phút để hoàn thành</div>
          </div>
        </div>

        {/* Test Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
        <div className="mt-16 max-w-4xl mx-auto bg-muted/50 rounded-2xl p-8 border border-border">
          <h3 className="text-2xl font-bold mb-6 text-foreground">Lưu ý quan trọng</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3 items-start p-4 bg-card rounded-xl">
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed"><strong className="font-semibold text-foreground">Trung thực:</strong> <span className="text-muted-foreground">Trả lời theo cảm nhận thật sự của bạn, không phải theo cách bạn muốn trở thành</span></span>
            </li>
            <li className="flex gap-3 items-start p-4 bg-card rounded-xl">
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed"><strong className="font-semibold text-foreground">Không có đúng/sai:</strong> <span className="text-muted-foreground">Mỗi câu trả lời đều phản ánh một khía cạnh của bạn</span></span>
            </li>
            <li className="flex gap-3 items-start p-4 bg-card rounded-xl">
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed"><strong className="font-semibold text-foreground">Bảo mật:</strong> <span className="text-muted-foreground">Tất cả kết quả được mã hóa và chỉ bạn mới xem được</span></span>
            </li>
            <li className="flex gap-3 items-start p-4 bg-card rounded-xl">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed"><strong className="font-semibold text-foreground">Không thay thế chẩn đoán y khoa:</strong> <span className="text-muted-foreground">Kết quả chỉ mang tính tham khảo. Nếu có vấn đề nghiêm trọng, hãy gặp chuyên gia</span></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
