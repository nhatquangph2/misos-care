'use client';

import React, { useState, useTransition } from 'react';
import { OceanItem, UserOceanItem } from '@/types/gamification';
import { buyOceanItem, toggleItemPlacement } from '@/app/actions/gamification-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Backpack, Fish, Flower2, Box, Coins, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { GlossaryHighlighter } from '@/components/ui/GlossaryTooltip';

interface OceanInventoryProps {
    shopItems: OceanItem[];
    userItems: UserOceanItem[];
    userPoints: number;
}

export function OceanInventory({ shopItems, userItems, userPoints }: OceanInventoryProps) {
    const [isPending, startTransition] = useTransition();

    // Filter items
    const inventoryItems = userItems.filter(item => item.position_x < 0);
    const placedItems = userItems.filter(item => item.position_x >= 0);

    const handleBuy = (itemId: string) => {
        startTransition(async () => {
            const res = await buyOceanItem(itemId);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        });
    };

    const handleTogglePlacement = (itemId: string, shouldPlace: boolean) => {
        startTransition(async () => {
            const res = await toggleItemPlacement(itemId, shouldPlace);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        });
    };

    const renderItemIcon = (item?: OceanItem) => {
        if (!item) return <Box className="text-slate-400" />;
        if (item.type === 'fish') return <Fish className="text-orange-400" />;
        if (item.type === 'plant') return <Flower2 className="text-green-500" />;
        return <Box className="text-slate-400" />;
    };

    return (
        <Card className="glass-card border-0 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Cửa hàng & Túi đồ
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="shop" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/20">
                        <TabsTrigger value="shop">Cửa hàng</TabsTrigger>
                        <TabsTrigger value="bag">
                            Túi đồ <span className="ml-2 text-xs bg-rose-500 text-white px-1.5 rounded-full">{inventoryItems.length}</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* SHOP TAB */}
                    <TabsContent value="shop" className="mr-[-10px] pr-[10px] max-h-[500px] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {shopItems?.map((item) => {
                                const canAfford = userPoints >= item.unlock_price;
                                // We allow buying duplicates? Usually yes for fish/decor.
                                // If "Unique", disable. Assuming allow duplicates for now.

                                return (
                                    <div key={item.id} className="group relative bg-white/40 dark:bg-slate-800/40 border border-white/20 rounded-xl p-3 text-center transition-all hover:scale-105 hover:bg-white/60 hover:shadow-lg flex flex-col items-center justify-between min-h-[160px]">
                                        <div className="h-16 w-16 mb-2 bg-slate-50/50 rounded-full flex items-center justify-center overflow-hidden">
                                            {item.image_url ?
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-contain p-2" />
                                                : renderItemIcon(item)
                                            }
                                        </div>

                                        <div className="w-full">
                                            <h4 className="font-semibold text-sm truncate w-full" title={item.name}>{item.name}</h4>
                                            <div className="flex items-center justify-center gap-1 text-xs text-amber-600 font-medium my-1">
                                                <Coins className="h-3 w-3" />
                                                {item.unlock_price}
                                            </div>

                                            <Button
                                                size="sm"
                                                variant="default" // always clickable
                                                disabled={!canAfford || isPending}
                                                className="w-full text-xs h-8 bg-blue-600 hover:bg-blue-700"
                                                onClick={() => handleBuy(item.id)}
                                            >
                                                {isPending ? "..." : "Mua"}
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </TabsContent>

                    {/* BAG TAB */}
                    <TabsContent value="bag" className="min-h-[200px]">
                        {inventoryItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground border-2 border-dashed border-white/30 rounded-xl">
                                <Backpack className="h-10 w-10 mb-2 opacity-50" />
                                <p>Túi đồ trống</p>
                                <p className="text-xs">Hãy mua thêm vật phẩm!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {inventoryItems.map((userItem) => (
                                    <div key={userItem.id} className="group relative bg-white/40 dark:bg-slate-800/40 border border-white/20 rounded-xl p-3 text-center transition-all hover:bg-white/60 hover:shadow-lg flex flex-col items-center justify-between">
                                        <div className="h-14 w-14 mb-2 bg-slate-50/50 rounded-full flex items-center justify-center overflow-hidden">
                                            {userItem.item?.image_url ?
                                                <img src={userItem.item.image_url} alt={userItem.item.name} className="w-full h-full object-contain p-2" />
                                                : renderItemIcon(userItem.item)
                                            }
                                        </div>

                                        <div className="w-full">
                                            <h4 className="font-semibold text-xs truncate w-full mb-2">{userItem.item?.name}</h4>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={isPending}
                                                className="w-full text-xs h-7 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                                                onClick={() => handleTogglePlacement(userItem.id, true)}
                                            >
                                                <ArrowUpCircle className="w-3 h-3 mr-1" />
                                                Sử dụng
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Manage Placed Items Section (Optional but good for UX) */}
                        {placedItems.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-white/20">
                                <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                                    <Fish className="h-4 w-4" /> Đang thả trong hồ ({placedItems.length})
                                </h4>
                                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                    {placedItems.map(item => (
                                        <div key={item.id} className="flex-shrink-0 relative w-12 h-12 bg-white/30 rounded-lg p-1 group cursor-pointer border border-white/10 hover:border-red-300">
                                            <img src={item.item?.image_url} className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleTogglePlacement(item.id, false)}>
                                                <ArrowDownCircle className="text-white w-6 h-6" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">Bấm vào vật phẩm để cất vào túi</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
