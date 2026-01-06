import { GlossaryHighlighter } from '@/components/ui/GlossaryTooltip';
import { getGamificationState } from '@/app/actions/gamification-actions';
import { OceanGarden } from '@/components/features/gamification/OceanGarden';
import { OceanInventory } from '@/components/features/gamification/OceanInventory';
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

    // Filter items: Ocean gets placed items only
    const placedItems = state.oceanItems.filter(item => item.position_x >= 0);

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
                    <div className="flex items-center gap-2 px-4 py-2 glass-card bg-amber-500/10 border-amber-200/20">
                        <Coins className="h-5 w-5 text-amber-500" />
                        <span className="font-bold text-amber-700 dark:text-amber-400">
                            {state.profile?.total_points || 0} <GlossaryHighlighter text="Điểm" />
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 glass-card bg-rose-500/10 border-rose-200/20">
                        <span className="font-bold text-rose-700 dark:text-rose-400">
                            <GlossaryHighlighter text="Cấp độ" /> {state.profile?.level || 1}
                        </span>
                    </div>
                </div>
            </header>

            <UserEngagement userId={state.profile?.user_id || ''} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-0 shadow-lg overflow-hidden glass-card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/20">
                            <CardTitle className="text-lg flex items-center gap-2 text-rose-700 dark:text-rose-400">
                                <Fish className="h-5 w-5" />
                                Đại dương của tôi
                            </CardTitle>
                        </CardHeader>
                        <div className="h-[400px] relative bg-blue-900/10 backdrop-blur-sm">
                            <OceanGarden items={placedItems} className="h-full rounded-none bg-transparent" />
                        </div>
                    </Card>

                    <OceanInventory
                        shopItems={shopItems}
                        userItems={state.oceanItems}
                        userPoints={state.profile?.total_points || 0}
                    />
                </div>

                <div className="space-y-6">
                    <QuestList quests={state.quests} />

                    <Card className="glass-card border-0">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Hoạt động thư giãn</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start bg-white/30 hover:bg-white/50 border-white/20">
                                📖 Nhật ký cảm xúc
                            </Button>
                            <Button variant="outline" className="w-full justify-start bg-white/30 hover:bg-white/50 border-white/20">
                                🧘‍♀️ Bài tập thiền
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
