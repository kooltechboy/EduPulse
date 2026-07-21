import React, { forwardRef } from 'react';

// ── Card ──────────────────────────────────────────────────────────────────

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'flush';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const classNames = ['ep-card', `ep-card--${variant}`, className]
      .filter(Boolean)
      .join(' ');
    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// ── CardHeader ────────────────────────────────────────────────────────────

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`ep-card__header ${className}`.trim()} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

// ── CardTitle ─────────────────────────────────────────────────────────────

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', children, ...props }, ref) => (
    <h3 ref={ref} className={`ep-card__title ${className}`.trim()} {...props}>
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

// ── CardContent ───────────────────────────────────────────────────────────

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`ep-card__content ${className}`.trim()} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

// ── CardFooter ────────────────────────────────────────────────────────────

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`ep-card__footer ${className}`.trim()} {...props}>
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';
