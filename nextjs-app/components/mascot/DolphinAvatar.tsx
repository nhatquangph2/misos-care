/**
 * DolphinAvatar Component
 * Animated dolphin avatar with different moods
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { MascotMood } from '@/stores/mascotStore'

interface DolphinAvatarProps {
  mood: MascotMood
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function DolphinAvatar({ mood, size = 'md', onClick }: DolphinAvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  }

  const sizePixels = {
    sm: 48,
    md: 80,
    lg: 128,
  }

  // Animation variants based on mood
  const getAnimation = (mood: MascotMood) => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
        return {
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, -5, 0],
          transition: { repeat: Infinity, duration: 2 },
        }
      case 'waving':
        return {
          rotate: [0, 10, -10, 10, 0],
          transition: { repeat: Infinity, duration: 1.5 },
        }
      case 'thinking':
        return {
          y: [0, -5, 0],
          transition: { repeat: Infinity, duration: 2 },
        }
      case 'sleeping':
        return {
          scale: [1, 0.95, 1],
          opacity: [1, 0.8, 1],
          transition: { repeat: Infinity, duration: 3 },
        }
      case 'excited':
        return {
          scale: [1, 1.2, 1],
          y: [0, -10, 0],
          transition: { repeat: Infinity, duration: 1 },
        }
      default:
        return {
          y: [0, -3, 0],
          transition: { repeat: Infinity, duration: 3 },
        }
    }
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} relative flex items-center justify-center cursor-pointer`}
      onClick={onClick}
      animate={getAnimation(mood)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Avatar Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 blur-md opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        />

        {/* Dolphin SVG/Image */}
        <div className="relative z-10 select-none">
          <Image
            src="/mascot/dolphin.svg"
            alt="Dory the Dolphin"
            width={sizePixels[size]}
            height={sizePixels[size]}
            className="object-contain"
            priority
          />
        </div>

        {/* Mood indicator - small animated dot */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          style={{
            background: getMoodColor(mood),
          }}
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
        />
      </div>

      {/* Particles for celebrating mood */}
      <AnimatePresence>
        {mood === 'celebrating' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI) / 3) * 40,
                  y: Math.sin((i * Math.PI) / 3) * 40,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: i * 0.1,
                }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * Get color based on mood
 */
function getMoodColor(mood: MascotMood): string {
  switch (mood) {
    case 'happy':
    case 'celebrating':
      return 'linear-gradient(135deg, #fbbf24, #f59e0b)' // Yellow/orange
    case 'encouraging':
      return 'linear-gradient(135deg, #10b981, #059669)' // Green
    case 'concerned':
      return 'linear-gradient(135deg, #ef4444, #dc2626)' // Red
    case 'thinking':
      return 'linear-gradient(135deg, #8b5cf6, #7c3aed)' // Purple
    case 'excited':
      return 'linear-gradient(135deg, #ec4899, #db2777)' // Pink
    case 'sleeping':
      return 'linear-gradient(135deg, #6b7280, #4b5563)' // Gray
    default:
      return 'linear-gradient(135deg, #3b82f6, #2563eb)' // Blue
  }
}
