import React from 'react';
// Added missing ShieldAlert icon to the lucide-react import list
import { ShieldCheck, Activity, Users, MapPin, Radio, Bell, Database, CloudIcon, Zap, Globe, RefreshCw, ShieldAlert } from 'lucide-react';

const SecurityDashboard: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-1">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Security Command</h2>
          <p className="text-slate-500 font-black italic uppercase text-[10px] tracking-[0.4em] mt-3">Institutional Perimeter & Cloud Integrity Hub</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-full flex items-center gap-3 border border-emerald-100 font-black text-[10px] uppercase tracking-widest shadow-sm">
          <Radio size={16} className="animate-pulse" /> Live Node Monitoring Active
        </div>
      </div>

      {/* CORE STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Active Gates', value: '4/4', icon: <MapPin />, color: 'blue' },
          { label: 'Cloud Heartbeat', value: 'Nominal', icon: <Activity />, color: 'emerald' },
          { label: 'Access Events', value: '1,242', icon: <Users />, color: 'indigo' },
          { label: 'Cyber Integrity', value: '100%', icon: <ShieldCheck />, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-10 rounded-[48px] bg-white border-none shadow-xl hover:translate-y-[-4px] transition-all group">
            <div className={`p-4 w-fit rounded-2xl shadow-lg transition-transform group-hover:scale-110 mb-8 bg-${stat.color}-50 text-${stat.color}-600`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LOGS PANEL */}
        <div className="lg:col-span-2 glass-card rounded-[64px] overflow-hidden bg-white shadow-2xl border-none">
          <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Access Telemetry</h4>
            <div className="flex gap-4">
               <span className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-emerald-100 shadow-sm animate-pulse">
                  <Globe size={14} /> Real-time Feed
               </span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { name: 'Gateway Node: South', time: '10:42:12 AM', status: 'Authorized', icon: <ShieldCheck /> },
              { name: 'Identity Sync: Alex T.', time: '09:15:04 AM', status: 'Biometric Match', icon: <Users /> },
              { name: 'System Check: Firebase Pulse', time: '07:55:00 AM', status: 'Pulse Verified', icon: <CloudIcon /> },
              { name: 'System Check: Supabase Node', time: '04:00:15 AM', status: 'Registry Clear', icon: <Database /> },
            ].map((log, i) => (
              <div key={i} className="p-10 flex items-center justify-between hover:bg-slate-50 transition-all group">
                <div className="flex items-center gap-8">
                  <div className="p-5 bg-slate-100 rounded-3xl text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
                    {log.icon}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-xl tracking-tight leading-none mb-2 uppercase">{log.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{log.time}</p>
                  </div>
                </div>
                <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
          <div className="p-8 bg-slate-900 text-white flex justify-center items-center gap-8">
             <div className="flex items-center gap-3 text-[9px] font-black text-blue-400 uppercase tracking-widest">
                <Zap size={14} /> Neural Firewall Active
             </div>
             <div className="flex items-center gap-3 text-[9px] font-black text-blue-400 uppercase tracking-widest">
                <ShieldCheck size={14} /> 256-Bit SSL Synced
             </div>
          </div>
        </div>

        {/* CLOUD INTEGRITY PANEL */}
        <div className="space-y-10">
          <div className="glass-card p-12 rounded-[56px] bg-slate-950 text-white shadow-2xl relative overflow-hidden group neural-glow h-fit border-none">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40 transition-transform duration-[5s] group-hover:scale-125"></div>
            <div className="relative z-10">
              <h4 className="text-2xl font-black mb-12 flex items-center gap-5 uppercase tracking-tighter">
                <div className="p-4 bg-white/10 rounded-[22px] backdrop-blur-3xl shadow-inner border border-white/10"><CloudIcon size={28} className="text-blue-400" /></div>
                Cloud Integrity
              </h4>
              <div className="space-y-10">
                <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/10 transition-all group/node">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                         <Database className="text-emerald-400" size={20} />
                         <span className="text-xs font-black uppercase tracking-widest">Supabase Registry</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-400">99.99%</span>
                   </div>
                   <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-3">
                      <div className="bg-emerald-500 h-full rounded-full animate-glow-pulse" style={{ width: '100%' }}></div>
                   </div>
                   <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Status: Master Relational Stable</p>
                </div>

                <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/10 transition-all group/node">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                         <Zap className="text-blue-400" size={20} />
                         <span className="text-xs font-black uppercase tracking-widest">Firebase Pulse</span>
                      </div>
                      <span className="text-[10px] font-black text-blue-400">Synced</span>
                   </div>
                   <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-3">
                      <div className="bg-blue-500 h-full rounded-full animate-glow-pulse" style={{ width: '100%' }}></div>
                   </div>
                   <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Status: Real-time Comms Live</p>
                </div>
              </div>
              <button className="w-full mt-14 py-6 bg-white text-slate-900 rounded-[32px] font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-4 active:scale-95 group">
                Global Reset Sync <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>
          </div>
          
          <div className="glass-card p-10 rounded-[56px] bg-white shadow-xl flex flex-col justify-between border-none">
             <div className="space-y-8">
                <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-4">
                   {/* ShieldAlert is now imported and used correctly */}
                   <ShieldAlert className="text-rose-500" /> Alert Thresholds
                </h4>
                <div className="space-y-6">
                   <div className="flex justify-between border-b border-slate-50 pb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latency Trigger</span>
                      <span className="text-sm font-black text-slate-900 uppercase">250ms</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-50 pb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drift Tolerance</span>
                      <span className="text-sm font-black text-slate-900 uppercase">0.05%</span>
                   </div>
                </div>
             </div>
             <button className="mt-12 w-full py-5 border-2 border-slate-100 text-slate-400 font-black rounded-[28px] text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Configure Thresholds</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;