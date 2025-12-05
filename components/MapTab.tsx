'use client'

import { useLocalStorage } from '@/lib/hooks/useLocalStorage'
import { INITIAL_MAPS_DATA } from '@/lib/constants'
import type { MapsData } from '@/lib/types'
import MapViewer from './MapViewer'

interface MapTabProps {
  mapType: 'mapa' | 'barris'
  activeHider: number
  onHiderChange: (hider: number) => void
}

export default function MapTab({ mapType, activeHider, onHiderChange }: MapTabProps) {
  const [mapsData, setMapsData] = useLocalStorage<MapsData>(
    'hideAndSeekMaps',
    INITIAL_MAPS_DATA as MapsData
  )

  const selectedMap = mapType === 'mapa' ? 'planolJoc' : 'barrisDistrictes'
  const currentMapData = mapsData[selectedMap]

  const handleAddMarker = (x: number, y: number, note: string) => {
    setMapsData(prev => ({
      ...prev,
      [selectedMap]: {
        ...prev[selectedMap],
        markers: [
          ...prev[selectedMap].markers,
          {
            id: `marker-${Date.now()}`,
            x,
            y,
            note,
            timestamp: Date.now()
          }
        ]
      }
    }))
  }

  const handleUpdateMarker = (markerId: string, note: string) => {
    setMapsData(prev => ({
      ...prev,
      [selectedMap]: {
        ...prev[selectedMap],
        markers: prev[selectedMap].markers.map(marker =>
          marker.id === markerId ? { ...marker, note } : marker
        )
      }
    }))
  }

  const handleDeleteMarker = (markerId: string) => {
    setMapsData(prev => ({
      ...prev,
      [selectedMap]: {
        ...prev[selectedMap],
        markers: prev[selectedMap].markers.filter(marker => marker.id !== markerId)
      }
    }))
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Map Viewer */}
      <div className="flex-1 overflow-hidden">
        <MapViewer
          mapData={currentMapData}
          onAddMarker={handleAddMarker}
          onUpdateMarker={handleUpdateMarker}
          onDeleteMarker={handleDeleteMarker}
          activeHider={activeHider}
          onHiderChange={onHiderChange}
        />
      </div>
    </div>
  )
}
