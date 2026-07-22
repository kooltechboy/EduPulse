import React, { Suspense, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, NAV_CONFIG } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { NotificationDrawer } from './NotificationDrawer';
import { AICopilotModal } from './AICopilotModal';
import { useUIStore } from '@/stores/uiStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { TabBar } from './TabBar';
import { lazyWithRetry } from '@/utils/lazyWithRetry';
import './Shell.css';

// ── Resilient Lazy-loaded modules with chunk error recovery ───────────────────
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

const MODULE_MAP: Record<string, React.ElementType> = {
  '/dashboard': DashboardRouter,
  '/students': StudentList,
  '/staff': StaffList,
  '/teachers': TeacherList,
  '/classroom': CourseList,
  '/schedule': Timetable,
  '/attendance': AttendanceMarking,
  '/gradebook': Gradebook,
  '/admissions': AdmissionsPipeline,
  '/finance': FinanceView,
  '/communication': MessagingHub,
  '/hr': HRHub,
  '/behavior': BehaviorMatrix,
  '/health': MedicalClinic,
  '/events': CampusEvents,
  '/inventory': InventoryHub,
  '/library': DigitalLibrary,
  '/transport': FleetManager,
  '/counseling': CounselingView,
  '/cafeteria': CafeteriaView,
  '/security': SecurityDashboard,
  '/coordination': CoordinationView,
};

function LoadingFallback() {
  return (
    <div className="ep-route-loading">
      <div className="ep-route-loading__spinner" />
      <p className="ep-route-loading__text">Loading module...</p>
    </div>
  );
}

export const AppShell: React.FC = () => {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const { tabs, activeTabId, openTab } = useWorkspaceStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync URL to tabs if user navigates directly (e.g. typing URL or initial load)
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // Exact root matching
    const matchingKey = Object.keys(MODULE_MAP).find(k => path.startsWith(k));
    
    if (matchingKey) {
      const existingTab = tabs.find(t => t.id === matchingKey); // Use matchingKey as base ID for the tab
      if (!existingTab) {
         let label = 'Module';
         let icon = 'LayoutDashboard';
         for (const section of NAV_CONFIG) {
           const item = section.items.find(i => matchingKey.startsWith(i.path));
           if (item) {
             label = item.label;
             icon = item.icon;
             break;
           }
         }
         openTab(matchingKey, label, icon, matchingKey !== '/dashboard');
      } else if (activeTabId !== matchingKey) {
         useWorkspaceStore.getState().setActiveTabId(matchingKey);
      }
    }
  }, [location.pathname]);

  return (
    <div className="ep-shell">
      <Sidebar />
      <div className={`ep-shell__main${sidebarCollapsed ? ' ep-shell__main--collapsed' : ''}`}>
        <Header />
        <TabBar />
        <main className="ep-shell__content">
          {tabs.map(tab => {
            const moduleKey = Object.keys(MODULE_MAP).find(k => tab.id.startsWith(k)) || '/dashboard';
            const Component = MODULE_MAP[moduleKey];
            const isActive = tab.id === activeTabId;
            
            return (
              <div 
                key={tab.id} 
                className="ep-shell__tab-pane"
                style={{ 
                  display: isActive ? 'block' : 'none', 
                  width: '100%'
                }}
              >
                <Suspense fallback={<LoadingFallback />}>
                  {Component ? <Component /> : <div>Module not found</div>}
                </Suspense>
              </div>
            );
          })}
        </main>
      </div>
      <CommandPalette />
      <NotificationDrawer />
      <AICopilotModal />
    </div>
  );
};
