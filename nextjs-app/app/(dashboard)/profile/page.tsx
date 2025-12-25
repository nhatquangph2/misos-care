import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getProfileSummaryServer } from '@/lib/server-services/profile-server';
import { getTestTimelineServer } from '@/lib/server-services/test-history-server';
import { getUnifiedProfile } from '@/services/unified-profile.service';
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

  // Fetch data with granular error handling to prevent 500 crashes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let profileData: any = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timelineData: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let unifiedProfile: any = {};

  try {
    profileData = await getProfileSummaryServer(user.id);
  } catch (e) {
    console.error('❌ Failed to fetch ProfileSummary:', e);
    // Continue with empty profile
  }

  try {
    timelineData = await getTestTimelineServer(user.id);
  } catch (e) {
    console.error('❌ Failed to fetch TestTimeline:', e);
  }

  try {
    // Inject server client for RLS
    unifiedProfile = await getUnifiedProfile(user.id, supabase);
  } catch (e) {
    console.error('❌ Failed to fetch UnifiedProfile:', e);
  }

  return (
    <ProfileClientView
      profileData={profileData}
      timeline={timelineData}
      unifiedProfile={unifiedProfile}
      userId={user.id}
      userName={user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'User'}
    />
  );
}
