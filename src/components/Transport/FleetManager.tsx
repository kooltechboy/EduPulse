
import React, { useState } from 'react';
import { Bus, MapPin, Phone, User, Activity, AlertCircle, Plus, Search, ChevronRight, Navigation } from 'lucide-react';
import { TransportRoute } from '@/types';

const MOCK_ROUTES: TransportRoute[] = [
  { id: 'R-01', name: 'West District Express', driver: 'Robert Brown', driverPhone: '+1-555-0101', busPlate: 'SCH-8821', capacity: 42, occupancy: 38, stops: ['Oak St', 'Pine Ave', 'Sunset Blvd'], status: 'On-Route' },
  { id: 'R-02', name: 'East Tier Shuttle', driver: 'Ms. Jenny', driverPhone: '+1-555-0202', busPlate: 'SCH-9102', capacity: 30, occupancy: 12, stops: ['Bridge Way', 'River Rd'], status: 'Idle' },
];

const FleetManager: React.FC = () => {
  const [routes] = useState<TransportRoute[]>(MOCK_ROUTES);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Campus Fleet Node</h2>
          <p className="text-slate-500 font-bold italic mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
            <Bus size={18} className="text-blue-500" /> Logistics & Transport Optimization 2026
          </p>
        </div>
        <button className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all flex items-center gap-4">
          <Navigation size={20} /> Register Fleet Unit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Units Active', value: '12 / 14', color: 'bg-blue-50 text-blue-600' },
          { label: 'System Uptime', value: '99.9%', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Avg Delay', value: '2.4m', color: 'bg-amber-50 text-amber-600' },
          { label: 'Critical Alerts', value: '0', color: 'bg-slate-50 text-slate-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-10 rounded-[48px] bg-white border-none shadow-xl">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
             <h4 className={`text-4xl font-black ${stat.color.split(' ')[1]}`}>{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {routes.map(route => (
          <div key={route.id} className="glass-card p-10 rounded-[56px] bg-white border-none shadow-xl hover:shadow-2xl transition-all group">
             <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-6">
                   <div className={`p-6 rounded-[32px] shadow-lg transition-transform group-hover:scale-110 ${route.status === 'On-Route' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <Bus size={32} />
                   </div>
                   <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-blue-600 transition-colors">{route.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{route.busPlate} • Capacity: {route.capacity}</p>
                   </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${route.status === 'On-Route' ? 'bg-emerald-50 text-emerald-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>{route.status}</span>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><User size={14} /> Assigned Driver</p>
                   <p className="text-sm font-black text-slate-900">{route.driver}</p>
                   <p className="text-[10px] font-bold text-blue-600 mt-2">{route.driverPhone}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Activity size={14} /> Passenger Load</p>
                   <p className="text-sm font-black text-slate-900">{route.occupancy} Students</p>
                   <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(route.occupancy/route.capacity)*100}%` }}></div>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Route Progression</p>
                <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-4">
                   {route.stops.map((stop, i) => (
                      <div key={i} className="flex items-center gap-4 whitespace-nowrap">
                         <div className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{stop}</div>
                         {i < route.stops.length - 1 && <ChevronRight size={16} className="text-slate-200" />}
                      </div>
                   ))}
                </div>
             </div>

             <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-4">
                Launch Live GPS Feed <Navigation size={18} />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FleetManager;
