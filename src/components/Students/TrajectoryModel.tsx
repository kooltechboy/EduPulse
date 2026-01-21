import React, { useState, useMemo } from 'react';
import {
    TrendingUp, TrendingDown, AlertTriangle, Target,
    ChevronRight, Brain, Zap, Download, RefreshCw,
    Search, Filter, User, GraduationCap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Mock Data for Trajectory Modeling
const TRAJECTORY_DATA = [
    { month: 'Sep', gpa: 3.2, prediction: 3.2 },
    { month: 'Oct', gpa: 3.4, prediction: 3.4 },
    { month: 'Nov', gpa: 3.1, prediction: 3.1 },
    { month: 'Dec', gpa: 3.5, prediction: 3.5 },
    { month: 'Jan', prediction: 3.6, confidence: 0.92 },
    { month: 'Feb', prediction: 3.7, confidence: 0.88 },
    { month: 'Mar', prediction: 3.8, confidence: 0.85 },
];

const SKILL_MATRIX = [
    { subject: 'Cognitive', A: 120, B: 110, fullMark: 150 },
    { subject: 'Social', A: 98, B: 130, fullMark: 150 },
    { subject: 'Technical', A: 86, B: 130, fullMark: 150 },
    { subject: 'Creative', A: 99, B: 100, fullMark: 150 },
    { subject: 'Ethics', A: 85, B: 90, fullMark: 150 },
];

const TrajectoryModel: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    return (
        <div className="space-y-10 animate-fade-in-up pb-20">

            {/* Search & Filter Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search student telemetry node..."
                        className="w-full bg-slate-50 border-none px-16 py-5 rounded-[24px] text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <button className="secondary-button px-8 py-5 flex items-center gap-3">
                        <Filter size={18} /> Deep Filter
                    </button>
                    <button className="primary-button px-8 py-5 flex items-center gap-3" onClick={() => { setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 2000); }}>
                        {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <Brain size={18} />} Predictive Run
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">

                {/* Left Col: Persona & Summary */}
                <div className="space-y-8">
                    <div className="academic-card p-10 bg-slate-900 border-none text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform">
                            <GraduationCap size={120} />
                        </div>
                        <div className="relative z-10">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`} alt="student" className="w-24 h-24 rounded-[32px] border-4 border-white/10 mb-8" />
                            <h3 className="text-3xl font-black uppercase tracking-tighter">Alex Thompson</h3>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-2 flex items-center gap-3">
                                <Target size={14} /> Node: STU-112429 • Grade 12
                            </p>

                            <div className="mt-12 space-y-6">
                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">
                                        <span>Academic Momentum</span>
                                        <span className="text-emerald-400">+12.4%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: '78%' }}></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Current GPA</p>
                                        <p className="text-xl font-black">3.52</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Attendance</p>
                                        <p className="text-xl font-black">98.2%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="academic-card p-8 bg-blue-50 border-blue-100">
                        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Zap size={16} className="text-blue-600" /> Nexus Insight
                        </h4>
                        <p className="text-xs font-bold text-blue-800 leading-relaxed italic">
                            "Student shows high cognitive aptitude in abstract mathematics. Predicted GPA exit: 3.84 ± 0.05. Recommended: Advance to Honors Physics."
                        </p>
                    </div>
                </div>

                {/* Center: Trajectory Charts */}
                <div className="xl:col-span-3 space-y-10">

                    <div className="academic-card p-10 bg-white min-h-[500px]">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div>
                                <h4 className="text-xl font-black uppercase tracking-tighter">Performance Trajectory Modeling</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-Dimensional Growth & Predictive Drift</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                                    <span className="text-[10px] font-black uppercase text-slate-500">Actualized Data</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-blue-100 border border-blue-600/30 rounded-full"></span>
                                    <span className="text-[10px] font-black uppercase text-slate-500">Nexus Prediction</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={TRAJECTORY_DATA}>
                                    <defs>
                                        <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} domain={[0, 4]} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', padding: '20px' }}
                                        itemStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                                    />
                                    <Area type="monotone" dataKey="prediction" stroke="#2563eb" strokeWidth={4} strokeDasharray="10 10" fill="url(#colorGpa)" />
                                    <Area type="monotone" dataKey="gpa" stroke="#2563eb" strokeWidth={4} fill="url(#colorGpa)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="academic-card p-10 bg-white h-[450px]">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Skill Matrix Balance</h4>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_MATRIX}>
                                        <PolarGrid stroke="#f1f5f9" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                        <Radar name="Student" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
                                        <Radar name="Peers Avg" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="academic-card p-10 bg-white space-y-8">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Intervention Blueprint</h4>
                            <div className="space-y-4">
                                {[
                                    { label: 'Honors Calculus Fast-Track', priority: 'High', status: 'Proposed', icon: <TrendingUp className="text-emerald-500" /> },
                                    { label: 'Creative Expression Workshop', priority: 'Medium', status: 'Required', icon: <Target className="text-blue-500" /> },
                                    { label: 'Social Integration Elective', priority: 'Low', status: 'Optional', icon: <Zap className="text-amber-500" /> }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-100 rounded-[32px] hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">{item.icon}</div>
                                        <div className="flex-1">
                                            <p className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase leading-none mb-2">{item.label}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.priority} Potential Impact</p>
                                        </div>
                                        <ChevronRight className="text-slate-300 group-hover:text-blue-600 translate-x-0 group-hover:translate-x-1 transition-all" size={20} />
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-xl">
                                <Download size={16} /> Export Blueprint
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TrajectoryModel;
