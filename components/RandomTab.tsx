'use client'

import { useState, useRef, useEffect } from 'react'
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
  const [spinningValue, setSpinningValue] = useState<{
    dice1?: number
    dice2?: { die1: number; die2: number }
    coin?: 'Cara' | 'Creu'
  }>({})
  const [isSpinning, setIsSpinning] = useState(false)
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current)
    }
  }, [])

  // Haptic feedback helper
  const vibrate = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  // Spinning animation that shows random values
  const startSpinning = (generator: 'dice1' | 'dice2' | 'coin', finalResult: any) => {
    setIsSpinning(true)
    const spinDuration = 800 // Spin for 800ms
    const spinInterval = 50 // Update every 50ms
    let elapsed = 0

    spinIntervalRef.current = setInterval(() => {
      elapsed += spinInterval
      
      // Generate random spinning values
      if (generator === 'dice1') {
        setSpinningValue(prev => ({ ...prev, dice1: Math.floor(Math.random() * 6) + 1 }))
      } else if (generator === 'dice2') {
        setSpinningValue(prev => ({ 
          ...prev, 
          dice2: { 
            die1: Math.floor(Math.random() * 6) + 1, 
            die2: Math.floor(Math.random() * 6) + 1 
          } 
        }))
      } else if (generator === 'coin') {
        setSpinningValue(prev => ({ ...prev, coin: Math.random() < 0.5 ? 'Cara' : 'Creu' }))
      }

      // Stop spinning and show final result
      if (elapsed >= spinDuration) {
        if (spinIntervalRef.current) clearInterval(spinIntervalRef.current)
        setIsSpinning(false)
        setLastResult(prev => ({ ...prev, ...finalResult }))
      }
    }, spinInterval)
  }

  // Cooldown handler with sweeping gradient animation
  const startCooldown = (generator: 'dice1' | 'dice2' | 'coin') => {
    setActiveCooldown(generator)
    setCooldownProgress(0)
    
    const cooldownDuration = 2000 // 2 seconds
    const intervalTime = 20 // Update every 20ms for smooth animation
    const steps = cooldownDuration / intervalTime
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      // Progress goes from 0 to 130 (so the band fully exits on the right)
      setCooldownProgress((currentStep / steps) * 130)
      
      if (currentStep >= steps) {
        clearInterval(interval)
        setActiveCooldown(null)
        setCooldownProgress(0)
      }
    }, intervalTime)
  }

  // Gradient style that sweeps across
  const getGradientStyle = (isActive: boolean) => {
    if (!isActive) return {}
    
    const bandWidth = 30
    const start = cooldownProgress - bandWidth
    const end = cooldownProgress
    
    return {
      background: `linear-gradient(to right, 
        white ${Math.max(0, start)}%, 
        rgba(124, 58, 237, 0.2) ${Math.max(0, start + bandWidth/3)}%,
        rgba(124, 58, 237, 0.3) ${(start + end) / 2}%,
        rgba(124, 58, 237, 0.2) ${Math.min(100, end - bandWidth/3)}%,
        white ${Math.min(100, end)}%
      )`
    }
  }

  // Generator functions
  const rollOneDice = () => {
    if (activeCooldown) return
    vibrate()
    const result = Math.floor(Math.random() * 6) + 1
    setStreaks(prev => {
      if (prev.dice1.value === result) {
        return { ...prev, dice1: { value: result, count: prev.dice1.count + 1 } }
      } else {
        return { ...prev, dice1: { value: result, count: 1 } }
      }
    })
    startSpinning('dice1', { dice1: result })
    startCooldown('dice1')
  }

  const rollTwoDice = () => {
    if (activeCooldown) return
    vibrate()
    const die1 = Math.floor(Math.random() * 6) + 1
    const die2 = Math.floor(Math.random() * 6) + 1
    const sum = die1 + die2
    setStreaks(prev => {
      if (prev.dice2.value === sum) {
        return { ...prev, dice2: { value: sum, count: prev.dice2.count + 1 } }
      } else {
        return { ...prev, dice2: { value: sum, count: 1 } }
      }
    })
    startSpinning('dice2', { dice2: { die1, die2, sum } })
    startCooldown('dice2')
  }

  const flipCoin = () => {
    if (activeCooldown) return
    vibrate()
    const result = Math.random() < 0.5 ? 'Cara' : 'Creu'
    setStreaks(prev => {
      if (prev.coin.value === result) {
        return { ...prev, coin: { value: result, count: prev.coin.count + 1 } }
      } else {
        return { ...prev, coin: { value: result, count: 1 } }
      }
    })
    startSpinning('coin', { coin: result })
    startCooldown('coin')
  }

  // Helper to get displayed value (spinning or final)
  const getDice1Display = () => {
    if (activeCooldown === 'dice1' && isSpinning && spinningValue.dice1 !== undefined) {
      return { value: spinningValue.dice1, isSpinning: true }
    }
    return { value: lastResult.dice1, isSpinning: false }
  }

  const getDice2Display = () => {
    if (activeCooldown === 'dice2' && isSpinning && spinningValue.dice2) {
      return { value: spinningValue.dice2, isSpinning: true }
    }
    return { value: lastResult.dice2, isSpinning: false }
  }

  const getCoinDisplay = () => {
    if (activeCooldown === 'coin' && isSpinning && spinningValue.coin) {
      return { value: spinningValue.coin, isSpinning: true }
    }
    return { value: lastResult.coin, isSpinning: false }
  }

  const dice1Display = getDice1Display()
  const dice2Display = getDice2Display()
  const coinDisplay = getCoinDisplay()

  return (
    <div className="relative p-4 space-y-4 max-w-md mx-auto">
      {/* One Dice */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <button
          onClick={rollOneDice}
          disabled={activeCooldown !== null}
          className={`w-full p-6 transition-colors ${
            activeCooldown !== null ? 'cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
          style={getGradientStyle(activeCooldown === 'dice1')}
        >
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-2">1 Dau (1d6)</div>
            <div className="h-20 flex items-center justify-center">
              {dice1Display.value !== undefined ? (
                <div className={`text-6xl font-bold transition-colors ${dice1Display.isSpinning ? 'text-purple-400' : 'text-purple-600'}`}>
                  {dice1Display.value}
                </div>
              ) : (
                <div className="text-4xl text-gray-400">🎲</div>
              )}
            </div>
            <div className="h-6">
              {streaks.dice1.count > 0 && lastResult.dice1 !== undefined && !dice1Display.isSpinning && (
                <div className="text-sm text-gray-500">Sèrie: {streaks.dice1.count}×</div>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Two Dice */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <button
          onClick={rollTwoDice}
          disabled={activeCooldown !== null}
          className={`w-full p-6 transition-colors ${
            activeCooldown !== null ? 'cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
          style={getGradientStyle(activeCooldown === 'dice2')}
        >
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-2">2 Daus (2d6)</div>
            <div className="h-20 flex flex-col items-center justify-center">
              {dice2Display.value ? (
                <>
                  <div className="flex justify-center gap-4 mb-1">
                    <span className={`text-4xl font-bold transition-colors ${dice2Display.isSpinning ? 'text-purple-400' : 'text-purple-600'}`}>
                      {dice2Display.value.die1}
                    </span>
                    <span className={`text-4xl font-bold transition-colors ${dice2Display.isSpinning ? 'text-purple-400' : 'text-purple-600'}`}>
                      {dice2Display.value.die2}
                    </span>
                  </div>
                  <div className={`text-xl font-semibold transition-colors ${dice2Display.isSpinning ? 'text-gray-500' : 'text-gray-700'}`}>
                    Suma: {dice2Display.value.die1 + dice2Display.value.die2}
                  </div>
                </>
              ) : (
                <div className="text-4xl text-gray-400">🎲 🎲</div>
              )}
            </div>
            <div className="h-6">
              {streaks.dice2.count > 0 && lastResult.dice2 && !dice2Display.isSpinning && (
                <div className="text-sm text-gray-500">Sèrie: {streaks.dice2.count}×</div>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Coin Flip */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <button
          onClick={flipCoin}
          disabled={activeCooldown !== null}
          className={`w-full p-6 transition-colors ${
            activeCooldown !== null ? 'cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
          style={getGradientStyle(activeCooldown === 'coin')}
        >
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-2">Moneda</div>
            <div className="h-20 flex items-center justify-center">
              {coinDisplay.value ? (
                <div className={`text-5xl font-bold transition-colors ${coinDisplay.isSpinning ? 'text-purple-400' : 'text-purple-600'}`}>
                  {coinDisplay.value}
                </div>
              ) : (
                <div className="text-4xl text-gray-400">🪙</div>
              )}
            </div>
            <div className="h-6">
              {streaks.coin.count > 0 && lastResult.coin && !coinDisplay.isSpinning && (
                <div className="text-sm text-gray-500">Sèrie: {streaks.coin.count}×</div>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
