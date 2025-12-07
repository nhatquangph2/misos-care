/**
 * GSAP Configuration & Default Settings
 * Centralized GSAP setup for consistent animations across the app
 */

import gsap from 'gsap'

// Default animation durations
export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.2,
} as const

// Default easing functions
export const EASE = {
  // Smooth & natural
  default: 'power2.out',
  smooth: 'power3.out',

  // Bouncy & playful
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.5)',

  // Sharp & snappy
  snap: 'power4.out',

  // Custom cubic bezier
  custom: 'cubic-bezier(0.65, 0, 0.35, 1)',
} as const

// Animation presets for common use cases
export const ANIMATION_PRESETS = {
  // Fade animations
  fadeIn: {
    opacity: 0,
    duration: ANIMATION_DURATION.normal,
    ease: EASE.smooth,
  },
  fadeOut: {
    opacity: 0,
    duration: ANIMATION_DURATION.normal,
    ease: EASE.smooth,
  },

  // Slide animations
  slideInUp: {
    y: 50,
    opacity: 0,
    duration: ANIMATION_DURATION.normal,
    ease: EASE.smooth,
  },
  slideInDown: {
    y: -50,
    opacity: 0,
    duration: ANIMATION_DURATION.normal,
    ease: EASE.smooth,
  },
  slideInLeft: {
    x: -50,
    opacity: 0,
    duration: ANIMATION_DURATION.normal,
    ease: EASE.smooth,
  },
  slideInRight: {
    x: 50,
    opacity: 0,
    duration: ANIMATION_DURATION.normal,
    ease: EASE.smooth,
  },

  // Scale animations
  scaleIn: {
    scale: 0.8,
    opacity: 0,
    duration: ANIMATION_DURATION.normal,
    ease: EASE.bounce,
  },
  scaleOut: {
    scale: 0.8,
    opacity: 0,
    duration: ANIMATION_DURATION.fast,
    ease: EASE.default,
  },

  // Card hover effect
  cardHover: {
    scale: 1.05,
    y: -10,
    duration: ANIMATION_DURATION.fast,
    ease: EASE.snap,
  },

  // Button press effect
  buttonPress: {
    scale: 0.95,
    duration: 0.1,
    ease: EASE.snap,
  },
} as const

// Stagger configuration for animating multiple elements
export const STAGGER_CONFIG = {
  cards: {
    amount: 0.1,
    from: 'start',
    ease: EASE.smooth,
  },
  list: {
    amount: 0.05,
    from: 'start',
    ease: EASE.default,
  },
  grid: {
    amount: 0.08,
    from: 'center',
    ease: EASE.smooth,
  },
} as const

// Initialize GSAP with defaults
export function initGSAP() {
  // Set default ease
  gsap.defaults({
    ease: EASE.default,
    duration: ANIMATION_DURATION.normal,
  })

  // Optional: Register plugins here if needed
  // Example: gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
}

// Helper: Create timeline with default settings
export function createTimeline(config?: gsap.TimelineVars) {
  return gsap.timeline({
    defaults: {
      ease: EASE.smooth,
      duration: ANIMATION_DURATION.normal,
    },
    ...config,
  })
}

// Helper: Animate element entrance
export function animateIn(
  element: gsap.TweenTarget,
  preset: keyof typeof ANIMATION_PRESETS = 'fadeIn',
  customVars?: gsap.TweenVars
) {
  return gsap.from(element, {
    ...ANIMATION_PRESETS[preset],
    ...customVars,
  })
}

// Helper: Animate element exit
export function animateOut(
  element: gsap.TweenTarget,
  preset: keyof typeof ANIMATION_PRESETS = 'fadeOut',
  customVars?: gsap.TweenVars
) {
  return gsap.to(element, {
    ...ANIMATION_PRESETS[preset],
    ...customVars,
  })
}

// Helper: Stagger animation for multiple elements
export function staggerIn(
  elements: gsap.TweenTarget,
  preset: keyof typeof ANIMATION_PRESETS = 'fadeIn',
  staggerConfig: keyof typeof STAGGER_CONFIG = 'cards',
  customVars?: gsap.TweenVars
) {
  return gsap.from(elements, {
    ...ANIMATION_PRESETS[preset],
    stagger: STAGGER_CONFIG[staggerConfig],
    ...customVars,
  })
}
