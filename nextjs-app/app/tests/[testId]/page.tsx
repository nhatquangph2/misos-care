'use client'

import { useParams, useRouter } from 'next/navigation'
import { ModernQuestionFlow, ModernAnswer } from '@/components/features/tests/ModernQuestionFlow'
import { LIKERT_5_SCALE_VI, SEVERITY_4_SCALE_VI } from '@/components/RadioScale'
import { toast } from "sonner"

const MOCK_MBTI_QUESTIONS = [
    { id: 1, question: "Bạn thường cảm thấy tràn đầy năng lượng khi ở trong đám đông?" },
    { id: 2, question: "Bạn tập trung vào bức tranh tổng quan hơn là các chi tiết nhỏ?" },
    { id: 3, question: "Bạn thường ra quyết định dựa trên lý trí hơn là cảm xúc?" },
    { id: 4, question: "Bạn thích lên kế hoạch chi tiết hơn là tùy cơ ứng biến?" },
    { id: 5, question: "Bạn thường bắt đầu trò chuyện với người lạ trước?" },
    { id: 6, question: "Bạn tin vào trực giác của mình hơn là kinh nghiệm thực tế?" },
    { id: 7, question: "Bạn cảm thấy khó khăn khi phải đồng cảm với người khác?" },
    { id: 8, question: "Bạn thường hoàn thành công việc trước thời hạn từ sớm?" },
    { id: 9, question: "Bạn thích các hoạt động sôi động hơn là yên tĩnh?" },
    { id: 10, question: "Bạn thường suy nghĩ về ý nghĩa sâu xa của mọi việc?" }
]

const MOCK_DASS_QUESTIONS = [
    { id: 101, question: "Tôi thấy khó buông lỏng bản thân." },
    { id: 102, question: "Tôi bị toát mồ hôi (ví dụ như mồ hôi tay...) khi không hoạt động thể lực." },
    { id: 103, question: "Tôi thấy mình không có gì để mong đợi cả." },
    { id: 104, question: "Tôi thấy mình dễ bị phật ý, kích động." },
    { id: 105, question: "Tôi cảm thấy trĩu nặng hoặc buồn bã." },
    { id: 106, question: "Tôi thấy mình không kiên nhẫn với việc gì (ví dụ ngồi chờ xe...)." },
    { id: 107, question: "Tôi cảm thấy sắp ngất hay hốt hoảng." }
]

export default function TestPlayerPage() {
    const params = useParams()
    const router = useRouter()

    const testId = params.testId as string

    // Select test configuration
    let questions = MOCK_MBTI_QUESTIONS
    let scale = LIKERT_5_SCALE_VI
    let title = "Trắc nghiệm MBTI"
    let instruction = "Hãy chọn mức độ đồng ý của bạn với các nhận định sau:"

    if (testId === 'dass-21' || testId === 'gad-7' || testId === 'phq-9') {
        questions = MOCK_DASS_QUESTIONS
        scale = SEVERITY_4_SCALE_VI
        title = "Đánh giá Sức khỏe tinh thần"
        instruction = "Hãy chọn mức độ bạn gặp phải các tình trạng sau trong tuần qua:"
    }

    const handleComplete = (answers: ModernAnswer[]) => {
        // In a real app, we would calculate scores and save to DB here
        console.log("Test completed:", answers)

        toast.success("Hoàn thành bài test!", {
            description: "Kết quả của bạn đã được ghi nhận. Hệ thống đang phân tích..."
        })

        // Simulate analysis delay
        setTimeout(() => {
            // Redirect to dashboard where results would theoretically show up
            router.push('/dashboard')
        }, 1500)
    }

    return (
        <ModernQuestionFlow
            testTitle={title}
            questions={questions}
            scaleOptions={scale}
            onComplete={handleComplete}
            scaleInstruction={instruction}
        />
    )
}
