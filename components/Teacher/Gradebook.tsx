
import React, { useState, useEffect } from 'react';
import { GraduationCap, Sparkles, TrendingUp, Download, Check } from 'lucide-react';
import { analyzeGrades } from '../../services/geminiService';

const Gradebook: React.FC = () => {
  const [grades, setGrades] = useState([
    { id: 'STU001', name: 'Aiden Mitchell', quiz1: 85, mid: 92, final: 0 },
    { id: 'STU002', name: 'Sophia Chen', quiz1: 95, mid: 88, final: 0 },
    { id: 'STU003', name: 'Marcus Johnson', quiz1: 65, mid: 70, final: 0 },
    { id: 'STU004', name: 'Emma Wilson', quiz1: 98, mid: 96, final: 0 },
  ]);
  const [aiAnalysis, setAiAnalysis] = useState("Analyzing class results...");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const res = await analyzeGrades(grades);
      setAiAnalysis(res);
    };
    fetchAnalysis();
  }, []);

  const updateGrade = (id: string, key: string, val: string) => {
    const numVal = parseInt(val) || 0;
    setGrades(prev => prev.map(g => g.id === id ? { ...g, [key]: numVal } : g));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-1">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Class Gradebook</h2>
          <p className="text-slate-500 font-medium">Advanced Mathematics • Semester 1 Analysis</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm">
            <Download size={18} /> <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={handleSave}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all text-sm shadow-xl ${
              isSaving ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'
            }`}
          >
            {isSaving ? <Check size={18} /> : <GraduationCap size={18} />}
            {isSaving ? "Sync Complete" : "Save Grades"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card rounded-[40px] shadow-2xl overflow-hidden border-none bg-white/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 sticky left-0 bg-slate-50 md:bg-transparent z-10 min-w-[200px]">Student Profile</th>
                  <th className="px-4 py-6 text-center min-w-[120px]">Quiz 1 (10%)</th>
                  <th className="px-4 py-6 text-center min-w-[120px]">Midterm (30%)</th>
                  <th className="px-4 py-6 text-center min-w-[120px]">Final (60%)</th>
                  <th className="px-8 py-6 text-right min-w-[120px]">Weighted Avg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((stu) => {
                  const avg = ((stu.quiz1 * 0.1) + (stu.mid * 0.3) + (stu.final * 0.6)).toFixed(1);
                  return (
                    <tr key={stu.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5 sticky left-0 bg-white md:bg-transparent z-10 group-hover:bg-blue-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${stu.name}`} className="w-8 h-8 rounded-lg shadow-sm" alt="" />
                          <span className="font-bold text-slate-800">{stu.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input 
                          type="number" 
                          value={stu.quiz1} 
                          onChange={(e) => updateGrade(stu.id, 'quiz1', e.target.value)}
                          className="w-20 text-center bg-slate-50/80 border-none rounded-xl font-black text-blue-600 focus:ring-4 focus:ring-blue-100 transition-all py-2" 
                        />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input 
                          type="number" 
                          value={stu.mid} 
                          onChange={(e) => updateGrade(stu.id, 'mid', e.target.value)}
                          className="w-20 text-center bg-slate-50/80 border-none rounded-xl font-black text-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all py-2" 
                        />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input 
                          type="number" 
                          value={stu.final} 
                          onChange={(e) => updateGrade(stu.id, 'final', e.target.value)}
                          className="w-20 text-center bg-slate-50/80 border-none rounded-xl font-black text-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all py-2" 
                        />
                      </td>
                      <td className="px-8 py-5 text-right font-black text-slate-900 text-xl tracking-tight">{avg}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[40px] bg-gradient-to-br from-indigo-600 to-blue-700 text-white relative overflow-hidden shadow-2xl">
            <Sparkles className="absolute -right-2 -top-2 w-24 h-24 opacity-20" />
            <h4 className="font-black text-sm tracking-wider uppercase flex items-center gap-2 mb-6">
              <TrendingUp size={20} /> AI Class Synthesis
            </h4>
            <div className="bg-white/10 p-5 rounded-[24px] border border-white/10">
              <p className="text-xs leading-relaxed opacity-95 italic font-medium">
                "{aiAnalysis}"
              </p>
            </div>
          </div>
          
          <div className="glass-card p-8 rounded-[40px] shadow-lg">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Analytic Stats</h4>
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="text-sm font-bold text-slate-500">Class Mean</span>
                <span className="font-black text-blue-600 text-lg">82.4%</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="text-sm font-bold text-slate-500">Max Index</span>
                <span className="font-black text-emerald-600 text-lg">96%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Low Variance</span>
                <span className="font-black text-rose-500 text-lg">1 Student</span>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
              Initiate Peer Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gradebook;
