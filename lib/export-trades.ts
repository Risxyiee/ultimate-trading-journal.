import { Trade } from '@/hooks/useTrades'
import { useTraderSettings } from '@/hooks/useTraderSettings'

export function exportTradesAsCSV(trades: Trade[]): void {
  if (trades.length === 0) {
    alert('No trades to export')
    return
  }

  // Get trader profile info for CSV header
  let profileInfo = ''
  try {
    const stored = localStorage.getItem('trading_journal_settings')
    if (stored) {
      const settings = JSON.parse(stored)
      profileInfo = `Trader: ${settings.profile.name || 'Unknown'}\n`
    }
  } catch (e) {
    // Silently fail
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Date',
    'Pair',
    'Position',
    'Entry',
    'Stop Loss',
    'Take Profit',
    'P/L',
    'R:R Ratio',
    'Duration',
    'Status',
    'Strategies',
    'Confluence Factors',
    'Emotional State',
    'Notes',
  ]

  // Build CSV rows
  const rows = trades.map((trade) => [
    trade.id,
    trade.date,
    trade.pair,
    trade.position.toUpperCase(),
    trade.entry.toFixed(2),
    trade.sl.toFixed(2),
    trade.tp.toFixed(2),
    trade.pl.toFixed(2),
    trade.ratio,
    trade.duration,
    trade.status.toUpperCase(),
    `"${trade.setupTypes.join(', ')}"`,
    `"${trade.confluenceFactors.join(', ')}"`,
    trade.emotionalState,
    `"${trade.notes.replace(/"/g, '""')}"`,
  ])

  // Combine headers and rows
  const csvContent = [
    profileInfo,
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ]
    .filter((line) => line.length > 0)
    .join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  const fileName = `trading-journal-${new Date().toISOString().split('T')[0]}.csv`
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
