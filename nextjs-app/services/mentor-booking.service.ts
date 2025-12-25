
import { BaseService } from './base.service';
import { Mentor, Booking } from '@/types/database';
import { BookingStatus, PaymentStatus, Currency } from '@/types/enums';

export class MentorBookingService extends BaseService {
    /**
     * Fetch all active mentors with optional search and specialty filtering
     */
    async getMentors(searchQuery: string = '', specialty: string = 'all'): Promise<Mentor[]> {
        let query = this.supabase
            .from('mentors')
            .select('*')
            .eq('is_active', true);

        if (searchQuery) {
            query = query.or(`name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`);
        }

        if (specialty !== 'all') {
            query = query.contains('specialties', [specialty]);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching mentors:', error);
            return [];
        }

        return data as Mentor[];
    }

    /**
     * Get a specific mentor by ID
     */
    async getMentorById(id: string): Promise<Mentor | null> {
        const { data, error } = await this.supabase
            .from('mentors')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching mentor:', error);
            return null;
        }

        return data as Mentor;
    }

    /**
     * Create a new booking
     */
    async createBooking(
        mentorId: string,
        date: Date,
        time: string,
        amount: number
    ): Promise<{ success: boolean; data?: Booking; error?: string }> {
        const { data: { user } } = await this.supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        // Format date as YYYY-MM-DD
        const sessionDate = date.toISOString().split('T')[0];

        const bookingData = {
            user_id: user.id,
            mentor_id: mentorId,
            session_date: sessionDate,
            session_time: time,
            duration_minutes: 60,
            total_price: amount,
            status: 'pending' as BookingStatus,
            payment_status: 'unpaid' as PaymentStatus,
            currency: 'VND' as Currency,
        };

        const { data, error } = await this.supabase
            .from('bookings')
            .insert(bookingData)
            .select()
            .single();

        if (error) {
            console.error('Error creating booking:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data: data as Booking };
    }

    /**
     * Get all bookings for the current user
     */
    async getUserBookings(): Promise<Booking[]> {
        const { data: { user } } = await this.supabase.auth.getUser();

        if (!user) return [];

        const { data, error } = await this.supabase
            .from('bookings')
            .select(`
                *,
                mentor:mentors(name, avatar_url, title)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }

        return data as Booking[];
    }

    /**
     * Seeding functions (Dev only)
     */
    async seedMentorsIfNeeded() {
        const { count } = await this.supabase.from('mentors').select('*', { count: 'exact', head: true });

        if (count && count > 0) return;

        console.log("Seeding mentors to Supabase...");

        const MOCK_MENTORS_DATA = [
            {
                name: "ThS. BS Nguyễn Minh Tuấn",
                email: "tuan.nguyen@misoscare.com",
                avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan",
                rating: 4.9,
                total_reviews: 128,
                specialties: ["Trầm cảm", "Rối loạn lo âu", "Stress công việc"],
                bio: "Hơn 10 năm kinh nghiệm điều trị các vấn đề về sức khỏe tâm thần tại BV Tâm thần Trung ương 1. Phong cách trị liệu nhẹ nhàng, lắng nghe và thấu hiểu.",
                hourly_rate: 500000,
                is_active: true,
                verified: true
            },
            {
                name: "TS. Lê Thị Mai Hạnh",
                email: "hanh.le@misoscare.com",
                avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hanh",
                rating: 4.8,
                total_reviews: 95,
                specialties: ["Tư vấn mối quan hệ", "Gia đình", "Phát triển bản thân"],
                bio: "Chuyên gia hàng đầu về trị liệu gia đình và cặp đôi. Giúp bạn tìm lại sự cân bằng trong cuộc sống và hàn gắn các mối quan hệ.",
                hourly_rate: 600000,
                is_active: true,
                verified: true
            },
            {
                name: "Cử nhân Trần Văn Bình",
                email: "binh.tran@misoscare.com",
                avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Binh",
                rating: 4.7,
                total_reviews: 42,
                specialties: ["Hướng nghiệp", "Áp lực học đường", "Gen Z"],
                bio: "Mentor trẻ trung, năng động, thấu hiểu tâm lý Gen Z. Chuyên hỗ trợ các vấn đề về định hướng nghề nghiệp và áp lực đồng trang lứa.",
                hourly_rate: 300000,
                is_active: true,
                verified: true
            }
        ];

        const { error } = await this.supabase.from('mentors').insert(MOCK_MENTORS_DATA);

        if (error) {
            console.error("Seeding failed:", error);
        } else {
            console.log("Seeding successful!");
        }
    }
}

export const mentorBookingService = new MentorBookingService();

// Re-export for backward compatibility
export const getMentors = (q?: string, s?: string) => mentorBookingService.getMentors(q, s);
export const getMentorById = (id: string) => mentorBookingService.getMentorById(id);
export const createBooking = (mId: string, d: Date, t: string, a: number) => mentorBookingService.createBooking(mId, d, t, a);
export const getUserBookings = () => mentorBookingService.getUserBookings();
export const seedMentorsIfNeeded = () => mentorBookingService.seedMentorsIfNeeded();
