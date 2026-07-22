import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Users, FileText, Activity,
  Clock, Calendar, MessageSquare, BookOpen, Send, Sparkles, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores/uiStore';
import { generateLessonPlan } from '@/services/geminiService';
import './TeacherDashboard.css';

const TODAY_SCHEDULE = [
  { id: 1, time: '08:00 AM - 09:30 AM', subject: 'Advanced Mathematics', grade: 'Grade 11', room: 'Room 302', status: 'completed' },
  { id: 2, time: '09:45 AM - 11:15 AM', subject: 'Physics 101', grade: 'Grade 10', room: 'Lab 2', status: 'current' },
  { id: 3, time: '11:30 AM - 01:00 PM', subject: 'Calculus', grade: 'Grade 12', room: 'Room 305', status: 'upcoming' },
  { id: 4, time: '02:00 PM - 03:30 PM', subject: 'Remedial Math', grade: 'Grade 9', room: 'Room 101', status: 'upcoming' }
];

const PERFORMANCE_TREND = [
  { week: 'W1', avgScore: 82, attendance: 95 },
  { week: 'W2', avgScore: 83, attendance: 94 },
  { week: 'W3', avgScore: 81, attendance: 96 },
  { week: 'W4', avgScore: 84, attendance: 93 },
  { week: 'W5', avgScore: 85, attendance: 92 },
  { week: 'W6', avgScore: 86, attendance: 91 },
  { week: 'W7', avgScore: 85, attendance: 94 },
  { week: 'W8', avgScore: 88, attendance: 95 }
];

const CLASS_MATRIX = [
  { id: 1, course: 'Advanced Mathematics', students: 28, avgGrade: '87%', attendance: '96%', pending: 2 },
  { id: 2, course: 'Physics 101', students: 24, avgGrade: '82%', attendance: '92%', pending: 5 },
  { id: 3, course: 'Calculus', students: 18, avgGrade: '91%', attendance: '98%', pending: 0 },
  { id: 4, course: 'Remedial Math', students: 15, avgGrade: '74%', attendance: '88%', pending: 0 }
];

const PENDING_ACTIONS = [
  { id: 1, title: 'Grade Physics Midterms', type: 'grading', urgency: 'high', due: 'Today' },
  { id: 2, title: 'Review Absenteeism: J. Smith', type: 'attendance', urgency: 'medium', due: 'Tomorrow' },
  { id: 3, title: 'Reply to Parent Message (M. Johnson)', type: 'message', urgency: 'high', due: 'Today' },
  { id: 4, title: 'Submit Q3 Syllabus', type: 'admin', urgency: 'low', due: 'In 3 days' }
];

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuthStore();
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
    addToast({ type: 'success', title: 'Grade Saved', message: `Saved score ${gradeData.score} for ${gradeData.student}` });
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
  };

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setPrompt('');
  };

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="ep-teacher-dash">
      {/* Header */}
      <header className="ep-teacher-dash__header">
        <div>
          <h1 className="ep-teacher-dash__title">Good morning, {user?.name || 'Prof. Alan Turing'}</h1>
          <p className="ep-teacher-dash__subtitle">{currentDate} • Faculty Command Center</p>
        </div>
        <div className="ep-teacher-dash__actions">
          <button className="ep-btn ep-btn--secondary" onClick={() => setShowGradeModal(true)}>
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
          </button>
          <button className="ep-btn ep-btn--primary">
            <MessageSquare size={18} />
            <span>Messages</span>
          </button>
        </div>
      </header>

      {/* Schedule Strip */}
      <section className="ep-teacher-dash__schedule-section">
        <h2 className="ep-teacher-dash__section-title">Today's Class Schedule</h2>
        <div className="ep-teacher-dash__schedule-row">
          {TODAY_SCHEDULE.map((cls) => (
            <div key={cls.id} className={`ep-teacher-dash__class-card ${cls.status === 'current' ? 'ep-teacher-dash__class-card--current' : ''}`}>
              <span className="ep-teacher-dash__class-time"><Clock size={12} /> {cls.time}</span>
              <h3 className="ep-teacher-dash__class-subject">{cls.subject}</h3>
              <div className="ep-teacher-dash__class-meta">
                <span>{cls.grade}</span>
                <span>•</span>
                <span>{cls.room}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Metric Cards */}
      <section className="ep-teacher-dash__kpi-grid">
        <div className="ep-teacher-dash__kpi-card" onClick={() => navigate('/students')} style={{ cursor: 'pointer' }}>
          <div className="ep-teacher-dash__kpi-icon ep-teacher-dash__kpi-icon--blue">
            <Users size={22} />
          </div>
          <div>
            <div className="ep-teacher-dash__kpi-val">142</div>
            <div className="ep-teacher-dash__kpi-lbl">My Students</div>
          </div>
        </div>

        <div className="ep-teacher-dash__kpi-card" onClick={() => navigate('/attendance')} style={{ cursor: 'pointer' }}>
          <div className="ep-teacher-dash__kpi-icon ep-teacher-dash__kpi-icon--purple">
            <Activity size={22} />
          </div>
          <div>
            <div className="ep-teacher-dash__kpi-val">91%</div>
            <div className="ep-teacher-dash__kpi-lbl">Avg Attendance</div>
          </div>
        </div>

        <div className="ep-teacher-dash__kpi-card" onClick={() => navigate('/gradebook')} style={{ cursor: 'pointer' }}>
          <div className="ep-teacher-dash__kpi-icon ep-teacher-dash__kpi-icon--yellow">
            <FileText size={22} />
          </div>
          <div>
            <div className="ep-teacher-dash__kpi-val">7</div>
            <div className="ep-teacher-dash__kpi-lbl">Pending Grading</div>
          </div>
        </div>

        <div className="ep-teacher-dash__kpi-card">
          <div className="ep-teacher-dash__kpi-icon ep-teacher-dash__kpi-icon--green">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="ep-teacher-dash__kpi-val">3.4</div>
            <div className="ep-teacher-dash__kpi-lbl">Class Avg GPA</div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="ep-teacher-dash__grid-uneven">
        <div className="ep-teacher-dash__card">
          <div className="ep-teacher-dash__card-header">
            <h2 className="ep-teacher-dash__card-title">Class Performance Matrix</h2>
          </div>
          <table className="ep-teacher-dash__table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Enrolled</th>
                <th>Avg Grade</th>
                <th>Attendance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {CLASS_MATRIX.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 600 }}>{row.course}</td>
                  <td>{row.students}</td>
                  <td>{row.avgGrade}</td>
                  <td>{row.attendance}</td>
                  <td>
                    {row.pending > 0 ? (
                      <span className="ep-badge ep-badge--warning">{row.pending} pending</span>
                    ) : (
                      <span className="ep-badge ep-badge--success">Complete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ep-teacher-dash__card">
          <div className="ep-teacher-dash__card-header">
            <h2 className="ep-teacher-dash__card-title">Pending Actions</h2>
            <button className="ep-btn ep-btn--text">View All</button>
          </div>
          <div className="ep-teacher-dash__action-list">
            {PENDING_ACTIONS.map((action) => (
              <div key={action.id} className={`ep-teacher-dash__action-item ep-teacher-dash__action-item--${action.urgency}`}>
                <div style={{ flex: 1 }}>
                  <h4 className="ep-teacher-dash__action-title">{action.title}</h4>
                  <span className="ep-teacher-dash__action-due">Due: {action.due}</span>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--color-text-tertiary)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Row */}
      <section className="ep-teacher-dash__grid-2col">
        <div className="ep-teacher-dash__card">
          <div className="ep-teacher-dash__card-header">
            <h2 className="ep-teacher-dash__card-title">Student Performance Trend (8 Weeks)</h2>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_TREND} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="teacherTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="var(--color-text-tertiary)" fontSize={12} tickLine={false} />
                <YAxis domain={[70, 100]} stroke="var(--color-text-tertiary)" fontSize={12} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-50)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="avgScore" name="Avg Score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#teacherTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ep-teacher-dash__card ep-teacher-dash__ai-card">
          <div className="ep-teacher-dash__card-header">
            <h2 className="ep-teacher-dash__card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#8b5cf6" />
              AI Copilot for Teachers
            </h2>
          </div>
          <div className="ep-teacher-dash__ai-chips">
            <span className="ep-teacher-dash__ai-chip">Draft welcome email for parents</span>
            <span className="ep-teacher-dash__ai-chip">Generate Physics 101 quiz</span>
            <span className="ep-teacher-dash__ai-chip">Summarize attendance trends</span>
          </div>
          <form onSubmit={handleAskAI} className="ep-teacher-dash__ai-input-form" style={{ marginTop: 'auto' }}>
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI Copilot..." 
              className="ep-input"
              style={{ flex: 1 }}
            />
            <button type="submit" className="ep-btn ep-btn--primary">
              <Send size={16} />
            </button>
          </form>
        </div>
      </section>

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
};
