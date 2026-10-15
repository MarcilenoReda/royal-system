'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import StatusBadge from '@/components/ui/StatusBadge'
import Modal from '@/components/ui/Modal'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

const statusSteps = [
  { key: 'received', label: 'مستلم', icon: 'move_to_inbox' },
  { key: 'inspection', label: 'قيد الفحص', icon: 'search' },
  { key: 'waiting_approval', label: 'بانتظار الموافقة', icon: 'pending_actions' },
  { key: 'approved', label: 'تمت الموافقة', icon: 'check_circle' },
  { key: 'in_repair', label: 'قيد الإصلاح', icon: 'build' },
  { key: 'ready', label: 'جاهز للتسليم', icon: 'verified' },
  { key: 'delivered', label: 'تم التسليم', icon: 'done_all' },
]

const paymentMethods = [
  { value: 'نقدي', label: 'نقدي' },
  { value: 'فودافون كاش', label: 'فودافون كاش' },
  { value: 'إنستاباي', label: 'إنستاباي' },
  { value: 'تحويل بنكي', label: 'تحويل بنكي' },
  { value: 'أخرى', label: 'أخرى' },
]

export default function RepairDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [repair, setRepair] = useState<any>(null)
  const [statusHistory, setStatusHistory] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Inspection modal
  const [showInspectionModal, setShowInspectionModal] = useState(false)
  const [inspectionData, setInspectionData] = useState({
    inspection_result: '',
    repair_cost: '',
    discount: '0',
    expected_delivery_date: '',
  })
  
  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState({
    amount: '',
    payment_method: 'نقدي',
    notes: '',
  })

  // Delivery modal
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [deliveryData, setDeliveryData] = useState({
    delivery_notes: '',
    device_powered: false,
    defect_tested: false,
    basic_functions_tested: false,
    customer_tested: false,
  })

  useEffect(() => {
    fetchRepairDetails()
  }, [params.id])

  async function fetchRepairDetails() {
    try {
      // Fetch repair with customer
      const { data: repairData, error: repairError } = await supabase
        .from('repairs')
        .select(`
          *,
          customers (
            name,
            phone
          )
        `)
        .eq('id', params.id)
        .single()

      if (repairError) throw repairError
      setRepair(repairData)

      // Fetch status history
      const { data: historyData } = await supabase
        .from('repair_status_history')
        .select('*')
        .eq('repair_id', params.id)
        .order('created_at', { ascending: true })

      setStatusHistory(historyData || [])

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('repair_id', params.id)
        .order('created_at', { ascending: false })

      setPayments(paymentsData || [])

      // Fetch photos
      const { data: photosData } = await supabase
        .from('repair_photos')
        .select('*')
        .eq('repair_id', params.id)
        .order('created_at', { ascending: false })

      setPhotos(photosData || [])
    } catch (error) {
      console.error('Error fetching repair details:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleInspectionSubmit() {
    try {
      const { error } = await supabase
        .from('repairs')
        .update({
          inspection_result: inspectionData.inspection_result,
          repair_cost: parseFloat(inspectionData.repair_cost) || 0,
          discount: parseFloat(inspectionData.discount) || 0,
          expected_delivery_date: inspectionData.expected_delivery_date || null,
          status: 'waiting_approval',
        })
        .eq('id', params.id)

      if (error) throw error
      setShowInspectionModal(false)
      fetchRepairDetails()
    } catch (error) {
      console.error('Error submitting inspection:', error)
      alert('حدث خطأ أثناء حفظ الفحص')
    }
  }

  async function handleApproveRepair() {
    try {
      const { error } = await supabase
        .from('repairs')
        .update({ status: 'in_repair' })
        .eq('id', params.id)

      if (error) throw error
      fetchRepairDetails()
    } catch (error) {
      console.error('Error approving repair:', error)
    }
  }

  async function handleRejectRepair() {
    try {
      const { error } = await supabase
        .from('repairs')
        .update({ status: 'rejected' })
        .eq('id', params.id)

      if (error) throw error
      fetchRepairDetails()
    } catch (error) {
      console.error('Error rejecting repair:', error)
    }
  }

  async function handleMarkReady() {
    try {
      const { error } = await supabase
        .from('repairs')
        .update({ status: 'ready' })
        .eq('id', params.id)

      if (error) throw error
      fetchRepairDetails()
    } catch (error) {
      console.error('Error marking as ready:', error)
    }
  }

  async function handlePaymentSubmit() {
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          repair_id: params.id,
          amount: parseFloat(paymentData.amount),
          payment_method: paymentData.payment_method as any,
          notes: paymentData.notes,
        })

      if (error) throw error

      // Update repair paid amount
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0) + parseFloat(paymentData.amount)
      await supabase
        .from('repairs')
        .update({ paid_amount: totalPaid })
        .eq('id', params.id)

      setShowPaymentModal(false)
      setPaymentData({ amount: '', payment_method: 'نقدي', notes: '' })
      fetchRepairDetails()
    } catch (error) {
      console.error('Error submitting payment:', error)
    }
  }

  async function handleDeliverySubmit() {
    try {
      // Upload delivery photo if provided
      // (photo upload logic would go here)

      const { error } = await supabase
        .from('repairs')
        .update({
          status: 'delivered',
          delivered_at: new Date().toISOString(),
          repair_notes: deliveryData.delivery_notes,
        })
        .eq('id', params.id)

      if (error) throw error
      setShowDeliveryModal(false)
      fetchRepairDetails()
    } catch (error) {
      console.error('Error completing delivery:', error)
    }
  }

  function getCurrentStepIndex() {
    return statusSteps.findIndex(step => step.key === repair?.status)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-on-surface-variant">جاري التحميل...</div>
      </div>
    )
  }

  if (!repair) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-on-surface-variant">لم يتم العثور على العملية</div>
      </div>
    )
  }

  const currentStep = getCurrentStepIndex()

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-primary-container/10 text-primary">
            <Icon name="description" />
          </span>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              {repair.repair_number}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              تفاصيل عملية الصيانة
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={repair.status} />
          <Button variant="outline" onClick={() => router.back()}>
            <Icon name="arrow_forward" />
            رجوع
          </Button>
        </div>
      </div>

      {/* Status Stepper */}
      <Card>
        <CardContent className="p-space-lg">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {statusSteps.map((step, index) => {
              const isCompleted = index < currentStep
              const isCurrent = index === currentStep
              const isPending = index > currentStep

              return (
                <div key={step.key} className="flex items-center flex-1 min-w-max">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-tertiary text-on-tertiary'
                          : isCurrent
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-outline-variant'
                      }`}
                    >
                      <Icon name={step.icon} />
                    </div>
                    <span
                      className={`font-label-sm text-label-sm ${
                        isCurrent ? 'text-primary font-bold' : 'text-on-surface-variant'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        isCompleted ? 'bg-tertiary' : 'bg-surface-container-high'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Customer & Device Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="person" className="text-primary" />
              <h2 className="font-bold text-lg">معلومات العميل</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-on-surface-variant">الاسم</p>
                <p className="font-medium">{repair.customers.name}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">رقم الهاتف</p>
                <p className="font-medium" dir="ltr">
                  {repair.customers.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="devices" className="text-primary" />
              <h2 className="font-bold text-lg">معلومات الجهاز</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-on-surface-variant">الجهاز</p>
                <p className="font-medium">{repair.device_model}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">النوع</p>
                <p className="font-medium">{repair.device_type}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">العطل المبلغ عنه</p>
                <p className="font-medium">{repair.customer_problem}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Photos */}
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="photo_library" className="text-primary" />
              <h2 className="font-bold text-lg">صور الجهاز</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo) => {
                const { data } = supabase.storage
                  .from('repair-photos')
                  .getPublicUrl(photo.file_path)
                
                return (
                  <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-surface-container-low">
                    <img
                      src={data.publicUrl}
                      alt={photo.photo_type === 'reception' ? 'صورة الاستلام' : 'صورة التسليم'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 text-center">
                      {photo.photo_type === 'reception' ? 'استلام' : 'تسليم'}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="payments" className="text-primary" />
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                الملخص المالي
              </h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowPaymentModal(true)}>
              <Icon name="add" />
              تسجيل دفعة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
            <div className="p-space-md bg-surface-container-low rounded-lg">
              <p className="font-label-sm text-label-sm text-on-surface-variant">تكلفة الإصلاح</p>
              <p className="font-display-md text-display-md font-bold text-on-surface">
                {formatCurrency(repair.repair_cost || 0)}
              </p>
            </div>
            <div className="p-space-md bg-surface-container-low rounded-lg">
              <p className="font-label-sm text-label-sm text-on-surface-variant">الخصم</p>
              <p className="font-display-md text-display-md font-bold text-error">
                {formatCurrency(repair.discount || 0)}
              </p>
            </div>
            <div className="p-space-md bg-surface-container-low rounded-lg">
              <p className="font-label-sm text-label-sm text-on-surface-variant">الإجمالي</p>
              <p className="font-display-md text-display-md font-bold text-tertiary">
                {formatCurrency(repair.total_amount || 0)}
              </p>
            </div>
            <div className="p-space-md bg-surface-container-low rounded-lg">
              <p className="font-label-sm text-label-sm text-on-surface-variant">المتبقي</p>
              <p className="font-display-md text-display-md font-bold text-primary">
                {formatCurrency(repair.remaining_amount || 0)}
              </p>
            </div>
          </div>
          
          {payments.length > 0 && (
            <div className="mt-space-md">
              <h3 className="font-label-md text-label-md font-semibold text-on-surface mb-2">
                سجل الدفعات
              </h3>
              <div className="space-y-2">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-space-md bg-surface-container-low rounded-lg"
                  >
                    <div>
                      <p className="font-body-md text-body-md text-on-surface">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {payment.payment_method} - {formatDateTime(payment.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons based on status */}
      <Card>
        <CardContent className="p-space-lg">
          <div className="flex flex-wrap gap-space-md">
            {repair.status === 'received' && (
              <Button onClick={() => setShowInspectionModal(true)}>
                <Icon name="search" />
                بدء الفحص
              </Button>
            )}
            {repair.status === 'waiting_approval' && (
              <>
                <Button onClick={handleApproveRepair}>
                  <Icon name="check_circle" />
                  موافقة وبدء الإصلاح
                </Button>
                <Button variant="error" onClick={handleRejectRepair}>
                  <Icon name="cancel" />
                  رفض الإصلاح
                </Button>
              </>
            )}
            {repair.status === 'in_repair' && (
              <Button onClick={handleMarkReady}>
                <Icon name="verified" />
                تم الإصلاح - جاهز للتسليم
              </Button>
            )}
            {repair.status === 'ready' && (
              <Button onClick={() => setShowDeliveryModal(true)}>
                <Icon name="done_all" />
                تسليم الجهاز
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inspection Modal */}
      <Modal
        isOpen={showInspectionModal}
        onClose={() => setShowInspectionModal(false)}
        title="نتائج الفحص وتحديد التكلفة"
      >
        <div className="flex flex-col gap-space-md">
          <Textarea
            label="نتيجة الفحص"
            placeholder="اكتب نتيجة الفحص والعطل المكتشف"
            value={inspectionData.inspection_result}
            onChange={(e) => setInspectionData({ ...inspectionData, inspection_result: e.target.value })}
            rows={3}
          />
          <Input
            label="تكلفة الإصلاح"
            type="number"
            value={inspectionData.repair_cost}
            onChange={(e) => setInspectionData({ ...inspectionData, repair_cost: e.target.value })}
          />
          <Input
            label="الخصم"
            type="number"
            value={inspectionData.discount}
            onChange={(e) => setInspectionData({ ...inspectionData, discount: e.target.value })}
          />
          <Input
            label="موعد التسليم المتوقع"
            type="date"
            value={inspectionData.expected_delivery_date}
            onChange={(e) => setInspectionData({ ...inspectionData, expected_delivery_date: e.target.value })}
          />
          <div className="flex gap-space-md">
            <Button variant="outline" onClick={() => setShowInspectionModal(false)}>
              إلغاء
            </Button>
            <Button onClick={handleInspectionSubmit} className="flex-1">
              حفظ وإرسال للعميل
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="تسجيل دفعة"
      >
        <div className="flex flex-col gap-space-md">
          <Input
            label="المبلغ"
            type="number"
            value={paymentData.amount}
            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
          />
          <Select
            label="طريقة الدفع"
            options={paymentMethods}
            value={paymentData.payment_method}
            onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
          />
          <Textarea
            label="ملاحظات"
            placeholder="أي ملاحظات حول الدفعة"
            value={paymentData.notes}
            onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
            rows={2}
          />
          <div className="flex gap-space-md">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              إلغاء
            </Button>
            <Button onClick={handlePaymentSubmit} className="flex-1">
              حفظ الدفعة
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delivery Modal */}
      <Modal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        title="تسليم الجهاز"
        size="lg"
      >
        <div className="flex flex-col gap-space-md">
          <div className="space-y-2">
            <h3 className="font-label-md text-label-md font-semibold text-on-surface">
              قائمة الاختبار
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deliveryData.device_powered}
                onChange={(e) => setDeliveryData({ ...deliveryData, device_powered: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="font-body-md text-body-md text-on-surface">
                تم تشغيل الجهاز
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deliveryData.defect_tested}
                onChange={(e) => setDeliveryData({ ...deliveryData, defect_tested: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="font-body-md text-body-md text-on-surface">
                تم اختبار العطل
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deliveryData.basic_functions_tested}
                onChange={(e) => setDeliveryData({ ...deliveryData, basic_functions_tested: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="font-body-md text-body-md text-on-surface">
                تم اختبار الوظائف الأساسية
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deliveryData.customer_tested}
                onChange={(e) => setDeliveryData({ ...deliveryData, customer_tested: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="font-body-md text-body-md text-on-surface">
                العميل قام باختبار الجهاز
              </span>
            </label>
          </div>
          <Textarea
            label="ملاحظات التسليم"
            placeholder="أي ملاحظات حول التسليم"
            value={deliveryData.delivery_notes}
            onChange={(e) => setDeliveryData({ ...deliveryData, delivery_notes: e.target.value })}
            rows={2}
          />
          <div className="flex gap-space-md">
            <Button variant="outline" onClick={() => setShowDeliveryModal(false)}>
              إلغاء
            </Button>
            <Button onClick={handleDeliverySubmit} className="flex-1">
              تأكيد التسليم
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
