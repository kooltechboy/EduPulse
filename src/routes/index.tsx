import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// ── Lazy-loaded modules ───────────────────────────────────────────────────

const LoginScreen = React.lazy(() => import('@/components/auth/LoginScreen').then(m => ({ default: m.LoginScreen })));
const AppShell = React.lazy(() => import('@/components/shell/AppShell').then(m => ({ default: m.AppShell })));
const RouteGuard = React.lazy(() => import('@/components/auth/RouteGuard').then(m => ({ default: m.RouteGuard })));
const DashboardRouter = React.lazy(() => import('@/components/dashboard/DashboardRouter').then(m => ({ default: m.DashboardRouter })));

// SIS
const StudentList = React.lazy(() => import('@/components/sis/students/StudentList').then(m => ({ default: m.StudentList })));
const StaffList = React.lazy(() => import('@/components/sis/staff/StaffList').then(m => ({ default: m.StaffList })));
const TeacherList = React.lazy(() => import('@/components/sis/teachers/TeacherList').then(m => ({ default: m.TeacherList })));

// Classroom / Schedule / Teacher Tools
const CourseList = React.lazy(() => import('@/components/classroom/CourseList').then(m => ({ default: m.CourseList })));
const Timetable = React.lazy(() => import('@/components/schedule/Timetable').then(m => ({ default: m.Timetable })));
const AttendanceMarking = React.lazy(() => import('@/components/teacher/AttendanceMarking').then(m => ({ default: m.AttendanceMarking })));
const Gradebook = React.lazy(() => import('@/components/teacher/Gradebook').then(m => ({ default: m.Gradebook })));

// Operations
const AdmissionsPipeline = React.lazy(() => import('@/components/admissions/AdmissionsPipeline').then(m => ({ default: m.AdmissionsPipeline })));
const FinanceView = React.lazy(() => import('@/components/finance/FinanceView').then(m => ({ default: m.FinanceView })));
const MessagingHub = React.lazy(() => import('@/components/communication/MessagingHub').then(m => ({ default: m.MessagingHub })));
const HRHub = React.lazy(() => import('@/components/hr/HRHub').then(m => ({ default: m.HRHub })));
const BehaviorMatrix = React.lazy(() => import('@/components/behavior/BehaviorMatrix').then(m => ({ default: m.BehaviorMatrix })));

// Support
const MedicalClinic = React.lazy(() => import('@/components/health/MedicalClinic').then(m => ({ default: m.MedicalClinic })));
const CampusEvents = React.lazy(() => import('@/components/campus/CampusEvents').then(m => ({ default: m.CampusEvents })));
const InventoryHub = React.lazy(() => import('@/components/inventory/InventoryHub').then(m => ({ default: m.InventoryHub })));
const DigitalLibrary = React.lazy(() => import('@/components/library/DigitalLibrary').then(m => ({ default: m.DigitalLibrary })));
const FleetManager = React.lazy(() => import('@/components/transport/FleetManager').then(m => ({ default: m.FleetManager })));
const CounselingView = React.lazy(() => import('@/components/counseling/CounselingView').then(m => ({ default: m.CounselingView })));
const CafeteriaView = React.lazy(() => import('@/components/cafeteria/CafeteriaView').then(m => ({ default: m.CafeteriaView })));
const SecurityDashboard = React.lazy(() => import('@/components/admin/SecurityDashboard').then(m => ({ default: m.SecurityDashboard })));
const CoordinationView = React.lazy(() => import('@/components/coordination/CoordinationView').then(m => ({ default: m.CoordinationView })));

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
