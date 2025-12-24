'use client';

import { Card } from '@/components/ui/card';
import type { Recommendation } from '@/types/profile';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, BookOpen, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface DetailedRecommendationsProps {
  recommendations: Recommendation[];
}

const CATEGORY_CONFIG: Record<string, { title: string; icon: any; color: string; bgColor: string }> = {
  career: {
    title: 'Nghề nghiệp & Sự nghiệp',
    icon: '💼',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  mental: {
    title: 'Sức khỏe tinh thần',
    icon: '✅',
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  learning: {
    title: 'Phong cách học tập',
    icon: '📚',
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  relationship: {
    title: 'Giao tiếp & Quan hệ',
    icon: '💬',
    color: 'text-pink-700 dark:text-pink-300',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20'
  },
  sport: {
    title: 'Thể thao & Hoạt động',
    icon: '🏃',
    color: 'text-orange-700 dark:text-orange-300',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  },
  hobby: {
    title: 'Sở thích & Lifestyle',
    icon: '🎨',
    color: 'text-yellow-700 dark:text-yellow-300',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  music: {
    title: 'Nhạc cụ',
    icon: '🎵',
    color: 'text-indigo-700 dark:text-indigo-300',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
  },
};

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract category from rec.id (e.g., "career-0" -> "career")
  const category = rec.id.split('-')[0];
  const config = CATEGORY_CONFIG[category] || {
    title: 'Khác',
    icon: '💡',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50'
  };

  // Parse description to extract sections
  const descriptionLines = rec.description.split('\n');
  const mainReason = descriptionLines[0];

  // Extract structured data from description
  const sections: { label: string; content: string }[] = [];
  let currentSection = '';

  descriptionLines.forEach(line => {
    const boldMatch = line.match(/\*\*(.+?):\*\* (.+)/);
    if (boldMatch) {
      sections.push({
        label: boldMatch[1],
        content: boldMatch[2]
      });
    }
  });

  return (
    <Card className={`${config.bgColor} border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600 transition-all`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl flex-shrink-0">{rec.icon || config.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {rec.title}
              </h3>
              {rec.priority === 'high' && (
                <Badge className="bg-red-500 text-white">Ưu tiên cao</Badge>
              )}
            </div>
            <Badge variant="outline" className={`${config.color} border-current`}>
              {config.title}
            </Badge>
          </div>
        </div>

        {/* Main Reason */}
        <div className="mb-4">
          <div className="flex items-start gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">
                Tại sao phù hợp với bạn?
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {mainReason}
              </p>
            </div>
          </div>
        </div>

        {/* Structured Sections */}
        {sections.length > 0 && (
          <div className="space-y-3 mb-4">
            {sections.map((section, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {section.label.includes('Nghề nghiệp') || section.label.includes('Hoạt động') || section.label.includes('Sở thích') || section.label.includes('Nhạc cụ') ? (
                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                ) : section.label.includes('Lợi ích') ? (
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">
                    {section.label}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expand/Collapse for additional details */}
        {(rec.actionText || sections.length > 2) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition"
          >
            {isExpanded ? (
              <>
                Thu gọn <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Xem chi tiết <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {rec.actionText && rec.actionUrl && (
              <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Bước tiếp theo</h4>
                <a
                  href={rec.actionUrl}
                  className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                >
                  {rec.actionText}
                  <span>→</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default function DetailedRecommendations({ recommendations }: DetailedRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="glass-panel p-12 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4 text-6xl">💡</div>
        <h3 className="text-2xl font-bold mb-3">Chưa Có Đề Xuất</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Hoàn thành các bài test tính cách (MBTI, Big Five) để nhận đề xuất cá nhân hóa dựa trên khoa học tâm lý học
        </p>
      </Card>
    );
  }

  // Group recommendations by category
  const groupedRecs: Record<string, Recommendation[]> = {};
  recommendations.forEach(rec => {
    const category = rec.id.split('-')[0];
    if (!groupedRecs[category]) {
      groupedRecs[category] = [];
    }
    groupedRecs[category].push(rec);
  });

  // Sort by priority within each category
  Object.keys(groupedRecs).forEach(category => {
    groupedRecs[category].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span>🎯</span>
          Đề Xuất Cá Nhân Hóa Dựa Trên Khoa Học
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tất cả đề xuất dưới đây được tạo ra dựa trên phân tích Big Five và MBTI của bạn,
          với bằng chứng từ các nghiên cứu tâm lý học hiện đại.
        </p>
      </div>

      {/* Categorized Recommendations */}
      {Object.entries(groupedRecs).map(([category, recs]) => {
        const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.career;

        return (
          <div key={category} className="space-y-4">
            <div className={`${config.bgColor} p-4 rounded-lg border-l-4 ${config.color.replace('text-', 'border-')}`}>
              <h3 className={`text-lg font-bold ${config.color} flex items-center gap-2`}>
                <span className="text-2xl">{config.icon}</span>
                {config.title}
                <Badge variant="outline" className="ml-auto">
                  {recs.length} đề xuất
                </Badge>
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {recs.map(rec => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Scientific Note */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <div className="p-6">
          <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Về Độ Tin Cậy Khoa Học
          </h4>
          <div className="text-sm text-purple-800 dark:text-purple-300 space-y-2">
            <p>
              Các đề xuất này dựa trên nghiên cứu tâm lý học hiện đại về mối liên hệ giữa tính cách và hành vi:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Rentfrow & Gosling (2003)</strong> - Music and personality</li>
              <li><strong>Greenberg et al. (2015)</strong> - Musical preferences reflect personality</li>
              <li><strong>Corrigall et al. (2013)</strong> - Personality and instrumental music</li>
              <li><strong>Mammadov (2022)</strong> - Big Five and career choices</li>
              <li><strong>Roberts et al. (2007)</strong> - Personality predictors of job performance</li>
            </ul>
            <p className="pt-2 text-xs">
              <strong>Lưu ý:</strong> Đây là đề xuất dựa trên xu hướng chung từ nghiên cứu.
              Mỗi người đều độc đáo - hãy thử nghiệm để tìm ra điều phù hợp nhất với bạn!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
