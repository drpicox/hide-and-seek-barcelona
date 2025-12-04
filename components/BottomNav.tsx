import type { TabId } from '@/lib/types'

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      style={{
        height: 'var(--bottom-nav-height)',
        paddingBottom: 'var(--safe-area-inset-bottom, 0)'
      }}
    >
      <div className="container mx-auto h-full flex">
        <button
          onClick={() => onTabChange('seguimiento')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'seguimiento'
              ? 'text-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
          }`}
          aria-label="Seguimiento"
          aria-current={activeTab === 'seguimiento' ? 'page' : undefined}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className="text-xs font-medium">Seguimiento</span>
        </button>

        <button
          onClick={() => onTabChange('manual')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'manual'
              ? 'text-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
          }`}
          aria-label="Manual"
          aria-current={activeTab === 'manual' ? 'page' : undefined}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span className="text-xs font-medium">Manual</span>
        </button>
      </div>
    </nav>
  )
}
