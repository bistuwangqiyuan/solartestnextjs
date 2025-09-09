import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card } from './card'

interface DataDisplayProps {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  className?: string
  valueClassName?: string
}

export function DataDisplay({
  label,
  value,
  unit,
  trend,
  className,
  valueClassName,
}: DataDisplayProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    stable: 'text-gray-400',
  }

  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→',
  }

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex flex-col space-y-2">
        <span className="data-label">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className={cn('data-value', valueClassName)}>{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          {trend && (
            <span className={cn('text-lg', trendColors[trend])}>
              {trendIcons[trend]}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-industrial-accent">{value}</h3>
            {trend && (
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="h-12 w-12 rounded-full bg-industrial-accent/10 flex items-center justify-center text-industrial-accent">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}