"use client"

import { useEffect, useRef } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

export interface TourStep {
    element: string
    popover: {
        title: string
        description: string
        side?: "top" | "right" | "bottom" | "left"
        align?: "start" | "center" | "end"
    }
}

interface ProductTourProps {
    steps: TourStep[]
    tourKey: string
    startTrigger?: boolean
    onComplete?: () => void
}

export function ProductTour({
    steps,
    tourKey,
    startTrigger = false,
    onComplete,
}: ProductTourProps) {
    const driverRef = useRef<any>(null)

    useEffect(() => {
        driverRef.current = driver({
            showProgress: true,
            steps: steps,
            onDestroyStarted: () => {
                if (driverRef.current?.hasNextStep()) {
                    driverRef.current?.destroy()
                } else {
                    // Completed
                    localStorage.setItem(`tour-${tourKey}-completed`, "true")
                    onComplete?.()
                }
            },
        })
    }, [steps, tourKey, onComplete])

    useEffect(() => {
        if (startTrigger) {
            const isCompleted = localStorage.getItem(`tour-${tourKey}-completed`)
            if (!isCompleted) {
                // Small delay to ensure elements are rendered
                setTimeout(() => {
                    driverRef.current?.drive()
                }, 1000)
            }
        }
    }, [startTrigger, tourKey])

    return null
}
