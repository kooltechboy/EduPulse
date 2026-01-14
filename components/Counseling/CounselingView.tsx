
import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Smile, 
  Calendar, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles, 
  ClipboardList, 
  Megaphone, 
  Users, 
  Plus, 
  Filter, 
  Search, 
  ChevronRight, 
  AlertTriangle,
  FileText,
  Target,
  BarChart3,
  Clock,
  Briefcase,
  X,
  FileUp,
  Wand2,
  Trash2,
  Save,
  FileCheck,
  Eye,
  Type as TypeIcon,
  Edit2,
  Lock,
  Tag as TagIcon,
  History,
  Archive,
  Download,
  Share2,
  CheckCircle2,
  MoreVertical,
  Activity,
  UserPlus,
  Mail,
  Zap,
  ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { WellnessCase, AwarenessCampaign, CounselingDocument } from '../../types';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOOD_DATA = [
  { day: 'Mon', wellness: 78, stress: 45 },
  { day: 'Tue', wellness: 82, stress: 40 },
  { day: 'Wed', wellness: 75, stress: 55 },
  { day: 'Thu', wellness: 88, stress: 30 },
  { day: 'Fri', wellness: 91, stress: 25 },
];

const INITIAL_CASES: WellnessCase[] = [
  { id: 'CSE-101', studentName: 'Alex Thompson', studentId: 'STU001', origin: 'Incident', priority: 'High', status: 'Active', assignedCounselor: 'Dr. Vance', lastUpdate: '2024-05-15', category: 'Social', notesCount: 12 },
  { id: 'CSE-102', studentName: 'Sarah Miller', studentId: 'STU088', origin: 'Self-Referral', priority: 'Medium', status: 'Monitoring', assignedCounselor: 'Dr. Vance', lastUpdate: '2024-05-14', category: 'Emotional', notesCount: 5 },
  { id: 'CSE-103', studentName: 'Aiden Mitchell', studentId: 'STU112', origin: 'Teacher-Referral', priority: 'Critical', status: 'Intake', assignedCounselor: 'Prof. Piaget', lastUpdate: '2024-05-16', category: 'Behavioral', notesCount: 2 },
];

const INITIAL_CAMPAIGNS: AwarenessCampaign[] = [
  { id: 'CMP-01', title: 'Digital Detox Week', startDate: '2024-06-01', endDate: '2024-06-07', objective: 'Reduce social media anxiety', targetAudience: ['Senior High'], status: 'Planning', reachIndex: 0 },
  { id: 'CMP-02', title: 'Anti-Bullying Symposium', startDate: '2024-05-10', endDate: '2024-05-20', objective: 'Zero-tolerance fosterance', targetAudience: ['Elementary', 'Junior High'], status: 'Live', reachIndex: 85 },
];

const INITIAL_DOCS: CounselingDocument[] = [
  { id: 'DOC-001', title: 'Individual Support Plan - Alex T.', type: 'Plan', category: 'Intervention', author: 'Dr. Linda Vance', createdAt: '2024-05-10', status: 'Confidential', content: 'Support plan focused on social anxiety management during final exams.', studentId: 'STU001', studentName: 'Alex Thompson', tags: ['Anxiety', 'Exam-Support'] },
  { id: 'DOC-002', title: 'Incident Report #2201 - Courtyard', type: 'Report', category: 'Academic', author: 'Prof. Piaget', createdAt: '2024-05-12', status: 'Finalized', content: 'Detailed report of verbal altercation between students at recess.', tags: ['Behavioral'] },
];

const CounselingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'campaigns' | 'documents'>('overview');
  
  // State Management
  const [cases, setCases] = useState<WellnessCase[]>(() => {
    const saved = localStorage.getItem('edupulse_counseling_cases');
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });
  
  const [campaigns, setCampaigns] = useState<AwarenessCampaign[]>(() => {
    const saved = localStorage.getItem('edupulse_counseling_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });
  
  const [documents, setDocuments] = useState<CounselingDocument[]>(() => {
    const saved = localStorage.getItem('edupulse_counseling_docs');
    return saved ? JSON.parse(saved) : INITIAL_DOCS;
  });

  // Editor & Selection State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Partial<CounselingDocument> | null>(null);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<WellnessCase | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Partial<AwarenessCampaign> | null>(null);
  
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [docFilter, setDocFilter] = useState<'All' | 'Confidential' | 'Intervention' | 'Legal'>('All');
  const [activeDossierId, setActiveDossierId] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('edupulse_counseling_docs', JSON.stringify(documents));
    localStorage.setItem('edupulse_counseling_cases', JSON.stringify(cases));
    localStorage.setItem('edupulse_counseling_campaigns', JSON.stringify(campaigns));
  }, [documents, cases, campaigns]);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Critical': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  // AI Generation
  const handleGenerateAIDraft = async () => {
    if (!aiPrompt.trim()) return;
    setIsAIGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a professional school counseling document draft for a ${editingDoc?.type || 'record'}. 
        Notes provided: "${aiPrompt}". 
        Use markdown formatting. Tone: Empathetic, Clinical, Professional.`,
        config: { systemInstruction: "You are an expert School Psychologist for the EduPulse Platform 2026." }
      });
      setEditingDoc(prev => ({ ...prev, content: response.text || '' }));
    } catch (error) {
      alert("AI Neural Link busy. Please try manual entry.");
    } finally {
      setIsAIGenerating(false);
    }
  };

  // CRUD Operations
  const handleSaveDocument = () => {
    if (!editingDoc?.title) { alert("Institutional Title Required."); return; }
    const newLog = { user: 'Dr. Linda Vance', date: new Date().toISOString(), action: editingDoc.id ? 'Modified' : 'Created' };
    if (editingDoc.id) {
      setDocuments(prev => prev.map(d => d.id === editingDoc.id ? ({ ...editingDoc, accessLog: [...(d.accessLog || []), newLog] } as CounselingDocument) : d));
    } else {
      const newDoc: CounselingDocument = {
        ...editingDoc as CounselingDocument,
        id: `DOC-${Math.floor(Math.random() * 9000) + 1000}`,
        createdAt: new Date().toISOString().split('T')[0],
        author: 'Dr. Linda Vance',
        accessLog: [newLog]
      };
      setDocuments(prev => [newDoc, ...prev]);
    }
    setIsEditorOpen(false);
    setEditingDoc(null);
  };

  const handleSaveCase = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const caseData: WellnessCase = {
      id: selectedCase?.id || `CSE-${Math.floor(Math.random() * 900) + 100}`,
      studentName: formData.get('studentName') as string,
      studentId: formData.get('studentId') as string,
      origin: formData.get('origin') as any,
      priority: formData.get('priority') as any,
      status: formData.get('status') as any,
      category: formData.get('category') as any,
      assignedCounselor: 'Dr. Linda Vance',
      lastUpdate: new Date().toISOString().split('T')[0],
      notesCount: selectedCase?.notesCount || 0
    };

    if (selectedCase) {
      setCases(prev => prev.map(c => c.id === selectedCase.id ? caseData : c));
    } else {
      setCases(prev => [caseData, ...prev]);
    }
    setIsCaseModalOpen(false);
    setSelectedCase(null);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const campaignData: AwarenessCampaign = {
      id: editingCampaign?.id || `CMP-${Math.floor(Math.random() * 900) + 100}`,
      title: formData.get('title') as string,
      objective: formData.get('objective') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      status: formData.get('status') as any,
      targetAudience: (formData.get('targetAudience') as string).split(','),
      reachIndex: editingCampaign?.reachIndex || 0
    };

    if (editingCampaign?.id) {
      setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? campaignData : c));
    } else {
      setCampaigns(prev => [campaignData, ...prev]);
    }
    setIsCampaignModalOpen(false);
    setEditingCampaign(null);
  };

  const openCreator = (type: CounselingDocument['type']) => {
    setEditingDoc({ title: '', content: '', type, status: 'Draft', category: 'Intervention', tags: [] });
    setAiPrompt('');
    setIsEditorOpen(true);
  };

  const deleteCase = (id: string) => {
    if (confirm("Permanently archive this clinical dossier?")) {
      setCases(prev => prev.filter(c => c.id !== id));
    }
  };

  // Render Parts
  const renderOverview = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Support Cases', value: cases.length, icon: <HeartPulse className="text-rose-500" />, change: '+2 this week', color: 'bg-rose-50' },
          { label: 'Wellness Index', value: '88%', icon: <Smile className="text-amber-500" />, change: 'Institutional', color: 'bg-amber-50' },
          { label: 'Vault Records', value: documents.length, icon: <Lock className="text-blue-500" />, change: 'Encrypted', color: 'bg-blue-50' },
          { label: 'Reach Index', value: '92%', icon: <Megaphone className="text-emerald-500" />, change: 'Awareness', color: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[40px] hover:translate-y-[-4px] transition-all bg-white/60">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl shadow-sm ${stat.color}`}>{stat.icon}</div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.change}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black text-slate-900">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          <div className="glass-card p-10 rounded-[48px] bg-white shadow-xl">
             <div className="flex justify-between items-center mb-10">
               <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Emotional Pulse Mapping</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Institutional Sentiment Index</p>
               </div>
             </div>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={MOOD_DATA}>
                   <defs>
                     <linearGradient id="colorWell" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                   <YAxis hide domain={[0, 100]} />
                   <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                   <Area type="monotone" dataKey="wellness" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorWell)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-[40px] bg-white border-none shadow-xl">
               <h4 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-3 tracking-tighter">
                 <AlertTriangle className="text-rose-500" /> CRITICAL DOSSIERS
               </h4>
               <div className="space-y-4">
                 {cases.filter(c => c.priority === 'Critical' || c.priority === 'High').slice(0, 3).map(c => (
                   <div key={c.id} onClick={() => { setSelectedCase(c); setIsCaseModalOpen(true); }} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-blue-50 transition-all cursor-pointer group">
                     <div>
                       <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{c.studentName}</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{c.category} • {c.priority}</p>
                     </div>
                     <ArrowRight size={18} className="text-slate-200 group-hover:text-blue-500 transition-all" />
                   </div>
                 ))}
                 {cases.filter(c => c.priority === 'Critical' || c.priority === 'High').length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">No critical dossiers currently active.</p>
                 )}
               </div>
            </div>
            <div className="glass-card p-8 rounded-[40px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
               <Sparkles className="absolute -right-4 -top-4 text-white/10 w-40 h-40 group-hover:scale-125 transition-transform duration-[2000ms]" />
               <div className="relative z-10">
                 <h4 className="text-lg font-black mb-6 flex items-center gap-3 tracking-tighter uppercase">
                   <Zap className="text-amber-400" /> Strategic Hub
                 </h4>
                 <p className="text-sm text-slate-300 leading-relaxed font-medium">"Peak exam season identified in the academic core. AI recommends initiating a 'Focus & Resilience' awareness cycle."</p>
                 <button onClick={() => setActiveTab('campaigns')} className="mt-8 w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-50 transition-all active:scale-95">
                   Initiate Strategy
                 </button>
               </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[48px] bg-white border-none shadow-2xl relative">
             <div className="flex items-center justify-between mb-10">
                <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.2em]">Clinical Services</h4>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
               {[
                 { 
                   label: 'Referral Pipeline', 
                   desc: 'Initialize new support dossier',
                   icon: <Plus size={22} />, 
                   color: 'bg-rose-600 text-white', 
                   hover: 'hover:bg-rose-700',
                   onClick: () => { setSelectedCase(null); setIsCaseModalOpen(true); }
                 },
                 { 
                   label: 'Observation Log', 
                   desc: 'Draft behavioral observations',
                   icon: <Eye size={22} />, 
                   color: 'bg-emerald-600 text-white', 
                   hover: 'hover:bg-emerald-700',
                   onClick: () => openCreator('Observation') 
                 },
                 { 
                   label: 'Institutional Report', 
                   desc: 'Generate clinical board report',
                   icon: <BarChart3 size={22} />, 
                   color: 'bg-blue-600 text-white', 
                   hover: 'hover:bg-blue-700',
                   onClick: () => openCreator('Report') 
                 },
                 { 
                   label: 'Parent Advisory', 
                   desc: 'Formal wellness communication',
                   icon: <Mail size={22} />, 
                   color: 'bg-indigo-600 text-white', 
                   hover: 'hover:bg-indigo-700',
                   onClick: () => openCreator('Letter') 
                 },
               ].map((serv, i) => (
                 <button 
                  key={i} 
                  onClick={serv.onClick} 
                  className={`w-full flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] transition-all group relative overflow-hidden active:scale-[0.98] border border-slate-100 hover:border-transparent hover:shadow-2xl`}
                 >
                   <div className={`p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 ${serv.color}`}>
                     {serv.icon}
                   </div>
                   <div className="text-left">
                     <span className="block text-sm font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{serv.label}</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{serv.desc}</span>
                   </div>
                   <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                     <ChevronRight size={20} className="text-blue-600" />
                   </div>
                 </button>
               ))}
             </div>
             
             <div className="mt-10 p-6 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-center gap-4">
                <ShieldCheck className="text-blue-600 flex-shrink-0" size={24} />
                <p className="text-[9px] font-black text-blue-900 uppercase tracking-widest leading-relaxed">
                  Institutional Vault Encryption: Active (256-bit AES)
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCases = () => (
    <div className="space-y-8 animate-in slide-in-from-right duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search wellness dossiers..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-3xl text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>
        <button 
          onClick={() => { setSelectedCase(null); setIsCaseModalOpen(true); }}
          className="w-full md:w-auto px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-rose-700 transition-all active:scale-95 shadow-rose-100"
        >
          <UserPlus size={18} /> New Support Case
        </button>
      </div>

      <div className="glass-card rounded-[48px] overflow-hidden bg-white shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-10 py-6">Student Profile</th>
              <th className="px-6 py-6">Referral Origin</th>
              <th className="px-6 py-6">Priority Level</th>
              <th className="px-6 py-6">Dossier Status</th>
              <th className="px-10 py-6 text-right">Registry Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50/30 transition-all group">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black">
                      {c.studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{c.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">{c.studentId} • Assigned: {c.assignedCounselor}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="text-xs font-bold text-slate-600">{c.origin}</span>
                </td>
                <td className="px-6 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${getPriorityColor(c.priority)}`}>
                    {c.priority}
                  </span>
                </td>
                <td className="px-6 py-6">
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${c.status === 'Active' ? 'bg-blue-600 animate-pulse' : 'bg-slate-400'}`}></div>
                     <span className="text-xs font-black text-slate-700 uppercase">{c.status}</span>
                   </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setSelectedCase(c); setIsCaseModalOpen(true); }} className="p-3 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteCase(c.id)} className="p-3 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                      <Archive size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-10 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Outreach & Awareness Hub</h3>
          <p className="text-slate-500 font-bold italic mt-1 uppercase text-[10px] tracking-widest">Global Campus Prevention Strategies</p>
        </div>
        <button 
          onClick={() => { setEditingCampaign(null); setIsCampaignModalOpen(true); }}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-emerald-700 transition-all shadow-emerald-100"
        >
          <Plus size={18} /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map((c) => (
          <div key={c.id} className="glass-card p-10 rounded-[48px] border-none shadow-xl bg-white/60 hover:bg-white transition-all group relative overflow-hidden">
             <div className="flex justify-between items-start mb-8">
               <div className={`p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 ${c.status === 'Live' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                 <Megaphone size={24} />
               </div>
               <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${c.status === 'Live' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                 {c.status}
               </span>
             </div>
             <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{c.title}</h4>
             <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 h-12 overflow-hidden text-ellipsis line-clamp-2">{c.objective}</p>
             
             <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <span>Target Demographic</span>
                   <span className="text-slate-900">{c.targetAudience.join(', ')}</span>
                </div>
                {c.status === 'Live' && (
                  <div className="mt-4">
                    <div className="flex justify-between mb-2">
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Impact Reach</span>
                       <span className="text-xs font-black text-emerald-600">{c.reachIndex}%</span>
                    </div>
                    <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
                       <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${c.reachIndex}%` }}></div>
                    </div>
                  </div>
                )}
             </div>
             <div className="mt-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                <button onClick={() => { setEditingCampaign(c); setIsCampaignModalOpen(true); }} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Edit Registry</button>
                <button onClick={() => setCampaigns(prev => prev.filter(cp => cp.id !== c.id))} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Institutional Vault</h3>
          <p className="text-slate-500 font-bold italic mt-1 uppercase text-[10px] tracking-[0.2em]">End-to-End Encrypted Professional Registry</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <div className="flex bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-slate-100 flex-1 xl:flex-none overflow-x-auto scrollbar-hide">
            {['All', 'Confidential', 'Intervention', 'Legal'].map(f => (
              <button 
                key={f}
                onClick={() => setDocFilter(f as any)}
                className={`flex-1 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  docFilter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button 
            onClick={() => openCreator('Plan')}
            className="flex-1 xl:flex-none px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all hover:translate-y-[-2px] shadow-blue-100"
          >
            <Plus size={18} /> New Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {documents.filter(d => docFilter === 'All' || d.status === docFilter || d.category === docFilter).map((doc) => (
          <div key={doc.id} className="glass-card p-10 rounded-[56px] border-none shadow-xl bg-white/60 hover:bg-white transition-all group relative overflow-hidden">
             <div className="flex justify-between items-start mb-10">
               <div className={`p-5 rounded-[24px] shadow-lg transition-transform group-hover:scale-110 ${doc.type === 'Plan' ? 'bg-blue-600 text-white' : doc.type === 'Report' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                 <FileText size={28} />
               </div>
               <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${doc.status === 'Confidential' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                 {doc.status}
               </span>
             </div>
             <h4 className="font-black text-slate-900 text-xl mb-3 tracking-tight group-hover:text-blue-600 transition-colors">{doc.title}</h4>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">{doc.studentName || 'General Record'} • {doc.createdAt}</p>
             
             <div className="flex items-center justify-between pt-8 border-t border-slate-100/50">
               <div className="flex gap-2">
                 <button onClick={() => { setEditingDoc(doc); setIsEditorOpen(true); }} className="p-3 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-2xl transition-all hover:shadow-md">
                   <Edit2 size={18} />
                 </button>
                 <button className="p-3 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-2xl transition-all hover:shadow-md">
                   <History size={18} />
                 </button>
               </div>
               <button onClick={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))} className="p-3 text-slate-300 hover:text-rose-500 transition-all">
                 <Trash2 size={18} />
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 min-h-screen pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight tracking-tighter">Institutional Wellness</h2>
          <p className="text-slate-500 font-bold italic mt-1 uppercase text-[10px] tracking-widest">School Psychology & Counseling Center • Core 2026</p>
        </div>
        <div className="flex bg-white/80 backdrop-blur-md p-1.5 rounded-[22px] shadow-sm border border-slate-100 w-full lg:w-auto overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: 'Dashboard', icon: <BarChart3 size={14} /> },
            { id: 'cases', label: 'Support Cases', icon: <Users size={14} /> },
            { id: 'campaigns', label: 'Awareness Hub', icon: <Megaphone size={14} /> },
            { id: 'documents', label: 'Vault Registry', icon: <FileText size={14} /> },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 lg:flex-none px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-12">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'cases' && renderCases()}
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'documents' && renderDocuments()}
      </div>

      {/* CASE MODAL */}
      {isCaseModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={() => setIsCaseModalOpen(false)}></div>
          <form onSubmit={handleSaveCase} className="relative w-full max-w-2xl bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center">
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedCase ? 'Update Case Dossier' : 'New Wellness Referral'}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Clinical Protocol #4401-SIS</p>
               </div>
               <button type="button" onClick={() => setIsCaseModalOpen(false)} className="p-4 bg-slate-100 rounded-3xl hover:bg-slate-200 transition-all"><X size={24} /></button>
            </div>
            <div className="p-10 space-y-8 overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Student Identity Name</label>
                    <input name="studentName" defaultValue={selectedCase?.studentName} required className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-bold text-slate-900 outline-none focus:border-blue-400 transition-all shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Institutional ID</label>
                    <input name="studentId" defaultValue={selectedCase?.studentId} required className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-bold text-slate-900 outline-none focus:border-blue-400 transition-all shadow-inner" />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Priority Index</label>
                    <select name="priority" defaultValue={selectedCase?.priority} className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-bold text-slate-900 outline-none cursor-pointer">
                       <option>Low</option>
                       <option>Medium</option>
                       <option>High</option>
                       <option>Critical</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Lifecycle Status</label>
                    <select name="status" defaultValue={selectedCase?.status} className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-bold text-slate-900 outline-none cursor-pointer">
                       <option>Intake</option>
                       <option>Active</option>
                       <option>Monitoring</option>
                       <option>Closed</option>
                    </select>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Referral Source</label>
                    <select name="origin" defaultValue={selectedCase?.origin} className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-bold text-slate-900 outline-none cursor-pointer">
                       <option>Incident</option>
                       <option>Self-Referral</option>
                       <option>Teacher-Referral</option>
                       <option>Parent-Referral</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Classification</label>
                    <select name="category" defaultValue={selectedCase?.category} className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-bold text-slate-900 outline-none cursor-pointer">
                       <option>Behavioral</option>
                       <option>Emotional</option>
                       <option>Academic</option>
                       <option>Social</option>
                    </select>
                  </div>
               </div>
            </div>
            <div className="p-10 bg-slate-50 border-t border-slate-100">
               <button type="submit" className="w-full py-6 bg-rose-600 text-white font-black rounded-[32px] uppercase tracking-[0.2em] shadow-2xl hover:bg-rose-700 hover:translate-y-[-2px] transition-all active:scale-95 shadow-rose-100 text-xs">
                 Commit Dossier to Neural Registry
               </button>
            </div>
          </form>
        </div>
      )}

      {/* CAMPAIGN MODAL */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in" onClick={() => setIsCampaignModalOpen(false)}></div>
          <form onSubmit={handleSaveCampaign} className="relative w-full max-w-2xl bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center">
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{editingCampaign ? 'Update Campaign' : 'Initiate Awareness Strategy'}</h3>
               <button type="button" onClick={() => setIsCampaignModalOpen(false)} className="p-4 bg-slate-100 rounded-3xl hover:bg-slate-200 transition-all"><X size={24} /></button>
            </div>
            <div className="p-10 space-y-8 overflow-y-auto scrollbar-hide">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Strategy Title</label>
                 <input name="title" defaultValue={editingCampaign?.title} required className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-bold text-slate-900 outline-none focus:border-emerald-400 transition-all" />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Primary Objective</label>
                 <textarea name="objective" defaultValue={editingCampaign?.objective} required className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-bold text-slate-900 h-32 resize-none outline-none focus:border-emerald-400 transition-all" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Cycle Start</label>
                    <input type="date" name="startDate" defaultValue={editingCampaign?.startDate} required className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-bold text-slate-900 outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Cycle End</label>
                    <input type="date" name="endDate" defaultValue={editingCampaign?.endDate} required className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-bold text-slate-900 outline-none" />
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Status</label>
                    <select name="status" defaultValue={editingCampaign?.status} className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-bold text-slate-900 outline-none cursor-pointer">
                       <option>Planning</option>
                       <option>Live</option>
                       <option>Completed</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Target Audience (Comma separated)</label>
                    <input name="targetAudience" defaultValue={editingCampaign?.targetAudience?.join(', ')} className="w-full px-7 py-5 bg-slate-50 border-2 border-slate-100 rounded-[28px] font-bold text-slate-900 outline-none" />
                  </div>
               </div>
            </div>
            <div className="p-10 bg-slate-50 border-t border-slate-100">
               <button type="submit" className="w-full py-6 bg-emerald-600 text-white font-black rounded-[32px] uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-700 transition-all text-xs">
                 Deploy Strategic Outreach
               </button>
            </div>
          </form>
        </div>
      )}

      {/* DOCUMENT EDITOR MODAL */}
      {isEditorOpen && editingDoc && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-2xl animate-in fade-in" onClick={() => setIsEditorOpen(false)}></div>
          <div className="relative w-full max-w-7xl bg-white rounded-[56px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 flex flex-col h-full max-h-[95vh]">
             <div className="p-8 md:p-12 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-blue-600 text-white rounded-[28px] shadow-lg"><FileText size={32} /></div>
                  <div>
                    <input 
                      type="text" 
                      value={editingDoc.title}
                      onChange={(e) => setEditingDoc({...editingDoc, title: e.target.value})}
                      placeholder="Enter Dossier Title..."
                      className="text-4xl font-black text-slate-900 tracking-tighter bg-transparent outline-none placeholder:text-slate-200 w-full"
                    />
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                      {editingDoc.type} Interface • Institutional Compliance Protocol 2026
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <select 
                    value={editingDoc.status}
                    onChange={(e) => setEditingDoc({...editingDoc, status: e.target.value as any})}
                    className="bg-slate-100 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 border-none outline-none cursor-pointer hover:bg-slate-200 transition-all"
                   >
                     <option>Draft</option>
                     <option>Finalized</option>
                     <option>Confidential</option>
                   </select>
                   <button onClick={() => setIsEditorOpen(false)} className="p-4 bg-slate-100 hover:bg-slate-200 rounded-3xl transition-all">
                      <X size={24} />
                   </button>
                </div>
             </div>

             <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50/30">
                <div className="flex-1 p-10 md:p-16 overflow-y-auto bg-white scrollbar-hide">
                  <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center justify-between py-6 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <TypeIcon className="text-slate-300" size={24} />
                        <div className="flex gap-2 font-black text-slate-400">
                           <button className="px-5 py-2.5 bg-slate-50 rounded-xl hover:bg-slate-900 hover:text-white transition-all text-sm">B</button>
                           <button className="px-5 py-2.5 bg-slate-50 rounded-xl hover:bg-slate-900 hover:text-white transition-all italic text-sm">I</button>
                           <button className="px-5 py-2.5 bg-slate-50 rounded-xl hover:bg-slate-900 hover:text-white transition-all underline text-sm">U</button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                           <Clock size={14} /> Cloud Sync Active
                        </span>
                      </div>
                    </div>
                    <textarea 
                      value={editingDoc.content}
                      onChange={(e) => setEditingDoc({...editingDoc, content: e.target.value})}
                      placeholder="Start typing institutional clinical record..."
                      className="w-full h-full min-h-[600px] bg-transparent border-none outline-none text-slate-800 text-xl leading-[1.8] placeholder:text-slate-200 resize-none font-medium selection:bg-blue-100"
                    />
                  </div>
                </div>

                <div className="w-full lg:w-[480px] bg-slate-50 border-l border-slate-100 p-10 space-y-10 overflow-y-auto scrollbar-hide">
                   <div className="p-10 bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 text-white rounded-[40px] shadow-2xl relative overflow-hidden group">
                      <Sparkles className="absolute -right-4 -top-4 text-white/10 w-40 h-40 group-hover:scale-125 transition-transform duration-[3000ms]" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-8">
                           <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md shadow-inner"><Wand2 size={26} /></div>
                           <div>
                              <h4 className="font-black text-xl leading-none">AI Drafting Assistant</h4>
                              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mt-1.5">Neural Synthesis Engine</p>
                           </div>
                        </div>
                        <p className="text-xs text-indigo-50 mb-8 font-medium leading-relaxed italic opacity-90">
                          "Convert fragments of observations or session keywords into professionalized campus dossiers."
                        </p>
                        <textarea 
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="Fragment input: 'Student Alex, test avoidance behavior, recommended grounding exercises'..."
                          className="w-full h-44 bg-white/10 border border-white/20 rounded-[32px] p-7 text-sm outline-none focus:border-white/50 transition-all shadow-inner resize-none text-white placeholder:text-indigo-200/50 mb-8 font-medium"
                        />
                        <button 
                          onClick={handleGenerateAIDraft}
                          disabled={isAIGenerating || !aiPrompt.trim()}
                          className="w-full py-6 bg-white text-indigo-700 rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-4 active:scale-95"
                        >
                          {isAIGenerating ? (
                            <><Activity className="animate-spin" size={18} /> Processing Logic...</>
                          ) : (
                            <>Synthesize Professional Draft <Sparkles size={18} /></>
                          )}
                        </button>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="flex items-center justify-between px-2">
                         <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Templates</h5>
                         <span className="text-[9px] font-black text-blue-600 uppercase border border-blue-100 px-2 py-0.5 rounded-full">Board Validated</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                         {[
                           { name: 'Individual Support Plan (ISP)', prompt: 'Generate an ISP template for academic anxiety management.' },
                           { name: 'Clinical Intake Baseline', prompt: 'Generate a structured baseline psychological intake form.' },
                           { name: 'Behavioral Observation Log', prompt: 'Generate a professional observation log for a classroom setting.' },
                           { name: 'Formal Parent Advisory', prompt: 'Generate a sensitive yet professional parent advisory letter regarding wellness support.' }
                         ].map(t => (
                           <button 
                            key={t.name} 
                            onClick={() => { setAiPrompt(t.prompt); handleGenerateAIDraft(); }}
                            className="text-left p-6 bg-white rounded-[32px] border border-slate-100 hover:border-indigo-400 hover:bg-blue-50/50 transition-all shadow-sm group active:scale-[0.98]"
                           >
                             <div className="flex justify-between items-start">
                                <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{t.name}</p>
                                <Zap size={14} className="text-amber-400 opacity-0 group-hover:opacity-100 transition-all" />
                             </div>
                             <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Protocol-Ready</p>
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-10 md:p-14 bg-white border-t border-slate-100 flex justify-between items-center z-20 shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.03)]">
                <div className="flex gap-4">
                  <button onClick={() => { if(confirm("Discard all changes to this clinical record?")) setIsEditorOpen(false); }} className="p-5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-3xl transition-all border border-transparent hover:border-rose-100">
                    <Trash2 size={28} />
                  </button>
                  <button className="p-5 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-3xl transition-all border border-transparent hover:border-slate-100">
                    <Download size={28} />
                  </button>
                </div>
                <div className="flex gap-6">
                   <button onClick={() => setIsEditorOpen(false)} className="px-10 py-5 bg-slate-100 text-slate-500 font-black rounded-[32px] text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                   <button onClick={handleSaveDocument} className="px-16 py-5 bg-slate-900 text-white font-black rounded-[32px] text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:translate-y-[-4px] active:scale-95 transition-all flex items-center gap-5 group">
                     Secure to Registry <ShieldCheck size={20} className="group-hover:rotate-12 transition-transform" />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselingView;
