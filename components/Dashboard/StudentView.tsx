import React, { useState } from 'react';
import { 
  GraduationCap, 
  Book, 
  Calendar, 
  Trophy, 
  MessageSquare, 
  Send, 
  Search, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  Quote, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Zap, 
  TrendingUp,
  ArrowRight,
  Layers,
  Target
} from 'lucide-react';
import { getAITutorResponse, performAIResearch } from '../../services/geminiService';

const StudentView: React.FC = () => {
  const [chatInput, setChatInput] = useState("");
  const [aiMessage, setAiMessage] = useState("Hi Aiden! I'm your AI Tutor. I see you have a Derivatives Worksheet due in 2 days. Need help preparing?");
  const [isTyping, setIsTyping] = useState(false);
  
  const [researchQuery, setResearchQuery] = useState("");
  const [researchResult, setResearchResult] = useState<{text: string, sources: any[]} | null>(null);
  const [isResearching, setIsResearching] = useState(false);

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    const q = chatInput;
    setChatInput("");
    setIsTyping(true);
    const res = await getAITutorResponse(q, { student: "Aiden", gpa: 3.9, currentSubject: "Advanced Calculus" });
    setAiMessage(res);
    setIsTyping(false);
  };

  const handleResearch = async () => {
    if (!researchQuery.trim()) return;
    setIsResearching(true);
    const result = await performAIResearch(researchQuery);
    setResearchResult(result);
    setIsResearching(false);
  };

  const pathwayGoals = [
    { title: 'Define Epsilon-Delta', status: 'Completed', time: '08:00 AM', node: 'Calculus' },
    { title: 'Recap Limit Laws', status: 'Active', time: '10:30 AM', node: 'Calculus' },
    { title: 'Problem Set #4 Draft', status: 'Upcoming', time: '02:00 PM', node: 'Self-Study' },
  ];

  return (
    <div className="space-y-8 md:space-y-10 animate-in slide-in-from-right duration-700 px-2 md:px-0">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-1">
        <div className="flex flex-col md:flex-row items-center gap-6">
           <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] md:rounded-[32px] bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-50 flex items-center justify-center text-white shadow-2xl transform hover:scale-105 transition-all">
             <GraduationCap size={40} className="md:w-12 md:h-12" />
           </div>
           <div className="text-center md:text-left">
             <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Hey, Aiden!</h2>
             <p className="text-slate-500 font-bold mt-1 uppercase text-[9px] md:text-[10px] tracking-widest">Instructional Phase 2 • <span className="text-blue-600">Core Tier 2026</span></p>
           </div>
        </div>
        <div className="hidden md:flex gap-4">
           <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Pathway Synced</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8 md:space-y-10">
          {/* Pathway Progress Bar */}
          <div className="glass-card p-6 md:p-10 rounded-[40px] md:rounded-[56px] bg-white shadow-2xl border-none relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
             <div className="flex justify-between items-center mb-8 md:mb-10 relative z-10">
                <h3 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner"><Layers size={20} className="md:w-6 md:h-6" /></div>
                   Personal Pathway
                </h3>
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-indigo-100">82% Cycle</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
                {pathwayGoals.map((goal, i) => (
                  <div key={i} className={`p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-2 transition-all group ${goal.status === 'Active' ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}>
                     <div className="flex justify-between items-start mb-6">
                        <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${goal.status === 'Active' ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>{goal.status}</span>
                        <Clock size={16} className={goal.status === 'Active' ? 'text-white' : 'text-slate-300'} />
                     </div>
                     <h4 className="text-lg md:text-xl font-black mb-1 group-hover:translate-x-1 transition-transform uppercase">{goal.title}</h4>
                     <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${goal.status === 'Active' ? 'text-blue-100' : 'text-slate-400'}`}>{goal.node} • {goal.time}</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] border-none hover:translate-y-[-6px] transition-all duration-300 shadow-xl bg-white group">
              <div className="flex justify-between items-start mb-6">
                 <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all"><TrendingUp size={24} /></div>
                 <span className="text-[9px] font-black text-emerald-500 uppercase">+0.2 Growth</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GPA Core</p>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">3.90</h3>
            </div>
            <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] border-none hover:translate-y-[-6px] transition-all duration-300 shadow-xl bg-white group">
              <div className="flex justify-between items-start mb-6">
                 <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><Activity size={24} /></div>
                 <span className="text-[9px] font-black text-indigo-500 uppercase">Optimal</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Presence</p>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">98%</h3>
            </div>
            <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] border-none hover:translate-y-[-6px] transition-all duration-300 shadow-xl bg-white group">
              <div className="flex justify-between items-start mb-6">
                 <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all"><Trophy size={24} /></div>
                 <span className="text-[9px] font-black text-slate-400 uppercase">Tier Rank</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global</p>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">#4</h3>
            </div>
          </div>

          {/* Research Hub */}
          <div className="glass-card rounded-[40px] md:rounded-[56px] overflow-hidden p-8 md:p-14 bg-white shadow-2xl border-none">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-6">
                <div className="p-4 md:p-5 bg-blue-600 rounded-[24px] md:rounded-[28px] shadow-2xl"><Search className="text-white" size={28} /></div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase">Research Node</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Grounding Hub 2026</p>
                </div>
              </div>
              <Sparkles className="text-blue-500 animate-pulse hidden md:block" size={32} />
            </div>
            <div className="relative mb-8 md:mb-10 group">
              <input type="text" value={researchQuery} onChange={(e) => setResearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleResearch()} placeholder="Query verified repositories..." className="w-full pl-6 md:pl-10 pr-32 md:pr-44 py-5 md:py-7 bg-slate-50 border-2 border-slate-100 rounded-3xl md:rounded-[36px] focus:ring-8 focus:ring-blue-100 outline-none transition-all font-bold text-slate-800 text-base md:text-lg" />
              <button onClick={handleResearch} disabled={isResearching} className="absolute right-2 md:right-3 top-2 md:top-3 bottom-2 md:bottom-3 bg-slate-900 text-white px-6 md:px-10 rounded-2xl md:rounded-[28px] font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center justify-center gap-3">
                {isResearching ? <Activity className="animate-spin" size={16} /> : "Query"}
              </button>
            </div>
            {researchResult && (
              <div className="bg-slate-50 rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-100 animate-in zoom-in-95 duration-700 shadow-inner">
                <div className="prose prose-slate max-w-none mb-8">
                  <div className="flex items-start gap-4 md:gap-6">
                    <Quote className="text-blue-200 rotate-180 flex-shrink-0" size={32} />
                    <p className="text-slate-700 leading-relaxed font-bold text-base md:text-xl italic">"{researchResult.text}"</p>
                  </div>
                </div>
                {researchResult.sources.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-8 border-t border-slate-200">
                    {researchResult.sources.map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[9px] font-black text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm group">
                        <span className="truncate max-w-[120px] md:max-w-[200px]">{s.title}</span>
                        <ExternalLink size={12} className="group-hover:rotate-45 transition-transform" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 md:p-10 rounded-[40px] md:rounded-[56px] flex flex-col h-[600px] md:h-[850px] border-none bg-white shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4 text-indigo-700">
                <div className="p-3 bg-indigo-50 rounded-2xl shadow-inner"><MessageSquare size={24} /></div>
                <h4 className="font-black tracking-tighter text-xl uppercase">AI Tutor</h4>
              </div>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
            </div>
            
            <div className="flex-1 bg-slate-900 rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-blue-50 text-xs md:text-sm overflow-y-auto mb-6 md:mb-8 font-bold leading-relaxed shadow-inner scrollbar-hide">
              {isTyping ? <div className="flex gap-2 py-4"><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div></div> : aiMessage}
            </div>
            
            <div className="relative">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} type="text" placeholder="Ask your personal tutor..." className="w-full pl-6 pr-16 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] md:rounded-[32px] text-xs md:text-sm font-bold outline-none focus:ring-8 focus:ring-indigo-100 transition-all shadow-xl" />
              <button onClick={handleSend} className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-5 rounded-[22px] md:rounded-[24px] hover:bg-indigo-700 transition-all active:scale-90"><Send size={20} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentView;