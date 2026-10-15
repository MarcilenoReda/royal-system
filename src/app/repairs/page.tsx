'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import StatusBadge from '@/components/ui/StatusBadge'
import { Table, TableRow, TableCell } from '@/components/ui/Table'
import { Card, CardContent } from '@/components/ui/Card'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { useRouter } from 'next/navigation'

type Repair = {
  id: string
  repair_number: string
  device_type: string
  device_model: string
  customer_problem: string
  status: string
  total_amount: number
  received_at: string
  expected_delivery_date: string | null
  customers: {
    name: string
    phone: string
  }
}

const statusOptions = [
  { value: '', label: 'جميع الحالات' },
  { value: 'received', label: 'مستلم' },
  { value: 'inspection', label: 'قيد الفحص' },
  { value: 'waiting_approval', label: 'بانتظار الموافقة' },
  { value: 'approved', label: 'تمت الموافقة' },
  { value: 'in_repair', label: 'قيد الإصلاح' },
  { value: 'ready', label: 'جاهز للتسليم' },
  { value: 'delivered', label: 'تم التسليم' },
  { value: 'rejected', label: 'مرفوض' },
  { value: 'cancelled', label: 'ملغي' },
]

const RepairRow = React.memo(function RepairRow({ 
  repair, 
  onView 
}: { 
  repair: Repair
  onView: (id: string) => void 
}) {
  return (
    <TableRow onClick={() => onView(repair.id)}>
      <TableCell>
        <span className="font-label-md text-label-md font-bold text-primary">
          {repair.repair_number}
        </span>
      </TableCell>
      <TableCell>
        <div className="font-label-md text-label-md font-semibold text-on-surface">
          {repair.customers.name}
        </div>
        <div className="font-body-sm text-body-sm text-on-surface-variant" dir="ltr">
          {repair.customers.phone}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-label-md text-label-md text-on-surface">
          {repair.device_model}
        </div>
        <div className="font-body-sm text-body-sm text-on-surface-variant">
          {repair.device_type}
        </div>
      </TableCell>
      <TableCell>
        <div className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-xs">
          {repair.customer_problem}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={repair.status as any} />
      </TableCell>
      <TableCell>
        <span className="font-label-md text-label-md font-bold text-on-surface">
          {formatCurrency(repair.total_amount || 0)}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-body-sm text-body-sm text-on-surface">
          {formatDate(repair.received_at)}
        </span>
      </TableCell>
      <TableCell>
        {repair.expected_delivery_date ? (
          <span className="font-body-sm text-body-sm text-on-surface">
            {formatDate(repair.expected_delivery_date)}
          </span>
        ) : (
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            غير محدد
          </span>
        )}
      </TableCell>
      <TableCell>
        <Button variant="primary" size="sm" onClick={(e) => {
          e.stopPropagation()
          onView(repair.id)
        }}>
          <Icon name="visibility" />
        </Button>
      </TableCell>
    </TableRow>
  )
})

export default function RepairsPage() {
  const router = useRouter()
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredRepairs = useMemo(() => {
    let filtered = repairs

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(r =>
        r.repair_number.toLowerCase().includes(term) ||
        r.customers.name.toLowerCase().includes(term) ||
        r.customers.phone.includes(term) ||
        r.device_model.toLowerCase().includes(term)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(r => r.status === statusFilter)
    }

    return filtered
  }, [repairs, searchTerm, statusFilter])

  useEffect(() => {
    fetchRepairs()
  }, [])

  async function fetchRepairs() {
    try {
      const { data, error } = await supabase
        .from('repairs')
        .select(`
          *,
          customers (
            name,
            phone
          )
        `)
        .order('received_at', { ascending: false })

      if (error) throw error
      setRepairs(data as Repair[])
    } catch (error) {
      console.error('Error fetching repairs:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleViewRepair(id: string) {
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

        {/* Filters Skeleton */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card>
          <CardContent className="p-4">
            <TableSkeleton rows={5} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-primary-container/10 text-primary">
            <Icon name="build" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">الأجهزة والصيانة</h1>
            <p className="text-on-surface-variant mt-1">
              عرض جميع عمليات الصيانة ومتابعة حالتها
            </p>
          </div>
        </div>
        <Button onClick={() => router.push('/reception')}>
          <Icon name="add_circle" />
          استلام جهاز جديد
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Input
                placeholder="بحث برقم العملية، العميل، الهاتف، أو الجهاز"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                <Icon name="search" />
              </span>
            </div>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Icon name="info" />
              <span className="text-sm">
                إجمالي {filteredRepairs.length} عملية
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repairs Table */}
      <Card>
        <CardContent className="p-0">
          <Table
            headers={[
              'رقم العملية',
              'العميل',
              'الجهاز',
              'العطل',
              'الحالة',
              'التكلفة',
              'تاريخ الاستلام',
              'الموعد المتوقع',
              'إجراءات',
            ]}
          >
            {filteredRepairs.map((repair) => (
              <RepairRow key={repair.id} repair={repair} onView={handleViewRepair} />
            ))}
          </Table>
          
          {filteredRepairs.length === 0 && (
            <div className="p-8 text-center text-on-surface-variant">
              <Icon name="search_off" className="text-4xl mb-2" />
              <p>لا توجد عمليات مطابقة</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
