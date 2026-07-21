import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  avgGrade: number | null;
}

export const AssessmentTab: React.FC = () => {
  const assignments: Assignment[] = [
    { id: '1', title: 'Linear Algebra Quiz 1', type: 'Quiz', dueDate: '2026-07-25', submissions: 24, totalStudents: 24, avgGrade: 85 },
    { id: '2', title: 'Calculus Midterm', type: 'Exam', dueDate: '2026-08-10', submissions: 22, totalStudents: 24, avgGrade: null },
    { id: '3', title: 'Homework 3: Derivatives', type: 'Homework', dueDate: '2026-07-30', submissions: 15, totalStudents: 24, avgGrade: null },
  ];

  return (
    <div className="ep-assessments" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Assignments</h2>
        <button className="ep-btn ep-btn--primary">
          <Plus size={16} /> Create Assignment
        </button>
      </div>

      <div style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
        {assignments.map(ass => (
          <div key={ass.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-surface-elevated)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
              <div style={{ background: 'var(--color-primary-100)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary-600)' }}>
                <FileText size={24} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 var(--spacing-1) 0', color: 'var(--color-text-primary)' }}>{ass.title}</h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  <span className="ep-badge ep-badge--archived">{ass.type}</span>
                  <span>Due: {ass.dueDate}</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {ass.submissions}/{ass.totalStudents}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Submissions</div>
              </div>
              <div style={{ textAlign: 'center', minWidth: '80px' }}>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {ass.avgGrade ? `${ass.avgGrade}%` : '-'}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Avg Grade</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
