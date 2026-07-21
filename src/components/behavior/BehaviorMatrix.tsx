import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, TrendingDown, Star, Plus, CheckCircle, AlertTriangle, Award, Printer, X, FileText } from 'lucide-react';
import './BehaviorMatrix.css';

interface Incident {
  id: string;
  date: string;
  student: string;
  type: 'merit' | 'demerit';
  category: string;
  points: number;
  reportedBy: string;
}

const MOCK_INCIDENTS: Incident[] = [
  { id: '1', date: '2026-10-15', student: 'Alex Johnson', type: 'merit', category: 'STEM Competition Winner & Peer Mentorship', points: 15, reportedBy: 'Mr. Smith' },
  { id: '2', date: '2026-10-14', student: 'Sam Wilson', type: 'demerit', category: 'Classroom Disruption', points: -3, reportedBy: 'Mrs. Davis' },
  { id: '3', date: '2026-10-12', student: 'Mia Taylor', type: 'merit', category: 'Campus Sustainability & Volunteer Leadership', points: 10, reportedBy: 'Dr. Jones' }
];

const HOUSE_DATA = [
  { name: 'Phoenix House', points: 450, color: '#ef4444' },
  { name: 'Aquila House', points: 420, color: '#3b82f6' },
  { name: 'Orion House', points: 390, color: '#f59e0b' },
  { name: 'Pegasus House', points: 380, color: '#10b981' }
];

export const BehaviorMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'incidents' | 'houses' | 'reports'>('incidents');
  const [certificateIncident, setCertificateIncident] = useState<Incident | null>(null);

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="ep-behavior">
      {/* 1. Header */}
      <header className="ep-behavior__header">
        <div>
          <h1 className="ep-behavior__title">Student Conduct & PBIS Rewards Matrix</h1>
          <p className="ep-behavior__subtitle">Track student merits, PBIS positive behavior points, house cup leaderboard, and commendation certificates</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button 
              className={`ep-tab ${activeTab === 'incidents' ? 'ep-tab--active' : ''}`}
              onClick={() => setActiveTab('incidents')}
            >
              <Shield size={14} style={{ marginRight: 4 }} /> Conduct & Merits
            </button>
            <button 
              className={`ep-tab ${activeTab === 'houses' ? 'ep-tab--active' : ''}`}
              onClick={() => setActiveTab('houses')}
            >
              <Star size={14} style={{ marginRight: 4 }} /> House Leaderboard
            </button>
            <button 
              className={`ep-tab ${activeTab === 'reports' ? 'ep-tab--active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <TrendingDown size={14} style={{ marginRight: 4 }} /> Behavioral Trends
            </button>
          </div>
          <button className="ep-btn ep-btn--primary">
            <Plus size={16} /> + Log Conduct Record
          </button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-behavior__kpi-grid">
        <div className="ep-behavior__kpi-card">
          <div className="ep-behavior__kpi-icon ep-behavior__kpi-icon--green">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="ep-behavior__kpi-val">1,640</div>
            <div className="ep-behavior__kpi-lbl">Total PBIS Merits (YTD)</div>
          </div>
        </div>

        <div className="ep-behavior__kpi-card">
          <div className="ep-behavior__kpi-icon ep-behavior__kpi-icon--red">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="ep-behavior__kpi-val">42</div>
            <div className="ep-behavior__kpi-lbl">Demerits Logged</div>
          </div>
        </div>

        <div className="ep-behavior__kpi-card">
          <div className="ep-behavior__kpi-icon ep-behavior__kpi-icon--amber">
            <Star size={22} />
          </div>
          <div>
            <div className="ep-behavior__kpi-val">Phoenix</div>
            <div className="ep-behavior__kpi-lbl">Current Leading House</div>
          </div>
        </div>

        <div className="ep-behavior__kpi-card">
          <div className="ep-behavior__kpi-icon ep-behavior__kpi-icon--purple">
            <Award size={22} />
          </div>
          <div>
            <div className="ep-behavior__kpi-val">97.5%</div>
            <div className="ep-behavior__kpi-lbl">Good Standing Rate</div>
          </div>
        </div>
      </section>

      {/* 3. Content */}
      <div className="ep-behavior__content">
        {activeTab === 'incidents' && (
          <div className="ep-table-wrapper">
            <table className="ep-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student Name</th>
                  <th>Classification</th>
                  <th>Reason / Category</th>
                  <th>Points Assigned</th>
                  <th>Reported By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_INCIDENTS.map(inc => (
                  <tr key={inc.id}>
                    <td>{inc.date}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{inc.student}</td>
                    <td>
                      <span className={`ep-badge ${inc.type === 'merit' ? 'ep-badge--success' : 'ep-badge--danger'}`}>
                        {inc.type}
                      </span>
                    </td>
                    <td>{inc.category}</td>
                    <td style={{ fontWeight: 800, color: inc.points > 0 ? 'var(--color-success-400)' : 'var(--color-danger-400)' }}>
                      {inc.points > 0 ? `+${inc.points}` : inc.points}
                    </td>
                    <td>{inc.reportedBy}</td>
                    <td>
                      {inc.type === 'merit' && (
                        <button 
                          className="ep-btn ep-btn--secondary ep-btn--sm"
                          onClick={() => setCertificateIncident(inc)}
                          title="Print Official Commendation Certificate"
                        >
                          <Award size={14} style={{ marginRight: 4 }} /> Certificate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'houses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {HOUSE_DATA.map(h => (
                <div key={h.name} className="ep-card" style={{ borderTop: `4px solid ${h.color}`, padding: '20px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{h.name}</h3>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{h.points} pts</div>
                </div>
              ))}
            </div>

            <div className="ep-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0' }}>House Standings Comparison</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={HOUSE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color-text-tertiary)" />
                    <YAxis stroke="var(--color-text-tertiary)" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-50)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                    <Bar dataKey="points" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official PBIS Commendation Certificate Modal */}
      {certificateIncident && (
        <div className="ep-modal-overlay" onClick={() => setCertificateIncident(null)}>
          <div className="ep-card" style={{ width: '100%', maxWidth: '800px', background: '#ffffff', color: '#1e1b4b', padding: '0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <div className="no-print" style={{ background: '#1e1b4b', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Printable Commendation Certificate</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="ep-btn ep-btn--primary ep-btn--sm" onClick={handlePrintCertificate}>
                  <Printer size={14} style={{ marginRight: 4 }} /> Print Certificate
                </button>
                <button className="ep-btn ep-btn--ghost ep-btn--sm" onClick={() => setCertificateIncident(null)}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Printable Certificate Area */}
            <div className="printable-area" style={{ padding: '50px', textAlign: 'center', border: '12px double #4f46e5', margin: '20px', background: '#faf5ff' }}>
              <div style={{ color: '#4f46e5', marginBottom: '10px' }}>
                <Award size={54} />
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '2px', color: '#1e1b4b', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                CERTIFICATE OF COMMENDATION
              </h1>
              <p style={{ fontSize: '14px', color: '#6b21a8', fontStyle: 'italic', margin: 0 }}>EduPulse Academy of Excellence • PBIS Honor Roll</p>
              
              <hr style={{ width: '80%', border: 0, height: '2px', background: '#c084fc', margin: '24px auto' }} />

              <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 10px 0' }}>This Official Award is Proudly Presented To</p>
              <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#4f46e5', margin: '0 0 16px 0', textDecoration: 'underline' }}>
                {certificateIncident.student}
              </h2>

              <p style={{ fontSize: '15px', color: '#334155', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
                In recognition of outstanding behavioral leadership, academic integrity, and exemplary contributions in:
                <br />
                <strong style={{ color: '#1e1b4b', fontSize: '16px' }}>"{certificateIncident.category}"</strong>
              </p>

              <div style={{ display: 'inline-block', background: '#e0e7ff', border: '1px solid #818cf8', borderRadius: '20px', padding: '6px 20px', fontSize: '14px', fontWeight: 800, color: '#3730a3', marginBottom: '30px' }}>
                Awarded +{certificateIncident.points} PBIS Merit Points
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #cbd5e1' }}>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <div style={{ borderBottom: '1px solid #0f172a', fontWeight: 700, paddingBottom: '4px', fontSize: '13px' }}>{certificateIncident.reportedBy}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Nominating Faculty</div>
                </div>

                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '10px' }}>
                  <FileText size={20} />
                  <div>OFFICIAL MERIT SEAL</div>
                </div>

                <div style={{ textAlign: 'center', width: '200px' }}>
                  <div style={{ borderBottom: '1px solid #0f172a', fontWeight: 700, paddingBottom: '4px', fontSize: '13px' }}>Dr. Eleanor Vance</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Academy Principal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BehaviorMatrix;
