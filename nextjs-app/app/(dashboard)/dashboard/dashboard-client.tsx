'use client'

import { useEffect } from 'react'
import { useFadeIn, useStagger } from '@/hooks/useGSAP'
import { useMascotStore } from '@/stores/mascotStore'

interface DashboardClientProps {
  latestRecord: any
  stats: {
    testsCompleted: number
    currentStreak: number
  }
}

export default function DashboardClient({ latestRecord, stats }: DashboardClientProps) {
  const fadeRef = useFadeIn()
  const staggerRef = useStagger(0.1)
  const { setMood, addMessage } = useMascotStore()

  useEffect(() => {
    // Set mascot mood based on latest score
    if (latestRecord) {
      const severity = latestRecord.severity_level
      if (severity === 'normal' || severity === 'mild') {
        setMood('happy')
      } else if (severity === 'severe' || severity === 'extremely_severe') {
        setMood('concerned')
      } else {
        setMood('encouraging')
      }
    } else if (stats.testsCompleted === 0) {
      setMood('waving')
      addMessage(
        "Chào mừng bạn đến với Miso's Care! Hãy bắt đầu với một bài test nhé 🌊",
        'mascot',
        'dashboard'
      )
    }
  }, [latestRecord, stats.testsCompleted, setMood, addMessage])

  return null
}
