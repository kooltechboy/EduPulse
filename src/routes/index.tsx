import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { lazyWithRetry } from '@/utils/lazyWithRetry';

// ── Resilient Lazy-loaded modules with auto-reload retry on deployment updates ──────

const LoginScreen = lazyWithRetry(() => import('@/components/auth/LoginScreen'), 'LoginScreen');
const AppShell = lazyWithRetry(() => import('@/components/shell/AppShell'), 'AppShell');
const RouteGuard = lazyWithRetry(() => import('@/components/auth/RouteGuard'), 'RouteGuard');
const DashboardRouter = lazyWithRetry(() => import('@/components/dashboard/DashboardRouter'), 'DashboardRouter');

// SIS
const StudentList = lazyWithRetry(() => import('@/components/sis/students/StudentList'), 'StudentList');
const StaffList = lazyWithRetry(() => import('@/components/sis/staff/StaffList'), 'StaffList');
const TeacherList = lazyWithRetry(() => import('@/components/sis/teachers/TeacherList'), 'TeacherList');

// Classroom / Schedule / Teacher Tools
const CourseList = lazyWithRetry(() => import('@/components/classroom/CourseList'), 'CourseList');
const Timetable = lazyWithRetry(() => import('@/components/schedule/Timetable'), 'Timetable');
const AttendanceMarking = lazyWithRetry(() => import('@/components/teacher/AttendanceMarking'), 'AttendanceMarking');
const Gradebook = lazyWithRetry(() => import('@/components/teacher/Gradebook'), 'Gradebook');

// Operations
const AdmissionsPipeline = lazyWithRetry(() => import('@/components/admissions/AdmissionsPipeline'), 'AdmissionsPipeline');
const FinanceView = lazyWithRetry(() => import('@/components/finance/FinanceView'), 'FinanceView');
const MessagingHub = lazyWithRetry(() => import('@/components/communication/MessagingHub'), 'MessagingHub');
const HRHub = lazyWithRetry(() => import('@/components/hr/HRHub'), 'HRHub');
const BehaviorMatrix = lazyWithRetry(() => import('@/components/behavior/BehaviorMatrix'), 'BehaviorMatrix');

// Support
const MedicalClinic = lazyWithRetry(() => import('@/components/health/MedicalClinic'), 'MedicalClinic');
const CampusEvents = lazyWithRetry(() => import('@/components/campus/CampusEvents'), 'CampusEvents');
const InventoryHub = lazyWithRetry(() => import('@/components/inventory/InventoryHub'), 'InventoryHub');
const DigitalLibrary = lazyWithRetry(() => import('@/components/library/DigitalLibrary'), 'DigitalLibrary');
const FleetManager = lazyWithRetry(() => import('@/components/transport/FleetManager'), 'FleetManager');
const CounselingView = lazyWithRetry(() => import('@/components/counseling/CounselingView'), 'CounselingView');
const CafeteriaView = lazyWithRetry(() => import('@/components/cafeteria/CafeteriaView'), 'CafeteriaView');
const SecurityDashboard = lazyWithRetry(() => import('@/components/admin/SecurityDashboard'), 'SecurityDashboard');
const CoordinationView = lazyWithRetry(() => import('@/components/coordination/CoordinationView'), 'CoordinationView');

// ── Loading Fallback ──────────────────────────────────────────────────────

function LoadingFallback() {
  return (
    <div className="ep-route-loading">
      <div className="ep-route-loading__spinner" />
      <p className="ep-route-loading__text">Loading module...</p>
    </div>
  );
}

// ── Routes ────────────────────────────────────────────────────────────────

export function AppRoutes() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <ErrorBoundary moduleName="Auth">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="*" element={<LoginScreen />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary moduleName="Application Shell">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<RouteGuard><AppShell /></RouteGuard>}>
            <Route path="/dashboard" element={<ErrorBoundary moduleName="Dashboard"><DashboardRouter /></ErrorBoundary>} />
            <Route path="/students" element={<ErrorBoundary moduleName="Student Information"><StudentList /></ErrorBoundary>} />
            <Route path="/staff" element={<ErrorBoundary moduleName="Staff Directory"><StaffList /></ErrorBoundary>} />
            <Route path="/teachers" element={<ErrorBoundary moduleName="Teacher Directory"><TeacherList /></ErrorBoundary>} />
            <Route path="/classroom" element={<ErrorBoundary moduleName="Classroom LMS"><CourseList /></ErrorBoundary>} />
            <Route path="/schedule" element={<ErrorBoundary moduleName="Timetable"><Timetable /></ErrorBoundary>} />
            <Route path="/attendance" element={<ErrorBoundary moduleName="Attendance"><AttendanceMarking /></ErrorBoundary>} />
            <Route path="/gradebook" element={<ErrorBoundary moduleName="Gradebook"><Gradebook /></ErrorBoundary>} />
            <Route path="/admissions" element={<ErrorBoundary moduleName="Admissions"><AdmissionsPipeline /></ErrorBoundary>} />
            <Route path="/finance" element={<ErrorBoundary moduleName="Finance"><FinanceView /></ErrorBoundary>} />
            <Route path="/communication" element={<ErrorBoundary moduleName="Communication Hub"><MessagingHub /></ErrorBoundary>} />
            <Route path="/hr" element={<ErrorBoundary moduleName="HR Management"><HRHub /></ErrorBoundary>} />
            <Route path="/behavior" element={<ErrorBoundary moduleName="Behavior Matrix"><BehaviorMatrix /></ErrorBoundary>} />
            <Route path="/health" element={<ErrorBoundary moduleName="Medical Clinic"><MedicalClinic /></ErrorBoundary>} />
            <Route path="/events" element={<ErrorBoundary moduleName="Campus Events"><CampusEvents /></ErrorBoundary>} />
            <Route path="/inventory" element={<ErrorBoundary moduleName="Inventory"><InventoryHub /></ErrorBoundary>} />
            <Route path="/library" element={<ErrorBoundary moduleName="Digital Library"><DigitalLibrary /></ErrorBoundary>} />
            <Route path="/transport" element={<ErrorBoundary moduleName="Fleet Transport"><FleetManager /></ErrorBoundary>} />
            <Route path="/counseling" element={<ErrorBoundary moduleName="Counseling"><CounselingView /></ErrorBoundary>} />
            <Route path="/cafeteria" element={<ErrorBoundary moduleName="Cafeteria"><CafeteriaView /></ErrorBoundary>} />
            <Route path="/security" element={<ErrorBoundary moduleName="Security & Safety"><SecurityDashboard /></ErrorBoundary>} />
            <Route path="/coordination" element={<ErrorBoundary moduleName="Coordination"><CoordinationView /></ErrorBoundary>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
