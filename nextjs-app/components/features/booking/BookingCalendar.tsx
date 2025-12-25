'use client';

import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay, parse, set } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getMentorAvailability, getMentorBusySlots, createBooking } from '@/app/actions/booking-actions';
import { MentorAvailability } from '@/types/mentor';

interface BookingCalendarProps {
    mentorId: string;
    pricePerSession: number;
}

export function BookingCalendar({ mentorId, pricePerSession }: BookingCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [availabilities, setAvailabilities] = useState<MentorAvailability[]>([]);
    const [busySlots, setBusySlots] = useState<{ start: string; end: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingSlot, setBookingSlot] = useState<{ start: Date; end: Date } | null>(null);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Generate next 14 days
    const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [avail, busy] = await Promise.all([
                    getMentorAvailability(mentorId),
                    getMentorBusySlots(mentorId, days[0].toISOString(), days[days.length - 1].toISOString())
                ]);
                setAvailabilities(avail);
                setBusySlots(busy);
            } catch (err) {
                console.error(err);
                toast.error('Không thể tải lịch làm việc của chuyên gia.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [mentorId]);

    // Generate slots for selected Date
    const generateSlots = () => {
        if (!selectedDate) return [];

        const dayOfWeek = selectedDate.getDay(); // 0-6
        const rules = availabilities.filter(r => r.day_of_week === dayOfWeek && r.is_active);

        let slots: { start: Date; end: Date; available: boolean }[] = [];

        rules.forEach(rule => {
            // Parse times (HH:MM:SS)
            const [startH, startM] = rule.start_time.split(':').map(Number);
            const [endH, endM] = rule.end_time.split(':').map(Number);

            let current = set(selectedDate, { hours: startH, minutes: startM, seconds: 0, milliseconds: 0 });
            const end = set(selectedDate, { hours: endH, minutes: endM, seconds: 0 });

            // Create 1 hour slots (can be configurable)
            while (current.getTime() + 60 * 60 * 1000 <= end.getTime()) {
                const slotEnd = new Date(current.getTime() + 60 * 60 * 1000); // +1 hour

                // Check if busy
                const isBusy = busySlots.some(busy => {
                    const bStart = new Date(busy.start).getTime();
                    const bEnd = new Date(busy.end).getTime();
                    return (current.getTime() < bEnd && slotEnd.getTime() > bStart);
                });

                // Check if past
                const isPast = current.getTime() < new Date().getTime();

                slots.push({
                    start: new Date(current),
                    end: slotEnd,
                    available: !isBusy && !isPast
                });

                current = slotEnd; // Next slot
            }
        });

        return slots.sort((a, b) => a.start.getTime() - b.start.getTime());
    };

    const slots = generateSlots();

    const handleBook = async () => {
        if (!bookingSlot) return;
        setIsSubmitting(true);
        try {
            const result = await createBooking(
                mentorId,
                bookingSlot.start,
                bookingSlot.end,
                pricePerSession,
                notes
            );

            if (result.success) {
                toast.success(result.message);
                setIsDialogOpen(false);
                // Refresh busy slots
                const busy = await getMentorBusySlots(mentorId, days[0].toISOString(), days[days.length - 1].toISOString());
                setBusySlots(busy);
                setBookingSlot(null);
                setNotes('');
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi đặt lịch.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-[#2D3482]">
                    <CalendarIcon className="h-5 w-5" />
                    Lịch trống
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="h-40 flex items-center justify-center text-muted-foreground">Đang tải lịch...</div>
                ) : (
                    <div className="space-y-6">
                        {/* Day Selector */}
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x">
                            {days.map((day, i) => {
                                const isSelected = isSameDay(day, selectedDate);
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(day)}
                                        className={`
                      flex flex-col items-center justify-center min-w-[60px] p-2 rounded-xl transition-all snap-start
                      ${isSelected
                                                ? 'bg-[#2D3482] text-white shadow-md scale-105'
                                                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-100'}
                    `}
                                    >
                                        <span className="text-xs font-medium uppercase opacity-80">
                                            {format(day, 'EEE', { locale: vi })}
                                        </span>
                                        <span className="text-lg font-bold">
                                            {format(day, 'd')}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Slots Grid */}
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Giờ khả dụng ngày {format(selectedDate, 'dd/MM/yyyy')}
                            </h4>

                            {slots.length === 0 ? (
                                <div className="text-center py-8 text-sm text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                                    Không có lịch trống vào ngày này.
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-3">
                                    {slots.map((slot, idx) => (
                                        <Dialog open={isDialogOpen && bookingSlot === slot} onOpenChange={(open) => {
                                            if (!open) {
                                                setIsDialogOpen(false);
                                                setBookingSlot(null);
                                            } else {
                                                setBookingSlot(slot);
                                                setIsDialogOpen(true);
                                            }
                                        }} key={idx}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant={slot.available ? "outline" : "ghost"}
                                                    className={`
                              h-auto py-2 px-1 text-sm
                              ${slot.available
                                                            ? 'hover:border-[#2D3482] hover:text-[#2D3482] hover:bg-[#2D3482]/5'
                                                            : 'opacity-40 cursor-not-allowed bg-slate-100'}
                            `}
                                                    disabled={!slot.available}
                                                    onClick={() => {
                                                        if (slot.available) {
                                                            setBookingSlot(slot);
                                                            setIsDialogOpen(true);
                                                        }
                                                    }}
                                                >
                                                    {format(slot.start, 'HH:mm')}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Xác nhận đặt lịch</DialogTitle>
                                                    <DialogDescription>
                                                        Bạn đang đặt lịch hẹn với mentor vào lúc:
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="bg-slate-50 p-4 rounded-lg space-y-2 border">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">Thời gian:</span>
                                                        <span className="font-medium text-[#2D3482]">
                                                            {format(slot.start, 'HH:mm')} - {format(slot.end, 'HH:mm')}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-muted-foreground">Ngày:</span>
                                                        <span className="font-medium">
                                                            {format(slot.start, 'EEEE, dd/MM/yyyy', { locale: vi })}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between border-t pt-2 mt-2">
                                                        <span className="text-sm font-semibold">Chi phí:</span>
                                                        <span className="font-bold text-lg text-[#2D3482]">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pricePerSession)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mt-2">
                                                    <label className="text-sm font-medium">Ghi chú cho mentor (tùy chọn):</label>
                                                    <Textarea
                                                        placeholder="Bạn muốn tư vấn về vấn đề gì..."
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                    />
                                                </div>

                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Hủy</Button>
                                                    <Button onClick={handleBook} disabled={isSubmitting} className="bg-[#2D3482] text-white">
                                                        {isSubmitting ? (
                                                            <>Đang xử lý...</>
                                                        ) : (
                                                            <><CheckCircle2 className="mr-2 h-4 w-4" /> Xác nhận</>
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
