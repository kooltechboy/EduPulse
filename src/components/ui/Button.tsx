import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, loading, disabled, children, className = '', ...props }, ref) => {
    const classNames = [
      'ep-btn',
      `ep-btn--${variant}`,
      `ep-btn--${size}`,
      loading ? 'ep-btn--loading' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classNames} disabled={disabled || loading} {...props}>
        {loading && <span className="ep-spinner ep-spinner--sm" aria-hidden="true" />}
        {!loading && icon && <span className="ep-btn__icon">{icon}</span>}
        <span className="ep-btn__text">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
