
import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, Users, ShieldCheck, 
  Activity, RefreshCw, Wallet, Radio, MapPin, 
  ArrowUpRight, ArrowDownRight, Globe, Zap, Database, Server
} from 'lucide-react';
import { 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis
} from 'recharts';
import { getCampusSummary } from '../../services/geminiService';
import { AdmissionsCandidate, Invoice } from '../../types';

const MOMENTUM_DATA = [
  { name: '08:00', load: 12, throughput: 420 },
  { name: '10:00', load: 45, throughput: 980 },
  { name: '12:00', load: 88, throughput: 1450 },
  { name: '14:00', load: 65, throughput: 1100 },
  { name: '16:00', load: 30, throughput: 600 },
  { name: '18:00', load: 10, throughput: 200 },
];

const LIVE_LOGS = [
  { id: 1, action: 'Gate Access Granted', user: 'STU-4402', loc: 'North Gate', time: 'Just now', type: 'security', status: 'Success' },
  { id: 2, action: 'Tuition Payment', user: 'PAR-002', loc: 'Finance Node', time: '12s ago', type: 'finance', status: 'Verified' },
  { id: 3, action: 'Library Checkout', user: 'STU-1021', loc: 'Digital Lib', time: '45s ago', type: 'academic', status: 'Log' },
  { id: 4, action: 'WiFi Handshake', user: 'Guest Device', loc: 'Admin Block', time: '1m ago', type: 'network', status: 'Auth' },
  { id: 5, action: 'Server Backup', user: 'System', loc: 'Cloud Core', time: '2m ago', type: 'system', status: 'Complete' },
];

interface AdminViewProps {
  onNavigate: (tab: string) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const [aiSummary, setAiSummary] = useState("Synchronizing institutional logic nodes...");
  const [isSyncing, setIsSyncing] = useState(false);
  const [liveFeed, setLiveFeed] = useState(LIVE_LOGS);
  
  // Safe parsing
  const candidates: AdmissionsCandidate[] = JSON.parse(localStorage.getItem('edupulse_admissions_pipeline') || '[]');
  const invoices: Invoice[] = JSON.parse(localStorage.getItem('edupulse_invoices') || '[]');
  const pendingRevenue = invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.amount, 0);

  useEffect(() => {
    const fetchSummary = async () => {
      // Graceful fallback if API fails
      try {
        const summary = await getCampusSummary({ 
          revenue: pendingRevenue, 
          enrollment: candidates.length, 
          cycle: 'Q2 2026' 
        });
        setAiSummary(summary);
      } catch (e) {
        setAiSummary("Neural Link Unavailable. Showing cached system status.");
      }
    };
    fetchSummary();

    const interval = setInterval(() => {
      setLiveFeed(prev => {
        // Simulate varying log types
        const types = ['security', 'network', 'academic'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const newLog = { 
          id: Date.now(), 
          action: randomType === 'security' ? 'Biometric Scan' : randomType === 'network' ? 'Node Sync' : 'LMS Access', 
          user: `ID-${Math.floor(Math.random() * 9000)}`, 
          loc: randomType === 'security' ? 'Main Hall' : 'Server 4', 
          time: 'Just now', 
          type: randomType,
          status: 'Success'
        };
        return [newLog, ...prev.slice(0, 6)]; // Keep last 7 items for density
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [pendingRevenue, candidates.length]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 px-4 md:px-0">
      
      {/* High-Density Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Fiscal Reserve', value: `$${pendingRevenue.toLocaleString()}`, sub: '+12% vs Lwk', icon: <Wallet size={20} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Growth Queue', value: candidates.length, sub: '5 New Apps', icon: <Users size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'System Health', value: '99.9%', sub: 'All Nodes Active', icon: <ShieldCheck size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: 'Active Faculty', value: '142', sub: '84% Utilization', icon: <Activity size={20} />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        ].map((m, i) => (
          <div key={i} className={`p-6 rounded-2xl bg-white border ${m.border} shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{m.label}</p>
                <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{m.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
                {m.icon}
              </div>
            </div>
            <div className="flex items-center gap-2">
               {m.sub.includes('+') || m.sub.includes('Active') || m.sub.includes('Optimal') ? <ArrowUpRight size={14} className="text-emerald-500"/> : <Activity size={14} className="text-slate-400"/>}
               <span className="text-xs font-bold text-slate-500">{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Main Strategic Pulse */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                   <Activity size={20} className="text-blue-600"/> Network Load Velocity
                </h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time throughput analysis</p>
              </div>
              <button onClick={() => setIsSyncing(true)} className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOMENTUM_DATA}>
                  <defs>
                    <linearGradient id="chartLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontWeight: 'bold', fontSize: '12px' }} 
                    cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="throughput" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#chartLoad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* COMPACT LIVE OPERATIONS TABLE */}
             <div className="bg-slate-900 p-6 rounded-[32px] text-white overflow-hidden flex flex-col h-96 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                   <h4 className="text-sm font-black uppercase flex items-center gap-3">
                      <Radio className="text-emerald-400 animate-pulse" size={16} /> Live Ops Stream
                   </h4>
                   <span className="text-[10px] font-mono text-slate-400 bg-white/10 px-2 py-1 rounded">Live</span>
                </div>
                <div className="flex-1 overflow-hidden relative z-10">
                   <div className="space-y-1">
                      {liveFeed.map((log) => (
                         <div key={log.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] animate-in slide-in-from-right-4 fade-in duration-300">
                            <div className={`w-1.5 h-1.5 rounded-full ${log.type === 'security' ? 'bg-rose-500' : log.type === 'finance' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                            <span className="font-mono text-slate-400 w-12">{new Date().getSeconds()}s</span>
                            <span className="font-bold text-white flex-1 truncate">{log.action}</span>
                            <span className="font-mono text-slate-500">{log.user}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                   <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-3 mb-6">
                      <Server className="text-indigo-600" size={18} /> Node Status
                   </h4>
                   <div className="space-y-4">
                      {[
                        { label: 'Primary DB (Supabase)', val: '99.9%', status: 'Stable', color: 'bg-emerald-500' },
                        { label: 'Realtime (Firebase)', val: '12ms', status: 'Low Latency', color: 'bg-blue-500' },
                        { label: 'AI Inference (Gemini)', val: 'Active', status: 'Ready', color: 'bg-purple-500' },
                      ].map((n, i) => (
                         <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                               <div className={`w-2 h-2 rounded-full ${n.color}`}></div>
                               <span className="text-[10px] font-bold text-slate-600 uppercase">{n.label}</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-900">{n.status}</span>
                         </div>
                      ))}
                   </div>
                </div>
                <button onClick={() => onNavigate('settings')} className="w-full mt-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-all">
                   Manage Infrastructure
                </button>
             </div>
          </div>
        </div>

        {/* Neural Strategic Feed */}
        <div className="space-y-6">
           <div className="bg-slate-950 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group border-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/10 rounded-xl"><Database className="text-blue-400" size={20} /></div>
                    <h4 className="font-black uppercase tracking-tighter text-lg text-white">Neural Hub</h4>
                 </div>
                 <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-6">
                    <p className="text-blue-100/90 leading-relaxed text-xs font-medium font-mono">
                       "{aiSummary}"
                    </p>
                 </div>
                 <button onClick={() => onNavigate('settings')} className="w-full py-4 bg-white text-slate-950 font-black rounded-xl hover:bg-blue-50 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95">
                    <Zap size={14} /> Optimize Logic
                 </button>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-3">
                 <Globe size={16} className="text-blue-600" /> Executive Actions
              </h4>
              <div className="grid grid-cols-1 gap-2">
                 {[
                   { label: 'Student Information System', id: 'students', icon: 'ID' },
                   { label: 'Financial Ledger', id: 'finance', icon: '$' },
                   { label: 'Security & Access', id: 'security', icon: 'SEC' },
                   { label: 'Fleet Management', id: 'transport', icon: 'BUS' },
                 ].map(item => (
                    <button key={item.id} onClick={() => onNavigate(item.id)} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all group">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black bg-white text-slate-900 px-2 py-1 rounded group-hover:bg-white/20 group-hover:text-white">{item.icon}</span>
                          <span className="text-xs font-bold uppercase tracking-wide">{item.label}</span>
                       </div>
                       <ArrowUpRight size={14} className="opacity-50 group-hover:opacity-100" />
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
