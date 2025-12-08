import { useState } from 'react'
import type { Stats, HiderInfo } from '@/lib/types'

interface HeaderProps {
  onReset: () => void
  stats: Stats
  verySmall: boolean
  onVerySmallToggle: () => void
  activeHider: number
  onHiderChange: (hider: number) => void
  allHiders: HiderInfo[]
  onAddHider: () => void
  onDeleteHider: (index: number) => void
  onHiderNameChange: (index: number, name: string) => void
}

export default function Header({
  onReset,
  stats,
  verySmall,
  onVerySmallToggle,
  activeHider,
  onHiderChange,
  allHiders,
  onAddHider,
  onDeleteHider,
  onHiderNameChange
}: HeaderProps) {
  const [editingHider, setEditingHider] = useState<number | null>(null)

  const totalAnswered =
    stats.matching.answered +
    stats.measuring.answered +
    stats.thermometer.answered +
    stats.radar.answered +
    stats.photos.taken

  const totalQuestions =
    stats.matching.total +
    stats.measuring.total +
    stats.thermometer.total +
    stats.radar.total +
    stats.photos.total

  const percentage = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg"
      style={{ height: 'var(--header-height)' }}
    >
      <div className="container mx-auto px-3 h-full flex items-center justify-between gap-2">
        {/* Hider selector with names */}
        <div className="flex gap-1 overflow-x-auto max-w-[50%]">
          {allHiders.map((hider, idx) => (
            <div key={idx} className="flex items-center gap-1 flex-shrink-0">
              {editingHider === idx ? (
                <input
                  type="text"
                  value={hider.name}
                  onChange={(e) => onHiderNameChange(idx, e.target.value)}
                  onBlur={() => setEditingHider(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setEditingHider(null)
                  }}
                  autoFocus
                  className="px-1 py-0.5 text-xs rounded border-2 w-16 text-gray-900"
                  style={{ borderColor: hider.color }}
                />
              ) : (
                <button
                  onClick={() => onHiderChange(idx)}
                  onDoubleClick={() => setEditingHider(idx)}
                  className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                    activeHider === idx
                      ? 'ring-2 ring-white text-white'
                      : 'text-gray-800 bg-white/90 hover:bg-white'
                  }`}
                  style={{
                    backgroundColor: activeHider === idx ? hider.color : undefined,
                    borderWidth: '2px',
                    borderColor: hider.color
                  }}
                  title="Doble clic per editar nom"
                >
                  {hider.name}
                </button>
              )}
              {allHiders.length > 1 && (
                <button
                  onClick={() => onDeleteHider(idx)}
                  className="text-red-300 hover:text-red-100 px-1 text-xs font-bold"
                  title={`Esborrar ${hider.name}`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            onClick={onAddHider}
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-bold flex-shrink-0"
            title="Afegir nou hider"
          >
            +
          </button>
        </div>

        {/* Stats */}
        <div className="flex-1 text-center min-w-0">
          <p className="text-sm font-medium truncate">
            {allHiders[activeHider]?.name || 'Hider'}: {totalAnswered}/{totalQuestions}
          </p>
          <p className="text-xs opacity-80">{percentage}%</p>
        </div>

        {/* Actions */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={onVerySmallToggle}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              verySmall
                ? 'bg-green-500 text-white'
                : 'bg-white/20 hover:bg-white/30'
            }`}
            title={verySmall ? 'Mode Very Small actiu' : 'Activar mode Very Small'}
          >
            {verySmall ? '✓V' : 'V'}
          </button>

          <button
            onClick={onReset}
            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
            title="Reiniciar preguntes"
          >
            ↺
          </button>
        </div>
      </div>
    </header>
  )
}
