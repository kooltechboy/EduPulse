import React, { useState } from 'react';
import { Package, ShieldCheck, AlertTriangle, Plus, Search, Filter, History, Activity, ArrowRight, Layers, HeartPulse, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import { CampusAsset } from '../../types';

const INITIAL_ASSETS: CampusAsset[] = [
  { id: 'AST-9901', name: 'HP EliteDesk 800 G6 Cluster', category: 'Electronics', status: 'Functional', location: 'Lab 4', value: 12000, lastAudit: '2024-05-10', healthIndex: 92 },
  { id: 'AST-4402', name: 'Digital Microscope Node B-200', category: 'Lab', status: 'Maintenance', location: 'Biology Wing', value: 8500, lastAudit: '2024-05-12', healthIndex: 45, nextMaintenance: '2026-05-25' },
  { id: 'AST-1102', name: 'Smart Classroom Kit Set (20)', category: 'Media', status: 'Functional', location: 'Room 202', value: 15000, lastAudit: '2024-04-20', healthIndex: 80 },
];

const InventoryHub: React.FC = () => {
  const [assets] = useState<CampusAsset[]>(INITIAL_ASSETS);

  const getHealthColor = (index: number) => {
    if (index > 80) return 'text-emerald-500';
    if (index > 50) return 'text-amber-500';
    return 'text-rose-500 animate-pulse';
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 px-2 md:px-0">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Resource Asset Node</h2>
          <p className="text-slate-500 font-bold italic mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
            <Package size={18} className="text-blue-500" /> Unified Physical Identity Registry 2026
          </p>
        </div>
        <button className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-blue-600 transition-all shadow-2xl active:scale-95 group">
          <Plus size={22} className="group-hover:rotate-90 transition-transform" /> Audit Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Institutional Equity', value: '$452,000', icon: <Layers />, color: 'bg-blue-50 text-blue-600' },
          { label: 'System Operationality', value: '94.2%', icon: <ShieldCheck />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Maintenance Node', value: '12 Units', icon: <RefreshCw />, color: 'bg-rose-50 text-rose-600' },
          { label: 'Lifecycle Drift', value: '-2.4%', icon: <Activity />, color: 'bg-slate-50 text-slate-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-10 rounded-[48px] bg-white border-none shadow-xl group hover:translate-y-[-4px] transition-all">
            <div className={`p-4 w-fit rounded-2xl shadow-lg transition-transform group-hover:scale-110 mb-8 ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-[56px] overflow-hidden bg-white shadow-2xl border-none">
        <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row gap-6 bg-slate-50/30">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={22} />
            <input type="text" placeholder="Query institutional asset serials or identifiers..." className="w-full pl-16 pr-6 py-6 bg-white border-none rounded-[32px] focus:ring-[12px] focus:ring-blue-100/50 font-bold transition-all text-lg shadow-inner" />
          </div>
          <button className="px-10 py-6 bg-white border border-slate-200 text-slate-600 rounded-[32px] font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
            <Filter size={20} /> Advanced Filters
          </button>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] border-b border-slate-100">
              <tr>
                <th className="px-12 py-8">Asset Profile</th>
                <th className="px-8 py-8">Classification</th>
                <th className="px-8 py-8">Node Telemetry</th>
                <th className="px-8 py-8 text-center">Health Index</th>
                <th className="px-12 py-8 text-right">Audit Registry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map(a => (
                <tr key={a.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-8">
                      <div className="p-5 bg-slate-100 rounded-[24px] text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                        {a.category === 'Electronics' ? <Monitor size={24} /> : a.category === 'Media' ? <Smartphone size={24} /> : <Package size={24} />}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-xl leading-none mb-2 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{a.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 font-bold tracking-widest">{a.id} • Audit: {a.lastAudit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-10">
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100 group-hover:bg-white transition-all">{a.category}</span>
                  </td>
                  <td className="px-8 py-10">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${a.status === 'Functional' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse'}`}></div>
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{a.location}</span>
                    </div>
                  </td>
                  <td className="px-8 py-10">
                     <div className="flex flex-col items-center gap-2">
                        <span className={`text-2xl font-black ${getHealthColor(a.healthIndex)}`}>{a.healthIndex}%</span>
                        <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                           <div className={`h-full rounded-full transition-all duration-1000 ${a.healthIndex > 80 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : a.healthIndex > 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${a.healthIndex}%` }}></div>
                        </div>
                     </div>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {a.healthIndex < 60 && (
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl animate-bounce" title="Maintenance Required">
                          <AlertTriangle size={18} />
                        </div>
                      )}
                      <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><History size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[56px] bg-slate-950 text-white relative overflow-hidden shadow-2xl group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40 transition-transform duration-[4s] group-hover:scale-125"></div>
          <div className="relative z-10">
            <h4 className="text-2xl font-black mb-10 flex items-center gap-5 uppercase tracking-tighter">
              <div className="p-4 bg-white/10 rounded-[22px] backdrop-blur-3xl shadow-inner"><Activity size={28} className="text-blue-400" /></div>
              Predictive Lifecycle Dashboard
            </h4>
            <div className="space-y-8">
              {[
                { label: 'Tech Refresh Cycle', progress: 78, status: 'On Track' },
                { label: 'Lab Reagent Buffer', progress: 32, status: 'Critical' },
                { label: 'Media Lab Node Health', progress: 94, status: 'Optimal' }
              ].map((m, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest block mb-1">{m.label}</span>
                      <span className="text-2xl font-black">{m.progress}%</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${m.status === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-slate-400'}`}>{m.status}</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-[2s] ${m.status === 'Critical' ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${m.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="glass-card p-10 rounded-[56px] bg-white shadow-xl flex flex-col justify-between">
          <div>
             <h4 className="text-lg font-black mb-8 uppercase tracking-tighter flex items-center gap-4 text-slate-900">
                <HeartPulse className="text-rose-500" /> Asset Wellness Audit
             </h4>
             <p className="text-sm text-slate-500 font-medium leading-relaxed italic mb-8">"Neural telemetry suggests 4 nodes in the Biology Wing are entering a high-drift phase. Pre-audit scheduled for Friday."</p>
             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 font-black">4</div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nodes Requiring Action</p>
                   <p className="text-xs font-bold text-slate-900">Lab Cluster 4, Kit 08...</p>
                </div>
             </div>
          </div>
          <button className="w-full mt-10 py-6 bg-slate-900 text-white rounded-[32px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4 group">
            Global Health Sync <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryHub;