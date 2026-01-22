import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, ROUTE_PERMISSIONS } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { ShieldX, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: UserRole[];
}

/**
 * ProtectedRoute - Wraps routes that require authentication and/or specific roles
 * 
 * Usage:
 * <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
 *   <FinanceView />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
    const { user, isLoading, isAuthenticated, hasPermission } = useAuth();
    const location = useLocation();

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Verifying credentials...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Determine required roles from route or props
    const rolesNeeded = requiredRoles || ROUTE_PERMISSIONS[location.pathname] || [];

    // Check if user has required role
    if (rolesNeeded.length > 0 && !hasPermission(rolesNeeded)) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center max-w-md p-12">
                    <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShieldX className="w-12 h-12 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Access Restricted</h2>
                    <p className="text-slate-500 mb-8">
                        Your role ({user?.role}) doesn't have permission to access this resource.
                        Required: {rolesNeeded.join(' or ')}.
                    </p>
                    <a
                        href="/dashboard"
                        className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-colors"
                    >
                        Return to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
