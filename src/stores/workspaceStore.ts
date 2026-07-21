import { create } from 'zustand';

export interface WorkspaceTab {
  id: string; // The URL path (e.g. '/students', '/dashboard')
  label: string;
  iconName: string;
  closable: boolean;
}

interface WorkspaceState {
  tabs: WorkspaceTab[];
  activeTabId: string;
  openTab: (id: string, label: string, iconName: string, closable?: boolean) => void;
  closeTab: (id: string) => void;
  setActiveTabId: (id: string) => void;
  clearTabs: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  tabs: [
    { id: '/dashboard', label: 'Dashboard', iconName: 'LayoutDashboard', closable: false }
  ],
  activeTabId: '/dashboard',

  openTab: (id, label, iconName, closable = true) => {
    const { tabs } = get();
    const exists = tabs.some((t) => t.id === id);

    if (!exists) {
      set({
        tabs: [...tabs, { id, label, iconName, closable }],
        activeTabId: id,
      });
    } else {
      set({ activeTabId: id });
    }
  },

  closeTab: (id) => {
    const { tabs, activeTabId } = get();
    if (id === '/dashboard') return; // Cannot close dashboard

    const filtered = tabs.filter((t) => t.id !== id);
    let nextActiveId = activeTabId;

    if (activeTabId === id) {
      const closedIndex = tabs.findIndex((t) => t.id === id);
      const prevTab = tabs[closedIndex - 1];
      const nextTab = tabs[closedIndex + 1];
      nextActiveId = prevTab ? prevTab.id : (nextTab ? nextTab.id : '/dashboard');
    }

    set({
      tabs: filtered,
      activeTabId: nextActiveId,
    });
  },

  setActiveTabId: (id) => set({ activeTabId: id }),

  clearTabs: () => set({
    tabs: [{ id: '/dashboard', label: 'Dashboard', iconName: 'LayoutDashboard', closable: false }],
    activeTabId: '/dashboard'
  })
}));
