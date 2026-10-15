'use client'

import Icon from '../ui/Icon'
import Button from '../ui/Button'

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="lg:hidden flex items-center justify-between p-4 bg-surface-container-lowest border-b border-surface-container-high">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Icon name="build" className="text-on-primary text-xl" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-on-surface">مُصلِح</h1>
          <p className="text-sm text-on-surface-variant">إدارة ورش الصيانة</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onMenuClick}>
        <Icon name="menu" />
      </Button>
    </header>
  )
}
