/**
 * MascotAvatar Component
 * Polymorphic mascot avatar with 4 different types based on MBTI
 * Supports: Dolphin (Ocean), Owl (Forest), Cloud (Sky), Cat (Cosmos)
 */

'use client'

import { motion } from 'framer-motion'
import { MascotType } from '@/lib/gamification-config'
import type { MascotMood } from '@/stores/mascotStore'

interface MascotAvatarProps {
  mood: MascotMood
  type: MascotType
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function MascotAvatar({
  mood,
  type,
  size = 'md',
  onClick
}: MascotAvatarProps) {

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  // Render nội dung SVG dựa trên loại Mascot
  const renderMascotContent = () => {
    switch (type) {
      case 'owl':
        // 🦉 CÚ MÈO (OWL) - Đại diện cho Sentinels (SJ)
        return (
          <g className="mascot-owl transition-transform duration-500">
            {/* Thân cú */}
            <circle cx="50" cy="50" r="40" fill="#78350f" />
            {/* Bụng */}
            <ellipse cx="50" cy="55" rx="30" ry="25" fill="#fef3c7" />
            {/* Mắt trắng */}
            <circle cx="35" cy="40" r="12" fill="white" />
            <circle cx="65" cy="40" r="12" fill="white" />
            {/* Đồng tử */}
            <circle cx="35" cy="40" r="5" fill={mood === 'concerned' ? '#9d174d' : '#0f172a'} />
            <circle cx="65" cy="40" r="5" fill={mood === 'concerned' ? '#9d174d' : '#0f172a'} />
            {/* Mỏ */}
            <path d="M45 50 L55 50 L50 60 Z" fill="#f59e0b" />
            {/* Lông mày/Tai - Biểu cảm */}
            {mood === 'celebrating' || mood === 'happy' || mood === 'excited' ? (
              <path d="M30 30 Q50 20 70 30" stroke="#78350f" strokeWidth="4" fill="none" />
            ) : (
              <>
                <path d="M20 20 L30 35 L40 25 Z" fill="#78350f" />
                <path d="M80 20 L70 35 L60 25 Z" fill="#78350f" />
              </>
            )}
          </g>
        )

      case 'cloud':
        // ☁️ TINH LINH MÂY (CLOUD) - Đại diện cho Diplomats (NF)
        return (
          <g className="mascot-cloud transition-transform duration-500">
            <path
              d="M25,60 a20,20 0 0,1 0,-40 a20,20 0 0,1 50,0 a20,20 0 0,1 0,40 z"
              fill="#e0f2fe"
              stroke={mood === 'happy' || mood === 'celebrating' ? '#38bdf8' : '#64748b'}
              strokeWidth="2"
            />
            {/* Biểu cảm - Mắt */}
            {mood === 'happy' || mood === 'celebrating' ? (
              // Mắt cười
              <>
                <path d="M35 50 Q40 45 45 50" stroke="#0284c7" strokeWidth="3" fill="none" />
                <path d="M55 50 Q60 45 65 50" stroke="#0284c7" strokeWidth="3" fill="none" />
              </>
            ) : (
              // Mắt đơn giản
              <>
                <circle cx="38" cy="45" r="2" fill="#0284c7" />
                <circle cx="62" cy="45" r="2" fill="#0284c7" />
              </>
            )}
            {/* Má hồng */}
            <circle cx="30" cy="55" r="3" fill="#f472b6" opacity="0.6" />
            <circle cx="70" cy="55" r="3" fill="#f472b6" opacity="0.6" />
          </g>
        )

      case 'cat':
        // 🐱 MÈO VŨ TRỤ (ASTRO CAT) - Đại diện cho Analysts (NT)
        return (
          <g className="mascot-cat transition-transform duration-500">
            {/* Bộ đồ phi hành gia */}
            <circle cx="50" cy="55" r="38" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            {/* Kính mũ bảo hiểm */}
            <circle cx="50" cy="50" r="25" fill="#1e1b4b" opacity="0.8" />
            {/* Đầu mèo bên trong */}
            <circle cx="50" cy="50" r="20" fill="#0f172a" />
            {/* Tai mèo */}
            <path d="M35 35 L40 20 L50 35" fill="#0f172a" />
            <path d="M65 35 L60 20 L50 35" fill="#0f172a" />
            {/* Mắt - biểu cảm logic, sắc bén */}
            {mood === 'happy' || mood === 'celebrating' ? (
              <path d="M40 50 L45 50 M55 50 L60 50" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            ) : (
              // Mắt nhìn thẳng
              <>
                <circle cx="43" cy="50" r="3" fill="#00ffcc" className="animate-pulse" />
                <circle cx="57" cy="50" r="3" fill="#00ffcc" className="animate-pulse" />
              </>
            )}
          </g>
        )

      case 'dolphin':
      default:
        // 🐬 CÁ HEO (DOLPHIN) - Đại diện cho Explorers (SP)
        return (
          <g className="mascot-dolphin transition-transform duration-500">
            {/* Thân */}
            <path
              d="M10 50 Q 20 20 50 20 T 90 50 Q 90 80 50 80 T 10 50"
              fill="#67e8f9"
            />
            {/* Bụng */}
            <path d="M20 50 Q 40 70 80 50 L 20 50 Z" fill="#bae6fd" />
            {/* Mắt */}
            <circle cx="35" cy="45" r="5" fill="white" />
            <circle cx="35" cy="45" r="2" fill="black" />
            {/* Vây */}
            <path d="M50 20 L 40 5 L 60 20 Z" fill="#22d3ee" />
            {/* Nụ cười */}
            {(mood === 'happy' || mood === 'celebrating') && (
              <path d="M30 55 Q35 60 40 55" stroke="black" strokeWidth="2" fill="none" />
            )}
          </g>
        )
    }
  }

  return (
    <motion.div
      className={`relative cursor-pointer ${sizeClasses[size]} transition-all duration-500`}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
        {renderMascotContent()}

        {/* Chỉ thị cảm xúc chung */}
        {mood === 'sleeping' && (
          <text x="80" y="20" fontSize="20">💤</text>
        )}
        {mood === 'thinking' && (
          <text x="75" y="25" fontSize="18">💭</text>
        )}
        {mood === 'waving' && (
          <text x="75" y="25" fontSize="18">👋</text>
        )}
      </svg>
    </motion.div>
  )
}
