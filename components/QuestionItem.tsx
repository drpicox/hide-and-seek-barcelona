import { useState } from 'react'
import type { CategoryId, QuestionData, PhotoQuestionData } from '@/lib/types'
import { HELP_CONTENT } from '@/lib/constants'
import HelpModal from './HelpModal'

interface QuestionItemProps {
  question: QuestionData | PhotoQuestionData
  categoryId: CategoryId
  index: number
  onToggle: () => void
  onNoteChange?: (note: string) => void
  isPhotoCategory?: boolean
}

export default function QuestionItem({
  question,
  categoryId,
  index,
  onToggle,
  onNoteChange,
  isPhotoCategory = false
}: QuestionItemProps) {
  const [showHelp, setShowHelp] = useState(false)
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteValue, setNoteValue] = useState(question.note || '')

  const isChecked = isPhotoCategory
    ? (question as PhotoQuestionData).taken
    : (question as QuestionData).checked

  const questionName = question.name
  const questionHelp = HELP_CONTENT[categoryId]?.questions?.[questionName]
  const categoryHelp = HELP_CONTENT[categoryId]?.category

  const handleHelpClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowHelp(true)
  }

  const handleNoteSave = () => {
    if (onNoteChange) {
      onNoteChange(noteValue.trim())
    }
    setIsEditingNote(false)
  }

  const handleNoteCancel = () => {
    setNoteValue(question.note || '')
    setIsEditingNote(false)
  }

  return (
    <>
      <div
        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
          isChecked ? 'bg-green-50' : ''
        }`}
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={onToggle}
            className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
            aria-label={`Marcar ${questionName}`}
          />

          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{questionName}</h5>
                {isPhotoCategory && (question as PhotoQuestionData).description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {(question as PhotoQuestionData).description}
                  </p>
                )}
              </div>

              <button
                onClick={handleHelpClick}
                className="flex-shrink-0 p-1 text-purple-600 hover:bg-purple-100 rounded-full transition-colors"
                aria-label={`Ayuda para ${questionName}`}
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
          </div>
        </div>

        {/* Notes Section - Only show when checked */}
        {isChecked && (
          <div className="mt-3 pl-8" onClick={(e) => e.stopPropagation()}>
            {!isEditingNote ? (
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  {question.note ? (
                    <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                      {question.note}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Sin notas</p>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="flex-shrink-0 p-1.5 text-purple-600 hover:bg-purple-100 rounded"
                  aria-label="Editar nota"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  placeholder="Añade una nota..."
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleNoteCancel}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleNoteSave}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Question-specific Help Modal */}
      {showHelp && questionHelp && (
        <HelpModal title={questionName} onClose={() => setShowHelp(false)}>
          <div className="space-y-4">
            {/* Hint - Highlighted */}
            <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded">
              <p className="text-purple-900 font-medium">{questionHelp.hint}</p>
            </div>

            {/* Details */}
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">Detalles:</h4>
              <p className="text-gray-700 leading-relaxed">{questionHelp.details}</p>
            </div>

            {/* Tips */}
            {questionHelp.tips && questionHelp.tips.length > 0 && (
              <div>
                <h4 className="font-semibold text-purple-900 mb-2">Consejos:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {questionHelp.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Category Context */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Contexto de la Categoría:</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Formato:</span>{' '}
                  <span className="italic">{categoryHelp.format}</span>
                </p>
                <div className="flex gap-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Tiempo:</span> {categoryHelp.timeLimit}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Costo:</span> {categoryHelp.cardCost}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </HelpModal>
      )}
    </>
  )
}
