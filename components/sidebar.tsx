'use client'

import { useState } from 'react'
import { BarChart3, Calendar, Home, Settings, TrendingUp, Brain, Menu, X } from 'lucide-react'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'my-trades', label: 'My Trades', icon: TrendingUp },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'psychology', label: 'Psychology', icon: Brain },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = (pageId: string) => {
    onPageChange(pageId)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 hover:bg-slate-700 rounded-lg transition-colors"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Menu size={24} className="text-white" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:relative top-0 left-0 h-screen md:h-auto w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 z-40`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center">
              <TrendingUp size={20} className="text-slate-950" />
            </div>
            <h1 className="text-xl font-bold text-white">TradeJournal</h1>
          </div>
        </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 flex flex-col">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-base ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">Trading Journal</p>
          <p>v2.0.0</p>
        </div>
      </div>
    </aside>
    </>
  )
}
