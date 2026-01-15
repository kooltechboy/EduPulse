import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, GraduationCap, 
  ArrowUpRight, ArrowDownRight, Clock, School, 
  Sparkles, Activity, ChevronRight, Search, 
  CheckCircle, Zap, ShieldCheck, X, BarChart3, PieChart,
  ArrowRight, Calendar
} from 'lucide-react';
import { 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, BarChart, Bar, Cell, LineChart, Line 
} from 'recharts';
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
  { tier: 'Early Childhood', levels: [GradeLevel.NURSERY, GradeLevel.PRE_SCHOOL], students: 420, teachers: 28, color: 'emerald', gradient: 'from-emerald-500/20 to-teal-500/20' },
  { tier: 'Elementary', levels: [GradeLevel.ELEMENTARY], students: 512, teachers: 32, color: 'blue', gradient: 'from-blue-500/20 to-indigo-500/20' },
  { tier: 'Secondary', levels: [GradeLevel.SENIOR_HIGH], students: 352, teachers: 45, color: 'purple', gradient: 'from-purple-500/20 to-fuchsia-500/20' },
];

interface AdminViewProps {
  onNavigate: (tab: string) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const [aiSummary, setAiSummary] = useState("Initializing neural synthesis...");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await getCampusSummary(data);
      setAiSummary(summary);
    };
    fetchSummary();
  }, []);

  const metrics = [
    { 
      id: 'enrolled',
      label: 'Total Enrolled', 
      value: '1,284', 
      change: 12, 
      trend: 'up', 
      icon: <Users className="text-blue-600" />, 
      bgColor: 'bg-blue-50',
      linkId: 'students',
      history: [
        { label: 'Jan', value: 1150 }, { label: 'Feb', value: 1180 }, 
        { label: 'Mar', value: 1210 }, { label: 'Apr', value: 1240 }, 
        { label: 'May', value: 1284 }
      ],
      details: {
        title: 'Enrollment Distribution',
        stats: [
          { label: 'Early Years', value: 420, color: 'bg-emerald-500' },
          { label: 'Elementary', value: 512, color: 'bg-blue-500' },
          { label: 'Secondary', value: 352, color: 'bg-purple-500' }
        ]
      }
    },
    { 
      id: 'presence',
      label: 'Avg Presence', 
      value: '94.2%', 
      change: 2.4, 
      trend: 'up', 
      icon: <Clock className="text-orange-500" />, 
      bgColor: 'bg-orange-50',
      linkId: 'students',
      history: [
        { label: 'Mon', value: 92 }, { label: 'Tue', value: 94 }, 
        { label: 'Wed', value: 96 }, { label: 'Thu', value: 93 }, 
        { label: 'Fri', value: 95 }
      ],
      details: {
        title: 'Weekly Attendance Trend',
        stats: [
          { label: 'Mon', value: 92, color: 'bg-orange-400' },
          { label: 'Tue', value: 94, color: 'bg-orange-500' },
          { label: 'Wed', value: 96, color: 'bg-orange-600' },
          { label: 'Thu', value: 93, color: 'bg-orange-500' },
          { label: 'Fri', value: 95, color: 'bg-orange-400' }
        ]
      }
    },
    { 
      id: 'revenue',
      label: 'Revenue (Q2)', 
      value: '$42.5k', 
      change: 4.5, 
      trend: 'up', 
      icon: <DollarSign className="text-emerald-500" />, 
      bgColor: 'bg-emerald-50',
      linkId: 'finance',
      history: [
        { label: 'Jan', value: 32000 }, { label: 'Feb', value: 35000 }, 
        { label: 'Mar', value: 38000 }, { label: 'Apr', value: 40000 }, 
        { label: 'May', value: 42500 }
      ],
      details: {
        title: 'Financial Sources',
        stats: [
          { label: 'Tuition', value: 35000, color: 'bg-emerald-600' },
          { label: 'Grants', value: 5000, color: 'bg-emerald-400' },
          { label: 'Services', value: 2500, color: 'bg-teal-400' }
        ]
      }
    },
    { 
      id: 'academic',
      label: 'Academic Index', 
      value: '8.4/10', 
      change: 1.2, 
      trend: 'down', 
      icon: <GraduationCap className="text-purple-600" />, 
      bgColor: 'bg-purple-50',
      linkId: 'classes',
      history: [
        { label: 'T1', value: 8.1 }, { label: 'T2', value: 8.3 }, 
        { label: 'T3', value: 8.5 }, { label: 'T4', value: 8.4 }
      ],
      details: {
        title: 'Department Performance',
        stats: [
          { label: 'STEM', value: 8.8, color: 'bg-purple-600' },
          { label: 'Humanities', value: 8.2, color: 'bg-fuchsia-500' },
          { label: 'Arts', value: 9.1, color: 'bg-pink-500' }
        ]
      }
    },
  ];

  const activeMetricData = metrics.find(m => m.id === selectedMetric);

  return (
    <div className="space-y-12 pb-10">
      {/* Precision Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m, i) => (
          <button 
            key={i} 
            onClick={() => setSelectedMetric(m.id)}
            className="glass-card p-10 rounded-[48px] card-hover-effect relative overflow-hidden group text-left w-full transition-all active:scale-[0.98]"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-all duration-700 translate-x-4 -translate-y-4">
              {React.cloneElement(m.icon as React.ReactElement<any>, { size: 140 })}
            </div>
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className={`p-5 ${m.bgColor} rounded-[24px] shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                {m.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-4 py-2 rounded-full border shadow-sm ${
                m.trend === 'up' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {m.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {m.change}%
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2 relative z-10 leading-none">{m.label}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter relative z-10 uppercase">{m.value}</h3>
            <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">View Details <ChevronRight size={12}/></span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-12">
          {/* Institutional Velocity Chart */}
          <div className="glass-card p-10 md:p-14 rounded-[64px] bg-white border-none relative group overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
              <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Command Velocity</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em] mt-3">Global Institutional Synthesis • 2026</p>
              </div>
              <div className="flex gap-4">
                 <button className="flex items-center gap-3 px-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                    <Search size={16} /> Audit Logs
                 </button>
                 <button className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                    <Zap size={20} />
                 </button>
              </div>
            </div>
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} />
                  <Tooltip 
                    cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                    contentStyle={{ borderRadius: '28px', border: 'none', boxShadow: '0 32px 64px -16px rgba(15,23,42,0.2)', padding: '24px', fontWeight: 800 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={6} fillOpacity={1} fill="url(#colorRev)" animationDuration={3000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tier Synthesis Nodes */}
          <div className="glass-card p-12 md:p-14 rounded-[64px] bg-white border-none shadow-2xl">
            <div className="flex items-center justify-between mb-12">
               <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-glow-pulse shadow-[0_0_15px_#2563eb]"></div> Tier Distribution Hub
               </h4>
               <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:underline">Manage Placements</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {tierStats.map((stat, i) => (
                <div key={i} className={`p-10 rounded-[48px] border-2 border-transparent bg-gradient-to-br ${stat.gradient} card-hover-effect relative overflow-hidden group`}>
                   <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-all duration-700">
                      <School size={80} />
                   </div>
                   <div className={`w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-${stat.color}-600 mb-10 shadow-xl group-hover:rotate-6 transition-transform duration-500`}>
                     <School size={32} />
                   </div>
                   <h5 className="font-black text-slate-900 text-2xl mb-2 uppercase tracking-tighter leading-none">{stat.tier}</h5>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-12 h-8 line-clamp-2 italic">Global Node Registry Active</p>
                   <div className="flex justify-between items-center pt-10 border-t border-slate-900/10">
                      <div className="text-left">
                        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{stat.students}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Learners</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{stat.teachers}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Faculty</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Board Strategy & Live Ops */}
        <div className="space-y-12">
          <div className="glass-card-dark p-12 rounded-[64px] flex flex-col shadow-2xl relative overflow-hidden group neural-glow animate-float">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40 transition-transform duration-[5s] group-hover:scale-150"></div>
            <div className="flex items-center gap-6 mb-16 relative z-10">
              <div className="bg-white/10 p-6 rounded-[28px] backdrop-blur-3xl shadow-inner border border-white/20 group-hover:rotate-[20deg] transition-transform duration-700">
                <TrendingUp className="text-blue-400" size={36} />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-tighter text-3xl leading-none text-white">Strategy Core</h4>
                <p className="text-[9px] font-black text-blue-300 uppercase tracking-[0.5em] mt-3">Neural Synapse v3.2</p>
              </div>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-xl p-10 rounded-[48px] border border-white/10 shadow-inner relative z-10">
              <p className="text-blue-50 leading-relaxed text-lg italic font-medium opacity-90 selection:bg-blue-500">
                "{aiSummary}"
              </p>
            </div>
            <button className="mt-14 w-full py-8 bg-white text-slate-900 font-black rounded-[32px] hover:bg-blue-50 transition-all duration-500 text-[12px] uppercase tracking-[0.4em] shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-5 relative z-10 group/btn">
              Dispatch Board Report <ArrowUpRight size={22} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform" />
            </button>
          </div>

          <div className="glass-card p-12 rounded-[64px] shadow-2xl bg-white border-none">
            <h4 className="font-black text-slate-900 uppercase tracking-[0.5em] text-[11px] mb-12 flex items-center gap-5">
              <Activity size={20} className="text-blue-600" /> Live Perimeter Ops
            </h4>
            <div className="space-y-10">
              {[
                { title: 'Academic Wing B', desc: 'Secure: Access protocol active', time: '12m ago', status: 'optimal', icon: <ShieldCheck size={20}/> },
                { title: 'Science Labs', desc: 'Alert: HVAC node variance', time: '2h ago', status: 'caution', icon: <Zap size={20}/> },
                { title: 'Transport Fleet', desc: 'Fleet: All units in charging', time: '1d ago', status: 'optimal', icon: <Clock size={20}/> },
              ].map((alert, i) => (
                <div key={i} className="flex gap-8 group cursor-pointer hover:translate-x-2 transition-all duration-500">
                  <div className={`p-4 rounded-2xl ${alert.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} shadow-sm`}>
                    {alert.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <h5 className="font-black text-slate-900 text-base tracking-tight uppercase leading-none">{alert.title}</h5>
                      <span className={`w-2 h-2 rounded-full ${alert.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`}></span>
                    </div>
                    <p className="text-sm font-bold text-slate-400 mb-3 leading-tight">{alert.desc}</p>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{alert.time} • Secure Node</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-14 w-full py-6 border-4 border-slate-50 text-slate-400 font-black rounded-[32px] text-[11px] uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 shadow-sm">
              Secure System Archive
            </button>
          </div>
        </div>
      </div>

      {/* METRIC DETAIL MODAL */}
      {selectedMetric && activeMetricData && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedMetric(null)}></div>
           <div className="relative w-full max-w-2xl bg-white rounded-[64px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-16 duration-500">
              <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-6">
                    <div className={`p-5 ${activeMetricData.bgColor} rounded-[24px] shadow-inner`}>
                       {React.cloneElement(activeMetricData.icon as React.ReactElement<any>, { size: 32 })}
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{activeMetricData.label}</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Deep Dive Analytics</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedMetric(null)} className="p-4 bg-white rounded-[24px] hover:bg-slate-100 transition-all shadow-sm"><X size={24} /></button>
              </div>
              
              <div className="p-12 bg-white space-y-10 overflow-y-auto max-h-[60vh] scrollbar-hide">
                 <div className="flex justify-between items-end">
                    <h4 className="text-6xl font-black text-slate-900 tracking-tighter">{activeMetricData.value}</h4>
                    <div className={`flex items-center gap-2 text-xs font-black px-6 py-3 rounded-full uppercase tracking-widest ${
                      activeMetricData.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {activeMetricData.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {activeMetricData.change}% vs Last Cycle
                    </div>
                 </div>

                 {/* Historical Trend Chart */}
                 <div className="h-48 w-full bg-slate-50 rounded-[32px] p-6 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar size={12}/> 5-Month Trend Analysis</p>
                    <ResponsiveContainer width="100%" height="80%">
                       <AreaChart data={activeMetricData.history}>
                          <defs>
                             <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                          <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}} />
                          <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fill="url(#colorTrend)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
                 
                 <div className="space-y-6">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">{activeMetricData.details.title}</h5>
                    {activeMetricData.details.stats.map((stat, idx) => (
                       <div key={idx} className="space-y-3">
                          <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                             <span>{stat.label}</span>
                             <span className="font-black">{stat.value.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                               className={`h-full ${stat.color} rounded-full transition-all duration-1000`} 
                               style={{ width: `${(stat.value / activeMetricData.details.stats.reduce((a,b) => a + b.value, 0)) * 100 * (selectedMetric === 'presence' || selectedMetric === 'academic' ? 3 : 1)}%` }}
                             ></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4">
                 <button className="flex-1 py-6 bg-white border border-slate-200 text-slate-500 font-black rounded-[32px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm">
                    Export Report
                 </button>
                 <button onClick={() => { setSelectedMetric(null); onNavigate(activeMetricData.linkId); }} className="flex-[2] py-6 bg-slate-900 text-white font-black rounded-[32px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-3">
                    Access {activeMetricData.linkId === 'students' ? 'Registry' : activeMetricData.linkId === 'finance' ? 'Ledger' : 'Module'} <ArrowRight size={18} />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;