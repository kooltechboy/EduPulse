import React, { useState } from 'react';
import { BarChart, Users, Book, Clock, Plus, CheckCircle } from 'lucide-react';
import './CoordinationView.css';

interface TaskItem {
  id: string;
  department: string;
  taskName: string;
  lead: string;
  progress: number;
  status: 'In Progress' | 'Review' | 'Complete';
}

const TASKS: TaskItem[] = [
  { id: '1', department: 'Science Dept', taskName: 'Q3 STEM Lab Syllabus Review', lead: 'Dr. Jones', progress: 85, status: 'Review' },
  { id: '2', department: 'Mathematics', taskName: 'AP Calculus Curriculum Alignment', lead: 'Mr. Smith', progress: 60, status: 'In Progress' },
  { id: '3', department: 'Humanities', taskName: 'Annual Literature Book Selection', lead: 'Ms. Davis', progress: 100, status: 'Complete' },
  { id: '4', department: 'Athletics', taskName: 'Sports Day Logistics Plan', lead: 'Coach Wilson', progress: 40, status: 'In Progress' }
];

export const CoordinationView: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'evaluations' | 'curriculum' | 'hr'>('overview');

  return (
    <div className="ep-coordination">
      {/* 1. Header */}
      <header className="ep-coordination__header">
        <div>
          <h1 className="ep-coordination__title">Cross-Department Academic Coordination</h1>
          <p className="ep-coordination__subtitle">Oversee department heads, curriculum milestones, faculty evaluations, and HR requests</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button 
              className={`ep-tab ${tab === 'overview' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('overview')}
            >
              <BarChart size={14} style={{ marginRight: 4 }} /> Overview
            </button>
            <button 
              className={`ep-tab ${tab === 'evaluations' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('evaluations')}
            >
              <Users size={14} style={{ marginRight: 4 }} /> Faculty Evaluations
            </button>
            <button 
              className={`ep-tab ${tab === 'curriculum' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('curriculum')}
            >
              <Book size={14} style={{ marginRight: 4 }} /> Curriculum
            </button>
            <button 
              className={`ep-tab ${tab === 'hr' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('hr')}
            >
              <Clock size={14} style={{ marginRight: 4 }} /> HR Requests
            </button>
          </div>
          <button className="ep-btn ep-btn--primary">
            <Plus size={16} /> + New Initiative
          </button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-coordination__kpi-grid">
        <div className="ep-coordination__kpi-card">
          <div className="ep-coordination__kpi-icon ep-coordination__kpi-icon--blue">
            <Book size={22} />
          </div>
          <div>
            <div className="ep-coordination__kpi-val">74%</div>
            <div className="ep-coordination__kpi-lbl">Curriculum Milestone Completion</div>
          </div>
        </div>

        <div className="ep-coordination__kpi-card">
          <div className="ep-coordination__kpi-icon ep-coordination__kpi-icon--amber">
            <Clock size={22} />
          </div>
          <div>
            <div className="ep-coordination__kpi-val">5</div>
            <div className="ep-coordination__kpi-lbl">Pending Department Requests</div>
          </div>
        </div>

        <div className="ep-coordination__kpi-card">
          <div className="ep-coordination__kpi-icon ep-coordination__kpi-icon--green">
            <Users size={22} />
          </div>
          <div>
            <div className="ep-coordination__kpi-val">28</div>
            <div className="ep-coordination__kpi-lbl">Faculty Evaluations Completed</div>
          </div>
        </div>

        <div className="ep-coordination__kpi-card">
          <div className="ep-coordination__kpi-icon ep-coordination__kpi-icon--purple">
            <BarChart size={22} />
          </div>
          <div>
            <div className="ep-coordination__kpi-val">5</div>
            <div className="ep-coordination__kpi-lbl">Academic Departments</div>
          </div>
        </div>
      </section>

      {/* 3. Table */}
      <div className="ep-table-wrapper">
        <table className="ep-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Initiative / Task</th>
              <th>Department Lead</th>
              <th>Progress Tracker</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {TASKS.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 700, color: 'var(--color-primary-400)' }}>{t.department}</td>
                <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{t.taskName}</td>
                <td>{t.lead}</td>
                <td>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{t.progress}%</div>
                  <div className="ep-progress" style={{ height: '6px', width: '120px' }}>
                    <div className="ep-progress__bar" style={{ width: `${t.progress}%` }} />
                  </div>
                </td>
                <td>
                  <span className={`ep-badge ${t.status === 'Complete' ? 'ep-badge--success' : t.status === 'Review' ? 'ep-badge--warning' : 'ep-badge--primary'}`}>
                    {t.status === 'Complete' && <CheckCircle size={12} style={{ marginRight: 4 }} />}
                    {t.status}
                  </span>
                </td>
                <td>
                  <button className="ep-btn ep-btn--secondary ep-btn--sm">Review Task</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoordinationView;
