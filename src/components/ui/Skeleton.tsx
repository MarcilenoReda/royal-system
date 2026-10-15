export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-surface-container-highest/50 rounded ${className}`}
    />
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border border-surface-container-highest/20 rounded-lg">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 flex-1" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-lg">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}
