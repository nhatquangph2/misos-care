'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { MentorReview } from '@/types/mentor';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ReviewListProps {
    reviews: MentorReview[];
}

export function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                Chưa có đánh giá nào.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <Card key={review.id} className="border-none shadow-sm bg-white/50">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={review.user?.avatar_url || ''} />
                                    <AvatarFallback>{review.user?.full_name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">{review.user?.full_name || 'Người dùng ẩn danh'}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: vi })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex text-amber-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-slate-700 mt-2">{review.comment}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
