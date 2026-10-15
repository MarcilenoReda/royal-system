'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
import { Table, TableRow, TableCell } from '@/components/ui/Table'
import { Card, CardContent } from '@/components/ui/Card'
import Skeleton, { StatCardSkeleton } from '@/components/ui/Skeleton'
import type { Database } from '@/lib/supabase'

type Repair = Database['public']['Tables']['repairs']['Row'] & {
  customers: { name: string; phone: string }
}

const SimpleStatCard = React.memo(function SimpleStatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string | number
  icon: string
  color: string
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    teal: 'bg-teal-100 text-teal-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  }

  return (
    <div className="p-3 bg-surface-container-lowest rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon name={icon} className="text-lg sm:text-xl" />
        </span>
        <div className="min-w-0">
          <div className="text-xl sm:text-2xl font-bold text-on-surface truncate">{value}</div>
          <div className="text-xs sm:text-sm text-on-surface-variant truncate">{title}</div>
        </div>
      </div>
    </div>
  )
})

const RepairRow = React.memo(function RepairRow({ 
  repair, 
  onView 
}: { 
  repair: Repair
  onView: (id: string) => void 
}) {
  return (
    <TableRow>
      <TableCell>
        <span className="font-bold text-primary">{repair.repair_number}</span>
      </TableCell>
      <TableCell>
        <div className="font-semibold">{repair.customers.name}</div>
        <div className="text-sm text-on-surface-variant" dir="ltr">
          {repair.customers.phone}
        </div>
      </TableCell>
      <TableCell>
        <div>{repair.device_model}</div>
        <div className="text-sm text-on-surface-variant truncate max-w-xs">
          {repair.customer_problem}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={repair.status as any} />
      </TableCell>
      <TableCell>
        <span className="font-bold">{formatCurrency(repair.total_amount || 0)}</span>
      </TableCell>
      <TableCell>
        <Button variant="primary" size="sm" onClick={() => onView(repair.id)}>
          <Icon name="visibility" />
        </Button>
      </TableCell>
    </TableRow>
  )
})

export default function Dashboard() {
  const router = useRouter()
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [stats, setStats] = useState({
    totalToday: 0,
    inRepair: 0,
    waiting: 0,
    ready: 0,
    deliveredToday: 0,
    totalCollectedToday: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      const today = new Date().toISOString().split('T')[0]

      // Fetch recent repairs with customer data in parallel with stats
      const [repairsResult, allRepairsResult, paymentsResult] = await Promise.all([
        supabase
          .from('repairs')
          .select('*, customers (name, phone)')
          .order('received_at', { ascending: false })
          .limit(5),
        supabase.from('repairs').select('*'),
        supabase
          .from('payments')
          .select('*')
          .gte('created_at', `${today}T00:00:00Z`)
          .lte('created_at', `${today}T23:59:59Z`)
      ])

      if (repairsResult.error) throw repairsResult.error
      setRepairs(repairsResult.data as Repair[])

      if (allRepairsResult.data) {
        const todayRepairs = allRepairsResult.data.filter(r => r.received_at.startsWith(today))
        const deliveredToday = allRepairsResult.data.filter(r => 
          r.delivered_at && r.delivered_at.startsWith(today)
        )

        const totalCollected = paymentsResult.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

        setStats({
          totalToday: todayRepairs.length,
          inRepair: allRepairsResult.data.filter(r => r.status === 'in_repair').length,
          waiting: allRepairsResult.data.filter(r => r.status === 'waiting_approval').length,
          ready: allRepairsResult.data.filter(r => r.status === 'ready').length,
          deliveredToday: deliveredToday.length,
          totalCollectedToday: totalCollected,
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewRepair = (id: string) => {
    router.push(`/repairs/${id}`)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border border-surface-container-highest/20 rounded-lg">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 flex-1" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">الرئيسية</h1>
          <p className="text-on-surface-variant mt-1">
            {formatDate(new Date())}
          </p>
        </div>
        <Button onClick={() => router.push('/reception')}>
          <Icon name="add_circle" />
          استلام جهاز جديد
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <SimpleStatCard
          title="إجمالي اليوم"
          value={stats.totalToday}
          icon="move_to_inbox"
          color="blue"
        />
        <SimpleStatCard
          title="قيد الصيانة"
          value={stats.inRepair}
          icon="build"
          color="orange"
        />
        <SimpleStatCard
          title="في الانتظار"
          value={stats.waiting}
          icon="pending_actions"
          color="purple"
        />
        <SimpleStatCard
          title="جاهز للتسليم"
          value={stats.ready}
          icon="verified"
          color="green"
        />
        <SimpleStatCard
          title="تم التسليم"
          value={stats.deliveredToday}
          icon="done_all"
          color="teal"
        />
        <SimpleStatCard
          title="المحصل اليوم"
          value={formatCurrency(stats.totalCollectedToday)}
          icon="payments"
          color="indigo"
        />
      </div>

      {/* Recent Repairs Table */}
      <Card>
        <CardContent className="p-0">
          <Table
            headers={[
              'رقم العملية',
              'العميل',
              'الجهاز',
              'الحالة',
              'التكلفة',
              'إجراءات',
            ]}
          >
            {repairs.map((repair) => (
              <RepairRow key={repair.id} repair={repair} onView={handleViewRepair} />
            ))}
          </Table>
          
          {repairs.length === 0 && (
            <div className="p-8 text-center text-on-surface-variant">
              <p>لا توجد عمليات صيانة حالياً</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
