import type { Stats } from '@/lib/types'
import { HIDER_COLORS } from '@/lib/types'

interface HeaderProps {
  onReset: () => void
  stats: Stats
  verySmall: boolean
  onVerySmallToggle: () => void
  activeHider: number
  onHiderChange: (hider: number) => void
}

export default function Header({ onReset, stats, verySmall, onVerySmallToggle, activeHider, onHiderChange }: HeaderProps) {
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
        {/* Hider selector */}
        <div className="flex gap-1">
          {HIDER_COLORS.map((hider, idx) => (
            <button
              key={idx}
              onClick={() => onHiderChange(idx)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                activeHider === idx
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-purple-700 scale-110'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{ backgroundColor: hider.color }}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex-1 text-center">
          <p className="text-sm font-medium">
            {HIDER_COLORS[activeHider].name}: {totalAnswered}/{totalQuestions}
          </p>
          <p className="text-xs opacity-80">{percentage}%</p>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button
            onClick={onVerySmallToggle}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              verySmall
                ? 'bg-green-500 text-white'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {verySmall ? '✓' : 'S'}
          </button>

          <button
            onClick={onReset}
            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
          >
            ↺
          </button>
        </div>
      </div>
    </header>
  )
}
