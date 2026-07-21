import React, { useState } from 'react';
import { Users, FileCheck, ClipboardList, Check, X, ShieldAlert, Award } from 'lucide-react';
import './HRHub.css';

const MOCK_LEAVES = [
  { id: '1', name: 'Sarah Connor', type: 'Sick Leave', dates: 'Oct 12 - Oct 14', status: 'pending' },
  { id: '2', name: 'James Cameron', type: 'Annual Leave', dates: 'Nov 01 - Nov 05', status: 'approved' },
  { id: '3', name: 'Arnold Schwarzenegger', type: 'Personal', dates: 'Oct 10 - Oct 10', status: 'denied' },
  { id: '4', name: 'Dr. Elizabeth Shaw', type: 'Maternity Leave', dates: 'Dec 01 - Mar 01', status: 'approved' }
];

export const HRHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leave' | 'recruitment' | 'compliance'>('leave');

  return (
    <div className="ep-hr">
      {/* 1. Header */}
      <header className="ep-hr__header">
        <div>
          <h1 className="ep-hr__title">Human Resources & Staff Ops</h1>
          <p className="ep-hr__subtitle">Manage staff leave requests, recruitment pipelines, and institutional compliance</p>
        </div>
        <div className="ep-tabs" style={{ padding: '2px' }}>
          <button 
            className={`ep-tab ${activeTab === 'leave' ? 'ep-tab--active' : ''}`}
            onClick={() => setActiveTab('leave')}
          >
            <ClipboardList size={14} style={{ marginRight: 6 }} /> Leave Management
          </button>
          <button 
            className={`ep-tab ${activeTab === 'recruitment' ? 'ep-tab--active' : ''}`}
            onClick={() => setActiveTab('recruitment')}
          >
            <Users size={14} style={{ marginRight: 6 }} /> Recruitment
          </button>
          <button 
            className={`ep-tab ${activeTab === 'compliance' ? 'ep-tab--active' : ''}`}
            onClick={() => setActiveTab('compliance')}
          >
            <FileCheck size={14} style={{ marginRight: 6 }} /> Compliance
          </button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-hr__summary-cards">
        <div className="ep-hr__card">
          <div className="ep-hr__card-val">5</div>
          <div className="ep-hr__card-lbl">Pending Leave Requests</div>
        </div>
        <div className="ep-hr__card">
          <div className="ep-hr__card-val">12</div>
          <div className="ep-hr__card-lbl">Approved Leave Days</div>
        </div>
        <div className="ep-hr__card">
          <div className="ep-hr__card-val">4</div>
          <div className="ep-hr__card-lbl">Open Job Positions</div>
        </div>
        <div className="ep-hr__card">
          <div className="ep-hr__card-val">98%</div>
          <div className="ep-hr__card-lbl">Compliance Score</div>
        </div>
      </section>

      {/* 3. Content */}
      <div className="ep-hr__content">
        {activeTab === 'leave' && (
          <div className="ep-table-wrapper">
            <table className="ep-table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEAVES.map(leave => (
                  <tr key={leave.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{leave.name}</td>
                    <td><span className="ep-badge ep-badge--neutral">{leave.type}</span></td>
                    <td>{leave.dates}</td>
                    <td>
                      <span className={`ep-badge ${leave.status === 'approved' ? 'ep-badge--success' : leave.status === 'denied' ? 'ep-badge--danger' : 'ep-badge--warning'}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="ep-btn ep-btn--success ep-btn--sm"><Check size={14} /> Approve</button>
                          <button className="ep-btn ep-btn--danger ep-btn--sm"><X size={14} /> Deny</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'recruitment' && (
          <div className="ep-card" style={{ padding: '32px', textAlign: 'center' }}>
            <Users size={40} style={{ color: 'var(--color-primary-500)', marginBottom: '12px' }} />
            <h3 style={{ margin: 0 }}>Faculty Recruitment Pipeline</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>4 open positions: Mathematics Teacher, Physics Lab Instructor, Admin Specialist, Bus Driver.</p>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="ep-card" style={{ padding: '32px', textAlign: 'center' }}>
            <ShieldAlert size={40} style={{ color: 'var(--color-success-500)', marginBottom: '12px' }} />
            <h3 style={{ margin: 0 }}>Institutional HR Compliance Audit</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>All 89 staff background checks and safety certifications are 100% up to date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRHub;
