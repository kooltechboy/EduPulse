import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore, DEMO_USERS } from '../authStore';

describe('authStore', () => {
  beforeEach(async () => {
    await useAuthStore.getState().logout();
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
    const initialTheme = useAuthStore.getState().theme;
    useAuthStore.getState().toggleTheme();
    expect(useAuthStore.getState().theme).not.toBe(initialTheme);
  });

  it('should handle demo mode login with matching credentials', async () => {
    const success = await useAuthStore.getState().loginWithSupabase('sarah.mitchell@edupulse.edu', 'password123');
    expect(success).toBe(true);
    expect(useAuthStore.getState().user?.role).toBe('admin');
  });

  it('should handle demo mode signup', async () => {
    const success = await useAuthStore.getState().signUpWithSupabase('newstudent@edupulse.edu', 'secret', 'New Student', 'student');
    expect(success).toBe(true);
    expect(useAuthStore.getState().user?.name).toBe('New Student');
    expect(useAuthStore.getState().user?.role).toBe('student');
  });

  it('should clear user session on logout', async () => {
    useAuthStore.getState().switchRole('student');
    expect(useAuthStore.getState().user).not.toBeNull();

    await useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
  });
});
