import React, { useState } from 'react';
import './ParentDashboard.css';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Mail, Award, AlertTriangle, ChevronLeft, ChevronRight, User, FileText, CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores/uiStore';

// Mock Data
const CHILDREN = [
  { id: 1, name: 'Alex Johnson', grade: 'Grade 11', avatar: 'A' },
  { id: 2, name: 'Mia Johnson', grade: 'Grade 8', avatar: 'M' },
];

const GPA_DATA = [
  { month: 'Jan', gpa: 3.4 },
  { month: 'Feb', gpa: 3.5 },
  { month: 'Mar', gpa: 3.6 },
  { month: 'Apr', gpa: 3.5 },
  { month: 'May', gpa: 3.8 },
  { month: 'Jun', gpa: 3.9 },
];

const SUBJECT_DATA = [
  { subject: 'Math', grade: 92 },
  { subject: 'Science', grade: 88 },
  { subject: 'History', grade: 95 },
  { subject: 'English', grade: 90 },
  { subject: 'Art', grade: 98 },
];

const TEACHERS = [
  { id: 1, name: 'Mr. Smith', subject: 'Math', email: 'smith@edupulse.edu' },
  { id: 2, name: 'Dr. Jones', subject: 'Science', email: 'jones@edupulse.edu' },
  { id: 3, name: 'Ms. Davis', subject: 'English', email: 'davis@edupulse.edu' },
];

const BEHAVIOR_LOGS = [
  { id: 1, date: 'Oct 14', type: 'merit', note: 'Helped peers in Math club.' },
  { id: 2, date: 'Oct 10', type: 'note', note: 'Alex is showing great progress in essays.' },
  { id: 3, date: 'Sep 28', type: 'demerit', note: 'Tardy to 1st period.' },
];

const ANNOUNCEMENTS = [
  { id: 1, title: 'Parent-Teacher Conferences', date: 'Nov 1, 2026' },
  { id: 2, title: 'Fall Festival Volunteers Needed', date: 'Oct 20, 2026' },
];

export const ParentDashboard: React.FC = () => {
  const [activeChild, setActiveChild] = useState(CHILDREN[0]);
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  
  const [invoices, setInvoices] = useState([
    { id: 1, desc: 'Lab Fee', amount: 50, due: 'Oct 31', status: 'pending' },
    { id: 2, desc: 'Field Trip', amount: 25, due: 'Nov 15', status: 'pending' }
  ]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payData, setPayData] = useState({ invoiceId: 0, method: 'Card' });

  const handleMessageTeacher = () => {
    addToast({ type: 'info', title: 'Messaging', message: 'Opening message composer...' });
    navigate('/messaging');
  };
  
  const handleViewReportCard = () => {
    navigate('/students');
  };

  const handlePayInvoice = () => {
    setInvoices(invoices.map(inv => inv.id === payData.invoiceId ? { ...inv, status: 'paid' } : inv));
    addToast({ type: 'success', title: 'Payment Successful', message: 'Your payment was processed successfully.' });
    setShowPayModal(false);
  };

  return (
    <div className="ep-parent-dash">
      <header className="ep-parent-dash__header">
        <h1>Parent Portal</h1>
      </header>

      {/* Child Selector */}
      <div className="ep-parent-dash__child-selector">
        {CHILDREN.map(child => (
          <div 
            key={child.id} 
            className={`ep-parent-dash__child-tab ${activeChild.id === child.id ? 'ep-parent-dash__child-tab--active' : ''}`}
            onClick={() => setActiveChild(child)}
          >
            <div className="ep-parent-dash__child-avatar">{child.avatar}</div>
            <div className="ep-parent-dash__child-info">
              <h4>{child.name}</h4>
              <span>{child.grade}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ep-parent-dash__grid">
        {/* Left Column */}
        <div className="ep-parent-dash__col ep-parent-dash__col--left">
          
          {/* Child Summary */}
          <div className="ep-parent-dash__panel ep-parent-dash__summary-card">
            <div className="ep-parent-dash__summary-header">
              <div className="ep-parent-dash__summary-avatar-large">
                <User size={40} color="white" />
              </div>
              <div className="ep-parent-dash__summary-titles">
                <h2>{activeChild.name}</h2>
                <button className="ep-btn ep-btn--secondary" onClick={handleViewReportCard} style={{ marginTop: '5px', fontSize: '12px' }}>View Report Card</button>
                <p>{activeChild.grade} • Section B • Homeroom: Mr. Wilson</p>
                <span className="ep-parent-dash__status-badge ep-parent-dash__status-badge--ontrack">On Track</span>
              </div>
            </div>
            <div className="ep-parent-dash__summary-stats">
              <div className="ep-parent-dash__stat">
                <span className="ep-parent-dash__stat-val">3.9</span>
                <span className="ep-parent-dash__stat-label">GPA</span>
              </div>
              <div className="ep-parent-dash__stat">
                <span className="ep-parent-dash__stat-val">98%</span>
                <span className="ep-parent-dash__stat-label">Attendance</span>
              </div>
              <div className="ep-parent-dash__stat">
                <span className="ep-parent-dash__stat-val">45</span>
                <span className="ep-parent-dash__stat-label">Merit Pts</span>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="ep-parent-dash__panel">
            <h3 className="ep-parent-dash__panel-title">Academic Performance</h3>
            <div className="ep-parent-dash__charts-row">
              <div className="ep-parent-dash__chart-wrapper">
                <h4>GPA Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={GPA_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-border, #e2e8f0)" />
                    <XAxis dataKey="month" stroke="var(--color-text-secondary, #64748b)" fontSize={12} />
                    <YAxis domain={[2.0, 4.0]} stroke="var(--color-text-secondary, #64748b)" fontSize={12} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="gpa" stroke="var(--color-primary-500, #3b82f6)" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="ep-parent-dash__chart-wrapper">
                <h4>Subject Breakdown</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={SUBJECT_DATA} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-border, #e2e8f0)" />
                    <XAxis type="number" domain={[0, 100]} stroke="var(--color-text-secondary, #64748b)" fontSize={12} />
                    <YAxis dataKey="subject" type="category" stroke="var(--color-text-secondary, #64748b)" fontSize={12} width={60} />
                    <RechartsTooltip />
                    <Bar dataKey="grade" fill="var(--color-primary-400, #60a5fa)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Teacher Contacts */}
          <div className="ep-parent-dash__panel">
            <h3 className="ep-parent-dash__panel-title">Teacher Contacts</h3>
            <div className="ep-parent-dash__teacher-grid">
              {TEACHERS.map(teacher => (
                <div key={teacher.id} className="ep-parent-dash__teacher-card">
                  <div className="ep-parent-dash__teacher-info">
                    <div className="ep-parent-dash__teacher-avatar">
                      <User size={20} />
                    </div>
                    <div>
                      <h4>{teacher.name}</h4>
                      <p>{teacher.subject}</p>
                    </div>
                  </div>
                  <button className="ep-parent-dash__btn-message" onClick={handleMessageTeacher}>
                    <Mail size={16} /> Message
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="ep-parent-dash__col ep-parent-dash__col--right">
          
          {/* Attendance Calendar (simplified) */}
          <div className="ep-parent-dash__panel">
            <div className="ep-parent-dash__panel-header">
              <h3 className="ep-parent-dash__panel-title">Attendance</h3>
              <div className="ep-parent-dash__calendar-nav">
                <ChevronLeft size={20} className="ep-parent-dash__icon-btn" />
                <span>October 2026</span>
                <ChevronRight size={20} className="ep-parent-dash__icon-btn" />
              </div>
            </div>
            <div className="ep-parent-dash__calendar-stats">
              <span className="ep-parent-dash__cal-stat ep-parent-dash__cal-stat--present">Present: 18</span>
              <span className="ep-parent-dash__cal-stat ep-parent-dash__cal-stat--absent">Absent: 2</span>
              <span className="ep-parent-dash__cal-stat ep-parent-dash__cal-stat--late">Late: 1</span>
            </div>
            <div className="ep-parent-dash__calendar-grid">
              {['S','M','T','W','T','F','S'].map(d => <div key={d} className="ep-parent-dash__cal-day-label">{d}</div>)}
              {Array.from({length: 31}).map((_, i) => {
                let status = 'present';
                if (i === 10 || i === 11) status = 'absent';
                if (i === 5) status = 'late';
                if (i % 7 === 0 || i % 7 === 6) status = 'weekend';
                return (
                  <div key={i} className={`ep-parent-dash__cal-cell ep-parent-dash__cal-cell--${status}`}>
                    {i + 1}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Financial Status */}
          <div className="ep-parent-dash__panel ep-parent-dash__finance-panel">
            <h3 className="ep-parent-dash__panel-title">Financial Status</h3>
            <div className="ep-parent-dash__finance-balance">
              <p>Outstanding Balance</p>
              <h2>$450.00</h2>
            </div>
            <div className="ep-parent-dash__finance-details">
              {invoices.filter(i => i.status === 'pending').map(inv => (
                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span><strong>{inv.desc}</strong>: ${inv.amount} due {inv.due}</span>
                  <button className="ep-parent-dash__btn-pay" style={{ width: 'auto', padding: '4px 12px', fontSize: '12px' }} onClick={() => { setPayData({ ...payData, invoiceId: inv.id }); setShowPayModal(true); }}>Pay Now</button>
                </div>
              ))}
              {invoices.filter(i => i.status === 'paid').length > 0 && <div><strong>Last Payment:</strong> Success</div>}
            </div>
          </div>

          {/* Behavior & Notes */}
          <div className="ep-parent-dash__panel">
            <h3 className="ep-parent-dash__panel-title">Recent Behavior & Notes</h3>
            <div className="ep-parent-dash__timeline">
              {BEHAVIOR_LOGS.map(log => (
                <div key={log.id} className={`ep-parent-dash__timeline-item ep-parent-dash__timeline-item--${log.type}`}>
                  <div className="ep-parent-dash__timeline-icon">
                    {log.type === 'merit' ? <Award size={16} /> : log.type === 'demerit' ? <AlertTriangle size={16} /> : <FileText size={16} />}
                  </div>
                  <div className="ep-parent-dash__timeline-content">
                    <span className="ep-parent-dash__timeline-date">{log.date}</span>
                    <p>{log.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="ep-parent-dash__panel">
            <h3 className="ep-parent-dash__panel-title">School Announcements</h3>
            <ul className="ep-parent-dash__announcements">
              {ANNOUNCEMENTS.map(a => (
                <li key={a.id}>
                  <div className="ep-parent-dash__announcement-date">{a.date}</div>
                  <h4>{a.title}</h4>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {showPayModal && (
        <div className="ep-parent-dash__modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="ep-parent-dash__modal" onClick={e => e.stopPropagation()}>
            <div className="ep-parent-dash__modal-header">
              <h2 className="ep-parent-dash__modal-title">Pay Invoice</h2>
              <button className="ep-btn ep-btn--text" onClick={() => setShowPayModal(false)}>X</button>
            </div>
            <div className="ep-parent-dash__modal-body">
              <p>Paying invoice for {activeChild.name}</p>
              <label>Payment Method</label>
              <select className="ep-input" value={payData.method} onChange={e => setPayData({...payData, method: e.target.value})}>
                <option value="Card">Credit Card</option>
                <option value="ACH">ACH Transfer</option>
                <option value="Voucher">Voucher</option>
              </select>
            </div>
            <div className="ep-parent-dash__modal-actions">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowPayModal(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handlePayInvoice}>Confirm Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
