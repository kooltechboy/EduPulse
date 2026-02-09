
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../types.ts';
import { NAV_ITEMS_CATEGORIZED } from '../constants.tsx';
import { 
  Bell, Search, LogOut, X, Sparkles, Menu, 
  ChevronRight, Command, Terminal, 
  ShieldCheck, Cpu, Zap, Activity, ShieldAlert,
  ArrowRight, Landmark, MonitorPlay, Users, CloudIcon, Database,
  Settings, FileText, UserPlus, CreditCard, MessageSquare, Clock, Check
} from 'lucide-react';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const NOTIFICATIONS = [
  { id: 1, title: 'Security Alert', msg: 'Perimeter Gate B forced open.', type: 'critical', time: '2m ago' },
  { id: 2, title: 'System Update', msg: 'Neural Core synced successfully.', type: 'success', time: '1h ago' },
  { id: 3, title: 'New Enrollment', msg: 'Candidate #9901 approved.', type: 'info', time: '2h ago' },
  { id: 4, title: 'Budget Drift', msg: 'Science Dept variance detected.', type: 'warning', time: '5h ago' },
];

const Layout: React.FC<LayoutProps> = ({ user, children, activeTab, setActiveTab, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navGroups = NAV_ITEMS_CATEGORIZED[user.role] || [];
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandOpen(false);
        setIsNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isCommandOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isCommandOpen]);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsSidebarOpen(false);
    setIsCommandOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen selection:bg-blue-600 selection:text-white bg-[#f8fafc]">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-[110] w-72 sidebar-dark flex flex-col transition-all duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-2xl lg:shadow-none`}>
        <div className="p-8 pb-4 flex items-center justify-between">
          <div onClick={() => setActiveTab('dashboard')} className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-900/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
              <Sparkles className="text-white relative z-10" size={24} />
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
                    {activeTab === item.id && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-lg shadow-blue-400/50 animate-pulse"></div>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-slate-950">
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
          <div className="p-4 rounded-2xl flex items-center gap-4 bg-slate-900 border border-white/5 group hover:border-white/10 transition-colors cursor-pointer">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-10 h-10 rounded-xl border border-white/10 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-white truncate uppercase leading-none">{user.name}</p>
              <p className="text-[7px] text-blue-400 font-black uppercase tracking-widest mt-1.5">{user.role}</p>
            </div>
            <button onClick={onLogout} className="text-slate-500 hover:text-rose-500 transition-all p-2"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-72 transition-all duration-500 w-full overflow-x-hidden relative z-10">
        <header className={`sticky top-0 z-[90] transition-all duration-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 py-6 md:px-12 md:py-8 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
          <div className="flex items-center gap-6 w-full md:w-auto">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm"><Menu size={20} /></button>
            <div className="hidden md:flex items-center gap-4">
                <button onClick={() => setIsCommandOpen(true)} className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 shadow-sm rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 group w-64">
                  <Search size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">Search (Cmd + K)</span>
                </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest">System Operational</span>
            </div>
            <button 
              onClick={() => setIsNotifOpen(true)}
              className="relative p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group"
            >
              <Bell size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
          </div>
        </header>

        <section className="px-6 md:px-12 pb-24">
          <div className="flex items-center gap-2 mb-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">
             <span className="hover:text-blue-600 cursor-pointer" onClick={() => setActiveTab('dashboard')}>CAMPUS CORE</span>
             <ChevronRight size={10} />
             <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{activeTab} node</span>
          </div>
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">{children}</div>
        </section>
      </main>

      {/* NEURO-LINK COMMAND PALETTE */}
      {isCommandOpen && (
        <div className="fixed inset-0 z-[2000] flex items-start pt-[15vh] justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCommandOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
             <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                <Search size={24} className="text-slate-300" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask EduPulse or Search Modules..." 
                  className="w-full text-xl font-bold text-slate-900 placeholder:text-slate-300 outline-none bg-transparent"
                />
                <button onClick={() => setIsCommandOpen(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900"><div className="text-[10px] font-black px-1.5 py-0.5 border border-slate-300 rounded">ESC</div></button>
             </div>
             <div className="p-2 bg-slate-50 max-h-[60vh] overflow-y-auto">
                <div className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Suggested Nodes</div>
                <div className="space-y-1 p-2">
                   {[
                     { label: 'Register New Student', icon: <UserPlus size={18}/>, action: 'admissions' },
                     { label: 'View Financial Ledger', icon: <CreditCard size={18}/>, action: 'finance' },
                     { label: 'System Configuration', icon: <Settings size={18}/>, action: 'settings' },
                     { label: 'Broadcast Message', icon: <MessageSquare size={18}/>, action: 'messages' },
                   ].filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleTabClick(item.action)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:scale-[1.01] transition-all group border border-transparent hover:border-slate-100"
                      >
                         <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-blue-600 shadow-sm transition-colors">{item.icon}</div>
                         <span className="font-bold text-slate-600 group-hover:text-slate-900">{item.label}</span>
                         <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 text-slate-300 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                   ))}
                </div>
                {searchQuery && (
                   <div className="p-6 text-center">
                      <p className="text-slate-400 text-xs font-bold">Press <span className="text-slate-900">Enter</span> to execute neural search for "{searchQuery}"</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* PULSE NOTIFICATION DRAWER */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-[150] transition-transform duration-500 transform ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-slate-100`}>
         <div className="h-full flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-xl">
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Pulse Feed</h3>
               <button onClick={() => setIsNotifOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
               {NOTIFICATIONS.map(n => (
                  <div key={n.id} className="p-5 bg-white rounded-[24px] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
                     <div className={`absolute top-0 left-0 w-1 h-full ${n.type === 'critical' ? 'bg-rose-500' : n.type === 'success' ? 'bg-emerald-500' : n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                     <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${n.type === 'critical' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{n.type}</span>
                        <span className="text-[9px] font-bold text-slate-400">{n.time}</span>
                     </div>
                     <h4 className="font-bold text-slate-900 mb-1">{n.title}</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">{n.msg}</p>
                  </div>
               ))}
               <div className="p-8 text-center">
                  <button className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">View Archival Logs</button>
               </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-white">
               <button className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  <Check size={16} /> Mark All Read
               </button>
            </div>
         </div>
      </div>
      
      {/* Overlay for Drawer */}
      {isNotifOpen && <div className="fixed inset-0 bg-slate-900/20 z-[140] backdrop-blur-[2px]" onClick={() => setIsNotifOpen(false)}></div>}

    </div>
  );
};

export default Layout;
