/**
 * Custom GSAP Hooks
 * React hooks for common GSAP animations
 */

'use client'

import { useEffect, useRef, MutableRefObject } from 'react'
import gsap from 'gsap'
import { useGSAP as useGSAPReact } from '@gsap/react'
import { ANIMATION_PRESETS, EASE, ANIMATION_DURATION } from '@/lib/gsap-config'

// Register GSAP with React
gsap.registerPlugin(useGSAPReact)

/**
 * Hook for fade-in animation on mount
 */
export function useFadeIn(duration: number = ANIMATION_DURATION.normal) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAPReact(() => {
    if (ref.current) {
      gsap.from(ref.current, {
        ...ANIMATION_PRESETS.fadeIn,
        duration,
      })
    }
  }, [duration])

  return ref
}

/**
 * Hook for slide-in animation on mount
 */
export function useSlideIn(
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  duration: number = ANIMATION_DURATION.normal
) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAPReact(() => {
    if (ref.current) {
      const presetKey = `slideIn${direction.charAt(0).toUpperCase() + direction.slice(1)}` as keyof typeof ANIMATION_PRESETS
      gsap.from(ref.current, {
        ...ANIMATION_PRESETS[presetKey],
        duration,
      })
    }
  }, [direction, duration])

  return ref
}

/**
 * Hook for scale-in animation on mount
 */
export function useScaleIn(duration: number = ANIMATION_DURATION.normal) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAPReact(() => {
    if (ref.current) {
      gsap.from(ref.current, {
        ...ANIMATION_PRESETS.scaleIn,
        duration,
      })
    }
  }, [duration])

  return ref
}

/**
 * Hook for stagger animation on children
 */
export function useStagger(stagger: number = 0.1) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAPReact(() => {
    if (ref.current) {
      const children = ref.current.children
      gsap.from(children, {
        opacity: 0,
        y: 30,
        duration: ANIMATION_DURATION.normal,
        stagger,
        ease: EASE.smooth,
      })
    }
  }, [stagger])

  return ref
}

/**
 * Hook for card hover effect
 */
export function useCardHover<T extends HTMLElement>(): MutableRefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseEnter = () => {
      gsap.to(element, {
        ...ANIMATION_PRESETS.cardHover,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        duration: ANIMATION_DURATION.fast,
        ease: EASE.smooth,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      })
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return ref
}

/**
 * Hook for button press effect
 */
export function useButtonPress<T extends HTMLElement>(): MutableRefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseDown = () => {
      gsap.to(element, ANIMATION_PRESETS.buttonPress)
    }

    const handleMouseUp = () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.2,
        ease: EASE.bounce,
      })
    }

    element.addEventListener('mousedown', handleMouseDown)
    element.addEventListener('mouseup', handleMouseUp)
    element.addEventListener('mouseleave', handleMouseUp)

    return () => {
      element.removeEventListener('mousedown', handleMouseDown)
      element.removeEventListener('mouseup', handleMouseUp)
      element.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [])

  return ref
}

/**
 * Hook for number counter animation
 */
export function useCountUp(
  start: number,
  end: number,
  duration: number = ANIMATION_DURATION.slow,
  onUpdate?: (value: number) => void
) {
  const ref = useRef({ value: start })

  useGSAPReact(() => {
    gsap.to(ref.current, {
      value: end,
      duration,
      ease: EASE.default,
      onUpdate: () => {
        if (onUpdate) {
          onUpdate(Math.round(ref.current.value))
        }
      },
    })
  }, [start, end, duration, onUpdate])

  return ref
}

/**
 * Hook for progress bar animation
 */
export function useProgressBar(progress: number, duration: number = ANIMATION_DURATION.normal) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAPReact(() => {
    if (ref.current) {
      gsap.to(ref.current, {
        width: `${progress}%`,
        duration,
        ease: EASE.default,
      })
    }
  }, [progress, duration])

  return ref
}

/**
 * Hook for page transition animation
 */
export function usePageTransition() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAPReact(() => {
    if (ref.current) {
      const tl = gsap.timeline()

      tl.from(ref.current, {
        opacity: 0,
        y: 20,
        duration: ANIMATION_DURATION.normal,
        ease: EASE.smooth,
      })
    }
  })

  return ref
}
