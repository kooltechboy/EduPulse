import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Users, BookOpen, Clock, AlertCircle, Sparkles, FileUp, 
  Send, ChevronRight, CheckCircle2, GitBranch, Activity, MessageSquare,
  Zap, Save, Wand2, X, ShieldCheck, Paperclip, Trash2, Smartphone,
  Presentation, Shapes, Laptop, Library, Target,
  Handshake, Heart, UserCheck, Star, ArrowLeft, Video, Film, Play
} from 'lucide-react';
import { getAIPredictiveInsights, generateSmartPrep, generateLessonRecapVideo } from '../../services/geminiService';
import { Syllabus, CurriculumModule, HRRequest, TeacherEvaluation } from '../../types';

const TeacherView: React.FC = () => {
  const [aiInsight, setAiInsight] = useState("Analyzing class performance...");
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
    setVideoStatus("Initializing Veo 3.1...");
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
    alert("Request dispatched to Tier Coordinator.");
  };

  const myEvaluations = evaluations.filter(ev => ev.teacherName === 'Professor Mitchell');

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500 px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Teacher's Desk</h2>
          <p className="text-slate-500 font-bold italic mt-2 uppercase text-[9px] md:text-[10px] tracking-[0.3em]">Faculty Performance • Professor Mitchell</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={handleLessonPrep} 
            disabled={!activeSyllabus}
            className={`flex-1 md:flex-none px-6 md:px-8 py-4 rounded-[20px] md:rounded-[24px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-all ${activeSyllabus ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
             <Laptop size={18} className="text-blue-400" /> <span className="whitespace-nowrap">Master Prep</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        <div className="lg:col-span-2 space-y-8 md:space-y-10">
          <div className="glass-card p-8 md:p-12 rounded-[40px] md:rounded-[64px] bg-white border-none shadow-xl relative overflow-hidden group instructional-glow">
             <div className="flex justify-between items-center mb-8 md:mb-10">
                <div className="flex items-center gap-4">
                   <div className="p-3 md:p-4 bg-blue-50 text-blue-600 rounded-2xl md:rounded-3xl shadow-inner"><Activity size={24} /></div>
                   <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">Academic Load</h3>
                </div>
             </div>
             
             <div className="grid grid-cols-1 gap-4 md:gap-6">
                {[
                  { name: 'Advanced Mathematics', room: 'B-102', code: 'MATH-12A', progress: 85 },
                  { name: 'Quantum Physics', room: 'Lab 4', code: 'PHYS-12B', progress: 62 }
                ].map((cls, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 bg-slate-50 rounded-[32px] md:rounded-[48px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer group/item gap-4 md:gap-0">
                     <div className="flex items-center gap-6 md:gap-8">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-[24px] flex items-center justify-center text-blue-600 shadow-lg group-hover/item:bg-slate-900 group-hover/item:text-white transition-all"><Shapes size={24} /></div>
                        <div>
                           <h4 className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1 md:mb-2 uppercase">{cls.name}</h4>
                           <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{cls.code} • {cls.room}</p>
                        </div>
                     </div>
                     <div className="flex flex-col sm:items-end">
                        <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2">{cls.progress}% syllabus sync</span>
                        <div className="w-full sm:w-40 bg-white h-2 rounded-full overflow-hidden shadow-inner border border-slate-100 p-0.5">
                           <div className="bg-blue-600 h-full rounded-full animate-glow-pulse" style={{ width: `${cls.progress}%` }}></div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="glass-card p-8 md:p-10 rounded-[40px] md:rounded-[56px] bg-white border-none shadow-xl">
             <div className="flex items-center gap-4 mb-8 md:mb-10">
                <div className="p-3 md:p-4 bg-indigo-50 text-indigo-600 rounded-2xl md:rounded-3xl"><UserCheck size={24} /></div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">Audit Record</h3>
             </div>
             <div className="space-y-4 md:space-y-6">
                {myEvaluations.map(ev => (
                  <div key={ev.id} className="p-6 md:p-8 bg-slate-50 rounded-[32px] md:rounded-[40px] border border-slate-100 hover:shadow-lg transition-all relative overflow-hidden group">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">Supervision Dossier</p>
                           <h4 className="text-lg md:text-xl font-black text-slate-900 leading-none">Cycle: {ev.date}</h4>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-xl md:rounded-2xl shadow-sm">
                           <Star className="text-amber-400 fill-amber-400" size={14} />
                           <span className="text-base md:text-lg font-black text-slate-900">{((ev.scores.planning + ev.scores.management + ev.scores.assessment + ev.scores.professionalism) / 4).toFixed(1)}</span>
                        </div>
                     </div>
                     <div className="p-5 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-100 text-xs md:text-sm font-bold text-slate-600 italic leading-relaxed">
                        "{ev.feedback}"
                     </div>
                  </div>
                ))}
                {myEvaluations.length === 0 && (
                  <div className="text-center py-12 md:py-20 border-4 border-dashed border-slate-50 rounded-[40px] md:rounded-[48px]">
                    <p className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">No supervision records found.</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 md:p-10 rounded-[40px] md:rounded-[56px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
            <Sparkles className="absolute -right-4 -top-4 text-white/10 w-48 h-48 group-hover:scale-110 transition-transform duration-[2000ms]" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8 md:mb-10">
                <div className="bg-white/10 p-3 md:p-4 rounded-2xl backdrop-blur-md shadow-inner"><Zap size={28} className="text-amber-400" /></div>
                <div><h4 className="font-black text-xl leading-none uppercase">Neural Strategist</h4></div>
              </div>
              <p className="text-blue-50 italic text-sm leading-relaxed font-medium mb-10">"{aiInsight}"</p>
              <button className="w-full bg-white text-indigo-700 font-black py-4 md:py-5 rounded-[20px] md:rounded-[28px] text-[10px] uppercase tracking-[0.2em] shadow-xl">Export Insights</button>
            </div>
          </div>

          <div className="glass-card p-8 md:p-10 rounded-[40px] md:rounded-[56px] bg-white shadow-2xl border-none">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] md:text-[11px] mb-8 flex items-center gap-4">
               <div className="p-2 bg-indigo-50 rounded-xl"><Handshake size={18} className="text-indigo-600" /></div>
               Institutional Services
            </h4>
            <div className="space-y-3">
               <button onClick={() => setIsHRModalOpen(true)} className="w-full py-5 md:py-6 px-6 md:px-8 rounded-[24px] md:rounded-[28px] bg-slate-50 text-slate-700 text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-between group active:scale-[0.98]">
                  <span className="flex items-center gap-4"><Send size={18} /> Preliminary Request</span>
                  <ChevronRight size={18} className="opacity-40" />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* SYLLABUS MASTER PREP MODAL - FULL SHEET ON MOBILE */}
      {isPrepModalOpen && activeSyllabus && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center md:p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-3xl" onClick={() => setIsPrepModalOpen(false)}></div>
          <div className="relative w-full h-full md:h-auto md:max-w-6xl bg-white md:rounded-[64px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 flex flex-col max-h-screen md:max-h-[92vh]">
             <div className="p-8 md:p-12 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <div className="flex items-center gap-4 md:gap-8">
                   <div className="p-4 md:p-6 bg-blue-600 text-white rounded-2xl md:rounded-[32px] shadow-2xl"><Laptop size={28} className="md:w-10 md:h-10" /></div>
                   <div>
                      <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Master Prep</h3>
                      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] md:max-w-none">{activeSyllabus.subject}</p>
                   </div>
                </div>
                <button onClick={() => setIsPrepModalOpen(false)} className="p-4 md:p-5 bg-slate-100 rounded-2xl md:rounded-3xl hover:bg-slate-200 transition-all"><X size={24} /></button>
             </div>
             
             <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/20">
                <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 overflow-y-auto p-6 md:p-8 space-y-4 scrollbar-hide flex-shrink-0">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Milestones</p>
                   <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible scrollbar-hide">
                     {activeSyllabus.modules.map((mod, i) => (
                       <button 
                        key={i} 
                        onClick={() => setSelectedModule(mod)}
                        className={`flex-shrink-0 md:flex-shrink-1 w-48 md:w-full p-4 md:p-6 rounded-[24px] md:rounded-[32px] text-left transition-all border-2 flex flex-col gap-1 md:gap-2 group ${selectedModule?.title === mod.title ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-white text-slate-500 border-white hover:border-blue-100 hover:bg-blue-50/50'}`}
                       >
                          <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-60">{mod.weekRange}</span>
                          <span className="font-black text-xs md:text-sm tracking-tight leading-tight group-hover:text-blue-500 transition-colors line-clamp-1">{mod.title}</span>
                       </button>
                     ))}
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide">
                   {isAIGenerating || isVideoGenerating ? (
                     <div className="h-full flex flex-col items-center justify-center gap-6 py-12">
                        <Activity size={48} className="text-blue-500 animate-spin md:w-16 md:h-16" />
                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px]">{isVideoGenerating ? videoStatus : 'Neural Prep active...'}</p>
                     </div>
                   ) : (
                     <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                           <div className="max-w-xl">
                              <h4 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2 md:mb-4">{selectedModule?.title}</h4>
                              <p className="text-slate-500 font-bold italic text-base md:text-lg">"{selectedModule?.summary}"</p>
                           </div>
                           <div className="flex gap-3 w-full md:w-auto">
                              <button onClick={handleSynthesizeVideo} className="flex-1 md:flex-none bg-indigo-600 text-white px-5 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 shadow-xl hover:bg-indigo-700 transition-all">
                                 <Film size={16} /> Synthesize
                              </button>
                              <button onClick={handleLessonPrep} className="flex-1 md:flex-none bg-slate-900 text-white px-5 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 shadow-xl hover:bg-blue-600 transition-all">
                                 <Sparkles size={16} className="text-blue-400" /> Neural Prep
                              </button>
                           </div>
                        </div>

                        {generatedVideoUrl && (
                           <div className="glass-card p-3 md:p-4 rounded-[32px] md:rounded-[48px] bg-slate-900 border-none shadow-2xl overflow-hidden aspect-video relative group">
                              <video src={generatedVideoUrl} controls className="w-full h-full rounded-[24px] md:rounded-[36px]" />
                              <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 md:gap-3 bg-indigo-600/80 backdrop-blur-md px-4 md:px-5 py-2 rounded-full border border-white/20">
                                 <Zap size={12} className="text-white" />
                                 <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">Veo 3.1 Fast</span>
                              </div>
                           </div>
                        )}

                        {planDraft && (
                           <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-white border-none shadow-xl prose prose-slate max-w-none">
                              <div className="flex items-center gap-4 mb-8 md:mb-10 border-b border-slate-100 pb-6">
                                 <div className="p-2 md:p-3 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl"><Target size={20} /></div>
                                 <h5 className="font-black text-slate-900 uppercase tracking-widest text-[10px] md:text-xs">AI Pathways</h5>
                              </div>
                              <div className="font-bold text-slate-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                                 {planDraft}
                              </div>
                           </div>
                        )}
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* HR REQUEST MODAL - FULL SHEET ON MOBILE */}
      {isHRModalOpen && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center md:p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsHRModalOpen(false)}></div>
          <form onSubmit={handleHRSubmit} className="relative w-full h-full md:h-auto md:max-w-2xl bg-white md:rounded-[48px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 flex flex-col max-h-screen md:max-h-[92vh]">
             <div className="p-8 md:p-12 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Service Request</h3>
                <button type="button" onClick={() => setIsHRModalOpen(false)} className="p-4 md:p-5 bg-slate-100 rounded-2xl md:rounded-3xl hover:bg-slate-200 transition-all"><X size={24} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 md:space-y-10 bg-slate-50/20 scrollbar-hide">
                <div className="space-y-3">
                   <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Category</label>
                   <select name="type" className="w-full px-6 md:px-8 py-4 md:py-5 bg-white border-2 border-slate-100 rounded-[24px] md:rounded-[32px] font-bold outline-none cursor-pointer focus:border-indigo-400 shadow-sm transition-all">
                      <option value="Leave">Time Off / Leave</option>
                      <option value="Expense">Financial Reimbursement</option>
                      <option value="Training">Career Development</option>
                   </select>
                </div>
                <div className="space-y-3">
                   <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Description / Narrative</label>
                   <textarea name="description" required className="w-full h-40 md:h-48 px-6 md:px-10 py-6 md:py-10 bg-white border-2 border-slate-100 rounded-[32px] md:rounded-[48px] font-bold text-slate-900 outline-none focus:border-indigo-400 transition-all shadow-inner resize-none text-base md:text-lg leading-relaxed" />
                </div>
             </div>
             <div className="p-8 md:p-12 bg-white border-t border-slate-100">
                <button type="submit" className="w-full py-5 md:py-7 bg-indigo-600 text-white font-black rounded-[24px] md:rounded-[32px] text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-2xl hover:translate-y-[-4px] transition-all flex items-center justify-center gap-4 md:gap-5">Dispatch Protocol <Send size={20} /></button>
             </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherView;