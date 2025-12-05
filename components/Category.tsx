import { useState } from 'react'
import type { CategoryId, QuestionData, PhotoQuestionData } from '@/lib/types'
import { HELP_CONTENT } from '@/lib/constants'
import QuestionItem from './QuestionItem'
import HelpModal from './HelpModal'

interface CategoryProps {
  categoryId: CategoryId
  title: string
  questions: QuestionData[] | PhotoQuestionData[]
  isExpanded: boolean
  onToggle: () => void
  onToggleQuestion: (index: number) => void
  onNoteChange: (index: number, note: string) => void
  isPhotoCategory?: boolean
}

export default function Category({
  categoryId,
  title,
  questions,
  isExpanded,
  onToggle,
  onToggleQuestion,
  onNoteChange,
  isPhotoCategory = false
}: CategoryProps) {
  const [showCategoryHelp, setShowCategoryHelp] = useState(false)

  const helpContent = HELP_CONTENT[categoryId]
  const answered = questions.filter((q: any) =>
    isPhotoCategory ? q.taken : q.checked
  ).length
  const percentage = Math.round((answered / questions.length) * 100)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Category Header */}
      <div
        className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">{title}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowCategoryHelp(true)
                }}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label={`Ayuda para ${title}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm opacity-90 mt-1">
              {answered} de {questions.length} ({percentage}%)
            </p>
          </div>
          <svg
            className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Questions List */}
      {isExpanded && (
        <div className="divide-y divide-gray-200">
          {questions.map((question, index) => (
            <QuestionItem
              key={index}
              question={question}
              categoryId={categoryId}
              index={index}
              onToggle={() => onToggleQuestion(index)}
              onNoteChange={(note) => onNoteChange(index, note)}
              isPhotoCategory={isPhotoCategory}
            />
          ))}
        </div>
      )}

      {/* Category Help Modal */}
      {showCategoryHelp && (
        <HelpModal
          title={helpContent.category.title}
          onClose={() => setShowCategoryHelp(false)}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">Formato:</h4>
              <p className="text-gray-700 italic">{helpContent.category.format}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">Tiempo:</h4>
                <p className="text-gray-700">{helpContent.category.timeLimit}</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">Costo:</h4>
                <p className="text-gray-700">{helpContent.category.cardCost}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-purple-900 mb-2">Consejos:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {helpContent.category.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            {helpContent.category.examples && (
              <div>
                <h4 className="font-semibold text-purple-900 mb-2">Ejemplos:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {helpContent.category.examples.map((example, i) => (
                    <li key={i}>{example}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
              <p className="text-sm font-medium text-yellow-900">
                ⚠️ {helpContent.category.important}
              </p>
            </div>
          </div>
        </HelpModal>
      )}
    </div>
  )
}
