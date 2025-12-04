import { useState } from 'react'
import type { CategoryData, CategoryId } from '@/lib/types'
import Category from './Category'

interface TrackingTabProps {
  questions: CategoryData
  onToggleQuestion: (category: CategoryId, index: number) => void
}

export default function TrackingTab({ questions, onToggleQuestion }: TrackingTabProps) {
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

  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      <Category
        categoryId="matching"
        title="Matching"
        questions={questions.matching}
        isExpanded={expandedCategories.has('matching')}
        onToggle={() => toggleCategory('matching')}
        onToggleQuestion={(index) => onToggleQuestion('matching', index)}
      />

      <Category
        categoryId="measuring"
        title="Measuring"
        questions={questions.measuring}
        isExpanded={expandedCategories.has('measuring')}
        onToggle={() => toggleCategory('measuring')}
        onToggleQuestion={(index) => onToggleQuestion('measuring', index)}
      />

      <Category
        categoryId="thermometer"
        title="Thermometer"
        questions={questions.thermometer}
        isExpanded={expandedCategories.has('thermometer')}
        onToggle={() => toggleCategory('thermometer')}
        onToggleQuestion={(index) => onToggleQuestion('thermometer', index)}
      />

      <Category
        categoryId="radar"
        title="Radar"
        questions={questions.radar}
        isExpanded={expandedCategories.has('radar')}
        onToggle={() => toggleCategory('radar')}
        onToggleQuestion={(index) => onToggleQuestion('radar', index)}
      />

      <Category
        categoryId="photos"
        title="Photos"
        questions={questions.photos}
        isExpanded={expandedCategories.has('photos')}
        onToggle={() => toggleCategory('photos')}
        onToggleQuestion={(index) => onToggleQuestion('photos', index)}
        isPhotoCategory
      />
    </div>
  )
}
