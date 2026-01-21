import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { NAV_ITEMS_CATEGORIZED } from '@/config/constants';
import {
  Bell, LogOut, X, Sparkles, Menu,
  Command, Search, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, children, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navGroups = NAV_ITEMS_CATEGORIZED[user.role] || [];
  const activeTab = location.pathname.substring(1) || 'dashboard';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (id: string) => {
    navigate(`/${id}`);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">

      {/* Sidebar - Clean White */}
      <aside className={`fixed inset-y-0 left-0 z-[110] w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-8 pb-6 flex items-center justify-between">
          <div onClick={() => handleTabClick('dashboard')} className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-sm text-white group-hover:bg-blue-700 transition-colors">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">EduPulse</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Academic Suite</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>

        {/* Navigation scroll area */}
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto scrollbar-hide py-4">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <button key={item.id} onClick={() => handleTabClick(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-bold ${activeTab === item.id ? 'bg-slate-100 text-slate-950 shadow-sm' : 'text-slate-900 hover:bg-slate-50 hover:text-black'}`}>
                    <div className={`transition-colors ${activeTab === item.id ? 'text-blue-700' : 'text-slate-700 group-hover:text-black'}`}>{item.icon}</div>
                    <span className="flex-1 text-left">{item.label}</span>
                    {activeTab === item.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-10 h-10 rounded-full bg-slate-200 border border-white shadow-sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 font-medium truncate">{user.role}</p>
            </div>
            <button onClick={onLogout} className="p-2 hover:bg-white hover:text-rose-600 rounded-lg transition-all text-slate-400 shadow-sm border border-transparent hover:border-slate-200"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-72 transition-all duration-300 w-full relative z-10">

        {/* Header - Minimalist */}
        <header className={`sticky top-0 z-[90] transition-all duration-200 flex flex-col md:flex-row justify-between items-center gap-4 px-8 py-4 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-transparent'}`}>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600"><Menu size={24} /></button>

            {/* Context Breadcrumb / Search */}
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 w-72 focus-within:ring-2 focus-within:ring-blue-100 transition-shadow">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="Search students, staff, or resources..." className="bg-transparent border-none outline-none text-sm text-slate-900 placeholder-slate-400 w-full" />
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-bold border border-slate-200"><Command size={10} /> K</div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">System Operational</span>
            </div>
            <button className="relative p-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group">
              <Bell size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="px-8 pb-20 pt-6 animate-fade-in-up">
          {children}
        </div>
      </main>

    </div>
  );
};

export default Layout;
