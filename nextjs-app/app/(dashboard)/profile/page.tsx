'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersonalityOverview from '@/components/profile/PersonalityOverview';
import MentalHealthChart from '@/components/profile/MentalHealthChart';
import TestHistory from '@/components/profile/TestHistory';
import RecommendationsCard from '@/components/profile/RecommendationsCard';
import GoalsAndPlansView from '@/components/goals/GoalsAndPlansView';
import { profileService } from '@/services/profile.service';
import { createClient } from '@/lib/supabase/client';
import type { ProfileSummary } from '@/types/profile';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileSummary | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user from Supabase session
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('Không thể xác thực người dùng');
      }

      setUserId(user.id);
      const data = await profileService.getProfileSummary(user.id);
      setProfileData(data);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Không thể tải dữ liệu profile. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Có Lỗi Xảy Ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadProfileData}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Thử Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Hồ Sơ Của Tôi
          </h1>
          <p className="text-gray-600">
            Quản lý tính cách, theo dõi sức khỏe tinh thần và nhận đề xuất cá nhân hóa
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
        >
          Đăng Xuất
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">🧠</div>
          <div className="text-2xl font-bold mb-1">
            {profileData?.personality?.mbti_type || '---'}
          </div>
          <div className="text-sm opacity-90">Loại MBTI</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold mb-1">
            {profileData?.mentalHealthRecords?.length || 0}
          </div>
          <div className="text-sm opacity-90">Bài Test</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold mb-1">
            {profileData?.trends?.length || 0}
          </div>
          <div className="text-sm opacity-90">Ngày Theo Dõi</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">💡</div>
          <div className="text-2xl font-bold mb-1">
            {profileData?.recommendations?.length || 0}
          </div>
          <div className="text-sm opacity-90">Đề Xuất</div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <span>🎯</span>
            <span className="hidden sm:inline">Tổng Quan</span>
          </TabsTrigger>
          <TabsTrigger value="personality" className="gap-2">
            <span>🧠</span>
            <span className="hidden sm:inline">Tính Cách</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="gap-2">
            <span>📊</span>
            <span className="hidden sm:inline">Sức Khỏe</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-2">
            <span>🎪</span>
            <span className="hidden sm:inline">Mục Tiêu</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-2">
            <span>💡</span>
            <span className="hidden sm:inline">Đề Xuất</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <PersonalityOverview profile={profileData?.personality || null} />
              <RecommendationsCard recommendations={profileData?.recommendations || []} />
            </div>
            <div className="space-y-6">
              <MentalHealthChart trends={profileData?.trends || []} />
              <TestHistory records={profileData?.mentalHealthRecords.slice(0, 5) || []} />
            </div>
          </div>
        </TabsContent>

        {/* Personality Tab */}
        <TabsContent value="personality" className="space-y-6">
          <PersonalityOverview profile={profileData?.personality || null} />

          {profileData?.personality?.mbti_type && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Về Tính Cách {profileData.personality.mbti_type}</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  Tính cách {profileData.personality.mbti_type} là một trong 16 loại tính cách theo MBTI.
                  Mỗi chữ cái đại diện cho một sở thích cá nhân:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>{profileData.personality.mbti_type[0]}:</strong>{' '}
                    {profileData.personality.mbti_type[0] === 'E' ? 'Hướng ngoại (Extraversion) - Năng lượng từ bên ngoài' : 'Hướng nội (Introversion) - Năng lượng từ bên trong'}
                  </li>
                  <li>
                    <strong>{profileData.personality.mbti_type[1]}:</strong>{' '}
                    {profileData.personality.mbti_type[1] === 'S' ? 'Thực tế (Sensing) - Tập trung vào hiện tại' : 'Trực giác (Intuition) - Tập trung vào tương lai'}
                  </li>
                  <li>
                    <strong>{profileData.personality.mbti_type[2]}:</strong>{' '}
                    {profileData.personality.mbti_type[2] === 'T' ? 'Lý trí (Thinking) - Ra quyết định bằng logic' : 'Cảm xúc (Feeling) - Ra quyết định bằng cảm xúc'}
                  </li>
                  <li>
                    <strong>{profileData.personality.mbti_type[3]}:</strong>{' '}
                    {profileData.personality.mbti_type[3] === 'J' ? 'Nguyên tắc (Judging) - Thích có kế hoạch' : 'Linh hoạt (Perceiving) - Thích tự phát'}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Mental Health Tab */}
        <TabsContent value="health" className="space-y-6">
          <MentalHealthChart trends={profileData?.trends || []} />
          <TestHistory records={profileData?.mentalHealthRecords || []} />

          <div className="bg-blue-50 p-6 rounded-xl">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <span>ℹ️</span>
              Lưu Ý Quan Trọng
            </h4>
            <p className="text-sm text-gray-700">
              Các bài test này chỉ mang tính chất tham khảo. Nếu bạn cảm thấy lo lắng về sức khỏe tinh thần,
              hãy tìm kiếm sự hỗ trợ từ chuyên gia. Hotline: <strong>1800-599-920</strong> (24/7, miễn phí).
            </p>
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <GoalsAndPlansView userId={userId} />
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <RecommendationsCard recommendations={profileData?.recommendations || []} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>🌱</span>
                Thói Quen Lành Mạnh
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Ngủ đủ 7-8 giờ mỗi đêm</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Tập thể dục ít nhất 30 phút/ngày</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Ăn uống cân bằng, đủ dinh dưỡng</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Giảm sử dụng mạng xã hội</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Duy trì mối quan hệ tích cực</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>📚</span>
                Tài Nguyên Hữu Ích
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <span className="text-gray-600">
                    📖 Thư viện bài viết sức khỏe tinh thần (Sắp ra mắt)
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">
                    🎧 Podcast về tâm lý học (Sắp ra mắt)
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">
                    🧘 Bài tập thiền hướng dẫn (Sắp ra mắt)
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">
                    👥 Cộng đồng hỗ trợ (Sắp ra mắt)
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">
                    👨‍⚕️ Tìm chuyên gia tâm lý (Sắp ra mắt)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
