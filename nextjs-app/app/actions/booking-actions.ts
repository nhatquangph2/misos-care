'use server';

import { createClient } from '@/lib/supabase/server';
import { MentorAvailability, MentorBooking } from '@/types/mentor';
import { revalidatePath } from 'next/cache';

export async function getMentorAvailability(mentorId: string): Promise<MentorAvailability[]> {
    const supabase = await createClient();

    // Cast to any because mentor_availabilities is new
    const { data, error } = await (supabase as any)
        .from('mentor_availabilities')
        .select('*')
        .eq('mentor_id', mentorId)
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching availability:', error);
        return [];
    }

    return data as MentorAvailability[];
}

export async function getMentorBusySlots(mentorId: string, fromDate: string, toDate: string): Promise<{ start: string, end: string }[]> {
    const supabase = await createClient();

    // Fetch confirmed or pending bookings to block slots
    const { data, error } = await (supabase as any)
        .from('mentor_bookings')
        .select('start_time, end_time')
        .eq('mentor_id', mentorId)
        .in('status', ['pending', 'confirmed'])
        .gte('start_time', fromDate)
        .lte('end_time', toDate);

    if (error) {
        console.error('Error fetching busy slots:', error);
        return [];
    }

    return data.map((b: any) => ({ start: b.start_time, end: b.end_time }));
}

export async function createBooking(
    mentorId: string,
    startTime: Date,
    endTime: Date,
    price: number,
    notes?: string
): Promise<{ success: boolean; message: string; bookingId?: string }> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: 'Unauthorized' };
    }

    // Basic validation: Check if slot is free
    // We should double check on server side to prevent race conditions
    // For MVP, simplistic check:
    const busy = await getMentorBusySlots(mentorId, startTime.toISOString(), endTime.toISOString());
    if (busy.length > 0) {
        // Simple overlap check
        const hasOverlap = busy.some(slot => {
            const s = new Date(slot.start).getTime();
            const e = new Date(slot.end).getTime();
            const reqS = startTime.getTime();
            const reqE = endTime.getTime();
            return (reqS < e && reqE > s);
        });

        if (hasOverlap) {
            return { success: false, message: 'This slot is no longer available.' };
        }
    }

    const { data, error } = await (supabase as any)
        .from('mentor_bookings')
        .insert({
            user_id: user.id,
            mentor_id: mentorId,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            status: 'pending',
            price: price,
            payment_status: 'unpaid',
            user_notes: notes
        })
        .select()
        .single();

    if (error) {
        console.error('Create booking error:', error);
        return { success: false, message: 'Failed to create booking.' };
    }

    revalidatePath('/dashboard');
    revalidatePath(`/mentor/${mentorId}`);

    return { success: true, message: 'Booking request sent!', bookingId: data.id };
}

export async function getUserBookings(): Promise<MentorBooking[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await (supabase as any)
        .from('mentor_bookings')
        .select(`
            *,
            mentor:users!mentor_id(full_name, email, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

    if (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }

    return data as MentorBooking[];
}
