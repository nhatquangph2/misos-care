'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { gamificationService, type GamificationState } from '@/services/gamification.service';
import { motion } from 'framer-motion';

interface OceanLevelCardProps {
  userId: string;
}

/**
 * Card hiển thị level đại dương và tiến độ của user
 */
export default function OceanLevelCard({ userId }: OceanLevelCardProps) {
  const [state, setState] = useState<GamificationState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGamificationState() {
      try {
        const data = await gamificationService.getGamificationState(userId);
        setState(data);
      } catch (error) {
        console.error('Error loading gamification state:', error);
      } finally {
        setLoading(false);
      }
    }

    loadGamificationState();

    // Subscribe to changes
    const supabase = createClient();
    const channel = supabase
      .channel('gamification-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_gamification',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setState(payload.new as GamificationState);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-6 animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    );
  }

  if (!state) {
    return null;
  }

  const { currentLevel, nextLevel, progress, bubblesNeeded } =
    gamificationService.calculateProgress(state.bubbles, state.ocean_level);

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Cấp độ đại dương
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{currentLevel.icon}</span>
            <div>
              <div className="font-bold text-xl glass-text">
                {currentLevel.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Level {currentLevel.level}
              </div>
            </div>
          </div>
        </div>

        {/* Bubbles Count */}
        <div className="text-center">
          <motion.div
            key={state.bubbles}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold"
            style={{ color: currentLevel.color }}
          >
            {state.bubbles}
          </motion.div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            🫧 Bubbles
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {nextLevel && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Tiến độ đến {nextLevel.name}
            </span>
            <span className="font-medium glass-text">
              {progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`,
              }}
            />
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-400 text-right">
            Cần thêm {bubblesNeeded} bubbles
          </div>
        </div>
      )}

      {/* Streak */}
      {state.streak_days > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t border-white/20">
          <span className="text-2xl">🔥</span>
          <div className="text-sm">
            <span className="font-bold glass-text">{state.streak_days} ngày</span>
            <span className="text-gray-600 dark:text-gray-400"> liên tiếp</span>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="text-sm text-gray-600 dark:text-gray-400 italic pt-2 border-t border-white/20">
        {currentLevel.description}
      </div>
    </div>
  );
}
