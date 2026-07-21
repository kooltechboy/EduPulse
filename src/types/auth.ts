export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'coordinator';

export interface Permission {
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: Permission[];
  lastLogin?: string;
  isActive: boolean;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: string;
}
