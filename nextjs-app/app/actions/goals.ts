/**
 * Server Actions for Goals Management
 * Zero-API approach - call server functions directly from client
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createGoal(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const targetDate = formData.get('target_date') as string;

  if (!title) {
    throw new Error('Title is required');
  }

  // Type assertion for goals table (table exists but not in generated types yet)
  const { error } = await (supabase as any)
    .from('goals')
    .insert({
      user_id: user.id,
      title,
      description,
      target_date: targetDate || null,
      status: 'active',
    });

  if (error) {
    console.error('Create goal error:', error);
    throw new Error('Failed to create goal');
  }

  // Revalidate the profile page to show new goal
  revalidatePath('/profile');
}

export async function updateGoalStatus(goalId: string, status: 'active' | 'completed' | 'archived'): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const { error } = await (supabase as any)
    .from('goals')
    .update({
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    })
    .eq('id', goalId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Update goal status error:', error);
    throw new Error('Failed to update goal status');
  }

  revalidatePath('/profile');
}

export async function deleteGoal(goalId: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const { error } = await (supabase as any)
    .from('goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Delete goal error:', error);
    throw new Error('Failed to delete goal');
  }

  revalidatePath('/profile');
}
