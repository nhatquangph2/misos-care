/**
 * Gamification Configuration
 * Centralized config for environment themes, MBTI mapping, and visual settings
 */

// ============================================================================
// MBTI to Environment Mapping
// ============================================================================

export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

// Định nghĩa 4 loại môi trường
export type EnvironmentType = 'ocean' | 'forest' | 'sky' | 'cosmos';

// Định nghĩa 4 loại Mascot (Linh vật)
export type MascotType = 'dolphin' | 'owl' | 'cloud' | 'cat';

// Map 16 tính cách vào 4 môi trường & 4 mascot dựa trên nhóm khí chất (Temperaments)
export const MBTI_ENVIRONMENTS: Record<string, { env: EnvironmentType; mascot: MascotType }> = {
  // 1. ANALYSTS (NT) -> Cosmos 🌌 & Astro Cat 🐱
  'INTJ': { env: 'cosmos', mascot: 'cat' },
  'INTP': { env: 'cosmos', mascot: 'cat' },
  'ENTJ': { env: 'cosmos', mascot: 'cat' },
  'ENTP': { env: 'cosmos', mascot: 'cat' },

  // 2. DIPLOMATS (NF) -> Sky ☁️ & Cloud Spirit ☁️
  'INFJ': { env: 'sky', mascot: 'cloud' },
  'INFP': { env: 'sky', mascot: 'cloud' },
  'ENFJ': { env: 'sky', mascot: 'cloud' },
  'ENFP': { env: 'sky', mascot: 'cloud' },

  // 3. SENTINELS (SJ) -> Forest 🌳 & Wise Owl 🦉
  'ISTJ': { env: 'forest', mascot: 'owl' },
  'ISFJ': { env: 'forest', mascot: 'owl' },
  'ESTJ': { env: 'forest', mascot: 'owl' },
  'ESFJ': { env: 'forest', mascot: 'owl' },

  // 4. EXPLORERS (SP) -> Ocean 🌊 & Dolphin 🐬
  'ISTP': { env: 'ocean', mascot: 'dolphin' },
  'ISFP': { env: 'ocean', mascot: 'dolphin' },
  'ESTP': { env: 'ocean', mascot: 'dolphin' },
  'ESFP': { env: 'ocean', mascot: 'dolphin' },

  // Mặc định cho người dùng chưa làm test
  'UNKNOWN': { env: 'ocean', mascot: 'dolphin' },
};

/**
 * Map MBTI personality types to their ideal environment (for backward compatibility)
 */
export const MBTI_TO_ENVIRONMENT: Record<MBTIType, EnvironmentType> = {
  // Cosmos - Analysts (NT): Strategic, logical, innovative
  'INTJ': 'cosmos',
  'INTP': 'cosmos',
  'ENTJ': 'cosmos',
  'ENTP': 'cosmos',

  // Sky - Diplomats (NF): Empathetic, idealistic, passionate
  'INFJ': 'sky',
  'INFP': 'sky',
  'ENFJ': 'sky',
  'ENFP': 'sky',

  // Forest - Sentinels (SJ): Practical, organized, reliable
  'ISTJ': 'forest',
  'ISFJ': 'forest',
  'ESTJ': 'forest',
  'ESFJ': 'forest',

  // Ocean - Explorers (SP): Spontaneous, adaptable, energetic
  'ISTP': 'ocean',
  'ISFP': 'ocean',
  'ESTP': 'ocean',
  'ESFP': 'ocean',
};

/**
 * Get environment type from MBTI type
 */
export function getEnvironmentFromMBTI(mbtiType: string | null | undefined): EnvironmentType {
  if (!mbtiType) return 'ocean'; // Default fallback

  const normalizedType = mbtiType.toUpperCase().trim() as MBTIType;
  return MBTI_TO_ENVIRONMENT[normalizedType] || 'ocean';
}

// ============================================================================
// Environment Themes Configuration
// ============================================================================

export interface EnvironmentTheme {
  id: EnvironmentType;
  name: string;
  nameVietnamese: string;
  description: string;
  descriptionVietnamese: string;

  // Visual settings
  gradients: {
    light: string; // Tailwind gradient classes for light theme
    dark: string;  // Tailwind gradient classes for dark theme
  };

  // Primary colors for UI elements
  colors: {
    primary: string;    // Main theme color
    secondary: string;  // Accent color
    accent: string;     // Highlight color
    text: string;       // Text color for this theme
  };

  // Bubble/particle settings
  bubbles: {
    count: number;      // Number of floating elements
    color: string;      // Bubble base color
    icon: string;       // Emoji or icon representing the environment
  };

  // Ambient effects
  effects: {
    hasRays: boolean;           // God rays / light beams
    hasParticles: boolean;      // Floating particles
    hasWaves: boolean;          // Wave animations
    particleType: string;       // Type of particle (bubbles, leaves, snow, clouds)
  };
}

/**
 * Environment theme configurations
 */
export const ENVIRONMENT_THEMES: Record<EnvironmentType, EnvironmentTheme> = {
  ocean: {
    id: 'ocean',
    name: 'Ocean Depths',
    nameVietnamese: 'Đại Dương Sâu Thẳm',
    description: 'Calm, deep, and mysterious like the ocean',
    descriptionVietnamese: 'Bình yên, sâu thẳm và huyền bí như đại dương',

    gradients: {
      light: 'from-[#06b6d4] via-[#3b82f6] to-[#8b5cf6]',
      dark: 'from-[#1E40AF] via-[#1E3A8A] to-[#0C1E3E]',
    },

    colors: {
      primary: '#3b82f6',    // Blue
      secondary: '#06b6d4',  // Cyan
      accent: '#8b5cf6',     // Purple
      text: '#e0f2fe',       // Light cyan
    },

    bubbles: {
      count: 15,
      color: 'bg-blue-300/40',
      icon: '🫧',
    },

    effects: {
      hasRays: true,
      hasParticles: true,
      hasWaves: true,
      particleType: 'bubbles',
    },
  },

  forest: {
    id: 'forest',
    name: 'Enchanted Forest',
    nameVietnamese: 'Rừng Thần Tiên',
    description: 'Lush, alive, and full of natural energy',
    descriptionVietnamese: 'Tươi tốt, sống động và tràn đầy năng lượng tự nhiên',

    gradients: {
      light: 'from-[#10b981] via-[#059669] to-[#047857]',
      dark: 'from-[#064e3b] via-[#065f46] to-[#022c22]',
    },

    colors: {
      primary: '#10b981',    // Emerald
      secondary: '#84cc16',  // Lime
      accent: '#22c55e',     // Green
      text: '#d1fae5',       // Light green
    },

    bubbles: {
      count: 20,
      color: 'bg-green-300/40',
      icon: '🍃',
    },

    effects: {
      hasRays: true,
      hasParticles: true,
      hasWaves: false,
      particleType: 'leaves',
    },
  },

  cosmos: {
    id: 'cosmos',
    name: 'Cosmic Space',
    nameVietnamese: 'Vũ Trụ',
    description: 'Infinite, mysterious, and full of possibilities',
    descriptionVietnamese: 'Vô tận, bí ẩn và đầy khả năng',

    gradients: {
      light: 'from-[#4c1d95] via-[#2e1065] to-[#0f172a]',
      dark: 'from-[#1e1b4b] via-[#020617] to-[#000000]',
    },

    colors: {
      primary: '#7c3aed',    // Violet
      secondary: '#a78bfa',  // Light purple
      accent: '#c4b5fd',     // Very light purple
      text: '#e9d5ff',       // Light violet
    },

    bubbles: {
      count: 40,
      color: 'bg-white/60',
      icon: '✨',
    },

    effects: {
      hasRays: true,
      hasParticles: true,
      hasWaves: false,
      particleType: 'stars',
    },
  },

  sky: {
    id: 'sky',
    name: 'Open Sky',
    nameVietnamese: 'Bầu Trời Rộng Lớn',
    description: 'Free, expansive, and limitless like the sky',
    descriptionVietnamese: 'Tự do, rộng lớn và vô tận như bầu trời',

    gradients: {
      light: 'from-[#38bdf8] via-[#7dd3fc] to-[#bae6fd]',
      dark: 'from-[#0c4a6e] via-[#075985] to-[#0369a1]',
    },

    colors: {
      primary: '#38bdf8',    // Sky blue
      secondary: '#7dd3fc',  // Light sky
      accent: '#f0f9ff',     // Very light blue
      text: '#f0f9ff',       // Very light blue
    },

    bubbles: {
      count: 12,
      color: 'bg-sky-200/40',
      icon: '☁️',
    },

    effects: {
      hasRays: true,
      hasParticles: true,
      hasWaves: false,
      particleType: 'clouds',
    },
  },
};

/**
 * Get theme configuration for an environment
 */
export function getEnvironmentTheme(environment: EnvironmentType): EnvironmentTheme {
  return ENVIRONMENT_THEMES[environment];
}

/**
 * Get theme configuration from MBTI type
 */
export function getThemeFromMBTI(mbtiType: string | null | undefined): EnvironmentTheme {
  const environment = getEnvironmentFromMBTI(mbtiType);
  return getEnvironmentTheme(environment);
}

// ============================================================================
// Ocean Level Mapping (for Ocean environment only)
// ============================================================================

export interface OceanLevelConfig {
  level: number;
  name: string;
  nameVietnamese: string;
  description: string;
  descriptionVietnamese: string;
  minBubbles: number;
  maxBubbles: number;
  requiredBubbles: number; // Bubbles needed to reach this level
  gradient: string;
  godRayOpacity: number;
}

export const OCEAN_LEVELS: OceanLevelConfig[] = [
  {
    level: 0,
    name: 'Surface - Sunlight',
    nameVietnamese: 'Mặt Nước - Ánh Sáng Mặt Trời',
    description: 'The beginning of your journey',
    descriptionVietnamese: 'Khởi đầu hành trình của bạn',
    minBubbles: 0,
    maxBubbles: 99,
    requiredBubbles: 0,
    gradient: 'from-[#06b6d4] via-[#3b82f6] to-[#8b5cf6]',
    godRayOpacity: 0.3,
  },
  {
    level: 1,
    name: 'Shallow Waters',
    nameVietnamese: 'Vùng Nước Nông',
    description: 'Taking your first steps',
    descriptionVietnamese: 'Những bước đi đầu tiên',
    minBubbles: 100,
    maxBubbles: 299,
    requiredBubbles: 100,
    gradient: 'from-[#2563EB] via-[#1E40AF] to-[#1E3A8A]',
    godRayOpacity: 0.25,
  },
  {
    level: 2,
    name: 'Coral Reef',
    nameVietnamese: 'Rạn San Hô',
    description: 'Discovering vibrant life',
    descriptionVietnamese: 'Khám phá sự sống rực rỡ',
    minBubbles: 300,
    maxBubbles: 599,
    requiredBubbles: 300,
    gradient: 'from-[#1E40AF] via-[#1E3A8A] to-[#0C1E3E]',
    godRayOpacity: 0.2,
  },
  {
    level: 3,
    name: 'Twilight Zone',
    nameVietnamese: 'Vùng Hoàng Hôn',
    description: 'Venturing deeper',
    descriptionVietnamese: 'Đi sâu hơn vào bóng tối',
    minBubbles: 600,
    maxBubbles: 999,
    requiredBubbles: 600,
    gradient: 'from-[#1E3A8A] via-[#0C1E3E] to-[#0A1628]',
    godRayOpacity: 0.15,
  },
  {
    level: 4,
    name: 'Deep Ocean',
    nameVietnamese: 'Đại Dương Sâu',
    description: 'Exploring the unknown',
    descriptionVietnamese: 'Khám phá điều chưa biết',
    minBubbles: 1000,
    maxBubbles: 1999,
    requiredBubbles: 1000,
    gradient: 'from-[#0C1E3E] via-[#0A1628] to-[#050A14]',
    godRayOpacity: 0.1,
  },
  {
    level: 5,
    name: 'Abyss',
    nameVietnamese: 'Vực Thẳm',
    description: 'Mastering the depths',
    descriptionVietnamese: 'Làm chủ độ sâu',
    minBubbles: 2000,
    maxBubbles: Infinity,
    requiredBubbles: 2000,
    gradient: 'from-[#0A1628] via-[#050A14] to-[#020408]',
    godRayOpacity: 0.05,
  },
];

/**
 * Get ocean level from bubble count
 */
export function getOceanLevelFromBubbles(bubbles: number): OceanLevelConfig {
  for (let i = OCEAN_LEVELS.length - 1; i >= 0; i--) {
    if (bubbles >= OCEAN_LEVELS[i].requiredBubbles) {
      return OCEAN_LEVELS[i];
    }
  }
  return OCEAN_LEVELS[0]; // Fallback to level 0
}

/**
 * Calculate progress to next ocean level
 */
export function getOceanLevelProgress(bubbles: number): {
  currentLevel: OceanLevelConfig;
  nextLevel: OceanLevelConfig | null;
  progress: number; // 0-100
  bubblesNeeded: number;
} {
  const currentLevel = getOceanLevelFromBubbles(bubbles);
  const currentLevelIndex = OCEAN_LEVELS.findIndex(l => l.level === currentLevel.level);
  const nextLevel = currentLevelIndex < OCEAN_LEVELS.length - 1
    ? OCEAN_LEVELS[currentLevelIndex + 1]
    : null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progress: 100,
      bubblesNeeded: 0,
    };
  }

  const bubblesIntoCurrentLevel = bubbles - currentLevel.requiredBubbles;
  const bubblesNeededForNextLevel = nextLevel.requiredBubbles - currentLevel.requiredBubbles;
  const progress = Math.min(100, Math.round((bubblesIntoCurrentLevel / bubblesNeededForNextLevel) * 100));

  return {
    currentLevel,
    nextLevel,
    progress,
    bubblesNeeded: nextLevel.requiredBubbles - bubbles,
  };
}

// ============================================================================
// Enhanced Environment Configuration for Animation
// ============================================================================

// Cấu hình màu sắc, animation cho từng môi trường (cho EnvironmentBackground component)
export const ENV_CONFIG = {
  ocean: {
    gradients: [
      'from-[#06b6d4] via-[#3b82f6] to-[#8b5cf6]',
      'from-[#2563EB] via-[#1E40AF] to-[#1E3A8A]',
      'from-[#1E40AF] via-[#1E3A8A] to-[#0C1E3E]',
      'from-[#1E3A8A] via-[#0C1E3E] to-[#0A1628]',
      'from-[#0C1E3E] via-[#0A1628] to-[#050A14]',
    ],
    particleColor: 'bg-blue-200/30',
    particleShape: 'rounded-full'
  },
  forest: {
    gradients: [
      'from-[#86efac] via-[#22c55e] to-[#14532d]',
      'from-[#4ade80] via-[#16a34a] to-[#064e3b]',
      'from-[#16a34a] via-[#15803d] to-[#022c22]',
      'from-[#14532d] via-[#064e3b] to-[#020617]',
      'from-[#052e16] via-[#020617] to-[#000000]',
    ],
    particleColor: 'bg-yellow-200/40',
    particleShape: 'rounded-full'
  },
  sky: {
    gradients: [
      'from-[#bae6fd] via-[#7dd3fc] to-[#38bdf8]',
      'from-[#7dd3fc] via-[#38bdf8] to-[#0ea5e9]',
      'from-[#38bdf8] via-[#0ea5e9] to-[#0284c7]',
      'from-[#818cf8] via-[#4f46e5] to-[#312e81]',
      'from-[#312e81] via-[#1e1b4b] to-[#0f172a]',
    ],
    particleColor: 'bg-white/40',
    particleShape: 'rounded-[40%]'
  },
  cosmos: {
    gradients: [
      'from-[#4c1d95] via-[#2e1065] to-[#0f172a]',
      'from-[#2e1065] via-[#1e1b4b] to-[#020617]',
      'from-[#312e81] via-[#0f172a] to-[#000000]',
      'from-[#1e1b4b] via-[#020617] to-[#000000]',
      'from-[#0f172a] via-[#000000] to-[#000000]',
    ],
    particleColor: 'bg-white/60',
    particleShape: 'rounded-full'
  }
};

// Cấu hình linh vật
export const MASCOT_CONFIG = {
  dolphin: { name: 'Misos Cá Heo', color: 'text-cyan-400' },
  owl: { name: 'Misos Cú Mèo', color: 'text-yellow-700' },
  cloud: { name: 'Misos Tinh Linh Mây', color: 'text-blue-300' },
  cat: { name: 'Misos Mèo Vũ Trụ', color: 'text-fuchsia-500' },
};
