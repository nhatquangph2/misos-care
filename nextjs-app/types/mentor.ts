/**
 * Mentor System Types
 * Corresponding to Database Schema 20251226_mentor_system_v2.sql
 */

export interface Specialization {
    id: string;
    slug: string;
    name_vi: string;
    name_en?: string;
    description?: string;
}

export interface MentorSpecialization {
    mentor_id: string;
    specialization_id: string;
    years_experience: number;
    specialization?: Specialization; // Joined
}

export interface MentorAvailability {
    id: string;
    mentor_id: string;
    day_of_week: number | null; // 0-6
    start_time: string; // HH:MM:SS
    end_time: string; // HH:MM:SS
    specific_date?: string; // YYYY-MM-DD
    is_active: boolean;
}

export interface MentorReview {
    id: string;
    user_id: string;
    mentor_id: string;
    booking_id: string;
    rating: number;
    comment?: string;
    is_public: boolean;
    created_at: string;
    user?: {
        full_name?: string;
        avatar_url?: string;
    };
}

export interface MentorProfile {
    id: string; // This corresponds to mentor_profiles.id (UUID)
    user_id: string;

    // Professional Info
    title: string | null;
    specializations: string[] | null; // From legacy array column or computed
    years_experience: number;
    organization: string | null;

    // Bio
    professional_bio: string | null;
    approach_description: string | null;

    // Stats
    rating_avg: number;
    rating_count: number;
    is_available: boolean;
    price_per_session: number;
    currency: string;

    // Relations
    user?: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
        email: string;
    };

    detailed_specializations?: MentorSpecialization[];
    reviews?: MentorReview[];
}

export interface MentorBooking {
    id: string;
    user_id: string;
    mentor_id: string;
    start_time: string;
    end_time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
    price: number;
    payment_status: 'unpaid' | 'paid' | 'refunded';
    meeting_link?: string;
    user_notes?: string;
    mentor?: {
        user?: {
            full_name?: string;
        };
    };
    user?: {
        full_name?: string;
        email?: string;
    };
}

export type MentorFilter = {
    specialization_slug?: string;
    min_price?: number;
    max_price?: number;
    available_only?: boolean;
}
