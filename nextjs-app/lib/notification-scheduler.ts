/**
 * Notification Scheduler
 * Handles scheduling of test reminders and daily check-in notifications
 * Default times: 7:30 AM and 9:00 PM (Vietnam time, GMT+7)
 */

import { notificationService, NotificationPayload } from '@/services/notification.service';

export interface NotificationSettings {
    enabled: boolean;
    morningTime: string; // HH:mm format
    eveningTime: string; // HH:mm format
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    enabled: true,
    morningTime: '07:30',
    eveningTime: '21:00',
};

const NOTIFICATION_STORAGE_KEY = 'misos-notification-settings';

/**
 * Get notification settings from localStorage
 */
export function getNotificationSettings(): NotificationSettings {
    if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS;

    const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (stored) {
        try {
            return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(stored) };
        } catch {
            return DEFAULT_NOTIFICATION_SETTINGS;
        }
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
}

/**
 * Save notification settings to localStorage
 */
export function saveNotificationSettings(settings: NotificationSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(settings));
}

/**
 * Parse time string to Date object for today
 */
function parseTimeToDate(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

/**
 * Calculate delay until next notification time
 */
export function getDelayUntilNextNotification(morningTime: string, eveningTime: string): number {
    const now = new Date();
    const morning = parseTimeToDate(morningTime);
    const evening = parseTimeToDate(eveningTime);

    // If morning time hasn't passed yet
    if (now < morning) {
        return morning.getTime() - now.getTime();
    }
    // If evening time hasn't passed yet
    if (now < evening) {
        return evening.getTime() - now.getTime();
    }
    // Otherwise, next morning (tomorrow)
    morning.setDate(morning.getDate() + 1);
    return morning.getTime() - now.getTime();
}

/**
 * Morning notification content
 */
const morningNotifications: NotificationPayload[] = [
    {
        title: '☀️ Chào buổi sáng!',
        body: 'Hãy bắt đầu ngày mới với một lần check-in nha!',
        icon: '/icons/icon-192x192.png',
        tag: 'morning-checkin',
        data: { url: '/dashboard' },
    },
    {
        title: '🌅 Ngày mới, cơ hội mới!',
        body: 'Đừng quên check-in tâm trạng hôm nay.',
        icon: '/icons/icon-192x192.png',
        tag: 'morning-checkin',
        data: { url: '/dashboard' },
    },
    {
        title: '💪 Sẵn sàng cho ngày mới chưa?',
        body: 'Vào app để bắt đầu hành trình hôm nay nhé!',
        icon: '/icons/icon-192x192.png',
        tag: 'morning-checkin',
        data: { url: '/dashboard' },
    },
];

/**
 * Evening notification content
 */
const eveningNotifications: NotificationPayload[] = [
    {
        title: '🌙 Buổi tối vui vẻ!',
        body: 'Bạn đã hoàn thành gợi ý hôm nay chưa?',
        icon: '/icons/icon-192x192.png',
        tag: 'evening-reminder',
        data: { url: '/dashboard' },
    },
    {
        title: '✨ Đừng quên streak của bạn!',
        body: 'Vào app để giữ chuỗi ngày liên tiếp nhé.',
        icon: '/icons/icon-192x192.png',
        tag: 'evening-reminder',
        data: { url: '/dashboard' },
    },
    {
        title: '🌿 Thư giãn cuối ngày',
        body: 'Ghé thăm Vườn Cảm Xúc để thư giãn nha!',
        icon: '/icons/icon-192x192.png',
        tag: 'evening-reminder',
        data: { url: '/sanctuary' },
    },
];

/**
 * Get a random notification from the pool
 */
function getRandomNotification(pool: NotificationPayload[]): NotificationPayload {
    return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Show a morning notification
 */
export async function showMorningNotification(): Promise<void> {
    const settings = getNotificationSettings();
    if (!settings.enabled) return;

    const notification = getRandomNotification(morningNotifications);
    await notificationService.showNotification(notification);
}

/**
 * Show an evening notification
 */
export async function showEveningNotification(): Promise<void> {
    const settings = getNotificationSettings();
    if (!settings.enabled) return;

    const notification = getRandomNotification(eveningNotifications);
    await notificationService.showNotification(notification);
}

/**
 * Schedule the next notification based on current time
 */
export function scheduleNextNotification(): NodeJS.Timeout | null {
    const settings = getNotificationSettings();
    if (!settings.enabled) return null;

    const delay = getDelayUntilNextNotification(settings.morningTime, settings.eveningTime);
    const now = new Date();
    const morning = parseTimeToDate(settings.morningTime);

    return setTimeout(async () => {
        // Determine if it's morning or evening notification
        if (now.getHours() < 12) {
            await showMorningNotification();
        } else {
            await showEveningNotification();
        }
        // Schedule next one
        scheduleNextNotification();
    }, delay);
}
