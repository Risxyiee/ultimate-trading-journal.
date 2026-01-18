'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import Header from '@/components/header'
import HomeDashboard from '@/components/home-dashboard'
import Dashboard from '@/components/dashboard'
import MyTrades from '@/components/my-trades'
import Analytics from '@/components/analytics'
import Settings from '@/components/settings'
import Psychology from '@/components/psychology'
import Calendar from '@/components/calendar'
import AddTradeModal from '@/components/add-trade-modal'
import { useTrades } from '@/hooks/useTrades'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showAddTrade, setShowAddTrade] = useState(false)
  const { trades, isInitialized, addTrade, deleteTrade } = useTrades()

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeDashboard trades={trades} onAddTrade={() => setShowAddTrade(true)} onNavigate={setCurrentPage} />
      case 'dashboard':
        return <Dashboard trades={trades} />
      case 'my-trades':
        return <MyTrades trades={trades} onDeleteTrade={deleteTrade} />
      case 'analytics':
        return <Analytics trades={trades} />
      case 'calendar':
        return <Calendar trades={trades} />
      case 'psychology':
        return <Psychology trades={trades} />
      case 'settings':
        return <Settings />
      default:
        return <HomeDashboard trades={trades} onAddTrade={() => setShowAddTrade(true)} onNavigate={setCurrentPage} />
    }
  }

  if (!isInitialized) {
    return (
      <div className="dark flex items-center justify-center h-screen bg-slate-950">
        <div className="text-slate-300">Loading...</div>
      </div>
    )
  }

  return (
    <div className="dark">
      <div className="flex h-screen bg-slate-950 text-slate-100">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentPage !== 'home' && <Header onAddTrade={() => setShowAddTrade(true)} />}
          <main className="flex-1 overflow-auto">
            {renderPage()}
          </main>
        </div>
        {showAddTrade && (
          <AddTradeModal onClose={() => setShowAddTrade(false)} onSaveTrade={addTrade} />
        )}
      </div>
    </div>
  )
}
