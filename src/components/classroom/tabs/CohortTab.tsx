import React, { useState } from 'react';
import { Search, Mail, ExternalLink } from 'lucide-react';

export const CohortTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    { id: '1', name: 'Alice Johnson', studentId: 'S1001', attendance: 98, grade: 'A', status: 'Excellent' },
    { id: '2', name: 'Bob Smith', studentId: 'S1002', attendance: 85, grade: 'B', status: 'Good' },
    { id: '3', name: 'Charlie Davis', studentId: 'S1003', attendance: 70, grade: 'C', status: 'At Risk' },
    { id: '4', name: 'Diana Prince', studentId: 'S1004', attendance: 100, grade: 'A', status: 'Excellent' },
    { id: '5', name: 'Edward Norton', studentId: 'S1005', attendance: 92, grade: 'B', status: 'Good' },
  ];

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Class Roster</h2>
        <div className="ep-search-bar" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', background: 'var(--color-surface-elevated)', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', width: '300px' }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--color-text-primary)', width: '100%' }}
          />
        </div>
      </div>

      <div style={{ background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--color-surface-highlight)', borderBottom: '1px solid var(--color-border)' }}>
            <tr>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Student</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>ID</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Attendance</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Current Grade</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <img src={`https://ui-avatars.com/api/?name=${student.name}&background=random`} alt={student.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{student.name}</span>
                  </div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)' }}>{student.studentId}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)' }}>{student.attendance}%</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-primary)', fontWeight: 600 }}>{student.grade}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <span className={`ep-badge ep-badge--${student.status === 'Excellent' ? 'success' : student.status === 'Good' ? 'active' : 'warning'}`}>{student.status}</span>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    <button className="ep-btn-icon" title="Email Student"><Mail size={16} /></button>
                    <button className="ep-btn-icon" title="View Profile"><ExternalLink size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
