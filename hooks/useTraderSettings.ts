'use client'

import { useState, useEffect, useCallback } from 'react'

export interface TraderProfile {
  name: string
  photoBase64?: string
}

export interface TraderSettings {
  pairs: string[]
  strategies: string[]
  profile: TraderProfile
}

const SETTINGS_STORAGE_KEY = 'trading_journal_settings'

const DEFAULT_PAIRS = ['XAU/USD', 'EUR/USD', 'GBP/USD', 'USD/JPY']
const DEFAULT_STRATEGIES = ['Breakout', 'Retest', 'Supply/Demand', 'FVG']

const DEFAULT_SETTINGS: TraderSettings = {
  pairs: DEFAULT_PAIRS,
  strategies: DEFAULT_STRATEGIES,
  profile: {
    name: 'Trader',
  },
}

export const useTraderSettings = () => {
  const [settings, setSettings] = useState<TraderSettings>(DEFAULT_SETTINGS)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load settings from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (stored) {
      try {
        setSettings(JSON.parse(stored))
      } catch (error) {
        console.log('[v0] Error loading settings:', error)
        setSettings(DEFAULT_SETTINGS)
      }
    } else {
      setSettings(DEFAULT_SETTINGS)
    }
    setIsInitialized(true)
  }, [])

  // Save settings to LocalStorage
  const saveSettings = useCallback((newSettings: TraderSettings) => {
    setSettings(newSettings)
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings))
  }, [])

  // Pair management
  const addPair = useCallback(
    (pair: string) => {
      const trimmed = pair.trim()
      if (trimmed && !settings.pairs.includes(trimmed)) {
        const updated = { ...settings, pairs: [...settings.pairs, trimmed] }
        saveSettings(updated)
        return true
      }
      return false
    },
    [settings, saveSettings]
  )

  const deletePair = useCallback(
    (pair: string) => {
      const updated = { ...settings, pairs: settings.pairs.filter((p) => p !== pair) }
      saveSettings(updated)
    },
    [settings, saveSettings]
  )

  // Strategy management
  const addStrategy = useCallback(
    (strategy: string) => {
      const trimmed = strategy.trim()
      if (trimmed && !settings.strategies.includes(trimmed)) {
        const updated = { ...settings, strategies: [...settings.strategies, trimmed] }
        saveSettings(updated)
        return true
      }
      return false
    },
    [settings, saveSettings]
  )

  const deleteStrategy = useCallback(
    (strategy: string) => {
      const updated = { ...settings, strategies: settings.strategies.filter((s) => s !== strategy) }
      saveSettings(updated)
    },
    [settings, saveSettings]
  )

  // Profile management
  const updateProfile = useCallback(
    (profile: Partial<TraderProfile>) => {
      const updated = { ...settings, profile: { ...settings.profile, ...profile } }
      saveSettings(updated)
    },
    [settings, saveSettings]
  )

  return {
    settings,
    isInitialized,
    addPair,
    deletePair,
    addStrategy,
    deleteStrategy,
    updateProfile,
  }
}
