import React from 'react';
import { Upload, FileText, Video, Link as LinkIcon, Download } from 'lucide-react';

export const ResourcesTab: React.FC = () => {
  const resources = [
    { id: '1', title: 'Course Syllabus', type: 'document', size: '245 KB', date: '2026-07-01' },
    { id: '2', title: 'Chapter 1 Notes', type: 'document', size: '1.2 MB', date: '2026-07-05' },
    { id: '3', title: 'Introduction Lecture', type: 'video', size: '125 MB', date: '2026-07-10' },
    { id: '4', title: 'Desmos Graphing Calculator', type: 'link', size: '-', date: '2026-07-12' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={20} color="var(--color-primary-500)" />;
      case 'link': return <LinkIcon size={20} color="var(--color-success-500)" />;
      default: return <FileText size={20} color="var(--color-warning-500)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Course Materials</h2>
        <button className="ep-btn ep-btn--primary">
          <Upload size={16} /> Upload Resource
        </button>
      </div>

      <div style={{ background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--color-surface-highlight)', borderBottom: '1px solid var(--color-border)' }}>
            <tr>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Name</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Type</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Size</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Date Added</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((res) => (
              <tr key={res.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--color-text-primary)' }}>
                    {getIcon(res.type)} {res.title}
                  </div>
                </td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{res.type}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)' }}>{res.size}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', color: 'var(--color-text-secondary)' }}>{res.date}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                  <button className="ep-btn-icon" style={{ color: 'var(--color-primary-500)' }}><Download size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
