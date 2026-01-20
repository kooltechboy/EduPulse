
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types.ts';
import { NAV_ITEMS_CATEGORIZED } from '../constants.tsx';
import { 
  Bell, Search, LogOut, X, Sparkles, Menu, 
  ChevronRight, Command, Terminal, 
  ShieldCheck, Cpu, Zap, Activity, ShieldAlert,
  ArrowRight, Landmark, MonitorPlay, Users, CloudIcon, Database
} from 'lucide-react';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, children, activeTab, setActiveTab, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandNodeOpen, setIsCommandNodeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  
  const navGroups = NAV_ITEMS_CATEGORIZED[user.role] || [];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsSidebarOpen(false);
    setIsCommandNodeOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen selection:bg-blue-600 selection:text-white bg-[#f8fafc]">
      
      <aside className={`fixed inset-y-0 left-0 z-[110] w-72 sidebar-dark flex flex-col transition-all duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-2xl lg:shadow-none`}>
        <div className="p-8 pb-4 flex items-center justify-between">
          <div onClick={() => setActiveTab('dashboard')} className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-900/40">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
                <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">EduPulse</h1>
                <p className="text-[7px] font-black text-blue-400 uppercase tracking-[0.4em] mt-1">2026 Core</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 p-2 hover:bg-slate-800 rounded-xl transition-all"><X size={20} /></button>
        </div>

        <nav className="flex-1 px-4 space-y-8 overflow-y-auto scrollbar-hide py-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-3">
              <p className="px-4 text-[8px] font-black text-blue-400/80 uppercase tracking-[0.4em]">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button key={item.id} onClick={() => handleTabClick(item.id)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${activeTab === item.id ? 'active-glow text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                    <div className={`transition-all duration-300 ${activeTab === item.id ? 'scale-110' : 'text-slate-500 group-hover:text-blue-400'}`}>{item.icon}</div>
                    <span className="font-black text-[10px] tracking-widest uppercase flex-1 text-left">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-slate-950">
           {/* Cloud Health Metrics in Sidebar */}
           <div className="mb-6 space-y-3 px-2">
              <div className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest">
                 <span className="flex items-center gap-2"><Database size={10} className="text-emerald-500" /> Supabase Node</span>
                 <span className="text-emerald-400">99.9%</span>
              </div>
              <div className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest">
                 <span className="flex items-center gap-2"><CloudIcon size={10} className="text-blue-500" /> Firebase Pulse</span>
                 <span className="text-blue-400">Stable</span>
              </div>
           </div>
          <div className="p-4 rounded-2xl flex items-center gap-4 bg-slate-900 border border-white/5 group">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-10 h-10 rounded-xl border border-white/10 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-white truncate uppercase leading-none">{user.name}</p>
              <p className="text-[7px] text-blue-400 font-black uppercase tracking-widest mt-1.5">{user.role}</p>
            </div>
            <button onClick={onLogout} className="text-slate-500 hover:text-rose-500 transition-all p-2"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 transition-all duration-500 w-full overflow-x-hidden relative z-10">
        <header className={`sticky top-0 z-[90] transition-all duration-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 py-6 md:px-12 md:py-8 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
          <div className="flex items-center gap-6 w-full md:w-auto">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm"><Menu size={20} /></button>
            <div className="hidden md:flex items-center gap-4">
                <button onClick={() => setIsCommandNodeOpen(true)} className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-90 group">
                  <Command size={18} className="group-hover:rotate-12 transition-transform" />
                </button>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EduPulse OS v2.6 • Hybrid Cloud Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto justify-end">
            <div className="flex items-center gap-4 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest">Registry Synced</span>
            </div>
            <button className="relative p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group">
              <Bell size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <section className="px-6 md:px-12 pb-24">
          <div className="flex items-center gap-2 mb-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">
             <span className="hover:text-blue-600 cursor-pointer" onClick={() => setActiveTab('dashboard')}>CAMPUS CORE</span>
             <ChevronRight size={10} />
             <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{activeTab} node</span>
          </div>
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </section>
      </main>

      {/* COMMAND NODE - SIMPLIFIED FOR THIS CONTEXT */}
      {isCommandNodeOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl" onClick={() => setIsCommandNodeOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-900 text-white rounded-xl"><Command size={20}/></div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Command Node Discovery</h3>
                </div>
                <button onClick={() => setIsCommandNodeOpen(false)} className="p-2 text-slate-400 hover:text-slate-900"><X size={20}/></button>
             </div>
             <div className="p-10 text-center py-20">
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">"Direct access to Supabase & Firebase telemetry nodes initialized..."</p>
                <div className="mt-10 grid grid-cols-2 gap-4">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <Database className="text-emerald-500 mx-auto mb-3" size={24}/>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Relational DB</p>
                      <p className="text-sm font-black text-slate-900">SUPABASE ACTIVE</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <CloudIcon className="text-blue-500 mx-auto mb-3" size={24}/>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Real-time Pulse</p>
                      <p className="text-sm font-black text-slate-900">FIREBASE LIVE</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
