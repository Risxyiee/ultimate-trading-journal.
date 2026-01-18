'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trade } from '@/hooks/useTrades'

interface PsychologyProps {
  trades: Trade[]
}

export default function Psychology({ trades }: PsychologyProps) {
  // Calculate emotional state performance
  const emotionalStates = ['calm', 'excited', 'anxious', 'overconfident', 'frustrated']

  const emotionalPerformance = emotionalStates.map((state) => {
    const stateTradesFiltered = trades.filter((t) => t.emotionalState === state)
    if (stateTradesFiltered.length === 0) {
      return { state, trades: 0, wins: 0, winRate: 0, avgPL: 0 }
    }
    const wins = stateTradesFiltered.filter((t) => t.status === 'win').length
    const totalPL = stateTradesFiltered.reduce((sum, t) => sum + t.pl, 0)
    return {
      state,
      trades: stateTradesFiltered.length,
      wins,
      winRate: (wins / stateTradesFiltered.length) * 100,
      avgPL: totalPL / stateTradesFiltered.length,
    }
  })

  // Calculate strategy performance
  const strategyPerformance: {
    [key: string]: { trades: number; wins: number; winRate: number; avgPL: number }
  } = {}

  trades.forEach((trade) => {
    trade.setupTypes.forEach((strategy) => {
      if (!strategyPerformance[strategy]) {
        strategyPerformance[strategy] = { trades: 0, wins: 0, winRate: 0, avgPL: 0 }
      }
      strategyPerformance[strategy].trades++
      if (trade.status === 'win') strategyPerformance[strategy].wins++
      strategyPerformance[strategy].avgPL += trade.pl
    })
  })

  const strategyList = Object.entries(strategyPerformance).map(([strategy, data]) => ({
    strategy,
    trades: data.trades,
    wins: data.wins,
    winRate: (data.wins / data.trades) * 100,
    avgPL: data.avgPL / data.trades,
  }))

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Psychology & Performance</h1>
        <p className="text-slate-400">Analyze your trading psychology and strategy effectiveness</p>
      </div>

      {/* Emotional State Performance */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-emerald-400">Performance by Emotional State</CardTitle>
        </CardHeader>
        <CardContent>
          {trades.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No trades recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {emotionalPerformance.map((perf) =>
                perf.trades > 0 ? (
                  <div key={perf.state} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="capitalize font-semibold text-white">{perf.state}</div>
                      <div className="text-sm text-slate-400">{perf.trades} trades</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Win Rate</p>
                        <p className={`text-lg font-bold ${perf.winRate >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {perf.winRate.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Wins</p>
                        <p className="text-lg font-bold text-emerald-400">{perf.wins}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Average P/L</p>
                        <p className={`text-lg font-bold ${perf.avgPL > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ${perf.avgPL.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strategy Performance */}
      {strategyList.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-emerald-400">Performance by Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strategyList
                .sort((a, b) => b.trades - a.trades)
                .map((item) => (
                  <div key={item.strategy} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-white">{item.strategy}</div>
                      <div className="text-sm text-slate-400">{item.trades} trades</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Win Rate</p>
                        <p className={`text-lg font-bold ${item.winRate >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {item.winRate.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Wins</p>
                        <p className="text-lg font-bold text-emerald-400">{item.wins}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Average P/L</p>
                        <p className={`text-lg font-bold ${item.avgPL > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ${item.avgPL.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Insights */}
      <Card className="bg-blue-950/30 border-blue-900/50">
        <CardHeader>
          <CardTitle className="text-blue-400">Psychology Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trades.length === 0 ? (
            <p className="text-blue-300 text-sm">Add trades to see psychology insights.</p>
          ) : (
            <>
              <p className="text-blue-300 text-sm">
                Track your emotional states when trading to identify patterns. The calm state typically leads to more
                disciplined trading decisions.
              </p>
              <p className="text-blue-300 text-sm">
                Monitor your strategy performance to understand which setups work best for your trading style and risk
                tolerance.
              </p>
              <p className="text-blue-300 text-sm">
                Use this data to improve your trading psychology and focus on high-probability setups.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
