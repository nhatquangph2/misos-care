"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Search,
    Rocket,
    FileText,
    Shield,
    Settings,
    HelpCircle,
    ArrowRight,
    MessageSquare,
    Mail,
    Phone
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const categories = [
    {
        icon: Rocket,
        title: "Bắt đầu",
        color: "bg-blue-100 text-blue-600",
        articles: [
            "Cách tạo tài khoản",
            "Làm bài test đầu tiên",
            "Hiểu kết quả của bạn",
            "Mascot Dory là ai?"
        ]
    },
    {
        icon: FileText,
        title: "Về các bài test",
        color: "bg-purple-100 text-purple-600",
        articles: [
            "MBTI là gì?",
            "Phân biệt PHQ-9 và GAD-7",
            "Cách đọc biểu đồ Big 5",
            "SISRI-24 đánh giá điều gì?"
        ]
    },
    {
        icon: Shield,
        title: "Bảo mật & Quyền riêng tư",
        color: "bg-green-100 text-green-600",
        articles: [
            "Dữ liệu của tôi được bảo vệ ra sao?",
            "Ai có thể xem kết quả test?",
            "Cách xóa toàn bộ dữ liệu",
            "Chính sách ẩn danh"
        ]
    },
    {
        icon: Settings,
        title: "Tài khoản & Cài đặt",
        color: "bg-amber-100 text-amber-600",
        articles: [
            "Đổi mật khẩu",
            "Thông báo và nhắc nhở",
            "Kết nối với Mentor",
            "Đổi chế độ sáng/tối"
        ]
    }
]

export default function HelpCenterPage() {
    const [search, setSearch] = useState("")

    return (
        <div className="min-h-screen bg-background border-t">
            {/* Header / Search */}
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 md:py-24 text-white">
                <div className="container px-4 mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl md:text-5xl font-bold mb-6">Xin chào, chúng tôi có thể giúp gì cho bạn?</h1>
                        <div className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                            <Input
                                placeholder="Tìm kiếm trợ giúp..."
                                className="h-14 pl-12 bg-white text-slate-900 rounded-full text-lg shadow-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-20">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-2xl border bg-card hover:shadow-md transition-all group"
                            >
                                <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center mb-6`}>
                                    <cat.icon className="h-6 w-6" />
                                </div>
                                <h2 className="text-xl font-bold mb-4">{cat.title}</h2>
                                <ul className="space-y-3">
                                    {cat.articles.map((art, j) => (
                                        <li key={j}>
                                            <Link href="#" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 group/item">
                                                <ArrowRight className="h-3 w-3 opacity-0 group-hover/item:opacity-100 transition-all -ml-5 group-hover/item:ml-0" />
                                                {art}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Questions (Brief) */}
            <section className="py-16 bg-muted/30">
                <div className="container px-4 mx-auto max-w-4xl">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <HelpCircle className="h-6 w-6 text-blue-600" />
                        Câu hỏi phổ biến
                    </h2>
                    <div className="divide-y border rounded-2xl bg-background overflow-hidden">
                        {[
                            "Tôi có cần trả phí để xem kết quả chi tiết không?",
                            "Bài test MBTI của MisosCare có gì khác biệt?",
                            "Làm sao để liên hệ với chuyên gia tâm lý?",
                            "MisosCare có hỗ trợ tiếng Anh không?"
                        ].map((q, i) => (
                            <Link key={i} href="#" className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
                                <span className="font-medium text-slate-700 dark:text-slate-200">{q}</span>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Button variant="ghost" className="text-blue-600 font-bold">
                            Xem toàn bộ FAQ
                        </Button>
                    </div>
                </div>
            </section>

            {/* Support Options */}
            <section className="py-24">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Vẫn không tìm thấy câu trả lời?</h2>
                    <p className="text-muted-foreground mb-12">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng lắng nghe bạn.</p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="p-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex flex-col items-center">
                            <div className="w-12 h-12 bg-white dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 shadow-sm mb-4">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold mb-2">Trò chuyện trực tiếp</h3>
                            <p className="text-sm text-muted-foreground mb-6">Thời gian phản hồi: 5-10 phút</p>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">Chat ngay</Button>
                        </div>

                        <div className="p-8 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 flex flex-col items-center">
                            <div className="w-12 h-12 bg-white dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 shadow-sm mb-4">
                                <Mail className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold mb-2">Gửi Email</h3>
                            <p className="text-sm text-muted-foreground mb-6">support@misoscare.com</p>
                            <Button variant="outline" className="w-full border-indigo-200 hover:bg-indigo-50">Gửi Mail</Button>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                            <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 shadow-sm mb-4">
                                <Phone className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold mb-2">Đường dây nóng</h3>
                            <p className="text-sm text-muted-foreground mb-6">1900 xxxx (8:00 - 22:00)</p>
                            <Button variant="ghost" className="w-full">Gọi ngay</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

function ChevronRight({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
}
