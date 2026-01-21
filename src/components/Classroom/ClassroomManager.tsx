import React, { useState, useEffect, useMemo } from 'react';
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
  Table as TableIcon, BarChart3, TrendingUp, AlertTriangle,
  History, Link as LinkIcon, FilePlus, CloudLightning,
  Baby, School, Globe, UserCheck
} from 'lucide-react';
import { 
  Course, User, UserRole, GradeLevel,
  CourseModule, LessonPlan, PlanningModality, Student, LearningMaterial
} from '@/types';

const ClassroomManager: React.FC<{ user: User }> = ({ user }) => {
  const [view, setView] = useState<'dashboard' | 'course'>('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'stream' | 'curriculum' | 'cohort' | 'assessment' | 'neural'>('stream');
  
  // Filtering Logic
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('All');
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Hierarchy state
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  
  // Interaction State
  const [activePlan, setActivePlan] = useState<LessonPlan | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  const isTeacher = user.role === UserRole.TEACHER;
  const isAdmin = user.role === UserRole.ADMIN;

  const [students] = useState<Student[]>(() => {
    const saved = localStorage.getItem('edupulse_students_registry');
    return saved ? JSON.parse(saved) : [];
  });

  const [courses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('edupulse_courses_registry');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'C1', name: 'Advanced Calculus & Topology', code: 'MATH-12A', teacherId: 'TCH-001', teacherName: 'Professor Mitchell', 
        gradeLevel: GradeLevel.SENIOR_HIGH, room: 'B-102', students: ['STU-001', 'STU-002', 'STU-2910'],
        bannerColor: 'from-blue-600 via-indigo-600 to-violet-700',
        materials: [],
        modules: [
          { 
            id: 'M-MAY', title: 'May: Topology Foundations', description: 'Exploring non-Euclidean manifolds.', order: 1, 
            plans: [
              { id: 'P-W1', modality: PlanningModality.WEEKLY, title: 'Week 3: Möbius Strips', objectives: ['Continuity', 'Orientation'], content: 'Structural overview.', associatedMaterials: [], status: 'Published' },
              { id: 'P-D1', modality: PlanningModality.DAILY, title: 'Day 1: Set Theory Basics', objectives: ['Definitions'], content: 'Basics.', associatedMaterials: [], status: 'Published' }
            ],
            assignments: [
              { id: 'A1', title: 'The Manifold Proof', description: 'Upload your research paper on 3D manifolds.', dueDate: '2026-05-25', points: 100, resources: [], submissions: [] }
            ] 
          }
        ]
      },
      { 
        id: 'C2', name: 'Early Literacy & Phonics', code: 'K-ENG', teacherId: 'TCH-006', teacherName: 'Mrs. Daisy', 
        gradeLevel: GradeLevel.KINDERGARTEN, room: 'K-001', students: ['STU-003'],
        bannerColor: 'from-emerald-500 via-teal-600 to-cyan-700',
        materials: [], modules: []
      },
      { 
        id: 'C3', name: 'Elementary Science 101', code: 'SCI-05', teacherId: 'TCH-004', teacherName: 'Mr. Bond', 
        gradeLevel: GradeLevel.ELEMENTARY, room: 'C-202', students: ['STU-0882'],
        bannerColor: 'from-amber-500 via-orange-600 to-rose-700',
        materials: [], modules: []
      }
    ];
  });

  const tiers = [
    { id: 'All', label: 'Global Campus', icon: <Globe size={18}/> },
    { id: 'Early', label: 'Early Childhood', levels: [GradeLevel.NURSERY, GradeLevel.PRE_SCHOOL, GradeLevel.KINDERGARTEN], icon: <Baby size={18}/> },
    { id: 'Elementary', label: 'Elementary', levels: [GradeLevel.ELEMENTARY], icon: <School size={18}/> },
    { id: 'Junior', label: 'Junior High', levels: [GradeLevel.JUNIOR_HIGH], icon: <GraduationCap size={18}/> },
    { id: 'Senior', label: 'Senior High', levels: [GradeLevel.SENIOR_HIGH], icon: <Globe size={18}/> }
  ];

  const filteredCourses = useMemo(() => {
    let list = courses;
    
    // Role based filtering
    if (isTeacher) {
      list = list.filter(c => c.teacherId === user.id);
    }

    // Tier filtering
    if (selectedTier !== 'All') {
      const tierObj = tiers.find(t => t.id === selectedTier);
      if (tierObj?.levels) {
        list = list.filter(c => tierObj.levels.includes(c.gradeLevel));
      }
    }

    // Grade filtering (Mocking based on code prefixes)
    if (selectedGradeFilter !== 'All') {
      list = list.filter(c => c.code.includes(selectedGradeFilter));
    }

    // Teacher filtering
    if (selectedTeacherFilter !== 'All' && !isTeacher) {
      list = list.filter(c => c.teacherName === selectedTeacherFilter);
    }

    // Search query
    if (searchQuery) {
      list = list.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return list;
  }, [courses, selectedTier, selectedGradeFilter, selectedTeacherFilter, searchQuery, isTeacher, user.id]);

  const uniqueTeachers = useMemo(() => Array.from(new Set(courses.map(c => c.teacherName))), [courses]);
  const uniqueGrades = useMemo(() => Array.from(new Set(courses.map(c => c.code.split('-')[0]))), [courses]);

  const handleEnterCourse = (course: Course) => {
    setSelectedCourse(course);
    setView('course');
  };

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in duration-700 px-4 md:px-0">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">Classroom<br/><span className="text-blue-600">OS Node 2.6</span></h2>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.5em] mt-6 flex items-center gap-3">
             <MonitorPlay size={18} className="text-blue-600" /> {isAdmin ? 'Institutional Control Matrix' : 'Faculty Instruction Station'}
          </p>
        </div>
        {isTeacher && (
           <button className="bg-slate-950 text-white px-10 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all flex items-center gap-4 active:scale-95 group">
             <Plus size={22} className="group-hover:rotate-90 transition-transform" /> Author Lesson Node
           </button>
        )}
      </div>

      {/* TIER NAVIGATOR - HIGH VISIBILITY */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-white/60 backdrop-blur-md p-3 rounded-[32px] border border-white shadow-xl">
         {tiers.map(tier => (
            <button 
              key={tier.id}
              onClick={() => { setSelectedTier(tier.id); setSelectedGradeFilter('All'); }}
              className={`flex flex-col items-center justify-center py-5 px-4 rounded-[24px] transition-all gap-3 border-2 ${selectedTier === tier.id ? 'bg-slate-950 border-slate-950 text-white shadow-2xl scale-[1.02]' : 'bg-white border-transparent text-slate-400 hover:bg-slate-50'}`}
            >
               <div className={`p-2.5 rounded-xl ${selectedTier === tier.id ? 'bg-white/10 text-blue-400' : 'bg-slate-100 text-slate-400 shadow-inner'}`}>{tier.icon}</div>
               <span className="text-[9px] font-black uppercase tracking-widest text-center leading-tight">{tier.label}</span>
            </button>
         ))}
      </div>

      {/* GRANULAR FILTERS DECK */}
      <div className="flex flex-col xl:flex-row gap-6 bg-white p-6 rounded-[40px] shadow-2xl border border-slate-100">
          <div className="flex-1 relative group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
             <input 
              type="text" 
              placeholder="Search subject code, name, or faculty lead..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[24px] font-bold shadow-inner focus:ring-8 focus:ring-blue-100/50 transition-all text-sm" 
             />
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
             <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-[24px] border border-slate-100">
                <Filter size={16} className="text-blue-600" />
                <select 
                  value={selectedGradeFilter}
                  onChange={(e) => setSelectedGradeFilter(e.target.value)}
                  className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer"
                >
                   <option value="All">Grade Node: All</option>
                   {uniqueGrades.map(g => <option key={g} value={g}>{g} Grade</option>)}
                </select>
             </div>

             {!isTeacher && (
                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-[24px] border border-slate-100">
                  <UserCheck size={16} className="text-indigo-600" />
                  <select 
                    value={selectedTeacherFilter}
                    onChange={(e) => setSelectedTeacherFilter(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="All">Faculty Lead: All</option>
                    {uniqueTeachers.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
             )}

             <button 
              onClick={() => { setSelectedTier('All'); setSelectedGradeFilter('All'); setSelectedTeacherFilter('All'); setSearchQuery(''); }}
              className="p-5 bg-white text-slate-300 hover:text-rose-500 rounded-[22px] transition-all hover:bg-rose-50"
             >
                <RefreshCw size={20} />
             </button>
          </div>
      </div>

      {/* RESULTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredCourses.map(course => (
          <div key={course.id} onClick={() => handleEnterCourse(course)} className="group bg-white rounded-[64px] overflow-hidden shadow-xl hover:shadow-2xl hover:translate-y-[-8px] transition-all cursor-pointer border border-white relative">
            <div className={`h-40 bg-gradient-to-br ${course.bannerColor} p-8 relative overflow-hidden`}>
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
               <div className="flex justify-between items-start relative z-10">
                  <div className="bg-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20">
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">{course.code}</span>
                  </div>
                  <span className="px-3 py-1 bg-slate-950/40 text-white rounded-lg text-[8px] font-black uppercase tracking-widest backdrop-blur-md">{course.gradeLevel}</span>
               </div>
            </div>
            <div className="p-10 -mt-12 bg-white rounded-[64px] relative z-10">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                  <UserCheck size={12} className="text-blue-500" /> {course.teacherName}
               </p>
               <h3 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-none tracking-tighter uppercase mb-8 line-clamp-1">{course.name}</h3>
               
               <div className="p-5 bg-slate-50 rounded-[32px] border border-slate-100 mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Learner Nodes</p>
                    <p className="text-sm font-black text-slate-900">{course.students.length} Synced</p>
                  </div>
                  <div className="flex -space-x-3">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                     ))}
                  </div>
               </div>

               <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-inner"><MonitorPlay size={18} /></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room {course.room}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:bg-blue-600 transition-all shadow-lg">
                    <ChevronRight size={22} />
                  </div>
               </div>
            </div>
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-40 text-center bg-white/40 glass-card rounded-[80px] shadow-2xl">
             <Search size={80} className="mx-auto text-slate-100 mb-8" />
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">No Matching Node Found</h3>
             <p className="text-slate-400 font-bold mt-4 uppercase tracking-widest text-[10px]">Broaden your tier or grade filters to synchronize campus registry.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCurriculum = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in fade-in duration-1000">
       {/* Left Column: The Hierarchy Sidebar */}
       <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-8 rounded-[48px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl transition-all duration-1000 group-hover:scale-150"></div>
             <div className="relative z-10">
                <h4 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter">
                   <div className="p-3 bg-white/10 rounded-2xl"><History size={20} className="text-blue-400" /></div>
                   Curriculum Matrix
                </h4>
                <div className="space-y-6">
                   {selectedCourse?.modules.map(mod => (
                      <div key={mod.id} className="space-y-4">
                         <button 
                            onClick={() => setExpandedMonth(expandedMonth === mod.id ? null : mod.id)}
                            className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all border-2 ${expandedMonth === mod.id ? 'bg-blue-600 border-blue-400 shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                         >
                            <span className="text-xs font-black uppercase tracking-widest">{mod.title.split(':')[0]}</span>
                            <ChevronRight size={16} className={`transition-transform ${expandedMonth === mod.id ? 'rotate-90' : ''}`} />
                         </button>
                         {expandedMonth === mod.id && (
                           <div className="pl-6 space-y-3 animate-in slide-in-from-left-2">
                              {mod.plans.filter(p => p.modality === PlanningModality.WEEKLY).map(plan => (
                                 <button 
                                    key={plan.id}
                                    onClick={() => { setExpandedWeek(plan.id); setActivePlan(plan); }}
                                    className={`w-full text-left p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${expandedWeek === plan.id ? 'text-blue-400' : 'text-slate-500 hover:text-white'}`}
                                 >
                                    • {plan.title}
                                 </button>
                              ))}
                           </div>
                         )}
                      </div>
                   ))}
                   {selectedCourse?.modules.length === 0 && (
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center py-10 italic">No syllabus nodes synchronized for this level.</p>
                   )}
                </div>
             </div>
          </div>
       </div>

       {/* Right Column: The Detail Node */}
       <div className="lg:col-span-3 space-y-10">
          {activePlan ? (
            <div className="glass-card p-12 md:p-16 rounded-[64px] bg-white shadow-2xl border-none relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><FileText size={200} /></div>
               <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-16 relative z-10">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                       <span className="px-5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">{activePlan.modality} Sequence</span>
                       <span className="px-5 py-1.5 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest">Node ID: {activePlan.id}</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{activePlan.title}</h3>
                  </div>
                  <div className="flex gap-4">
                     <button className="p-4 bg-slate-100 text-slate-400 rounded-3xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Download size={24}/></button>
                     <button className="p-4 bg-slate-100 text-slate-400 rounded-3xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Share2 size={24}/></button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-10">
                     <section>
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                           <Target size={18} className="text-blue-500" /> Instructional Objectives
                        </h5>
                        <div className="space-y-4">
                           {activePlan.objectives.map((obj, i) => (
                              <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 rounded-[28px] border border-slate-100">
                                 <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-blue-600">{i+1}</div>
                                 <span className="text-sm font-bold text-slate-700 italic">"{obj}"</span>
                              </div>
                           ))}
                        </div>
                     </section>
                     
                     <section>
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                           <Paperclip size={18} className="text-indigo-500" /> Digital Artifacts
                        </h5>
                        <div className="grid grid-cols-1 gap-4">
                           <button className="flex items-center justify-between p-6 bg-indigo-50 rounded-[32px] border border-indigo-100 group hover:bg-indigo-600 transition-all">
                              <div className="flex items-center gap-5">
                                 <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm"><Video size={20}/></div>
                                 <span className="text-sm font-black text-indigo-900 group-hover:text-white uppercase tracking-tight">Theory Lecture VOD</span>
                              </div>
                              <Play size={20} className="text-indigo-400 group-hover:text-white" />
                           </button>
                           <button className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:bg-slate-900 transition-all">
                              <div className="flex items-center gap-5">
                                 <div className="p-3 bg-white rounded-2xl text-slate-600 shadow-sm"><FileText size={20}/></div>
                                 <span className="text-sm font-black text-slate-900 group-hover:text-white uppercase tracking-tight">Cycle Assessment.pdf</span>
                              </div>
                              <Download size={20} className="text-slate-300 group-hover:text-white" />
                           </button>
                        </div>
                     </section>
                  </div>

                  <div className="space-y-10">
                     <section className="bg-slate-50 rounded-[48px] p-10 border border-slate-100">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                           <ListChecks size={18} className="text-emerald-500" /> Classroom Engagement
                        </h5>
                        <div className="space-y-6">
                           <div className="p-6 bg-white rounded-[32px] shadow-sm border border-slate-100">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Class Task</p>
                              <p className="text-base font-bold text-slate-800 leading-relaxed italic">"Collaborate in peer groups to derive the Möbius function for a set of 5 distinct topological nodes."</p>
                           </div>
                           <div className="flex items-center justify-between p-6 bg-emerald-50 rounded-[32px] border border-emerald-100">
                              <div>
                                 <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-1">Engagement Sync</p>
                                 <p className="text-lg font-black text-emerald-900">Optimal (92%)</p>
                              </div>
                              <Sparkles className="text-emerald-500" size={28} />
                           </div>
                        </div>
                     </section>
                  </div>
               </div>
            </div>
          ) : (
            <div className="py-40 text-center glass-card rounded-[64px] bg-white border-none shadow-2xl">
               <Layers size={80} className="mx-auto text-slate-100 mb-8" />
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Select Pedagogical Node</h3>
               <p className="text-slate-400 font-bold mt-4 uppercase tracking-widest text-[10px]">Navigate the Curricular Matrix to initialize detail view.</p>
            </div>
          )}
       </div>
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-12 pb-32">
      {view === 'dashboard' ? renderDashboard() : (
        <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
           {/* Course Header Node */}
           <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 px-4 md:px-1">
             <div className="flex items-center gap-10">
                <button onClick={() => setView('dashboard')} className="p-8 md:p-10 rounded-[32px] md:rounded-[56px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group hover:scale-105 transition-transform active:scale-95">
                   <div className={`absolute inset-0 bg-gradient-to-tr ${selectedCourse?.bannerColor} opacity-40`}></div>
                   <ArrowLeft size={32} className="relative z-10" />
                </button>
                <div>
                   <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">{selectedCourse?.name}</h2>
                   <p className="text-slate-500 font-bold italic uppercase text-[10px] md:text-[12px] tracking-[0.4em] flex items-center gap-6">
                      <span className="text-blue-600 font-black">{selectedCourse?.gradeLevel} Tier</span> • {selectedCourse?.code} • {selectedCourse?.teacherName}
                   </p>
                </div>
             </div>
             <div className="bg-white/90 backdrop-blur-2xl p-2 rounded-[32px] md:rounded-[40px] shadow-2xl border border-slate-100 flex gap-2 w-full xl:w-auto overflow-x-auto scrollbar-hide">
                {[
                  { id: 'stream', label: 'Stream', icon: <MessageSquare size={16} /> },
                  { id: 'curriculum', label: 'Matrix', icon: <Layers size={16} /> },
                  { id: 'cohort', label: 'Cohort', icon: <Users2 size={16} /> },
                  { id: 'assessment', label: 'Assessment', icon: <GraduationCap size={16} /> },
                  { id: 'neural', label: 'Neural', icon: <Bot size={16} /> },
                ].map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 md:flex-none px-8 md:px-10 py-4 md:py-5 rounded-[24px] md:rounded-[32px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
             </div>
           </div>

           <div className="min-h-[600px] px-4 md:px-0">
              {activeTab === 'stream' && (
                <div className="max-w-4xl mx-auto space-y-10">
                   <div className="glass-card p-10 rounded-[56px] bg-white border-none shadow-xl relative overflow-hidden group">
                      <div className="flex gap-8">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-16 h-16 rounded-[24px] border-2 border-slate-100 shadow-md" alt="" />
                         <div className="flex-1 space-y-6">
                            <textarea 
                              placeholder="Broadcast an instructional advisory to the cohort..." 
                              className="w-full h-32 bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-sm font-bold outline-none focus:ring-8 focus:ring-blue-50 transition-all resize-none placeholder:text-slate-300"
                            />
                            <div className="flex items-center justify-between">
                               <div className="flex gap-4">
                                  <button className="p-4 bg-white text-slate-400 rounded-2xl hover:text-blue-600 transition-all shadow-sm"><ImageIcon size={20}/></button>
                                  <button className="p-4 bg-white text-slate-400 rounded-2xl hover:text-indigo-600 transition-all shadow-sm"><LinkIcon size={20}/></button>
                               </div>
                               <button className="px-10 py-4 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-3">
                                  Deploy Transmission <Send size={16} />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-10">
                      {[
                        { sender: selectedCourse?.teacherName, text: 'Phase 2 Synchronization: Ensure all digital artifacts for the Topology lab are uploaded by EOD Friday.', time: '2h ago', tags: ['Instructional', 'Lab'] },
                        { sender: 'Bot Analyst', text: 'Institutional Sync: 92% of the cohort has accessed the Week 3 pre-reading material. High readiness detected for next session.', time: '4h ago', tags: ['Neural', 'Analysis'], bot: true }
                      ].map((post, i) => (
                         <div key={i} className={`glass-card p-10 rounded-[56px] shadow-xl border-none ${post.bot ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                            <div className="flex items-center justify-between mb-8">
                               <div className="flex items-center gap-6">
                                  {post.bot ? (
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg"><Bot size={24} className="text-white"/></div>
                                  ) : (
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.sender}`} className="w-14 h-14 rounded-2xl border-2 border-slate-50 shadow-md" alt="" />
                                  )}
                                  <div>
                                     <h4 className={`text-xl font-black tracking-tight uppercase ${post.bot ? 'text-blue-400' : 'text-slate-900'}`}>{post.sender}</h4>
                                     <p className="text-[8px] font-black uppercase tracking-widest opacity-60">{post.time} • Local Node</p>
                                  </div>
                               </div>
                               <div className="flex gap-2">
                                  {post.tags.map(t => <span key={t} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border ${post.bot ? 'bg-white/10 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>{t}</span>)}
                               </div>
                            </div>
                            <p className={`text-lg font-bold leading-relaxed italic ${post.bot ? 'text-blue-50' : 'text-slate-700'}`}>"{post.text}"</p>
                         </div>
                      ))}
                   </div>
                </div>
              )}
              {activeTab === 'curriculum' && renderCurriculum()}
              {activeTab === 'cohort' && (
                <div className="max-w-6xl mx-auto glass-card rounded-[64px] bg-white border-none shadow-2xl overflow-hidden animate-in fade-in duration-700">
                   <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Learner Registry</h4>
                      <div className="flex gap-4">
                        <button className="p-4 bg-white text-slate-400 rounded-3xl hover:text-blue-600 transition-all shadow-sm"><Filter size={20}/></button>
                        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Invite Learner</button>
                      </div>
                   </div>
                   <div className="divide-y divide-slate-50">
                      {students.filter(s => selectedCourse?.students.includes(s.id)).map(s => (
                        <div key={s.id} className="p-10 hover:bg-blue-50/10 transition-all flex items-center justify-between group">
                           <div className="flex items-center gap-8">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} className="w-16 h-16 rounded-[28px] border-4 border-white shadow-2xl group-hover:scale-110 transition-transform" alt="" />
                              <div>
                                 <h5 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-none mb-2">{s.name}</h5>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {s.id} • Active Path</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-12">
                              <div className="text-center">
                                 <p className="text-2xl font-black text-slate-900 leading-none">{s.attendance || 98}%</p>
                                 <p className="text-[8px] font-black text-slate-400 uppercase mt-2">Presence</p>
                              </div>
                              <div className="text-center">
                                 <p className="text-2xl font-black text-blue-600 leading-none">{s.gpa.toFixed(2)}</p>
                                 <p className="text-[8px] font-black text-slate-400 uppercase mt-2">Merit GPA</p>
                              </div>
                              <button className="p-4 bg-slate-50 text-slate-300 rounded-3xl group-hover:bg-slate-900 group-hover:text-white transition-all"><ChevronRight size={24}/></button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomManager;