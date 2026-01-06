import React from 'react';
import { getGamificationState, buyOceanItem } from '@/app/actions/gamification-actions';
import { OceanGarden } from '@/components/features/gamification/OceanGarden';
import { QuestList } from '@/components/features/gamification/QuestList';
import UserEngagement from '@/components/gamification/UserEngagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Coins, Fish, Flower2, Box } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { OceanItem } from '@/types/gamification';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Vườn Cảm Xúc | Misos Care',
    description: 'Thư giãn, nuôi dưỡng khu vườn tâm hồn và hoàn thành nhiệm vụ',
};

export default async function SanctuaryPage() {
    const state = await getGamificationState();

    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: shopItems } = await (supabase as any)
        .from('ocean_items')
        .select('*')
        .order('unlock_price', { ascending: true });

    const handleBuy = async (formData: FormData) => {
        'use server';
        const itemId = formData.get('itemId') as string;
        await buyOceanItem(itemId);
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">
                        Vườn Cảm Xúc
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Nơi thư giãn và nuôi dưỡng tâm hồn.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-100">
                        <Coins className="h-5 w-5 text-amber-500" />
                        <span className="font-bold text-amber-700">{state.profile?.total_points || 0} Points</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full border border-rose-100">
                        <span className="font-bold text-rose-700">Level {state.profile?.level || 1}</span>
                    </div>
                </div>
            </header>

            <UserEngagement userId={state.profile?.user_id || ''} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-sm overflow-hidden bg-slate-50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white border-b">
                            <CardTitle className="text-lg flex items-center gap-2 text-rose-700">
                                <Fish className="h-5 w-5" />
                                Đại dương của tôi
                            </CardTitle>
                        </CardHeader>
                        <div className="h-[400px] relative">
                            <OceanGarden items={state.oceanItems} className="h-full rounded-none" />
                        </div>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                Cửa hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {shopItems?.map((item: OceanItem) => {
                                    const owned = state.oceanItems.some(i => i.item_id === item.id);
                                    const canAfford = (state.profile?.total_points || 0) >= item.unlock_price;

                                    return (
                                        <div key={item.id} className="group relative bg-white border rounded-xl p-3 text-center transition-all hover:shadow-md">
                                            <div className="h-16 w-16 mx-auto mb-2 bg-slate-50 rounded-full flex items-center justify-center">
                                                {item.type === 'fish' ? <Fish className="text-orange-400" /> :
                                                    item.type === 'plant' ? <Flower2 className="text-green-500" /> : <Box className="text-slate-400" />}
                                            </div>
                                            <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                                            <div className="flex items-center justify-center gap-1 text-xs text-amber-600 font-medium my-2">
                                                <Coins className="h-3 w-3" />
                                                {item.unlock_price}
                                            </div>

                                            <form action={handleBuy}>
                                                <input type="hidden" name="itemId" value={item.id} />
                                                <Button
                                                    size="sm"
                                                    variant={owned ? "secondary" : "default"}
                                                    disabled={owned || !canAfford}
                                                    className="w-full text-xs h-8"
                                                >
                                                    {owned ? "Đã sở hữu" : "Mua"}
                                                </Button>
                                            </form>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <QuestList quests={state.quests} />

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Hoạt động thư giãn</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                                📖 Nhật ký cảm xúc
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                🧘‍♀️ Bài tập thiền
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
