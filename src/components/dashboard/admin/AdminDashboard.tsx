import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, UserCheck, DollarSign, Activity,
  Bell, CheckCircle, AlertTriangle, BookOpen, FileText, ChevronRight, Bus
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import './AdminDashboard.css';

const ENROLLMENT_TREND = [
  { month: 'Jan', students: 1100 },
  { month: 'Feb', students: 1120 },
  { month: 'Mar', students: 1140 },
  { month: 'Apr', students: 1155 },
  { month: 'May', students: 1180 },
  { month: 'Jun', students: 1195 },
  { month: 'Jul', students: 1210 },
  { month: 'Aug', students: 1230 },
  { month: 'Sep', students: 1247 },
  { month: 'Oct', students: 1245 },
  { month: 'Nov', students: 1248 },
  { month: 'Dec', students: 1250 }
];

const REVENUE_DATA = [
  { month: 'Jul', revenue: 42000, expenses: 38000 },
  { month: 'Aug', revenue: 45000, expenses: 39000 },
  { month: 'Sep', revenue: 48320, expenses: 40000 },
  { month: 'Oct', revenue: 47000, expenses: 41000 },
  { month: 'Nov', revenue: 49000, expenses: 40500 },
  { month: 'Dec', revenue: 51000, expenses: 42000 }
];

const GRADE_DISTRIBUTION = [
  { name: 'Grade A', value: 400 },
  { name: 'Grade B', value: 350 },
  { name: 'Grade C', value: 200 },
  { name: 'Grade D', value: 100 },
  { name: 'Grade F', value: 50 }
];

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];

const PIPELINE_DATA = [
  { stage: 'Inquiry', count: 320, color: 'var(--color-primary-300, #93c5fd)' },
  { stage: 'Applied', count: 210, color: 'var(--color-primary-400, #60a5fa)' },
  { stage: 'Accepted', count: 180, color: 'var(--color-primary-500, #3b82f6)' },
  { stage: 'Enrolled', count: 155, color: 'var(--color-primary-600, #2563eb)' }
];

const RECENT_ACTIVITY = [
  { id: 1, type: 'payment', message: 'Invoice #1024 paid by John Doe', time: '10 mins ago', icon: DollarSign },
  { id: 2, type: 'admission', message: 'New student application received', time: '1 hour ago', icon: FileText },
  { id: 3, type: 'system', message: 'System backup completed successfully', time: '2 hours ago', icon: CheckCircle },
  { id: 4, type: 'staff', message: 'Teacher Sarah Smith updated grades for Math 101', time: '3 hours ago', icon: Users },
  { id: 5, type: 'alert', message: 'Low attendance alert for Grade 10', time: '5 hours ago', icon: AlertTriangle },
  { id: 6, type: 'payment', message: 'Invoice #1025 generated', time: '1 day ago', icon: DollarSign },
  { id: 7, type: 'admission', message: 'Application #402 approved', time: '1 day ago', icon: UserCheck }
];

const ALERTS = [
  { id: 1, title: 'Overdue Invoices', description: '15 invoices are past due date', severity: 'high' },
  { id: 2, title: 'Low Attendance', description: 'Grade 9B attendance below 85%', severity: 'medium' },
  { id: 3, title: 'Pending Admissions', description: '24 applications need review', severity: 'low' }
];

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="ep-admin-dash">
      {/* 1. Welcome Header */}
      <header className="ep-admin-dash__header">
        <div>
          <h1 className="ep-admin-dash__title">Welcome back, {user?.name || 'Dr. Sarah Mitchell'}</h1>
          <p className="ep-admin-dash__subtitle">{currentDate} • Executive Command Center</p>
        </div>
        <div className="ep-admin-dash__actions">
          <button className="ep-btn ep-btn--secondary">Export Audit</button>
          <button className="ep-btn ep-btn--primary">+ New Admission</button>
        </div>
      </header>

      {/* 2. KPI StatCards */}
      <section className="ep-admin-dash__kpi-grid">
        <div className="ep-admin-dash__kpi-card">
          <div className="ep-admin-dash__kpi-icon-box ep-admin-dash__kpi-icon-box--blue">
            <Users size={24} />
          </div>
          <div className="ep-admin-dash__kpi-content">
            <span className="ep-admin-dash__kpi-label">Total Students</span>
            <div className="ep-admin-dash__kpi-value">1,247</div>
            <span className="ep-admin-dash__kpi-badge ep-admin-dash__kpi-badge--up">↑ +12 this month</span>
          </div>
        </div>

        <div className="ep-admin-dash__kpi-card">
          <div className="ep-admin-dash__kpi-icon-box ep-admin-dash__kpi-icon-box--green">
            <UserCheck size={24} />
          </div>
          <div className="ep-admin-dash__kpi-content">
            <span className="ep-admin-dash__kpi-label">Faculty & Staff</span>
            <div className="ep-admin-dash__kpi-value">89</div>
            <span className="ep-admin-dash__kpi-badge ep-admin-dash__kpi-badge--neutral">→ 100% active</span>
          </div>
        </div>

        <div className="ep-admin-dash__kpi-card">
          <div className="ep-admin-dash__kpi-icon-box ep-admin-dash__kpi-icon-box--yellow">
            <DollarSign size={24} />
          </div>
          <div className="ep-admin-dash__kpi-content">
            <span className="ep-admin-dash__kpi-label">Monthly Revenue</span>
            <div className="ep-admin-dash__kpi-value">$48,320</div>
            <span className="ep-admin-dash__kpi-badge ep-admin-dash__kpi-badge--up">↑ +5.2% vs last month</span>
          </div>
        </div>

        <div className="ep-admin-dash__kpi-card">
          <div className="ep-admin-dash__kpi-icon-box ep-admin-dash__kpi-icon-box--purple">
            <Activity size={24} />
          </div>
          <div className="ep-admin-dash__kpi-content">
            <span className="ep-admin-dash__kpi-label">Attendance Rate</span>
            <div className="ep-admin-dash__kpi-value">94.2%</div>
            <span className="ep-admin-dash__kpi-badge ep-admin-dash__kpi-badge--down">↓ -0.5% vs last week</span>
          </div>
        </div>
      </section>

      {/* 3. Two-column chart row */}
      <section className="ep-admin-dash__grid-2col">
        <div className="ep-admin-dash__card">
          <div className="ep-admin-dash__card-header">
            <h2 className="ep-admin-dash__card-title">Enrollment Trend (12 Months)</h2>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENROLLMENT_TREND} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminEnrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--color-text-tertiary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--color-text-tertiary)" fontSize={12} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-50)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#adminEnrollGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ep-admin-dash__card">
          <div className="ep-admin-dash__card-header">
            <h2 className="ep-admin-dash__card-title">Revenue vs Expenses (6 Months)</h2>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-text-tertiary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--color-text-tertiary)" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-50)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} name="Revenue ($)" />
                <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expenses ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 4. Three-column section */}
      <section className="ep-admin-dash__grid-3col">
        {/* Pipeline */}
        <div className="ep-admin-dash__card">
          <h2 className="ep-admin-dash__card-title">Enrollment Pipeline</h2>
          <div className="ep-admin-dash__pipeline">
            {PIPELINE_DATA.map((item) => (
              <div key={item.stage} className="ep-admin-dash__pipeline-row">
                <div className="ep-admin-dash__pipeline-meta">
                  <span>{item.stage}</span>
                  <span>{item.count} candidates</span>
                </div>
                <div className="ep-admin-dash__pipeline-track">
                  <div 
                    className="ep-admin-dash__pipeline-bar" 
                    style={{ width: `${(item.count / 320) * 100}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Heatmap */}
        <div className="ep-admin-dash__card">
          <h2 className="ep-admin-dash__card-title">Attendance Heatmap</h2>
          <div className="ep-admin-dash__heatmap-grid">
            <div className="ep-admin-dash__heatmap-head">Grade</div>
            {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
              <div key={i} className="ep-admin-dash__heatmap-head">{day}</div>
            ))}
            {[9, 10, 11, 12].map((grade) => (
              <React.Fragment key={`gr-${grade}`}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Gr {grade}</div>
                {[92, 95, 88, 97, 91].map((val, idx) => {
                  let bgColor = '#10b981';
                  if (val < 90) bgColor = '#f59e0b';
                  if (val < 85) bgColor = '#ef4444';
                  return (
                    <div 
                      key={idx} 
                      className="ep-admin-dash__heatmap-cell" 
                      style={{ backgroundColor: bgColor }} 
                      title={`Grade ${grade}: ${val}%`}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="ep-admin-dash__heatmap-legend">
            <span><span className="ep-admin-dash__heatmap-legend-dot" style={{ background: '#ef4444' }} /> &lt;85%</span>
            <span><span className="ep-admin-dash__heatmap-legend-dot" style={{ background: '#f59e0b' }} /> 85-90%</span>
            <span><span className="ep-admin-dash__heatmap-legend-dot" style={{ background: '#10b981' }} /> &gt;90%</span>
          </div>
        </div>
        
        {/* Donut Chart */}
        <div className="ep-admin-dash__card">
          <h2 className="ep-admin-dash__card-title">Grade Distribution</h2>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GRADE_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {GRADE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`c-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-50)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 5. Two-column bottom (Uneven) */}
      <section className="ep-admin-dash__grid-uneven">
        <div className="ep-admin-dash__card">
          <div className="ep-admin-dash__card-header">
            <h2 className="ep-admin-dash__card-title">Recent Activity</h2>
            <button className="ep-btn ep-btn--text">View All Audit Logs</button>
          </div>
          <div className="ep-admin-dash__activity-list">
            {RECENT_ACTIVITY.map((act) => {
              const IconComp = act.icon;
              return (
                <div key={act.id} className="ep-admin-dash__activity-item">
                  <div className={`ep-admin-dash__activity-icon ep-admin-dash__activity-icon--${act.type}`}>
                    <IconComp size={18} />
                  </div>
                  <p className="ep-admin-dash__activity-text">{act.message}</p>
                  <span className="ep-admin-dash__activity-time">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ep-admin-dash__card">
          <div className="ep-admin-dash__card-header">
            <h2 className="ep-admin-dash__card-title">Priority Alerts</h2>
          </div>
          <div className="ep-admin-dash__alerts-list">
            {ALERTS.map((alert) => (
              <div key={alert.id} className={`ep-admin-dash__alert-card ep-admin-dash__alert-card--${alert.severity}`}>
                <Bell size={20} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                <div className="ep-admin-dash__alert-info">
                  <h4 className="ep-admin-dash__alert-title">{alert.title}</h4>
                  <p className="ep-admin-dash__alert-desc">{alert.description}</p>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--color-text-tertiary)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer quick stats */}
      <footer className="ep-admin-dash__footer">
        <div className="ep-admin-dash__footer-stat">
          <BookOpen size={20} className="ep-admin-dash__footer-icon" />
          <div>
            <div className="ep-admin-dash__footer-val">156</div>
            <div className="ep-admin-dash__footer-lbl">Active Courses</div>
          </div>
        </div>

        <div className="ep-admin-dash__footer-stat">
          <Activity size={20} className="ep-admin-dash__footer-icon" />
          <div>
            <div className="ep-admin-dash__footer-val">3.14</div>
            <div className="ep-admin-dash__footer-lbl">Campus Avg GPA</div>
          </div>
        </div>

        <div className="ep-admin-dash__footer-stat">
          <FileText size={20} className="ep-admin-dash__footer-icon" />
          <div>
            <div className="ep-admin-dash__footer-val">1,842</div>
            <div className="ep-admin-dash__footer-lbl">Library Loans</div>
          </div>
        </div>

        <div className="ep-admin-dash__footer-stat">
          <Bus size={20} className="ep-admin-dash__footer-icon" />
          <div>
            <div className="ep-admin-dash__footer-val">12 Active</div>
            <div className="ep-admin-dash__footer-lbl">Bus Fleet Routes</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
