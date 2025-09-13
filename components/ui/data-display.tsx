import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export function DataDisplay({
  label,
  value,
  unit,
  icon,
  trend,
  className,
}: DataDisplayProps) {
  return (
    <div className={cn('data-display', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        {icon && (
          <div className="text-[var(--text-muted)]">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="data-value">{value}</span>
        {unit && <span className="data-unit">{unit}</span>}
      </div>
      
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend === 'up' && (
            <>
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-500">上升</span>
            </>
          )}
          {trend === 'down' && (
            <>
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-xs text-red-500">下降</span>
            </>
          )}
          {trend === 'stable' && (
            <>
              <Minus className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">稳定</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}