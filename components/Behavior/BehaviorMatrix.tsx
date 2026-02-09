
import React, { useState, useEffect } from 'react';
import { 
  Medal, AlertTriangle, ShieldCheck, Search, Filter, 
  TrendingUp, Award, Zap, MoreVertical, Plus, 
  ArrowUpRight, Users,
  Activity, X, CheckCircle2, Edit2, Trash2, Eye,
  Trophy, Crown, Star, ChevronRight, BarChart3, ArrowDownRight
} from 'lucide-react';
import { BehavioralIncident } from '../../types';

const INITIAL_INCIDENTS: BehavioralIncident[] = [
  { id: 'INC-001', studentId: 'STU001', studentName: 'Alex Thompson', type: 'Merit', points: 10, category: 'Academic Excellence', description: 'Exceptional synthesis of multivariable limits during peer review.', date: '2026-05-18', reporter: 'Prof. Mitchell' },
  { id: 'INC-002', studentId: 'STU002', studentName: 'Sophia Chen', type: 'Merit', points: 5, category: 'Community Service', description: 'Assisted lower primary students with library node orientation.', date: '2026-05-17', reporter: 'Ms. Clara' },
  { id: 'INC-003', studentId: 'STU003', studentName: 'Marcus Johnson', type: 'Demerit', points: -5, category: 'Uniform Violation', description: 'Unauthorized wearable active in digital labs.', date: '2026-05-16', reporter: 'Security Bot V2' },
  { id: 'INC-004', studentId: 'STU004', studentName: 'Emma Wilson', type: 'Merit', points: 15, category: 'Leadership', description: 'Organized the impromptu sustainability workshop for Grade 8.', date: '2026-05-15', reporter: 'Principal Anderson' },
];

const HOUSE_DATA = [
  { 
    id: 'pegasus', 
    name: 'House Pegasus', 
    points: 10200, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500', 
    head: 'Prof. Mitchell',
    mascot: 'Winged Horse',
    topStudents: ['Alex Thompson', 'Liam Garcia', 'Zoe Winters'],
    breakdown: { academic: 60, sports: 30, conduct: 10 }
  },
  { 
    id: 'orion', 
    name: 'House Orion', 
    points: 11200, 
    color: 'text-purple-400', 
    bg: 'bg-purple-500', 
    head: 'Dr. Sarah',
    mascot: ' The Hunter',
    topStudents: ['Sophia Chen', 'Maya Gupta', 'Leo Sterling'],
    breakdown: { academic: 45, sports: 45, conduct: 10 }
  },
  { 
    id: 'lyra', 
    name: 'House Lyra', 
    points: 10950, 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500', 
    head: 'Mr. Bond',
    mascot: 'The Harp',
    topStudents: ['Emma Wilson', 'Marcus Johnson', 'Aiden M.'],
    breakdown: { academic: 30, sports: 20, conduct: 50 }
  },
];

const TREND_METRICS = [
  { id: 1, label: 'Citizenship Index', val: '+12%', color: 'text-emerald-500', context: 'Increase in peer-to-peer mentoring.' },
  { id: 2, label: 'Attendance Sync', val: '98.2%', color: 'text-blue-500', context: 'Late arrivals reduced by 4% this week.' },
  { id: '3', label: 'Digital Conduct', val: '-2%', color: 'text-rose-500', context: 'Minor increase in unauthorized device usage.' },
];

const BehaviorMatrix: React.FC = () => {
  const [incidents, setIncidents] = useState<BehavioralIncident[]>(() => {
    const saved = localStorage.getItem('edupulse_behavior_matrix');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<BehavioralIncident | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // House & Analytics State
  const [selectedHouse, setSelectedHouse] = useState<typeof HOUSE_DATA[0] | null>(null);
  const [expandedMetric, setExpandedMetric] = useState<number | string | null>(null);

  // Form State for New Incident
  const [formData, setFormData] = useState<Partial<BehavioralIncident>>({
    type: 'Merit',
    points: 10,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    localStorage.setItem('edupulse_behavior_matrix', JSON.stringify(incidents));
  }, [incidents]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const filteredIncidents = incidents.filter(inc => 
    inc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const openDetail = (incident: BehavioralIncident) => {
    setSelectedIncident(incident);
    setIsDetailModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm("Are you sure you want to permanently delete this behavioral record?")) {
      setIncidents(prev => prev.filter(i => i.id !== id));
      setIsDetailModalOpen(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncident: BehavioralIncident = {
      id: `INC-${Date.now()}`,
      studentId: formData.studentId || 'STU-UNKNOWN',
      studentName: formData.studentName || 'Unknown Student',
      type: formData.type as 'Merit' | 'Demerit',
      points: formData.type === 'Demerit' ? -(Math.abs(formData.points || 0)) : Math.abs(formData.points || 0),
      category: formData.category || 'General',
      description: formData.description || '',
      date: formData.date || new Date().toISOString().split('T')[0],
      reporter: 'Current User'
    };
    
    setIncidents([newIncident, ...incidents]);
    setIsRegisterModalOpen(false);
    setFormData({ type: 'Merit', points: 10, date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom duration-1000 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Merit Matrix</h2>
          <p className="text-slate-500 font-bold italic uppercase text-[10px] tracking-[0.5em] mt-3 flex items-center gap-3">
             <ShieldCheck size={18} className="text-blue-600" /> Behavioral Integrity Protocol 2026
          </p>
        </div>
        <button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="w-full lg:w-auto bg-slate-900 text-white px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl hover:bg-emerald-600 transition-all active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Register Incident
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* MAIN LIST SECTION */}
        <div className="xl:col-span-2 space-y-10">
          <div className="glass-card rounded-[64px] overflow-visible bg-white shadow-2xl border-none relative z-10">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 bg-slate-50/50 rounded-t-[64px]">
               <div className="relative flex-1 group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                 <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student identities, categories, or incident logs..." 
                  className="w-full pl-16 pr-6 py-5 bg-white border-none rounded-[28px] font-bold shadow-inner focus:ring-[12px] focus:ring-emerald-100/50 transition-all text-slate-700 placeholder:text-slate-300" 
                 />
               </div>
               <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-[24px] shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer hover:bg-slate-50 transition-all">
                  <Filter size={16} /> Filters
               </div>
            </div>
            
            <div className="divide-y divide-slate-100">
               {filteredIncidents.length === 0 ? (
                 <div className="p-20 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No incidents found in registry.</p>
                 </div>
               ) : (
                 filteredIncidents.map(inc => (
                   <div key={inc.id} className="p-10 hover:bg-blue-50/20 transition-all group flex flex-col md:flex-row items-start justify-between gap-8 relative">
                      <div className="flex items-start gap-8 flex-1 cursor-pointer" onClick={() => openDetail(inc)}>
                         <div className={`p-6 rounded-[32px] shadow-lg transition-transform group-hover:scale-110 flex-shrink-0 ${inc.type === 'Merit' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                            {inc.type === 'Merit' ? <Award size={32} /> : <AlertTriangle size={32} />}
                         </div>
                         <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-4 mb-2">
                               <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none group-hover:text-blue-600 transition-colors">{inc.studentName}</h4>
                               <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${inc.type === 'Merit' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                  {inc.points > 0 ? `+${inc.points}` : inc.points} Points
                               </span>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                               <Users size={12} /> {inc.category} • {inc.date}
                            </p>
                            <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100 text-sm font-bold text-slate-600 italic leading-relaxed group-hover:bg-white group-hover:shadow-sm transition-all">
                               "{inc.description}"
                            </div>
                         </div>
                      </div>
                      
                      <div className="text-right flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-0 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-start">
                         <div className="flex items-center gap-2 md:mb-6">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${inc.reporter}`} className="w-6 h-6 rounded-full border border-slate-200" alt="" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{inc.reporter.split(' ')[0]}</p>
                         </div>
                         
                         <div className="relative">
                            <button 
                              onClick={(e) => handleMenuClick(e, inc.id)}
                              className={`p-3 rounded-xl transition-all ${activeMenuId === inc.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'}`}
                            >
                               <MoreVertical size={20}/>
                            </button>
                            
                            {activeMenuId === inc.id && (
                               <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 origin-top-right">
                                  <button onClick={() => openDetail(inc)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all text-left">
                                     <Eye size={16} /> View Dossier
                                  </button>
                                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all text-left">
                                     <Edit2 size={16} /> Edit Record
                                  </button>
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  <button onClick={(e) => handleDelete(inc.id, e)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all text-left">
                                     <Trash2 size={16} /> Delete Entry
                                  </button>
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
          </div>
        </div>

        {/* INTERACTIVE SIDEBAR */}
        <div className="space-y-10">
           {/* TIER ALPHA BOARD - NOW CLICKABLE */}
           <div className="glass-card p-10 rounded-[64px] bg-slate-950 text-white shadow-2xl relative overflow-hidden group neural-glow h-fit border-none">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
              <h4 className="text-2xl font-black mb-12 flex items-center gap-5 uppercase tracking-tighter leading-none relative z-10">
                 <div className="p-4 bg-white/10 rounded-[22px] backdrop-blur-3xl shadow-inner border border-white/10"><TrendingUp size={28} className="text-blue-400" /></div>
                 Tier Alpha Board
              </h4>
              <div className="space-y-4 relative z-10">
                 {HOUSE_DATA.map((h, i) => (
                   <button 
                    key={h.id} 
                    onClick={() => setSelectedHouse(h)}
                    className="w-full flex items-center justify-between p-6 bg-white/5 rounded-[32px] border border-white/5 hover:bg-white/10 hover:scale-[1.02] transition-all group/item text-left"
                   >
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-white/50 border border-white/10 text-xs group-hover/item:text-white group-hover/item:bg-blue-600 transition-all">#{i+1}</div>
                         <div>
                            <p className="text-base font-black tracking-tight flex items-center gap-2">
                               {h.name} {i===0 && <Crown size={14} className="text-amber-400" />}
                            </p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Click for Dossier</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`text-2xl font-black tracking-tighter ${h.color}`}>{h.points.toLocaleString()}</p>
                         <ChevronRight size={16} className="ml-auto text-slate-600 group-hover/item:text-white transition-colors" />
                      </div>
                   </button>
                 ))}
              </div>
              <button className="w-full mt-12 py-6 bg-white text-slate-900 rounded-[32px] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:bg-blue-50 transition-all active:scale-95 relative z-10">
                 Generate Global Report
              </button>
           </div>

           {/* GLOBAL TRENDS - EXPANDABLE METRICS */}
           <div className="glass-card p-10 rounded-[56px] bg-white shadow-xl border-none">
              <h4 className="font-black text-slate-900 uppercase tracking-[0.4em] text-[11px] mb-10 flex items-center gap-5">
                 <Activity size={20} className="text-blue-600" /> Global Trends
              </h4>
              <div className="space-y-4">
                 {TREND_METRICS.map((t) => (
                    <div 
                      key={t.id} 
                      onClick={() => setExpandedMetric(expandedMetric === t.id ? null : t.id)}
                      className={`cursor-pointer transition-all rounded-[24px] border ${expandedMetric === t.id ? 'bg-slate-50 border-slate-200 p-5' : 'bg-transparent border-transparent p-0 border-b border-slate-50 pb-4 last:border-0'}`}
                    >
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors flex items-center gap-2">
                             {t.label} {expandedMetric === t.id && <ChevronRight size={12} className="rotate-90" />}
                          </span>
                          <span className={`text-sm font-black ${t.color}`}>{t.val}</span>
                       </div>
                       {expandedMetric === t.id && (
                          <div className="mt-3 pt-3 border-t border-slate-200 animate-in slide-in-from-top-2">
                             <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">"{t.context}"</p>
                             <button className="mt-3 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline">View Analysis</button>
                          </div>
                       )}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* HOUSE DOSSIER MODAL */}
      {selectedHouse && (
         <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedHouse(null)}></div>
            <div className="relative w-full max-w-2xl bg-slate-950 rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col border border-white/10 text-white">
               
               <div className={`p-8 ${selectedHouse.bg} relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHouse(null);
                    }} 
                    className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all hover:rotate-90 z-20 cursor-pointer shadow-lg"
                  >
                    <X size={20}/>
                  </button>
                  
                  <div className="relative z-10 flex items-center gap-6">
                     <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                        <Trophy size={40} className={selectedHouse.color.replace('text-', 'text-')} /> 
                     </div>
                     <div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-1">{selectedHouse.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80">{selectedHouse.mascot} Division</p>
                     </div>
                  </div>
               </div>

               <div className="p-8 space-y-8 bg-slate-900">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Score</p>
                        <p className="text-3xl font-black">{selectedHouse.points.toLocaleString()}</p>
                     </div>
                     <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Faculty Lead</p>
                        <p className="text-lg font-bold truncate">{selectedHouse.head}</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2"><Star size={12}/> Top Performers</h5>
                     <div className="grid grid-cols-1 gap-2">
                        {selectedHouse.topStudents.map((stu, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-sm font-bold pl-2">{stu}</span>
                            <span className="text-[9px] font-black bg-white/10 px-2 py-1 rounded-lg text-amber-400 border border-white/5">MVP</span>
                            </div>
                        ))}
                     </div>
                  </div>

                  <div>
                     <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><BarChart3 size={12}/> Point Distribution</h5>
                     <div className="flex h-4 rounded-full overflow-hidden w-full bg-white/5 border border-white/5">
                        <div className="bg-blue-500 h-full" style={{ width: `${selectedHouse.breakdown.academic}%` }} title="Academic"></div>
                        <div className="bg-emerald-500 h-full" style={{ width: `${selectedHouse.breakdown.sports}%` }} title="Sports"></div>
                        <div className="bg-purple-500 h-full" style={{ width: `${selectedHouse.breakdown.conduct}%` }} title="Conduct"></div>
                     </div>
                     <div className="flex justify-between mt-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Academic</span>
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Sports</span>
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Conduct</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* REGISTER INCIDENT MODAL (Same as before) */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsRegisterModalOpen(false)}></div>
           <form onSubmit={handleRegister} className="relative w-full max-w-2xl bg-white rounded-[56px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Log Behavioral Event</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Institutional Integrity Record</p>
                 </div>
                 <button type="button" onClick={() => setIsRegisterModalOpen(false)} className="p-4 bg-slate-100 rounded-3xl hover:bg-slate-200 transition-all"><X size={24}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide bg-slate-50/20">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Student Identity</label>
                    <input 
                      required 
                      value={formData.studentName || ''}
                      onChange={e => setFormData({...formData, studentName: e.target.value})}
                      placeholder="e.g. Alex Thompson..." 
                      className="w-full px-8 py-5 bg-white border-2 border-slate-100 rounded-[32px] font-bold text-xl text-slate-900 outline-none focus:border-blue-400 transition-all shadow-sm placeholder:text-slate-300" 
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Incident Type</label>
                       <div className="flex gap-2 p-1 bg-white border-2 border-slate-100 rounded-[28px]">
                          {['Merit', 'Demerit'].map(type => (
                             <button
                                key={type}
                                type="button"
                                onClick={() => setFormData({...formData, type: type as any})}
                                className={`flex-1 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest transition-all ${
                                   formData.type === type 
                                     ? (type === 'Merit' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-rose-500 text-white shadow-lg') 
                                     : 'text-slate-400 hover:bg-slate-50'
                                }`}
                             >
                                {type}
                             </button>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Points Impact</label>
                       <input 
                         type="number" 
                         value={formData.points}
                         onChange={e => setFormData({...formData, points: parseInt(e.target.value)})}
                         className="w-full px-8 py-5 bg-white border-2 border-slate-100 rounded-[32px] font-bold text-xl text-slate-900 outline-none focus:border-blue-400 transition-all shadow-sm" 
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Contextual Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-8 py-5 bg-white border-2 border-slate-100 rounded-[32px] font-bold text-lg text-slate-900 outline-none focus:border-blue-400 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                       <option value="">Select Category...</option>
                       <option>Academic Excellence</option>
                       <option>Community Service</option>
                       <option>Leadership</option>
                       <option>Conduct Violation</option>
                       <option>Uniform Violation</option>
                       <option>Attendance</option>
                    </select>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Description / Evidence</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Detailed account of the behavior..." 
                      className="w-full h-32 px-8 py-6 bg-white border-2 border-slate-100 rounded-[32px] font-bold text-base text-slate-900 outline-none focus:border-blue-400 transition-all shadow-sm resize-none placeholder:text-slate-300" 
                    />
                 </div>
              </div>

              <div className="p-10 border-t border-slate-100 bg-white">
                 <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-4">
                    Commit To Registry <CheckCircle2 size={18} />
                 </button>
              </div>
           </form>
        </div>
      )}

      {/* DETAIL DOSSIER MODAL */}
      {isDetailModalOpen && selectedIncident && (
         <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsDetailModalOpen(false)}></div>
            <div className="relative w-full max-w-3xl bg-white rounded-[56px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col border border-white/20">
               <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${selectedIncident.type === 'Merit' ? 'from-emerald-500 to-teal-800' : 'from-rose-500 to-purple-900'}`}></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                  <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"><X size={24}/></button>
                  <div className="absolute bottom-8 left-10 text-white">
                     <div className="flex items-center gap-3 mb-2">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${selectedIncident.type === 'Merit' ? 'bg-emerald-500' : 'bg-rose-500'}`}>{selectedIncident.type} Record</span>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{selectedIncident.date}</span>
                     </div>
                     <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">{selectedIncident.studentName}</h3>
                  </div>
               </div>
               
               <div className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category Node</p>
                        <p className="text-lg font-black text-slate-900">{selectedIncident.category}</p>
                     </div>
                     <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Points Value</p>
                        <p className={`text-3xl font-black ${selectedIncident.type === 'Merit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {selectedIncident.points > 0 ? '+' : ''}{selectedIncident.points}
                        </p>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-4">Event Narrative</h5>
                     <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                        <p className="text-base font-bold text-slate-700 italic leading-relaxed">"{selectedIncident.description}"</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs border border-slate-200">{selectedIncident.reporter.charAt(0)}</div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized By</p>
                           <p className="text-xs font-bold text-slate-900 uppercase">{selectedIncident.reporter}</p>
                        </div>
                     </div>
                     <button onClick={() => handleDelete(selectedIncident.id)} className="px-8 py-4 border-2 border-slate-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 transition-all flex items-center gap-2">
                        <Trash2 size={16} /> Delete Record
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default BehaviorMatrix;
