'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface OceanBackgroundProps {
  oceanLevel?: number; // 1-5, mặc định là 1
}

export default function OceanBackground({ oceanLevel = 1 }: OceanBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Chỉ render bong bóng sau khi mount để tránh lỗi Hydration của Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  // Màu sắc gradient dựa theo ocean level
  const getOceanGradient = (level: number) => {
    switch (level) {
      case 1:
        // Bờ biển ánh sáng - Sáng và trong xanh
        return 'from-[#2563EB] via-[#1E40AF] to-[#1E3A8A]';
      case 2:
        // Vùng biển nông - Xanh dương đậm hơn
        return 'from-[#1E40AF] via-[#1E3A8A] to-[#0C1E3E]';
      case 3:
        // Rạn san hô - Xanh đậm với chút tím
        return 'from-[#1E3A8A] via-[#0C1E3E] to-[#0A1628]';
      case 4:
        // Vực sâu huyền bí - Rất tối, xanh đen
        return 'from-[#0C1E3E] via-[#0A1628] to-[#050A14]';
      case 5:
        // Hố đen đại dương - Gần như đen hoàn toàn
        return 'from-[#0A1628] via-[#050A14] to-[#020408]';
      default:
        return 'from-[#1a2e44] via-[#0f1c2e] to-[#050a14]';
    }
  };

  // Số lượng bong bóng tăng theo level
  const getBubbleCount = (level: number) => {
    return Math.max(10, 20 - level * 2); // Level càng sâu càng ít bong bóng
  };

  // Độ sáng của god rays giảm theo level
  const getGodRayOpacity = (level: number) => {
    return Math.max(0.05, 0.25 - level * 0.04);
  };

  useGSAP(() => {
    if (!mounted || !containerRef.current) return;

    // Hiệu ứng bong bóng bay lên ngẫu nhiên
    const bubbles = gsap.utils.toArray<HTMLElement>('.ocean-bubble');
    bubbles.forEach((bubble) => {
      // Set vị trí ban đầu
      gsap.set(bubble, {
        x: gsap.utils.random(0, window.innerWidth),
        y: gsap.utils.random(window.innerHeight, window.innerHeight + 100),
        scale: gsap.utils.random(0.5, 1.5),
        opacity: gsap.utils.random(0.2, 0.6),
      });

      // Animation loop
      gsap.to(bubble, {
        y: -100, // Bay lên quá màn hình
        x: `+=${gsap.utils.random(-30, 30)}`, // Lắc lư nhẹ
        rotation: gsap.utils.random(0, 360),
        duration: gsap.utils.random(10, 25), // Tốc độ khác nhau
        repeat: -1,
        ease: 'none',
        delay: gsap.utils.random(0, 10),
      });
    });

    // Hiệu ứng waves (sóng) nhẹ nhàng
    const waves = gsap.utils.toArray<HTMLElement>('.ocean-wave');
    waves.forEach((wave, index) => {
      gsap.to(wave, {
        x: index % 2 === 0 ? 100 : -100,
        duration: gsap.utils.random(20, 30),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }, { scope: containerRef, dependencies: [mounted, oceanLevel] });

  const bubbleCount = getBubbleCount(oceanLevel);
  const godRayOpacity = getGodRayOpacity(oceanLevel);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-50 w-full h-full overflow-hidden bg-gradient-to-b ${getOceanGradient(oceanLevel)} transition-all duration-1000`}
    >
      {/* Hiệu ứng ánh sáng (God Rays) - chỉ có ở level thấp */}
      {oceanLevel <= 3 && (
        <div
          className="absolute top-0 left-0 w-full h-1/2 pointer-events-none transition-opacity duration-1000"
          style={{ opacity: godRayOpacity }}
        >
          <div className="absolute -top-20 left-1/4 w-40 h-[120vh] bg-white -rotate-12 blur-[100px]" />
          <div className="absolute -top-20 right-1/4 w-60 h-[120vh] bg-teal-200 rotate-12 blur-[100px]" />
        </div>
      )}

      {/* Các lớp sóng (Waves) chuyển động nhẹ nhàng */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="ocean-wave absolute top-1/4 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent blur-xl" />
        <div className="ocean-wave absolute top-1/2 left-0 w-full h-24 bg-gradient-to-b from-white/3 to-transparent blur-lg" />
        <div className="ocean-wave absolute top-3/4 left-0 w-full h-20 bg-gradient-to-b from-white/2 to-transparent blur-md" />
      </div>

      {/* Render bong bóng bằng CSS thuần (không cần ảnh SVG) */}
      {mounted && Array.from({ length: bubbleCount }).map((_, i) => (
        <div
          key={i}
          className="ocean-bubble absolute rounded-full bg-blue-300/40 blur-[1px] pointer-events-none"
          style={{
            width: `${Math.random() * 20 + 5}px`,
            height: `${Math.random() * 20 + 5}px`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
          }}
        />
      ))}

      {/* Các hạt nhỏ lơ lửng (Particles) */}
      {mounted && oceanLevel >= 3 && Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full bg-white/10"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 10 + 15}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Lớp noise hạt để tạo cảm giác nước sâu */}
      <div
        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none transition-opacity duration-1000"
        style={{ opacity: oceanLevel >= 3 ? 0.05 : 0.03 }}
      />

      {/* Vùng tối ở đáy biển (cho level cao) */}
      {oceanLevel >= 4 && (
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      )}

      {/* Hiệu ứng vortex ở level 5 */}
      {oceanLevel === 5 && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, transparent 70%)',
              animation: 'spin 60s linear infinite',
            }}
          />
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(5px);
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
