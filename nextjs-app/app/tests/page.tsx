'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Brain,
    Activity,
    Heart,
    Smile,
    Briefcase,
    Users,
    Clock,
    CheckCircle2,
    ArrowRight
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const tests = [
    {
        id: "mbti",
        title: "Trắc nghiệm tính cách MBTI",
        description: "Khám phá 1 trong 16 loại tính cách của bạn để hiểu rõ điểm mạnh, điểm yếu và xu hướng hành vi.",
        icon: Users,
        color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
        questions: "70 câu hỏi",
        time: "12 phút",
        tags: ["Tính cách", "Phát triển bản thân"]
    },
    {
        id: "dass-21",
        title: "Đánh giá DASS-21",
        description: "Thang đo Trầm cảm, Lo âu và Căng thẳng. Giúp bạn nhận diện sớm các vấn đề sức khỏe tinh thần.",
        icon: Activity,
        color: "text-red-600 bg-red-100 dark:bg-red-900/30",
        questions: "21 câu hỏi",
        time: "5 phút",
        tags: ["Sức khỏe tinh thần", "Y khoa"]
    },
    {
        id: "big-five",
        title: "Trắc nghiệm Big Five (OCEAN)",
        description: "Đánh giá 5 đặc điểm tính cách cốt lõi: Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu và Bất ổn cảm xúc.",
        icon: Brain,
        color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
        questions: "50 câu hỏi",
        time: "10 phút",
        tags: ["Tính cách", "Khoa học"]
    },
    {
        id: "phq-9",
        title: "Sàng lọc Trầm cảm PHQ-9",
        description: "Công cụ tiêu chuẩn để đánh giá mức độ nghiêm trọng của các triệu chứng trầm cảm.",
        icon: Heart,
        color: "text-pink-600 bg-pink-100 dark:bg-pink-900/30",
        questions: "9 câu hỏi",
        time: "3 phút",
        tags: ["Tầm soát", "Trầm cảm"]
    },
    {
        id: "gad-7",
        title: "Sàng lọc Lo âu GAD-7",
        description: "Công cụ sàng lọc nhanh rối loạn lo âu lan tỏa và các rối loạn lo âu phổ biến khác.",
        icon: Smile,
        color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
        questions: "7 câu hỏi",
        time: "2 phút",
        tags: ["Tầm soát", "Lo âu"]
    },
    {
        id: "riasec",
        title: "Định hướng nghề nghiệp Holland",
        description: "Tìm hiểu nhóm tính cách nghề nghiệp phù hợp nhất với bạn dựa trên mô hình RIASEC.",
        icon: Briefcase,
        color: "text-green-600 bg-green-100 dark:bg-green-900/30",
        questions: "48 câu hỏi",
        time: "8 phút",
        tags: ["Nghề nghiệp", "Hướng nghiệp"]
    }
]

export default function TestsPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <section className="bg-muted/30 pt-20 pb-12 border-b">
                <div className="container px-4 mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Kho bài test tâm lý
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Các bài trắc nghiệm chuẩn khoa học giúp bạn thấu hiểu bản thân và chăm sóc sức khỏe tinh thần.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Tests Grid */}
            <section className="container px-4 mx-auto mt-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tests.map((test, index) => (
                        <motion.div
                            key={test.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative flex flex-col bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-xl ${test.color}`}>
                                        <test.icon className="h-6 w-6" />
                                    </div>
                                    <Badge variant="secondary" className="font-normal text-muted-foreground">
                                        Miễn phí
                                    </Badge>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {test.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-3">
                                        {test.description}
                                    </p>
                                </div>

                                <div className="mt-auto pt-6 border-t flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                            {test.questions}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-amber-500" />
                                            {test.time}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Link href={`/tests/${test.id}/about`}>
                                        <Button className="w-full group/btn">
                                            Làm bài ngay
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}
