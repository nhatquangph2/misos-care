"use client"

import React from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface FeatureHighlightProps {
    children: React.ReactNode
    content: string
    highlight?: boolean
}

export function FeatureHighlight({
    children,
    content,
    highlight = true,
}: FeatureHighlightProps) {
    if (!highlight) return <>{children}</>

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <div className="relative inline-block">
                        {children}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                            }}
                            className="absolute -right-2 -top-2 z-10"
                        >
                            <div className="relative h-4 w-4">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex h-4 w-4 rounded-full bg-blue-500 items-center justify-center">
                                    <Sparkles className="h-2.5 w-2.5 text-white" />
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    align="center"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none shadow-xl"
                >
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        <span className="font-medium">{content}</span>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
