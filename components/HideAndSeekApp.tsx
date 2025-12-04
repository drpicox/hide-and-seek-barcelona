'use client'

import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/lib/hooks/useLocalStorage'
import { INITIAL_QUESTIONS } from '@/lib/constants'
import type { CategoryData, TabId, Stats } from '@/lib/types'
import Header from './Header'
import BottomNav from './BottomNav'
import TrackingTab from './TrackingTab'
import ManualTab from './ManualTab'

export function HideAndSeekApp() {
  const [activeTab, setActiveTab] = useState<TabId>('seguimiento')
  const [questions, setQuestions] = useLocalStorage<CategoryData>(
    'hideAndSeekQuestions',
    INITIAL_QUESTIONS as CategoryData
  )
  const [stats, setStats] = useState<Stats>({
    matching: { answered: 0, total: 21 },
    measuring: { answered: 0, total: 21 },
    thermometer: { answered: 0, total: 2 },
    radar: { answered: 0, total: 10 },
    photos: { taken: 0, total: 6 }
  })

  // Calculate stats whenever questions change
  useEffect(() => {
    const newStats: Stats = {
      matching: {
        answered: questions.matching.filter(q => q.checked).length,
        total: questions.matching.length
      },
      measuring: {
        answered: questions.measuring.filter(q => q.checked).length,
        total: questions.measuring.length
      },
      thermometer: {
        answered: questions.thermometer.filter(q => q.checked).length,
        total: questions.thermometer.length
      },
      radar: {
        answered: questions.radar.filter(q => q.checked).length,
        total: questions.radar.length
      },
      photos: {
        taken: questions.photos.filter(p => p.taken).length,
        total: questions.photos.length
      }
    }
    setStats(newStats)
  }, [questions])

  const handleToggleQuestion = (category: keyof CategoryData, index: number) => {
    setQuestions(prev => {
      const newQuestions = { ...prev }
      if (category === 'photos') {
        newQuestions.photos[index] = {
          ...newQuestions.photos[index],
          taken: !newQuestions.photos[index].taken
        }
      } else {
        newQuestions[category][index] = {
          ...newQuestions[category][index],
          checked: !newQuestions[category][index].checked
        }
      }
      return newQuestions
    })
  }

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres reiniciar todas las preguntas?')) {
      setQuestions(INITIAL_QUESTIONS as CategoryData)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onReset={handleReset} stats={stats} />

      <main
        className="flex-1 overflow-y-auto pb-16"
        style={{ paddingTop: 'var(--header-height)' }}
      >
        {activeTab === 'seguimiento' ? (
          <TrackingTab
            questions={questions}
            onToggleQuestion={handleToggleQuestion}
          />
        ) : (
          <ManualTab />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
