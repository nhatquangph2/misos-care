'use client';

import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MentalHealthTrend } from '@/types/profile';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface MentalHealthChartProps {
  trends: MentalHealthTrend[];
}

export default function MentalHealthChart({ trends }: MentalHealthChartProps) {
  if (!trends || trends.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-400 mb-4 text-5xl">📊</div>
        <h3 className="text-xl font-semibold mb-2">Chưa Có Dữ Liệu Theo Dõi</h3>
        <p className="text-gray-600">
          Làm bài test DASS-21 để bắt đầu theo dõi sức khỏe tinh thần của bạn
        </p>
      </Card>
    );
  }

  // Format data for chart
  const chartData = trends.map(trend => ({
    date: format(new Date(trend.date), 'dd/MM', { locale: vi }),
    fullDate: format(new Date(trend.date), 'dd MMMM yyyy', { locale: vi }),
    'Trầm Cảm': trend.depression,
    'Lo Âu': trend.anxiety,
    'Stress': trend.stress,
  }));

  // Calculate averages
  const avgDepression = Math.round(
    trends.reduce((sum, t) => sum + t.depression, 0) / trends.length
  );
  const avgAnxiety = Math.round(
    trends.reduce((sum, t) => sum + t.anxiety, 0) / trends.length
  );
  const avgStress = Math.round(
    trends.reduce((sum, t) => sum + t.stress, 0) / trends.length
  );

  // Get latest scores
  const latest = trends[trends.length - 1];

  const getSeverityColor = (score: number) => {
    if (score < 10) return 'text-green-600';
    if (score < 20) return 'text-yellow-600';
    if (score < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSeverityLabel = (score: number) => {
    if (score < 10) return 'Bình thường';
    if (score < 20) return 'Nhẹ';
    if (score < 30) return 'Trung bình';
    return 'Nặng';
  };

  return (
    <div className="space-y-6">
      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Trầm Cảm</h4>
            <span className="text-2xl">😔</span>
          </div>
          <div className={`text-3xl font-bold ${getSeverityColor(latest.depression)}`}>
            {latest.depression}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getSeverityLabel(latest.depression)} • TB: {avgDepression}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Lo Âu</h4>
            <span className="text-2xl">😰</span>
          </div>
          <div className={`text-3xl font-bold ${getSeverityColor(latest.anxiety)}`}>
            {latest.anxiety}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getSeverityLabel(latest.anxiety)} • TB: {avgAnxiety}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Stress</h4>
            <span className="text-2xl">😓</span>
          </div>
          <div className={`text-3xl font-bold ${getSeverityColor(latest.stress)}`}>
            {latest.stress}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getSeverityLabel(latest.stress)} • TB: {avgStress}
          </div>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📈</span>
          Biểu Đồ Theo Dõi Sức Khỏe Tinh Thần
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="#888"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#888"
              domain={[0, 42]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '12px',
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullDate;
                }
                return label;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Trầm Cảm"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Lo Âu"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Stress"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">Cách Đọc Biểu Đồ:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-semibold text-green-600">0-9:</span> Bình thường
            </div>
            <div>
              <span className="font-semibold text-yellow-600">10-19:</span> Nhẹ
            </div>
            <div>
              <span className="font-semibold text-orange-600">20-29:</span> Trung bình
            </div>
            <div>
              <span className="font-semibold text-red-600">30+:</span> Nặng
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
