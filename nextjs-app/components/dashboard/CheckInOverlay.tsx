'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Cloud, CloudRain, CloudLightning, Battery, BatteryMedium, BatteryLow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMascotStore } from '@/stores/mascotStore';
import type { UserMood } from '@/lib/mood-recommendations';

interface CheckInOverlayProps {
    onComplete: (mood: UserMood) => void;
}

export default function CheckInOverlay({ onComplete }: CheckInOverlayProps) {
    const [step, setStep] = useState<'mood' | 'energy'>('mood');
    const [mood, setMoodValue] = useState<string | null>(null);
    const { setMood } = useMascotStore();

    const handleMoodSelect = (selectedMood: string, mascotMood: 'happy' | 'sad' | 'calm' | 'concerned') => {
        setMoodValue(selectedMood);
        setMood(mascotMood);
        setTimeout(() => setStep('energy'), 300);
    };

    const handleEnergySelect = (energy: string) => {
        // Pass the selected mood back to parent
        onComplete(mood as UserMood);
    };

    // Prevent background scroll
    if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
            <AnimatePresence mode="wait">
                {step === 'mood' ? (
                    <motion.div
                        key="mood-step"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-lg"
                    >
                        <Card className="p-8 text-center bg-white dark:bg-slate-900 border-none shadow-2xl">
                            <h2 className="text-2xl font-bold mb-2">Chào buổi sáng! 👋</h2>
                            <p className="text-muted-foreground mb-8">Hôm nay bạn cảm thấy thế nào?</p>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-32 flex flex-col gap-2 hover:bg-yellow-50 hover:border-yellow-200 dark:hover:bg-yellow-900/20"
                                    onClick={() => handleMoodSelect('happy', 'happy')}
                                >
                                    <Sun className="h-10 w-10 text-yellow-500" />
                                    <span>Vui vẻ / Tốt</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-32 flex flex-col gap-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20"
                                    onClick={() => handleMoodSelect('neutral', 'calm')}
                                >
                                    <Cloud className="h-10 w-10 text-blue-400" />
                                    <span>Bình thường</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-32 flex flex-col gap-2 hover:bg-slate-50 hover:border-slate-200 dark:hover:bg-slate-800"
                                    onClick={() => handleMoodSelect('sad', 'sad')}
                                >
                                    <CloudRain className="h-10 w-10 text-slate-500" />
                                    <span>Buồn / Chán</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-32 flex flex-col gap-2 hover:bg-orange-50 hover:border-orange-200 dark:hover:bg-orange-900/20"
                                    onClick={() => handleMoodSelect('stressed', 'concerned')}
                                >
                                    <CloudLightning className="h-10 w-10 text-orange-500" />
                                    <span>Căng thẳng</span>
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="energy-step"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg"
                    >
                        <Card className="p-8 text-center bg-white dark:bg-slate-900 border-none shadow-2xl">
                            <h2 className="text-2xl font-bold mb-2">Mức năng lượng? ⚡</h2>
                            <p className="text-muted-foreground mb-8">Bạn có sẵn sàng cho ngày mới không?</p>

                            <div className="grid grid-cols-1 gap-4">
                                <Button
                                    variant="outline"
                                    className="h-16 justify-start px-6 gap-4"
                                    onClick={() => handleEnergySelect('high')}
                                >
                                    <Battery className="h-6 w-6 text-green-500" />
                                    <div className="text-left">
                                        <div className="font-semibold">Tràn đầy năng lượng</div>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-16 justify-start px-6 gap-4"
                                    onClick={() => handleEnergySelect('medium')}
                                >
                                    <BatteryMedium className="h-6 w-6 text-yellow-500" />
                                    <div className="text-left">
                                        <div className="font-semibold">Tạm ổn</div>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-16 justify-start px-6 gap-4"
                                    onClick={() => handleEnergySelect('low')}
                                >
                                    <BatteryLow className="h-6 w-6 text-red-500" />
                                    <div className="text-left">
                                        <div className="font-semibold">Cạn kiệt</div>
                                    </div>
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
