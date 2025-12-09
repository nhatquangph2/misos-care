// Profile and Test Result Types

export interface PersonalityProfile {
  user_id: string;
  mbti_type: string | null;
  big5_openness: number | null;
  big5_conscientiousness: number | null;
  big5_extraversion: number | null;
  big5_agreeableness: number | null;
  big5_neuroticism: number | null;
  last_updated: string;
  created_at: string;
}

export interface MentalHealthRecord {
  id: string;
  user_id: string;
  test_type: 'PHQ9' | 'GAD7' | 'DASS21' | 'PSS' | 'DASS21-depression' | 'DASS21-anxiety' | 'DASS21-stress' | 'PHQ-9' | 'GAD-7' | 'PSS-10';
  total_score: number;
  score?: number; // Alias for backwards compatibility
  severity_level: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe' | 'extremely-severe' | 'critical';
  test_version: string;
  subscale_scores: Record<string, number> | null;
  crisis_flag: boolean;
  crisis_reason: string | null;
  raw_responses: any;
  responses?: Record<string, number>; // Alias for backwards compatibility
  completed_at: string;
  created_at: string;
}

export interface TestHistoryItem {
  date: string;
  testType: string;
  score: number;
  severity: string;
}

export interface MentalHealthTrend {
  date: string;
  depression: number;
  anxiety: number;
  stress: number;
}

export interface ProfileSummary {
  personality: PersonalityProfile | null;
  mentalHealthRecords: MentalHealthRecord[];
  trends: MentalHealthTrend[];
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  type: 'activity' | 'resource' | 'habit' | 'professional';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  icon: string;
  actionText?: string;
  actionUrl?: string;
}

export interface MBTITypeInfo {
  type: string;
  name: string;
  nameVi: string;
  nickname: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  relationships: string;
  growth: string;
}

export interface Big5Scores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface Big5TraitInfo {
  name: string;
  nameVi: string;
  description: string;
  lowDescription: string;
  highDescription: string;
}
