// ... existing profile ...
// (Keeping existing Profile and Badge interfaces)
export interface GamificationProfile {
    user_id: string;
    current_streak: number;
    longest_streak: number;
    last_activity_date: string | null;
    total_points: number;
    level: number;
}

export interface Badge {
    id: string;
    slug: string;
    name: string;
    description: string;
    icon_url: string;
    category: 'test' | 'streak' | 'intervention' | 'community';
    points: number;
}

export interface UserBadge {
    id: string;
    user_id: string;
    badge_id: string;
    earned_at: string;
    badge?: Badge;
}

export interface DailyQuest {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    type: 'check_in' | 'journal' | 'meditate' | 'breathing' | 'mood_log' | 'read_article';
    reward_points: number;
    status: 'pending' | 'completed';
    completed_at: string | null;
    expires_at: string;
}

export interface OceanItem {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    type: 'coral' | 'fish' | 'decoration' | 'plant';
    unlock_price: number;
    image_url: string;
    is_premium: boolean;
}

export interface UserOceanItem {
    id: string;
    user_id: string;
    item_id: string;
    position_x: number;
    position_y: number;
    scale: number;
    purchased_at: string;
    item?: OceanItem;
}

export interface GamificationState {
    profile: GamificationProfile | null;
    badges: UserBadge[];
    quests: DailyQuest[];
    oceanItems: UserOceanItem[];
}

