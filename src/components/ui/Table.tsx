import { cn } from '@/lib/utils'

interface TableProps {
  headers: string[]
  children: React.ReactNode
  className?: string
}

export function Table({ headers, children, className }: TableProps) {
  return (
    <div className={cn('overflow-x-auto w-full', className)}>
      <table className="w-full text-right">
        <thead>
          <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm border-b border-surface-container-high">
            {headers.map((header, index) => (
              <th key={index} className="py-3.5 px-4 font-bold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container-high">{children}</tbody>
      </table>
    </div>
  )
}

interface TableRowProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function TableRow({ children, className, onClick }: TableRowProps) {
  return (
    <tr
      className={cn(
        'hover:bg-surface-container-low/60 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={cn('py-3.5 px-4', className)}>{children}</td>
  )
}
