import React from 'react';
import './CoordinatorDashboard.css';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, TrendingUp, CheckSquare, AlertCircle, Calendar } from 'lucide-react';

const DEPARTMENTS = [
  { subject: 'Math', coverage: 85 },
  { subject: 'Science', coverage: 70 },
  { subject: 'English', coverage: 90 },
  { subject: 'Arts', coverage: 65 },
  { subject: 'PE', coverage: 95 },
  { subject: 'History', coverage: 80 },
];

const TEACHERS = [
  { id: 1, name: 'Alice Smith', dept: 'Math', classes: 5, avgGrade: '88%', evalScore: 4.5, status: 'Active' },
  { id: 2, name: 'Bob Jones', dept: 'Science', classes: 4, avgGrade: '82%', evalScore: 3.8, status: 'Needs Review' },
  { id: 3, name: 'Carol Davis', dept: 'English', classes: 5, avgGrade: '91%', evalScore: 4.8, status: 'Active' },
  { id: 4, name: 'Dave Wilson', dept: 'History', classes: 4, avgGrade: '85%', evalScore: 4.2, status: 'Active' },
];

const HR_REQUESTS = [
  { id: 1, type: 'Leave', person: 'Alice Smith', dates: 'Oct 20 - Oct 22', status: 'Pending' },
  { id: 2, type: 'Substitute', person: 'Bob Jones', dates: 'Oct 18', status: 'Approved' },
];

const CONFLICTS = [
  { id: 1, issue: 'Room Double Booking', details: 'Room 302 at 10:00 AM (Math & History)' },
];

const EVALUATIONS = [
  { id: 1, teacher: 'Bob Jones', date: 'Oct 25, 2026', time: '10:00 AM' },
  { id: 2, teacher: 'Dave Wilson', date: 'Oct 28, 2026', time: '01:00 PM' },
];

export const CoordinatorDashboard: React.FC = () => {
  return (
    <div className="ep-coord-dash">
      <header className="ep-coord-dash__header">
        <h1>Coordinator Dashboard</h1>
      </header>

      {/* Overview Stats */}
      <div className="ep-coord-dash__stats-grid">
        <div className="ep-coord-dash__stat-card">
          <Users size={24} className="ep-coord-dash__stat-icon" />
          <div className="ep-coord-dash__stat-content">
            <span className="ep-coord-dash__stat-val">42</span>
            <span className="ep-coord-dash__stat-label">Teachers</span>
          </div>
        </div>
        <div className="ep-coord-dash__stat-card">
          <BookOpen size={24} className="ep-coord-dash__stat-icon" />
          <div className="ep-coord-dash__stat-content">
            <span className="ep-coord-dash__stat-val">128</span>
            <span className="ep-coord-dash__stat-label">Active Courses</span>
          </div>
        </div>
        <div className="ep-coord-dash__stat-card">
          <TrendingUp size={24} className="ep-coord-dash__stat-icon" />
          <div className="ep-coord-dash__stat-content">
            <span className="ep-coord-dash__stat-val">86%</span>
            <span className="ep-coord-dash__stat-label">Avg Student Perf</span>
          </div>
        </div>
        <div className="ep-coord-dash__stat-card ep-coord-dash__stat-card--alert">
          <CheckSquare size={24} className="ep-coord-dash__stat-icon" />
          <div className="ep-coord-dash__stat-content">
            <span className="ep-coord-dash__stat-val">5</span>
            <span className="ep-coord-dash__stat-label">Pending Evals</span>
          </div>
        </div>
      </div>

      <div className="ep-coord-dash__grid">
        <div className="ep-coord-dash__col ep-coord-dash__col--left">
          
          {/* Teacher Performance */}
          <div className="ep-coord-dash__panel">
            <h3 className="ep-coord-dash__panel-title">Teacher Performance</h3>
            <div className="ep-coord-dash__table-wrapper">
              <table className="ep-coord-dash__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Dept</th>
                    <th>Classes</th>
                    <th>Avg Grade</th>
                    <th>Eval Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TEACHERS.map(t => (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td>{t.dept}</td>
                      <td>{t.classes}</td>
                      <td>{t.avgGrade}</td>
                      <td>{t.evalScore}</td>
                      <td>
                        <span className={`ep-coord-dash__badge ep-coord-dash__badge--${t.status === 'Active' ? 'success' : 'warning'}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Curriculum Coverage */}
          <div className="ep-coord-dash__panel">
            <h3 className="ep-coord-dash__panel-title">Curriculum Coverage</h3>
            <div className="ep-coord-dash__chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={DEPARTMENTS}>
                  <PolarGrid stroke="var(--color-surface-border, #e2e8f0)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary, #64748b)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name="Coverage" dataKey="coverage" stroke="var(--color-primary-500, #3b82f6)" fill="var(--color-primary-500, #3b82f6)" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        <div className="ep-coord-dash__col ep-coord-dash__col--right">
          
          {/* HR Requests */}
          <div className="ep-coord-dash__panel">
            <h3 className="ep-coord-dash__panel-title">HR Requests</h3>
            <ul className="ep-coord-dash__list">
              {HR_REQUESTS.map(req => (
                <li key={req.id} className="ep-coord-dash__list-item">
                  <div className="ep-coord-dash__list-info">
                    <h4>{req.type}: {req.person}</h4>
                    <p>{req.dates}</p>
                  </div>
                  <span className={`ep-coord-dash__badge ep-coord-dash__badge--${req.status === 'Approved' ? 'success' : 'pending'}`}>
                    {req.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Schedule Conflicts */}
          <div className="ep-coord-dash__panel">
            <h3 className="ep-coord-dash__panel-title">Schedule Conflicts</h3>
            {CONFLICTS.length > 0 ? (
              <ul className="ep-coord-dash__list">
                {CONFLICTS.map(c => (
                  <li key={c.id} className="ep-coord-dash__list-item ep-coord-dash__list-item--alert">
                    <AlertCircle size={20} className="ep-coord-dash__alert-icon" />
                    <div>
                      <h4>{c.issue}</h4>
                      <p>{c.details}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ep-coord-dash__empty">No scheduling conflicts.</p>
            )}
          </div>

          {/* Upcoming Evaluations */}
          <div className="ep-coord-dash__panel">
            <h3 className="ep-coord-dash__panel-title">Upcoming Evaluations</h3>
            <ul className="ep-coord-dash__list">
              {EVALUATIONS.map(ev => (
                <li key={ev.id} className="ep-coord-dash__list-item">
                  <Calendar size={20} className="ep-coord-dash__icon-muted" />
                  <div className="ep-coord-dash__list-info">
                    <h4>{ev.teacher}</h4>
                    <p>{ev.date} at {ev.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};
