'use server';

import { createClient } from '@/lib/supabase/server';
import { MentorReview } from '@/types/mentor';
import { revalidatePath } from 'next/cache';

export async function getReviews(mentorId: string): Promise<MentorReview[]> {
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
        .from('mentor_reviews')
        .select(`
      *,
      user:users!user_id(full_name, avatar_url)
    `)
        .eq('mentor_id', mentorId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }

    return data as MentorReview[];
}

export async function createReview(
    mentorId: string,
    bookingId: string,
    rating: number,
    comment: string
): Promise<{ success: boolean; message: string }> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: 'Unauthorized' };

    // 1. Check if booking exists, is completed, belongs to user, and NOT reviewed yet
    // We can do this via RLS policy checks on insert, but explicit check is better for UX messages
    const { data: booking } = await (supabase as any)
        .from('mentor_bookings')
        .select('id, status')
        .eq('id', bookingId)
        .eq('user_id', user.id)
        .single();

    if (!booking) return { success: false, message: 'Booking not found.' };
    if (booking.status !== 'completed') return { success: false, message: 'You can only review completed sessions.' };

    // Check existing review
    const { data: existing } = await (supabase as any)
        .from('mentor_reviews')
        .select('id')
        .eq('booking_id', bookingId)
        .single();

    if (existing) return { success: false, message: 'You have already reviewed this session.' };

    const { error } = await (supabase as any)
        .from('mentor_reviews')
        .insert({
            user_id: user.id,
            mentor_id: mentorId,
            booking_id: bookingId,
            rating,
            comment,
            is_public: true
        });

    if (error) {
        console.error('Create review error:', error);
        return { success: false, message: 'Failed to submit review.' };
    }

    // Trigger revalidation
    revalidatePath(`/mentors/${mentorId}`);

    return { success: true, message: 'Review submitted successfully!' };
}
