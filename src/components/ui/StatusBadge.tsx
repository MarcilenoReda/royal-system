import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'received' | 'inspection' | 'waiting_approval' | 'approved' | 'in_repair' | 'ready' | 'delivered' | 'rejected' | 'cancelled'
}

const statusConfig = {
  received: {
    label: 'مستلم',
    color: 'bg-primary/10 text-primary',
    dotColor: 'bg-primary',
  },
  inspection: {
    label: 'قيد الفحص',
    color: 'bg-primary-container/15 text-primary-container',
    dotColor: 'bg-primary-container',
  },
  waiting_approval: {
    label: 'بانتظار الموافقة',
    color: 'bg-secondary-container text-on-secondary-container',
    dotColor: 'bg-secondary',
  },
  approved: {
    label: 'تمت الموافقة',
    color: 'bg-primary-fixed/70 text-on-primary-fixed-variant',
    dotColor: 'bg-primary-fixed-variant',
  },
  in_repair: {
    label: 'قيد الإصلاح',
    color: 'bg-primary-fixed/70 text-on-primary-fixed-variant',
    dotColor: 'bg-primary-fixed-variant',
  },
  ready: {
    label: 'جاهز للتسليم',
    color: 'bg-tertiary-container/15 text-tertiary',
    dotColor: 'bg-tertiary-container',
  },
  delivered: {
    label: 'تم التسليم',
    color: 'bg-tertiary/15 text-tertiary',
    dotColor: 'bg-tertiary',
  },
  rejected: {
    label: 'مرفوض',
    color: 'bg-error-container text-on-error-container',
    dotColor: 'bg-error',
  },
  cancelled: {
    label: 'ملغي',
    color: 'bg-surface-container-high text-on-surface-variant',
    dotColor: 'bg-outline',
  },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <span className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold', config.color)}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.dotColor }} />
      {config.label}
    </span>
  )
}
