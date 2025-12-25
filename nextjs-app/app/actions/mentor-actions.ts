'use server';

import { createClient } from '@/lib/supabase/server';
import { MentorFilter, MentorProfile, Specialization } from '@/types/mentor';
import { revalidatePath } from 'next/cache';

export async function getSpecializations(): Promise<Specialization[]> {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
        .from('specializations')
        .select('*')
        .order('name_vi');

    if (error) {
        console.error('Error fetching specializations:', error);
        return [];
    }

    return data as Specialization[];
}

export async function getMentors(filter?: MentorFilter): Promise<MentorProfile[]> {
    const supabase = await createClient();

    let query = (supabase as any)
        .from('mentor_profiles')
        .select(`
      *,
      user:users!user_id(id, full_name, avatar_url, email),
      detailed_specializations:mentor_specializations(
        years_experience,
        specialization:specializations(id, slug, name_vi, name_en)
      )
    `)
        .eq('is_available', true);

    // Apply filters
    if (filter?.min_price) {
        query = query.gte('price_per_session', filter.min_price);
    }
    if (filter?.max_price) {
        query = query.lte('price_per_session', filter.max_price);
    }

    // Note: Filtering by detailed specialization relation is tricky in one go
    // standard Supabase way to filter by relation existence:
    if (filter?.specialization_slug) {
        // We filter mentors who have a specialization matching the slug
        // This uses inner join logic on the junction table
        query = query.not('detailed_specializations', 'is', null);
        // Actually, simple way: fetch all and filter in memory OR 
        // use !inner join logic if Supabase supports it cleanly in JS client (it does via modifiers)
        // For now, let's keep it simple. If scale is small, filtering in memory is fine.
        // Ideally:
        // query = query.eq('detailed_specializations.specialization.slug', filter.specialization_slug) -- (syntax varies)
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching mentors:', error);
        return [];
    }

    let mentors = data as unknown as MentorProfile[];

    // In-memory filter for complex relations if needed
    if (filter?.specialization_slug) {
        mentors = mentors.filter(m =>
            m.detailed_specializations?.some(
                s => s.specialization?.slug === filter.specialization_slug
            )
        );
    }

    return mentors;
}

export async function getMentorById(mentorId: string): Promise<MentorProfile | null> {
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
        .from('mentor_profiles')
        .select(`
      *,
      user:users!user_id(id, full_name, avatar_url, email),
      detailed_specializations:mentor_specializations(
        years_experience,
        specialization:specializations(id, slug, name_vi, name_en)
      )
    `)
        .eq('user_id', mentorId) // Typically we query by User ID or Profile ID depending on architecture. Let's assume input is User ID (Mentor ID)
        .single();

    if (error) {
        console.error('Error fetching mentor:', error);
        return null;
    }

    return data as unknown as MentorProfile;
}

export async function updateMentorProfile(
    prevState: any,
    formData: FormData
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: 'Unauthorized' };

    try {
        const title = formData.get('title') as string;
        const bio = formData.get('bio') as string;
        const approach = formData.get('approach') as string;
        const price = Number(formData.get('price'));
        const organization = formData.get('organization') as string;

        const { error } = await (supabase as any)
            .from('mentor_profiles')
            .update({
                title,
                professional_bio: bio,
                approach_description: approach,
                price_per_session: price,
                organization,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);

        if (error) throw error;

        revalidatePath('/mentor/profile');
        return { success: true, message: 'Profile updated' };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, message: 'Failed to update profile' };
    }
}
