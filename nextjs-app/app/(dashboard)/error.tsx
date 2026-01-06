'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

/**
 * Next.js App Router Error Handler
 * Handles errors in route segments and provides recovery UI
 */
export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error
        console.error('Route error:', error)

        // TODO: Send to Sentry when configured
        // Sentry.captureException(error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Có gì đó không ổn
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Trang này đã gặp lỗi. Bạn có thể thử tải lại hoặc quay về trang chủ.
                </p>

                {process.env.NODE_ENV === 'development' && (
                    <details className="mb-6 text-left bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                            Chi tiết lỗi
                        </summary>
                        <pre className="mt-3 overflow-auto text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
                            {error.message}
                            {error.stack && `\n\n${error.stack}`}
                        </pre>
                        {error.digest && (
                            <p className="mt-2 text-gray-500 text-xs">
                                Error digest: {error.digest}
                            </p>
                        )}
                    </details>
                )}

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Thử lại
                    </button>

                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Trang chủ
                    </Link>
                </div>
            </div>
        </div>
    )
}
