"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
    {
        question: "Các bài test có chính xác không?",
        answer: "Tất cả bài test trên MisosCare đều dựa trên các nghiên cứu khoa học được công nhận rộng rãi (MBTI, Big 5, PHQ-9, DASS-21). Tuy nhiên, kết quả chỉ mang tính chất tham khảo và sàng lọc, không thay thế chẩn đoán y khoa chuyên sâu."
    },
    {
        question: "MisosCare có miễn phí không?",
        answer: "Có, MisosCare hoàn toàn miễn phí 100% cho người dùng cá nhân. Chúng tôi cam kết phi lợi nhuận với mục tiêu nâng cao sức khỏe tinh thần cộng đồng."
    },
    {
        question: "Dữ liệu của tôi được bảo vệ như thế nào?",
        answer: "Chúng tôi coi trọng quyền riêng tư. Dữ liệu của bạn được mã hóa an toàn và hoàn toàn ẩn danh. Bạn có quyền xóa toàn bộ dữ liệu bất cứ lúc nào."
    },
    {
        question: "Tôi có cần đăng nhập để làm test không?",
        answer: "Không bắt buộc. Bạn có thể làm test ngay lập tức (Guest mode). Tuy nhiên, việc đăng nhập giúp bạn lưu lại lịch sử, theo dõi sự thay đổi theo thời gian và nhận lộ trình cá nhân hóa."
    },
    {
        question: "Mất bao lâu để hoàn thành một bài test?",
        answer: "Thời lượng tùy thuộc vào loại bài test, thường dao động từ 3 phút (sàng lọc nhanh) đến 15 phút (đánh giá chuyên sâu 60+ câu hỏi)."
    }
]

export function FAQ() {
    return (
        <section className="py-16 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto max-w-3xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Câu hỏi thường gặp</h2>
                    <p className="text-muted-foreground">
                        Giải đáp những thắc mắc phổ biến về nền tảng MisosCare
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full bg-background rounded-xl shadow-sm border px-4">
                    {faqItems.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className={index === faqItems.length - 1 ? 'border-b-0' : ''}>
                            <AccordionTrigger className="text-left text-base font-medium">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
