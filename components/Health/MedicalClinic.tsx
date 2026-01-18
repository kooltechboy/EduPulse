import React, { useState } from 'react';
import { 
  Stethoscope, ShieldAlert, HeartPulse, Search, Plus, 
  Filter, MoreVertical, X, CheckCircle2, AlertCircle, 
  // Fixed Pills to Pill as lucide-react doesn't export Pills
  Thermometer, Pill, History, ShieldCheck, Phone, Mail, 
  ChevronRight, Activity, Clock, Lock
} from 'lucide-react';
import { MedicalRecord } from '../../types';

const MOCK_RECORDS: MedicalRecord[] = [
  { id: 'MED-101', studentId: 'STU001', studentName: 'Alex Thompson', allergies: ['Peanuts', 'Penicillin'], medications: ['Advil (As needed)'], lastVisit: '2026-05-15', visitReason: 'Slight fever / Routine Check', immunizationStatus: 'Complete' },
  { id: 'MED-102', studentId: 'STU088', studentName: 'Sarah Miller', allergies: ['Latex'], medications: ['Daily Allergy Suppressant'], lastVisit: '2026-05-10', visitReason: 'Asthma inhaler sync', criticalInfo: 'Epi-pen located in Room B-102 locker.', immunizationStatus: 'Complete' },
];

const MedicalClinic: React.FC = () => {
  const [records] = useState<MedicalRecord[]>(MOCK_RECORDS);
  const [activeTab, setActiveTab] = useState<'registry' | 'visits' | 'compliance'>('registry');

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Bio-Vault Registry</h2>
          <p className="text-slate-500 font-black italic uppercase text-[10px] tracking-[0.5em] mt-3">Institutional Clinical Intelligence Hub 2026</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-slate-600">
              <ShieldCheck size={18} className="text-emerald-500" /> Vault Encrypted
           </button>
           <button className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-rose-600 transition-all">
             <Plus size={20} /> Register Visit
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Active Clinic Visits', value: '4', icon: <Activity className="text-rose-500" />, color: 'bg-rose-50' },
          { label: 'Critical Allergies', value: '12', icon: <ShieldAlert className="text-orange-500" />, color: 'bg-orange-50' },
          { label: 'Immunization Sync', value: '98%', icon: <CheckCircle2 className="text-emerald-500" />, color: 'bg-emerald-50' },
          { label: 'Next Audit', value: '12d', icon: <Clock className="text-blue-500" />, color: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-10 rounded-[48px] bg-white border-none shadow-xl">
             <div className={`p-4 w-fit rounded-2xl ${stat.color} mb-8 shadow-inner`}>{stat.icon}</div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
             <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-10">
           <div className="glass-card rounded-[64px] overflow-hidden bg-white shadow-2xl border-none">
              <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-6 bg-slate-50/50">
                <div className="relative flex-1 group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                   <input type="text" placeholder="Query student medical identities..." className="w-full pl-16 pr-6 py-5 bg-white border-none rounded-[28px] focus:ring-[12px] focus:ring-rose-100 font-bold transition-all" />
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                 {records.map(r => (
                    <div key={r.id} className="p-12 hover:bg-rose-50/10 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-10">
                       <div className="flex items-center gap-10">
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${r.studentName}`} className="w-20 h-20 rounded-[32px] border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-700" alt="" />
                          <div>
                             <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase group-hover:text-rose-600 transition-colors leading-none">{r.studentName}</h4>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">ID: {r.studentId} • Last Sync: {r.lastVisit}</p>
                          </div>
                       </div>
                       <div className="flex flex-wrap gap-4">
                          {r.allergies.map(a => (
                             <span key={a} className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100 shadow-sm flex items-center gap-2">
                                <AlertCircle size={12} /> {a}
                             </span>
                          ))}
                          <span className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">Imm: {r.immunizationStatus}</span>
                       </div>
                       <button className="p-5 bg-slate-50 text-slate-400 rounded-[28px] hover:bg-slate-900 hover:text-white transition-all"><ChevronRight size={24} /></button>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-10">
           <div className="glass-card p-12 rounded-[64px] bg-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12"><Stethoscope size={100} /></div>
              <h4 className="text-2xl font-black mb-12 flex items-center gap-5 uppercase tracking-tighter">
                 <div className="p-4 bg-rose-50 text-rose-600 rounded-[22px] shadow-inner"><History size={28} /></div>
                 Clinic Ledger
              </h4>
              <div className="space-y-10">
                 {[
                   { name: 'Alex Thompson', reason: 'Fatigue', time: '10:42 AM', status: 'Discharged' },
                   { name: 'Leo Sterling', reason: 'Physical Trauma (Gym)', time: '09:15 AM', status: 'In-Patient' },
                 ].map((v, i) => (
                    <div key={i} className="flex gap-8 group cursor-default">
                       <div className={`w-1.5 h-16 rounded-full ${v.status === 'Discharged' ? 'bg-emerald-100 group-hover:bg-emerald-500' : 'bg-rose-100 group-hover:bg-rose-500'} transition-all duration-500`}></div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                             <h5 className="font-black text-slate-900 text-lg tracking-tight uppercase leading-none">{v.name}</h5>
                             <span className="text-[8px] font-black uppercase bg-slate-100 px-2 py-0.5 rounded-full">{v.time}</span>
                          </div>
                          <p className="text-sm font-bold text-slate-500 mb-3">{v.reason}</p>
                          <span className={`text-[8px] font-black uppercase ${v.status === 'Discharged' ? 'text-emerald-500' : 'text-rose-500'}`}>{v.status}</span>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-14 py-6 border-4 border-slate-50 text-slate-400 font-black rounded-[32px] text-[11px] uppercase tracking-[0.3em] hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all active:scale-95">
                 Clinical Compliance Archive
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalClinic;