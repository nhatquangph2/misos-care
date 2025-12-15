'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoalProgressChart } from '@/components/goals/GoalProgressChart';
import { TestRemindersManager } from '@/components/goals/TestRemindersManager';
import { NotificationSettings } from '@/components/goals/NotificationSettings';
import { goalsService } from '@/services/goals.service';
import { Target, Bell, Settings, TrendingUp } from 'lucide-react';
import type { UserGoal, ActionCompletion } from '@/types/goals';

interface GoalsAndRemindersPageProps {
  userId: string;
}

export function GoalsAndRemindersPage({ userId }: GoalsAndRemindersPageProps) {
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);
  const [completions, setCompletions] = useState<ActionCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load goals
  useEffect(() => {
    loadGoals();
  }, [userId]);

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      const data = await goalsService.getUserGoals(userId, 'active');
      setGoals(data);

      if (data.length > 0 && !selectedGoal) {
        setSelectedGoal(data[0]);
        loadCompletions(data[0].id);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompletions = async (goalId: string) => {
    try {
      // Get action plans for this goal
      const actionPlans = await goalsService.getActionPlansByGoal(goalId);

      // Get all completions for these action plans
      const allCompletions: ActionCompletion[] = [];
      for (const plan of actionPlans) {
        const planCompletions = await goalsService.getActionCompletions(plan.id);
        allCompletions.push(...planCompletions);
      }

      setCompletions(allCompletions);
    } catch (error) {
      console.error('Error loading completions:', error);
    }
  };

  const handleGoalSelect = (goal: UserGoal) => {
    setSelectedGoal(goal);
    loadCompletions(goal.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 relative overflow-hidden">
      <div className="blob-purple -top-10 -left-10" />
      <div className="blob-blue top-0 right-0" />
      <div className="blob-pink bottom-0 left-20" />

      <div className="container mx-auto p-6 max-w-7xl relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2 text-slate-900 dark:text-white">Mục tiêu & Nhắc nhở</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Theo dõi tiến độ mục tiêu và quản lý nhắc nhở làm test định kỳ
          </p>
        </div>

        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glass-card rounded-2xl p-1">
            <TabsTrigger value="goals" className="data-[state=active]:bg-white/70 dark:data-[state=active]:bg-slate-800 rounded-xl">
              <Target className="h-4 w-4 mr-2" />
              Mục tiêu
            </TabsTrigger>
            <TabsTrigger value="reminders" className="data-[state=active]:bg-white/70 dark:data-[state=active]:bg-slate-800 rounded-xl">
              <Bell className="h-4 w-4 mr-2" />
              Nhắc nhở
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white/70 dark:data-[state=active]:bg-slate-800 rounded-xl">
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt
            </TabsTrigger>
          </TabsList>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            {isLoading ? (
              <Card className="glass-card shape-organic-3">
                <CardContent className="p-8 text-center text-slate-700 dark:text-slate-200">
                  Đang tải...
                </CardContent>
              </Card>
            ) : goals.length === 0 ? (
              <Card className="glass-card shape-organic-2">
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-60 text-purple-500" />
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Chưa có mục tiêu nào</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tạo mục tiêu mới để theo dõi tiến độ của bạn
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Goal Selection */}
                <Card className="glass-card shape-organic-1 border border-white/60 dark:border-white/10">
                  <CardHeader>
                    <CardTitle>Chọn mục tiêu</CardTitle>
                    <CardDescription>
                      Xem tiến độ của các mục tiêu đang hoạt động
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {goals.map((goal) => (
                        <Button
                          key={goal.id}
                          variant={selectedGoal?.id === goal.id ? 'default' : 'outline'}
                          className={`h-auto p-4 justify-start text-left glass-card ${selectedGoal?.id === goal.id ? 'border-purple-500/70' : 'border-white/40'}`}
                          onClick={() => handleGoalSelect(goal)}
                        >
                          <div className="flex-1">
                            <div className="font-medium mb-1">{goal.title}</div>
                            <div className="text-xs opacity-80">
                              {goal.completion_percentage}% hoàn thành
                            </div>
                          </div>
                          <TrendingUp className="h-5 w-5 ml-2" />
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Chart */}
                {selectedGoal && (
                  <>
                    <Card className="glass-card shape-organic-3 border border-white/60 dark:border-white/10">
                      <CardHeader>
                        <CardTitle>{selectedGoal.title}</CardTitle>
                        <CardDescription>{selectedGoal.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="p-4 glass-card rounded-2xl border border-purple-100/60 dark:border-purple-800/40">
                            <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Tiến độ</div>
                            <div className="text-2xl font-bold text-purple-700 dark:text-purple-200">
                              {selectedGoal.completion_percentage}%
                            </div>
                          </div>
                          <div className="p-4 glass-card rounded-2xl border border-blue-100/60 dark:border-blue-800/40">
                            <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Giá trị hiện tại</div>
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-200">
                              {selectedGoal.current_value}
                              {selectedGoal.target_value && ` / ${selectedGoal.target_value}`}
                            </div>
                          </div>
                          <div className="p-4 glass-card rounded-2xl border border-emerald-100/60 dark:border-emerald-800/40">
                            <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Số lần hoàn thành</div>
                            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-200">{completions.length}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <GoalProgressChart
                      goal={selectedGoal}
                      completions={completions}
                      viewMode="daily"
                    />
                  </>
                )}
              </>
            )}
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders">
            <div className="glass-card shape-organic-3 p-4">
              <TestRemindersManager userId={userId} />
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="glass-card shape-organic-1 p-4 border border-white/60 dark:border-white/10">
              <NotificationSettings />
            </div>

            <Card className="glass-card shape-organic-4 border border-white/60 dark:border-white/10">
              <CardHeader>
                <CardTitle>Hướng dẫn sử dụng</CardTitle>
                <CardDescription>
                  Cách sử dụng tính năng mục tiêu và nhắc nhở
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="glass-card p-4 rounded-2xl border border-white/40 dark:border-white/10">
                  <h4 className="font-medium mb-1">1. Mục tiêu</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Theo dõi tiến độ các mục tiêu sức khỏe tinh thần của bạn qua biểu đồ trực quan.
                  </p>
                </div>
                <div className="glass-card p-4 rounded-2xl border border-white/40 dark:border-white/10">
                  <h4 className="font-medium mb-1">2. Nhắc nhở test</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Thiết lập lịch nhắc nhở để không bỏ lỡ các bài test định kỳ quan trọng.
                  </p>
                </div>
                <div className="glass-card p-4 rounded-2xl border border-white/40 dark:border-white/10">
                  <h4 className="font-medium mb-1">3. Thông báo</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Bật thông báo để nhận nhắc nhở kịp thời ngay cả khi không mở ứng dụng.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
