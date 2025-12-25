'use client';

import React, { useRef, useEffect, useState } from 'react';
import { UserOceanItem } from '@/types/gamification';
import { Card } from '@/components/ui/card';

interface OceanGardenProps {
    items: UserOceanItem[];
    className?: string;
}

export function OceanGarden({ items, className }: OceanGardenProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const requestRef = useRef<number>(0);
    const timeRef = useRef<number>(0);

    // Preload images
    const imagesRef = useRef<Record<string, HTMLImageElement>>({});

    useEffect(() => {
        // Determine unique item IDs to load
        const uniqueSlugs = new Set(items.map(i => i.item?.slug).filter(Boolean));
        uniqueSlugs.add('bg_gradient'); // Virtual BG

        const loadImages = () => {
            items.forEach(userItem => {
                const item = userItem.item;
                if (item && item.image_url && !imagesRef.current[item.slug]) {
                    const img = new Image();
                    img.src = item.image_url;
                    imagesRef.current[item.slug] = img;
                }
            });
        };
        loadImages();
    }, [items]);

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current?.parentElement) {
                const { offsetWidth, offsetHeight } = canvasRef.current.parentElement;
                setContainerSize({ width: offsetWidth, height: offsetHeight });
                if (canvasRef.current) {
                    canvasRef.current.width = offsetWidth;
                    canvasRef.current.height = offsetHeight;
                }
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const draw = (time: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Draw Background
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#e0f7fa'); // Top: Light surface
        gradient.addColorStop(1, '#0288d1'); // Bottom: Deep ocean
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw bubbles (simple)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 10; i++) {
            const bubbleY = (time * 0.05 + i * 50) % height;
            const bubbleX = (Math.sin(time * 0.001 + i) * 20) + (width * (i / 10));
            ctx.beginPath();
            ctx.arc(bubbleX, height - bubbleY, 5 + (i % 5), 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw Items
        items.forEach(userItem => {
            const item = userItem.item;
            if (!item) return;

            const img = imagesRef.current[item.slug];
            if (!img || !img.complete) {
                // Fallback placeholder
                ctx.fillStyle = item.type === 'fish' ? 'orange' : 'green';
                const x = (userItem.position_x / 100) * width;
                const y = (userItem.position_y / 100) * height;
                ctx.beginPath();
                ctx.arc(x, y, 10, 0, Math.PI * 2);
                ctx.fill();
                return;
            }

            let x = (userItem.position_x / 100) * width;
            let y = (userItem.position_y / 100) * height;

            // Swim logic for fish
            if (item.type === 'fish') {
                const speed = 0.02 + (item.slug.length % 3) * 0.01;
                const range = 50;
                const offsetX = Math.sin(time * speed) * range;
                const offsetY = Math.cos(time * speed * 0.5) * (range / 2);

                x += offsetX;
                y += offsetY;

                // Flip image if swimming left (not implemented native 2d ctx flip easily without save/restore)
            }

            const size = 64 * (userItem.scale || 1);
            ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
        });
    };

    const animate = (time: number) => {
        timeRef.current = time;
        draw(time);
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    });

    return (
        <Card className={`overflow-hidden rounded-xl border-none shadow-inner ${className}`}>
            <div className="relative w-full h-full min-h-[300px]">
                <canvas ref={canvasRef} className="absolute inset-0 block" />
                {items.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/80 font-medium">
                        Đại dương của bạn còn trống. Hãy mua thêm sinh vật!
                    </div>
                )}
            </div>
        </Card>
    );
}
