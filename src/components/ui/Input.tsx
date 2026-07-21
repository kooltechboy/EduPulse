import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, type = 'text', className = '', id, required, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const classNames = [
      'ep-input',
      error ? 'ep-input--error' : '',
      icon ? 'ep-input--with-icon' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className="ep-input-group">
        {label && (
          <label htmlFor={inputId} className="ep-label">
            {label} {required && <span className="ep-label__required">*</span>}
          </label>
        )}
        <div className="ep-input-wrapper">
          {icon && <span className="ep-input__icon">{icon}</span>}
          <input 
            ref={ref} 
            id={inputId} 
            type={type} 
            className={classNames} 
            required={required} 
            aria-invalid={!!error} 
            {...props} 
          />
        </div>
        {error && <span className="ep-input__error-msg" role="alert">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
