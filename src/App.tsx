import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout.tsx';
import AdminView from '@/components/Dashboard/AdminView.tsx';
import TeacherView from '@/components/Dashboard/TeacherView.tsx';
import StudentView from '@/components/Dashboard/StudentView.tsx';
import ParentView from '@/components/Dashboard/ParentView.tsx';
import Timetable from '@/components/Schedule/Timetable.tsx';
import StudentTable from '@/components/SIS/StudentTable.tsx';
import StaffDirectory from '@/components/SIS/StaffDirectory.tsx';
import CoordinationView from '@/components/Coordination/CoordinationView.tsx';
import CounselingView from '@/components/Counseling/CounselingView.tsx';
import FinanceView from '@/components/Finance/FinanceView.tsx';
import AttendanceMarking from '@/components/Teacher/AttendanceMarking.tsx';
import Gradebook from '@/components/Teacher/Gradebook.tsx';
import SecurityDashboard from '@/components/Admin/SecurityDashboard.tsx';
import ClassroomManager from '@/components/Classroom/ClassroomManager.tsx';
import InventoryHub from '@/components/Inventory/InventoryHub.tsx';
import DigitalLibrary from '@/components/Library/DigitalLibrary.tsx';
import FleetManager from '@/components/Transport/FleetManager.tsx';
import CampusEvents from '@/components/Campus/CampusEvents.tsx';
import CanteenView from '@/components/Campus/CanteenView.tsx';
import HRHub from '@/components/HR/HRHub.tsx';
import AdmissionsPipeline from '@/components/Admissions/AdmissionsPipeline.tsx';
import BehaviorMatrix from '@/components/Behavior/BehaviorMatrix.tsx';
import MedicalClinic from '@/components/Health/MedicalClinic.tsx';
import MessagingHub from '@/components/Communication/MessagingHub.tsx';
import { User, UserRole } from '@/types';
import { Settings, Sparkles, Key, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';

const MOCK_USERS: Record<UserRole, User> = {
  [UserRole.ADMIN]: { id: 'ADM001', name: 'Principal Anderson', email: 'admin@edupulse.edu', role: UserRole.ADMIN },
  [UserRole.TEACHER]: { id: 'TCH001', name: 'Professor Mitchell', email: 'mitchell@edupulse.edu', role: UserRole.TEACHER },
  [UserRole.STUDENT]: { id: 'STU001', name: 'Alex Thompson', email: 'alex@edupulse.edu', role: UserRole.STUDENT },
  [UserRole.PARENT]: { id: 'PAR001', name: 'Mrs. Thompson', email: 'parent@edupulse.edu', role: UserRole.PARENT },
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(MOCK_USERS[UserRole.ADMIN]);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        if ((window as any).aistudio) {
          const selected = await (window as any).aistudio.hasSelectedApiKey();
          setHasApiKey(selected);
        }
      } catch (e) {
        console.error("Institutional auth check failed", e);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    } catch (e) {
      console.error("Key node selection failed", e);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white max-w-lg w-full p-12 rounded-2xl shadow-xl border border-slate-200 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full mx-auto flex items-center justify-center mb-6">
            <Key className="text-blue-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Institutional Authenticator</h2>
          <p className="text-slate-500 mb-8 font-medium">
            Please verify your credentials to access the EduPulse network.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full primary-button py-3 flex items-center justify-center gap-2"
          >
            Authenticate Access <ShieldCheck size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50 to-blue-50/50 pointer-events-none"></div>

        <div className="bg-white max-w-md w-full p-10 rounded-3xl shadow-xl border border-slate-100 relative z-10 m-4">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
              <GraduationCap className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">EduPulse</h1>
            <p className="text-slate-500 font-medium text-sm">Academic Management Suite</p>
          </div>

          <div className="space-y-4">
            <button onClick={() => setUser(MOCK_USERS[UserRole.ADMIN])} className="w-full group relative overflow-hidden bg-slate-900 text-white py-4 rounded-xl font-semibold transition-all hover:shadow-lg active:scale-[0.98]">
              <span className="relative z-10 flex items-center justify-center gap-2">Principal Entry <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setUser(MOCK_USERS[UserRole.TEACHER])} className="secondary-button py-3 text-sm">Faculty Portal</button>
              <button onClick={() => setUser(MOCK_USERS[UserRole.STUDENT])} className="secondary-button py-3 text-sm">Student Portal</button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">© 2024 EduPulse Academic Systems</p>
          </div>
        </div>
      </div>
    );
  }

  const DashboardComponent = () => {
    switch (user.role) {
      case UserRole.ADMIN: return <AdminView />;
      case UserRole.TEACHER: return <TeacherView />;
      case UserRole.STUDENT: return <StudentView />;
      case UserRole.PARENT: return <ParentView />;
      default: return <AdminView />;
    }
  };

  return (
    <Layout user={user} onLogout={() => setUser(null)}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Core Dashboards */}
        <Route path="/dashboard" element={<DashboardComponent />} />
        <Route path="/messages" element={<MessagingHub user={user} />} />

        {/* Modules */}
        <Route path="/classes" element={<ClassroomManager user={user} />} />
        <Route path="/courses" element={<ClassroomManager user={user} />} />
        <Route path="/students" element={<StudentTable />} />
        <Route path="/staff" element={<StaffDirectory />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/schedule" element={<Timetable />} />
        <Route path="/admissions" element={<AdmissionsPipeline />} />
        <Route path="/behavior" element={<BehaviorMatrix />} />
        <Route path="/health" element={<MedicalClinic />} />
        <Route path="/hr" element={<HRHub />} />
        <Route path="/finance" element={<FinanceView />} />
        <Route path="/inventory" element={<InventoryHub />} />
        <Route path="/coordination" element={<CoordinationView />} />
        <Route path="/library" element={<DigitalLibrary />} />
        <Route path="/transport" element={<FleetManager />} />
        <Route path="/events" element={<CampusEvents />} />
        <Route path="/canteen" element={<CanteenView />} />
        <Route path="/counseling" element={<CounselingView />} />
        <Route path="/security" element={<SecurityDashboard />} />
        <Route path="/settings" element={<SecurityDashboard />} />

        <Route path="/attendance" element={<AttendanceMarking />} />
        <Route path="/grades" element={<Gradebook />} />

        {/* Fallback */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">🚧</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Module Under Maintenance</h2>
            <p className="text-slate-500 max-w-md mx-auto">This academic module is currently being optimized for the new semester standards.</p>
          </div>
        } />
      </Routes>

      {/* Role Switcher - Dev Tool */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setShowRoleSwitcher(!showRoleSwitcher)} className="p-3 bg-white border border-slate-200 shadow-lg rounded-full text-slate-600 hover:text-blue-600 transition-colors">
          <Settings size={20} />
        </button>
        {showRoleSwitcher && (
          <div className="absolute bottom-14 right-0 w-64 bg-white border border-slate-200 shadow-xl p-2 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 px-3 pt-2 tracking-wider">Role Preview</p>
            <div className="space-y-1">
              {Object.values(UserRole).map((role) => (
                <button key={role} onClick={() => { setUser(MOCK_USERS[role]); setShowRoleSwitcher(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${user.role === role ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'}`}>
                  {role.charAt(0) + role.slice(1).toLowerCase()} Portal
                  {user.role === role && <Sparkles size={12} className="text-blue-500" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
