'use client'

import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/lib/hooks/useLocalStorage'

interface StreakData {
  dice1: { value: number; count: number }
  dice2: { value: number; count: number }
  coin: { value: 'Cara' | 'Creu'; count: number }
}

const initialStreaks: StreakData = {
  dice1: { value: 0, count: 0 },
  dice2: { value: 0, count: 0 },
  coin: { value: 'Cara', count: 0 }
}

export default function RandomTab() {
  const [streaks, setStreaks] = useLocalStorage<StreakData>('randomStreaks', initialStreaks)
  const [activeCooldown, setActiveCooldown] = useState<'dice1' | 'dice2' | 'coin' | null>(null)
  const [cooldownProgress, setCooldownProgress] = useState(0)
  const [lastResult, setLastResult] = useState<{
    dice1?: number
    dice2?: { die1: number; die2: number; sum: number }
    coin?: 'Cara' | 'Creu'
  }>({})

  // Haptic feedback helper
  const vibrate = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  // Cooldown handler with fill and empty animation
  const startCooldown = async (generator: 'dice1' | 'dice2' | 'coin') => {
    setActiveCooldown(generator)
    setCooldownProgress(0)
    
    const cooldownDuration = 2000 // 2 seconds total (1s fill, 1s empty)
    const intervalTime = 20 // Update every 20ms for smooth animation
    const steps = cooldownDuration / intervalTime
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const progress = (currentStep / steps) * 100

      // First half: fill (0 to 100%), second half: empty (100 to 0%)
      if (progress <= 50) {
        setCooldownProgress(progress * 2) // 0-50% becomes 0-100%
      } else {
        setCooldownProgress(200 - progress * 2) // 50-100% becomes 100-0%
      }

      if (currentStep >= steps) {
        clearInterval(interval)
        setActiveCooldown(null)
        setCooldownProgress(0)
      }
    }, intervalTime)
  }

  // Generator functions
  const rollOneDice = async () => {
    if (activeCooldown) return

    vibrate()

    const result = Math.floor(Math.random() * 6) + 1
    setLastResult(prev => ({ ...prev, dice1: result }))
    
    setStreaks(prev => {
      if (prev.dice1.value === result) {
        return {
          ...prev,
          dice1: { value: result, count: prev.dice1.count + 1 }
        }
      } else {
        return {
          ...prev,
          dice1: { value: result, count: 1 }
        }
      }
    })

    startCooldown('dice1')
  }

  const rollTwoDice = async () => {
    if (activeCooldown) return

    vibrate()

    const die1 = Math.floor(Math.random() * 6) + 1
    const die2 = Math.floor(Math.random() * 6) + 1
    const sum = die1 + die2
    const result = { die1, die2, sum }
    setLastResult(prev => ({ ...prev, dice2: result }))
    
    setStreaks(prev => {
      if (prev.dice2.value === sum) {
        return {
          ...prev,
          dice2: { value: sum, count: prev.dice2.count + 1 }
        }
      } else {
        return {
          ...prev,
          dice2: { value: sum, count: 1 }
        }
      }
    })

    startCooldown('dice2')
  }

  const flipCoin = async () => {
    if (activeCooldown) return

    vibrate()

    const result = Math.random() < 0.5 ? 'Cara' : 'Creu'
    setLastResult(prev => ({ ...prev, coin: result }))
    
    setStreaks(prev => {
      if (prev.coin.value === result) {
        return {
          ...prev,
          coin: { value: result, count: prev.coin.count + 1 }
        }
      } else {
        return {
          ...prev,
          coin: { value: result, count: 1 }
        }
      }
    })

    startCooldown('coin')
  }

  return (
    <div className="relative p-4 space-y-4 max-w-md mx-auto">
      {/* One Dice */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
        <button
          onClick={rollOneDice}
          disabled={activeCooldown !== null}
          className={`w-full p-6 relative ${
            activeCooldown !== null ? 'cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
        >
          {/* Cooldown bar */}
          {activeCooldown === 'dice1' && (
            <div
              className="absolute bottom-0 left-0 h-1 bg-purple-600 transition-all duration-75 ease-linear"
              style={{ width: `${cooldownProgress}%` }}
            />
          )}

          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-2">1 Dau (1d6)</div>
            <div className="h-20 flex items-center justify-center">
              {lastResult.dice1 !== undefined ? (
                <div className="text-6xl font-bold text-purple-600">
                  {lastResult.dice1}
                </div>
              ) : (
                <div className="text-4xl text-gray-400">🎲</div>
              )}
            </div>
            <div className="h-6">
              {streaks.dice1.count > 0 && lastResult.dice1 !== undefined && (
                <div className="text-sm text-gray-500">
                  Sèrie: {streaks.dice1.count}×
                </div>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Two Dice */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
        <button
          onClick={rollTwoDice}
          disabled={activeCooldown !== null}
          className={`w-full p-6 relative ${
            activeCooldown !== null ? 'cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
        >
          {/* Cooldown bar */}
          {activeCooldown === 'dice2' && (
            <div
              className="absolute bottom-0 left-0 h-1 bg-purple-600 transition-all duration-75 ease-linear"
              style={{ width: `${cooldownProgress}%` }}
            />
          )}

          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-2">2 Daus (2d6)</div>
            <div className="h-20 flex flex-col items-center justify-center">
              {lastResult.dice2 ? (
                <>
                  <div className="flex justify-center gap-4 mb-1">
                    <span className="text-4xl font-bold text-purple-600">{lastResult.dice2.die1}</span>
                    <span className="text-4xl font-bold text-purple-600">{lastResult.dice2.die2}</span>
                  </div>
                  <div className="text-xl font-semibold text-gray-700">
                    Suma: {lastResult.dice2.sum}
                  </div>
                </>
              ) : (
                <div className="text-4xl text-gray-400">🎲 🎲</div>
              )}
            </div>
            <div className="h-6">
              {streaks.dice2.count > 0 && lastResult.dice2 && (
                <div className="text-sm text-gray-500">
                  Sèrie: {streaks.dice2.count}×
                </div>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Coin Flip */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
        <button
          onClick={flipCoin}
          disabled={activeCooldown !== null}
          className={`w-full p-6 relative ${
            activeCooldown !== null ? 'cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
        >
          {/* Cooldown bar */}
          {activeCooldown === 'coin' && (
            <div
              className="absolute bottom-0 left-0 h-1 bg-purple-600 transition-all duration-75 ease-linear"
              style={{ width: `${cooldownProgress}%` }}
            />
          )}

          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-2">Moneda</div>
            <div className="h-20 flex items-center justify-center">
              {lastResult.coin ? (
                <div className="text-5xl font-bold text-purple-600">
                  {lastResult.coin}
                </div>
              ) : (
                <div className="text-4xl text-gray-400">🪙</div>
              )}
            </div>
            <div className="h-6">
              {streaks.coin.count > 0 && lastResult.coin && (
                <div className="text-sm text-gray-500">
                  Sèrie: {streaks.coin.count}×
                </div>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
