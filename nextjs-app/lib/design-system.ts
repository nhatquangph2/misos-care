/**
 * Miso's Care Design System v2.0
 * Centralized design tokens and utilities
 */

// ============================================
// BRAND COLORS
// ============================================

export const brandColors = {
  blue: '#3b82f6',      // Trust, calm, stability
  purple: '#8b5cf6',    // Creativity, wisdom
  pink: '#ec4899',      // Warmth, compassion
  green: '#10b981',     // Growth, healing
} as const

// ============================================
// MENTAL HEALTH SEVERITY SCALE
// ============================================

export const severityColors = {
  minimal: '#10b981',    // Green - Good mental health
  mild: '#fcd34d',       // Yellow - Mild symptoms
  moderate: '#fb923c',   // Orange - Moderate symptoms
  severe: '#ef4444',     // Red - Severe symptoms
} as const

export type SeverityLevel = keyof typeof severityColors

export const severityLabels: Record<SeverityLevel, string> = {
  minimal: 'Minimal',
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
}

export const severityClasses: Record<SeverityLevel, string> = {
  minimal: 'bg-[--severity-minimal] text-white',
  mild: 'bg-[--severity-mild] text-gray-900',
  moderate: 'bg-[--severity-moderate] text-white',
  severe: 'bg-[--severity-severe] text-white',
}

// ============================================
// PERSONALITY TYPES (MBTI)
// ============================================

export const personalityColors = {
  analyst: '#8b5cf6',    // Purple - INTJ, INTP, ENTJ, ENTP
  diplomat: '#10b981',   // Green - INFJ, INFP, ENFJ, ENFP
  sentinel: '#3b82f6',   // Blue - ISTJ, ISFJ, ESTJ, ESFJ
  explorer: '#f59e0b',   // Orange - ISTP, ISFP, ESTP, ESFP
} as const

export type PersonalityRole = keyof typeof personalityColors

export const personalityRoles: Record<PersonalityRole, string> = {
  analyst: 'Analyst',
  diplomat: 'Diplomat',
  sentinel: 'Sentinel',
  explorer: 'Explorer',
}

export const personalityRoleDescriptions: Record<PersonalityRole, string> = {
  analyst: 'Rational, logical, and strategic thinkers',
  diplomat: 'Empathetic, idealistic, and people-focused',
  sentinel: 'Practical, organized, and tradition-oriented',
  explorer: 'Spontaneous, flexible, and action-oriented',
}

// Map MBTI types to roles
export const mbtiToRole: Record<string, PersonalityRole> = {
  // Analysts
  INTJ: 'analyst',
  INTP: 'analyst',
  ENTJ: 'analyst',
  ENTP: 'analyst',
  // Diplomats
  INFJ: 'diplomat',
  INFP: 'diplomat',
  ENFJ: 'diplomat',
  ENFP: 'diplomat',
  // Sentinels
  ISTJ: 'sentinel',
  ISFJ: 'sentinel',
  ESTJ: 'sentinel',
  ESFJ: 'sentinel',
  // Explorers
  ISTP: 'explorer',
  ISFP: 'explorer',
  ESTP: 'explorer',
  ESFP: 'explorer',
}

export const personalityClasses: Record<PersonalityRole, string> = {
  analyst: 'bg-[--personality-analyst] text-white',
  diplomat: 'bg-[--personality-diplomat] text-white',
  sentinel: 'bg-[--personality-sentinel] text-white',
  explorer: 'bg-[--personality-explorer] text-white',
}

// ============================================
// SEMANTIC COLORS
// ============================================

export const semanticColors = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const

// ============================================
// SPACING SCALE
// ============================================

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '3rem',   // 48px
  '4xl': '4rem',   // 64px
  '5xl': '6rem',   // 96px
  '6xl': '8rem',   // 128px
} as const

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  full: '9999px',
} as const

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const

// ============================================
// TYPOGRAPHY SCALE
// ============================================

export const typography = {
  // Font sizes
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },

  // Font weights
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

// ============================================
// ANIMATION DURATIONS
// ============================================

export const animations = {
  durations: {
    fast: 150,      // 150ms - Instant feedback
    normal: 300,    // 300ms - Standard transitions
    slow: 500,      // 500ms - Emphasis
  },

  easings: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get severity color by level
 */
export function getSeverityColor(level: SeverityLevel): string {
  return severityColors[level]
}

/**
 * Get severity label
 */
export function getSeverityLabel(level: SeverityLevel): string {
  return severityLabels[level]
}

/**
 * Get personality role by MBTI type
 */
export function getPersonalityRole(mbtiType: string): PersonalityRole | null {
  return mbtiToRole[mbtiType.toUpperCase()] || null
}

/**
 * Get personality color by MBTI type
 */
export function getPersonalityColor(mbtiType: string): string | null {
  const role = getPersonalityRole(mbtiType)
  return role ? personalityColors[role] : null
}

/**
 * Get personality role description
 */
export function getPersonalityRoleDescription(role: PersonalityRole): string {
  return personalityRoleDescriptions[role]
}

/**
 * Convert score to severity level
 */
export function scoreToSeverity(
  score: number,
  thresholds: { minimal: number; mild: number; moderate: number }
): SeverityLevel {
  if (score < thresholds.minimal) return 'minimal'
  if (score < thresholds.mild) return 'mild'
  if (score < thresholds.moderate) return 'moderate'
  return 'severe'
}

// ============================================
// PHQ-9 SEVERITY THRESHOLDS
// ============================================

export const phq9Thresholds = {
  minimal: 5,
  mild: 10,
  moderate: 15,
} as const

export function getPhq9Severity(score: number): SeverityLevel {
  return scoreToSeverity(score, phq9Thresholds)
}

// ============================================
// GAD-7 SEVERITY THRESHOLDS
// ============================================

export const gad7Thresholds = {
  minimal: 5,
  mild: 10,
  moderate: 15,
} as const

export function getGad7Severity(score: number): SeverityLevel {
  return scoreToSeverity(score, gad7Thresholds)
}

// ============================================
// PSS SEVERITY THRESHOLDS
// ============================================

export const pssThresholds = {
  minimal: 14,
  mild: 27,
  moderate: 35,
} as const

export function getPssSeverity(score: number): SeverityLevel {
  return scoreToSeverity(score, pssThresholds)
}
