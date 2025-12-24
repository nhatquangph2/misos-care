"use client"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface Step {
    id: string
    label: string
    status: "completed" | "current" | "upcoming"
}

interface ProgressTrackerProps {
    steps: Step[]
}

export function ProgressTracker({ steps }: ProgressTrackerProps) {
    return (
        <nav aria-label="Progress">
            <ol role="list" className="overflow-hidden bg-background/50 backdrop-blur-sm rounded-full border shadow-sm">
                <div className="flex">
                    {steps.map((step, stepIdx) => (
                        <li key={step.id} className="relative flex-1">
                            {stepIdx !== steps.length - 1 ? (
                                <div
                                    className="absolute right-0 top-0 hidden h-full w-5 md:block"
                                    aria-hidden="true"
                                >
                                    <svg
                                        className="h-full w-full text-border"
                                        viewBox="0 0 22 80"
                                        fill="none"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d="M0 -2L20 40L0 82"
                                            vectorEffect="non-scaling-stroke"
                                            stroke="currentcolor"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            ) : null}
                            <div className="group flex h-full items-center px-6 py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
                                <span className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                                            step.status === "completed"
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : step.status === "current"
                                                    ? "border-primary text-primary"
                                                    : "border-muted-foreground text-muted-foreground"
                                        )}
                                    >
                                        {step.status === "completed" ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <span>{stepIdx + 1}</span>
                                        )}
                                    </span>
                                    <span
                                        className={cn(
                                            "hidden sm:block",
                                            step.status === "completed" || step.status === "current"
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {step.label}
                                    </span>
                                </span>
                            </div>
                        </li>
                    ))}
                </div>
            </ol>
        </nav>
    )
}
