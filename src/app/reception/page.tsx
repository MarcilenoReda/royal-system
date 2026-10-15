'use client'

import { useState, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/Card'

const deviceTypes = [
  { value: 'phone', label: 'موبايل' },
  { value: 'Pod', label: 'بود' },
  { value: 'Mod', label: 'مود' },
  { value: 'other', label: 'أخرى' },
]

export default function ReceptionPage() {
  const router = useRouter()
  const [searchPhone, setSearchPhone] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [searching, setSearching] = useState(false)
  const [useExistingCustomer, setUseExistingCustomer] = useState(false)
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deviceType: '',
    deviceModel: '',
    customerProblem: '',
    inspectionNotes: '',
    accessories: '',
    photo: null as File | null,
  })

  const [showCamera, setShowCamera] = useState(false)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isFormValid = useMemo(() => {
    return formData.customerName && 
           formData.customerPhone && 
           formData.deviceType && 
           formData.deviceModel && 
           formData.customerProblem
  }, [formData])

  const handleSearchCustomer = useCallback(async () => {
    if (!searchPhone) return
    
    setSearching(true)
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', searchPhone)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          setSearchResult(null)
          setUseExistingCustomer(false)
        } else {
          throw error
        }
      } else {
        setSearchResult(data)
        setUseExistingCustomer(true)
        setFormData(prev => ({
          ...prev,
          customerName: data.name,
          customerPhone: data.phone,
        }))
      }
    } catch (error) {
      console.error('Error searching customer:', error)
    } finally {
      setSearching(false)
    }
  }, [searchPhone])

  const handleCreateNewCustomer = useCallback(() => {
    setUseExistingCustomer(false)
    setSearchResult(null)
    setFormData(prev => ({
      ...prev,
      customerName: '',
      customerPhone: searchPhone,
    }))
  }, [searchPhone])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setVideoStream(stream)
      setShowCamera(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('تعذر الوصول للكاميرا')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop())
      setVideoStream(null)
    }
    setShowCamera(false)
  }, [videoStream])

  const capturePhoto = useCallback(() => {
    const video = document.getElementById('camera-video') as HTMLVideoElement
    if (video) {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg')
        setCapturedImage(imageData)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
            setFormData(prev => ({ ...prev, photo: file }))
          }
        }, 'image/jpeg')
      }
    }
    stopCamera()
  }, [stopCamera])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }))
      setCapturedImage(null)
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const newErrors: Record<string, string> = {}
      if (!formData.customerName) newErrors.customerName = 'اسم العميل مطلوب'
      if (!formData.customerPhone) newErrors.customerPhone = 'رقم الهاتف مطلوب'
      if (!formData.deviceType) newErrors.deviceType = 'نوع الجهاز مطلوب'
      if (!formData.deviceModel) newErrors.deviceModel = 'الموديل مطلوب'
      if (!formData.customerProblem) newErrors.customerProblem = 'وصف العطل مطلوب'
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        setLoading(false)
        return
      }

      // Customer handling
      let customerId: string
      if (useExistingCustomer && searchResult) {
        customerId = searchResult.id
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({ name: formData.customerName, phone: formData.customerPhone })
          .select()
          .single()

        if (customerError) throw customerError
        customerId = newCustomer.id
      }

      // Create repair
      const { data: repair, error: repairError } = await supabase
        .from('repairs')
        .insert({
          customer_id: customerId,
          device_type: formData.deviceType,
          device_model: formData.deviceModel,
          customer_problem: formData.customerProblem,
          inspection_result: formData.inspectionNotes,
          status: 'received',
        })
        .select()
        .single()

      if (repairError) throw repairError

      // Photo upload
      if (formData.photo) {
        try {
          const fileName = `${repair.id}-${Date.now()}`
          const { error: uploadError } = await supabase.storage
            .from('repair-photos')
            .upload(fileName, formData.photo)

          if (uploadError) {
            console.error('Photo upload error:', uploadError)
          } else {
            await supabase.from('repair_photos').insert({
              repair_id: repair.id,
              photo_url: fileName,
              photo_type: 'reception',
            })
          }
        } catch (photoError) {
          console.error('Photo upload failed:', photoError)
        }
      }

      // Create status history
      await supabase.from('repair_status_history').insert({
        repair_id: repair.id,
        status: 'received',
        notes: 'استلام الجهاز',
      })

      router.push(`/repairs/${repair.id}`)
    } catch (error) {
      console.error('Error submitting repair:', error)
      setErrors({ submit: 'حدث خطأ أثناء حفظ البيانات' })
    } finally {
      setLoading(false)
    }
  }, [formData, useExistingCustomer, searchResult, router])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="p-2 rounded-lg bg-primary-container/10 text-primary">
          <Icon name="add_circle" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">استلام جهاز جديد</h1>
          <p className="text-on-surface-variant mt-1">
            تسجيل جهاز جديد في الورشة وإنشاء بطاقة صيانة
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Customer Search */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-on-surface mb-4">
              البحث عن العميل
            </h2>
            <div className="flex gap-4">
              <Input
                placeholder="أدخل رقم الهاتف للبحث"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={handleSearchCustomer} disabled={searching}>
                <Icon name="search" />
                {searching ? 'جاري البحث...' : 'بحث'}
              </Button>
            </div>
            
            {searchResult && (
              <div className="mt-4 p-4 bg-surface-container-low rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-on-surface">
                      {searchResult.name}
                    </p>
                    <p className="text-sm text-on-surface-variant" dir="ltr">
                      {searchResult.phone}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCreateNewCustomer}>
                    <Icon name="person_add" />
                    عميل جديد
                  </Button>
                </div>
              </div>
            )}
            
            {!searchResult && searchPhone && !searching && (
              <div className="mt-4 p-4 bg-surface-container-low rounded-lg">
                <p className="text-sm text-on-surface-variant">
                  لم يتم العثور على عميل بهذا الرقم. سيتم إنشاء عميل جديد.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-on-surface mb-4">
              معلومات العميل
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="اسم العميل"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                error={errors.customerName}
                disabled={useExistingCustomer}
              />
              <Input
                label="رقم الهاتف"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                error={errors.customerPhone}
                disabled={useExistingCustomer}
                dir="ltr"
              />
            </div>
          </CardContent>
        </Card>

        {/* Device Information */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-on-surface mb-4">
              معلومات الجهاز
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="نوع الجهاز"
                options={deviceTypes}
                value={formData.deviceType}
                onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                error={errors.deviceType}
              />
              <Input
                label="الموديل"
                placeholder="مثال: iPhone 13 Pro"
                value={formData.deviceModel}
                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                error={errors.deviceModel}
              />
            </div>
            <div className="mt-4">
              <Textarea
                label="وصف العطل"
                placeholder="اكتب المشكلة التي يشتكي منها العميل"
                value={formData.customerProblem}
                onChange={(e) => setFormData({ ...formData, customerProblem: e.target.value })}
                error={errors.customerProblem}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Inspection Notes */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-on-surface mb-4">
              ملاحظات الفحص الأولي
            </h2>
            <Textarea
              placeholder="أي ملاحظات حول الحالة العامة للجهاز، الخدوش، الأضرار الظاهرة..."
              value={formData.inspectionNotes}
              onChange={(e) => setFormData({ ...formData, inspectionNotes: e.target.value })}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Accessories */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-on-surface mb-4">
              الملحقات المستلمة
            </h2>
            <Textarea
              placeholder="اكتب الملحقات المستلمة مع الجهاز (الشاحن، السماعات، الغلاف...)"
              value={formData.accessories}
              onChange={(e) => setFormData({ ...formData, accessories: e.target.value })}
              rows={2}
            />
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-bold text-lg mb-4">
              صورة الجهاز (اختياري)
            </h2>
            
            {/* Camera Modal */}
            {showCamera && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-surface-container-lowest rounded-lg overflow-hidden max-w-lg w-full">
                  <div className="relative">
                    <video
                      id="camera-video"
                      autoPlay
                      playsInline
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                      <Button onClick={capturePhoto} variant="primary">
                        <Icon name="camera_alt" />
                        التقاط
                      </Button>
                      <Button onClick={stopCamera} variant="outline">
                        <Icon name="close" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Photo Preview or Upload Options */}
            {(formData.photo || capturedImage) ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-surface-container-low">
                  <img
                    src={capturedImage || (formData.photo ? URL.createObjectURL(formData.photo) : '')}
                    alt="صورة الجهاز"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, photo: null }))
                      setCapturedImage(null)
                    }}
                  >
                    <Icon name="delete" />
                    حذف
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startCamera}
                  >
                    <Icon name="camera_alt" />
                    إعادة التصوير
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={startCamera}
                >
                  <Icon name="camera_alt" />
                  تصوير بالكاميرا
                </Button>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Button variant="outline" className="w-full" asChild>
                      <span>
                        <Icon name="upload" />
                        رفع صورة
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        {errors.submit && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {errors.submit}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            <Icon name="cancel" />
            إلغاء
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            <Icon name="check_circle" />
            {loading ? 'جاري الحفظ...' : 'حفظ وإنشاء بطاقة الصيانة'}
          </Button>
        </div>
      </form>
    </div>
  )
}
