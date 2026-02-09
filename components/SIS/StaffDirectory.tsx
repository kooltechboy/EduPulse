
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
  HardHat,
  Monitor,
  Contact
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
    subjects: [], gradeLevels: [], certifications: [], languages: []
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
        subjects: [], gradeLevels: [], certifications: [], languages: []
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
              subjects: [], gradeLevels: [], certifications: [], languages: []
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

        {/* DESKTOP TABLE */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] border-b border-slate-100">
              <tr>
                <th className="px-10 py-6">Professional Profile</th>
                <th className="px-6 py-6">Classification</th>
                <th className="px-6 py-6">Subjects / Dept</th>
                <th className="px-6 py-6">Contact</th>
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
                    {s.subjects && s.subjects.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {s.subjects.slice(0, 2).map(sub => (
                          <span key={sub} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[9px] font-bold uppercase border border-blue-100">{sub}</span>
                        ))}
                        {s.subjects.length > 2 && <span className="text-[9px] text-slate-400 font-bold self-center">+{s.subjects.length - 2}</span>}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-500">{s.department || s.assignedZone || 'General'}</span>
                    )}
                  </td>
                  <td className="px-6 py-6">
                     <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); window.open(`mailto:${s.email}`); }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                        >
                            <Mail size={18} />
                        </button>
                        {s.phone && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); window.open(`tel:${s.phone}`); }}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"
                          >
                              <Phone size={18} />
                          </button>
                        )}
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

      {/* DOSSIER MODAL - REFINED PROFILE VIEW */}
      {isDossierOpen && selectedStaff && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center md:p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl" onClick={() => setIsDossierOpen(false)}></div>
           <div className="relative w-full h-full md:h-auto md:max-w-5xl bg-white md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-screen md:max-h-[92vh] animate-in zoom-in-95">
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
              
              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 scrollbar-hide bg-slate-50/30">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* CONTACT COORDINATES */}
                    <div className="p-8 bg-white rounded-[40px] shadow-sm border border-slate-100">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                          <Contact size={16} className="text-emerald-500" /> Contact Coordinates
                       </h4>
                       <div className="space-y-6">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Node</p>
                             <div className="flex items-center gap-3">
                                <Mail size={16} className="text-slate-300" />
                                <span className="font-bold text-slate-800">{selectedStaff.email}</span>
                             </div>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mobile Uplink</p>
                             <div className="flex items-center gap-3">
                                <Phone size={16} className="text-slate-300" />
                                <span className="font-bold text-slate-800">{selectedStaff.phone || 'Not Registered'}</span>
                             </div>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Physical Address</p>
                             <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-slate-300" />
                                <span className="font-bold text-slate-800">{selectedStaff.address || 'Address Not Synced'}</span>
                             </div>
                          </div>
                          {selectedStaff.emergencyContact && (
                             <div className="pt-6 border-t border-slate-50">
                                <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Emergency Protocol</p>
                                <div className="flex items-center gap-3">
                                   <ShieldAlert size={16} className="text-rose-400" />
                                   <span className="font-bold text-slate-800">{selectedStaff.emergencyContact}</span>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>

                    {/* PROFESSIONAL DETAILS */}
                    <div className="space-y-8">
                       <div className="p-8 bg-white rounded-[40px] shadow-sm border border-slate-100">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                             <Briefcase size={16} className="text-blue-500" /> Professional Nexus
                          </h4>
                          <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500">Service Load</span>
                                <span className="text-xs font-black text-blue-600">{selectedStaff.load}%</span>
                             </div>
                             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${selectedStaff.load}%` }}></div>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Start Date</p>
                                   <p className="text-sm font-black text-slate-800">{selectedStaff.startDate || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                   <p className="text-sm font-black text-emerald-600 uppercase">{selectedStaff.status}</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* ACADEMIC REGISTRY (FACULTY ONLY) */}
                       {selectedStaff.category === StaffCategory.FACULTY && (
                          <div className="p-8 bg-indigo-900 text-white rounded-[40px] shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                             <h4 className="text-[11px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-6 flex items-center gap-3 relative z-10">
                                <GraduationCap size={16} /> Academic Registry
                             </h4>
                             <div className="space-y-6 relative z-10">
                                <div>
                                   <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-2">Subject Mastery</p>
                                   <div className="flex flex-wrap gap-2">
                                      {selectedStaff.subjects?.map(s => (
                                         <span key={s} className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-tight">{s}</span>
                                      )) || <span className="text-xs italic opacity-50">No subjects listed</span>}
                                   </div>
                                </div>
                                <div className="flex gap-4">
                                   <div>
                                      <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">Degree</p>
                                      <p className="text-sm font-bold">{selectedStaff.academicDegree || 'N/A'}</p>
                                   </div>
                                   <div>
                                      <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">Languages</p>
                                      <p className="text-sm font-bold">{selectedStaff.languages?.join(', ') || 'English'}</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
                 
                 {/* SCHEDULE NODE */}
                 <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                       <Clock size={16} className="text-amber-500" /> Active Schedule Node
                    </h4>
                    {selectedStaff.schedule && selectedStaff.schedule.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedStaff.schedule.map((item, idx) => (
                          <div key={idx} className="flex flex-col p-5 bg-slate-50 rounded-[24px] hover:bg-slate-100 transition-colors">
                             <div className="flex justify-between items-start mb-2">
                                <span className="px-3 py-1 bg-white rounded-lg text-[9px] font-black text-slate-900 shadow-sm">{item.day}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">{item.time}</span>
                             </div>
                             <p className="font-black text-slate-800 text-sm leading-tight">{item.subject || item.task}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.room} • {item.class || 'N/A'}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-slate-50 rounded-[24px] border border-dashed border-slate-200">
                         <Calendar size={24} className="mx-auto text-slate-300 mb-2" />
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No schedule entries registered.</p>
                      </div>
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
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Classification</label>
                                  <select 
                                    value={formState.category}
                                    onChange={e => setFormState({...formState, category: e.target.value as StaffCategory})}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 transition-all cursor-pointer" 
                                  >
                                      {Object.values(StaffCategory).map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                              </div>
                          </div>
                      </div>

                      {/* SECTION 2: CONTACT COORDINATES */}
                      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><Contact size={16} className="text-emerald-500"/> Contact Coordinates</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Phone Uplink</label>
                                  <input 
                                    value={formState.phone || ''}
                                    onChange={e => setFormState({...formState, phone: e.target.value})}
                                    placeholder="+1 (555)..." 
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-emerald-400 transition-all" 
                                  />
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Emergency Contact</label>
                                  <input 
                                    value={formState.emergencyContact || ''}
                                    onChange={e => setFormState({...formState, emergencyContact: e.target.value})}
                                    placeholder="Name & Phone..." 
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-emerald-400 transition-all" 
                                  />
                              </div>
                              <div className="space-y-3 md:col-span-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Physical Residency</label>
                                  <textarea 
                                    value={formState.address || ''}
                                    onChange={e => setFormState({...formState, address: e.target.value})}
                                    rows={2}
                                    placeholder="Full residential address..." 
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-emerald-400 transition-all resize-none" 
                                  />
                              </div>
                          </div>
                      </div>

                      {/* SECTION 3: PROFESSIONAL */}
                      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><Briefcase size={16} className="text-indigo-500"/> Employment Data</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Start Date</label>
                                  <input 
                                    type="date"
                                    value={formState.startDate}
                                    onChange={e => setFormState({...formState, startDate: e.target.value})}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-indigo-400 transition-all" 
                                  />
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Work Load %</label>
                                  <input 
                                    type="number"
                                    min="0" max="100"
                                    value={formState.load}
                                    onChange={e => setFormState({...formState, load: parseInt(e.target.value)})}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-indigo-400 transition-all" 
                                  />
                              </div>
                              <div className="space-y-3">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Status</label>
                                  <select 
                                    value={formState.status}
                                    onChange={e => setFormState({...formState, status: e.target.value})}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-indigo-400 transition-all cursor-pointer" 
                                  >
                                      <option>Active</option>
                                      <option>On Leave</option>
                                      <option>Sabbatical</option>
                                      <option>Terminated</option>
                                  </select>
                              </div>
                          </div>
                      </div>

                      {/* SECTION 4: FACULTY ACADEMICS (CONDITIONAL) */}
                      {formState.category === StaffCategory.FACULTY && (
                        <div className="bg-indigo-900 p-8 rounded-[32px] shadow-xl border border-indigo-800 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                            <h4 className="text-[11px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-6 flex items-center gap-3 relative z-10"><BookOpen size={16} /> Academic Registry</h4>
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest px-2">Subjects (Comma Separated)</label>
                                    <input 
                                      value={formState.subjects?.join(', ')}
                                      onChange={e => handleArrayInput('subjects', e.target.value)}
                                      placeholder="Math, Physics, ..." 
                                      className="w-full px-6 py-4 bg-indigo-950/50 border-2 border-indigo-800 rounded-[20px] font-bold text-white outline-none focus:border-blue-400 transition-all placeholder:text-indigo-400" 
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest px-2">Academic Degree</label>
                                      <select 
                                        value={formState.academicDegree}
                                        onChange={e => setFormState({...formState, academicDegree: e.target.value as AcademicDegree})}
                                        className="w-full px-6 py-4 bg-indigo-950/50 border-2 border-indigo-800 rounded-[20px] font-bold text-white outline-none focus:border-blue-400 transition-all cursor-pointer"
                                      >
                                         <option value="">Select Degree...</option>
                                         <option value="Bachelor">Bachelor</option>
                                         <option value="Master">Master</option>
                                         <option value="PhD">PhD</option>
                                         <option value="Diploma">Diploma</option>
                                      </select>
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest px-2">Languages (Comma Separated)</label>
                                      <input 
                                        value={formState.languages?.join(', ')}
                                        onChange={e => handleArrayInput('languages', e.target.value)}
                                        placeholder="English, French..." 
                                        className="w-full px-6 py-4 bg-indigo-950/50 border-2 border-indigo-800 rounded-[20px] font-bold text-white outline-none focus:border-blue-400 transition-all placeholder:text-indigo-400" 
                                      />
                                   </div>
                                </div>
                            </div>
                        </div>
                      )}
                  </div>

                  <div className="p-8 border-t border-slate-100 bg-white flex gap-6">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-6 bg-slate-100 text-slate-500 font-black rounded-[28px] text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel Entry</button>
                      <button type="submit" className="flex-[2] py-6 bg-slate-900 text-white font-black rounded-[28px] text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4">
                          <CheckCircle2 size={20} /> Commit to Registry
                      </button>
                  </div>
              </form>
          </div>
      )}
    </div>
  );
};

export default StaffDirectory;
