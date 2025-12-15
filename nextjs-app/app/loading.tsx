/**
 * Root Loading State
 * Shown during initial page loads and navigation
 */

import { FloatingMiso } from '@/components/MisoCharacter';

export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="text-center space-y-6">
        {/* Miso Loading Animation */}
        <FloatingMiso emotion="happy" size="xl" />

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Miso đang chuẩn bị...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Vui lòng đợi một chút nhé! 🌊
          </p>
        </div>

        {/* Animated Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-3 w-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-3 w-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-3 w-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
