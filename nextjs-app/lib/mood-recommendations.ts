/**
 * Mood-based Recommendations
 * Different content suggestions based on user's check-in mood
 */

import { Leaf, Heart, Coffee, Wind, Sparkles, BookOpen, Music, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type UserMood = 'happy' | 'neutral' | 'sad' | 'stressed';

export interface MoodRecommendation {
    mood: UserMood;
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
    icon: LucideIcon;
    colorClass: string; // Tailwind gradient class
    iconColorClass: string;
}

const happyRecommendations: MoodRecommendation[] = [
    {
        mood: 'happy',
        title: 'Chia sẻ năng lượng tích cực',
        description: 'Bạn đang tràn đầy năng lượng! Hãy viết ra 3 điều bạn biết ơn hôm nay và lan tỏa năng lượng tích cực này.',
        actionLabel: 'Viết nhật ký biết ơn',
        actionHref: '/sanctuary',
        icon: Sparkles,
        colorClass: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        iconColorClass: 'text-amber-500',
    },
    {
        mood: 'happy',
        title: 'Đặt mục tiêu mới',
        description: 'Khi tinh thần tốt là lúc phù hợp để đặt ra những mục tiêu mới cho bản thân!',
        actionLabel: 'Xem mục tiêu',
        actionHref: '/my-path',
        icon: Target,
        colorClass: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        iconColorClass: 'text-green-500',
    },
];

const neutralRecommendations: MoodRecommendation[] = [
    {
        mood: 'neutral',
        title: 'Khám phá bản thân',
        description: 'Một ngày bình thường là cơ hội tốt để tìm hiểu sâu hơn về chính mình thông qua các bài test.',
        actionLabel: 'Làm bài test',
        actionHref: '/tests',
        icon: BookOpen,
        colorClass: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        iconColorClass: 'text-blue-500',
    },
    {
        mood: 'neutral',
        title: 'Thư giãn với âm nhạc',
        description: 'Dành 5 phút để thư giãn và lắng nghe những giai điệu yêu thích của bạn.',
        actionLabel: 'Ghé thăm Vườn',
        actionHref: '/sanctuary',
        icon: Music,
        colorClass: 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
        iconColorClass: 'text-violet-500',
    },
];

const sadRecommendations: MoodRecommendation[] = [
    {
        mood: 'sad',
        title: 'Tự chăm sóc bản thân',
        description: 'Không sao cả nếu bạn cảm thấy buồn. Hãy làm điều gì đó nhẹ nhàng và tử tế với chính mình hôm nay.',
        actionLabel: 'Ghé thăm Vườn',
        actionHref: '/sanctuary',
        icon: Heart,
        colorClass: 'from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20',
        iconColorClass: 'text-rose-500',
    },
    {
        mood: 'sad',
        title: 'Trò chuyện cùng AI',
        description: 'Đôi khi chỉ cần một người (hoặc AI) lắng nghe cũng giúp bạn cảm thấy tốt hơn.',
        actionLabel: 'Trò chuyện ngay',
        actionHref: '/expertise',
        icon: Coffee,
        colorClass: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
        iconColorClass: 'text-orange-500',
    },
];

const stressedRecommendations: MoodRecommendation[] = [
    {
        mood: 'stressed',
        title: 'Bài tập thở sâu',
        description: 'Khi căng thẳng, hơi thở là công cụ mạnh mẽ nhất. Hít vào 4 giây, giữ 4 giây, thở ra 6 giây.',
        actionLabel: 'Thử ngay',
        actionHref: '/sanctuary',
        icon: Wind,
        colorClass: 'from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20',
        iconColorClass: 'text-cyan-500',
    },
    {
        mood: 'stressed',
        title: 'Kỹ thuật Grounding 5-4-3-2-1',
        description: 'Nhìn 5 thứ, sờ 4 thứ, nghe 3 âm thanh, ngửi 2 mùi, nếm 1 vị. Kỹ thuật này giúp bạn quay về hiện tại.',
        actionLabel: 'Tìm hiểu thêm',
        actionHref: '/expertise',
        icon: Leaf,
        colorClass: 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
        iconColorClass: 'text-emerald-500',
    },
];

const allRecommendations: Record<UserMood, MoodRecommendation[]> = {
    happy: happyRecommendations,
    neutral: neutralRecommendations,
    sad: sadRecommendations,
    stressed: stressedRecommendations,
};

/**
 * Get a random recommendation based on mood
 */
export function getRecommendationByMood(mood: UserMood): MoodRecommendation {
    const recommendations = allRecommendations[mood];
    const randomIndex = Math.floor(Math.random() * recommendations.length);
    return recommendations[randomIndex];
}

/**
 * Get all recommendations for a mood
 */
export function getAllRecommendationsByMood(mood: UserMood): MoodRecommendation[] {
    return allRecommendations[mood];
}

/**
 * Map check-in mood values to UserMood type
 */
export function mapCheckInMood(checkInValue: string): UserMood {
    switch (checkInValue) {
        case 'happy':
            return 'happy';
        case 'neutral':
            return 'neutral';
        case 'sad':
            return 'sad';
        case 'stressed':
            return 'stressed';
        default:
            return 'neutral';
    }
}
