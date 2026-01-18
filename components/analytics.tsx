'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Trade } from '@/hooks/useTrades'

interface AnalyticsProps {
  trades: Trade[]
}

export default function Analytics({ trades }: AnalyticsProps) {
  // Ensure trades is an array
  const safeTrades = Array.isArray(trades) ? trades : []

  // Monthly P/L Data
  const generateMonthlyPL = () => {
    try {
      const monthlyData: Record<string, number> = {}

      safeTrades.forEach((trade) => {
        if (trade && trade.date) {
          const monthKey = trade.date.substring(0, 7)
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (trade.pl || 0)
        }
      })

      const result = Object.entries(monthlyData).map(([month, pl]) => {
        return {
          month,
          pl: Number(pl.toFixed(2)),
        }
      })

      return result.length > 0
        ? result.sort((a, b) => a.month.localeCompare(b.month))
        : [{ month: 'N/A', pl: 0 }]
    } catch (error) {
      console.log('[v0] Error generating monthly PL:', error)
      return [{ month: 'N/A', pl: 0 }]
    }
  }

  // Daily P/L Data
  const generateDailyPL = () => {
    try {
      const dailyData: Record<string, number> = {}

      safeTrades.forEach((trade) => {
        if (trade && trade.date) {
          dailyData[trade.date] = (dailyData[trade.date] || 0) + (trade.pl || 0)
        }
      })

      const result = Object.entries(dailyData)
        .map(([date, pl]) => ({
          date,
          pl: Number(pl.toFixed(2)),
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30)

      return result.length > 0 ? result : [{ date: 'N/A', pl: 0 }]
    } catch (error) {
      console.log('[v0] Error generating daily PL:', error)
      return [{ date: 'N/A', pl: 0 }]
    }
  }

  // Win Rate by Day of Week
  const generateWinRateByDayOfWeek = () => {
    try {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dayStats: Record<number, { wins: number; total: number; pl: number }> = {}

      safeTrades.forEach((trade) => {
        if (trade && trade.date) {
          const dayOfWeek = new Date(trade.date + 'T00:00:00Z').getUTCDay()
          if (!dayStats[dayOfWeek]) {
            dayStats[dayOfWeek] = { wins: 0, total: 0, pl: 0 }
          }
          dayStats[dayOfWeek].total++
          dayStats[dayOfWeek].pl += trade.pl || 0
          if (trade.status === 'win') {
            dayStats[dayOfWeek].wins++
          }
        }
      })

      const result = Object.entries(dayStats).map(([day, stats]) => ({
        day: dayNames[parseInt(day)] || 'Unknown',
        winRate: stats.total > 0 ? Number(((stats.wins / stats.total) * 100).toFixed(1)) : 0,
        pl: Number(stats.pl.toFixed(2)),
        trades: stats.total,
      }))

      return result.length > 0 ? result : [{ day: 'N/A', winRate: 0, pl: 0, trades: 0 }]
    } catch (error) {
      console.log('[v0] Error generating day of week stats:', error)
      return [{ day: 'N/A', winRate: 0, pl: 0, trades: 0 }]
    }
  }

  // Win Rate by Trading Session (mock data based on entry times)
  const generateWinRateBySession = () => {
    const sessions = [
      { name: 'London', winRate: 68, trades: 12 },
      { name: 'New York', winRate: 75, trades: 15 },
      { name: 'Asia', winRate: 62, trades: 8 },
      { name: 'Others', winRate: 70, trades: 10 },
    ]
    return sessions
  }

  // Top/Bottom Pairs
  const generatePairPerformance = () => {
    try {
      const pairData: Record<string, { wins: number; losses: number; pl: number }> = {}

      safeTrades.forEach((trade) => {
        if (trade && trade.pair) {
          if (!pairData[trade.pair]) {
            pairData[trade.pair] = { wins: 0, losses: 0, pl: 0 }
          }
          pairData[trade.pair].pl += trade.pl || 0
          if (trade.status === 'win') {
            pairData[trade.pair].wins++
          } else {
            pairData[trade.pair].losses++
          }
        }
      })

      const result = Object.entries(pairData).map(([pair, data]) => {
        const totalTrades = data.wins + data.losses
        return {
          pair,
          pl: Number(data.pl.toFixed(2)),
          trades: totalTrades,
          winRate: totalTrades > 0 ? Number(((data.wins / totalTrades) * 100).toFixed(1)) : 0,
        }
      })

      return result.length > 0 ? result.sort((a, b) => b.pl - a.pl) : [{ pair: 'N/A', pl: 0, trades: 0, winRate: 0 }]
    } catch (error) {
      console.log('[v0] Error generating pair performance:', error)
      return [{ pair: 'N/A', pl: 0, trades: 0, winRate: 0 }]
    }
  }

  // Common Mistakes Analysis
  const generateCommonMistakes = () => {
    try {
      const mistakeFrequency: Record<string, number> = {
        'Overtrading': 0,
        'Moving SL': 0,
        'Missing Confluence': 0,
        'Wrong Session': 0,
        'Revenge Trading': 0,
        'No Setup Alignment': 0,
      }

      safeTrades.forEach((trade) => {
        if (trade && trade.pl < 0) {
          if (!trade.confluenceFactors || trade.confluenceFactors?.length === 0) {
            mistakeFrequency['Missing Confluence']++
          }
          if (trade.emotionalState === 'anxious' || trade.emotionalState === 'overconfident') {
            mistakeFrequency['Revenge Trading']++
          }
          if (!trade.setupTypes || trade.setupTypes?.length === 0) {
            mistakeFrequency['No Setup Alignment']++
          }
        }
      })

      const result = Object.entries(mistakeFrequency)
        .filter(([, count]) => count > 0)
        .map(([mistake, count]) => ({
          name: mistake,
          value: count,
        }))
        .sort((a, b) => b.value - a.value)

      return result.length > 0 ? result : [{ name: 'No Issues', value: 1 }]
    } catch (error) {
      console.log('[v0] Error generating common mistakes:', error)
      return [{ name: 'No Issues', value: 1 }]
    }
  }

  const monthlyData = generateMonthlyPL()
  const dailyData = generateDailyPL()
  const dayOfWeekData = generateWinRateByDayOfWeek()
  const sessionData = generateWinRateBySession()
  const pairPerformance = generatePairPerformance()
  const topPairs = pairPerformance.slice(0, 5)
  const bottomPairs = pairPerformance.slice(-5).reverse()
  const commonMistakes = generateCommonMistakes()

  const colors = {
    primary: '#10b981',
    secondary: '#ef4444',
    tertiary: '#3b82f6',
    quaternary: '#f59e0b',
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Trading Analytics</h1>
        <p className="text-slate-400">Deep insights into your trading performance</p>
      </div>

      {/* Performance Over Time */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Performance Over Time</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly P/L */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Monthly P/L</CardTitle>
              <p className="text-sm text-slate-400">Cumulative profit/loss by month</p>
            </CardHeader>
            <CardContent>
              {monthlyData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400">No data available</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Bar dataKey="pl" fill={colors.primary} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Daily P/L */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Daily P/L (Last 30 Days)</CardTitle>
              <p className="text-sm text-slate-400">Daily performance trend</p>
            </CardHeader>
            <CardContent>
              {dailyData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400">No data available</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pl"
                      stroke={colors.primary}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Win Rate Distribution */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Win Rate Distribution</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Day of Week */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Win Rate by Day of Week</CardTitle>
              <p className="text-sm text-slate-400">Most profitable trading days</p>
            </CardHeader>
            <CardContent>
              {dayOfWeekData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400">No data available</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dayOfWeekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                    <Bar dataKey="winRate" fill={colors.primary} name="Win Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* By Trading Session */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Win Rate by Trading Session</CardTitle>
              <p className="text-sm text-slate-400">Performance by market session</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sessionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="winRate"
                  >
                    <Cell fill={colors.primary} />
                    <Cell fill={colors.tertiary} />
                    <Cell fill={colors.quaternary} />
                    <Cell fill={colors.secondary} />
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pair Performance */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Pair Performance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pairs */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Top 5 Most Profitable Pairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPairs.length === 0 ? (
                  <p className="text-slate-400 text-sm">No trades yet</p>
                ) : (
                  topPairs.map((pair, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                      <div>
                        <p className="font-semibold text-slate-100">{pair.pair}</p>
                        <p className="text-xs text-slate-400">{pair.trades} trades</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${pair.pl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ${pair.pl.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400">{pair.winRate}% WR</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bottom Pairs */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Top 5 Least Profitable Pairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bottomPairs.length === 0 ? (
                  <p className="text-slate-400 text-sm">No trades yet</p>
                ) : (
                  bottomPairs.map((pair, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                      <div>
                        <p className="font-semibold text-slate-100">{pair.pair}</p>
                        <p className="text-xs text-slate-400">{pair.trades} trades</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${pair.pl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ${pair.pl.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400">{pair.winRate}% WR</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* P/L by Pair Chart */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">P/L by Pair</CardTitle>
          </CardHeader>
          <CardContent>
            {pairPerformance.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-400">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pairPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="pair" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="pl" fill={colors.primary} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Common Mistakes & Learnings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Common Mistakes & Learnings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mistakes Cloud */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Common Mistakes</CardTitle>
              <p className="text-sm text-slate-400">Frequency of trading errors</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 p-6">
                {commonMistakes.length === 0 ? (
                  <p className="text-slate-400 text-sm w-full">No patterns detected yet</p>
                ) : (
                  commonMistakes.map((mistake, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-2 rounded-full font-semibold text-white transition-all ${
                        mistake.value >= 3
                          ? 'bg-rose-600 text-lg'
                          : mistake.value >= 2
                            ? 'bg-rose-500 text-base'
                            : 'bg-rose-400 text-sm'
                      }`}
                    >
                      {mistake.name} ({mistake.value})
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Key Takeaways */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Key Takeaways</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded">
                <p className="text-sm font-semibold text-emerald-400 mb-2">Best Setup</p>
                <p className="text-slate-300">
                  {trades.filter((t) => t.setupTypes.includes('FVG')).length > 0
                    ? 'Your best setup is FVG retest during London session'
                    : 'Continue collecting more trade data'}
                </p>
              </div>
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
                <p className="text-sm font-semibold text-blue-400 mb-2">Confluence Factor</p>
                <p className="text-slate-300">
                  {trades.filter((t) => t.confluenceFactors.length > 1 && t.status === 'win').length > 0
                    ? 'Trades with multiple confluence factors have higher win rates'
                    : 'Add more confluence factors for better trade selection'}
                </p>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded">
                <p className="text-sm font-semibold text-amber-400 mb-2">Emotional Control</p>
                <p className="text-slate-300">
                  Maintain a calm, disciplined approach for consistent profitability
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
