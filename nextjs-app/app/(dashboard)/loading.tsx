/**
 * Dashboard Loading State
 * Automatically shown during navigation and data fetching
 */

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg"
            >
              <div className="space-y-3">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          {/* Tabs Skeleton */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0"
              />
            ))}
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
              >
                <div className="space-y-4">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Miso Character */}
        <div className="fixed bottom-8 right-8 z-50">
          <div className="relative">
            <div className="h-24 w-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 bg-white dark:bg-gray-800 rounded-full animate-ping opacity-75" />
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2 animate-pulse">
            Đang tải...
          </p>
        </div>
      </div>
    </div>
  );
}
