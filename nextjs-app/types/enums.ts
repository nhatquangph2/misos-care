/**
 * Enum Types for the Application
 */

// User
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'

// Personality
export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'

export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

// Mental Health
export type TestType = 'DASS21' | 'PHQ9' | 'GAD7' | 'PSS'

export type SeverityLevel =
  | 'normal'
  | 'mild'
  | 'moderate'
  | 'severe'
  | 'extremely_severe'

// Chat
export type ChatRole = 'user' | 'assistant' | 'system'

// Booking
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export type PaymentStatus =
  | 'unpaid'
  | 'paid'
  | 'refunded'
  | 'failed'

export type PaymentMethod = 'vnpay' | 'momo' | 'stripe' | 'bank_transfer'

export type MeetingPlatform = 'google_meet' | 'zoom' | 'teams'

export type CancelledBy = 'user' | 'mentor' | 'admin'

// Product
export type ProductCategory =
  | 'journal'
  | 'keychain'
  | 'sticker'
  | 'book'
  | 'accessory'

// Community
export type CommunityGroupType = MBTIType | 'general'

export type GroupMemberRole = 'member' | 'moderator' | 'admin'

export type GroupMemberStatus = 'pending' | 'active' | 'banned'

export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged'

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'inappropriate'
  | 'misinformation'
  | 'other'

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed'

// Crisis
export type CrisisTriggerType =
  | 'test_score'
  | 'chat_content'
  | 'community_post'
  | 'manual'

export type CrisisSeverity = 'low' | 'medium' | 'high' | 'critical'

export type InterventionType = 'modal' | 'email' | 'sms' | 'notification'

// Currency
export type Currency = 'VND' | 'USD'

// User Roles
export type UserRole = 'user' | 'mentor' | 'admin'

// Profile Visibility
export type ProfileVisibility = 'private' | 'mentors_only' | 'public'

// Mentor Relationship Status
export type MentorRelationshipStatus = 'pending' | 'active' | 'paused' | 'ended' | 'cancelled'

// Mentor Note Type
export type MentorNoteType = 'general' | 'session' | 'observation' | 'recommendation' | 'follow_up'

// Consent Type
export type ConsentType = 'terms' | 'privacy' | 'data_sharing' | 'mentor_access' | 'marketing'

// Specialties for mentors
export const MentorSpecialties = [
  'Career Counseling',
  'Relationship',
  'Anxiety',
  'Depression',
  'Stress Management',
  'Life Coaching',
  'Academic Support',
  'Family Issues',
  'Self-Esteem',
  'Trauma Recovery',
] as const

export type MentorSpecialty = typeof MentorSpecialties[number]
