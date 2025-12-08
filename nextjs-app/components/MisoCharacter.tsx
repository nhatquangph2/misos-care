/**
 * Miso Character Component
 * Display Miso the Dolphin in different emotional states
 */

import Image from 'next/image'

export type MisoEmotion = 'happy' | 'supportive' | 'celebrating' | 'calm' | 'thinking' | 'strong' | 'sleepy'

export type MisoSize = 'sm' | 'md' | 'lg' | 'xl'

interface MisoCharacterProps {
  emotion?: MisoEmotion
  size?: MisoSize
  className?: string
  animate?: boolean
}

const sizeMap: Record<MisoSize, number> = {
  sm: 64,
  md: 128,
  lg: 256,
  xl: 384,
}

export function MisoCharacter({
  emotion = 'happy',
  size = 'md',
  className = '',
  animate = false,
}: MisoCharacterProps) {
  const dimensions = sizeMap[size]

  return (
    <div className={`inline-block ${animate ? 'animate-bounce' : ''} ${className}`}>
      <Image
        src={`/characters/miso/${emotion}.svg`}
        alt={`Miso the dolphin - ${emotion}`}
        width={dimensions}
        height={dimensions}
        className="object-contain"
        priority
      />
    </div>
  )
}

/**
 * Floating Miso with smooth up/down animation
 */
export function FloatingMiso({
  emotion = 'happy',
  size = 'md',
  className = '',
}: Omit<MisoCharacterProps, 'animate'>) {
  return (
    <div className={`inline-block animate-float ${className}`}>
      <Image
        src={`/characters/miso/${emotion}.svg`}
        alt={`Miso the dolphin - ${emotion}`}
        width={sizeMap[size]}
        height={sizeMap[size]}
        className="object-contain"
        priority
      />
    </div>
  )
}

/**
 * Add this to globals.css for float animation:
 *
 * @keyframes float {
 *   0%, 100% { transform: translateY(0px); }
 *   50% { transform: translateY(-10px); }
 * }
 *
 * .animate-float {
 *   animation: float 3s ease-in-out infinite;
 * }
 */
