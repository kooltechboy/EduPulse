import React, { useState } from 'react';
import { Sparkles, X, Send, BookOpen, TrendingUp, GraduationCap, Compass, FileText, Bot, CheckCircle, AlertCircle } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { generateLessonPlan, getPerformanceInsights, getAITutorResponse, generateCareerGuidance, generateCounselingDraft } from '@/services/geminiService';
import './AICopilotModal.css';

export const AICopilotModal: React.FC = () => {
  const { aiCopilotOpen, setAiCopilotOpen } = useUIStore();
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'chat' | 'lesson' | 'insights' | 'tutor' | 'career' | 'counseling'>('chat');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!aiCopilotOpen) return null;

  const handleClose = () => {
    setAiCopilotOpen(false);
    setError(null);
  };

  const handleQuickAction = async (action: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      if (action === 'lesson') {
        const res = await generateLessonPlan('Physics I', 'Newtonian Kinematics & Acceleration', 'Grade 10', '45 Minutes');
        if (res.success) setResponse(res.content);
        else setError(res.error || 'Failed to generate lesson plan.');
      } else if (action === 'insights') {
        const res = await getPerformanceInsights({
          studentCount: 32,
          averageGpa: 3.42,
          attendanceRate: 94.8,
          subjectAverages: { Mathematics: 88, Physics: 84, Literature: 91, History: 89, ComputerScience: 96 }
        });
        if (res.success) setResponse(res.content);
        else setError(res.error || 'Failed to compute performance insights.');
      } else if (action === 'tutor') {
        const res = await getAITutorResponse('Can you explain quadratic formula derivation step by step?', 'Mathematics', 'Grade 10');
        if (res.success) setResponse(res.content);
        else setError(res.error || 'Tutor service unavailable.');
      } else if (action === 'career') {
        const res = await generateCareerGuidance(['Robotics', 'Game Design', 'Physics'], ['Mathematics', 'Computer Science'], 'Grade 11');
        if (res.success) setResponse(res.content);
        else setError(res.error || 'Career guidance service unavailable.');
      } else if (action === 'counseling') {
        const res = await generateCounselingDraft('Academic Progress Note', 'Alex Rivera (Grade 10)', 'Sudden drop in mid-term Physics attendance.');
        if (res.success) setResponse(res.content);
        else setError(res.error || 'Draft generation failed.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected AI error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await getAITutorResponse(prompt, 'General Academics', 'High School');
      if (res.success) {
        setResponse(res.content);
      } else {
        setError(res.error || 'Failed to process AI request.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ep-modal-overlay ep-copilot__overlay" onClick={handleClose}>
      <div className="ep-copilot__modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="ep-copilot__header">
          <div className="ep-copilot__brand">
            <div className="ep-copilot__icon">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="ep-copilot__title">EduPulse AI Copilot</h2>
              <p className="ep-copilot__subtitle">Intelligent Assistant powered by Google Gemini 2.0 Flash</p>
            </div>
          </div>
          <button className="ep-copilot__close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </header>

        {/* Quick Action Grid */}
        <div className="ep-copilot__actions-grid">
          <button className="ep-copilot__action-card" onClick={() => handleQuickAction('lesson')}>
            <BookOpen size={18} className="ep-copilot__card-icon ep-copilot__card-icon--blue" />
            <div>
              <div className="ep-copilot__card-title">Lesson Planner</div>
              <div className="ep-copilot__card-desc">Generate standards-aligned lesson plans</div>
            </div>
          </button>

          <button className="ep-copilot__action-card" onClick={() => handleQuickAction('insights')}>
            <TrendingUp size={18} className="ep-copilot__card-icon ep-copilot__card-icon--green" />
            <div>
              <div className="ep-copilot__card-title">Class Analytics</div>
              <div className="ep-copilot__card-desc">Predictive insights & student trends</div>
            </div>
          </button>

          <button className="ep-copilot__action-card" onClick={() => handleQuickAction('tutor')}>
            <GraduationCap size={18} className="ep-copilot__card-icon ep-copilot__card-icon--purple" />
            <div>
              <div className="ep-copilot__card-title">AI Tutor Assistant</div>
              <div className="ep-copilot__card-desc">Step-by-step academic explanations</div>
            </div>
          </button>

          <button className="ep-copilot__action-card" onClick={() => handleQuickAction('career')}>
            <Compass size={18} className="ep-copilot__card-icon ep-copilot__card-icon--amber" />
            <div>
              <div className="ep-copilot__card-title">Career Counselor</div>
              <div className="ep-copilot__card-desc">Personalized student pathway mapping</div>
            </div>
          </button>
        </div>

        {/* AI Output Content Area */}
        <div className="ep-copilot__content-area">
          {loading ? (
            <div className="ep-copilot__loading">
              <div className="ep-copilot__spinner" />
              <p className="ep-copilot__loading-text">Synthesizing AI response with Gemini 2.0...</p>
            </div>
          ) : error ? (
            <div className="ep-copilot__error-box">
              <AlertCircle size={20} />
              <div>
                <strong>AI Service Notification:</strong>
                <p>{error}</p>
              </div>
            </div>
          ) : response ? (
            <div className="ep-copilot__response-box">
              <div className="ep-copilot__response-header">
                <Bot size={18} />
                <span>EduPulse AI Response</span>
              </div>
              <div className="ep-copilot__response-body">
                {response.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="ep-copilot__empty">
              <Sparkles size={40} className="ep-copilot__empty-icon" />
              <h3>How can EduPulse AI assist you today?</h3>
              <p>Select a quick action above or type any educational, administrative, or tutoring question below.</p>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form className="ep-copilot__input-bar" onSubmit={handleSubmitCustom}>
          <input
            type="text"
            className="ep-copilot__input"
            placeholder="Ask AI anything (e.g., 'Draft a parent notification email regarding upcoming exams')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="ep-btn ep-btn--primary" disabled={loading || !prompt.trim()}>
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICopilotModal;
