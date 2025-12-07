/**
 * MascotBubble Component
 * Speech bubble for mascot messages
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface MascotBubbleProps {
  message: string
  isVisible: boolean
  onClose?: () => void
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function MascotBubble({
  message,
  isVisible,
  onClose,
  position = 'top',
}: MascotBubbleProps) {
  // Position offset based on bubble direction
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-4 left-1/2 -translate-x-1/2'
      case 'bottom':
        return 'top-full mt-4 left-1/2 -translate-x-1/2'
      case 'left':
        return 'right-full mr-4 top-1/2 -translate-y-1/2'
      case 'right':
        return 'left-full ml-4 top-1/2 -translate-y-1/2'
    }
  }

  // Tail position based on bubble direction
  const getTailStyles = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 -mt-1 border-l-transparent border-r-transparent border-b-transparent border-t-white'
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l-transparent border-r-transparent border-t-transparent border-b-white'
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t-transparent border-b-transparent border-l-transparent border-r-white'
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 -mr-1 border-t-transparent border-b-transparent border-r-transparent border-l-white'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          className={`absolute ${getPositionStyles()} z-50 w-64`}
          initial={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: position === 'top' ? 10 : -10 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {/* Main bubble */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                aria-label="Close message"
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
            )}

            {/* Message text */}
            <p className="text-sm leading-relaxed text-gray-800">{message}</p>

            {/* Animated dots (typing indicator style) */}
            <motion.div
              className="absolute -bottom-1 right-4 flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Speech bubble tail */}
          <div
            className={`absolute w-0 h-0 border-8 ${getTailStyles()}`}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))',
            }}
          />

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-2xl blur-xl -z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
