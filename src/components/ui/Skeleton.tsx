import React from 'react';

export interface SkeletonProps {
  variant: 'text' | 'title' | 'avatar' | 'card' | 'custom';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant,
  width,
  height,
  className = '',
}) => {
  const classNames = ['ep-skeleton', `ep-skeleton--${variant}`, className].filter(Boolean).join(' ');

  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  return <div className={classNames} style={style} aria-hidden="true" />;
};
