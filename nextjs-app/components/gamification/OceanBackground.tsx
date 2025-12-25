'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface OceanBackgroundProps {
  oceanLevel?: number; // 0-5, mặc định là 1
}

export default function OceanBackground({ oceanLevel = 1 }: OceanBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  // Detect mobile/touch devices for performance optimization
  useEffect(() => {
    setMounted(true);

    // Check if device is low-power (mobile/tablet)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window;
    const hasLimitedMemory = (navigator as any).deviceMemory ? (navigator as any).deviceMemory < 4 : false;

    setIsLowPowerMode(isMobile || isTouchDevice || hasLimitedMemory);
  }, []);

  // Màu sắc gradient dựa theo ocean level
  const getOceanGradient = (level: number) => {
    switch (level) {
      case 0:
        // Landing page - Ánh sáng mặt trời trên mặt nước
        return 'from-[#06b6d4] via-[#3b82f6] to-[#8b5cf6]';
      case 1:
        // Bờ biển ánh sáng
        return 'from-[#2563EB] via-[#1E40AF] to-[#1E3A8A]';
      case 2:
        // Vùng biển nông
        return 'from-[#1E40AF] via-[#1E3A8A] to-[#0C1E3E]';
      case 3:
        // Rạn san hô
        return 'from-[#1E3A8A] via-[#0C1E3E] to-[#0A1628]';
      case 4:
        // Vực sâu huyền bí
        return 'from-[#0C1E3E] via-[#0A1628] to-[#050A14]';
      case 5:
        // Hố đen đại dương
        return 'from-[#0A1628] via-[#050A14] to-[#020408]';
      default:
        return 'from-[#1a2e44] via-[#0f1c2e] to-[#050a14]';
    }
  };

  // Số lượng bong bóng tối ưu theo device
  const getBubbleCount = (level: number) => {
    if (isLowPowerMode) {
      // Mobile: giảm 80% số lượng bong bóng
      return level === 0 ? 4 : 3;
    }
    // Desktop: số lượng bình thường
    if (level === 0) return 15;
    return Math.max(10, 20 - level * 2);
  };

  // God rays chỉ hiển thị trên desktop
  const getGodRayOpacity = (level: number) => {
    if (isLowPowerMode) return 0; // Tắt hoàn toàn trên mobile
    if (level === 0) return 0.3; // Giảm từ 0.4 xuống 0.3
    return Math.max(0.05, 0.2 - level * 0.03);
  };

  useGSAP(() => {
    if (!mounted || !containerRef.current) return;

    // Bong bóng với GPU acceleration
    const bubbles = gsap.utils.toArray<HTMLElement>('.ocean-bubble');
    bubbles.forEach((bubble) => {
      gsap.set(bubble, {
        x: gsap.utils.random(0, window.innerWidth),
        y: gsap.utils.random(window.innerHeight, window.innerHeight + 100),
        scale: gsap.utils.random(0.5, 1.5),
        opacity: gsap.utils.random(0.2, 0.5),
        force3D: true, // Force GPU acceleration
      });

      const duration = isLowPowerMode ? gsap.utils.random(15, 30) : gsap.utils.random(10, 25);

      gsap.to(bubble, {
        y: -100,
        x: `+=${gsap.utils.random(-30, 30)}`,
        rotation: gsap.utils.random(0, 360),
        duration,
        repeat: -1,
        ease: 'none',
        delay: gsap.utils.random(0, 10),
        force3D: true,
      });
    });

    // Waves - chỉ animate trên desktop
    if (!isLowPowerMode) {
      const waves = gsap.utils.toArray<HTMLElement>('.ocean-wave');
      waves.forEach((wave, index) => {
        gsap.to(wave, {
          x: index % 2 === 0 ? 100 : -100,
          duration: gsap.utils.random(20, 30),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          force3D: true,
        });
      });
    }
  }, { scope: containerRef, dependencies: [mounted, oceanLevel, isLowPowerMode] });

  const bubbleCount = getBubbleCount(oceanLevel);
  const godRayOpacity = getGodRayOpacity(oceanLevel);

  const [bubbles, setBubbles] = useState<any[]>([]);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (!mounted) return;

    setBubbles(Array.from({ length: bubbleCount }).map(() => ({
      width: `${Math.random() * 20 + 5}px`,
      height: `${Math.random() * 20 + 5}px`,
      boxShadow: '0 0 8px rgba(255, 255, 255, 0.2)',
      filter: 'blur(0.5px)',
      willChange: 'transform, opacity',
    })));

    if (!isLowPowerMode && oceanLevel >= 3) {
      setParticles(Array.from({ length: 20 }).map(() => ({
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 10 + 15}s linear infinite`,
        animationDelay: `${Math.random() * 5}s`,
      })));
    }
  }, [mounted, bubbleCount, isLowPowerMode, oceanLevel]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-50 w-full h-full overflow-hidden bg-gradient-to-b ${getOceanGradient(oceanLevel)} transition-all duration-1000`}
      style={{ willChange: 'auto' }} // Chỉ enable will-change khi cần
    >
      {/* God Rays - TẮT hoàn toàn trên mobile */}
      {!isLowPowerMode && oceanLevel <= 3 && godRayOpacity > 0 && (
        <div
          className="absolute top-0 left-0 w-full h-1/2 pointer-events-none transition-opacity duration-1000"
          style={{ opacity: godRayOpacity }}
        >
          {/* Giảm blur từ [100px] xuống [60px] */}
          <div className="absolute -top-20 left-1/4 w-40 h-[120vh] bg-white -rotate-12 blur-[60px]" />
          <div className="absolute -top-20 right-1/4 w-60 h-[120vh] bg-teal-200 rotate-12 blur-[60px]" />
          {oceanLevel === 0 && (
            <>
              <div className="absolute -top-20 left-1/2 w-80 h-[120vh] bg-cyan-200 rotate-6 blur-[80px]" />
              <div className="absolute top-0 right-1/3 w-60 h-[100vh] bg-purple-200 -rotate-6 blur-[60px]" />
            </>
          )}
        </div>
      )}

      {/* Waves - chỉ hiển thị trên desktop */}
      {!isLowPowerMode && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="ocean-wave absolute top-1/4 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent blur-xl" style={{ willChange: 'transform' }} />
          <div className="ocean-wave absolute top-1/2 left-0 w-full h-24 bg-gradient-to-b from-white/3 to-transparent blur-lg" style={{ willChange: 'transform' }} />
          <div className="ocean-wave absolute top-3/4 left-0 w-full h-20 bg-gradient-to-b from-white/2 to-transparent blur-md" style={{ willChange: 'transform' }} />
        </div>
      )}

      {/* Bong bóng - giảm 80% trên mobile */}
      {mounted && bubbles.map((style, i) => (
        <div
          key={i}
          className="ocean-bubble absolute rounded-full bg-blue-300/40 pointer-events-none"
          style={style}
        />
      ))}

      {/* Particles - chỉ hiển thị trên desktop ở level sâu */}
      {!isLowPowerMode && mounted && oceanLevel >= 3 && particles.map((style, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full bg-white/10"
          style={style}
        />
      ))}

      {/* Noise layer - giảm opacity */}
      <div
        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none transition-opacity duration-1000"
        style={{ opacity: oceanLevel >= 3 ? 0.03 : 0.02 }}
      />

      {/* Vùng tối ở đáy biển */}
      {oceanLevel >= 4 && (
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      )}

      {/* Vortex - chỉ trên desktop */}
      {!isLowPowerMode && oceanLevel === 5 && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, transparent 70%)',
              animation: 'spin 60s linear infinite',
              willChange: 'transform',
            }}
          />
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          25% {
            transform: translate3d(10px, -20px, 0);
          }
          50% {
            transform: translate3d(-10px, -40px, 0);
          }
          75% {
            transform: translate3d(5px, -20px, 0);
          }
        }

        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
