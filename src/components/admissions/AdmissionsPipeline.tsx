import React, { useState } from 'react';
import { Search, Plus, User, FileText, Calendar, TrendingUp, Users, CheckCircle } from 'lucide-react';
import './AdmissionsPipeline.css';

const STAGES = ['Inquiry', 'Applied', 'Under Review', 'Accepted', 'Enrolled'];

const MOCK_CANDIDATES = [
  { id: '1', name: 'Lucas Martin', grade: 'Grade 9', date: '2026-10-01', source: 'Website Inquiry', stage: 'Inquiry' },
  { id: '2', name: 'Emma Wilson', grade: 'Grade 10', date: '2026-09-28', source: 'Parent Referral', stage: 'Applied' },
  { id: '3', name: 'Noah Brown', grade: 'Grade 1', date: '2026-09-25', source: 'Campus Tour Walk-in', stage: 'Under Review' },
  { id: '4', name: 'Olivia Davis', grade: 'Grade 5', date: '2026-09-20', source: 'Website Inquiry', stage: 'Accepted' },
  { id: '5', name: 'Liam Miller', grade: 'Grade 8', date: '2026-09-15', source: 'Open House Event', stage: 'Enrolled' },
];

export const AdmissionsPipeline: React.FC = () => {
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = candidates.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const moveCandidate = (id: string, direction: 'next' | 'prev') => {
    setCandidates(candidates.map(c => {
      if (c.id === id) {
        const currentIndex = STAGES.indexOf(c.stage);
        const newIndex = direction === 'next' ? Math.min(currentIndex + 1, STAGES.length - 1) : Math.max(currentIndex - 1, 0);
        return { ...c, stage: STAGES[newIndex] };
      }
      return c;
    }));
  };

  return (
    <div className="ep-admissions">
      {/* 1. Header */}
      <header className="ep-admissions__header">
        <div>
          <h1 className="ep-admissions__title">Student Admissions Kanban Pipeline</h1>
          <p className="ep-admissions__subtitle">Manage applicant lifecycle from initial web inquiry to formal enrollment</p>
        </div>
        <button className="ep-btn ep-btn--primary">
          <Plus size={16} /> + Register New Applicant
        </button>
      </header>

      {/* 2. KPI Cards */}
      <section className="ep-admissions__kpi-grid">
        <div className="ep-admissions__kpi-card">
          <div className="ep-admissions__kpi-icon ep-admissions__kpi-icon--blue">
            <Users size={22} />
          </div>
          <div>
            <div className="ep-admissions__kpi-val">45</div>
            <div className="ep-admissions__kpi-lbl">Total Pipeline Applicants</div>
          </div>
        </div>

        <div className="ep-admissions__kpi-card">
          <div className="ep-admissions__kpi-icon ep-admissions__kpi-icon--green">
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="ep-admissions__kpi-val">34.8%</div>
            <div className="ep-admissions__kpi-lbl">Conversion Rate</div>
          </div>
        </div>

        <div className="ep-admissions__kpi-card">
          <div className="ep-admissions__kpi-icon ep-admissions__kpi-icon--purple">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="ep-admissions__kpi-val">12</div>
            <div className="ep-admissions__kpi-lbl">Accepted Offers Sent</div>
          </div>
        </div>

        <div className="ep-admissions__kpi-card">
          <div className="ep-admissions__kpi-icon ep-admissions__kpi-icon--amber">
            <Calendar size={22} />
          </div>
          <div>
            <div className="ep-admissions__kpi-val">8</div>
            <div className="ep-admissions__kpi-lbl">Pending Interviews</div>
          </div>
        </div>
      </section>

      {/* 3. Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-surface-50)', padding: '8px 16px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', width: '320px' }}>
        <Search size={16} color="var(--color-text-tertiary)" />
        <input 
          type="text" 
          placeholder="Search applicants by name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--color-text-primary)', width: '100%' }}
        />
      </div>

      {/* 4. Kanban Columns */}
      <div className="ep-admissions__kanban">
        {STAGES.map(stage => (
          <div key={stage} className="ep-admissions__column">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}>{stage}</h3>
              <span className="ep-badge ep-badge--neutral">{candidates.filter(c => c.stage === stage).length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredCandidates.filter(c => c.stage === stage).map(candidate => (
                <div key={candidate.id} className="ep-admissions__card">
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{candidate.name}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12} /> {candidate.grade}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {candidate.date}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={12} /> {candidate.source}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
                    <button 
                      className="ep-btn ep-btn--secondary ep-btn--sm" 
                      onClick={() => moveCandidate(candidate.id, 'prev')}
                      disabled={stage === STAGES[0]}
                      style={{ opacity: stage === STAGES[0] ? 0.4 : 1 }}
                    >
                      &larr; Revert
                    </button>
                    <button 
                      className="ep-btn ep-btn--secondary ep-btn--sm" 
                      onClick={() => moveCandidate(candidate.id, 'next')}
                      disabled={stage === STAGES[STAGES.length - 1]}
                      style={{ opacity: stage === STAGES[STAGES.length - 1] ? 0.4 : 1 }}
                    >
                      Advance &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdmissionsPipeline;
