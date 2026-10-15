import { cn } from '@/lib/utils'
import { forwardRef, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'error'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none'
    
    const variants = {
      primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-md hover:shadow-lg',
      secondary: 'bg-secondary-container text-on-secondary-container hover:bg-secondary',
      tertiary: 'bg-tertiary text-on-tertiary hover:bg-tertiary-container',
      outline: 'bg-surface-container text-on-surface hover:bg-surface-container-high border border-surface-container-high',
      ghost: 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low',
      error: 'bg-error-container text-on-error-container hover:bg-error',
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    }
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
