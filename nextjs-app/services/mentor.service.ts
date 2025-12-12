/**
 * Mentor Service
 * Handles mentor-related operations including relationships and notes
 */

import { createClient } from '@/lib/supabase/client';
import type { User, MentorProfile, MentorRelationship, MentorNote, MentalHealthRecord, PersonalityProfile } from '@/types/database';
import type { MentorRelationshipStatus, MentorNoteType } from '@/types/enums';

// =====================================================
// MENTOR PROFILE OPERATIONS
// =====================================================

export interface MentorProfileData {
  title?: string;
  specializations?: string[];
  qualifications?: string[];
  experience_years?: number;
  organization?: string;
  professional_bio?: string;
  approach_description?: string;
  is_available?: boolean;
  max_mentees?: number;
}

// Get mentor profile by user ID
export async function getMentorProfile(userId: string): Promise<MentorProfile | null> {
  const supabase = createClient();

  const { data, error } = await (supabase as any)
    .from('mentor_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching mentor profile:', error);
    return null;
  }

  return data as MentorProfile | null;
}

// Get current mentor's profile
export async function getCurrentMentorProfile(): Promise<MentorProfile | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return getMentorProfile(user.id);
}

// Update mentor profile
export async function updateMentorProfile(profileData: MentorProfileData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Bạn chưa đăng nhập' };
  }

  // Check if mentor profile exists
  const existing = await getMentorProfile(user.id);

  if (existing) {
    // Update existing profile
    const { error } = await (supabase as any)
      .from('mentor_profiles')
      .update(profileData)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating mentor profile:', error);
      return { success: false, error: 'Không thể cập nhật thông tin. Vui lòng thử lại.' };
    }
  } else {
    // Create new profile
    const { error } = await (supabase as any)
      .from('mentor_profiles')
      .insert({
        user_id: user.id,
        ...profileData,
      });

    if (error) {
      console.error('Error creating mentor profile:', error);
      return { success: false, error: 'Không thể tạo hồ sơ mentor. Vui lòng thử lại.' };
    }
  }

  return { success: true };
}

// Get available mentors
export async function getAvailableMentors(): Promise<(MentorProfile & { user: Pick<User, 'name' | 'full_name' | 'avatar_url' | 'email'> })[]> {
  const supabase = createClient();

  const { data, error } = await (supabase as any)
    .from('mentor_profiles')
    .select(`
      *,
      user:users!mentor_profiles_user_id_fkey(name, full_name, avatar_url, email)
    `)
    .eq('is_available', true)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching available mentors:', error);
    return [];
  }

  return (data || []) as any;
}

// =====================================================
// MENTOR RELATIONSHIP OPERATIONS
// =====================================================

export interface MenteeInfo {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_avatar: string | null;
  status: MentorRelationshipStatus;
  started_at: string | null;
  can_view_test_results: boolean;
  can_view_goals: boolean;
  can_view_contact_info: boolean;
}

// Get mentor's mentees
export async function getMentees(): Promise<MenteeInfo[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await (supabase as any)
    .from('mentor_relationships')
    .select(`
      id,
      user_id,
      status,
      started_at,
      can_view_test_results,
      can_view_goals,
      can_view_contact_info,
      user:users!mentor_relationships_user_id_fkey(name, full_name, email, avatar_url)
    `)
    .eq('mentor_id', user.id)
    .order('status', { ascending: true })
    .order('started_at', { ascending: false });

  if (error) {
    console.error('Error fetching mentees:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    user_id: item.user_id,
    user_name: item.user?.full_name || item.user?.name || 'Unknown',
    user_email: item.user?.email || '',
    user_avatar: item.user?.avatar_url || null,
    status: item.status as MentorRelationshipStatus,
    started_at: item.started_at,
    can_view_test_results: item.can_view_test_results,
    can_view_goals: item.can_view_goals,
    can_view_contact_info: item.can_view_contact_info,
  }));
}

// Request a mentor
export async function requestMentor(mentorId: string, message?: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Bạn chưa đăng nhập' };
  }

  // Check if relationship already exists
  const { data: existing } = await (supabase as any)
    .from('mentor_relationships')
    .select('id, status')
    .eq('mentor_id', mentorId)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    if (existing.status === 'active') {
      return { success: false, error: 'Bạn đã có quan hệ với mentor này' };
    }
    if (existing.status === 'pending') {
      return { success: false, error: 'Yêu cầu của bạn đang chờ xử lý' };
    }
  }

  const { error } = await (supabase as any)
    .from('mentor_relationships')
    .insert({
      mentor_id: mentorId,
      user_id: user.id,
      request_message: message || null,
      status: 'pending',
    });

  if (error) {
    console.error('Error requesting mentor:', error);
    return { success: false, error: 'Không thể gửi yêu cầu. Vui lòng thử lại.' };
  }

  return { success: true };
}

// Accept/reject mentor request (for mentors)
export async function respondToMentorRequest(
  relationshipId: string,
  accept: boolean,
  responseMessage?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Bạn chưa đăng nhập' };
  }

  const updateData: Record<string, unknown> = {
    response_message: responseMessage || null,
    response_date: new Date().toISOString(),
  };

  if (accept) {
    updateData.status = 'active';
    updateData.started_at = new Date().toISOString();
  } else {
    updateData.status = 'ended';
    updateData.end_reason = 'rejected';
  }

  const { error } = await (supabase as any)
    .from('mentor_relationships')
    .update(updateData)
    .eq('id', relationshipId)
    .eq('mentor_id', user.id);

  if (error) {
    console.error('Error responding to request:', error);
    return { success: false, error: 'Không thể xử lý yêu cầu. Vui lòng thử lại.' };
  }

  return { success: true };
}

// End mentor relationship
export async function endMentorRelationship(
  relationshipId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Bạn chưa đăng nhập' };
  }

  const { error } = await (supabase as any)
    .from('mentor_relationships')
    .update({
      status: 'ended',
      ended_at: new Date().toISOString(),
      end_reason: reason || null,
    })
    .eq('id', relationshipId)
    .or(`mentor_id.eq.${user.id},user_id.eq.${user.id}`);

  if (error) {
    console.error('Error ending relationship:', error);
    return { success: false, error: 'Không thể kết thúc quan hệ. Vui lòng thử lại.' };
  }

  return { success: true };
}

// =====================================================
// MENTEE DATA ACCESS (for mentors)
// =====================================================

// Get mentee's test results
export async function getMenteeTestResults(menteeId: string): Promise<MentalHealthRecord[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Verify mentor has access to this mentee
  const { data: relationship } = await (supabase as any)
    .from('mentor_relationships')
    .select('can_view_test_results')
    .eq('mentor_id', user.id)
    .eq('user_id', menteeId)
    .eq('status', 'active')
    .single();

  if (!relationship?.can_view_test_results) {
    console.error('No permission to view test results');
    return [];
  }

  const { data, error } = await supabase
    .from('mental_health_records')
    .select('*')
    .eq('user_id', menteeId)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error fetching mentee test results:', error);
    return [];
  }

  return data || [];
}

// Get mentee's personality profile
export async function getMenteePersonalityProfile(menteeId: string): Promise<PersonalityProfile | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Verify mentor has access
  const { data: relationship } = await (supabase as any)
    .from('mentor_relationships')
    .select('can_view_test_results')
    .eq('mentor_id', user.id)
    .eq('user_id', menteeId)
    .eq('status', 'active')
    .single();

  if (!relationship?.can_view_test_results) {
    console.error('No permission to view personality profile');
    return null;
  }

  const { data, error } = await supabase
    .from('personality_profiles')
    .select('*')
    .eq('user_id', menteeId)
    .single();

  if (error) {
    console.error('Error fetching mentee personality:', error);
    return null;
  }

  return data;
}

// Get mentee's basic profile
export async function getMenteeProfile(menteeId: string): Promise<Partial<User> | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Verify mentor has relationship
  const { data: relationship } = await (supabase as any)
    .from('mentor_relationships')
    .select('can_view_contact_info')
    .eq('mentor_id', user.id)
    .eq('user_id', menteeId)
    .eq('status', 'active')
    .single();

  if (!relationship) {
    console.error('No relationship with mentee');
    return null;
  }

  // Select fields based on permissions
  const fields = relationship.can_view_contact_info
    ? 'id, name, full_name, nickname, email, phone, avatar_url, date_of_birth, gender, occupation, bio, zalo, facebook'
    : 'id, name, full_name, nickname, avatar_url, occupation, bio';

  const { data, error } = await supabase
    .from('users')
    .select(fields)
    .eq('id', menteeId)
    .single();

  if (error) {
    console.error('Error fetching mentee profile:', error);
    return null;
  }

  return data;
}

// =====================================================
// MENTOR NOTES OPERATIONS
// =====================================================

export interface CreateNoteData {
  relationshipId: string;
  menteeId: string;
  title?: string;
  content: string;
  noteType?: MentorNoteType;
  relatedTestId?: string;
  relatedGoalId?: string;
  isPrivate?: boolean;
  sharedWithUser?: boolean;
  requiresFollowUp?: boolean;
  followUpDate?: string;
}

// Create mentor note
export async function createMentorNote(data: CreateNoteData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Bạn chưa đăng nhập' };
  }

  const { error } = await (supabase as any)
    .from('mentor_notes')
    .insert({
      relationship_id: data.relationshipId,
      mentor_id: user.id,
      user_id: data.menteeId,
      title: data.title || null,
      content: data.content,
      note_type: data.noteType || 'general',
      related_test_id: data.relatedTestId || null,
      related_goal_id: data.relatedGoalId || null,
      is_private: data.isPrivate ?? true,
      shared_with_user: data.sharedWithUser ?? false,
      requires_follow_up: data.requiresFollowUp ?? false,
      follow_up_date: data.followUpDate || null,
    });

  if (error) {
    console.error('Error creating note:', error);
    return { success: false, error: 'Không thể tạo ghi chú. Vui lòng thử lại.' };
  }

  return { success: true };
}

// Get notes for a mentee
export async function getMenteeNotes(menteeId: string): Promise<MentorNote[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await (supabase as any)
    .from('mentor_notes')
    .select('*')
    .eq('mentor_id', user.id)
    .eq('user_id', menteeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }

  return (data || []) as MentorNote[];
}

// Get follow-up notes
export async function getFollowUpNotes(): Promise<MentorNote[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await (supabase as any)
    .from('mentor_notes')
    .select('*')
    .eq('mentor_id', user.id)
    .eq('requires_follow_up', true)
    .eq('follow_up_completed', false)
    .order('follow_up_date', { ascending: true });

  if (error) {
    console.error('Error fetching follow-up notes:', error);
    return [];
  }

  return (data || []) as MentorNote[];
}

// Mark follow-up as completed
export async function completeFollowUp(noteId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Bạn chưa đăng nhập' };
  }

  const { error } = await (supabase as any)
    .from('mentor_notes')
    .update({ follow_up_completed: true })
    .eq('id', noteId)
    .eq('mentor_id', user.id);

  if (error) {
    console.error('Error completing follow-up:', error);
    return { success: false, error: 'Không thể cập nhật. Vui lòng thử lại.' };
  }

  return { success: true };
}

// =====================================================
// USER'S MENTOR VIEW (for regular users)
// =====================================================

// Get user's current mentor
export async function getCurrentMentor(): Promise<(MentorRelationship & { mentor: Pick<User, 'name' | 'full_name' | 'avatar_url' | 'email'> }) | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await (supabase as any)
    .from('mentor_relationships')
    .select(`
      *,
      mentor:users!mentor_relationships_mentor_id_fkey(name, full_name, avatar_url, email)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  if (error) {
    console.error('Error fetching current mentor:', error);
    return null;
  }

  return data as any;
}

// Get notes shared by mentor (for users)
export async function getSharedMentorNotes(): Promise<MentorNote[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await (supabase as any)
    .from('mentor_notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('shared_with_user', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shared notes:', error);
    return [];
  }

  return (data || []) as MentorNote[];
}
