import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout.tsx';
import AdminView from '@/components/Dashboard/AdminView.tsx';
import TeacherView from './components/Dashboard/TeacherView';
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
import ImmersiveStudio from './components/ImmersiveStudio';
import TrajectoryModel from './components/Students/TrajectoryModel';
import LiveTutor from './components/Learning/LiveTutor';
import { User, UserRole, MOCK_USERS } from '@/types';
import { Settings, Sparkles, Key, ChevronRight, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(MOCK_USERS[UserRole.ADMIN]);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        // Check if API key is provided via environment
        if (process.env.GEMINI_API_KEY) {
          setHasApiKey(true);
          return;
        }

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
      if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
        setHasApiKey(true);
      }
    } catch (e) {
      console.error("Key node selection failed", e);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[160px]"></div>
        </div>
        <div className="glass-card max-w-lg w-full p-12 md:p-20 rounded-[64px] text-center shadow-2xl relative z-10 border border-white/10">
          <div className="w-28 h-28 bg-white/5 rounded-[40px] mx-auto flex items-center justify-center mb-12 shadow-2xl border border-white/10 transform -rotate-6">
            <Key className="text-blue-400" size={56} />
          </div>
          <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Institutional Handshake</h2>
          <p className="text-slate-400 mb-12 font-medium leading-relaxed">
            Configure your institutional API credentials to enable global node synchronization, including Veo cinematic synthesis and predictive academic modeling.
            <br /><br />
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline font-bold tracking-widest uppercase text-[10px]">Review Billing Node Logic</a>
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full bg-blue-600 text-white py-7 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-4"
          >
            Authorize Terminal Node <Sparkles size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-900 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
        </div>
        <div className="glass-card-dark max-w-lg w-full p-12 md:p-20 rounded-[64px] text-center shadow-2xl relative z-10">
          <div className="w-28 h-28 bg-white rounded-[40px] mx-auto flex items-center justify-center mb-12 shadow-2xl text-6xl transform -rotate-12 hover:rotate-0 transition-transform cursor-pointer">🎓</div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tighter">EduPulse</h1>
          <p className="text-slate-400 mb-16 font-bold uppercase tracking-[0.5em] text-[11px] opacity-70">Unified Digital Campus 2026</p>
          <div className="space-y-5">
            <button onClick={() => setUser(MOCK_USERS[UserRole.ADMIN])} className="w-full bg-white text-slate-900 py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-slate-100 transition-all active:scale-95">Principal Entry</button>
            <button onClick={() => setUser(MOCK_USERS[UserRole.TEACHER])} className="w-full bg-slate-800 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.4em] shadow-xl border border-white/10 hover:bg-slate-700 transition-all active:scale-95">Faculty Portal</button>
            <div className="grid grid-cols-2 gap-5">
              <button onClick={() => setUser(MOCK_USERS[UserRole.STUDENT])} className="bg-blue-600 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">Learner</button>
              <button onClick={() => setUser(MOCK_USERS[UserRole.PARENT])} className="bg-indigo-600 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95">Guardian</button>
            </div>
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
        <Route path="/dashboard" element={
          user.role === UserRole.ADMIN ? <AdminView /> : <TeacherView />
        } />
        <Route path="/immersive-studio" element={<ImmersiveStudio />} />
        <Route path="/trajectory-matrix" element={<TrajectoryModel />} />
        <Route path="/live-tutor" element={<LiveTutor />} />
        <Route path="/messages" element={<MessagingHub user={user} />} />
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
      <div className="fixed bottom-10 right-10 z-[200]">
        <button onClick={() => setShowRoleSwitcher(!showRoleSwitcher)} className="bg-white/90 backdrop-blur-md shadow-2xl border border-white/50 p-5 rounded-[32px] text-slate-700 hover:text-blue-600 transition-all group">
          <Settings className={`transition-transform duration-1000 ${showRoleSwitcher ? 'rotate-180' : 'group-hover:rotate-45'}`} size={28} />
        </button>
        {showRoleSwitcher && (
          <div className="absolute bottom-24 right-0 glass-card p-8 rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border-blue-100/50 w-80 animate-in slide-in-from-bottom-20 fade-in duration-300">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-6 px-2 tracking-[0.3em] opacity-60">Prototype Workspace</p>
            <div className="flex flex-col gap-3">
              {Object.values(UserRole).map((role) => (
                <button key={role} onClick={() => { setUser(MOCK_USERS[role]); setShowRoleSwitcher(false); }} className={`text-left px-7 py-5 rounded-[24px] text-sm font-black transition-all flex items-center justify-between group ${user.role === role ? 'bg-slate-900 text-white shadow-2xl' : 'hover:bg-blue-50 text-slate-600'}`}>
                  {role.charAt(0) + role.slice(1).toLowerCase()} Portal
                  <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${user.role === role ? 'text-blue-400' : 'text-slate-400'}`} />
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

