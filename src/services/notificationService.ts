/* ============================================================================
   EDUVERSE OS — Browser & Web Push Notification Service
   ============================================================================ */

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  tag?: string;
}

/**
 * Register the Service Worker in production/PWA mode
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.log('[EDUVERSE PWA] Service Worker registered:', registration.scope);
      return registration;
    } catch (error) {
      console.warn('[EDUVERSE PWA] Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
}

/**
 * Check if Notification permission is granted
 */
export function getNotificationPermissionStatus(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request notification permissions from the user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('[Notifications] Browser does not support Web Notifications.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('[Notifications] Permission request error:', error);
    return false;
  }
}

/**
 * Trigger a local browser notification or system alert
 */
export async function sendLocalNotification(payload: NotificationPayload): Promise<boolean> {
  if (!('Notification' in window)) return false;

  if (Notification.permission !== 'granted') {
    const granted = await requestNotificationPermission();
    if (!granted) return false;
  }

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/favicon.ico',
        tag: payload.tag || 'ep-general',
        data: { url: payload.url || '/dashboard' }
      });
      return true;
    } else {
      // Fallback native notification
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/favicon.ico',
        tag: payload.tag || 'ep-general'
      });
      return true;
    }
  } catch (error) {
    console.error('[Notifications] Trigger failed:', error);
    return false;
  }
}
