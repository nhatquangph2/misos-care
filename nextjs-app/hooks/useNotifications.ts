'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationService, NotificationPayload } from '@/services/notification.service';

export function useNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    const supported = notificationService.isSupported();
    setIsSupported(supported);

    if (supported) {
      setPermission(notificationService.getPermission());
      checkRegistration();
    }
  }, []);

  // Check if service worker is registered
  const checkRegistration = async () => {
    try {
      const registration = await notificationService.getRegistration();
      setIsRegistered(!!registration);

      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
    } catch (err) {
      console.error('Error checking registration:', err);
    }
  };

  // Request permission
  const requestPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const newPermission = await notificationService.requestPermission();
      setPermission(newPermission);

      if (newPermission === 'granted') {
        // Register service worker
        await notificationService.registerServiceWorker();
        setIsRegistered(true);
      }

      return newPermission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request permission';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async (vapidPublicKey: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isRegistered) {
        await notificationService.registerServiceWorker();
        setIsRegistered(true);
      }

      const subscription = await notificationService.subscribeToPush(vapidPublicKey);
      setIsSubscribed(!!subscription);

      return subscription;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isRegistered]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const success = await notificationService.unsubscribeFromPush();
      if (success) {
        setIsSubscribed(false);
      }

      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Show notification
  const showNotification = useCallback(async (payload: NotificationPayload) => {
    try {
      setError(null);

      if (permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      await notificationService.showNotification(payload);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to show notification';
      setError(errorMessage);
      throw err;
    }
  }, [permission]);

  // Schedule test reminder
  const scheduleTestReminder = useCallback(async (
    testType: string,
    testName: string,
    reminderDate: Date
  ) => {
    try {
      setError(null);

      if (permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      await notificationService.scheduleTestReminder(testType, testName, reminderDate);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule reminder';
      setError(errorMessage);
      throw err;
    }
  }, [permission]);

  // Schedule action reminder
  const scheduleActionReminder = useCallback(async (
    actionTitle: string,
    actionId: string
  ) => {
    try {
      setError(null);

      if (permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      await notificationService.scheduleActionReminder(actionTitle, actionId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule reminder';
      setError(errorMessage);
      throw err;
    }
  }, [permission]);

  return {
    isSupported,
    permission,
    isRegistered,
    isSubscribed,
    isLoading,
    error,
    hasPermission: permission === 'granted',
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
    scheduleTestReminder,
    scheduleActionReminder,
  };
}
