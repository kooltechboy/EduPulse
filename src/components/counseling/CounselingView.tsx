import React, { useState } from 'react';
import { HeartHandshake, Calendar, FileText, Plus, CheckCircle, Clock } from 'lucide-react';
import './CounselingView.css';

interface SessionItem {
  id: string;
  studentName: string;
  grade: string;
  counselor: string;
  date: string;
  time: string;
  topic: string;
  status: 'Scheduled' | 'Completed' | 'Follow-up Needed';
}

const SESSIONS: SessionItem[] = [
  { id: '1', studentName: 'Alex Johnson', grade: 'Grade 11', counselor: 'Dr. Emily Watson', date: '2026-10-16', time: '02:00 PM', topic: 'College Guidance & SAT Planning', status: 'Scheduled' },
  { id: '2', studentName: 'Mia Miller', grade: 'Grade 10', counselor: 'Mr. David Vance', date: '2026-10-15', time: '10:30 AM', topic: 'Academic Stress & Study Habits', status: 'Completed' },
  { id: '3', studentName: 'Lucas Brown', grade: 'Grade 12', counselor: 'Dr. Emily Watson', date: '2026-10-14', time: '11:00 AM', topic: 'Career Pathway & University Applications', status: 'Follow-up Needed' }
];

export const CounselingView: React.FC = () => {
  const [tab, setTab] = useState<'sessions' | 'notes' | 'college'>('sessions');

  return (
    <div className="ep-counseling">
      {/* 1. Header */}
      <header className="ep-counseling__header">
        <div>
          <h1 className="ep-counseling__title">Student Counseling & Guidance Center</h1>
          <p className="ep-counseling__subtitle">Schedule student wellness check-ins, college advisory, and confidential progress notes</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button 
              className={`ep-tab ${tab === 'sessions' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('sessions')}
            >
              <Calendar size={14} style={{ marginRight: 4 }} /> Sessions
            </button>
            <button 
              className={`ep-tab ${tab === 'notes' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('notes')}
            >
              <FileText size={14} style={{ marginRight: 4 }} /> Confidential Notes
            </button>
            <button 
              className={`ep-tab ${tab === 'college' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('college')}
            >
              <HeartHandshake size={14} style={{ marginRight: 4 }} /> College Advisory
            </button>
          </div>
          <button className="ep-btn ep-btn--primary">
            <Plus size={16} /> + Book Counseling Session
          </button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-counseling__kpi-grid">
        <div className="ep-counseling__kpi-card">
          <div className="ep-counseling__kpi-icon ep-counseling__kpi-icon--purple">
            <HeartHandshake size={22} />
          </div>
          <div>
            <div className="ep-counseling__kpi-val">34</div>
            <div className="ep-counseling__kpi-lbl">Active Student Consultations</div>
          </div>
        </div>

        <div className="ep-counseling__kpi-card">
          <div className="ep-counseling__kpi-icon ep-counseling__kpi-icon--blue">
            <Calendar size={22} />
          </div>
          <div>
            <div className="ep-counseling__kpi-val">8</div>
            <div className="ep-counseling__kpi-lbl">Sessions Scheduled Today</div>
          </div>
        </div>

        <div className="ep-counseling__kpi-card">
          <div className="ep-counseling__kpi-icon ep-counseling__kpi-icon--green">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="ep-counseling__kpi-val">94%</div>
            <div className="ep-counseling__kpi-lbl">Senior College App Completion</div>
          </div>
        </div>

        <div className="ep-counseling__kpi-card">
          <div className="ep-counseling__kpi-icon ep-counseling__kpi-icon--amber">
            <Clock size={22} />
          </div>
          <div>
            <div className="ep-counseling__kpi-val">3</div>
            <div className="ep-counseling__kpi-lbl">Follow-up Tasks Pending</div>
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
              <th>Counselor</th>
              <th>Date & Time</th>
              <th>Session Focus Topic</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {SESSIONS.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.studentName}</td>
                <td>{s.grade}</td>
                <td style={{ fontWeight: 600 }}>{s.counselor}</td>
                <td>{s.date} • {s.time}</td>
                <td><span className="ep-badge ep-badge--neutral">{s.topic}</span></td>
                <td>
                  <span className={`ep-badge ${s.status === 'Completed' ? 'ep-badge--success' : s.status === 'Scheduled' ? 'ep-badge--primary' : 'ep-badge--warning'}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  <button className="ep-btn ep-btn--secondary ep-btn--sm">View Summary</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CounselingView;
