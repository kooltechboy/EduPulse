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
  Smile, Award, FileUp, Video, ListChecks,
  Table as TableIcon, BarChart3, TrendingUp, AlertTriangle
} from 'lucide-react';
import { 
  CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, XAxis as ReXAxis, YAxis as ReYAxis, AreaChart, Area
} from 'recharts';
import { 
  Course, User, UserRole, GradeLevel,
  CourseModule, LessonPlan, PlanningModality, Syllabus, Student
} from '../../types';
import { generateAILessonPlan, getAITutorResponse, generateConceptualVisual, generateGradingRubric } from '../../services/geminiService';

const ClassroomManager: React.FC<{ user: User }> = ({ user }) => {
  const [view, setView] = useState<'dashboard' | 'course'>('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'attendance' | 'analytics' | 'ai'>('stream');
  const [planningModality, setPlanningModality] = useState<PlanningModality>(PlanningModality.WEEKLY);
  
  // AI & Analytics State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [rubricResponse, setRubricResponse] = useState<string | null>(null);
  const [generatedVisual, setGeneratedVisual] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // High-Fidelity Rigor Data
  const gradeDistribution = [
    { grade: 'A', count: 8, benchmark: 6 },
    { grade: 'B', count: 12, benchmark: 14 },
    { grade: 'C', count: 4, benchmark: 6 },
    { grade: 'D', count: 1, benchmark: 1 },
    { grade: 'F', count: 0, benchmark: 0 },
  ];

  const bellCurveData = [
    { x: 0, y: 0 }, { x: 20, y: 5 }, { x: 40, y: 15 }, { x: 50, y: 35 },
    { x: 60, y: 85 }, { x: 70, y: 100 }, { x: 80, y: 75 }, { x: 90, y: 25 }, { x: 100, y: 5 }
  ];

  // Global Registry Data
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('edupulse_courses_registry');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'C1', name: 'Advanced Calculus & Topology', code: 'MATH-12A', teacherId: 'TCH001', teacherName: 'Professor Mitchell', 
        gradeLevel: GradeLevel.SENIOR_HIGH, room: 'B-102', students: ['STU-4401', 'STU-2910', 'STU-0882'],
        bannerColor: 'from-blue-600 via-indigo-600 to-violet-700',
        materials: [{ id: 'M1', title: 'Calculus: The Limit Laws', type: 'Video', url: '#', uploadDate: '2026-05-10', description: 'Institutional lecture.' }],
        modules: [{ 
            id: 'MOD-1', title: 'Phase 1: Foundations', description: 'Theoretical boundaries.', order: 1, 
            plans: [{ id: 'P1', modality: PlanningModality.WEEKLY, title: 'Week 1: Limits', objectives: ['Epsilon-delta'], content: 'Structural overview.', associatedMaterials: ['M1'], status: 'Published' }],
            assignments: [] 
        }],
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

  const handleAIAssistant = async (type: 'plan' | 'study' | 'visual' | 'rubric', data?: any) => {
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
      } else if (type === 'rubric') {
        const res = await generateGradingRubric(data.title, data.criteria);
        setRubricResponse(res);
      }
    } finally {
      setIsAIGenerating(false);
    }
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
           }} className="w-full lg:w-auto bg-slate-900 text-white px-10 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl hover:bg-blue-600 hover:translate-y-[-4px] transition-all group">
             <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" /> Register Node
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
        {courses.map(course => (
          <div key={course.id} onClick={() => handleEnterCourse(course)} className="group bg-white rounded-[48px] md:rounded-[64px] overflow-hidden shadow-xl hover:shadow-2xl hover:translate-y-[-8px] transition-all cursor-pointer border border-white/50 relative">
            <div className={`h-48 md:h-60 bg-gradient-to-br ${course.bannerColor} p-8 md:p-12 flex justify-between items-start relative overflow-hidden`}>
               <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:scale-125 transition-transform duration-1000"></div>
               <div className="bg-white/20 backdrop-blur-xl px-5 md:px-6 py-2 md:py-2.5 rounded-full border border-white/20 relative z-10 shadow-sm">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{course.code}</span>
               </div>
               <div className="p-4 md:p-5 bg-white/10 rounded-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all relative z-10 text-white">
                  <ArrowRight size={24} />
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

  const renderCalibration = () => (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-32 px-4 md:px-0">
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 px-1">
          <div>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Institutional Rigor Audit</h3>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Cycle 2026 Grade Calibration & Node Alignment</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                <Download size={18} /> Export Calibration Dossier
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-10">
             <div className="glass-card p-10 rounded-[56px] bg-white shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                   <h4 className="text-xl font-black text-slate-900 uppercase flex items-center gap-4">
                      <BarChart3 className="text-blue-600" /> Grade Distribution Matrix
                   </h4>
                   <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div> Current Node</div>
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-slate-200 rounded-full"></div> Institutional Benchmark</div>
                   </div>
                </div>
                <div className="h-[400px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gradeDistribution}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <ReXAxis dataKey="grade" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 14, fontWeight: 800}} />
                         <ReYAxis hide />
                         <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'}} />
                         <Bar dataKey="count" radius={[16, 16, 0, 0]} barSize={48} fill="#2563eb" />
                         <Bar dataKey="benchmark" radius={[16, 16, 0, 0]} barSize={48} fill="#e2e8f0" />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="glass-card p-10 rounded-[56px] bg-white shadow-2xl">
                <h4 className="text-xl font-black text-slate-900 mb-10 uppercase flex items-center gap-4">
                   <TrendingUp className="text-indigo-600" /> Rigor Performance Curve
                </h4>
                <div className="h-[250px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={bellCurveData}>
                         <defs>
                            <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                               <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <Area type="monotone" dataKey="y" stroke="#4f46e5" strokeWidth={5} fill="url(#colorCurve)" />
                         <RechartsTooltip />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
                <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-between">
                   <div>
                      <p className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-1">Bell Curve Alignment</p>
                      <p className="text-sm font-bold text-indigo-600/80 italic">"94% alignment with Tier 12 academic standard."</p>
                   </div>
                   <CheckCircle2 size={32} className="text-indigo-600" />
                </div>
             </div>
          </div>

          <div className="space-y-10">
             <div className="glass-card p-10 rounded-[56px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                <h4 className="text-xl font-black mb-10 flex items-center gap-5 uppercase tracking-tighter relative z-10">
                   <div className="p-3 bg-white/10 rounded-2xl"><ShieldCheck size={20} className="text-blue-400" /></div>
                   Institutional Oversight
                </h4>
                <div className="space-y-8 relative z-10">
                   {[
                     { label: 'Rigor Deviation', val: '1.2%', color: 'text-emerald-400' },
                     { label: 'Inflation Risk', val: 'Low', color: 'text-blue-400' },
                     { label: 'Standard Sync', val: 'Optimal', color: 'text-indigo-400' }
                   ].map(s => (
                      <div key={s.label} className="flex justify-between items-center py-4 border-b border-white/5">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                         <span className={`font-black ${s.color}`}>{s.val}</span>
                      </div>
                   ))}
                </div>
                <button className="w-full mt-10 py-6 bg-white text-slate-900 rounded-[28px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all">Request Peer Audit</button>
             </div>

             <div className="glass-card p-10 rounded-[56px] bg-white shadow-xl border-none">
                <h4 className="font-black text-slate-900 uppercase tracking-[0.4em] text-[11px] mb-8 flex items-center gap-4">
                   <AlertTriangle size={18} className="text-amber-500" /> Anomalies Identified
                </h4>
                <div className="space-y-4">
                   <div className="p-5 bg-rose-50 rounded-[28px] border border-rose-100 group cursor-pointer hover:bg-rose-100 transition-all">
                      <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest mb-1">Node: Quiz 4.2</p>
                      <p className="text-xs font-bold text-rose-900 leading-tight">Skew detected: 85% of cohort achieved "Mastery" level.</p>
                   </div>
                   <div className="p-5 bg-amber-50 rounded-[28px] border border-amber-100">
                      <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-1">Standard Alignment</p>
                      <p className="text-xs font-bold text-amber-900 leading-tight">Unit 3 assessment requires IGCSE link verification.</p>
                   </div>
                </div>
             </div>
          </div>
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
                   <div className={`absolute inset-0 bg-gradient-to-tr ${selectedCourse?.bannerColor} opacity-40`}></div>
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
                  { id: 'analytics', label: 'Calibration', icon: <BarChart3 size={16} /> },
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
              {activeTab === 'stream' && (
                <div className="max-w-4xl mx-auto py-20 text-center glass-card rounded-[48px] bg-white border-none shadow-2xl">
                   <MessageSquare size={80} className="mx-auto text-slate-100 mb-8" />
                   <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Instructional stream node active for {selectedCourse?.name}.</p>
                </div>
              )}
              {activeTab === 'classwork' && (
                <div className="max-w-6xl mx-auto py-20 text-center glass-card rounded-[48px] bg-white border-none shadow-2xl">
                   <LayoutGrid size={80} className="mx-auto text-slate-100 mb-8" />
                   <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Course Matrix Synced.</p>
                </div>
              )}
              {activeTab === 'analytics' && renderCalibration()}
              {activeTab === 'ai' && (
                <div className="max-w-4xl mx-auto py-20 text-center glass-card rounded-[48px] bg-white border-none shadow-2xl">
                   <Bot size={80} className="mx-auto text-slate-100 mb-8" />
                   <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Neural tutoring active for this module.</p>
                </div>
              )}
           </div>
        </div>
      )}

      {/* RUBRIC ARCHITECT MODAL - NEW PREMIUM FEATURE */}
      {isRubricModalOpen && (
         <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsRubricModalOpen(false)}></div>
            <div className="relative w-full max-w-5xl bg-white rounded-[64px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
               <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                  <div className="flex items-center gap-6">
                     <div className="p-4 bg-white/10 rounded-2xl"><TableIcon size={28} className="text-blue-400" /></div>
                     <div>
                        <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">Assessment Rubric Architect</h3>
                        <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mt-2">Institutional Quality Compliance Node</p>
                     </div>
                  </div>
                  <button onClick={() => setIsRubricModalOpen(false)} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={24} /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-12 scrollbar-hide space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Assignment Identification</label>
                        <input id="rubric_title" placeholder="e.g. Thesis Research Project..." className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[32px] font-black text-slate-900 outline-none focus:border-blue-400" />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Evaluation Criteria</label>
                        <input id="rubric_criteria" placeholder="Logic, Accuracy, Peer-Review..." className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[32px] font-black text-slate-900 outline-none focus:border-blue-400" />
                     </div>
                  </div>
                  {rubricResponse && (
                     <div className="prose prose-slate max-w-none p-10 bg-blue-50/20 rounded-[48px] border-2 border-blue-100 animate-in fade-in">
                        <div className="font-mono text-xs whitespace-pre-wrap">{rubricResponse}</div>
                     </div>
                  )}
               </div>
               <div className="p-10 bg-slate-50 border-t border-slate-100">
                  <button 
                    onClick={() => handleAIAssistant('rubric', { title: (document.getElementById('rubric_title') as HTMLInputElement)?.value, criteria: (document.getElementById('rubric_criteria') as HTMLInputElement)?.value.split(',') })}
                    disabled={isAIGenerating}
                    className="w-full py-6 bg-slate-900 text-white font-black rounded-[32px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl hover:bg-blue-600 transition-all active:scale-95"
                  >
                     {isAIGenerating ? <RefreshCw size={20} className="animate-spin" /> : <Wand2 size={20} />} {isAIGenerating ? 'Architecting Standards...' : 'Synthesize Master Rubric'}
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default ClassroomManager;