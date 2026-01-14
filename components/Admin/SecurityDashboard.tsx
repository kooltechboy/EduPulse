
import React from 'react';
import { ShieldCheck, Activity, Users, MapPin, Radio, Bell } from 'lucide-react';

const SecurityDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Security Control</h2>
          <p className="text-slate-500">Campus digital safety & facility monitoring</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl flex items-center gap-2 border border-emerald-100 font-bold text-xs uppercase">
          <Radio size={16} className="animate-pulse" /> Live Monitoring Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Gates', value: '4/4', icon: <MapPin />, color: 'blue' },
          { label: 'Visitors Logged', value: '12', icon: <Users />, color: 'indigo' },
          { label: 'Campus Alerts', value: '0', icon: <Bell />, color: 'emerald' },
          { label: 'Network Integrity', value: '100%', icon: <Activity />, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl">
            <div className={`p-3 w-fit bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl mb-4`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-[32px] overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h4 className="font-black text-slate-900">Recent Access Logs</h4>
            <span className="text-xs font-bold text-blue-600 uppercase cursor-pointer">Live Feed</span>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { id: 'VIS-442', name: 'Vendor: Fresh Foods', time: '10:42 AM', gate: 'Main Entrance', status: 'Authorized' },
              { id: 'USR-882', name: 'Student: Alex Thompson', time: '08:15 AM', gate: 'Student Gate B', status: 'Authorized' },
              { id: 'TCH-112', name: 'Teacher: Prof. Mitchell', time: '07:55 AM', gate: 'Faculty Entry', status: 'Authorized' },
              { id: 'SEC-991', name: 'System Check', time: '04:00 AM', gate: 'Digital Perimeter', status: 'Verified' },
            ].map((log, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{log.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{log.gate} • {log.time}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[40px] border-blue-100 bg-blue-50/20">
            <h4 className="font-black text-slate-900 mb-6">Device Status</h4>
            <div className="space-y-4">
              {['Smart Locks', 'Surveillance', 'Wi-Fi Nodes', 'Fire Alarm'].map((device) => (
                <div key={device} className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-600">{device}</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase">Online</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all">
              Initiate System Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
