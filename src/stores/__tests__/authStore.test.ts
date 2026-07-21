import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore, DEMO_USERS } from '../authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('should initialize with null user', () => {
    const user = useAuthStore.getState().user;
    expect(user).toBeNull();
  });

  it('should switch role to admin correctly', () => {
    useAuthStore.getState().switchRole('admin');
    const user = useAuthStore.getState().user;
    expect(user).not.toBeNull();
    expect(user?.role).toBe('admin');
    expect(user?.name).toBe(DEMO_USERS.admin.name);
  });

  it('should switch role to teacher correctly', () => {
    useAuthStore.getState().switchRole('teacher');
    const user = useAuthStore.getState().user;
    expect(user?.role).toBe('teacher');
  });

  it('should toggle theme from dark to light', () => {
    expect(useAuthStore.getState().theme).toBe('dark');
    useAuthStore.getState().toggleTheme();
    expect(useAuthStore.getState().theme).toBe('light');
  });
});
