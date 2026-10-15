'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import Icon from '../ui/Icon'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'الرئيسية', href: '/', icon: 'dashboard' },
  { name: 'الأجهزة والصيانة', href: '/repairs', icon: 'build' },
  { name: 'استلام جهاز جديد', href: '/reception', icon: 'add_circle' },
  { name: 'العملاء', href: '/customers', icon: 'people' },
  { name: 'التقارير', href: '/reports', icon: 'analytics' },
]

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    document.cookie = 'auth_password=; path=/; max-age=0'
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-72 bg-surface-container-lowest border-l border-surface-container-high transform transition-transform duration-300 lg:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Icon name="build" className="text-on-primary text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-on-surface">Royal System</h1>
              <p className="text-sm text-on-surface-variant">إدارة ورش الصيانة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-outline-variant hover:bg-surface-container-highest">
            <Icon name="close" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-semibold'
                        : 'text-outline-variant hover:bg-surface-container-highest/20'
                    )}
                  >
                    <Icon name={item.icon} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-surface-container-high">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
              <Icon name="person" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-on-surface">المسؤول</p>
              <p className="text-sm text-on-surface-variant">مدير الورشة</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-outline-variant hover:bg-surface-container-highest/20"
          >
            <Icon name="logout" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-container-lowest border-l border-surface-container-high min-h-screen">
        {/* Logo */}
        <div className="p-4 border-b border-surface-container-high">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Icon name="build" className="text-on-primary text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-on-surface">Royal System</h1>
              <p className="text-sm text-on-surface-variant">إدارة ورش الصيانة</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-semibold'
                        : 'text-outline-variant hover:bg-surface-container-highest/20'
                    )}
                  >
                    <Icon name={item.icon} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-surface-container-high">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
              <Icon name="person" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-on-surface">المسؤول</p>
              <p className="text-sm text-on-surface-variant">مدير الورشة</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-outline-variant hover:bg-surface-container-highest/20"
          >
            <Icon name="logout" />
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  )
}
