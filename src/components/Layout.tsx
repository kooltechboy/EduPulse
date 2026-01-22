import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { NAV_ITEMS_CATEGORIZED } from '@/config/constants';
import {
  ChevronRight, Command, ShieldCheck, Database, CloudIcon, Bot,
  CornerDownLeft, Search, FileText, Cpu, X, LogOut, Menu, Bell, Sparkles
} from "lucide-react";
import { performAIResearch } from '@/services/geminiService';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkSupabaseHealth } from '@/lib/supabase';
import { checkFirebaseHealth } from '@/lib/firebase';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, children, onLogout }) => {
  const { school } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandNodeOpen, setIsCommandNodeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navGroups = NAV_ITEMS_CATEGORIZED[user.role] || [];
  const activeTab = location.pathname.substring(1) || 'dashboard';

  // Nexus Agent State
  const [nexusMessages, setNexusMessages] = useState<{ role: 'user' | 'assistant', content: string, sources?: any[] }[]>([
    { role: 'assistant', content: "EduPulse Nexus initialized. Institutional data nodes are synced. How can I assist your campus management today?" }
  ]);
  const [nexusInput, setNexusInput] = useState("");
  const [isNexusProcessing, setIsNexusProcessing] = useState(false);

  // Cloud Health Pulse
  const [supabaseStatus, setSupabaseStatus] = useState<'Checking...' | '99.9%' | 'OFFLINE'>('Checking...');
  const [firebaseStatus, setFirebaseStatus] = useState<'Checking...' | 'Stable' | 'Offline'>('Checking...');

  useEffect(() => {
    const updateHealth = async () => {
      const isSupabaseOk = await checkSupabaseHealth();
      const isFirebaseOk = await checkFirebaseHealth();
      setSupabaseStatus(isSupabaseOk ? '99.9%' : 'OFFLINE');
      setFirebaseStatus(isFirebaseOk ? 'Stable' : 'Offline');
    };

    updateHealth();
    const interval = setInterval(updateHealth, 30000); // Pulse every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (id: string) => {
    navigate(`/${id}`);
    setIsSidebarOpen(false);
    setIsCommandNodeOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNexusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nexusInput.trim() || isNexusProcessing) return;

    const userMsg = nexusInput;
    setNexusInput("");
    setNexusMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsNexusProcessing(true);

    try {
      const response = await performAIResearch(userMsg);
      setNexusMessages(prev => [...prev, {
        role: 'assistant',
        content: response.text,
        sources: response.sources
      }]);
    } catch (error) {
      setNexusMessages(prev => [...prev, {
        role: 'assistant',
        content: "Neural link timeout. Please re-delegate your request."
      }]);
    } finally {
      setIsNexusProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">

      {/* Sidebar - Modern Dark */}
      <aside className={`fixed inset-y-0 left-0 z-[110] w-72 bg-[#020617] border-r border-white/10 flex flex-col transition-all duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-2xl lg:shadow-none`}>
        <div className="p-8 pb-4 flex items-center justify-between">
          <div onClick={() => handleTabClick('dashboard')} className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-900/40">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">{school?.name || 'EduPulse'}</h1>
              <p className="text-[7px] font-black text-blue-400 uppercase tracking-[0.4em] mt-1">{school?.subscriptionPlan || '2026 Core'}</p>
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
                  <button key={item.id} onClick={() => handleTabClick(item.id)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
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
              <span className="flex items-center gap-2"><Database size={10} className={supabaseStatus === 'OFFLINE' ? 'text-rose-500' : 'text-emerald-500'} /> Supabase Node</span>
              <span className={supabaseStatus === 'OFFLINE' ? 'text-rose-400' : 'text-emerald-400'}>{supabaseStatus}</span>
            </div>
            <div className="flex items-center justify-between text-[7px] font-black text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-2"><CloudIcon size={10} className={firebaseStatus === 'Offline' ? 'text-rose-500' : 'text-blue-500'} /> Firebase Pulse</span>
              <span className={firebaseStatus === 'Offline' ? 'text-rose-400' : 'text-blue-400'}>{firebaseStatus}</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl flex items-center gap-4 bg-slate-900 border border-white/5 group text-white">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-10 h-10 rounded-xl border border-white/10 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase truncate leading-none">{user.name}</p>
              <p className="text-[7px] text-blue-400 font-black uppercase tracking-widest mt-1.5">{user.role}</p>
            </div>
            <button onClick={onLogout} className="text-slate-500 hover:text-rose-500 transition-all p-2"><LogOut size={16} /></button>
          </div >
        </div >
      </aside >

      <main className="flex-1 lg:pl-72 transition-all duration-500 w-full overflow-x-hidden relative z-10">
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

        <section className="px-6 md:px-12 pb-24 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => handleTabClick('dashboard')}>CAMPUS CORE</span>
            <ChevronRight size={10} />
            <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded uppercase">{activeTab} node</span>
          </div>
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </section>
      </main>

      {/* Command Node Modal - The Nexus Agent */}
      {
        isCommandNodeOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" onClick={() => setIsCommandNodeOpen(false)}></div>
            <div className="relative w-full max-w-3xl h-[600px] bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">

              {/* Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"><Bot size={20} /></div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tighter text-slate-900">EduPulse Autonomous Nexus</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">Intelligence Engine v3.0 Online</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsCommandNodeOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                {nexusMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                    <div className={`max-w-[85%] p-5 rounded-[28px] ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-xl' : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                      <p className="text-xs font-semibold leading-relaxed">{msg.content}</p>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200/50 flex flex-wrap gap-2">
                          {msg.sources.map((source: any, sIdx: number) => (
                            <a key={sIdx} href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[8px] font-black uppercase tracking-tighter bg-white/50 px-2 py-1 rounded-lg border border-slate-200 hover:bg-white transiton-colors">
                              <Search size={10} /> {source.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isNexusProcessing && (
                  <div className="flex justify-start animate-fade-in-up">
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-[28px] rounded-tl-none flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Nexus Synthesizing...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer / Input */}
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <form onSubmit={handleNexusSubmit} className="relative group">
                  <input
                    type="text"
                    value={nexusInput}
                    onChange={(e) => setNexusInput(e.target.value)}
                    placeholder="Ask Nexus to research, summarize, or automate..."
                    className="w-full bg-white border border-slate-200 rounded-[28px] py-4 pl-6 pr-16 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!nexusInput.trim() || isNexusProcessing}
                    className="absolute right-2 top-2 p-2.5 bg-slate-900 text-white rounded-full hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg active:scale-95"
                  >
                    <CornerDownLeft size={16} />
                  </button>
                </form>
                <div className="mt-4 flex items-center justify-center gap-6">
                  {[
                    { label: 'Summarize Comms', icon: <FileText size={10} /> },
                    { label: 'Market Insight', icon: <Search size={10} /> },
                    { label: 'Load Analysis', icon: <Cpu size={10} /> }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNexusInput(chip.label)}
                      className="text-[8px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"
                    >
                      {chip.icon} {chip.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )
      }
    </div >
  );
};

export default Layout;

