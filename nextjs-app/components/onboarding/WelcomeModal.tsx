"use client"

import { useState, useEffect } from "react"
import { Check, Play } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/hooks/useLocalStorage"

interface WelcomeModalProps {
    onStartTour?: () => void
}

export function WelcomeModal({ onStartTour }: WelcomeModalProps) {
    // Using a custom hook or direct localStorage
    // for simplicity here we assume the hook exists or we implement logic
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem("misos-welcome-seen")
        if (!hasSeenWelcome) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsOpen(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem("misos-welcome-seen", "true")
    }

    const handleStartTour = () => {
        handleClose()
        onStartTour?.()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white text-center">
                    <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <span className="text-3xl">🐬</span>
                    </div>
                    <DialogTitle className="text-2xl font-bold mb-2 text-white">Chào mừng đến MisosCare!</DialogTitle>
                    <DialogDescription className="text-blue-100 max-w-md mx-auto">
                        Nền tảng trắc nghiệm tính cách và sức khỏe tinh thần hàng đầu, giúp bạn khám phá bản thân mỗi ngày.
                    </DialogDescription>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                Tại sao chọn MisosCare?
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <Check className="h-3 w-3" />
                                    </span>
                                    Hoàn toàn miễn phí 100%
                                </li>
                                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <Check className="h-3 w-3" />
                                    </span>
                                    7+ bài test khoa học chuẩn quốc tế
                                </li>
                                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <Check className="h-3 w-3" />
                                    </span>
                                    Bảo mật tuyệt đối & Ẩn danh
                                </li>
                            </ul>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center text-center space-y-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                <Play className="h-6 w-6 ml-1" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Xem video giới thiệu</p>
                                <p className="text-xs text-muted-foreground">(Coming soon)</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <Button variant="outline" onClick={handleClose}>
                            Tôi tự khám phá
                        </Button>
                        <Button onClick={handleStartTour} className="bg-blue-600 hover:bg-blue-700">
                            Hướng dẫn nhanh (2 phút)
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
