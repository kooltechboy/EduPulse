import React, { useState } from 'react';
import { 
  Medal, AlertTriangle, ShieldCheck, Search, Filter, 
  TrendingUp, Award, Zap, MoreVertical, Plus, 
  ArrowUpRight, Heart, Star, LayoutGrid, Clock, Users,
  Activity
} from 'lucide-react';
import { BehavioralIncident } from '../../types';

const INITIAL_INCIDENTS: BehavioralIncident[] = [
  { id: 'INC-001', studentId: 'STU001', studentName: 'Alex Thompson', type: 'Merit', points: 10, category: 'Academic Excellence', description: 'Exceptional synthesis of multivariable limits during peer review.', date: '2026-05-18', reporter: 'Prof. Mitchell' },
  { id: 'INC-002', studentId: 'STU002', studentName: 'Sophia Chen', type: 'Merit', points: 5, category: 'Community Service', description: 'Assisted lower primary students with library node orientation.', date: '2026-05-17', reporter: 'Ms. Clara' },
  { id: 'INC-003', studentId: 'STU003', studentName: 'Marcus Johnson', type: 'Demerit', points: -5, category: 'Uniform Violation', description: 'Unauthorized wearable active in digital labs.', date: '2026-05-16', reporter: 'Security Bot V2' },
];

const BehaviorMatrix: React.FC = () => {
  const [incidents] = useState<BehavioralIncident[]>(INITIAL_INCIDENTS);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom duration-1000">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Merit Matrix</h2>
          <p className="text-slate-500 font-black italic uppercase text-[10px] tracking-[0.5em] mt-3">Behavioral Integrity & Recognition Protocol</p>
        </div>
        <button className="w-full lg:w-auto bg-slate-900 text-white px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl hover:bg-emerald-600 transition-all">
          <Plus size={20} /> Register Incident
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="glass-card rounded-[64px] overflow-hidden bg-white shadow-2xl border-none">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 bg-slate-50/50">
               <div className="relative flex-1 group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                 <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search identities or incidents..." 
                  className="w-full pl-16 pr-6 py-5 bg-white border-none rounded-[28px] font-bold shadow-inner focus:ring-[12px] focus:ring-emerald-100/50 transition-all" 
                 />
               </div>
            </div>
            <div className="divide-y divide-slate-100">
               {incidents.map(inc => (
                 <div key={inc.id} className="p-10 hover:bg-blue-50/20 transition-all group flex items-start justify-between gap-8">
                    <div className="flex items-start gap-8">
                       <div className={`p-6 rounded-[32px] shadow-lg transition-transform group-hover:scale-110 ${inc.type === 'Merit' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                          {inc.type === 'Merit' ? <Award size={32} /> : <AlertTriangle size={32} />}
                       </div>
                       <div>
                          <div className="flex items-center gap-4 mb-2">
                             <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none group-hover:text-blue-600 transition-colors">{inc.studentName}</h4>
                             <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${inc.type === 'Merit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {inc.points > 0 ? `+${inc.points}` : inc.points} Points
                             </span>
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{inc.category} • Reported by {inc.reporter}</p>
                          <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 text-sm font-bold text-slate-600 italic leading-relaxed max-w-xl">
                             "{inc.description}"
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inc.date}</p>
                       <button className="mt-6 p-3 text-slate-200 hover:text-blue-600 transition-all"><MoreVertical size={20}/></button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
           <div className="glass-card p-12 rounded-[64px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group neural-glow">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
              <h4 className="text-2xl font-black mb-12 flex items-center gap-5 uppercase tracking-tighter leading-none">
                 <div className="p-4 bg-white/10 rounded-[22px] backdrop-blur-3xl shadow-inner"><TrendingUp size={28} className="text-blue-400" /></div>
                 Tier Alpha Board
              </h4>
              <div className="space-y-8">
                 {[
                   { name: 'House Pegasus', val: 12840, color: 'blue' },
                   { name: 'House Orion', val: 11200, color: 'purple' },
                   { name: 'House Lyra', val: 10950, color: 'emerald' },
                 ].map((h, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-[32px] border border-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-blue-400 border border-white/10">#{i+1}</div>
                         <div>
                            <p className="text-base font-black tracking-tight">{h.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Pulse Registry</p>
                         </div>
                      </div>
                      <p className="text-2xl font-black tracking-tighter text-blue-400">{h.val.toLocaleString()}</p>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-12 py-6 bg-white text-slate-900 rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-xl hover:bg-blue-50 transition-all active:scale-95">
                 Visual Analytics Dashboard
              </button>
           </div>

           <div className="glass-card p-10 rounded-[56px] bg-white shadow-xl border-none">
              <h4 className="font-black text-slate-900 uppercase tracking-[0.4em] text-[11px] mb-10 flex items-center gap-5">
                 <Activity size={20} className="text-blue-600" /> Global Trends
              </h4>
              <div className="space-y-6">
                 {[
                   { label: 'Citizenship Index', val: '+12%', color: 'text-emerald-500' },
                   { label: 'Attendance Sync', val: '98.2%', color: 'text-blue-500' },
                   { label: 'Digital Lab Conduct', val: 'Optimal', color: 'text-indigo-500' },
                 ].map((t, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50">
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.label}</span>
                       <span className={`text-sm font-black ${t.color}`}>{t.val}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BehaviorMatrix;
