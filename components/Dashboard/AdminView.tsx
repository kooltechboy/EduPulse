import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, GraduationCap, 
  ArrowUpRight, ArrowDownRight, Clock, School, 
  Sparkles, Activity, ChevronRight, Search, 
  CheckCircle, Zap, ShieldCheck, X, BarChart3, PieChart,
  ArrowRight, Calendar, FileText, Database, Terminal, Cpu, Loader2, AlertCircle,
  Layout, BookOpen, Briefcase, FileDown, Target, Info,
  TrendingDown, Eye
} from 'lucide-react';
import { 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, BarChart, Bar, Cell
} from 'recharts';
import { getCampusSummary } from '../../services/geminiService';
import { GradeLevel } from '../../types';

const data = [
  { name: '08:00', momentum: 42, activity: 95 },
  { name: '09:00', momentum: 68, activity: 93 },
  { name: '10:00', momentum: 85, activity: 97 },
  { name: '11:00', momentum: 78, activity: 96 },
  { name: '12:00', momentum: 92, activity: 98 },
  { name: '13:00', momentum: 88, activity: 95 },
];

const tierStats = [
  { 
    tier: 'Early Childhood', 
    id: 'TIER-EC',
    levels: [GradeLevel.NURSERY, GradeLevel.PRE_SCHOOL], 
    students: 420, 
    teachers: 28, 
    color: 'emerald', 
    gradient: 'from-emerald-500/20 to-teal-500/20',
    description: 'Foundational learning nodes focused on sensory and play-based development cycles.',
    breakdown: [
      { name: 'Nursery', count: 185 }, 
      { name: 'Pre-K', count: 235 }
    ],
    metrics: [
      { label: 'Capacity', value: '92%', icon: <Layout size={16}/> },
      { label: 'Safety Index', value: 'Optimal', icon: <ShieldCheck size={16}/> },
      { label: 'Node Status', value: 'Active', icon: <Activity size={16}/> }
    ],
    programs: ['Sensory Integration', 'Nature Play', 'Early Literacy']
  },
  { 
    tier: 'Elementary', 
    id: 'TIER-EL',
    levels: [GradeLevel.ELEMENTARY], 
    students: 512, 
    teachers: 32, 
    color: 'blue', 
    gradient: 'from-blue-500/20 to-indigo-500/20',
    description: 'Core literacy and numeracy development stages with integrated STEM focus.',
    breakdown: [
      { name: 'G1', count: 88 }, { name: 'G2', count: 85 }, 
      { name: 'G3', count: 90 }, { name: 'G4', count: 82 }, 
      { name: 'G5', count: 87 }, { name: 'G6', count: 80 }
    ],
    metrics: [
      { label: 'Capacity', value: '85%', icon: <Layout size={16}/> },
      { label: 'STEM Index', value: '94%', icon: <Zap size={16}/> },
      { label: 'Active Clubs', value: '14', icon: <Users size={16}/> }
    ],
    programs: ['Reading First', 'Math Core', 'Lego Robotics']
  },
  { 
    tier: 'Secondary', 
    id: 'TIER-SEC',
    levels: [GradeLevel.SENIOR_HIGH], 
    students: 352, 
    teachers: 45, 
    color: 'purple', 
    gradient: 'from-purple-500/20 to-fuchsia-500/20',
    description: 'Advanced academic and vocational preparation nodes for higher education entry.',
    breakdown: [
      { name: 'Year 7', count: 110 }, 
      { name: 'Year 8', count: 105 }, 
      { name: 'Year 9', count: 137 }
    ],
    metrics: [
      { label: 'Capacity', value: '78%', icon: <Layout size={16}/> },
      { label: 'Avg GPA', value: '3.82', icon: <GraduationCap size={16}/> },
      { label: 'Career Link', value: 'High', icon: <Briefcase size={16}/> }
    ],
    programs: ['IB Diploma', 'Tech Vocational', 'Arts Conservatory']
  },
];

const AUDIT_LOGS = [
  { id: 'LOG-8821', action: 'Ledger Synchronization', user: 'System AI', role: 'CORE', time: '10:42 AM', status: 'Success', icon: <Database size={16} /> },
  { id: 'LOG-8822', action: 'Biometric Entry: Gate B', user: 'Sec. Monitor', role: 'AUTO', time: '10:40 AM', status: 'Verified', icon: <ShieldCheck size={16} /> },
  { id: 'LOG-8823', action: 'Grade Matrix Update', user: 'Prof. Mitchell', role: 'FACULTY', time: '10:35 AM', status: 'Committed', icon: <GraduationCap size={16} /> },
  { id: 'LOG-8824', action: 'Tuition Payment Processed', user: 'Finance Node', role: 'ADMIN', time: '10:15 AM', status: 'Success', icon: <DollarSign size={16} /> },
  { id: 'LOG-8825', action: 'Firewall Protocol Test', user: 'Admin Anderson', role: 'ADMIN', time: '09:00 AM', status: 'Warning', icon: <AlertCircle size={16} /> },
];

interface AdminViewProps {
  onNavigate: (tab: string) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const [aiSummary, setAiSummary] = useState("Initializing institutional neural synthesis...");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [selectedTier, setSelectedTier] = useState<typeof tierStats[0] | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await getCampusSummary(data);
      setAiSummary(summary);
    };
    fetchSummary();
  }, []);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setAiSummary("System Neural Velocity optimized. Resource allocation adjusted for peak learning hours. Predictive models refreshed with latest node telemetry.");
    }, 2500);
  };

  const handleExportLedger = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['Log ID', 'Action', 'User', 'Role', 'Time', 'Status'];
      const rows = AUDIT_LOGS.map(log => [log.id, log.action, log.user, log.role, log.time, log.status]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `edupulse_audit_ledger_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 1500);
  };

  const metrics = [
    { id: 'enrolled', label: 'Learner Registry', value: '1,284', change: 12, trend: 'up', icon: <Users className="text-blue-600" />, bgColor: 'bg-blue-50' },
    { id: 'presence', label: 'Daily Presence', value: '94.2%', change: 2.4, trend: 'up', icon: <Clock className="text-orange-500" />, bgColor: 'bg-orange-50' },
    { id: 'revenue', label: 'Fiscal Flow', value: '$42.5k', change: 4.5, trend: 'up', icon: <DollarSign className="text-emerald-500" />, bgColor: 'bg-emerald-50' },
    { id: 'academic', label: 'Merit Score', value: '8.4/10', change: 1.2, trend: 'down', icon: <GraduationCap className="text-purple-600" />, bgColor: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-1000">
      {/* Dynamic Key Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m) => (
          <button 
            key={m.id} 
            onClick={() => setSelectedMetric(m.id)}
            className="glass-card p-10 rounded-[48px] card-hover-effect text-left group transition-all active:scale-95"
          >
            <div className="flex justify-between items-start mb-12">
              <div className={`p-5 ${m.bgColor} rounded-[24px] shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                {m.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-4 py-2 rounded-full border shadow-sm ${
                m.trend === 'up' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {m.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {m.change}%
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2 leading-none">{m.label}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{m.value}</h3>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-12">
          {/* Main Momentum Terminal */}
          <div className="glass-card p-12 md:p-14 rounded-[64px] bg-white border-none relative group overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-16">
              <div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Command Velocity</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em] mt-3">Global Institutional Sync • Real-Time Nodes</p>
              </div>
              <div className="flex items-center gap-4">
                 <button 
                   onClick={() => setShowAuditLogs(true)}
                   className="flex items-center gap-4 px-8 py-5 bg-slate-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                 >
                    <Terminal size={18} className="text-blue-400" /> Audit Logs
                 </button>
                 <button 
                   onClick={handleOptimize}
                   disabled={isOptimizing}
                   className={`p-5 rounded-3xl transition-all shadow-xl active:scale-90 ${isOptimizing ? 'bg-emerald-500 text-white animate-pulse' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                 >
                    {isOptimizing ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} />}
                 </button>
              </div>
            </div>
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorMom" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} dy={15} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                    contentStyle={{ borderRadius: '28px', border: 'none', boxShadow: '0 32px 64px -16px rgba(15,23,42,0.2)', padding: '24px', fontWeight: 800 }}
                  />
                  <Area type="monotone" dataKey="momentum" stroke="#2563eb" strokeWidth={8} fillOpacity={1} fill="url(#colorMom)" animationDuration={3000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Institutional Risk Matrix - NEW PREMIUM FEATURE */}
          <div className="glass-card p-12 md:p-14 rounded-[64px] bg-slate-950 text-white border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
            <div className="flex items-center justify-between mb-12 relative z-10">
               <h4 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-5">
                  <div className="p-3 bg-rose-600/20 rounded-2xl"><TrendingDown size={24} className="text-rose-400" /></div>
                  Sustainability Risk Matrix
               </h4>
               <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-600/10 px-4 py-2 rounded-full">Neural Predictive V1.2</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
               <div className="space-y-8">
                  <p className="text-slate-400 text-sm font-medium leading-relaxed italic">"Risk levels analyzed across Academic Merit, Financial Settling, and Social Integration nodes. Early warning active for 14 learner accounts."</p>
                  <div className="space-y-6">
                    {[
                      { label: 'Node Attrition Risk', val: 12, color: 'bg-rose-500' },
                      { label: 'Fiscal Default Probability', val: 8, color: 'bg-amber-500' },
                      { label: 'Academic Regression', val: 18, color: 'bg-indigo-500' },
                    ].map(risk => (
                      <div key={risk.label} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span>{risk.label}</span>
                          <span>{risk.val}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                           <div className={`h-full ${risk.color} rounded-full`} style={{ width: `${risk.val}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[48px] border border-white/10 flex flex-col items-center justify-center text-center">
                  <div className="p-6 bg-rose-600/20 rounded-[32px] mb-6 shadow-2xl animate-pulse">
                     <AlertCircle size={48} className="text-rose-400" />
                  </div>
                  <h5 className="text-xl font-black mb-2 uppercase tracking-tight text-rose-100">Anomaly Detected</h5>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Grade decline correlated with 15% attendance variance in Senior High Tier.</p>
                  <button onClick={() => onNavigate('behavior')} className="mt-8 w-full py-4 bg-white text-slate-900 rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-3">
                     Open Risk Dossier <ChevronRight size={16} />
                  </button>
               </div>
            </div>
          </div>

          {/* Tier Distribution Matrix */}
          <div className="glass-card p-12 md:p-14 rounded-[64px] bg-white border-none shadow-2xl">
            <div className="flex items-center justify-between mb-12">
               <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-5">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-glow-pulse"></div> Tier Intelligence Hub
               </h4>
               <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Manage Node Placement</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {tierStats.map((stat) => (
                <button 
                  key={stat.id} 
                  onClick={() => setSelectedTier(stat)}
                  className={`p-10 rounded-[48px] border-2 border-transparent bg-gradient-to-br ${stat.gradient} card-hover-effect relative overflow-hidden group text-left transition-all active:scale-[0.98] shadow-sm`}
                >
                   <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-all duration-700">
                      <School size={80} />
                   </div>
                   <div className={`w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-${stat.color}-600 mb-12 shadow-xl group-hover:rotate-6 transition-transform duration-500`}>
                     <School size={32} />
                   </div>
                   <h5 className="font-black text-slate-900 text-2xl mb-2 uppercase tracking-tighter leading-none">{stat.tier}</h5>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-12">Global Node Active</p>
                   <div className="flex justify-between items-center pt-10 border-t border-slate-900/10">
                      <div>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{stat.students}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Learners</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{stat.teachers}</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Faculty</p>
                      </div>
                   </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Predictive Core & Live Ops */}
        <div className="space-y-12">
          <div className="glass-card-dark p-12 rounded-[64px] flex flex-col shadow-2xl relative overflow-hidden group neural-glow animate-float h-full min-h-[500px]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mr-40 -mt-40 transition-transform duration-[5s] group-hover:scale-125"></div>
            <div className="flex items-center gap-6 mb-16 relative z-10">
              <div className="bg-white/10 p-6 rounded-[32px] backdrop-blur-3xl shadow-inner border border-white/20 group-hover:rotate-[20deg] transition-transform duration-700">
                <Cpu className="text-blue-400" size={36} />
              </div>
              <div>
                <h4 className="font-black uppercase tracking-tighter text-3xl leading-none text-white">Strategy Core</h4>
                <p className="text-[9px] font-black text-blue-300 uppercase tracking-[0.5em] mt-3">Predictive Engine v4.0</p>
              </div>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-xl p-10 rounded-[48px] border border-white/10 shadow-inner relative z-10">
              <p className="text-blue-50 leading-relaxed text-lg italic font-medium opacity-90">
                "{aiSummary}"
              </p>
            </div>
            <button className="mt-14 w-full py-8 bg-white text-slate-900 font-black rounded-[36px] hover:bg-blue-50 transition-all duration-500 text-[12px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 flex items-center justify-center gap-4 relative z-10">
              Dispatch Global Directive <ArrowUpRight size={22} />
            </button>
          </div>

          <div className="glass-card p-12 rounded-[64px] shadow-2xl bg-white border-none">
            <h4 className="font-black text-slate-900 uppercase tracking-[0.5em] text-[11px] mb-12 flex items-center gap-5">
              <Activity size={20} className="text-blue-600" /> Perimeter Telemetry
            </h4>
            <div className="space-y-10">
              {[
                { title: 'Academic Wing B', desc: 'Secure: Access protocol active', status: 'optimal', icon: <ShieldCheck size={20}/> },
                { title: 'Science Lab 4', desc: 'Active: Node synchronized', status: 'optimal', icon: <Zap size={20}/> },
                { title: 'Fleet Tracking', desc: 'Alert: 2 units in charging', status: 'caution', icon: <Clock size={20}/> },
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
                    <p className="text-sm font-bold text-slate-400 leading-tight">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: AUDIT LEDGER */}
      {showAuditLogs && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowAuditLogs(false)}></div>
           <div className="relative w-full max-w-5xl bg-white rounded-[64px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-16 duration-500 max-h-[90vh]">
              <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                 <div className="flex items-center gap-8">
                    <div className="p-6 bg-slate-900 text-white rounded-[28px] shadow-2xl">
                       <Terminal size={36} />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Institutional Audit Ledger</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Comprehensive Node Action Registry</p>
                    </div>
                 </div>
                 <button onClick={() => setShowAuditLogs(false)} className="p-5 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all shadow-sm active:scale-90"><X size={28} /></button>
              </div>
              
              <div className="p-12 bg-slate-50/20 overflow-y-auto scrollbar-hide flex-1 space-y-4">
                 {AUDIT_LOGS.map((log, i) => (
                    <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 flex flex-col md:flex-row items-center gap-10 hover:shadow-xl hover:translate-y-[-4px] transition-all group cursor-default">
                       <div className="flex items-center gap-8 w-full md:w-auto">
                          <div className={`p-5 rounded-[24px] shadow-inner group-hover:scale-110 transition-all ${log.status === 'Warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                             {log.icon}
                          </div>
                          <div>
                             <h5 className="font-black text-slate-900 uppercase tracking-tight text-lg mb-1">{log.action}</h5>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {log.id} • Node: {log.role}</p>
                          </div>
                       </div>
                       <div className="hidden md:block flex-1 h-px bg-slate-100"></div>
                       <div className="flex items-center gap-10 w-full md:w-auto justify-between">
                          <div className="text-right">
                             <p className="text-sm font-black text-slate-700">{log.user}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{log.time}</p>
                          </div>
                          <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                             log.status === 'Success' || log.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                             {log.status}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
              
              <div className="p-10 bg-white border-t border-slate-100 flex justify-between items-center">
                 <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Live Connection Established
                 </div>
                 <button 
                  onClick={handleExportLedger}
                  disabled={isExporting}
                  className="px-12 py-6 bg-slate-900 text-white font-black rounded-[32px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl text-xs flex items-center gap-4 active:scale-95 disabled:opacity-70"
                 >
                    {isExporting ? <Loader2 size={20} className="animate-spin" /> : <FileDown size={20} />}
                    {isExporting ? 'Generating Ledger...' : 'Export Full Ledger Registry'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: TIER DEEP DIVE */}
      {selectedTier && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedTier(null)}></div>
           <div className="relative w-full max-w-5xl bg-white rounded-[64px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-16 duration-500 max-h-[90vh]">
              <div className={`p-12 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r ${selectedTier.gradient}`}>
                 <div className="flex items-center gap-10">
                    <div className={`p-6 bg-white rounded-[32px] shadow-2xl text-${selectedTier.color}-600`}>
                       <School size={56} />
                    </div>
                    <div>
                       <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{selectedTier.tier}</h3>
                       <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mt-3">Node Intelligence Hub • {selectedTier.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedTier(null)} className="p-6 bg-white/50 backdrop-blur-md rounded-3xl hover:bg-white transition-all shadow-sm active:scale-90"><X size={32} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 scrollbar-hide space-y-12 bg-white">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {selectedTier.metrics.map((m, i) => (
                       <div key={i} className="bg-slate-50 p-10 rounded-[48px] border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
                          <div className={`p-5 bg-${selectedTier.color}-100 text-${selectedTier.color}-600 rounded-3xl mb-6 shadow-inner transition-transform group-hover:scale-110`}>{m.icon}</div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{m.label}</p>
                          <h4 className="text-4xl font-black text-slate-900 tracking-tight">{m.value}</h4>
                       </div>
                    ))}
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white rounded-[56px] p-10 border border-slate-100 shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                       <h5 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tighter flex items-center gap-5">
                          <BarChart3 size={24} className={`text-${selectedTier.color}-500`} /> Enrollment Metrics
                       </h5>
                       <div className="h-[280px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={selectedTier.breakdown}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} dy={10} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', fontWeight: 800}} />
                                <Bar dataKey="count" radius={[12, 12, 0, 0]} barSize={48}>
                                   {selectedTier.breakdown.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1e293b' : '#3b82f6'} />
                                   ))}
                                </Bar>
                             </BarChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="bg-slate-900 text-white p-12 rounded-[56px] shadow-2xl relative overflow-hidden group/narr">
                          <div className="relative z-10">
                             <h5 className="text-xl font-black mb-6 uppercase tracking-tighter flex items-center gap-4">
                                <Info size={24} className="text-blue-400" /> Tier Narrative
                             </h5>
                             <p className="text-lg font-medium text-slate-300 leading-relaxed italic opacity-90 group-hover/narr:opacity-100 transition-opacity">"{selectedTier.description}"</p>
                          </div>
                          <div className={`absolute top-0 right-0 w-48 h-48 bg-${selectedTier.color}-500/10 rounded-full blur-[80px] -mr-16 -mt-16 group-hover/narr:scale-150 transition-transform duration-[3s]`}></div>
                       </div>
                       <div className="bg-slate-50 border border-slate-100 p-10 rounded-[56px] shadow-sm">
                          <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Active Learning Pathways</h5>
                          <div className="flex flex-wrap gap-4">
                             {selectedTier.programs.map((prog, i) => (
                                <span key={i} className={`px-6 py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm hover:border-${selectedTier.color}-400 transition-all hover:translate-y-[-2px] cursor-default`}>
                                   {prog}
                                </span>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-14">
                 <button className="px-10 py-5 bg-white border border-slate-200 text-slate-500 font-black rounded-3xl text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95">
                    Download Tier Dossier
                 </button>
                 <button className={`px-12 py-6 bg-${selectedTier.color}-600 text-white font-black rounded-[36px] text-sm uppercase tracking-[0.2em] shadow-2xl hover:translate-y-[-4px] transition-all flex items-center gap-4 active:scale-95`}>
                    Manage {selectedTier.tier} Module <ArrowRight size={20} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: KPI DEEP DIVE */}
      {selectedMetric && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedMetric(null)}></div>
           <div className="relative w-full max-w-2xl bg-white rounded-[64px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-16 duration-500">
              <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-8">
                    <div className={`p-6 bg-blue-600 text-white rounded-3xl shadow-xl`}>
                       <BarChart3 size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Metric Intelligence</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Dossier: {selectedMetric.toUpperCase()}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedMetric(null)} className="p-5 bg-white rounded-2xl hover:bg-slate-100 transition-all active:scale-90"><X size={28} /></button>
              </div>
              <div className="p-12 space-y-10 text-center">
                 <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity size={48} className="animate-pulse" />
                 </div>
                 <h4 className="text-2xl font-black text-slate-900 uppercase">Synchronizing Telemetry</h4>
                 <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">The high-fidelity data engine is processing the latest institutional node telemetry for this metric.</p>
                 <button onClick={() => setSelectedMetric(null)} className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl uppercase tracking-widest shadow-xl active:scale-95">Return to Command</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;