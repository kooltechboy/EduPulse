import React, { useState } from 'react';
import { Users, FileCheck, ClipboardList, Check, X, ShieldAlert, Award, Plus } from 'lucide-react';
import './HRHub.css';

declare const addToast: (options: { type: 'success' | 'error' | 'info' | 'warning', title: string, message: string }) => void;

const MOCK_LEAVES = [
  { id: '1', name: 'Sarah Connor', type: 'Sick Leave', dates: 'Oct 12 - Oct 14', status: 'pending' },
  { id: '2', name: 'James Cameron', type: 'Annual Leave', dates: 'Nov 01 - Nov 05', status: 'approved' },
  { id: '3', name: 'Arnold Schwarzenegger', type: 'Personal', dates: 'Oct 10 - Oct 10', status: 'denied' },
  { id: '4', name: 'Dr. Elizabeth Shaw', type: 'Maternity Leave', dates: 'Dec 01 - Mar 01', status: 'approved' }
];

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
}

export const HRHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leave' | 'recruitment' | 'compliance' | 'staff'>('leave');
  
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 's1', firstName: 'Sarah', lastName: 'Connor', email: 'sarah@edupulse.edu', phone: '555-0101', department: 'Science', position: 'Teacher', hireDate: '2020-01-15', salary: 60000, status: 'Active' }
  ]);
  const [leaveRequests, setLeaveRequests] = useState(MOCK_LEAVES);
  const [evaluations, setEvaluations] = useState<any[]>([]);

  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState<string | null>(null);

  const [staffForm, setStaffForm] = useState<Partial<StaffMember>>({});
  const [leaveForm, setLeaveForm] = useState({ name: '', type: 'Annual', startDate: '', endDate: '', reason: '' });
  const [evalForm, setEvalForm] = useState({ rating: 5, strengths: '', areas: '', recommendation: 'Retain' });

  const safeAddToast = (opts: any) => {
    if (typeof addToast === 'function') addToast(opts);
    else if (typeof window !== 'undefined' && (window as any).addToast) (window as any).addToast(opts);
  };

  const handleAddStaff = () => {
    if (!staffForm.firstName || !staffForm.lastName) return;
    const newStaff: StaffMember = {
      id: Math.random().toString(),
      firstName: staffForm.firstName,
      lastName: staffForm.lastName,
      email: staffForm.email || '',
      phone: staffForm.phone || '',
      department: staffForm.department || '',
      position: staffForm.position || '',
      hireDate: staffForm.hireDate || '',
      salary: Number(staffForm.salary) || 0,
      status: staffForm.status || 'Active',
    };
    setStaff([...staff, newStaff]);
    setShowAddStaff(false);
    setStaffForm({});
    safeAddToast({ type: 'success', title: 'Staff Added', message: 'Staff member added successfully.' });
  };

  const handleApprove = (id: string) => {
    setLeaveRequests(leaveRequests.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    safeAddToast({ type: 'success', title: 'Approved', message: 'Leave request approved.' });
  };

  const handleDeny = (id: string) => {
    setLeaveRequests(leaveRequests.map(r => r.id === id ? { ...r, status: 'denied' } : r));
    safeAddToast({ type: 'warning', title: 'Denied', message: 'Leave request denied.' });
  };

  const handleAddLeave = () => {
    if (!leaveForm.name) return;
    const newLeave = {
      id: Math.random().toString(),
      name: leaveForm.name,
      type: leaveForm.type,
      dates: `${leaveForm.startDate} - ${leaveForm.endDate}`,
      status: 'pending'
    };
    setLeaveRequests([...leaveRequests, newLeave]);
    setShowLeaveModal(false);
    setLeaveForm({ name: '', type: 'Annual', startDate: '', endDate: '', reason: '' });
    safeAddToast({ type: 'success', title: 'Leave Request Added', message: 'Leave request submitted.' });
  };

  const handleAddEval = (staffId: string) => {
    setEvaluations([...evaluations, { staffId, ...evalForm }]);
    setShowEvalModal(null);
    setEvalForm({ rating: 5, strengths: '', areas: '', recommendation: 'Retain' });
    safeAddToast({ type: 'success', title: 'Evaluation Saved', message: 'Staff evaluation saved.' });
  };

  return (
    <div className="ep-hr">
      <header className="ep-hr__header">
        <div>
          <h1 className="ep-hr__title">Human Resources & Staff Ops</h1>
          <p className="ep-hr__subtitle">Manage staff leave requests, recruitment pipelines, and institutional compliance</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button className={`ep-tab ${activeTab === 'staff' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('staff')}>
              <Users size={14} style={{ marginRight: 6 }} /> Staff Directory
            </button>
            <button className={`ep-tab ${activeTab === 'leave' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('leave')}>
              <ClipboardList size={14} style={{ marginRight: 6 }} /> Leave Management
            </button>
            <button className={`ep-tab ${activeTab === 'recruitment' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('recruitment')}>
              <Users size={14} style={{ marginRight: 6 }} /> Recruitment
            </button>
            <button className={`ep-tab ${activeTab === 'compliance' ? 'ep-tab--active' : ''}`} onClick={() => setActiveTab('compliance')}>
              <FileCheck size={14} style={{ marginRight: 6 }} /> Compliance
            </button>
          </div>
          {activeTab === 'staff' && (
            <button className="ep-btn ep-btn--primary" onClick={() => setShowAddStaff(true)}>
              <Plus size={16} /> + Add Staff
            </button>
          )}
          {activeTab === 'leave' && (
            <button className="ep-btn ep-btn--primary" onClick={() => setShowLeaveModal(true)}>
              <Plus size={16} /> + New Leave Request
            </button>
          )}
        </div>
      </header>

      <section className="ep-hr__summary-cards">
        <div className="ep-hr__card">
          <div className="ep-hr__card-val">{leaveRequests.filter(l => l.status === 'pending').length}</div>
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

      <div className="ep-hr__content">
        {activeTab === 'staff' && (
          <div className="ep-table-wrapper">
            <table className="ep-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.firstName} {s.lastName}</td>
                    <td>{s.department}</td>
                    <td>{s.position}</td>
                    <td><span className={`ep-badge ${s.status === 'Active' ? 'ep-badge--success' : 'ep-badge--warning'}`}>{s.status}</span></td>
                    <td>
                      <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => setShowEvalModal(s.id)}>Evaluate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
                {leaveRequests.map(leave => (
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
                          <button className="ep-btn ep-btn--success ep-btn--sm" onClick={() => handleApprove(leave.id)}><Check size={14} /> Approve</button>
                          <button className="ep-btn ep-btn--danger ep-btn--sm" onClick={() => handleDeny(leave.id)}><X size={14} /> Deny</button>
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

      {/* Modals */}
      {showAddStaff && (
        <div className="ep-hr__modal-overlay">
          <div className="ep-hr__modal">
            <h3 className="ep-hr__modal-title">Add Staff Member</h3>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">First Name</label><input className="ep-hr__form-input" onChange={e => setStaffForm({...staffForm, firstName: e.target.value})} /></div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Last Name</label><input className="ep-hr__form-input" onChange={e => setStaffForm({...staffForm, lastName: e.target.value})} /></div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Email</label><input className="ep-hr__form-input" onChange={e => setStaffForm({...staffForm, email: e.target.value})} /></div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Phone</label><input className="ep-hr__form-input" onChange={e => setStaffForm({...staffForm, phone: e.target.value})} /></div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Department</label>
              <select className="ep-hr__form-input" onChange={e => setStaffForm({...staffForm, department: e.target.value})}>
                <option value="">Select...</option><option>Science</option><option>Math</option><option>Admin</option>
              </select>
            </div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Position</label><input className="ep-hr__form-input" onChange={e => setStaffForm({...staffForm, position: e.target.value})} /></div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Hire Date</label><input type="date" className="ep-hr__form-input" onChange={e => setStaffForm({...staffForm, hireDate: e.target.value})} /></div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Salary</label><input type="number" className="ep-hr__form-input" onChange={e => setStaffForm({...staffForm, salary: Number(e.target.value)})} /></div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Status</label>
              <select className="ep-hr__form-input" onChange={e => setStaffForm({...staffForm, status: e.target.value as any})}>
                <option>Active</option><option>On Leave</option><option>Terminated</option>
              </select>
            </div>
            <div className="ep-hr__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowAddStaff(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleAddStaff}>Add Staff</button>
            </div>
          </div>
        </div>
      )}

      {showLeaveModal && (
        <div className="ep-hr__modal-overlay">
          <div className="ep-hr__modal">
            <h3 className="ep-hr__modal-title">New Leave Request</h3>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Staff Name</label>
              <select className="ep-hr__form-input" onChange={e => setLeaveForm({...leaveForm, name: e.target.value})}>
                <option value="">Select...</option>
                {staff.map(s => <option key={s.id} value={`${s.firstName} ${s.lastName}`}>{s.firstName} {s.lastName}</option>)}
              </select>
            </div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Leave Type</label>
              <select className="ep-hr__form-input" onChange={e => setLeaveForm({...leaveForm, type: e.target.value})}>
                <option>Annual</option><option>Sick</option><option>Maternity</option><option>Paternity</option><option>Emergency</option>
              </select>
            </div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Start Date</label><input type="date" className="ep-hr__form-input" onChange={e => setLeaveForm({...leaveForm, startDate: e.target.value})} /></div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">End Date</label><input type="date" className="ep-hr__form-input" onChange={e => setLeaveForm({...leaveForm, endDate: e.target.value})} /></div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Reason</label><textarea className="ep-hr__form-input" onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})}></textarea></div>
            <div className="ep-hr__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowLeaveModal(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleAddLeave}>Submit Request</button>
            </div>
          </div>
        </div>
      )}

      {showEvalModal && (
        <div className="ep-hr__modal-overlay">
          <div className="ep-hr__modal">
            <h3 className="ep-hr__modal-title">Evaluate Staff</h3>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Rating (1-5)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1,2,3,4,5].map(r => (
                  <label key={r}><input type="radio" name="rating" value={r} onChange={() => setEvalForm({...evalForm, rating: r})} /> {r} Stars</label>
                ))}
              </div>
            </div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Strengths</label><textarea className="ep-hr__form-input" onChange={e => setEvalForm({...evalForm, strengths: e.target.value})}></textarea></div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Areas for Improvement</label><textarea className="ep-hr__form-input" onChange={e => setEvalForm({...evalForm, areas: e.target.value})}></textarea></div>
            <div className="ep-hr__form-group"><label className="ep-hr__form-label">Recommendation</label>
              <select className="ep-hr__form-input" onChange={e => setEvalForm({...evalForm, recommendation: e.target.value})}>
                <option>Promote</option><option>Retain</option><option>Probation</option><option>Terminate</option>
              </select>
            </div>
            <div className="ep-hr__modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowEvalModal(null)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={() => handleAddEval(showEvalModal)}>Submit Evaluation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRHub;
