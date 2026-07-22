import React, { useState } from 'react';
import { BarChart, Users, Book, Clock, Plus, CheckCircle, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import './CoordinationView.css';

interface Milestone {
  id: string;
  name: string;
  completed: boolean;
}

interface TaskItem {
  id: string;
  department: string;
  taskName: string;
  lead: string;
  progress: number;
  status: 'In Progress' | 'Review' | 'Complete' | 'active' | 'completed';
  milestones: Milestone[];
}

const INITIAL_TASKS: TaskItem[] = [
  { id: '1', department: 'Science Dept', taskName: 'Q3 STEM Lab Syllabus Review', lead: 'Dr. Jones', progress: 85, status: 'Review', milestones: [{id:'m1', name:'Draft', completed:true}, {id:'m2', name:'Review', completed:true}, {id:'m3', name:'Publish', completed:false}] },
  { id: '2', department: 'Mathematics', taskName: 'AP Calculus Curriculum Alignment', lead: 'Mr. Smith', progress: 60, status: 'In Progress', milestones: [{id:'m4', name:'Plan', completed:true}, {id:'m5', name:'Execution', completed:false}] },
  { id: '3', department: 'Humanities', taskName: 'Annual Literature Book Selection', lead: 'Ms. Davis', progress: 100, status: 'Complete', milestones: [{id:'m6', name:'Select', completed:true}] },
  { id: '4', department: 'Athletics', taskName: 'Sports Day Logistics Plan', lead: 'Coach Wilson', progress: 40, status: 'In Progress', milestones: [{id:'m7', name:'Budget', completed:true}, {id:'m8', name:'Schedule', completed:false}, {id:'m9', name:'Equip', completed:false}] }
];

export const CoordinationView: React.FC = () => {
  const addToast = useUIStore(s => s.addToast);
  const [tab, setTab] = useState<'overview' | 'evaluations' | 'curriculum' | 'hr'>('overview');
  
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  
  const [showInitModal, setShowInitModal] = useState(false);
  const [initForm, setInitForm] = useState({ title: '', desc: '', dept: 'Science Dept', start: '', end: '', priority: 'Medium', lead: '' });

  const [showHRModal, setShowHRModal] = useState(false);
  const [hrForm, setHrForm] = useState({ type: 'New Hire', desc: '', dept: 'Science Dept', urgency: 'Medium' });

  const handleInitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: TaskItem = {
      id: Date.now().toString(),
      department: initForm.dept,
      taskName: initForm.title,
      lead: initForm.lead,
      progress: 0,
      status: 'active',
      milestones: [{ id: `m-${Date.now()}`, name: 'Kickoff', completed: false }]
    };
    setTasks([newTask, ...tasks]);
    setShowInitModal(false);
    addToast({ type: 'success', title: 'Initiative Created', message: 'New cross-department initiative has been launched.' });
  };

  const handleHRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHRModal(false);
    addToast({ type: 'success', title: 'HR Request Submitted', message: 'Your HR request has been forwarded to the department.' });
  };

  const toggleMilestone = (taskId: string, mId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newMilestones = t.milestones.map(m => m.id === mId ? { ...m, completed: !m.completed } : m);
        const allCompleted = newMilestones.every(m => m.completed) && newMilestones.length > 0;
        let newStatus = t.status;
        if (allCompleted) {
          newStatus = 'completed';
          addToast({ type: 'success', title: 'Initiative Complete!', message: `All milestones achieved for ${t.taskName}.` });
        } else if (t.status === 'completed' || t.status === 'Complete') {
          newStatus = 'In Progress';
        }
        return { ...t, milestones: newMilestones, status: newStatus };
      }
      return t;
    }));
  };

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
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="ep-btn ep-btn--secondary" onClick={() => setShowHRModal(true)}>
              Submit HR Request
            </button>
            <button className="ep-btn ep-btn--primary" onClick={() => setShowInitModal(true)}>
              <Plus size={16} /> + New Initiative
            </button>
          </div>
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
            {tasks.map(t => {
              const comp = t.milestones.filter(m => m.completed).length;
              const tot = t.milestones.length;
              const pct = tot > 0 ? Math.round((comp / tot) * 100) : t.progress;

              return (
                <tr key={t.id}>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary-400)' }}>{t.department}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {t.taskName}
                    {tot > 0 && (
                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {t.milestones.map(m => (
                          <label key={m.id} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'normal', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                            <input type="checkbox" checked={m.completed} onChange={() => toggleMilestone(t.id, m.id)} /> {m.name}
                          </label>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>{t.lead}</td>
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{pct}%</div>
                    <div className="ep-progress" style={{ height: '6px', width: '120px', background: 'var(--color-surface-200)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div className="ep-progress__bar" style={{ width: `${pct}%`, height: '100%', background: 'var(--color-primary-500)', transition: 'width 0.3s ease' }} />
                    </div>
                  </td>
                  <td>
                    <span className={`ep-badge ${t.status === 'Complete' || t.status === 'completed' ? 'ep-badge--success' : t.status === 'Review' ? 'ep-badge--warning' : 'ep-badge--primary'}`}>
                      {(t.status === 'Complete' || t.status === 'completed') && <CheckCircle size={12} style={{ marginRight: 4 }} />}
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <button className="ep-btn ep-btn--secondary ep-btn--sm">Review Task</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showInitModal && (
        <div className="ep-modal-overlay" onClick={() => setShowInitModal(false)}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>New Initiative</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowInitModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleInitSubmit}>
              <div className="ep-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Initiative Title" required className="ep-input" value={initForm.title} onChange={e => setInitForm({...initForm, title: e.target.value})} />
                <textarea placeholder="Description" required className="ep-input" value={initForm.desc} onChange={e => setInitForm({...initForm, desc: e.target.value})}></textarea>
                <select className="ep-input" value={initForm.dept} onChange={e => setInitForm({...initForm, dept: e.target.value})}>
                  <option value="Science Dept">Science Dept</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Athletics">Athletics</option>
                </select>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="date" required className="ep-input" style={{ flex: 1 }} value={initForm.start} onChange={e => setInitForm({...initForm, start: e.target.value})} />
                  <input type="date" required className="ep-input" style={{ flex: 1 }} value={initForm.end} onChange={e => setInitForm({...initForm, end: e.target.value})} />
                </div>
                <select className="ep-input" value={initForm.priority} onChange={e => setInitForm({...initForm, priority: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <input type="text" placeholder="Assigned To" required className="ep-input" value={initForm.lead} onChange={e => setInitForm({...initForm, lead: e.target.value})} />
              </div>
              <div className="ep-modal-footer">
                <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setShowInitModal(false)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">Save Initiative</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showHRModal && (
        <div className="ep-modal-overlay" onClick={() => setShowHRModal(false)}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>Submit HR Request</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowHRModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleHRSubmit}>
              <div className="ep-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <select className="ep-input" value={hrForm.type} onChange={e => setHrForm({...hrForm, type: e.target.value})}>
                  <option value="New Hire">New Hire</option>
                  <option value="Leave Approval">Leave Approval</option>
                  <option value="Salary Review">Salary Review</option>
                  <option value="Training">Training</option>
                  <option value="Equipment">Equipment</option>
                </select>
                <textarea placeholder="Description" required className="ep-input" value={hrForm.desc} onChange={e => setHrForm({...hrForm, desc: e.target.value})}></textarea>
                <select className="ep-input" value={hrForm.dept} onChange={e => setHrForm({...hrForm, dept: e.target.value})}>
                  <option value="Science Dept">Science Dept</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Athletics">Athletics</option>
                </select>
                <select className="ep-input" value={hrForm.urgency} onChange={e => setHrForm({...hrForm, urgency: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="ep-modal-footer">
                <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setShowHRModal(false)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinationView;
