import { createClient } from '@/lib/supabase/server';
import MisoInsightCard from '@/components/profile/MisoInsightCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getUnifiedProfile } from '@/services/unified-profile.service';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
    const { id: clientId } = await params;
    const supabase = await createClient();

    // Verify access (omitted for brevity)

    // Fetch data
    const unifiedProfile = await getUnifiedProfile(clientId, supabase);
    const { data: user } = await supabase.from('users').select('*').eq('id', clientId).single();

    if (!user) {
        return <div>Client not found</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <Link href="/professional/clients" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
            </Link>

            <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700">
                    {user.name?.charAt(0)}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-gray-500">{user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: MISO Analysis */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold">Phân Tích Tâm Lý (MISO V3)</h2>
                    <MisoInsightCard
                        misoAnalysis={unifiedProfile.miso_analysis}
                        isLoading={false}
                        userName={user.name}
                    />
                </div>

                {/* Right: Notes & Actions */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="font-semibold mb-4">Ghi Chú Mentor</h3>
                        <textarea
                            className="w-full border rounded-lg p-3 h-32 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            placeholder="Thêm ghi chú về khách hàng này..."
                        ></textarea>
                        <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">Lưu Ghi Chú</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
