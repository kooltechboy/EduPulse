import React, { useState } from 'react';
import Layout from './components/Layout.tsx';
import AdminView from './components/Dashboard/AdminView.tsx';
import TeacherView from './components/Dashboard/TeacherView.tsx';
import StudentView from './components/Dashboard/StudentView.tsx';
import ParentView from './components/Dashboard/ParentView.tsx';
import Timetable from './components/Schedule/Timetable.tsx';
import StudentTable from './components/SIS/StudentTable.tsx';
import StaffDirectory from './components/SIS/StaffDirectory.tsx';
import CoordinationView from './components/Coordination/CoordinationView.tsx';
import CounselingView from './components/Counseling/CounselingView.tsx';
import FinanceView from './components/Finance/FinanceView.tsx';
import AttendanceMarking from './components/Teacher/AttendanceMarking.tsx';
import Gradebook from './components/Teacher/Gradebook.tsx';
import SecurityDashboard from './components/Admin/SecurityDashboard.tsx';
import ClassroomManager from './components/Classroom/ClassroomManager.tsx';
import InventoryHub from './components/Inventory/InventoryHub.tsx';
import DigitalLibrary from './components/Library/DigitalLibrary.tsx';
import FleetManager from './components/Transport/FleetManager.tsx';
import CampusEvents from './components/Campus/CampusEvents.tsx';
import CanteenView from './components/Campus/CanteenView.tsx';
import HRHub from './components/HR/HRHub.tsx';
import { User, UserRole } from './types.ts';
import { Settings, Sparkles, ChevronRight } from 'lucide-react';

const MOCK_USERS: Record<UserRole, User> = {
  [UserRole.ADMIN]: { id: 'ADM001', name: 'Principal Anderson', email: 'admin@edupulse.edu', role: UserRole.ADMIN },
  [UserRole.TEACHER]: { id: 'TCH001', name: 'Professor Mitchell', email: 'mitchell@edupulse.edu', role: UserRole.TEACHER },
  [UserRole.STUDENT]: { id: 'STU001', name: 'Alex Thompson', email: 'alex@edupulse.edu', role: UserRole.STUDENT },
  [UserRole.PARENT]: { id: 'PAR001', name: 'Mrs. Thompson', email: 'parent@edupulse.edu', role: UserRole.PARENT },
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(MOCK_USERS[UserRole.ADMIN]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const renderContent = () => {
    // LMS & Academic Core
    if (activeTab === 'classes' || activeTab === 'courses') {
      return user ? <ClassroomManager user={user} /> : null;
    }
    if (activeTab === 'students') return <StudentTable />;
    if (activeTab === 'staff') return <StaffDirectory />;
    if (activeTab === 'timetable' || activeTab === 'schedule') return <Timetable />;
    
    // Administrative Infrastructure
    if (activeTab === 'hr') return <HRHub />;
    if (activeTab === 'finance') return <FinanceView />;
    if (activeTab === 'inventory') return <InventoryHub />;

    // Institutional Operations
    if (activeTab === 'coordination') return <CoordinationView />;
    if (activeTab === 'library') return <DigitalLibrary />;
    if (activeTab === 'transport') return <FleetManager />;
    if (activeTab === 'events') return <CampusEvents />;
    if (activeTab === 'canteen') return <CanteenView />;

    // Safety & Wellness
    if (activeTab === 'counseling') return <CounselingView />;
    if (activeTab === 'security') return <SecurityDashboard />;

    // Teacher-Specific Workflows
    if (user?.role === UserRole.TEACHER) {
      if (activeTab === 'attendance') return <AttendanceMarking />;
      if (activeTab === 'grades') return <Gradebook />;
    }

    // Role-Based Dashboards
    if (activeTab === 'dashboard') {
      switch (user?.role) {
        case UserRole.ADMIN: return <AdminView />;
        case UserRole.TEACHER: return <TeacherView />;
        case UserRole.STUDENT: return <StudentView />;
        case UserRole.PARENT: return <ParentView />;
      }
    }

    return (
      <div className="flex flex-col items-center justify-center py-40 text-slate-400">
        <div className="bg-white p-16 rounded-full shadow-inner mb-10 text-8xl transform hover:rotate-12 transition-transform">🚧</div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Institutional Synchronization</h2>
        <p className="max-w-md text-center font-bold text-slate-500 leading-relaxed italic">
          The hub <span className="text-blue-600 font-black">"{activeTab}"</span> is currently being optimized for global campus standards.
        </p>
        <button onClick={() => setActiveTab('dashboard')} className="mt-12 px-10 py-4 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all">Return to Command</button>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-900 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
        </div>
        <div className="glass-card max-w-lg w-full p-12 md:p-20 rounded-[64px] text-center shadow-2xl relative z-10 border border-white/20">
          <div className="w-28 h-28 bg-white rounded-[40px] mx-auto flex items-center justify-center mb-12 shadow-2xl text-6xl transform -rotate-12 hover:rotate-0 transition-transform cursor-pointer">🎓</div>
          <h1 className="text-5xl font-black text-slate-900 mb-3 tracking-tighter">EduPulse</h1>
          <p className="text-slate-500 mb-16 font-bold uppercase tracking-[0.5em] text-[11px] opacity-70">Unified Digital Campus 2026</p>
          <div className="space-y-5">
            <button onClick={() => setUser(MOCK_USERS[UserRole.ADMIN])} className="w-full bg-slate-900 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-slate-800 transition-all active:scale-95">Principal Entry</button>
            <button onClick={() => setUser(MOCK_USERS[UserRole.TEACHER])} className="w-full bg-white text-slate-900 py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.4em] shadow-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">Faculty Portal</button>
            <div className="grid grid-cols-2 gap-5">
              <button onClick={() => setUser(MOCK_USERS[UserRole.STUDENT])} className="bg-blue-600 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">Learner</button>
              <button onClick={() => setUser(MOCK_USERS[UserRole.PARENT])} className="bg-indigo-600 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">Guardian</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => { setUser(null); setActiveTab('dashboard'); }}>
      <div className="relative min-h-[calc(100vh-160px)]">
        <button onClick={() => setShowRoleSwitcher(!showRoleSwitcher)} className="fixed bottom-10 right-10 bg-white/90 backdrop-blur-md shadow-2xl border border-white/50 p-5 rounded-[32px] text-slate-700 hover:text-blue-600 transition-all z-[200] group">
          <Settings className={`transition-transform duration-1000 ${showRoleSwitcher ? 'rotate-180' : 'group-hover:rotate-45'}`} size={28} />
        </button>
        {showRoleSwitcher && (
          <div className="fixed bottom-32 right-10 glass-card p-8 rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] z-[200] border-blue-100/50 w-80 animate-in slide-in-from-bottom-20 fade-in duration-300">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-6 px-2 tracking-[0.3em] opacity-60">Prototype Workspace</p>
            <div className="flex flex-col gap-3">
              {Object.values(UserRole).map((role) => (
                <button key={role} onClick={() => { setUser(MOCK_USERS[role]); setActiveTab('dashboard'); setShowRoleSwitcher(false); }} className={`text-left px-7 py-5 rounded-[24px] text-sm font-black transition-all flex items-center justify-between group ${user.role === role ? 'bg-slate-900 text-white shadow-2xl' : 'hover:bg-blue-50 text-slate-600'}`}>
                  {role.charAt(0) + role.slice(1).toLowerCase()} Portal
                  <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${user.role === role ? 'text-blue-400' : 'text-slate-400'}`} />
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="max-w-[1400px] mx-auto pb-24">{renderContent()}</div>
      </div>
    </Layout>
  );
};

export default App;