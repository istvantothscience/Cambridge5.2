import React from 'react';
import { Sprout } from 'lucide-react';

interface PointBadgeProps {
  points: number;
  lessonPoints?: number;
  showBreakdown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animateOnChange?: boolean;
}

export const PointBadge: React.FC<PointBadgeProps> = ({
  points,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs gap-1.5',
    md: 'px-3 py-1 text-xs gap-2',
    lg: 'px-3.5 py-1.5 text-sm gap-2',
  };

  return (
    <div
      className={`inline-flex items-center font-medium rounded-full border bg-emerald-50 border-emerald-300 text-emerald-900 ${
        sizeClasses[size]
      } ${className}`}
      title={`Pontszám: ${points} / 5`}
    >
      <Sprout size={14} className="text-emerald-700" />
      <span className="font-bold text-emerald-950 font-mono">
        {points}
      </span>
      <span className="text-emerald-700 text-[11px] font-medium">
        / 5 pont
      </span>
    </div>
  );
};
