/**
 * MascotProvider Component
 * Provides mascot across the entire app with context awareness
 */

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { DolphinMascot } from './DolphinMascot'
import { useMascotStore } from '@/stores/mascotStore'
import { getContextualMessage, determineMood, type ConversationContext } from '@/services/mascot.service'
import { MBTI_ENVIRONMENTS } from '@/lib/gamification-config'

export function MascotProvider() {
  const pathname = usePathname()
  const { userStats, setMood, addMessage, updateStreak, show } = useMascotStore()

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

  // Lấy environment type dựa trên MBTI (để tham khảo cho tương lai)
  const userMBTI = userStats?.mbtiResult?.type || 'UNKNOWN'
  const { env: currentEnvType } = MBTI_ENVIRONMENTS[userMBTI] || MBTI_ENVIRONMENTS['UNKNOWN']

  // NOTE: Để đồng bộ EnvironmentBackground với MBTI động:
  // 1. Sử dụng Context API (React Context) để chia sẻ MBTI/Environment type
  // 2. Hoặc fetch MBTI trong một Client Component wrapper và truyền xuống
  // 3. Hoặc sử dụng Zustand/Redux để quản lý global state
  // Hiện tại, DolphinMascot đã tự động chọn đúng mascot type dựa trên userStats

  return <DolphinMascot context={context} />
}
