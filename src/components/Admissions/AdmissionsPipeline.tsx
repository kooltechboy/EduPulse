import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Search, Filter, MoreVertical, 
  ArrowRight, ArrowLeft, Sparkles, MessageCircle, 
  CheckCircle2, Clock, ShieldCheck, Zap, 
  Mail, Phone, FileText, ChevronRight,
  UserCheck, Loader2, Receipt, X, Send, Activity,
  Database, Fingerprint, Award, Target,
  RefreshCw, MapPin, Cake, Users, ShieldAlert,
  FilePlus, Download, Camera, Trash2, HeartPulse,
  School, GraduationCap, Briefcase, Info, Home
} from 'lucide-react';
import { AdmissionsCandidate, GradeLevel, Student, StudentLifecycleStatus, Invoice, CandidateDocument } from '@/types';

const INITIAL_CANDIDATES: AdmissionsCandidate[] = [
  { 
    id: 'CAN-9901', 
    name: 'Zoe Winters', 
    appliedGrade: GradeLevel.KINDERGARTEN, 
    status: 'Interview', 
    dateApplied: '2026-05-10', 
    parentName: 'Mark Winters', 
    sentimentScore: 92, 
    notes: 'Highly engaged during tour. Parent expressed commitment to IB path.',
    dob: '2021-08-15',
    gender: 'Female',
    fatherName: 'Mark Winters',
    motherName: 'Lillian Winters',
    address: '45 Bluebell Cir, South Campus Dr, CA 90210',
    phone: '+1 555-010-9922',
    email: 'm.winters@webnode.com',
    siblings: 'Leo Winters (Grade 2)',
    previousSchool: 'Little Sprouts Academy',
    medicalInfo: 'Peanut allergy - managed with standard protocol.',
    documents: [
      { id: 'D1', name: 'Birth Certificate', type: 'Birth Certificate', status: 'Verified', uploadDate: '2026-05-10' },
      { id: 'D2', name: 'Official Portrait', type: 'Photo', status: 'Verified', uploadDate: '2026-05-10' }
    ]
  },
  { id: 'CAN-9902', name: 'Leo Sterling', appliedGrade: GradeLevel.SENIOR_HIGH, status: 'Application', dateApplied: '2026-05-12', parentName: 'Sarah Sterling', sentimentScore: 65, notes: 'Standard application. Pending math proficiency evaluation.' },
  { id: 'CAN-9903', name: 'Maya Gupta', appliedGrade: GradeLevel.ELEMENTARY, status: 'Offered', dateApplied: '2026-04-20', parentName: 'Anita Gupta', sentimentScore: 88, notes: 'Exceptional creative portfolio. Offered early entry grant.' },
];

const STAGES = ['Inquiry', 'Application', 'Interview', 'Offered', 'Enrolled'];

const AdmissionsPipeline: React.FC = () => {
  const [candidates, setCandidates] = useState<AdmissionsCandidate[]>(() => {
    const saved = localStorage.getItem('edupulse_admissions_pipeline');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });
  
  const [activeStage, setActiveStage] = useState('Inquiry');
  const [isEnrolling, setIsEnrolling] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<AdmissionsCandidate | null>(null);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('edupulse_admissions_pipeline', JSON.stringify(candidates));
  }, [candidates]);

  const filtered = candidates.filter(c => c.status === activeStage);

  const handleRegisterInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingInquiry(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    setTimeout(() => {
      const newCandidate: AdmissionsCandidate = {
        id: `CAN-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.get('candidateName') as string,
        appliedGrade: formData.get('grade') as GradeLevel,
        parentName: formData.get('parentName') as string,
        notes: formData.get('notes') as string,
        status: 'Inquiry',
        dateApplied: new Date().toISOString().split('T')[0],
        sentimentScore: Math.floor(75 + Math.random() * 20),
        // Extended fields
        dob: formData.get('dob') as string,
        gender: formData.get('gender') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        motherName: formData.get('motherName') as string,
        fatherName: formData.get('fatherName') as string,
        previousSchool: formData.get('previousSchool') as string,
        documents: []
      };

      setCandidates(prev => [newCandidate, ...prev]);
      setActiveStage('Inquiry');
      setIsRegisterModalOpen(false);
      setIsSubmittingInquiry(false);
    }, 1800);
  };

  const advanceCandidate = (candidate: AdmissionsCandidate) => {
    setProcessingId(candidate.id);
    setTimeout(() => {
      const currentIndex = STAGES.indexOf(candidate.status);
      if (currentIndex < STAGES.length - 1) {
        const nextStatus = STAGES[currentIndex + 1];
        setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, status: nextStatus as any } : c));
        setActiveStage(nextStatus);
      }
      setProcessingId(null);
    }, 800);
  };

  const revertCandidate = (candidate: AdmissionsCandidate) => {
    setProcessingId(candidate.id);
    setTimeout(() => {
      const currentIndex = STAGES.indexOf(candidate.status);
      if (currentIndex > 0) {
        const prevStatus = STAGES[currentIndex - 1];
        setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, status: prevStatus as any } : c));
        setActiveStage(prevStatus);
      }
      setProcessingId(null);
    }, 800);
  };

  const finalizeEnrollment = (candidate: AdmissionsCandidate) => {
    setIsEnrolling(candidate.id);
    setTimeout(() => {
      const newStudentId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
      const newStudent: Student = {
        id: newStudentId,
        name: candidate.name,
        gradeLevel: candidate.appliedGrade,
        grade: 'Incoming',
        gpa: 0,
        status: 'Active',
        lifecycleStatus: StudentLifecycleStatus.ENROLLED,
        fatherName: candidate.fatherName || candidate.parentName,
        motherName: candidate.motherName,
        enrollmentDate: new Date().toISOString().split('T')[0],
        lastPaymentStatus: 'Pending',
        balanceOwed: 5000,
        documents: candidate.documents?.map(d => ({ id: d.id, name: d.name, type: d.type, uploadDate: d.uploadDate, status: d.status })) || []
      };
      const newInvoice: Invoice = {
        id: `INV-${Date.now().toString().slice(-4)}`,
        studentId: newStudentId,
        studentName: candidate.name,
        amount: 5000,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Sent',
        category: 'Tuition'
      };
      const savedStudents = JSON.parse(localStorage.getItem('edupulse_students_registry') || '[]');
      localStorage.setItem('edupulse_students_registry', JSON.stringify([...savedStudents, newStudent]));
      const savedInvoices = JSON.parse(localStorage.getItem('edupulse_invoices') || '[]');
      localStorage.setItem('edupulse_invoices', JSON.stringify([newInvoice, ...savedInvoices]));
      setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, status: 'Enrolled' } : c));
      setIsEnrolling(null);
      setIsDossierOpen(false);
      alert(`Lifecycle Transition Successful: ${candidate.name} is now a registered Student Node.`);
    }, 2500);
  };

  const openDossier = (candidate: AdmissionsCandidate) => {
    setSelectedCandidate(candidate);
    setIsDossierOpen(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Admission Hub</h2>
          <p className="text-slate-600 font-black italic uppercase text-[10px] tracking-[0.5em] mt-4 flex items-center gap-3">
            <Database size={16} className="text-blue-600" /> Enrollment Lifecycle Management • Core 2026
          </p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
           <button className="flex-1 lg:flex-none bg-white border-2 border-slate-200 text-slate-700 px-8 py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
             <Filter size={18} /> Cycle Config
           </button>
           <button 
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex-1 lg:flex-none bg-slate-950 text-white px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl hover:bg-blue-700 transition-all active:scale-95 group"
           >
             <UserPlus size={20} className="group-hover:rotate-12 transition-transform" /> Register Inquiry
           </button>
        </div>
      </div>

      {/* PHASE NAVIGATION */}
      <div className="flex bg-white/90 backdrop-blur-3xl p-2 rounded-[40px] shadow-xl border border-slate-200 overflow-x-auto scrollbar-hide gap-2">
        {STAGES.map((stage, i) => (
          <button 
            key={stage} 
            onClick={() => setActiveStage(stage)}
            className={`flex-1 min-w-[160px] px-8 py-5 rounded-[28px] font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 group relative ${activeStage === stage ? 'bg-slate-900 text-white shadow-2xl scale-[1.03] z-10' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] border ${activeStage === stage ? 'border-white/30 bg-white/10' : 'border-slate-300 bg-slate-100'}`}>{i+1}</span>
            {stage}
            {activeStage === stage && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        <div className="xl:col-span-3 space-y-10">
           {filtered.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filtered.map(c => {
                  const currentIndex = STAGES.indexOf(c.status);
                  return (
                    <div key={c.id} onClick={() => openDossier(c)} className="glass-card p-10 rounded-[64px] bg-white border-none shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col justify-between min-h-[500px] cursor-pointer ring-1 ring-slate-200 hover:ring-blue-400">
                      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 pointer-events-none"><FileText size={120} /></div>
                      
                      <div>
                          <div className="flex justify-between items-start mb-10">
                            <div className="flex items-center gap-6">
                              <div className="relative">
                                <img src={c.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} className="w-24 h-24 rounded-[40px] border-4 border-slate-100 shadow-2xl group-hover:scale-105 transition-transform duration-700" alt="" />
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg"><UserCheck size={14}/></div>
                              </div>
                              <div>
                                  <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-blue-700 transition-colors uppercase">{c.name}</h4>
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-3 flex items-center gap-2">
                                    <Clock size={12} className="text-blue-600"/> Received: {c.dateApplied}
                                  </p>
                              </div>
                            </div>
                            <div className="p-4 bg-blue-50 text-blue-700 rounded-3xl shadow-inner flex flex-col items-center border border-blue-100">
                                <Sparkles size={18} className="animate-pulse mb-1.5 text-blue-500" />
                                <span className="text-[10px] font-black">{c.sentimentScore}% IQ</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-[48px] p-8 border border-slate-200 mb-10 space-y-6">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><Fingerprint size={12} className="text-blue-600"/> Authority Node</span>
                                <span className="text-slate-900 font-black">{c.parentName}</span>
                            </div>
                            <div className="pt-6 border-t border-slate-200">
                                <div className="flex items-center gap-2 mb-4">
                                  <Activity size={14} className="text-indigo-600"/>
                                  <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Sentiment Context</span>
                                </div>
                                <p className="text-base font-bold text-slate-700 leading-relaxed italic line-clamp-2">"{c.notes}"</p>
                            </div>
                          </div>
                      </div>

                      <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                          {currentIndex > 0 && (
                            <button 
                              onClick={() => revertCandidate(c)}
                              disabled={processingId === c.id}
                              className="flex-1 py-5 bg-slate-100 text-slate-700 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center gap-3 active:scale-95 border border-slate-200 disabled:opacity-30"
                              title="Revert Phase"
                            >
                              <ArrowLeft size={18} />
                            </button>
                          )}
                          
                          {activeStage === 'Offered' ? (
                            <button 
                              onClick={() => finalizeEnrollment(c)}
                              disabled={isEnrolling === c.id}
                              className="flex-[4] py-5 bg-emerald-600 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-50"
                            >
                              {isEnrolling === c.id ? <Loader2 size={20} className="animate-spin" /> : <Award size={20} />}
                              {isEnrolling === c.id ? 'Establishing Identity...' : 'Finalize Registry'}
                            </button>
                          ) : (
                            <button 
                              onClick={() => advanceCandidate(c)}
                              disabled={processingId === c.id}
                              className="flex-[4] py-5 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-2xl disabled:opacity-50"
                            >
                               {processingId === c.id ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} className="text-blue-400" />}
                               {processingId === c.id ? 'Syncing...' : `Advance to ${STAGES[currentIndex + 1]}`}
                            </button>
                          )}
                          <button className="flex-1 py-5 bg-white border-2 border-slate-200 text-slate-700 rounded-[24px] hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center shadow-sm"><Mail size={22} /></button>
                      </div>
                    </div>
                  );
                })}
             </div>
           ) : (
             <div className="py-60 text-center glass-card rounded-[80px] bg-white shadow-2xl border-none relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 opacity-50"></div>
                <div className="relative z-10">
                   <div className="w-28 h-28 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                      <Clock size={56} className="text-slate-300" />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">Phase Queue Clear</h3>
                   <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px] mt-4">All identity nodes in this stage have been processed.</p>
                   <button onClick={() => setIsRegisterModalOpen(true)} className="mt-12 px-12 py-5 bg-slate-950 text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:bg-blue-600 transition-all">Register New Applicant</button>
                </div>
             </div>
           )}
        </div>

        <div className="space-y-10">
           <div className="glass-card p-12 rounded-[64px] bg-slate-950 text-white shadow-2xl relative overflow-hidden group neural-glow">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48 transition-transform duration-[5s]"></div>
              <div className="relative z-10">
                 <h4 className="text-2xl font-black mb-12 flex items-center gap-5 uppercase tracking-tighter leading-none">
                    <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-3xl shadow-inner border border-white/10"><Target size={28} className="text-blue-400" /></div>
                    Growth Pulse
                 </h4>
                 <div className="space-y-12">
                    {[
                      { label: 'Conversion Velocity', val: 84, color: 'bg-blue-500' },
                      { label: 'Identity Sync', val: 96, color: 'bg-emerald-500' },
                      { label: 'Waitlist Drift', val: 12, color: 'bg-rose-500' }
                    ].map(m => (
                      <div key={m.label} className="space-y-5">
                         <div className="flex justify-between items-end">
                            <span className="text-[11px] font-black text-blue-200 uppercase tracking-widest">{m.label}</span>
                            <span className="text-2xl font-black">{m.val}%</span>
                         </div>
                         <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5">
                            <div className={`h-full rounded-full animate-glow-pulse ${m.color}`} style={{ width: `${m.val}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-16 p-8 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-4 mb-4">
                       <ShieldCheck size={20} className="text-emerald-400" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Encryption Active</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium italic">"Manual and bidirectional phase transitions ensure integrity of historical student dossier nodes."</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* REGISTRATION DOSSIER MODAL - DEEP VIEW */}
      {isDossierOpen && selectedCandidate && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/98 backdrop-blur-3xl animate-in fade-in duration-700" onClick={() => setIsDossierOpen(false)}></div>
           <div className="relative w-full max-w-6xl bg-white rounded-[72px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-700 flex flex-col max-h-[95vh] border border-white/20">
              
              <div className="p-10 md:p-14 bg-slate-900 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
                 <button onClick={() => setIsDossierOpen(false)} className="absolute top-8 right-8 p-5 bg-white/10 rounded-[32px] hover:bg-white/20 transition-all active:scale-90 group z-20">
                    <X size={32} className="group-hover:rotate-90 transition-transform duration-500" />
                 </button>
                 
                 <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="relative group">
                       <img src={selectedCandidate.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCandidate.name}`} className="w-48 h-48 md:w-56 md:h-56 rounded-[56px] border-8 border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-105" alt="" />
                       <button className="absolute bottom-2 right-2 p-4 bg-blue-600 text-white rounded-3xl shadow-xl border-4 border-slate-900 hover:bg-blue-500 transition-all active:scale-95"><Camera size={24}/></button>
                    </div>
                    <div className="text-center md:text-left flex-1">
                       <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                          <span className="px-5 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{selectedCandidate.status} Phase</span>
                          <span className="px-5 py-2 bg-white/10 text-blue-200 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">ID: {selectedCandidate.id}</span>
                       </div>
                       <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-tight mb-4">{selectedCandidate.name}</h3>
                       <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-6">
                          <div className="flex items-center gap-3 text-slate-300">
                             <Cake size={20} className="text-blue-400" />
                             <span className="text-xs font-black uppercase tracking-widest">{selectedCandidate.dob || 'DOB Not Synced'}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-300">
                             <GraduationCap size={20} className="text-indigo-400" />
                             <span className="text-xs font-black uppercase tracking-widest">{selectedCandidate.appliedGrade} Tier</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-300">
                             <MapPin size={20} className="text-rose-400" />
                             <span className="text-xs font-black uppercase tracking-widest truncate max-w-[200px]">{selectedCandidate.address || 'Location Pending'}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 md:p-16 space-y-16 scrollbar-hide bg-slate-50/20">
                 
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                       {/* FAMILY & HOUSEHOLD NODE */}
                       <div className="glass-card p-10 rounded-[56px] bg-white shadow-xl border border-slate-200/50">
                          <h4 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tight flex items-center gap-5">
                             <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[22px]"><Users size={24}/></div>
                             Family Hierarchy Node
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className="space-y-6">
                                <div>
                                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Father Authority</p>
                                   <p className="text-lg font-black text-slate-800 uppercase">{selectedCandidate.fatherName || 'Not Set'}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Mother Authority</p>
                                   <p className="text-lg font-black text-slate-800 uppercase">{selectedCandidate.motherName || 'Not Set'}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Guardian / Legal Node</p>
                                   <p className="text-lg font-black text-slate-800 uppercase">{selectedCandidate.guardianName || 'Primary Parents'}</p>
                                </div>
                             </div>
                             <div className="space-y-6 border-l border-slate-200 pl-10">
                                <div>
                                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Comm Node (Tel)</p>
                                   <p className="text-lg font-black text-blue-600 uppercase flex items-center gap-3"><Phone size={18}/> {selectedCandidate.phone || 'Registry Missing'}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Legacy Siblings</p>
                                   <p className="text-sm font-bold text-slate-700 italic leading-relaxed">"{selectedCandidate.siblings || 'None Registered'}"</p>
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Official Email</p>
                                   <p className="text-base font-black text-slate-800">{selectedCandidate.email || 'N/A'}</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* ACADEMIC & HEALTH NODE */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="glass-card p-8 rounded-[48px] bg-white border border-slate-200 shadow-lg">
                             <h5 className="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-6 flex items-center gap-4">
                                <School size={18} className="text-blue-500" /> Origin Point
                             </h5>
                             <p className="text-xs font-black text-slate-600 uppercase mb-2">Previous Institution</p>
                             <p className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">{selectedCandidate.previousSchool || 'Home Environment'}</p>
                          </div>
                          <div className="glass-card p-8 rounded-[48px] bg-rose-50/50 border border-rose-100 shadow-lg">
                             <h5 className="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-6 flex items-center gap-4">
                                <HeartPulse size={18} className="text-rose-500" /> Biometric Health Node
                             </h5>
                             <p className="text-xs font-black text-slate-600 uppercase mb-2">Medical Conditions / Allergies</p>
                             <p className="text-sm font-bold text-slate-800 italic leading-relaxed">"{selectedCandidate.medicalInfo || 'No critical info registered.'}"</p>
                          </div>
                       </div>

                       {/* NOTES NODE */}
                       <div className="glass-card p-10 rounded-[56px] bg-slate-50 border border-slate-200">
                          <h4 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-4">
                             <Info className="text-blue-600" /> Institutional Contextual Notes
                          </h4>
                          <p className="text-base font-medium text-slate-700 leading-relaxed italic">"{selectedCandidate.notes}"</p>
                       </div>
                    </div>

                    <div className="space-y-12">
                       {/* DOCUMENT VAULT */}
                       <div className="glass-card p-10 rounded-[56px] bg-white shadow-2xl border border-slate-200/50 flex flex-col h-full">
                          <div className="flex items-center justify-between mb-10">
                             <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><ShieldCheck size={20}/></div>
                                Registry Vault
                             </h4>
                             <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all active:scale-90"><FilePlus size={18}/></button>
                          </div>
                          <div className="space-y-4 flex-1">
                             {['Birth Certificate', 'Parent ID', 'Medical Report', 'Recommendation', 'Previous Transcripts'].map(docType => {
                                const doc = selectedCandidate.documents?.find(d => d.type === docType);
                                return (
                                   <div key={docType} className={`p-5 rounded-[28px] border-2 transition-all flex items-center justify-between group ${doc ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-dashed border-slate-300'}`}>
                                      <div className="flex items-center gap-4">
                                         <div className={`p-3 rounded-xl ${doc ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            <FileText size={18} />
                                         </div>
                                         <div>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${doc ? 'text-emerald-700' : 'text-slate-500'}`}>{docType}</p>
                                            <p className="text-[9px] font-bold text-slate-600 uppercase">{doc ? `Verified: ${doc.uploadDate}` : 'Pending Upload'}</p>
                                         </div>
                                      </div>
                                      {doc ? (
                                        <button className="p-2.5 bg-white text-emerald-600 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-600 hover:text-white"><Download size={16}/></button>
                                      ) : (
                                        <button className="p-2.5 bg-slate-200 text-slate-700 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><FilePlus size={16}/></button>
                                      )}
                                   </div>
                                );
                             })}
                          </div>
                          <div className="mt-10 p-6 bg-slate-900 rounded-[32px] shadow-xl">
                             <div className="flex items-center gap-4 mb-3">
                                <ShieldAlert size={18} className="text-amber-400" />
                                <span className="text-[9px] font-black uppercase text-blue-200 tracking-widest">Compliance Protocol</span>
                             </div>
                             <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">"Enrollment requires 100% Document Node synchronization prior to registry."</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* ACTION CONTROLS */}
                 <div className="bg-slate-950 p-12 rounded-[56px] shadow-2xl relative overflow-hidden group neural-glow flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 pointer-events-none"></div>
                    <div className="relative z-10 flex-1">
                       <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-5">
                          <Zap size={32} className="text-blue-400 animate-pulse" /> Finalize Selection Node
                       </h4>
                       <p className="text-blue-100/70 font-medium italic leading-relaxed max-w-xl">
                          "Confirming admission promotes this identity dossier to the Global Student Registry and triggers institutional fiscal anchors."
                       </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 relative z-10 w-full md:w-auto">
                       <button 
                        onClick={() => finalizeEnrollment(selectedCandidate)} 
                        disabled={!!isEnrolling}
                        className="px-16 py-7 bg-emerald-600 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-emerald-500 hover:translate-y-[-4px] transition-all flex items-center justify-center gap-6 active:scale-95 disabled:opacity-50"
                       >
                          {isEnrolling ? <Loader2 className="animate-spin" size={24}/> : <UserCheck size={24}/>} Admit To Registry
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* REGISTER INQUIRY MODAL - REDESIGNED FOR DEEP DATA CAPTURE */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-3xl animate-in fade-in duration-700" onClick={() => setIsRegisterModalOpen(false)}></div>
           <form onSubmit={handleRegisterInquiry} className="relative w-full max-w-4xl bg-white rounded-[72px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-24 duration-1000 flex flex-col max-h-[95vh] border border-white/20">
              <div className="p-10 md:p-14 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-20 shadow-sm">
                 <div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Register Inquiry</h3>
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] mt-4 flex items-center gap-3">
                      <Sparkles size={16} className="text-blue-500 animate-pulse" /> Deep Institutional Identity Capture Node
                    </p>
                 </div>
                 <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="p-5 bg-slate-100 rounded-[32px] hover:bg-slate-200 transition-all active:scale-90 group"><X size={32} className="group-hover:rotate-90 transition-transform duration-500" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 md:p-16 space-y-16 scrollbar-hide bg-slate-50/20">
                 
                 {/* BASIC IDENTITY */}
                 <div className="space-y-10">
                    <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-4 flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Core Identity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Full Identity Name</label>
                          <input name="candidateName" required placeholder="Full Legal Name..." className="w-full px-10 py-7 bg-white border-2 border-slate-200 rounded-[40px] font-black text-2xl outline-none focus:border-blue-400 transition-all shadow-inner placeholder:text-slate-300" />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Academic Node</label>
                          <select name="grade" className="w-full px-10 py-7 bg-white border-2 border-slate-200 rounded-[40px] font-black text-xl outline-none cursor-pointer focus:border-blue-400 transition-all appearance-none shadow-sm">
                             {Object.values(GradeLevel).map(level => (
                               <option key={level} value={level}>{level}</option>
                             ))}
                          </select>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Date of Birth</label>
                          <input type="date" name="dob" className="w-full px-10 py-7 bg-white border-2 border-slate-200 rounded-[40px] font-black text-lg outline-none focus:border-blue-400 transition-all shadow-sm" />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Gender Biometric</label>
                          <select name="gender" className="w-full px-10 py-7 bg-white border-2 border-slate-200 rounded-[40px] font-black text-lg outline-none focus:border-blue-400 transition-all shadow-sm appearance-none">
                             <option>Male</option>
                             <option>Female</option>
                             <option>Non-Binary</option>
                             <option>Prefer not to state</option>
                          </select>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Origin School</label>
                          <input name="previousSchool" placeholder="Last institution..." className="w-full px-10 py-7 bg-white border-2 border-slate-200 rounded-[40px] font-black text-lg outline-none focus:border-blue-400 transition-all shadow-sm" />
                       </div>
                    </div>
                 </div>

                 {/* PARENTAL AUTHORITY */}
                 <div className="space-y-10">
                    <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-4 flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Parental Authority Nodes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Father Authority Name</label>
                          <input name="fatherName" required placeholder="Father Legal Name..." className="w-full px-10 py-7 bg-white border-2 border-slate-200 rounded-[40px] font-black text-xl outline-none focus:border-indigo-400 shadow-sm" />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Mother Authority Name</label>
                          <input name="motherName" required placeholder="Mother Legal Name..." className="w-full px-10 py-7 bg-white border-2 border-slate-200 rounded-[40px] font-black text-xl outline-none focus:border-indigo-400 shadow-sm" />
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Comm Node (Tel)</label>
                          <input type="tel" name="phone" required placeholder="+1..." className="w-full px-10 py-7 bg-white border-2 border-slate-200 rounded-[40px] font-black text-xl outline-none focus:border-indigo-400 shadow-sm" />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Registry Email</label>
                          <input type="email" name="email" required placeholder="contact@..." className="w-full px-10 py-7 bg-white border-2 border-slate-200 rounded-[40px] font-black text-xl outline-none focus:border-indigo-400 shadow-sm" />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Physical Residency Node (Full Address)</label>
                       <textarea name="address" rows={2} placeholder="Full Residency Detail..." className="w-full px-10 py-8 bg-white border-2 border-slate-200 rounded-[40px] font-black text-xl text-slate-900 outline-none focus:border-indigo-400 shadow-inner resize-none placeholder:text-slate-300" />
                    </div>
                 </div>

                 {/* CONTEXTUAL FRAGMENTS */}
                 <div className="space-y-10">
                    <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-4 flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> Behavioral & Contextual Notes</h4>
                    <textarea 
                      name="notes" 
                      placeholder="Enter initial inquiry fragments, family concerns, or sibling legacy notes..." 
                      className="w-full h-40 px-10 py-8 bg-white border-2 border-slate-200 rounded-[40px] font-bold text-slate-800 outline-none focus:border-rose-400 transition-all shadow-inner resize-none text-xl leading-relaxed placeholder:text-slate-300" 
                    />
                 </div>

                 <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-[3s]"><Activity size={80} className="text-blue-400" /></div>
                    <div className="relative z-10 flex items-center gap-8">
                       <div className="p-6 bg-white/10 rounded-[32px] backdrop-blur-xl border border-white/5 shadow-inner"><ShieldCheck size={40} className="text-emerald-400 animate-glow-pulse" /></div>
                       <div>
                          <h4 className="text-white font-black text-2xl uppercase tracking-tighter leading-none">Institutional Protocol Sync</h4>
                          <p className="text-[10px] text-blue-200 uppercase tracking-[0.3em] mt-3">Initializing sentiment analysis & biometric identity creation upon registry.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-10 md:p-14 bg-white border-t border-slate-200 shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.02)]">
                 <button 
                  type="submit" 
                  disabled={isSubmittingInquiry}
                  className="w-full py-9 bg-blue-600 text-white font-black rounded-[48px] text-sm uppercase tracking-[0.5em] shadow-[0_32px_64px_-16px_rgba(37,99,235,0.4)] hover:bg-slate-950 transition-all duration-1000 flex items-center justify-center gap-8 active:scale-95 disabled:opacity-50 group/btn"
                 >
                   {isSubmittingInquiry ? (
                     <><RefreshCw className="animate-spin" size={28} /> Synchronizing Dossier...</>
                   ) : (
                     <>Initialize Digital Inquiry <Send size={28} className="group-hover/btn:translate-x-2 transition-transform" /></>
                   )}
                 </button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default AdmissionsPipeline;