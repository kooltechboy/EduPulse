
import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, Calendar, ShieldCheck, Award, 
  Search, Plus, ChevronRight, X, Phone, FileText, 
  CheckCircle2, Activity, Zap, MoreVertical,
  Globe, Heart, Trash2, Edit3, Send, Laptop, Sparkles,
  BadgeCheck, FileCheck, ClipboardCheck,
  PieChart as PieChartIcon,
  UserX,
  RefreshCw,
  AlertCircle,
  Check,
  Clock,
  ArrowRight,
  Mail
} from 'lucide-react';
import { LeaveRequest, JobOpening, Applicant, SubstitutionRequest, StaffCategory } from '../../types.ts';
import { findAIGuidedSubstitution } from '../../services/geminiService';

// --- MOCK DATA ---

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
  { id: 'L-103', staffId: 'STF004', staffName: 'Ms. Clara', type: 'Personal', startDate: '2026-05-25', endDate: '2026-05-26', reason: 'Family Matter', status: 'Pending' },
];

const INITIAL_SUBS: SubstitutionRequest[] = [
  { id: 'SUB-01', absentStaffId: 'STF002', absentStaffName: 'Dr. Linda Vance', date: '2026-05-18', period: 'P1-P3', subject: 'Psychology 101', status: 'Pending' },
  { id: 'SUB-02', absentStaffId: 'STF008', absentStaffName: 'Mr. Physics', date: '2026-05-19', period: 'P4', subject: 'Quantum Mechanics', status: 'Pending' },
];

const INITIAL_COMPLIANCE = [
  { id: 'CMP-001', staffName: 'Prof. Mitchell', item: 'Background Check', expiry: '2027-08-01', status: 'Verified' },
  { id: 'CMP-002', staffName: 'Dr. Linda Vance', item: 'Medical Clearance', expiry: '2026-12-15', status: 'Verified' },
  { id: 'CMP-003', staffName: 'Sarah Jenkins', item: 'Fiscal Ethics Cert', expiry: '2026-06-01', status: 'Expiring Soon' },
  { id: 'CMP-004', staffName: 'Mark Thompson', item: 'Safety Protocol L2', expiry: '2025-05-20', status: 'Expired' },
];

const INITIAL_PD = [
  { id: 'PD-001', staffName: 'Prof. Mitchell', activity: 'Advanced Calculus Pedagogy', provider: 'Global Math Inst.', date: '2026-04-10', credits: 5 },
  { id: 'PD-002', staffName: 'Ms. Clara', activity: 'Digital History Archives', provider: 'EdTech Core', date: '2026-05-02', credits: 3 },
];

const MOCK_AVAILABLE_STAFF = [
  { id: 'STF001', name: 'Prof. Mitchell', subjects: ['Mathematics', 'Physics', 'Psychology'], availability: 'Free Period 3' },
  { id: 'STF004', name: 'Ms. Clara', subjects: ['History', 'English', 'Humanities'], availability: 'Free Period 1-4' },
  { id: 'STF005', name: 'Mr. Bond', subjects: ['Science', 'Biology', 'Chemistry'], availability: 'Free Period 2, 4' },
  { id: 'STF006', name: 'Mrs. Daisy', subjects: ['Early Childhood', 'Art', 'Wellness'], availability: 'Free Period 3' }
];

const HRHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recruitment' | 'leave' | 'subs' | 'compliance' | 'pd'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data State
  const [openings, setOpenings] = useState<JobOpening[]>(INITIAL_OPENINGS);
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE);
  const [subs, setSubs] = useState<SubstitutionRequest[]>(INITIAL_SUBS);
  const [complianceRecords, setComplianceRecords] = useState(INITIAL_COMPLIANCE);
  const [pdRecords, setPdRecords] = useState(INITIAL_PD);

  // Interaction State
  const [isAIGenerating, setIsAIGenerating] = useState<string | null>(null); // Track generating state per ID
  const [aiMatchResponses, setAiMatchResponses] = useState<Record<string, string>>({}); 
  const [activeModal, setActiveModal] = useState<'job' | 'leave' | 'sub' | 'pd' | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // Forms
  const [newJob, setNewJob] = useState<Partial<JobOpening>>({ title: '', department: 'General', type: 'Full-time' });
  const [newLeave, setNewLeave] = useState<Partial<LeaveRequest>>({ staffName: '', type: 'Sick', startDate: '', endDate: '', reason: '' });
  const [newSub, setNewSub] = useState<Partial<SubstitutionRequest>>({ absentStaffName: '', subject: '', date: '', period: '' });
  const [newPD, setNewPD] = useState({ staffName: '', activity: '', provider: '', date: '', credits: 0 });

  // --- HANDLERS ---

  // Substitutions
  const handleAIMatch = async (sub: SubstitutionRequest) => {
    setIsAIGenerating(sub.id);
    const result = await findAIGuidedSubstitution(sub, MOCK_AVAILABLE_STAFF);
    setAiMatchResponses(prev => ({...prev, [sub.id]: result}));
    setIsAIGenerating(null);
  };

  const confirmSubMatch = (subId: string) => {
    setSubs(prev => prev.map(s => s.id === subId ? { ...s, status: 'Matched' } : s));
    alert("Substitute confirmed and notified via Institutional Pulse.");
  };

  const createSubRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const req: SubstitutionRequest = {
      id: `SUB-${Date.now()}`,
      absentStaffId: 'STF-???', // In real app, derived from selection
      absentStaffName: newSub.absentStaffName!,
      subject: newSub.subject!,
      date: newSub.date!,
      period: newSub.period!,
      status: 'Pending'
    };
    setSubs([req, ...subs]);
    setActiveModal(null);
    setNewSub({ absentStaffName: '', subject: '', date: '', period: '' });
  };

  // Leave
  const updateLeaveStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const createLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const req: LeaveRequest = {
      id: `L-${Date.now()}`,
      staffId: 'STF-CURRENT', // Mock current user
      staffName: newLeave.staffName || 'Current User',
      type: newLeave.type!,
      startDate: newLeave.startDate!,
      endDate: newLeave.endDate!,
      reason: newLeave.reason!,
      status: 'Pending'
    };
    setLeaveRequests([req, ...leaveRequests]);
    setActiveModal(null);
    setNewLeave({ staffName: '', type: 'Sick', startDate: '', endDate: '', reason: '' });
  };

  // Recruitment
  const createJob = (e: React.FormEvent) => {
    e.preventDefault();
    const job: JobOpening = {
      id: `JOB-${Date.now()}`,
      title: newJob.title!,
      department: newJob.department!,
      type: newJob.type!,
      status: 'Open',
      applicantsCount: 0
    };
    setOpenings([job, ...openings]);
    setActiveModal(null);
    setNewJob({ title: '', department: 'General', type: 'Full-time' });
  };

  const advanceApplicant = (appId: string) => {
    const stages = ['Applied', 'Screening', 'Interview', 'Offered', 'Hired'];
    setApplicants(prev => prev.map(a => {
      if (a.id !== appId) return a;
      const idx = stages.indexOf(a.stage);
      if (idx < stages.length - 1) return { ...a, stage: stages[idx + 1] };
      return a;
    }));
  };

  // Compliance
  const toggleCompliance = (id: string) => {
    setComplianceRecords(prev => prev.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'Verified' ? 'Expired' : 'Verified' } 
        : c
    ));
  };

  // PD
  const logPD = (e: React.FormEvent) => {
    e.preventDefault();
    setPdRecords([{ id: `PD-${Date.now()}`, ...newPD }, ...pdRecords]);
    setActiveModal(null);
    setNewPD({ staffName: '', activity: '', provider: '', date: '', credits: 0 });
  };

  // --- RENDERERS ---

  const renderDashboard = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Faculty', value: '142', icon: <Users />, color: 'blue', trend: '+4% growth' },
          { label: 'PD Completion', value: '88%', icon: <Award />, color: 'emerald', trend: 'Optimal' },
          { label: 'Open Vacancies', value: openings.filter(j => j.status === 'Open').length, icon: <Briefcase />, color: 'indigo', trend: 'High Priority' },
          { label: 'Pending Leave', value: leaveRequests.filter(l => l.status === 'Pending').length, icon: <Clock />, color: 'amber', trend: 'Action Req' },
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
            {applicants.slice(0, 3).map(app => (
              <div 
                key={app.id} 
                onClick={() => setSelectedApplicant(app)}
                className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.name}`} className="w-14 h-14 rounded-2xl shadow-md" alt="" />
                  <div>
                    <h5 className="font-black text-slate-900 leading-none mb-1 group-hover:text-blue-600 transition-colors">{app.name}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.jobTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest">{app.stage}</span>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedApplicant(app); }} className="text-slate-200 group-hover:text-blue-600 transition-colors">
                    <ChevronRight size={20} />
                  </button>
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
        <button onClick={() => setActiveModal('sub')} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3">
          <Plus size={18} /> Request Replacement
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-6">
           {subs.length === 0 && <p className="text-slate-400 font-bold text-center py-10">No active substitution requests.</p>}
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
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${sub.status === 'Matched' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'}`}>
                      {sub.status}
                    </span>
                 </div>
                 
                 <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                       <div className="flex items-center justify-between mb-6">
                          <h5 className="text-lg font-black flex items-center gap-3"><Zap size={20} className="text-blue-400" /> Neural Match Analysis</h5>
                          {sub.status !== 'Matched' && (
                            <button 
                              onClick={() => handleAIMatch(sub)} 
                              disabled={isAIGenerating === sub.id}
                              className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all"
                            >
                              {isAIGenerating === sub.id ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} className="text-blue-400" />}
                            </button>
                          )}
                       </div>
                       {aiMatchResponses[sub.id] ? (
                          <div className="space-y-4">
                             <div className="text-sm font-medium text-blue-100 italic leading-relaxed prose prose-invert max-w-none">
                                {aiMatchResponses[sub.id]}
                             </div>
                             {sub.status !== 'Matched' && (
                               <button onClick={() => confirmSubMatch(sub.id)} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2">
                                  <Check size={14} /> Confirm Assignment
                               </button>
                             )}
                          </div>
                       ) : sub.status === 'Matched' ? (
                          <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest">Substitution Confirmed & Notified.</p>
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
          <button onClick={() => setActiveModal('job')} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3">
            <Plus size={18} /> Author Vacancy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3 space-y-10">
          <div className="glass-card rounded-[48px] overflow-hidden bg-white shadow-2xl">
            <div className="p-8 border-b border-slate-100">
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Active Candidates</h4>
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
                      <button onClick={() => advanceApplicant(app.id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all group" title="Advance Stage">
                         <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
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

  const renderLeave = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
       <div className="flex justify-between items-end px-1">
          <div>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Absence Ledger</h3>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Faculty Leave & Availability</p>
          </div>
          <button onClick={() => setActiveModal('leave')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3">
             <Plus size={18} /> New Request
          </button>
       </div>

       <div className="glass-card rounded-[48px] overflow-hidden bg-white shadow-xl border-none">
          <table className="w-full text-left">
             <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <tr>
                   <th className="px-10 py-6">Faculty Member</th>
                   <th className="px-6 py-6">Leave Type</th>
                   <th className="px-6 py-6">Duration</th>
                   <th className="px-6 py-6">Status</th>
                   <th className="px-10 py-6 text-right">Approval Node</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {leaveRequests.map(req => (
                   <tr key={req.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-10 py-6">
                         <p className="font-black text-slate-900 text-sm">{req.staffName}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">ID: {req.staffId}</p>
                      </td>
                      <td className="px-6 py-6"><span className="text-xs font-bold text-slate-700">{req.type}</span></td>
                      <td className="px-6 py-6">
                         <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <Calendar size={14} className="text-slate-400"/> {req.startDate} <ArrowRight size={12}/> {req.endDate}
                         </div>
                      </td>
                      <td className="px-6 py-6">
                         <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                            req.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                            'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
                         }`}>{req.status}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                         {req.status === 'Pending' && (
                            <div className="flex justify-end gap-2">
                               <button onClick={() => updateLeaveStatus(req.id, 'Approved')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><Check size={16}/></button>
                               <button onClick={() => updateLeaveStatus(req.id, 'Rejected')} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><X size={16}/></button>
                            </div>
                         )}
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
       <div className="flex justify-between items-end px-1">
          <div>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Compliance Vault</h3>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Institutional Regulatory Adherence</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {complianceRecords.map(rec => (
             <div key={rec.id} className="glass-card p-8 rounded-[40px] bg-white border border-slate-100 shadow-xl group hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start mb-6">
                   <div className={`p-4 rounded-2xl ${rec.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {rec.status === 'Verified' ? <BadgeCheck size={24}/> : <ShieldCheck size={24}/>}
                   </div>
                   <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${rec.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {rec.status}
                   </span>
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-1">{rec.staffName}</h4>
                <p className="text-sm font-bold text-slate-500 mb-6">{rec.item}</p>
                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expires: {rec.expiry}</span>
                   <button onClick={() => toggleCompliance(rec.id)} className="text-xs font-bold text-blue-600 hover:underline">Toggle Status</button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderPD = () => (
    <div className="space-y-10 animate-in fade-in duration-700">
       <div className="flex justify-between items-end px-1">
          <div>
             <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Professional Growth</h3>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Faculty Development Credits</p>
          </div>
          <button onClick={() => setActiveModal('pd')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3">
             <Plus size={18} /> Log Unit
          </button>
       </div>

       <div className="glass-card rounded-[48px] overflow-hidden bg-white shadow-xl border-none">
          <table className="w-full text-left">
             <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <tr>
                   <th className="px-10 py-6">Faculty Member</th>
                   <th className="px-6 py-6">Activity / Workshop</th>
                   <th className="px-6 py-6">Provider</th>
                   <th className="px-6 py-6">Completion Date</th>
                   <th className="px-10 py-6 text-right">Credit Value</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {pdRecords.map(pd => (
                   <tr key={pd.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-10 py-6">
                         <span className="font-black text-slate-900 text-sm">{pd.staffName}</span>
                      </td>
                      <td className="px-6 py-6"><span className="text-xs font-bold text-slate-700">{pd.activity}</span></td>
                      <td className="px-6 py-6"><span className="text-xs font-bold text-slate-500">{pd.provider}</span></td>
                      <td className="px-6 py-6"><span className="text-xs font-bold text-slate-500">{pd.date}</span></td>
                      <td className="px-10 py-6 text-right">
                         <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-black text-xs">{pd.credits}</span>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-32 animate-in fade-in duration-700 relative">
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
         {activeTab === 'leave' && renderLeave()}
         {activeTab === 'subs' && renderSubs()}
         {activeTab === 'compliance' && renderCompliance()}
         {activeTab === 'pd' && renderPD()}
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

      {/* APPLICANT DOSSIER MODAL */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedApplicant(null)}></div>
            <div className="relative w-full max-w-lg bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col border border-white/20">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                     <div>
                        <h3 className="text-2xl font-black tracking-tighter">{selectedApplicant.name}</h3>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Applicant Dossier</p>
                     </div>
                     <button onClick={() => setSelectedApplicant(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={20}/></button>
                </div>
                <div className="p-10 space-y-8 bg-slate-50/50">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Role</p>
                            <p className="font-bold text-slate-900 leading-tight">{selectedApplicant.jobTitle}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Stage</p>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase">{selectedApplicant.stage}</span>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Neural Score</p>
                            <p className="font-black text-2xl text-emerald-600">{selectedApplicant.score}%</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Applied Date</p>
                            <p className="font-bold text-slate-900">{selectedApplicant.appliedDate}</p>
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-[32px] border border-slate-200 shadow-sm">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Node</p>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg"><Mail size={16} className="text-slate-500"/></div>
                            <span className="font-bold text-slate-700">{selectedApplicant.email}</span>
                        </div>
                    </div>
                </div>
                <div className="p-8 border-t border-slate-100 bg-white flex gap-4">
                    <button onClick={() => setSelectedApplicant(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Close</button>
                    <button onClick={() => { setSelectedApplicant(null); setActiveTab('recruitment'); }} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                       Full Profile <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in" onClick={() => setActiveModal(null)}></div>
           <div className="relative w-full max-w-lg bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col border border-white/20">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                    {activeModal === 'job' && 'New Vacancy'}
                    {activeModal === 'leave' && 'Request Absence'}
                    {activeModal === 'sub' && 'Request Substitution'}
                    {activeModal === 'pd' && 'Log Development'}
                 </h3>
                 <button onClick={() => setActiveModal(null)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100"><X size={20}/></button>
              </div>
              <div className="p-8 space-y-6">
                 {/* DYNAMIC FORMS BASED ON MODAL TYPE */}
                 {activeModal === 'job' && (
                    <form onSubmit={createJob} className="space-y-6">
                       <input value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} placeholder="Position Title" required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                       <select value={newJob.department} onChange={e => setNewJob({...newJob, department: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 cursor-pointer">
                          <option>Mathematics</option><option>Science</option><option>Humanities</option><option>Early Years</option><option>Wellness</option>
                       </select>
                       <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 cursor-pointer">
                          <option>Full-time</option><option>Part-time</option><option>Contract</option>
                       </select>
                       <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">Publish Vacancy</button>
                    </form>
                 )}

                 {activeModal === 'leave' && (
                    <form onSubmit={createLeaveRequest} className="space-y-6">
                       <input value={newLeave.staffName} onChange={e => setNewLeave({...newLeave, staffName: e.target.value})} placeholder="Staff Name" required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                       <select value={newLeave.type} onChange={e => setNewLeave({...newLeave, type: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 cursor-pointer">
                          <option>Sick</option><option>Personal</option><option>Professional Development</option>
                       </select>
                       <div className="grid grid-cols-2 gap-4">
                          <input type="date" value={newLeave.startDate} onChange={e => setNewLeave({...newLeave, startDate: e.target.value})} required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                          <input type="date" value={newLeave.endDate} onChange={e => setNewLeave({...newLeave, endDate: e.target.value})} required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                       </div>
                       <input value={newLeave.reason} onChange={e => setNewLeave({...newLeave, reason: e.target.value})} placeholder="Reason (Optional)" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                       <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">Submit Request</button>
                    </form>
                 )}

                 {activeModal === 'sub' && (
                    <form onSubmit={createSubRequest} className="space-y-6">
                       <input value={newSub.absentStaffName} onChange={e => setNewSub({...newSub, absentStaffName: e.target.value})} placeholder="Absent Staff Name" required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                       <input value={newSub.subject} onChange={e => setNewSub({...newSub, subject: e.target.value})} placeholder="Subject" required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                       <input type="date" value={newSub.date} onChange={e => setNewSub({...newSub, date: e.target.value})} required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                       <input value={newSub.period} onChange={e => setNewSub({...newSub, period: e.target.value})} placeholder="Periods (e.g. P1-P3)" required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                       <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all">Request Substitute</button>
                    </form>
                 )}

                 {activeModal === 'pd' && (
                    <form onSubmit={logPD} className="space-y-6">
                       <input value={newPD.staffName} onChange={e => setNewPD({...newPD, staffName: e.target.value})} placeholder="Staff Name" required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                       <input value={newPD.activity} onChange={e => setNewPD({...newPD, activity: e.target.value})} placeholder="Activity Title" required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                       <input value={newPD.provider} onChange={e => setNewPD({...newPD, provider: e.target.value})} placeholder="Provider" required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                       <div className="grid grid-cols-2 gap-4">
                          <input type="date" value={newPD.date} onChange={e => setNewPD({...newPD, date: e.target.value})} required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                          <input type="number" value={newPD.credits} onChange={e => setNewPD({...newPD, credits: parseInt(e.target.value)})} placeholder="Credits" required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400" />
                       </div>
                       <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">Log Credits</button>
                    </form>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default HRHub;
