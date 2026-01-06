/**
 * Database Types (Auto-generated structure from Supabase Schema)
 * These types match the SQL schema exactly
 */

import type {
  Gender,
  MBTIType,
  TestType,
  SeverityLevel,
  ChatRole,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
  MeetingPlatform,
  CancelledBy,
  ProductCategory,
  CommunityGroupType,
  GroupMemberRole,
  GroupMemberStatus,
  ModerationStatus,
  ReportReason,
  ReportStatus,
  CrisisTriggerType,
  CrisisSeverity,
  InterventionType,
  Currency,
  UserRole,
  ProfileVisibility,
  MentorRelationshipStatus,
  MentorNoteType,
  ConsentType,
} from './enums'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// =====================================================
// TABLE TYPES
// =====================================================

export type User = {
  id: string;
  email: string;
  phone: string | null;
  name: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: Gender | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  nickname: string | null;
  bio: string | null;
  occupation: string | null;
  education: string | null;
  location: string | null;
  timezone: string;
  phone_secondary: string | null;
  zalo: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  profile_visibility: ProfileVisibility;
  language: string;
  notification_preferences: Json;
  consent_data_sharing: boolean;
  consent_mentor_access: boolean;
}

export type MentorProfile = {
  id: string;
  user_id: string;
  title: string | null;
  specializations: string[];
  qualifications: string[];
  experience_years: number;
  organization: string | null;
  professional_bio: string | null;
  approach_description: string | null;
  is_available: boolean;
  max_mentees: number;
  current_mentee_count: number;
  rating: number;
  total_reviews: number;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}

export type PersonalityProfile = {
  id: string;
  user_id: string;
  mbti_type: MBTIType | null;
  mbti_scores: Json | null;
  big5_openness: number | null;
  big5_conscientiousness: number | null;
  big5_extraversion: number | null;
  big5_agreeableness: number | null;
  big5_neuroticism: number | null;
  enneagram_type: number | null;
  enneagram_wing: string | null;
  last_updated: string;
  created_at: string;
  bfi2_score?: Json;
  sisri24_scores?: Json;
  via_signature_strengths?: Json;
  via_top_virtue?: string;
  big5_openness_raw?: number;
  big5_conscientiousness_raw?: number;
  big5_extraversion_raw?: number;
  big5_agreeableness_raw?: number;
  big5_neuroticism_raw?: number;
}

export type MentalHealthRecord = {
  id: string;
  user_id: string;
  test_type: TestType;
  test_version: string;
  total_score: number;
  subscale_scores: Json | null;
  severity_level: SeverityLevel;
  crisis_flag: boolean;
  crisis_reason: string | null;
  raw_responses: Json | null;
  completed_at: string;
  created_at: string;
}

export type MentorRelationship = {
  id: string;
  mentor_id: string;
  user_id: string;
  status: MentorRelationshipStatus;
  request_message: string | null;
  request_date: string;
  response_message: string | null;
  response_date: string | null;
  can_view_test_results: boolean;
  can_view_goals: boolean;
  can_view_contact_info: boolean;
  can_add_notes: boolean;
  started_at: string | null;
  ended_at: string | null;
  end_reason: string | null;
  created_at: string;
  updated_at: string;
}

export type MentorNote = {
  id: string;
  relationship_id: string;
  mentor_id: string;
  user_id: string;
  title: string | null;
  content: string;
  note_type: MentorNoteType;
  related_test_id: string | null;
  related_goal_id: string | null;
  is_private: boolean;
  shared_with_user: boolean;
  requires_follow_up: boolean;
  follow_up_date: string | null;
  follow_up_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type Mentor = {
  id: string;
  name: string;
  title: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  credentials: string | null;
  education: string[] | null;
  languages: string[] | null;
  specialties: string[];
  personality_match: string[] | null;
  experience_years: number;
  hourly_rate: number;
  currency: Currency;
  availability: Json | null;
  rating: number;
  total_sessions: number;
  total_reviews: number;
  is_active: boolean;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export type Booking = {
  id: string;
  user_id: string;
  mentor_id: string;
  session_date: string;
  session_time: string;
  duration_minutes: number;
  total_price: number;
  currency: Currency;
  status: BookingStatus;
  cancellation_reason: string | null;
  cancelled_by: CancelledBy | null;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;
  payment_transaction_id: string | null;
  paid_at: string | null;
  meeting_link: string | null;
  meeting_platform: MeetingPlatform | null;
  user_notes: string | null;
  mentor_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type BFI2TestHistory = {
  id: string;
  user_id: string;
  score: Json;
  completed_at: string;
}

export type VIAResultRecord = {
  id: string;
  user_id: string;
  ranked_strengths: string[];
  score: Json;
  created_at: string;
  completed_at: string;
  // Strength scores (1-5)
  hope?: number;
  zest?: number;
  self_regulation?: number;
  gratitude?: number;
  spirituality?: number;
  forgiveness?: number;
  prudence?: number;
  love?: number;
  kindness?: number;
  perspective?: number;
  curiosity?: number;
  creativity?: number;
  perseverance?: number;
  all_strengths?: Json;
  [key: string]: any; // Allow for dynamic strength columns
}

export type MBTIResultRecord = {
  id: string;
  user_id: string;
  result: Json;
  created_at: string;
}

export type SISRI24ResultRecord = {
  id: string;
  user_id: string;
  scores: Json;
  created_at: string;
}

// =====================================================
// USER GOALS & ACTION PLANS
// =====================================================

export type GoalCategory = 'mental_health' | 'personality_growth' | 'habits' | 'relationships' | 'career' | 'custom';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'abandoned';
export type ActionType = 'daily_habit' | 'weekly_habit' | 'one_time' | 'test_schedule' | 'custom';
export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'custom';
export type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'terrible';

export type UserGoal = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  target_metric: string | null;
  target_value: number | null;
  current_value: number;
  start_date: string;
  target_date: string;
  status: GoalStatus;
  completion_percentage: number;
  motivation_text: string | null;
  reward_text: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ActionPlan = {
  id: string;
  goal_id: string | null;
  user_id: string;
  title: string;
  description: string | null;
  action_type: ActionType;
  frequency_type: FrequencyType | null;
  frequency_value: number | null;
  frequency_days: string[] | null;
  reminder_enabled: boolean;
  reminder_time: string | null;
  reminder_days: string[] | null;
  total_completions: number;
  current_streak: number;
  longest_streak: number;
  last_completed_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ActionCompletion = {
  id: string;
  action_plan_id: string;
  user_id: string;
  completed_at: string;
  completion_date: string;
  notes: string | null;
  mood: MoodType | null;
  created_at: string;
}

// =====================================================
// CHAT SYSTEM
// =====================================================

export type ChatSession = {
  id: string;
  user_id: string;
  title: string | null;
  context_summary: string | null;
  is_active: boolean;
  message_count: number;
  started_at: string;
  last_message_at: string;
  created_at: string;
}

export type ChatMessage = {
  id: string;
  session_id: string;
  role: ChatRole;
  content: string;
  model: string | null;
  tokens_used: number | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  contains_crisis_keyword: boolean;
  moderation_flagged: boolean;
  moderation_categories: Json | null;
  created_at: string;
}

// =====================================================
// CRISIS ALERTS
// =====================================================

export type CrisisAlert = {
  id: string;
  user_id: string;
  trigger_type: CrisisTriggerType;
  trigger_source_id: string | null;
  severity: CrisisSeverity;
  details: Json | null;
  intervention_sent: boolean;
  intervention_type: InterventionType | null;
  resolved: boolean;
  resolved_at: string | null;
  resolved_notes: string | null;
  created_at: string;
}

// =====================================================
// BOOKING & REVIEWS
// =====================================================

export type BookingReview = {
  id: string;
  booking_id: string;
  user_id: string;
  mentor_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

// =====================================================
// PRODUCTS
// =====================================================

export type Product = {
  id: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  price: number;
  currency: Currency;
  image_url: string | null;
  images: Json | null;
  external_link: string | null;
  stock_quantity: number | null;
  click_count: number;
  view_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// COMMUNITY
// =====================================================

export type CommunityGroup = {
  id: string;
  personality_type: CommunityGroupType | null;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  rules: Json | null;
  member_count: number;
  post_count: number;
  is_private: boolean;
  requires_approval: boolean;
  created_at: string;
  updated_at: string;
}

export type GroupMember = {
  id: string;
  group_id: string;
  user_id: string;
  role: GroupMemberRole;
  status: GroupMemberStatus;
  joined_at: string;
}

export type CommunityPost = {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  images: Json | null;
  moderation_status: ModerationStatus;
  moderation_reason: string | null;
  moderated_at: string | null;
  moderated_by: string | null;
  like_count: number;
  comment_count: number;
  report_count: number;
  created_at: string;
  updated_at: string;
}

export type PostReport = {
  id: string;
  post_id: string;
  reported_by: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

// =====================================================
// TEST REMINDERS
// =====================================================

export type ReminderTestType = 'DASS21' | 'PHQ9' | 'GAD7' | 'PSS' | 'MBTI' | 'BIG5' | 'SISRI24';
export type ReminderFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly';

export type TestReminder = {
  id: string;
  user_id: string;
  test_type: ReminderTestType;
  frequency: ReminderFrequency;
  next_reminder_date: string;
  last_completed_date: string | null;
  reminder_enabled: boolean;
  reminder_time: string;
  reminder_method: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// CONSENT LOG
// =====================================================

export type UserConsentLog = {
  id: string;
  user_id: string;
  consent_type: ConsentType;
  consented: boolean;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// =====================================================
// PREDICTION FEEDBACK
// =====================================================

export type PredictionFeedback = {
  id: string;
  user_id: string;
  miso_analysis_id: string | null;
  prediction_type: string;
  predicted_value: Json;
  actual_value: Json | null;
  feedback_rating: number | null;
  feedback_text: string | null;
  created_at: string;
}


// =====================================================
// DATABASE TYPE
// =====================================================

export type Database = {
  public: {
    Tables: {
      users: { Row: User; Insert: Partial<User>; Update: Partial<User>; Relationships: [] }
      mentor_profiles: { Row: MentorProfile; Insert: Partial<MentorProfile>; Update: Partial<MentorProfile>; Relationships: [] }
      personality_profiles: { Row: PersonalityProfile; Insert: Partial<PersonalityProfile>; Update: Partial<PersonalityProfile>; Relationships: [] }
      mental_health_records: { Row: MentalHealthRecord; Insert: Partial<MentalHealthRecord>; Update: Partial<MentalHealthRecord>; Relationships: [] }
      mentor_relationships: { Row: MentorRelationship; Insert: Partial<MentorRelationship>; Update: Partial<MentorRelationship>; Relationships: [] }
      mentor_notes: { Row: MentorNote; Insert: Partial<MentorNote>; Update: Partial<MentorNote>; Relationships: [] }
      mentors: { Row: Mentor; Insert: Partial<Mentor>; Update: Partial<Mentor>; Relationships: [] }
      bookings: { Row: Booking; Insert: Partial<Booking>; Update: Partial<Booking>; Relationships: [] }
      bfi2_test_history: { Row: BFI2TestHistory; Insert: Partial<BFI2TestHistory>; Update: Partial<BFI2TestHistory>; Relationships: [] }
      via_results: { Row: VIAResultRecord; Insert: Partial<VIAResultRecord>; Update: Partial<VIAResultRecord>; Relationships: [] }
      mbti_results: { Row: MBTIResultRecord; Insert: Partial<MBTIResultRecord>; Update: Partial<MBTIResultRecord>; Relationships: [] }
      sisri24_results: { Row: SISRI24ResultRecord; Insert: Partial<SISRI24ResultRecord>; Update: Partial<SISRI24ResultRecord>; Relationships: [] }
      user_goals: { Row: UserGoal; Insert: Partial<UserGoal>; Update: Partial<UserGoal>; Relationships: [] }
      chat_sessions: { Row: ChatSession; Insert: Partial<ChatSession>; Update: Partial<ChatSession>; Relationships: [] }
      chat_messages: { Row: ChatMessage; Insert: Partial<ChatMessage>; Update: Partial<ChatMessage>; Relationships: [] }
      user_consent_log: { Row: UserConsentLog; Insert: Partial<UserConsentLog>; Update: Partial<UserConsentLog>; Relationships: [] }
      booking_reviews: { Row: BookingReview; Insert: Partial<BookingReview>; Update: Partial<BookingReview>; Relationships: [] }
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product>; Relationships: [] }
      community_groups: { Row: CommunityGroup; Insert: Partial<CommunityGroup>; Update: Partial<CommunityGroup>; Relationships: [] }
      group_members: { Row: GroupMember; Insert: Partial<GroupMember>; Update: Partial<GroupMember>; Relationships: [] }
      community_posts: { Row: CommunityPost; Insert: Partial<CommunityPost>; Update: Partial<CommunityPost>; Relationships: [] }
      post_reports: { Row: PostReport; Insert: Partial<PostReport>; Update: Partial<PostReport>; Relationships: [] }
      crisis_alerts: { Row: CrisisAlert; Insert: Partial<CrisisAlert>; Update: Partial<CrisisAlert>; Relationships: [] }
      miso_analysis_logs: {
        Row: {
          id: string
          user_id: string
          analysis_result: Json
          bvs: number | null
          rcs: number | null
          profile_id: string | null
          risk_level: string | null
          completeness_level: string
          created_at: string
        }
        Insert: Partial<{
          id: string
          user_id: string
          analysis_result: Json
          bvs: number | null
          rcs: number | null
          profile_id: string | null
          risk_level: string | null
          completeness_level: string
          created_at: string
        }>
        Update: Partial<{
          id: string
          user_id: string
          analysis_result: Json
          bvs: number | null
          rcs: number | null
          profile_id: string | null
          risk_level: string | null
          completeness_level: string
          created_at: string
        }>
        Relationships: []
      }
      action_plans: { Row: ActionPlan; Insert: Partial<ActionPlan>; Update: Partial<ActionPlan>; Relationships: [] }
      action_completions: { Row: ActionCompletion; Insert: Partial<ActionCompletion>; Update: Partial<ActionCompletion>; Relationships: [] }
      test_reminders: { Row: TestReminder; Insert: Partial<TestReminder>; Update: Partial<TestReminder>; Relationships: [] }

      prediction_feedback: { Row: PredictionFeedback; Insert: Partial<PredictionFeedback>; Update: Partial<PredictionFeedback>; Relationships: [] }

      // Gamification
      gamification_profiles: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
          last_activity_date: string | null
          total_points: number
          level: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<{
          user_id: string
          current_streak: number
          longest_streak: number
          last_activity_date: string | null
          total_points: number
          level: number
          created_at: string
          updated_at: string
        }>
        Update: Partial<{
          user_id: string
          current_streak: number
          longest_streak: number
          last_activity_date: string | null
          total_points: number
          level: number
          created_at: string
          updated_at: string
        }>
        Relationships: []
      }
      badges: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          icon_url: string | null
          category: string | null
          points: number
          created_at: string
        }
        Insert: Partial<{
          id: string
          slug: string
          name: string
          description: string | null
          icon_url: string | null
          category: string | null
          points: number
          created_at: string
        }>
        Update: Partial<{
          id: string
          slug: string
          name: string
          description: string | null
          icon_url: string | null
          category: string | null
          points: number
          created_at: string
        }>
        Relationships: []
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: Partial<{
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }>
        Update: Partial<{
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
