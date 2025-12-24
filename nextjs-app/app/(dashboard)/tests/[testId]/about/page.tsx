"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
    Clock,
    FileText,
    ChevronRight,
    Brain,
    Shield,
    BarChart,
    Sparkles,
    Play,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface TestDimension {
    code: string
    name: string
    desc: string
}

interface TestInfo {
    title: string
    subtitle: string
    time: string
    questions: number
    difficulty: string
    description: string
    dimensions: TestDimension[]
    sampleQuestion: string
    benefits: string[]
}

const testData: Record<string, TestInfo> = {
    mbti: {
        title: "Trắc nghiệm Tính cách MBTI",
        subtitle: "Khám phá 16 nhóm tính cách và thấu hiểu xu hướng hành xử của bản thân.",
        time: "12-15 phút",
        questions: 60,
        difficulty: "Trung bình",
        description: "Myers-Briggs Type Indicator (MBTI) là một trong những công cụ phân tích tính cách phổ biến nhất thế giới. Dựa trên lý thuyết của Carl Jung, bài test này giúp bạn xác định xu hướng của mình qua 4 cặp đối lập: Hướng ngoại/Hướng nội, Trực giác/Cảm giác, Lý trí/Tình cảm, và Nguyên tắc/Linh hoạt.",
        dimensions: [
            { code: "E/I", name: "Extraversion / Introversion", desc: "Cách bạn nạp năng lượng: Từ môi trường bên ngoài hay từ thế giới nội tâm?" },
            { code: "S/N", name: "Sensing / Intuition", desc: "Cách bạn tiếp nhận thông tin: Qua các giác quan thực tế hay qua các mối liên hệ trừu tượng?" },
            { code: "T/F", name: "Thinking / Feeling", desc: "Cách bạn ra quyết định: Dựa trên logic khách quan hay dựa trên giá trị và cảm xúc?" },
            { code: "J/P", name: "Judging / Perceiving", desc: "Phong cách sống: Thích kế hoạch rõ ràng hay thích sự linh động tự nhiên?" }
        ],
        sampleQuestion: "Bạn thường ưu tiên giải quyết công việc theo đúng trình tự và kế hoạch đã định trước?",
        benefits: [
            "Hiểu rõ điểm mạnh và điểm yếu cốt lõi",
            "Định hướng nghề nghiệp phù hợp",
            "Cải thiện kỹ năng giao tiếp và làm việc nhóm",
            "Thấu hiểu và chấp nhận sự khác biệt của người khác"
        ]
    },
    'dass-21': {
        title: "Thang đo Trầm cảm, Lo âu, Stress (DASS-21)",
        subtitle: "Đánh giá trạng thái sức khỏe tinh thần hiện tại một cách khoa học.",
        time: "5-7 phút",
        questions: 21,
        difficulty: "Dễ",
        description: "DASS-21 (Depression, Anxiety, and Stress Scales) là bộ công cụ sàng lọc lâm sàng được chuẩn hóa để đo lường ba trạng thái cảm xúc tiêu cực liên quan đến nhau. Đây là công cụ hữu ích để tự theo dõi mức độ distress và nhận biết sớm các dấu hiệu cần sự can thiệp chuyên môn.",
        dimensions: [
            { code: "D", name: "Depression (Trầm cảm)", desc: "Đánh giá tâm trạng thất vọng, thiếu động lực và hạ thấp giá trị bản thân." },
            { code: "A", name: "Anxiety (Lo âu)", desc: "Đánh giá các phản ứng sinh lý và trạng thái hồi hộp, lo sợ không rõ nguyên nhân." },
            { code: "S", name: "Stress (Căng thẳng)", desc: "Đánh giá sự cáu kỉnh, thiếu kiên nhẫn và trạng thái luôn trong tư thế 'chiến đấu'." }
        ],
        sampleQuestion: "Tôi cảm thấy mình dễ bị hoảng loạn hoặc khó để thư giãn hoàn toàn?",
        benefits: [
            "Nhận diện chính xác mức độ lo âu và stress",
            "Cảnh báo sớm các nguy cơ về sức khỏe tinh thần",
            "Theo dõi sự thay đổi tâm trạng theo thời gian",
            "Cung cấp cơ sở dữ liệu cho các chuyên gia tư vấn"
        ]
    }
}

export default function TestAboutPage() {
    const params = useParams()
    const testId = params.testId as string
    const currentTest = testData[testId] || testData['mbti'] // Fallback to mbti for demo

    return (
        <div className="min-h-screen bg-background border-t">
            {/* Hero Section */}
            <section className="bg-slate-50 dark:bg-slate-900 py-12 md:py-20 border-b">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                    <Clock className="h-3 w-3 mr-1" /> {currentTest.time}
                                </Badge>
                                <Badge variant="secondary" className="px-3 py-1">
                                    <FileText className="h-3 w-3 mr-1" /> {currentTest.questions} câu hỏi
                                </Badge>
                                <Badge variant="secondary" className="px-3 py-1">
                                    Độ khó: {currentTest.difficulty}
                                </Badge>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                                {currentTest.title}
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {currentTest.subtitle}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link href={`/tests/${testId}`}>
                                    <Button size="lg" className="h-14 px-10 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 group text-lg">
                                        Bắt đầu làm test ngay
                                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full">
                                    Tư vấn AI về bài test này
                                </Button>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 max-w-sm">
                            <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                                        <Play className="h-10 w-10 text-white fill-white ml-1" />
                                    </div>
                                </div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-white text-sm font-medium text-center bg-black/20 backdrop-blur-sm rounded-lg py-2">
                                        Video giới thiệu (1:00)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container px-4 py-16 mx-auto">
                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Left Column: Description & Dimensions */}
                    <div className="lg:col-span-2 space-y-16">
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Info className="h-6 w-6 text-blue-600" />
                                Bài test đánh giá điều gì?
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                {currentTest.description}
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                {currentTest.dimensions.map((dim: TestDimension, i: number) => (
                                    <div key={i} className="p-6 rounded-2xl border bg-card hover:border-blue-200 transition-colors">
                                        <div className="text-xl font-bold text-blue-600 mb-2">{dim.code}</div>
                                        <div className="font-semibold mb-2">{dim.name}</div>
                                        <p className="text-sm text-muted-foreground">{dim.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Sparkles className="h-6 w-6 text-amber-500" />
                                Bản xem trước câu hỏi
                            </h2>
                            <div className="p-8 rounded-3xl bg-muted/40 border-2 border-dashed flex flex-col items-center text-center">
                                <div className="text-lg italic text-slate-700 dark:text-slate-300 max-w-lg mb-8">
                                    &quot;{currentTest.sampleQuestion}&quot;
                                </div>
                                <div className="flex gap-2 w-full max-w-md">
                                    <div className="flex-1 h-3 rounded-full bg-slate-200" title="Không đồng ý" />
                                    <div className="flex-1 h-3 rounded-full bg-slate-200" />
                                    <div className="flex-1 h-3 rounded-full bg-slate-200" />
                                    <div className="flex-1 h-3 rounded-full bg-slate-200" />
                                    <div className="flex-1 h-3 rounded-full bg-slate-200" title="Rất đồng ý" />
                                </div>
                                <p className="mt-4 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                                    Thang đo đồng ý
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Benefits & Trust */}
                    <div className="space-y-12">
                        <div className="p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
                            <h3 className="text-xl font-bold mb-6">Lợi ích sau bài test</h3>
                            <ul className="space-y-4">
                                {currentTest.benefits.map((benefit: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm font-medium">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl border bg-card shadow-sm">
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Bảo mật hoàn toàn</div>
                                    <div className="text-xs text-muted-foreground">Dữ liệu được mã hóa đầu cuối</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl border bg-card shadow-sm">
                                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                    <BarChart className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Kết quả tức thì</div>
                                    <div className="text-xs text-muted-foreground">Phân tích bởi AI MISO V3</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl border bg-card shadow-sm">
                                <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center">
                                    <Brain className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Khoa học chính xác</div>
                                    <div className="text-xs text-muted-foreground">Dựa trên nghiên cứu học thuật</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900 text-white text-center">
                            <p className="text-sm font-medium mb-4">Bạn chưa sẵn sàng?</p>
                            <Link href="/help" className="text-blue-400 text-sm hover:underline">Xem thêm các câu hỏi thường gặp</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <section className="py-20 border-t bg-gradient-to-b from-transparent to-muted/20">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">Bạn chỉ còn cách bản thân 15 phút</h2>
                    <Link href={`/tests/${testId}`}>
                        <Button size="lg" className="rounded-full px-12 h-14 text-lg bg-blue-600">
                            Bắt đầu bài trắc nghiệm ngay
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}

function Info({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
}
