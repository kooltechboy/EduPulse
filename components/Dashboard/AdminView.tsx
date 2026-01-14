import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, GraduationCap, ArrowUpRight, ArrowDownRight, Clock, School, LayoutGrid } from 'lucide-react';
import { CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { getCampusSummary } from '../../services/geminiService';
import { GradeLevel } from '../../types';

const data = [
  { name: 'Jan', revenue: 4000, attendance: 95 },
  { name: 'Feb', revenue: 3000, attendance: 93 },
  { name: 'Mar', revenue: 5000, attendance: 97 },
  { name: 'Apr', revenue: 4500, attendance: 96 },
  { name: 'May', revenue: 6000, attendance: 98 },
  { name: 'Jun', revenue: 5500, attendance: 95 },
];

const tierStats = [
  { tier: 'Early Childhood', levels: [GradeLevel.NURSERY, GradeLevel.PRE_SCHOOL, GradeLevel.KINDERGARTEN], students: 420, teachers: 28, color: 'blue' },
  { tier: 'Elementary', levels: [GradeLevel.ELEMENTARY], students: 512, teachers: 32, color: 'indigo' },
  { tier: 'Secondary', levels: [GradeLevel.JUNIOR_HIGH, GradeLevel.SENIOR_HIGH], students: 352, teachers: 45, color: 'purple' },
];

const AdminView: React.FC = () => {
  const [aiSummary, setAiSummary] = useState("Generating real-time institutional synthesis...");

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await getCampusSummary(data);
      setAiSummary(summary);
    };
    fetchSummary();
  }, []);

  const metrics = [
    { label: 'Total Enrolled', value: '1,284', change: 12, trend: 'up', icon: <Users className="text-blue-600" /> },
    { label: 'Avg Presence', value: '94.2%', change: 2.4, trend: 'up', icon: <Clock className="text-orange-500" /> },
    { label: 'Revenue (Q2)', value: '$42,500', change: 4.5, trend: 'up', icon: <DollarSign className="text-emerald-500" /> },
    { label: 'Academic Index', value: '8.4/10', change: 1.2, trend: 'down', icon: <GraduationCap className="text-purple-600" /> },
  ];

  return (
    <div className="space-y-8 md:space-y-10 px-2 md:px-0">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {metrics.map((m, i) => (
          <div key={i} className="glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] group hover:translate-y-[-6px] transition-all duration-300 shadow-sm hover:shadow-2xl">
            <div className="flex justify-between items-start mb-6 md:mb-8">
              <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                {m.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1.5 rounded-full ${
                m.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {m.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {m.change}%
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{m.label}</p>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">{m.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-10">
        <div className="xl:col-span-2 space-y-8 md:space-y-10">
          {/* Main Chart */}
          <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-lg bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 md:mb-12">
              <div>
                <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">Institutional Growth</h4>
                <p className="text-sm text-slate-500 font-bold italic mt-1 uppercase text-[10px] tracking-widest">Revenue Analytics Across Campus Nodes</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <select className="flex-1 sm:flex-none bg-slate-100 border-none rounded-2xl text-[9px] md:text-[10px] px-5 py-3 font-black uppercase tracking-widest text-slate-600 focus:ring-4 focus:ring-blue-100 cursor-pointer transition-all">
                  <option>Last 6 Months</option>
                  <option>Annual Overview</option>
                </select>
              </div>
            </div>
            <div className="h-[250px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '24px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Unified Tier Summary */}
          <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-lg bg-white">
            <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-8 uppercase">Unified Structure</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {tierStats.map((stat, i) => (
                <div key={i} className="bg-white/40 p-6 md:p-8 rounded-[32px] border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all group">
                   <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-600 flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                     <School size={24} />
                   </div>
                   <h5 className="font-black text-slate-900 text-lg mb-2">{stat.tier}</h5>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">{stat.levels.join(' • ')}</p>
                   <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                      <div className="text-center">
                        <p className="text-xl font-black text-slate-900">{stat.students}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Learners</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-black text-slate-900">{stat.teachers}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Faculty</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insight Box & Quick Reports */}
        <div className="space-y-8">
          <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] flex flex-col bg-gradient-to-br from-slate-900 to-blue-900 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-12 -mt-12 transition-transform duration-1000 group-hover:scale-150"></div>
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <TrendingUp className="text-blue-400" size={24} />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-tighter text-xl leading-none">Strategy Core</h4>
                <p className="text-[9px] font-black text-blue-300 uppercase tracking-[0.2em] mt-1.5">Analysis Engine</p>
              </div>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/10 shadow-inner relative z-10">
              <p className="text-blue-50 leading-relaxed text-sm italic font-medium">
                "{aiSummary}"
              </p>
            </div>
            <button className="mt-8 w-full py-5 bg-white text-slate-900 font-black rounded-[20px] md:rounded-[24px] hover:bg-blue-50 transition-all text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 flex items-center justify-center gap-3 relative z-10">
              Generate Board View <ArrowUpRight size={18} />
            </button>
          </div>

          <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] shadow-lg bg-white">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-8">Facility Alerts</h4>
            <div className="space-y-6">
              {[
                { title: 'Nursery Wing', desc: 'New playground installation complete', time: '2h ago' },
                { title: 'Senior High Labs', desc: 'Equipment safety audit scheduled', time: '5h ago' },
                { title: 'Transport Core', desc: 'Fleet GPS synchronization active', time: '1d ago' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-4 group cursor-default">
                  <div className="w-1.5 h-10 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors"></div>
                  <div>
                    <h5 className="font-black text-slate-900 text-[11px] tracking-tight">{alert.title}</h5>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">{alert.desc}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-10 w-full py-4 border-2 border-slate-100 text-slate-600 font-black rounded-[20px] text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
              Security Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;