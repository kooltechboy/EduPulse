import React, { useState } from 'react';
import { 
  Users, Briefcase, Calendar, ShieldCheck, Award, 
  Search, Plus, ChevronRight, X, Phone, FileText, 
  CheckCircle2, Activity, Zap, MoreVertical,
  Globe, Heart, Trash2, Edit3, Send, Laptop, Sparkles,
  BadgeCheck, FileCheck, ClipboardCheck,
  PieChart as PieChartIcon,
  UserX,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { LeaveRequest, JobOpening, Applicant, SubstitutionRequest } from '@/types';
import { findAIGuidedSubstitution } from '../../services/geminiService';

const INITIAL_OPENINGS: JobOpening[] = [
  { id: 'JOB-001', title: 'Senior IB Mathematics Lead', department: 'Mathematics', type: 'Full-time', status: 'Open', applicantsCount: 12 },
  { id: 'JOB-002', title: 'Director of Early Years', department: 'Early Years', type: 'Full-time', status: 'Open', applicantsCount: 8 },
  { id: 'JOB-003', title: 'Psychology & Wellness Counselor', department: 'Wellness', type: 'Part-time', status: 'Draft', applicantsCount: 0 },
];

const INITIAL_APPLICANTS: Applicant[] = [
  { id: 'APP-101', name: 'Dr. Emily Carter', email: 'e.carter@edu.com', jobId: 'JOB-001', jobTitle: 'Senior IB Mathematics Lead', stage: 'Interview', appliedDate: '2026-05-10', score: 94 },
  { id: 'APP-102', name: 'Marcus Sterling', email: 'sterling@edu.com', jobId: 'JOB-001', jobTitle: 'Senior IB Mathematics Lead', stage: 'Screening', appliedDate: '2026-05-12', score: 82 },
  { id: 'APP-103', name: 'Sarah Wu', email: 's.wu@edu.com', jobId: 'JOB-002', jobTitle: 'Director of Early Years', stage: 'Applied', appliedDate: '2026-05-15', score: 75 },
];

const INITIAL_LEAVE: LeaveRequest[] = [
  { id: 'L-101', staffId: 'STF001', staffName: 'Prof. Mitchell', type: 'Professional Development', startDate: '2026-06-01', endDate: '2026-06-03', reason: 'IB Curriculum Workshop', status: 'Approved' },
  { id: 'L-102', staffId: 'STF002', staffName: 'Dr. Linda Vance', type: 'Sick', startDate: '2026-05-18', endDate: '2026-05-19', reason: 'Seasonal Flu', status: 'Pending' },
];

const INITIAL_SUBS: SubstitutionRequest[] = [
  { id: 'SUB-01', absentStaffId: 'STF002', absentStaffName: 'Dr. Linda Vance', date: '2026-05-18', period: 'P1-P3', subject: 'Psychology 101', status: 'Pending' },
];

const HRHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recruitment' | 'leave' | 'subs' | 'compliance' | 'pd'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [openings] = useState<JobOpening[]>(INITIAL_OPENINGS);
  const [applicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [leaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE);
  const [subs, setSubs] = useState<SubstitutionRequest[]>(INITIAL_SUBS);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiMatchResponse, setAiMatchResponse] = useState<string | null>(null);

  const handleAIMatch = async (sub: SubstitutionRequest) => {
    setIsAIGenerating(true);
    const result = await findAIGuidedSubstitution(sub, [
      { name: 'Prof. Mitchell', subjects: ['Math', 'Psychology'], availability: '80%' },
      { name: 'Ms. Clara', subjects: ['Humanities', 'History'], availability: '100%' }
    ]);
    setAiMatchResponse(result);
    setIsAIGenerating(false);
  };

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Faculty', value: '142', icon: <Users />, color: 'blue', trend: '+4% growth' },
          { label: 'PD Completion', value: '88%', icon: <Award />, color: 'emerald', trend: 'Optimal' },
          { label: 'Open Vacancies', value: openings.length, icon: <Briefcase />, color: 'indigo', trend: 'High Priority' },
          { label: 'Retention Rate', value: '96.2%', icon: <Heart />, color: 'rose', trend: 'International Std' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[40px] bg-white shadow-xl hover:translate-y-[-4px] transition-all group">
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-2xl shadow-sm bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all`}>
                {stat.icon}
              </div>
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 glass-card p-10 rounded-[56px] bg-white shadow-2xl">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">Recruitment Pulse</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Active Cycle Acquisition</p>
            </div>
            <button onClick={() => setActiveTab('recruitment')} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">View All Candidates</button>
          </div>
          <div className="space-y-6">
            {applicants.map(app => (
              <div key={app.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                <div className="flex items-center gap-6">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.name}`} className="w-14 h-14 rounded-2xl shadow-md" alt="" />
                  <div>
                    <h5 className="font-black text-slate-900 leading-none mb-1 group-hover:text-blue-600 transition-colors">{app.name}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.jobTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</p>
                    <p className="font-black text-emerald-600">{app.score}%</p>
                  </div>
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest">{app.stage}</span>
                  <ChevronRight size={20} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h4 className="text-xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter">
             <div className="p-3 bg-white/10 rounded-2xl"><ShieldCheck size={20} className="text-blue-400" /></div>
             Safeguarding Hub
          </h4>
          <div className="space-y-8">
            {[
              { label: 'Background Checks', val: 98, color: '#3b82f6' },
              { label: 'Child Protection Certs', val: 100, color: '#10b981' },
              { label: 'Medical Clearances', val: 94, color: '#6366f1' },
              { label: 'Work Permits', val: 100, color: '#8b5cf6' },
            ].map(c => (
              <div key={c.label} className="space-y-3">
                <div className="flex justify-between items-end">
                   <span className="text-xs font-black text-blue-200 uppercase tracking-widest">{c.label}</span>
                   <span className="text-lg font-black">{c.val}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                   <div className="h-full rounded-full transition-all duration-1000" style={{ backgroundColor: c.color, width: `${c.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('compliance')} className="w-full mt-12 py-5 bg-white text-slate-900 rounded-[28px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all">
             Run Compliance Audit
          </button>
        </div>
      </div>
    </div>
  );

  const renderSubs = () => (
    <div className="space-y-10 animate-in slide-in-from-bottom duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6 px-1">
        <div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Substitution Hub</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Faculty Deployment & Gap Management</p>
        </div>
        <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3">
          <Plus size={18} /> Request Replacement
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-6">
           {subs.map(sub => (
              <div key={sub.id} className="glass-card p-10 rounded-[48px] bg-white border-none shadow-xl group">
                 <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-6">
                       <div className="p-5 bg-rose-50 text-rose-600 rounded-[28px] shadow-inner"><UserX size={28} /></div>
                       <div>
                          <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{sub.absentStaffName}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{sub.subject} • {sub.period}</p>
                       </div>
                    </div>
                    <span className="px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100 animate-pulse">Awaiting Match</span>
                 </div>
                 
                 <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                       <div className="flex items-center justify-between mb-6">
                          <h5 className="text-lg font-black flex items-center gap-3"><Zap size={20} className="text-blue-400" /> Neural Match Analysis</h5>
                          <button 
                            onClick={() => handleAIMatch(sub)} 
                            disabled={isAIGenerating}
                            className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all"
                          >
                             {isAIGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} className="text-blue-400" />}
                          </button>
                       </div>
                       {aiMatchResponse ? (
                          <div className="text-sm font-medium text-blue-100 italic leading-relaxed prose prose-invert max-w-none">
                             {aiMatchResponse}
                          </div>
                       ) : (
                          <p className="text-xs text-slate-400 italic">Initialize AI matching to find the most certification-aligned substitute from the current active pool.</p>
                       )}
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
                 </div>
              </div>
           ))}
        </div>
        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[56px] bg-white shadow-xl">
              <h4 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter"><Activity className="text-blue-600" /> Deployment Stats</h4>
              <div className="space-y-6">
                 {[
                   { label: 'Weekly Absences', val: 4, color: 'text-rose-500' },
                   { label: 'Internal Coverage', val: '85%', color: 'text-emerald-500' },
                   { label: 'Sub-Bank Capacity', val: 12, color: 'text-blue-500' }
                 ].map(s => (
                    <div key={s.label} className="flex justify-between py-4 border-b border-slate-50">
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                       <span className={`font-black ${s.color}`}>{s.val}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderRecruitment = () => (
    <div className="space-y-10 animate-in slide-in-from-right duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6 px-1">
        <div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Global Recruitment Engine</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Talent Acquisition Protocol 2026</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3">
            <Laptop size={18} /> Board View
          </button>
          <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3">
            <Plus size={18} /> Author Vacancy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3 space-y-10">
          <div className="glass-card rounded-[48px] overflow-hidden bg-white shadow-2xl">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Query applicants identity..." className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[28px] focus:ring-4 focus:ring-blue-100 font-bold" />
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-10 py-6">Applicant</th>
                  <th className="px-6 py-6">Target Role</th>
                  <th className="px-6 py-6">Pipeline Stage</th>
                  <th className="px-6 py-6 text-center">Neural Score</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.map(app => (
                  <tr key={app.id} className="hover:bg-blue-50/20 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.name}`} className="w-12 h-12 rounded-xl" alt="" />
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1 group-hover:text-blue-600 transition-colors">{app.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6"><span className="text-xs font-bold text-slate-700">{app.jobTitle}</span></td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase text-slate-700">{app.stage}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`text-lg font-black ${app.score > 90 ? 'text-emerald-500' : 'text-blue-600'}`}>{app.score}%</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><ChevronRight size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[48px] bg-white border-none shadow-xl">
            <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tighter">Active Roles</h4>
            <div className="space-y-6">
              {openings.map(job => (
                <div key={job.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-md transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-full">{job.department}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase">{job.type}</span>
                   </div>
                   <h5 className="font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">{job.title}</h5>
                   <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.applicantsCount} Pipeline</p>
                      <button className="p-2 text-slate-300 hover:text-blue-600"><MoreVertical size={16} /></button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 px-1">
        <div>
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Human Capital</h2>
           <p className="text-slate-500 font-bold italic mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
              <Users size={18} className="text-blue-500" /> Integrated HR Command Hub 2026
           </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[32px] shadow-2xl border border-slate-100 flex gap-2 w-full xl:w-auto overflow-x-auto scrollbar-hide">
           {[
             { id: 'dashboard', label: 'Overview', icon: <PieChartIcon size={14} /> },
             { id: 'recruitment', label: 'Recruitment', icon: <Briefcase size={14} /> },
             { id: 'leave', label: 'Absence Mgmt', icon: <Calendar size={14} /> },
             { id: 'subs', label: 'Subs Node', icon: <UserX size={14} /> },
             { id: 'compliance', label: 'Compliance', icon: <ShieldCheck size={14} /> },
             { id: 'pd', label: 'PD Units', icon: <Award size={14} /> },
           ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-4 rounded-[24px] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {tab.icon} {tab.label}
              </button>
           ))}
        </div>
      </div>

      <div className="animate-in fade-in duration-700">
         {activeTab === 'dashboard' && renderDashboard()}
         {activeTab === 'recruitment' && renderRecruitment()}
         {activeTab === 'subs' && renderSubs()}
         {activeTab === 'leave' && (
            <div className="py-40 text-center glass-card rounded-[64px] bg-white/40 border-none shadow-2xl">
              <Calendar size={80} className="mx-auto text-slate-200 mb-8" />
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Absence & Leave Protocol</h3>
              <p className="text-slate-400 font-bold text-lg mt-2">Manage faculty availability and replacement logs.</p>
              <button className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-4px] transition-all">Open Absence Ledger</button>
           </div>
         )}
         {activeTab === 'compliance' && (
           <div className="py-40 text-center glass-card rounded-[64px] bg-white/40 border-none shadow-2xl">
              <BadgeCheck size={80} className="mx-auto text-slate-200 mb-8" />
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Institutional Compliance Vault</h3>
              <p className="text-slate-400 font-bold text-lg mt-2">Safeguarding, background checks, and certifications.</p>
              <button className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-4px] transition-all">Launch Audit Protocol</button>
           </div>
         )}
         {activeTab === 'pd' && (
           <div className="py-40 text-center glass-card rounded-[64px] bg-white/40 border-none shadow-2xl">
              <Laptop size={80} className="mx-auto text-slate-200 mb-8" />
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Professional Development Portal</h3>
              <p className="text-slate-400 font-bold text-lg mt-2">Faculty training credits and workshop certification.</p>
              <button className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-4px] transition-all">Register PD Activity</button>
           </div>
         )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:left-72 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-center gap-10 z-[100]">
         <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <BadgeCheck className="text-emerald-500" size={16} /> Safeguarding Standards V2.6
         </div>
         <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <FileCheck className="text-emerald-500" size={16} /> ISO 45001 Verified
         </div>
         <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <ClipboardCheck className="text-emerald-500" size={16} /> HR Audit Active
         </div>
      </div>
    </div>
  );
};

export default HRHub;