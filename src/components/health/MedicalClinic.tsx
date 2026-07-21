import React, { useState } from 'react';
import { ShieldAlert, Activity, Syringe, Plus, HeartPulse, UserCheck, AlertTriangle } from 'lucide-react';
import './MedicalClinic.css';

interface HealthRecord {
  id: string;
  studentName: string;
  grade: string;
  condition: string;
  type: 'Allergy' | 'Chronic' | 'Incident' | 'Vaccine';
  severity: 'high' | 'medium' | 'low';
  lastChecked: string;
}

const RECORDS: HealthRecord[] = [
  { id: '1', studentName: 'John Doe', grade: 'Grade 10', condition: 'Severe Peanut Allergy (EpiPen Required)', type: 'Allergy', severity: 'high', lastChecked: '2026-10-01' },
  { id: '2', studentName: 'Alice Smith', grade: 'Grade 9', condition: 'Asthma - Inhaler at Nurse Station', type: 'Chronic', severity: 'medium', lastChecked: '2026-09-15' },
  { id: '3', studentName: 'Bob Brown', grade: 'Grade 11', condition: 'Annual Flu Vaccination Completed', type: 'Vaccine', severity: 'low', lastChecked: '2026-10-04' },
  { id: '4', studentName: 'Emma Watson', grade: 'Grade 8', condition: 'Ankle Sprain during PE Class', type: 'Incident', severity: 'medium', lastChecked: '2026-10-12' }
];

export const MedicalClinic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'incidents' | 'immunizations'>('records');

  return (
    <div className="ep-medical-clinic">
      {/* 1. Header */}
      <header className="ep-medical-clinic__header">
        <div>
          <h1 className="ep-medical-clinic__title">Campus Medical Clinic & Student Health</h1>
          <p className="ep-medical-clinic__subtitle">Track allergy warnings, chronic illness protocols, clinic visits, and immunization logs</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button 
              className={`ep-tab ${activeTab === 'records' ? 'ep-tab--active' : ''}`}
              onClick={() => setActiveTab('records')}
            >
              <Activity size={14} style={{ marginRight: 4 }} /> Health Records
            </button>
            <button 
              className={`ep-tab ${activeTab === 'incidents' ? 'ep-tab--active' : ''}`}
              onClick={() => setActiveTab('incidents')}
            >
              <ShieldAlert size={14} style={{ marginRight: 4 }} /> Clinic Incidents
            </button>
            <button 
              className={`ep-tab ${activeTab === 'immunizations' ? 'ep-tab--active' : ''}`}
              onClick={() => setActiveTab('immunizations')}
            >
              <Syringe size={14} style={{ marginRight: 4 }} /> Immunizations
            </button>
          </div>
          <button className="ep-btn ep-btn--primary">
            <Plus size={16} /> + Log Health Record
          </button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-medical-clinic__kpi-grid">
        <div className="ep-medical-clinic__kpi-card">
          <div className="ep-medical-clinic__kpi-icon ep-medical-clinic__kpi-icon--blue">
            <HeartPulse size={22} />
          </div>
          <div>
            <div className="ep-medical-clinic__kpi-val">1,247</div>
            <div className="ep-medical-clinic__kpi-lbl">Student Medical Profiles</div>
          </div>
        </div>

        <div className="ep-medical-clinic__kpi-card">
          <div className="ep-medical-clinic__kpi-icon ep-medical-clinic__kpi-icon--rose">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="ep-medical-clinic__kpi-val">18</div>
            <div className="ep-medical-clinic__kpi-lbl">High-Severity Allergy Flags</div>
          </div>
        </div>

        <div className="ep-medical-clinic__kpi-card">
          <div className="ep-medical-clinic__kpi-icon ep-medical-clinic__kpi-icon--amber">
            <Activity size={22} />
          </div>
          <div>
            <div className="ep-medical-clinic__kpi-val">5</div>
            <div className="ep-medical-clinic__kpi-lbl">Clinic Visits Today</div>
          </div>
        </div>

        <div className="ep-medical-clinic__kpi-card">
          <div className="ep-medical-clinic__kpi-icon ep-medical-clinic__kpi-icon--green">
            <UserCheck size={22} />
          </div>
          <div>
            <div className="ep-medical-clinic__kpi-val">99.1%</div>
            <div className="ep-medical-clinic__kpi-lbl">Immunization Compliance</div>
          </div>
        </div>
      </section>

      {/* 3. Table */}
      <div className="ep-table-wrapper">
        <table className="ep-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Grade Level</th>
              <th>Medical Condition / Record</th>
              <th>Record Type</th>
              <th>Severity Flag</th>
              <th>Last Checked</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {RECORDS.map(rec => (
              <tr key={rec.id}>
                <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{rec.studentName}</td>
                <td>{rec.grade}</td>
                <td style={{ fontWeight: 600 }}>{rec.condition}</td>
                <td><span className="ep-badge ep-badge--neutral">{rec.type}</span></td>
                <td>
                  <span className={`ep-badge ${rec.severity === 'high' ? 'ep-badge--danger' : rec.severity === 'medium' ? 'ep-badge--warning' : 'ep-badge--success'}`}>
                    {rec.severity} priority
                  </span>
                </td>
                <td>{rec.lastChecked}</td>
                <td>
                  <button className="ep-btn ep-btn--secondary ep-btn--sm">View Chart</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicalClinic;
