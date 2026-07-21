import React from 'react';

export interface ProgressBarProps {
  value: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'primary',
  label,
  showPercentage,
  className = '',
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const classNames = ['ep-progress-container', className].filter(Boolean).join(' ');
  const barClassNames = ['ep-progress-bar', `ep-progress-bar--${variant}`].join(' ');

  return (
    <div className={classNames}>
      {(label || showPercentage) && (
        <div className="ep-progress-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          {label && <span className="ep-progress-label">{label}</span>}
          {showPercentage && <span className="ep-progress-percentage">{Math.round(clampedValue)}%</span>}
        </div>
      )}
      <div className="ep-progress-track" style={{ width: '100%', backgroundColor: 'var(--color-surface-300)', borderRadius: 'var(--radius-full)', overflow: 'hidden', height: '0.5rem' }}>
        <div
          className={barClassNames}
          style={{ width: `${clampedValue}%`, height: '100%', backgroundColor: `var(--color-${variant}-500)`, transition: 'width 0.3s ease' }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
