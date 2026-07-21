import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', dot, className = '', children, ...props }) => {
  const classNames = [
    'ep-badge',
    `ep-badge--${variant}`,
    dot ? 'ep-badge--with-dot' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} {...props}>
      {dot && <span className="ep-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
};
