import { BaseService } from './base.service';
import type { BFI2Score } from '@/constants/tests/bfi2-questions';
import type { PersonalityProfile, Json } from '@/types/database';
import type { MBTIType } from '@/types/enums';

export interface SaveBFI2Result {
  score: BFI2Score;
  completedAt?: Date;
  completionTime?: number;
}

export class PersonalityProfileService extends BaseService {
  /**
   * Save BFI-2 test results to user's personality profile
   * NOTE: This function is DEPRECATED - use API route /api/tests/submit instead
   */
  async saveBFI2Results({ score, completedAt }: SaveBFI2Result) {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const toPercentage = (raw: number) => Math.round(((raw - 1) / 4) * 100);

    const profileData = {
      user_id: user.id,
      big5_openness: toPercentage(score.domains.O),
      big5_conscientiousness: toPercentage(score.domains.C),
      big5_extraversion: toPercentage(score.domains.E),
      big5_agreeableness: toPercentage(score.domains.A),
      big5_neuroticism: toPercentage(score.domains.N),
      big5_openness_raw: score.domains.O,
      big5_conscientiousness_raw: score.domains.C,
      big5_extraversion_raw: score.domains.E,
      big5_agreeableness_raw: score.domains.A,
      big5_neuroticism_raw: score.domains.N,
      bfi2_score: score as unknown as Json,
      last_updated: completedAt?.toISOString() || new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('personality_profiles')
      .upsert(profileData, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving BFI-2 results:', error);
      throw new Error(`Failed to save results: ${error.message}`);
    }

    return data;
  }

  /**
   * Get user's personality profile
   */
  async getPersonalityProfile(): Promise<PersonalityProfile | null> {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data, error } = await this.supabase
      .from('personality_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching personality profile:', error);
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data as PersonalityProfile | null;
  }

  /**
   * Check if user has completed BFI-2 test
   */
  async hasBFI2Profile(): Promise<boolean> {
    const profile = await this.getPersonalityProfile();
    return profile !== null;
  }

  /**
   * Save MBTI type to user's personality profile
   */
  async saveMBTIResult(mbtiType: string, completedAt?: Date) {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const profileData = {
      user_id: user.id,
      mbti_type: mbtiType as MBTIType,
      last_updated: completedAt?.toISOString() || new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('personality_profiles')
      .upsert(profileData, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving MBTI results:', error);
      throw new Error(`Failed to save results: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete user's personality profile
   */
  async deletePersonalityProfile() {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { error } = await this.supabase
      .from('personality_profiles')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting personality profile:', error);
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
  }
}

export const personalityProfileService = new PersonalityProfileService();

export const saveBFI2Results = (p: SaveBFI2Result) => personalityProfileService.saveBFI2Results(p);
export const getPersonalityProfile = () => personalityProfileService.getPersonalityProfile();
export const hasBFI2Profile = () => personalityProfileService.hasBFI2Profile();
export const saveMBTIResult = (type: string, date?: Date) => personalityProfileService.saveMBTIResult(type, date);
export const deletePersonalityProfile = () => personalityProfileService.deletePersonalityProfile();
