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
import './Shell.css';

// ── Lazy-loaded modules ───────────────────────────────────────────────────
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
