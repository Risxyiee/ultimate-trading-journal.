'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, Search, Trash2, Download } from 'lucide-react'
import { Trade } from '@/hooks/useTrades'
import { exportTradesAsCSV } from '@/lib/export-trades'

interface MyTradesProps {
  trades: Trade[]
  onDeleteTrade: (id: string) => void
}

export default function MyTrades({ trades, onDeleteTrade }: MyTradesProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [filterPair, setFilterPair] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterResult, setFilterResult] = useState('all')
  const [searchNotes, setSearchNotes] = useState('')
  const itemsPerPage = 10

  const filteredTrades = trades.filter(trade => {
    if (filterPair !== 'all' && trade.pair !== filterPair) return false
    if (filterType !== 'all' && trade.position !== filterType) return false
    if (filterResult !== 'all' && trade.status !== filterResult) return false
    if (searchNotes && !trade.notes.includes(searchNotes)) return false
    return true
  })

  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedTrades = filteredTrades.slice(startIdx, startIdx + itemsPerPage)

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Trading Journal</h1>
          <p className="text-slate-400">All your recorded trades at a glance</p>
        </div>
        <Button
          onClick={() => exportTradesAsCSV(trades)}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold flex items-center gap-2"
        >
          <Download size={20} />
          Export CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Pair Filter */}
            <div>
              <label className="text-xs text-slate-400 block mb-2">Pair</label>
              <select
                value={filterPair}
                onChange={(e) => setFilterPair(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 rounded text-sm text-slate-300 border border-slate-600 focus:border-emerald-500 outline-none"
              >
                <option value="all">All Pairs</option>
                <option value="XAU/USD">XAU/USD</option>
                <option value="EUR/USD">EUR/USD</option>
                <option value="GBP/USD">GBP/USD</option>
                <option value="USD/JPY">USD/JPY</option>
              </select>
            </div>

            {/* Trade Type */}
            <div>
              <label className="text-xs text-slate-400 block mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 rounded text-sm text-slate-300 border border-slate-600 focus:border-emerald-500 outline-none"
              >
                <option value="all">All Types</option>
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>

            {/* Result */}
            <div>
              <label className="text-xs text-slate-400 block mb-2">Result</label>
              <select
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 rounded text-sm text-slate-300 border border-slate-600 focus:border-emerald-500 outline-none"
              >
                <option value="all">All Results</option>
                <option value="win">Win</option>
                <option value="loss">Loss</option>
              </select>
            </div>

            {/* Total Trades Count */}
            <div className="flex items-end">
              <div className="w-full px-3 py-2 bg-slate-700/50 rounded text-sm text-slate-300">
                <p className="text-xs text-slate-400 mb-1">Showing</p>
                <p className="font-semibold text-emerald-400">{filteredTrades.length} trades</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trades Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Recorded Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">ID</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Date</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Pair</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Position</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Entry</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">SL</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">TP</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">P/L ($)</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">R Ratio</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Duration</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Result</th>
                  <th className="text-left py-3 px-3 text-slate-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTrades.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-slate-400">
                      No trades found. Try adjusting your filters or add a new trade.
                    </td>
                  </tr>
                ) : (
                  paginatedTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-3 text-slate-400 text-sm">{trade.id.slice(0, 6)}</td>
                      <td className="py-3 px-3 text-slate-300 text-sm">{trade.date}</td>
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
                      <td className="py-3 px-3 text-slate-300 text-sm">{trade.entry.toFixed(2)}</td>
                      <td className="py-3 px-3 text-slate-300 text-sm">{trade.sl.toFixed(2)}</td>
                      <td className="py-3 px-3 text-slate-300 text-sm">{trade.tp.toFixed(2)}</td>
                      <td className={`py-3 px-3 font-medium text-sm ${trade.pl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trade.pl > 0 ? '+' : ''}${trade.pl.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-sm">{trade.ratio}</td>
                      <td className="py-3 px-3 text-slate-300 text-sm">{trade.duration}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.status === 'win'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {trade.status === 'win' ? 'Win' : 'Loss'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this trade?')) {
                              onDeleteTrade(trade.id)
                            }
                          }}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 size={16} className="text-rose-400 hover:text-rose-300" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
            <span className="text-sm text-slate-400">
              Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, filteredTrades.length)} of {filteredTrades.length}
            </span>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="border-slate-700"
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  className={currentPage === i + 1 ? 'bg-emerald-500 text-slate-950' : 'border-slate-700'}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="border-slate-700"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
