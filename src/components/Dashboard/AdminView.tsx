import React, { useEffect, useState } from 'react';
import {
  Users, Wallet, UserPlus, ShieldCheck,
  RefreshCw, TrendingUp, AlertCircle, Cpu, Zap,
  LayoutGrid, ArrowRight, Activity, School, GraduationCap,
  BookOpen, Clock
} from 'lucide-react';
import {
  CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis
} from 'recharts';
import { getCampusSummary } from '../../services/geminiService';
import { AdmissionsCandidate, Invoice } from '@/types';
import { useNavigate } from 'react-router-dom';

const MOMENTUM_DATA = [
  { name: 'Mon', revenue: 4200, growth: 42 },
  { name: 'Tue', revenue: 3800, growth: 48 },
  { name: 'Wed', revenue: 5100, growth: 55 },
  { name: 'Thu', revenue: 4600, growth: 52 },
  { name: 'Fri', revenue: 6200, growth: 68 },
];

const AdminView: React.FC = () => {
  const navigate = useNavigate();
  const [aiSummary, setAiSummary] = useState("Analyzing institutional metrics...");
  const [isSyncing, setIsSyncing] = useState(false);

  const candidates: AdmissionsCandidate[] = JSON.parse(localStorage.getItem('edupulse_admissions_pipeline') || '[]');
  const invoices: Invoice[] = JSON.parse(localStorage.getItem('edupulse_invoices') || '[]');
  const pendingRevenue = invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.amount, 0);

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await getCampusSummary({
        revenue: pendingRevenue,
        enrollment: candidates.length,
        cycle: 'Q2 2026'
      });
      setAiSummary(summary);
    };
    fetchSummary();
  }, [pendingRevenue, candidates.length]);

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">

      {/* Header Stat Overview */}
      <div className="flex flex-col md:flex-row gap-8 justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Academic Year 2025-2026 • Term 2</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm flex items-center gap-3">
            <Clock size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">10:42 AM</span>
          </div>
          <button className="primary-button px-4 py-2 text-sm flex items-center gap-2">
            Generate Report <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Executive Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Fiscal Reserve', value: `$${pendingRevenue.toLocaleString()}`, change: '+12%', trend: 'up', icon: <Wallet />, color: 'blue' },
          { label: 'Enrollment Queue', value: candidates.length, change: '+5%', trend: 'up', icon: <UserPlus />, color: 'emerald' },
          { label: 'Campus Health', value: '98%', change: 'Stable', trend: 'up', icon: <ShieldCheck />, color: 'indigo' },
          { label: 'Active Faculty', value: '142', change: '84% Load', trend: 'up', icon: <Users />, color: 'purple' },
        ].map((m, i) => (
          <div key={i} className="academic-card p-6 group hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-${m.color}-50 rounded-xl text-${m.color}-600 group-hover:bg-${m.color}-100 transition-colors`}>
                {m.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full border ${m.trend === 'up' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{m.change}</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{m.label}</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{m.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Strategic Pulse */}
        <div className="xl:col-span-2 space-y-8">
          <div className="academic-card p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Financial Momentum</h4>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">Revenue vs. Acquisitions</p>
              </div>
              <button onClick={() => setIsSyncing(true)} className="p-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-all">
                <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOMENTUM_DATA}>
                  <defs>
                    <linearGradient id="chartRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#1e293b', fontWeight: 'bold' }}
                    itemStyle={{ color: '#2563eb' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#chartRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="academic-card p-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2 mb-6 tracking-wider">
                <AlertCircle className="text-rose-500" size={16} /> Urgent Attentions
              </h4>
              <div className="space-y-3">
                {[
                  { msg: 'Grade 12 tuition discrepancies detected.', time: '2m ago', color: 'rose' },
                  { msg: 'Bus Fleet SCH-202 maintenance due.', time: '14m ago', color: 'amber' },
                  { msg: 'Q3 Curriculum draft finalized.', time: '1h ago', color: 'emerald' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className={`w-1 h-full bg-${log.color}-500 rounded-full`}></div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 leading-tight">{log.msg}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="academic-card p-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2 mb-6 tracking-wider">
                <Activity className="text-blue-500" size={16} /> Campus Activity
              </h4>
              <div className="space-y-6">
                {[
                  { label: 'Classrooms Active', val: '92%', color: 'bg-blue-500' },
                  { label: 'Library Utilization', val: '74%', color: 'bg-indigo-500' },
                  { label: 'System Uptime', val: '100%', color: 'bg-emerald-500' },
                ].map((n, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>{n.label}</span>
                      <span className="text-slate-900">{n.val}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${n.color}`} style={{ width: n.val }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Neural Feed */}
        <div className="space-y-6">
          <div className="academic-card p-6 shadow-md border-blue-100 bg-gradient-to-br from-white to-blue-50/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Cpu size={18} /></div>
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">AI Assistant</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4 shadow-sm">
              <p className="text-slate-600 text-xs font-medium leading-relaxed italic">
                "{aiSummary}"
              </p>
            </div>
            <button onClick={() => navigate('/settings')} className="w-full secondary-button py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2">
              Analyze Data <Zap size={14} />
            </button>
          </div>

          <div className="academic-card p-6">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
              <LayoutGrid size={16} className="text-slate-400" /> Module Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'SIS Hub', id: 'students', icon: <BookOpen size={14} /> },
                { label: 'Finance', id: 'finance', icon: <Wallet size={14} /> },
                { label: 'Security', id: 'security', icon: <ShieldCheck size={14} /> },
                { label: 'Fleet', id: 'transport', icon: <Activity size={14} /> },
              ].map(item => (
                <button key={item.id} onClick={() => navigate(`/${item.id}`)} className="p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md hover:border-blue-200 transition-all text-left border border-slate-100 group">
                  <div className="text-slate-400 mb-2 group-hover:text-blue-500 transition-colors">{item.icon}</div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">{item.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="academic-card p-6">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
              <School size={16} className="text-slate-400" /> Campus Stats
            </h4>
            <div className="space-y-4">
              {[
                { label: 'Primary', val: 420, color: 'emerald' },
                { label: 'Secondary', val: 512, color: 'blue' },
                { label: 'High School', val: 352, color: 'indigo' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-xs font-semibold text-slate-600">{stat.label}</span>
                  <span className={`text-xs font-bold text-${stat.color}-600 bg-${stat.color}-50 px-2 py-0.5 rounded-full`}>{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminView;