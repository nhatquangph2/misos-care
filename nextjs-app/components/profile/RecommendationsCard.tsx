'use client';

import { Card } from '@/components/ui/card';
import type { Recommendation } from '@/types/profile';
import Link from 'next/link';

interface RecommendationsCardProps {
  recommendations: Recommendation[];
}

const PRIORITY_CONFIG: Record<string, { color: string; bgColor: string }> = {
  high: { color: 'text-red-700', bgColor: 'bg-red-100' },
  medium: { color: 'text-orange-700', bgColor: 'bg-orange-100' },
  low: { color: 'text-blue-700', bgColor: 'bg-blue-100' },
};

export default function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-400 mb-4 text-5xl">💡</div>
        <h3 className="text-xl font-semibold mb-2">Chưa Có Đề Xuất</h3>
        <p className="text-gray-600">
          Hoàn thành bài test để nhận đề xuất cá nhân hóa
        </p>
      </Card>
    );
  }

  // Sort by priority
  const sortedRecs = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>💡</span>
        Đề Xuất Cho Bạn
      </h3>

      <div className="space-y-4">
        {sortedRecs.map((rec) => {
          const priorityStyle = PRIORITY_CONFIG[rec.priority];

          return (
            <div
              key={rec.id}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0">{rec.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                    {rec.priority === 'high' && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityStyle.bgColor} ${priorityStyle.color} font-medium`}>
                        Quan trọng
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {rec.description}
                  </p>

                  {rec.actionText && rec.actionUrl && (
                    <Link
                      href={rec.actionUrl}
                      className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      {rec.actionText}
                      <span>→</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-900">
          <span className="font-semibold">💡 Mẹo:</span> Những đề xuất này được cá nhân hóa dựa trên tính cách và tình trạng sức khỏe tinh thần của bạn. Hãy thử áp dụng từng bước một!
        </p>
      </div>
    </Card>
  );
}
