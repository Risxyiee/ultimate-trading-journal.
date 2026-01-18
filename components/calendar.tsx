'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Trade } from '@/hooks/useTrades'

interface CalendarProps {
  trades: Trade[]
}

export default function Calendar({ trades }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 18)) // January 18, 2026

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getTradesForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return trades.filter((t) => t.date === dateStr)
  }

  const getDayPerformance = (day: number) => {
    const dayTrades = getTradesForDay(day)
    if (dayTrades.length === 0) return null
    const totalPL = dayTrades.reduce((sum, t) => sum + t.pl, 0)
    const wins = dayTrades.filter((t) => t.status === 'win').length
    return { totalPL, wins, trades: dayTrades.length }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Trading Calendar</h1>
        <p className="text-slate-400">View your trades by date in 2026</p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-emerald-400">{monthName}</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={previousMonth}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              onClick={nextMonth}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-slate-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, idx) => {
                const performance = day ? getDayPerformance(day) : null
                return (
                  <div
                    key={idx}
                    className={`aspect-square p-2 rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                      day === null
                        ? 'bg-slate-900'
                        : performance
                          ? performance.totalPL > 0
                            ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 cursor-pointer hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 border-2 border-rose-500 text-rose-400 cursor-pointer hover:bg-rose-500/30'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {day && (
                      <>
                        <div className="font-bold">{day}</div>
                        {performance && (
                          <>
                            <div className="text-xs mt-1">
                              {performance.trades} {performance.trades === 1 ? 'trade' : 'trades'}
                            </div>
                            <div className={`text-xs font-semibold ${performance.totalPL > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              ${performance.totalPL.toFixed(0)}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-emerald-400 text-base">Legend</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-500/20 border-2 border-emerald-500"></div>
            <span className="text-slate-300">Profitable Day</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-rose-500/20 border-2 border-rose-500"></div>
            <span className="text-slate-300">Loss Day</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-700"></div>
            <span className="text-slate-300">No Trades</span>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      {trades.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-emerald-400">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Total Trades</p>
              <p className="text-2xl font-bold text-slate-100">
                {trades.filter((t) => t.date.startsWith(currentDate.getFullYear().toString() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0'))).length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Total P/L</p>
              <p className={`text-2xl font-bold ${trades.filter((t) => t.date.startsWith(currentDate.getFullYear().toString() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0'))).reduce((sum, t) => sum + t.pl, 0) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                $
                {trades
                  .filter((t) => t.date.startsWith(currentDate.getFullYear().toString() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0')))
                  .reduce((sum, t) => sum + t.pl, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Winning Days</p>
              <p className="text-2xl font-bold text-emerald-400">
                {days
                  .filter((d) => d && getDayPerformance(d)?.totalPL! > 0).length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Losing Days</p>
              <p className="text-2xl font-bold text-rose-400">
                {days
                  .filter((d) => d && getDayPerformance(d)?.totalPL! < 0).length}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
