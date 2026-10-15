import { cn } from '@/lib/utils'

interface IconProps {
  name: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
}

export default function Icon({ name, className, size = 'md' }: IconProps) {
  return (
    <span className={cn('material-symbols-outlined', sizeClasses[size], className)}>
      {name}
    </span>
  )
}
