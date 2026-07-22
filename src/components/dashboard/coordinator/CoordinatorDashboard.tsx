import React, { useState } from 'react';
import './CoordinatorDashboard.css';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, TrendingUp, CheckSquare, AlertCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores/uiStore';

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
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [curriculumItems, setCurriculumItems] = useState([
    { id: 1, title: 'New Math Standard', status: 'pending' },
    { id: 2, title: 'Revised Science Labs', status: 'pending' }
  ]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalItem, setApprovalItem] = useState<{id: number, title: string, status: string} | null>(null);

  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalData, setEvalData] = useState({ teacher: '', rating: '5', strengths: '', improvements: '' });

  const [showSubModal, setShowSubModal] = useState(false);
  const [subData, setSubData] = useState({ absent: '', subject: '', date: '', sub: '' });

  const handleApprove = () => {
    if (!approvalItem) return;
    setCurriculumItems(curriculumItems.map(i => i.id === approvalItem.id ? { ...i, status: 'approved' } : i));
    addToast({ type: 'success', title: 'Curriculum Approved', message: `${approvalItem.title} was approved.` });
    setShowApprovalModal(false);
  };
  const handleReject = () => {
    if (!approvalItem) return;
    setCurriculumItems(curriculumItems.map(i => i.id === approvalItem.id ? { ...i, status: 'rejected' } : i));
    addToast({ type: 'warning', title: 'Curriculum Rejected', message: `${approvalItem.title} was rejected.` });
    setShowApprovalModal(false);
  };
  
  const handleSubmitEval = () => {
    addToast({ type: 'success', title: 'Evaluation Submitted', message: `Saved evaluation for ${evalData.teacher}.` });
    setShowEvalModal(false);
  };

  const handleAssignSub = () => {
    addToast({ type: 'success', title: 'Substitute Assigned', message: `Assigned ${subData.sub} for ${subData.absent}.` });
    setShowSubModal(false);
  };

  return (
    <div className="ep-coord-dash">
      <header className="ep-coord-dash__header">
        <h1>Coordinator Dashboard</h1>
      </header>

      {/* Overview Stats */}
      <div className="ep-coord-dash__stats-grid">
        <div className="ep-coord-dash__stat-card" onClick={() => navigate('/staff')} style={{ cursor: 'pointer' }}>
          <Users size={24} className="ep-coord-dash__stat-icon" />
          <div className="ep-coord-dash__stat-content">
            <span className="ep-coord-dash__stat-val">42</span>
            <span className="ep-coord-dash__stat-label">Teachers</span>
          </div>
        </div>
        <div className="ep-coord-dash__stat-card" onClick={() => navigate('/curriculum')} style={{ cursor: 'pointer' }}>
          <BookOpen size={24} className="ep-coord-dash__stat-icon" />
          <div className="ep-coord-dash__stat-content">
            <span className="ep-coord-dash__stat-val">128</span>
            <span className="ep-coord-dash__stat-label">Active Courses</span>
          </div>
        </div>
        <div className="ep-coord-dash__stat-card" onClick={() => navigate('/reports')} style={{ cursor: 'pointer' }}>
          <TrendingUp size={24} className="ep-coord-dash__stat-icon" />
          <div className="ep-coord-dash__stat-content">
            <span className="ep-coord-dash__stat-val">86%</span>
            <span className="ep-coord-dash__stat-label">Avg Student Perf</span>
          </div>
        </div>
        <div className="ep-coord-dash__stat-card ep-coord-dash__stat-card--alert" onClick={() => setShowEvalModal(true)} style={{ cursor: 'pointer' }}>
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
                  <button className="ep-btn ep-btn--secondary" style={{ padding: '2px 8px', fontSize: '12px' }} onClick={() => { setSubData({ ...subData, absent: req.person, date: req.dates }); setShowSubModal(true); }}>Assign Sub</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Schedule Conflicts */}
          <div className="ep-coord-dash__panel">
            <h3 className="ep-coord-dash__panel-title">Schedule Conflicts</h3>
            <div style={{ marginBottom: '10px' }}>
              <h4>Curriculum Approval Needs</h4>
              <ul className="ep-coord-dash__list" style={{ marginBottom: '20px' }}>
                {curriculumItems.map(item => (
                  <li key={item.id} className="ep-coord-dash__list-item">
                    <span>{item.title} - {item.status}</span>
                    {item.status === 'pending' && <button className="ep-btn ep-btn--primary" style={{ padding: '2px 8px', fontSize: '12px' }} onClick={() => { setApprovalItem(item); setShowApprovalModal(true); }}>Review</button>}
                  </li>
                ))}
              </ul>
            </div>
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

      {showApprovalModal && (
        <div className="ep-coord-dash__modal-overlay" onClick={() => setShowApprovalModal(false)}>
          <div className="ep-coord-dash__modal" onClick={e => e.stopPropagation()}>
            <div className="ep-coord-dash__modal-header">
              <h2 className="ep-coord-dash__modal-title">Approve Curriculum?</h2>
              <button className="ep-btn ep-btn--text" onClick={() => setShowApprovalModal(false)}>X</button>
            </div>
            <div className="ep-coord-dash__modal-body">
              <p>Approve {approvalItem?.title}?</p>
            </div>
            <div className="ep-coord-dash__modal-actions">
              <button className="ep-btn ep-btn--secondary" style={{ color: 'var(--color-danger-500)' }} onClick={handleReject}>Reject</button>
              <button className="ep-btn ep-btn--primary" onClick={handleApprove}>Approve</button>
            </div>
          </div>
        </div>
      )}

      {showEvalModal && (
        <div className="ep-coord-dash__modal-overlay" onClick={() => setShowEvalModal(false)}>
          <div className="ep-coord-dash__modal" onClick={e => e.stopPropagation()}>
            <div className="ep-coord-dash__modal-header">
              <h2 className="ep-coord-dash__modal-title">Submit Faculty Evaluation</h2>
              <button className="ep-btn ep-btn--text" onClick={() => setShowEvalModal(false)}>X</button>
            </div>
            <div className="ep-coord-dash__modal-body">
              <label>Teacher</label>
              <select className="ep-input" value={evalData.teacher} onChange={e => setEvalData({...evalData, teacher: e.target.value})}>
                <option value="">Select Teacher</option>
                {TEACHERS.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
              <label>Rating (1-5)</label>
              <input type="number" min="1" max="5" className="ep-input" value={evalData.rating} onChange={e => setEvalData({...evalData, rating: e.target.value})} />
              <label>Strengths</label>
              <textarea className="ep-input" rows={2} value={evalData.strengths} onChange={e => setEvalData({...evalData, strengths: e.target.value})}></textarea>
              <label>Areas for Improvement</label>
              <textarea className="ep-input" rows={2} value={evalData.improvements} onChange={e => setEvalData({...evalData, improvements: e.target.value})}></textarea>
            </div>
            <div className="ep-coord-dash__modal-actions">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowEvalModal(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleSubmitEval}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {showSubModal && (
        <div className="ep-coord-dash__modal-overlay" onClick={() => setShowSubModal(false)}>
          <div className="ep-coord-dash__modal" onClick={e => e.stopPropagation()}>
            <div className="ep-coord-dash__modal-header">
              <h2 className="ep-coord-dash__modal-title">Assign Substitute</h2>
              <button className="ep-btn ep-btn--text" onClick={() => setShowSubModal(false)}>X</button>
            </div>
            <div className="ep-coord-dash__modal-body">
              <label>Absent Teacher</label>
              <input type="text" className="ep-input" value={subData.absent} disabled />
              <label>Date</label>
              <input type="text" className="ep-input" value={subData.date} onChange={e => setSubData({...subData, date: e.target.value})} />
              <label>Subject</label>
              <input type="text" className="ep-input" value={subData.subject} onChange={e => setSubData({...subData, subject: e.target.value})} placeholder="e.g. Math" />
              <label>Substitute Name</label>
              <input type="text" className="ep-input" value={subData.sub} onChange={e => setSubData({...subData, sub: e.target.value})} />
            </div>
            <div className="ep-coord-dash__modal-actions">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowSubModal(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleAssignSub}>Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
