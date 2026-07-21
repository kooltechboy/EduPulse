import React, { Suspense, lazy } from 'react';
import { useAuthStore } from '@/stores/authStore';

const AdminDashboard = lazy(() => import('./admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const TeacherDashboard = lazy(() => import('./teacher/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const StudentDashboard = lazy(() => import('./student/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const ParentDashboard = lazy(() => import('./parent/ParentDashboard').then(m => ({ default: m.ParentDashboard })));
const CoordinatorDashboard = lazy(() => import('./coordinator/CoordinatorDashboard').then(m => ({ default: m.CoordinatorDashboard })));

const LoadingFallback = () => (
  <div className="ep-flex ep-justify-center ep-align-center ep-p-10">
    <div className="ep-text-muted">Loading dashboard...</div>
  </div>
);

export const DashboardRouter: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <Suspense fallback={<LoadingFallback />}>
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'teacher' && <TeacherDashboard />}
      {user.role === 'student' && <StudentDashboard />}
      {user.role === 'parent' && <ParentDashboard />}
      {user.role === 'coordinator' && <CoordinatorDashboard />}
    </Suspense>
  );
};
