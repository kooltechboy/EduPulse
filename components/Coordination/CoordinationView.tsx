
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Cpu, Sparkles, X, Plus, CheckCircle2, Zap, FileText, Download, 
  Globe, Activity, ShieldCheck, 
  ChevronRight, Wand2, Baby, School, GraduationCap, 
  Check, Handshake, Send, CheckCircle, 
  PieChart as PieChartIcon, 
  FileCheck,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, Tooltip, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, Legend, 
  RadialBarChart, RadialBar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, PolarRadiusAxis
} from 'recharts';
import { Syllabus, TeacherEvaluation, HRRequest, Student, Course } from '../../types';
import { generateFullSyllabus, generateTeacherFeedback } from '../../services/geminiService';

const COORDINATION_HUBS = [
  { id: 'COORD-01', scope: 'Kindergarten', icon: <Baby size={28} />, color: 'emerald' },
  { id: 'COORD-02', scope: 'Elementary Tier', icon: <School size={28} />, color: 'blue' },
  { id: 'COORD-03', scope: 'Secondary Tier', icon: <GraduationCap size={28} />, color: 'indigo' },
  { id: 'COORD-04', scope: 'Specialties', icon: <Globe size={28} />, color: 'rose' },
];

const ANALYTICS_DATA = {
  coverage: [
    { name: 'Kindergarten', coverage: 88, fill: '#10b981' },
    { name: 'Elementary', coverage: 72, fill: '#3b82f6' },
    { name: 'Secondary', coverage: 94, fill: '#6366f1' },
    { name: 'Specialties', coverage: 65, fill: '#f43f5e' },
  ],
  compliance: [
    { subject: 'Literacy', Kindergarten: 95, Elementary: 80, Secondary: 92, Specialties: 85, Average: 88, fullMark: 100 },
    { subject: 'Numeracy', Kindergarten: 90, Elementary: 85, Secondary: 78, Specialties: 70, Average: 81, fullMark: 100 },
    { subject: 'Ethics', Kindergarten: 85, Elementary: 92, Secondary: 88, Specialties: 95, Average: 90, fullMark: 100 },
    { subject: 'Digital', Kindergarten: 70, Elementary: 88, Secondary: 95, Specialties: 90, Average: 85, fullMark: 100 },
    { subject: 'Wellness', Kindergarten: 98, Elementary: 90, Secondary: 85, Specialties: 88, Average: 90, fullMark: 100 },
  ],
  trends: [
    { month: 'Jan', Kindergarten: 65, Elementary: 60, Secondary: 70, Specialties: 55 },
    { month: 'Feb', Kindergarten: 70, Elementary: 65, Secondary: 72, Specialties: 60 },
    { month: 'Mar', Kindergarten: 75, Elementary: 68, Secondary: 78, Specialties: 62 },
    { month: 'Apr', Kindergarten: 82, Elementary: 70, Secondary: 85, Specialties: 64 },
    { month: 'May', Kindergarten: 88, Elementary: 72, Secondary: 94, Specialties: 65 },
  ]
};

const CoordinationView: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState(COORDINATION_HUBS[2]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'syllabus' | 'evaluations' | 'hr'>('analytics');
  
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [evalNotes, setEvalNotes] = useState('');
  const [wizardStep, setWizardStep] = useState(1);
  const [aiSyllabus, setAiSyllabus] = useState<Syllabus | null>(null);

  const [hrRequests, setHrRequests] = useState<HRRequest[]>(() => JSON.parse(localStorage.getItem('edupulse_hr_requests') || '[]'));
  const [evaluations, setEvaluations] = useState<TeacherEvaluation[]>(() => JSON.parse(localStorage.getItem('edupulse_evals') || '[]'));
  const [syllabi, setSyllabi] = useState<Syllabus[]>(() => JSON.parse(localStorage.getItem('edupulse_syllabi') || '[]'));

  const [newEval, setNewEval] = useState<Partial<TeacherEvaluation>>({
    scores: { planning: 5, management: 5, assessment: 5, professionalism: 5 }
  });

  useEffect(() => {
    localStorage.setItem('edupulse_hr_requests', JSON.stringify(hrRequests));
    localStorage.setItem('edupulse_evals', JSON.stringify(evaluations));
    localStorage.setItem('edupulse_syllabi', JSON.stringify(syllabi));
  }, [hrRequests, evaluations, syllabi]);

  const handleEndorseHR = (id: string, endorse: boolean) => {
    setHrRequests(prev => prev.map(req => req.id === id ? { ...req, status: endorse ? 'ApprovedCoord' : 'RejectedCoord' } : req));
  };

  const handleArchitectSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const subject = formData.get('subject') as string;
    const standard = formData.get('standard') as string;
    
    if (!subject || !standard) return;

    setIsAIGenerating(true);
    const roadmap = await generateFullSyllabus(subject, selectedHub.scope, standard);
    
    if (roadmap) {
      setAiSyllabus({ 
        id: `SYL-${Date.now()}`, 
        subject, 
        gradeLevel: selectedHub.scope, 
        standard, 
        ...roadmap 
      });
      setWizardStep(2);
    }
    setIsAIGenerating(false);
  };

  const handleAIEvalFeedback = async () => {
    if (!newEval.teacherName || !evalNotes.trim()) return;
    setIsAIGenerating(true);
    const feedback = await generateTeacherFeedback(evalNotes, newEval.teacherName);
    setNewEval(prev => ({ ...prev, feedback }));
    setIsAIGenerating(false);
  };

  const saveSyllabus = () => {
    if (aiSyllabus) {
      setSyllabi([...syllabi, aiSyllabus]);
      setIsWizardOpen(false);
      setAiSyllabus(null);
      setWizardStep(1);
    }
  };

  const commitEval = () => {
    if (newEval.teacherName && newEval.feedback) {
      const evaluation: TeacherEvaluation = {
        id: `EV-${Date.now()}`,
        teacherName: newEval.teacherName,
        date: new Date().toISOString().split('T')[0],
        scores: newEval.scores as { planning: number; management: number; assessment: number; professionalism: number; },
        feedback: newEval.feedback,
        status: 'Finalized',
        coordinatorId: selectedHub.id
      };
      setEvaluations([...evaluations, evaluation]);
      setIsEvalModalOpen(false);
      setNewEval({ scores: { planning: 5, management: 5, assessment: 5, professionalism: 5 } });
      setEvalNotes('');
    }
  };

  // Helper to extract clean key from hub scope
  const getHubKey = (scope: string) => {
    if (scope.includes('Kindergarten')) return 'Kindergarten';
    if (scope.includes('Elementary')) return 'Elementary';
    if (scope.includes('Secondary')) return 'Secondary';
    return 'Specialties';
  };

  const currentHubKey = getHubKey(selectedHub.scope);

  const renderHubSelector = () => (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x">
      {COORDINATION_HUBS.map((hub) => (
        <button
          key={hub.id}
          onClick={() => setSelectedHub(hub)}
          className={`flex-shrink-0 w-64 md:w-auto md:flex-1 p-6 md:p-8 rounded-[32px] md:rounded-[48px] border-4 transition-all flex items-center gap-6 snap-center ${
            selectedHub.id === hub.id 
              ? `bg-slate-900 border-slate-900 text-white shadow-2xl scale-105` 
              : `bg-white border-white text-slate-400 hover:border-blue-100 hover:shadow-lg`
          }`}
        >
          <div className={`p-4 md:p-5 rounded-[20px] md:rounded-[28px] ${selectedHub.id === hub.id ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400 shadow-inner'}`}>
            {hub.icon}
          </div>
          <div className="text-left">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Coordinator Hub</p>
            <h4 className="text-lg md:text-xl font-black leading-tight tracking-tight uppercase">{hub.scope}</h4>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-10 md:space-y-12 pb-32 px-1">
      {renderHubSelector()}

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div>
           <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Command Matrix</h2>
           <p className="text-slate-500 font-bold italic mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
              <Cpu size={18} className="text-blue-500" /> {selectedHub.scope} Neural Oversight 2026
           </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[28px] md:rounded-[32px] shadow-2xl border border-slate-100 flex gap-2 w-full xl:w-auto overflow-x-auto scrollbar-hide">
           {[
             { id: 'analytics', label: 'Analytics', icon: <PieChartIcon size={14} /> },
             { id: 'syllabus', label: 'Syllabus', icon: <BookOpen size={14} /> },
             { id: 'evaluations', label: 'Audit', icon: <FileText size={14} /> },
             { id: 'hr', label: 'HR Flow', icon: <Handshake size={14} /> },
           ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 md:flex-none px-8 md:px-10 py-3.5 md:py-4 rounded-[20px] md:rounded-[24px] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {tab.icon} {tab.label}
              </button>
           ))}
        </div>
      </div>

      <div className="animate-in fade-in duration-700">
         {activeTab === 'analytics' && (
           <div className="space-y-10">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
               {/* RADIAL CHART: COVERAGE */}
               <div className="glass-card p-10 rounded-[48px] bg-white shadow-xl hover:shadow-2xl transition-all">
                 <h4 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-500" /> Syllabus Coverage
                 </h4>
                 <div className="h-[320px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <RadialBarChart innerRadius="20%" outerRadius="100%" barSize={20} data={ANALYTICS_DATA.coverage}>
                       <RadialBar background dataKey="coverage" cornerRadius={30} label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 'bold' }} />
                       <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '10px', fontWeight: 800, textTransform: 'uppercase'}} />
                       <Tooltip 
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold'}}
                          itemStyle={{color: '#1e293b'}}
                       />
                     </RadialBarChart>
                   </ResponsiveContainer>
                 </div>
               </div>

               {/* RADAR CHART: COMPLIANCE */}
               <div className="glass-card p-10 rounded-[48px] bg-white shadow-xl hover:shadow-2xl transition-all">
                 <h4 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-3">
                    <ShieldCheck size={20} className="text-blue-500" /> Compliance Radar
                 </h4>
                 <div className="h-[320px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={ANALYTICS_DATA.compliance}>
                         <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                         <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10, fontWeight: 800, textAnchor: 'middle'}} />
                         <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                         <Radar name={selectedHub.scope} dataKey={currentHubKey} stroke="#2563eb" strokeWidth={3} fill="#2563eb" fillOpacity={0.2} />
                         <Radar name="Inst. Average" dataKey="Average" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                         <Legend iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', paddingTop: '10px'}} />
                         <Tooltip 
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold'}}
                         />
                      </RadarChart>
                   </ResponsiveContainer>
                 </div>
               </div>
             </div>

             {/* BAR CHART: TREND ANALYSIS */}
             <div className="glass-card p-10 rounded-[48px] bg-white shadow-xl border border-slate-100">
               <h4 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-3">
                  <TrendingUp size={20} className="text-indigo-500" /> Academic Progression Trends
               </h4>
               <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={ANALYTICS_DATA.trends} barSize={40}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                     <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold'}}
                     />
                     <Legend iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', paddingTop: '20px'}} />
                     <Bar dataKey={currentHubKey} name={selectedHub.scope} fill={`#${selectedHub.color === 'emerald' ? '10b981' : selectedHub.color === 'blue' ? '2563eb' : selectedHub.color === 'indigo' ? '4f46e5' : 'f43f5e'}`} radius={[8, 8, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
           </div>
         )}
         {activeTab === 'syllabus' && (
           <div className="space-y-8">
              <div className="flex justify-end px-2">
                 <button onClick={() => { setWizardStep(1); setIsWizardOpen(true); }} className="bg-blue-600 text-white px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center gap-3">
                   <Sparkles size={18} /> Architect Roadmap
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {syllabi.filter(s => s.gradeLevel === selectedHub.scope).map(s => (
                   <div key={s.id} className="glass-card p-10 rounded-[56px] bg-white shadow-xl group">
                      <div className="flex justify-between items-start mb-8">
                        <div className="p-5 bg-indigo-50 text-indigo-600 rounded-3xl shadow-inner"><BookOpen size={32} /></div>
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest">{s.standard}</span>
                      </div>
                      <h4 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-4 group-hover:text-blue-600 transition-colors">{s.subject}</h4>
                      <p className="text-sm text-slate-500 font-medium italic mb-8 line-clamp-2 leading-relaxed">"{s.introduction}"</p>
                      <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.modules.length} Modules Registered</span>
                         <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Download size={18} /></button>
                      </div>
                   </div>
                 ))}
                 {syllabi.filter(s => s.gradeLevel === selectedHub.scope).length === 0 && (
                   <div className="md:col-span-2 py-40 text-center glass-card rounded-[64px] bg-white/40">
                      <BookOpen size={64} className="mx-auto text-slate-200 mb-6" />
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Syllabi Registered</h3>
                      <p className="text-slate-400 font-bold mt-2">Initialize the Neural Architect to begin.</p>
                   </div>
                 )}
              </div>
           </div>
         )}
         {activeTab === 'evaluations' && (
           <div className="space-y-8">
              <div className="flex justify-end px-2">
                 <button onClick={() => setIsEvalModalOpen(true)} className="bg-slate-900 text-white px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3">
                   <UserCheck size={18} /> New Faculty Audit
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {evaluations.map(ev => (
                   <div key={ev.id} className="glass-card p-10 rounded-[56px] bg-white shadow-xl">
                      <div className="flex justify-between items-start mb-8">
                         <div className="flex items-center gap-6">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${ev.teacherName}`} className="w-16 h-16 rounded-2xl shadow-lg border-2 border-slate-50" alt="" />
                            <div>
                               <h4 className="text-xl font-black text-slate-900 leading-none mb-1">{ev.teacherName}</h4>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ev.date} • Audit Node</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-2xl font-black text-blue-600">{((ev.scores.planning + ev.scores.management + ev.scores.assessment + ev.scores.professionalism) / 4).toFixed(1)}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase">Avg Score</p>
                         </div>
                      </div>
                      <div className="bg-slate-50 rounded-[32px] p-6 text-sm font-bold text-slate-600 italic leading-relaxed border border-slate-100">
                         "{ev.feedback}"
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         )}
         {activeTab === 'hr' && (
           <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {hrRequests.map(req => (
                   <div key={req.id} className="glass-card p-10 rounded-[56px] bg-white shadow-xl group">
                      <div className="flex justify-between items-start mb-8">
                         <h4 className="text-xl font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors uppercase tracking-tight">{req.staffName}</h4>
                         <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                           req.status === 'ApprovedCoord' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                           req.status === 'RejectedCoord' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                           'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                         }`}>{req.status}</span>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Request Type: {req.type}</p>
                         <p className="text-sm font-bold text-slate-700">"{req.description}"</p>
                      </div>
                      <div className="flex gap-4">
                         <button onClick={() => handleEndorseHR(req.id, true)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"><CheckCircle size={18} /> Endorse</button>
                         <button onClick={() => handleEndorseHR(req.id, false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center gap-3"><X size={18} /> Reject</button>
                      </div>
                   </div>
                 ))}
                 {hrRequests.length === 0 && (
                   <div className="md:col-span-2 py-40 text-center glass-card rounded-[64px] bg-white/40">
                      <Handshake size={64} className="mx-auto text-slate-200 mb-6" />
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Flow Pipeline Empty</h3>
                      <p className="text-slate-400 font-bold mt-2">No pending faculty requests for this tier.</p>
                   </div>
                 )}
              </div>
           </div>
         )}
      </div>

      {/* SYLLABUS ARCHITECT - FULL SCREEN SHEET ON MOBILE */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center md:p-4">
           <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-3xl" onClick={() => setIsWizardOpen(false)}></div>
           <div className="relative w-full h-full md:h-auto md:max-w-6xl bg-white md:rounded-[64px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 flex flex-col max-h-screen md:max-h-[92vh]">
              <div className="p-8 md:p-12 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                 <div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Pedagogical Architect</h3>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Tier: {selectedHub.scope} • Cycle 2026</p>
                 </div>
                 <button onClick={() => setIsWizardOpen(false)} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 scrollbar-hide bg-slate-50/20">
                 {wizardStep === 1 && (
                    <form onSubmit={handleArchitectSyllabus} className="max-w-2xl mx-auto space-y-10 py-10">
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Academic Subject Domain</label>
                          <input name="subject" required placeholder="e.g. Astrophysics & Quantum Theory..." className="w-full px-8 py-6 bg-white border-4 border-slate-100 rounded-[32px] font-black text-2xl md:text-3xl outline-none focus:border-blue-400 transition-all shadow-inner placeholder:text-slate-100" />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Instructional Standards</label>
                          <select name="standard" className="w-full px-8 py-6 bg-white border-4 border-slate-100 rounded-[32px] font-black text-xl outline-none cursor-pointer focus:border-blue-400 transition-all shadow-sm">
                             <option>IB Diploma (Standard Level)</option>
                             <option>IGCSE Core Framework</option>
                             <option>Common Core Master Matrix</option>
                          </select>
                       </div>
                       <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                          <Sparkles className="absolute -right-4 -top-4 text-white/10 w-40 h-40 group-hover:scale-110 transition-transform duration-[2000ms]" />
                          <h4 className="text-xl font-black text-white mb-6 uppercase tracking-tighter leading-none flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl"><Wand2 size={24} className="text-blue-400" /></div>
                            Neural Roadmap Synthesis
                          </h4>
                          <p className="text-sm text-blue-200/80 italic font-medium leading-relaxed mb-10">"The AI will architect a 40-week master syllabus synchronized with global benchmarks and institutional growth targets."</p>
                          <button type="submit" disabled={isAIGenerating} className="w-full py-6 bg-white text-slate-900 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-4px] transition-all flex items-center justify-center gap-4 disabled:opacity-50">
                            {isAIGenerating ? <Activity className="animate-spin" size={20} /> : <Zap size={20} className="text-blue-600" />} {isAIGenerating ? 'Architecting Framework...' : 'Synthesize Roadmap'}
                          </button>
                       </div>
                    </form>
                 )}

                 {wizardStep === 2 && aiSyllabus && (
                    <div className="space-y-12 pb-12">
                       <div className="glass-card p-10 rounded-[56px] bg-white shadow-xl relative overflow-hidden">
                          <div className="flex items-center gap-6 mb-8">
                             <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-lg"><FileCheck size={28} /></div>
                             <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Draft Validated</h4>
                          </div>
                          <p className="text-lg text-slate-600 leading-relaxed font-bold italic mb-10">"{aiSyllabus.introduction}"</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {aiSyllabus.modules.map((mod, i) => (
                               <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                                  <div className="flex justify-between items-start mb-4">
                                     <span className="text-[8px] font-black uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{mod.weekRange}</span>
                                     <span className="text-xs font-black text-slate-400">{mod.pedagogicalLoad}% Load</span>
                                  </div>
                                  <h5 className="font-black text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">{mod.title}</h5>
                                  <p className="text-[10px] text-slate-500 line-clamp-2 mb-4 italic">"{mod.summary}"</p>
                                  <div className="pt-4 border-t border-slate-200/50 flex flex-wrap gap-1.5">
                                     {mod.standards.map(s => <span key={s} className="text-[7px] font-black text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded uppercase">{s}</span>)}
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="flex gap-6">
                          <button onClick={() => setWizardStep(1)} className="flex-1 py-6 bg-slate-100 text-slate-500 font-black rounded-[32px] text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Reject Logic</button>
                          <button onClick={saveSyllabus} className="flex-[2] py-6 bg-slate-900 text-white font-black rounded-[32px] text-xs uppercase tracking-[0.4em] shadow-2xl hover:translate-y-[-4px] transition-all flex items-center justify-center gap-4">Finalize Registry <Check size={24} className="text-blue-400" /></button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* EVALUATION MODAL - FULL SCREEN SHEET ON MOBILE */}
      {isEvalModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl" onClick={() => setIsEvalModalOpen(false)}></div>
           <div className="relative w-full h-full md:h-auto md:max-w-4xl bg-white md:rounded-[48px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 flex flex-col max-h-screen md:max-h-[92vh]">
              <div className="p-8 md:p-12 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                 <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Institutional Audit Interface</h3>
                 <button onClick={() => setIsEvalModalOpen(false)} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 scrollbar-hide bg-slate-50/20">
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Faculty Identification</label>
                    <input 
                      value={newEval.teacherName || ''} 
                      onChange={(e) => setNewEval({...newEval, teacherName: e.target.value})}
                      placeholder="e.g. Professor Robert Mitchell..." 
                      className="w-full px-8 py-6 bg-white border-4 border-slate-100 rounded-[32px] font-black text-xl outline-none focus:border-indigo-400 transition-all shadow-inner" 
                    />
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {['planning', 'management', 'assessment', 'professionalism'].map(dim => (
                       <div key={dim} className="space-y-3">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center block">{dim}</label>
                          <input 
                            type="number" min="1" max="10" 
                            value={newEval.scores?.[dim as keyof typeof newEval.scores] || 5}
                            onChange={(e) => setNewEval({...newEval, scores: {...newEval.scores!, [dim]: parseInt(e.target.value)}})}
                            className="w-full text-center px-4 py-5 bg-white border-2 border-slate-100 rounded-2xl font-black text-blue-600 outline-none focus:border-indigo-400" 
                          />
                       </div>
                    ))}
                 </div>

                 <div className="bg-slate-900 p-8 md:p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                       <h4 className="text-white text-xl font-black flex items-center gap-4 uppercase tracking-tighter leading-none">
                          <div className="p-3 bg-white/10 rounded-2xl"><Cpu size={24} className="text-blue-400" /></div>
                          Feedback Logic Core
                       </h4>
                       <button 
                        onClick={handleAIEvalFeedback} 
                        disabled={isAIGenerating || !evalNotes}
                        className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-2 disabled:opacity-50"
                       >
                         {isAIGenerating ? <Activity className="animate-spin" size={16} /> : <Sparkles size={16} className="text-blue-600" />} Synthesize
                       </button>
                    </div>
                    <textarea 
                      value={evalNotes} 
                      onChange={(e) => setEvalNotes(e.target.value)}
                      placeholder="Enter raw observation fragments for neural synthesis..." 
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-white placeholder:text-slate-700 outline-none focus:border-blue-400/50 transition-all resize-none font-bold text-sm relative z-10" 
                    />
                    {newEval.feedback && (
                      <div className="mt-8 p-8 bg-blue-600/20 border border-blue-400/30 rounded-[32px] text-blue-100 italic text-sm font-medium leading-relaxed relative z-10 animate-in zoom-in-95">
                         "{newEval.feedback}"
                      </div>
                    )}
                 </div>
              </div>

              <div className="p-8 md:p-12 bg-white border-t border-slate-100 flex gap-6">
                 <button onClick={() => setIsEvalModalOpen(false)} className="flex-1 py-6 bg-slate-50 text-slate-500 font-black rounded-[32px] text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Discard</button>
                 <button onClick={commitEval} disabled={!newEval.feedback} className="flex-[2] py-6 bg-slate-900 text-white font-black rounded-[32px] text-xs uppercase tracking-[0.4em] shadow-2xl hover:translate-y-[-4px] transition-all flex items-center justify-center gap-4 disabled:opacity-50">Commit To Dossier <ShieldCheck size={24} className="text-blue-400" /></button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CoordinationView;
