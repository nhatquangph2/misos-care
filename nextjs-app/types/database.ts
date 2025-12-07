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

export interface User {
  id: string
  email: string
  phone: string | null
  name: string
  avatar_url: string | null
  date_of_birth: string | null // Date stored as ISO string
  gender: Gender | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface PersonalityProfile {
  id: string
  user_id: string
  mbti_type: MBTIType | null
  mbti_scores: Json | null // {E: 60, I: 40, S: 45, N: 55, T: 70, F: 30, J: 65, P: 35}
  big5_openness: number | null // 0-100
  big5_conscientiousness: number | null
  big5_extraversion: number | null
  big5_agreeableness: number | null
  big5_neuroticism: number | null
  enneagram_type: number | null // 1-9
  enneagram_wing: string | null
  last_updated: string
  created_at: string
}

export interface MentalHealthRecord {
  id: string
  user_id: string
  test_type: TestType
  test_version: string
  total_score: number
  subscale_scores: Json | null // {depression: 12, anxiety: 8, stress: 14}
  severity_level: SeverityLevel
  crisis_flag: boolean
  crisis_reason: string | null
  raw_responses: Json | null // [{question: 1, answer: 3}, ...]
  completed_at: string
  created_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  title: string | null
  context_summary: string | null
  is_active: boolean
  message_count: number
  started_at: string
  last_message_at: string
  created_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: ChatRole
  content: string
  model: string | null
  tokens_used: number | null
  prompt_tokens: number | null
  completion_tokens: number | null
  contains_crisis_keyword: boolean
  moderation_flagged: boolean
  moderation_categories: Json | null
  created_at: string
}

export interface Mentor {
  id: string
  name: string
  email: string
  phone: string | null
  avatar_url: string | null
  bio: string | null
  credentials: string | null
  specialties: string[] // Array of specialty strings
  personality_match: string[] | null // Array of MBTI types
  hourly_rate: number
  currency: Currency
  availability: Json | null // {monday: ['09:00', '10:00'], ...}
  rating: number // 0-5
  total_sessions: number
  total_reviews: number
  is_active: boolean
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  mentor_id: string
  session_date: string // Date as ISO string
  session_time: string // Time as string (HH:MM:SS)
  duration_minutes: number
  total_price: number
  currency: Currency
  status: BookingStatus
  cancellation_reason: string | null
  cancelled_by: CancelledBy | null
  payment_status: PaymentStatus
  payment_method: PaymentMethod | null
  payment_transaction_id: string | null
  paid_at: string | null
  meeting_link: string | null
  meeting_platform: MeetingPlatform | null
  user_notes: string | null
  mentor_notes: string | null
  created_at: string
  updated_at: string
}

export interface BookingReview {
  id: string
  booking_id: string
  user_id: string
  mentor_id: string
  rating: number // 1-5
  review_text: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  category: ProductCategory
  price: number
  currency: Currency
  image_url: string | null
  images: Json | null // Array of image URLs
  external_link: string | null
  stock_quantity: number | null
  click_count: number
  view_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CommunityGroup {
  id: string
  personality_type: CommunityGroupType | null
  name: string
  description: string | null
  cover_image_url: string | null
  rules: Json | null // [{rule: 'Be respectful', order: 1}, ...]
  member_count: number
  post_count: number
  is_private: boolean
  requires_approval: boolean
  created_at: string
  updated_at: string
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: GroupMemberRole
  status: GroupMemberStatus
  joined_at: string
}

export interface CommunityPost {
  id: string
  group_id: string
  user_id: string
  content: string
  images: Json | null // Array of image URLs
  moderation_status: ModerationStatus
  moderation_reason: string | null
  moderated_at: string | null
  moderated_by: string | null
  like_count: number
  comment_count: number
  report_count: number
  created_at: string
  updated_at: string
}

export interface PostReport {
  id: string
  post_id: string
  reported_by: string
  reason: ReportReason
  description: string | null
  status: ReportStatus
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

export interface CrisisAlert {
  id: string
  user_id: string
  trigger_type: CrisisTriggerType
  trigger_source_id: string | null
  severity: CrisisSeverity
  details: Json | null // {test_type: 'PHQ9', question_9_score: 2}
  intervention_sent: boolean
  intervention_type: InterventionType | null
  resolved: boolean
  resolved_at: string | null
  resolved_notes: string | null
  created_at: string
}

// =====================================================
// DATABASE TYPE
// =====================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      personality_profiles: {
        Row: PersonalityProfile
        Insert: Omit<PersonalityProfile, 'id' | 'created_at' | 'last_updated'>
        Update: Partial<Database['public']['Tables']['personality_profiles']['Insert']>
      }
      mental_health_records: {
        Row: MentalHealthRecord
        Insert: Omit<MentalHealthRecord, 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['mental_health_records']['Insert']>
      }
      chat_sessions: {
        Row: ChatSession
        Insert: Omit<ChatSession, 'id' | 'created_at' | 'message_count' | 'last_message_at'>
        Update: Partial<Database['public']['Tables']['chat_sessions']['Insert']>
      }
      chat_messages: {
        Row: ChatMessage
        Insert: Omit<ChatMessage, 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['chat_messages']['Insert']>
      }
      mentors: {
        Row: Mentor
        Insert: Omit<Mentor, 'id' | 'created_at' | 'updated_at' | 'rating' | 'total_sessions' | 'total_reviews'>
        Update: Partial<Database['public']['Tables']['mentors']['Insert']>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      booking_reviews: {
        Row: BookingReview
        Insert: Omit<BookingReview, 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['booking_reviews']['Insert']>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'click_count' | 'view_count'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      community_groups: {
        Row: CommunityGroup
        Insert: Omit<CommunityGroup, 'id' | 'created_at' | 'updated_at' | 'member_count' | 'post_count'>
        Update: Partial<Database['public']['Tables']['community_groups']['Insert']>
      }
      group_members: {
        Row: GroupMember
        Insert: Omit<GroupMember, 'id' | 'joined_at'>
        Update: Partial<Database['public']['Tables']['group_members']['Insert']>
      }
      community_posts: {
        Row: CommunityPost
        Insert: Omit<CommunityPost, 'id' | 'created_at' | 'updated_at' | 'like_count' | 'comment_count' | 'report_count'>
        Update: Partial<Database['public']['Tables']['community_posts']['Insert']>
      }
      post_reports: {
        Row: PostReport
        Insert: Omit<PostReport, 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['post_reports']['Insert']>
      }
      crisis_alerts: {
        Row: CrisisAlert
        Insert: Omit<CrisisAlert, 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['crisis_alerts']['Insert']>
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
