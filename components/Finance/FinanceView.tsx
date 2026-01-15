import React, { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, DollarSign, PieChart as PieChartIcon, Download, ArrowDownRight, 
  Search, Filter, Plus, FileText, CheckCircle2, History, 
  TrendingUp, Landmark, Receipt, ShieldCheck, ArrowRight, Wallet,
  ChevronRight, MoreVertical, Printer, X, Edit3, Trash, BarChart3, Save
} from 'lucide-react';
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { FinancialTransaction, FinancialStatus, PaymentMethod, TransactionType } from '../../types.ts';

const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  { id: 'TX-1001', date: '2026-05-18', type: 'Credit', category: 'Tuition', accountCode: '4000', amount: 4500, description: 'Tuition Payment - Aiden Mitchell', entityName: 'Aiden Mitchell', status: 'Settled', method: 'Bank Transfer' },
  { id: 'TX-1002', date: '2026-05-18', type: 'Credit', category: 'Cafeteria Sales', accountCode: '4100', amount: 1250, description: 'Daily Lunch Proceeds', entityName: 'Cafeteria Node', status: 'Settled', method: 'Cash' },
  { id: 'TX-1003', date: '2026-05-17', type: 'Debit', category: 'Salary', accountCode: '6000', amount: 4230, description: 'Salary Disbursement - Prof. Mitchell', entityName: 'Prof. Mitchell', status: 'Settled', method: 'Internal Transfer' },
  { id: 'TX-1004', date: '2026-05-17', type: 'Debit', category: 'Cafeteria Supplies', accountCode: '6100', amount: 800, description: 'Fresh Produce Procurement', entityName: 'Global Foods Inc', status: 'Settled', method: 'Credit Card' },
  { id: 'TX-1005', date: '2026-05-16', type: 'Debit', category: 'Utility', accountCode: '6200', amount: 1500, description: 'Electricity Bill - Main Campus', entityName: 'City Power', status: 'Settled', method: 'Bank Transfer' },
  { id: 'TX-1006', date: '2026-05-15', type: 'Credit', category: 'Extracurricular', accountCode: '4200', amount: 2200, description: 'Robotics Club Annual Fees', entityName: 'Multiple Students', status: 'Settled', method: 'Digital Wallet' },
];

const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const FinanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'receivables' | 'payroll' | 'reports'>('dashboard');
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('edupulse_ledger');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Partial<FinancialTransaction> | null>(null);

  useEffect(() => {
    localStorage.setItem('edupulse_ledger', JSON.stringify(transactions));
  }, [transactions]);

  const totals = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      if (tx.status !== 'Settled') return acc;
      if (tx.type === 'Credit') acc.revenue += tx.amount;
      else acc.expenses += tx.amount;
      return acc;
    }, { revenue: 0, expenses: 0 });
  }, [transactions]);

  const revenueByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions.forEach(tx => {
      if (tx.type === 'Credit' && tx.status === 'Settled') {
        categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
      }
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const areaChartData = useMemo(() => {
    const dailyMap: Record<string, number> = {};
    transactions.forEach(tx => {
      if (tx.status === 'Settled') {
        const val = tx.type === 'Credit' ? tx.amount : -tx.amount;
        dailyMap[tx.date] = (dailyMap[tx.date] || 0) + val;
      }
    });
    return Object.entries(dailyMap)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, amount]) => ({ date, amount }));
  }, [transactions]);

  const profit = totals.revenue - totals.expenses;
  const profitMargin = totals.revenue > 0 ? ((profit / totals.revenue) * 100).toFixed(1) : '0';

  const filteredTransactions = transactions.filter(tx => 
    tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tx: FinancialTransaction = {
      id: editingTx?.id || `TX-${Date.now()}`,
      date: formData.get('date') as string,
      type: formData.get('type') as TransactionType,
      category: formData.get('category') as any,
      amount: parseFloat(formData.get('amount') as string),
      description: formData.get('description') as string,
      entityName: formData.get('entityName') as string,
      status: formData.get('status') as FinancialStatus,
      method: formData.get('method') as PaymentMethod,
      accountCode: formData.get('accountCode') as string || '0000'
    };

    if (editingTx?.id) {
      setTransactions(prev => prev.map(t => t.id === editingTx.id ? tx : t));
    } else {
      setTransactions(prev => [tx, ...prev]);
    }
    setIsTxModalOpen(false);
    setEditingTx(null);
  };

  const renderDashboard = () => (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[
          { label: 'Gross Revenue', value: `$${totals.revenue.toLocaleString()}`, icon: <TrendingUp />, change: 'Stable', color: 'blue' },
          { label: 'Op Expenses', value: `$${totals.expenses.toLocaleString()}`, icon: <ArrowDownRight />, change: '-4%', color: 'rose' },
          { label: 'Net Surplus', value: `$${profit.toLocaleString()}`, icon: <ShieldCheck />, change: `${profitMargin}%`, color: 'emerald' },
          { label: 'Receivables', value: '$84,200', icon: <Receipt />, change: '14 Pending', color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[32px] md:rounded-[40px] bg-white shadow-xl hover:translate-y-[-4px] transition-all group">
            <div className="flex justify-between items-start mb-6 md:mb-8">
              <div className={`p-4 rounded-2xl shadow-sm bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all`}>
                {stat.icon}
              </div>
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{stat.change}</span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-10">
        <div className="xl:col-span-2 glass-card p-8 md:p-10 rounded-[32px] md:rounded-[56px] bg-white shadow-2xl">
          <div className="flex justify-between items-center mb-8 md:mb-12">
            <div>
              <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">Fiscal Performance Trend</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Daily Net Flow Registry</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><TrendingUp size={20} /></div>
          </div>
          <div className="h-[250px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                   contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[56px] bg-slate-900 text-white shadow-2xl flex flex-col">
          <h4 className="text-lg md:text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter">
            <PieChartIcon className="text-blue-400" /> Revenue Allocation
          </h4>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center" 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <button className="w-full mt-8 py-4 md:py-5 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-[24px] md:rounded-[28px] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3">
            Detailed Analysis <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderLedger = () => (
    <div className="space-y-8 animate-in slide-in-from-right duration-700 px-4 md:px-1">
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-1">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Institutional Ledger</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit-Ready 2026 Core Registry</p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
             <button onClick={() => { setEditingTx(null); setIsTxModalOpen(true); }} className="flex-1 lg:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-blue-600 transition-all">
                <Plus size={18} /> New Protocol Entry
             </button>
          </div>
       </div>

       <div className="glass-card rounded-[32px] md:rounded-[48px] overflow-hidden bg-white shadow-2xl border-none">
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/50">
            <div className="relative flex-1 group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search by narrative, entity, or category..." 
                 className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[20px] focus:ring-4 focus:ring-blue-100 transition-all font-bold"
               />
            </div>
            <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-[20px] text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50">
               <Filter size={18} /> Filters
            </button>
          </div>

          <div className="block md:hidden p-4 space-y-4">
             {filteredTransactions.map(tx => (
               <div key={tx.id} onClick={() => { setEditingTx(tx); setIsTxModalOpen(true); }} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 active:scale-[0.98] transition-all">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="font-black text-slate-900 text-lg leading-tight">{tx.description}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{tx.date} • {tx.id}</p>
                     </div>
                     <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${tx.type === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{tx.type}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-slate-200/50">
                     <p className="text-[10px] font-bold text-slate-500">{tx.entityName}</p>
                     <p className={`text-xl font-black ${tx.type === 'Credit' ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.type === 'Credit' ? '+' : '-'}${tx.amount.toLocaleString()}</p>
                  </div>
               </div>
             ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <tr>
                     <th className="px-10 py-6">Date & ID</th>
                     <th className="px-6 py-6">Category</th>
                     <th className="px-6 py-6">Description / Entity</th>
                     <th className="px-6 py-6 text-right">Debit (-)</th>
                     <th className="px-6 py-6 text-right">Credit (+)</th>
                     <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-blue-50/20 transition-all group">
                       <td className="px-10 py-6">
                          <p className="font-black text-slate-900 leading-none mb-1">{tx.date}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{tx.id}</p>
                       </td>
                       <td className="px-6 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                            tx.type === 'Credit' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                             {tx.category}
                          </span>
                       </td>
                       <td className="px-6 py-6">
                          <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{tx.description}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{tx.entityName}</p>
                       </td>
                       <td className="px-6 py-6 text-right font-black text-rose-500">
                          {tx.type === 'Debit' ? `-$${tx.amount.toLocaleString()}` : '-'}
                       </td>
                       <td className="px-6 py-6 text-right font-black text-emerald-500">
                          {tx.type === 'Credit' ? `+$${tx.amount.toLocaleString()}` : '-'}
                       </td>
                       <td className="px-10 py-6 text-right">
                          <button onClick={() => { setEditingTx(tx); setIsTxModalOpen(true); }} className="p-3 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={16} /></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-12 pb-32">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 md:gap-10 px-4 md:px-1">
        <div>
           <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Fiscal Hub</h2>
           <p className="text-slate-500 font-bold italic mt-2 uppercase text-[10px] tracking-[0.4em] flex items-center gap-3">
              <Landmark size={18} className="text-blue-500" /> Integrated Institutional Accounting 2026
           </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[28px] md:rounded-[32px] shadow-2xl border border-slate-100 flex gap-2 w-full xl:w-auto overflow-x-auto scrollbar-hide">
           {[
             { id: 'dashboard', label: 'Dashboard', icon: <PieChartIcon size={14} /> },
             { id: 'ledger', label: 'Ledger', icon: <History size={14} /> },
             { id: 'reports', label: 'Reports', icon: <BarChart3 size={14} /> },
           ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 md:flex-none px-6 md:px-8 py-3.5 md:py-4 rounded-[20px] md:rounded-[24px] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                {tab.icon} {tab.label}
              </button>
           ))}
        </div>
      </div>

      <div className="animate-in fade-in duration-700">
         {activeTab === 'dashboard' && renderDashboard()}
         {activeTab === 'ledger' && renderLedger()}
         {activeTab === 'reports' && (
            <div className="py-24 md:py-40 text-center glass-card rounded-[48px] md:rounded-[64px] bg-white/40 mx-4 md:mx-1">
               <BarChart3 size={80} className="mx-auto text-slate-100 mb-8" />
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">Financial Reporting Suite</h3>
               <p className="text-slate-400 font-bold text-lg mt-2">Generate Profit & Loss, Balance Sheets, and Audit Logs.</p>
               <button className="mt-8 md:mt-10 px-12 py-5 bg-slate-900 text-white rounded-[24px] md:rounded-[28px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:translate-y-[-4px] transition-all">Initialize Report Engine</button>
            </div>
         )}
      </div>

      {/* TX MODAL - FULL SHEET ON MOBILE */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-3xl" onClick={() => setIsTxModalOpen(false)}></div>
           <form onSubmit={handleSaveTransaction} className="relative w-full h-full md:h-auto md:max-w-2xl bg-white md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-screen md:max-h-[92vh] animate-in slide-in-from-bottom-20">
              <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                 <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{editingTx ? 'Edit Protocol' : 'New Journal Entry'}</h3>
                 <button type="button" onClick={() => setIsTxModalOpen(false)} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"><X size={24} /></button>
              </div>

              <div className="p-8 md:p-10 space-y-8 overflow-y-auto scrollbar-hide flex-1 bg-slate-50/20">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Flow Date</label>
                       <input type="date" name="date" defaultValue={editingTx?.date || new Date().toISOString().split('T')[0]} required className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 shadow-sm" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Direction</label>
                       <select name="type" defaultValue={editingTx?.type || 'Credit'} className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none cursor-pointer">
                          <option value="Credit">Credit (Income)</option>
                          <option value="Debit">Debit (Expense)</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Institutional Category</label>
                    <input name="category" defaultValue={editingTx?.category} required placeholder="e.g. Tuition, Facility, Salary..." className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 shadow-sm" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Amount ($)</label>
                    <input type="number" step="0.01" name="amount" defaultValue={editingTx?.amount} required className="w-full px-6 py-6 bg-white border-2 border-slate-100 rounded-[20px] font-black text-3xl text-blue-600 outline-none focus:border-blue-400 shadow-inner" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Flow Narrative</label>
                    <input name="description" defaultValue={editingTx?.description} required placeholder="Institutional context..." className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 shadow-sm" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Entity Name</label>
                    <input name="entityName" defaultValue={editingTx?.entityName} required placeholder="Student, Vendor, or Department..." className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-400 shadow-sm" />
                 </div>
              </div>

              <div className="p-8 md:p-10 bg-white border-t border-slate-100">
                 <button type="submit" className="w-full py-6 bg-slate-900 text-white font-black rounded-[28px] uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all hover:bg-blue-600">Commit To Ledger Registry</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};

export default FinanceView;