import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getProfileSummaryServer } from '@/lib/server-services/profile-server';
import { getTestTimelineServer } from '@/lib/server-services/test-history-server';
import ProfileClientView from './ProfileClientView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ sơ của tôi | Misos Care',
  description: 'Quản lý tính cách, theo dõi sức khỏe tinh thần và nhận đề xuất cá nhân hóa',
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  // Promise.all to fetch data in parallel - reduces waiting time by ~50%
  const [profileData, timelineData] = await Promise.all([
    getProfileSummaryServer(user.id),
    getTestTimelineServer(user.id)
  ]);

  return (
    <ProfileClientView
      profileData={profileData}
      timeline={timelineData}
      userId={user.id}
    />
  );
}
