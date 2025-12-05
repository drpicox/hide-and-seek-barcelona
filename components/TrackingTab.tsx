import { useState } from 'react'
import type { CategoryData, CategoryId } from '@/lib/types'
import { HIDER_COLORS } from '@/lib/types'
import { VERY_SMALL_QUESTIONS } from '@/lib/constants'
import Category from './Category'

interface TrackingTabProps {
  questions: CategoryData
  verySmall: boolean
  onToggleQuestion: (category: CategoryId, index: number) => void
  onNoteChange: (category: CategoryId, index: number, note: string) => void
  activeHider: number
}

export default function TrackingTab({ questions, verySmall, onToggleQuestion, onNoteChange, activeHider }: TrackingTabProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<CategoryId>>(
    new Set(['matching', 'measuring', 'thermometer', 'radar', 'photos'])
  )

  const toggleCategory = (categoryId: CategoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  // Use Very Small questions for thermometer and radar when enabled
  const thermometerQuestions = verySmall ? VERY_SMALL_QUESTIONS.thermometer : questions.thermometer
  const radarQuestions = verySmall ? VERY_SMALL_QUESTIONS.radar : questions.radar

  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      {/* Very Small Banner */}
      {verySmall && (
        <div className="bg-yellow-400 text-yellow-900 text-center py-3 px-4 text-sm font-medium rounded-lg shadow-md">
          <span className="text-lg">⚠️</span> <strong>Mode Very Small:</strong> Divideix en dos tots els temps i distàncies de les cartes (arrodonir amunt)
        </div>
      )}

      <Category
        categoryId="matching"
        title="Matching"
        questions={questions.matching}
        isExpanded={expandedCategories.has('matching')}
        onToggle={() => toggleCategory('matching')}
        onToggleQuestion={(index) => onToggleQuestion('matching', index)}
        onNoteChange={(index, note) => onNoteChange('matching', index, note)}
      />

      <Category
        categoryId="measuring"
        title="Measuring"
        questions={questions.measuring}
        isExpanded={expandedCategories.has('measuring')}
        onToggle={() => toggleCategory('measuring')}
        onToggleQuestion={(index) => onToggleQuestion('measuring', index)}
        onNoteChange={(index, note) => onNoteChange('measuring', index, note)}
      />

      <Category
        categoryId="thermometer"
        title="Thermometer"
        questions={thermometerQuestions}
        isExpanded={expandedCategories.has('thermometer')}
        onToggle={() => toggleCategory('thermometer')}
        onToggleQuestion={(index) => onToggleQuestion('thermometer', index)}
        onNoteChange={(index, note) => onNoteChange('thermometer', index, note)}
      />

      <Category
        categoryId="radar"
        title="Radar"
        questions={radarQuestions}
        isExpanded={expandedCategories.has('radar')}
        onToggle={() => toggleCategory('radar')}
        onToggleQuestion={(index) => onToggleQuestion('radar', index)}
        onNoteChange={(index, note) => onNoteChange('radar', index, note)}
      />

      <Category
        categoryId="photos"
        title="Photos"
        questions={questions.photos}
        isExpanded={expandedCategories.has('photos')}
        onToggle={() => toggleCategory('photos')}
        onToggleQuestion={(index) => onToggleQuestion('photos', index)}
        onNoteChange={(index, note) => onNoteChange('photos', index, note)}
        isPhotoCategory
      />
    </div>
  )
}
