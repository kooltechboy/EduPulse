import React, { useState, useEffect } from 'react';
import { 
  Users, Sparkles, 
  ChevronRight, CheckCircle2, GitBranch, Activity,
  Zap, Wand2, X, ShieldCheck, Laptop, 
  Shapes, Handshake, Send, Calendar, MapPin, UserCheck, Star,
  MessageSquareText, MessageCircleCode, Clock, BookOpen, AlertCircle,
  // Added missing icon imports
  MonitorPlay, ArrowRight, RefreshCw
} from 'lucide-react';
import { getAIPredictiveInsights, generateSmartPrep, generateLessonRecapVideo } from '../../services/geminiService';
import { Syllabus, CurriculumModule, HRRequest, TeacherEvaluation } from '../../types';

const TeacherView: React.FC = () => {
  const [aiInsight, setAiInsight] = useState("Analyzing faculty node telemetry...");
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);
  const [activeSyllabus, setActiveSyllabus] = useState<Syllabus | null>(null);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  
  useEffect(() => {
    const savedSyllabi = localStorage.getItem('edupulse_syllabi');
    if (savedSyllabi) {
      const syllabi: Syllabus[] = JSON.parse(savedSyllabi);
      setActiveSyllabus(syllabi[0]);
    }
    const fetchInsight = async () => {
      const insight = await getAIPredictiveInsights({ class: '12-A', avgAttendance: 96, lastTestAvg: 88 });
      setAiInsight(insight);
    };
    fetchInsight();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-32">
      
      {/* HEADER: GREETING & STATUS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-950 tracking-tighter uppercase leading-none mb-3">Faculty Station</h2>
          <p className="text-slate-500 font-black italic uppercase text-[12px] tracking-[0.5em] flex items-center gap-4">
            <UserCheck size={20} className="text-blue-600" /> Professor Mitchell • Senior Interface
          </p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
           <div className="bg-white/80 backdrop-blur-xl px-8 py-5 rounded-[28px] shadow-lg border border-slate-100 flex items-center gap-6 group cursor-default">
              <div className="relative">
                 <MessageSquareText size={24} className="text-blue-600" />
                 <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white shadow-lg animate-bounce">3</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Unread Nodes</p>
                 <p className="text-sm font-black text-slate-900 mt-1 uppercase">Parent Comms</p>
              </div>
           </div>
           <button className="bg-slate-950 text-white px-10 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-700 transition-all active:scale-95 group flex items-center gap-4">
             <Calendar size={22} className="text-blue-400" /> Roadmap Sync
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        {/* MAIN WORKLOAD FEED */}
        <div className="xl:col-span-3 space-y-12">
           <div className="glass-card p-12 md:p-14 rounded-[64px] bg-white border-none shadow-2xl">
              <div className="flex items-center justify-between mb-16">
                 <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase flex items-center gap-6">
                    {/* Fixed: MonitorPlay now imported */}
                    <div className="p-5 bg-blue-50 text-blue-600 rounded-[28px] shadow-inner"><MonitorPlay size={32} /></div>
                    Active Instructional Cycles
                 </h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                    <Activity size={16} className="text-emerald-500 animate-pulse" /> Nodes Verified
                 </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                   { name: 'Advanced Calculus', room: 'B-102', code: 'MATH-12A', next: 'Limits & Topology', status: 'Ready', color: 'blue' },
                   { name: 'Quantum Physics', room: 'Lab 4', code: 'PHYS-12B', next: 'Wave Synthesis', status: 'Prep Req', color: 'indigo' }
                 ].map((cls, i) => (
                   <div key={i} className="p-10 bg-slate-50 rounded-[56px] border-2 border-transparent hover:border-blue-400 hover:bg-white hover:shadow-2xl transition-all duration-700 group/cls cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/cls:opacity-10 transition-opacity"><Shapes size={100} /></div>
                      <div className="flex justify-between items-start mb-10 relative z-10">
                         <div className={`p-4 bg-${cls.color}-600 text-white rounded-2xl shadow-xl group-hover/cls:rotate-12 transition-transform`}>
                            <BookOpen size={24} />
                         </div>
                         <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${cls.status === 'Ready' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100 animate-pulse'}`}>{cls.status}</span>
                      </div>
                      <h4 className="text-3xl font-black text-slate-950 tracking-tighter uppercase leading-tight mb-2 group-hover/cls:text-blue-700 transition-colors">{cls.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">{cls.code} • {cls.room}</p>
                      
                      <div className="p-6 bg-white/60 backdrop-blur-md rounded-[32px] border border-white mb-8">
                         {/* Fixed: ArrowRight now imported */}
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><ArrowRight size={12} className="text-blue-600" /> Upcoming Node</p>
                         <p className="text-sm font-black text-slate-700 uppercase">{cls.next}</p>
                      </div>

                      <div className="flex gap-4 opacity-0 group-hover/cls:opacity-100 translate-y-4 group-hover/cls:translate-y-0 transition-all duration-500">
                         <button className="flex-1 py-4 bg-slate-950 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-blue-700">Attendance</button>
                         <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-950 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">Grades</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* SIDEBAR: NEURAL & TASKS */}
        <div className="space-y-10">
           <div className="glass-card-dark p-12 rounded-[64px] shadow-2xl relative overflow-hidden group neural-glow h-fit border-none">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:scale-125 transition-all duration-[5s]"></div>
              <div className="relative z-10">
                 <div className="flex items-center gap-5 mb-10">
                    <div className="p-4 bg-white/10 rounded-2xl shadow-inner border border-white/20"><Zap size={28} className="text-amber-400" /></div>
                    <h4 className="font-black text-2xl uppercase tracking-tighter text-white">Daily Pulse</h4>
                 </div>
                 <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[40px] border border-white/10 shadow-inner mb-10">
                    <p className="text-blue-50 italic text-base leading-relaxed font-medium opacity-90">"{aiInsight}"</p>
                 </div>
                 <button className="w-full py-6 bg-white text-slate-950 font-black rounded-[28px] text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                    {/* Fixed: RefreshCw now imported */}
                    Synthesis Refresh <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                 </button>
              </div>
           </div>

           <div className="glass-card p-10 rounded-[56px] bg-white shadow-xl border-none">
              <h4 className="font-black text-slate-950 uppercase tracking-[0.4em] text-[11px] mb-10 flex items-center gap-5">
                 <AlertCircle size={20} className="text-indigo-600" /> Faculty Queue
              </h4>
              <div className="space-y-6">
                 {[
                   { label: 'Submit HR Dossier', type: 'Administrative', due: 'Today' },
                   { label: 'Upload Term Roadmap', type: 'Curriculum', due: '2d' },
                   { label: 'Sign Audit Report', type: 'Regulatory', due: '5d' },
                 ].map((t, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50 group cursor-pointer hover:translate-x-1 transition-transform">
                       <div>
                          <p className="text-sm font-black text-slate-950 group-hover:text-blue-600 transition-colors uppercase leading-none mb-1.5">{t.label}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.type}</p>
                       </div>
                       <span className="text-[9px] font-black text-slate-400 border border-slate-200 px-2 py-0.5 rounded-lg">{t.due}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherView;