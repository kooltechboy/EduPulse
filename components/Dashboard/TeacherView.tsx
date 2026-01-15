import React, { useState, useEffect } from 'react';
import { 
  Users, Sparkles, 
  ChevronRight, CheckCircle2, GitBranch, Activity,
  Zap, Wand2, X, ShieldCheck, Laptop, 
  Shapes, Handshake, Send, Calendar, MapPin, UserCheck, Star,
  MessageSquareText, MessageCircleCode
} from 'lucide-react';
import { getAIPredictiveInsights, generateSmartPrep, generateLessonRecapVideo } from '../../services/geminiService';
import { Syllabus, CurriculumModule, HRRequest, TeacherEvaluation } from '../../types';

const TeacherView: React.FC = () => {
  const [aiInsight, setAiInsight] = useState("Analyzing class flow architecture...");
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);
  const [isHRModalOpen, setIsHRModalOpen] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoStatus, setVideoStatus] = useState("");
  const [planDraft, setPlanDraft] = useState('');
  const [activeSyllabus, setActiveSyllabus] = useState<Syllabus | null>(null);
  const [selectedModule, setSelectedModule] = useState<CurriculumModule | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  
  const [hrRequests, setHrRequests] = useState<HRRequest[]>(() => JSON.parse(localStorage.getItem('edupulse_hr_requests') || '[]'));
  const [evaluations, setEvaluations] = useState<TeacherEvaluation[]>(() => JSON.parse(localStorage.getItem('edupulse_evals') || '[]'));

  useEffect(() => {
    const savedSyllabi = localStorage.getItem('edupulse_syllabi');
    if (savedSyllabi) {
      const syllabi: Syllabus[] = JSON.parse(savedSyllabi);
      setActiveSyllabus(syllabi[0]);
      if (syllabi[0]?.modules?.length > 0) setSelectedModule(syllabi[0].modules[0]);
    }
    const fetchInsight = async () => {
      const insight = await getAIPredictiveInsights({ class: '10-A', avgAttendance: 92, lastTestAvg: 78 });
      setAiInsight(insight);
    };
    fetchInsight();
  }, []);

  const handleLessonPrep = async () => {
    if (!selectedModule) return;
    setIsAIGenerating(true);
    setIsPrepModalOpen(true);
    const prep = await generateSmartPrep(selectedModule, activeSyllabus?.gradeLevel || 'Secondary');
    setPlanDraft(prep);
    setIsAIGenerating(false);
  };

  const handleSynthesizeVideo = async () => {
    if (!selectedModule) return;
    setIsVideoGenerating(true);
    setVideoStatus("Initializing Veo 3.1 Pro...");
    const url = await generateLessonRecapVideo(selectedModule.title, selectedModule.summary, setVideoStatus);
    setGeneratedVideoUrl(url);
    setIsVideoGenerating(false);
  };

  const handleHRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newReq: HRRequest = {
      id: `HR-${Date.now()}`,
      staffId: 'TCH001',
      staffName: 'Professor Mitchell',
      type: formData.get('type') as any,
      description: formData.get('description') as string,
      status: 'PendingCoord',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newReq, ...hrRequests];
    setHrRequests(updated);
    localStorage.setItem('edupulse_hr_requests', JSON.stringify(updated));
    setIsHRModalOpen(false);
  };

  const handleWhatsAppQuickDispatch = (subject: string) => {
    const mockNumber = '9876543210';
    const url = `https://wa.me/${mockNumber}?text=${encodeURIComponent(`EduPulse Faculty Notice: Regarding ${subject}...`)}`;
    window.open(url, '_blank');
  };

  const myEvaluations = evaluations.filter(ev => ev.teacherName === 'Professor Mitchell');

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">Faculty Desk</h2>
          <p className="text-slate-500 font-black italic uppercase text-[11px] tracking-[0.5em] flex items-center gap-4">
            <UserCheck size={18} className="text-blue-500" /> Prof. Mitchell • Senior Academic Interface
          </p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button 
            onClick={() => handleWhatsAppQuickDispatch('Cycle Assessment')} 
            className="flex-1 md:flex-none px-8 py-6 rounded-[32px] bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl hover:bg-emerald-600 transition-all"
            >
                <MessageCircleCode size={22} /> WhatsApp Dispatch
            </button>
            <button 
            onClick={handleLessonPrep} 
            disabled={!activeSyllabus}
            className={`flex-1 md:flex-none px-12 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-5 shadow-2xl transition-all duration-700 ${activeSyllabus ? 'bg-slate-900 text-white hover:bg-blue-600 hover:translate-y-[-6px]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
            <Laptop size={22} className="text-blue-400" /> Roadmap Sync
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="glass-card p-12 md:p-14 rounded-[64px] bg-white border-none shadow-2xl relative overflow-hidden group">
             <div className="flex items-center gap-6 mb-16">
                <div className="p-5 bg-blue-50 text-blue-600 rounded-[28px] shadow-inner group-hover:scale-110 transition-all">
                   <Activity size={32} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Instructional Workload</h3>
             </div>
             
             <div className="grid grid-cols-1 gap-8">
                {[
                  { name: 'Advanced Calculus', room: 'B-102', code: 'MATH-12A', progress: 85, students: 24, color: 'blue' },
                  { name: 'Quantum Physics', room: 'Lab 4', code: 'PHYS-12B', progress: 62, students: 18, color: 'indigo' }
                ].map((cls, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-10 bg-slate-50/50 rounded-[48px] border-2 border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl transition-all duration-700 cursor-pointer group/item gap-8">
                     <div className="flex items-center gap-10">
                        <div className={`w-20 h-20 bg-white rounded-[32px] flex items-center justify-center text-${cls.color}-600 shadow-xl group-hover/item:bg-slate-900 group-hover/item:text-white transition-all`}>
                          <Shapes size={36} />
                        </div>
                        <div>
                           <h4 className="text-2xl font-black text-slate-900 leading-none mb-3 uppercase tracking-tighter">{cls.name}</h4>
                           <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <span className="flex items-center gap-2"><MapPin size={12} className="text-blue-500"/> {cls.room}</span>
                              <span className="flex items-center gap-2"><Users size={12} className="text-indigo-500"/> {cls.students} Learners</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <button onClick={(e) => { e.stopPropagation(); handleWhatsAppQuickDispatch(cls.name); }} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all">
                           <MessageCircleCode size={20} />
                        </button>
                        <button className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                           <MessageSquareText size={20} />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="glass-card p-12 md:p-14 rounded-[64px] bg-white border-none shadow-2xl">
             <div className="flex items-center gap-6 mb-14">
                <div className="p-5 bg-indigo-50 text-indigo-600 rounded-[28px] shadow-inner"><ShieldCheck size={32} /></div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Institutional Audit Records</h3>
             </div>
             <div className="space-y-8">
                {myEvaluations.map(ev => (
                  <div key={ev.id} className="p-10 bg-slate-50 rounded-[48px] border-2 border-transparent hover:border-indigo-100 hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
                     <div className="flex justify-between items-start mb-10">
                        <div>
                           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-3">Cycle Audit Node</p>
                           <h4 className="text-3xl font-black text-slate-900 leading-none tracking-tighter uppercase">Term Check: {ev.date}</h4>
                        </div>
                        <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-full shadow-xl border border-indigo-50">
                           <Star className="text-amber-400 fill-amber-400" size={22} />
                           <span className="text-2xl font-black text-slate-900">{((ev.scores.planning + ev.scores.management + ev.scores.assessment + ev.scores.professionalism) / 4).toFixed(1)}</span>
                        </div>
                     </div>
                     <div className="p-10 bg-white/60 backdrop-blur-md rounded-[40px] border border-white text-lg font-bold text-slate-600 italic leading-relaxed shadow-inner">
                        "{ev.feedback}"
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="glass-card-dark p-12 rounded-[64px] flex flex-col shadow-2xl relative overflow-hidden group neural-glow animate-float">
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-14">
                <div className="bg-white/10 p-5 rounded-[22px] backdrop-blur-3xl shadow-inner border border-white/20"><Zap size={36} className="text-amber-400" /></div>
                <div>
                  <h4 className="font-black text-3xl leading-none text-white tracking-tighter uppercase">Neural Desk</h4>
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.5em] mt-3">Predictive Insights</p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[48px] border border-white/10 shadow-inner mb-12">
                 <p className="text-blue-50 italic text-lg leading-relaxed font-medium opacity-90">"{aiInsight}"</p>
              </div>
              <button className="w-full bg-white text-indigo-700 font-black py-7 rounded-[32px] text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-4 group/btn">
                Export Dashboard Delta <ChevronRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          <div className="glass-card p-12 rounded-[64px] bg-white shadow-2xl border-none">
            <h4 className="font-black text-slate-900 uppercase tracking-[0.4em] text-[11px] mb-12 flex items-center gap-5">
               <Handshake size={20} className="text-indigo-600" /> Hub Synchronization
            </h4>
            <div className="space-y-6">
               <button onClick={() => setIsHRModalOpen(true)} className="w-full py-7 px-10 rounded-[32px] bg-slate-50 text-slate-700 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-between group active:scale-[0.98] shadow-sm">
                  <span className="flex items-center gap-6"><Send size={22} /> HR Flow Request</span>
                  <ChevronRight size={22} className="opacity-40 group-hover:translate-x-2 transition-transform" />
               </button>
               <button className="w-full py-7 px-10 rounded-[32px] bg-slate-50 text-slate-700 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all flex items-center justify-between group active:scale-[0.98] shadow-sm">
                  <span className="flex items-center gap-6"><Calendar size={22} /> Node Booking</span>
                  <ChevronRight size={22} className="opacity-40" />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* HR MODAL REMAINS THE SAME... */}
      {isHRModalOpen && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setIsHRModalOpen(false)}></div>
          <form onSubmit={handleHRSubmit} className="relative w-full max-w-3xl bg-white rounded-[64px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-24 duration-700 flex flex-col">
             <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <div>
                   <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Admin Transmission</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-3">Identity Node Protocol</p>
                </div>
                <button type="button" onClick={() => setIsHRModalOpen(false)} className="p-6 bg-slate-50 rounded-full hover:bg-slate-100 transition-all active:scale-90"><X size={32} /></button>
             </div>
             <div className="p-14 space-y-12 bg-slate-50/20 overflow-y-auto scrollbar-hide max-h-[75vh]">
                <div className="space-y-5">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] px-5">Request Mapping</label>
                   <select name="type" className="w-full px-10 py-7 bg-white border-4 border-slate-50 rounded-[40px] font-black text-xl outline-none cursor-pointer focus:border-indigo-400 shadow-xl transition-all">
                      <option value="Leave">Time Off Cycle</option>
                      <option value="Expense">Fiscal Reimbursement</option>
                      <option value="Training">Career Growth Unit</option>
                      <option value="Grievance">Institutional Audit</option>
                   </select>
                </div>
                <div className="space-y-5">
                   <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] px-5">Narrative Context</label>
                   <textarea name="description" required placeholder="Detailed contextual narrative..." className="w-full h-56 px-12 py-12 bg-white border-4 border-slate-50 rounded-[56px] font-bold text-slate-900 outline-none focus:border-indigo-400 transition-all shadow-inner resize-none text-xl leading-relaxed placeholder:text-slate-200" />
                </div>
             </div>
             <div className="p-12 bg-white border-t border-slate-100">
                <button type="submit" className="w-full py-8 bg-indigo-600 text-white font-black rounded-[36px] text-xs uppercase tracking-[0.6em] shadow-2xl shadow-indigo-200 hover:bg-slate-900 transition-all duration-700 flex items-center justify-center gap-6 active:scale-95">Dispatch Request <Send size={24} /></button>
             </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherView;