import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Sparkles, AlertTriangle, CheckCircle, RefreshCw, Zap, Download, Printer, X } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import './Timetable.css';

interface ClassSession {
  id: string;
  course: string;
  teacher: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  color: string;
  hasConflict?: boolean;
  conflictReason?: string;
}

const INITIAL_SESSIONS: ClassSession[] = [
  { id: '1', course: 'Advanced Mathematics', teacher: 'Dr. Smith', room: 'Room 101', day: 'Monday', startTime: '09:00', endTime: '10:30', color: 'var(--color-primary-100)' },
  { id: '2', course: 'Physics I', teacher: 'Prof. Johnson', room: 'Lab 2', day: 'Monday', startTime: '11:00', endTime: '12:30', color: 'var(--color-success-100)' },
  { id: '3', course: 'AP Chemistry (Conflicting)', teacher: 'Dr. Smith', room: 'Lab 2', day: 'Monday', startTime: '09:00', endTime: '10:30', color: 'rgba(239, 68, 68, 0.2)', hasConflict: true, conflictReason: 'Teacher Double-Booked: Dr. Smith assigned to Advanced Math and Chemistry at 09:00 AM' },
  { id: '4', course: 'World History', teacher: 'Mr. Davis', room: 'Room 205', day: 'Tuesday', startTime: '09:00', endTime: '10:00', color: 'var(--color-warning-100)' },
  { id: '5', course: 'English Literature', teacher: 'Ms. Wilson', room: 'Room 302', day: 'Wednesday', startTime: '13:00', endTime: '14:30', color: 'var(--color-primary-100)' },
  { id: '6', course: 'Biology', teacher: 'Dr. Brown', room: 'Lab 1', day: 'Thursday', startTime: '10:00', endTime: '12:00', color: 'var(--color-success-100)' },
  { id: '7', course: 'Computer Science', teacher: 'Mr. Taylor', room: 'Comp Lab A', day: 'Friday', startTime: '14:00', endTime: '15:30', color: 'var(--color-info-100)' },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

export const Timetable: React.FC = () => {
  const [sessions, setSessions] = useState<ClassSession[]>(INITIAL_SESSIONS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  const [slotToAssign, setSlotToAssign] = useState<{ day: string, startTime: string, endTime: string } | null>(null);
  const { addToast } = useUIStore();

  const conflicts = sessions.filter(s => s.hasConflict);

  const handleAutoResolve = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Shift conflicting chemistry session to Tuesday 11:00 AM in Lab 1
      setSessions(prev => prev.map(s => {
        if (s.id === '3') {
          return {
            ...s,
            course: 'AP Chemistry',
            day: 'Tuesday',
            startTime: '11:00',
            endTime: '12:30',
            room: 'Lab 1',
            color: 'var(--color-primary-100)',
            hasConflict: false,
            conflictReason: undefined
          };
        }
        return s;
      }));
      setIsAnalyzing(false);
      setIsResolved(true);
      setShowConflictModal(false);
      addToast({ type: 'success', title: 'Resolved', message: 'AI Schedule Conflict Resolver successfully relocated AP Chemistry to Tuesday 11:00 AM (Lab 1) with 0 remaining overlaps!' });
    }, 1200);
  };

  const handleExportCSV = () => {
    const headers = ['Day', 'Period', 'Subject', 'Teacher', 'Room'];
    const csvContent = [
      headers.join(','),
      ...sessions.map(s => `"${s.day}","${s.startTime}-${s.endTime}","${s.course}","${s.teacher}","${s.room}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timetable.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAssignSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotToAssign) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const teacher = data.teacher as string;
    const course = data.course as string;
    
    const hasConflict = sessions.some(s => s.day === slotToAssign.day && s.teacher === teacher && s.startTime === slotToAssign.startTime);
    if (hasConflict) {
      addToast({ type: 'error', title: 'Conflict Detected', message: `${teacher} is already assigned to a class at this time.` });
      return;
    }

    const newSession: ClassSession = {
      id: `session-${Date.now()}`,
      course,
      teacher,
      room: data.room as string,
      day: slotToAssign.day,
      startTime: slotToAssign.startTime,
      endTime: slotToAssign.endTime,
      color: 'var(--color-info-100)'
    };
    
    setSessions(prev => [...prev, newSession]);
    setSlotToAssign(null);
    addToast({ type: 'success', title: 'Assigned', message: 'Slot assigned successfully.' });
  };

  const handleClearSlot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const getSessionStyle = (session: ClassSession) => {
    const startHour = parseInt(session.startTime.split(':')[0]);
    const startMin = parseInt(session.startTime.split(':')[1]);
    const endHour = parseInt(session.endTime.split(':')[0]);
    const endMin = parseInt(session.endTime.split(':')[1]);
    
    const startGridRow = (startHour - 8) * 2 + (startMin / 30) + 2;
    const endGridRow = (endHour - 8) * 2 + (endMin / 30) + 2;
    
    return {
      gridRowStart: startGridRow,
      gridRowEnd: endGridRow,
      background: session.hasConflict ? 'rgba(239, 68, 68, 0.25)' : session.color,
      borderLeft: session.hasConflict ? '4px solid #ef4444' : `4px solid ${session.color.replace('100', '500')}`,
    };
  };

  return (
    <div className="ep-timetable">
      <div className="ep-timetable__header">
        <div className="ep-timetable__nav">
          <button className="ep-btn-icon"><ChevronLeft size={20} /></button>
          <h2>July 20 - July 24, 2026</h2>
          <button className="ep-btn-icon"><ChevronRight size={20} /></button>
          <button className="ep-btn ep-btn--outline">Today</button>
        </div>
        <div className="ep-timetable__filters" style={{ display: 'flex', gap: '10px' }}>
          {conflicts.length > 0 ? (
            <button className="ep-btn ep-btn--danger" onClick={() => setShowConflictModal(true)}>
              <AlertTriangle size={16} style={{ marginRight: 6 }} /> {conflicts.length} Overlap Conflict
            </button>
          ) : (
            <button className="ep-btn ep-btn--secondary" style={{ color: 'var(--color-success-400)' }}>
              <CheckCircle size={16} style={{ marginRight: 6 }} /> Schedule Optimized
            </button>
          )}

          <button className="ep-btn ep-btn--ghost" onClick={handleExportCSV}>
            <Download size={16} style={{ marginRight: 6 }} /> Export
          </button>
          <button className="ep-btn ep-btn--ghost" onClick={() => window.print()}>
            <Printer size={16} style={{ marginRight: 6 }} /> Print
          </button>
          <button className="ep-btn ep-btn--primary" onClick={handleAutoResolve} disabled={isAnalyzing || conflicts.length === 0}>
            <Sparkles size={16} style={{ marginRight: 6 }} /> {isAnalyzing ? 'Optimizing...' : 'AI Auto-Resolve'}
          </button>
        </div>
      </div>

      {/* Conflict Warning Banner if conflicts exist */}
      {conflicts.length > 0 && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fca5a5', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} color="#ef4444" />
            <span><strong>Schedule Conflict Detected:</strong> {conflicts[0].conflictReason}</span>
          </div>
          <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => setShowConflictModal(true)}>
            View Breakdown
          </button>
        </div>
      )}

      <div className="ep-timetable__grid">
        <div className="ep-timetable__time-col">
          <div className="ep-timetable__cell ep-timetable__cell--header">Time</div>
          {timeSlots.map(time => (
            <div key={time} className="ep-timetable__time-slot">{time}</div>
          ))}
        </div>
        
        {days.map(day => (
          <div key={day} className="ep-timetable__day-col">
            <div className="ep-timetable__cell ep-timetable__cell--header">{day}</div>
            <div className="ep-timetable__day-grid">
              {/* Grid lines */}
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="ep-timetable__grid-line" style={{ gridRow: i + 1 }} />
              ))}

              {/* Empty slot overlays */}
              {timeSlots.slice(0, -1).map((time, i) => {
                const nextTime = timeSlots[i + 1];
                const startRow = i * 2 + 2;
                return (
                  <div 
                    key={time} 
                    className="ep-timetable__empty-slot"
                    style={{ gridRowStart: startRow, gridRowEnd: startRow + 2 }}
                    onClick={() => setSlotToAssign({ day, startTime: time, endTime: nextTime })}
                  />
                );
              })}
              
              {/* Sessions */}
              {sessions.filter(s => s.day === day).map(session => (
                <div 
                  key={session.id} 
                  className="ep-timetable__session" 
                  style={getSessionStyle(session)}
                >
                  <div className="ep-timetable__session-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.course}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {session.hasConflict && <AlertTriangle size={14} color="#ef4444" />}
                      <button className="ep-btn-icon" style={{ padding: 2, background: 'rgba(0,0,0,0.05)', color: 'var(--color-text-primary)' }} onClick={(e) => handleClearSlot(session.id, e)}>
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="ep-timetable__session-meta">{session.startTime} - {session.endTime}</div>
                  <div className="ep-timetable__session-meta">{session.room} | {session.teacher}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showConflictModal && (
        <div className="ep-timetable__modal-overlay" onClick={() => setShowConflictModal(false)}>
          <div className="ep-card" style={{ width: '100%', maxWidth: '580px', padding: '24px', background: 'var(--color-surface-200, #17123b)', border: '1px solid var(--color-border)', borderRadius: '16px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '8px', borderRadius: '10px' }}>
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>Schedule Conflict Diagnostics</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Detected period overlaps & room capacity overruns</p>
                </div>
              </div>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowConflictModal(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {conflicts.map(c => (
                <div key={c.id} style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', fontSize: '13px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#ffffff' }}>{c.course}</div>
                  <div>{c.conflictReason}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <button className="ep-btn ep-btn--secondary" onClick={() => setShowConflictModal(false)}>Close</button>
              <button className="ep-btn ep-btn--primary" onClick={handleAutoResolve} disabled={isAnalyzing}>
                <Sparkles size={16} style={{ marginRight: 6 }} /> {isAnalyzing ? 'Resolving...' : 'Run AI Conflict Solver'}
              </button>
            </div>
          </div>
        </div>
      )}

      {slotToAssign && (
        <div className="ep-timetable__modal-overlay">
          <div className="ep-timetable__modal">
            <h2 style={{ margin: 0 }}>Assign Slot</h2>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-tertiary)' }}>
              {slotToAssign.day}, {slotToAssign.startTime} - {slotToAssign.endTime}
            </p>
            <form onSubmit={handleAssignSlot} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              <div className="ep-timetable__modal-field">
                <label className="ep-timetable__modal-label">Subject</label>
                <select name="course" className="ep-timetable__modal-select" required>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Art">Art</option>
                  <option value="PE">Physical Education</option>
                </select>
              </div>
              <div className="ep-timetable__modal-field">
                <label className="ep-timetable__modal-label">Teacher</label>
                <input name="teacher" className="ep-timetable__modal-input" required placeholder="e.g. Dr. Smith" />
              </div>
              <div className="ep-timetable__modal-field">
                <label className="ep-timetable__modal-label">Room</label>
                <input name="room" className="ep-timetable__modal-input" required placeholder="e.g. Room 101" />
              </div>
              <div className="ep-timetable__modal-actions">
                <button type="button" className="ep-btn ep-btn--ghost" onClick={() => setSlotToAssign(null)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">Assign Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
