
import React, { useState } from 'react';
import { Package, ShieldCheck, AlertTriangle, Plus, Search, Filter, History, Tool, Activity, ArrowRight, Layers } from 'lucide-react';
import { CampusAsset } from '../../types';

const INITIAL_ASSETS: CampusAsset[] = [
  { id: 'AST-9901', name: 'HP EliteDesk 800 G6', category: 'Electronics', status: 'Functional', location: 'Lab 4', value: 1200, lastAudit: '2024-05-10' },
  { id: 'AST-4402', name: 'Microscope B-200', category: 'Lab', status: 'Maintenance', location: 'Biology Wing', value: 850, lastAudit: '2024-05-12' },
  { id: 'AST-1102', name: 'Football Kit Set (20)', category: 'Sports', status: 'Functional', location: 'Gym Storage', value: 500, lastAudit: '2024-04-20' },
];

const InventoryHub: React.FC = () => {
  const [assets] = useState<CampusAsset[]>(INITIAL_ASSETS);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Institutional Inventory</h2>
          <p className="text-slate-500 font-bold italic mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
            <Package size={18} className="text-blue-500" /> Unified Physical Asset Registry 2026
          </p>
        </div>
        <button className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 hover:bg-blue-600 transition-all shadow-2xl active:scale-95">
          <Plus size={20} /> Register New Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Equity', value: '$452,000', icon: <Layers />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Operational', value: '94%', icon: <ShieldCheck />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Under Repair', value: '12 Items', icon: <AlertTriangle />, color: 'bg-rose-50 text-rose-600' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-10 rounded-[48px] bg-white border-none shadow-xl flex items-center gap-8">
            <div className={`p-5 rounded-3xl shadow-lg ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-3xl font-black text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-[48px] overflow-hidden bg-white shadow-2xl">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Query asset serials or identifiers..." className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[28px] focus:ring-4 focus:ring-blue-100 font-bold" />
          </div>
          <button className="px-10 py-5 bg-white border border-slate-100 text-slate-600 rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
            <Filter size={18} className="inline mr-2" /> Asset Filters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-10 py-8">Asset Name</th>
                <th className="px-8 py-8">Classification</th>
                <th className="px-8 py-8">Campus Placement</th>
                <th className="px-8 py-8">Status</th>
                <th className="px-10 py-8 text-right">Audit Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map(a => (
                <tr key={a.id} className="hover:bg-blue-50/20 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-slate-100 rounded-2xl text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all"><Package size={20} /></div>
                      <div>
                        <p className="font-black text-slate-900 text-lg leading-none mb-1">{a.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">{a.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8"><span className="text-xs font-black text-slate-700 uppercase tracking-widest">{a.category}</span></td>
                  <td className="px-8 py-8"><span className="text-xs font-bold text-slate-500">{a.location}</span></td>
                  <td className="px-8 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${a.status === 'Functional' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{a.status}</span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><History size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryHub;
