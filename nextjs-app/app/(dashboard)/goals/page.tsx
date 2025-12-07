import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { GoalsAndRemindersPage } from './GoalsAndRemindersPage';

export default async function GoalsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <GoalsAndRemindersPage userId={user.id} />;
}
