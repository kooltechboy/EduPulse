import React, { useState, useEffect } from 'react';
import { User } from '../types.ts';
import { NAV_ITEMS_CATEGORIZED } from '../constants.tsx';
import { Bell, Search, LogOut, X, Sparkles, Menu, Wifi } from 'lucide-react';

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
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] lg:hidden animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop and Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-72 glass-sidebar flex flex-col transition-all duration-500 transform ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 border-r border-slate-100 shadow-2xl lg:shadow-none
      `}>
        <div className="p-8 lg:p-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-[20px] shadow-xl shadow-blue-200 transform hover:rotate-12 transition-transform">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 tracking-tighter">
              EduPulse
            </h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-300 p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-5 space-y-8 mt-4 overflow-y-auto scrollbar-hide pb-10">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-3">
              <p className="px-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 opacity-60">{group.label}</p>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-5 px-6 py-4 rounded-[22px] transition-all duration-300 group relative overflow-hidden ${
                    activeTab === item.id 
                      ? 'bg-slate-900 text-white shadow-2xl translate-x-2' 
                      : 'text-slate-500 hover:bg-white/80 hover:text-blue-600 hover:translate-x-2'
                  }`}
                >
                  <div className={`transition-colors duration-300 ${activeTab === item.id ? 'text-blue-400' : 'text-slate-300 group-hover:text-blue-600'}`}>
                    {item.icon}
                  </div>
                  <span className="font-black text-[13px] tracking-tight">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="absolute right-4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-100/50 bg-white/30 backdrop-blur-xl">
          <div className="glass-card p-5 rounded-[28px] flex items-center gap-4 bg-white/40 border border-white shadow-sm">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-12 h-12 rounded-[18px] border-2 border-white shadow-md flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate tracking-tight">{user.name}</p>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{user.role}</p>
            </div>
            <button onClick={onLogout} className="text-slate-300 hover:text-rose-500 transition-colors p-2"><LogOut size={18} /></button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 transition-all duration-500 w-full overflow-x-hidden">
        {/* Sticky Mobile Header */}
        <header className={`sticky top-0 z-[90] lg:relative lg:z-auto transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-6 py-6 md:px-10 md:py-10 lg:px-14 lg:py-14 ${scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-lg shadow-slate-100/50' : 'bg-transparent'}`}>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-3.5 glass-card rounded-2xl text-slate-600 hover:bg-white shadow-sm transition-all active:scale-95"
            >
              <Menu size={22} />
            </button>
            <div className="flex-1 md:w-[400px] xl:w-[450px] relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search campus node..." 
                className="w-full pl-12 pr-4 py-3.5 glass-card rounded-2xl md:rounded-[24px] focus:outline-none focus:ring-8 focus:ring-blue-100/20 border-none bg-white/50 text-xs font-bold shadow-inner placeholder:text-slate-300" 
              />
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6 justify-end">
            <div className="hidden xl:flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-100 shadow-sm">
               <div className="relative">
                  <Wifi size={16} className="text-emerald-500" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
               </div>
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Campus Node: Optimal</span>
            </div>
            <button className="relative glass-card p-4 rounded-[22px] hover:bg-white shadow-sm transition-all group">
              <Bell size={22} className="text-slate-400 group-hover:text-slate-600" />
              <span className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-lg"></span>
            </button>
          </div>
        </header>

        {/* Content Section */}
        <section className="px-6 md:px-10 lg:px-14 pb-20 animate-in fade-in duration-1000">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;