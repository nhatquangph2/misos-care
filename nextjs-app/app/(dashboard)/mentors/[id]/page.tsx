import React from 'react';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Briefcase, Clock, ShieldCheck, GraduationCap } from 'lucide-react';
import { getMentorById } from '@/app/actions/mentor-actions';
import { getReviews } from '@/app/actions/review-actions';
import { BookingCalendar } from '@/components/features/booking/BookingCalendar';
import { ReviewList } from '@/components/features/mentors/ReviewList';

interface MentorProfilePageProps {
    params: Promise<{ id: string }>;
}

export default async function MentorProfilePage({ params }: MentorProfilePageProps) {
    const { id } = await params;

    // Fetch mentor and reviews in parallel
    const [mentor, reviews] = await Promise.all([
        getMentorById(id),
        getReviews(id)
    ]);

    if (!mentor) {
        notFound();
    }

    const user = mentor.user;
    const fullName = user?.full_name || 'Mentor';
    const avatarUrl = user?.avatar_url || '';
    const initials = fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="container max-w-6xl py-8 space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0 mx-auto md:mx-0">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                        <AvatarImage src={avatarUrl} alt={fullName} />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{fullName}</h1>
                        <p className="text-lg text-blue-600 font-medium">{mentor.title}</p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600">
                        {mentor.organization && (
                            <div className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                <span>Work at {mentor.organization}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{mentor.years_experience}+ Years Experience</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-600 font-medium">
                            <Star className="h-4 w-4 fill-amber-500" />
                            <span>{mentor.rating_avg.toFixed(1)} ({mentor.rating_count} reviews)</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {mentor.detailed_specializations?.map((ms) => (
                            <Badge key={ms.specialization_id} variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                                {ms.specialization?.name_vi}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex flex-col items-end justify-center min-h-[120px]">
                    <div className="text-right mb-2">
                        <p className="text-sm text-muted-foreground">Phí tham vấn</p>
                        <div className="text-2xl font-bold text-[#2D3482]">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: mentor.currency || 'VND' }).format(mentor.price_per_session)}
                            <span className="text-sm font-normal text-muted-foreground">/buổi</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardContent className="pt-6 space-y-6">
                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                    Giới thiệu
                                </h2>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {mentor.professional_bio || "Chưa có thông tin giới thiệu."}
                                </p>
                            </section>

                            <Separator />

                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-blue-600" />
                                    Phương pháp tiếp cận
                                </h2>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {mentor.approach_description || "Chưa có mô tả phương pháp."}
                                </p>
                            </section>

                            <Separator />

                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Star className="h-5 w-5 text-amber-500" />
                                    Đánh giá từ người dùng ({reviews.length})
                                </h2>
                                <ReviewList reviews={reviews} />
                            </section>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Booking */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <BookingCalendar mentorId={mentor.user_id} pricePerSession={mentor.price_per_session} />
                    </div>
                </div>
            </div>
        </div>
    );
}
