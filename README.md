# مُصلِح - نظام إدارة ورش الصيانة

نظام إدارة ورش الصيانة باللغة العربية مبني على Next.js و Supabase.

## التقنيات المستخدمة

- **Next.js 14** - إطار العمل React
- **TypeScript** - للكتابة الآمنة
- **Tailwind CSS** - للتنسيق
- **Supabase** - قاعدة البيانات والمصادقة والتخزين
- **Material Symbols** - الأيقونات

## الإعداد

### 1. تثبيت المكتبات

```bash
npm install
```

### 2. إعداد Supabase

1. قم بإنشاء مشروع جديد على [Supabase](https://supabase.com)
2. انسخ URL و Anon Key من إعدادات المشروع
3. أضفهم إلى ملف `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. تشغيل الترحيلات

في لوحة تحكم Supabase:
1. اذهب إلى SQL Editor
2. قم بتشغيل الملفات الموجودة في مجلد `supabase/migrations` بالترتيب:
   - `001_initial_schema.sql`
   - `002_storage_bucket.sql`

### 4. تشغيل المشروع

```bash
npm run dev
```

افتح المتصفح على `http://localhost:3000`

## هيكل قاعدة البيانات

### customers
- id
- name
- phone
- created_at
- updated_at

### repairs
- id
- repair_number (مثل: REP-000001)
- customer_id
- device_type
- device_model
- customer_problem
- inspection_result
- repair_notes
- repair_cost
- discount
- total_amount (محسوب تلقائياً)
- paid_amount
- remaining_amount (محسوب تلقائياً)
- status (received, inspection, waiting_approval, approved, in_repair, ready, delivered, rejected, cancelled)
- expected_delivery_date
- received_at
- delivered_at
- created_at
- updated_at

### repair_photos
- id
- repair_id
- photo_type (reception, delivery)
- file_path
- created_at

### repair_status_history
- id
- repair_id
- status
- notes
- created_at

### payments
- id
- repair_id
- amount
- payment_method (نقدي, فودافون كاش, إنستاباي, تحويل بنكي, أخرى)
- notes
- created_at

## حالات الصيانة

- received = مستلم
- inspection = قيد الفحص
- waiting_approval = بانتظار موافقة العميل
- approved = تمت الموافقة
- in_repair = قيد الإصلاح
- ready = جاهز للتسليم
- delivered = تم التسليم
- rejected = مرفوض
- cancelled = ملغي

## البناء

```bash
npm run build
```

## التشغيل في الإنتاج

```bash
npm start
```
# royal-system
# royal-system
