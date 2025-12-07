// Notification Service - Handle push notifications and local notifications

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export class NotificationService {
  private static instance: NotificationService;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
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

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Register service worker
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Workers are not supported in this browser');
    }

    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });

      console.log('Service Worker registered:', registration);
      this.registration = registration;

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  /**
   * Get current service worker registration
   */
  async getRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (this.registration) return this.registration;

    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.ready;
        return this.registration;
      } catch (error) {
        console.error('Error getting service worker registration:', error);
        return null;
      }
    }

    return null;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
    try {
      const registration = await this.getRegistration();
      if (!registration) {
        throw new Error('Service Worker not registered');
      }

      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Subscribe to push
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
        });
      }

      return subscription;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPush(): Promise<boolean> {
    try {
      const registration = await this.getRegistration();
      if (!registration) return false;

      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        return true;
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
    if (!this.isSupported()) {
      throw new Error('Notifications are not supported');
    }

    if (this.getPermission() !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    const registration = await this.getRegistration();

    if (registration) {
      // Use service worker to show notification
      const options: any = {
        body: payload.body,
        icon: payload.icon || '/icon-192x192.png',
        badge: payload.badge || '/badge-72x72.png',
        tag: payload.tag || 'notification',
        requireInteraction: payload.requireInteraction || false,
        data: payload.data || {},
        actions: payload.actions || [],
      };
      await registration.showNotification(payload.title, options);
    } else {
      // Fallback to browser notification
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icon-192x192.png',
        tag: payload.tag || 'notification',
        requireInteraction: payload.requireInteraction || false,
        data: payload.data || {},
      });
    }
  }

  /**
   * Schedule a test reminder notification
   */
  async scheduleTestReminder(testType: string, testName: string, reminderDate: Date): Promise<void> {
    // For now, we'll show a notification immediately
    // In production, you'd want to set up a scheduled job on the backend
    await this.showNotification({
      title: `Nhắc nhở: ${testName}`,
      body: `Đã đến lúc làm bài test ${testName}. Nhấn để bắt đầu!`,
      icon: '/icon-192x192.png',
      tag: `test-reminder-${testType}`,
      requireInteraction: true,
      data: {
        type: 'test-reminder',
        testType,
        url: `/tests/${testType.toLowerCase()}`,
      },
      actions: [
        { action: 'start', title: 'Bắt đầu ngay' },
        { action: 'later', title: 'Nhắc lại sau' },
      ],
    });
  }

  /**
   * Schedule an action plan reminder
   */
  async scheduleActionReminder(actionTitle: string, actionId: string): Promise<void> {
    await this.showNotification({
      title: 'Nhắc nhở hành động',
      body: `Đã đến lúc thực hiện: ${actionTitle}`,
      icon: '/icon-192x192.png',
      tag: `action-reminder-${actionId}`,
      requireInteraction: false,
      data: {
        type: 'action-reminder',
        actionId,
        url: '/profile',
      },
    });
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  /**
   * Check if user has granted notification permission
   */
  hasPermission(): boolean {
    return this.isSupported() && this.getPermission() === 'granted';
  }
}

export const notificationService = NotificationService.getInstance();
