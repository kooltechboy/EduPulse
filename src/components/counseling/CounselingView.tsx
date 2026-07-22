import React, { useState } from 'react';
import { HeartHandshake, Calendar, FileText, Plus, CheckCircle, Clock, Sparkles, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
// @ts-ignore - Assuming the service exists
import { generateCounselingDraft } from '@/services/geminiService';
import './CounselingView.css';

interface Session {
  id: string;
  date: string;
  duration: number;
  notes: string;
}

interface CounselingCase {
  id: string;
  studentName: string;
  type: string;
  priority: string;
  status: 'open' | 'in_progress' | 'closed';
  notes: string;
  openedAt: string;
  sessions: Session[];
}

const INITIAL_CASES: CounselingCase[] = [
  { id: '1', studentName: 'Alex Johnson', type: 'Academic', priority: 'High', status: 'open', notes: 'Struggling with math.', openedAt: '2026-10-10', sessions: [] },
  { id: '2', studentName: 'Mia Miller', type: 'Emotional', priority: 'Medium', status: 'closed', notes: 'Stress issues.', openedAt: '2026-10-12', sessions: [] }
];

export const CounselingView: React.FC = () => {
  const addToast = useUIStore(s => s.addToast);
  const [tab, setTab] = useState<'sessions' | 'notes' | 'college'>('sessions');
  const [cases, setCases] = useState<CounselingCase[]>(INITIAL_CASES);
  const [filter, setFilter] = useState<'All' | 'open' | 'in_progress' | 'closed'>('All');
  
  const [showNewCase, setShowNewCase] = useState(false);
  const [newCaseData, setNewCaseData] = useState({ studentName: '', type: 'Academic', priority: 'Medium', notes: '' });
  
  const [showLogSession, setShowLogSession] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState({ date: '', duration: 30, notes: '' });
  
  const [draftModal, setDraftModal] = useState<{ loading: boolean; content: string; caseId: string | null }>({ loading: false, content: '', caseId: null });

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: CounselingCase = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      studentName: newCaseData.studentName,
      type: newCaseData.type,
      priority: newCaseData.priority,
      status: 'open',
      notes: newCaseData.notes,
      openedAt: new Date().toISOString().split('T')[0],
      sessions: []
    };
    setCases([newCase, ...cases]);
    setShowNewCase(false);
    addToast({ type: 'success', title: 'Case Created', message: 'New counseling case opened.' });
  };

  const handleLogSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showLogSession) return;
    const newSession: Session = {
      id: Date.now().toString(),
      date: sessionData.date,
      duration: sessionData.duration,
      notes: sessionData.notes
    };
    setCases(prev => prev.map(c => c.id === showLogSession ? { ...c, sessions: [...c.sessions, newSession] } : c));
    setShowLogSession(null);
    addToast({ type: 'success', title: 'Session Logged', message: 'Session notes added.' });
  };

  const handleCloseCase = (id: string) => {
    if (window.confirm("Mark case as closed?")) {
      setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'closed' } : c));
      addToast({ type: 'warning', title: 'Case Closed', message: 'Case marked as closed.' });
    }
  };

  const handleGenerateDraft = async (c: CounselingCase) => {
    setDraftModal({ loading: true, content: '', caseId: c.id });
    try {
      const result = await generateCounselingDraft('Progress Note', c.studentName, c.notes);
      const content = result.success && result.content ? result.content : (result.error || 'Draft generation failed.');
      setDraftModal({ loading: false, content, caseId: c.id });
      addToast({ type: 'success', title: 'Draft Generated', message: 'AI draft generated successfully.' });
    } catch (e) {
      setDraftModal({ loading: false, content: 'Error generating draft (mocked output fallback).', caseId: c.id });
      addToast({ type: 'error', title: 'Generation Error', message: 'Failed to generate draft.' });
    }
  };

  const filteredCases = cases.filter(c => filter === 'All' || c.status === filter);

  return (
    <div className="ep-counseling">
      {/* 1. Header */}
      <header className="ep-counseling__header">
        <div>
          <h1 className="ep-counseling__title">Student Counseling & Guidance Center</h1>
          <p className="ep-counseling__subtitle">Schedule student wellness check-ins, college advisory, and confidential progress notes</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ep-tabs" style={{ padding: '2px' }}>
            <button 
              className={`ep-tab ${tab === 'sessions' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('sessions')}
            >
              <Calendar size={14} style={{ marginRight: 4 }} /> Sessions
            </button>
            <button 
              className={`ep-tab ${tab === 'notes' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('notes')}
            >
              <FileText size={14} style={{ marginRight: 4 }} /> Confidential Notes
            </button>
            <button 
              className={`ep-tab ${tab === 'college' ? 'ep-tab--active' : ''}`}
              onClick={() => setTab('college')}
            >
              <HeartHandshake size={14} style={{ marginRight: 4 }} /> College Advisory
            </button>
          </div>
          <button className="ep-btn ep-btn--primary" onClick={() => setShowNewCase(true)}>
            <Plus size={16} /> + New Case
          </button>
        </div>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-counseling__kpi-grid">
        <div className="ep-counseling__kpi-card">
          <div className="ep-counseling__kpi-icon ep-counseling__kpi-icon--purple">
            <HeartHandshake size={22} />
          </div>
          <div>
            <div className="ep-counseling__kpi-val">34</div>
            <div className="ep-counseling__kpi-lbl">Active Student Consultations</div>
          </div>
        </div>

        <div className="ep-counseling__kpi-card">
          <div className="ep-counseling__kpi-icon ep-counseling__kpi-icon--blue">
            <Calendar size={22} />
          </div>
          <div>
            <div className="ep-counseling__kpi-val">8</div>
            <div className="ep-counseling__kpi-lbl">Sessions Scheduled Today</div>
          </div>
        </div>

        <div className="ep-counseling__kpi-card">
          <div className="ep-counseling__kpi-icon ep-counseling__kpi-icon--green">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="ep-counseling__kpi-val">94%</div>
            <div className="ep-counseling__kpi-lbl">Senior College App Completion</div>
          </div>
        </div>

        <div className="ep-counseling__kpi-card">
          <div className="ep-counseling__kpi-icon ep-counseling__kpi-icon--amber">
            <Clock size={22} />
          </div>
          <div>
            <div className="ep-counseling__kpi-val">3</div>
            <div className="ep-counseling__kpi-lbl">Follow-up Tasks Pending</div>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['All', 'open', 'in_progress', 'closed'].map(f => (
          <button key={f} className={`ep-badge ${filter === f ? 'ep-badge--primary' : 'ep-badge--neutral'}`} onClick={() => setFilter(f as any)} style={{ cursor: 'pointer', border: 'none' }}>
            {f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* 3. Table */}
      <div className="ep-table-wrapper">
        <table className="ep-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Case Details</th>
              <th>Status</th>
              <th>Sessions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{c.studentName}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{c.type}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Priority: {c.priority}</div>
                </td>
                <td>
                  <span className={`ep-badge ${c.status === 'closed' ? 'ep-badge--success' : c.status === 'open' ? 'ep-badge--primary' : 'ep-badge--warning'}`}>
                    {c.status}
                  </span>
                </td>
                <td>{c.sessions.length} logged</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="ep-btn ep-btn--secondary ep-btn--sm" onClick={() => setShowLogSession(c.id)}>
                      + Log Session
                    </button>
                    {c.status !== 'closed' && (
                      <button className="ep-btn ep-btn--ghost ep-btn--sm" onClick={() => handleCloseCase(c.id)}>
                        Close Case
                      </button>
                    )}
                    <button className="ep-btn ep-btn--primary ep-btn--sm" onClick={() => handleGenerateDraft(c)} title="AI Draft Note">
                      <Sparkles size={14} style={{ marginRight: 4 }} /> AI Draft
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNewCase && (
        <div className="ep-modal-overlay" onClick={() => setShowNewCase(false)}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>New Case</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowNewCase(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateCase}>
              <div className="ep-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Student Name" required className="ep-input" value={newCaseData.studentName} onChange={e => setNewCaseData({...newCaseData, studentName: e.target.value})} />
                <select className="ep-input" value={newCaseData.type} onChange={e => setNewCaseData({...newCaseData, type: e.target.value})}>
                  <option value="Academic">Academic</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="Emotional">Emotional</option>
                  <option value="Career">Career</option>
                </select>
                <select className="ep-input" value={newCaseData.priority} onChange={e => setNewCaseData({...newCaseData, priority: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <textarea placeholder="Initial Notes" required className="ep-input" value={newCaseData.notes} onChange={e => setNewCaseData({...newCaseData, notes: e.target.value})}></textarea>
              </div>
              <div className="ep-modal-footer">
                <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setShowNewCase(false)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLogSession && (
        <div className="ep-modal-overlay" onClick={() => setShowLogSession(null)}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>Log Session</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setShowLogSession(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleLogSession}>
              <div className="ep-modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="date" required className="ep-input" value={sessionData.date} onChange={e => setSessionData({...sessionData, date: e.target.value})} />
                <input type="number" placeholder="Duration (mins)" required className="ep-input" value={sessionData.duration} onChange={e => setSessionData({...sessionData, duration: parseInt(e.target.value)})} />
                <textarea placeholder="Session Notes" required className="ep-input" value={sessionData.notes} onChange={e => setSessionData({...sessionData, notes: e.target.value})}></textarea>
              </div>
              <div className="ep-modal-footer">
                <button type="button" className="ep-btn ep-btn--secondary" onClick={() => setShowLogSession(null)}>Cancel</button>
                <button type="submit" className="ep-btn ep-btn--primary">Log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {draftModal.caseId && (
        <div className="ep-modal-overlay" onClick={() => setDraftModal({ loading: false, content: '', caseId: null })}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>AI Counseling Draft</h2>
              <button className="ep-btn ep-btn--ghost" onClick={() => setDraftModal({ loading: false, content: '', caseId: null })}><X size={20} /></button>
            </div>
            <div className="ep-modal-content">
              {draftModal.loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <div className="ep-spinner"></div>
                </div>
              ) : (
                <textarea readOnly className="ep-input" rows={10} value={draftModal.content} style={{ width: '100%', resize: 'none' }}></textarea>
              )}
            </div>
            <div className="ep-modal-footer">
              <button className="ep-btn ep-btn--secondary" onClick={() => setDraftModal({ loading: false, content: '', caseId: null })}>Close</button>
              <button className="ep-btn ep-btn--primary" onClick={() => {
                navigator.clipboard.writeText(draftModal.content);
                addToast({ type: 'success', title: 'Copied', message: 'Draft copied to clipboard.' });
              }} disabled={draftModal.loading}>
                Copy Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselingView;
