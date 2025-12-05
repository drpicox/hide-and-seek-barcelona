'use client'

import type { MapMarker } from '@/lib/types'

interface MarkerListProps {
  markers: MapMarker[]
  onMarkerClick: (marker: MapMarker) => void
  onMarkerDelete: (markerId: string) => void
}

export default function MarkerList({ markers, onMarkerClick, onMarkerDelete }: MarkerListProps) {
  const sortedMarkers = [...markers].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">
          Marcadors ({markers.length})
        </h3>
      </div>

      {/* Markers List */}
      <div className="flex-1 overflow-y-auto">
        {sortedMarkers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">No hi ha marcadors</p>
            <p className="text-xs mt-1">Fes clic al mode Marcador per afegir-ne</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedMarkers.map(marker => (
              <div
                key={marker.id}
                className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onMarkerClick(marker)}
              >
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 line-clamp-2">
                      {marker.note || 'Sense nota'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ({Math.round(marker.x)}, {Math.round(marker.y)})
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(marker.timestamp).toLocaleString('ca-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Eliminar aquest marcador?')) {
                        onMarkerDelete(marker.id)
                      }
                    }}
                    className="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    aria-label="Eliminar marcador"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
