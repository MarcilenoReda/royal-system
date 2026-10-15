'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple auth - set cookie
    document.cookie = `auth_password=${password}; path=/; max-age=86400`

    // Check if password is correct
    const correctPassword = process.env.NEXT_PUBLIC_AUTH_PASSWORD || '0112423995'

    if (password === correctPassword) {
      router.push('/')
    } else {
      setError('كلمة المرور غير صحيحة')
      // Clear cookie on error
      document.cookie = 'auth_password=; path=/; max-age=0'
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <Icon name="build" className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-on-surface">Royal System</h1>
            <p className="text-on-surface-variant mt-1">
              نظام إدارة ورش الصيانة
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              label="كلمة المرور"
              type="password"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              <Icon name="login" />
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-on-surface-variant">
            <p>نظام إدارة ورش الصيانة</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
