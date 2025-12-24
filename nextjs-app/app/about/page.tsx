"use client"

import { motion } from "framer-motion"
import { Brain, Heart, Shield, Sparkles, Rocket, Target, Zap, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background border-t">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl opacity-50 dark:bg-blue-900/10" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl opacity-50 dark:bg-indigo-900/10" />
                </div>

                <div className="container px-4 mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Về MisosCare
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Chúng tôi tin rằng sức khỏe tinh thần là nền tảng của một cuộc sống hạnh phúc.
                            MisosCare ra đời để giúp mọi người thấu hiểu bản thân thông qua khoa học và công nghệ.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-muted/30">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-semibold">
                                <Target className="h-4 w-4" />
                                <span>Sứ mệnh của chúng tôi</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold">Dân chủ hóa giáo dục tâm lý</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                MisosCare không chỉ là một ứng dụng trắc nghiệm. Chúng tôi xây dựng một hệ sinh thái nơi mỗi cá nhân đều có thể tiếp cận các công cụ sàng lọc tâm lý chuẩn quốc tế một cách miễn phí và dễ dàng nhất.
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="p-4 bg-background rounded-xl border border-blue-100 dark:border-blue-900">
                                    <div className="font-bold text-2xl text-blue-600">100%</div>
                                    <div className="text-sm text-muted-foreground">Miễn phí cho cộng đồng</div>
                                </div>
                                <div className="p-4 bg-background rounded-xl border border-blue-100 dark:border-blue-900">
                                    <div className="font-bold text-2xl text-blue-600">7+</div>
                                    <div className="text-sm text-muted-foreground">Bài test chuẩn khoa học</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                                <span className="text-9xl animate-pulse">🐬</span>
                                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                    <p className="text-white font-medium text-center">"Thấu hiểu bản thân là khởi đầu của mọi trí tuệ" - Aristotle</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* The Science Behind */}
            <section className="py-24">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Dựa trên nền tảng khoa học</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Mọi phân tích của MisosCare đều dựa trên các mô hình tâm lý học và nghiên cứu khoa học uy tín nhất hiện nay.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Mô hình MBTI & Big Five",
                                description: "Phân tích 16 loại tính cách và 5 chiều cốt lõi giúp bạn thấu hiểu hành vi và xu hướng của mình trong cuộc sống và công việc.",
                                icon: Brain,
                                color: "bg-purple-100 text-purple-600"
                            },
                            {
                                title: "Thang đo Lâm sàng",
                                description: "Sử dụng PHQ-9, GAD-7 và DASS-21 - những bộ công cụ sàng lọc tiêu chuẩn quốc tế được các chuyên gia tâm thần học tin dùng.",
                                icon: Heart,
                                color: "bg-red-100 text-red-600"
                            },
                            {
                                title: "MISO V3 AI Engine",
                                description: "Hệ thống AI độc quyền phân tích đa chiều các chỉ số để đưa ra dự báo và lộ trình cải thiện cá nhân hóa cho từng người dùng.",
                                icon: Zap,
                                color: "bg-amber-100 text-amber-600"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all"
                            >
                                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Privacy Pledge */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Shield className="w-64 h-64" />
                </div>
                <div className="container px-4 mx-auto relative z-10 text-center">
                    <h2 className="text-3xl font-bold mb-6">Cam kết quyền riêng tư</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
                        Chúng tôi không bao giờ bán dữ liệu của bạn. Mọi thông tin trắc nghiệm được mã hóa
                        và chỉ được sử dụng để giúp bạn thấu hiểu bản thân tốt hơn.
                        Bạn luôn có thể xóa tài khoản và mọi dữ liệu liên quan bất cứ lúc nào.
                    </p>
                    <div className="flex justify-center gap-8 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-400" />
                            <span>Mã hóa AES-256</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-400" />
                            <span>Tuân thủ GDPR/HIPAA</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-400" />
                            <span>Ẩn danh hoàn toàn</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Roadmap */}
            <section className="py-24">
                <div className="container px-4 mx-auto max-w-4xl">
                    <div className="flex items-center gap-3 mb-10">
                        <Rocket className="h-8 w-8 text-blue-600" />
                        <h2 className="text-3xl font-bold">Lộ trình phát triển</h2>
                    </div>

                    <div className="space-y-12">
                        {[
                            {
                                phase: "Giai đoạn 1: Foundation (Đã hoàn thành)",
                                description: "Xây dựng 7 bài test cốt lõi, hệ thống chấm điểm tự động và AI Consultant cơ bản.",
                                status: "done"
                            },
                            {
                                phase: "Giai đoạn 2: Enhance Experience (Hiện tại)",
                                description: "Nâng cấp giao diện Ocean Immersive, bổ sung Product Tour, FAQ, và hệ thống Gamification.",
                                status: "current"
                            },
                            {
                                phase: "Giai đoạn 3: Mentor Connect (Sắp tới)",
                                description: "Kết nối người dùng với các chuyên gia tâm lý và mentor thông qua hệ thống đặt lịch 1:1.",
                                status: "upcoming"
                            }
                        ].map((step, i) => (
                            <div key={i} className="flex gap-6 relative">
                                {i !== 2 && <div className="absolute left-[15px] top-10 bottom-[-40px] w-0.5 bg-muted" />}
                                <div className={`mt-1 h-8 w-8 rounded-full border-4 flex items-center justify-center flex-shrink-0 ${step.status === 'done' ? 'bg-blue-600 border-blue-100' :
                                        step.status === 'current' ? 'bg-amber-500 border-amber-100 animate-pulse' :
                                            'bg-muted border-muted-foreground/10'
                                    }`}>
                                    {step.status === 'done' && <Sparkles className="h-4 w-4 text-white" />}
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold mb-2 ${step.status === 'current' ? 'text-blue-600' : ''}`}>
                                        {step.phase}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 border-t">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6 italic">"The unexamined life is not worth living" - Socrates</h2>
                    <Link href="/tests">
                        <Button size="lg" className="rounded-full px-10 h-14 text-lg">
                            Bắt đầu khám phá ngay
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
