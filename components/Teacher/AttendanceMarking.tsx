import React, { useState } from 'react';
import { UserCheck, UserX, Save, CheckCircle2, Search, Filter } from 'lucide-react';

const INITIAL_STUDENTS = [
  { id: 'STU001', name: 'Aiden Mitchell', status: 'present' },
  { id: 'STU002', name: 'Sophia Chen', status: 'present' },
  { id: 'STU003', name: 'Marcus Johnson', status: 'absent' },
  { id: 'STU004', name: 'Emma Wilson', status: 'present' },
  { id: 'STU005', name: 'Liam Garcia', status: 'late' },
];

const AttendanceMarking: React.FC = () => {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [saved, setSaved] = useState(false);

  const toggleStatus = (id: string, newStatus: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    setSaved(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-emerald-500 text-white';
      case 'late': return 'bg-amber-500 text-white';
      case 'absent': return 'bg-rose-500 text-white';
      default: return 'bg-slate-100 text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 px-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Attendance Log</h2>
          <p className="text-slate-500 font-bold italic mt-1">Advanced Calculus • Section A • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button 
          onClick={() => setSaved(true)}
          className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${
            saved ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 hover:translate-y-[-2px]'
          }`}
        >
          {saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {saved ? 'Log Synchronized' : 'Finalize Attendance'}
        </button>
      </div>

      <div className="glass-card rounded-[40px] overflow-hidden border-none shadow-2xl">
        <div className="p-5 md:p-8 bg-white/40 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Quick search student name..." 
              className="w-full pl-14 pr-6 py-4 bg-white/80 border-none rounded-[20px] focus:ring-4 focus:ring-blue-100 text-sm font-bold shadow-inner"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-4 glass-card text-slate-600 rounded-[20px] font-black text-[10px] uppercase tracking-widest">
            <Filter size={16} /> Filter List
          </button>
        </div>

        {/* Desktop View Table */}
        <div className="hidden lg:block">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] border-b border-slate-100">
              <tr>
                <th className="px-10 py-6">Identity Profile</th>
                <th className="px-10 py-6 text-center">Mark Presence Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((stu) => (
                <tr key={stu.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stu.name}`} 
                        className="w-12 h-12 rounded-[18px] border-2 border-white shadow-lg group-hover:scale-110 transition-transform" 
                        alt="" 
                      />
                      <div>
                        <p className="font-black text-slate-900 text-lg leading-tight">{stu.name}</p>
                        <p className="text-[10px] text-slate-400 font-black font-mono tracking-widest uppercase mt-0.5">{stu.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-center gap-3">
                      {['present', 'late', 'absent'].map((status) => (
                        <button
                          key={status}
                          onClick={() => toggleStatus(stu.id, status)}
                          className={`min-w-[120px] px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-90 ${
                            stu.status === status 
                            ? getStatusColor(status) + ' shadow-xl'
                            : 'bg-slate-100 text-slate-400 hover:bg-white hover:shadow-md'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden p-5 space-y-4 bg-white/30">
          {students.map((stu) => (
            <div key={stu.id} className="bg-white/80 backdrop-blur-md p-6 rounded-[32px] border border-slate-100 shadow-sm relative group active:scale-95 transition-all">
              <div className="flex items-center gap-5 mb-6">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stu.name}`} 
                  className="w-16 h-16 rounded-2xl border-2 border-white shadow-md" 
                  alt="" 
                />
                <div className="flex-1">
                  <p className="font-black text-slate-900 text-xl tracking-tight leading-none">{stu.name}</p>
                  <p className="text-[10px] text-slate-400 font-black font-mono tracking-widest uppercase mt-1.5">{stu.id}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {['present', 'late', 'absent'].map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleStatus(stu.id, status)}
                    className={`flex-1 py-3.5 rounded-[18px] text-[9px] font-black uppercase tracking-[0.1em] transition-all ${
                      stu.status === status 
                      ? getStatusColor(status) + ' shadow-lg'
                      : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceMarking;