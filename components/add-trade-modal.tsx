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
  const [lot, setLot] = useState('') // State untuk Lot
  const [balance, setBalance] = useState('') // State untuk Balance
  const [setupTypes, setSetupTypes] = useState<string[]>([])
  const [confluenceFactors, setConfluenceFactors] = useState<string[]>([])
  const [emotionalState, setEmotionalState] = useState('calm')
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [photoBase64, setPhotoBase64] = useState<string | undefined>()

  // Initialize pair with first available custom pair
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

  const toggleSetup = (setup: string) => {
    setSetupTypes(setupTypes.includes(setup)
      ? setupTypes.filter(s => s !== setup)
      : [...setupTypes, setup]
    )
  }

  const toggleConfluence = (factor: string) => {
    setConfluenceFactors(confluenceFactors.includes(factor)
      ? confluenceFactors.filter(f => f !== factor)
      : [...confluenceFactors, factor]
    )
  }

  const calculateDuration = () => {
    // Placeholder duration calculation - in real app would be based on actual trade times
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
        tp: parseFloat(takeProfit), // pastikan ada koma di sini
        lot: parseFloat(lot) || 0,    // TAMBAHKAN INI
        balance: parseFloat(balance) || 0, // TAMBAHKAN INI
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
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Add New Trade</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Trade Basics */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Trade Basics</h3>
            <div className="grid grid-cols-2 gap-4">
            {/* Pair Selection */}
            <div>
              <label className="text-sm text-slate-300 block mb-2">Trading Pair</label>
              {settings.pairs.length === 0 ? (
                <div className="px-4 py-3 bg-yellow-900/20 border border-yellow-900 rounded text-yellow-300 text-sm">
                  No pairs configured. Add your pairs in Settings first.
                </div>
              ) : (
                <select
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 rounded text-slate-100 border border-slate-600 focus:border-emerald-500 outline-none"
                >
                  {settings.pairs.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              )}
            </div>

              {/* Position Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Position Type</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPositionType('long')}
                    className={`flex-1 py-2 px-4 rounded font-medium transition-all ${
                      positionType === 'long'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Long
                  </button>
                  <button
                    onClick={() => setPositionType('short')}
                    className={`flex-1 py-2 px-4 rounded font-medium transition-all ${
                      positionType === 'short'
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Short
                  </button>
                </div>
              </div>

              {/* Entry Price */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Entry Price</label>
                <Input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="Enter entry price"
                  className="bg-slate-700 border-slate-600 text-slate-100"
                  step="0.01"
                />
              </div>

              {/* Stop Loss */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Stop Loss (SL)</label>
                <Input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="Enter stop loss"
                  className="bg-slate-700 border-slate-600 text-slate-100"
                  step="0.01"
                />
              </div>

              {/* Take Profit */}
              <div className="grid grid-cols-2 gap-4 mt-4">
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">Lot Size</label>
    <Input
      type="number"
      value={lot}
      onChange={(e) => setLot(e.target.value)}
      placeholder="0.01"
      className="bg-slate-700 border-slate-600 text-slate-100"
      step="0.01"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">Initial Balance ($)</label>
    <Input
      type="number"
      value={balance}
      onChange={(e) => setBalance(e.target.value)}
      placeholder="1000"
      className="bg-slate-700 border-slate-600 text-slate-100"
    />
  </div>
</div>
            {/* Auto-Calculated Fields */}
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

          {/* Trade Setup & Confluence */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Trade Setup & Confluence</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Strategies</label>
              {settings.strategies.length === 0 ? (
                <div className="px-4 py-3 bg-yellow-900/20 border border-yellow-900 rounded text-yellow-300 text-sm">
                  No strategies configured. Add your strategies in Settings first.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {settings.strategies.map((setup) => (
                    <button
                      key={setup}
                      onClick={() => {
                        if (setupTypes.includes(setup)) {
                          setSetupTypes(setupTypes.filter((s) => s !== setup))
                        } else {
                          setSetupTypes([...setupTypes, setup])
                        }
                      }}
                      className={`p-3 rounded border-2 transition-all text-sm font-medium ${
                        setupTypes.includes(setup)
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {setup}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">Confluence Factors</label>
              <div className="grid grid-cols-2 gap-3">
                {confluenceOptions.map((factor) => (
                  <button
                    key={factor}
                    onClick={() => toggleConfluence(factor)}
                    className={`p-3 rounded border-2 transition-all text-sm font-medium ${
                      confluenceFactors.includes(factor)
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {factor}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Visual Proof */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Visual Proof</h3>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <label
              htmlFor="photo-upload"
              className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer block"
            >
              <div className="space-y-2">
                {photoBase64 ? (
                  <>
                    <div className="relative h-48 bg-slate-900 rounded overflow-hidden">
                      <img src={photoBase64 || "/placeholder.svg"} alt="Upload preview" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-sm text-emerald-400">Photo uploaded successfully</p>
                  </>
                ) : (
                  <>
                    <Upload size={32} className="mx-auto text-slate-400" />
                    <p className="text-slate-300 font-medium">Drag & drop chart screenshots here</p>
                    <p className="text-sm text-slate-400">or click to upload</p>
                  </>
                )}
              </div>
            </label>
            <p className="text-xs text-slate-500 mt-2">Supported formats: PNG, JPG (max 5MB)</p>
          </section>

          {/* Psychology & Notes */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Psychology & Notes</h3>

            {/* Emotional State */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">Emotional State</label>
              <div className="grid grid-cols-4 gap-2">
                {['Calm', 'Anxious', 'Excited', 'Overconfident'].map((state) => (
                  <button
                    key={state}
                    onClick={() => setEmotionalState(state.toLowerCase())}
                    className={`py-2 px-4 rounded text-sm font-medium transition-all ${
                      emotionalState === state.toLowerCase()
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            {/* Trade Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Trade Notes & Learnings</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What was your thought process? Any patterns or lessons learned?"
                rows={5}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:border-emerald-500 outline-none resize-none"
              />
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
            <Button
              onClick={onClose}
              disabled={isSaving}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Trade'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
