
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  BookOpen, 
  Filter,
  X,
  Mail,
  Trophy,
  Phone,
  Stethoscope,
  Calculator,
  Users2,
  Briefcase,
  Wrench,
  Smartphone,
  ShieldAlert,
  MapPin,
  LifeBuoy,
  Edit2,
  Trash2,
  UserPlus,
  MessageCircle,
  GraduationCap,
  Globe,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  HeartPulse,
  Save,
  Activity,
  MessageCircleCode,
  User,
  Hash,
  Languages,
  Keyboard,
  HardHat
} from 'lucide-react';
import { StaffMember, GradeLevel, StaffCategory, AcademicDegree } from '../../types.ts';

const INITIAL_STAFF: StaffMember[] = [
  { 
    id: 'STF001', 
    name: 'Professor Mitchell', 
    email: 'mitchell@edupulse.edu', 
    phone: '+1 (555) 012-3456',
    address: '123 Academic Way, North District',
    emergencyContact: 'Jane Mitchell (+1 555-900-1122)',
    category: StaffCategory.FACULTY,
    subjects: ['Advanced Calculus', 'Pure Mathematics'], 
    gradeLevels: [GradeLevel.SENIOR_HIGH, GradeLevel.JUNIOR_HIGH], 
    assignedClasses: ['Math-10A', 'Math-12B'],
    status: 'Active', 
    load: 85,
    languages: ['English', 'Spanish'],
    startDate: '2021-08-15',
    academicDegree: 'PhD',
    certifications: ['Advanced Pedagogy', 'STEM Certification'],
    schedule: [
      { day: 'Mon', time: '08:00', subject: 'Calculus', room: 'A-201', class: '12-B' },
      { day: 'Wed', time: '10:30', subject: 'Algebra', room: 'A-201', class: '10-A' }
    ]
  },
  { 
    id: 'STF002', 
    name: 'Dr. Linda Vance', 
    email: 'linda.v@edupulse.edu', 
    phone: '+1 (555) 998-1122',
    address: '45 Wellness Cir, Apt 302',
    emergencyContact: 'Mark Vance (+1 555-888-7766)',
    category: StaffCategory.PSYCHOLOGIST,
    department: 'Mental Health & Wellness',
    licenseNumber: 'PSY-99201-X',
    status: 'Active', 
    load: 60,
    languages: ['English', 'French'],
    startDate: '2022-01-10',
    academicDegree: 'PhD',
    certifications: ['Clinical Psychology Board']
  },
  {
    id: 'STF003',
    name: 'Sarah Jenkins',
    email: 's.jenkins@edupulse.edu',
    phone: '+1 (555) 300-4499',
    category: StaffCategory.ACCOUNTING,
    status: 'Active',
    load: 100,
    startDate: '2020-05-12',
    department: 'Fiscal Operations',
    certifications: ['CPA Certified', 'Fiscal Audit L2']
  },
  {
    id: 'STF004',
    name: 'Mark Thompson',
    email: 'm.thompson@edupulse.edu',
    phone: '+1 (555) 882-1100',
    category: StaffCategory.AUXILIARY,
    status: 'Active',
    load: 100,
    startDate: '2023-02-01',
    assignedZone: 'Maintenance & Facility',
    certifications: ['Safety Inspector L1', 'Electrical Certification']
  }
];

const StaffDirectory: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('edupulse_staff_registry');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  useEffect(() => {
    localStorage.setItem('edupulse_staff_registry', JSON.stringify(staff));
  }, [staff]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [activeCategory, setActiveCategory] = useState<StaffCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formState, setFormState] = useState<Partial<StaffMember>>({
    name: '', email: '', phone: '', category: StaffCategory.FACULTY,
    status: 'Active', load: 100, startDate: new Date().toISOString().split('T')[0],
    subjects: [], gradeLevels: []
  });

  const filteredStaff = staff.filter(s => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: StaffCategory) => {
    switch (category) {
      case StaffCategory.FACULTY: return <BookOpen size={18} />;
      case StaffCategory.PSYCHOLOGIST: return <HeartPulse size={18} />;
      case StaffCategory.ACCOUNTING: return <Calculator size={18} />;
      case StaffCategory.HR: return <Users2 size={18} />;
      case StaffCategory.CLERICAL: return <Briefcase size={18} />;
      case StaffCategory.AUXILIARY: return <Wrench size={18} />;
      default: return <Activity size={18} />;
    }
  };

  const handleOpenEdit = (member: StaffMember) => {
    setFormState(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this staff member from the registry?')) {
      setStaff(prev => prev.filter(s => s.id !== id));
      setIsDossierOpen(false);
    }
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!formState.id;
    if (isEdit) {
      setStaff(prev => prev.map(s => s.id === formState.id ? (formState as StaffMember) : s));
    } else {
      const newM = { ...formState, id: `STF-${Date.now()}` } as StaffMember;
      setStaff(prev => [newM, ...prev]);
    }
    setIsModalOpen(false);
    setFormState({
        name: '', email: '', phone: '', category: StaffCategory.FACULTY,
        status: 'Active', load: 100, startDate: new Date().toISOString().split('T')[0],
        subjects: [], gradeLevels: []
    });
  };

  const handleArrayInput = (field: keyof StaffMember, value: string) => {
    const arr = value.split(',').map(s => s.trim());
    setFormState(prev => ({ ...prev, [field]: arr }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Staff Hub</h2>
          <p className="text-slate-500 font-bold italic mt-1 uppercase text-[10px] tracking-widest">Global Campus Human Capital Registry 2026</p>
        </div>
        <button 
          onClick={() => { 
            setFormState({
              name: '', email: '', phone: '', category: StaffCategory.FACULTY,
              status: 'Active', load: 100, startDate: new Date().toISOString().split('T')[0],
              subjects: [], gradeLevels: []
            }); 
            setIsModalOpen(true); 
          }} 
          className="w-full lg:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:translate-y-[-2px] transition-all"
        >
          <UserPlus size={18} /> Initialize Member
        </button>
      </div>

      <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide py-2">
          <button 
            onClick={() => setActiveCategory('All')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === 'All' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
          >
            All Staff
          </button>
          {Object.values(StaffCategory).map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
            >
              {getCategoryIcon(cat)}
              {cat}
            </button>
          ))}
      </div>

      <div className="glass-card rounded-[32px] md:rounded-[40px] overflow-hidden border-none shadow-2xl bg-white/40">
        <div className="p-6 md:p-8 bg-white/40 border-b border-slate-100/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search faculty by name or domain..." className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-blue-100 text-sm font-bold shadow-inner" />
          </div>
          <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-[24px] text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
            <Filter size={18} /> Detailed Filters
          </button>
        </div>

        {/* MOBILE CARDS */}
        <div className="block xl:hidden p-4 space-y-4">
          {filteredStaff.map(s => (
            <div key={s.id} onClick={() => { setSelectedStaff(s); setIsDossierOpen(true); }} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 active:scale-[0.98] transition-all group">
              <div className="flex items-center gap-4">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} className="w-14 h-14 rounded-2xl border-2 border-slate-100 shadow-md group-hover:scale-105 transition-transform" alt="" />
                 <div className="flex-1">
                    <p className="font-black text-slate-900 text-lg leading-tight">{s.name}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.id}</p>
                 </div>
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">{getCategoryIcon(s.category)}</div>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{s.category}</span>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(s); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteMember(s.id); }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                    <ChevronRight size={18} className="text-slate-200" />
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] border-b border-slate-100">
              <tr>
                <th className="px-10 py-6">Professional Profile</th>
                <th className="px-6 py-6">Classification</th>
                <th className="px-6 py-6">Status Node</th>
                <th className="px-10 py-6 text-right">Dossier Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((s) => (
                <tr key={s.id} onClick={() => { setSelectedStaff(s); setIsDossierOpen(true); }} className="hover:bg-blue-50/20 transition-all group cursor-pointer">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} className="w-14 h-14 rounded-[20px] border-2 border-white shadow-xl group-hover:scale-110 transition-transform" alt="" />
                      <div>
                        <p className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-black tracking-widest">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">{getCategoryIcon(s.category)}</div>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{s.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                        <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(s); }} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"><Edit2 size={18} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteMember(s.id); }} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all"><Trash2 size={18} /></button>
                        <ChevronRight size={20} className="text-slate-200 group-hover:text-blue-600 transition-all" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOSSIER MODAL - FULL SHEET ON MOBILE */}
      {isDossierOpen && selectedStaff && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center md:p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl" onClick={() => setIsDossierOpen(false)}></div>
           <div className="relative w-full h-full md:h-auto md:max-w-4xl bg-white md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-screen md:max-h-[92vh] animate-in zoom-in-95">
              <div className="p-8 md:p-12 bg-slate-900 text-white relative">
                 <button onClick={() => setIsDossierOpen(false)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={24} /></button>
                 <div className="flex flex-col md:flex-row items-center gap-8">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStaff.name}`} className="w-32 h-32 rounded-[40px] border-4 border-white/20 shadow-2xl" alt="" />
                    <div className="text-center md:text-left">
                       <h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">{selectedStaff.name}</h3>
                       <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          <span className="px-4 py-1.5 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">{getCategoryIcon(selectedStaff.category)} {selectedStaff.category}</span>
                          <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">ID: {selectedStaff.id}</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 scrollbar-hide">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin size={14}/> Location Registry</p>
                       <p className="font-bold text-slate-700 mb-2">{selectedStaff.address || 'Address Not Synced'}</p>
                       <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
                          <Mail size={16} className="text-blue-500" />
                          <p className="font-bold text-sm text-slate-700">{selectedStaff.email}</p>
                       </div>
                       {selectedStaff.phone && (
                         <div className="flex items-center gap-3 mt-2">
                           <Smartphone size={16} className="text-emerald-500" />
                           <p className="font-bold text-sm text-slate-700">{selectedStaff.phone}</p>
                           <button 
                             onClick={() => window.open(`https://wa.me/${selectedStaff.phone?.replace(/[^0-9]/g, '')}`, '_blank')}
                             className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all ml-auto"
                             title="Chat on WhatsApp"
                           >
                             <MessageCircleCode size={14} />
                           </button>
                         </div>
                       )}
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Briefcase size={14}/> Professional Details</p>
                       <div className="space-y-3">
                          <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-slate-500">Service Load</span>
                             <span className="text-xs font-black text-blue-600">{selectedStaff.load}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-blue-600 h-full rounded-full" style={{ width: `${selectedStaff.load}%` }}></div>
                          </div>
                          {selectedStaff.department && (
                             <div className="mt-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</span>
                                <p className="text-sm font-bold text-slate-800">{selectedStaff.department}</p>
                             </div>
                          )}
                          {selectedStaff.licenseNumber && (
                             <div className="mt-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">License ID</span>
                                <p className="text-sm font-bold text-slate-800 font-mono">{selectedStaff.licenseNumber}</p>
                             </div>
                          )}
                          {selectedStaff.assignedZone && (
                             <div className="mt-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Zone</span>
                                <p className="text-sm font-bold text-slate-800">{selectedStaff.assignedZone}</p>
                             </div>
                          )}
                          {selectedStaff.certifications && selectedStaff.certifications.length > 0 && (
                             <div className="mt-4 pt-4 border-t border-slate-200">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Certifications</span>
                                <div className="flex flex-wrap gap-2">
                                   {selectedStaff.certifications.map(c => (
                                      <span key={c} className="px-2 py-1 bg-white rounded-md text-[9px] font-bold text-slate-600 border border-slate-200">{c}</span>
                                   ))}
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
                 
                 {/* DYNAMIC CATEGORY FIELDS */}
                 {selectedStaff.category === StaffCategory.FACULTY && (
                    <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm">
                        <h4 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-3"><GraduationCap className="text-indigo-500"/> Academic Pulse</h4>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                                    <Award className="text-amber-500" size={16} />
                                    <span className="text-xs font-black text-amber-700 uppercase">{selectedStaff.academicDegree || 'Master'} Degree</span>
                                </div>
                                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                                    <Languages className="text-indigo-500" size={16} />
                                    <span className="text-xs font-black text-indigo-700 uppercase">{selectedStaff.languages?.join(', ') || 'English'}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject Mastery</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedStaff.subjects?.map(s => (
                                        <span key={s} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                 )}

                 <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm">
                    <h4 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight flex items-center gap-3"><Clock className="text-emerald-500"/> Active Schedule Node</h4>
                    {selectedStaff.schedule && selectedStaff.schedule.length > 0 ? (
                      <div className="space-y-3">
                        {selectedStaff.schedule.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                             <div>
                                <p className="font-black text-slate-800 text-sm">{item.subject || item.task}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.time} • {item.room}</p>
                             </div>
                             <span className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-blue-600 shadow-sm">{item.day}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic text-sm text-center py-6">No schedule entries registered for this cycle.</p>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* INITIALIZATION/EDIT MODAL - COMPREHENSIVE FORM */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center md:p-4">
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
              <form onSubmit={handleSaveMember} className="relative w-full h-full md:h-auto md:max-w-4xl bg-white md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-screen md:max-h-[92vh] animate-in slide-in-from-bottom-20">
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                      <div>
                          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{formState.id ? 'Modify Identity' : 'Initialize Member'}</h3>
                          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Institutional HR Protocol</p>
                      </div>
                      <button type="button" onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-100 rounded-3xl hover:bg-slate-200 transition-all"><X size={24} /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20 scrollbar-hide">
                      
                      {/* SECTION 1: PERSONAL IDENTITY */}
                      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><User size={16} className="text-blue-500"/> Core Biometrics</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Full Legal Name</label>
                                  <input 
                                    value={formState.name}
                                    onChange={e => setFormState({...formState, name: e.target.value})}
                                    required 
                                    placeholder="e.g. Dr. Jonathan Smith" 
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 transition-all" 
                                  />
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Registry Email</label>
                                  <input 
                                    type="email"
                                    value={formState.email}
                                    onChange={e => setFormState({...formState, email: e.target.value})}
                                    required 
                                    placeholder="staff@edupulse.edu" 
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 transition-all" 
                                  />
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Phone Contact</label>
                                  <input 
                                    value={formState.phone || ''}
                                    onChange={e => setFormState({...formState, phone: e.target.value})}
                                    placeholder="+1..." 
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 transition-all" 
                                  />
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Physical Address</label>
                                  <input 
                                    value={formState.address || ''}
                                    onChange={e => setFormState({...formState, address: e.target.value})}
                                    placeholder="Full residential address..." 
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 transition-all" 
                                  />
                              </div>
                          </div>
                      </div>

                      {/* SECTION 2: PROFESSIONAL NEXUS */}
                      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><Briefcase size={16} className="text-indigo-500"/> Professional Nexus</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Classification</label>
                                  <select 
                                    value={formState.category}
                                    onChange={e => setFormState({...formState, category: e.target.value as StaffCategory})}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none cursor-pointer focus:border-indigo-400 appearance-none"
                                  >
                                      {Object.values(StaffCategory).map(cat => (
                                          <option key={cat} value={cat}>{cat}</option>
                                      ))}
                                  </select>
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Start Date</label>
                                  <input 
                                    type="date"
                                    value={formState.startDate}
                                    onChange={e => setFormState({...formState, startDate: e.target.value})}
                                    required 
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-indigo-400" 
                                  />
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Target Load (%)</label>
                                  <input 
                                    type="number"
                                    min="0" max="100"
                                    value={formState.load}
                                    onChange={e => setFormState({...formState, load: parseInt(e.target.value)})}
                                    required 
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-indigo-400" 
                                  />
                              </div>
                          </div>
                      </div>

                      {/* SECTION 3: DYNAMIC CATEGORY FIELDS */}
                      {formState.category === StaffCategory.FACULTY && (
                          <div className="bg-indigo-50/50 p-8 rounded-[32px] border border-indigo-100 animate-in fade-in">
                              <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><GraduationCap size={16}/> Academic Specifics</h4>
                              <div className="grid grid-cols-1 gap-6">
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Instructional Subjects (Comma Separated)</label>
                                      <input 
                                        value={formState.subjects?.join(', ') || ''}
                                        onChange={e => handleArrayInput('subjects', e.target.value)}
                                        placeholder="Math, Physics, Chemistry..." 
                                        className="w-full px-6 py-4 bg-white border-2 border-indigo-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-indigo-400 transition-all" 
                                      />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-3">
                                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Academic Degree</label>
                                          <select 
                                            value={formState.academicDegree || 'Bachelor'}
                                            onChange={e => setFormState({...formState, academicDegree: e.target.value as AcademicDegree})}
                                            className="w-full px-6 py-4 bg-white border-2 border-indigo-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-indigo-400 cursor-pointer" 
                                          >
                                              <option value="Bachelor">Bachelor</option>
                                              <option value="Master">Master</option>
                                              <option value="PhD">PhD</option>
                                              <option value="Diploma">Diploma</option>
                                          </select>
                                      </div>
                                      <div className="space-y-3">
                                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Languages (Comma Separated)</label>
                                          <input 
                                            value={formState.languages?.join(', ') || ''}
                                            onChange={e => handleArrayInput('languages', e.target.value)}
                                            placeholder="English, French..." 
                                            className="w-full px-6 py-4 bg-white border-2 border-indigo-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-indigo-400 transition-all" 
                                          />
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {formState.category === StaffCategory.PSYCHOLOGIST && (
                          <div className="bg-rose-50/50 p-8 rounded-[32px] border border-rose-100 animate-in fade-in">
                              <h4 className="text-[11px] font-black text-rose-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><HeartPulse size={16}/> Clinical Details</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">License Number</label>
                                      <input 
                                        value={formState.licenseNumber || ''}
                                        onChange={e => setFormState({...formState, licenseNumber: e.target.value})}
                                        placeholder="LIC-XXXX-YYYY" 
                                        className="w-full px-6 py-4 bg-white border-2 border-rose-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-rose-400 transition-all" 
                                      />
                                  </div>
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Department / Area</label>
                                      <input 
                                        value={formState.department || ''}
                                        onChange={e => setFormState({...formState, department: e.target.value})}
                                        placeholder="Counseling / Wellness..." 
                                        className="w-full px-6 py-4 bg-white border-2 border-rose-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-rose-400 transition-all" 
                                      />
                                  </div>
                              </div>
                          </div>
                      )}

                      {formState.category === StaffCategory.ACCOUNTING && (
                          <div className="bg-emerald-50/50 p-8 rounded-[32px] border border-emerald-100 animate-in fade-in">
                              <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><Calculator size={16}/> Financial Registry</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Department</label>
                                      <input 
                                        value={formState.department || ''}
                                        onChange={e => setFormState({...formState, department: e.target.value})}
                                        placeholder="e.g. Fiscal Ops, Tuition..." 
                                        className="w-full px-6 py-4 bg-white border-2 border-emerald-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-emerald-400 transition-all" 
                                      />
                                  </div>
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Certifications</label>
                                      <input 
                                        value={formState.certifications?.join(', ') || ''}
                                        onChange={e => handleArrayInput('certifications', e.target.value)}
                                        placeholder="CPA, CFA..." 
                                        className="w-full px-6 py-4 bg-white border-2 border-emerald-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-emerald-400 transition-all" 
                                      />
                                  </div>
                              </div>
                          </div>
                      )}

                      {formState.category === StaffCategory.CLERICAL && (
                          <div className="bg-blue-50/50 p-8 rounded-[32px] border border-blue-100 animate-in fade-in">
                              <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><Keyboard size={16}/> Admin Support</h4>
                              <div className="grid grid-cols-1 gap-6">
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Assigned Department</label>
                                      <input 
                                        value={formState.department || ''}
                                        onChange={e => setFormState({...formState, department: e.target.value})}
                                        placeholder="e.g. Front Office, Registrar..." 
                                        className="w-full px-6 py-4 bg-white border-2 border-blue-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 transition-all" 
                                      />
                                  </div>
                              </div>
                          </div>
                      )}

                      {formState.category === StaffCategory.AUXILIARY && (
                          <div className="bg-amber-50/50 p-8 rounded-[32px] border border-amber-100 animate-in fade-in">
                              <h4 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><HardHat size={16}/> Operations Detail</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Assigned Zone</label>
                                      <input 
                                        value={formState.assignedZone || ''}
                                        onChange={e => setFormState({...formState, assignedZone: e.target.value})}
                                        placeholder="e.g. North Wing, Maintenance..." 
                                        className="w-full px-6 py-4 bg-white border-2 border-amber-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-amber-400 transition-all" 
                                      />
                                  </div>
                                  <div className="space-y-3">
                                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Safety Certs</label>
                                      <input 
                                        value={formState.certifications?.join(', ') || ''}
                                        onChange={e => handleArrayInput('certifications', e.target.value)}
                                        placeholder="OSHA, First Aid..." 
                                        className="w-full px-6 py-4 bg-white border-2 border-amber-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-amber-400 transition-all" 
                                      />
                                  </div>
                              </div>
                          </div>
                      )}

                  </div>

                  <div className="p-8 bg-white border-t border-slate-100 shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.02)]">
                      <button type="submit" className="w-full py-6 bg-slate-900 text-white font-black rounded-[28px] uppercase tracking-[0.4em] shadow-xl hover:translate-y-[-4px] active:scale-95 transition-all flex items-center justify-center gap-4">
                         Commit to Hub <Save size={20} className="text-blue-400" />
                      </button>
                  </div>
              </form>
          </div>
      )}
    </div>
  );
};

export default StaffDirectory;
