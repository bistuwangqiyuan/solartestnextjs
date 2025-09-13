import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'industrial-button',
          variant === 'primary' && 'primary',
          variant === 'danger' && 'bg-red-500 border-red-500 hover:bg-red-600',
          size === 'sm' && 'px-3 py-1 text-sm',
          size === 'lg' && 'px-6 py-3 text-lg',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';