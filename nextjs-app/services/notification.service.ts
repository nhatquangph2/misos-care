import { BaseService } from './base.service';
import type { Json } from '@/types/database';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: Json;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export class NotificationService extends BaseService {
  private registration: ServiceWorkerRegistration | null = null;

  /**
   * Check if notifications are supported and permitted
   */
  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Check current notification permission
   */
  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Notifications are not supported in this browser');
    }

    return await Notification.requestPermission();
  }

  /**
   * Register service worker
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });

      this.registration = registration;
      await navigator.serviceWorker.ready;
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  /**
   * Get current service worker registration
   */
  async getRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (this.registration) return this.registration;
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null;

    try {
      this.registration = await navigator.serviceWorker.ready;
      return this.registration;
    } catch (error) {
      console.error('Error getting service worker registration:', error);
      return null;
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
    try {
      const registration = await this.getRegistration();
      if (!registration) throw new Error('Service Worker not registered');

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey) as unknown as BufferSource,
        });
      }
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push
   */
  async unsubscribeFromPush(): Promise<boolean> {
    try {
      const registration = await this.getRegistration();
      if (!registration) return false;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        return await subscription.unsubscribe();
      }
      return false;
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      return false;
    }
  }

  /**
   * Show a local notification
   */
  async showNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isSupported()) return;
    if (this.getPermission() !== 'granted') return;

    const registration = await this.getRegistration();
    const options = {
      body: payload.body,
      icon: payload.icon || '/icon-192x192.png',
      badge: payload.badge || '/badge-72x72.png',
      tag: payload.tag || 'notification',
      requireInteraction: payload.requireInteraction || false,
      data: payload.data || {},
      actions: payload.actions || [],
    };

    if (registration) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await registration.showNotification(payload.title, options as any);
    } else {
      // Fallback for browsers without service worker active but supported notifications
      // Remove 'actions' as it's not supported in standard Notification constructor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { actions: _actions, ...standardOptions } = options;
      new Notification(payload.title, standardOptions as NotificationOptions);
    }
  }

  /**
   * Schedule reminders (Mock scheduling)
   */
  async scheduleTestReminder(testType: string, testName: string, date: Date): Promise<void> {
    const now = new Date();
    const delay = date.getTime() - now.getTime();

    if (delay <= 0) {
      await this.showNotification({
        title: `Nhắc nhở: ${testName}`,
        body: `Đã đến lúc làm bài test ${testName}. Nhấn để bắt đầu!`,
        tag: `test-${testType}`,
        requireInteraction: true,
        data: { url: `/tests/${testType.toLowerCase()}` } as Json
      });
    } else {
      // For demonstration, we just log. Real production apps would use push notifications from server
      console.log(`Reminder for ${testName} scheduled in ${delay}ms`);
      setTimeout(() => {
        this.showNotification({
          title: `Nhắc nhở: ${testName}`,
          body: `Đã đến lúc làm bài test ${testName}. Nhấn để bắt đầu!`,
          tag: `test-${testType}`,
          requireInteraction: true,
          data: { url: `/tests/${testType.toLowerCase()}` } as Json
        });
      }, delay);
    }
  }

  async scheduleActionReminder(title: string, id: string): Promise<void> {
    await this.showNotification({
      title: 'Nhắc nhở hành động',
      body: `Đã đến lúc thực hiện: ${title}`,
      tag: `action-${id}`
    });
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    if (typeof window === 'undefined') return new Uint8Array();
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  hasPermission(): boolean {
    return this.isSupported() && this.getPermission() === 'granted';
  }
}

export const notificationService = new NotificationService();

export const isSupported = () => notificationService.isSupported();
export const requestPermission = () => notificationService.requestPermission();
export const subscribeToPush = (k: string) => notificationService.subscribeToPush(k);
export const unsubscribeFromPush = () => notificationService.unsubscribeFromPush();
export const showNotification = (p: NotificationPayload) => notificationService.showNotification(p);
export const scheduleTestReminder = (t: string, n: string, d: Date) => notificationService.scheduleTestReminder(t, n, d);
export const scheduleActionReminder = (t: string, i: string) => notificationService.scheduleActionReminder(t, i);
export const hasPermission = () => notificationService.hasPermission();
export const getPermission = () => notificationService.getPermission();
