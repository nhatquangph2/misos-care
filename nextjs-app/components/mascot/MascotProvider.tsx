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

  return <DolphinMascot context={context} />
}
