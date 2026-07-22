import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, FileText, PieChart as ChartIcon, Plus, Search, CheckCircle, Clock, AlertCircle, TrendingUp, TrendingDown, Wallet, CreditCard, ShieldCheck, Download, Award } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import './FinanceView.css';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  reference: string;
}

interface Invoice {
  id: string;
  studentName: string;
  amount: number;
  status: 'paid' | 'overdue' | 'sent';
  issuedDate: string;
  dueDate: string;
  aidDiscount?: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2026-10-01', description: 'Tuition Fee - John Doe', category: 'Tuition', type: 'income', amount: 5000, reference: 'INV-1001' },
  { id: '2', date: '2026-10-02', description: 'Science Lab Equipment & Supplies', category: 'Supplies', type: 'expense', amount: 1250, reference: 'REC-293' },
  { id: '3', date: '2026-10-03', description: 'Bus Transport Pass - Jane Smith', category: 'Transport', type: 'income', amount: 300, reference: 'INV-1002' },
  { id: '4', date: '2026-10-04', description: 'Campus Utility & Power Bill', category: 'Utilities', type: 'expense', amount: 2800, reference: 'INV-UTL' },
  { id: '5', date: '2026-10-05', description: 'Cafeteria Bulk Food Inventory', category: 'Cafeteria', type: 'expense', amount: 3400, reference: 'REC-401' },
  { id: '6', date: '2026-10-06', description: 'Tuition Fee - Michael Brown', category: 'Tuition', type: 'income', amount: 4800, reference: 'INV-1005' }
];

const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-1001', studentName: 'John Doe', amount: 5000, status: 'paid', issuedDate: '2026-09-01', dueDate: '2026-09-15', aidDiscount: 500 },
  { id: 'INV-1002', studentName: 'Jane Smith', amount: 300, status: 'paid', issuedDate: '2026-09-05', dueDate: '2026-09-20' },
  { id: 'INV-1003', studentName: 'Alice Johnson', amount: 5000, status: 'overdue', issuedDate: '2026-09-01', dueDate: '2026-09-15', aidDiscount: 1000 },
  { id: 'INV-1004', studentName: 'Bob Brown', amount: 1200, status: 'sent', issuedDate: '2026-10-01', dueDate: '2026-10-15' },
];

const REVENUE_DATA = [
  { month: 'May', income: 40000, expense: 24000 },
  { month: 'Jun', income: 45000, expense: 22000 },
  { month: 'Jul', income: 42000, expense: 28000 },
  { month: 'Aug', income: 48000, expense: 31000 },
  { month: 'Sep', income: 51000, expense: 29000 },
  { month: 'Oct', income: 54000, expense: 32000 },
];

const CATEGORY_DATA = [
  { name: 'Tuition & Fees', value: 45000 },
  { name: 'Transport Passes', value: 5000 },
  { name: 'Cafeteria Sales', value: 3500 },
  { name: 'Grants & Donors', value: 2500 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export const FinanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'invoices' | 'reports'>('ledger');
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [selectedPayInvoice, setSelectedPayInvoice] = useState<Invoice | null>(null);
  
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({ type: 'income', category: '', description: '', amount: 0, method: 'card', date: new Date().toISOString().split('T')[0] });
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'paid' | 'overdue' | 'sent'>('all');

  const addToast = useUIStore(s => s.addToast);

  const [paymentPlan, setPaymentPlan] = useState<'full' | 'semester' | 'monthly'>('full');
  const [payMethod, setPayMethod] = useState<'card' | 'ach' | 'voucher'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmPayment = () => {
    if (!selectedPayInvoice) return;
    setIsProcessing(true);
    setTimeout(() => {
      setInvoices(prev => prev.map(inv => inv.id === selectedPayInvoice.id ? { ...inv, status: 'paid' } : inv));
      setIsProcessing(false);
      addToast({ type: 'success', title: 'Payment Processed', message: `Payment of $${selectedPayInvoice.amount} successfully processed for ${selectedPayInvoice.studentName}.` });
      setSelectedPayInvoice(null);
    }, 1000);
  };

  const handleSaveTransaction = () => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      date: newTx.date,
      description: newTx.description,
      category: newTx.category,
      type: newTx.type as 'income' | 'expense',
      amount: Number(newTx.amount),
      reference: `REF-${Date.now().toString().slice(-4)}`
    };
    setTransactions([transaction, ...transactions]);
    addToast({ type: 'success', title: 'Transaction Saved', message: 'Transaction recorded successfully.' });
    setIsTransactionModalOpen(false);
  };

  const handleExportCSV = () => {
    let csv = 'Date,Description,Category,Type,Amount,Reference\n';
    transactions.forEach(t => {
      csv += `${t.date},"${t.description}","${t.category}",${t.type},${t.amount},"${t.reference}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Ledger_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ type: 'success', title: 'Exported', message: 'Ledger exported to CSV.' });
  };

  return (
    <div className="ep-finance">
      {/* 1. Header */}
      <header className="ep-finance__header">
        <div>
          <h1 className="ep-finance__title">Financial Ledger & Billing Command</h1>
          <p className="ep-finance__subtitle">Monitor campus revenue, track student invoices, tuition payment gateways, and financial aid grants</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button 
              className={`ep-tab ${activeTab === 'ledger' ? 'ep-tab--active' : ''}`}
              onClick={() => setActiveTab('ledger')}
            >
              <DollarSign size={14} style={{ marginRight: 4 }} /> Ledger
            </button>
            <button 
              className={`ep-tab ${activeTab === 'invoices' ? 'ep-tab--active' : ''}`}
              onClick={() => setActiveTab('invoices')}
            >
              <FileText size={14} style={{ marginRight: 4 }} /> Invoices & Pay
            </button>
            <button 
              className={`ep-tab ${activeTab === 'reports' ? 'ep-tab--active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <ChartIcon size={14} style={{ marginRight: 4 }} /> Reports
            </button>
          </div>
          <button className="ep-btn ep-btn--primary" onClick={() => setIsTransactionModalOpen(true)}>
            <Plus size={16} /> + Add Transaction
          </button>
        </div>
      </header>

      {/* 2. KPI Summary Cards */}
      <section className="ep-finance__summary-cards">
        <div className="ep-finance__card">
          <div className="ep-finance__card-icon ep-finance__card-icon--income">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="ep-finance__card-val">$124,500</div>
            <div className="ep-finance__card-lbl">Total YTD Revenue</div>
          </div>
        </div>

        <div className="ep-finance__card">
          <div className="ep-finance__card-icon ep-finance__card-icon--expense">
            <TrendingDown size={24} />
          </div>
          <div>
            <div className="ep-finance__card-val">$84,200</div>
            <div className="ep-finance__card-lbl">Operating Expenses</div>
          </div>
        </div>

        <div className="ep-finance__card">
          <div className="ep-finance__card-icon ep-finance__card-icon--net">
            <Wallet size={24} />
          </div>
          <div>
            <div className="ep-finance__card-val">$40,300</div>
            <div className="ep-finance__card-lbl">Net Liquidity Balance</div>
          </div>
        </div>

        <div className="ep-finance__card">
          <div className="ep-finance__card-icon ep-finance__card-icon--pending">
            <Clock size={24} />
          </div>
          <div>
            <div className="ep-finance__card-val">$6,200</div>
            <div className="ep-finance__card-lbl">Pending Overdue Fees</div>
          </div>
        </div>
      </section>

      {/* 3. Main Content Panes */}
      <div className="ep-finance__content">
        {activeTab === 'ledger' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="ep-finance__toolbar">
              <div className="ep-finance__search-box">
                <Search size={16} color="var(--color-text-tertiary)" />
                <input 
                  type="text" 
                  placeholder="Search ledger by description or ref..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={handleExportCSV}><Download size={14} style={{ marginRight: 4 }}/> Export CSV</button>
              </div>
            </div>

            <div className="ep-table-wrapper">
              <table className="ep-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase()) || t.reference.toLowerCase().includes(searchTerm.toLowerCase())).map(t => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{t.date}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{t.description}</td>
                      <td><span className="ep-badge ep-badge--neutral">{t.category}</span></td>
                      <td>
                        <span className={`ep-badge ${t.type === 'income' ? 'ep-badge--success' : 'ep-badge--danger'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: t.type === 'income' ? 'var(--color-success-400)' : 'var(--color-danger-400)' }}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{t.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="ep-finance__toolbar">
              <div className="ep-finance__search-box">
                <Search size={16} color="var(--color-text-tertiary)" />
                <input type="text" placeholder="Search student invoices..." />
              </div>
              <div className="ep-tabs" style={{ padding: '2px', background: 'transparent' }}>
                {(['all', 'paid', 'overdue', 'sent'] as const).map(status => (
                  <button 
                    key={status}
                    className={`ep-tab ${invoiceFilter === status ? 'ep-tab--active' : ''}`}
                    onClick={() => setInvoiceFilter(status)}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button className="ep-btn ep-btn--primary">
                <Plus size={16} /> Generate Student Invoice
              </button>
            </div>

            <div className="ep-table-wrapper">
              <table className="ep-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Student Name</th>
                    <th>Amount</th>
                    <th>Financial Aid Grant</th>
                    <th>Issued Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.filter(inv => invoiceFilter === 'all' || inv.status === invoiceFilter).map(inv => (
                    <tr key={inv.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary-400)' }}>{inv.id}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{inv.studentName}</td>
                      <td style={{ fontWeight: 700 }}>${inv.amount.toLocaleString()}</td>
                      <td>
                        {inv.aidDiscount ? (
                          <span style={{ color: 'var(--color-success-400)', fontWeight: 600, fontSize: '12px' }}>
                            -${inv.aidDiscount.toLocaleString()} Grant
                          </span>
                        ) : 'None'}
                      </td>
                      <td>{inv.issuedDate}</td>
                      <td>{inv.dueDate}</td>
                      <td>
                        <span className={`ep-badge ${inv.status === 'paid' ? 'ep-badge--success' : inv.status === 'overdue' ? 'ep-badge--danger' : 'ep-badge--warning'}`}>
                          {inv.status === 'paid' && <CheckCircle size={12} style={{ marginRight: 4 }} />}
                          {inv.status === 'overdue' && <AlertCircle size={12} style={{ marginRight: 4 }} />}
                          {inv.status === 'sent' && <Clock size={12} style={{ marginRight: 4 }} />}
                          {inv.status}
                        </span>
                      </td>
                      <td>
                        {inv.status !== 'paid' ? (
                          <button 
                            className="ep-btn ep-btn--primary ep-btn--sm"
                            onClick={() => setSelectedPayInvoice(inv)}
                          >
                            <CreditCard size={14} style={{ marginRight: 4 }} /> Pay Online
                          </button>
                        ) : (
                          <button className="ep-btn ep-btn--ghost ep-btn--sm">
                            <Download size={14} style={{ marginRight: 4 }} /> Receipt PDF
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="ep-finance__reports-grid">
            <div className="ep-finance__chart-card">
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Revenue vs Expenses (6 Months)</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--color-text-tertiary)" fontSize={12} />
                    <YAxis stroke="var(--color-text-tertiary)" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-50)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income ($)" />
                    <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="ep-finance__chart-card">
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Revenue Distribution</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-50)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Parent Tuition Payment Drawer */}
      {selectedPayInvoice && (
        <div className="ep-modal-overlay" onClick={() => setSelectedPayInvoice(null)}>
          <div className="ep-card" style={{ width: '100%', maxWidth: '560px', padding: '24px', background: 'var(--color-surface-200, #17123b)', border: '1px solid var(--color-border)', borderRadius: '16px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', padding: '8px', borderRadius: '10px' }}>
                  <CreditCard size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>Tuition & Fee Payment Portal</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Invoice {selectedPayInvoice.id} • {selectedPayInvoice.studentName}</p>
                </div>
              </div>
              <button className="ep-btn ep-btn--ghost" onClick={() => setSelectedPayInvoice(null)}>✕</button>
            </div>

            {/* Fee Schedule & Grant Breakdown */}
            <div style={{ background: 'var(--color-surface-100)', padding: '16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Base Academic Tuition Fee:</span>
                <strong>${(selectedPayInvoice.amount + (selectedPayInvoice.aidDiscount || 0)).toLocaleString()}</strong>
              </div>
              {selectedPayInvoice.aidDiscount && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success-400)' }}>
                  <span>Less: Merit Financial Aid Scholarship:</span>
                  <strong>-${selectedPayInvoice.aidDiscount.toLocaleString()}</strong>
                </div>
              )}
              <hr style={{ border: '0', borderTop: '1px solid var(--color-border)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                <span>Total Net Tuition Due:</span>
                <span style={{ color: 'var(--color-primary-400)' }}>${selectedPayInvoice.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Installment Options */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Select Payment Plan Schedule</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <button 
                  type="button"
                  className="ep-btn" 
                  style={{ background: paymentPlan === 'full' ? 'rgba(99, 102, 241, 0.2)' : 'var(--color-surface-100)', border: paymentPlan === 'full' ? '2px solid #6366f1' : '1px solid var(--color-border)', color: '#fff', fontSize: '12px' }}
                  onClick={() => setPaymentPlan('full')}
                >
                  Full 1-Pay ($ {selectedPayInvoice.amount})
                </button>
                <button 
                  type="button"
                  className="ep-btn" 
                  style={{ background: paymentPlan === 'semester' ? 'rgba(99, 102, 241, 0.2)' : 'var(--color-surface-100)', border: paymentPlan === 'semester' ? '2px solid #6366f1' : '1px solid var(--color-border)', color: '#fff', fontSize: '12px' }}
                  onClick={() => setPaymentPlan('semester')}
                >
                  Semester 2-Pay (${Math.round(selectedPayInvoice.amount / 2)} x 2)
                </button>
                <button 
                  type="button"
                  className="ep-btn" 
                  style={{ background: paymentPlan === 'monthly' ? 'rgba(99, 102, 241, 0.2)' : 'var(--color-surface-100)', border: paymentPlan === 'monthly' ? '2px solid #6366f1' : '1px solid var(--color-border)', color: '#fff', fontSize: '12px' }}
                  onClick={() => setPaymentPlan('monthly')}
                >
                  Monthly 10-Pay (${Math.round(selectedPayInvoice.amount / 10)} x 10)
                </button>
              </div>
            </div>

            {/* Payment Method Details */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>Payment Method</label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <button 
                  type="button"
                  className="ep-btn"
                  style={{ background: payMethod === 'card' ? 'rgba(59, 130, 246, 0.2)' : 'var(--color-surface-100)', border: payMethod === 'card' ? '1px solid #3b82f6' : '1px solid var(--color-border)', color: '#fff' }}
                  onClick={() => setPayMethod('card')}
                >
                  Credit / Debit Card
                </button>
                <button 
                  type="button"
                  className="ep-btn"
                  style={{ background: payMethod === 'ach' ? 'rgba(59, 130, 246, 0.2)' : 'var(--color-surface-100)', border: payMethod === 'ach' ? '1px solid #3b82f6' : '1px solid var(--color-border)', color: '#fff' }}
                  onClick={() => setPayMethod('ach')}
                >
                  ACH Bank Transfer
                </button>
              </div>

              {payMethod === 'card' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" className="ep-input" placeholder="Card Number (4532 •••• •••• 8821)" defaultValue="4532 8910 2341 8821" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="text" className="ep-input" placeholder="MM/YY" defaultValue="08/28" />
                    <input type="text" className="ep-input" placeholder="CVC" defaultValue="921" />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" className="ep-input" placeholder="Bank Routing Number (9 digits)" defaultValue="021000021" />
                  <input type="text" className="ep-input" placeholder="Account Number" defaultValue="98234101928" />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <button className="ep-btn ep-btn--secondary" onClick={() => setSelectedPayInvoice(null)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleConfirmPayment} disabled={isProcessing}>
                <ShieldCheck size={16} style={{ marginRight: 6 }} /> {isProcessing ? 'Processing Payment...' : `Authorize & Pay $${selectedPayInvoice.amount}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Transaction Modal */}
      {isTransactionModalOpen && (
        <div className="ep-finance__modal-overlay">
          <div className="ep-finance__modal">
            <header className="ep-finance__modal-header">
              <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--color-text-primary)' }}>Add Transaction</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setIsTransactionModalOpen(false)}>✕</button>
            </header>
            <div className="ep-finance__modal-body">
              <div className="ep-finance__form-row">
                <label>Type</label>
                <select className="ep-input" value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value})}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="refund">Refund</option>
                </select>
              </div>
              <div className="ep-finance__form-row">
                <label>Category</label>
                <input type="text" className="ep-input" value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})} placeholder="e.g. Tuition" />
              </div>
              <div className="ep-finance__form-row">
                <label>Description</label>
                <input type="text" className="ep-input" value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} placeholder="Description" />
              </div>
              <div className="ep-finance__form-row">
                <label>Amount</label>
                <input type="number" className="ep-input" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})} />
              </div>
              <div className="ep-finance__form-row">
                <label>Payment Method</label>
                <select className="ep-input" value={newTx.method} onChange={e => setNewTx({...newTx, method: e.target.value})}>
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div className="ep-finance__form-row">
                <label>Date</label>
                <input type="date" className="ep-input" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} />
              </div>
            </div>
            <footer className="ep-finance__modal-actions">
              <button className="ep-btn ep-btn--ghost" onClick={() => setIsTransactionModalOpen(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleSaveTransaction}>Save Transaction</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceView;
