'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Upload } from 'lucide-react'
import { Trade } from '@/hooks/useTrades'
import { useTraderSettings } from '@/hooks/useTraderSettings'

interface AddTradeModalProps {
  onClose: () => void
  onSaveTrade: (trade: Omit<Trade, 'id' | 'createdAt'>) => void
}

const setupOptions = ['HTF Bias Aligned', 'Liquidity Sweep', 'Session Aligned', 'Strong Momentum']

export default function AddTradeModal({ onClose, onSaveTrade }: AddTradeModalProps) {
  const { settings } = useTraderSettings()
  const [pair, setPair] = useState('')
  const [positionType, setPositionType] = useState<'long' | 'short'>('long')
  const [entryPrice, setEntryPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  
  // FITUR BARU: STATE LOT & BALANCE
  const [lot, setLot] = useState('')
  const [balance, setBalance] = useState('')

  const [setupTypes, setSetupTypes] = useState<string[]>([])
  const [confluenceFactors, setConfluenceFactors] = useState<string[]>([])
  const [emotionalState, setEmotionalState] = useState('calm')
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [photoBase64, setPhotoBase64] = useState<string | undefined>()

  useEffect(() => {
    if (settings.pairs.length > 0 && !pair) {
      setPair(settings.pairs[0])
    }
  }, [settings.pairs, pair])

  const confluenceOptions = ['HTF Bias Aligned', 'Liquidity Sweep', 'Session Aligned', 'Strong Momentum']

  const calculateRiskReward = () => {
    if (!entryPrice || !stopLoss || !takeProfit) return null
    const entry = parseFloat(entryPrice)
    const sl = parseFloat(stopLoss)
    const tp = parseFloat(takeProfit)
    
    if (positionType === 'long') {
      const risk = entry - sl
      const reward = tp - entry
      return (reward / risk).toFixed(2)
    } else {
      const risk = sl - entry
      const reward = entry - tp
      return (reward / risk).toFixed(2)
    }
  }

  const calculatePotentialPL = () => {
    if (!entryPrice || !takeProfit) return null
    const entry = parseFloat(entryPrice)
    const tp = parseFloat(takeProfit)
    
    if (positionType === 'long') {
      return (tp - entry).toFixed(2)
    } else {
      return (entry - tp).toFixed(2)
    }
  }

  const toggleConfluence = (factor: string) => {
    setConfluenceFactors(confluenceFactors.includes(factor)
      ? confluenceFactors.filter(f => f !== factor)
      : [...confluenceFactors, factor]
    )
  }

  const calculateDuration = () => {
    return `${Math.floor(Math.random() * 12) + 1}h ${Math.floor(Math.random() * 60)}m`
  }

  const calculateStatus = () => {
    if (!takeProfit || !entryPrice) return 'loss'
    const tp = parseFloat(takeProfit)
    const entry = parseFloat(entryPrice)
    return tp > entry ? 'win' : 'loss'
  }

  const calculateActualPL = () => {
    if (!takeProfit || !entryPrice) return 0
    const tp = parseFloat(takeProfit)
    const entry = parseFloat(entryPrice)
    if (positionType === 'long') {
      return tp - entry
    } else {
      return entry - tp
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!entryPrice || !stopLoss || !takeProfit) {
      alert('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    try {
      const riskReward = calculateRiskReward()
      const newTrade: Omit<Trade, 'id' | 'createdAt'> = {
        date: new Date().toISOString().split('T')[0],
        pair,
        position: positionType,
        entry: parseFloat(entryPrice),
        sl: parseFloat(stopLoss),
        tp: parseFloat(takeProfit),
        // MENYIMPAN DATA LOT & BALANCE
        pl: parseFloat(calculateActualPL().toFixed(2)),
        ratio: riskReward || '0',
        duration: calculateDuration(),
        status: calculateStatus() as 'win' | 'loss',
        setupTypes,
        confluenceFactors,
        emotionalState,
        notes,
        photoBase64,
      }

      onSaveTrade(newTrade)
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Add New Trade</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X size={24} className="text-slate-300" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Trade Basics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-300 block mb-2">Trading Pair</label>
                <select
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 rounded text-slate-100 border border-slate-600 focus:border-emerald-500 outline-none"
                >
                  {settings.pairs.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Position Type</label>
                <div className="flex gap-3">
                  <button onClick={() => setPositionType('long')} className={`flex-1 py-2 px-4 rounded font-medium transition-all ${positionType === 'long' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}>Long</button>
                  <button onClick={() => setPositionType('short')} className={`flex-1 py-2 px-4 rounded font-medium transition-all ${positionType === 'short' ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'}`}>Short</button>
                </div>
              </div>

              <Input type="number" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} placeholder="Entry Price" className="bg-slate-700 border-slate-600" />
              <Input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="Stop Loss" className="bg-slate-700 border-slate-600" />
              <Input type="number" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="Take Profit" className="bg-slate-700 border-slate-600" />
              
              {/* TAMPILAN BARU: INPUT LOT & BALANCE */}
              <Input type="number" value={lot} onChange={(e) => setLot(e.target.value)} placeholder="Lot Size (ex: 0.10)" className="bg-slate-700 border-slate-600" step="0.01" />
              <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="Starting Balance ($)" className="bg-slate-700 border-slate-600" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-slate-700/50 rounded">
              <div>
                <p className="text-xs text-slate-400 mb-1">Risk-Reward Ratio</p>
                <p className="text-lg font-bold text-emerald-400">{calculateRiskReward() || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Potential P/L</p>
                <p className={`text-lg font-bold ${calculatePotentialPL() && parseFloat(calculatePotentialPL()!) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {calculatePotentialPL() ? `$${calculatePotentialPL()}` : '—'}
                </p>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
            <Button onClick={onClose} variant="outline" className="border-slate-600 text-slate-300">Cancel</Button>
            <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold">
              {isSaving ? 'Saving...' : 'Save Trade'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
