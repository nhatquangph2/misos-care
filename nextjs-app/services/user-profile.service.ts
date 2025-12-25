/**
 * User Profile Service
 * Handles extended user profile operations including contact info
 */


import { BaseService } from './base.service';
import type { User } from '@/types/database';
import type { Gender, ProfileVisibility } from '@/types/enums';

export interface UserProfileData {
  // Basic info
  name?: string;
  full_name?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  gender?: Gender;
  bio?: string;
  occupation?: string;
  education?: string;
  location?: string;
  timezone?: string;

  // Contact information
  phone_secondary?: string;
  zalo?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;

  // Emergency contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;

  // Privacy settings
  profile_visibility?: ProfileVisibility;
  consent_data_sharing?: boolean;
  consent_mentor_access?: boolean;

  // Preferences
  language?: string;
  notification_preferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

export interface OnboardingData {
  full_name: string;
  nickname?: string;
  date_of_birth?: string;
  gender?: Gender;
  phone?: string;
  occupation?: string;
  consent_data_sharing: boolean;
  consent_mentor_access: boolean;
}

export class UserProfileService extends BaseService {
  /**
   * Get current user profile
   */
  async getCurrentUserProfile(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile (Details):', JSON.stringify(error, null, 2));
      return null;
    }

    return data;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(profileData: UserProfileData): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Bạn chưa đăng nhập' };
    }

    const updateData: Record<string, any> = {};

    // Map fields to update
    const allowedFields = [
      'name', 'full_name', 'nickname', 'phone', 'avatar_url',
      'date_of_birth', 'gender', 'bio', 'occupation', 'education',
      'location', 'timezone', 'phone_secondary', 'zalo', 'facebook',
      'instagram', 'linkedin', 'emergency_contact_name',
      'emergency_contact_phone', 'emergency_contact_relationship',
      'profile_visibility', 'consent_data_sharing', 'consent_mentor_access',
      'language', 'notification_preferences'
    ];

    for (const field of allowedFields) {
      if (field in profileData) {
        updateData[field] = profileData[field as keyof UserProfileData];
      }
    }

    const { error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: 'Không thể cập nhật thông tin. Vui lòng thử lại.' };
    }

    return { success: true };
  }

  /**
   * Complete onboarding with extended profile
   */
  async completeOnboarding(data: OnboardingData): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Bạn chưa đăng nhập' };
    }

    const { error } = await this.supabase
      .from('users')
      .update({
        full_name: data.full_name,
        name: data.full_name,
        nickname: data.nickname || null,
        date_of_birth: data.date_of_birth || null,
        gender: data.gender || null,
        phone: data.phone || null,
        occupation: data.occupation || null,
        consent_data_sharing: data.consent_data_sharing,
        consent_mentor_access: data.consent_mentor_access,
        onboarding_completed: true,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error completing onboarding:', error);
      return { success: false, error: 'Không thể hoàn thành đăng ký. Vui lòng thử lại.' };
    }

    // Log consents
    await this.logUserConsent('terms', true);
    await this.logUserConsent('privacy', true);
    if (data.consent_data_sharing) {
      await this.logUserConsent('data_sharing', true);
    }
    if (data.consent_mentor_access) {
      await this.logUserConsent('mentor_access', true);
    }

    return { success: true };
  }

  /**
   * Log user consent
   */
  async logUserConsent(
    consentType: 'terms' | 'privacy' | 'data_sharing' | 'mentor_access' | 'marketing',
    consentGiven: boolean
  ): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return;

    try {
      await this.supabase.from('user_consent_log').insert({
        user_id: user.id,
        consent_type: consentType,
        consent_given: consentGiven,
        consent_version: '1.0',
        ip_address: null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      });
    } catch (error) {
      console.error('Error logging consent:', error);
    }
  }

  /**
   * Check if user has completed onboarding
   */
  async hasCompletedOnboarding(): Promise<boolean> {
    const profile = await this.getCurrentUserProfile();
    return profile?.onboarding_completed ?? false;
  }

  /**
   * Check if user is a mentor
   */
  async isUserMentor(): Promise<boolean> {
    const profile = await this.getCurrentUserProfile();
    return profile?.role === 'mentor' || profile?.role === 'admin';
  }

  /**
   * Get user role
   */
  async getUserRole(): Promise<'user' | 'mentor' | 'admin' | null> {
    const profile = await this.getCurrentUserProfile();
    return profile?.role ?? null;
  }

  /**
   * Update avatar
   */
  async updateAvatar(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Bạn chưa đăng nhập' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from('profiles')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      return { success: false, error: 'Không thể tải lên ảnh. Vui lòng thử lại.' };
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    const { error: updateError } = await this.supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating avatar URL:', updateError);
      return { success: false, error: 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.' };
    }

    return { success: true, url: publicUrl };
  }
}

// Export a default instance for easy use in client components
export const userProfileService = new UserProfileService();

// Re-export functions for backward compatibility with existing code
export const getCurrentUserProfile = () => userProfileService.getCurrentUserProfile();
export const updateUserProfile = (data: UserProfileData) => userProfileService.updateUserProfile(data);
export const completeOnboarding = (data: OnboardingData) => userProfileService.completeOnboarding(data);
export const logUserConsent = (type: any, given: boolean) => userProfileService.logUserConsent(type, given);
export const hasCompletedOnboarding = () => userProfileService.hasCompletedOnboarding();
export const isUserMentor = () => userProfileService.isUserMentor();
export const getUserRole = () => userProfileService.getUserRole();
export const updateAvatar = (file: File) => userProfileService.updateAvatar(file);
