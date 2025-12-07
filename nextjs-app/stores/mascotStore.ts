/**
 * Mascot Store - Zustand
 * Manages dolphin mascot state, interactions, and gamification
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// =====================================================
// TYPES
// =====================================================

export type MascotMood =
  | 'idle'           // Default state, chilling
  | 'happy'          // User completed test, achieved milestone
  | 'encouraging'    // User hesitating, needs motivation
  | 'thinking'       // AI processing
  | 'celebrating'    // Big achievement
  | 'concerned'      // Crisis detected (PHQ-9 high)
  | 'sleeping'       // User inactive for a while
  | 'waving'         // Greeting new user
  | 'excited'        // User came back after long time

export type MascotPosition = 'bottom-right' | 'bottom-left' | 'center'

export interface MascotMessage {
  id: string
  text: string
  timestamp: number
  type: 'mascot' | 'user'
  mood?: MascotMood
  context?: string // Page context (tests, results, dashboard)
}

export interface Achievement {
  id: string
  name: string
  nameVi: string
  description: string
  descriptionVi: string
  icon: string
  unlockedAt: number | null
  progress: number // 0-100
  requirement: number
}

export interface UserStats {
  testsCompleted: number
  currentStreak: number
  longestStreak: number
  lastVisit: number
  totalPoints: number
  level: number
}

// =====================================================
// STORE INTERFACE
// =====================================================

interface MascotStore {
  // State
  isVisible: boolean
  isMinimized: boolean
  isChatOpen: boolean
  currentMood: MascotMood
  position: MascotPosition
  messages: MascotMessage[]
  userStats: UserStats
  achievements: Achievement[]

  // User preferences
  hasSeenIntro: boolean
  mascotEnabled: boolean
  soundEnabled: boolean

  // Actions - Visibility
  show: () => void
  hide: () => void
  toggleMinimize: () => void
  toggleChat: () => void
  setPosition: (position: MascotPosition) => void

  // Actions - Mood & Messages
  setMood: (mood: MascotMood) => void
  addMessage: (text: string, type: 'mascot' | 'user', context?: string) => void
  clearMessages: () => void

  // Actions - Stats & Gamification
  incrementTestsCompleted: () => void
  updateStreak: () => void
  addPoints: (points: number) => void
  unlockAchievement: (achievementId: string) => void

  // Actions - Settings
  toggleMascot: () => void
  toggleSound: () => void
  markIntroSeen: () => void

  // Actions - Reset
  resetStats: () => void
}

// =====================================================
// INITIAL DATA
// =====================================================

const initialAchievements: Achievement[] = [
  {
    id: 'first-test',
    name: 'First Step',
    nameVi: 'Bước đầu tiên',
    description: 'Complete your first test',
    descriptionVi: 'Hoàn thành bài test đầu tiên',
    icon: '🎯',
    unlockedAt: null,
    progress: 0,
    requirement: 1,
  },
  {
    id: 'test-trio',
    name: 'Test Trio',
    nameVi: 'Bộ ba khám phá',
    description: 'Complete 3 different tests',
    descriptionVi: 'Hoàn thành 3 bài test khác nhau',
    icon: '🎪',
    unlockedAt: null,
    progress: 0,
    requirement: 3,
  },
  {
    id: 'spiritual-explorer',
    name: 'Spiritual Explorer',
    nameVi: 'Nhà thám hiểm tâm linh',
    description: 'Complete the SISRI-24 test',
    descriptionVi: 'Hoàn thành bài test SISRI-24',
    icon: '✨',
    unlockedAt: null,
    progress: 0,
    requirement: 1,
  },
  {
    id: 'personality-master',
    name: 'Personality Master',
    nameVi: 'Bậc thầy tính cách',
    description: 'Complete MBTI and Big5 tests',
    descriptionVi: 'Hoàn thành bài test MBTI và Big5',
    icon: '🧠',
    unlockedAt: null,
    progress: 0,
    requirement: 2,
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    nameVi: 'Chiến binh tuần lễ',
    description: 'Maintain a 7-day streak',
    descriptionVi: 'Duy trì streak 7 ngày',
    icon: '🔥',
    unlockedAt: null,
    progress: 0,
    requirement: 7,
  },
  {
    id: 'mental-health-advocate',
    name: 'Mental Health Advocate',
    nameVi: 'Người ủng hộ sức khỏe tinh thần',
    description: 'Complete all mental health tests',
    descriptionVi: 'Hoàn thành tất cả bài test sức khỏe tinh thần',
    icon: '💚',
    unlockedAt: null,
    progress: 0,
    requirement: 4,
  },
  {
    id: 'completionist',
    name: 'Completionist',
    nameVi: 'Nhà hoàn thành',
    description: 'Complete all 7 tests',
    descriptionVi: 'Hoàn thành tất cả 7 bài test',
    icon: '🏆',
    unlockedAt: null,
    progress: 0,
    requirement: 7,
  },
]

const initialStats: UserStats = {
  testsCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastVisit: Date.now(),
  totalPoints: 0,
  level: 1,
}

// =====================================================
// STORE IMPLEMENTATION
// =====================================================

export const useMascotStore = create<MascotStore>()(
  persist(
    (set, get) => ({
      // Initial State
      isVisible: true,
      isMinimized: false,
      isChatOpen: false,
      currentMood: 'waving',
      position: 'bottom-right',
      messages: [],
      userStats: initialStats,
      achievements: initialAchievements,
      hasSeenIntro: false,
      mascotEnabled: true,
      soundEnabled: true,

      // Visibility Actions
      show: () => set({ isVisible: true }),
      hide: () => set({ isVisible: false }),
      toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      setPosition: (position) => set({ position }),

      // Mood & Messages Actions
      setMood: (mood) => set({ currentMood: mood }),

      addMessage: (text, type, context) => {
        const message: MascotMessage = {
          id: `msg-${Date.now()}-${Math.random()}`,
          text,
          timestamp: Date.now(),
          type,
          mood: type === 'mascot' ? get().currentMood : undefined,
          context,
        }
        set((state) => ({
          messages: [...state.messages, message],
        }))
      },

      clearMessages: () => set({ messages: [] }),

      // Stats & Gamification Actions
      incrementTestsCompleted: () => {
        set((state) => {
          const newCount = state.userStats.testsCompleted + 1
          const newPoints = state.userStats.totalPoints + 100
          const newLevel = Math.floor(newPoints / 500) + 1

          return {
            userStats: {
              ...state.userStats,
              testsCompleted: newCount,
              totalPoints: newPoints,
              level: newLevel,
            },
          }
        })

        // Check achievements
        const stats = get().userStats
        const achievements = get().achievements

        // First test achievement
        if (stats.testsCompleted === 1) {
          get().unlockAchievement('first-test')
        }
        // Test trio
        if (stats.testsCompleted === 3) {
          get().unlockAchievement('test-trio')
        }
        // Completionist
        if (stats.testsCompleted === 7) {
          get().unlockAchievement('completionist')
        }
      },

      updateStreak: () => {
        const now = Date.now()
        const lastVisit = get().userStats.lastVisit
        const oneDayMs = 24 * 60 * 60 * 1000

        set((state) => {
          const daysSinceLastVisit = Math.floor((now - lastVisit) / oneDayMs)

          let newStreak = state.userStats.currentStreak

          if (daysSinceLastVisit === 0) {
            // Same day, no change
            return state
          } else if (daysSinceLastVisit === 1) {
            // Next day, increment streak
            newStreak = state.userStats.currentStreak + 1
          } else {
            // Broke streak, reset to 1
            newStreak = 1
          }

          const newLongestStreak = Math.max(newStreak, state.userStats.longestStreak)

          // Check week warrior achievement
          if (newStreak >= 7) {
            get().unlockAchievement('week-warrior')
          }

          return {
            userStats: {
              ...state.userStats,
              currentStreak: newStreak,
              longestStreak: newLongestStreak,
              lastVisit: now,
            },
          }
        })
      },

      addPoints: (points) => {
        set((state) => {
          const newPoints = state.userStats.totalPoints + points
          const newLevel = Math.floor(newPoints / 500) + 1

          return {
            userStats: {
              ...state.userStats,
              totalPoints: newPoints,
              level: newLevel,
            },
          }
        })
      },

      unlockAchievement: (achievementId) => {
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === achievementId
              ? {
                  ...achievement,
                  unlockedAt: Date.now(),
                  progress: 100,
                }
              : achievement
          ),
        }))

        // Trigger celebration
        get().setMood('celebrating')
        get().addPoints(50)
      },

      // Settings Actions
      toggleMascot: () => set((state) => ({ mascotEnabled: !state.mascotEnabled })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      markIntroSeen: () => set({ hasSeenIntro: true }),

      // Reset
      resetStats: () =>
        set({
          userStats: initialStats,
          achievements: initialAchievements,
          messages: [],
        }),
    }),
    {
      name: 'mascot-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        userStats: state.userStats,
        achievements: state.achievements,
        hasSeenIntro: state.hasSeenIntro,
        mascotEnabled: state.mascotEnabled,
        soundEnabled: state.soundEnabled,
        isMinimized: state.isMinimized,
      }),
    }
  )
)
