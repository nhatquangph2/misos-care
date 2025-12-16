/**
 * MascotProvider Component
 * Provides mascot across the entire app with context awareness
 */

'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { DolphinMascot } from './DolphinMascot'
import { useMascotStore } from '@/stores/mascotStore'
import { getContextualMessage, determineMood, type ConversationContext } from '@/services/mascot.service'
import { MBTI_ENVIRONMENTS } from '@/lib/gamification-config'
import EnvironmentBackground from '../gamification/EnvironmentBackground'

export function MascotProvider() {
  const pathname = usePathname()
  const { userStats, setMood, addMessage, updateStreak, show } = useMascotStore()
  const [mounted, setMounted] = useState(false)

  // Determine current page context
  const getPageContext = (): ConversationContext['page'] => {
    if (pathname === '/') return 'home'
    if (pathname === '/tests') return 'tests'
    if (pathname.startsWith('/tests/') && pathname.endsWith('/results')) return 'results'
    if (pathname.startsWith('/tests/')) return 'test-taking'
    if (pathname === '/dashboard') return 'dashboard'
    if (pathname === '/profile') return 'profile'
    return 'home'
  }

  // Update streak on app load
  useEffect(() => {
    setMounted(true)
    updateStreak()
    show() // Always show mascot by default
  }, [])

  // Context-aware messaging when page changes
  useEffect(() => {
    const context: ConversationContext = {
      page: getPageContext(),
      userStats,
    }

    // Set appropriate mood
    const mood = determineMood(context)
    setMood(mood)

    // Add contextual message for certain page transitions
    if (context.page === 'tests' && userStats.testsCompleted === 0) {
      setTimeout(() => {
        const msg = getContextualMessage(context)
        addMessage(msg.text, 'mascot', context.page)
      }, 1000)
    }
  }, [pathname])

  // Build context for mascot
  const context: ConversationContext = {
    page: getPageContext(),
    userStats,
  }

  // --- LOGIC XÁC ĐỊNH MÔI TRƯỜNG ĐỘNG ---
  // Lấy MBTI từ store
  const userMBTI = userStats?.mbtiResult?.type || 'UNKNOWN'

  // Xác định môi trường dựa trên MBTI config
  // Nếu chưa có MBTI (UNKNOWN), mặc định là 'ocean'
  const { env: currentEnvType } = MBTI_ENVIRONMENTS[userMBTI] || MBTI_ENVIRONMENTS['UNKNOWN']

  // Xác định Level dựa trên tiến độ (có thể customize logic này)
  // Ví dụ: số bài test hoàn thành càng nhiều, level càng sâu
  const currentLevel = Math.min(Math.floor(userStats.testsCompleted / 2), 4) // Max level 4

  // Đợi mounted để tránh hydration mismatch
  if (!mounted) return null

  return (
    <>
      {/* 1. Render Background động dựa trên User MBTI */}
      <EnvironmentBackground type={currentEnvType} level={currentLevel} />

      {/* 2. Render Mascot */}
      <DolphinMascot context={context} />
    </>
  )
}
