import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '@/services/supabaseClient';

// ── Types ─────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'coordinator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  tenantId?: string;
}

interface AuthState {
  user: User | null;
  theme: 'dark' | 'light';
  isLoading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  toggleTheme: () => void;
  loginWithSupabase: (email: string, password: string) => Promise<boolean>;
  signUpWithSupabase: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  initializeAuthListener: () => void;
}

// ── Demo Users ────────────────────────────────────────────────────────────

export const DEMO_USERS: Record<UserRole, User> = {
  admin: {
    id: 'usr_admin_001',
    name: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@edupulse.edu',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    tenantId: 'tenant_demo_001',
  },
  teacher: {
    id: 'usr_teacher_001',
    name: 'Prof. James Chen',
    email: 'james.chen@edupulse.edu',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    tenantId: 'tenant_demo_001',
  },
  student: {
    id: 'usr_student_001',
    name: 'Aiden Thompson',
    email: 'aiden.thompson@edupulse.edu',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden',
    tenantId: 'tenant_demo_001',
  },
  parent: {
    id: 'usr_parent_001',
    name: 'Maria Thompson',
    email: 'maria.thompson@email.com',
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    tenantId: 'tenant_demo_001',
  },
  coordinator: {
    id: 'usr_coord_001',
    name: 'Dr. Elena Rodriguez',
    email: 'elena.rodriguez@edupulse.edu',
    role: 'coordinator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    tenantId: 'tenant_demo_001',
  },
};

// ── Store ─────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      theme: 'dark',
      isLoading: false,
      error: null,

      login: (user: User) => set({ user, error: null }),

      logout: async () => {
        if (isSupabaseConfigured) {
          try {
            await supabase.auth.signOut();
          } catch (err) {
            console.error('Supabase signout error:', err);
          }
        }
        set({ user: null, error: null });
      },

      switchRole: (role: UserRole) => {
        const demoUser = DEMO_USERS[role];
        set({ user: demoUser, error: null });
      },

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      loginWithSupabase: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        if (!isSupabaseConfigured) {
          // Fallback demo mode login if Supabase credentials are not configured
          const matchedRole = (Object.keys(DEMO_USERS) as UserRole[]).find(
            (r) => DEMO_USERS[r].email.toLowerCase() === email.toLowerCase()
          ) || 'admin';
          const demoUser = DEMO_USERS[matchedRole];
          set({ user: demoUser, isLoading: false });
          return true;
        }

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            // Fetch associated profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            const appUser: User = {
              id: data.user.id,
              name: profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0],
              email: data.user.email || email,
              role: (profile?.role as UserRole) || 'student',
              avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
              tenantId: profile?.tenant_id,
            };

            set({ user: appUser, isLoading: false });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch (err: any) {
          console.error('Supabase login error:', err);
          set({ error: err.message || 'Login failed', isLoading: false });
          return false;
        }
      },

      signUpWithSupabase: async (email: string, password: string, name: string, role: UserRole) => {
        set({ isLoading: true, error: null });
        if (!isSupabaseConfigured) {
          const newUser: User = {
            id: `usr_${Date.now()}`,
            name,
            email,
            role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          };
          set({ user: newUser, isLoading: false });
          return true;
        }

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
                role: role,
              },
            },
          });

          if (error) throw error;

          if (data.user) {
            const appUser: User = {
              id: data.user.id,
              name,
              email,
              role,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            };
            set({ user: appUser, isLoading: false });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch (err: any) {
          console.error('Supabase signup error:', err);
          set({ error: err.message || 'Sign up failed', isLoading: false });
          return false;
        }
      },

      initializeAuthListener: () => {
        if (!isSupabaseConfigured) return;

        supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const appUser: User = {
              id: session.user.id,
              name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: (profile?.role as UserRole) || 'student',
              avatar: profile?.avatar_url,
              tenantId: profile?.tenant_id,
            };
            set({ user: appUser });
          } else if (event === 'SIGNED_OUT') {
            set({ user: null });
          }
        });
      },
    }),
    {
      name: 'edupulse-auth',
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
      }),
    }
  )
);
