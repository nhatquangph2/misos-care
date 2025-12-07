'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, parseISO, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { UserGoal, ActionCompletion } from '@/types/goals';

interface GoalProgressChartProps {
  goal: UserGoal;
  completions?: ActionCompletion[];
  viewMode?: 'daily' | 'weekly' | 'monthly';
}

export function GoalProgressChart({ goal, completions = [], viewMode = 'daily' }: GoalProgressChartProps) {
  const chartData = useMemo(() => {
    const startDate = parseISO(goal.start_date);
    const endDate = parseISO(goal.target_date);
    const today = new Date();

    // Tạo danh sách các điểm thời gian
    let datePoints: Date[] = [];

    switch (viewMode) {
      case 'daily':
        datePoints = eachDayOfInterval({ start: startDate, end: today < endDate ? today : endDate });
        break;
      case 'weekly':
        datePoints = eachWeekOfInterval({ start: startDate, end: today < endDate ? today : endDate });
        break;
      case 'monthly':
        datePoints = eachMonthOfInterval({ start: startDate, end: today < endDate ? today : endDate });
        break;
    }

    // Tính toán tiến độ cho mỗi điểm thời gian
    const data = datePoints.map((date, index) => {
      const dateStr = format(date, 'yyyy-MM-dd');

      // Đếm số lần hoàn thành trước hoặc trong ngày này
      const completionCount = completions.filter(
        c => parseISO(c.completion_date) <= date
      ).length;

      // Tính phần trăm hoàn thành thực tế
      const actualProgress = goal.target_value
        ? Math.min(100, (completionCount / goal.target_value) * 100)
        : (index / datePoints.length) * 100;

      // Tính phần trăm hoàn thành mục tiêu (đường thẳng từ 0 đến 100)
      const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const elapsedDays = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const targetProgress = (elapsedDays / totalDays) * 100;

      return {
        date: dateStr,
        displayDate: format(date, viewMode === 'daily' ? 'dd/MM' : viewMode === 'weekly' ? 'dd/MM' : 'MM/yyyy', { locale: vi }),
        actual: Math.round(actualProgress * 10) / 10,
        target: Math.round(targetProgress * 10) / 10,
        completions: completionCount,
      };
    });

    return data;
  }, [goal, completions, viewMode]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium mb-1">{payload[0].payload.displayDate}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Thực tế: {payload[0].value}%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mục tiêu: {payload[1].value}%
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Hoàn thành: {payload[0].payload.completions} lần
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiến độ theo thời gian</CardTitle>
        <CardDescription>
          So sánh giữa tiến độ thực tế và tiến độ mục tiêu của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="displayDate"
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              className="text-xs"
              tick={{ fontSize: 12 }}
              label={{ value: 'Tiến độ (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px' }}
              formatter={(value) => value === 'actual' ? 'Thực tế' : 'Mục tiêu'}
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#colorTarget)"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorActual)"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Tiến độ thực tế</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Tiến độ mục tiêu</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
