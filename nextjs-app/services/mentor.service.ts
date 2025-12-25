import { BaseService } from './base.service';
import type { User, MentorProfile, MentorRelationship, MentorNote, MentalHealthRecord, PersonalityProfile } from '@/types/database';
import type { MentorRelationshipStatus, MentorNoteType } from '@/types/enums';

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

export class MentorService extends BaseService {
  // =====================================================
  // MENTOR PROFILE OPERATIONS
  // =====================================================

  async getMentorProfile(userId: string): Promise<MentorProfile | null> {
    const { data, error } = await this.supabase
      .from('mentor_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching mentor profile:', error);
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data as any as MentorProfile;
  }

  async getCurrentMentorProfile(): Promise<MentorProfile | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;
    return this.getMentorProfile(user.id);
  }

  async updateMentorProfile(profileData: MentorProfileData): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return { success: false, error: 'Bạn chưa đăng nhập' };

    const existing = await this.getMentorProfile(user.id);
    if (existing) {
      const { error } = await this.supabase
        .from('mentor_profiles')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update(profileData as any)
        .eq('user_id', user.id);
      if (error) {
        console.error('Error updating mentor profile:', error);
        return { success: false, error: 'Không thể cập nhật thông tin. Vui lòng thử lại.' };
      }
    } else {
      const { error } = await this.supabase
        .from('mentor_profiles')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({ user_id: user.id, ...profileData } as any);
      if (error) {
        console.error('Error creating mentor profile:', error);
        return { success: false, error: 'Không thể tạo hồ sơ mentor. Vui lòng thử lại.' };
      }
    }
    return { success: true };
  }

  async getAvailableMentors(): Promise<(MentorProfile & { user: Pick<User, 'name' | 'full_name' | 'avatar_url' | 'email'> })[]> {
    const { data, error } = await this.supabase
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []) as any;
  }

  // =====================================================
  // MENTOR RELATIONSHIP OPERATIONS
  // =====================================================

  async getMentees(): Promise<MenteeInfo[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.supabase
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  async requestMentor(mentorId: string, message?: string): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return { success: false, error: 'Bạn chưa đăng nhập' };

    const { data: existing } = await this.supabase
      .from('mentor_relationships')
      .select('id, status')
      .eq('mentor_id', mentorId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((existing as any).status === 'active') return { success: false, error: 'Bạn đã có quan hệ với mentor này' };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((existing as any).status === 'pending') return { success: false, error: 'Yêu cầu của bạn đang chờ xử lý' };
    }

    const { error } = await this.supabase
      .from('mentor_relationships')
      .insert({
        mentor_id: mentorId,
        user_id: user.id,
        request_message: message || null,
        status: 'pending',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

    if (error) {
      console.error('Error requesting mentor:', error);
      return { success: false, error: 'Không thể gửi yêu cầu. Vui lòng thử lại.' };
    }
    return { success: true };
  }

  async respondToMentorRequest(relationshipId: string, accept: boolean, responseMessage?: string): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return { success: false, error: 'Bạn chưa đăng nhập' };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
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

    const { error } = await this.supabase
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

  async endMentorRelationship(relationshipId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return { success: false, error: 'Bạn chưa đăng nhập' };

    const { error } = await this.supabase
      .from('mentor_relationships')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString(),
        end_reason: reason || null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
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

  async getMenteeTestResults(menteeId: string): Promise<MentalHealthRecord[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data: relationship } = await this.supabase
      .from('mentor_relationships')
      .select('can_view_test_results')
      .eq('mentor_id', user.id)
      .eq('user_id', menteeId)
      .eq('status', 'active')
      .maybeSingle();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(relationship as any)?.can_view_test_results) {
      console.error('No permission to view test results');
      return [];
    }

    const { data, error } = await this.supabase
      .from('mental_health_records')
      .select('*')
      .eq('user_id', menteeId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching mentee test results:', error);
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any) || [];
  }

  async getMenteePersonalityProfile(menteeId: string): Promise<PersonalityProfile | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data: relationship } = await this.supabase
      .from('mentor_relationships')
      .select('can_view_test_results')
      .eq('mentor_id', user.id)
      .eq('user_id', menteeId)
      .eq('status', 'active')
      .maybeSingle();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(relationship as any)?.can_view_test_results) {
      console.error('No permission to view personality profile');
      return null;
    }

    const { data, error } = await this.supabase
      .from('personality_profiles')
      .select('*')
      .eq('user_id', menteeId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching mentee personality:', error);
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data as any as PersonalityProfile;
  }

  async getMenteeProfile(menteeId: string): Promise<Partial<User> | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data: relationship } = await this.supabase
      .from('mentor_relationships')
      .select('can_view_contact_info')
      .eq('mentor_id', user.id)
      .eq('user_id', menteeId)
      .eq('status', 'active')
      .maybeSingle();

    if (!relationship) {
      console.error('No relationship with mentee');
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = (relationship as any).can_view_contact_info
      ? 'id, name, full_name, nickname, email, phone, avatar_url, date_of_birth, gender, occupation, bio, zalo, facebook'
      : 'id, name, full_name, nickname, avatar_url, occupation, bio';

    const { data, error } = await this.supabase
      .from('users')
      .select(fields)
      .eq('id', menteeId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching mentee profile:', error);
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data as any;
  }

  // =====================================================
  // MENTOR NOTES OPERATIONS
  // =====================================================

  async createMentorNote(data: CreateNoteData): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return { success: false, error: 'Bạn chưa đăng nhập' };

    const { error } = await this.supabase
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

    if (error) {
      console.error('Error creating note:', error);
      return { success: false, error: 'Không thể tạo ghi chú. Vui lòng thử lại.' };
    }
    return { success: true };
  }

  async getMenteeNotes(menteeId: string): Promise<MentorNote[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.supabase
      .from('mentor_notes')
      .select('*')
      .eq('mentor_id', user.id)
      .eq('user_id', menteeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any) || [];
  }

  async getFollowUpNotes(): Promise<MentorNote[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.supabase
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any) || [];
  }

  async completeFollowUp(noteId: string): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return { success: false, error: 'Bạn chưa đăng nhập' };

    const { error } = await this.supabase
      .from('mentor_notes')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ follow_up_completed: true } as any)
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

  async getCurrentMentor(): Promise<(MentorRelationship & { mentor: Pick<User, 'name' | 'full_name' | 'avatar_url' | 'email'> }) | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('mentor_relationships')
      .select(`
        *,
        mentor:users!mentor_relationships_mentor_id_fkey(name, full_name, avatar_url, email)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error('Error fetching current mentor:', error);
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data as any;
  }

  async getSharedMentorNotes(): Promise<MentorNote[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.supabase
      .from('mentor_notes')
      .select('*')
      .eq('user_id', user.id)
      .eq('shared_with_user', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching shared notes:', error);
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any) || [];
  }
}

export const mentorService = new MentorService();

export const getMentorProfile = (id: string) => mentorService.getMentorProfile(id);
export const getCurrentMentorProfile = () => mentorService.getCurrentMentorProfile();
export const updateMentorProfile = (d: MentorProfileData) => mentorService.updateMentorProfile(d);
export const getAvailableMentors = () => mentorService.getAvailableMentors();
export const getMentees = () => mentorService.getMentees();
export const requestMentor = (id: string, m?: string) => mentorService.requestMentor(id, m);
export const respondToMentorRequest = (id: string, a: boolean, m?: string) => mentorService.respondToMentorRequest(id, a, m);
export const endMentorRelationship = (id: string, r?: string) => mentorService.endMentorRelationship(id, r);
export const getMenteeTestResults = (id: string) => mentorService.getMenteeTestResults(id);
export const getMenteePersonalityProfile = (id: string) => mentorService.getMenteePersonalityProfile(id);
export const getMenteeProfile = (id: string) => mentorService.getMenteeProfile(id);
export const createMentorNote = (d: CreateNoteData) => mentorService.createMentorNote(d);
export const getMenteeNotes = (id: string) => mentorService.getMenteeNotes(id);
export const getFollowUpNotes = () => mentorService.getFollowUpNotes();
export const completeFollowUp = (id: string) => mentorService.completeFollowUp(id);
export const getCurrentMentor = () => mentorService.getCurrentMentor();
export const getSharedMentorNotes = () => mentorService.getSharedMentorNotes();
