const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function writeFile(p, content) {
  fs.writeFileSync(p, content, 'utf8');
}

// ----------------------------------------------------
// TeacherDashboard.tsx
// ----------------------------------------------------
let tdPath = path.join(srcDir, 'components/dashboard/teacher/TeacherDashboard.tsx');
let td = readFile(tdPath);
td = td.replace(
  "import { useAuthStore } from '@/stores/authStore';",
  "import { useAuthStore } from '@/stores/authStore';\nimport { useNavigate } from 'react-router-dom';\nimport { useUIStore } from '@/stores/uiStore';\nimport { generateLessonPlan } from '@/services/geminiService';"
);
td = td.replace(
  "const { user } = useAuthStore();\n  const [prompt, setPrompt] = useState('');",
  `const { user } = useAuthStore();
  const { addToast, setAiCopilotOpen } = useUIStore();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');

  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeData, setGradeData] = useState({ student: '', assignment: '', score: '' });
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleLaunchAttendance = () => {
    addToast({ type: 'info', title: 'Attendance', message: 'Opening attendance marking...' });
    navigate('/attendance');
  };

  const handleSaveGrade = () => {
    addToast({ type: 'success', title: 'Grade Saved', message: \`Saved score \${gradeData.score} for \${gradeData.student}\` });
    setShowGradeModal(false);
    setGradeData({ student: '', assignment: '', score: '' });
  };

  const handleAILessonPlan = async () => {
    setIsGeneratingPlan(true);
    addToast({ type: 'info', title: 'AI Lesson Plan', message: 'Generating lesson plan...' });
    try {
      await generateLessonPlan('Physics', 'Kinematics', 'Grade 10', '45 mins');
      setAiCopilotOpen(true);
      addToast({ type: 'success', title: 'Lesson Plan Ready', message: 'AI Copilot opened with your lesson plan.' });
    } catch (e) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to generate plan.' });
    } finally {
      setIsGeneratingPlan(false);
    }
  };`
);
td = td.replace(
  `<button className="ep-btn ep-btn--secondary">
            <Calendar size={18} />
            <span>Schedule</span>
          </button>`,
  `<button className="ep-btn ep-btn--secondary" onClick={() => setShowGradeModal(true)}>
            <FileText size={18} />
            <span>Quick Grade</span>
          </button>
          <button className="ep-btn ep-btn--secondary" onClick={handleLaunchAttendance}>
            <Clock size={18} />
            <span>Attendance</span>
          </button>
          <button className="ep-btn ep-btn--secondary" onClick={handleAILessonPlan} disabled={isGeneratingPlan}>
            <Sparkles size={18} />
            <span>{isGeneratingPlan ? 'Generating...' : 'AI Plan'}</span>
          </button>
          <button className="ep-btn ep-btn--secondary">
            <Calendar size={18} />
            <span>Schedule</span>
          </button>`
);
td = td.replace(
  `<div className="ep-teacher-dash__kpi-card">
          <div className="ep-teacher-dash__kpi-icon ep-teacher-dash__kpi-icon--blue">`,
  `<div className="ep-teacher-dash__kpi-card" onClick={() => navigate('/students')} style={{ cursor: 'pointer' }}>
          <div className="ep-teacher-dash__kpi-icon ep-teacher-dash__kpi-icon--blue">`
);
td = td.replace(
  `<div className="ep-teacher-dash__kpi-card">
          <div className="ep-teacher-dash__kpi-icon ep-teacher-dash__kpi-icon--purple">`,
  `<div className="ep-teacher-dash__kpi-card" onClick={() => navigate('/attendance')} style={{ cursor: 'pointer' }}>
          <div className="ep-teacher-dash__kpi-icon ep-teacher-dash__kpi-icon--purple">`
);
td = td.replace(
  `<div className="ep-teacher-dash__kpi-card">
          <div className="ep-teacher-dash__kpi-icon ep-teacher-dash__kpi-icon--yellow">`,
  `<div className="ep-teacher-dash__kpi-card" onClick={() => navigate('/gradebook')} style={{ cursor: 'pointer' }}>
          <div className="ep-teacher-dash__kpi-icon ep-teacher-dash__kpi-icon--yellow">`
);
td = td.replace(
  `    </div>
  );
};`,
  `
      {showGradeModal && (
        <div className="ep-teacher-dash__modal-overlay" onClick={() => setShowGradeModal(false)}>
          <div className="ep-teacher-dash__modal" onClick={e => e.stopPropagation()}>
            <div className="ep-teacher-dash__modal-header">
              <h2 className="ep-teacher-dash__modal-title">Quick Grade</h2>
              <button className="ep-btn ep-btn--text" onClick={() => setShowGradeModal(false)}>X</button>
            </div>
            <div className="ep-teacher-dash__modal-body">
              <label>Student Name</label>
              <select className="ep-input" value={gradeData.student} onChange={e => setGradeData({...gradeData, student: e.target.value})}>
                <option value="">Select Student</option>
                <option value="Alice Smith">Alice Smith</option>
                <option value="Bob Jones">Bob Jones</option>
              </select>
              <label>Assignment</label>
              <input type="text" className="ep-input" value={gradeData.assignment} onChange={e => setGradeData({...gradeData, assignment: e.target.value})} placeholder="e.g. Midterm" />
              <label>Score (0-100)</label>
              <input type="number" className="ep-input" value={gradeData.score} onChange={e => setGradeData({...gradeData, score: e.target.value})} />
            </div>
            <div className="ep-teacher-dash__modal-actions">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowGradeModal(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleSaveGrade}>Save Grade</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`
);
writeFile(tdPath, td);


// ----------------------------------------------------
// TeacherDashboard.css
// ----------------------------------------------------
let tdcPath = path.join(srcDir, 'components/dashboard/teacher/TeacherDashboard.css');
let tdc = readFile(tdcPath);
tdc += `
.ep-teacher-dash__modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
.ep-teacher-dash__modal { background:var(--color-surface-50); border-radius:12px; padding:28px; min-width:420px; max-width:560px; box-shadow:0 20px 60px rgba(0,0,0,0.3); }
.ep-teacher-dash__modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
.ep-teacher-dash__modal-title { font-size:1.1rem; font-weight:700; color:var(--color-text-primary); }
.ep-teacher-dash__modal-body { display:flex; flex-direction:column; gap:14px; }
.ep-teacher-dash__modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; }
`;
writeFile(tdcPath, tdc);


// ----------------------------------------------------
// StudentDashboard.tsx
// ----------------------------------------------------
let sdPath = path.join(srcDir, 'components/dashboard/student/StudentDashboard.tsx');
let sd = readFile(sdPath);
sd = sd.replace(
  "import { \n  GraduationCap, Calendar, Clock, BookOpen, Send, Bot, \n  CheckCircle, AlertCircle, FileText, User, QrCode\n} from 'lucide-react';",
  "import { \n  GraduationCap, Calendar, Clock, BookOpen, Send, Bot, \n  CheckCircle, AlertCircle, FileText, User, QrCode, Upload, Library\n} from 'lucide-react';\nimport { useNavigate } from 'react-router-dom';\nimport { useUIStore } from '@/stores/uiStore';"
);
sd = sd.replace(
  "const [rotate, setRotate] = useState({ x: 0, y: 0 });",
  `const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { addToast, setAiCopilotOpen } = useUIStore();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitData, setSubmitData] = useState({ assignment: '', file: '', notes: '' });
  const [deadlines, setDeadlines] = useState(DEADLINES);

  const handleSubmitAssignment = () => {
    addToast({ type: 'success', title: 'Assignment Submitted', message: 'Your assignment was successfully submitted.' });
    setDeadlines(prev => prev.map(d => d.task === submitData.assignment ? { ...d, status: 'submitted', urgency: 'amber' } : d));
    setShowSubmitModal(false);
    setSubmitData({ assignment: '', file: '', notes: '' });
  };
  
  const handleAITutor = () => {
    setAiCopilotOpen(true);
    addToast({ type: 'info', title: 'AI Tutor', message: 'Opening your personal AI tutor...' });
  };

  const handleLibrary = () => {
    addToast({ type: 'info', title: 'Library', message: 'Opening Digital Library...' });
    navigate('/library');
  };`
);
sd = sd.replace(
  `<h1>Student Portal</h1>
      </header>`,
  `<h1>Student Portal</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="ep-btn ep-btn--secondary" onClick={() => setShowSubmitModal(true)}>
            <Upload size={18} /> Submit Assignment
          </button>
          <button className="ep-btn ep-btn--secondary" onClick={handleAITutor}>
            <Bot size={18} /> AI Tutor
          </button>
          <button className="ep-btn ep-btn--secondary" onClick={handleLibrary}>
            <Library size={18} /> Library
          </button>
        </div>
      </header>`
);
sd = sd.replace(
  `<div className="ep-student-dash__course-card">`,
  `<div className="ep-student-dash__course-card" onClick={() => navigate('/gradebook')} style={{ cursor: 'pointer' }}>`
);
sd = sd.replace(/<div className="ep-student-dash__course-card">/g, `<div className="ep-student-dash__course-card" onClick={() => navigate('/gradebook')} style={{ cursor: 'pointer' }}>`);
sd = sd.replace(
  `<div className="ep-student-dash__stat-card">
              <Calendar size={24} className="ep-student-dash__stat-icon" />`,
  `<div className="ep-student-dash__stat-card" onClick={() => navigate('/attendance')} style={{ cursor: 'pointer' }}>
              <Calendar size={24} className="ep-student-dash__stat-icon" />`
);
sd = sd.replace(
  `{DEADLINES.map(d => (`,
  `{deadlines.map(d => (`
);
sd = sd.replace(
  `<button className="ep-student-dash__btn-submit">Submit</button>`,
  `<button className="ep-student-dash__btn-submit" onClick={() => { setSubmitData({...submitData, assignment: d.task}); setShowSubmitModal(true); }}>Submit</button>`
);
sd = sd.replace(
  `    </div>
  );
};`,
  `
      {showSubmitModal && (
        <div className="ep-student-dash__modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="ep-student-dash__modal" onClick={e => e.stopPropagation()}>
            <div className="ep-student-dash__modal-header">
              <h2 className="ep-student-dash__modal-title">Submit Assignment</h2>
              <button className="ep-btn ep-btn--text" onClick={() => setShowSubmitModal(false)}>X</button>
            </div>
            <div className="ep-student-dash__modal-body">
              <label>Assignment</label>
              <select className="ep-input" value={submitData.assignment} onChange={e => setSubmitData({...submitData, assignment: e.target.value})}>
                <option value="">Select Assignment</option>
                {deadlines.filter(d => d.status === 'pending').map(d => (
                  <option key={d.id} value={d.task}>{d.task}</option>
                ))}
              </select>
              <label>File Upload</label>
              <input type="text" className="ep-input" placeholder="Enter file name (simulating upload)" value={submitData.file} onChange={e => setSubmitData({...submitData, file: e.target.value})} />
              <label>Notes</label>
              <textarea className="ep-input" rows={3} value={submitData.notes} onChange={e => setSubmitData({...submitData, notes: e.target.value})}></textarea>
            </div>
            <div className="ep-student-dash__modal-actions">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowSubmitModal(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handleSubmitAssignment}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`
);
writeFile(sdPath, sd);

// ----------------------------------------------------
// StudentDashboard.css
// ----------------------------------------------------
let sdcPath = path.join(srcDir, 'components/dashboard/student/StudentDashboard.css');
let sdc = readFile(sdcPath);
sdc += `
.ep-student-dash__modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
.ep-student-dash__modal { background:var(--color-surface-base); border-radius:12px; padding:28px; min-width:420px; max-width:560px; box-shadow:0 20px 60px rgba(0,0,0,0.3); }
.ep-student-dash__modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
.ep-student-dash__modal-title { font-size:1.1rem; font-weight:700; color:var(--color-text-base); }
.ep-student-dash__modal-body { display:flex; flex-direction:column; gap:14px; }
.ep-student-dash__modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; }
.ep-input { padding:8px 12px; border:1px solid var(--color-surface-border); border-radius:4px; background:var(--color-surface-base); color:var(--color-text-base); }
.ep-btn { padding:8px 16px; border-radius:4px; cursor:pointer; font-weight:600; border:none; }
.ep-btn--primary { background:var(--color-primary-500); color:white; }
.ep-btn--secondary { background:var(--color-surface-raised); border:1px solid var(--color-surface-border); color:var(--color-text-base); }
`;
writeFile(sdcPath, sdc);

// ----------------------------------------------------
// ParentDashboard.tsx
// ----------------------------------------------------
let pdPath = path.join(srcDir, 'components/dashboard/parent/ParentDashboard.tsx');
let pd = readFile(pdPath);
pd = pd.replace(
  "import { \n  Mail, Award, AlertTriangle, ChevronLeft, ChevronRight, User, FileText\n} from 'lucide-react';",
  "import { \n  Mail, Award, AlertTriangle, ChevronLeft, ChevronRight, User, FileText, CreditCard\n} from 'lucide-react';\nimport { useNavigate } from 'react-router-dom';\nimport { useUIStore } from '@/stores/uiStore';"
);
pd = pd.replace(
  "const [activeChild, setActiveChild] = useState(CHILDREN[0]);",
  `const [activeChild, setActiveChild] = useState(CHILDREN[0]);
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  
  const [invoices, setInvoices] = useState([
    { id: 1, desc: 'Lab Fee', amount: 50, due: 'Oct 31', status: 'pending' },
    { id: 2, desc: 'Field Trip', amount: 25, due: 'Nov 15', status: 'pending' }
  ]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payData, setPayData] = useState({ invoiceId: null, method: 'Card' });

  const handleMessageTeacher = () => {
    addToast({ type: 'info', title: 'Messaging', message: 'Opening message composer...' });
    navigate('/messaging');
  };
  
  const handleViewReportCard = () => {
    navigate('/students');
  };

  const handlePayInvoice = () => {
    setInvoices(invoices.map(inv => inv.id === payData.invoiceId ? { ...inv, status: 'paid' } : inv));
    addToast({ type: 'success', title: 'Payment Successful', message: 'Your payment was processed successfully.' });
    setShowPayModal(false);
  };`
);
pd = pd.replace(
  `<button className="ep-parent-dash__btn-message">
                    <Mail size={16} /> Message
                  </button>`,
  `<button className="ep-parent-dash__btn-message" onClick={handleMessageTeacher}>
                    <Mail size={16} /> Message
                  </button>`
);
pd = pd.replace(
  `<h2>{activeChild.name}</h2>`,
  `<h2>{activeChild.name}</h2>
                 <button className="ep-btn ep-btn--secondary" onClick={handleViewReportCard} style={{ marginTop: '5px', fontSize: '12px' }}>View Report Card</button>`
);
pd = pd.replace(
  `<div className="ep-parent-dash__finance-details">
              <div>
                <strong>Upcoming:</strong> Lab Fee ($50) due Oct 31
              </div>
              <div>
                <strong>Last Payment:</strong> $1,200 on Sep 1
              </div>
            </div>
            <button className="ep-parent-dash__btn-pay">Pay Now</button>`,
  `<div className="ep-parent-dash__finance-details">
              {invoices.filter(i => i.status === 'pending').map(inv => (
                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><strong>{inv.desc}</strong>: \$\${inv.amount} due {inv.due}</span>
                  <button className="ep-parent-dash__btn-pay" style={{ width: 'auto', padding: '4px 12px', fontSize: '12px' }} onClick={() => { setPayData({ ...payData, invoiceId: inv.id }); setShowPayModal(true); }}>Pay Now</button>
                </div>
              ))}
              {invoices.filter(i => i.status === 'paid').length > 0 && <div><strong>Last Payment:</strong> Success</div>}
            </div>`
);
pd = pd.replace(
  `    </div>
  );
};`,
  `
      {showPayModal && (
        <div className="ep-parent-dash__modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="ep-parent-dash__modal" onClick={e => e.stopPropagation()}>
            <div className="ep-parent-dash__modal-header">
              <h2 className="ep-parent-dash__modal-title">Pay Invoice</h2>
              <button className="ep-btn ep-btn--text" onClick={() => setShowPayModal(false)}>X</button>
            </div>
            <div className="ep-parent-dash__modal-body">
              <p>Paying invoice for {activeChild.name}</p>
              <label>Payment Method</label>
              <select className="ep-input" value={payData.method} onChange={e => setPayData({...payData, method: e.target.value})}>
                <option value="Card">Credit Card</option>
                <option value="ACH">ACH Transfer</option>
                <option value="Voucher">Voucher</option>
              </select>
            </div>
            <div className="ep-parent-dash__modal-actions">
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowPayModal(false)}>Cancel</button>
              <button className="ep-btn ep-btn--primary" onClick={handlePayInvoice}>Confirm Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};`
);
writeFile(pdPath, pd);

// ----------------------------------------------------
// ParentDashboard.css
// ----------------------------------------------------
let pdcPath = path.join(srcDir, 'components/dashboard/parent/ParentDashboard.css');
let pdc = readFile(pdcPath);
pdc += `
.ep-parent-dash__modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
.ep-parent-dash__modal { background:var(--color-surface-base); border-radius:12px; padding:28px; min-width:420px; max-width:560px; box-shadow:0 20px 60px rgba(0,0,0,0.3); }
.ep-parent-dash__modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
.ep-parent-dash__modal-title { font-size:1.1rem; font-weight:700; color:var(--color-text-base); }
.ep-parent-dash__modal-body { display:flex; flex-direction:column; gap:14px; }
.ep-parent-dash__modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; }
.ep-input { padding:8px 12px; border:1px solid var(--color-surface-border); border-radius:4px; background:var(--color-surface-base); color:var(--color-text-base); }
.ep-btn { padding:8px 16px; border-radius:4px; cursor:pointer; font-weight:600; border:none; }
.ep-btn--primary { background:var(--color-primary-500); color:white; }
.ep-btn--secondary { background:var(--color-surface-raised); border:1px solid var(--color-surface-border); color:var(--color-text-base); }
`;
writeFile(pdcPath, pdc);

// ----------------------------------------------------
// CoordinatorDashboard.tsx
// ----------------------------------------------------
let cdPath = path.join(srcDir, 'components/dashboard/coordinator/CoordinatorDashboard.tsx');
let cd = readFile(cdPath);
cd = cd.replace(
  "import { Users, BookOpen, TrendingUp, CheckSquare, AlertCircle, Calendar } from 'lucide-react';",
  "import { Users, BookOpen, TrendingUp, CheckSquare, AlertCircle, Calendar } from 'lucide-react';\nimport { useNavigate } from 'react-router-dom';\nimport { useUIStore } from '@/stores/uiStore';"
);
cd = cd.replace(
  "export const CoordinatorDashboard: React.FC = () => {",
  `export const CoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [curriculumItems, setCurriculumItems] = useState([
    { id: 1, title: 'New Math Standard', status: 'pending' },
    { id: 2, title: 'Revised Science Labs', status: 'pending' }
  ]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalItem, setApprovalItem] = useState(null);

  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalData, setEvalData] = useState({ teacher: '', rating: '5', strengths: '', improvements: '' });

  const [showSubModal, setShowSubModal] = useState(false);
  const [subData, setSubData] = useState({ absent: '', subject: '', date: '', sub: '' });

  const handleApprove = () => {
    setCurriculumItems(curriculumItems.map(i => i.id === approvalItem.id ? { ...i, status: 'approved' } : i));
    addToast({ type: 'success', title: 'Curriculum Approved', message: \`\${approvalItem.title} was approved.\` });
    setShowApprovalModal(false);
  };
  const handleReject = () => {
    setCurriculumItems(curriculumItems.map(i => i.id === approvalItem.id ? { ...i, status: 'rejected' } : i));
    addToast({ type: 'warning', title: 'Curriculum Rejected', message: \`\${approvalItem.title} was rejected.\` });
    setShowApprovalModal(false);
  };
  
  const handleSubmitEval = () => {
    addToast({ type: 'success', title: 'Evaluation Submitted', message: \`Saved evaluation for \${evalData.teacher}.\` });
    setShowEvalModal(false);
  };

  const handleAssignSub = () => {
    addToast({ type: 'success', title: 'Substitute Assigned', message: \`Assigned \${subData.sub} for \${subData.absent}.\` });
    setShowSubModal(false);
  };`
);
cd = cd.replace(
  `<div className="ep-coord-dash__stat-card">
          <Users size={24} className="ep-coord-dash__stat-icon" />`,
  `<div className="ep-coord-dash__stat-card" onClick={() => navigate('/staff')} style={{ cursor: 'pointer' }}>
          <Users size={24} className="ep-coord-dash__stat-icon" />`
);
cd = cd.replace(
  `<div className="ep-coord-dash__stat-card">
          <BookOpen size={24} className="ep-coord-dash__stat-icon" />`,
  `<div className="ep-coord-dash__stat-card" onClick={() => navigate('/curriculum')} style={{ cursor: 'pointer' }}>
          <BookOpen size={24} className="ep-coord-dash__stat-icon" />`
);
cd = cd.replace(
  `<div className="ep-coord-dash__stat-card">
          <TrendingUp size={24} className="ep-coord-dash__stat-icon" />`,
  `<div className="ep-coord-dash__stat-card" onClick={() => navigate('/reports')} style={{ cursor: 'pointer' }}>
          <TrendingUp size={24} className="ep-coord-dash__stat-icon" />`
);
cd = cd.replace(
  `<div className="ep-coord-dash__stat-card ep-coord-dash__stat-card--alert">
          <CheckSquare size={24} className="ep-coord-dash__stat-icon" />`,
  `<div className="ep-coord-dash__stat-card ep-coord-dash__stat-card--alert" onClick={() => setShowEvalModal(true)} style={{ cursor: 'pointer' }}>
          <CheckSquare size={24} className="ep-coord-dash__stat-icon" />`
);
cd = cd.replace(
  `{req.status}
                  </span>
                </li>`,
  `{req.status}
                  </span>
                  <button className="ep-btn ep-btn--secondary" style={{ padding: '2px 8px', fontSize: '12px' }} onClick={() => { setSubData({ ...subData, absent: req.person, date: req.dates }); setShowSubModal(true); }}>Assign Sub</button>
                </li>`
);
cd = cd.replace(
  `{CONFLICTS.length > 0 ? (`,
  `<div style={{ marginBottom: '10px' }}>
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
            {CONFLICTS.length > 0 ? (`
);
cd = cd.replace(
  `    </div>
  );
};`,
  `
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
};`
);
writeFile(cdPath, cd);

// ----------------------------------------------------
// CoordinatorDashboard.css
// ----------------------------------------------------
let cdcPath = path.join(srcDir, 'components/dashboard/coordinator/CoordinatorDashboard.css');
let cdc = readFile(cdcPath);
cdc += `
.ep-coord-dash__modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
.ep-coord-dash__modal { background:var(--color-surface-base); border-radius:12px; padding:28px; min-width:420px; max-width:560px; box-shadow:0 20px 60px rgba(0,0,0,0.3); }
.ep-coord-dash__modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
.ep-coord-dash__modal-title { font-size:1.1rem; font-weight:700; color:var(--color-text-base); }
.ep-coord-dash__modal-body { display:flex; flex-direction:column; gap:14px; }
.ep-coord-dash__modal-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; }
.ep-input { padding:8px 12px; border:1px solid var(--color-surface-border); border-radius:4px; background:var(--color-surface-base); color:var(--color-text-base); }
.ep-btn { padding:8px 16px; border-radius:4px; cursor:pointer; font-weight:600; border:none; }
.ep-btn--primary { background:var(--color-primary-500); color:white; }
.ep-btn--secondary { background:var(--color-surface-raised); border:1px solid var(--color-surface-border); color:var(--color-text-base); }
`;
writeFile(cdcPath, cdc);

console.log('Update complete');
