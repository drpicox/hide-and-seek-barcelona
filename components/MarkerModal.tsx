'use client'

import { useState } from 'react'

interface MarkerModalProps {
  initialNote: string
  onSave: (note: string) => void
  onCancel: () => void
}

export default function MarkerModal({ initialNote, onSave, onCancel }: MarkerModalProps) {
  const [note, setNote] = useState(initialNote)

  const handleSave = () => {
    onSave(note.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {initialNote ? 'Editar Marcador' : 'Nou Marcador'}
        </h3>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Afegeix una nota per aquest marcador..."
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          rows={4}
          autoFocus
        />

        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
