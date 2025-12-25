'use client';

import { useEffect, useState } from 'react';
import { gamificationService } from '@/services/gamification.service';
import { GamificationProfile, UserBadge } from '@/types/gamification';
import { Card } from '@/components/ui/card';
import { Flame, Trophy, Star, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function UserEngagement({ userId }: { userId: string }) {
    const [profile, setProfile] = useState<GamificationProfile | null>(null);
    const [badges, setBadges] = useState<UserBadge[]>([]);
    const [loading, setLoading] = useState(true);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const init = async () => {
            // 1. Check in (update streak)
            await gamificationService.checkIn(userId);

            // 2. Fetch data
            const prof = await gamificationService.getProfile(userId);
            const userBadges = await gamificationService.getUserBadges(userId);

            setProfile(prof);
            setBadges(userBadges);
            setLoading(false);
        };

        if (userId) init();
    }, [userId]);

    if (!mounted) return null; // Prevent hydration mismatch by not rendering until client-side

    if (loading) {
        return <div className="h-24 bg-gray-100 animate-pulse rounded-xl" />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* 1. Streak Card */}
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-100 dark:border-orange-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-orange-800 rounded-full shadow-sm">
                        <Flame className={`h-8 w-8 ${profile?.current_streak && profile.current_streak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-gray-300'}`} />
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                            Chuỗi ngày
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-gray-100">
                            {profile?.current_streak || 0} <span className="text-base font-normal text-gray-500">ngày</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Kỷ lục: {profile?.longest_streak || 0} ngày
                        </p>
                    </div>
                </div>
            </Card>

            {/* 2. Badges Preview */}
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-100 dark:border-yellow-800">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                            <Trophy className="h-3 w-3" /> Thành tích
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-gray-100">
                            {badges.length} <span className="text-base font-normal text-gray-500">huy hiệu</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-2">
                    <TooltipProvider>
                        {badges.length === 0 && (
                            <span className="text-sm text-gray-400 italic">Chưa có huy hiệu nào. Hãy làm test ngay!</span>
                        )}
                        {badges.slice(0, 5).map((ub) => (
                            <Tooltip key={ub.id}>
                                <TooltipTrigger>
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-lg cursor-help border border-yellow-200 dark:border-yellow-700">
                                        {ub.badge?.icon_url || '🏅'}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-bold">{ub.badge?.name}</p>
                                    <p className="text-xs">{ub.badge?.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>
            </Card>
        </div>
    );
}
