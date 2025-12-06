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
          onClick={() => onTabChange('qa')}
          className={`flex-1 flex flex-col items-center justify-center transition-colors ${
            activeTab === 'qa'
              ? 'text-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
          }`}
          aria-label="Q&A"
          aria-current={activeTab === 'qa' ? 'page' : undefined}
        >
          <svg
            className="w-5 h-5"
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
          <span className="text-[10px] font-medium">Q&A</span>
        </button>

        <button
          onClick={() => onTabChange('random')}
          className={`flex-1 flex flex-col items-center justify-center transition-colors ${
            activeTab === 'random'
              ? 'text-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
          }`}
          aria-label="Random"
          aria-current={activeTab === 'random' ? 'page' : undefined}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
            <circle cx="7" cy="6" r="1.5" fill="currentColor" />
            <circle cx="7" cy="18" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="17" cy="6" r="1.5" fill="currentColor" />
            <circle cx="17" cy="18" r="1.5" fill="currentColor" />
          </svg>
          <span className="text-[10px] font-medium">Random</span>
        </button>

        <button
          onClick={() => onTabChange('manual')}
          className={`flex-1 flex flex-col items-center justify-center transition-colors ${
            activeTab === 'manual'
              ? 'text-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
          }`}
          aria-label="Manual"
          aria-current={activeTab === 'manual' ? 'page' : undefined}
        >
          <svg
            className="w-5 h-5"
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
          <span className="text-[10px] font-medium">Manual</span>
        </button>

        <button
          onClick={() => onTabChange('mapa')}
          className={`flex-1 flex flex-col items-center justify-center transition-colors ${
            activeTab === 'mapa'
              ? 'text-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
          }`}
          aria-label="Mapa"
          aria-current={activeTab === 'mapa' ? 'page' : undefined}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <span className="text-[10px] font-medium">Mapa</span>
        </button>

        <button
          onClick={() => onTabChange('barris')}
          className={`flex-1 flex flex-col items-center justify-center transition-colors ${
            activeTab === 'barris'
              ? 'text-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
          }`}
          aria-label="Barris"
          aria-current={activeTab === 'barris' ? 'page' : undefined}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span className="text-[10px] font-medium">Barris</span>
        </button>
      </div>
    </nav>
  )
}
