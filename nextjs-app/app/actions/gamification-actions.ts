'use server';

import { createClient } from '@/lib/supabase/server';
import { GamificationState, GamificationProfile, DailyQuest, UserOceanItem, Badge, UserBadge } from '@/types/gamification';
import { revalidatePath } from 'next/cache';

export async function getGamificationState(): Promise<GamificationState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { profile: null, badges: [], quests: [], oceanItems: [] };
    }

    // Parallel fetch
    const [profileRes, badgesRes, questsRes, itemsRes] = await Promise.all([
        (supabase as any).from('gamification_profiles').select('*').eq('user_id', user.id).single(),
        (supabase as any).from('user_badges').select('*, badge:badges(*)').eq('user_id', user.id),
        (supabase as any).from('daily_quests').select('*').eq('user_id', user.id).gte('expires_at', new Date().toISOString()),
        (supabase as any).from('user_ocean_items').select('*, item:ocean_items(*)').eq('user_id', user.id)
    ]);

    // Handle profile creation if missing (lazy init)
    let profile = profileRes.data;
    if (!profile) {
        // Create initial profile
        const { data: newProfile } = await (supabase as any)
            .from('gamification_profiles')
            .insert({ user_id: user.id })
            .select()
            .single();
        profile = newProfile;
    }

    // Handle daily quests generation if empty
    let quests = questsRes.data || [];
    if (quests.length === 0) {
        // Generate default quests for today
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const newQuests = [
            { user_id: user.id, title: 'Check-in cảm xúc', type: 'mood_log', reward_points: 10, expires_at: tomorrow.toISOString() },
            { user_id: user.id, title: 'Thực hành hít thở', type: 'breathing', reward_points: 20, expires_at: tomorrow.toISOString() },
            { user_id: user.id, title: 'Đọc 1 bài viết', type: 'read_article', reward_points: 15, expires_at: tomorrow.toISOString() }
        ];

        const { data: createdQuests } = await (supabase as any)
            .from('daily_quests')
            .insert(newQuests)
            .select();

        if (createdQuests) quests = createdQuests;
    }

    return {
        profile: profile as GamificationProfile,
        badges: (badgesRes.data as unknown as UserBadge[]) || [],
        quests: (quests as DailyQuest[]) || [],
        oceanItems: (itemsRes.data as unknown as UserOceanItem[]) || []
    };
}

export async function checkIn(): Promise<{ success: boolean; message: string; streak: number }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: 'Unauthorized', streak: 0 };

    // Check existing
    const { data: profile } = await (supabase as any)
        .from('gamification_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (!profile) return { success: false, message: 'Profile not found', streak: 0 };

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = profile.last_activity_date ? new Date(profile.last_activity_date).toISOString().split('T')[0] : null;

    if (lastActivity === today) {
        return { success: true, message: 'Bạn đã check-in hôm nay rồi!', streak: profile.current_streak };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    let message = 'Chuỗi check-in đã được reset.';

    if (lastActivity === yesterdayStr) {
        newStreak = profile.current_streak + 1;
        message = `Tuyệt vời! Chuỗi ${newStreak} ngày liên tiếp.`;
    }

    // Update
    await (supabase as any).from('gamification_profiles').update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, profile.longest_streak || 0),
        last_activity_date: new Date().toISOString(),
        total_points: (profile.total_points || 0) + 10 // Bonus points for check-in
    }).eq('user_id', user.id);

    revalidatePath('/dashboard');
    return { success: true, message, streak: newStreak };
}

export async function completeQuest(questId: string): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // 1. Get quest
    const { data: quest } = await (supabase as any)
        .from('daily_quests')
        .select('*')
        .eq('id', questId)
        .eq('user_id', user.id)
        .single();

    if (!quest || quest.status === 'completed') return false;

    // 2. Update quest
    const { error } = await (supabase as any)
        .from('daily_quests')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', questId);

    if (error) return false;

    // 3. Award points
    await (supabase as any).rpc('increment_points', {
        user_uuid: user.id,
        amount: quest.reward_points
    });
    // Note: If RPC doesn't exist, we can manual update, but RPC is safer for concurrency.
    // For now, let's manual update since I haven't defined RPC in migration
    const { data: profile } = await (supabase as any).from('gamification_profiles').select('total_points').eq('user_id', user.id).single();
    if (profile) {
        await (supabase as any).from('gamification_profiles').update({
            total_points: profile.total_points + quest.reward_points
        }).eq('user_id', user.id);
    }

    revalidatePath('/dashboard');
    return true;
}

export async function buyOceanItem(itemId: string): Promise<{ success: boolean; message: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Unauthorized' };

    // 1. Fetch Item & Profile
    const [itemRes, profileRes] = await Promise.all([
        (supabase as any).from('ocean_items').select('*').eq('id', itemId).single(),
        (supabase as any).from('gamification_profiles').select('total_points').eq('user_id', user.id).single()
    ]);

    const item = itemRes.data;
    const profile = profileRes.data;

    if (!item || !profile) return { success: false, message: 'Data error' };
    if (profile.total_points < item.unlock_price) return { success: false, message: 'Không đủ điểm!' };

    // 2. Deduct points
    await (supabase as any).from('gamification_profiles').update({
        total_points: profile.total_points - item.unlock_price
    }).eq('user_id', user.id);

    // 3. Add to inventory (In Bag by default: position -1)
    await (supabase as any).from('user_ocean_items').insert({
        user_id: user.id,
        item_id: item.id,
        position_x: -1,
        position_y: -1
    });

    revalidatePath('/sanctuary');
    return { success: true, message: `Đã thêm ${item.name} vào Túi!` };
}

export async function toggleItemPlacement(itemId: string, shouldPlace: boolean): Promise<{ success: boolean; message: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Unauthorized' };

    const updateData = shouldPlace
        ? { position_x: 50, position_y: 50 } // Default center when placing
        : { position_x: -1, position_y: -1 }; // Hide when storing

    const { error } = await (supabase as any)
        .from('user_ocean_items')
        .update(updateData)
        .eq('id', itemId)
        .eq('user_id', user.id);

    if (error) return { success: false, message: 'Failed to update item' };

    revalidatePath('/sanctuary');
    return { success: true, message: shouldPlace ? 'Đã thả sinh vật ra!' : 'Đã cất sinh vật vào túi!' };
}
