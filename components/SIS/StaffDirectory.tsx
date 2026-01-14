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
  Clock
} from 'lucide-react';
import { StaffMember, GradeLevel, StaffCategory, AcademicDegree } from '../../types';

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
];

const StaffDirectory: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [activeView, setActiveView] = useState<StaffCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const emptyMember: Partial<StaffMember> = {
    name: '', email: '', phone: '', category: StaffCategory.FACULTY,
    status: 'Active', load: 0, startDate: new Date().toISOString().split('T')[0]
  };

  const [newMember, setNewMember] = useState<Partial<StaffMember>>(emptyMember);

  const filteredStaff = staff.filter(s => {
    const matchesCategory = activeView === 'All' || s.category === activeView;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: StaffCategory) => {
    switch (category) {
      case StaffCategory.FACULTY: return <BookOpen size={18} />;
      case StaffCategory.PSYCHOLOGIST: return <Stethoscope size={18} />;
      case StaffCategory.ACCOUNTING: return <Calculator size={18} />;
      case StaffCategory.HR: return <Users2 size={18} />;
      case StaffCategory.CLERICAL: return <Briefcase size={18} />;
      case StaffCategory.AUXILIARY: return <Wrench size={18} />;
      default: return <Smartphone size={18} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Staff Directory</h2>
          <p className="text-slate-500 font-bold italic mt-1 uppercase text-[10px] tracking-widest">Global Campus Faculty & Operations Hub</p>
        </div>
        <button onClick={() => { setNewMember(emptyMember); setIsEditing(false); setIsModalOpen(true); }} className="w-full lg:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:translate-y-[-2px] transition-all">
          <UserPlus size={18} /> Initialize Member
        </button>
      </div>

      <div className="glass-card rounded-[32px] md:rounded-[40px] overflow-hidden border-none shadow-2xl bg-white/40">
        <div className="p-6 md:p-8 bg-white/40 border-b border-slate-100/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search faculty by name or domain..." className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-blue-100 text-sm font-bold shadow-inner" />
          </div>
          <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-[24px] text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* MOBILE CARDS */}
        <div className="block xl:hidden p-4 space-y-4">
          {filteredStaff.map(s => (
            <div key={s.id} onClick={() => { setSelectedStaff(s); setIsDossierOpen(true); }} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} className="w-14 h-14 rounded-2xl border-2 border-slate-100 shadow-md" alt="" />
                 <div className="flex-1">
                    <p className="font-black text-slate-900 text-lg leading-tight">{s.name}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.id} • {s.category}</p>
                 </div>
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">{getCategoryIcon(s.category)}</div>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-700 uppercase">{s.status}</span>
                 </div>
                 <ChevronRight size={18} className="text-slate-200" />
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
                <th className="px-6 py-6">Category</th>
                <th className="px-6 py-6">Domain Index</th>
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
                  <td className="px-6 py-6"><span className="text-xs font-black text-slate-700 uppercase tracking-widest">{s.category}</span></td>
                  <td className="px-6 py-6"><span className="text-xs font-bold text-slate-500">{s.department || s.assignedZone || 'Global Node'}</span></td>
                  <td className="px-10 py-6 text-right"><ChevronRight size={20} className="text-slate-200 group-hover:text-blue-600 transition-all ml-auto" /></td>
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
                          <span className="px-4 py-1.5 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">{selectedStaff.category}</span>
                          <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest">ID: {selectedStaff.id}</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 scrollbar-hide">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Institutional Contact</p>
                       <p className="font-bold text-slate-700 flex items-center gap-2"><Mail size={16} className="text-blue-500" /> {selectedStaff.email}</p>
                       <p className="font-bold text-slate-700 flex items-center gap-2 mt-2"><Smartphone size={16} className="text-emerald-500" /> {selectedStaff.phone}</p>
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
                      <p className="text-slate-400 italic text-sm text-center py-6">No schedule entries registered.</p>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StaffDirectory;