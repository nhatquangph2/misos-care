/**
 * DolphinMascot Component
 * Main floating mascot that appears across the app
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react'
import { useMascotStore } from '@/stores/mascotStore'
import { MascotAvatar } from './MascotAvatar'
import { MascotBubble } from './MascotBubble'
import { MascotChat } from './MascotChat'
import { getGreetingByTime, getRandomMessage, IDLE_MESSAGES } from '@/constants/mascot-messages'
import { MBTI_ENVIRONMENTS, MASCOT_CONFIG } from '@/lib/gamification-config'
import type { ConversationContext } from '@/services/mascot.service'

interface DolphinMascotProps {
  context?: ConversationContext
}

export function DolphinMascot({ context }: DolphinMascotProps) {
  const {
    isVisible,
    isMinimized,
    isChatOpen,
    currentMood,
    mascotEnabled,
    hasSeenIntro,
    toggleMinimize,
    toggleChat,
    hide,
    setMood,
    addMessage,
    markIntroSeen,
    userStats,
  } = useMascotStore()

  const [currentBubbleMessage, setCurrentBubbleMessage] = useState<string>('')
  const [showBubble, setShowBubble] = useState(false)

  // Lấy MBTI và Mascot Type
  const userMBTI = userStats?.mbtiResult?.type || 'UNKNOWN'
  const { mascot: currentMascotType } = MBTI_ENVIRONMENTS[userMBTI] || MBTI_ENVIRONMENTS['UNKNOWN']
  const mascotName = MASCOT_CONFIG[currentMascotType].name

  // Show intro message on first visit
  useEffect(() => {
    if (!hasSeenIntro && mascotEnabled) {
      const greeting = getGreetingByTime()
      // Tùy chỉnh lời chào theo tên Mascot mới
      const personalizedGreeting = greeting.text.replace('Misos', mascotName)

      setCurrentBubbleMessage(personalizedGreeting)
      setMood(greeting.mood)
      setShowBubble(true)
      addMessage(personalizedGreeting, 'mascot', 'home')

      // Auto-hide bubble after 5 seconds
      const timer = setTimeout(() => {
        setShowBubble(false)
        markIntroSeen()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [hasSeenIntro, mascotEnabled, mascotName, addMessage, markIntroSeen, setMood])

  // Show random idle messages periodically
  useEffect(() => {
    if (!mascotEnabled || !isVisible || isMinimized || isChatOpen) return

    const showIdleMessage = () => {
      const randomMsg = getRandomMessage(IDLE_MESSAGES)
      setCurrentBubbleMessage(randomMsg.text)
      setMood(randomMsg.mood)
      setShowBubble(true)

      // Auto-hide after 4 seconds
      setTimeout(() => {
        setShowBubble(false)
      }, 4000)
    }

    // Show idle message every 2 minutes
    const interval = setInterval(showIdleMessage, 120000)

    return () => clearInterval(interval)
  }, [mascotEnabled, isVisible, isMinimized, isChatOpen])

  // Handle avatar click
  const handleAvatarClick = () => {
    if (isMinimized) {
      toggleMinimize()
    } else {
      toggleChat()
    }
  }

  // Don't render if mascot is disabled or hidden
  if (!mascotEnabled || !isVisible) return null

  return (
    <>
      {/* Floating Mascot Container */}
      <motion.div
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 origin-bottom-right scale-75 md:scale-100"
        initial={{ opacity: 0, scale: 0, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0, y: 100 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
      >
        {/* Chat Interface */}
        <AnimatePresence>
          {isChatOpen && !isMinimized && (
            <motion.div
              className="absolute bottom-28 right-0 mb-2"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <MascotChat context={context} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar with Speech Bubble */}
        <div className="relative">
          {/* Speech Bubble */}
          {!isChatOpen && (
            <MascotBubble
              message={currentBubbleMessage}
              isVisible={showBubble}
              onClose={() => setShowBubble(false)}
              position="top"
            />
          )}

          {/* Main Avatar Container */}
          <motion.div
            className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full p-4 shadow-2xl border border-blue-100"
            whileHover={{ scale: 1.05 }}
          >
            {/* Mascot Avatar */}
            <MascotAvatar
              mood={currentMood}
              size="lg"
              onClick={handleAvatarClick}
              type={currentMascotType}
            />

            {/* Action Buttons */}
            {!isMinimized && (
              <div className="absolute -top-2 -left-2 flex gap-1">
                {/* Minimize/Maximize */}
                <motion.button
                  className="w-7 h-7 bg-white hover:bg-gray-50 rounded-full shadow-md flex items-center justify-center transition-colors"
                  onClick={toggleMinimize}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={isMinimized ? 'Maximize mascot' : 'Minimize mascot'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-3.5 h-3.5 text-gray-600" />
                  ) : (
                    <Minimize2 className="w-3.5 h-3.5 text-gray-600" />
                  )}
                </motion.button>

                {/* Close */}
                <motion.button
                  className="w-7 h-7 bg-white hover:bg-red-50 rounded-full shadow-md flex items-center justify-center transition-colors"
                  onClick={hide}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Hide mascot"
                >
                  <X className="w-3.5 h-3.5 text-gray-600" />
                </motion.button>
              </div>
            )}

            {/* Chat Toggle Button */}
            <motion.button
              className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-full shadow-lg flex items-center justify-center transition-all"
              onClick={toggleChat}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
            >
              <MessageCircle className="w-5 h-5 text-white" />

              {/* Notification dot - show if there's new message */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                }}
              />
            </motion.button>
          </motion.div>

          {/* Minimized State Indicator */}
          {isMinimized && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-blue-500/10 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Minimize2 className="w-8 h-8 text-blue-500" />
            </motion.div>
          )}
        </div>

        {/* Hover hint for new users */}
        {!hasSeenIntro && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {mascotName} sẵn sàng trò chuyện! 💬
          </motion.div>
        )}
      </motion.div>
    </>
  )
}
