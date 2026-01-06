'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { UserOceanItem } from '@/types/gamification';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface OceanCreatureProps {
    item: UserOceanItem;
    containerSize: { width: number; height: number };
    foodTarget: { x: number; y: number } | null;
    onEat?: () => void;
}

export function OceanCreature({ item, containerSize, foodTarget, onEat }: OceanCreatureProps) {
    const controls = useAnimation();
    const [position, setPosition] = useState({ x: Math.random() * containerSize.width, y: Math.random() * containerSize.height });
    const [facingRight, setFacingRight] = useState(true);
    const [isEating, setIsEating] = useState(false);

    // Random personality: speed and rest time
    const speedMultiplier = useMemo(() => 0.5 + Math.random() * 0.5, []);

    useEffect(() => {
        if (!containerSize.width || !containerSize.height) return;

        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const swimTo = async (targetX: number, targetY: number, fast: boolean = false) => {
            if (!isMounted) return;

            // Determine direction
            const dx = targetX - position.x;
            setFacingRight(dx > 0);

            // Calculate distance and duration
            const dy = targetY - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Speed: Standard random wandering vs Fast food chasing
            const speed = fast ? 150 : (50 * speedMultiplier);
            const duration = distance / speed;

            // Animate
            await controls.start({
                x: targetX,
                y: targetY,
                transition: {
                    duration: duration,
                    ease: "easeInOut"
                }
            });

            if (isMounted) {
                setPosition({ x: targetX, y: targetY });

                // If we arrived at food
                if (fast && foodTarget) {
                    // Check if close enough to eat
                    const distToFood = Math.sqrt(
                        Math.pow(targetX - foodTarget.x, 2) +
                        Math.pow(targetY - foodTarget.y, 2)
                    );

                    if (distToFood < 50) {
                        setIsEating(true);
                        onEat?.();
                        setTimeout(() => setIsEating(false), 1000); // Show heart for 1s
                    }
                }
            }
        };

        const loop = async () => {
            if (!isMounted) return;

            if (foodTarget) {
                // Chase food with slight randomness/offset to prevent stacking
                const offsetX = (Math.random() - 0.5) * 50;
                const offsetY = (Math.random() - 0.5) * 50;
                await swimTo(foodTarget.x + offsetX, foodTarget.y + offsetY, true);
            } else {
                // Random wander
                const nextX = Math.random() * (containerSize.width - 100) + 50;
                const nextY = Math.random() * (containerSize.height - 100) + 50;
                await swimTo(nextX, nextY, false);

                // Rest for a bit
                await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
            }

            if (isMounted) {
                // Continue loop only if food status hasn't changed abruptly (handled by useEffect deps)
                // Actually, recursion here might be tricky if deps change.
                // Better to let useEffect re-trigger on foodTarget change.
                if (!foodTarget) loop();
            }
        };

        // Start loop
        loop();

        return () => {
            isMounted = false;
            controls.stop();
            clearTimeout(timeoutId);
        };
    }, [containerSize, foodTarget, controls, speedMultiplier]);


    const renderCreature = () => {
        // Fallback or Image
        if (item.item?.image_url) {
            return (
                <img
                    src={item.item.image_url}
                    alt={item.item.name}
                    className="w-full h-full object-contain drop-shadow-lg"
                    style={{
                        transform: facingRight ? 'scaleX(-1)' : 'scaleX(1)' // Flip if needed based on original sprite direction. Assuming default left-facing or right-facing? Usually sprites face left. Let's assume left facing source. If facingRight, scaleX(-1).
                    }}
                />
            );
        }

        // Simple shape fallback
        return (
            <div className={cn(
                "w-full h-full rounded-full shadow-lg",
                item.item?.type === 'fish' ? "bg-orange-400" : "bg-green-400"
            )} />
        );
    };

    return (
        <motion.div
            animate={controls}
            initial={position}
            className="absolute z-10 cursor-pointer"
            style={{
                width: 64 * (item.scale || 1),
                height: 64 * (item.scale || 1),
                filter: isEating ? 'brightness(1.2)' : 'none'
            }}
            whileHover={{ scale: 1.1 }}
            onTap={() => {
                // Petting fish interaction
                setIsEating(true);
                setTimeout(() => setIsEating(false), 1000);
            }}
        >
            {renderCreature()}

            {/* Eating / Petting Visual Effect (Hearts) */}
            {isEating && (
                <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, y: -40, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-rose-500"
                >
                    <Heart fill="currentColor" className="h-6 w-6" />
                </motion.div>
            )}

            {/* Name tag on hover */}
            <div className="opacity-0 hover:opacity-100 transition-opacity absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none">
                {item.item?.name}
            </div>
        </motion.div>
    );
}
