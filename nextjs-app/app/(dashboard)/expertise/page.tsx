import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUnifiedProfile } from '@/services/unified-profile.service'
import { AIConsultantChat } from '@/components/ai/AIConsultantChat'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Chuyên gia AI | Misos Care',
    description: 'Nhận tư vấn dựa trên CBT, ACT và khoa học hành vi',
}

export default async function ExpertisePage() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/auth/login')
    }

    const profile = await getUnifiedProfile(user.id, supabase)

    if (!profile.big5) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-2">⚠️ Chưa đủ dữ liệu</h2>
                    <p className="mb-4">
                        Bạn cần hoàn thành bài test Big5 trước khi sử dụng tính năng tư vấn AI.
                    </p>
                    <Link
                        href="/tests/big5"
                        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Làm bài test Big5
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
                    Chuyên gia AI
                </h1>
                <p className="text-muted-foreground mt-2">
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
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-6 rounded-xl">
                <h3 className="font-bold mb-3">📚 Về Tính Năng Này</h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>
                        <strong>Tư vấn AI</strong> sử dụng các phương pháp điều trị dựa trên bằng chứng khoa học:
                    </p>
                    <ul className="list-disc ml-6 space-y-1">
                        <li><strong>CBT (Cognitive Behavioral Therapy):</strong> Xác định và thách thức suy nghĩ tiêu cực</li>
                        <li><strong>ACT (Acceptance and Commitment Therapy):</strong> Hành động dựa trên giá trị cá nhân</li>
                        <li><strong>Problem-Solving Therapy:</strong> Giải quyết vấn đề có hệ thống</li>
                    </ul>
                    <p className="mt-4 font-semibold text-red-600 dark:text-red-400">
                        ⚠️ Lưu ý: AI này KHÔNG thay thế chuyên gia sức khỏe tinh thần chuyên nghiệp.
                    </p>
                </div>
            </div>

            {/* Crisis Resources */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-xl">
                <h3 className="font-bold mb-3 text-red-800 dark:text-red-300">🆘 Cần Hỗ Trợ Khẩn Cấp?</h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>Nếu bạn đang có ý định tự tử hoặc cần hỗ trợ khẩn cấp:</p>
                    <ul className="list-disc ml-6 space-y-1">
                        <li>📞 <strong>Hotline Sức Khỏe Tinh Thần:</strong> 1800-599-920 (24/7, miễn phí)</li>
                        <li>🏥 <strong>Cấp cứu:</strong> 115</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
