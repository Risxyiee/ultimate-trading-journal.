import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Zap, Target, AlertCircle } from 'lucide-react'
import { Trade } from '@/hooks/useTrades'

interface DashboardProps {
  trades: Trade[]
}

export default function Dashboard({ trades }: DashboardProps) {
  // Calculate metrics from real trades
  const calculateMetrics = () => {
    try {
      if (!trades || trades.length === 0) {
        return {
          totalPL: 0,
          winRate: 0,
          profitFactor: 1,
          expectancy: 0,
          wins: 0,
          losses: 0,
          todayPL: 0,
          todayTrades: 0,
        }
      }

      const wins = trades.filter((t) => t && t.status === 'win')
      const losses = trades.filter((t) => t && t.status === 'loss')
      const totalPL = trades.reduce((sum, t) => sum + (t?.pl || 0), 0)
      const grossWins = wins.reduce((sum, t) => sum + (t?.pl || 0), 0)
      const grossLosses = Math.abs(losses.reduce((sum, t) => sum + (t?.pl || 0), 0))
      const profitFactor = grossLosses > 0 ? grossWins / grossLosses : grossWins > 0 ? grossWins : 1
      const expectancy = trades.length > 0 ? totalPL / trades.length : 0
      const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0

      const today = new Date().toISOString().split('T')[0]
      const todayTrades = trades.filter((t) => t && t.date === today)
      const todayPL = todayTrades.reduce((sum, t) => sum + (t?.pl || 0), 0)

      return {
        totalPL: parseFloat(totalPL.toFixed(2)),
        winRate,
        profitFactor: parseFloat(profitFactor.toFixed(2)),
        expectancy: parseFloat(expectancy.toFixed(2)),
        wins: wins.length,
        losses: losses.length,
        todayPL: parseFloat(todayPL.toFixed(2)),
        todayTrades: todayTrades.length,
      }
    } catch (error) {
      console.log('[v0] Error calculating metrics:', error)
      return {
        totalPL: 0,
        winRate: 0,
        profitFactor: 1,
        expectancy: 0,
        wins: 0,
        losses: 0,
        todayPL: 0,
        todayTrades: 0,
      }
    }
  }

  const metrics = calculateMetrics()
  const totalPL = metrics.totalPL
  const winRate = metrics.winRate
  const profitFactor = metrics.profitFactor
  const expectancy = metrics.expectancy

  // Generate equity curve data from trades
  const generateEquityData = () => {
    try {
      if (!trades || trades.length === 0) return [{ date: 'No Data', value: 10000 }]

      const sortedTrades = [...trades]
        .filter((t) => t && t.createdAt)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

      if (sortedTrades.length === 0) return [{ date: 'No Data', value: 10000 }]

      let equity = 10000
      return sortedTrades.map((trade, idx) => {
        equity += trade?.pl || 0
        return {
          date: `Day ${idx + 1}`,
          value: parseFloat(equity.toFixed(2)),
        }
      })
    } catch (error) {
      console.log('[v0] Error generating equity data:', error)
      return [{ date: 'No Data', value: 10000 }]
    }
  }

  const equityData = generateEquityData()
  const recentTrades = trades.slice(0, 5)

  return (
    <div className="p-8 space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        {/* Total P/L */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-300">Total P/L</CardTitle>
              <TrendingUp className="text-emerald-500" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
            <p className={`text-3xl font-bold ${metrics.totalPL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${metrics.totalPL.toFixed(2)}
            </p>
            <p className="text-xs text-slate-400">{metrics.wins} Wins, {metrics.losses} Losses</p>
              <div className="h-8 bg-slate-700 rounded flex items-end px-1 gap-0.5">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ height: `${30 + Math.random() * 40}%` }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Win Rate */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-300">Win Rate %</CardTitle>
              <Zap className="text-blue-500" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-3xl font-bold text-blue-400">{metrics.winRate.toFixed(1)}%</p>
              <p className="text-xs text-slate-400">{metrics.wins} wins, {metrics.losses} losses</p>
              <div className="mt-3 h-2 bg-slate-700 rounded overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${metrics.winRate}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profit Factor */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-300">Profit Factor</CardTitle>
              <Target className="text-amber-500" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-3xl font-bold text-amber-400">{metrics.profitFactor.toFixed(2)}</p>
              <p className="text-xs text-slate-400">Gross wins / Gross losses</p>
              <div className="mt-3 text-xs text-slate-400">
                <p>{trades.length} Total trades</p>
                <p>Recent average</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expectancy */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-300">Expectancy</CardTitle>
              <AlertCircle className="text-purple-500" size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-3xl font-bold text-purple-400">${metrics.expectancy.toFixed(2)}</p>
              <p className="text-xs text-slate-400">Avg profit per trade</p>
              <p className="text-xs text-slate-500 mt-2">Based on {trades.length} trades</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equity Curve & Today's Performance */}
      <div className="grid grid-cols-3 gap-6">
        {/* Equity Curve */}
        <Card className="col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Equity Curve</CardTitle>
            <p className="text-sm text-slate-400">P/L over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={equityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today's Performance */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Today's Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-400">P/L Today</p>
              <p className={`text-2xl font-bold ${metrics.todayPL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metrics.todayPL > 0 ? '+' : ''} ${metrics.todayPL.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Trades Today</p>
              <p className="text-2xl font-bold text-slate-100">{metrics.todayTrades}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Overall Win Rate</p>
              <p className="text-2xl font-bold text-blue-400">{metrics.winRate.toFixed(1)}%</p>
            </div>
            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500">
                {metrics.wins} Wins, {metrics.losses} Losses
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & News */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Trades */}
        <Card className="col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-3 text-slate-400 font-medium">Date</th>
                    <th className="text-left py-3 px-3 text-slate-400 font-medium">Pair</th>
                    <th className="text-left py-3 px-3 text-slate-400 font-medium">Type</th>
                    <th className="text-left py-3 px-3 text-slate-400 font-medium">P/L</th>
                    <th className="text-left py-3 px-3 text-slate-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No trades yet. Add your first trade to get started.
                      </td>
                    </tr>
                  ) : (
                    recentTrades.map((trade) => (
                      <tr key={trade.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-3 px-3 text-slate-300">{trade.date}</td>
                        <td className="py-3 px-3 font-medium text-slate-100">{trade.pair}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            trade.position === 'long'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {trade.position === 'long' ? 'Long' : 'Short'}
                          </span>
                        </td>
                        <td className={`py-3 px-3 font-medium ${trade.pl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {trade.pl > 0 ? '+' : ''} ${trade.pl.toFixed(2)}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            trade.status === 'win'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {trade.status === 'win' ? 'Win' : 'Loss'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Economic Events */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-sm font-medium text-slate-100">Federal Reserve</p>
              <p className="text-xs text-slate-400">Interest Rate Decision</p>
              <p className="text-xs text-amber-400 mt-1">Tomorrow 19:00 UTC</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-sm font-medium text-slate-100">ECB Press</p>
              <p className="text-xs text-slate-400">Conference</p>
              <p className="text-xs text-slate-500 mt-1">Jan 25, 2024</p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-sm font-medium text-slate-100">USD Employment</p>
              <p className="text-xs text-slate-400">Non-Farm Payroll</p>
              <p className="text-xs text-slate-500 mt-1">Feb 2, 2024</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
