import type { Stats } from '@/lib/types'

interface HeaderProps {
  onReset: () => void
  stats: Stats
}

export default function Header({ onReset, stats }: HeaderProps) {
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
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-bold">Hide & Seek</h1>
          <p className="text-xs opacity-90">
            {totalAnswered} de {totalQuestions} ({percentage}%)
          </p>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          aria-label="Reiniciar todas las preguntas"
        >
          Reiniciar
        </button>
      </div>
    </header>
  )
}
