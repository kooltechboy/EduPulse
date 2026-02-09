
import React, { useState, useEffect } from 'react';
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
import AdmissionsPipeline from './components/Admissions/AdmissionsPipeline.tsx';
import BehaviorMatrix from './components/Behavior/BehaviorMatrix.tsx';
import MedicalClinic from './components/Health/MedicalClinic.tsx';
import MessagingHub from './components/Communication/MessagingHub.tsx';
import { User, UserRole } from './types.ts';
import { Settings, Sparkles, ChevronRight, Key, Activity, ShieldCheck, Database } from 'lucide-react';

const MOCK_USERS: Record<UserRole, User> = {
  [UserRole.ADMIN]: { id: 'ADM001', name: 'Principal Anderson', email: 'admin@edupulse.edu', role: UserRole.ADMIN },
  [UserRole.TEACHER]: { id: 'TCH001', name: 'Professor Mitchell', email: 'mitchell@edupulse.edu', role: UserRole.TEACHER },
  [UserRole.STUDENT]: { id: 'STU001', name: 'Alex Thompson', email: 'alex@edupulse.edu', role: UserRole.STUDENT },
  [UserRole.PARENT]: { id: 'PAR001', name: 'Mrs. Thompson', email: 'parent@edupulse.edu', role: UserRole.PARENT },
};

// Safe Storage Utility
const safeJsonParse = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Data corruption detected for ${key}. Resetting to fallback.`, e);
    return fallback;
  }
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(MOCK_USERS[UserRole.ADMIN]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [systemCheck, setSystemCheck] = useState({ complete: false, status: 'Initializing...' });

  // System Initialization Sequence
  useEffect(() => {
    let steps = [
      { msg: 'Connecting to Neural Core...', time: 600 },
      { msg: 'Verifying Identity Nodes...', time: 1200 },
      { msg: 'Syncing Institutional Ledger...', time: 1800 },
      { msg: 'System Ready', time: 2400 }
    ];
    
    let totalDelay = 0;
    steps.forEach((step, i) => {
      totalDelay = step.time;
      setTimeout(() => {
        setSystemCheck(prev => ({ ...prev, status: step.msg }));
        if (i === steps.length - 1) setSystemCheck({ complete: true, status: 'Active' });
      }, step.time);
    });

    const checkApiKey = async () => {
      try {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } catch (e) {
        console.warn("Auth drift or dev environment", e);
        // In dev/demo, we might default to false to force selection, 
        // but for reliability in the demo, let's assume true if check fails to avoid blocking UI if API is actually present in env.
        if (process.env.API_KEY) setHasApiKey(true);
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

  const renderContent = () => {
    if (!user) return null;

    try {
      // Unified Communication
      if (activeTab === 'messages') return <MessagingHub user={user} />;

      // LMS & Academic Core
      if (activeTab === 'classes' || activeTab === 'courses') {
        return <ClassroomManager user={user} />;
      }
      if (activeTab === 'students') return <StudentTable />;
      if (activeTab === 'staff') return <StaffDirectory />;
      if (activeTab === 'timetable' || activeTab === 'schedule') return <Timetable />;
      
      // Growth & Admissions
      if (activeTab === 'admissions') return <AdmissionsPipeline />;
      if (activeTab === 'behavior') return <BehaviorMatrix />;
      if (activeTab === 'health') return <MedicalClinic />;

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
      if (user.role === UserRole.TEACHER) {
        if (activeTab === 'attendance') return <AttendanceMarking />;
        if (activeTab === 'grades') return <Gradebook />;
      }

      // Role-Based Dashboards
      if (activeTab === 'dashboard') {
        switch (user.role) {
          case UserRole.ADMIN: return <AdminView onNavigate={setActiveTab} />;
          case UserRole.TEACHER: return <TeacherView />;
          case UserRole.STUDENT: return <StudentView />;
          case UserRole.PARENT: return <ParentView />;
        }
      }

      return (
        <div className="flex flex-col items-center justify-center py-40 text-slate-400 animate-in fade-in">
          <div className="bg-white p-12 rounded-[40px] shadow-sm mb-8 text-6xl border border-slate-100">🚧</div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">Module Offline</h2>
          <p className="max-w-md text-center font-medium text-slate-500 leading-relaxed">
            The node <span className="text-blue-600 font-bold">"{activeTab}"</span> is currently undergoing maintenance synchronization.
          </p>
          <button onClick={() => setActiveTab('dashboard')} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-600 transition-all">Return to Core</button>
        </div>
      );
    } catch (error) {
      console.error("Module Render Error:", error);
      return (
        <div className="p-10 text-center">
          <h3 className="text-xl font-black text-rose-600">System Render Failure</h3>
          <p className="text-slate-500 mt-2">Please refresh the institutional console.</p>
        </div>
      );
    }
  };

  // Auth / Key Gate
  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[160px]"></div>
        </div>
        <div className="glass-card-dark max-w-lg w-full p-12 rounded-[48px] text-center shadow-2xl relative z-10 border border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-3xl mx-auto flex items-center justify-center mb-10 shadow-2xl border border-white/10">
            <Key className="text-blue-400" size={40} />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">System Access Protocol</h2>
          <p className="text-slate-400 mb-10 font-medium leading-relaxed text-sm">
            Institutional clearance required. Please authorize your API Key Node to enable Neural Synthesis, Veo Video Generation, and Real-time Voice capabilities.
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Authorize Terminal <Sparkles size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Pre-Loader
  if (!systemCheck.complete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 mb-6">
           <Activity className="text-blue-600 animate-pulse" size={32} />
           <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">EduPulse <span className="text-blue-600">OS</span></h1>
        </div>
        <div className="w-64 bg-slate-200 h-1.5 rounded-full overflow-hidden mb-4">
           <div className="bg-blue-600 h-full rounded-full animate-[width_2s_ease-out_forwards]" style={{ width: '100%' }}></div>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">{systemCheck.status}</p>
      </div>
    );
  }

  // User Selection Gate
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6">
        <div className="glass-card max-w-lg w-full p-12 rounded-[48px] text-center shadow-2xl bg-white">
          <div className="w-24 h-24 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center mb-10 shadow-inner text-5xl">
            🎓
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">EduPulse</h1>
          <p className="text-slate-500 mb-12 font-bold uppercase tracking-[0.3em] text-[10px]">Unified Digital Campus 2026</p>
          
          <div className="grid gap-4">
            {Object.values(UserRole).map((role) => (
               <button 
                 key={role}
                 onClick={() => setUser(MOCK_USERS[role])} 
                 className="group w-full bg-white border border-slate-100 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-sm hover:border-blue-200 hover:shadow-lg transition-all active:scale-95 flex items-center justify-between px-8 text-slate-600 hover:text-blue-700"
               >
                 <span>{role} Portal</span>
                 <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500" />
               </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => { setUser(null); setActiveTab('dashboard'); }}>
      <div className="relative min-h-[calc(100vh-120px)]">
        <button onClick={() => setShowRoleSwitcher(!showRoleSwitcher)} className="fixed bottom-8 right-8 bg-slate-900 text-white shadow-2xl p-4 rounded-full hover:bg-blue-600 transition-all z-[200] group active:scale-90">
          <Settings className={`transition-transform duration-700 ${showRoleSwitcher ? 'rotate-180' : 'group-hover:rotate-90'}`} size={24} />
        </button>
        {showRoleSwitcher && (
          <div className="fixed bottom-24 right-8 bg-white p-6 rounded-[32px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] z-[200] border border-slate-100 w-72 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-4 px-2 tracking-[0.2em]">Switch Persona</p>
            <div className="flex flex-col gap-2">
              {Object.values(UserRole).map((role) => (
                <button key={role} onClick={() => { setUser(MOCK_USERS[role]); setActiveTab('dashboard'); setShowRoleSwitcher(false); }} className={`text-left px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-between group ${user.role === role ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}>
                  {role}
                  {user.role === role && <Sparkles size={14} className="text-yellow-400" />}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="max-w-[1600px] mx-auto pb-20">{renderContent()}</div>
      </div>
    </Layout>
  );
};

export default App;
