import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, className = '', id, required, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const classNames = [
      'ep-input',
      'ep-select',
      error ? 'ep-input--error' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className="ep-input-group">
        {label && (
          <label htmlFor={selectId} className="ep-label">
            {label} {required && <span className="ep-label__required">*</span>}
          </label>
        )}
        <div className="ep-select-wrapper">
          <select
            ref={ref}
            id={selectId}
            className={classNames}
            required={required}
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && <span className="ep-input__error-msg" role="alert">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
