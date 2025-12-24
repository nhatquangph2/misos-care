'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
    Star,
    MapPin,
    Clock,
    Globe,
    Award,
    ShieldCheck,
    CheckCircle2,
    CalendarDays,
    Video,
    ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

import { BookingCalendar } from '@/components/features/mentors/BookingCalendar'
import { getMentorById, createBooking } from '@/services/mentor-booking.service'
import { Mentor } from '@/types/database'

export default function MentorProfilePage() {
    const params = useParams()
    const router = useRouter()
    const mentorId = params.mentorId as string

    const [mentor, setMentor] = useState<Mentor | null>(null)
    const [loading, setLoading] = useState(true)

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string>('')
    const [isBooking, setIsBooking] = useState(false)

    useEffect(() => {
        loadMentor();
    }, [mentorId]);

    async function loadMentor() {
        setLoading(true);
        try {
            const data = await getMentorById(mentorId);
            if (!data) {
                // If not found in DB, try redirect or show error
                // For now just set null
            }
            setMentor(data);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải thông tin mentor");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!mentor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <p className="text-xl font-semibold mb-4">Không tìm thấy Mentor</p>
                <Button onClick={() => router.back()}>Quay lại</Button>
            </div>
        )
    }

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime) return

        setIsBooking(true)

        try {
            const result = await createBooking(mentor.id, selectedDate, selectedTime, mentor.hourly_rate);

            if (result.success) {
                toast.success('Đặt lịch thành công!', {
                    description: `Bạn có hẹn với ${mentor.name} vào ${selectedTime} ngày ${format(selectedDate, 'dd/MM/yyyy')}`
                })
                // Redirect to dashboard appointments
                router.push('/dashboard')
            } else {
                toast.error('Đặt lịch thất bại', {
                    description: result.error || 'Vui lòng thử lại sau.'
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('Đã có lỗi xảy ra');
        } finally {
            setIsBooking(false)
        }
    }

    // Helper to safely access extended properties
    const extMentor = mentor as any;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <Button
                variant="ghost"
                className="mb-4 pl-0 hover:pl-2 transition-all"
                onClick={() => router.back()}
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Quay lại tìm kiếm
            </Button>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <Award className="w-64 h-64 rotate-12" />
                        </div>

                        <div className="flex-shrink-0 relative z-10">
                            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
                                <AvatarImage src={mentor.avatar_url || ''} />
                                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {mentor.verified && (
                                <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white dark:border-slate-900">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 relative z-10">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">{mentor.name}</h1>
                                    <p className="text-lg text-muted-foreground font-medium">{mentor.title || mentor.credentials}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 px-3 py-1 rounded-full font-bold">
                                        <Star className="h-4 w-4 fill-current" />
                                        <span>{mentor.rating}</span>
                                        <span className="text-xs font-normal opacity-80">({mentor.total_reviews} đánh giá)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {mentor.specialties?.map(s => (
                                    <Badge key={s} variant="secondary" className="px-3 py-1">{s}</Badge>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{extMentor.experience_years || 0} năm kinh nghiệm</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    <span>{(extMentor.languages || ['Tiếng Việt']).join(', ')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>Online / Từ xa</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Detailed Info Tabs */}
                    <Tabs defaultValue="about" className="space-y-6">
                        <TabsList className="bg-muted/50 w-full justify-start h-12 p-1">
                            <TabsTrigger value="about" className="h-full px-6">Giới thiệu</TabsTrigger>
                            <TabsTrigger value="reviews" className="h-full px-6">Đánh giá ({mentor.total_reviews})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="about" className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                            <div className="bg-card border rounded-2xl p-6">
                                <h3 className="font-bold text-lg mb-4">Tiểu sử</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {mentor.bio}
                                </p>

                                <Separator className="my-6" />

                                <h3 className="font-bold text-lg mb-4">Học vấn & Chứng chỉ</h3>
                                <ul className="space-y-3">
                                    {(extMentor.education || []).map((edu: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                                            <span className="text-muted-foreground">{edu}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                    <Video className="h-5 w-5" />
                                    Quy trình tham vấn Online
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="h-8 w-8 rounded-full bg-white dark:bg-blue-900 flex items-center justify-center font-bold text-blue-600 shadow-sm flex-shrink-0">1</div>
                                        <div>
                                            <h4 className="font-semibold">Đặt lịch hẹn</h4>
                                            <p className="text-sm text-muted-foreground">Chọn khung giờ phù hợp và thanh toán để giữ chỗ.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-8 w-8 rounded-full bg-white dark:bg-blue-900 flex items-center justify-center font-bold text-blue-600 shadow-sm flex-shrink-0">2</div>
                                        <div>
                                            <h4 className="font-semibold">Nhận liên kết Video Call</h4>
                                            <p className="text-sm text-muted-foreground">Hệ thống sẽ gửi link Google Meet/Zoom qua email trước 15 phút.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-8 w-8 rounded-full bg-white dark:bg-blue-900 flex items-center justify-center font-bold text-blue-600 shadow-sm flex-shrink-0">3</div>
                                        <div>
                                            <h4 className="font-semibold">Tham gia phiên tư vấn</h4>
                                            <p className="text-sm text-muted-foreground">Trò chuyện 1:1 bảo mật với Mentor trong 60 phút.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews">
                            <div className="bg-card border rounded-2xl p-8 text-center text-muted-foreground">
                                <p>Chức năng xem đánh giá đang được cập nhật.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column: Booking Sticky Panel */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-card border rounded-2xl shadow-lg shadow-blue-500/5 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white text-center">
                                <p className="opacity-90 text-sm">Phí tham vấn</p>
                                <p className="text-3xl font-bold">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(mentor.hourly_rate)}
                                    <span className="text-sm font-normal opacity-70">/giờ</span>
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-4 font-semibold text-lg">
                                        <CalendarDays className="h-5 w-5 text-blue-600" />
                                        Chọn lịch hẹn
                                    </div>
                                    <BookingCalendar
                                        onSelectSlot={(date, time) => {
                                            setSelectedDate(date)
                                            setSelectedTime(time)
                                        }}
                                        selectedDate={selectedDate}
                                        selectedTime={selectedTime}
                                    />
                                </div>

                                <Separator className="mb-6" />

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Thời lượng</span>
                                        <span className="font-medium">60 phút</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Hình thức</span>
                                        <span className="font-medium">Video Call</span>
                                    </div>
                                    {selectedDate && selectedTime && (
                                        <div className="flex justify-between text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-blue-700 dark:text-blue-300">
                                            <span className="font-medium">Thời gian chọn</span>
                                            <span>{selectedTime} - {format(selectedDate, 'dd/MM')}</span>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20"
                                    disabled={!selectedDate || !selectedTime || isBooking}
                                    onClick={handleBooking}
                                >
                                    {isBooking ? 'Đang xử lý...' : 'Đặt lịch ngay'}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-3">
                                    Bạn sẽ không bị trừ tiền cho đến khi Mentor xác nhận.
                                </p>
                            </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-xl p-4 flex gap-3 items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-semibold text-green-800 dark:text-green-300">Đảm bảo hoàn tiền</p>
                                <p className="text-green-700 dark:text-green-400 opacity-90">Nếu bạn không hài lòng với phiên tư vấn đầu tiên, MisosCare sẽ hoàn tiền 100%.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
