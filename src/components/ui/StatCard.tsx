import React from 'react';
import { Card } from './Card';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  icon,
  color = 'primary',
  className = '',
}) => {
  const classNames = ['ep-stat', `ep-stat--${color}`, className].filter(Boolean).join(' ');

  return (
    <Card className={classNames}>
      <div className="ep-stat__header">
        <h3 className="ep-stat__label">{label}</h3>
        {icon && <div className="ep-stat__icon">{icon}</div>}
      </div>
      <div className="ep-stat__body">
        <div className="ep-stat__value">{value}</div>
        {trend && (
          <div className={`ep-stat__trend ep-stat__trend--${trend.direction}`}>
            {trend.direction === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};
