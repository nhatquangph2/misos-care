'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BubbleRewardToastProps {
  amount: number;
  onClose?: () => void;
}

/**
 * Toast notification hiển thị khi user nhận được bubbles
 * Sử dụng animation đẹp mắt với Framer Motion
 */
export default function BubbleRewardToast({ amount, onClose }: BubbleRewardToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto close after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed top-4 right-4 z-50 pointer-events-none"
        >
          <div className="glass-panel-strong rounded-2xl p-4 shadow-2xl min-w-[280px]">
            <div className="flex items-center gap-3">
              {/* Bubble Animation */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                className="text-4xl"
              >
                🫧
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <div className="font-bold text-lg glass-text mb-1">
                  +{amount} Bubbles!
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Bạn vừa nhận được phần thưởng
                </div>
              </div>

              {/* Shimmer Effect */}
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                className="text-3xl"
              >
                ✨
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
