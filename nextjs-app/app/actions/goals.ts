/**
 * Server Actions for Goals Management
 * Zero-API approach - call server functions directly from client
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createGoal(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const targetDate = formData.get('target_date') as string;

  if (!title) {
    return { error: 'Title is required' };
  }

  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: user.id,
      title,
      description,
      target_date: targetDate || null,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Create goal error:', error);
    return { error: 'Failed to create goal' };
  }

  // Revalidate the profile page to show new goal
  revalidatePath('/profile');

  return { success: true, data };
}

export async function updateGoalStatus(goalId: string, status: 'active' | 'completed' | 'archived') {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('goals')
    .update({
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    })
    .eq('id', goalId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Update goal status error:', error);
    return { error: 'Failed to update goal status' };
  }

  revalidatePath('/profile');

  return { success: true, data };
}

export async function deleteGoal(goalId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Delete goal error:', error);
    return { error: 'Failed to delete goal' };
  }

  revalidatePath('/profile');

  return { success: true };
}
