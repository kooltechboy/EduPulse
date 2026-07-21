import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, Circle } from 'lucide-react';

export const CurriculumTab: React.FC = () => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['1']));

  const modules = [
    {
      id: '1',
      title: 'Module 1: Linear Algebra Foundations',
      duration: '2 Weeks',
      status: 'completed',
      items: [
        { id: '1.1', title: 'Vectors and Matrices', type: 'lesson', status: 'completed' },
        { id: '1.2', title: 'Matrix Multiplication', type: 'lesson', status: 'completed' },
        { id: '1.3', title: 'Module 1 Quiz', type: 'quiz', status: 'completed' },
      ]
    },
    {
      id: '2',
      title: 'Module 2: Calculus Basics',
      duration: '3 Weeks',
      status: 'in-progress',
      items: [
        { id: '2.1', title: 'Limits and Continuity', type: 'lesson', status: 'completed' },
        { id: '2.2', title: 'Derivatives', type: 'lesson', status: 'in-progress' },
        { id: '2.3', title: 'Applications of Derivatives', type: 'lesson', status: 'upcoming' },
      ]
    },
    {
      id: '3',
      title: 'Module 3: Integration',
      duration: '3 Weeks',
      status: 'upcoming',
      items: [
        { id: '3.1', title: 'Antiderivatives', type: 'lesson', status: 'upcoming' },
        { id: '3.2', title: 'Definite Integrals', type: 'lesson', status: 'upcoming' },
      ]
    }
  ];

  const toggleModule = (id: string) => {
    const next = new Set(expandedModules);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedModules(next);
  };

  return (
    <div className="ep-curriculum" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      {modules.map(mod => (
        <div key={mod.id} style={{ background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div 
            onClick={() => toggleModule(mod.id)}
            style={{ padding: 'var(--spacing-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'var(--color-surface-highlight)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              {expandedModules.has(mod.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)' }}>{mod.title}</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{mod.duration}</span>
              <span className={`ep-badge ep-badge--${mod.status === 'completed' ? 'success' : mod.status === 'in-progress' ? 'warning' : 'archived'}`}>
                {mod.status}
              </span>
            </div>
          </div>
          
          {expandedModules.has(mod.id) && (
            <div style={{ padding: 'var(--spacing-2) var(--spacing-4)' }}>
              {mod.items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3) 0', borderBottom: '1px solid var(--color-border)' }}>
                  {item.status === 'completed' ? <CheckCircle size={18} color="var(--color-success-500)" /> : <Circle size={18} color="var(--color-text-secondary)" />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{item.title}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{item.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
