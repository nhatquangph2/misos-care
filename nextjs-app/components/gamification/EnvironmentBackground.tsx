/**
 * EnvironmentBackground Component
 * Dynamic background that changes based on MBTI personality type
 * Supports: Ocean (Explorers), Forest (Sentinels), Sky (Diplomats), Cosmos (Analysts)
 */

'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { EnvironmentType, ENV_CONFIG } from '@/lib/gamification-config'

interface EnvironmentBackgroundProps {
  type?: EnvironmentType
  level?: number
}

export default function EnvironmentBackground({
  type = 'ocean',
  level = 0
}: EnvironmentBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isLowPowerMode, setIsLowPowerMode] = useState(false)

  // Lấy config màu sắc
  const safeLevel = Math.min(Math.max(0, level), 4)
  const config = ENV_CONFIG[type] || ENV_CONFIG.ocean
  const currentGradient = config.gradients[safeLevel] || config.gradients[0]

  useEffect(() => {
    setMounted(true)
    // Logic detect mobile/low power
    if (typeof window !== 'undefined') {
      const isSmallScreen = window.innerWidth < 768
      // Kiểm tra số lượng core CPU thấp để bật chế độ tối ưu
      const isLowConcurrency = (navigator as any).hardwareConcurrency <= 4
      if (isSmallScreen || isLowConcurrency) {
        setIsLowPowerMode(true)
      }
    }
  }, [])

  useGSAP(() => {
    if (!mounted || !containerRef.current || isLowPowerMode) return

    const particles = gsap.utils.toArray<HTMLElement>('.env-particle')
    gsap.killTweensOf(particles)

    // CẤU HÌNH ANIMATION TỐI ƯU CHO TỪNG LOẠI MÔI TRƯỜNG
    const animationConfig = {
      repeat: -1,
      ease: 'none',
      force3D: true, // Ép dùng GPU
    }

    if (type === 'ocean') {
      // 🌊 OCEAN: Bong bóng bay lên
      particles.forEach((p: HTMLElement) => {
        gsap.set(p, {
          y: window.innerHeight + 50,
          x: gsap.utils.random(0, window.innerWidth),
          opacity: gsap.utils.random(0.3, 0.7)
        })
        gsap.to(p, {
          y: -50,
          x: `+=${gsap.utils.random(-30, 30)}`,
          duration: gsap.utils.random(15, 30),
          delay: gsap.utils.random(0, 10),
          ...animationConfig,
        })
      })
    }
    else if (type === 'forest') {
      // 🌳 FOREST: Đom đóm bay lượn & nhấp nháy
      particles.forEach((p: HTMLElement) => {
        gsap.set(p, {
          x: gsap.utils.random(0, window.innerWidth),
          y: gsap.utils.random(0, window.innerHeight)
        })
        gsap.to(p, {
          x: `+=${gsap.utils.random(-80, 80)}`,
          y: `+=${gsap.utils.random(-80, 80)}`,
          duration: gsap.utils.random(10, 20),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
        gsap.to(p, { // Nhấp nháy
          opacity: gsap.utils.random(0.2, 0.8),
          duration: gsap.utils.random(1, 3),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      })
    }
    else if (type === 'sky') {
      // ☁️ SKY: Mây trôi ngang
      particles.forEach((p: HTMLElement) => {
        const startX = gsap.utils.random(-100, window.innerWidth)
        gsap.set(p, {
          x: startX,
          y: gsap.utils.random(0, window.innerHeight * 0.6),
          opacity: gsap.utils.random(0.4, 0.9)
        })
        gsap.to(p, {
          x: window.innerWidth + 100,
          duration: gsap.utils.random(40, 70),
          repeat: -1,
          ease: 'none',
          modifiers: {
            x: (x: string | number) => parseFloat(x.toString()) > window.innerWidth + 100 ? '-100' : x.toString()
          }
        })
      })
    }
    else if (type === 'cosmos') {
      // 🌌 COSMOS: Sao lấp lánh (Twinkle only - Tối ưu nhất)
      particles.forEach((p: HTMLElement) => {
        gsap.set(p, {
          x: gsap.utils.random(0, window.innerWidth),
          y: gsap.utils.random(0, window.innerHeight),
          scale: gsap.utils.random(0.5, 1.5)
        })
        gsap.to(p, {
          opacity: gsap.utils.random(0.2, 1),
          scale: gsap.utils.random(0.5, 1.2),
          duration: gsap.utils.random(2, 5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: gsap.utils.random(0, 2)
        })
      })
    }

  }, { scope: containerRef, dependencies: [mounted, type, level, isLowPowerMode] })

  // Mobile: Giảm số lượng hạt
  const particleCount = isLowPowerMode ? 8 : (type === 'cosmos' ? 40 : 20)
  const particleStyle = {
    width: type === 'sky' ? `${Math.random() * 60 + 40}px` : (type === 'cosmos' ? `${Math.random() * 3 + 1}px` : `${Math.random() * 10 + 5}px`),
    height: type === 'sky' ? `${Math.random() * 20 + 10}px` : (type === 'cosmos' ? `${Math.random() * 3 + 1}px` : `${Math.random() * 10 + 5}px`),
    filter: (type === 'forest' || type === 'sky') ? 'blur(2px)' : 'none',
    boxShadow: type === 'cosmos' ? '0 0 2px rgba(255,255,255,0.8)' : 'none'
  }

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-50 w-full h-full overflow-hidden bg-gradient-to-b ${currentGradient} transition-colors duration-2000`}
      style={{ contain: 'strict' }}
    >
      {/* Lớp Noise nhẹ */}
      {!isLowPowerMode && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      )}

      {/* GOD RAYS/LIGHT BEAMS (Tắt trên mobile) */}
      {!isLowPowerMode && level <= 2 && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
          {/* Cosmos Rays: Tinh vân/Ánh sáng tím */}
          {type === 'cosmos' && (
            <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
          )}

          {/* Forest/Ocean Rays: Ánh sáng chiếu xuống */}
          {(type === 'forest' || type === 'ocean') && (
            <div className={`absolute -top-20 left-1/3 w-40 h-[120vh] -rotate-12 blur-3xl ${type === 'forest' ? 'bg-yellow-100/10' : 'bg-white/10'}`} />
          )}
        </div>
      )}

      {/* PARTICLES */}
      {mounted && Array.from({ length: particleCount }).map((_, i) => (
        <div
          key={i}
          className={`env-particle absolute pointer-events-none will-change-transform ${config.particleColor} ${config.particleShape}`}
          // Dùng inline style để force re-render với kích thước mới
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: particleStyle.width,
            height: particleStyle.height,
            filter: particleStyle.filter,
            boxShadow: particleStyle.boxShadow,
          }}
        />
      ))}

      {/* Vignette */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  )
}
