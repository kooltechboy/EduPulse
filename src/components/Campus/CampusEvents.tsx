import React, { useState, useEffect } from 'react';
import { 
  Calendar, CalendarDays, Plus, Search, Filter, History, 
  MapPin, Users, Globe, Clock, ChevronRight, Star, X, 
  CheckCircle2, Sparkles, ShieldCheck, Target, Layers,
  RefreshCw, CheckCircle, ArrowRight, ShieldAlert,
  Fingerprint, MessageSquare, AlertCircle,
  Activity, Zap, Download, Share2, Eye, CalendarCheck,
  Edit3, Trash2, LayoutGrid
} from 'lucide-react';
import { SchoolEvent, GradeLevel } from '@/types';

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
            ? { ...ev, ...formData } as SchoolEvent 
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
      }, 1200);
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
    
    // Simulate a secure handshake
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
    <div className="space-y-10 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-10">
      {/* HEADER NODE */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-1">
        <div className="space-y-1">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Institutional Pulse</h2>
          <p className="text-slate-500 font-black italic uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
            <CalendarDays size={14} className="text-blue-600" /> Integrated Campus Calendar Hub
          </p>
        </div>
        <button 
          onClick={handleOpenSchedule}
          className="bg-slate-950 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all flex items-center gap-4 active:scale-95 group relative overflow-hidden"
        >
          <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" /> 
          <span>Schedule Event Node</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3 space-y-10">
          {/* SEARCH NODE */}
          <div className="relative group">
             <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-[40px] pointer-events-none group-focus-within:bg-blue-500/10 transition-all"></div>
             <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" size={24} />
             <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search global campus events, narratives, or protocol IDs..." 
              className="w-full pl-20 pr-8 py-6 bg-white border border-slate-200 rounded-[32px] shadow-xl text-lg font-black placeholder:text-slate-300 outline-none focus:ring-[12px] focus:ring-blue-100/50 transition-all relative z-10" 
             />
          </div>

          {/* EVENTS GRID: REDESIGNED FOR MAXIMUM READABILITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                onClick={(e) => handleOpenProtocol(event, e)}
                className="glass-card p-0 rounded-[48px] bg-white border border-slate-200 shadow-xl hover:shadow-2xl hover:shadow-blue-50 hover:border-blue-400 transition-all group relative overflow-hidden flex flex-col justify-between h-full min-h-[440px] cursor-pointer active:scale-[0.98]"
              >
                 <div className="p-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex flex-col items-center p-5 bg-slate-950 text-white rounded-[28px] min-w-[90px] shadow-2xl transform group-hover:rotate-1 transition-transform">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-4xl font-black leading-none mt-1">{event.date.split('-')[2]}</span>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex gap-2">
                             <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                               event.scope === 'Global' ? 'bg-blue-600 text-white border-blue-600' : 'bg-indigo-600 text-white border-indigo-600'
                             }`}>
                               {event.scope}
                             </span>
                             <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                {getEventIcon(event.type)}
                             </div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.type} Node</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-5">
                       <h4 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter leading-tight group-hover:text-blue-600 transition-colors uppercase">{event.title}</h4>
                       <p className="text-sm text-slate-600 font-bold leading-relaxed line-clamp-4 italic border-l-4 border-slate-100 pl-6 py-2">
                         "{event.description}"
                       </p>
                    </div>
                    
                    <div className="space-y-6 mt-10 pt-10 border-t border-slate-100">
                       <div className="flex flex-wrap gap-8">
                          <div className="flex items-center gap-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                             <MapPin size={18} className="text-blue-500" /> Institutional Square
                          </div>
                          <div className="flex items-center gap-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                             <Users size={18} className="text-indigo-500" /> {event.targetLevels?.length ? `${event.targetLevels.length} Levels` : 'Global Access'}
                          </div>
                       </div>
                       <button 
                         onClick={(e) => handleOpenProtocol(event, e)}
                         className="w-full py-6 bg-slate-50 text-slate-900 rounded-[28px] font-black text-[11px] uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all flex items-center justify-center gap-5 group/btn shadow-inner border border-slate-100 active:scale-95"
                       >
                           {isProcessingProtocol === event.id ? (
                             <RefreshCw size={18} className="animate-spin text-blue-600" />
                           ) : (
                             <>Node Protocol Registry <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" /></>
                           )}
                       </button>
                    </div>
                 </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
               <div className="col-span-full py-48 text-center glass-card rounded-[80px] bg-white border-dashed border-2 border-slate-200 shadow-2xl">
                  <CalendarDays size={80} className="mx-auto text-slate-100 mb-8" />
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Node Search Failed</h3>
                  <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs mt-6 italic">No active institutional nodes synchronized for current query.</p>
               </div>
            )}
          </div>
        </div>

        {/* SIDEBAR HUB */}
        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[64px] bg-slate-950 text-white shadow-2xl relative overflow-hidden group h-fit border-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform duration-[5s] group-hover:scale-125"></div>
              <div className="relative z-10">
                 <h4 className="text-xl font-black mb-12 flex items-center gap-5 uppercase tracking-tighter"><Star className="text-amber-400" size={24} /> Strategic Hub</h4>
                 <div className="space-y-10">
                    {[
                      { title: 'Term 3 Finals', date: 'June 18', type: 'Exam' },
                      { title: 'Founders Day', date: 'June 25', type: 'Holiday' },
                      { title: 'Faculty Week', date: 'July 01', type: 'Work' }
                    ].map((d, i) => (
                      <div key={i} className="flex gap-6 group/item cursor-default">
                         <div className="w-1.5 h-14 rounded-full bg-white/10 group-hover/item:bg-blue-500 transition-colors"></div>
                         <div>
                            <p className="text-lg font-black text-white group-hover/item:text-blue-400 transition-colors leading-none mb-2 uppercase tracking-tight">{d.title}</p>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                               <Clock size={14} /> {d.date} • {d.type}
                            </p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-14 py-6 bg-white text-slate-950 rounded-[32px] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-50 transition-all shadow-xl active:scale-95">Download PDF Ledger</button>
              </div>
           </div>
           
           <div className="glass-card p-10 rounded-[56px] bg-white shadow-2xl border-none">
              <h4 className="font-black text-slate-900 uppercase tracking-[0.4em] text-[11px] mb-12 flex items-center gap-5">
                 <AlertCircle size={22} className="text-indigo-600" /> Operational Metrics
              </h4>
              <div className="space-y-8">
                 {[
                   { label: 'Events Registered', val: events.length, color: 'text-blue-600' },
                   { label: 'Conflict Index', val: 'Minimal', color: 'text-indigo-600' },
                   { label: 'Institutional Sync', val: '98%', color: 'text-emerald-600' }
                 ].map((t, i) => (
                    <div key={i} className="flex justify-between items-center py-5 border-b border-slate-50 last:border-0">
                       <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{t.label}</span>
                       <span className={`text-base font-black ${t.color}`}>{t.val}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* EVENT DETAIL DOSSIER MODAL - REDESIGNED FOR CLARITY AND FLOW */}
      {isDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-[16px] animate-in fade-in duration-500" onClick={() => setIsDetailModalOpen(false)}></div>
           <div className="relative w-full max-w-4xl bg-white rounded-[56px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[94vh] border border-white/20">
              
              {/* MODAL HEADER: FIXED OVERLAP AND CLUTTER */}
              <div className="p-10 md:p-14 bg-slate-950 text-white relative overflow-hidden border-b border-white/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
                <div className="flex items-start justify-between relative z-10">
                   <div className="flex items-center gap-8">
                      <div className="p-6 bg-blue-600 rounded-[32px] shadow-[0_0_40px_rgba(37,99,235,0.4)] text-white">
                         {getEventIcon(selectedEvent.type)}
                      </div>
                      <div className="space-y-4">
                         <div className="flex flex-wrap items-center gap-4">
                            <span className="text-[9px] font-black bg-blue-500/20 text-blue-400 uppercase tracking-[0.3em] border border-blue-500/30 px-4 py-1.5 rounded-full">{selectedEvent.scope} Node Scope</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border border-white/10 px-4 py-1.5 rounded-full">{selectedEvent.type} • Protocol ID: {selectedEvent.id}</span>
                         </div>
                         <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] max-w-2xl">{selectedEvent.title}</h3>
                      </div>
                   </div>
                   <button onClick={() => setIsDetailModalOpen(false)} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-rose-600 hover:border-rose-600 transition-all active:scale-90 group">
                      <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                   </button>
                </div>
              </div>

              {/* MODAL BODY: STRUCTURED GRID FOR VISIBILITY */}
              <div className="flex-1 overflow-y-auto p-10 md:p-14 space-y-12 bg-slate-50/20 scrollbar-hide">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* OPERATIONAL TIMING NODE */}
                    <div className="bg-white p-10 rounded-[44px] border border-slate-100 shadow-xl space-y-8 group hover:border-blue-200 transition-colors">
                       <div className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                         <Clock size={20} className="text-blue-500" /> Operational Timing
                       </div>
                       <div className="space-y-8">
                          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Scheduled Date Hub</p>
                             <p className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
                               {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                             </p>
                          </div>
                          <div className="flex items-center gap-5 px-4">
                             <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]"></div>
                             <p className="text-sm font-black text-slate-700 uppercase tracking-tight flex items-center gap-3">
                               <MapPin size={18} className="text-rose-500" /> Main Institutional Square Hub
                             </p>
                          </div>
                       </div>
                    </div>

                    {/* TARGETING PROFILE NODE */}
                    <div className="bg-white p-10 rounded-[44px] border border-slate-100 shadow-xl space-y-8 group hover:border-indigo-200 transition-colors">
                       <div className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                         <Target size={20} className="text-indigo-500" /> Targeting Profile
                       </div>
                       <div className="space-y-6">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Access Permissions</p>
                          <div className="flex flex-wrap gap-3">
                             {selectedEvent.targetLevels?.map(lvl => (
                               <span key={lvl} className="px-5 py-2 bg-indigo-50 text-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">{lvl}</span>
                             )) || <span className="px-5 py-2 bg-blue-50 text-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">Global Campus Access Enabled</span>}
                          </div>
                       </div>
                       <div className="pt-8 border-t border-slate-100">
                          <div className="flex justify-between items-end mb-3">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Integrity Index</span>
                             <span className="text-[12px] font-black text-emerald-600">96.4% Verified</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                             <div className="bg-emerald-500 h-full w-[96.4%] rounded-full animate-glow-pulse shadow-[0_0_10px_#10b981]"></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* INSTITUTIONAL NARRATIVE NODE */}
                 <div className="space-y-6">
                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] px-6 flex items-center gap-4">
                       <MessageSquare size={20} className="text-blue-500" /> Institutional Narrative
                    </h5>
                    <div className="p-12 bg-white rounded-[56px] border border-slate-100 shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 group-hover:scale-110 transition-all duration-[3s]"><LayoutGrid size={120} /></div>
                       <p className="text-xl md:text-2xl text-slate-700 leading-[1.6] font-bold italic selection:bg-blue-100 relative z-10">
                          "{selectedEvent.description}"
                       </p>
                    </div>
                 </div>

                 {/* HANDSHAKE STATUS BAR */}
                 <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-[4s]"><ShieldCheck size={100} className="text-blue-400" /></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                       <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md shadow-inner text-blue-400">
                          <Activity size={48} className="animate-pulse" />
                       </div>
                       <div className="text-center md:text-left">
                          <h4 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">Node Handshake Synchronized</h4>
                          <p className="text-[11px] text-slate-400 uppercase tracking-[0.3em] font-bold">Encrypted with Digital Campus Ledger & Parent Notification Protocols.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* MODAL FOOTER: REFINED FLOW ACTIONS */}
              <div className="p-8 md:p-12 bg-white border-t border-slate-100 flex flex-wrap md:flex-nowrap gap-6 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.03)]">
                 <button onClick={() => handleDeleteEvent(selectedEvent.id)} className="flex-1 py-6 bg-rose-50 text-rose-600 rounded-[28px] font-black text-[11px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 border border-rose-100 shadow-sm">
                    <Trash2 size={20} /> Decommission
                 </button>
                 <button onClick={() => handleEditTrigger(selectedEvent)} className="flex-1 py-6 bg-slate-50 text-slate-600 rounded-[28px] font-black text-[11px] uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 border border-slate-200 shadow-sm">
                    <Edit3 size={20} /> Edit Node
                 </button>
                 <button onClick={() => setIsDetailModalOpen(false)} className="flex-[2.5] py-6 bg-slate-950 text-white rounded-[28px] font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-5 active:scale-95 group">
                    Acknowledge Node Protocol <CheckCircle2 size={24} className="text-blue-400 group-hover:text-white transition-colors" />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* SCHEDULE/MODIFY NODE MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-[24px] animate-in fade-in duration-500" onClick={() => setIsScheduleModalOpen(false)}></div>
           
           {isSuccess ? (
             <div className="relative w-full max-w-lg bg-white rounded-[64px] p-16 text-center shadow-2xl animate-in zoom-in-95 duration-500 border border-emerald-100">
                <div className="w-24 h-24 bg-emerald-50 rounded-[40px] mx-auto flex items-center justify-center mb-8 shadow-inner">
                   <CheckCircle2 size={56} className="text-emerald-500 animate-in bounce-in duration-1000" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">Protocol Finalized</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.5em]">Institutional Hub Sync Complete</p>
             </div>
           ) : (
             <form onSubmit={handleScheduleEvent} className="relative w-full max-w-4xl bg-white rounded-[64px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-24 duration-1000 flex flex-col h-full max-h-[92vh] border border-white/20">
                
                <div className="p-10 md:p-14 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-30 shadow-sm">
                   <div className="flex items-center gap-8">
                      <div className="p-6 bg-blue-600 text-white rounded-[32px] shadow-2xl"><CalendarDays size={32} /></div>
                      <div>
                         <h3 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">{isEditing ? 'Modify Identity Node' : 'Initialize Schedule Node'}</h3>
                         <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 flex items-center gap-4">
                           Global Institutional Control Matrix
                         </p>
                      </div>
                   </div>
                   <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="p-5 bg-slate-100 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90 group shadow-sm">
                      <X size={32} className="group-hover:rotate-90 transition-transform duration-500" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 md:p-14 space-y-14 scrollbar-hide bg-slate-50/20">
                   {/* IDENTITY SECTION */}
                   <div className="space-y-10">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-4 px-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_#2563eb]"></div> Identity Configuration
                      </h4>
                      <div className="space-y-5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Functional Event Title</label>
                          <input 
                            required 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. ANNUAL STRATEGIC SYMBIOSIS" 
                            className="w-full px-10 py-7 bg-white border-2 border-slate-100 rounded-[40px] font-black text-2xl md:text-3xl outline-none focus:border-blue-400 transition-all shadow-inner uppercase tracking-tight placeholder:text-slate-100" 
                          />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Operational Date</label>
                            <input 
                              type="date" 
                              required 
                              value={formData.date}
                              className="w-full px-10 py-7 bg-white border-2 border-slate-100 rounded-[40px] font-black text-xl outline-none focus:border-blue-400 shadow-sm" 
                              onChange={(e) => setFormData({...formData, date: e.target.value})}
                            />
                         </div>
                         <div className="space-y-5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Classification Tier</label>
                            <select 
                              required
                              value={formData.type}
                              className="w-full px-10 py-7 bg-white border-2 border-slate-100 rounded-[40px] font-black text-xl outline-none cursor-pointer focus:border-blue-400 appearance-none shadow-sm uppercase"
                              onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                            >
                               <option value="Academic">Academic Protocol</option>
                               <option value="Sports">Athletic Directive</option>
                               <option value="Arts">Creative Manifest</option>
                               <option value="Community">Community Node</option>
                               <option value="Holiday">Institutional Holiday</option>
                            </select>
                         </div>
                      </div>
                   </div>

                   {/* TARGETING MATRIX */}
                   <div className="space-y-10">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-4 px-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_8px_#4f46e5]"></div> Targeting Matrix
                      </h4>
                      <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-2xl space-y-10">
                         <div className="grid grid-cols-2 gap-6">
                            {['Global', 'Tier-Specific'].map(s => (
                               <button 
                                  key={s} 
                                  type="button"
                                  onClick={() => setFormData({...formData, scope: s as any})}
                                  className={`flex items-center justify-center py-7 rounded-[32px] font-black text-[11px] uppercase tracking-[0.3em] transition-all border-4 gap-5 ${formData.scope === s ? 'bg-slate-950 border-slate-950 text-white shadow-2xl scale-[1.03]' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                               >
                                  {s === 'Global' ? <Globe size={24}/> : <Target size={24}/>}
                                  <span>{s} Perspective</span>
                               </button>
                            ))}
                         </div>
                         {formData.scope === 'Tier-Specific' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in slide-in-from-top-6 duration-700">
                               {Object.values(GradeLevel).map(level => (
                                  <button 
                                     key={level} 
                                     type="button"
                                     onClick={() => handleToggleLevel(level)}
                                     className={`p-6 rounded-[28px] text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center justify-between shadow-sm ${formData.targetLevels?.includes(level) ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' : 'bg-slate-50 border-slate-50 text-slate-400 hover:bg-white hover:border-indigo-100'}`}
                                  >
                                     {level}
                                     {formData.targetLevels?.includes(level) ? <CheckCircle size={20}/> : <Plus size={20}/>}
                                  </button>
                               ))}
                            </div>
                         )}
                      </div>
                   </div>

                   {/* NARRATIVE SECTION */}
                   <div className="space-y-6">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] px-6">Institutional Narrative Context</label>
                      <textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Detail event logistics, institutional impact, and neural synchronization targets..." 
                        className="w-full h-56 px-10 py-10 bg-white border-2 border-slate-100 rounded-[48px] font-bold text-slate-800 text-xl leading-relaxed outline-none focus:border-emerald-400 transition-all shadow-inner resize-none placeholder:text-slate-100 italic" 
                      />
                   </div>
                </div>

                <div className="p-10 md:p-14 bg-white border-t border-slate-100 flex gap-8 z-30 shadow-inner">
                   <button 
                    type="button" 
                    onClick={() => setIsScheduleModalOpen(false)} 
                    className="flex-1 py-7 bg-slate-50 text-slate-400 font-black rounded-[32px] text-[11px] uppercase tracking-[0.4em] hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-95 shadow-sm"
                   >
                      Decline Registry
                   </button>
                   <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-[2.5] py-7 bg-blue-600 text-white font-black rounded-[32px] text-[12px] uppercase tracking-[0.5em] shadow-[0_24px_50px_-10px_rgba(37,99,235,0.4)] hover:bg-slate-950 transition-all duration-1000 flex items-center justify-center gap-8 active:scale-95 disabled:opacity-50"
                   >
                     {isSubmitting ? (
                       <><RefreshCw className="animate-spin" size={28} /> Synchronizing Node...</>
                     ) : (
                       <>{isEditing ? 'Commit Update' : 'Finalize Schedule'} <Sparkles size={28} className="text-blue-300" /></>
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