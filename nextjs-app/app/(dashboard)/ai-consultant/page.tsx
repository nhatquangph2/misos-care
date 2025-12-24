import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUnifiedProfile } from '@/services/unified-profile.service'
import { AIConsultantChat } from '@/components/ai/AIConsultantChat'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tư Vấn AI Khoa Học | Misos Care',
  description: 'Nhận tư vấn dựa trên CBT, ACT và khoa học hành vi',
}

export default async function AIConsultantPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  // Get unified profile with all test results
  const profile = await getUnifiedProfile(user.id)

  // Check if user has completed required tests
  if (!profile.big5) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-2">⚠️ Chưa đủ dữ liệu</h2>
          <p className="mb-4">
            Bạn cần hoàn thành bài test Big5 trước khi sử dụng tính năng tư vấn AI.
          </p>
          <Link
            href="/tests/big5"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Làm bài test Big5
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold mb-2">
          Tư Vấn <span className="gradient-text">AI Khoa Học</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Nhận gợi ý dựa trên CBT, ACT, Problem-Solving Therapy và tính cách của bạn
        </p>
      </div>

      {/* AI Consultant Component */}
      <AIConsultantChat
        big5Score={profile.big5}
        mbtiType={profile.mbti?.type}
        viaStrengths={profile.via?.strengths
          ?.filter(s => s.category === 'signature')
          .map(s => s.name)}
      />

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-xl">
        <h3 className="font-bold mb-3">📚 Về Tính Năng Này</h3>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <strong>Tư vấn AI</strong> sử dụng các phương pháp điều trị dựa trên bằng chứng khoa học:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>CBT (Cognitive Behavioral Therapy):</strong> Xác định và thách thức suy nghĩ tiêu cực</li>
            <li><strong>ACT (Acceptance and Commitment Therapy):</strong> Hành động dựa trên giá trị cá nhân</li>
            <li><strong>Problem-Solving Therapy:</strong> Giải quyết vấn đề có hệ thống</li>
            <li><strong>Behavioral Activation:</strong> Lập lịch hoạt động, thay đổi môi trường</li>
            <li><strong>Skills Training:</strong> Kỹ năng giao tiếp, quản lý thời gian</li>
          </ul>
          <p className="mt-4 font-semibold text-red-600 dark:text-red-400">
            ⚠️ Lưu ý: AI này KHÔNG thay thế chuyên gia sức khỏe tinh thần chuyên nghiệp.
          </p>
        </div>
      </div>

      {/* Crisis Resources */}
      <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-xl">
        <h3 className="font-bold mb-3 text-red-800 dark:text-red-300">🆘 Cần Hỗ Trợ Khẩn Cấp?</h3>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>Nếu bạn đang có ý định tự tử hoặc cần hỗ trợ khẩn cấp:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>📞 <strong>Hotline Sức Khỏe Tinh Thần:</strong> 1800-599-920 (24/7, miễn phí)</li>
            <li>🏥 <strong>Cấp cứu:</strong> 115</li>
            <li>👨‍⚕️ <strong>Tìm chuyên gia:</strong> Liên hệ bác sĩ tâm lý hoặc bác sĩ tâm thần</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
