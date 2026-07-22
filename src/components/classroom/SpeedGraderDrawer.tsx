import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, FileText, ChevronRight, ChevronLeft, Award, User, Clock, Send } from 'lucide-react';
import { getAITutorResponse } from '@/services/geminiService';
import { useUIStore } from '@/stores/uiStore';
import './SpeedGraderDrawer.css';

interface StudentSubmission {
  id: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  fileTitle: string;
  contentSnippet: string;
  status: 'graded' | 'pending' | 'late';
  score?: number;
  rubric: {
    comprehension: number;
    rigor: number;
    visualization: number;
    formatting: number;
  };
  feedback?: string;
}

interface SpeedGraderDrawerProps {
  courseName: string;
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-1',
    studentName: 'Alice Johnson',
    studentId: 'std-1',
    submittedAt: 'Today 9:15 AM',
    fileTitle: 'Physics_Lab1_Kinematics_AliceJ.pdf',
    contentSnippet: 'In this experimental setup, velocity vectors were measured using dual photogate timers. The calculated gravitational acceleration g was 9.78 m/s^2, yielding a percentage error of 0.2% compared to standard sea-level telemetry.',
    status: 'pending',
    rubric: { comprehension: 23, rigor: 24, visualization: 22, formatting: 25 },
    feedback: ''
  },
  {
    id: 'sub-2',
    studentName: 'Bob Smith',
    studentId: 'std-2',
    submittedAt: 'Yesterday 11:40 PM',
    fileTitle: 'Lab1_Kinematics_BobSmith.pdf',
    contentSnippet: 'We calculated acceleration by timing cart velocity on a 15-degree inclined plane. Results show quadratic position scaling with time.',
    status: 'pending',
    rubric: { comprehension: 20, rigor: 18, visualization: 19, formatting: 20 },
    feedback: ''
  },
  {
    id: 'sub-3',
    studentName: 'Diana Prince',
    studentId: 'std-4',
    submittedAt: 'Yesterday 2:00 PM',
    fileTitle: 'Kinematics_Full_Report_DianaP.pdf',
    contentSnippet: 'Comprehensive calculus-based derivation of equations of motion under constant force vectors. Includes graphical error analysis and Chi-squared fitting.',
    status: 'graded',
    score: 98,
    rubric: { comprehension: 25, rigor: 25, visualization: 24, formatting: 24 },
    feedback: 'Exemplary mathematical rigor and precise error analysis!'
  }
];

export const SpeedGraderDrawer: React.FC<SpeedGraderDrawerProps> = ({ courseName, isOpen, onClose }) => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(MOCK_SUBMISSIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const addToast = useUIStore(s => s.addToast);

  if (!isOpen) return null;

  const current = submissions[currentIndex];

  const updateRubric = (key: keyof StudentSubmission['rubric'], val: number) => {
    setSubmissions(prev => prev.map((sub, i) => {
      if (i === currentIndex) {
        return { ...sub, rubric: { ...sub.rubric, [key]: val } };
      }
      return sub;
    }));
  };

  const currentTotalScore = Object.values(current.rubric).reduce((a, b) => a + b, 0);

  const handleGenerateAiFeedback = async () => {
    setIsGeneratingAi(true);
    try {
      const prompt = `Grade student submission for ${courseName}:\nSnippet: "${current.contentSnippet}"\nRubric Scores: ${JSON.stringify(current.rubric)}\nTotal Score: ${currentTotalScore}/100.\nProvide 2 sentences of constructive feedback highlighting strengths and key improvement area.`;
      const res = await getAITutorResponse(prompt, courseName, 'High School');
      if (res.success && res.content) {
        const feedback = res.content.substring(0, 180);
        setSubmissions(prev => prev.map((sub, i) => i === currentIndex ? { ...sub, feedback } : sub));
      } else {
        setSubmissions(prev => prev.map((sub, i) => i === currentIndex ? { ...sub, feedback: `Solid submission scoring ${currentTotalScore}%. Good analytical reasoning.` } : sub));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveAndNext = () => {
    setSubmissions(prev => prev.map((sub, i) => i === currentIndex ? { ...sub, status: 'graded', score: currentTotalScore } : sub));
    addToast({ type: 'success', title: 'Grade Submitted', message: `Grade submitted for ${current.studentName}.` });
    
    // Find next ungraded
    const nextIndex = submissions.findIndex((s, i) => i > currentIndex && s.status !== 'graded');
    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
    } else {
      // search from start
      const wrapIndex = submissions.findIndex(s => s.status !== 'graded');
      if (wrapIndex !== -1 && wrapIndex !== currentIndex) {
        setCurrentIndex(wrapIndex);
      } else {
        addToast({ type: 'info', title: 'All Done', message: 'No more ungraded submissions.' });
      }
    }
  };

  const navigatePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else addToast({ type: 'info', title: 'Start of List', message: 'No previous submissions.' });
  };

  const navigateNext = () => {
    if (currentIndex < submissions.length - 1) setCurrentIndex(currentIndex + 1);
    else addToast({ type: 'info', title: 'End of List', message: 'No more submissions.' });
  };

  return (
    <div className="ep-modal-overlay ep-grader__overlay" onClick={onClose}>
      <div className="ep-grader__drawer" onClick={e => e.stopPropagation()}>
        {/* Header Bar */}
        <header className="ep-grader__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="ep-grader__badge-icon">
              <Award size={22} />
            </div>
            <div>
              <h2 className="ep-grader__title">SpeedGrader™ Workspace</h2>
              <p className="ep-grader__subtitle">{courseName} • Submission {currentIndex + 1} of {submissions.length}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="ep-btn ep-btn--ghost" disabled={currentIndex === 0} onClick={navigatePrev}>
              <ChevronLeft size={16} /> Prev
            </button>
            <button className="ep-btn ep-btn--ghost" disabled={currentIndex === submissions.length - 1} onClick={navigateNext}>
              Next <ChevronRight size={16} />
            </button>
            <button className="ep-btn ep-btn--ghost" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Main 2-Column Split: Document Preview & Rubric Panel */}
        <div className="ep-grader__body">
          {/* Left: Document View */}
          <div className="ep-grader__doc-view">
            <div className="ep-grader__doc-meta">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={16} className="ep-grader__meta-icon" />
                <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{current.studentName}</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>({current.studentId})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                <Clock size={14} /> Submitted {current.submittedAt}
              </div>
            </div>

            <div className="ep-grader__file-card">
              <FileText size={20} style={{ color: '#8b5cf6' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{current.fileTitle}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>PDF Document • 1.4 MB</div>
              </div>
              <span className={`ep-badge ep-badge--${current.status === 'graded' ? 'success' : 'warning'}`}>
                {current.status.toUpperCase()}
              </span>
            </div>

            {/* Document Content Simulation */}
            <div className="ep-grader__paper">
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#0f172a' }}>Lab Report: Kinematics & Vectors</h3>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>{current.contentSnippet}</p>
              <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '20px', marginTop: '20px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                [ Interactive PDF Viewer Canvas — Vector Equations & Photogate Data Plots ]
              </div>
            </div>
          </div>

          {/* Right: Rubric Grading & AI Feedback Panel */}
          <div className="ep-grader__rubric-panel">
            <div className="ep-grader__score-banner">
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Calculated Grade</div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-primary-400)' }}>
                  {currentTotalScore} <span style={{ fontSize: '14px', color: 'var(--color-text-tertiary)' }}>/ 100</span>
                </div>
              </div>
              <button className="ep-btn ep-btn--primary" onClick={handleSaveAndNext}>
                <CheckCircle size={16} /> Save & Submit
              </button>
            </div>

            {/* Rubric Sliders / Inputs */}
            <div className="ep-grader__rubric-section">
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#fff' }}>Standards Rubric Evaluation</h4>

              <div className="ep-grader__rubric-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span>1. Concept Comprehension</span>
                  <strong>{current.rubric.comprehension} / 25</strong>
                </div>
                <input type="range" min="0" max="25" value={current.rubric.comprehension} onChange={e => updateRubric('comprehension', parseInt(e.target.value, 10))} />
              </div>

              <div className="ep-grader__rubric-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span>2. Mathematical Rigor & Derivation</span>
                  <strong>{current.rubric.rigor} / 25</strong>
                </div>
                <input type="range" min="0" max="25" value={current.rubric.rigor} onChange={e => updateRubric('rigor', parseInt(e.target.value, 10))} />
              </div>

              <div className="ep-grader__rubric-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span>3. Data Visualization & Graphs</span>
                  <strong>{current.rubric.visualization} / 25</strong>
                </div>
                <input type="range" min="0" max="25" value={current.rubric.visualization} onChange={e => updateRubric('visualization', parseInt(e.target.value, 10))} />
              </div>

              <div className="ep-grader__rubric-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span>4. Technical Formatting & Citations</span>
                  <strong>{current.rubric.formatting} / 25</strong>
                </div>
                <input type="range" min="0" max="25" value={current.rubric.formatting} onChange={e => updateRubric('formatting', parseInt(e.target.value, 10))} />
              </div>
            </div>

            {/* AI Feedback Section */}
            <div className="ep-grader__ai-feedback-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} /> Gemini AI Inline Feedback
                </span>
                <button className="ep-btn ep-btn--ghost" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={handleGenerateAiFeedback} disabled={isGeneratingAi}>
                  {isGeneratingAi ? 'Generating...' : 'Auto-Generate'}
                </button>
              </div>

              <textarea 
                className="ep-input" 
                rows={3} 
                value={current.feedback || ''} 
                onChange={e => setSubmissions(prev => prev.map((s, i) => i === currentIndex ? { ...s, feedback: e.target.value } : s))}
                placeholder="Enter feedback or generate automatically with AI..."
                style={{ fontSize: '12px', resize: 'vertical' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedGraderDrawer;
