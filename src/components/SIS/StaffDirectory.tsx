import React, { useState } from 'react';
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
  MessageCircleCode
} from 'lucide-react';
import { StaffMember, GradeLevel, StaffCategory, AcademicDegree } from '@/types';

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
    category: StaffCategory.ACCOUNTING,
    status: 'Active',
    load: 100,
    startDate: '2020-05-12'
  },
  {
    id: 'STF004',
    name: 'Mark Thompson',
    email: 'm.thompson@edupulse.edu',
    category: StaffCategory.AUXILIARY,
    status: 'Active',
    load: 100,
    startDate: '2023-02-01',
    assignedZone: 'Maintenance & Facility'
  }
];

const StaffDirectory: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [activeCategory, setActiveCategory] = useState<StaffCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formState, setFormState] = useState<Partial<StaffMember>>({
    name: '', email: '', phone: '', category: StaffCategory.FACULTY,
    status: 'Active', load: 100, startDate: new Date().toISOString().split('T')[0]
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
        status: 'Active', load: 100, startDate: new Date().toISOString().split('T')[0]
    });
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
              status: 'Active', load: 100, startDate: new Date().toISOString().split('T')[0]
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
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Institutional Contact</p>
                       <p className="font-bold text-slate-700 flex items-center gap-2 truncate"><Mail size={16} className="text-blue-500" /> {selectedStaff.email}</p>
                       {selectedStaff.phone && (
                         <div className="flex items-center gap-3 mt-2">
                           <p className="font-bold text-slate-700 flex items-center gap-2"><Smartphone size={16} className="text-emerald-500" /> {selectedStaff.phone}</p>
                           <button 
                             onClick={() => window.open(`https://wa.me/${selectedStaff.phone?.replace(/[^0-9]/g, '')}`, '_blank')}
                             className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                             title="Chat on WhatsApp"
                           >
                             <MessageCircleCode size={14} />
                           </button>
                         </div>
                       )}
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Load</p>
                       <div className="flex items-center gap-4">
                          <h4 className="text-3xl font-black text-blue-600">{selectedStaff.load}%</h4>
                          <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                             <div className="bg-blue-600 h-full rounded-full" style={{ width: `${selectedStaff.load}%` }}></div>
                          </div>
                       </div>
                    </div>
                 </div>
                 {selectedStaff.category === StaffCategory.FACULTY && (
                    <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm">
                        <h4 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Academic Pulse</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Award className="text-amber-500" size={18} />
                                <span className="text-sm font-bold text-slate-700">{selectedStaff.academicDegree || 'Master'} Degree Registry</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {selectedStaff.subjects?.map(s => (
                                    <span key={s} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                 )}
                 <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm">
                    <h4 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Active Schedule Node</h4>
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

      {/* INITIALIZATION/EDIT MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center md:p-4">
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
              <form onSubmit={handleSaveMember} className="relative w-full h-full md:h-auto md:max-w-2xl bg-white md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-screen md:max-h-[92vh] animate-in slide-in-from-bottom-20">
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                      <div>
                          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{formState.id ? 'Modify Identity' : 'Initialize Member'}</h3>
                          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Institutional HR Protocol</p>
                      </div>
                      <button type="button" onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-100 rounded-3xl hover:bg-slate-200 transition-all"><X size={24} /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20 scrollbar-hide">
                      <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Biometric Name</label>
                          <input 
                            value={formState.name}
                            onChange={e => setFormState({...formState, name: e.target.value})}
                            required 
                            placeholder="Full Institutional Name..." 
                            className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-[20px] font-black text-slate-900 outline-none focus:border-blue-400 transition-all shadow-sm" 
                          />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Global Category</label>
                            <select 
                              value={formState.category}
                              onChange={e => setFormState({...formState, category: e.target.value as StaffCategory})}
                              className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-[20px] font-black text-slate-900 outline-none cursor-pointer focus:border-blue-400 shadow-sm"
                            >
                                {Object.values(StaffCategory).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Registry Email</label>
                            <input 
                              type="email"
                              value={formState.email}
                              onChange={e => setFormState({...formState, email: e.target.value})}
                              required 
                              placeholder="staff@edupulse.edu" 
                              className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-[20px] font-black text-slate-900 outline-none focus:border-blue-400 transition-all shadow-sm" 
                            />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Commencement Date</label>
                            <input 
                              type="date"
                              value={formState.startDate}
                              onChange={e => setFormState({...formState, startDate: e.target.value})}
                              required 
                              className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-[20px] font-black text-slate-900 outline-none focus:border-blue-400 transition-all shadow-sm" 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Target Load (%)</label>
                            <input 
                              type="number"
                              min="0" max="100"
                              value={formState.load}
                              onChange={e => setFormState({...formState, load: parseInt(e.target.value)})}
                              required 
                              className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-[20px] font-black text-slate-900 outline-none focus:border-blue-400 transition-all shadow-sm" 
                            />
                        </div>
                      </div>
                  </div>

                  <div className="p-8 bg-white border-t border-slate-100">
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