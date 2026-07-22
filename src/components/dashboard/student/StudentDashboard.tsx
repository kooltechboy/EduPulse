import React, { useState, MouseEvent } from 'react';
import './StudentDashboard.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { 
  GraduationCap, Calendar, Clock, BookOpen, Send, Bot, 
  CheckCircle, AlertCircle, FileText, User, QrCode, Upload, Library
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores/uiStore';

// Mock Data
const GPA_DATA = [
  { term: 'Fall 2024', gpa: 3.4 },
  { term: 'Spring 2025', gpa: 3.5 },
  { term: 'Fall 2025', gpa: 3.7 },
  { term: 'Spring 2026', gpa: 3.8 },
  { term: 'Fall 2026', gpa: 3.9 },
];

const SCHEDULE = [
  { id: 1, time: '08:00 AM', subject: 'AP Calculus BC', teacher: 'Mr. Smith', room: 'Room 302', status: 'completed' },
  { id: 2, time: '09:30 AM', subject: 'Physics C', teacher: 'Dr. Jones', room: 'Lab 4', status: 'in-progress' },
  { id: 3, time: '11:00 AM', subject: 'World Literature', teacher: 'Ms. Davis', room: 'Room 105', status: 'upcoming' },
];

const DEADLINES = [
  { id: 1, task: 'Calculus Problem Set 4', course: 'AP Calculus BC', due: 'Today, 11:59 PM', status: 'pending', urgency: 'red' },
  { id: 2, task: 'Physics Lab Report', course: 'Physics C', due: 'Tomorrow, 5:00 PM', status: 'pending', urgency: 'red' },
  { id: 3, task: 'Literature Essay Draft', course: 'World Literature', due: 'Friday, 11:59 PM', status: 'submitted', urgency: 'amber' },
  { id: 4, task: 'History Project Outline', course: 'World History', due: 'Next Wednesday', status: 'pending', urgency: 'green' },
];

const COURSES = [
  { id: 1, name: 'AP Calculus BC', teacher: 'Mr. Smith', grade: '94%', attendance: 98, progress: 75 },
  { id: 2, name: 'Physics C', teacher: 'Dr. Jones', grade: '89%', attendance: 95, progress: 70 },
  { id: 3, name: 'World Literature', teacher: 'Ms. Davis', grade: '92%', attendance: 100, progress: 80 },
  { id: 4, name: 'World History', teacher: 'Mr. Wilson', grade: '96%', attendance: 96, progress: 78 },
];

const ANNOUNCEMENTS = [
  { id: 1, title: 'Spring Dance Tickets Available', date: 'Oct 15, 2026', author: 'Student Council' },
  { id: 2, title: 'Library Closed for Renovations', date: 'Oct 14, 2026', author: 'Librarian' },
  { id: 3, title: 'College Fair Next Week', date: 'Oct 10, 2026', author: 'Counseling Office' },
];

export const StudentDashboard: React.FC = () => {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, role: 'ai', text: 'Hi! I am your AI Study Assistant. How can I help you today?' }
  ]);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
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
  };

  const handleIdHover = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleIdLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatHistory([...chatHistory, { id: Date.now(), role: 'user', text: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, { id: Date.now(), role: 'ai', text: "I'm a mock AI, but I'd love to help you with that!" }]);
    }, 1000);
  };

  return (
    <div className="ep-student-dash">
      <header className="ep-student-dash__header">
        <h1>Student Portal</h1>
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
      </header>
      
      <div className="ep-student-dash__grid">
        {/* Left Column */}
        <div className="ep-student-dash__col ep-student-dash__col--left">
          
          {/* Digital ID Card */}
          <div 
            className="ep-student-dash__id-card-wrapper"
            onMouseMove={handleIdHover}
            onMouseLeave={handleIdLeave}
            style={{ transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
          >
            <div className="ep-student-dash__id-card">
              <div className="ep-student-dash__id-header">
                <h2>EduPulse High School</h2>
              </div>
              <div className="ep-student-dash__id-body">
                <div className="ep-student-dash__id-photo">
                  <User size={48} color="white" />
                </div>
                <div className="ep-student-dash__id-info">
                  <h3>Alex Johnson</h3>
                  <p>ID: #849201</p>
                  <p>Grade 11 • Section B</p>
                </div>
                <div className="ep-student-dash__id-qr">
                  <QrCode size={40} />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Snapshot */}
          <div className="ep-student-dash__stats">
            <div className="ep-student-dash__stat-card">
              <GraduationCap size={24} className="ep-student-dash__stat-icon" />
              <div className="ep-student-dash__stat-val">3.9 GPA</div>
              <div className="ep-student-dash__stat-label">Current • A Average</div>
            </div>
            <div className="ep-student-dash__stat-card" onClick={() => navigate('/attendance')} style={{ cursor: 'pointer' }}>
              <Calendar size={24} className="ep-student-dash__stat-icon" />
              <div className="ep-student-dash__stat-val">98%</div>
              <div className="ep-student-dash__stat-label">Attendance • 15 days streak</div>
            </div>
            <div className="ep-student-dash__stat-card">
              <BookOpen size={24} className="ep-student-dash__stat-icon" />
              <div className="ep-student-dash__stat-val">18/24</div>
              <div className="ep-student-dash__stat-label">Credits Completed</div>
              <div className="ep-student-dash__progress-bar">
                <div className="ep-student-dash__progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          {/* Grade Trends */}
          <div className="ep-student-dash__panel">
            <h3 className="ep-student-dash__panel-title">Grade Trends (GPA)</h3>
            <div className="ep-student-dash__chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={GPA_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-border, #e2e8f0)" />
                  <XAxis dataKey="term" stroke="var(--color-text-secondary, #64748b)" fontSize={12} />
                  <YAxis domain={[2.0, 4.0]} stroke="var(--color-text-secondary, #64748b)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-raised, #ffffff)', borderColor: 'var(--color-surface-border, #e2e8f0)' }} />
                  <ReferenceLine y={3.5} stroke="var(--color-primary-500, #3b82f6)" strokeDasharray="3 3" label="Target" />
                  <Line type="monotone" dataKey="gpa" stroke="var(--color-primary-500, #3b82f6)" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Course Progress */}
          <div className="ep-student-dash__panel">
            <h3 className="ep-student-dash__panel-title">Course Progress</h3>
            <div className="ep-student-dash__course-grid">
              {COURSES.map(course => (
                <div key={course.id} className="ep-student-dash__course-card" onClick={() => navigate('/gradebook')} style={{ cursor: 'pointer' }}>
                  <div className="ep-student-dash__course-header">
                    <h4>{course.name}</h4>
                    <span className="ep-student-dash__course-grade">{course.grade}</span>
                  </div>
                  <p className="ep-student-dash__course-teacher">{course.teacher}</p>
                  <div className="ep-student-dash__course-metrics">
                    <span>Attendance: {course.attendance}%</span>
                    <span>Prog: {course.progress}%</span>
                  </div>
                  <div className="ep-student-dash__progress-bar">
                    <div className="ep-student-dash__progress-fill" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="ep-student-dash__col ep-student-dash__col--right">
          
          {/* Today's Classes */}
          <div className="ep-student-dash__panel">
            <h3 className="ep-student-dash__panel-title">Today's Classes</h3>
            <div className="ep-student-dash__timeline">
              {SCHEDULE.map(item => (
                <div key={item.id} className={`ep-student-dash__timeline-item ep-student-dash__timeline-item--${item.status}`}>
                  <div className="ep-student-dash__timeline-time">{item.time}</div>
                  <div className="ep-student-dash__timeline-content">
                    <h4>{item.subject}</h4>
                    <p>{item.teacher} • {item.room}</p>
                  </div>
                  <div className="ep-student-dash__timeline-status">
                    {item.status === 'completed' && <CheckCircle size={18} color="var(--color-success-500, #22c55e)" />}
                    {item.status === 'in-progress' && <Clock size={18} color="var(--color-primary-500, #3b82f6)" />}
                    {item.status === 'upcoming' && <AlertCircle size={18} color="var(--color-text-secondary, #64748b)" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="ep-student-dash__panel">
            <h3 className="ep-student-dash__panel-title">Upcoming Deadlines</h3>
            <ul className="ep-student-dash__deadline-list">
              {deadlines.map(d => (
                <li key={d.id} className={`ep-student-dash__deadline-item ep-student-dash__deadline-item--${d.urgency}`}>
                  <div className="ep-student-dash__deadline-icon">
                    <FileText size={20} />
                  </div>
                  <div className="ep-student-dash__deadline-info">
                    <h4>{d.task}</h4>
                    <p>{d.course} • Due: {d.due}</p>
                  </div>
                  <div className="ep-student-dash__deadline-actions">
                    {d.status === 'pending' ? (
                      <button className="ep-student-dash__btn-submit" onClick={() => { setSubmitData({...submitData, assignment: d.task}); setShowSubmitModal(true); }}>Submit</button>
                    ) : (
                      <span className="ep-student-dash__badge-submitted">Submitted</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Study Assistant */}
          <div className="ep-student-dash__panel ep-student-dash__ai-panel">
            <div className="ep-student-dash__ai-header">
              <Bot size={20} />
              <h3>AI Study Assistant</h3>
            </div>
            <div className="ep-student-dash__ai-chat">
              {chatHistory.map(msg => (
                <div key={msg.id} className={`ep-student-dash__chat-bubble ep-student-dash__chat-bubble--${msg.role}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="ep-student-dash__ai-prompts">
              <button onClick={() => setChatInput('Explain this topic')}>Explain topic</button>
              <button onClick={() => setChatInput('Help me study')}>Help study</button>
              <button onClick={() => setChatInput('Summarize notes')}>Summarize notes</button>
            </div>
            <form className="ep-student-dash__ai-input-form" onSubmit={sendChatMessage}>
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="ep-student-dash__ai-input"
              />
              <button type="submit" className="ep-student-dash__ai-send">
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* Announcements */}
          <div className="ep-student-dash__panel">
            <h3 className="ep-student-dash__panel-title">Announcements</h3>
            <ul className="ep-student-dash__announcements">
              {ANNOUNCEMENTS.map(a => (
                <li key={a.id}>
                  <div className="ep-student-dash__announcement-date">{a.date}</div>
                  <h4>{a.title}</h4>
                  <p>By {a.author}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

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
};
