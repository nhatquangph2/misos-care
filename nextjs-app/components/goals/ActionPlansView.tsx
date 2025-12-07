'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ActionPlan, ActionType, FrequencyType } from '@/types/goals';

interface ActionPlansViewProps {
  actionPlans: ActionPlan[];
  onCreatePlan?: () => void;
  onEditPlan?: (plan: ActionPlan) => void;
  onCompletePlan?: (planId: string) => void;
  onTogglePlan?: (planId: string, isActive: boolean) => void;
}

export default function ActionPlansView({
  actionPlans,
  onCreatePlan,
  onEditPlan,
  onCompletePlan,
  onTogglePlan,
}: ActionPlansViewProps) {
  const [filter, setFilter] = useState<'active' | 'all'>('active');

  const filteredPlans = filter === 'active'
    ? actionPlans.filter(p => p.is_active)
    : actionPlans;

  const activePlans = actionPlans.filter(p => p.is_active);
  const totalCompletions = actionPlans.reduce((sum, p) => sum + p.total_completions, 0);
  const longestStreak = Math.max(0, ...actionPlans.map(p => p.longest_streak));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kế Hoạch Đang Chạy</p>
              <p className="text-3xl font-bold text-orange-600">{activePlans.length}</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng Lần Hoàn Thành</p>
              <p className="text-3xl font-bold text-green-600">{totalCompletions}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chuỗi Dài Nhất</p>
              <p className="text-3xl font-bold text-purple-600">{longestStreak} ngày</p>
            </div>
            <div className="text-4xl">🔥</div>
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
            Đang Hoạt Động
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Tất Cả
          </Button>
        </div>

        {onCreatePlan && (
          <Button onClick={onCreatePlan} className="gap-2">
            <span>➕</span>
            Tạo Kế Hoạch Mới
          </Button>
        )}
      </div>

      {/* Action Plans List */}
      {filteredPlans.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Chưa Có Kế Hoạch Hành Động</h3>
          <p className="text-gray-600 mb-4">
            Tạo kế hoạch hành động cụ thể để đạt được mục tiêu của bạn!
          </p>
          {onCreatePlan && (
            <Button onClick={onCreatePlan} className="gap-2">
              <span>➕</span>
              Tạo Kế Hoạch Đầu Tiên
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlans.map((plan) => (
            <ActionPlanCard
              key={plan.id}
              plan={plan}
              onEdit={onEditPlan}
              onComplete={onCompletePlan}
              onToggle={onTogglePlan}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// ACTION PLAN CARD
// ============================================

interface ActionPlanCardProps {
  plan: ActionPlan;
  onEdit?: (plan: ActionPlan) => void;
  onComplete?: (planId: string) => void;
  onToggle?: (planId: string, isActive: boolean) => void;
}

function ActionPlanCard({ plan, onEdit, onComplete, onToggle }: ActionPlanCardProps) {
  const getActionTypeIcon = (type: ActionType) => {
    const icons: Record<ActionType, string> = {
      daily_habit: '📅',
      weekly_habit: '📆',
      one_time: '🎯',
      test_schedule: '📝',
      custom: '⚡',
    };
    return icons[type];
  };

  const getActionTypeLabel = (type: ActionType) => {
    const labels: Record<ActionType, string> = {
      daily_habit: 'Thói Quen Hàng Ngày',
      weekly_habit: 'Thói Quen Hàng Tuần',
      one_time: 'Một Lần',
      test_schedule: 'Lịch Test',
      custom: 'Tùy Chỉnh',
    };
    return labels[type];
  };

  const getFrequencyLabel = (type?: FrequencyType, value?: number, days?: string[]) => {
    if (!type) return null;

    if (type === 'daily') return 'Mỗi ngày';
    if (type === 'weekly' && value) return `${value} lần/tuần`;
    if (type === 'monthly' && value) return `${value} lần/tháng`;
    if (type === 'custom' && days && days.length > 0) {
      const dayLabels: Record<string, string> = {
        monday: 'T2',
        tuesday: 'T3',
        wednesday: 'T4',
        thursday: 'T5',
        friday: 'T6',
        saturday: 'T7',
        sunday: 'CN',
      };
      return days.map(d => dayLabels[d]).join(', ');
    }
    return 'Tùy chỉnh';
  };

  return (
    <Card className={`p-5 ${plan.is_active ? 'border-l-4 border-l-blue-500' : 'opacity-60'}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{getActionTypeIcon(plan.action_type)}</span>
              <Badge variant="secondary">{getActionTypeLabel(plan.action_type)}</Badge>
              {!plan.is_active && (
                <Badge variant="outline" className="text-gray-500">
                  Tạm Dừng
                </Badge>
              )}
            </div>
            <h3 className="font-bold text-lg mb-1">{plan.title}</h3>
            {plan.description && (
              <p className="text-gray-600 text-sm">{plan.description}</p>
            )}
          </div>

          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(plan)}
              >
                ✏️
              </Button>
            )}
            {onToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggle(plan.id, !plan.is_active)}
              >
                {plan.is_active ? '⏸' : '▶️'}
              </Button>
            )}
          </div>
        </div>

        {/* Frequency */}
        {plan.frequency_type && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Tần suất:</span>
            <Badge variant="outline">
              {getFrequencyLabel(plan.frequency_type, plan.frequency_value, plan.frequency_days)}
            </Badge>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-600">Đã hoàn thành</p>
            <p className="text-xl font-bold text-blue-600">{plan.total_completions}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">Streak hiện tại</p>
            <p className="text-xl font-bold text-orange-600">{plan.current_streak} 🔥</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">Kỷ lục</p>
            <p className="text-xl font-bold text-purple-600">{plan.longest_streak} 🏆</p>
          </div>
        </div>

        {/* Reminder */}
        {plan.reminder_enabled && plan.reminder_time && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🔔</span>
            <span>Nhắc nhở lúc {plan.reminder_time}</span>
          </div>
        )}

        {/* Complete Button */}
        {plan.is_active && onComplete && (
          <Button
            onClick={() => onComplete(plan.id)}
            className="w-full gap-2"
            variant="default"
          >
            <span>✓</span>
            Đánh Dấu Hoàn Thành Hôm Nay
          </Button>
        )}

        {/* Last Completed */}
        {plan.last_completed_at && (
          <div className="text-xs text-gray-500 text-center">
            Lần cuối: {new Date(plan.last_completed_at).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
