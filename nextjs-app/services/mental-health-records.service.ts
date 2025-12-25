
import { BaseService } from './base.service';

export type TestType = 'PHQ9' | 'GAD7' | 'DASS21' | 'PSS';
export type SeverityLevel = 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe';

export interface MentalHealthRecord {
  id: string;
  user_id: string;
  test_type: TestType;
  test_version: string;
  total_score: number;
  subscale_scores: Record<string, number> | null;
  severity_level: SeverityLevel;
  crisis_flag: boolean;
  crisis_reason: string | null;
  raw_responses: any;
  completed_at: string;
  created_at: string;
}

export interface SaveTestResultParams {
  testType: TestType;
  totalScore: number;
  severityLevel: SeverityLevel;
  subscaleScores?: Record<string, number>;
  rawResponses?: any;
  crisisFlag?: boolean;
  crisisReason?: string;
  completedAt?: Date;
}

export class MentalHealthRecordsService extends BaseService {
  /**
   * Save mental health test results to database
   */
  async saveMentalHealthRecord(params: SaveTestResultParams) {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const recordData = {
      user_id: user.id,
      test_type: params.testType,
      test_version: '1.0',
      total_score: params.totalScore,
      subscale_scores: (params.subscaleScores || null) as any,
      severity_level: params.severityLevel,
      crisis_flag: params.crisisFlag || false,
      crisis_reason: params.crisisReason || null,
      raw_responses: params.rawResponses || null,
      completed_at: params.completedAt?.toISOString() || new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('mental_health_records')
      .insert(recordData)
      .select()
      .single();

    if (error) {
      console.error('Error saving mental health record:', error);
      throw new Error(`Failed to save results: ${error.message}`);
    }

    return data;
  }

  /**
   * Get user's mental health records
   */
  async getMentalHealthRecords(testType?: TestType): Promise<MentalHealthRecord[]> {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();

    if (authError || !user) {
      return [];
    }

    let query = this.supabase
      .from('mental_health_records')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (testType) {
      query = query.eq('test_type', testType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching mental health records:', error);
      throw new Error(`Failed to fetch records: ${error.message}`);
    }

    return (data || []) as MentalHealthRecord[];
  }

  /**
   * Get latest mental health record for a specific test type
   */
  async getLatestRecord(testType: TestType): Promise<MentalHealthRecord | null> {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data, error } = await this.supabase
      .from('mental_health_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('test_type', testType)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching latest record:', error);
      return null;
    }

    return data as MentalHealthRecord | null;
  }

  /**
   * Get all mental health records summary
   */
  async getMentalHealthSummary() {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data, error } = await this.supabase
      .from('mental_health_records')
      .select('test_type, total_score, severity_level, completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching summary:', error);
      return null;
    }

    return data;
  }

  /**
   * Delete a mental health record
   */
  async deleteMentalHealthRecord(recordId: string) {
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const { error } = await this.supabase
      .from('mental_health_records')
      .delete()
      .eq('id', recordId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting record:', error);
      throw new Error(`Failed to delete record: ${error.message}`);
    }
  }
}

export const mentalHealthRecordsService = new MentalHealthRecordsService();

// Re-export for backward compatibility
export const saveMentalHealthRecord = (p: SaveTestResultParams) => mentalHealthRecordsService.saveMentalHealthRecord(p);
export const getMentalHealthRecords = (t?: TestType) => mentalHealthRecordsService.getMentalHealthRecords(t);
export const getLatestRecord = (t: TestType) => mentalHealthRecordsService.getLatestRecord(t);
export const getMentalHealthSummary = () => mentalHealthRecordsService.getMentalHealthSummary();
export const deleteMentalHealthRecord = (id: string) => mentalHealthRecordsService.deleteMentalHealthRecord(id);
