import React, { useState, useEffect } from 'react';
import { 
  Plus, ChevronRight, LayoutGrid, MessageSquare, 
  Zap, Download, Users2, X, Check, Wand2,
  Calendar, Target, ArrowLeft, Send, MoreVertical,
  MonitorPlay, Layers, Bot, Library,
  ArrowRight, Mic, Volume2, Image as ImageIcon, UserX,
  ClipboardCheck, Info, RefreshCw, Sparkles, Activity,
  Clock, FileText, CheckCircle2, Search, Shapes,
  ShieldCheck, Filter, Play, Trash2, Settings2,
  Bookmark, GraduationCap, Eye, Share2, Paperclip,
  Smile, Award, FileUp, Video, ListChecks
} from 'lucide-react';
import { 
  Course, User, UserRole, GradeLevel,
  CourseModule, LessonPlan, PlanningModality, Syllabus, Student
} from '../../types';
import { generateAILessonPlan, getAITutorResponse, generateConceptualVisual } from '../../services/geminiService';

const ClassroomManager: React.FC<{ user: User }> = ({ user }) => {
  const [view, setView] = useState<'dashboard' | 'course'>('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'attendance' | 'vault' | 'ai'>('stream');
  const [planningModality, setPlanningModality] = useState<PlanningModality>(PlanningModality.WEEKLY);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & AI State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [generatedVisual, setGeneratedVisual] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Global Registry Data (Simulated Persistence)
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('edupulse_courses_registry');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'C1', name: 'Advanced Calculus & Topology', code: 'MATH-12A', teacherId: 'TCH001', teacherName: 'Professor Mitchell', 
        gradeLevel: GradeLevel.SENIOR_HIGH, room: 'B-102', students: ['STU-4401', 'STU-2910', 'STU-0882'],
        bannerColor: 'from-blue-600 via-indigo-600 to-violet-700',
        materials: [
          { id: 'M1', title: 'Calculus: The Limit Laws', type: 'Video', url: '#', uploadDate: '2026-05-10', description: 'Institutional lecture on foundations.' }
        ],
        modules: [
          { 
            id: 'MOD-1', title: 'Phase 1: Foundations', description: 'Theoretical boundaries and mapping.', order: 1, 
            plans: [
              { id: 'P1', modality: PlanningModality.WEEKLY, title: 'Week 1: Limits & Continuity', objectives: ['Define epsilon-delta', 'Analyze jump discontinuity'], content: 'Structural overview of limits.', associatedMaterials: ['M1'], status: 'Published' }
            ],
            assignments: [] 
          }
        ],
        liveSessions: []
      }
    ];
  });

  const [syllabi] = useState<Syllabus[]>(() => JSON.parse(localStorage.getItem('edupulse_syllabi') || '[]'));
  const [students] = useState<Student[]>(() => JSON.parse(localStorage.getItem('edupulse_students_registry') || '[]'));

  const isTeacher = user.role === UserRole.TEACHER || user.role === UserRole.ADMIN;
  const isParent = user.role === UserRole.PARENT;

  useEffect(() => {
    localStorage.setItem('edupulse_courses_registry', JSON.stringify(courses));
  }, [courses]);

  const handleEnterCourse = (course: Course) => {
    setSelectedCourse(course);
    setView('course');
    setActiveTab(isParent ? 'classwork' : 'stream');
  };

  const handleAIAssistant = async (type: 'plan' | 'study' | 'visual', data?: any) => {
    setIsAIGenerating(true);
    if (type !== 'visual') setAiResponse(null);
    try {
      if (type === 'plan') {
        const res = await generateAILessonPlan(data.title, data.modality, selectedCourse?.name || 'Advanced Studies');
        setAiResponse(res);
      } else if (type === 'study') {
        const res = await getAITutorResponse(data.query, { student: user.name, subject: selectedCourse?.name });
        setAiResponse(res);
      } else if (type === 'visual') {
        const visual = await generateConceptualVisual(data.prompt);
        setGeneratedVisual(visual);
      }
    } finally {
      setIsAIGenerating(false);
    }
  };

  const syncSyllabusFromCoordination = (sylId: string) => {
    const syl = syllabi.find(s => s.id === sylId);
    if (!syl || !selectedCourse) return;

    const newModules: CourseModule[] = syl.modules.map((m, i) => ({
      id: `MOD-${Date.now()}-${i}`,
      title: m.title,
      description: m.summary,
      order: i + 1,
      plans: [],
      assignments: []
    }));

    const updatedCourse = { ...selectedCourse, modules: newModules };
    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
  };

  const saveLessonPlan = () => {
    if (!selectedCourse || !aiResponse) return;
    const titleInput = document.getElementById('plan_title') as HTMLInputElement;
    const title = titleInput?.value || 'Untitled Plan';
    
    const newPlan: LessonPlan = {
      id: `PLAN-${Date.now()}`,
      modality: planningModality,
      title,
      objectives: ['Institutional Standard'],
      content: aiResponse,
      associatedMaterials: [],
      status: 'Published'
    };

    const updatedModules = [...selectedCourse.modules];
    if (updatedModules.length > 0) {
      const idx = updatedModules.findIndex(m => m.title.includes('Foundations') || m.id === 'MOD-AUTO') || 0;
      const targetIdx = idx === -1 ? 0 : idx;
      if (!updatedModules[targetIdx]) {
        updatedModules.push({
          id: 'MOD-AUTO', title: 'Unit 1: Fundamentals', description: 'Automatic core module generation.', order: 1, plans: [newPlan], assignments: []
        });
      } else {
        updatedModules[targetIdx].plans = [...updatedModules[targetIdx].plans, newPlan];
      }
    } else {
      updatedModules.push({
        id: 'MOD-AUTO', title: 'Unit 1: Fundamentals', description: 'Automatic core module generation.', order: 1, plans: [newPlan], assignments: []
      });
    }

    const updatedCourse = { ...selectedCourse, modules: updatedModules };
    setSelectedCourse(updatedCourse);
    setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c));
    setIsPlanModalOpen(false);
    setAiResponse(null);
  };

  const renderDashboard = () => (
    <div className="space-y-12 animate-in fade-in duration-700 px-4 md:px-0">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-100 w-fit">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Institutional LMS • v2.6</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">Classroom<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Framework</span></h2>
        </div>
        {isTeacher && (
           <button onClick={() => {
              const id = `C-${Date.now()}`;
              const newC: Course = { 
                id, name: 'Astrophysics & Deep Space', code: 'PHYS-402', 
                teacherId: user.id, teacherName: user.name, 
                gradeLevel: GradeLevel.SENIOR_HIGH, room: 'Observatory 1', 
                students: [], modules: [], liveSessions: [], materials: [], 
                bannerColor: 'from-fuchsia-600 via-purple-600 to-indigo-800' 
              };
              setCourses([...courses, newC]);
           }} className="w-full lg:w-auto bg-slate-900 text-white px-10 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.3)] hover:bg-blue-600 hover:translate-y-[-4px] transition-all group">
             <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" /> Register Node
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
        {courses.map(course => (
          <div key={course.id} onClick={() => handleEnterCourse(course)} className="group bg-white rounded-[48px] md:rounded-[64px] overflow-hidden shadow-xl hover:shadow-2xl hover:translate-y-[-8px] transition-all cursor-pointer border border-white/50 relative">
            <div className={`h-48 md:h-60 ${course.bannerUrl ? '' : `bg-gradient-to-br ${course.bannerColor}`} p-8 md:p-12 flex justify-between items-start relative overflow-hidden`}>
               {course.bannerUrl && (
                 <img src={course.bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
               )}
               <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:scale-125 transition-transform duration-1000"></div>
               <div className="bg-white/20 backdrop-blur-xl px-5 md:px-6 py-2 md:py-2.5 rounded-full border border-white/20 relative z-10 shadow-sm">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{course.code}</span>
               </div>
               <div className="p-4 md:p-5 bg-white/10 rounded-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all relative z-10">
                  <ArrowRight size={24} className="text-white" />
               </div>
            </div>
            <div className="p-8 md:p-12 -mt-12 md:-mt-20 bg-white rounded-[48px] md:rounded-[64px] relative z-10 space-y-8 md:space-y-10">
               <div className="space-y-2 md:space-y-3">
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{course.teacherName}</p>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-none tracking-tighter uppercase">{course.name}</h3>
               </div>
               <div className="grid grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-3 md:p-4 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl shadow-inner"><Users2 size={20} /></div>
                    <div>
                       <p className="text-xl md:text-2xl font-black text-slate-900 leading-none">{course.students.length}</p>
                       <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Cohorts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-3 md:p-4 bg-violet-50 text-violet-600 rounded-xl md:rounded-2xl shadow-inner"><Layers size={20} /></div>
                    <div>
                       <p className="text-xl md:text-2xl font-black text-slate-900 leading-none">{course.modules.length}</p>
                       <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Phases</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStream = () => (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-500 pb-24 px-4 md:px-0">
       {isTeacher && selectedCourse?.modules.length === 0 && (
          <div className="glass-card p-8 md:p-14 rounded-[48px] md:rounded-[72px] bg-indigo-50 border-4 border-dashed border-indigo-200 text-center relative overflow-hidden group shadow-2xl">
             <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[32px] md:rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-xl">
                <RefreshCw size={36} className="text-indigo-600 animate-spin-slow" />
             </div>
             <h4 className="text-3xl md:text-4xl font-black text-indigo-950 mb-4 uppercase tracking-tighter">Initialize Instructional Roadmap</h4>
             <p className="text-lg md:text-xl text-indigo-800/70 font-bold mb-10 max-w-lg mx-auto leading-relaxed">Establish the pedagogical baseline by syncing with the validated Institutional Syllabus.</p>
             <div className="flex flex-col items-center gap-6 relative z-10">
                <select onChange={(e) => syncSyllabusFromCoordination(e.target.value)} className="w-full max-w-md px-6 md:px-10 py-5 md:py-6 bg-white border-none rounded-3xl md:rounded-[36px] font-black text-[10px] md:text-xs uppercase tracking-widest outline-none shadow-2xl focus:ring-[12px] focus:ring-indigo-100 transition-all cursor-pointer">
                   <option value="">Select Master Registry...</option>
                   {syllabi.map(s => <option key={s.id} value={s.id}>{s.subject} • {s.gradeLevel}</option>)}
                </select>
             </div>
          </div>
       )}

       <div className="glass-card p-6 md:p-12 rounded-[40px] md:rounded-[64px] bg-white shadow-2xl flex flex-col md:flex-row gap-6 md:gap-10 items-center border-none relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-16 h-16 md:w-24 md:h-24 rounded-[24px] md:rounded-[36px] shadow-2xl border-4 border-white" alt="" />
          <div className="flex-1 relative w-full">
             <input type="text" placeholder="Disseminate institutional pedagogical updates..." className="w-full bg-slate-50 border-none rounded-3xl md:rounded-[40px] pl-6 md:pl-10 pr-20 md:pr-24 py-6 md:py-9 font-bold text-slate-700 outline-none focus:ring-[12px] md:focus:ring-[16px] focus:ring-blue-100/50 transition-all shadow-inner text-base md:text-xl placeholder:text-slate-300" />
             <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2">
                <button className="p-4 md:p-5 bg-slate-900 text-white rounded-2xl md:rounded-3xl hover:bg-blue-600 transition-all shadow-2xl active:scale-95">
                   <Send size={22} className="md:w-7 md:h-7" />
                </button>
             </div>
          </div>
       </div>

       <div className="space-y-8 md:space-y-10">
          <div className="flex items-center justify-between px-6 md:px-10">
             <h4 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.5em]">Instructional Stream</h4>
          </div>
          {[
            { author: 'Professor Mitchell', text: 'Daily Protocol Published: Multivariable Limits Synthesis Node is now active for simulation.', date: '42m ago', type: 'system', icon: <MonitorPlay /> },
            { author: 'LMS Bot', text: 'System Check: All 24 students in Section A have accessed Phase 1 documentation.', date: '3h ago', type: 'bot', icon: <Bot /> }
          ].map((post, i) => (
            <div key={i} className="glass-card p-8 md:p-12 rounded-[40px] md:rounded-[64px] bg-white border-none shadow-xl hover:translate-x-1 md:hover:translate-x-3 transition-all group relative overflow-hidden">
               <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center gap-4 md:gap-6">
                     <div className={`p-4 md:p-5 rounded-2xl md:rounded-[28px] ${post.type === 'system' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'} shadow-inner`}>
                        {post.icon}
                     </div>
                     <div>
                        <h5 className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1 md:mb-2">{post.author}</h5>
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{post.date} • Tier 1 Hub</p>
                     </div>
                  </div>
                  <button className="p-3 md:p-4 text-slate-200 hover:text-blue-600 hover:bg-slate-50 rounded-2xl transition-all"><MoreVertical size={20} /></button>
               </div>
               <div className="p-6 md:p-10 bg-slate-50/50 rounded-3xl md:rounded-[48px] border border-slate-100 relative z-10">
                  <p className="text-lg md:text-2xl font-bold text-slate-700 leading-relaxed italic">"{post.text}"</p>
               </div>
               <div className="mt-8 md:mt-10 flex gap-6 md:gap-8 px-4 md:px-6 relative z-10">
                  <button className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                     <MessageSquare size={16} /> 8 Feedback
                  </button>
                  <button className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-colors">
                     <CheckCircle2 size={16} /> Synced by 32
                  </button>
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  const renderClasswork = () => (
    <div className="max-w-6xl mx-auto space-y-12 md:space-y-16 animate-in slide-in-from-bottom-12 duration-700 pb-32 px-4 md:px-0">
      <div className="flex flex-col xl:flex-row justify-between items-start md:items-end gap-8 md:gap-10">
        <div className="space-y-4">
            <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Instructional Matrix</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Cycle Hierarchy: Term → Monthly → Weekly → Daily</p>
        </div>
        <div className="flex flex-wrap gap-2 bg-white/90 backdrop-blur-2xl p-2 rounded-[28px] md:rounded-[36px] shadow-2xl border border-white w-full md:w-auto overflow-x-auto scrollbar-hide">
            {Object.values(PlanningModality).map(mod => (
              <button key={mod} onClick={() => setPlanningModality(mod)} className={`flex-1 md:flex-none px-6 md:px-12 py-3.5 md:py-5 rounded-2xl md:rounded-[28px] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${planningModality === mod ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'text-slate-400 hover:bg-slate-50'}`}>{mod}</button>
            ))}
        </div>
        {isTeacher && (
          <button onClick={() => setIsPlanModalOpen(true)} className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 md:py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-blue-700 hover:translate-y-[-6px] transition-all flex items-center justify-center gap-4 group">
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" /> Synthesize Node
          </button>
        )}
      </div>

      <div className="space-y-20 md:space-y-32">
        {selectedCourse?.modules.map(module => (
          <div key={module.id} className="space-y-12 md:space-y-16 relative">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 px-4 md:px-8 group">
                <div className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-slate-900 text-white shadow-2xl transform md:rotate-3 group-hover:rotate-0 transition-transform duration-700 group-hover:bg-blue-600"><Shapes size={40} className="md:w-12 md:h-12" /></div>
                <div className="space-y-2">
                  <h4 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{module.title}</h4>
                  <p className="text-base md:text-lg font-bold text-slate-400 italic">"{module.description}"</p>
                </div>
                <div className="hidden md:block flex-1 h-1.5 bg-slate-100 rounded-full mx-10 opacity-40"></div>
                <div className="flex gap-4 self-end md:self-auto">
                   <button className="p-4 md:p-5 bg-white border border-slate-100 rounded-2xl md:rounded-3xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"><Settings2 size={24} /></button>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:gap-12 md:pl-4">
                {module.plans.filter(p => p.modality === planningModality).map(plan => (
                  <div key={plan.id} className="glass-card p-8 md:p-14 rounded-[40px] md:rounded-[80px] bg-white border-none shadow-xl hover:shadow-2xl md:hover:translate-x-6 transition-all group flex flex-col md:flex-row justify-between gap-10 md:gap-16 relative overflow-hidden">
                    <div className="flex items-start gap-8 md:gap-16 flex-1 relative z-10">
                        <div className="p-10 md:p-16 rounded-[32px] md:rounded-[64px] bg-blue-50 text-blue-600 shadow-inner group-hover:scale-105 transition-all duration-700"><MonitorPlay size={48} className="md:w-24 md:h-24" /></div>
                        <div className="flex-1 space-y-6 md:space-y-10">
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="px-5 md:px-8 py-2 md:py-3 bg-indigo-900 text-white rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">{plan.modality} PROTOCOL</span>
                            <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 md:px-6 py-2 md:py-3 rounded-full border border-emerald-100">
                               <CheckCircle2 size={14} className="md:w-5 md:h-5" /> Neural Synced
                            </div>
                          </div>
                          <h5 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors uppercase leading-[0.9]">{plan.title}</h5>
                          <div className="flex flex-wrap gap-3">
                              {plan.objectives.map((obj, i) => (
                                <div key={i} className="px-5 md:px-8 py-3 md:py-4 bg-slate-50 text-slate-500 rounded-2xl md:rounded-[32px] text-[10px] md:text-[12px] font-black uppercase border border-slate-100 shadow-sm flex items-center gap-2 md:gap-3 hover:bg-white transition-colors">
                                   <Target size={16} className="text-blue-500" /> Milestone: {obj}
                                </div>
                              ))}
                          </div>
                          <div className="text-xl md:text-3xl font-bold text-slate-600 italic leading-snug opacity-70 group-hover:opacity-100 transition-opacity line-clamp-2 md:line-clamp-none">
                             "{plan.content}"
                          </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 md:gap-8 relative z-10 w-full md:w-auto">
                      <button className="w-full md:w-auto px-10 md:px-16 py-6 md:py-10 bg-slate-900 text-white rounded-[32px] md:rounded-[48px] font-black text-[11px] md:text-[14px] uppercase tracking-[0.4em] shadow-2xl hover:bg-blue-600 hover:translate-y-[-8px] transition-all flex items-center justify-center gap-4 md:gap-6 group/btn">
                         Execute Node <ChevronRight size={32} className="group-hover/btn:translate-x-3 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
                {module.plans.filter(p => p.modality === planningModality).length === 0 && (
                  <div className="py-24 md:py-56 rounded-[48px] md:rounded-[96px] border-4 border-dashed border-slate-100 text-center bg-slate-50/30 relative group">
                     <Bookmark className="mx-auto text-slate-100 mb-8 transform group-hover:scale-125 transition-transform duration-1000 md:w-[120px] md:h-[120px]" size={80} />
                     <p className="text-slate-400 font-black uppercase text-sm md:text-base tracking-[0.6em] mb-3 px-4">No Active Protocols for this cycle</p>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="max-w-4xl mx-auto space-y-10 md:space-y-12 animate-in fade-in duration-700 pb-32 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Presence Ledger</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-3">Identity Sync Protocol • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
         </div>
         <button className="w-full md:w-auto bg-emerald-600 text-white px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-emerald-700 transition-all active:scale-95">
            Finalize Node Session
         </button>
      </div>

      <div className="glass-card rounded-[40px] md:rounded-[64px] overflow-hidden bg-white shadow-2xl border-none">
         <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 md:gap-6 bg-slate-50/50">
            <div className="relative flex-1 group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
               <input type="text" placeholder="Query learner identities..." className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-[28px] font-bold shadow-inner focus:ring-[12px] focus:ring-blue-100/50 transition-all text-base" />
            </div>
            <button className="px-8 py-5 bg-white border border-slate-100 rounded-[28px] text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
               <Filter size={18} /> Filters
            </button>
         </div>

         <div className="block md:hidden p-4 space-y-4">
            {selectedCourse?.students.map(sid => {
              const stu = students.find(s => s.id === sid);
              return (
                <div key={sid} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-6">
                   <div className="flex items-center gap-4">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stu?.name || sid}`} className="w-16 h-16 rounded-2xl shadow-lg border-2 border-white" alt="" />
                      <div>
                         <p className="font-black text-slate-900 text-xl tracking-tight leading-none mb-1">{stu?.name || sid}</p>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{sid}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-3">
                      <button className="py-4 bg-white border border-emerald-100 text-emerald-600 rounded-2xl flex flex-col items-center gap-1 active:bg-emerald-600 active:text-white transition-all">
                        <Check size={20} /> <span className="text-[8px] font-black uppercase tracking-widest">Present</span>
                      </button>
                      <button className="py-4 bg-white border border-rose-100 text-rose-600 rounded-2xl flex flex-col items-center gap-1 active:bg-rose-600 active:text-white transition-all">
                        <UserX size={20} /> <span className="text-[8px] font-black uppercase tracking-widest">Absent</span>
                      </button>
                      <button className="py-4 bg-white border border-amber-100 text-amber-600 rounded-2xl flex flex-col items-center gap-1 active:bg-amber-600 active:text-white transition-all">
                        <Clock size={20} /> <span className="text-[8px] font-black uppercase tracking-widest">Late</span>
                      </button>
                   </div>
                </div>
              );
            })}
         </div>

         <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] border-b border-slate-100">
                  <tr>
                     <th className="px-12 py-8">Learner Identity</th>
                     <th className="px-8 py-8 text-center">Identity Sync Status</th>
                     <th className="px-12 py-8 text-right">Ledger Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {selectedCourse?.students.map(sid => {
                     const stu = students.find(s => s.id === sid);
                     return (
                       <tr key={sid} className="hover:bg-blue-50/20 transition-all duration-500 group">
                          <td className="px-12 py-10 flex items-center gap-8">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stu?.name || sid}`} className="w-16 h-16 rounded-[24px] border-4 border-white shadow-xl group-hover:scale-110 transition-transform" alt="" />
                             <div>
                               <p className="font-black text-slate-900 text-2xl tracking-tighter uppercase group-hover:text-blue-600 transition-colors">{stu?.name || sid}</p>
                               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{sid} • Tier 12 Node</p>
                             </div>
                          </td>
                          <td className="px-8 py-10">
                             <div className="flex justify-center gap-4">
                                <button className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"><Check size={24} /></button>
                                <button className="p-5 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90"><UserX size={24} /></button>
                                <button className="p-5 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-600 hover:text-white transition-all shadow-sm active:scale-90"><Clock size={24} /></button>
                             </div>
                          </td>
                          <td className="px-12 py-10 text-right">
                             <button className="p-4 text-slate-200 hover:text-blue-600 hover:bg-white rounded-2xl transition-all"><MoreVertical size={24} /></button>
                          </td>
                       </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );

  const renderAIHub = () => (
    <div className="max-w-5xl mx-auto space-y-10 md:space-y-12 animate-in slide-in-from-right duration-700 pb-32 px-4 md:px-0">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          <div className="glass-card p-10 md:p-14 rounded-[48px] md:rounded-[72px] bg-slate-900 text-white shadow-2xl relative overflow-hidden border-none text-center neural-glow flex flex-col items-center justify-center group">
            <div className="p-8 md:p-12 bg-white/10 rounded-[36px] md:rounded-[56px] w-fit mb-10 md:mb-12 backdrop-blur-3xl shadow-inner border border-white/10 transform group-hover:scale-110 transition-transform duration-700">
               <Bot size={64} className="text-blue-400 md:w-[80px] md:h-[80px]" />
            </div>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">Neural Study Hub</h3>
            <p className="text-blue-100 text-base md:text-lg font-medium mb-12 md:mb-16 opacity-80 italic leading-relaxed">"Real-time contextual academic guidance node. Ask anything about the current module."</p>
            
            <div className="flex gap-4 w-full relative z-10">
              <button onClick={() => setIsVoiceActive(!isVoiceActive)} className={`flex-1 py-6 md:py-7 rounded-[32px] md:rounded-[36px] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 md:gap-5 shadow-2xl ${isVoiceActive ? 'bg-emerald-600 text-white animate-pulse' : 'bg-white text-slate-900 hover:bg-blue-50'}`}>
                 {isVoiceActive ? <Volume2 size={24} /> : <Mic size={24} />} {isVoiceActive ? 'Voice Sync Active' : 'Establish Sync'}
              </button>
            </div>
          </div>

          <div className="glass-card p-8 md:p-12 rounded-[48px] md:rounded-[72px] bg-white shadow-2xl border-none flex flex-col min-h-[500px]">
             <h4 className="text-3xl font-black text-slate-900 mb-8 md:mb-10 flex items-center gap-4 md:gap-5 uppercase tracking-tighter leading-none">
                <div className="p-4 md:p-5 bg-blue-50 text-blue-600 rounded-[24px] md:rounded-[32px] shadow-inner"><ImageIcon size={28} className="md:w-8 md:h-8" /></div>
                Visual Synthesis
             </h4>
             <div className="relative flex-1 bg-slate-50 rounded-[40px] md:rounded-[56px] border-4 border-dashed border-slate-200 flex flex-col overflow-hidden group">
                {generatedVisual ? (
                   <img src={generatedVisual} className="w-full h-full object-cover animate-in fade-in duration-1000" alt="AI Aid" />
                ) : (
                   <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center">
                      <Sparkles size={64} className="text-slate-100 mb-6 md:mb-8" />
                      <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Awaiting Architectural Input</p>
                   </div>
                )}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl p-3 md:p-4 rounded-[32px] md:rounded-[40px] shadow-2xl flex gap-3 md:gap-4 border border-white/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-500">
                   <input id="visual_prompt" placeholder="Lattice Synthesis..." className="flex-1 px-6 md:px-10 bg-transparent text-base md:text-lg font-bold outline-none placeholder:text-slate-300" />
                   <button onClick={() => handleAIAssistant('visual', { prompt: (document.getElementById('visual_prompt') as HTMLInputElement)?.value })} className="p-4 md:p-6 bg-slate-900 text-white rounded-2xl md:rounded-[28px] hover:bg-blue-600 transition-all active:scale-90">
                      {isAIGenerating ? <Activity className="animate-spin" size={24} /> : <Wand2 size={24} />}
                   </button>
                </div>
             </div>
          </div>
       </div>

       <div className="glass-card p-8 md:p-14 rounded-[40px] md:rounded-[72px] bg-white border-none shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-12">
             <div className="p-4 md:p-6 bg-blue-50 text-blue-600 rounded-[24px] md:rounded-[32px] shadow-inner"><MessageSquare size={32} className="md:w-9 md:h-9" /></div>
             <h4 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Knowledge Interface</h4>
          </div>
          <div className="relative mb-12 md:mb-16 group">
            <input onKeyDown={(e) => e.key === 'Enter' && handleAIAssistant('study', { query: e.currentTarget.value })} type="text" placeholder="Query repositories..." className="w-full pl-8 md:pl-12 pr-24 md:pr-32 py-8 md:py-12 bg-slate-50 border-none rounded-[40px] md:rounded-[56px] text-slate-900 text-2xl md:text-3xl font-bold outline-none focus:ring-[12px] md:focus:ring-[16px] focus:ring-blue-100/50 transition-all shadow-inner placeholder:text-slate-200" />
            <button className="absolute right-4 md:right-6 top-4 md:top-6 bottom-4 md:bottom-6 bg-blue-600 px-8 md:px-16 rounded-[28px] md:rounded-[48px] font-black text-[10px] uppercase tracking-[0.4em] text-white shadow-xl hover:bg-blue-700 transition-all">Query</button>
          </div>
          {aiResponse && (
             <div className="prose prose-slate max-w-none p-10 md:p-16 bg-blue-50/20 rounded-[48px] md:rounded-[64px] border border-blue-100/50 animate-in zoom-in-95">
                <div className="font-bold text-slate-700 leading-relaxed italic text-xl md:text-2xl whitespace-pre-wrap">"{aiResponse}"</div>
             </div>
          )}
          {isAIGenerating && <div className="py-20 md:py-40 text-center"><Activity size={64} className="text-blue-500 animate-spin mx-auto" /></div>}
       </div>
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-12 pb-32">
      {view === 'dashboard' ? renderDashboard() : (
        <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
           <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 md:gap-10 px-4 md:px-1">
             <div className="flex items-center gap-6 md:gap-10">
                <button onClick={() => setView('dashboard')} className="p-8 md:p-12 rounded-[32px] md:rounded-[56px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group hover:scale-105 transition-transform active:scale-95">
                   <div className={`absolute inset-0 bg-gradient-to-tr ${selectedCourse?.bannerUrl ? 'opacity-0' : selectedCourse?.bannerColor} opacity-40`}></div>
                   <ArrowLeft size={32} className="md:w-10 md:h-10 relative z-10" />
                </button>
                <div>
                   <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-3 md:mb-4 uppercase">{selectedCourse?.name}</h2>
                   <p className="text-slate-500 font-bold italic uppercase text-[10px] md:text-[14px] tracking-[0.4em] flex items-center gap-4 md:gap-8">
                      <RefreshCw className="text-blue-500 animate-spin-slow" size={20} /> {selectedCourse?.code} • Node 2.6
                   </p>
                </div>
             </div>
             <div className="bg-white/90 backdrop-blur-2xl p-2 rounded-[28px] md:rounded-[40px] shadow-2xl border border-slate-100 flex gap-2 w-full xl:w-auto overflow-x-auto scrollbar-hide">
                {[
                  { id: 'stream', label: 'Stream', icon: <MessageSquare size={16} /> },
                  { id: 'classwork', label: 'Matrix', icon: <LayoutGrid size={16} /> },
                  { id: 'attendance', label: 'Presence', icon: <ClipboardCheck size={16} /> },
                  { id: 'vault', label: 'Vault', icon: <Library size={16} /> },
                  { id: 'ai', label: 'Neural', icon: <Bot size={16} /> },
                ].map(tab => {
                   if (isParent && !['classwork', 'vault'].includes(tab.id)) return null;
                   return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-8 md:px-12 py-3.5 md:py-5 rounded-[20px] md:rounded-[32px] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 md:gap-5 whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
                        {tab.icon} {tab.label}
                    </button>
                   );
                })}
             </div>
           </div>

           <div className="min-h-[500px]">
              {activeTab === 'stream' && renderStream()}
              {activeTab === 'classwork' && renderClasswork()}
              {activeTab === 'attendance' && renderAttendance()}
              {activeTab === 'ai' && renderAIHub()}
              {activeTab === 'vault' && (
                <div className="max-w-4xl mx-auto py-32 md:py-40 text-center glass-card rounded-[48px] md:rounded-[80px] bg-white/40 px-6">
                   <Library size={80} className="mx-auto text-slate-100 mb-8 md:w-[96px] md:h-[96px]" />
                   <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Knowledge Vault Synchronized</h3>
                   <p className="text-slate-400 font-bold italic text-base md:text-lg">Centralized pedagogical resources hub.</p>
                   <button className="mt-10 px-12 py-5 md:py-6 bg-slate-900 text-white rounded-[24px] md:rounded-[32px] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl">Access Vault</button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* PLAN AUTHORING MODAL - FULL SCREEN ON MOBILE */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center md:p-4">
           <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-3xl animate-in fade-in duration-500 hidden md:block" onClick={() => setIsPlanModalOpen(false)}></div>
           <div className="relative w-full h-full md:h-auto md:max-w-6xl bg-white md:rounded-[72px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 flex flex-col max-h-screen md:max-h-[95vh]">
              <div className="p-8 md:p-14 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                 <div>
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Node Synthesis</h3>
                    <p className="text-[9px] md:text-[12px] text-slate-400 font-black uppercase tracking-[0.4em] mt-3 md:mt-4">Instructional Design • 2026</p>
                 </div>
                 <button onClick={() => setIsPlanModalOpen(false)} className="p-4 md:p-6 bg-slate-100 rounded-2xl md:rounded-[32px] hover:bg-slate-200 transition-all"><X size={28} className="md:w-9 md:h-9" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-14 space-y-10 md:space-y-16 bg-slate-50/20 scrollbar-hide">
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {Object.values(PlanningModality).map(mod => (
                      <button key={mod} onClick={() => setPlanningModality(mod)} className={`p-8 md:p-12 rounded-[32px] md:rounded-[48px] border-4 transition-all flex flex-col items-center justify-center gap-4 md:gap-6 ${planningModality === mod ? 'bg-blue-600 border-blue-600 text-white shadow-2xl scale-105' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 shadow-sm'}`}>
                         <div className={`p-4 md:p-6 rounded-[18px] md:rounded-[28px] ${planningModality === mod ? 'bg-white/20' : 'bg-slate-50'}`}><Calendar size={24} className="md:w-9 md:h-9" /></div>
                         <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em]">{mod} Node</span>
                      </button>
                    ))}
                 </div>
                 <div className="space-y-4 md:space-y-6">
                    <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] px-4 md:px-8">Node Narrative / Identifier</label>
                    <input id="plan_title" placeholder="e.g. Module 4.1..." className="w-full px-8 md:px-12 py-6 md:py-10 bg-white border-4 border-slate-100 rounded-[32px] md:rounded-[56px] font-black text-slate-900 outline-none focus:border-blue-400 transition-all shadow-inner text-2xl md:text-3xl placeholder:text-slate-100" />
                 </div>
                 <div className="bg-slate-900 p-8 md:p-14 rounded-[40px] md:rounded-[72px] shadow-2xl relative overflow-hidden group">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 md:mb-12 relative z-10">
                       <h4 className="text-white text-xl md:text-2xl font-black flex items-center gap-4 md:gap-6 tracking-tight uppercase"><Sparkles className="text-blue-400 animate-pulse" /> Neural Architect</h4>
                       <button onClick={() => { const title = (document.getElementById('plan_title') as HTMLInputElement)?.value; if (title) handleAIAssistant('plan', { title, modality: planningModality }); }} disabled={isAIGenerating} className="w-full md:w-auto bg-white text-slate-900 px-10 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-[28px] font-black text-[10px] md:text-[12px] uppercase tracking-[0.3em] hover:bg-blue-50 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-4 group/synth">
                          {isAIGenerating ? <Activity className="animate-spin" size={20} /> : <Wand2 size={20} className="group-hover/synth:rotate-12 transition-transform" />} Synthesize
                       </button>
                    </div>
                    <textarea value={aiResponse || ''} onChange={(e) => setAiResponse(e.target.value)} placeholder="Neural interface active..." className="w-full h-[400px] md:h-[550px] bg-white/5 border border-white/10 rounded-[32px] md:rounded-[64px] p-8 md:p-16 text-white placeholder:text-slate-800 font-bold outline-none focus:border-white/30 transition-all resize-none shadow-inner text-xl md:text-2xl leading-relaxed relative z-10 scrollbar-hide" />
                 </div>
              </div>

              <div className="p-8 md:p-14 bg-white border-t border-slate-100 flex flex-col md:flex-row gap-4 md:gap-8 shadow-2xl">
                 <button onClick={() => setIsPlanModalOpen(false)} className="w-full md:flex-1 py-6 md:py-10 bg-slate-50 text-slate-500 font-black rounded-3xl md:rounded-[56px] text-[10px] md:text-[12px] uppercase tracking-[0.3em]">Discard</button>
                 <button onClick={saveLessonPlan} className="w-full md:flex-[2] py-6 md:py-10 bg-slate-900 text-white font-black rounded-3xl md:rounded-[56px] text-[10px] md:text-xs uppercase tracking-[0.5em] shadow-xl hover:translate-y-[-6px] transition-all flex items-center justify-center gap-4 md:gap-8 group">
                    Dispatch Protocol <CheckCircle2 size={32} className="group-hover:rotate-12 transition-transform duration-500 text-blue-400 md:w-10 md:h-10" />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomManager;
