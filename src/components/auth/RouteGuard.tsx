import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/stores/authStore';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, requiredRoles }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};
