'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionTimelineProps {
  totalQuestions: number;
  currentIndex: number;
  answeredQuestions: number[];
  onNavigate: (index: number) => void;
}

/**
 * QuestionTimeline - Ocean-themed timeline for navigating between questions
 * Shows all questions with visual indicators for completed/current/upcoming
 */
export function QuestionTimeline({
  totalQuestions,
  currentIndex,
  answeredQuestions,
  onNavigate,
}: QuestionTimelineProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Timeline container */}
      <div className="relative">
        {/* Connection line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2" />

        {/* Progress line */}
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 -translate-y-1/2"
          initial={{ width: '0%' }}
          animate={{
            width: `${(answeredQuestions.length / totalQuestions) * 100}%`
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Question dots */}
        <div className="relative flex justify-between items-center">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const isAnswered = answeredQuestions.includes(index);
            const isCurrent = index === currentIndex;
            const isClickable = true; // Allow navigation to any question

            return (
              <motion.button
                key={index}
                onClick={() => onNavigate(index)}
                disabled={!isClickable}
                className={cn(
                  "relative flex items-center justify-center transition-all",
                  isClickable && "cursor-pointer hover:scale-125",
                  !isClickable && "cursor-not-allowed opacity-50"
                )}
                whileHover={isClickable ? { scale: 1.2 } : {}}
                whileTap={isClickable ? { scale: 0.9 } : {}}
              >
                {/* Bubble/Dot */}
                <div
                  className={cn(
                    "rounded-full border-2 backdrop-blur-sm transition-all flex items-center justify-center",
                    isCurrent && "w-10 h-10 border-white bg-white/30 shadow-[0_0_20px_rgba(255,255,255,0.6)]",
                    !isCurrent && isAnswered && "w-7 h-7 border-green-400 bg-green-400/30",
                    !isCurrent && !isAnswered && "w-6 h-6 border-white/40 bg-white/10"
                  )}
                >
                  {/* Checkmark for answered questions */}
                  {isAnswered && !isCurrent && (
                    <Check className="w-4 h-4 text-green-400" strokeWidth={3} />
                  )}

                  {/* Current question indicator */}
                  {isCurrent && (
                    <motion.div
                      className="w-3 h-3 rounded-full bg-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Question number tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileHover={{ opacity: 1, y: -15 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap pointer-events-none"
                >
                  Câu {index + 1}
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Progress text */}
      <div className="text-center mt-4">
        <p className="text-sm text-white/70">
          {answeredQuestions.length} / {totalQuestions} câu hỏi đã trả lời
        </p>
      </div>
    </div>
  );
}
