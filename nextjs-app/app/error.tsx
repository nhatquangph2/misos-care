'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-muted/40 p-4 text-center">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Đã có lỗi xảy ra!</h2>
            <p className="max-w-[500px] text-muted-foreground">
                Chúng tôi rất tiếc vì sự bất tiện này. Miso đã ghi nhận lỗi và sẽ cố gắng khắc phục sớm nhất.
            </p>
            <div className="flex gap-2">
                <Button onClick={() => window.location.href = '/'}>
                    Về trang chủ
                </Button>
                <Button variant="outline" onClick={() => reset()}>
                    Thử lại
                </Button>
            </div>
        </div>
    )
}
