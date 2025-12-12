'use client';

import { Card } from '@/components/ui/card';
import type { MentalHealthRecord } from '@/types/profile';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface TestHistoryProps {
  records: MentalHealthRecord[];
}

const TEST_LABELS: Record<string, string> = {
  'DASS21-depression': 'Trầm Cảm',
  'DASS21-anxiety': 'Lo Âu',
  'DASS21-stress': 'Stress',
  'PHQ-9': 'PHQ-9 (Trầm Cảm)',
  'GAD-7': 'GAD-7 (Lo Âu)',
  'PSS-10': 'PSS-10 (Stress)',
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  normal: { label: 'Bình thường', color: 'text-green-700 dark:text-green-300', bgColor: 'bg-green-100 dark:bg-green-900/40' },
  mild: { label: 'Nhẹ', color: 'text-yellow-700 dark:text-yellow-300', bgColor: 'bg-yellow-100 dark:bg-yellow-900/40' },
  moderate: { label: 'Trung bình', color: 'text-orange-700 dark:text-orange-300', bgColor: 'bg-orange-100 dark:bg-orange-900/40' },
  severe: { label: 'Nặng', color: 'text-red-700 dark:text-red-300', bgColor: 'bg-red-100 dark:bg-red-900/40' },
  'extremely-severe': { label: 'Rất nặng', color: 'text-red-900 dark:text-red-200', bgColor: 'bg-red-200 dark:bg-red-900/50' },
  critical: { label: 'Nguy kịch', color: 'text-red-900 dark:text-red-200', bgColor: 'bg-red-300 dark:bg-red-900/60' },
};

export default function TestHistory({ records }: TestHistoryProps) {
  if (!records || records.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4 text-5xl">📋</div>
        <h3 className="text-xl font-semibold mb-2">Chưa Có Lịch Sử Test</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Các bài test bạn làm sẽ được lưu lại ở đây
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>📋</span>
        Lịch Sử Bài Test
      </h3>

      <div className="space-y-3">
        {records.map((record) => {
          const severity = SEVERITY_CONFIG[record.severity_level] || SEVERITY_CONFIG.normal;

          return (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {TEST_LABELS[record.test_type] || record.test_type}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${severity.bgColor} ${severity.color} font-medium`}>
                    {severity.label}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(record.created_at), 'dd MMMM yyyy, HH:mm', { locale: vi })}
                </div>
              </div>

              <div className="text-right ml-3">
                <div className={`text-2xl font-bold ${severity.color}`}>
                  {record.total_score || record.score || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">điểm</div>
              </div>
            </div>
          );
        })}
      </div>

      {records.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
            Xem tất cả ({records.length} bài test)
          </button>
        </div>
      )}
    </Card>
  );
}
