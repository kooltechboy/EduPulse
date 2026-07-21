import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '', ...props }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getBackgroundColor = (name: string) => {
    const colors = [
      'var(--color-primary-500)',
      'var(--color-success-500)',
      'var(--color-warning-500)',
      'var(--color-danger-500)',
    ];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const classNames = ['ep-avatar', `ep-avatar--${size}`, className].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      style={!src ? { backgroundColor: getBackgroundColor(name) } : undefined}
      title={name}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} className="ep-avatar__image" />
      ) : (
        <span className="ep-avatar__initials">{getInitials(name)}</span>
      )}
    </div>
  );
};
