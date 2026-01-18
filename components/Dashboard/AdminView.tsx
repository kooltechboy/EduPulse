import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, GraduationCap, 
  ArrowUpRight, ArrowDownRight, Clock, School, 
  Sparkles, Activity, Search, 
  CheckCircle, Zap, ShieldCheck, BarChart3,
  ArrowRight, Calendar, Database, Cpu, Loader2, AlertCircle,
  LayoutGrid, UserCheck, UserPlus, Bus,
  RefreshCw, Wallet
} from 'lucide-react';
import { 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, BarChart, Bar
} from 'recharts';
import { getCampusSummary } from '../../services/geminiService';
import { AdmissionsCandidate, FinancialTransaction, Invoice } from '../../types';

const MOMENTUM_DATA = [
  { name: 'Mon', revenue: 4200, growth: 42 },
  { name: 'Tue', revenue: 3800, growth: 48 },
  { name: 'Wed', revenue: 5100, growth: 55 },
  { name: 'Thu', revenue: 4600, growth: 52 },
  { name: 'Fri', revenue: 6200, growth: 68 },
];

interface AdminViewProps {
  onNavigate: (tab: string) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const [aiSummary, setAiSummary] = useState("Synchronizing institutional logic nodes...");
  const [isSyncing, setIsSyncing] = useState(false);
  
  const candidates: AdmissionsCandidate[] = JSON.parse(localStorage.getItem('edupulse_admissions_pipeline') || '[]');
  const invoices: Invoice[] = JSON.parse(localStorage.getItem('edupulse_invoices') || '[]');
  const pendingRevenue = invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.amount, 0);

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await getCampusSummary({ 
        revenue: pendingRevenue, 
        enrollment: candidates.length, 
        cycle: 'Q2 2026' 
      });
      setAiSummary(summary);
    };
    fetchSummary();
  }, [pendingRevenue, candidates.length]);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      
      {/* Executive Quick Stats - HIGH VISIBILITY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Fiscal Reserve', value: `$${pendingRevenue.toLocaleString()}`, change: '+12%', trend: 'up', icon: <Wallet />, color: 'blue' },
          { label: 'Growth Queue', value: candidates.length, change: '+5%', trend: 'up', icon: <UserPlus />, color: 'emerald' },
          { label: 'Institutional Health', value: '98%', change: 'Stable', trend: 'up', icon: <ShieldCheck />, color: 'indigo' },
          { label: 'Active Faculty', value: '142', change: '84% Load', trend: 'up', icon: <Users />, color: 'purple' },
        ].map((m, i) => (
          <div key={i} className="glass-card p-8 rounded-[36px] bg-white group border-slate-200">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 bg-${m.color}-50 text-${m.color}-600 rounded-2xl group-hover:bg-${m.color}-600 group-hover:text-white transition-all`}>
                {m.icon}
              </div>
              <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${m.trend === 'up' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{m.change}</span>
            </div>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">{m.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{m.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Main Strategic Pulse */}
        <div className="xl:col-span-2 space-y-10">
          <div className="glass-card p-10 rounded-[48px] bg-white border-slate-200">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Momentum Command</h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Global Revenue vs. Learner Acquisition</p>
              </div>
              <button onClick={() => setIsSyncing(true)} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all">
                <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOMENTUM_DATA}>
                  <defs>
                    <linearGradient id="chartRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 800}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#chartRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="glass-card p-8 rounded-[40px] bg-white">
                <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-3 mb-8">
                   <AlertCircle className="text-rose-500" size={18} /> Mission Critical Alerts
                </h4>
                <div className="space-y-4">
                   {[
                     { msg: 'Tuition drift detected in Grade 12 node.', time: '2m ago', color: 'rose' },
                     { msg: 'Biometric audit for Bus Fleet SCH-202 pending.', time: '14m ago', color: 'amber' },
                     { msg: 'Neural synthesis complete for Q3 curriculum.', time: '1h ago', color: 'emerald' },
                   ].map((log, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className={`w-1 h-8 bg-${log.color}-500 rounded-full`}></div>
                         <div>
                            <p className="text-xs font-bold text-slate-800 leading-tight">{log.msg}</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{log.time}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="glass-card p-8 rounded-[40px] bg-white">
                <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-3 mb-8">
                   <Activity className="text-blue-600" size={18} /> Global Node Activity
                </h4>
                <div className="space-y-6">
                   {[
                     { label: 'Classrooms Online', val: '92%', color: 'bg-blue-600' },
                     { label: 'Security Handshakes', val: '100%', color: 'bg-emerald-600' },
                     { label: 'Library Access Index', val: '74%', color: 'bg-indigo-600' },
                   ].map((n, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            <span>{n.label}</span>
                            <span className="text-slate-900">{n.val}</span>
                         </div>
                         <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${n.color}`} style={{ width: n.val }}></div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Neural Strategic Feed */}
        <div className="space-y-8">
           <div className="glass-card-dark p-10 rounded-[48px] shadow-2xl relative overflow-hidden group border-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white/10 rounded-xl"><Cpu className="text-blue-400" size={24} /></div>
                    <h4 className="font-black uppercase tracking-tighter text-xl text-white">Neural Hub</h4>
                 </div>
                 <div className="bg-white/5 p-8 rounded-[32px] border border-white/10 mb-8">
                    <p className="text-blue-100 leading-relaxed text-base italic font-medium font-serif opacity-90">
                       "{aiSummary}"
                    </p>
                 </div>
                 <button onClick={() => onNavigate('settings')} className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-blue-50 transition-all text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95">
                    Synchronize Logic <Zap size={16} />
                 </button>
              </div>
           </div>

           <div className="glass-card p-8 rounded-[40px] bg-white border-slate-200">
              <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center gap-4">
                 <LayoutGrid size={16} className="text-blue-600" /> Executive Shortcuts
              </h4>
              <div className="grid grid-cols-2 gap-3">
                 {[
                   { label: 'SIS Hub', id: 'students' },
                   { label: 'Financial', id: 'finance' },
                   { label: 'Security', id: 'security' },
                   { label: 'Fleet', id: 'transport' },
                 ].map(item => (
                    <button key={item.id} onClick={() => onNavigate(item.id)} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all text-left group">
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-400 transition-colors">{item.label}</p>
                       <div className="flex items-center justify-between mt-2">
                          <span className="text-[7px] font-bold text-slate-400 uppercase">Audit Req</span>
                          <ArrowRight size={12} className="text-slate-300 group-hover:text-blue-400" />
                       </div>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Institutional Tier Overview */}
      <div className="space-y-8">
        <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase px-2">Cross-Tier Integrity</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { tier: 'Early Childhood', students: 420, faculty: 28, health: 92, color: 'emerald' },
            { tier: 'Elementary', students: 512, faculty: 32, health: 85, color: 'blue' },
            { tier: 'Secondary', students: 352, faculty: 45, health: 98, color: 'indigo' }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-8 rounded-[40px] bg-white border-slate-200 hover:border-blue-400 transition-all group">
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-8 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all`}>
                    <School size={24} />
                </div>
                <h5 className="font-black text-slate-900 text-xl mb-1 uppercase tracking-tighter">{stat.tier}</h5>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-8">{stat.students} Learners • {stat.faculty} Staff</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Health</span>
                    <span className={`text-sm font-black text-${stat.color}-600`}>{stat.health}%</span>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminView;