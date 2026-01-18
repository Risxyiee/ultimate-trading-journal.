'use client'

import { Trade } from '@/hooks/useTrades'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Target, Trophy, Plus, BarChart3, Calendar } from 'lucide-react'

interface HomeDashboardProps {
  trades: Trade[]
  onAddTrade: () => void
  onNavigate: (page: string) => void
}

export default function HomeDashboard({ trades, onAddTrade, onNavigate }: HomeDashboardProps) {
  // Calculate current streak
  const calculateCurrentStreak = () => {
    if (trades.length === 0) return 0
    let streak = 0
    const sortedTrades = [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    for (const trade of sortedTrades) {
      if (trade.status === 'win') {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  // Calculate account growth
  const calculateAccountGrowth = () => {
    if (trades.length === 0) return 0
    
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    const monthTrades = trades.filter((t) => {
      const tradeDate = new Date(t.date)
      return tradeDate.getMonth() === currentMonth && tradeDate.getFullYear() === currentYear
    })
    
    const monthlyPL = monthTrades.reduce((sum, t) => sum + t.pl, 0)
    const initialBalance = 10000
    return ((monthlyPL / initialBalance) * 100).toFixed(1)
  }

  // Get top performing pair
  const getTopPair = () => {
    if (trades.length === 0) return { pair: 'N/A', pl: 0 }
    
    const pairData: Record<string, number> = {}
    trades.forEach((t) => {
      pairData[t.pair] = (pairData[t.pair] || 0) + t.pl
    })
    
    const topPair = Object.entries(pairData).reduce((best, [pair, pl]) => 
      pl > best.pl ? { pair, pl } : best,
      { pair: 'N/A', pl: 0 }
    )
    return topPair
  }

  const currentStreak = calculateCurrentStreak()
  const accountGrowth = calculateAccountGrowth()
  const topPair = getTopPair()
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="p-6 lg:p-8 space-y-8 pb-20">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-50">Welcome back, Trader</h1>
        <p className="text-slate-400 text-lg">{dateStr}</p>
      </div>

      {/* Highlight Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Streak */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-200">Current Streak</CardTitle>
              <Trophy className="text-amber-400" size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-emerald-400">{currentStreak}</p>
              <p className="text-sm text-slate-400">Consecutive wins</p>
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden mt-4">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                  style={{ width: `${Math.min(currentStreak * 10, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Growth */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-200">Account Growth</CardTitle>
              <TrendingUp className="text-blue-400" size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className={`text-4xl font-bold ${parseFloat(accountGrowth) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {accountGrowth}%
              </p>
              <p className="text-sm text-slate-400">This month</p>
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden mt-4">
                <div 
                  className={`h-full ${parseFloat(accountGrowth) >= 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-rose-500 to-rose-600'} rounded-full`}
                  style={{ width: `${Math.min(Math.abs(parseFloat(accountGrowth)), 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Pair */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-200">Top Pair</CardTitle>
              <Target className="text-purple-400" size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-slate-50">{topPair.pair}</p>
              <p className={`text-sm ${topPair.pl > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {topPair.pl > 0 ? '+' : ''} ${topPair.pl.toFixed(2)}
              </p>
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden mt-4">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                  style={{ width: '75%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* New Trade Button */}
          <button
            onClick={onAddTrade}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 p-8 text-center transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="relative space-y-3 flex flex-col items-center">
              <Plus size={48} className="text-white" />
              <div>
                <p className="text-xl font-bold text-white">New Trade</p>
                <p className="text-sm text-emerald-100 mt-1">Record a new trade</p>
              </div>
            </div>
          </button>

          {/* Weekly Review Button */}
          <button
            onClick={() => onNavigate('my-trades')}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-8 text-center transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="relative space-y-3 flex flex-col items-center">
              <Calendar size={48} className="text-white" />
              <div>
                <p className="text-xl font-bold text-white">Weekly Review</p>
                <p className="text-sm text-blue-100 mt-1">Review all trades</p>
              </div>
            </div>
          </button>

          {/* Analytics Button */}
          <button
            onClick={() => onNavigate('analytics')}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 p-8 text-center transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <div className="absolute inset-0 bg-purple-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="relative space-y-3 flex flex-col items-center">
              <BarChart3 size={48} className="text-white" />
              <div>
                <p className="text-xl font-bold text-white">View Analytics</p>
                <p className="text-sm text-purple-100 mt-1">Deep dive insights</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 lg:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-slate-400 text-sm mb-2">Total Trades</p>
            <p className="text-3xl font-bold text-slate-50">{trades.length}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-2">Win Rate</p>
            <p className="text-3xl font-bold text-slate-50">
              {trades.length > 0 ? ((trades.filter(t => t.status === 'win').length / trades.length) * 100).toFixed(0) : 0}%
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-2">Total P/L</p>
            <p className={`text-3xl font-bold ${trades.reduce((sum, t) => sum + t.pl, 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${trades.reduce((sum, t) => sum + t.pl, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-2">Avg Trade</p>
            <p className="text-3xl font-bold text-slate-50">
              ${trades.length > 0 ? (trades.reduce((sum, t) => sum + t.pl, 0) / trades.length).toFixed(2) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
