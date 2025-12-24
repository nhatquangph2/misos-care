'use client'

import React, { useState } from 'react'
import { addDays, format, isSameDay, startOfToday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BookingCalendarProps {
    onSelectSlot: (date: Date, time: string) => void;
    selectedDate?: Date;
    selectedTime?: string;
}

const TIME_SLOTS = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "19:00", "20:00"
]

export function BookingCalendar({ onSelectSlot, selectedDate, selectedTime }: BookingCalendarProps) {
    const [startDate, setStartDate] = useState(startOfToday())

    // Generate 7 days
    const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i))

    const handlePrev = () => {
        const newDate = addDays(startDate, -7)
        if (newDate >= startOfToday()) {
            setStartDate(newDate)
        }
    }

    const handleNext = () => setStartDate(addDays(startDate, 7))

    return (
        <div className="space-y-6">
            {/* Date Navigation */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">
                    {format(startDate, "'Tháng' MM, yyyy", { locale: vi })}
                </h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrev} disabled={startDate <= startOfToday()}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNext}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2 text-center">
                {days.map((date, i) => {
                    const isSelected = selectedDate && isSameDay(date, selectedDate)
                    return (
                        <div key={i} className="flex flex-col gap-2">
                            <span className="text-xs text-muted-foreground uppercase">
                                {format(date, 'eee', { locale: vi })}
                            </span>
                            <button
                                onClick={() => onSelectSlot(date, '')} // Reset time when changing date
                                className={cn(
                                    "h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center text-sm font-medium transition-all mx-auto",
                                    isSelected
                                        ? "bg-blue-600 text-white shadow-md scale-110"
                                        : "hover:bg-muted bg-card border"
                                )}
                            >
                                {format(date, 'd')}
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Time Slots */}
            {selectedDate && (
                <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="flex items-center gap-2 mb-4 mt-6">
                        <Clock className="text-blue-600 h-5 w-5" />
                        <span className="font-semibold">
                            Giờ trống ngày {format(selectedDate, "dd/MM", { locale: vi })}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {TIME_SLOTS.map((time) => {
                            const isActive = selectedTime === time
                            return (
                                <Button
                                    key={time}
                                    variant={isActive ? "default" : "outline"}
                                    className={cn(
                                        isActive ? "bg-blue-600 hover:bg-blue-700" : "hover:border-blue-300",
                                        "w-full"
                                    )}
                                    onClick={() => onSelectSlot(selectedDate, time)}
                                >
                                    {time}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
