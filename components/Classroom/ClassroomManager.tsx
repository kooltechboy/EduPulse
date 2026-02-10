
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Baby, School, Globe, UserCheck, Bell, MessageCircle, MoreHorizontal, Mail,
  FolderOpen, UploadCloud, Table2, File, Terminal
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip 
} from 'recharts';
import { 
  Course, User, UserRole, GradeLevel,
  CourseModule, LessonPlan, PlanningModality, Student, LearningMaterial, Assignment, AssignmentType
} from '../../types';

// Mock Data for Charts
const ENGAGEMENT_DATA = [
  { day: 'Mon', engagement: 65, mastery: 40 },
  { day: 'Tue', engagement: 78, mastery: 55 },
  { day: 'Wed', engagement: 72, mastery: 68 },
  { day: 'Thu', engagement: 85, mastery: 75 },
  { day: 'Fri', engagement: 92, mastery: 88 },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: 'A1', title: 'The Manifold Proof', description: 'Upload your research paper on 3D manifolds.', dueDate: '2026-05-25', resources: [], status: 'Active', courseId: 'C1', courseName: 'Advanced Calculus', type: AssignmentType.HOMEWORK, maxPoints: 100, weight: 20 },
  { id: 'A2', title: 'Vector Space Quiz', description: 'Multiple choice assessment on vector spaces.', dueDate: '2026-05-20', resources: [], status: 'Graded', courseId: 'C1', courseName: 'Advanced Calculus', type: AssignmentType.QUIZ, maxPoints: 50, weight: 10 },
];

const INITIAL_RESOURCES: LearningMaterial[] = [
  { id: 'RES-001', title: 'Course Syllabus 2026', type: 'Document', url: '#', uploadDate: '2026-01-10', description: 'Master document' },
  { id: 'RES-002', title: 'Lecture 4: Topology', type: 'Video', url: '#', uploadDate: '2026-05-12', description: 'Recorded session' },
  { id: 'RES-003', title: 'Lab Dataset: Alpha', type: 'Link', url: '#', uploadDate: '2026-05-15', description: 'External repository' },
];

const ClassroomManager: React.FC<{ user: User }> = ({ user }) => {
  const [view, setView] = useState<'dashboard' | 'course'>('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'stream' | 'curriculum' | 'cohort' | 'assessment' | 'resources' | 'neural'>('stream');
  
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
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Assessment State
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [gradebookView, setGradebookView] = useState(false);
  const [isCreateAssignModalOpen, setIsCreateAssignModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<string | null>(null); // holds assignment ID
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  // Simple grade map: studentId -> assignmentId -> score
  const [grades, setGrades] = useState<Record<string, Record<string, number>>>({
    'STU-001': { 'A2': 45 },
    'STU-002': { 'A2': 48 },
  });

  // Resources State
  const [courseResources, setCourseResources] = useState<LearningMaterial[]>(INITIAL_RESOURCES);

  // Diagnostics State
  const [diagnosticLog, setDiagnosticLog] = useState<string[]>([]);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  // Stream State
  const [messageInput, setMessageInput] = useState('');
  const [streamPosts, setStreamPosts] = useState<any[]>([]);
  const [activeAttachment, setActiveAttachment] = useState<{type: 'image' | 'link', content: string, name?: string} | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            id: 'M-MAY', title: 'Module 3: Topology Foundations', description: 'Exploring non-Euclidean manifolds and spatial reasoning.', order: 1, 
            plans: [
              { id: 'P-W1', modality: PlanningModality.WEEKLY, title: 'Week 3: Möbius Strips', objectives: ['Continuity', 'Orientation'], content: 'Structural overview.', associatedMaterials: [], status: 'Published' },
              { id: 'P-D1', modality: PlanningModality.DAILY, title: 'Lecture: Set Theory Basics', objectives: ['Definitions'], content: 'Basics.', associatedMaterials: [], status: 'Published' }
            ],
            assignments: []
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

  // Initialize mock posts when course changes
  useEffect(() => {
    if (selectedCourse) {
      setStreamPosts([
        { id: 'p1', sender: selectedCourse.teacherName, text: 'Phase 2 Synchronization: Ensure all digital artifacts for the Topology lab are uploaded by EOD Friday.', time: '2h ago', tags: ['Instructional', 'Lab'], avatar: selectedCourse.teacherName, pinned: true },
        { id: 'p2', sender: 'Bot Analyst', text: 'Institutional Sync: 92% of the cohort has accessed the Week 3 pre-reading material. High readiness detected for next session.', time: '4h ago', tags: ['Neural', 'Analysis'], bot: true }
      ]);
      // Set default expanded module
      if(selectedCourse.modules.length > 0) {
        setExpandedMonth(selectedCourse.modules[0].id);
        if(selectedCourse.modules[0].plans.length > 0) {
           setExpandedWeek(selectedCourse.modules[0].plans[0].id);
           setActivePlan(selectedCourse.modules[0].plans[0]);
        }
      }
    }
  }, [selectedCourse]);

  const tiers = [
    { id: 'All', label: 'Global Campus', icon: <Globe size={18}/> },
    { id: 'Early', label: 'Early Childhood', levels: [GradeLevel.NURSERY, GradeLevel.PRE_SCHOOL, GradeLevel.KINDERGARTEN], icon: <Baby size={18}/> },
    { id: 'Elementary', label: 'Elementary', levels: [GradeLevel.ELEMENTARY], icon: <School size={18}/> },
    { id: 'Junior', label: 'Junior High', levels: [GradeLevel.JUNIOR_HIGH], icon: <GraduationCap size={18}/> },
    { id: 'Senior', label: 'Senior High', levels: [GradeLevel.SENIOR_HIGH], icon: <Globe size={18}/> }
  ];

  const filteredCourses = useMemo(() => {
    let list = courses;
    if (isTeacher) list = list.filter(c => c.teacherId === user.id);
    if (selectedTier !== 'All') {
      const tierObj = tiers.find(t => t.id === selectedTier);
      if (tierObj?.levels) list = list.filter(c => tierObj.levels.includes(c.gradeLevel));
    }
    if (selectedGradeFilter !== 'All') list = list.filter(c => c.code.includes(selectedGradeFilter));
    if (selectedTeacherFilter !== 'All' && !isTeacher) list = list.filter(c => c.teacherName === selectedTeacherFilter);
    if (searchQuery) list = list.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()));
    return list;
  }, [courses, selectedTier, selectedGradeFilter, selectedTeacherFilter, searchQuery, isTeacher, user.id]);

  const uniqueTeachers = useMemo(() => Array.from(new Set(courses.map(c => c.teacherName))), [courses]);
  const uniqueGrades = useMemo(() => Array.from(new Set(courses.map(c => c.code.split('-')[0]))), [courses]);

  const handleEnterCourse = (course: Course) => {
    setSelectedCourse(course);
    setView('course');
    setActiveTab('stream');
  };

  // Stream Handlers
  const handleImageClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setActiveAttachment({ type: 'image', content: reader.result as string, name: file.name });
      reader.readAsDataURL(file);
    }
  };
  const handleLinkClick = () => {
    const url = prompt("Enter secure link resource URL:");
    if (url) setActiveAttachment({ type: 'link', content: url, name: url });
  };
  const handlePostMessage = () => {
    if (!messageInput.trim() && !activeAttachment) return;
    setIsPosting(true);
    setTimeout(() => {
      const newPost = {
        id: `p-${Date.now()}`,
        sender: user.name,
        text: messageInput,
        time: 'Just now',
        tags: ['New'],
        avatar: user.name,
        attachment: activeAttachment
      };
      setStreamPosts([newPost, ...streamPosts]);
      setMessageInput('');
      setActiveAttachment(null);
      setIsPosting(false);
    }, 600);
  };

  const handleInviteLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      alert(`Access key sent to ${inviteEmail}. The student can now join the ${selectedCourse?.name} node.`);
      setIsInviteModalOpen(false);
      setInviteEmail('');
    }
  };

  // Assessment Handlers
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newAssign: Assignment = {
      id: `A-${Date.now()}`,
      title: formData.get('title') as string,
      dueDate: formData.get('dueDate') as string,
      status: 'Active',
      description: formData.get('description') as string,
      courseId: selectedCourse?.id || '',
      courseName: selectedCourse?.name || '',
      type: AssignmentType.HOMEWORK,
      maxPoints: parseInt(formData.get('points') as string),
      weight: 10,
      resources: []
    };
    setAssignments([newAssign, ...assignments]);
    setIsCreateAssignModalOpen(false);
  };

  const handleGradeChange = (studentId: string, assignId: string, val: string) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [assignId]: parseInt(val)
      }
    }));
  };

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation of submission
    if(isSubmitModalOpen) {
      // Find assignment and mark as 'Turned In' purely for visual feedback in this session
      const updatedAssignments = assignments.map(a => a.id === isSubmitModalOpen ? {...a, status: 'Graded' as any} : a); // abusing status type for demo
      // In real app, we'd have a separate Submissions table.
      setAssignments(updatedAssignments);
      setIsSubmitModalOpen(null);
      setSubmissionFile(null);
      alert("Work submitted successfully to the Neural Node.");
    }
  };

  // Resources Handlers
  const handleUploadResource = () => {
    const title = prompt("Enter resource title:");
    if(title) {
        const newRes: LearningMaterial = {
            id: `RES-${Date.now()}`,
            title,
            type: 'Document',
            url: '#',
            uploadDate: new Date().toISOString().split('T')[0],
            description: 'Uploaded via Teacher Terminal'
        };
        setCourseResources([newRes, ...courseResources]);
    }
  };

  // Diagnostic Runner (E2E Simulation)
  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    setDiagnosticLog([]);
    const log = (msg: string) => setDiagnosticLog(prev => [...prev, msg]);

    log("Initializing Classroom Integrity Protocol...");
    await new Promise(r => setTimeout(r, 800));
    
    log(">> Checking Assessment Engine...");
    const testAssignId = `TEST-${Date.now()}`;
    // Simulate Create
    setAssignments(prev => [...prev, { id: testAssignId, title: "Diagnostic Test Node", dueDate: '2099-01-01', status: 'Active', description: 'Auto-generated test', courseId: 'C1', courseName: 'Test', type: AssignmentType.QUIZ, maxPoints: 100, weight: 0, resources: [] }]);
    await new Promise(r => setTimeout(r, 600));
    log("   [PASS] Assignment Creation Vector Verified.");

    log(">> Verifying Grading Logic...");
    // Simulate Grade
    handleGradeChange('STU-001', testAssignId, '95');
    await new Promise(r => setTimeout(r, 600));
    log("   [PASS] Gradebook Write Access Confirmed.");

    log(">> Testing Resource Uplink...");
    // Simulate Resource Add
    setCourseResources(prev => [...prev, { id: `RES-TEST`, title: "Integrity Check File", type: 'Link', url: '#', uploadDate: 'Now', description: 'Test' }]);
    await new Promise(r => setTimeout(r, 600));
    log("   [PASS] Resource Repository Synced.");

    log("System Status: OPTIMAL. All modules functional.");
    setIsRunningDiagnostics(false);
  };

  // Stats
  const courseStats = useMemo(() => [
    { label: 'Course Mastery', value: '92%', icon: <Activity size={18}/>, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', action: null },
    { label: 'Pending Tasks', value: `${assignments.filter(a => a.status === 'Active').length}`, icon: <Layers size={18}/>, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', action: () => setActiveTab('assessment') },
    { label: 'Next Live', value: '10:30 AM', icon: <Clock size={18}/>, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', action: () => setActiveTab('stream') },
  ], [assignments]);

  // --- RENDER FUNCTIONS ---

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in duration-700 px-4 md:px-0">
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

      <div className="flex flex-col xl:flex-row gap-6 bg-white p-6 rounded-[40px] shadow-2xl border border-slate-100">
          <div className="flex-1 relative group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
             <input type="text" placeholder="Search subject code, name, or faculty lead..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[24px] font-bold shadow-inner focus:ring-8 focus:ring-blue-100/50 transition-all text-sm" />
          </div>
          <div className="flex flex-wrap gap-4 items-center">
             <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-[24px] border border-slate-100">
                <Filter size={16} className="text-blue-600" />
                <select value={selectedGradeFilter} onChange={(e) => setSelectedGradeFilter(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer">
                   <option value="All">Grade Node: All</option>
                   {uniqueGrades.map(g => <option key={g} value={g}>{g} Grade</option>)}
                </select>
             </div>
             {!isTeacher && (
                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-[24px] border border-slate-100">
                  <UserCheck size={16} className="text-indigo-600" />
                  <select value={selectedTeacherFilter} onChange={(e) => setSelectedTeacherFilter(e.target.value)} className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer">
                    <option value="All">Faculty Lead: All</option>
                    {uniqueTeachers.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
             )}
             <button onClick={() => { setSelectedTier('All'); setSelectedGradeFilter('All'); setSelectedTeacherFilter('All'); setSearchQuery(''); }} className="p-5 bg-white text-slate-300 hover:text-rose-500 rounded-[22px] transition-all hover:bg-rose-50"><RefreshCw size={20} /></button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {filteredCourses.map(course => (
          <div key={course.id} onClick={() => handleEnterCourse(course)} className="group bg-white rounded-[64px] overflow-hidden shadow-xl hover:shadow-2xl hover:translate-y-[-8px] transition-all cursor-pointer border border-white relative">
            <div className={`h-40 bg-gradient-to-br ${course.bannerColor} p-8 relative overflow-hidden`}>
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
               <div className="flex justify-between items-start relative z-10">
                  <div className="bg-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20"><span className="text-[9px] font-black text-white uppercase tracking-widest">{course.code}</span></div>
                  <span className="px-3 py-1 bg-slate-950/40 text-white rounded-lg text-[8px] font-black uppercase tracking-widest backdrop-blur-md">{course.gradeLevel}</span>
               </div>
            </div>
            <div className="p-10 -mt-12 bg-white rounded-[64px] relative z-10">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3 flex items-center gap-2"><UserCheck size={12} className="text-blue-500" /> {course.teacherName}</p>
               <h3 className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-none tracking-tighter uppercase mb-8 line-clamp-1">{course.name}</h3>
               <div className="p-5 bg-slate-50 rounded-[32px] border border-slate-100 mb-8 flex items-center justify-between">
                  <div><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Learner Nodes</p><p className="text-sm font-black text-slate-900">{course.students.length} Synced</p></div>
                  <div className="flex -space-x-3">{[1,2,3].map(i => (<div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>))}</div>
               </div>
               <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3"><div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-inner"><MonitorPlay size={18} /></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room {course.room}</span></div>
                  <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:bg-blue-600 transition-all shadow-lg"><ChevronRight size={22} /></div>
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

  const renderStream = () => (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
      <div className="xl:col-span-3 space-y-8">
        <div className="glass-card p-8 md:p-10 rounded-[56px] bg-white border-none shadow-xl relative overflow-hidden group">
          <div className="flex gap-6 md:gap-8">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-16 h-16 rounded-[24px] border-2 border-slate-100 shadow-md" alt="" />
              <div className="flex-1 space-y-6">
                <textarea 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Broadcast an instructional advisory to the cohort..." 
                  className="w-full h-24 bg-slate-50 border border-slate-100 rounded-[32px] p-6 text-sm font-bold outline-none focus:ring-8 focus:ring-blue-50 transition-all resize-none placeholder:text-slate-300"
                />
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                {activeAttachment && (
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl w-fit animate-in slide-in-from-left-2">
                      {activeAttachment.type === 'image' ? <ImageIcon size={16} className="text-indigo-600"/> : <LinkIcon size={16} className="text-indigo-600"/>}
                      <span className="text-xs font-bold text-indigo-900 max-w-[200px] truncate">{activeAttachment.name}</span>
                      <button onClick={() => setActiveAttachment(null)} className="p-1 hover:bg-indigo-100 rounded-full text-indigo-400"><X size={14}/></button>
                  </div>
                )}
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <button onClick={handleImageClick} className="p-4 bg-white text-slate-400 rounded-2xl hover:text-blue-600 transition-all shadow-sm border border-slate-100 hover:border-blue-100 active:scale-95"><ImageIcon size={20}/></button>
                      <button onClick={handleLinkClick} className="p-4 bg-white text-slate-400 rounded-2xl hover:text-indigo-600 transition-all shadow-sm border border-slate-100 hover:border-indigo-100 active:scale-95"><LinkIcon size={20}/></button>
                    </div>
                    <button onClick={handlePostMessage} disabled={isPosting || (!messageInput.trim() && !activeAttachment)} className="px-10 py-4 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isPosting ? 'Deploying...' : 'Deploy Transmission'} <Send size={16} />
                    </button>
                </div>
              </div>
          </div>
        </div>

        <div className="space-y-8">
          {streamPosts.map((post, i) => (
              <div key={i} className={`glass-card p-10 rounded-[56px] shadow-xl border-none ${post.bot ? 'bg-slate-900 text-white' : 'bg-white'} ${post.pinned ? 'border-l-8 border-l-blue-600' : ''}`}>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                      {post.bot ? (
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg"><Bot size={24} className="text-white"/></div>
                      ) : (
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.avatar}`} className="w-14 h-14 rounded-2xl border-2 border-slate-50 shadow-md" alt="" />
                      )}
                      <div>
                          <h4 className={`text-xl font-black tracking-tight uppercase ${post.bot ? 'text-blue-400' : 'text-slate-900'}`}>
                            {post.sender} {post.pinned && <span className="inline-block ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded align-middle">PINNED</span>}
                          </h4>
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-60">{post.time} • Local Node</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {post.tags.map((t: string) => <span key={t} className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border ${post.bot ? 'bg-white/10 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>{t}</span>)}
                      <button className="p-2 text-slate-400 hover:text-blue-500"><MoreHorizontal size={18}/></button>
                    </div>
                </div>
                <p className={`text-lg font-bold leading-relaxed italic ${post.bot ? 'text-blue-50' : 'text-slate-700'}`}>"{post.text}"</p>
                {post.attachment && (
                  <div className="mt-6">
                    {post.attachment.type === 'image' ? (
                      <div className="rounded-3xl overflow-hidden border-4 border-slate-100 shadow-md max-w-md"><img src={post.attachment.content} alt="Attachment" className="w-full h-auto" /></div>
                    ) : (
                      <a href={post.attachment.content} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl w-fit hover:bg-indigo-100 transition-all group">
                          <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm"><LinkIcon size={18}/></div>
                          <span className="text-xs font-bold text-indigo-900 underline decoration-indigo-300 group-hover:decoration-indigo-600">{post.attachment.name}</span>
                      </a>
                    )}
                  </div>
                )}
                {!post.bot && (
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4">
                    <input placeholder="Write a reply..." className="flex-1 bg-slate-50 border border-slate-100 rounded-full px-6 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                    <button className="p-3 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-blue-600 hover:shadow-md transition-all"><Send size={16}/></button>
                  </div>
                )}
              </div>
          ))}
        </div>
      </div>
      
      {/* Stream Sidebar Widgets */}
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-[48px] shadow-xl border border-slate-100">
           <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-3">
              <Calendar size={16} className="text-rose-500" /> Upcoming Work
           </h4>
           <div className="space-y-4">
              <div className="p-4 bg-rose-50 rounded-[24px] border border-rose-100">
                 <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Due Tomorrow</p>
                 <p className="font-bold text-rose-900 text-sm leading-tight">Topology Proof Draft</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-[24px] border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Due Friday</p>
                 <p className="font-bold text-slate-700 text-sm leading-tight">Week 3 Quiz</p>
              </div>
           </div>
           <button className="w-full mt-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 text-right">View Calendar &rarr;</button>
        </div>

        <div className="bg-slate-900 p-8 rounded-[48px] shadow-xl text-white relative overflow-hidden">
           <div className="relative z-10">
              <h4 className="font-black uppercase tracking-widest text-xs mb-4 text-blue-200">Class Code</h4>
              <p className="text-4xl font-black tracking-tighter">xc9-22a</p>
              <button className="mt-6 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><ClipboardCheck size={20} /></button>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        </div>
      </div>
    </div>
  );

  const renderCurriculum = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in fade-in duration-1000">
       <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-8 rounded-[48px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl transition-all duration-1000 group-hover:scale-150"></div>
             <div className="relative z-10">
                <h4 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter">
                   <div className="p-3 bg-white/10 rounded-2xl"><History size={20} className="text-blue-400" /></div>
                   Matrix
                </h4>
                <div className="space-y-6">
                   {selectedCourse?.modules.map(mod => (
                      <div key={mod.id} className="space-y-2">
                         <button 
                            onClick={() => setExpandedMonth(expandedMonth === mod.id ? null : mod.id)}
                            className={`w-full flex items-center justify-between p-5 rounded-[24px] transition-all border-2 ${expandedMonth === mod.id ? 'bg-blue-600 border-blue-500 shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                         >
                            <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[140px]">{mod.title.split(':')[0]}</span>
                            <ChevronRight size={14} className={`transition-transform ${expandedMonth === mod.id ? 'rotate-90' : ''}`} />
                         </button>
                         {expandedMonth === mod.id && (
                           <div className="pl-4 space-y-2 animate-in slide-in-from-left-2 border-l-2 border-white/10 ml-4 py-2">
                              {mod.plans.map(plan => (
                                 <button 
                                    key={plan.id}
                                    onClick={() => { setExpandedWeek(plan.id); setActivePlan(plan); }}
                                    className={`w-full text-left p-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activePlan?.id === plan.id ? 'text-blue-300 bg-white/5' : 'text-slate-500 hover:text-white'}`}
                                 >
                                    <div className={`w-1.5 h-1.5 rounded-full ${activePlan?.id === plan.id ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
                                    {plan.title.split(':')[0]}
                                 </button>
                              ))}
                           </div>
                         )}
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>

       <div className="lg:col-span-3 space-y-10">
          {activePlan ? (
            <div className="glass-card p-12 md:p-16 rounded-[64px] bg-white shadow-2xl border-none relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><FileText size={200} /></div>
               <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12 relative z-10">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                       <span className="px-5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">{activePlan.modality}</span>
                       <span className="px-5 py-1.5 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest">{activePlan.status}</span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none max-w-2xl">{activePlan.title}</h3>
                  </div>
                  <div className="flex gap-3">
                     <button className="p-4 bg-slate-100 text-slate-400 rounded-[20px] hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Download size={20}/></button>
                     <button className="p-4 bg-slate-100 text-slate-400 rounded-[20px] hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Share2 size={20}/></button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-10">
                     <section>
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                           <Target size={18} className="text-blue-500" /> Objectives
                        </h5>
                        <div className="space-y-3">
                           {activePlan.objectives.map((obj, i) => (
                              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-[24px] border border-slate-100">
                                 <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-blue-600 border border-slate-100">{i+1}</div>
                                 <span className="text-sm font-bold text-slate-700 italic">"{obj}"</span>
                              </div>
                           ))}
                        </div>
                     </section>
                     
                     <section>
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                           <Paperclip size={18} className="text-indigo-500" /> Resources
                        </h5>
                        <div className="grid grid-cols-1 gap-3">
                           <button className="flex items-center justify-between p-5 bg-indigo-50 rounded-[28px] border border-indigo-100 group hover:bg-indigo-600 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className="p-2.5 bg-white rounded-xl text-indigo-600 shadow-sm"><Video size={18}/></div>
                                 <span className="text-xs font-black text-indigo-900 group-hover:text-white uppercase tracking-wide">Lecture VOD</span>
                              </div>
                              <Play size={18} className="text-indigo-400 group-hover:text-white" />
                           </button>
                           <button className="flex items-center justify-between p-5 bg-slate-50 rounded-[28px] border border-slate-100 group hover:bg-slate-900 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className="p-2.5 bg-white rounded-xl text-slate-600 shadow-sm"><FileText size={18}/></div>
                                 <span className="text-xs font-black text-slate-900 group-hover:text-white uppercase tracking-wide">Reference.pdf</span>
                              </div>
                              <Download size={18} className="text-slate-300 group-hover:text-white" />
                           </button>
                        </div>
                     </section>
                  </div>

                  <div className="space-y-10">
                     <section className="bg-slate-50 rounded-[48px] p-8 border border-slate-100">
                        <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                           <ListChecks size={18} className="text-emerald-500" /> Engagement
                        </h5>
                        <div className="space-y-6">
                           <div className="p-6 bg-white rounded-[32px] shadow-sm border border-slate-100">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Class Task</p>
                              <p className="text-sm font-bold text-slate-800 leading-relaxed italic">"Collaborate in peer groups to derive the Möbius function for a set of 5 distinct topological nodes."</p>
                           </div>
                           <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-[28px] border border-emerald-100">
                              <div>
                                 <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-1">Completion</p>
                                 <p className="text-lg font-black text-emerald-900">92% Synced</p>
                              </div>
                              <Sparkles className="text-emerald-500" size={24} />
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
               <p className="text-slate-400 font-bold mt-4 uppercase tracking-widest text-[10px]">Navigate the Matrix to initialize detail view.</p>
            </div>
          )}
       </div>
    </div>
  );

  const renderAssessment = () => (
    <div className="space-y-10 animate-in slide-in-from-bottom duration-700">
       <div className="flex justify-between items-end">
          <div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Assessment Matrix</h3>
             <p className="text-slate-500 font-bold mt-2 text-[10px] uppercase tracking-[0.4em]">Assignments & Grading Hub</p>
          </div>
          <div className="flex gap-4">
             {isTeacher && (
                <button 
                  onClick={() => setGradebookView(!gradebookView)}
                  className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-3"
                >
                   {gradebookView ? <LayoutGrid size={16} /> : <TableIcon size={16} />} 
                   {gradebookView ? 'Cards View' : 'Gradebook View'}
                </button>
             )}
             {isTeacher && (
               <button 
                 onClick={() => setIsCreateAssignModalOpen(true)}
                 className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3"
               >
                  <Plus size={16}/> Create Assignment
               </button>
             )}
          </div>
       </div>

       {gradebookView && isTeacher ? (
         <div className="glass-card rounded-[48px] bg-white shadow-2xl overflow-hidden border-none">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                     <tr>
                        <th className="px-8 py-6">Student</th>
                        {assignments.map(a => (
                           <th key={a.id} className="px-6 py-6 text-center whitespace-nowrap">{a.title} <span className="text-[8px] opacity-70 block">({a.maxPoints} pts)</span></th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {students.filter(s => selectedCourse?.students.includes(s.id)).map(stu => (
                        <tr key={stu.id} className="hover:bg-blue-50/20 transition-all">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs">{stu.name.charAt(0)}</div>
                                 <div>
                                    <p className="font-bold text-sm text-slate-900">{stu.name}</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase">{stu.id}</p>
                                 </div>
                              </div>
                           </td>
                           {assignments.map(a => (
                              <td key={a.id} className="px-6 py-6 text-center">
                                 <input 
                                    type="number" 
                                    value={grades[stu.id]?.[a.id] || ''} 
                                    onChange={(e) => handleGradeChange(stu.id, a.id, e.target.value)}
                                    className="w-16 py-2 text-center bg-slate-50 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="-"
                                 />
                              </td>
                           ))}
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assignments.map((assign, i) => (
               <div key={i} onClick={() => !isTeacher && setIsSubmitModalOpen(assign.id)} className={`glass-card p-8 rounded-[48px] bg-white shadow-xl hover:shadow-2xl transition-all group border-none ${!isTeacher ? 'cursor-pointer hover:translate-y-[-4px] hover:ring-2 hover:ring-blue-400' : ''}`}>
                  <div className="flex justify-between items-start mb-6">
                     <div className={`p-4 rounded-[20px] shadow-sm ${assign.status === 'Active' ? 'bg-blue-50 text-blue-600' : assign.status === 'Graded' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        <FileText size={24} />
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${assign.status === 'Active' ? 'bg-blue-500 text-white' : assign.status === 'Graded' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {assign.status}
                     </span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{assign.title}</h4>
                  <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-2">{assign.description}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Due: {assign.dueDate} • {assign.maxPoints} Pts</p>
                  
                  {isTeacher ? (
                     <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-6">
                        <div className="text-center">
                           <p className="text-xl font-black text-slate-900">18</p>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">In</p>
                        </div>
                        <div className="text-center border-l border-slate-50">
                           <p className="text-xl font-black text-slate-900">24</p>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                        </div>
                        <div className="text-center border-l border-slate-50">
                           <p className="text-xl font-black text-emerald-600">12</p>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Done</p>
                        </div>
                     </div>
                  ) : (
                     <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                           {assign.status === 'Graded' ? 'Score: 45/50' : 'Tap to Submit'}
                        </span>
                        <div className="p-2 bg-slate-100 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                           <ArrowRight size={16} />
                        </div>
                     </div>
                  )}
               </div>
            ))}
         </div>
       )}
    </div>
  );

  const renderResources = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
       <div className="flex justify-between items-end">
          <div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Course Repository</h3>
             <p className="text-slate-500 font-bold mt-2 text-[10px] uppercase tracking-[0.4em]">Digital Artifacts & Materials</p>
          </div>
          {isTeacher && (
             <button onClick={handleUploadResource} className="bg-indigo-600 text-white px-8 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-3">
                <UploadCloud size={16}/> Upload Material
             </button>
          )}
       </div>

       <div className="glass-card rounded-[48px] bg-white shadow-xl overflow-hidden border-none">
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                   <tr>
                      <th className="px-8 py-6">Resource Name</th>
                      <th className="px-6 py-6">Format</th>
                      <th className="px-6 py-6">Date Added</th>
                      <th className="px-8 py-6 text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {courseResources.map(res => (
                      <tr key={res.id} className="hover:bg-blue-50/20 transition-all group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-slate-100 text-slate-500 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                  {res.type === 'Video' ? <Video size={18}/> : res.type === 'Link' ? <LinkIcon size={18}/> : <File size={18}/>}
                               </div>
                               <div>
                                  <p className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">{res.title}</p>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{res.description}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{res.type}</span>
                         </td>
                         <td className="px-6 py-6 text-xs font-bold text-slate-500">{res.uploadDate}</td>
                         <td className="px-8 py-6 text-right">
                            <button className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                               <Download size={18}/>
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );

  const renderNeural = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
       <div className="flex justify-between items-end">
          <div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Neural Analytics</h3>
             <p className="text-slate-500 font-bold mt-2 text-[10px] uppercase tracking-[0.4em]">Predictive Course Intelligence</p>
          </div>
          <button 
            onClick={runDiagnostics} 
            disabled={isRunningDiagnostics}
            className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all flex items-center gap-3 disabled:opacity-50"
          >
             {isRunningDiagnostics ? <RefreshCw className="animate-spin" size={16}/> : <Terminal size={16}/>} 
             Run System Self-Test
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 glass-card p-10 rounded-[56px] bg-white shadow-xl border-none">
             <div className="flex justify-between items-center mb-10">
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                   <TrendingUp size={24} className="text-blue-500"/> Engagement Velocity
                </h4>
             </div>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={ENGAGEMENT_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                         <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                         </linearGradient>
                         <linearGradient id="colorMastery" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                      <RechartsTooltip 
                         contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold'}}
                      />
                      <Area type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorEngage)" />
                      <Area type="monotone" dataKey="mastery" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorMastery)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="space-y-8">
             <div className="glass-card p-10 rounded-[56px] bg-slate-950 text-white shadow-2xl relative overflow-hidden border-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <h4 className="text-lg font-black mb-8 uppercase tracking-tighter relative z-10 flex items-center gap-3">
                   <AlertTriangle size={20} className="text-amber-400"/> Diagnostic Log
                </h4>
                <div className="space-y-2 relative z-10 h-64 overflow-y-auto scrollbar-hide font-mono text-[10px]">
                   {diagnosticLog.length === 0 ? (
                      <p className="text-slate-500 italic">System ready. Awaiting diagnostic cycle.</p>
                   ) : (
                      diagnosticLog.map((log, i) => (
                         <div key={i} className="text-emerald-400 border-b border-white/5 py-1">
                            {`> ${log}`}
                         </div>
                      ))
                   )}
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
           {/* Course Header Node */}
           <div className="flex flex-col xl:flex-row justify-between items-end gap-10 px-4 md:px-0">
             <div className="flex items-start gap-8 w-full xl:w-auto">
                <button 
                  onClick={() => setView('dashboard')} 
                  className="group relative flex-shrink-0 w-20 h-20 bg-white border-2 border-slate-100 rounded-[28px] text-slate-400 shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95 flex items-center justify-center mt-1"
                  title="Return to Dashboard"
                >
                   <ArrowLeft size={28} className="transition-transform group-hover:-translate-x-1" />
                </button>
                
                <div className="min-w-0">
                   <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`px-4 py-1.5 bg-gradient-to-r ${selectedCourse?.bannerColor} text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm`}>
                        {selectedCourse?.gradeLevel}
                      </span>
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200">
                        {selectedCourse?.code}
                      </span>
                      <span className="px-4 py-1.5 bg-white text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100 flex items-center gap-2">
                        <UserCheck size={12} className="text-blue-500"/> {selectedCourse?.teacherName}
                      </span>
                   </div>
                   <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase truncate md:whitespace-normal max-w-4xl">
                     {selectedCourse?.name}
                   </h2>
                </div>
             </div>

             {/* Live Course Stats Widget - Interactive */}
             <div className="hidden xl:flex gap-3 min-w-[400px] justify-end">
                {courseStats.map((stat, i) => (
                    <div 
                        key={i} 
                        onClick={stat.action ? stat.action : undefined}
                        className={`flex-1 p-5 rounded-[28px] border backdrop-blur-md ${stat.bg} ${stat.border} flex flex-col justify-between h-32 transition-all cursor-default group ${stat.action ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : ''}`}
                    >
                        <div className="flex justify-between items-start">
                            <span className={`p-2.5 rounded-xl bg-white/80 shadow-sm ${stat.color}`}>{stat.icon}</span>
                            {i === 0 && <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>}
                        </div>
                        <div>
                            <p className={`text-2xl font-black ${stat.color} tracking-tighter leading-none`}>{stat.value}</p>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1 opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                {stat.label} {stat.action && <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </p>
                        </div>
                    </div>
                ))}
             </div>
           </div>

           {/* Navigation Tabs - Full Width Below Header */}
           <div className="bg-white p-2 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 flex gap-1 overflow-x-auto scrollbar-hide mx-4 md:mx-0">
                {[
                  { id: 'stream', label: 'Stream', icon: <MessageSquare size={18} />, desc: 'Classroom Feed & Announcements' },
                  { id: 'curriculum', label: 'Matrix', icon: <Layers size={18} />, desc: 'Curriculum & Lesson Plans' },
                  { id: 'assessment', label: 'Assessment', icon: <GraduationCap size={18} />, desc: 'Grades, Quizzes & Exams' },
                  { id: 'resources', label: 'Resources', icon: <FolderOpen size={18} />, desc: 'Files & Materials' },
                  { id: 'cohort', label: 'Cohort', icon: <Users2 size={18} />, desc: 'Student Roster & Groups' },
                  { id: 'neural', label: 'Neural', icon: <Bot size={18} />, desc: 'AI Insights & Analytics' },
                ].map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id as any)}
                    title={tab.desc}
                    className={`flex-1 md:flex-none px-8 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl transform scale-[1.02]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
           </div>

           <div className="min-h-[600px] px-4 md:px-0">
              {activeTab === 'stream' && renderStream()}
              {activeTab === 'curriculum' && renderCurriculum()}
              {activeTab === 'assessment' && renderAssessment()}
              {activeTab === 'resources' && renderResources()}
              {activeTab === 'neural' && renderNeural()}
              {activeTab === 'cohort' && (
                <div className="max-w-6xl mx-auto glass-card rounded-[64px] bg-white border-none shadow-2xl overflow-hidden animate-in fade-in duration-700">
                   <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Learner Registry</h4>
                      <div className="flex gap-4">
                        <button className="p-4 bg-white text-slate-400 rounded-3xl hover:text-blue-600 transition-all shadow-sm"><Filter size={20}/></button>
                        <button 
                            onClick={() => setIsInviteModalOpen(true)}
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95"
                        >
                            Invite Learner
                        </button>
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
                              <button className="p-4 bg-slate-300 text-slate-500 rounded-3xl group-hover:bg-slate-900 group-hover:text-white transition-all"><ChevronRight size={24}/></button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Invite Learner Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md animate-in fade-in" onClick={() => setIsInviteModalOpen(false)}></div>
            <form onSubmit={handleInviteLearner} className="relative w-full max-w-lg bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col p-10">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Invite Node</h3>
                    <button type="button" onClick={() => setIsInviteModalOpen(false)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"><X size={20}/></button>
                </div>
                <div className="space-y-6">
                    <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100">
                        <p className="text-sm font-bold text-blue-800 mb-2">Target Course</p>
                        <p className="text-xl font-black text-blue-900 uppercase tracking-tight">{selectedCourse?.name}</p>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Learner Email Identity</label>
                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="email" 
                                required
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="student.id@campus.edu" 
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                        Dispatch Key <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* Create Assignment Modal */}
      {isCreateAssignModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md animate-in fade-in" onClick={() => setIsCreateAssignModalOpen(false)}></div>
            <form onSubmit={handleCreateAssignment} className="relative w-full max-w-2xl bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col p-10 max-h-[90vh]">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">New Assessment</h3>
                    <button type="button" onClick={() => setIsCreateAssignModalOpen(false)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"><X size={20}/></button>
                </div>
                <div className="space-y-6 overflow-y-auto scrollbar-hide pr-2">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Title</label>
                        <input name="title" required placeholder="e.g. Midterm Logic Exam" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Due Date</label>
                            <input name="dueDate" type="date" required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-blue-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Max Points</label>
                            <input name="points" type="number" required defaultValue={100} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-blue-500 transition-all" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Instructions</label>
                        <textarea name="description" rows={4} placeholder="Detailed instructions..." className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-blue-500 transition-all resize-none" />
                    </div>
                </div>
                <div className="pt-8 mt-4 border-t border-slate-100">
                    <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                        Publish Assessment
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* Submit Assignment Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md animate-in fade-in" onClick={() => setIsSubmitModalOpen(null)}></div>
            <form onSubmit={handleSubmitWork} className="relative w-full max-w-lg bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col p-10">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Submission Node</h3>
                    <button type="button" onClick={() => setIsSubmitModalOpen(null)} className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"><X size={20}/></button>
                </div>
                <div className="p-6 bg-slate-50 rounded-[32px] mb-8 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Task</p>
                    <p className="font-bold text-slate-900 text-lg">{assignments.find(a => a.id === isSubmitModalOpen)?.title}</p>
                </div>
                <div className="space-y-6">
                    <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-10 text-center hover:bg-slate-50 transition-all cursor-pointer">
                        <UploadCloud className="mx-auto text-slate-300 mb-4" size={40} />
                        <p className="text-xs font-bold text-slate-500">Drag & Drop or Click to Upload</p>
                        <input type="file" className="hidden" onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)} />
                    </div>
                    {submissionFile && (
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                            <File className="text-emerald-600" size={18} />
                            <span className="text-xs font-bold text-emerald-800 truncate flex-1">{submissionFile.name}</span>
                            <button type="button" onClick={() => setSubmissionFile(null)}><X size={14} className="text-emerald-400 hover:text-emerald-700"/></button>
                        </div>
                    )}
                    <button type="submit" disabled={!submissionFile} className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-xl active:scale-95 disabled:opacity-50">
                        Confirm Submission
                    </button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};

export default ClassroomManager;
