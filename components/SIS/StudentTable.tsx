import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, X, UserPlus, ChevronRight, 
  History, Receipt, Wallet, ArrowRight, Filter,
  GraduationCap, TrendingUp, Activity, ShieldCheck,
  MessageCircleCode, Phone
} from 'lucide-react';
import { Student, GradeLevel, FinancialStatus } from '../../types';

const INITIAL_STUDENTS: Student[] = [
  { 
    id: 'STU-4401', 
    name: 'Aiden Mitchell', 
    gender: 'Male', 
    dob: '2008-05-12', 
    email: 'aiden.m@campus.edu', 
    grade: '10th', 
    gradeLevel: GradeLevel.SENIOR_HIGH, 
    attendance: 98, 
    gpa: 3.9, 
    status: 'Active', 
    lastPaymentStatus: 'Settled', 
    balanceOwed: 0,
    enrollmentDate: '2023-09-01', 
    fatherName: 'Robert Mitchell', 
    motherName: 'Sarah Mitchell',
    parentPhone: '9876543210',
    documents: [
      { id: 'DOC-1', name: 'Birth Certificate', type: 'Identity', uploadDate: '2023-09-01', status: 'Verified' },
      { id: 'DOC-2', name: 'Baseline Math Evaluation', type: 'Evaluation', uploadDate: '2023-09-05', status: 'Verified' }
    ]
  },
  { 
    id: 'STU-2910', 
    name: 'Sophia Chen', 
    gender: 'Female', 
    dob: '2006-11-20', 
    email: 'sophia.c@campus.edu', 
    grade: '12th', 
    gradeLevel: GradeLevel.SENIOR_HIGH, 
    attendance: 72, 
    gpa: 3.7, 
    status: 'Active', 
    lastPaymentStatus: 'Partial', 
    balanceOwed: 4000,
    enrollmentDate: '2022-09-01', 
    fatherName: 'James Chen', 
    motherName: 'Li Chen',
    parentPhone: '9876543211',
    documents: [],
    situationalNotes: 'Requires monitoring due to family relocation distance.'
  },
  { 
    id: 'STU-0882', 
    name: 'Marcus Wilson', 
    gender: 'Male', 
    dob: '2016-03-22', 
    email: 'm.wilson@campus.edu', 
    grade: '1st', 
    gradeLevel: GradeLevel.ELEMENTARY, 
    attendance: 95, 
    gpa: 3.5, 
    status: 'Active', 
    lastPaymentStatus: 'Overdue', 
    balanceOwed: 3500,
    enrollmentDate: '2024-01-10', 
    fatherName: 'George Wilson', 
    motherName: 'Emma Wilson',
    parentPhone: '9876543212',
    documents: []
  },
];

const StudentTable: React.FC = () => {
  const [students] = useState<Student[]>(() => {
    const saved = localStorage.getItem('edupulse_students_registry');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  
  const [filterLevel] = useState<GradeLevel | 'Master'>('Master');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'performance' | 'finance' | 'vault'>('overview');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    localStorage.setItem('edupulse_students_registry', JSON.stringify(students));
  }, [students]);

  const getFinancialColor = (status: FinancialStatus) => {
    switch (status) {
      case 'Settled': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Partial': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Overdue': return 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const handleWhatsAppShortcut = (student: Student) => {
    const phone = student.parentPhone || '9876543210';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(`Hello, I'm reaching out from EduPulse regarding ${student.name}.`)}`;
    window.open(url, '_blank');
  };

  const filteredStudents = students.filter(s => {
    const matchesLevel = filterLevel === 'Master' || s.gradeLevel === filterLevel;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 px-4 md:px-0">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Student Registry</h2>
          <p className="text-slate-500 font-bold italic mt-1 uppercase text-[10px] tracking-[0.2em]">Institutional Core Identity & Fiscal Ledger</p>
        </div>
        <button onClick={() => setIsEnrollModalOpen(true)} className="w-full lg:w-auto bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:translate-y-[-4px] transition-all">
          Enroll New Student
        </button>
      </div>

      <div className="glass-card rounded-[32px] md:rounded-[48px] overflow-hidden border-none shadow-2xl bg-white/40">
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4">
           <div className="relative flex-1 group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
             <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search biometric identities..." className="w-full pl-14 md:pl-16 pr-6 py-4 md:py-5 bg-white border-none rounded-[24px] md:rounded-[28px] focus:ring-4 focus:ring-blue-100 text-sm font-bold shadow-inner" />
           </div>
           <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-[24px] text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
             <Filter size={18} /> Filters
           </button>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="block md:hidden p-4 space-y-4">
          {filteredStudents.map(stu => (
            <div key={stu.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6 active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4" onClick={() => { setSelectedStudent(stu); setIsProfileModalOpen(true); }}>
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stu.name}`} className="w-16 h-16 rounded-2xl border-2 border-slate-100 shadow-md" alt="" />
                 <div className="flex-1">
                    <p className="font-black text-slate-900 text-xl tracking-tight leading-none mb-1">{stu.name}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stu.id} • {stu.gradeLevel}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-lg font-black text-blue-600">{stu.gpa.toFixed(2)}</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase">GPA</p>
                 </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                 <div className="flex gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest ${getFinancialColor(stu.lastPaymentStatus || 'Pending')}`}>{stu.lastPaymentStatus}</span>
                 </div>
                 <div className="flex gap-3">
                    <button onClick={() => handleWhatsAppShortcut(stu)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><MessageCircleCode size={20}/></button>
                    <button onClick={() => { setSelectedStudent(stu); setIsProfileModalOpen(true); }} className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ArrowRight size={20}/></button>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-10 py-8">Biometric Profile</th>
                <th className="px-6 py-8">Campus Placement</th>
                <th className="px-6 py-8 text-center">GPA Core</th>
                <th className="px-6 py-8">Fiscal Status</th>
                <th className="px-10 py-8 text-right">Registry Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-blue-50/20 transition-all group cursor-pointer">
                  <td className="px-10 py-8" onClick={() => { setSelectedStudent(stu); setIsProfileModalOpen(true); }}>
                    <div className="flex items-center gap-6">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stu.name}`} className="w-16 h-16 rounded-[24px] border-4 border-white shadow-2xl group-hover:scale-110 transition-transform" alt="" />
                      <div>
                        <p className="font-black text-slate-900 text-xl tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">{stu.name}</p>
                        <p className="text-[10px] text-slate-400 font-black tracking-widest">{stu.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8"><span className="text-xs font-black text-slate-700 uppercase tracking-widest">{stu.gradeLevel} • {stu.grade}</span></td>
                  <td className="px-6 py-8 text-center font-black text-blue-600 text-xl">{stu.gpa.toFixed(2)}</td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col gap-1">
                       <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest w-fit ${getFinancialColor(stu.lastPaymentStatus || 'Pending')}`}>{stu.lastPaymentStatus}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleWhatsAppShortcut(stu); }}
                            className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="WhatsApp Bridge"
                        >
                            <MessageCircleCode size={18} />
                        </button>
                        <button 
                            onClick={() => { setSelectedStudent(stu); setIsProfileModalOpen(true); }}
                            className="p-3 bg-slate-100 text-slate-400 hover:text-blue-600 hover:bg-white rounded-2xl transition-all shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal Remains the same... */}
      {isProfileModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center md:p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl" onClick={() => setIsProfileModalOpen(false)}></div>
           <div className="relative w-full h-full md:h-auto md:max-w-6xl bg-white md:rounded-[64px] shadow-2xl overflow-hidden flex flex-col max-h-screen md:max-h-[92vh] animate-in zoom-in-95">
              <div className="p-8 md:p-14 bg-gradient-to-br from-blue-700 to-indigo-900 text-white relative">
                 <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.name}`} className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] md:rounded-[56px] border-4 md:border-8 border-white/20 shadow-2xl" alt="" />
                    <div className="text-center md:text-left flex-1">
                       <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">{selectedStudent.name}</h3>
                       <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          <span className="px-5 py-1.5 bg-white/10 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/20">{selectedStudent.gradeLevel} Tier</span>
                          <span className={`px-5 py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/20`}>Identity: {selectedStudent.id}</span>
                       </div>
                    </div>
                    <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-6 right-6 p-3 md:p-4 bg-white/10 hover:bg-white/20 rounded-2xl md:rounded-3xl transition-all"><X size={24} /></button>
                 </div>
              </div>

              <div className="flex bg-slate-50 p-2 border-b border-slate-100 overflow-x-auto scrollbar-hide">
                {['overview', 'performance', 'finance', 'vault'].map(tab => (
                  <button key={tab} onClick={() => setActiveProfileTab(tab as any)} className={`flex-1 min-w-[120px] py-4 rounded-[20px] md:rounded-[28px] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeProfileTab === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>{tab} Dossier</button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-14 scrollbar-hide bg-slate-50/20">
                 {activeProfileTab === 'finance' && (
                    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                          <div className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-xl flex flex-col justify-center">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Liability</p>
                             <div className="flex items-center gap-4 md:gap-5">
                                <div className="p-3 md:p-4 bg-rose-50 text-rose-500 rounded-2xl md:rounded-3xl shadow-inner"><Receipt size={28} /></div>
                                <h4 className={`text-3xl md:text-5xl font-black tracking-tighter ${selectedStudent.balanceOwed && selectedStudent.balanceOwed > 0 ? 'text-rose-600' : 'text-emerald-500'}`}>${(selectedStudent.balanceOwed || 0).toLocaleString()}</h4>
                             </div>
                          </div>
                          <div className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-xl flex flex-col justify-center">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Health</p>
                             <div className="flex items-center gap-4 md:gap-5">
                                <div className="p-3 md:p-4 bg-blue-50 text-blue-500 rounded-2xl md:rounded-3xl shadow-inner"><Wallet size={28} /></div>
                                <h4 className="text-3xl md:text-5xl font-black tracking-tighter text-blue-600">85%</h4>
                             </div>
                          </div>
                          <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[32px] md:rounded-[48px] shadow-2xl relative overflow-hidden group">
                             <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-4">Guardian Profile</p>
                             <h4 className="text-xl md:text-2xl font-black tracking-tight">{selectedStudent.fatherName || selectedStudent.motherName || 'Registry Not Synced'}</h4>
                             <button onClick={() => handleWhatsAppShortcut(selectedStudent)} className="mt-6 md:mt-8 w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                                <MessageCircleCode size={18} /> WhatsApp Guardian
                             </button>
                          </div>
                       </div>
                    </div>
                 )}
                 {activeProfileTab !== 'finance' && (
                    <div className="py-20 text-center">
                       <Activity size={64} className="mx-auto text-slate-100 mb-6" />
                       <p className="text-slate-400 italic">Analytical node content synchronized. Access the Finance Dossier for full ledger data.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StudentTable;