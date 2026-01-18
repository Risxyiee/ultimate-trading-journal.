'use client'

import React from "react"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Plus, Upload } from 'lucide-react'
import { useTraderSettings } from '@/hooks/useTraderSettings'

export default function Settings() {
  const { settings, isInitialized, addPair, deletePair, addStrategy, deleteStrategy, updateProfile } =
    useTraderSettings()
  const [newPair, setNewPair] = useState('')
  const [newStrategy, setNewStrategy] = useState('')
  const [profileName, setProfileName] = useState('')
  const [profilePhotoBase64, setProfilePhotoBase64] = useState<string | undefined>()

  // Initialize profile fields on mount
  if (isInitialized && !profileName && settings.profile.name) {
    setProfileName(settings.profile.name)
    setProfilePhotoBase64(settings.profile.photoBase64)
  }

  const handleAddPair = () => {
    if (addPair(newPair)) {
      setNewPair('')
    }
  }

  const handleAddStrategy = () => {
    if (addStrategy(newStrategy)) {
      setNewStrategy('')
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setProfilePhotoBase64(base64)
        updateProfile({ photoBase64: base64 })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNameUpdate = () => {
    if (profileName.trim()) {
      updateProfile({ name: profileName.trim() })
    }
  }

  if (!isInitialized) {
    return <div className="p-8 text-slate-300">Loading settings...</div>
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400">Customize your trading journal</p>
      </div>

      {/* Profile Section */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-emerald-400">Trader Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="text-sm text-slate-300 block mb-3">Profile Photo</label>
            <input
              type="file"
              id="profile-photo"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <label htmlFor="profile-photo" className="cursor-pointer">
              <div className="flex items-center gap-4">
                {profilePhotoBase64 ? (
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-emerald-500">
                    <img src={profilePhotoBase64 || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-slate-700 flex items-center justify-center border-2 border-dashed border-slate-600">
                    <Upload size={24} className="text-slate-400" />
                  </div>
                )}
                <div>
                  <p className="text-slate-300 font-medium">Upload Photo</p>
                  <p className="text-xs text-slate-500">PNG or JPG (max 5MB)</p>
                </div>
              </div>
            </label>
          </div>

          {/* Trader Name */}
          <div>
            <label className="text-sm text-slate-300 block mb-2">Trader Name</label>
            <div className="flex gap-2">
              <Input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your name"
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button
                onClick={handleNameUpdate}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold"
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manage Trading Pairs */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-emerald-400">Manage Trading Pairs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newPair}
              onChange={(e) => setNewPair(e.target.value)}
              placeholder="Enter pair (e.g., XAU/USD, BTC/USDT)"
              className="bg-slate-700 border-slate-600 text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddPair()
              }}
            />
            <Button
              onClick={handleAddPair}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold flex items-center gap-2"
            >
              <Plus size={18} />
              Add
            </Button>
          </div>

          {settings.pairs.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No pairs added yet. Add your first pair above.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {settings.pairs.map((pair) => (
                <div
                  key={pair}
                  className="bg-slate-700 rounded-lg p-3 flex items-center justify-between hover:bg-slate-600 transition-colors"
                >
                  <span className="text-slate-100 font-medium">{pair}</span>
                  <button
                    onClick={() => deletePair(pair)}
                    className="text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manage Strategies */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-emerald-400">Manage Strategies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newStrategy}
              onChange={(e) => setNewStrategy(e.target.value)}
              placeholder="Enter strategy (e.g., Breakout, Retest)"
              className="bg-slate-700 border-slate-600 text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddStrategy()
              }}
            />
            <Button
              onClick={handleAddStrategy}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold flex items-center gap-2"
            >
              <Plus size={18} />
              Add
            </Button>
          </div>

          {settings.strategies.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No strategies added yet. Add your first strategy above.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {settings.strategies.map((strategy) => (
                <div
                  key={strategy}
                  className="bg-slate-700 rounded-lg p-3 flex items-center justify-between hover:bg-slate-600 transition-colors"
                >
                  <span className="text-slate-100 font-medium">{strategy}</span>
                  <button
                    onClick={() => deleteStrategy(strategy)}
                    className="text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="bg-blue-950/30 border-blue-900/50">
        <CardContent className="pt-6">
          <p className="text-blue-300 text-sm">
            Your custom pairs and strategies will automatically appear in the Add New Trade form. All settings are
            saved locally on your device.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
