"use client"

import { UserPlus, ClipboardList, BarChart, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

interface Step {
    number: string
    icon: React.ReactNode
    title: string
    description: string
    delay: number
}

const steps: Step[] = [
    {
        number: "1",
        icon: <UserPlus className="h-6 w-6 text-white" />,
        title: "Đăng ký nhanh chóng",
        description: "Chỉ mất 30 giây, hoàn toàn miễn phí",
        delay: 0.1,
    },
    {
        number: "2",
        icon: <ClipboardList className="h-6 w-6 text-white" />,
        title: "Chọn bài test",
        description: "7+ bài test khoa học, từ 5-15 phút",
        delay: 0.2,
    },
    {
        number: "3",
        icon: <BarChart className="h-6 w-6 text-white" />,
        title: "Nhận kết quả chi tiết",
        description: "Phân tích tức thì với AI",
        delay: 0.3,
    },
    {
        number: "4",
        icon: <Lightbulb className="h-6 w-6 text-white" />,
        title: "Đề xuất cá nhân hóa",
        description: "Lộ trình phát triển riêng cho bạn",
        delay: 0.4,
    },
]

export function HowItWorks() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Cách MisosCare hoạt động
                    </h2>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        Hành trình khám phá bản thân bắt đầu bằng những bước đơn giản
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[2.25rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-200/0 via-blue-200 to-blue-200/0 z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: step.delay, duration: 0.5 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className="mb-6 relative">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                    {step.icon}
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center font-bold text-blue-600 shadow-sm text-sm">
                                    {step.number}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-2 text-foreground">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
