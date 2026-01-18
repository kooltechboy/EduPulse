import React, { useState, useEffect } from 'react';
import { 
  Calendar, CalendarDays, Plus, Search, Filter, History, 
  MapPin, Users, Globe, Clock, ChevronRight, Star, X, 
  CheckCircle2, Sparkles, ShieldCheck, Target, Layers,
  RefreshCw, CheckCircle, ArrowRight, ShieldAlert,
  Fingerprint, MessageSquare, AlertCircle,
  Activity, Zap, Download, Share2, Eye, CalendarCheck,
  Edit3, Trash2
} from 'lucide-react';
import { SchoolEvent, GradeLevel } from '../../types';

const INITIAL_EVENTS: SchoolEvent[] = [
  { id: 'EV-01', title: 'Global Academic Symposium', date: '2026-06-12', type: 'Academic', scope: 'Global', description: 'Institutional gathering for 2026 milestones and digital transformation roadmap. This session will align all faculty leads on the Phase 3 Neural Integration protocols.' },
  { id: 'EV-02', title: 'Senior High Sports Invitational', date: '2026-05-30', type: 'Sports', scope: 'Tier-Specific', targetLevels: [GradeLevel.SENIOR_HIGH], description: 'Inter-campus athletics meet and regional trials. Digital tracking nodes will be active for all sprint metrics.' },
  { id: 'EV-03', title: 'Early Years Play Day', date: '2026-06-01', type: 'Academic', scope: 'Tier-Specific', targetLevels: [GradeLevel.KINDERGARTEN, GradeLevel.NURSERY], description: 'Play-based learning orientation for incoming families. Focus on sensory integration and social-emotional node development.' },
];

const CampusEvents: React.FC = () => {
  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    const saved = localStorage.getItem('edupulse_campus_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });
  
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessingProtocol, setIsProcessingProtocol] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<SchoolEvent>>({
    title: '',
    type: 'Academic',
    scope: 'Global',
    targetLevels: [],
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    localStorage.setItem('edupulse_campus_events', JSON.stringify(events));
  }, [events]);

  const handleToggleLevel = (level: GradeLevel) => {
    const current = formData.targetLevels || [];
    if (current.includes(level)) {
      setFormData({ ...formData, targetLevels: current.filter(l => l !== level) });
    } else {
      setFormData({ ...formData, targetLevels: [...current, level] });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', type: 'Academic', scope: 'Global', targetLevels: [], date: new Date().toISOString().split('T')[0], description: '' });
    setIsEditing(false);
  };

  const handleOpenSchedule = () => {
    resetForm();
    setIsScheduleModalOpen(true);
  };

  const handleScheduleEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (isEditing && selectedEvent) {
        const updatedEvents = events.map(ev => 
          ev.id === selectedEvent.id 
            ? { ...selectedEvent, ...formData } as SchoolEvent 
            : ev
        );
        setEvents(updatedEvents);
      } else {
        const newEvent: SchoolEvent = {
          id: `EV-${Date.now()}`,
          title: formData.title || 'Untitled Event',
          date: formData.date || new Date().toISOString().split('T')[0],
          type: formData.type as any,
          scope: formData.scope as any,
          targetLevels: formData.scope === 'Tier-Specific' ? formData.targetLevels : undefined,
          description: formData.description || 'No description provided.'
        };
        setEvents([newEvent, ...events]);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsScheduleModalOpen(false);
        setIsSuccess(false);
        resetForm();
      }, 1500);
    }, 1200);
  };

  const handleDeleteEvent = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm("Are you sure you want to permanently decommission this institutional event node?")) {
      setEvents(prev => prev.filter(ev => ev.id !== id));
      setIsDetailModalOpen(false);
    }
  };

  const handleEditTrigger = (event: SchoolEvent) => {
    setFormData({
      title: event.title,
      type: event.type,
      scope: event.scope,
      targetLevels: event.targetLevels || [],
      date: event.date,
      description: event.description
    });
    setIsEditing(true);
    setIsDetailModalOpen(false);
    setIsScheduleModalOpen(true);
  };

  const handleOpenProtocol = (event: SchoolEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProcessingProtocol(event.id);
    
    setTimeout(() => {
      setSelectedEvent(event);
      setIsDetailModalOpen(true);
      setIsProcessingProtocol(null);
    }, 600);
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'Academic': return <Layers size={16} />;
      case 'Sports': return <Activity size={16} />;
      case 'Arts': return <Star size={16} />;
      case 'Holiday': return <Clock size={16} />;
      default: return <Globe size={16} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-10">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-1">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Institutional Pulse</h2>
          <p className="text-slate-500 font-bold italic mt-2 uppercase text-[9px] tracking-[0.3em] flex items-center gap-3">
            <CalendarDays size={14} className="text-blue-500" /> Integrated Campus Calendar Hub
          </p>
        </div>
        <button 
          onClick={handleOpenSchedule}
          className="bg-slate-950 text-white px-8 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95 group relative overflow-hidden"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" /> 
          <span>Schedule Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
          {/* SEARCH */}
          <div className="relative group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
             <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search global campus events..." 
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[24px] shadow-sm text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-blue-50 transition-all" 
             />
          </div>

          {/* EVENTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                onClick={(e) => handleOpenProtocol(event, e)}
                className="glass-card p-7 rounded-[40px] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group relative overflow-hidden flex flex-col justify-between h-full min-h-[380px] cursor-pointer active:scale-[0.98]"
              >
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 pointer-events-none">{getEventIcon(event.type)}</div>
                 
                 <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col items-center p-3.5 bg-slate-950 text-white rounded-[20px] min-w-[75px] shadow-lg transform group-hover:rotate-2 transition-transform">
                          <span className="text-[8px] font-black uppercase tracking-widest opacity-60">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-2xl font-black leading-none mt-1">{event.date.split('-')[2]}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`px-4 py-1.5 rounded-full text-[7px] font-black uppercase tracking-widest border ${
                            event.scope === 'Global' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                          }`}>
                            {event.scope}
                          </span>
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{event.type}</span>
                        </div>
                    </div>
                    <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-3 group-hover:text-blue-600 transition-colors uppercase">{event.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3 italic">"{event.description}"</p>
                 </div>
                 
                 <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                       <MapPin size={14} className="text-blue-500" /> Institutional Square
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                       <Users size={14} className="text-indigo-500" /> {event.targetLevels?.join(', ') || 'Global Campus Access'}
                    </div>
                    <button 
                      onClick={(e) => handleOpenProtocol(event, e)}
                      className="w-full mt-4 py-4 bg-slate-50 text-slate-900 rounded-[18px] font-black text-[9px] uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all flex items-center justify-center gap-3 group/btn shadow-sm"
                    >
                        {isProcessingProtocol === event.id ? (
                          <RefreshCw size={14} className="animate-spin text-blue-600" />
                        ) : (
                          <>Node Protocol <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
           <div className="glass-card p-8 rounded-[40px] bg-slate-950 text-white shadow-xl relative overflow-hidden group h-fit border-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-[5s] group-hover:scale-125"></div>
              <div className="relative z-10">
                 <h4 className="text-lg font-black mb-8 flex items-center gap-4 uppercase tracking-tighter"><Star className="text-amber-400" size={18} /> Strategic Hub</h4>
                 <div className="space-y-6">
                    {[
                      { title: 'Term 3 Finals', date: 'June 18', type: 'Exam' },
                      { title: 'Founders Day', date: 'June 25', type: 'Holiday' },
                      { title: 'Faculty Week', date: 'July 01', type: 'Work' }
                    ].map((d, i) => (
                      <div key={i} className="flex gap-4 group/item cursor-default">
                         <div className="w-1 h-12 rounded-full bg-white/10 group-hover/item:bg-blue-500 transition-colors"></div>
                         <div>
                            <p className="text-sm font-black text-white group-hover/item:text-blue-400 transition-colors leading-none mb-1.5 uppercase">{d.title}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                               <Clock size={10} /> {d.date} • {d.type}
                            </p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-4 bg-white text-slate-950 rounded-[18px] font-black text-[9px] uppercase tracking-[0.3em] hover:bg-blue-50 transition-all shadow-lg active:scale-95">Download PDF</button>
              </div>
           </div>
           
           <div className="glass-card p-7 rounded-[40px] bg-white shadow-md border border-slate-50">
              <h4 className="font-black text-slate-900 uppercase tracking-[0.3em] text-[9px] mb-8 flex items-center gap-3">
                 <AlertCircle size={16} className="text-indigo-600" /> Operational Metrics
              </h4>
              <div className="space-y-4">
                 {[
                   { label: 'Events Active', val: events.length, color: 'text-blue-600' },
                   { label: 'Conflict Index', val: 'Low', color: 'text-indigo-600' },
                 ].map((t, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.label}</span>
                       <span className={`text-[10px] font-black ${t.color}`}>{t.val}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* EVENT DETAIL DOSSIER MODAL */}
      {isDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-[12px] animate-in fade-in duration-500" onClick={() => setIsDetailModalOpen(false)}></div>
           <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden animate-in zoom-in-95 duration-700 flex flex-col max-h-[92vh] border border-white/20">
              
              <div className="p-8 md:p-10 bg-slate-950 text-white relative overflow-hidden border-b border-white/5">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
                <div className="flex items-start justify-between relative z-10">
                   <div className="flex items-center gap-6">
                      <div className="p-5 bg-blue-600 rounded-[24px] shadow-[0_0_30px_rgba(37,99,235,0.4)] text-white">
                         {getEventIcon(selectedEvent.type)}
                      </div>
                      <div className="space-y-2">
                         <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none truncate max-w-lg">{selectedEvent.title}</h3>
                         <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[8px] font-black bg-blue-500/20 text-blue-400 uppercase tracking-widest border border-blue-500/30 px-3 py-1 rounded-full">{selectedEvent.scope} Scope</span>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">{selectedEvent.type} Node • ID: {selectedEvent.id}</span>
                         </div>
                      </div>
                   </div>
                   <button onClick={() => setIsDetailModalOpen(false)} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-rose-600 hover:border-rose-600 transition-all active:scale-90 group">
                      <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                   </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 bg-slate-50/10 scrollbar-hide">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 group hover:border-blue-200 transition-colors">
                       <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                         <Clock size={16} className="text-blue-500" /> Operational Timing
                       </div>
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Scheduled Launch</p>
                          <p className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">
                            {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                       </div>
                       <div className="flex items-center gap-3 px-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-tight flex items-center gap-2 truncate">
                            <MapPin size={14} className="text-rose-500" /> Main Institutional Square Hub
                          </p>
                       </div>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 group hover:border-indigo-200 transition-colors">
                       <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                         <Target size={16} className="text-indigo-500" /> Targeting Profile
                       </div>
                       <div className="space-y-3">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Access Permissions</p>
                          <div className="flex flex-wrap gap-2">
                             {selectedEvent.targetLevels?.map(lvl => (
                               <span key={lvl} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-[8px] font-black uppercase tracking-widest border border-indigo-100">{lvl}</span>
                             )) || <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[8px] font-black uppercase tracking-widest border border-blue-100">Global Campus Access</span>}
                          </div>
                       </div>
                       <div className="pt-4 border-t border-slate-50">
                          <div className="flex justify-between items-end mb-2">
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sync Index</span>
                             <span className="text-[10px] font-black text-emerald-600">96% (Verified)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                             <div className="bg-emerald-500 h-full w-[96%] rounded-full animate-glow-pulse"></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4 flex items-center gap-3">
                       <MessageSquare size={16} className="text-blue-500" /> Institutional Narrative
                    </h5>
                    <div className="p-8 md:p-10 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                       <p className="text-base md:text-lg text-slate-700 leading-relaxed font-bold italic selection:bg-blue-100">"{selectedEvent.description}"</p>
                    </div>
                 </div>

                 <div className="bg-slate-900 p-8 rounded-[32px] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-[4s]"><ShieldCheck size={80} className="text-blue-400" /></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                       <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner text-blue-400">
                          <Activity size={32} className="animate-pulse" />
                       </div>
                       <div className="text-center md:text-left">
                          <h4 className="text-white font-black text-xl uppercase tracking-tighter mb-1">Protocol Handshake Active</h4>
                          <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold">Synchronized with Digital Signage & Parent Push Advisories.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* FOOTER: REFINED ACTIONS */}
              <div className="p-6 md:p-8 bg-white border-t border-slate-100 flex flex-wrap md:flex-nowrap gap-4 z-20">
                 <button onClick={() => handleDeleteEvent(selectedEvent.id)} className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 border border-rose-100">
                    <Trash2 size={16} /> Decommission
                 </button>
                 <button onClick={() => handleEditTrigger(selectedEvent)} className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 border border-slate-100">
                    <Edit3 size={16} /> Edit Node
                 </button>
                 <button onClick={() => setIsDetailModalOpen(false)} className="flex-[2] py-4 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                    Acknowledge Node Protocol <CheckCircle2 size={18} className="text-blue-400 group-hover:text-white transition-colors" />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* SCHEDULE NODE MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setIsScheduleModalOpen(false)}></div>
           
           {isSuccess ? (
             <div className="relative w-full max-w-md bg-white rounded-[48px] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500 border border-emerald-100">
                <div className="w-20 h-20 bg-emerald-50 rounded-[28px] mx-auto flex items-center justify-center mb-6 shadow-inner">
                   <CheckCircle2 size={40} className="text-emerald-500 animate-in bounce-in duration-1000" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Protocol Verified</h3>
                <p className="text-slate-400 font-bold uppercase text-[8px] tracking-[0.4em]">Institutional Hub Sync Complete</p>
             </div>
           ) : (
             <form onSubmit={handleScheduleEvent} className="relative w-full max-w-4xl bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-12 duration-700 flex flex-col h-full max-h-[90vh] border border-white/20">
                
                {/* MODAL HEADER */}
                <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-30 shadow-sm">
                   <div className="flex items-center gap-6">
                      <div className="p-5 bg-blue-600 text-white rounded-[24px] shadow-lg"><CalendarDays size={28} /></div>
                      <div>
                         <h3 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter uppercase leading-none">{isEditing ? 'Modify Node' : 'Schedule Node'}</h3>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 flex items-center gap-3">
                           Global Institutional Control Matrix
                         </p>
                      </div>
                   </div>
                   <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="p-4 bg-slate-100 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90 group">
                      <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 md:p-12 space-y-12 scrollbar-hide bg-slate-50/20">
                   {/* IDENTITY SECTION */}
                   <div className="space-y-8">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> Event Profile
                      </h4>
                      <div className="space-y-4">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4">Event Functional Title</label>
                          <input 
                            required 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. ANNUAL STEM CONVERGENCE" 
                            className="w-full px-8 py-5 bg-white border-2 border-slate-100 rounded-[28px] font-black text-xl md:text-2xl outline-none focus:border-blue-400 transition-all shadow-inner uppercase tracking-tight" 
                          />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4">Operational Date</label>
                            <input 
                              type="date" 
                              required 
                              value={formData.date}
                              className="w-full px-8 py-5 bg-white border-2 border-slate-100 rounded-[28px] font-black text-lg outline-none focus:border-blue-400 shadow-sm" 
                              onChange={(e) => setFormData({...formData, date: e.target.value})}
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4">Classification Tier</label>
                            <select 
                              required
                              value={formData.type}
                              className="w-full px-8 py-5 bg-white border-2 border-slate-100 rounded-[28px] font-black text-lg outline-none cursor-pointer focus:border-blue-400 appearance-none shadow-sm uppercase"
                              onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                            >
                               <option value="Academic">Academic Node</option>
                               <option value="Sports">Sports Node</option>
                               <option value="Arts">Creative Arts Node</option>
                               <option value="Community">Community Node</option>
                               <option value="Holiday">Holiday Node</option>
                            </select>
                         </div>
                      </div>
                   </div>

                   {/* TARGETING SECTION */}
                   <div className="space-y-8">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div> Targeting Matrix
                      </h4>
                      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
                         <div className="grid grid-cols-2 gap-4">
                            {['Global', 'Tier-Specific'].map(s => (
                               <button 
                                  key={s} 
                                  type="button"
                                  onClick={() => setFormData({...formData, scope: s as any})}
                                  className={`flex items-center justify-center py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all border-4 gap-4 ${formData.scope === s ? 'bg-slate-950 border-slate-950 text-white shadow-xl scale-[1.02]' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                               >
                                  {s === 'Global' ? <Globe size={18}/> : <Target size={18}/>}
                                  <span>{s}</span>
                               </button>
                            ))}
                         </div>
                         {formData.scope === 'Tier-Specific' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in slide-in-from-top-4 duration-500">
                               {Object.values(GradeLevel).map(level => (
                                  <button 
                                     key={level} 
                                     type="button"
                                     onClick={() => handleToggleLevel(level)}
                                     className={`p-4 rounded-[18px] text-[9px] font-black uppercase tracking-widest transition-all border-2 flex items-center justify-between ${formData.targetLevels?.includes(level) ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-50 border-slate-50 text-slate-400 hover:bg-white hover:border-indigo-100'}`}
                                  >
                                     {level}
                                     {formData.targetLevels?.includes(level) ? <CheckCircle size={16}/> : <Plus size={16}/>}
                                  </button>
                               ))}
                            </div>
                         )}
                      </div>
                   </div>

                   {/* NARRATIVE SECTION */}
                   <div className="space-y-4">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4">Event Narrative Description</label>
                      <textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Detail event logistics and institutional impact..." 
                        className="w-full h-40 px-8 py-8 bg-white border-2 border-slate-100 rounded-[32px] font-bold text-slate-800 text-lg leading-relaxed outline-none focus:border-emerald-400 transition-all shadow-inner resize-none placeholder:text-slate-100 italic" 
                      />
                   </div>
                </div>

                {/* MODAL FOOTER */}
                <div className="p-8 md:p-10 bg-white border-t border-slate-100 flex gap-6 z-30 shadow-inner">
                   <button 
                    type="button" 
                    onClick={() => setIsScheduleModalOpen(false)} 
                    className="flex-1 py-6 bg-slate-50 text-slate-400 font-black rounded-[24px] text-[10px] uppercase tracking-[0.3em] hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-95"
                   >
                      Discard
                   </button>
                   <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-[2.5] py-6 bg-blue-600 text-white font-black rounded-[24px] text-[11px] uppercase tracking-[0.4em] shadow-xl hover:bg-slate-950 transition-all duration-700 flex items-center justify-center gap-6 active:scale-95 disabled:opacity-50"
                   >
                     {isSubmitting ? (
                       <><RefreshCw className="animate-spin" size={24} /> Synchronizing Hub...</>
                     ) : (
                       <>{isEditing ? 'Update Calendar Node' : 'Commit to Calendar'} <Sparkles size={24} className="text-blue-300" /></>
                     )}
                   </button>
                </div>
             </form>
           )}
        </div>
      )}
    </div>
  );
};

export default CampusEvents;