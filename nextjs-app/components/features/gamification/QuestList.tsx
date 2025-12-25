'use client';

import React, { useState } from 'react';
import { DailyQuest } from '@/types/gamification';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { completeQuest } from '@/app/actions/gamification-actions';
import { toast } from 'sonner';

interface QuestListProps {
    quests: DailyQuest[];
}

export function QuestList({ quests }: QuestListProps) {
    const [items, setItems] = useState(quests);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleComplete = async (quest: DailyQuest) => {
        if (quest.status === 'completed') return;

        setLoadingId(quest.id);
        try {
            const success = await completeQuest(quest.id);
            if (success) {
                toast.success(`Nhiệm vụ hoàn thành! +${quest.reward_points} điểm`);
                setItems(prev => prev.map(q =>
                    q.id === quest.id
                        ? { ...q, status: 'completed', completed_at: new Date().toISOString() }
                        : q
                ));
            } else {
                toast.error('Không thể hoàn thành nhiệm vụ.');
            }
        } catch (e) {
            console.error(e);
            toast.error('Có lỗi xảy ra.');
        } finally {
            setLoadingId(null);
        }
    };

    // Sort: Pending first, then completed
    const sortedQuests = [...items].sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === 'pending' ? -1 : 1;
    });

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Nhiệm vụ hằng ngày
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {sortedQuests.map(quest => {
                        const isCompleted = quest.status === 'completed';
                        return (
                            <div
                                key={quest.id}
                                className={`
                                flex items-center justify-between p-3 rounded-lg border transition-all
                                ${isCompleted
                                        ? 'bg-emerald-50 border-emerald-100 opacity-80'
                                        : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm'}
                            `}
                            >
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleComplete(quest)}
                                        disabled={isCompleted || loadingId === quest.id}
                                        className={`
                                        flex-shrink-0 transition-colors
                                        ${isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-blue-500'}
                                    `}
                                    >
                                        {loadingId === quest.id ? (
                                            <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" />
                                        ) : isCompleted ? (
                                            <CheckCircle2 className="h-6 w-6" />
                                        ) : (
                                            <Circle className="h-6 w-6" />
                                        )}
                                    </button>
                                    <div>
                                        <p className={`font-medium text-sm ${isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                                            {quest.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {quest.type.replace('_', ' ').toUpperCase()} • +{quest.reward_points} pts
                                        </p>
                                    </div>
                                </div>

                                {/* Action Button if needed, for checking tasks like "read article" we might link somewhere */}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
