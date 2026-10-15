import { cn } from '@/lib/utils'
import { forwardRef, TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="font-label-md text-label-md text-on-surface font-semibold">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full p-3 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none placeholder:text-outline',
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

Textarea.displayName = 'Textarea'

export default Textarea
