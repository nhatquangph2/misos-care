'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * RippleCursor - Con trỏ gợn sóng (TỐI ƯU HÓA)
 * - Chỉ hoạt động trên thiết bị có chuột
 * - Sử dụng GPU acceleration với will-change
 * - Giảm số lượng event listener và DOM elements
 */
export default function RippleCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const rafRef = useRef<number | null>(null);
  const mousePos = useRef({ x: -100, y: -100 });

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Lighter spring config for better performance
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Detect pointer device (mouse vs touch)
  useEffect(() => {
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    const t = setTimeout(() => setIsPointerDevice(hasPointer), 0);
    return () => clearTimeout(t);
  }, []);

  // Throttled mouse move using requestAnimationFrame
  const updateCursorPosition = useCallback(() => {
    cursorX.set(mousePos.current.x);
    cursorY.set(mousePos.current.y);
    rafRef.current = null;
  }, [cursorX, cursorY]);

  useEffect(() => {
    if (!isPointerDevice) return;

    const moveCursor = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      // Throttle updates with RAF
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateCursorPosition);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleClick = (e: MouseEvent) => {
      // Limit ripples to 3 maximum
      if (ripples.length >= 3) return;

      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples(prev => [...prev, newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 2000);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPointerDevice, ripples.length, updateCursorPosition]);

  // Don't render on touch devices
  if (!isPointerDevice) {
    return null;
  }

  return (
    <>
      {/* Trailing effect - lighter version */}
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9998]"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
            willChange: 'transform',
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/8 to-purple-400/8 blur-lg" />
        </motion.div>
      )}

      {/* Main cursor follower - simplified */}
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999]"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
            willChange: 'transform',
          }}
        >
          {/* Single animated ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-white/30"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ willChange: 'transform, opacity' }}
          />

          {/* Center dot - no animation */}
          <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-white/80 rounded-full" />
        </motion.div>
      )}

      {/* Click ripples - limit to 3 */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: ripple.x,
            top: ripple.y,
            willChange: 'transform, opacity',
          }}
          initial={{ opacity: 0.8, scale: 0 }}
          animate={{ opacity: 0, scale: 3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div
            className="w-16 h-16 rounded-full border border-white/30"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      ))}
    </>
  );
}
