import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, MessageSquare, Send, Search, ExternalLink, 
  Sparkles, BookOpen, Quote, Clock, CheckCircle2, 
  Activity, Zap, TrendingUp, ArrowRight, Layers, Bot, User, Mic
} from 'lucide-react';
import { getAITutorResponse, performAIResearch } from '../../services/geminiService';

const StudentView: React.FC = () => {
  const [chatInput, setChatInput] = useState("");
  const [aiMessage, setAiMessage] = useState("Hi Aiden! I've architected a study roadmap for your Calculus midterm. Shall we initialize the first concept node?");
  const [isTyping, setIsTyping] = useState(false);
  
  const [researchQuery, setResearchQuery] = useState("");
  const [researchResult, setResearchResult] = useState<{text: string, sources: any[]} | null>(null);
  const [isResearching, setIsResearching] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [aiMessage, isTyping]);

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
    { title: 'Calculus: Chain Rule', status: 'Completed', time: '08:00 AM', node: 'Core' },
    { title: 'Physics: Wave Synthesis', status: 'Active', time: '10:30 AM', node: 'Lab' },
    { title: 'English: Neural Prose', status: 'Upcoming', time: '02:00 PM', node: 'Seminar' },
  ];

  return (
    <div className="space-y-12 animate-in slide-in-from-right duration-1000">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-1">
        <div className="flex flex-col md:flex-row items-center gap-10">
           <div className="w-24 h-24 rounded-[36px] bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-2xl transform hover:rotate-6 transition-all duration-700">
             <GraduationCap size={48} />
           </div>
           <div className="text-center md:text-left">
             <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">Hey, Aiden!</h2>
             <p className="text-slate-500 font-black mt-2 uppercase text-[11px] tracking-[0.5em]">Phase 2 Learning Pathway • <span className="text-blue-600">Core Node 2026</span></p>
           </div>
        </div>
        <div className="flex gap-6">
           <div className="bg-white/80 backdrop-blur-3xl px-8 py-4 rounded-[28px] shadow-xl border border-white flex items-center gap-4 group cursor-default">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-glow-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Dossier Synced</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
          {/* Daily Goal Matrix */}
          <div className="glass-card p-10 md:p-14 rounded-[64px] bg-white shadow-2xl border-none relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
             <div className="flex justify-between items-center mb-16 relative z-10">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-6 uppercase">
                   <div className="p-4 bg-blue-50 text-blue-600 rounded-[22px] shadow-inner group-hover:scale-110 transition-transform"><Layers size={28} /></div>
                   Personal Roadmap
                </h3>
                <span className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 border-indigo-100 shadow-sm">82% Cycle Health</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {pathwayGoals.map((goal, i) => (
                  <div key={i} className={`p-8 md:p-10 rounded-[48px] border-4 transition-all duration-700 group/item ${goal.status === 'Active' ? 'bg-blue-600 text-white border-blue-600 shadow-2xl scale-[1.03]' : 'bg-slate-50 border-slate-50 hover:bg-white hover:border-blue-100 hover:shadow-xl'}`}>
                     <div className="flex justify-between items-start mb-10">
                        <span className={`text-[8px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full ${goal.status === 'Active' ? 'bg-white/20' : 'bg-slate-200 text-slate-500'}`}>{goal.status}</span>
                        <Clock size={20} className={goal.status === 'Active' ? 'text-white' : 'text-slate-300'} />
                     </div>
                     <h4 className="text-2xl font-black mb-2 group-hover/item:translate-x-2 transition-transform uppercase leading-tight tracking-tighter">{goal.title}</h4>
                     <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${goal.status === 'Active' ? 'text-blue-100' : 'text-slate-400'}`}>{goal.node} • {goal.time}</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
            <div className="glass-card p-10 rounded-[56px] border-none card-hover-effect shadow-2xl bg-white group">
              <div className="flex justify-between items-start mb-10">
                 <div className="p-5 bg-blue-50 text-blue-600 rounded-[22px] group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner"><TrendingUp size={28} /></div>
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+0.2 Velocity</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 leading-none">GPA Performance</p>
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">3.90</h3>
            </div>
            <div className="glass-card p-10 rounded-[56px] border-none card-hover-effect shadow-2xl bg-white group">
              <div className="flex justify-between items-start mb-10">
                 <div className="p-5 bg-indigo-50 text-indigo-600 rounded-[22px] group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner"><Activity size={28} /></div>
                 <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Optimal Node</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 leading-none">Presence Index</p>
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">98%</h3>
            </div>
            <div className="glass-card p-10 rounded-[56px] border-none card-hover-effect shadow-2xl bg-white group">
              <div className="flex justify-between items-start mb-10">
                 <div className="p-5 bg-emerald-50 text-emerald-600 rounded-[22px] group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner"><Bot size={28} /></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier Ranking</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 leading-none">Institutional Rank</p>
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">#04</h3>
            </div>
          </div>

          {/* Neural Research Node */}
          <div className="glass-card rounded-[64px] p-12 md:p-16 bg-white shadow-2xl border-none relative overflow-hidden group">
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-8">
                <div className="p-6 bg-blue-600 text-white rounded-[32px] shadow-[0_20px_40px_-10px_#2563eb] group-hover:rotate-12 transition-transform duration-700"><Search size={36} /></div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Research Grounding</h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mt-3 italic">Verified Neural Repository 2026</p>
                </div>
              </div>
              <Sparkles className="text-blue-500 animate-glow-pulse hidden md:block" size={48} />
            </div>
            <div className="relative mb-14 group/input">
              <input 
                type="text" 
                value={researchQuery} 
                onChange={(e) => setResearchQuery(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleResearch()} 
                placeholder="Query verified global repositories..." 
                className="w-full pl-10 md:pl-12 pr-40 md:pr-56 py-7 md:py-9 bg-slate-50 border-4 border-slate-50 rounded-[48px] focus:ring-[16px] focus:ring-blue-100/50 outline-none transition-all font-black text-slate-800 text-xl md:text-2xl placeholder:text-slate-200 shadow-inner" 
              />
              <button 
                onClick={handleResearch} 
                disabled={isResearching || !researchQuery.trim()} 
                className="absolute right-4 top-4 bottom-4 bg-slate-900 text-white px-10 md:px-14 rounded-[36px] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-blue-600 disabled:opacity-50 transition-all duration-700 flex items-center justify-center gap-4 active:scale-95 shadow-2xl"
              >
                {isResearching ? <Activity className="animate-spin" size={20} /> : "Query Hub"}
              </button>
            </div>
            {researchResult && (
              <div className="bg-slate-50/80 backdrop-blur-md rounded-[56px] p-10 md:p-14 border border-slate-100 animate-in zoom-in-95 duration-1000 shadow-inner">
                <div className="prose prose-slate max-w-none mb-12">
                  <div className="flex items-start gap-8">
                    <Quote className="text-blue-200 rotate-180 flex-shrink-0" size={48} />
                    <p className="text-slate-700 leading-loose font-bold text-xl md:text-2xl italic selection:bg-blue-200">"{researchResult.text}"</p>
                  </div>
                </div>
                {researchResult.sources.length > 0 && (
                  <div className="flex flex-wrap gap-4 pt-10 border-t border-slate-200">
                    {researchResult.sources.map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 px-8 py-4 bg-white border-2 border-slate-100 rounded-[28px] text-[10px] font-black text-blue-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 shadow-sm group/link">
                        <span className="truncate max-w-[200px]">{s.title}</span>
                        <ExternalLink size={16} className="group-hover/link:rotate-45 transition-transform duration-500" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* AI Tutor Chat Deck */}
        <div className="space-y-12">
          <div className="glass-card p-10 md:p-12 rounded-[64px] flex flex-col h-[700px] md:h-[950px] border-none bg-white shadow-2xl overflow-hidden relative instructional-glow">
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div className="flex items-center gap-6 text-indigo-700">
                <div className="p-4 bg-indigo-50 rounded-[22px] shadow-inner"><MessageSquare size={28} /></div>
                <h4 className="font-black tracking-tighter text-2xl uppercase leading-none">Neural Tutor</h4>
              </div>
              <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                 <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-glow-pulse shadow-lg"></div>
                 <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Active</span>
              </div>
            </div>
            
            <div ref={scrollRef} className="flex-1 bg-slate-950 rounded-[48px] p-8 md:p-10 text-blue-50 text-sm md:text-base overflow-y-auto mb-10 font-medium leading-relaxed shadow-inner scrollbar-hide">
              <div className="space-y-8">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg"><Bot size={20} className="text-white"/></div>
                    <div className="bg-white/10 p-6 rounded-[28px] border border-white/5 max-w-[85%] italic">
                       {aiMessage}
                    </div>
                 </div>
                 {isTyping && (
                   <div className="flex gap-4 animate-in fade-in">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0"><Bot size={20} className="text-white animate-pulse"/></div>
                      <div className="bg-white/5 p-6 rounded-[28px] flex gap-3 items-center">
                         <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                         <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                         <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                      </div>
                   </div>
                 )}
              </div>
            </div>
            
            <div className="relative group/chat">
              <input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                type="text" 
                placeholder="Message your academic tutor..." 
                className="w-full pl-8 pr-32 py-7 bg-slate-50 border-4 border-slate-50 rounded-[40px] text-base font-black outline-none focus:ring-[16px] focus:ring-indigo-100 transition-all shadow-xl placeholder:text-slate-300" 
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3">
                 <button className="p-4 text-slate-300 hover:text-indigo-600 transition-colors"><Mic size={20}/></button>
                 <button onClick={handleSend} className="bg-indigo-600 text-white p-4 rounded-[22px] hover:bg-slate-900 transition-all active:scale-90 shadow-xl group-hover/chat:shadow-indigo-200"><Send size={22} /></button>
              </div>
            </div>
            <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest mt-6">Neural Link Secured • EduPulse 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentView;