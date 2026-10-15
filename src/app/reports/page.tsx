'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#004ac6', '#006242', '#565e74', '#ba1a1a', '#6ffbbe']

export default function ReportsPage() {
  const [view, setView] = useState<'daily' | 'monthly'>('daily')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [stats, setStats] = useState({
    received: 0,
    delivered: 0,
    inRepair: 0,
    waiting: 0,
    rejected: 0,
    totalValue: 0,
    totalCollected: 0,
    totalRemaining: 0,
  })
  const [statusData, setStatusData] = useState<any[]>([])
  const [dailyData, setDailyData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReportData()
  }, [view, selectedDate, selectedMonth])

  async function fetchReportData() {
    setLoading(true)
    try {
      let startDate: string
      let endDate: string

      if (view === 'daily') {
        startDate = selectedDate
        endDate = selectedDate
      } else {
        startDate = `${selectedMonth}-01`
        const lastDay = new Date(selectedMonth + '-01').toISOString().slice(0, 10)
        endDate = lastDay
      }

      // Fetch repairs in date range
      const { data: repairs } = await supabase
        .from('repairs')
        .select('*')
        .gte('received_at', startDate)
        .lte('received_at', endDate + 'T23:59:59')

      if (repairs) {
        const received = repairs.length
        const delivered = repairs.filter(r => r.status === 'delivered').length
        const inRepair = repairs.filter(r => r.status === 'in_repair').length
        const waiting = repairs.filter(r => r.status === 'waiting_approval').length
        const rejected = repairs.filter(r => r.status === 'rejected' || r.status === 'cancelled').length
        const totalValue = repairs.reduce((sum, r) => sum + (r.total_amount || 0), 0)
        
        // Fetch payments in date range
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .gte('created_at', startDate)
          .lte('created_at', endDate + 'T23:59:59')

        const totalCollected = payments?.reduce((sum, p) => sum + p.amount, 0) || 0

        setStats({
          received,
          delivered,
          inRepair,
          waiting,
          rejected,
          totalValue,
          totalCollected,
          totalRemaining: totalValue - totalCollected,
        })

        // Status distribution
        setStatusData([
          { name: 'مستلم', value: repairs.filter(r => r.status === 'received').length },
          { name: 'قيد الفحص', value: repairs.filter(r => r.status === 'inspection').length },
          { name: 'قيد الإصلاح', value: repairs.filter(r => r.status === 'in_repair').length },
          { name: 'جاهز', value: repairs.filter(r => r.status === 'ready').length },
          { name: 'تم التسليم', value: repairs.filter(r => r.status === 'delivered').length },
        ])

        // Daily breakdown for monthly view
        if (view === 'monthly') {
          const dailyMap = new Map()
          repairs.forEach(r => {
            const day = r.received_at.split('T')[0]
            dailyMap.set(day, (dailyMap.get(day) || 0) + 1)
          })
          
          const dailyArray = Array.from(dailyMap, ([date, count]) => ({
            date: formatDate(date),
            count,
          }))
          setDailyData(dailyArray)
        }
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">التقارير</h1>
          <p className="text-on-surface-variant mt-1">
            إحصائيات الورشة وتحليل الأداء
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'daily' ? 'primary' : 'outline'}
            onClick={() => setView('daily')}
          >
            يومي
          </Button>
          <Button
            variant={view === 'monthly' ? 'primary' : 'outline'}
            onClick={() => setView('monthly')}
          >
            شهري
          </Button>
        </div>
      </div>

      {/* Date Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {view === 'daily' ? (
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            ) : (
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-auto"
              />
            )}
            <Button onClick={fetchReportData} disabled={loading}>
              <Icon name="refresh" />
              تحديث
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-on-surface-variant">جاري التحميل...</div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <KPICard
              title="المستلمة"
              value={stats.received}
              icon="move_to_inbox"
              color="blue"
            />
            <KPICard
              title="المسلمة"
              value={stats.delivered}
              icon="done_all"
              color="green"
            />
            <KPICard
              title="قيد الإصلاح"
              value={stats.inRepair}
              icon="build"
              color="orange"
            />
            <KPICard
              title="في الانتظار"
              value={stats.waiting}
              icon="pending_actions"
              color="purple"
            />
            <KPICard
              title="المرفوضة"
              value={stats.rejected}
              icon="cancel"
              color="red"
            />
            <KPICard
              title="إجمالي القيمة"
              value={formatCurrency(stats.totalValue)}
              icon="payments"
              color="indigo"
            />
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardContent className="p-4">
                <h2 className="font-bold text-lg mb-4">
                  الملخص المالي
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-surface-container-low rounded-lg text-center">
                    <p className="text-sm text-on-surface-variant">إجمالي القيمة</p>
                    <p className="text-xl font-bold text-on-surface mt-1">
                      {formatCurrency(stats.totalValue)}
                    </p>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-lg text-center">
                    <p className="text-sm text-on-surface-variant">المحصل</p>
                    <p className="text-xl font-bold text-green-600 mt-1">
                      {formatCurrency(stats.totalCollected)}
                    </p>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-lg text-center">
                    <p className="text-sm text-on-surface-variant">المتبقي</p>
                    <p className="text-xl font-bold text-primary mt-1">
                      {formatCurrency(stats.totalRemaining)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="font-bold text-lg mb-4">
                  توزيع الحالات
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-1">
                  {statusData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-on-surface-variant">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-on-surface">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Chart for Monthly View */}
          {view === 'monthly' && dailyData.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h2 className="font-bold text-lg mb-4">
                  العمليات اليومية
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#004ac6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function KPICard({
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
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  }

  return (
    <div className="p-3 bg-surface-container-lowest rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon name={icon} className="text-lg sm:text-xl" />
        </span>
        <div className="min-w-0">
          <div className="text-xl sm:text-2xl font-bold text-on-surface truncate">
            {value}
          </div>
          <div className="text-xs sm:text-sm text-on-surface-variant truncate">{title}</div>
        </div>
      </div>
    </div>
  )
}
