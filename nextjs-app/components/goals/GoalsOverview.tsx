'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { UserGoal, GoalCategory, GoalStatus } from '@/types/goals';

interface GoalsOverviewProps {
  goals: UserGoal[];
  onCreateGoal?: () => void;
  onEditGoal?: (goal: UserGoal) => void;
  onCompleteGoal?: (goalId: string) => void;
}

export default function GoalsOverview({
  goals,
  onCreateGoal,
  onEditGoal,
  onCompleteGoal,
}: GoalsOverviewProps) {
  const [filter, setFilter] = useState<GoalStatus | 'all'>('active');

  const filteredGoals = filter === 'all' ? goals : goals.filter(g => g.status === filter);
  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mục Tiêu Đang Thực Hiện</p>
              <p className="text-3xl font-bold text-blue-600">{activeGoals.length}</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã Hoàn Thành</p>
              <p className="text-3xl font-bold text-green-600">{completedGoals.length}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng Mục Tiêu</p>
              <p className="text-3xl font-bold text-purple-600">{goals.length}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </Card>
      </div>

      {/* Filter & Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Đang Thực Hiện
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Đã Hoàn Thành
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Tất Cả
          </Button>
        </div>

        {onCreateGoal && (
          <Button onClick={onCreateGoal} className="gap-2">
            <span>➕</span>
            Tạo Mục Tiêu Mới
          </Button>
        )}
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Chưa Có Mục Tiêu</h3>
          <p className="text-gray-600 mb-4">
            Hãy tạo mục tiêu đầu tiên để bắt đầu hành trình phát triển bản thân!
          </p>
          {onCreateGoal && (
            <Button onClick={onCreateGoal} className="gap-2">
              <span>➕</span>
              Tạo Mục Tiêu Đầu Tiên
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={onEditGoal}
              onComplete={onCompleteGoal}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// GOAL CARD COMPONENT
// ============================================

interface GoalCardProps {
  goal: UserGoal;
  onEdit?: (goal: UserGoal) => void;
  onComplete?: (goalId: string) => void;
}

function GoalCard({ goal, onEdit, onComplete }: GoalCardProps) {
  const getCategoryIcon = (category: GoalCategory) => {
    const icons: Record<GoalCategory, string> = {
      mental_health: '🧠',
      personality_growth: '🌱',
      habits: '⚡',
      relationships: '💝',
      career: '💼',
      custom: '🎯',
    };
    return icons[category];
  };

  const getCategoryLabel = (category: GoalCategory) => {
    const labels: Record<GoalCategory, string> = {
      mental_health: 'Sức Khỏe Tinh Thần',
      personality_growth: 'Phát Triển Tính Cách',
      habits: 'Thói Quen',
      relationships: 'Mối Quan Hệ',
      career: 'Sự Nghiệp',
      custom: 'Khác',
    };
    return labels[category];
  };

  const getStatusColor = (status: GoalStatus) => {
    const colors: Record<GoalStatus, string> = {
      active: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      paused: 'bg-yellow-100 text-yellow-700',
      abandoned: 'bg-gray-100 text-gray-700',
    };
    return colors[status];
  };

  const getStatusLabel = (status: GoalStatus) => {
    const labels: Record<GoalStatus, string> = {
      active: 'Đang Thực Hiện',
      completed: 'Hoàn Thành',
      paused: 'Tạm Dừng',
      abandoned: 'Đã Bỏ',
    };
    return labels[status];
  };

  const daysRemaining = Math.ceil(
    (new Date(goal.target_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
              <Badge variant="secondary">{getCategoryLabel(goal.category)}</Badge>
              <Badge className={getStatusColor(goal.status)}>
                {getStatusLabel(goal.status)}
              </Badge>
            </div>
            <h3 className="text-xl font-bold mb-1">{goal.title}</h3>
            {goal.description && (
              <p className="text-gray-600 text-sm">{goal.description}</p>
            )}
          </div>

          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(goal)}
              >
                ✏️
              </Button>
            )}
            {goal.status === 'active' && onComplete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComplete(goal.id)}
                className="text-green-600 hover:text-green-700"
              >
                ✓
              </Button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tiến độ</span>
            <span className="font-semibold">{goal.completion_percentage}%</span>
          </div>
          <Progress value={goal.completion_percentage} className="h-2" />
        </div>

        {/* Target Info */}
        {goal.target_metric && goal.target_value && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex-1">
              <p className="text-gray-600">Hiện tại</p>
              <p className="font-semibold">{goal.current_value}</p>
            </div>
            <div className="flex-1">
              <p className="text-gray-600">Mục tiêu</p>
              <p className="font-semibold">{goal.target_value}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="flex items-center justify-between text-sm pt-2 border-t">
          <div>
            <span className="text-gray-600">Hạn: </span>
            <span className="font-medium">
              {new Date(goal.target_date).toLocaleDateString('vi-VN')}
            </span>
          </div>
          {goal.status === 'active' && (
            <div className={daysRemaining < 7 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
              {daysRemaining > 0 ? (
                <>Còn {daysRemaining} ngày</>
              ) : (
                <>Quá hạn {Math.abs(daysRemaining)} ngày</>
              )}
            </div>
          )}
        </div>

        {/* Motivation */}
        {goal.motivation_text && (
          <div className="bg-purple-50 p-3 rounded-lg text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">💪 Động lực: </span>
              {goal.motivation_text}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
