"use client"

import { useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface TourInstance {
    drive: () => void
}

export function useTour(tourId: string, tour: TourInstance | null) {
    const [hasSeenTour, setHasSeenTour] = useLocalStorage<boolean>(
        `tour-${tourId}-seen`,
        false
    )

    useEffect(() => {
        if (!hasSeenTour && tour) {
            // Check if page is loaded
            const timer = setTimeout(() => {
                tour.drive()
                setHasSeenTour(true)
            }, 1500) // Delay to ensure page content is ready

            return () => clearTimeout(timer)
        }
    }, [hasSeenTour, tour, setHasSeenTour])

    return {
        startTour: () => tour?.drive(),
        resetTour: () => setHasSeenTour(false)
    }
}
