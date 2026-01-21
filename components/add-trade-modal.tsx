'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Upload } from 'lucide-react'
import { Trade } from '@/hooks/useTrades'
import { useTraderSettings } from '@/hooks/useTraderSettings'

interface AddTradeModalProps {
  onClose: () => void
  onSaveTrade: (trade: Omit<Trade, 'id' | 'createdAt'>) => void
}

export default function AddTradeModal({ onClose, onSaveTrade }: AddTradeModalProps) {
  const { settings } = useTraderSettings()
  const [pair, setPair] = useState('')
  const [positionType, setPositionType] = useState<'long' | 'short'>('long')
  const [entryPrice, setEntryPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
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

  const calculateRiskReward = () => {
    if (!entryPrice || !stopLoss || !takeProfit) return null
    const entry = parseFloat(entryPrice)
    const sl = parseFloat(stopLoss)
    const tp = parseFloat(takeProfit)
    const risk = positionType === 'long' ? entry - sl : sl - entry
    const reward = positionType === 'long' ? tp - entry : entry - tp
    return (reward / risk).toFixed(2)
  }

  const handleSave = async () => {
    if (!entryPrice || !stopLoss || !takeProfit) {
      alert('Isi semua field utama!')
      return
    }
    setIsSaving(true)
    try {
      const newTrade: Omit<Trade, 'id' | 'createdAt'> = {
        date: new Date().toISOString().split('T')[0],
        pair,
        position: positionType,
        entry: parseFloat(entryPrice),
        sl: parseFloat(stopLoss),
        tp: parseFloat(takeProfit),
        lot: parseFloat(lot) || 0,
        balance: parseFloat(balance) || 0,
        pl: 0,
        ratio: calculateRiskReward() || '0',
        duration: '1h',
        status: 'win',
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
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add New Trade (Lot & Balance Active)</h2>
          <button onClick={onClose}><X className="text-slate-400" /></button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} placeholder="Entry Price" className="bg-slate-700" />
            <Input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="Stop Loss" className="bg-slate-700" />
            <Input type="number" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="Take Profit" className="bg-slate-700" />
            
            {/* INPUT INI HARUSNYA TERLIHAT JELAS SEKARANG */}
            <div className="space-y-1">
               <label className="text-xs text-emerald-400">Lot Size</label>
               <Input type="number" value={lot} onChange={(e) => setLot(e.target.value)} placeholder="Contoh: 0.10" className="bg-slate-700 border-emerald-500/50" />
            </div>
            <div className="space-y-1">
               <label className="text-xs text-emerald-400">Initial Balance ($)</label>
               <Input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="Contoh: 1000" className="bg-slate-700 border-emerald-500/50" />
            </div>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="w-full bg-emerald-500 text-slate-900 mt-4">
            {isSaving ? 'Saving...' : 'Save Trade Data'}
          </Button>
        </div>
      </div>
    </div>
  )
}
