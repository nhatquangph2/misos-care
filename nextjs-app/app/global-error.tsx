'use client'

import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface GlobalErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

/**
 * Next.js App Router Global Error Handler
 * Handles errors in the root layout and provides recovery
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
                    <div className="text-center max-w-lg">
                        <div className="w-20 h-20 mx-auto mb-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Đã xảy ra lỗi nghiêm trọng
                        </h1>

                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Xin lỗi, ứng dụng đã gặp lỗi không mong muốn.
                            Vui lòng thử tải lại trang hoặc quay về trang chủ.
                        </p>

                        {error.digest && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                                Mã lỗi: {error.digest}
                            </p>
                        )}

                        <div className="flex gap-4 justify-center flex-wrap">
                            <button
                                onClick={reset}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Thử lại
                            </button>

                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                <Home className="w-5 h-5" />
                                Trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}
