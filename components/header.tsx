'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTraderSettings } from '@/hooks/useTraderSettings'

interface HeaderProps {
  onAddTrade: () => void
}

export default function Header({ onAddTrade }: HeaderProps) {
  const { settings, isInitialized } = useTraderSettings()

  if (!isInitialized) {
    return (
      <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Trading Journal</h2>
          <p className="text-sm text-slate-400">Track and analyze your trades</p>
        </div>
      </header>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">Trading Journal</h2>
        <p className="text-sm text-slate-400">Welcome, {settings.profile.name}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* User Avatar */}
        {settings.profile.photoBase64 ? (
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500">
            <img src={settings.profile.photoBase64 || "/placeholder.svg"} alt={settings.profile.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{getInitials(settings.profile.name)}</span>
          </div>
        )}

        {/* Add New Trade Button */}
        <Button
          onClick={onAddTrade}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Trade
        </Button>
      </div>
    </header>
  )
}
