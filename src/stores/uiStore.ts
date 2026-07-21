import { create } from 'zustand';

// ── Toast Type ────────────────────────────────────────────────────────────

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message?: string;
  duration?: number;
}

// ── UI State ──────────────────────────────────────────────────────────────

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  notificationDrawerOpen: boolean;
  aiCopilotOpen: boolean;
  toasts: Toast[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  setNotificationDrawerOpen: (open: boolean) => void;
  toggleNotificationDrawer: () => void;
  setAiCopilotOpen: (open: boolean) => void;
  toggleAiCopilot: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  notificationDrawerOpen: false,
  aiCopilotOpen: false,
  toasts: [],

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapse: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  collapseSidebar: () => set({ sidebarCollapsed: true }),
  expandSidebar: () => set({ sidebarCollapsed: false }),

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),

  setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),
  toggleNotificationDrawer: () => set((s) => ({ notificationDrawerOpen: !s.notificationDrawerOpen })),

  setAiCopilotOpen: (open) => set({ aiCopilotOpen: open }),
  toggleAiCopilot: () => set((s) => ({ aiCopilotOpen: !s.aiCopilotOpen })),

  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const duration = toast.duration ?? 4000;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id, duration }] }));
    if (duration > 0) {
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },

  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
