'use client';

import React, { useRef, useEffect, useState } from 'react';
import { UserOceanItem } from '@/types/gamification';
import { Card } from '@/components/ui/card';
import { OceanCreature } from './OceanCreature';
import { motion, AnimatePresence } from 'framer-motion';

interface OceanGardenProps {
    items: UserOceanItem[];
    className?: string;
}

interface FoodPellet {
    id: number;
    x: number;
    y: number;
}

export function OceanGarden({ items, className }: OceanGardenProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [food, setFood] = useState<FoodPellet | null>(null);
    const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; size: number; duration: number }>>([]);

    // Initialize size
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Bubble Generator
    useEffect(() => {
        const interval = setInterval(() => {
            const newBubble = {
                id: Date.now(),
                x: Math.random() * 100, // percentage
                size: 5 + Math.random() * 15,
                duration: 5 + Math.random() * 10
            };

            setBubbles(prev => [...prev.slice(-15), newBubble]); // Keep max 15 bubbles
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const handleFeed = (e: React.MouseEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setFood({ id: Date.now(), x, y });

        // Remove food after 5 seconds if not eaten (or just timeout for simulation)
        setTimeout(() => setFood(null), 5000);
    };

    return (
        <Card className={`overflow-hidden rounded-xl border-none shadow-inner relative group ${className}`}>
            {/* Dynamic Background */}
            <div
                ref={containerRef}
                className="relative w-full h-full min-h-[400px] cursor-crosshair overflow-hidden"
                style={{
                    background: 'linear-gradient(to bottom, #bae6fd 0%, #0ea5e9 40%, #0369a1 100%)'
                }}
                onClick={handleFeed}
            >
                {/* Sun Rays / Light Effect */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-white/20 to-transparent transform -skew-x-12 blur-xl pointer-events-none" />

                {/* Floating Bubbles */}
                {bubbles.map(bubble => (
                    <motion.div
                        key={bubble.id}
                        initial={{ y: '110%', x: `${bubble.x}%`, opacity: 0 }}
                        animate={{ y: '-10%', opacity: [0, 0.6, 0] }}
                        transition={{ duration: bubble.duration, ease: "linear" }}
                        className="absolute rounded-full bg-white/30 border border-white/40 backdrop-blur-sm pointer-events-none"
                        style={{ width: bubble.size, height: bubble.size }}
                    />
                ))}

                {/* Food Pellet */}
                <AnimatePresence>
                    {food && (
                        <motion.div
                            key={food.id}
                            initial={{ y: 0, opacity: 0, scale: 0 }}
                            animate={{ y: food.y, opacity: 1, scale: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute w-4 h-4 bg-amber-700 rounded-full shadow-sm z-20 pointer-events-none"
                            style={{ left: food.x - 8 }} // center
                        />
                    )}
                </AnimatePresence>

                {/* Sea Floor / Plants (Static Decor) */}
                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                {/* Creatures and Items */}
                {containerSize.width > 0 && items
                    .filter(i => i.position_x <= 100) // Render only visible items
                    .map(userItem => {
                        const item = userItem.item;
                        if (!item) return null;

                        // Separate render logic for Fish vs Stationary items
                        if (item.type === 'fish') {
                            return (
                                <OceanCreature
                                    key={userItem.id}
                                    item={userItem}
                                    containerSize={containerSize}
                                    foodTarget={food}
                                    onEat={() => {
                                        // Could play sound or update score here
                                        // For now just visual in OceanCreature
                                    }}
                                />
                            );
                        } else {
                            // Stationary items (Plants, Decor)
                            return (
                                <motion.div
                                    key={userItem.id}
                                    className="absolute bottom-[5%]"
                                    style={{
                                        left: `${userItem.position_x}%`,
                                        width: 64 * (userItem.scale || 1),
                                        height: 64 * (userItem.scale || 1),
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-contain drop-shadow-md" />
                                    ) : (
                                        <div className="w-full h-full bg-green-600 rounded-lg skew-x-12" />
                                    )}
                                </motion.div>
                            );
                        }
                    })}

                {/* Empty State */}
                {items.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 pointer-events-none">
                        <p className="text-xl font-bold mb-2">Đại dương trống vắng...</p>
                        <p className="text-sm">Hãy ghé Cửa hàng mua thêm sinh vật nhé! 🐠</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
