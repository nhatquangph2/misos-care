'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * RippleCursor - Con trỏ gợn sóng
 * Tạo hiệu ứng gợn sóng nước khi di chuyển chuột
 */
export default function RippleCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smoother spring config - less damping, higher stiffness
  const springConfig = { damping: 20, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleClick = (e: MouseEvent) => {
      // Tạo gợn sóng khi click
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples(prev => [...prev, newRipple]);

      // Xóa ripple sau 2 giây
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 2000);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [cursorX, cursorY]);

  // Hide on mobile devices
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <>
      {/* Trailing effect - slower follower */}
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9998]"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-xl" />
        </motion.div>
      )}

      {/* Main cursor follower */}
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-screen"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
          }}
        >
          {/* Outer ring - Water ripple effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/40"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0.4, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Inner glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/40 to-purple-400/40 blur-md"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Center dot */}
          <div className="absolute inset-0 m-auto w-2 h-2 bg-white/90 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </motion.div>
      )}

      {/* Click ripples */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: 0, scale: 4 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div
            className="w-20 h-20 rounded-full border-2 border-white/40"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      ))}
    </>
  );
}
