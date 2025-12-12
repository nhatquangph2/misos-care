'use client';

import { Card } from '@/components/ui/card';
import type { PersonalityProfile } from '@/types/profile';

interface PersonalityOverviewProps {
  profile: PersonalityProfile | null;
}

const MBTI_INFO: Record<string, { name: string; color: string; icon: string }> = {
  INTJ: { name: 'Nhà Kiến Trúc', color: 'bg-purple-500', icon: '🏛️' },
  INTP: { name: 'Nhà Logic Học', color: 'bg-blue-500', icon: '🧠' },
  ENTJ: { name: 'Nhà Chỉ Huy', color: 'bg-red-500', icon: '👔' },
  ENTP: { name: 'Nhà Tranh Luận', color: 'bg-orange-500', icon: '💡' },
  INFJ: { name: 'Người Ủng Hộ', color: 'bg-teal-500', icon: '🌟' },
  INFP: { name: 'Người Hòa Giải', color: 'bg-pink-500', icon: '🌸' },
  ENFJ: { name: 'Nhân Vật Chính', color: 'bg-green-500', icon: '🎭' },
  ENFP: { name: 'Người Vận Động', color: 'bg-yellow-500', icon: '🎨' },
  ISTJ: { name: 'Nhà Hậu Cần', color: 'bg-gray-600', icon: '📋' },
  ISFJ: { name: 'Người Bảo Vệ', color: 'bg-cyan-500', icon: '🛡️' },
  ESTJ: { name: 'Nhà Điều Hành', color: 'bg-indigo-600', icon: '⚖️' },
  ESFJ: { name: 'Lãnh Sự', color: 'bg-rose-500', icon: '🤝' },
  ISTP: { name: 'Nghệ Nhân', color: 'bg-amber-600', icon: '🔧' },
  ISFP: { name: 'Nhà Thám Hiểm', color: 'bg-lime-500', icon: '🎪' },
  ESTP: { name: 'Doanh Nhân', color: 'bg-red-600', icon: '💼' },
  ESFP: { name: 'Người Biểu Diễn', color: 'bg-fuchsia-500', icon: '🎤' },
};

const BIG5_TRAITS = {
  openness: { name: 'Cởi Mở', icon: '🌈', color: 'text-purple-600 dark:text-purple-400', description: 'Sáng tạo, tò mò' },
  conscientiousness: { name: 'Tận Tâm', icon: '✓', color: 'text-blue-600 dark:text-blue-400', description: 'Kỷ luật, có tổ chức' },
  extraversion: { name: 'Hướng Ngoại', icon: '🎉', color: 'text-orange-600 dark:text-orange-400', description: 'Năng động, xã giao' },
  agreeableness: { name: 'Dễ Chịu', icon: '🤗', color: 'text-green-600 dark:text-green-400', description: 'Hòa đồng, hợp tác' },
  neuroticism: { name: 'Bất Ổn Cảm Xúc', icon: '🌊', color: 'text-red-600 dark:text-red-400', description: 'Nhạy cảm, lo âu' },
};

export default function PersonalityOverview({ profile }: PersonalityOverviewProps) {
  if (!profile) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4 text-5xl">🧠</div>
        <h3 className="text-xl font-semibold mb-2">Chưa Có Dữ Liệu Tính Cách</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Làm bài test MBTI và Big Five để khám phá tính cách của bạn
        </p>
        <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition">
          Làm Test Ngay
        </button>
      </Card>
    );
  }

  const mbtiType = profile.mbti_type;
  const mbtiInfo = mbtiType ? MBTI_INFO[mbtiType] : null;

  return (
    <div className="space-y-6">
      {/* MBTI Section */}
      {mbtiType && mbtiInfo && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🧠</span>
            Loại Tính Cách MBTI
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className={`${mbtiInfo.color} text-white px-6 sm:px-8 py-4 rounded-2xl text-center shadow-lg`}>
              <div className="text-4xl mb-2">{mbtiInfo.icon}</div>
              <div className="text-3xl font-bold">{mbtiType}</div>
            </div>
            <div className="flex-1 w-full">
              <h4 className="text-2xl font-bold mb-2 text-center sm:text-left">{mbtiInfo.name}</h4>
              <div className="grid grid-cols-4 gap-1 sm:gap-2 text-sm mt-4">
                <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="font-semibold">{mbtiType[0]}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {mbtiType[0] === 'E' ? 'Hướng Ngoại' : 'Hướng Nội'}
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="font-semibold">{mbtiType[1]}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {mbtiType[1] === 'S' ? 'Thực Tế' : 'Trực Giác'}
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="font-semibold">{mbtiType[2]}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {mbtiType[2] === 'T' ? 'Lý Trí' : 'Cảm Xúc'}
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="font-semibold">{mbtiType[3]}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {mbtiType[3] === 'J' ? 'Nguyên Tắc' : 'Linh Hoạt'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Big Five Section */}
      {profile.big5_openness !== null && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>✨</span>
            Năm Chiều Tính Cách (Big Five)
          </h3>
          <div className="space-y-4">
            {Object.entries(BIG5_TRAITS).map(([key, info]) => {
              // Score is stored as 1-5, convert to percentage (1=0%, 5=100%)
              const rawScore = profile[`big5_${key}` as keyof PersonalityProfile] as number;
              const percentage = Math.round(((rawScore || 1) - 1) / 4 * 100);

              // For neuroticism, lower is better - invert for display meaning
              const isNeuroticism = key === 'neuroticism';
              const displayLabel = isNeuroticism
                ? (percentage >= 60 ? 'Cao (cần chú ý)' : percentage >= 40 ? 'Trung Bình' : 'Thấp (ổn định)')
                : (percentage >= 60 ? 'Cao' : percentage >= 40 ? 'Trung Bình' : 'Thấp');

              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{info.icon}</span>
                      <span className={`font-medium ${info.color}`}>{info.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">{rawScore?.toFixed(1)}/5</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isNeuroticism
                          ? (percentage >= 60 ? 'bg-red-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-green-500')
                          : (percentage >= 60 ? 'bg-green-500' : percentage >= 40 ? 'bg-blue-500' : 'bg-orange-500')
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{displayLabel}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{info.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-xs text-gray-600 dark:text-gray-300">
            <strong>Lưu ý:</strong> Điểm từ 1-5. Với Bất Ổn Cảm Xúc, điểm thấp = ổn định hơn.
          </div>
        </Card>
      )}

      {/* Test Info */}
      {profile.last_updated && (
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Làm test lần cuối:{' '}
          {new Date(profile.last_updated).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      )}
    </div>
  );
}
