
import React, { useState } from 'react';
import { Calendar, CalendarDays, Plus, Search, Filter, History, MapPin, Users, Globe, Clock, ChevronRight, Star } from 'lucide-react';
import { SchoolEvent, GradeLevel } from '../../types';

const MOCK_EVENTS: SchoolEvent[] = [
  { id: 'EV-01', title: 'Global Academic Symposium', date: '2026-06-12', type: 'Academic', scope: 'Global', description: 'Institutional gathering for 2026 milestones.' },
  { id: 'EV-02', title: 'Senior High Sports Invitational', date: '2026-05-30', type: 'Sports', scope: 'Tier-Specific', targetLevels: [GradeLevel.SENIOR_HIGH], description: 'Inter-campus athletics meet.' },
  { id: 'EV-03', title: 'Early Years Play Day', date: '2026-06-01', type: 'Academic', scope: 'Tier-Specific', targetLevels: [GradeLevel.KINDERGARTEN, GradeLevel.NURSERY], description: 'Play-based learning orientation.' },
];

const CampusEvents: React.FC = () => {
  const [events] = useState<SchoolEvent[]>(MOCK_EVENTS);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Institutional Pulse</h2>
          <p className="text-slate-500 font-bold italic mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
            <CalendarDays size={18} className="text-blue-500" /> Integrated Campus Calendar 2026
          </p>
        </div>
        <button className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-rose-600 transition-all flex items-center gap-4">
          <Plus size={20} /> Schedule Event
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map(event => (
              <div key={event.id} className="glass-card p-10 rounded-[56px] bg-white border-none shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
                 <div className="flex justify-between items-start mb-10">
                    <div className="flex flex-col items-center p-4 bg-slate-900 text-white rounded-[24px] min-w-[80px] shadow-2xl">
                       <span className="text-[10px] font-black uppercase tracking-widest">{event.date.split('-')[1]}</span>
                       <span className="text-3xl font-black leading-none mt-1">{event.date.split('-')[2]}</span>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${event.scope === 'Global' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                      {event.scope} Event
                    </span>
                 </div>
                 <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-4 group-hover:text-blue-600 transition-colors">{event.title}</h4>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">{event.description}</p>
                 
                 <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <MapPin size={14} className="text-blue-500" /> Main Auditorium
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <Users size={14} className="text-indigo-500" /> {event.targetLevels?.join(', ') || 'All Campus Users'}
                    </div>
                 </div>
                 <button className="w-full mt-10 py-4 bg-slate-50 text-slate-900 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3 group/btn">
                    Details <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[56px] bg-white border-none shadow-2xl">
              <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tighter"><Star className="text-amber-500" /> Essential Dates</h4>
              <div className="space-y-8">
                 {[
                   { title: 'Term 3 Finals Begin', date: 'June 18, 2026', type: 'Exam' },
                   { title: 'Founders Day Holiday', date: 'June 25, 2026', type: 'Holiday' },
                   { title: 'Faculty Strategy Week', date: 'July 01, 2026', type: 'Workshop' }
                 ].map((d, i) => (
                   <div key={i} className="flex gap-6 group cursor-default">
                      <div className="w-1.5 h-12 rounded-full bg-slate-100 group-hover:bg-blue-600 transition-colors"></div>
                      <div>
                         <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-none mb-1">{d.title}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.date} • {d.type}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampusEvents;
