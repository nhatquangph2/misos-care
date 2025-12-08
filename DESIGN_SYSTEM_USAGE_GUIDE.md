# Design System Usage Guide
## How to use Miso's Care Design System v2.0

---

## 🎨 Using Colors

### CSS Variables (Recommended)
```tsx
// Using Tailwind classes
<div className="bg-[--miso-blue] text-white">Miso Blue</div>
<div className="bg-[--miso-purple]">Miso Purple</div>
<div className="bg-[--miso-pink]">Miso Pink</div>
<div className="bg-[--miso-green]">Miso Green</div>

// Severity badges
<div className="bg-[--severity-minimal]">Minimal</div>
<div className="bg-[--severity-mild]">Mild</div>
<div className="bg-[--severity-moderate]">Moderate</div>
<div className="bg-[--severity-severe]">Severe</div>

// Personality types
<div className="bg-[--personality-analyst]">Analyst</div>
<div className="bg-[--personality-diplomat]">Diplomat</div>
<div className="bg-[--personality-sentinel]">Sentinel</div>
<div className="bg-[--personality-explorer]">Explorer</div>
```

### Using Design System Utilities
```tsx
import {
  getSeverityColor,
  getSeverityLabel,
  getPersonalityColor,
  getPersonalityRole,
  brandColors,
  severityClasses
} from '@/lib/design-system'

// Get severity color
const color = getSeverityColor('moderate') // '#fb923c'

// Get severity label
const label = getSeverityLabel('mild') // 'Mild'

// Get personality role from MBTI
const role = getPersonalityRole('INTJ') // 'analyst'

// Get personality color
const personalityColor = getPersonalityColor('ENFP') // '#10b981' (diplomat)

// Use severity classes
<Badge className={severityClasses['moderate']}>
  Moderate Anxiety
</Badge>
```

---

## 🔢 PHQ-9, GAD-7, PSS Severity

### Automatic Severity Detection
```tsx
import { getPhq9Severity, getGad7Severity, getPssSeverity } from '@/lib/design-system'

// PHQ-9 score (0-27)
const phq9Score = 12
const severity = getPhq9Severity(phq9Score) // 'mild'

// GAD-7 score (0-21)
const gad7Score = 16
const anxietySeverity = getGad7Severity(gad7Score) // 'severe'

// PSS score (0-40)
const pssScore = 25
const stressSeverity = getPssSeverity(pssScore) // 'mild'

// Use in component
<div className={`p-4 rounded-lg ${severityClasses[severity]}`}>
  Your score: {phq9Score} ({getSeverityLabel(severity)})
</div>
```

---

## 📝 Typography

```tsx
// Headings
<h1 className="text-5xl font-bold">Main Hero Title</h1>
<h2 className="text-4xl font-semibold">Section Header</h2>
<h3 className="text-3xl font-medium">Card Title</h3>

// Body text
<p className="text-base">Regular paragraph text</p>
<p className="text-lg">Slightly larger text</p>

// Small/meta text
<small className="text-sm text-[--muted-foreground]">
  Meta information
</small>

// Data/scores (monospace)
<span className="font-mono text-2xl font-bold">
  87%
</span>
```

---

## 🎯 Spacing

```tsx
// Section spacing
<section className="py-24">  // 96px vertical padding

// Card spacing
<div className="p-8">  // 32px padding all sides
<div className="px-6 py-4">  // 24px horizontal, 16px vertical

// Grid gaps
<div className="grid grid-cols-3 gap-8">  // 32px gap
<div className="grid grid-cols-2 gap-6">  // 24px gap

// Margins
<div className="mb-6">  // 24px margin bottom
<div className="mt-12">  // 48px margin top
```

---

## 🎨 Border Radius

```tsx
// Small - Buttons, badges
<button className="rounded-[--radius-sm]">Button</button>

// Medium - Cards (default)
<div className="rounded-[--radius-md]">Card</div>

// Large - Hero sections
<div className="rounded-[--radius-lg]">Hero Card</div>

// Extra Large - Special elements
<div className="rounded-[--radius-xl]">Premium Card</div>

// Full - Pills, avatars
<div className="rounded-full">Avatar</div>
```

---

## ✨ Shadows

```tsx
// Small shadow - Subtle elevation
<div className="shadow-[--shadow-sm]">Card</div>

// Medium shadow - Default cards
<div className="shadow-[--shadow-md]">Elevated Card</div>

// Large shadow - Modals, popovers
<div className="shadow-[--shadow-lg]">Modal</div>

// Extra large - Hero elements
<div className="shadow-[--shadow-xl]">Hero Section</div>
```

---

## 🎭 Example Components

### Severity Badge Component
```tsx
import { getSeverityLabel, severityClasses, SeverityLevel } from '@/lib/design-system'

export function SeverityBadge({ level }: { level: SeverityLevel }) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${severityClasses[level]}`}>
      {getSeverityLabel(level)}
    </span>
  )
}

// Usage
<SeverityBadge level="moderate" />
```

### Personality Type Badge
```tsx
import {
  getPersonalityRole,
  personalityRoles,
  personalityClasses,
  PersonalityRole
} from '@/lib/design-system'

export function PersonalityBadge({ mbtiType }: { mbtiType: string }) {
  const role = getPersonalityRole(mbtiType)

  if (!role) return null

  return (
    <div className="flex items-center gap-2">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${personalityClasses[role]}`}>
        {personalityRoles[role]}
      </span>
      <span className="text-lg font-bold">{mbtiType}</span>
    </div>
  )
}

// Usage
<PersonalityBadge mbtiType="INTJ" />
```

### Test Result Card
```tsx
import { getPhq9Severity, getSeverityLabel, severityClasses } from '@/lib/design-system'

export function TestResultCard({ score, maxScore }: { score: number; maxScore: number }) {
  const severity = getPhq9Severity(score)

  return (
    <div className="bg-[--card] rounded-[--radius-lg] p-8 shadow-[--shadow-md]">
      <h3 className="text-2xl font-bold mb-4">Your PHQ-9 Result</h3>

      <div className="flex items-center gap-4 mb-6">
        <div className="text-5xl font-mono font-bold text-[--primary]">
          {score}
        </div>
        <div className="text-[--muted-foreground]">
          / {maxScore}
        </div>
      </div>

      <div className={`inline-block px-4 py-2 rounded-full ${severityClasses[severity]}`}>
        {getSeverityLabel(severity)} Depression
      </div>

      <p className="mt-6 text-[--muted-foreground]">
        Your score indicates {getSeverityLabel(severity).toLowerCase()} symptoms.
      </p>
    </div>
  )
}
```

---

## 🌈 Gradient Backgrounds

```tsx
// Miso brand gradient
<div className="bg-gradient-to-r from-[--miso-blue] via-[--miso-purple] to-[--miso-pink]">
  Colorful Hero
</div>

// Subtle background gradient
<div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
  Soft Background
</div>

// Text gradient
<h1 className="text-5xl font-bold bg-gradient-to-r from-[--miso-blue] to-[--miso-purple] bg-clip-text text-transparent">
  Gradient Text
</h1>
```

---

## 📊 Color Usage Guidelines

### When to use each color:

**Miso Blue** (`--miso-blue`)
- Primary actions (buttons, links)
- Trust-building elements
- Default brand color

**Miso Purple** (`--miso-purple`)
- Accents and highlights
- Premium features
- Creative/wisdom themes

**Miso Pink** (`--miso-pink`)
- Compassion/support messages
- Warm encouraging content
- Social features

**Miso Green** (`--miso-green`)
- Success states
- Growth/progress indicators
- Wellness/healing themes

### Severity Colors
- Use **only** for mental health scores
- Never for decorative purposes
- Always pair with clear labels

### Personality Colors
- Use for MBTI type displays
- Consistent role-based coloring
- Help users recognize patterns

---

## ♿ Accessibility

### Contrast Requirements
All color combinations meet WCAG AA (4.5:1) contrast:

```tsx
// ✅ Good contrast
<div className="bg-[--miso-blue] text-white">
<div className="bg-[--severity-minimal] text-white">
<div className="bg-[--muted] text-[--foreground]">

// ❌ Poor contrast (avoid)
<div className="bg-[--severity-mild] text-white">  // Yellow bg + white text
```

### Focus States
```tsx
// Automatic focus indicators
<button className="focus:outline-2 focus:outline-[--primary] focus:outline-offset-2">
  Accessible Button
</button>
```

### Reduced Motion
```tsx
import { useReducedMotion } from 'framer-motion'

function Component() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
    >
      Respects user preferences
    </motion.div>
  )
}
```

---

## 📱 Responsive Design

```tsx
// Mobile-first approach
<div className="
  text-3xl     /* Mobile: 30px */
  md:text-4xl  /* Tablet: 36px */
  lg:text-5xl  /* Desktop: 48px */
">

<div className="
  p-4          /* Mobile: 16px */
  md:p-6       /* Tablet: 24px */
  lg:p-8       /* Desktop: 32px */
">

<div className="
  grid
  grid-cols-1       /* Mobile: 1 column */
  md:grid-cols-2    /* Tablet: 2 columns */
  lg:grid-cols-3    /* Desktop: 3 columns */
  gap-6
">
```

---

## 🚀 Quick Reference

### Most Common Patterns

```tsx
// Card
<div className="bg-[--card] rounded-[--radius-md] p-6 shadow-[--shadow-md]">

// Button Primary
<button className="bg-[--primary] text-[--primary-foreground] px-6 py-3 rounded-[--radius-sm] font-medium hover:opacity-90">

// Button Secondary
<button className="bg-[--secondary] text-[--secondary-foreground] px-6 py-3 rounded-[--radius-sm] font-medium">

// Input
<input className="bg-[--input] border border-[--border] rounded-[--radius-sm] px-4 py-2 focus:outline-[--primary]">

// Badge
<span className="bg-[--muted] text-[--muted-foreground] px-3 py-1 rounded-full text-sm">

// Section
<section className="py-24 px-4 max-w-7xl mx-auto">

// Grid Layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

---

**Questions?** Check the main design system file at `/lib/design-system.ts` for all available utilities!
