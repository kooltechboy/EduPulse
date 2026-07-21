import React from 'react';
import { ShieldCheck, Users, AlertTriangle, Key, Lock, CheckCircle, RefreshCw } from 'lucide-react';
import './SecurityDashboard.css';

interface AccessLog {
  id: string;
  time: string;
  user: string;
  role: string;
  action: string;
  ipAddress: string;
  status: 'Success' | 'Failed' | 'MFA Challenge';
}

const ACCESS_LOGS: AccessLog[] = [
  { id: '1', time: '10:45:12 AM', user: 'admin@edupulse.edu', role: 'System Admin', action: 'Dashboard Login', ipAddress: '192.168.1.42', status: 'Success' },
  { id: '2', time: '10:41:05 AM', user: 'teacher.smith@edupulse.edu', role: 'Faculty', action: 'Gradebook Export', ipAddress: '192.168.1.88', status: 'Success' },
  { id: '3', time: '10:35:50 AM', user: 'unknown@external.net', role: 'Guest', action: 'Failed Auth Attempt', ipAddress: '185.220.101.5', status: 'Failed' },
  { id: '4', time: '10:15:20 AM', user: 'finance.lead@edupulse.edu', role: 'Finance', action: 'MFA Token Verify', ipAddress: '192.168.1.15', status: 'MFA Challenge' }
];

export const SecurityDashboard: React.FC = () => {
  return (
    <div className="ep-security">
      {/* 1. Header */}
      <header className="ep-security__header">
        <div>
          <h1 className="ep-security__title">Security, Role RBAC & System Audit</h1>
          <p className="ep-security__subtitle">Monitor active user sessions, failed auth attempts, role permissions, and system audit logs</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ep-btn ep-btn--secondary">
            <RefreshCw size={14} style={{ marginRight: 4 }} /> Rotate Keys
          </button>
          <button className="ep-btn ep-btn--primary">
            Export Audit Log
          </button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-security__kpi-grid">
        <div className="ep-security__kpi-card">
          <div className="ep-security__kpi-icon ep-security__kpi-icon--green">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="ep-security__kpi-val" style={{ color: 'var(--color-success-400)' }}>SECURE</div>
            <div className="ep-security__kpi-lbl">Global Threat Defense Status</div>
          </div>
        </div>

        <div className="ep-security__kpi-card">
          <div className="ep-security__kpi-icon ep-security__kpi-icon--blue">
            <Users size={22} />
          </div>
          <div>
            <div className="ep-security__kpi-val">142</div>
            <div className="ep-security__kpi-lbl">Active Authenticated Sessions</div>
          </div>
        </div>

        <div className="ep-security__kpi-card">
          <div className="ep-security__kpi-icon ep-security__kpi-icon--amber">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="ep-security__kpi-val">3</div>
            <div className="ep-security__kpi-lbl">Failed Auth Flags (24h)</div>
          </div>
        </div>

        <div className="ep-security__kpi-card">
          <div className="ep-security__kpi-icon ep-security__kpi-icon--purple">
            <Key size={22} />
          </div>
          <div>
            <div className="ep-security__kpi-val">100%</div>
            <div className="ep-security__kpi-lbl">MFA Enforcement (Admin/Staff)</div>
          </div>
        </div>
      </section>

      {/* 3. Table */}
      <div className="ep-table-wrapper">
        <table className="ep-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User Account</th>
              <th>System Role</th>
              <th>Action Executed</th>
              <th>IP Address</th>
              <th>Audit Status</th>
            </tr>
          </thead>
          <tbody>
            {ACCESS_LOGS.map(log => (
              <tr key={log.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{log.time}</td>
                <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{log.user}</td>
                <td><span className="ep-badge ep-badge--neutral">{log.role}</span></td>
                <td>{log.action}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{log.ipAddress}</td>
                <td>
                  <span className={`ep-badge ${log.status === 'Success' ? 'ep-badge--success' : log.status === 'Failed' ? 'ep-badge--danger' : 'ep-badge--warning'}`}>
                    {log.status === 'Success' && <CheckCircle size={12} style={{ marginRight: 4 }} />}
                    {log.status === 'Failed' && <AlertTriangle size={12} style={{ marginRight: 4 }} />}
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecurityDashboard;
