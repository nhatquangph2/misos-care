'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CheckInOverlay from '@/components/dashboard/CheckInOverlay';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMascotStore } from '@/stores/mascotStore';
import { getTodayQuote } from '@/constants/quotes';
import { getRecommendationByMood, type UserMood } from '@/lib/mood-recommendations';

export default function DashboardPage() {
  // Check-in state
  const todayStr = new Date().toISOString().split('T')[0];
  const [lastCheckIn, setLastCheckIn] = useLocalStorage<string>('last_daily_checkin', '');
  const [currentMood, setCurrentMood] = useLocalStorage<UserMood>('current_mood', 'neutral');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Get streak from mascot store
  const { userStats, updateStreak } = useMascotStore();

  // Get today's quote (memoized)
  const todayQuote = useMemo(() => getTodayQuote(), []);

  // Get recommendation based on mood
  const recommendation = useMemo(() => getRecommendationByMood(currentMood), [currentMood]);

  useEffect(() => {
    setIsClient(true);
    // Update streak on page load
    updateStreak();
    // Show check-in if not done today
    if (lastCheckIn !== todayStr) {
      setShowCheckIn(true);
    }
  }, [lastCheckIn, todayStr, updateStreak]);

  const handleCheckInComplete = (mood: UserMood) => {
    setLastCheckIn(todayStr);
    setCurrentMood(mood);
    setShowCheckIn(false);
    // Restoration of scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  if (!isClient) return null;

  const RecommendationIcon = recommendation.icon;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative">
      {showCheckIn && <CheckInOverlay onComplete={handleCheckInComplete} />}

      <div className="w-full max-w-4xl space-y-10">

        {/* Streak Badge */}
        {userStats.currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg">
              <Flame className="h-5 w-5" />
              <span className="font-bold">{userStats.currentStreak} ngày liên tiếp!</span>
            </div>
          </motion.div>
        )}

        {/* Daily Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <Quote className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest font-medium">Châm ngôn hôm nay</span>
          </div>
          <p className="text-xl md:text-2xl font-serif text-slate-700 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed italic">
            "{todayQuote.text}"
          </p>
          {todayQuote.author && (
            <p className="text-sm text-slate-500 dark:text-slate-400">— {todayQuote.author}</p>
          )}
        </motion.div>

        {/* Mood-based Recommendation Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full"
        >
          <Card className={`border-none shadow-xl bg-gradient-to-br ${recommendation.colorClass} overflow-hidden relative`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 dark:bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <CardContent className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="p-5 bg-white dark:bg-slate-800 rounded-full shadow-sm shrink-0">
                <RecommendationIcon className={`h-10 w-10 ${recommendation.iconColorClass}`} />
              </div>

              <div className="space-y-3 flex-1 text-center md:text-left">
                <div className="uppercase tracking-widest text-xs font-bold text-slate-500 dark:text-slate-400">
                  Gợi ý cho bạn
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">
                  {recommendation.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {recommendation.description}
                </p>
                <div className="pt-2">
                  <Link href={recommendation.actionHref}>
                    <Button className="rounded-full px-6">
                      {recommendation.actionLabel} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Link href="/tests" className="group">
            <div className="p-4 rounded-2xl glass-card backdrop-blur-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all text-center">
              <div className="text-2xl mb-2">📝</div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Bài Test</span>
            </div>
          </Link>
          <Link href="/my-path" className="group">
            <div className="p-4 rounded-2xl glass-card backdrop-blur-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all text-center">
              <div className="text-2xl mb-2">📊</div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Hành trình</span>
            </div>
          </Link>
          <Link href="/sanctuary" className="group">
            <div className="p-4 rounded-2xl glass-card backdrop-blur-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all text-center">
              <div className="text-2xl mb-2">🌸</div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Vườn</span>
            </div>
          </Link>
          <Link href="/expertise" className="group">
            <div className="p-4 rounded-2xl glass-card backdrop-blur-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all text-center">
              <div className="text-2xl mb-2">🤖</div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Chat</span>
            </div>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
