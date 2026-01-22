import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, UserRole, MOCK_USERS } from '@/types';

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
    hasPermission: (requiredRoles: UserRole[]) => boolean;
    // Dev mode: switch roles without auth
    switchRole: (role: UserRole) => void;
    isDevMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role-based route permissions
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
    // Admin only
    '/finance': [UserRole.ADMIN],
    '/hr': [UserRole.ADMIN],
    '/security': [UserRole.ADMIN],
    '/admissions': [UserRole.ADMIN],
    '/settings': [UserRole.ADMIN],
    '/inventory': [UserRole.ADMIN],

    // Admin & Teacher
    '/students': [UserRole.ADMIN, UserRole.TEACHER],
    '/staff': [UserRole.ADMIN, UserRole.TEACHER],
    '/behavior': [UserRole.ADMIN, UserRole.TEACHER],
    '/health': [UserRole.ADMIN],
    '/coordination': [UserRole.ADMIN, UserRole.TEACHER],
    '/attendance': [UserRole.ADMIN, UserRole.TEACHER],
    '/grades': [UserRole.ADMIN, UserRole.TEACHER],
    '/lms-center': [UserRole.ADMIN, UserRole.TEACHER],

    // All authenticated users
    '/dashboard': [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
    '/messages': [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
    '/classes': [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    '/classroom': [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    '/courses': [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    '/timetable': [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    '/schedule': [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    '/library': [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    '/events': [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
    '/canteen': [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
    '/transport': [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
    '/counseling': [UserRole.ADMIN, UserRole.TEACHER],

    // AI Features
    '/immersive-studio': [UserRole.ADMIN, UserRole.TEACHER],
    '/trajectory-matrix': [UserRole.ADMIN, UserRole.TEACHER],
    '/live-tutor': [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Dev mode uses mock users; production uses Supabase auth
    const isDevMode = import.meta.env.DEV || !import.meta.env.VITE_SUPABASE_URL;

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (isDevMode) {
                // Dev mode: default to Admin
                setUser(MOCK_USERS[UserRole.ADMIN]);
                setIsLoading(false);
                return;
            }

            // Production: check Supabase session
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                // Fetch user profile with role from database
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    setUser({
                        id: profile.id,
                        name: profile.name,
                        email: profile.email,
                        role: profile.role as UserRole,
                        avatar: profile.avatar
                    });
                }
            }

            setIsLoading(false);
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
            } else if (event === 'SIGNED_IN' && session?.user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    setUser({
                        id: profile.id,
                        name: profile.name,
                        email: profile.email,
                        role: profile.role as UserRole,
                        avatar: profile.avatar
                    });
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [isDevMode]);

    const login = async (email: string, password: string): Promise<{ error: string | null }> => {
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) return { error: error.message };
            return { error: null };
        } catch (err) {
            return { error: 'Authentication failed' };
        }
    };

    const logout = async () => {
        if (isDevMode) {
            setUser(null);
            return;
        }
        await supabase.auth.signOut();
        setUser(null);
    };

    const switchRole = (role: UserRole) => {
        if (isDevMode) {
            setUser(MOCK_USERS[role]);
        }
    };

    const hasPermission = (requiredRoles: UserRole[]): boolean => {
        if (!user) return false;
        return requiredRoles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{
            user,
            role: user?.role || null,
            isLoading,
            isAuthenticated: !!user,
            login,
            logout,
            hasPermission,
            switchRole,
            isDevMode
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
