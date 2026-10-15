import { cn } from '@/lib/utils'
import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="font-label-md text-label-md text-on-surface font-semibold">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'h-11 px-3 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-outline',
            error && 'ring-2 ring-error',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-error text-sm">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
