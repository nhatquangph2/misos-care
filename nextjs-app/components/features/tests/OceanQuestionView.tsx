'use client';

import { useState, useMemo, useEffect } from 'react';
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
  selectedValue?: number; // Đáp án đã chọn (nếu quay lại)
}

export default function OceanQuestionView({
  question,
  options,
  currentIndex,
  totalQuestions,
  onAnswer,
  selectedValue
}: QuestionProps) {
  const [popEffect, setPopEffect] = useState<{ x: number; y: number } | null>(null);

  // Tính toán tiến độ (0 -> 1)
  const progress = currentIndex / (totalQuestions - 1 || 1);

  const [sparkles, setSparkles] = useState<any[]>([]);
  const [bubbleAnimations, setBubbleAnimations] = useState<any[]>([]);
  const [popParticles, setPopParticles] = useState<any[]>([]);

  // Generate stable random values after mount
  useEffect(() => {
    setSparkles([...Array(10)].map(() => ({
      x: Math.random() * 1000,
      scale: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      size: 2 + Math.random() * 3
    })));

    setPopParticles([...Array(12)].map(() => ({
      xOff: (Math.random() - 0.5) * 150,
      yOff: Math.random() * 150
    })));
  }, []);

  useEffect(() => {
    setBubbleAnimations(options.map(() => ({
      duration: 4 + Math.random(),
    })));
  }, [options]);

  // U-SHAPE: Hai đầu to nhất, giữa nhỏ nhất
  const getBubbleConfig = (index: number, total: number) => {
    // Tính khoảng cách từ index đến giữa (0 = ở giữa, 1 = ở đầu)
    const distanceFromCenter = Math.abs((index / (total - 1)) - 0.5) * 2;

    // Scale: giữa = 0.7, hai đầu = 1.2
    const minScale = 0.7;
    const maxScale = 1.2;
    const scale = minScale + (distanceFromCenter * (maxScale - minScale));

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
          backgroundColor: `rgba(103, 232, 249, ${progress * 0.3})`,
        }}
        style={{
          backdropFilter: `brightness(${1 + progress * 0.5}) blur(${progress * 2}px)`
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* 2. Ánh mặt trời (Sunlight) chiếu từ trên xuống - Mạnh dần */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[60vh] -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.4), transparent 70%)',
        }}
        animate={{
          opacity: 0.2 + (progress * 0.8),
          scale: 1 + (progress * 0.2),
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* 3. Các hạt bụi sáng lấp lánh (Sparkles) - Chỉ hiện khi gần về đích */}
      {progress > 0.6 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {sparkles.map((config, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full blur-[1px]"
              initial={{
                x: config.x,
                y: 600,
                opacity: 0,
                scale: 0
              }}
              animate={{
                y: -100,
                opacity: [0, 1, 0],
                scale: config.scale
              }}
              transition={{
                duration: config.duration,
                repeat: Infinity,
                delay: config.delay
              }}
              style={{ width: config.size, height: config.size }}
            />
          ))}
        </div>
      )}

      {/* === THANH TIẾN ĐỘ: NỔI LÊN (Rising Bar) === */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        {/* Nhãn thay đổi theo độ sâu */}
        <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold rotate-180" style={{ writingMode: 'vertical-rl' }}>
          {progress < 0.3 ? 'Đáy biển' : progress < 0.7 ? 'Đại dương' : 'Mặt nước'}
        </div>

        <div className="relative w-1.5 h-64 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
          {/* Thanh chạy từ dưới lên trên (bottom: 0) */}
          <motion.div
            className="absolute bottom-0 w-full rounded-full"
            style={{
              background: 'linear-gradient(to top, #0ea5e9, #67e8f9, #ffffff)'
            }}
            initial={{ height: '0%' }}
            animate={{ height: `${(currentIndex + 1) / totalQuestions * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Bong bóng khí nhỏ chạy theo thanh tiến độ */}
          <motion.div
            className="absolute left-0 w-full h-2 bg-white rounded-full blur-[2px]"
            animate={{ bottom: `${(currentIndex + 1) / totalQuestions * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* === NỘI DUNG CÂU HỎI === */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
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
            {bubbles.map((bubble, index) => {
              const isSelected = selectedValue !== undefined && bubble.value === selectedValue;
              const animConfig = bubbleAnimations[index] || { duration: 4 };

              return (
                <motion.button
                  key={index}
                  onClick={(e) => handleBubbleClick(bubble.value, e)}
                  // Animation trôi nổi nhẹ nhàng hơn (Weightless)
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: animConfig.duration,
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
                    bubble.color,
                    isSelected && "ring-4 ring-yellow-400 ring-offset-2 ring-offset-transparent bg-white/30"
                  )}
                  style={{
                    width: `${80 * bubble.scale}px`,
                    height: `${80 * bubble.scale}px`,
                  }}
                >
                  {/* Ánh phản chiếu (Bubble reflection) */}
                  <div className="absolute top-2 right-3 w-2 h-2 rounded-full bg-white opacity-80 blur-[1px]" />
                  <div className="absolute top-3 right-2 w-1 h-1 rounded-full bg-white opacity-60" />

                  {/* Hiển thị checkmark nếu đã chọn */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}

                  <span className={cn(
                    "font-bold text-sm transition-all",
                    isSelected ? "text-white opacity-100 scale-110" : "text-white opacity-80 group-hover:opacity-100 group-hover:scale-110"
                  )}>
                    {bubble.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Hiệu ứng vỡ bong bóng */}
      <AnimatePresence>
        {popEffect && (
          <>
            {popParticles.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full blur-[1px]"
                initial={{ x: popEffect.x, y: popEffect.y, scale: 1, opacity: 1 }}
                animate={{
                  x: popEffect.x + particle.xOff,
                  y: popEffect.y - particle.yOff,
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
