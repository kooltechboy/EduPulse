import { create } from 'zustand';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  icon?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismiss: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    { id: '1', title: 'Welcome', body: 'Welcome to EduPulse', date: new Date().toISOString(), read: false }
  ],
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  dismiss: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  }))
}));
