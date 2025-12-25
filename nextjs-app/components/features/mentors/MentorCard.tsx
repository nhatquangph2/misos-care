'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Star, MapPin, Briefcase, Calendar } from 'lucide-react';
import { MentorProfile } from '@/types/mentor';

interface MentorCardProps {
    mentor: MentorProfile;
}

export function MentorCard({ mentor }: MentorCardProps) {
    const user = mentor.user;
    const fullName = user?.full_name || 'Mentor';
    const avatarUrl = user?.avatar_url || '';
    const initials = fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Format currency
    const priceFormatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: mentor.currency || 'VND',
        maximumFractionDigits: 0,
    }).format(mentor.price_per_session);

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none bg-white/80 backdrop-blur-sm shadow-sm flex flex-col h-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                            <AvatarImage src={avatarUrl} alt={fullName} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{fullName}</h3>
                            <p className="text-sm font-medium text-blue-600 mb-1">{mentor.title}</p>

                            {mentor.organization && (
                                <div className="flex items-center text-xs text-muted-foreground gap-1">
                                    <Briefcase className="h-3 w-3" />
                                    <span className="line-clamp-1">{mentor.organization}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                        <span className="text-sm font-bold text-amber-700">{mentor.rating_avg.toFixed(1)}</span>
                        <span className="text-xs text-amber-600 ml-1">({mentor.rating_count})</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 py-4">
                <div className="space-y-4">
                    {/* Bio */}
                    <p className="text-sm text-slate-600 line-clamp-3 min-h-[60px]">
                        {mentor.professional_bio || "Chuyên gia chưa cập nhật thông tin giới thiệu."}
                    </p>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-1.5">
                        {mentor.detailed_specializations?.slice(0, 3).map((ms) => (
                            <Badge
                                key={ms.specialization_id}
                                variant="secondary"
                                className="text-xs font-normal bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100"
                            >
                                {ms.specialization?.name_vi || 'Chuyên môn'}
                            </Badge>
                        ))}
                        {(mentor.detailed_specializations?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                                +{mentor.detailed_specializations!.length! - 3}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2 pb-5 px-6 border-t bg-slate-50/50 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Phí tham vấn</span>
                    <span className="text-lg font-bold text-slate-800">{priceFormatted}</span>
                </div>
                <Link href={`/mentors/${mentor.user_id}`} passHref>
                    <Button className="bg-[#2D3482] hover:bg-[#1e235e] text-white shadow-md hover:shadow-lg transition-all">
                        <Calendar className="h-4 w-4 mr-2" />
                        Đặt lịch
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
