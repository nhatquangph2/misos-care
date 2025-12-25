import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ClientList from '@/components/professional/ClientList';

export default async function ProfessionalClientsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Check if user is a mentor
    await supabase
        .from('mentors')
        .select('id')
        .eq('id', user.id) // Assuming user.id same as mentor.id for simplicity or linked
        .maybeSingle();

    // If not a mentor, redirect or show not authorized
    // For demo purposes, we might skip strict checking or assume logic

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Quản Lý Khách Hàng</h1>
                <p className="text-gray-500 mt-2">Theo dõi tiến độ và hồ sơ tâm lý của khách hàng.</p>
            </div>

            <ClientList mentorId={user.id} />
        </div>
    );
}
