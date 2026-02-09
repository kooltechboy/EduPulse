
import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, X, UserPlus, ChevronRight, 
  History, Receipt, Wallet, ArrowRight, Filter,
  GraduationCap, TrendingUp, Activity, ShieldCheck,
  MessageCircleCode, Phone, Archive, Award, FileDown,
  BookOpen, Heart, Landmark, Edit3, Save, MapPin, Mail,
  Calendar, User, CheckCircle2
} from 'lucide-react';
import { Student, GradeLevel, FinancialStatus, StudentLifecycleStatus } from '../../types';

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
    lifecycleStatus: StudentLifecycleStatus.ENROLLED,
    lastPaymentStatus: 'Settled', 
    balanceOwed: 0,
    enrollmentDate: '2023-09-01', 
    fatherName: 'Robert Mitchell', 
    motherName: 'Sarah Mitchell',
    parentPhone: '9876543210',
    address: '45 Bluebell Lane, District 1',
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
    lifecycleStatus: StudentLifecycleStatus.ENROLLED,
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
    lifecycleStatus: StudentLifecycleStatus.ENROLLED,
    lastPaymentStatus: 'Overdue', 
    balanceOwed: 3500,
    enrollmentDate: '2024-01-10', 
    fatherName: 'George Wilson', 
    motherName: 'Emma Wilson',
    parentPhone: '9876543212',
    documents: []
  },
  { 
    id: 'ALM-0012', 
    name: 'Eleanor Vance', 
    gender: 'Female', 
    dob: '2004-02-15', 
    email: 'e.vance@alumni.edu', 
    grade: 'Alumna', 
    gradeLevel: GradeLevel.SENIOR_HIGH, 
    attendance: 100, 
    gpa: 4.0, 
    status: 'Inactive', 
    lifecycleStatus: StudentLifecycleStatus.ALUMNI,
    lastPaymentStatus: 'Settled', 
    balanceOwed: 0,
    enrollmentDate: '2018-09-01', 
    graduationDate: '2022-06-15',
    documents: []
  },
];

const StudentTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('edupulse_students_registry');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  
  const [filterLevel] = useState<GradeLevel | 'Master'>('Master');
  const [lifecycleFilter, setLifecycleFilter] = useState<StudentLifecycleStatus | 'All'>(StudentLifecycleStatus.ENROLLED);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'performance' | 'finance' | 'vault' | 'heritage'>('overview');
  
  // Selection & Editing
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Student>>({});

  // Enrollment Form State
  const [enrollForm, setEnrollForm] = useState<Partial<Student>>({
    gradeLevel: GradeLevel.ELEMENTARY,
    lifecycleStatus: StudentLifecycleStatus.ENROLLED,
    status: 'Active',
    enrollmentDate: new Date().toISOString().split('T')[0]
  });

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

  const getLifecycleColor = (status: StudentLifecycleStatus) => {
    switch (status) {
      case StudentLifecycleStatus.ENROLLED: return 'bg-blue-50 text-blue-600 border-blue-100';
      case StudentLifecycleStatus.ALUMNI: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case StudentLifecycleStatus.GRADUATED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case StudentLifecycleStatus.WITHDRAWN: return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-slate-50 text-slate-400';
    }
  };

  const handleWhatsAppShortcut = (student: Student) => {
    const phone = student.parentPhone || '9876543210';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(`Hello, I'm reaching out from EduPulse regarding ${student.name}.`)}`;
    window.open(url, '_blank');
  };

  const filteredStudents = students.filter(s => {
    const matchesLevel = filterLevel === 'Master' || s.gradeLevel === filterLevel;
    const matchesLifecycle = lifecycleFilter === 'All' || s.lifecycleStatus === lifecycleFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch && matchesLifecycle;
  });

  const exportPermanentRecord = (student: Student) => {
    alert(`Generating Permanent Academic Passport for ${student.name}...\n\nThis dossier includes verified transcripts, medical sync logs, and behavioral heritage.`);
  };

  // Profile Edit Handlers
  const openProfile = (student: Student) => {
    setSelectedStudent(student);
    setEditForm(student);
    setIsEditing(false);
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!selectedStudent || !editForm) return;
    
    setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, ...editForm } as Student : s));
    setSelectedStudent({ ...selectedStudent, ...editForm } as Student);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Student, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent: Student = {
      ...enrollForm as Student,
      id: newId,
      gpa: 0,
      attendance: 100,
      lastPaymentStatus: 'Pending',
      balanceOwed: 0,
      documents: []
    };
    
    setStudents(prev => [newStudent, ...prev]);
    setIsEnrollModalOpen(false);
    setEnrollForm({
      gradeLevel: GradeLevel.ELEMENTARY,
      lifecycleStatus: StudentLifecycleStatus.ENROLLED,
      status: 'Active',
      enrollmentDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 px-4 md:px-0">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Student Registry</h2>
          <p className="text-slate-500 font-bold italic mt-1 uppercase text-[10px] tracking-[0.2em]">Institutional Core Identity & Longitudinal Heritage</p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <button onClick={() => setLifecycleFilter(StudentLifecycleStatus.ALUMNI)} className="flex-1 lg:flex-none bg-white border border-slate-200 text-slate-600 px-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
            <Archive size={18} /> Alumni Node
          </button>
          <button onClick={() => setIsEnrollModalOpen(true)} className="flex-1 lg:flex-none bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:translate-y-[-4px] transition-all">
            Enroll New Student
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[32px] md:rounded-[48px] overflow-hidden border-none shadow-2xl bg-white/40">
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/50">
           <div className="relative flex-1 group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
             <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search permanent biometric identities..." className="w-full pl-14 md:pl-16 pr-6 py-4 md:py-5 bg-white border-none rounded-[24px] md:rounded-[28px] focus:ring-4 focus:ring-blue-100 text-sm font-bold shadow-inner" />
           </div>
           <div className="flex bg-white p-1 rounded-[24px] shadow-sm border border-slate-100 overflow-x-auto scrollbar-hide">
              {Object.values(StudentLifecycleStatus).map(status => (
                <button 
                  key={status} 
                  onClick={() => setLifecycleFilter(status)}
                  className={`px-6 py-3 rounded-[20px] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${lifecycleFilter === status ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {status}
                </button>
              ))}
           </div>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="block md:hidden p-4 space-y-4">
          {filteredStudents.map(stu => (
            <div key={stu.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6 active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4" onClick={() => openProfile(stu)}>
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
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest ${getLifecycleColor(stu.lifecycleStatus)}`}>{stu.lifecycleStatus}</span>
                 </div>
                 <div className="flex gap-3">
                    <button onClick={() => handleWhatsAppShortcut(stu)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><MessageCircleCode size={20}/></button>
                    <button onClick={() => openProfile(stu)} className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ArrowRight size={20}/></button>
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
                <th className="px-10 py-8">Identity Profile</th>
                <th className="px-6 py-8">Lifecycle State</th>
                <th className="px-6 py-8 text-center">Academic Merit</th>
                <th className="px-6 py-8">Fiscal Status</th>
                <th className="px-10 py-8 text-right">Registry Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-blue-50/20 transition-all group cursor-pointer">
                  <td className="px-10 py-8" onClick={() => openProfile(stu)}>
                    <div className="flex items-center gap-6">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stu.name}`} className="w-16 h-16 rounded-[24px] border-4 border-white shadow-2xl group-hover:scale-110 transition-transform" alt="" />
                      <div>
                        <p className="font-black text-slate-900 text-xl tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">{stu.name}</p>
                        <p className="text-[10px] text-slate-400 font-black tracking-widest">{stu.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest ${getLifecycleColor(stu.lifecycleStatus)}`}>
                        {stu.lifecycleStatus}
                    </span>
                  </td>
                  <td className="px-6 py-8 text-center font-black text-blue-600 text-xl">{stu.gpa.toFixed(2)}</td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col gap-1">
                       <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest w-fit ${getFinancialColor(stu.lastPaymentStatus || 'Pending')}`}>{stu.lastPaymentStatus}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                        <button 
                            onClick={(e) => { e.stopPropagation(); exportPermanentRecord(stu); }}
                            className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            title="Export Heritage Passport"
                        >
                            <FileDown size={18} />
                        </button>
                        <button 
                            onClick={() => openProfile(stu)}
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

      {/* ENROLLMENT MODAL */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsEnrollModalOpen(false)}></div>
           <div className="relative w-full max-w-4xl bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Enrollment Node</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Initialize New Student Registry</p>
                 </div>
                 <button onClick={() => setIsEnrollModalOpen(false)} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleEnrollStudent} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                 {/* Identity Section */}
                 <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                       <User size={16} className="text-blue-500" /> Identity Biometrics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <input 
                         required
                         placeholder="Full Legal Name"
                         value={enrollForm.name || ''}
                         onChange={e => setEnrollForm({...enrollForm, name: e.target.value})}
                         className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-blue-400 transition-all"
                       />
                       <input 
                         type="date"
                         required
                         value={enrollForm.dob || ''}
                         onChange={e => setEnrollForm({...enrollForm, dob: e.target.value})}
                         className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-blue-400 transition-all"
                       />
                       <select 
                         value={enrollForm.gender || ''}
                         onChange={e => setEnrollForm({...enrollForm, gender: e.target.value})}
                         className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-blue-400 transition-all cursor-pointer"
                       >
                          <option value="">Select Gender...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                       </select>
                       <select 
                         value={enrollForm.gradeLevel}
                         onChange={e => setEnrollForm({...enrollForm, gradeLevel: e.target.value as GradeLevel})}
                         className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-blue-400 transition-all cursor-pointer"
                       >
                          {Object.values(GradeLevel).map(g => (
                             <option key={g} value={g}>{g}</option>
                          ))}
                       </select>
                    </div>
                 </div>

                 {/* Family Section */}
                 <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                       <ShieldCheck size={16} className="text-emerald-500" /> Parental Authority
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <input 
                         placeholder="Father Name"
                         value={enrollForm.fatherName || ''}
                         onChange={e => setEnrollForm({...enrollForm, fatherName: e.target.value})}
                         className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-emerald-400 transition-all"
                       />
                       <input 
                         placeholder="Mother Name"
                         value={enrollForm.motherName || ''}
                         onChange={e => setEnrollForm({...enrollForm, motherName: e.target.value})}
                         className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-emerald-400 transition-all"
                       />
                       <input 
                         placeholder="Primary Email"
                         type="email"
                         value={enrollForm.email || ''}
                         onChange={e => setEnrollForm({...enrollForm, email: e.target.value})}
                         className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-emerald-400 transition-all"
                       />
                       <input 
                         placeholder="Primary Phone (WhatsApp)"
                         value={enrollForm.parentPhone || ''}
                         onChange={e => setEnrollForm({...enrollForm, parentPhone: e.target.value})}
                         className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-emerald-400 transition-all"
                       />
                       <textarea 
                         rows={2}
                         placeholder="Residential Address..."
                         value={enrollForm.address || ''}
                         onChange={e => setEnrollForm({...enrollForm, address: e.target.value})}
                         className="w-full md:col-span-2 px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-slate-900 outline-none focus:border-emerald-400 transition-all resize-none"
                       />
                    </div>
                 </div>
              </form>
              <div className="p-8 border-t border-slate-100 bg-white">
                 <button onClick={handleEnrollStudent} className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                    <UserPlus size={18} /> Confirm Enrollment
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Profile Modal - ENHANCED WITH EDIT CAPABILITIES */}
      {isProfileModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center md:p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl" onClick={() => setIsProfileModalOpen(false)}></div>
           <div className="relative w-full h-full md:h-auto md:max-w-6xl bg-white md:rounded-[64px] shadow-2xl overflow-hidden flex flex-col max-h-screen md:max-h-[92vh] animate-in zoom-in-95">
              
              {/* MODAL HEADER */}
              <div className={`p-8 md:p-14 bg-gradient-to-br ${selectedStudent.lifecycleStatus === StudentLifecycleStatus.ALUMNI ? 'from-slate-800 to-indigo-950' : 'from-blue-700 to-indigo-900'} text-white relative`}>
                 <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                    <div className="relative group">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.name}`} className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] md:rounded-[56px] border-8 border-white/20 shadow-2xl" alt="" />
                       {isEditing && <div className="absolute inset-0 bg-black/40 rounded-[56px] flex items-center justify-center cursor-pointer"><Edit3 className="text-white"/></div>}
                    </div>
                    <div className="text-center md:text-left flex-1 space-y-4">
                       {isEditing ? (
                         <input 
                           value={editForm.name}
                           onChange={(e) => handleInputChange('name', e.target.value)}
                           className="text-3xl md:text-5xl font-black bg-transparent border-b-2 border-white/30 outline-none text-white w-full text-center md:text-left tracking-tighter"
                         />
                       ) : (
                         <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">{selectedStudent.name}</h3>
                       )}
                       
                       <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          <span className="px-5 py-1.5 bg-white/10 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/20">{selectedStudent.gradeLevel} Tier</span>
                          <span className="px-5 py-1.5 bg-blue-600 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">{selectedStudent.lifecycleStatus}</span>
                          <span className="px-5 py-1.5 bg-white/10 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/20">ID: {selectedStudent.id}</span>
                       </div>
                    </div>
                    <div className="flex gap-4">
                        {isEditing ? (
                          <button onClick={handleSaveProfile} className="p-4 bg-emerald-500 text-white rounded-3xl shadow-xl hover:bg-emerald-400 transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest pr-6">
                             <Save size={20}/> Commit Updates
                          </button>
                        ) : (
                          <button onClick={() => setIsEditing(true)} className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-3xl transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest pr-6">
                             <Edit3 size={20}/> Modify Registry
                          </button>
                        )}
                        <button onClick={() => setIsProfileModalOpen(false)} className="p-4 bg-white/10 hover:bg-white/20 rounded-3xl transition-all"><X size={24} /></button>
                    </div>
                 </div>
              </div>

              {/* TABS */}
              <div className="flex bg-slate-50 p-2 border-b border-slate-100 overflow-x-auto scrollbar-hide">
                {['overview', 'performance', 'finance', 'heritage'].map(tab => (
                  <button key={tab} onClick={() => setActiveProfileTab(tab as any)} className={`flex-1 min-w-[120px] py-4 rounded-[20px] md:rounded-[28px] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeProfileTab === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>{tab} Dossier</button>
                ))}
              </div>

              {/* CONTENT AREA */}
              <div className="flex-1 overflow-y-auto p-6 md:p-14 scrollbar-hide bg-slate-50/20">
                 {/* OVERVIEW TAB WITH EDITABLE FIELDS */}
                 {activeProfileTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
                       <div className="bg-white p-10 rounded-[48px] shadow-xl border border-slate-100 space-y-8">
                          <h4 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
                             <User className="text-blue-600"/> Personal Registry
                          </h4>
                          <div className="grid grid-cols-2 gap-8">
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Birth Date</p>
                                {isEditing ? (
                                  <input type="date" value={editForm.dob} onChange={e => handleInputChange('dob', e.target.value)} className="w-full font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200" />
                                ) : (
                                  <p className="font-bold text-slate-800 uppercase">{selectedStudent.dob || 'Not Synced'}</p>
                                )}
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gender Biometric</p>
                                {isEditing ? (
                                  <select value={editForm.gender} onChange={e => handleInputChange('gender', e.target.value)} className="w-full font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                     <option>Male</option>
                                     <option>Female</option>
                                     <option>Non-Binary</option>
                                  </select>
                                ) : (
                                  <p className="font-bold text-slate-800 uppercase">{selectedStudent.gender || 'Not Synced'}</p>
                                )}
                             </div>
                             <div className="col-span-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Email Node</p>
                                {isEditing ? (
                                  <input type="email" value={editForm.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200" />
                                ) : (
                                  <p className="font-bold text-slate-800">{selectedStudent.email || 'Not Synced'}</p>
                                )}
                             </div>
                             <div className="col-span-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Physical Residency</p>
                                {isEditing ? (
                                  <input value={editForm.address} onChange={e => handleInputChange('address', e.target.value)} className="w-full font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200" />
                                ) : (
                                  <p className="font-bold text-slate-800">{selectedStudent.address || 'Address Not Registered'}</p>
                                )}
                             </div>
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="bg-white p-10 rounded-[48px] shadow-xl border border-slate-100 space-y-8">
                             <h4 className="text-xl font-black text-slate-900 uppercase flex items-center gap-3">
                                <ShieldCheck className="text-emerald-600"/> Guardian Authority
                             </h4>
                             <div className="space-y-6">
                                <div>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Father Name</p>
                                   {isEditing ? (
                                      <input value={editForm.fatherName} onChange={e => handleInputChange('fatherName', e.target.value)} className="w-full font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200" />
                                   ) : (
                                      <p className="font-bold text-slate-800">{selectedStudent.fatherName || 'N/A'}</p>
                                   )}
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mother Name</p>
                                   {isEditing ? (
                                      <input value={editForm.motherName} onChange={e => handleInputChange('motherName', e.target.value)} className="w-full font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200" />
                                   ) : (
                                      <p className="font-bold text-slate-800">{selectedStudent.motherName || 'N/A'}</p>
                                   )}
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Contact (WhatsApp)</p>
                                   {isEditing ? (
                                      <input value={editForm.parentPhone} onChange={e => handleInputChange('parentPhone', e.target.value)} className="w-full font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200" />
                                   ) : (
                                      <p className="font-bold text-slate-800">{selectedStudent.parentPhone || 'N/A'}</p>
                                   )}
                                </div>
                             </div>
                          </div>
                          
                          <div className="bg-slate-900 p-8 rounded-[40px] shadow-lg text-white">
                             <h5 className="font-black text-white uppercase text-xs tracking-widest mb-4">Institutional Enrollment</h5>
                             <div className="flex justify-between items-center">
                                <div>
                                   <p className="text-[10px] text-slate-400 uppercase tracking-widest">Enrollment Date</p>
                                   <p className="font-bold">{selectedStudent.enrollmentDate}</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-[10px] text-slate-400 uppercase tracking-widest">Attendance Index</p>
                                   <p className="font-black text-emerald-400 text-xl">{selectedStudent.attendance}%</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeProfileTab === 'performance' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-10 rounded-[48px] shadow-xl border border-slate-100">
                                <h4 className="text-xl font-black mb-8 flex items-center gap-4 uppercase"><GraduationCap className="text-blue-600" /> Academic Transcript</h4>
                                <div className="space-y-4">
                                    {[
                                        { sub: 'Advanced Calculus', grade: 'A', pt: 4.0 },
                                        { sub: 'Quantum Physics', grade: 'A-', pt: 3.7 },
                                        { sub: 'English Literature', grade: 'B+', pt: 3.3 },
                                    ].map((m, i) => (
                                        <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0">
                                            <span className="font-bold text-slate-700">{m.sub}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black">{m.grade}</span>
                                                <span className="font-black text-slate-900">{m.pt}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-10 rounded-[48px] shadow-xl border border-slate-100">
                                <h4 className="text-xl font-black mb-8 flex items-center gap-4 uppercase"><Activity className="text-rose-500" /> Behavioral Pulse</h4>
                                <div className="flex items-center justify-center py-10">
                                    <div className="relative">
                                        <div className="w-40 h-40 rounded-full border-[12px] border-slate-50"></div>
                                        <div className="absolute inset-0 w-40 h-40 rounded-full border-[12px] border-emerald-500 border-t-transparent border-l-transparent -rotate-45"></div>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <p className="text-3xl font-black text-slate-900">92%</p>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Positive</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 )}

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
                             <h4 className="text-xl md:text-2xl font-black tracking-tight uppercase leading-none">{selectedStudent.fatherName || selectedStudent.motherName || 'Registry Not Synced'}</h4>
                             <button onClick={() => handleWhatsAppShortcut(selectedStudent)} className="mt-6 md:mt-8 w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                                <MessageCircleCode size={18} /> WhatsApp Guardian
                             </button>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeProfileTab === 'heritage' && (
                    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-6">
                             <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                                <History className="text-blue-600" /> Longitudinal Journey
                             </h4>
                             <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                   <div className="w-1.5 h-16 bg-slate-100 rounded-full"></div>
                                   <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase">Commencement</p>
                                      <p className="text-lg font-black text-slate-800 uppercase">{selectedStudent.enrollmentDate || 'Date Not Synced'}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-6">
                                   <div className={`w-1.5 h-16 ${selectedStudent.lifecycleStatus === StudentLifecycleStatus.ALUMNI ? 'bg-emerald-500' : 'bg-slate-100'} rounded-full`}></div>
                                   <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase">Graduation / Archive</p>
                                      <p className="text-lg font-black text-slate-800 uppercase">{selectedStudent.graduationDate || 'Ongoing Active Cycle'}</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div className="bg-slate-950 text-white p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                             <h4 className="text-xl font-black mb-8 uppercase tracking-tighter flex items-center gap-4">
                                <Award className="text-amber-400" /> Merit Legacy
                             </h4>
                             <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                                   <p className="text-3xl font-black text-amber-400">12</p>
                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Medal Nodes</p>
                                </div>
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                                   <p className="text-3xl font-black text-blue-400">#1</p>
                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Cycle Ranking</p>
                                </div>
                             </div>
                             <button onClick={() => exportPermanentRecord(selectedStudent)} className="mt-8 w-full py-5 bg-white text-slate-900 rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:bg-amber-50 transition-all flex items-center justify-center gap-3">
                                Download Heritage Dossier <FileDown size={16} />
                             </button>
                          </div>
                       </div>
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
