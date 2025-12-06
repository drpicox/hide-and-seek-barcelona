'use client'

import { useState, useEffect } from 'react'
import { useLocalStorage } from '@/lib/hooks/useLocalStorage'
import { INITIAL_QUESTIONS } from '@/lib/constants'
import type { CategoryData, TabId, Stats, AllHidersData } from '@/lib/types'
import { HIDER_COLORS } from '@/lib/types'
import Header from './Header'
import BottomNav from './BottomNav'
import TrackingTab from './TrackingTab'
import ManualTab from './ManualTab'
import MapTab from './MapTab'
import RandomTab from './RandomTab'

export function HideAndSeekApp() {
  const [activeTab, setActiveTab] = useState<TabId>('qa')
  const [activeHider, setActiveHider] = useLocalStorage<number>('hideAndSeekActiveHider', 0)
  const [verySmall, setVerySmall] = useLocalStorage<boolean>('hideAndSeekVerySmall', false)
  const [allHidersQuestions, setAllHidersQuestions] = useLocalStorage<AllHidersData>(
    'hideAndSeekAllHiders',
    [
      INITIAL_QUESTIONS as CategoryData,
      INITIAL_QUESTIONS as CategoryData,
      INITIAL_QUESTIONS as CategoryData
    ]
  )
  const [stats, setStats] = useState<Stats>({
    matching: { answered: 0, total: 21 },
    measuring: { answered: 0, total: 21 },
    thermometer: { answered: 0, total: 2 },
    radar: { answered: 0, total: 10 },
    photos: { taken: 0, total: 6 }
  })

  // Current hider's questions
  const questions = allHidersQuestions[activeHider]

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
    setAllHidersQuestions(prev => {
      const newAllHiders = [...prev] as AllHidersData
      const newQuestions = { ...newAllHiders[activeHider] }
      if (category === 'photos') {
        newQuestions.photos = [...newQuestions.photos]
        newQuestions.photos[index] = {
          ...newQuestions.photos[index],
          taken: !newQuestions.photos[index].taken
        }
      } else {
        newQuestions[category] = [...newQuestions[category]]
        newQuestions[category][index] = {
          ...newQuestions[category][index],
          checked: !newQuestions[category][index].checked
        }
      }
      newAllHiders[activeHider] = newQuestions
      return newAllHiders
    })
  }

  const handleNoteChange = (category: keyof CategoryData, index: number, note: string) => {
    setAllHidersQuestions(prev => {
      const newAllHiders = [...prev] as AllHidersData
      const newQuestions = { ...newAllHiders[activeHider] }
      if (category === 'photos') {
        newQuestions.photos = [...newQuestions.photos]
        newQuestions.photos[index] = {
          ...newQuestions.photos[index],
          note
        }
      } else {
        newQuestions[category] = [...newQuestions[category]]
        newQuestions[category][index] = {
          ...newQuestions[category][index],
          note
        }
      }
      newAllHiders[activeHider] = newQuestions
      return newAllHiders
    })
  }

  const handleReset = () => {
    if (confirm(`Reiniciar les preguntes de ${HIDER_COLORS[activeHider].name}?`)) {
      setAllHidersQuestions(prev => {
        const newAllHiders = [...prev] as AllHidersData
        newAllHiders[activeHider] = INITIAL_QUESTIONS as CategoryData
        return newAllHiders
      })
    }
  }

  const showHeader = activeTab === 'qa' || activeTab === 'manual'

  const isMapTab = activeTab === 'mapa' || activeTab === 'barris'

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {showHeader && (
        <Header
          onReset={handleReset}
          stats={stats}
          verySmall={verySmall}
          onVerySmallToggle={() => setVerySmall(!verySmall)}
          activeHider={activeHider}
          onHiderChange={setActiveHider}
        />
      )}

      <main
        className={`flex-1 ${isMapTab ? 'overflow-hidden' : 'overflow-y-auto'}`}
        style={{
          marginTop: showHeader ? 'var(--header-height)' : '0',
          marginBottom: 'var(--bottom-nav-height)'
        }}
      >
        {activeTab === 'qa' ? (
          <TrackingTab
            questions={questions}
            verySmall={verySmall}
            onToggleQuestion={handleToggleQuestion}
            onNoteChange={handleNoteChange}
            activeHider={activeHider}
          />
        ) : activeTab === 'random' ? (
          <RandomTab />
        ) : activeTab === 'manual' ? (
          <ManualTab />
        ) : activeTab === 'mapa' ? (
          <MapTab mapType="mapa" activeHider={activeHider} onHiderChange={setActiveHider} />
        ) : (
          <MapTab mapType="barris" activeHider={activeHider} onHiderChange={setActiveHider} />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
