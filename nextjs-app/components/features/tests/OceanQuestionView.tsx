'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Option {
  value: number;
  label: string;
  description?: string;
}

interface QuestionProps {
  question: string;
  options: Option[];
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (value: number) => void;
}

export default function OceanQuestionView({
  question,
  options,
  currentIndex,
  totalQuestions,
  onAnswer
}: QuestionProps) {
  const [popEffect, setPopEffect] = useState<{ x: number; y: number } | null>(null);

  // Tạo bubble config động dựa trên số lượng options
  const getBubbleConfig = (index: number, total: number) => {
    const baseScale = 0.8;
    const scaleIncrement = 0.4 / (total - 1); // Tăng dần từ 0.8 đến 1.2
    const scale = baseScale + (index * scaleIncrement);

    // Gradient màu từ blue → purple → pink → red
    const colors = [
      'bg-blue-300/20 border-blue-200/50',
      'bg-cyan-300/25 border-cyan-200/55',
      'bg-purple-300/30 border-purple-200/60',
      'bg-pink-300/30 border-pink-200/60',
      'bg-red-300/30 border-red-200/60',
    ];

    const colorIndex = Math.floor((index / (total - 1)) * (colors.length - 1));
    const color = colors[colorIndex];

    return { scale, color };
  };

  const bubbles = options.map((option, index) => ({
    ...option,
    ...getBubbleConfig(index, options.length)
  }));

  const handleBubbleClick = (value: number, event: React.MouseEvent) => {
    // Lấy vị trí click để tạo particle effect
    const rect = event.currentTarget.getBoundingClientRect();
    setPopEffect({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });

    // Clear effect sau 1 giây
    setTimeout(() => setPopEffect(null), 1000);

    // Delay nhỏ để user thấy hiệu ứng vỡ trước khi chuyển câu
    setTimeout(() => onAnswer(value), 300);
  };

  // Tính toán độ sâu dựa trên progress (để thay đổi màu nền)
  const depthLevel = Math.floor((currentIndex / totalQuestions) * 5) + 1;

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[70vh] flex flex-col items-center justify-center px-4">

      {/* 1. Vùng sáng (Spotlight) phía sau thay cho Card vuông */}
      <motion.div
        className="absolute inset-0 blur-3xl -z-10"
        style={{
          background: `radial-gradient(circle at center, rgba(96, 165, 250, 0.3), transparent 70%)`
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Progress indicator - Depth bar (Thanh độ sâu) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="text-white/60 text-xs font-medium">Độ sâu</div>
        <div className="relative w-2 h-48 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500 rounded-full"
            initial={{ height: '0%' }}
            animate={{ height: `${(currentIndex / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="text-white/80 text-xs font-bold">
          {currentIndex + 1}/{totalQuestions}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question}
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-12 md:space-y-16"
        >
          {/* 2. Câu hỏi: Font chữ to, mềm, phát sáng */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] leading-tight px-4 max-w-3xl">
            {question}
          </h2>

          {/* 3. Các bong bóng trả lời */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-10 items-end">
            {bubbles.map((bubble, index) => (
              <motion.button
                key={index}
                onClick={(e) => handleBubbleClick(bubble.value, e)}

                // Animation bong bóng lơ lửng (Floating)
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3 + Math.random(),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2 // Lệch pha nhau
                }}

                // Animation khi hover và click
                whileHover={{
                  scale: bubble.scale * 1.15,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  boxShadow: "0 0 30px rgba(255,255,255,0.4)"
                }}
                whileTap={{
                  scale: 1.3,
                  opacity: 0,
                  transition: { duration: 0.3 }
                }}

                className={cn(
                  "relative rounded-full backdrop-blur-md border shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center group transition-all cursor-pointer",
                  bubble.color
                )}
                style={{
                  width: `${70 * bubble.scale}px`,
                  height: `${70 * bubble.scale}px`,
                }}
              >
                {/* Ánh phản chiếu trên bong bóng (Highlight) */}
                <div className="absolute top-2 left-2 w-1/3 h-1/3 rounded-full bg-gradient-to-br from-white/80 to-transparent opacity-60 blur-sm" />

                {/* Label hiện ra khi hover */}
                <span className="text-white font-bold text-xs md:text-sm opacity-60 group-hover:opacity-100 transition-opacity z-10">
                  {bubble.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Hướng dẫn nhỏ */}
          <motion.p
            className="text-white/50 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Chạm vào bong bóng để trả lời
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Particle effect khi bubble vỡ */}
      <AnimatePresence>
        {popEffect && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-white/60 rounded-full blur-sm"
                initial={{
                  x: popEffect.x,
                  y: popEffect.y,
                  scale: 1,
                  opacity: 1
                }}
                animate={{
                  x: popEffect.x + (Math.cos((i / 8) * Math.PI * 2) * 100),
                  y: popEffect.y + (Math.sin((i / 8) * Math.PI * 2) * 100),
                  scale: 0,
                  opacity: 0
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ pointerEvents: 'none' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
