
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, DollarSign, PieChart as PieChartIcon, Download, ArrowDownRight, 
  Search, Filter, Plus, FileText, CheckCircle2, History, 
  TrendingUp, Landmark, Receipt, ShieldCheck, ArrowRight, Wallet,
  ChevronRight, MoreVertical, Printer, X, Edit3, Trash, BarChart3, Save,
  Zap, Calendar, FilePlus, UserCheck, AlertCircle, RefreshCw, Layers
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
  { id: 'TX-1004', date: '2026-05-16', type: 'Debit', category: 'Maintenance', accountCode: '6100', amount: 800, description: 'Lab Equipment Repair', entityName: 'Tech Services Inc', status: 'Pending', method: 'Bank Transfer' },
  { id: 'TX-1005', date: '2026-05-15', type: 'Credit', category: 'Events', accountCode: '4200', amount: 2000, description: 'Gala Ticket Sales', entityName: 'Event Operations', status: 'Settled', method: 'Credit Card' },
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

  // Ledger Filter State
  const [filterType, setFilterType] = useState<'All' | 'Credit' | 'Debit'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Settled' | 'Pending' | 'Void'>('All');
  const [ledgerSearch, setLedgerSearch] = useState('');

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

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
        const matchesType = filterType === 'All' || tx.type === filterType;
        const matchesStatus = filterStatus === 'All' || tx.status === filterStatus;
        const matchesSearch = tx.description.toLowerCase().includes(ledgerSearch.toLowerCase()) || 
                              tx.entityName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
                              tx.id.toLowerCase().includes(ledgerSearch.toLowerCase());
        return matchesType && matchesStatus && matchesSearch;
    });
  }, [transactions, filterType, filterStatus, ledgerSearch]);

  const handleGlobalBillingSync = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("Global Institutional Billing Cycle synchronized successfully.");
    }, 2500);
  };

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
            <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={[
                           { name: 'Tuition', value: 84 },
                           { name: 'Facility', value: 12 },
                           { name: 'Services', value: 4 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {COLORS.map((color, index) => (
                           <Cell key={`cell-${index}`} fill={color} stroke="none" />
                        ))}
                     </Pie>
                     <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'}} />
                     <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        formatter={(value) => <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-2">{value}</span>}
                     />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10">
               <p className="text-[10px] text-slate-400 leading-relaxed font-bold italic">"Dispersion levels within institutional compliance bounds for Q2 cycle."</p>
            </div>
          </div>
          <button onClick={() => setActiveTab('billing')} className="w-full mt-6 py-5 bg-white text-slate-900 rounded-[32px] font-black text-[12px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-4 relative z-10 group/btn active:scale-95">
            Institutional Billing Center <ArrowRight size={20} className="group-hover:btn:translate-x-2 transition-transform" />
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
           <div className="space-y-8 animate-in slide-in-from-right duration-700">
              <div className="flex flex-col lg:flex-row gap-6 bg-white p-6 rounded-[40px] shadow-2xl border border-slate-100 items-center">
                  <div className="flex-1 relative group w-full">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                     <input 
                      type="text" 
                      placeholder="Search transaction ID, entity, or description..." 
                      value={ledgerSearch}
                      onChange={(e) => setLedgerSearch(e.target.value)}
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[24px] font-bold shadow-inner focus:ring-4 focus:ring-blue-100/50 transition-all text-sm" 
                     />
                  </div>
                  
                  <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
                     <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-[24px] border border-slate-100">
                        <Filter size={16} className="text-blue-600" />
                        <select 
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value as any)}
                          className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer"
                        >
                           <option value="All">Type: All</option>
                           <option value="Credit">Credit (Inflow)</option>
                           <option value="Debit">Debit (Outflow)</option>
                        </select>
                     </div>

                     <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-[24px] border border-slate-100">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <select 
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value as any)}
                          className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer"
                        >
                           <option value="All">Status: All</option>
                           <option value="Settled">Settled</option>
                           <option value="Pending">Pending</option>
                           <option value="Void">Void</option>
                        </select>
                     </div>
                  </div>
              </div>

              <div className="glass-card rounded-[48px] overflow-hidden bg-white shadow-2xl border-none">
                 <div className="overflow-x-auto scrollbar-hide">
                   <table className="w-full text-left">
                     <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                       <tr>
                         <th className="px-10 py-8">Transaction & Entity</th>
                         <th className="px-6 py-8">Category Node</th>
                         <th className="px-6 py-8">Date Log</th>
                         <th className="px-6 py-8">Ledger Status</th>
                         <th className="px-6 py-8 text-right">Fiscal Value</th>
                         <th className="px-10 py-8 text-right">Audit</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {filteredTransactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-blue-50/20 transition-all group">
                             <td className="px-10 py-8">
                                <p className="font-black text-slate-900 leading-none mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{tx.description}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{tx.id} • {tx.entityName}</p>
                             </td>
                             <td className="px-6 py-8">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 group-hover:bg-white transition-all">{tx.category}</span>
                             </td>
                             <td className="px-6 py-8 text-xs font-bold text-slate-500 uppercase">{tx.date}</td>
                             <td className="px-6 py-8">
                                <span className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                  tx.status === 'Settled' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                  tx.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                                  'bg-slate-50 text-slate-600 border-slate-100'
                                }`}>{tx.status}</span>
                             </td>
                             <td className={`px-6 py-8 text-right font-black text-xl tracking-tighter ${tx.type === 'Credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                               {tx.type === 'Credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                             </td>
                             <td className="px-10 py-8 text-right">
                                <button className="p-3 text-slate-300 hover:text-blue-600 transition-all"><Printer size={18} /></button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
                 </div>
              </div>
           </div>
         )}
         {activeTab === 'billing' && (
            <div className="py-40 text-center glass-card rounded-[64px] bg-white/40 border-none shadow-2xl">
               <Receipt size={80} className="mx-auto text-slate-200 mb-8" />
               <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Billing Module</h3>
               <p className="text-slate-400 font-bold text-lg mt-2">Manage student invoices and payment gateways.</p>
               <button onClick={handleGlobalBillingSync} disabled={isGenerating} className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-4px] transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-50">
                  {isGenerating ? <RefreshCw className="animate-spin" size={18}/> : <Zap size={18}/>} Run Global Billing
               </button>
            </div>
         )}
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
