import React, { useState } from 'react';
import { 
  UserPlus, Search, Filter, MoreVertical, 
  ArrowRight, Sparkles, MessageCircle, 
  CheckCircle2, Clock, ShieldCheck, Zap, 
  Mail, Phone, FileText, ChevronRight,
  UserCheck, Loader2, Receipt
} from 'lucide-react';
import { AdmissionsCandidate, GradeLevel, Student, StudentLifecycleStatus, Invoice } from '../../types';

const INITIAL_CANDIDATES: AdmissionsCandidate[] = [
  { id: 'CAN-9901', name: 'Zoe Winters', appliedGrade: GradeLevel.KINDERGARTEN, status: 'Interview', dateApplied: '2026-05-10', parentName: 'Mark Winters', sentimentScore: 92, notes: 'Highly engaged during tour. Parent expressed commitment to IB path.' },
  { id: 'CAN-9902', name: 'Leo Sterling', appliedGrade: GradeLevel.SENIOR_HIGH, status: 'Application', dateApplied: '2026-05-12', parentName: 'Sarah Sterling', sentimentScore: 65, notes: 'Standard application. Pending math proficiency evaluation.' },
  { id: 'CAN-9903', name: 'Maya Gupta', appliedGrade: GradeLevel.ELEMENTARY, status: 'Offered', dateApplied: '2026-04-20', parentName: 'Anita Gupta', sentimentScore: 88, notes: 'Exceptional creative portfolio. Offered early entry grant.' },
];

const STAGES = ['Inquiry', 'Application', 'Interview', 'Offered', 'Enrolled'];

const AdmissionsPipeline: React.FC = () => {
  const [candidates, setCandidates] = useState<AdmissionsCandidate[]>(INITIAL_CANDIDATES);
  const [activeStage, setActiveStage] = useState('Offered');
  const [isEnrolling, setIsEnrolling] = useState<string | null>(null);

  const filtered = candidates.filter(c => c.status === activeStage);

  const finalizeEnrollment = (candidate: AdmissionsCandidate) => {
    setIsEnrolling(candidate.id);
    
    setTimeout(() => {
      const newStudentId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // 1. Create a permanent Student record
      const newStudent: Student = {
        id: newStudentId,
        name: candidate.name,
        gradeLevel: candidate.appliedGrade,
        grade: 'Incoming',
        gpa: 0,
        status: 'Active',
        lifecycleStatus: StudentLifecycleStatus.ENROLLED,
        fatherName: candidate.parentName,
        enrollmentDate: new Date().toISOString().split('T')[0],
        lastPaymentStatus: 'Pending',
        balanceOwed: 5000,
        documents: []
      };

      // 2. Automated Fiscal Trigger: Create initial Tuition Invoice
      const newInvoice: Invoice = {
        id: `INV-${Date.now().toString().slice(-4)}`,
        studentId: newStudentId,
        studentName: candidate.name,
        amount: 5000,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Sent',
        category: 'Tuition'
      };

      // 3. Save to Registry
      const savedStudents = JSON.parse(localStorage.getItem('edupulse_students_registry') || '[]');
      localStorage.setItem('edupulse_students_registry', JSON.stringify([...savedStudents, newStudent]));
      
      const savedInvoices = JSON.parse(localStorage.getItem('edupulse_invoices') || '[]');
      localStorage.setItem('edupulse_invoices', JSON.stringify([newInvoice, ...savedInvoices]));

      // 4. Update candidate status in pipeline
      setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, status: 'Enrolled' } : c));
      
      setIsEnrolling(null);
      alert(`Executive Chain Reaction Triggered!\n\n1. Identity ${newStudentId} Promoted to Registry.\n2. Initial Tuition Invoice Generated ($5,000).\n3. Enrollment Packet Dispatched via Digital Hub.`);
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Enrollment Engine</h2>
          <p className="text-slate-500 font-black italic uppercase text-[10px] tracking-[0.5em] mt-3">Global Campus Growth Pipeline 2026</p>
        </div>
        <button className="w-full lg:w-auto bg-slate-900 text-white px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl hover:bg-blue-600 transition-all">
          <UserPlus size={20} /> Register Inquiry
        </button>
      </div>

      {/* Stage Navigator */}
      <div className="flex bg-white/80 backdrop-blur-xl p-2 rounded-[32px] shadow-2xl border border-slate-100 overflow-x-auto scrollbar-hide gap-2">
        {STAGES.map((stage, i) => (
          <button 
            key={stage} 
            onClick={() => setActiveStage(stage)}
            className={`flex-1 min-w-[140px] px-6 py-4 rounded-[22px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeStage === stage ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <span className="opacity-40">{i+1}.</span> {stage}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map(c => (
                <div key={c.id} className="glass-card p-10 rounded-[56px] bg-white border-none shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><FileText size={100} /></div>
                   <div className="flex justify-between items-start mb-10">
                      <div className="flex items-center gap-6">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} className="w-20 h-20 rounded-[32px] border-4 border-slate-50 shadow-2xl group-hover:scale-110 transition-transform duration-700" alt="" />
                        <div>
                           <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors uppercase">{c.name}</h4>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{c.appliedGrade} Tier • {c.id}</p>
                        </div>
                      </div>
                      {c.sentimentScore && (
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner flex flex-col items-center">
                           <Sparkles size={16} className="animate-pulse mb-1" />
                           <span className="text-[9px] font-black">{c.sentimentScore}%</span>
                        </div>
                      )}
                   </div>

                   <div className="bg-slate-50/50 rounded-[40px] p-8 border border-slate-100 mb-10 space-y-6">
                      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <span>Parent Identity</span>
                         <span className="text-slate-900">{c.parentName}</span>
                      </div>
                      <div className="pt-6 border-t border-slate-200">
                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2"><MessageCircle size={14}/> Internal Synthesis</p>
                         <p className="text-sm font-bold text-slate-600 italic leading-relaxed">"{c.notes}"</p>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      {activeStage === 'Offered' ? (
                        <button 
                          onClick={() => finalizeEnrollment(c)}
                          disabled={isEnrolling === c.id}
                          className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 disabled:opacity-50"
                        >
                          {isEnrolling === c.id ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
                          {isEnrolling === c.id ? 'Initializing Lifecycle...' : 'Finalize Enrollment'}
                        </button>
                      ) : (
                        <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                           Advance Node <ArrowRight size={16} />
                        </button>
                      )}
                      <button className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Mail size={20} /></button>
                   </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="md:col-span-2 py-40 text-center glass-card rounded-[64px] bg-white/40">
                   <Clock size={64} className="mx-auto text-slate-100 mb-8" />
                   <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Pipeline stage clear for this cycle.</p>
                </div>
              )}
           </div>
        </div>

        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[56px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group neural-glow">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
              <div className="relative z-10">
                 <h4 className="text-xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter">
                    <div className="p-3 bg-white/10 rounded-2xl"><Zap size={20} className="text-amber-400" /></div>
                    Conversion IQ
                 </h4>
                 <div className="space-y-10">
                    {[
                      { label: 'Target Enrollment', val: 82 },
                      { label: 'Retention Prediction', val: 94 },
                      { label: 'Market Benchmarking', val: 78 }
                    ].map(m => (
                      <div key={m.label} className="space-y-4">
                         <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">{m.label}</span>
                            <span className="text-lg font-black">{m.val}%</span>
                         </div>
                         <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden shadow-inner p-0.5">
                            <div className="h-full bg-blue-500 rounded-full animate-glow-pulse" style={{ width: `${m.val}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                       <Receipt size={16} className="text-blue-400" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Enrollment Chain-Trigger</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed italic">"Enrolling a candidate initiates fiscal, medical, and academic dossiers in real-time."</p>
                 </div>
                 <button className="w-full mt-12 py-5 bg-white text-slate-900 rounded-[28px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3">
                    Institutional Alpha Report <ChevronRight size={16} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsPipeline;