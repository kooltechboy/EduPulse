import React from 'react';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  const classNames = ['ep-empty', className].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <div className="ep-empty__icon">{icon}</div>
      <h3 className="ep-empty__title">{title}</h3>
      {description && <p className="ep-empty__description">{description}</p>}
      {action && <div className="ep-empty__action">{action}</div>}
    </div>
  );
};
