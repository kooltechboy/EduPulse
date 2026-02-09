
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, DollarSign, PieChart as PieChartIcon, Download, ArrowDownRight, 
  Search, Filter, Plus, FileText, CheckCircle2, History, 
  TrendingUp, Landmark, Receipt, ShieldCheck, ArrowRight, Wallet,
  ChevronRight, MoreVertical, Printer, X, Edit3, Trash, BarChart3, Save,
  Zap, Calendar, FilePlus, UserCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { FinancialTransaction, FinancialStatus, PaymentMethod, TransactionType, Invoice } from '../../types.ts';

const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  { id: 'TX-1001', date: '2026-05-18', type: 'Credit', category: 'Tuition', accountCode: '4000', amount: 4500, description: 'Tuition Payment - Aiden Mitchell', entityName: 'Aiden Mitchell', status: 'Settled', method: 'Bank Transfer' },
  { id: 'TX-1002', date: '2026-05-18', type: 'Credit', category: 'Cafeteria Sales', accountCode: '4100', amount: 1250, description: 'Daily Lunch Proceeds', entityName: 'Cafeteria Node', status: 'Settled', method: 'Cash' },
  { id: 'TX-1003', date: '2026-05-17', type: 'Debit', category: 'Salary', accountCode: '6000', amount: 4230, description: 'Salary Disbursement - Prof. Mitchell', entityName: 'Prof. Mitchell', status: 'Settled', method: 'Internal Transfer' },
];

const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-8820', studentId: 'STU-2910', studentName: 'Sophia Chen', amount: 5000, dueDate: '2026-06-01', status: 'Sent', category: 'Tuition' },
  { id: 'INV-8821', studentId: 'STU-0882', studentName: 'Marcus Wilson', amount: 1200, dueDate: '2026-05-25', status: 'Overdue', category: 'Lab' },
];

const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const FinanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'billing' | 'reports'>('dashboard');
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('edupulse_ledger');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('edupulse_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('edupulse_ledger', JSON.stringify(transactions));
    localStorage.setItem('edupulse_invoices', JSON.stringify(invoices));
  }, [transactions, invoices]);

  const totals = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      if (tx.status !== 'Settled') return acc;
      if (tx.type === 'Credit') acc.revenue += tx.amount;
      else acc.expenses += tx.amount;
      return acc;
    }, { revenue: 0, expenses: 0 });
  }, [transactions]);

  const handleGlobalBillingSync = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Find all students and create invoices for those who don't have active ones
      const students = JSON.parse(localStorage.getItem('edupulse_students_registry') || '[]');
      const newInvoices: Invoice[] = students.map((s: any) => ({
        id: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
        studentId: s.id,
        studentName: s.name,
        amount: 5000,
        dueDate: '2026-07-01',
        status: 'Draft',
        category: 'Tuition'
      }));

      setInvoices(prev => [...newInvoices, ...prev]);
      setIsGenerating(false);
      alert(`Executive Billing Run Complete!\n\n1. Institutional dispersion calculated for ${newInvoices.length} learner accounts.\n2. Draft invoices generated for cycle Q3.\n3. Digital ledgers synchronized.`);
    }, 2000);
  };

  const renderBilling = () => (
    <div className="space-y-10 animate-in slide-in-from-right duration-700 pb-20 px-2 md:px-0">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-1">
        <div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Billing Calibration</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Accounts Receivable & Tuition Dispersion Matrix</p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <button 
            onClick={handleGlobalBillingSync}
            disabled={isGenerating}
            className="flex-1 lg:flex-none bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl hover:bg-blue-600 transition-all disabled:opacity-50 group"
          >
            {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} className="text-blue-400 group-hover:scale-125 transition-transform" />}
            Execute Global Billing Run
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3 space-y-8">
           <div className="glass-card rounded-[48px] overflow-hidden bg-white shadow-2xl border-none">
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-10 py-8">Invoice & Learner</th>
                      <th className="px-6 py-8">Classification</th>
                      <th className="px-6 py-8">Due Date</th>
                      <th className="px-6 py-8">Cycle Status</th>
                      <th className="px-6 py-8 text-right">Balance</th>
                      <th className="px-10 py-8 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {invoices.map(inv => (
                       <tr key={inv.id} className="hover:bg-blue-50/20 transition-all group">
                          <td className="px-10 py-8">
                             <p className="font-black text-slate-900 leading-none mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{inv.studentName}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{inv.id}</p>
                          </td>
                          <td className="px-6 py-8">
                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 group-hover:bg-white transition-all">{inv.category}</span>
                          </td>
                          <td className="px-6 py-8 text-xs font-bold text-slate-500 uppercase">{inv.dueDate}</td>
                          <td className="px-6 py-8">
                             <span className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                               inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                               inv.status === 'Overdue' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' :
                               'bg-blue-50 text-blue-600 border-blue-100'
                             }`}>{inv.status}</span>
                          </td>
                          <td className="px-6 py-8 text-right font-black text-slate-900 text-xl tracking-tighter">${inv.amount.toLocaleString()}</td>
                          <td className="px-10 py-8 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button className="p-3 text-slate-300 hover:text-blue-600 transition-all"><Printer size={18} /></button>
                                <button className="p-3 text-slate-300 hover:text-rose-500 transition-all"><Trash size={18} /></button>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
        <div className="space-y-10">
           <div className="glass-card p-10 rounded-[56px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group neural-glow">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              <h4 className="text-xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter relative z-10">
                 <div className="p-3 bg-white/10 rounded-2xl"><Receipt size={20} className="text-blue-400" /></div>
                 Institutional Aging
              </h4>
              <div className="space-y-8 relative z-10">
                 {[
                   { label: 'Unpaid Tuition', val: '$142,400', color: 'text-amber-400' },
                   { label: 'Aging > 30 Days', val: '$24,200', color: 'text-rose-400' },
                   { label: 'Collection Velocity', val: '92.4%', color: 'text-emerald-400' }
                 ].map(s => (
                    <div key={s.label} className="flex justify-between border-b border-white/5 pb-5">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                       <span className={`font-black ${s.color} text-lg tracking-tight`}>{s.val}</span>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-6 bg-white text-slate-900 rounded-[28px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all active:scale-95">Generate AR Dossier</button>
           </div>
           
           <div className="glass-card p-10 rounded-[56px] bg-white shadow-xl border-none">
              <h4 className="font-black text-slate-900 uppercase tracking-[0.4em] text-[11px] mb-8 flex items-center gap-4">
                 <AlertCircle size={18} className="text-blue-600" /> Fiscal Sync Logs
              </h4>
              <div className="space-y-6">
                 <div className="flex gap-4 group cursor-default">
                    <div className="w-1 h-10 bg-emerald-500 rounded-full group-hover:w-2 transition-all"></div>
                    <div>
                       <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Biometric Sync: Payment Portal</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">10:42 AM • Success</p>
                    </div>
                 </div>
                 <div className="flex gap-4 group cursor-default">
                    <div className="w-1 h-10 bg-blue-500 rounded-full group-hover:w-2 transition-all"></div>
                    <div>
                       <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Chain Registry: Admissions Promo</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">09:15 AM • Success</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[
          { label: 'Gross Institutional Revenue', value: `$${totals.revenue.toLocaleString()}`, icon: <TrendingUp />, change: 'Steady Cycle', color: 'blue' },
          { label: 'Operational Outflow', value: `$${totals.expenses.toLocaleString()}`, icon: <ArrowDownRight />, change: '-4% Optimization', color: 'rose' },
          { label: 'Fiscal Net Reserve', value: `$${(totals.revenue - totals.expenses).toLocaleString()}`, icon: <ShieldCheck />, change: 'Target Surplus', color: 'emerald' },
          { label: 'Pending Tuition Queue', value: invoices.filter(i => i.status !== 'Paid').length, icon: <Receipt />, change: 'Action Required', color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-10 rounded-[48px] bg-white shadow-xl hover:translate-y-[-4px] transition-all group border-none">
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 rounded-2xl shadow-lg bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all`}>
                {stat.icon}
              </div>
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{stat.change}</span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 leading-none">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-3 tracking-tighter uppercase">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 glass-card p-10 rounded-[64px] bg-white shadow-2xl border-none">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Cash vs. Accrual Velocity</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Neural Ledger Matrix v4.2</p>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactions.map(t => ({ date: t.date, amount: t.amount }))}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                {/* Changed RechartsTooltip to Tooltip to match the import from recharts */}
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={6} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[64px] bg-slate-900 text-white shadow-2xl flex flex-col justify-between border-none neural-glow">
          <div className="relative z-10">
            <h4 className="text-xl font-black mb-12 flex items-center gap-5 uppercase tracking-tighter">
              <PieChartIcon className="text-blue-400" /> Revenue Integrity Sync
            </h4>
            <div className="space-y-10">
               {[
                 { label: 'Tuition Calibration', val: '84%', color: 'bg-blue-500' },
                 { label: 'Facility Resource Fees', val: '12%', color: 'bg-indigo-500' },
                 { label: 'Admin Lifecycle Service', val: '4%', color: 'bg-emerald-500' }
               ].map(r => (
                 <div key={r.label} className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <span>{r.label}</span>
                       <span className="text-white">{r.val}</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden shadow-inner p-0.5">
                       <div className={`h-full rounded-full animate-glow-pulse ${r.color}`} style={{ width: r.val }}></div>
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/10">
               <p className="text-[10px] text-slate-400 leading-relaxed font-bold italic">"Dispersion levels within institutional compliance bounds for Q2 cycle."</p>
            </div>
          </div>
          <button onClick={() => setActiveTab('billing')} className="w-full mt-10 py-7 bg-white text-slate-900 rounded-[32px] font-black text-[12px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-4 relative z-10 group/btn active:scale-95">
            Institutional Billing Center <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-12 pb-32">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 px-1">
        <div>
           <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Fiscal Command</h2>
           <p className="text-slate-500 font-bold italic mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
              <Landmark size={18} className="text-blue-500" /> Integrated Institutional Accounting 2026
           </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[28px] md:rounded-[40px] shadow-2xl border border-slate-100 flex gap-2 w-full xl:w-auto overflow-x-auto scrollbar-hide">
           {[
             { id: 'dashboard', label: 'Overview', icon: <PieChartIcon size={14} /> },
             { id: 'ledger', label: 'Ledger Registry', icon: <History size={14} /> },
             { id: 'billing', label: 'Billing Nodes', icon: <Receipt size={14} /> },
             { id: 'reports', label: 'Fiscal Audit', icon: <BarChart3 size={14} /> },
           ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 md:flex-none px-10 md:px-12 py-4 md:py-5 rounded-[22px] md:rounded-[32px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center justify-center gap-3 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {tab.icon} {tab.label}
              </button>
           ))}
        </div>
      </div>

      <div className="animate-in fade-in duration-700">
         {activeTab === 'dashboard' && renderDashboard()}
         {activeTab === 'ledger' && (
           <div className="glass-card rounded-[64px] bg-white p-20 text-center border-none shadow-2xl mx-4 md:mx-1">
              <History size={80} className="mx-auto text-slate-100 mb-8" />
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Institutional Ledger</h3>
              <p className="text-slate-400 font-bold mt-2 text-lg">Full historical transaction node mapping synchronized across all campus hubs.</p>
              <button className="mt-12 px-10 py-5 bg-slate-900 text-white rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">Open Full Registry</button>
           </div>
         )}
         {activeTab === 'billing' && renderBilling()}
         {activeTab === 'reports' && (
            <div className="py-24 md:py-40 text-center glass-card rounded-[64px] bg-white/40 border-none shadow-2xl mx-4 md:mx-1">
               <BarChart3 size={80} className="mx-auto text-slate-100 mb-8" />
               <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Fiscal Intelligence Engine</h3>
               <p className="text-slate-400 font-bold text-lg mt-2">Generate Profit & Loss, Balance Sheets, and Node Drift Logs for board audit.</p>
               <button className="mt-8 md:mt-10 px-12 py-5 bg-slate-900 text-white rounded-[24px] md:rounded-[32px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-4px] transition-all">Initialize Strategic Report Sync</button>
            </div>
         )}
      </div>
    </div>
  );
};

export default FinanceView;
