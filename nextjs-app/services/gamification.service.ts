/**
 * Gamification Service - "Đại dương của Miso"
 *
 * Service này quản lý:
 * - Điểm thưởng (Bubbles)
 * - Cấp độ đại dương (Ocean Level)
 * - Chuỗi ngày liên tiếp (Streak Days)
 */

import { createClient } from '@/lib/supabase/client';

export interface GamificationState {
  user_id: string;
  bubbles: number;
  ocean_level: number;
  streak_days: number;
  last_interaction_at: string;
  created_at: string;
  updated_at: string;
}

export interface OceanLevelInfo {
  level: number;
  name: string;
  description: string;
  minBubbles: number;
  maxBubbles: number;
  color: string;
  icon: string;
}

// Định nghĩa các cấp độ đại dương
export const OCEAN_LEVELS: Record<number, OceanLevelInfo> = {
  1: {
    level: 1,
    name: 'Bờ biển ánh sáng',
    description: 'Bạn mới bắt đầu hành trình khám phá đại dương',
    minBubbles: 0,
    maxBubbles: 99,
    color: '#60A5FA', // blue-400
    icon: '🌊'
  },
  2: {
    level: 2,
    name: 'Vùng biển nông',
    description: 'Bạn đang làm quen với những sinh vật biển đầu tiên',
    minBubbles: 100,
    maxBubbles: 299,
    color: '#3B82F6', // blue-500
    icon: '🐠'
  },
  3: {
    level: 3,
    name: 'Rạn san hô',
    description: 'Bạn đã khám phá được vùng rạn san hô đầy màu sắc',
    minBubbles: 300,
    maxBubbles: 599,
    color: '#2563EB', // blue-600
    icon: '🪸'
  },
  4: {
    level: 4,
    name: 'Vực sâu huyền bí',
    description: 'Bạn đang đi sâu vào những bí ẩn của đại dương',
    minBubbles: 600,
    maxBubbles: 999,
    color: '#1E40AF', // blue-700
    icon: '🐋'
  },
  5: {
    level: 5,
    name: 'Hố đen đại dương',
    description: 'Bạn đã chinh phục được độ sâu tột cùng của đại dương!',
    minBubbles: 1000,
    maxBubbles: Infinity,
    color: '#1E3A8A', // blue-800
    icon: '🔱'
  }
};

// Phần thưởng cho các hoạt động
export const REWARD_AMOUNTS = {
  COMPLETE_TEST: 50,           // Hoàn thành bài test
  DAILY_LOGIN: 10,             // Đăng nhập hàng ngày
  STREAK_BONUS: 5,             // Bonus cho mỗi ngày streak (nhân với số ngày)
  SHARE_RESULT: 20,            // Chia sẻ kết quả
  COMPLETE_PROFILE: 30,        // Hoàn thành profile
  SET_GOAL: 25,                // Đặt mục tiêu
  ACHIEVE_GOAL: 100,           // Đạt được mục tiêu
  HELP_OTHERS: 15,             // Giúp đỡ người khác (mentor)
};

export const gamificationService = {
  /**
   * Lấy trạng thái gamification hiện tại của user
   */
  async getGamificationState(userId: string): Promise<GamificationState | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Nếu chưa có data, tạo mới với giá trị mặc định
      if (error.code === 'PGRST116') {
        return await this.initializeGamification(userId);
      }
      console.error('Error fetching gamification state:', error);
      return null;
    }
    return data;
  },

  /**
   * Khởi tạo gamification state cho user mới
   */
  async initializeGamification(userId: string): Promise<GamificationState | null> {
    const supabase = createClient();
    const { data, error } = await (supabase
      .from('user_gamification') as any)
      .insert({
        user_id: userId,
        bubbles: 0,
        ocean_level: 1,
        streak_days: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error initializing gamification:', error);
      return null;
    }
    return data;
  },

  /**
   * Cộng điểm bubbles (sử dụng RPC để tránh race condition)
   */
  async addBubbles(userId: string, amount: number): Promise<boolean> {
    const supabase = createClient();
    const { error } = await (supabase.rpc as any)('increment_bubbles', {
      user_id_param: userId,
      amount_param: amount
    });

    if (error) {
      console.error('Error adding bubbles:', error);
      return false;
    }
    return true;
  },

  /**
   * Cập nhật streak days
   */
  async updateStreak(userId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await (supabase.rpc as any)('update_streak_days', {
      user_id_param: userId
    });

    if (error) {
      console.error('Error updating streak:', error);
      return false;
    }
    return true;
  },

  /**
   * Lấy thông tin về ocean level hiện tại
   */
  getOceanLevelInfo(level: number): OceanLevelInfo {
    return OCEAN_LEVELS[level] || OCEAN_LEVELS[1];
  },

  /**
   * Tính toán tiến độ đến level tiếp theo
   */
  calculateProgress(bubbles: number, currentLevel: number): {
    currentLevel: OceanLevelInfo;
    nextLevel: OceanLevelInfo | null;
    progress: number; // 0-100
    bubblesNeeded: number;
  } {
    const currentLevelInfo = this.getOceanLevelInfo(currentLevel);
    const nextLevel = currentLevel < 5 ? currentLevel + 1 : null;
    const nextLevelInfo = nextLevel ? this.getOceanLevelInfo(nextLevel) : null;

    if (!nextLevelInfo) {
      return {
        currentLevel: currentLevelInfo,
        nextLevel: null,
        progress: 100,
        bubblesNeeded: 0
      };
    }

    const bubblesInCurrentLevel = bubbles - currentLevelInfo.minBubbles;
    const bubblesNeededForLevel = nextLevelInfo.minBubbles - currentLevelInfo.minBubbles;
    const progress = Math.min(100, (bubblesInCurrentLevel / bubblesNeededForLevel) * 100);
    const bubblesNeeded = nextLevelInfo.minBubbles - bubbles;

    return {
      currentLevel: currentLevelInfo,
      nextLevel: nextLevelInfo,
      progress: Math.round(progress),
      bubblesNeeded: Math.max(0, bubblesNeeded)
    };
  },

  /**
   * Thưởng điểm cho một hành động cụ thể
   */
  async rewardAction(
    userId: string,
    action: keyof typeof REWARD_AMOUNTS,
    multiplier: number = 1
  ): Promise<{ success: boolean; amount: number; newTotal?: number }> {
    const amount = REWARD_AMOUNTS[action] * multiplier;
    const success = await this.addBubbles(userId, amount);

    if (success) {
      const state = await this.getGamificationState(userId);
      return {
        success: true,
        amount,
        newTotal: state?.bubbles
      };
    }

    return { success: false, amount };
  },

  /**
   * Lấy leaderboard (top users theo bubbles)
   */
  async getLeaderboard(limit: number = 10): Promise<Array<{
    user_id: string;
    bubbles: number;
    ocean_level: number;
    rank: number;
  }> | null> {
    const supabase = createClient();
    const { data, error } = await (supabase
      .from('user_gamification') as any)
      .select('user_id, bubbles, ocean_level')
      .order('bubbles', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return null;
    }

    return (data || []).map((item: any, index: number) => ({
      user_id: item.user_id,
      bubbles: item.bubbles,
      ocean_level: item.ocean_level,
      rank: index + 1
    }));
  }
};
