'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoalsOverview from './GoalsOverview';
import ActionPlansView from './ActionPlansView';
import { goalsService } from '@/services/goals.service';
import { useMascotStore } from '@/stores/mascotStore';
import { GOAL_MESSAGES, ACTION_PLAN_MESSAGES } from '@/constants/mascot-messages';
import type { GoalsSummary } from '@/types/goals';

interface GoalsAndPlansViewProps {
  userId: string;
}

export default function GoalsAndPlansView({ userId }: GoalsAndPlansViewProps) {
  const [data, setData] = useState<GoalsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setMood, addMessage } = useMascotStore();

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const summary = await goalsService.getGoalsSummary(userId);
      setData(summary);
    } catch (err) {
      console.error('Error loading goals:', err);
      setError('Không thể tải dữ liệu mục tiêu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAction = async (planId: string) => {
    try {
      await goalsService.completeAction(userId, {
        action_plan_id: planId,
      });

      // Show mascot celebration
      const message = ACTION_PLAN_MESSAGES.completed;
      setMood(message.mood);
      addMessage(message.text, 'mascot', 'goals');

      await loadData(); // Refresh data

      // Check for streak milestone
      const plan = data?.actionPlans.find(p => p.id === planId);
      if (plan && plan.current_streak > 0 && [7, 14, 30, 100].includes(plan.current_streak)) {
        setTimeout(() => {
          const streakMsg = ACTION_PLAN_MESSAGES.streakMilestone(plan.current_streak);
          setMood(streakMsg.mood);
          addMessage(streakMsg.text, 'mascot', 'goals');
        }, 2000);
      }
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra');
    }
  };

  const handleTogglePlan = async (planId: string, isActive: boolean) => {
    try {
      await goalsService.updateActionPlan(planId, { is_active: isActive });
      await loadData();
    } catch (err) {
      alert('Có lỗi xảy ra');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu mục tiêu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold mb-2">Có Lỗi Xảy Ra</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          Thử Lại
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Mục Tiêu Đang Chạy</p>
          <p className="text-3xl font-bold text-blue-600">{data.stats.activeGoals}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Kế Hoạch Hoạt Động</p>
          <p className="text-3xl font-bold text-green-600">{data.stats.activeActions}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Hoàn Thành Tuần Này</p>
          <p className="text-3xl font-bold text-orange-600">{data.stats.totalCompletionsThisWeek}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
          <p className="text-sm text-gray-600">Streak Dài Nhất</p>
          <p className="text-3xl font-bold text-purple-600">{data.stats.longestStreak} 🔥</p>
        </div>
      </div>

      {/* Tabs for Goals and Action Plans */}
      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="goals" className="gap-2">
            <span>🎯</span>
            <span>Mục Tiêu ({data.goals.length})</span>
          </TabsTrigger>
          <TabsTrigger value="actions" className="gap-2">
            <span>⚡</span>
            <span>Kế Hoạch Hành Động ({data.actionPlans.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals">
          <GoalsOverview
            goals={data.goals}
            onCreateGoal={() => alert('Tính năng tạo mục tiêu sẽ được bổ sung sau')}
            onEditGoal={(goal) => alert(`Chỉnh sửa: ${goal.title}`)}
            onCompleteGoal={async (goalId) => {
              try {
                await goalsService.completeGoal(goalId);

                // Show mascot celebration
                const message = GOAL_MESSAGES.completed;
                setMood(message.mood);
                addMessage(message.text, 'mascot', 'goals');

                await loadData();
              } catch (err) {
                alert('Có lỗi xảy ra');
              }
            }}
          />
        </TabsContent>

        <TabsContent value="actions">
          <ActionPlansView
            actionPlans={data.actionPlans}
            onCreatePlan={() => alert('Tính năng tạo kế hoạch sẽ được bổ sung sau')}
            onEditPlan={(plan) => alert(`Chỉnh sửa: ${plan.title}`)}
            onCompletePlan={handleCompleteAction}
            onTogglePlan={handleTogglePlan}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Add Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span>💡</span>
          Gợi Ý Mục Tiêu Phổ Biến
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <p className="font-medium">🧠 Giảm stress xuống mức moderate</p>
            <p className="text-gray-600 text-xs">Thực hiện test PSS định kỳ và theo dõi tiến độ</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="font-medium">🧘 Thiền 10 phút mỗi ngày</p>
            <p className="text-gray-600 text-xs">Xây dựng thói quen thiền hàng ngày</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="font-medium">📊 Hoàn thành tất cả bài test</p>
            <p className="text-gray-600 text-xs">Làm đầy đủ 7 bài test tính cách & sức khỏe</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="font-medium">🏃 Tập thể dục 3 lần/tuần</p>
            <p className="text-gray-600 text-xs">Duy trì lịch tập thể dục đều đặn</p>
          </div>
        </div>
      </div>
    </div>
  );
}
