import React, { useState, useEffect } from 'react';
import { Save, Search, CheckCircle, XCircle, AlertCircle, Clock, UserCheck, Users } from 'lucide-react';
import './AttendanceMarking.css';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'none';

interface Student {
  id: string;
  name: string;
  avatar: string;
  status: AttendanceStatus;
}

export const AttendanceMarking: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [course, setCourse] = useState('MATH401');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Alice Johnson', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson', status: 'none' },
    { id: '2', name: 'Bob Smith', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith', status: 'none' },
    { id: '3', name: 'Charlie Davis', avatar: 'https://ui-avatars.com/api/?name=Charlie+Davis', status: 'none' },
    { id: '4', name: 'Diana Prince', avatar: 'https://ui-avatars.com/api/?name=Diana+Prince', status: 'none' },
    { id: '5', name: 'Edward Norton', avatar: 'https://ui-avatars.com/api/?name=Edward+Norton', status: 'none' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem(`attendance_${course}_${date}`);
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      setStudents(s => s.map(student => ({ ...student, status: 'none' })));
    }
  }, [course, date]);

  const markStudent = (id: string, status: AttendanceStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const markAll = (status: AttendanceStatus) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const handleSave = () => {
    localStorage.setItem(`attendance_${course}_${date}`, JSON.stringify(students));
    alert('Attendance saved successfully!');
  };

  const stats = {
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    excused: students.filter(s => s.status === 'excused').length,
  };
  const totalMarked = stats.present + stats.absent + stats.late + stats.excused;
  const attendanceRate = totalMarked > 0 ? Math.round(((stats.present + stats.late) / totalMarked) * 100) : 0;

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="ep-attendance">
      {/* 1. Header */}
      <header className="ep-attendance__header">
        <div>
          <h1 className="ep-attendance__title">Daily Attendance Marking</h1>
          <p className="ep-attendance__subtitle">Record classroom attendance, late arrivals, and excused absence notes</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="date" 
            className="ep-input" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            style={{ width: '160px' }}
          />
          <select className="ep-input" value={course} onChange={(e) => setCourse(e.target.value)} style={{ width: '220px' }}>
            <option value="MATH401">Advanced Mathematics (MATH401)</option>
            <option value="PHY301">Physics I (PHY301)</option>
          </select>
          <button className="ep-btn ep-btn--primary" onClick={handleSave}>
            <Save size={16} /> Save Roll Call
          </button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-attendance__kpi-grid">
        <div className="ep-attendance__kpi-card">
          <div className="ep-attendance__kpi-icon ep-attendance__kpi-icon--green">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="ep-attendance__kpi-val">{stats.present}</div>
            <div className="ep-attendance__kpi-lbl">Students Present</div>
          </div>
        </div>

        <div className="ep-attendance__kpi-card">
          <div className="ep-attendance__kpi-icon ep-attendance__kpi-icon--amber">
            <Clock size={22} />
          </div>
          <div>
            <div className="ep-attendance__kpi-val">{stats.late}</div>
            <div className="ep-attendance__kpi-lbl">Tardy / Late</div>
          </div>
        </div>

        <div className="ep-attendance__kpi-card">
          <div className="ep-attendance__kpi-icon ep-attendance__kpi-icon--red">
            <XCircle size={22} />
          </div>
          <div>
            <div className="ep-attendance__kpi-val">{stats.absent}</div>
            <div className="ep-attendance__kpi-lbl">Unexcused Absent</div>
          </div>
        </div>

        <div className="ep-attendance__kpi-card">
          <div className="ep-attendance__kpi-icon ep-attendance__kpi-icon--blue">
            <UserCheck size={22} />
          </div>
          <div>
            <div className="ep-attendance__kpi-val">{attendanceRate}%</div>
            <div className="ep-attendance__kpi-lbl">Overall Attendance Rate</div>
          </div>
        </div>
      </section>

      {/* 3. Toolbar & Student List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-surface-50)', padding: '8px 16px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', width: '300px' }}>
          <Search size={16} color="var(--color-text-tertiary)" />
          <input type="text" placeholder="Search student name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--color-text-primary)', width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => markAll('present')}>Mark All Present</button>
          <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => markAll('absent')}>Mark All Absent</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredStudents.map(student => (
          <div key={student.id} className="ep-attendance-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={student.avatar} alt={student.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{student.name}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className={`ep-btn ep-btn--sm ${student.status === 'present' ? 'ep-btn--success' : 'ep-btn--secondary'}`}
                onClick={() => markStudent(student.id, 'present')}
              >
                <CheckCircle size={14} style={{ marginRight: 4 }} /> Present
              </button>
              <button 
                className={`ep-btn ep-btn--sm ${student.status === 'late' ? 'ep-btn--warning' : 'ep-btn--secondary'}`}
                onClick={() => markStudent(student.id, 'late')}
              >
                <Clock size={14} style={{ marginRight: 4 }} /> Late
              </button>
              <button 
                className={`ep-btn ep-btn--sm ${student.status === 'absent' ? 'ep-btn--danger' : 'ep-btn--secondary'}`}
                onClick={() => markStudent(student.id, 'absent')}
              >
                <XCircle size={14} style={{ marginRight: 4 }} /> Absent
              </button>
              <button 
                className={`ep-btn ep-btn--sm ${student.status === 'excused' ? 'ep-btn--primary' : 'ep-btn--secondary'}`}
                onClick={() => markStudent(student.id, 'excused')}
              >
                <AlertCircle size={14} style={{ marginRight: 4 }} /> Excused
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceMarking;
