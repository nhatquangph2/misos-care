"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Testimonial {
    id: number
    name: string
    role: string
    mbti: string
    avatar: string
    quote: string
    rating: number
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Nguyễn Minh Anh",
        role: "Sinh viên IT, 22 tuổi",
        mbti: "INFP-T",
        avatar: "/avatars/user1.jpg",
        quote: "Test MBTI giúp mình hiểu rõ điểm mạnh và chọn đúng hướng đi sự nghiệp. Rất chính xác!",
        rating: 5,
    },
    {
        id: 2,
        name: "Trần Văn Bình",
        role: "Marketing Manager",
        mbti: "ENTJ-A",
        avatar: "/avatars/user2.jpg",
        quote: "DASS-21 giúp mình nhận ra stress levels và điều chỉnh work-life balance kịp thời.",
        rating: 5,
    },
    {
        id: 3,
        name: "Lê Thị Thu",
        role: "HR Specialist",
        mbti: "ESFJ",
        avatar: "/avatars/user3.jpg",
        quote: "Mình sử dụng MisosCare để hiểu thêm về tính cách ứng viên. Giao diện rất thân thiện.",
        rating: 4,
    },
]

export function Testimonials() {
    const [current, setCurrent] = useState(0)
    const [autoplay, setAutoplay] = useState(true)

    useEffect(() => {
        if (!autoplay) return
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [autoplay])

    const next = () => {
        setAutoplay(false)
        setCurrent((prev) => (prev + 1) % testimonials.length)
    }

    const prev = () => {
        setAutoplay(false)
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    return (
        <section className="py-16 md:py-24 bg-background overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                        Người dùng nói gì về <span className="text-primary">MisosCare</span>
                    </h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-10">
                        <Quote className="w-24 h-24 text-primary" />
                    </div>

                    <div className="relative bg-card rounded-2xl shadow-xl border p-8 md:p-12 min-h-[300px] flex items-center justify-center">
                        <button
                            onClick={prev}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                            onClick={next}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        <div className="w-full relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center text-center space-y-6"
                                >
                                    <div className="space-y-2">
                                        <div className="flex gap-1 justify-center text-yellow-500">
                                            {[...Array(testimonials[current].rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-current" />
                                            ))}
                                        </div>
                                        <blockquote className="text-xl md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto">
                                            &quot;{testimonials[current].quote}&quot;
                                        </blockquote>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Note: Avatar component needs to exist, otherwise fallback or generic div */}
                                        {/* Assuming shadcn Avatar is available or I'll implement simple img */}
                                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary/10">
                                            {/* Placeholder for now since we don't have real images */}
                                            <span className="text-lg font-bold text-primary">{testimonials[current].name.charAt(0)}</span>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-foreground">{testimonials[current].name}</div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <span>{testimonials[current].role}</span>
                                                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                                                <span className="text-primary font-medium">{testimonials[current].mbti}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setAutoplay(false)
                                    setCurrent(i)
                                }}
                                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-primary/20 hover:bg-primary/40"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
