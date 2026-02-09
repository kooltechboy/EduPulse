
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Sparkles, 
  ChevronRight, CheckCircle2, GitBranch, Activity,
  Zap, Wand2, X, ShieldCheck, Laptop, 
  Shapes, Handshake, Send, Calendar, MapPin, UserCheck, Star,
  MessageSquareText, MessageCircleCode, Clock, BookOpen, AlertCircle,
  MonitorPlay, ArrowRight, RefreshCw, Mic, Timer, BrainCircuit, PauseCircle
} from 'lucide-react';
import { getAIPredictiveInsights, interpretVoiceCommand } from '../../services/geminiService';
import { Syllabus } from '../../types';

const TeacherView: React.FC = () => {
  const [aiInsight, setAiInsight] = useState("Analyzing faculty node telemetry...");
  const [activeSyllabus, setActiveSyllabus] = useState<Syllabus | null>(null);
  
  // Voice Command State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const savedSyllabi = localStorage.getItem('edupulse_syllabi');
    if (savedSyllabi) {
      const syllabi: Syllabus[] = JSON.parse(savedSyllabi);
      setActiveSyllabus(syllabi[0]);
    }
    const fetchInsight = async () => {
      // Fallback data provided directly in UI if service fails, this is just simulation
      try {
        const insight = await getAIPredictiveInsights({ class: '12-A', avgAttendance: 96, lastTestAvg: 88 });
        setAiInsight(insight);
      } catch (e) {
        setAiInsight("Telemetry Offline. Using cached heuristics.");
      }
    };
    fetchInsight();

    // Cleanup voice on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceTranscript(transcript);
        setIsListening(false);
        processVoiceCommand(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } else {
      alert("Voice input not supported in this browser environment.");
    }
  };

  const processVoiceCommand = async (text: string) => {
    setCommandFeedback("Processing Neural Intent...");
    try {
      const result = await interpretVoiceCommand(text);
      if (result?.action) {
        setCommandFeedback(`Executing: ${result.confirmation || result.action}`);
        setTimeout(() => {
          setCommandFeedback(null);
          setVoiceTranscript('');
        }, 3000);
      } else {
        setCommandFeedback("Intent not recognized. Please retry.");
        setTimeout(() => setCommandFeedback(null), 2000);
      }
    } catch (e) {
      setCommandFeedback("Neural Link Error.");
      setTimeout(() => setCommandFeedback(null), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-32 relative px-4 md:px-0">
      
      {/* HEADER: GREETING & STATUS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">Faculty Station</h2>
          <p className="text-slate-500 font-bold italic uppercase text-[10px] tracking-[0.4em] flex items-center gap-4">
            <UserCheck size={16} className="text-blue-600" /> Professor Mitchell • Senior Interface
          </p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
           {/* VOICE COMMAND FAB */}
           <button 
             onClick={startListening}
             className={`px-8 py-4 rounded-[28px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center gap-4 border ${isListening ? 'bg-rose-600 text-white border-rose-600 animate-pulse' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}
           >
             {isListening ? <Mic size={18} className="animate-bounce" /> : <Mic size={18} className="text-blue-600" />}
             {isListening ? 'Listening...' : 'Voice Command'}
           </button>
        </div>
      </div>

      {/* COMPACT FOCUS MODE: PERSISTENT WIDGET */}
      <div className="w-full bg-slate-900 rounded-[32px] p-6 shadow-xl relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none"></div>
         
         <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50">
               <Timer size={24} className="text-white animate-pulse" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-1">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Active Session</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
               </div>
               <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none">Advanced Calculus</h3>
               <p className="text-slate-400 font-bold text-xs flex items-center gap-3 mt-1">
                  <MapPin size={12} /> Room B-102 • 45m Remaining
               </p>
            </div>
         </div>

         <div className="flex gap-3 w-full md:w-auto relative z-10">
            <button className="flex-1 md:flex-none px-6 py-3 bg-white/10 text-white border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
               <PauseCircle size={14} /> Pause
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
               Launch LMS <ArrowRight size={14} />
            </button>
         </div>
      </div>

      {/* VOICE FEEDBACK OVERLAY */}
      {(voiceTranscript || commandFeedback) && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-10 fade-in duration-500">
           <div className="bg-slate-900/90 backdrop-blur-xl text-white px-10 py-6 rounded-[40px] shadow-2xl flex items-center gap-6 border border-white/10">
              <div className="p-3 bg-blue-600 rounded-full animate-pulse shadow-lg"><BrainCircuit size={24} /></div>
              <div>
                 <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Neural Command Interface</p>
                 <p className="text-lg font-bold">"{voiceTranscript || commandFeedback}"</p>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* MAIN WORKLOAD FEED */}
        <div className="xl:col-span-2 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Quantum Physics', room: 'Lab 4', code: 'PHYS-12B', next: 'Wave Synthesis', status: 'Prep Req', color: 'indigo' },
                { name: 'Linear Algebra', room: 'A-201', code: 'MATH-11A', next: 'Vector Spaces', status: 'Review', color: 'slate' }
              ].map((cls, i) => (
                <div key={i} className="p-8 bg-white rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group/cls cursor-pointer relative overflow-hidden flex flex-col justify-between h-64">
                   <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className={`p-3 bg-${cls.color === 'slate' ? 'slate-100 text-slate-600' : 'indigo-50 text-indigo-600'} rounded-2xl shadow-sm`}>
                         <BookOpen size={20} />
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${cls.status === 'Prep Req' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>{cls.status}</span>
                   </div>
                   
                   <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none mb-2 group-hover/cls:text-blue-600 transition-colors">{cls.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cls.code} • {cls.room}</p>
                   </div>
                   
                   <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Next: {cls.next}</span>
                      <ArrowRight size={16} className="text-slate-300 group-hover/cls:text-blue-600 transition-colors" />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* SIDEBAR: NEURAL & TASKS */}
        <div className="space-y-8">
           <div className="bg-slate-950 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:scale-125 transition-all duration-[5s]"></div>
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/10 rounded-xl shadow-inner border border-white/10"><Zap size={20} className="text-amber-400" /></div>
                    <h4 className="font-black text-lg uppercase tracking-tighter text-white">Daily Synthesis</h4>
                 </div>
                 <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[24px] border border-white/10 mb-6">
                    <p className="text-slate-300 text-xs leading-relaxed font-medium">"{aiInsight}"</p>
                 </div>
                 <button className="w-full py-4 bg-white text-slate-900 font-black rounded-xl text-[10px] uppercase tracking-[0.3em] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 active:scale-95 group">
                    <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" /> Refresh Logic
                 </button>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-900 uppercase tracking-[0.3em] text-[10px] mb-6 flex items-center gap-3">
                 <AlertCircle size={16} className="text-indigo-600" /> Faculty Queue
              </h4>
              <div className="space-y-4">
                 {[
                   { label: 'Submit HR Dossier', type: 'Admin', due: 'Today', color: 'rose' },
                   { label: 'Upload Term Roadmap', type: 'Curriculum', due: '2d', color: 'blue' },
                   { label: 'Sign Audit Report', type: 'Compliance', due: '5d', color: 'slate' },
                 ].map((t, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 group cursor-pointer hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-all">
                       <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors uppercase leading-none mb-1.5">{t.label}</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.type}</p>
                       </div>
                       <span className={`text-[8px] font-black text-${t.color}-500 bg-${t.color}-50 px-2 py-1 rounded border border-${t.color}-100 uppercase`}>{t.due}</span>
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
