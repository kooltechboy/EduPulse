import React from 'react';
import { Heart, CreditCard, GraduationCap, Bell, ChevronRight, MessageCircle, Layers, Target, CheckCircle2, TrendingUp, Clock, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const academicData = [
  { month: 'Sep', gpa: 3.4 },
  { month: 'Oct', gpa: 3.5 },
  { month: 'Nov', gpa: 3.8 },
  { month: 'Dec', gpa: 3.7 },
  { month: 'Jan', gpa: 3.9 },
];

const ParentView: React.FC = () => {
  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 px-2 md:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 px-1">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Observer Hub</h2>
          <p className="text-slate-500 font-bold italic mt-2 uppercase text-[9px] md:text-[10px] tracking-[0.4em] flex items-center justify-center sm:justify-start gap-3">
             <GraduationCap className="text-blue-500" size={16} /> Alex Thompson • Monitoring Node 2026
          </p>
        </div>
        <button className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl transition-all text-blue-600 group">
          <MessageCircle size={24} className="md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        <div className="lg:col-span-2 space-y-8 md:space-y-10">
          {/* Curriculum Monitor Snapshot */}
          <div className="glass-card p-8 md:p-10 rounded-[40px] md:rounded-[56px] bg-slate-900 text-white shadow-2xl border-none relative overflow-hidden group instructional-glow">
             <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
             <div className="flex justify-between items-center mb-8 md:mb-10 relative z-10">
                <h3 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-4 uppercase">
                   <div className="p-3 bg-white/10 text-blue-400 rounded-2xl backdrop-blur-md shadow-inner"><Layers size={20} className="md:w-6 md:h-6" /></div>
                   Curriculum Sync
                </h3>
                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-xl">Phase 2 Cycle</span>
             </div>
             <div className="space-y-6 md:space-y-8 relative z-10">
                <div className="space-y-4">
                   <div className="flex justify-between text-[9px] font-black text-blue-300 uppercase tracking-widest">
                      <span>Roadmap Progression</span>
                      <span>68% (Optimal)</span>
                   </div>
                   <div className="w-full bg-white/5 h-2.5 md:h-3 rounded-full overflow-hidden shadow-inner p-0.5">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 animate-glow-pulse" style={{ width: '68%' }}></div>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <div className="p-6 md:p-8 bg-white/5 rounded-[32px] md:rounded-[40px] border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                      <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Clock size={12} /> Today's Active Node</p>
                      <p className="text-base md:text-lg font-black text-blue-100 leading-snug">Calculus: Proofing Multivariable Limits</p>
                      <div className="mt-4 flex items-center gap-2 md:gap-3 text-emerald-400 text-[9px] font-black uppercase">
                         <CheckCircle2 size={14} className="md:w-4 md:h-4" /> Session Verified
                      </div>
                   </div>
                   <div className="p-6 md:p-8 bg-white/5 rounded-[32px] md:rounded-[40px] border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                      <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Target size={12} /> Target Milestone</p>
                      <p className="text-base md:text-lg font-black text-amber-100 leading-snug">Phase 3: Quantum Logic Evaluation</p>
                      <div className="mt-4 flex items-center gap-2 md:gap-3 text-amber-400 text-[9px] font-black uppercase">
                         <Activity size={14} className="md:w-4 md:h-4" /> Next Sprint: June 1
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="glass-card p-8 md:p-10 rounded-[40px] md:rounded-[56px] bg-white shadow-xl border-none">
            <div className="flex justify-between items-center mb-8 md:mb-10">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4 uppercase">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner"><TrendingUp size={20} className="md:w-6 md:h-6" /></div>
                Learning Velocity
              </h3>
              <span className="text-[8px] md:text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 md:px-4 py-1.5 md:py-2 rounded-full uppercase tracking-widest border border-emerald-100">+0.4 Delta</span>
            </div>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={academicData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                  <YAxis domain={[3, 4]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '16px' }} />
                  <Line type="monotone" dataKey="gpa" stroke="#2563eb" strokeWidth={5} dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8 md:space-y-10">
          <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-white shadow-xl border-none group">
            <h4 className="font-black text-slate-900 text-lg mb-8 flex items-center gap-4 tracking-tighter uppercase">
              <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl group-hover:rotate-12 transition-transform shadow-sm"><Heart size={24} /></div>
              Faculty Insights
            </h4>
            <div className="space-y-4 md:space-y-6">
              {[
                { teacher: 'Prof. Mitchell', subject: 'Advanced Math', text: 'Alex has shown remarkable improvement in multivariable logic.', date: '2d ago' },
                { teacher: 'Dr. Sarah', subject: 'AP Physics', text: 'Excellent participation in the quantum lab session.', date: '1w ago' }
              ].map((note, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-[24px] md:rounded-[32px] border border-slate-100 relative group transition-all hover:bg-white hover:shadow-2xl">
                  <p className="text-[8px] md:text-[9px] font-black text-blue-600 mb-2 uppercase tracking-widest">{note.subject}</p>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed mb-6 font-bold italic">"{note.text}"</p>
                  <div className="flex justify-between items-center text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    <span>{note.teacher}</span>
                    <span>{note.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 md:py-5 bg-slate-900 text-white rounded-[24px] md:rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">Full Academic Log</button>
          </div>

          <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] border-amber-100 bg-amber-50 shadow-xl group">
              <h4 className="font-black text-slate-900 mb-6 flex items-center gap-4 tracking-tighter uppercase">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform"><CreditCard size={24} /></div>
                Fiscal Hub
              </h4>
              <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-2">$1,200.00</p>
              <p className="text-[9px] md:text-[10px] text-slate-500 mb-8 font-black uppercase tracking-widest">Next Deposit: June 15, 2026</p>
              <button className="w-full bg-slate-900 text-white py-4 md:py-5 rounded-[24px] md:rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-3">
                Secure Terminal <ChevronRight size={18} />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParentView;