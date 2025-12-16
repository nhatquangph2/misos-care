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

  // Tính toán tiến độ (0 -> 1)
  const progress = currentIndex / (totalQuestions - 1 || 1);

  // Tạo bong bóng (giữ nguyên logic cũ vì nó đã tốt)
  const getBubbleConfig = (index: number, total: number) => {
    const baseScale = 0.8;
    const scaleIncrement = 0.4 / (total - 1);
    const scale = baseScale + (index * scaleIncrement);

    // Màu sắc sáng hơn, tinh khiết hơn (Cyan, Sky, White)
    const colors = [
      'bg-cyan-500/20 border-cyan-300/40 hover:bg-cyan-400/30',
      'bg-sky-500/20 border-sky-300/40 hover:bg-sky-400/30',
      'bg-blue-400/20 border-blue-300/40 hover:bg-blue-300/30',
      'bg-indigo-400/20 border-indigo-300/40 hover:bg-indigo-300/30',
      'bg-violet-400/20 border-violet-300/40 hover:bg-violet-300/30',
    ];

    const colorIndex = Math.floor((index / (total - 1)) * (colors.length - 1));
    return { scale, color: colors[colorIndex] };
  };

  const bubbles = options.map((option, index) => ({
    ...option,
    ...getBubbleConfig(index, options.length)
  }));

  const handleBubbleClick = (value: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopEffect({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setTimeout(() => setPopEffect(null), 1000);
    setTimeout(() => onAnswer(value), 300);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[70vh] flex flex-col items-center justify-center px-4">

      {/* === HIỆU ỨNG ÁNH SÁNG TĂNG DẦN (The Ascension Effect) === */}

      {/* 1. Lớp nền sáng dần: Từ trong suốt -> Xanh ngọc sáng */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[-10]"
        animate={{
          // Pha trộn màu sáng dần lên
          backgroundColor: `rgba(103, 232, 249, ${progress * 0.3})`, // Cyan tint
        }}
        style={{
          backdropFilter: `brightness(${1 + progress * 0.5}) blur(${progress * 2}px)` // Sáng hơn và mờ ảo hơn
        }}
        transition={{ duration: 1 }}
      />

      {/* 2. Ánh mặt trời (Sunlight) chiếu từ trên xuống - Mạnh dần */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[60vh] -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.4), transparent 70%)',
        }}
        animate={{
          opacity: 0.2 + (progress * 0.8), // Tăng độ rõ của ánh nắng
          scale: 1 + (progress * 0.2), // Mở rộng vùng sáng
        }}
        transition={{ duration: 1 }}
      />

      {/* 3. Các hạt bụi sáng lấp lánh (Sparkles) - Chỉ hiện khi gần về đích */}
      {progress > 0.6 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {[...Array(10)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute bg-white rounded-full blur-[1px]"
               initial={{
                 x: Math.random() * 1000,
                 y: 600,
                 opacity: 0,
                 scale: 0
               }}
               animate={{
                 y: -100,
                 opacity: [0, 1, 0],
                 scale: Math.random() * 2
               }}
               transition={{
                 duration: 2 + Math.random() * 3,
                 repeat: Infinity,
                 delay: Math.random() * 2
               }}
               style={{ width: 2 + Math.random() * 3, height: 2 + Math.random() * 3 }}
             />
           ))}
        </div>
      )}

      {/* === THANH TIẾN ĐỘ: NỔI LÊN (Rising Bar) === */}
      <div className="absolute left-4 md:left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        {/* Nhãn thay đổi theo độ sâu */}
        <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold rotate-180" style={{ writingMode: 'vertical-rl' }}>
          {progress < 0.3 ? 'Vực thẳm' : progress < 0.7 ? 'Đại dương' : 'Mặt nước'}
        </div>

        <div className="relative w-1.5 h-64 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
          {/* Thanh chạy từ dưới lên trên (bottom: 0) */}
          <motion.div
            className="absolute bottom-0 w-full rounded-full"
            style={{
              background: 'linear-gradient(to top, #0ea5e9, #67e8f9, #ffffff)' // Xanh -> Trắng
            }}
            initial={{ height: '0%' }}
            animate={{ height: `${(currentIndex + 1) / totalQuestions * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Bong bóng khí nhỏ chạy theo thanh tiến độ */}
          <motion.div
            className="absolute left-0 w-full h-2 bg-white rounded-full blur-[2px]"
            animate={{ bottom: `${(currentIndex + 1) / totalQuestions * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* === NỘI DUNG CÂU HỎI === */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 1.05, filter: 'blur(10px)' }} // Bay lên trên khi xong
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center space-y-12 md:space-y-16 relative z-10"
        >
          {/* Câu hỏi: Font chữ phát sáng mạnh hơn khi lên cao */}
          <h2
            className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight px-4 max-w-3xl"
            style={{
              textShadow: `0 0 ${20 + progress * 20}px rgba(255,255,255,${0.3 + progress * 0.4})`
            }}
          >
            {question}
          </h2>

          {/* Các bong bóng trả lời */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 items-end">
            {bubbles.map((bubble, index) => (
              <motion.button
                key={index}
                onClick={(e) => handleBubbleClick(bubble.value, e)}
                // Animation trôi nổi nhẹ nhàng hơn (Weightless)
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4 + Math.random(),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3
                }}
                whileHover={{
                  scale: bubble.scale * 1.15,
                  backgroundColor: "rgba(255,255,255,0.25)",
                  borderColor: "rgba(255,255,255,0.8)",
                  boxShadow: "0 0 40px rgba(255,255,255,0.4)"
                }}
                whileTap={{ scale: 1.4, opacity: 0 }}
                className={cn(
                  "relative rounded-full backdrop-blur-md border flex items-center justify-center group transition-all cursor-pointer shadow-lg",
                  bubble.color
                )}
                style={{
                  width: `${80 * bubble.scale}px`,
                  height: `${80 * bubble.scale}px`,
                }}
              >
                {/* Ánh phản chiếu (Bubble reflection) */}
                <div className="absolute top-2 right-3 w-2 h-2 rounded-full bg-white opacity-80 blur-[1px]" />
                <div className="absolute top-3 right-2 w-1 h-1 rounded-full bg-white opacity-60" />

                <span className="text-white font-bold text-sm opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  {bubble.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Hiệu ứng vỡ bong bóng */}
      <AnimatePresence>
        {popEffect && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full blur-[1px]"
                initial={{ x: popEffect.x, y: popEffect.y, scale: 1, opacity: 1 }}
                animate={{
                  x: popEffect.x + (Math.random() - 0.5) * 150,
                  y: popEffect.y - Math.random() * 150, // Bay lên trên nhiều hơn
                  opacity: 0,
                  scale: 0
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
