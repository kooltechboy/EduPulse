import React, { useState, useEffect } from 'react';
import { Save, Search, CheckCircle, XCircle, AlertCircle, Clock, UserCheck, Users, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAcademicStore } from '@/stores/academicStore';
import './AttendanceMarking.css';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'none';

interface Student {
  id: string;
  name: string;
  avatar: string;
  status: AttendanceStatus;
  notes?: string;
}

export const AttendanceMarking: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [course, setCourse] = useState('MATH401');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const addToast = useUIStore(s => s.addToast);
  const markAttendance = useAcademicStore(s => s.markAttendance);
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);
  
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Alice Johnson', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson', status: 'none', notes: '' },
    { id: '2', name: 'Bob Smith', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith', status: 'none', notes: '' },
    { id: '3', name: 'Charlie Davis', avatar: 'https://ui-avatars.com/api/?name=Charlie+Davis', status: 'none', notes: '' },
    { id: '4', name: 'Diana Prince', avatar: 'https://ui-avatars.com/api/?name=Diana+Prince', status: 'none', notes: '' },
    { id: '5', name: 'Edward Norton', avatar: 'https://ui-avatars.com/api/?name=Edward+Norton', status: 'none', notes: '' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem(`attendance_${course}_${date}`);
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      setStudents(s => s.map(student => ({ ...student, status: 'none', notes: '' })));
    }
  }, [course, date]);

  const cycleStatus = (id: string) => {
    const sequence: AttendanceStatus[] = ['present', 'absent', 'late', 'excused', 'present'];
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'none' ? 'present' : sequence[sequence.indexOf(s.status) + 1] || 'present';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const updateNotes = (id: string, notes: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, notes } : s));
  };

  const markAll = (status: AttendanceStatus) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
    addToast({ type: 'success', title: 'Marked', message: `All students marked as ${status}.` });
  };

  const handleSave = async () => {
    setIsSaving(true);
    localStorage.setItem(`attendance_${course}_${date}`, JSON.stringify(students));
    try {
      if (markAttendance) {
        students.forEach(s => {
          if (s.status !== 'none') {
          markAttendance({
            id: `att_${s.id}_${date}`,
            studentId: s.id,
            courseId: course,
            date,
            status: s.status as 'present' | 'absent' | 'late' | 'excused',
            notes: s.notes,
            markedBy: 'current_user',
          });
          }
        });
      }
      addToast({ type: 'success', title: 'Saved', message: `Attendance for ${date} saved successfully.` });
    } catch (e) {
      addToast({ type: 'error', title: 'Save Failed', message: 'Failed to save attendance.' });
    } finally {
      setIsSaving(false);
    }
  };

  const navigateDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
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
          <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => navigateDate(-1)}><ChevronLeft size={16} /></button>
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => navigateDate(1)}><ChevronRight size={16} /></button>
          
          <select className="ep-input" value={course} onChange={(e) => setCourse(e.target.value)} style={{ width: '220px' }}>
            <option value="MATH401">Advanced Mathematics (MATH401)</option>
            <option value="PHY301">Physics I (PHY301)</option>
          </select>
          <button className="ep-btn ep-btn--primary" onClick={handleSave} disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Roll Call'}
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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                className={`ep-btn ep-btn--sm ${student.status === 'present' ? 'ep-btn--success' : student.status === 'absent' ? 'ep-btn--danger' : student.status === 'late' ? 'ep-btn--warning' : student.status === 'excused' ? 'ep-btn--primary' : 'ep-btn--secondary'}`}
                onClick={() => cycleStatus(student.id)}
                style={{ width: '120px', textTransform: 'capitalize' }}
              >
                {student.status === 'present' && <CheckCircle size={14} style={{ marginRight: 4 }} />}
                {student.status === 'absent' && <XCircle size={14} style={{ marginRight: 4 }} />}
                {student.status === 'late' && <Clock size={14} style={{ marginRight: 4 }} />}
                {student.status === 'excused' && <AlertCircle size={14} style={{ marginRight: 4 }} />}
                {student.status === 'none' ? 'Mark' : student.status}
              </button>
              
              <button 
                className="ep-btn ep-btn--ghost ep-btn--sm"
                onClick={() => setExpandedNotesId(expandedNotesId === student.id ? null : student.id)}
                title="Add notes"
              >
                <FileText size={16} />
              </button>
            </div>
            
            {expandedNotesId === student.id && (
              <div style={{ width: '100%', marginTop: '8px' }}>
                <input 
                  type="text" 
                  className="ep-input" 
                  style={{ width: '100%' }}
                  placeholder="Add attendance note..."
                  value={student.notes || ''}
                  onChange={(e) => updateNotes(student.id, e.target.value)}
                  autoFocus
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceMarking;
