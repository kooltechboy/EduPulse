import React, { useState, useEffect } from 'react';
import { User } from '../types.ts';
import { NAV_ITEMS_CATEGORIZED } from '../constants.tsx';
import { Bell, Search, LogOut, X, Sparkles, Menu, Wifi, ChevronRight } from 'lucide-react';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, children, activeTab, setActiveTab, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navGroups = NAV_ITEMS_CATEGORIZED[user.role] || [];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-72 sidebar-gradient flex flex-col transition-all duration-700 transform cubic-bezier(0.23, 1, 0.32, 1)
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 border-r border-slate-100/50 shadow-2xl lg:shadow-none
      `}>
        <div className="p-10 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-blue-600 p-3.5 rounded-[22px] shadow-2xl shadow-blue-300 transform group-hover:rotate-[360deg] transition-transform duration-1000">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 tracking-tighter uppercase leading-none">
              EduPulse
            </h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-300 p-2 hover:bg-slate-100 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-5 space-y-10 mt-6 overflow-y-auto scrollbar-hide pb-10">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-4">
              <p className="px-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4 opacity-70">{group.label}</p>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center gap-5 px-6 py-4 rounded-[24px] transition-all duration-500 group relative overflow-hidden ${
                      activeTab === item.id 
                        ? 'bg-slate-900 text-white shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] translate-x-2' 
                        : 'text-slate-500 hover:bg-white hover:text-blue-600 hover:translate-x-2'
                    }`}
                  >
                    <div className={`transition-all duration-500 ${activeTab === item.id ? 'text-blue-400 scale-110' : 'text-slate-300 group-hover:text-blue-600'}`}>
                      {item.icon}
                    </div>
                    <span className="font-black text-[13px] tracking-tight uppercase">{item.label}</span>
                    {activeTab === item.id && (
                      <div className="absolute right-4 w-1.5 h-1.5 bg-blue-400 rounded-full active-nav-indicator animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-100/50 bg-white/40 backdrop-blur-xl">
          <div className="glass-card p-5 rounded-[32px] flex items-center gap-4 bg-white/80 border border-white shadow-lg hover:translate-y-[-2px] transition-all group cursor-default">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-12 h-12 rounded-[18px] border-2 border-white shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate tracking-tight uppercase leading-none">{user.name}</p>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1.5">{user.role}</p>
            </div>
            <button onClick={onLogout} className="text-slate-300 hover:text-rose-500 transition-all p-2 hover:bg-rose-50 rounded-xl">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 transition-all duration-500 w-full overflow-x-hidden relative z-10">
        <header className={`sticky top-0 z-[90] transition-all duration-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-6 py-8 md:px-14 md:py-12 ${scrolled ? 'bg-white/70 backdrop-blur-3xl shadow-xl shadow-slate-100/30 py-6 md:py-8' : 'bg-transparent'}`}>
          <div className="flex items-center gap-5 w-full md:w-auto">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-4 glass-card rounded-[22px] text-slate-600 hover:bg-white shadow-lg transition-all active:scale-95"
            >
              <Menu size={22} />
            </button>
            <div className="flex-1 md:w-[450px] xl:w-[500px] relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search campus node: students, assets, or events..." 
                className="w-full pl-16 pr-6 py-5 glass-card rounded-[28px] focus:outline-none focus:ring-[12px] focus:ring-blue-100/30 border-none bg-white/40 text-sm font-bold shadow-inner placeholder:text-slate-300 transition-all" 
              />
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 justify-end">
            <div className="hidden xl:flex items-center gap-4 bg-white/60 backdrop-blur-md px-8 py-4 rounded-full border border-white shadow-sm hover:shadow-md transition-all">
               <div className="relative">
                  <Wifi size={18} className="text-emerald-500" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
               </div>
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Network: Stable</span>
            </div>
            <button className="relative glass-card p-5 rounded-[24px] hover:bg-white shadow-lg transition-all group active:scale-95">
              <Bell size={24} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="absolute top-5 right-5 w-2.5 h-2.5 bg-rose-500 rounded-full border-4 border-white shadow-xl"></span>
            </button>
          </div>
        </header>

        <section className="px-6 md:px-14 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;