// Profile and Test Result Types

export interface PersonalityProfile {
  user_id: string;
  mbti_type: string | null;
  big5_openness: number | null;
  big5_conscientiousness: number | null;
  big5_extraversion: number | null;
  big5_agreeableness: number | null;
  big5_neuroticism: number | null;
  test_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MentalHealthRecord {
  id: string;
  user_id: string;
  test_type: 'DASS21-depression' | 'DASS21-anxiety' | 'DASS21-stress' | 'PHQ-9' | 'GAD-7' | 'PSS-10';
  score: number;
  severity_level: 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely-severe' | 'critical';
  responses: Record<string, number>;
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
