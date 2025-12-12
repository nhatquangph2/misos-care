/**
 * User Profile Service
 * Handles extended user profile operations including contact info
 */

import { createClient } from '@/lib/supabase/client';
import type { User, Json } from '@/types/database';
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

// Get current user profile
export async function getCurrentUserProfile(): Promise<User | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

// Update user profile
export async function updateUserProfile(profileData: UserProfileData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Bạn chưa đăng nhập' };
  }

  const updateData: Record<string, unknown> = {};

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

  const { error } = await (supabase as any)
    .from('users')
    .update(updateData)
    .eq('id', user.id);

  if (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Không thể cập nhật thông tin. Vui lòng thử lại.' };
  }

  return { success: true };
}

// Complete onboarding with extended profile
export async function completeOnboarding(data: OnboardingData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Bạn chưa đăng nhập' };
  }

  const { error } = await (supabase as any)
    .from('users')
    .update({
      full_name: data.full_name,
      name: data.full_name, // Also update name field
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

  // Log consent
  await logUserConsent('terms', true);
  await logUserConsent('privacy', true);
  if (data.consent_data_sharing) {
    await logUserConsent('data_sharing', true);
  }
  if (data.consent_mentor_access) {
    await logUserConsent('mentor_access', true);
  }

  return { success: true };
}

// Log user consent
export async function logUserConsent(
  consentType: 'terms' | 'privacy' | 'data_sharing' | 'mentor_access' | 'marketing',
  consentGiven: boolean
): Promise<void> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    await (supabase as any).from('user_consent_log').insert({
      user_id: user.id,
      consent_type: consentType,
      consent_given: consentGiven,
      consent_version: '1.0',
      ip_address: null, // Can be obtained from request headers on server
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });
  } catch (error) {
    console.error('Error logging consent:', error);
  }
}

// Check if user has completed onboarding
export async function hasCompletedOnboarding(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.onboarding_completed ?? false;
}

// Check if user is a mentor
export async function isUserMentor(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'mentor' || profile?.role === 'admin';
}

// Get user role
export async function getUserRole(): Promise<'user' | 'mentor' | 'admin' | null> {
  const profile = await getCurrentUserProfile();
  return profile?.role ?? null;
}

// Update avatar
export async function updateAvatar(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Bạn chưa đăng nhập' };
  }

  // Upload to storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('profiles')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError);
    return { success: false, error: 'Không thể tải lên ảnh. Vui lòng thử lại.' };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profiles')
    .getPublicUrl(filePath);

  // Update user profile
  const { error: updateError } = await (supabase as any)
    .from('users')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error updating avatar URL:', updateError);
    return { success: false, error: 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại.' };
  }

  return { success: true, url: publicUrl };
}
