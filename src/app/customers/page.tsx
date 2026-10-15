'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import StatusBadge from '@/components/ui/StatusBadge'
import { Table, TableRow, TableCell } from '@/components/ui/Table'
import { Card, CardContent } from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Skeleton, { StatCardSkeleton, TableSkeleton } from '@/components/ui/Skeleton'
import { useRouter } from 'next/navigation'

type Customer = {
  id: string
  name: string
  phone: string
  created_at: string
}

type CustomerWithStats = Customer & {
  total_repairs: number
  delivered_repairs: number
  total_spent: number
}

const StatCard = React.memo(function StatCard({
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
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-lg shadow-sm">
      <span className={`p-2.5 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
        <Icon name={icon} className="text-xl" />
      </span>
      <div className="min-w-0">
        <div className="text-xl sm:text-2xl font-bold text-on-surface truncate">
          {value}
        </div>
        <div className="text-sm text-on-surface-variant truncate">{title}</div>
      </div>
    </div>
  )
})

const CustomerRow = React.memo(function CustomerRow({ 
  customer, 
  onView 
}: { 
  customer: CustomerWithStats
  onView: (customer: CustomerWithStats) => void 
}) {
  return (
    <TableRow onClick={() => onView(customer)}>
      <TableCell>
        <div className="font-semibold text-on-surface">
          {customer.name}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-on-surface" dir="ltr">
          {customer.phone}
        </div>
      </TableCell>
      <TableCell>
        <span className="font-bold text-primary">
          {customer.total_repairs}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-bold text-green-600">
          {customer.delivered_repairs}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-bold text-on-surface">
          {formatCurrency(customer.total_spent)}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-sm text-on-surface-variant">
          {formatDate(customer.created_at)}
        </span>
      </TableCell>
      <TableCell>
        <Button variant="primary" size="sm" onClick={(e) => {
          e.stopPropagation()
          onView(customer)
        }}>
          <Icon name="visibility" />
        </Button>
      </TableCell>
    </TableRow>
  )
})

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<CustomerWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithStats | null>(null)
  const [customerRepairs, setCustomerRepairs] = useState<any[]>([])
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) {
      return customers
    }

    const term = searchTerm.toLowerCase().trim()
    return customers.filter(c => {
      const nameMatch = c.name.toLowerCase().includes(term)
      const phoneMatch = c.phone.includes(term)
      const arabicNameMatch = c.name.includes(searchTerm)
      return nameMatch || phoneMatch || arabicNameMatch
    })
  }, [customers, searchTerm])

  const stats = useMemo(() => ({
    totalCustomers: customers.length,
    totalRepairs: customers.reduce((sum, c) => sum + c.total_repairs, 0),
    activeCustomers: customers.filter(c => c.total_repairs > 0).length,
    totalRevenue: customers.reduce((sum, c) => sum + c.total_spent, 0),
  }), [customers])

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    try {
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (customersError) throw customersError

      // Fetch stats for each customer
      const customersWithStats = await Promise.all(
        (customersData as Customer[]).map(async (customer) => {
          const { data: repairs } = await supabase
            .from('repairs')
            .select('status, total_amount')
            .eq('customer_id', customer.id)

          const totalRepairs = repairs?.length || 0
          const deliveredRepairs = repairs?.filter(r => r.status === 'delivered').length || 0
          const totalSpent = repairs?.reduce((sum, r) => sum + (r.total_amount || 0), 0) || 0

          return {
            ...customer,
            total_repairs: totalRepairs,
            delivered_repairs: deliveredRepairs,
            total_spent: totalSpent,
          }
        })
      )

      setCustomers(customersWithStats)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleViewCustomer(customer: CustomerWithStats) {
    setSelectedCustomer(customer)
    
    try {
      const { data: repairsData } = await supabase
        .from('repairs')
        .select('*')
        .eq('customer_id', customer.id)
        .order('received_at', { ascending: false })

      setCustomerRepairs(repairsData || [])
      setShowDetailsModal(true)
    } catch (error) {
      console.error('Error fetching customer repairs:', error)
    }
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Search Skeleton */}
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-10 w-full" />
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
        <div>
          <h1 className="text-2xl font-bold text-on-surface">العملاء</h1>
          <p className="text-on-surface-variant mt-1">
            إدارة العملاء وسجل الصيانة لكل عميل
          </p>
        </div>
        <Button onClick={() => router.push('/reception')}>
          <Icon name="add_circle" />
          إضافة عميل جديد
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي العملاء"
          value={stats.totalCustomers}
          icon="groups"
          color="blue"
        />
        <StatCard
          title="إجمالي العمليات"
          value={stats.totalRepairs}
          icon="build"
          color="orange"
        />
        <StatCard
          title="العملاء النشطين"
          value={stats.activeCustomers}
          icon="person_check"
          color="green"
        />
        <StatCard
          title="إجمالي الإيرادات"
          value={formatCurrency(stats.totalRevenue)}
          icon="payments"
          color="purple"
        />
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Input
              placeholder="بحث بالاسم أو رقم الهاتف"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
              <Icon name="search" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <Table
            headers={[
              'الاسم',
              'رقم الهاتف',
              'عدد العمليات',
              'المسلم',
              'إجمالي الإنفاق',
              'تاريخ التسجيل',
              'إجراءات',
            ]}
          >
            {filteredCustomers.map((customer) => (
              <CustomerRow key={customer.id} customer={customer} onView={handleViewCustomer} />
            ))}
          </Table>
          
          {filteredCustomers.length === 0 && (
            <div className="p-8 text-center text-on-surface-variant">
              <Icon name="search_off" className="text-4xl mb-2" />
              <p>لا يوجد عملاء مطابقين</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="ملف العميل"
        size="lg"
      >
        {selectedCustomer && (
          <div className="flex flex-col gap-6">
            {/* Customer Info */}
            <div className="p-4 bg-surface-container-low rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-on-surface-variant">الاسم</p>
                  <p className="font-medium text-on-surface">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">رقم الهاتف</p>
                  <p className="font-medium text-on-surface" dir="ltr">
                    {selectedCustomer.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">عدد العمليات</p>
                  <p className="font-medium text-on-surface">{selectedCustomer.total_repairs}</p>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">إجمالي الإنفاق</p>
                  <p className="font-medium text-on-surface">
                    {formatCurrency(selectedCustomer.total_spent)}
                  </p>
                </div>
              </div>
            </div>

            {/* Repair History */}
            <div>
              <h3 className="font-semibold text-on-surface mb-3">
                سجل الصيانة ({customerRepairs.length})
              </h3>
              {customerRepairs.length > 0 ? (
                <div className="space-y-2">
                  {customerRepairs.map((repair) => (
                    <div
                      key={repair.id}
                      className="p-4 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container-highest/20 transition-colors"
                      onClick={() => {
                        setShowDetailsModal(false)
                        router.push(`/repairs/${repair.id}`)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">
                            {repair.repair_number}
                          </span>
                          <span className="text-on-surface">
                            {repair.device_model}
                          </span>
                        </div>
                        <StatusBadge status={repair.status} />
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-on-surface-variant">
                          {formatDate(repair.received_at)}
                        </span>
                        <span className="text-on-surface">
                          {formatCurrency(repair.total_amount || 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-on-surface-variant">
                  <p>لا يوجد سجل صيانة لهذا العميل</p>
                </div>
              )}
            </div>

            <Button onClick={() => {
              setShowDetailsModal(false)
              router.push('/reception')
            }}>
              <Icon name="add_circle" />
              استلام جهاز جديد لهذا العميل
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
