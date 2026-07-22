import React, { useState } from 'react';
import { ShieldCheck, Users, AlertTriangle, Key, Lock, CheckCircle, RefreshCw, X, Download, Trash2 } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import './SecurityDashboard.css';

interface AccessLog {
  id: string;
  time: string;
  user: string;
  role: string;
  action: string;
  ipAddress: string;
  status: 'Success' | 'Failed' | 'MFA Challenge';
  reviewed?: boolean;
}

const INITIAL_LOGS: AccessLog[] = [
  { id: '1', time: '2 min ago', user: 'admin@edupulse.edu', role: 'System Admin', action: 'Dashboard Login', ipAddress: '192.168.1.42', status: 'Success' },
  { id: '2', time: '5 min ago', user: 'teacher.smith@edupulse.edu', role: 'Faculty', action: 'Gradebook Export', ipAddress: '192.168.1.88', status: 'Success' },
  { id: '3', time: '1 hour ago', user: 'unknown@external.net', role: 'Guest', action: 'Failed Auth Attempt', ipAddress: '185.220.101.5', status: 'Failed' },
  { id: '4', time: '2 hours ago', user: 'finance.lead@edupulse.edu', role: 'Finance', action: 'MFA Token Verify', ipAddress: '192.168.1.15', status: 'MFA Challenge' }
];

export const SecurityDashboard: React.FC = () => {
  const addToast = useUIStore(s => s.addToast);
  const [logs, setLogs] = useState<AccessLog[]>(INITIAL_LOGS);
  const [showRotateModal, setShowRotateModal] = useState(false);

  const handleRotateKeys = () => {
    setShowRotateModal(false);
    addToast({ type: 'warning', title: 'Keys Rotated', message: 'All API keys have been rotated. Users will need to re-authenticate.' });
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Event,User,IP Address,Status\n"
      + logs.map(e => `${e.time},${e.action},${e.user},${e.ipAddress},${e.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_log.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    addToast({ type: 'success', title: 'Export Complete', message: 'Audit log exported successfully.' });
  };

  const handleAcknowledge = (id: string) => {
    setLogs(prev => prev.map(l => l.id === id ? { ...l, reviewed: true } : l));
    addToast({ type: 'info', title: 'Alert Acknowledged', message: 'Security alert marked as reviewed.' });
  };

  const handleClearAll = () => {
    setLogs([]);
    addToast({ type: 'info', title: 'Logs Cleared', message: 'All recent activity logs have been cleared.' });
  };
  return (
    <div className="ep-security">
      {/* 1. Header */}
      <header className="ep-security__header">
        <div>
          <h1 className="ep-security__title">Security, Role RBAC & System Audit</h1>
          <p className="ep-security__subtitle">Monitor active user sessions, failed auth attempts, role permissions, and system audit logs</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ep-btn ep-btn--secondary" onClick={() => setShowRotateModal(true)}>
            <RefreshCw size={14} style={{ marginRight: 4 }} /> Rotate Keys
          </button>
          <button className="ep-btn ep-btn--primary" onClick={handleExport}>
            <Download size={14} style={{ marginRight: 4 }} /> Export Audit Log
          </button>
          <button className="ep-btn ep-btn--danger" onClick={handleClearAll}>
            <Trash2 size={14} style={{ marginRight: 4 }} /> Clear All
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
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
                <td>
                  <button 
                    className="ep-btn ep-btn--secondary ep-btn--sm"
                    disabled={log.reviewed}
                    onClick={() => handleAcknowledge(log.id)}
                  >
                    {log.reviewed ? 'Acknowledged ✓' : 'Acknowledge'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showRotateModal && (
        <div className="ep-modal-overlay" onClick={() => setShowRotateModal(false)}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>Rotate API Keys</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowRotateModal(false)}><X size={20} /></button>
            </div>
            <div className="ep-modal-content">
              <p style={{ color: 'var(--color-danger-500)', fontWeight: 600 }}>This will invalidate all existing API sessions. Continue?</p>
            </div>
            <div className="ep-modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowRotateModal(false)}>Cancel</button>
              <button className="ep-btn ep-btn--danger" onClick={handleRotateKeys}>Rotate Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard;
