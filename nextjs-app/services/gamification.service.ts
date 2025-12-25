import { createClient } from '@/lib/supabase/client';
import { GamificationProfile, Badge, UserBadge } from '@/types/gamification';

export const gamificationService = {
  // Get user profile
  async getProfile(userId: string): Promise<GamificationProfile | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('gamification_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching gamification profile:', error);
      return null;
    }
    return data;
  },

  // Get user badges
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badge:badges(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching badges:', error);
      return [];
    }
    return data as unknown as UserBadge[];
  },

  // Check and update streak (Call this on app load or key actions)
  async checkIn(userId: string): Promise<{ updated: boolean; streak: number; message?: string }> {
    const supabase = createClient();

    // 1. Get current profile or create if not exists
    let { data: profile, error: fetchError } = await supabase
      .from('gamification_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // If profile doesn't exist, try to create carefully with conflict handling
    if (!profile) {
      // Create new profile with upsert to handle race conditions/duplicates
      const { data: newProfile, error } = await supabase
        .from('gamification_profiles')
        .upsert(
          { user_id: userId, current_streak: 1, longest_streak: 1, last_activity_date: new Date().toISOString() },
          { onConflict: 'user_id', ignoreDuplicates: false } // We can set ignoreDuplicates: false to get the return data properly update
        )
        .select()
        .single();

      // If upsert "failed" (e.g. race condition), try fetching again
      if (error) {
        // If error is duplicate key or similar, just fetch again
        const { data: existingProfile } = await supabase
          .from('gamification_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (existingProfile) {
          profile = existingProfile;
        } else {
          console.error('Error creating gamification profile:', error);
          return { updated: false, streak: 0 };
        }
      } else {
        profile = newProfile;
        // If strictly created new, return here
        return { updated: true, streak: 1, message: 'Chào mừng! Bạn đã bắt đầu chuỗi ngày hoạt động.' };
      }
    }

    // 2. Check dates
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = profile.last_activity_date ? new Date(profile.last_activity_date).toISOString().split('T')[0] : null;

    if (lastActivity === today) {
      return { updated: false, streak: profile.current_streak };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    let message = 'Chuỗi ngày đã được reset. Hãy bắt đầu lại nhé!';

    if (lastActivity === yesterdayStr) {
      newStreak = profile.current_streak + 1;
      message = `Tuyệt vời! Bạn đã duy trì chuỗi ${newStreak} ngày.`;
    }

    // 3. Update profile
    const updates: any = {
      current_streak: newStreak,
      last_activity_date: new Date().toISOString(),
    };

    if (newStreak > profile.longest_streak) {
      updates.longest_streak = newStreak;
    }

    const { error: updateError } = await supabase
      .from('gamification_profiles')
      .update(updates)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating streak:', updateError);
      return { updated: false, streak: profile.current_streak };
    }

    // 4. Check streak badges
    await this.checkStreakBadges(userId, newStreak);

    return { updated: true, streak: newStreak, message };
  },

  // Internal: Check awarding streak badges
  async checkStreakBadges(userId: string, streak: number) {
    const supabase = createClient();

    // Define streak milestones
    const milestones = [3, 7, 14, 30];
    if (!milestones.includes(streak)) return;

    const slug = `streak_${streak}`;
    await this.awardBadge(userId, slug);
  },

  // Award a specific badge if not owned
  async awardBadge(userId: string, badgeSlug: string): Promise<boolean> {
    const supabase = createClient();

    // 1. Get badge ID
    const { data: badge } = await supabase.from('badges').select('id, name').eq('slug', badgeSlug).single();
    if (!badge) return false;

    // 2. Check if already owned
    const { count } = await supabase.from('user_badges').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('badge_id', badge.id);
    if (count && count > 0) return false;

    // 3. Award
    const { error } = await supabase.from('user_badges').insert({ user_id: userId, badge_id: badge.id });

    if (!error) {
      console.log(`🏆 Badge awarded: ${badge.name}`);
      return true; // New badge unlocked!
    }
    return false;
  }
};
