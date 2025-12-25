'use client';

import { useEffect, useState } from 'react';
import { professionalService, ClientSummary } from '@/services/professional.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ClientList({ mentorId }: { mentorId: string }) {
    const [clients, setClients] = useState<ClientSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchClients = async () => {
            if (!mentorId) return;
            setLoading(true);
            const data = await professionalService.getClients(mentorId);
            setClients(data);
            setLoading(false);
        };

        fetchClients();
    }, [mentorId]);

    if (loading) {
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>;
    }

    if (clients.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <h3 className="text-lg font-medium text-gray-500">Chưa có khách hàng nào</h3>
                <p className="text-sm text-gray-400 mt-1">Các kết nối mentor-mentee sẽ hiển thị ở đây.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {clients.map((item) => (
                <Card key={item.relationshipId} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <Avatar className="h-12 w-12 border">
                            <AvatarImage src={item.client.avatar_url || ''} />
                            <AvatarFallback>{item.client.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <h4 className="font-semibold text-lg truncate">{item.client.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{item.client.email}</p>
                        </div>
                        <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className={item.status === 'active' ? 'bg-green-600' : ''}>
                            {item.status}
                        </Badge>
                    </CardHeader>

                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <Calendar className="h-4 w-4" />
                            <span>Bắt đầu: {item.started_at ? new Date(item.started_at).toLocaleDateString('vi-VN') : 'Chưa rõ'}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <Button variant="outline" size="sm" className="w-full gap-2">
                                <MessageCircle className="h-4 w-4" /> Chat
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
                                onClick={() => router.push(`/professional/clients/${item.client.id}`)}
                            >
                                <FileText className="h-4 w-4" /> Hồ sơ
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
