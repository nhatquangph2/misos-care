"use client"

import { Play } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function VideoDemo() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600 -z-10 bg-[linear-gradient(to_right,#4f46e5,#06b6d4)] opacity-90" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 -z-10" />

            <div className="container px-4 md:px-6 mx-auto text-center text-white">
                <h2 className="text-3xl font-bold tracking-tight mb-6 sm:text-4xl">
                    Sẵn sàng để khám phá bản thân?
                </h2>
                <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                    Xem video demo ngắn để hiểu cách MisosCare giúp bạn thấu hiểu chính mình và cải thiện sức khỏe tinh thần.
                </p>

                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-white transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2"
                >
                    <span className="absolute inset-0 h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                    <Play className="relative ml-1 h-8 w-8 text-blue-600 fill-current" />
                </button>

                <p className="mt-6 text-sm font-medium text-blue-100 opacity-80">
                    Xem Demo (1:30)
                </p>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none aspect-video">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                            title="MisosCare Demo"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    )
}
