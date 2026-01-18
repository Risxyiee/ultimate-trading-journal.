'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Trade {
  id: string
  date: string
  pair: string
  position: 'long' | 'short'
  entry: number
  sl: number
  tp: number
  pl: number
  ratio: string
  duration: string
  status: 'win' | 'loss'
  setupTypes: string[]
  confluenceFactors: string[]
  emotionalState: string
  notes: string
  photoBase64?: string
  createdAt: string
}

const STORAGE_KEY = 'trading_journal_trades'
const DEMO_TRADES: Trade[] = [
  {
    id: '1',
    date: '2026-01-18',
    pair: 'XAU/USD',
    position: 'long',
    entry: 2045.50,
    sl: 2040.00,
    tp: 2055.00,
    pl: 245.50,
    ratio: '1:2.1',
    duration: '2h 15m',
    status: 'win',
    setupTypes: ['Retest'],
    confluenceFactors: ['HTF Bias Aligned', 'Session Aligned'],
    emotionalState: 'calm',
    notes: 'Strong retest of liquidity level. Followed setup perfectly.',
    createdAt: new Date('2026-01-18').toISOString(),
  },
  {
    id: '2',
    date: '2026-01-18',
    pair: 'EUR/USD',
    position: 'short',
    entry: 1.0875,
    sl: 1.0895,
    tp: 1.0850,
    pl: -125.00,
    ratio: '1:0.5',
    duration: '45m',
    status: 'loss',
    setupTypes: ['Breakout'],
    confluenceFactors: [],
    emotionalState: 'excited',
    notes: 'Rushed into trade without proper confluence. Break-even loss.',
    createdAt: new Date('2026-01-18').toISOString(),
  },
  {
    id: '3',
    date: '2026-01-17',
    pair: 'XAU/USD',
    position: 'long',
    entry: 2040.00,
    sl: 2035.50,
    tp: 2050.00,
    pl: 180.75,
    ratio: '1:1.9',
    duration: '3h 30m',
    status: 'win',
    setupTypes: ['FVG'],
    confluenceFactors: ['Liquidity Sweep', 'Strong Momentum'],
    emotionalState: 'calm',
    notes: 'Perfect FVG retest with London session alignment.',
    createdAt: new Date('2026-01-17').toISOString(),
  },
]

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize trades from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setTrades(JSON.parse(stored))
      } catch (e) {
        console.log('[v0] Failed to parse trades from localStorage')
        setTrades(DEMO_TRADES)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_TRADES))
      }
    } else {
      // First load - initialize with demo data
      setTrades(DEMO_TRADES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_TRADES))
    }
    setIsInitialized(true)
  }, [])

  // Save trades to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
    }
  }, [trades, isInitialized])

  const addTrade = useCallback((tradeData: Omit<Trade, 'id' | 'createdAt'>) => {
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTrades((prev) => [newTrade, ...prev])
    return newTrade
  }, [])

  const updateTrade = useCallback((id: string, updates: Partial<Trade>) => {
    setTrades((prev) =>
      prev.map((trade) => (trade.id === id ? { ...trade, ...updates } : trade))
    )
  }, [])

  const deleteTrade = useCallback((id: string) => {
    setTrades((prev) => prev.filter((trade) => trade.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setTrades([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    trades,
    isInitialized,
    addTrade,
    updateTrade,
    deleteTrade,
    clearAll,
  }
}
