'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { MapData, MapMarker } from '@/lib/types'
import DistanceTool from './DistanceTool'
import MarkerList from './MarkerList'
import MarkerModal from './MarkerModal'
import { STATIONS_PLANOLJOC, findNearestStation } from '@/lib/stations'

const basePath = process.env.NODE_ENV === 'production' ? '/hide-and-seek-barcelona' : ''

type ViewMode = 'view' | 'measure' | 'marker' | 'findStation'

interface MapViewerProps {
  mapData: MapData
  onAddMarker: (x: number, y: number, note: string) => void
  onUpdateMarker: (markerId: string, note: string) => void
  onDeleteMarker: (markerId: string) => void
  activeHider?: number
  onHiderChange?: (hider: number) => void
}

export default function MapViewer({
  mapData,
  onAddMarker,
  onUpdateMarker,
  onDeleteMarker,
  activeHider = 0,
  onHiderChange
}: MapViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [viewMode, setViewMode] = useState<ViewMode>('view')
  const [showMarkerModal, setShowMarkerModal] = useState(false)
  const [pendingMarkerPos, setPendingMarkerPos] = useState<{ x: number; y: number } | null>(null)
  const [editingMarker, setEditingMarker] = useState<MapMarker | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showStations, setShowStations] = useState(false)
  const [selectedStation, setSelectedStation] = useState<{ name: string; x: number; y: number } | null>(null)
  const [nearestStationInfo, setNearestStationInfo] = useState<{ name: string; distance: number; x: number; y: number } | null>(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [minZoom, setMinZoom] = useState(1)
  const [showMoreOptions, setShowMoreOptions] = useState(false)

  // Touch state
  const [lastTouchDistance, setLastTouchDistance] = useState(0)
  const [touchStartTime, setTouchStartTime] = useState(0)
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const initializedRef = useRef(false)

  // Only show stations for Plànol del JOC
  const isGameMap = mapData.name === 'Plànol del JOC'

  // Calculate meters per pixel based on image width = 3400m
  const metersPerPixel = imageSize.width > 0 ? 3400 / imageSize.width : 1

  // Calculate zoom levels and set initial view
  useEffect(() => {
    if (imageSize.width > 0 && imageSize.height > 0 && containerSize.width > 0 && containerSize.height > 0) {
      // Zoom to fit entire image in container
      const fitZoom = Math.min(containerSize.width / imageSize.width, containerSize.height / imageSize.height)
      // Allow zoom out to 50% of fit
      const newMinZoom = fitZoom * 0.5
      setMinZoom(newMinZoom)

      // Initialize zoom and pan only once
      if (!initializedRef.current) {
        initializedRef.current = true
        const initialZoom = fitZoom
        setZoom(initialZoom)
        // Center the image
        const scaledWidth = imageSize.width * initialZoom
        const scaledHeight = imageSize.height * initialZoom
        setPan({
          x: (containerSize.width - scaledWidth) / 2,
          y: (containerSize.height - scaledHeight) / 2
        })
      }
    }
  }, [imageSize, containerSize])

  // Update container size on resize
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        })
      }
    }

    updateContainerSize()
    window.addEventListener('resize', updateContainerSize)
    return () => window.removeEventListener('resize', updateContainerSize)
  }, [])

  // Handle image load
  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight
      })
    }
  }

  // Constrain pan to keep image reasonably positioned
  const constrainPan = useCallback((newPan: { x: number; y: number }, currentZoom: number) => {
    if (imageSize.width === 0 || containerSize.width === 0) return newPan

    const scaledWidth = imageSize.width * currentZoom
    const scaledHeight = imageSize.height * currentZoom

    let constrainedX = newPan.x
    let constrainedY = newPan.y

    // Horizontal constraints
    if (scaledWidth <= containerSize.width) {
      // Image fits horizontally - center it
      constrainedX = (containerSize.width - scaledWidth) / 2
    } else {
      // Image larger than container - keep edges in view
      const maxX = 0
      const minX = containerSize.width - scaledWidth
      constrainedX = Math.min(maxX, Math.max(minX, newPan.x))
    }

    // Vertical constraints
    if (scaledHeight <= containerSize.height) {
      // Image fits vertically - center it
      constrainedY = (containerSize.height - scaledHeight) / 2
    } else {
      // Image larger than container - keep edges in view
      const maxY = 0
      const minY = containerSize.height - scaledHeight
      constrainedY = Math.min(maxY, Math.max(minY, newPan.y))
    }

    return { x: constrainedX, y: constrainedY }
  }, [imageSize, containerSize])

  // Apply constraints whenever zoom or pan changes
  useEffect(() => {
    const constrained = constrainPan(pan, zoom)
    if (constrained.x !== pan.x || constrained.y !== pan.y) {
      setPan(constrained)
    }
  }, [zoom, pan, constrainPan])

  // Handle wheel zoom with focal point
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(minZoom, Math.min(5, zoom * delta))

    const zoomFactor = newZoom / zoom
    const newPanX = mouseX - (mouseX - pan.x) * zoomFactor
    const newPanY = mouseY - (mouseY - pan.y) * zoomFactor

    setZoom(newZoom)
    setPan(constrainPan({ x: newPanX, y: newPanY }, newZoom))
  }

  // Get distance between two touch points
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Get center point between two touches
  const getTouchCenter = (touches: React.TouchList, rect: DOMRect) => {
    if (touches.length < 2) {
      return { x: touches[0].clientX - rect.left, y: touches[0].clientY - rect.top }
    }
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2 - rect.left,
      y: (touches[0].clientY + touches[1].clientY) / 2 - rect.top
    }
  }

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    if (e.touches.length === 2) {
      e.preventDefault()
      setLastTouchDistance(getTouchDistance(e.touches))
      setIsDragging(false)
    } else if (e.touches.length === 1) {
      setTouchStartTime(Date.now())
      setTouchStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY })
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      })
    }
  }

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    if (e.touches.length === 2) {
      e.preventDefault()
      const newDistance = getTouchDistance(e.touches)
      const newCenter = getTouchCenter(e.touches, rect)

      if (lastTouchDistance > 0) {
        const scale = newDistance / lastTouchDistance
        const newZoom = Math.max(minZoom, Math.min(5, zoom * scale))

        const zoomFactor = newZoom / zoom
        const newPanX = newCenter.x - (newCenter.x - pan.x) * zoomFactor
        const newPanY = newCenter.y - (newCenter.y - pan.y) * zoomFactor

        setZoom(newZoom)
        setPan(constrainPan({ x: newPanX, y: newPanY }, newZoom))
      }

      setLastTouchDistance(newDistance)
    } else if (e.touches.length === 1 && isDragging) {
      e.preventDefault()
      const newPan = {
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      }
      setPan(constrainPan(newPan, zoom))
    }
  }

  // Handle touch end
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchDuration = Date.now() - touchStartTime
    const touch = e.changedTouches[0]
    const moveDistance = Math.sqrt(
      Math.pow(touch.clientX - touchStartPos.x, 2) +
      Math.pow(touch.clientY - touchStartPos.y, 2)
    )

    // Detect tap (short duration, small movement)
    if (touchDuration < 300 && moveDistance < 10 && e.changedTouches.length === 1) {
      const rect = imageRef.current?.getBoundingClientRect()
      if (rect) {
        const x = Math.round((touch.clientX - rect.left) / zoom)
        const y = Math.round((touch.clientY - rect.top) / zoom)

        if (x >= 0 && y >= 0 && x <= imageSize.width && y <= imageSize.height) {
          handleTap(x, y)
        }
      }
    }

    setIsDragging(false)
    setLastTouchDistance(0)
  }

  // Handle tap on map
  const handleTap = (x: number, y: number) => {
    if (viewMode === 'marker') {
      setPendingMarkerPos({ x, y })
      setShowMarkerModal(true)
    } else if (viewMode === 'findStation' && isGameMap) {
      const result = findNearestStation(x, y)
      setNearestStationInfo({
        name: result.station.name,
        distance: result.distance,
        x: result.station.x,
        y: result.station.y
      })
    }
  }

  // Handle pan start (mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode === 'view') {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  // Handle pan move (mouse)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && viewMode === 'view') {
      const newPan = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }
      setPan(constrainPan(newPan, zoom))
    }
  }

  // Handle pan end
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle map click (mouse only)
  const handleMapClick = (e: React.MouseEvent) => {
    if (!imageRef.current || viewMode === 'measure') return

    const rect = imageRef.current.getBoundingClientRect()
    const x = Math.round((e.clientX - rect.left) / zoom)
    const y = Math.round((e.clientY - rect.top) / zoom)

    if (viewMode === 'marker') {
      setPendingMarkerPos({ x, y })
      setShowMarkerModal(true)
    } else if (viewMode === 'findStation' && isGameMap) {
      const result = findNearestStation(x, y)
      setNearestStationInfo({
        name: result.station.name,
        distance: result.distance,
        x: result.station.x,
        y: result.station.y
      })
    }
  }

  // Handle marker save
  const handleMarkerSave = (note: string) => {
    if (editingMarker) {
      onUpdateMarker(editingMarker.id, note)
      setEditingMarker(null)
    } else if (pendingMarkerPos) {
      onAddMarker(pendingMarkerPos.x, pendingMarkerPos.y, note)
      setPendingMarkerPos(null)
    }
    setShowMarkerModal(false)
  }

  // Handle marker edit
  const handleMarkerEdit = (marker: MapMarker) => {
    setEditingMarker(marker)
    setShowMarkerModal(true)
  }

  // Reset view
  const handleReset = () => {
    setZoom(minZoom)
    setPan(constrainPan({ x: 0, y: 0 }, minZoom))
  }

  // Zoom in/out buttons
  const handleZoomIn = () => {
    const newZoom = Math.min(5, zoom * 1.3)
    const centerX = containerSize.width / 2
    const centerY = containerSize.height / 2
    const zoomFactor = newZoom / zoom
    const newPanX = centerX - (centerX - pan.x) * zoomFactor
    const newPanY = centerY - (centerY - pan.y) * zoomFactor
    setZoom(newZoom)
    setPan(constrainPan({ x: newPanX, y: newPanY }, newZoom))
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(minZoom, zoom / 1.3)
    const centerX = containerSize.width / 2
    const centerY = containerSize.height / 2
    const zoomFactor = newZoom / zoom
    const newPanX = centerX - (centerX - pan.x) * zoomFactor
    const newPanY = centerY - (centerY - pan.y) * zoomFactor
    setZoom(newZoom)
    setPan(constrainPan({ x: newPanX, y: newPanY }, newZoom))
  }


  return (
    <div className="h-full flex flex-col">
      {/* Compact Toolbar */}
      <div className="bg-white border-b border-gray-200 px-2 py-1.5 flex items-center gap-1">
        {/* Main mode buttons with icons */}
        <div className="flex gap-0.5 bg-gray-100 rounded p-0.5">
          <button
            onClick={() => setViewMode('view')}
            className={`p-1.5 rounded ${viewMode === 'view' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'}`}
            title="Moure"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('measure')}
            className={`p-1.5 rounded ${viewMode === 'measure' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'}`}
            title="Medir"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          {isGameMap && (
            <button
              onClick={() => { setViewMode('findStation'); setNearestStationInfo(null) }}
              className={`p-1.5 rounded ${viewMode === 'findStation' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'}`}
              title="Trobar Estació"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>


        {/* Zoom controls */}
        <div className="flex items-center gap-0.5 ml-auto">
          <button onClick={handleZoomOut} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-700 font-bold text-lg">−</button>
          <span className="text-xs text-gray-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-700 font-bold text-lg">+</button>
        </div>

        {/* More options toggle */}
        <button
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className={`p-1.5 rounded ${showMoreOptions ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Extended options row */}
      {showMoreOptions && (
        <div className="bg-gray-50 border-b border-gray-200 px-2 py-1.5 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setViewMode('marker')}
            className={`px-2 py-1 rounded text-xs font-medium ${viewMode === 'marker' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            + Marcador
          </button>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`px-2 py-1 rounded text-xs font-medium ${showSidebar ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Marcadors
          </button>
          {isGameMap && (
            <button
              onClick={() => setShowStations(!showStations)}
              className={`px-2 py-1 rounded text-xs font-medium ${showStations ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Estacions
            </button>
          )}
          <button onClick={handleReset} className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-700">
            Reset
          </button>
          <a
            href={`${basePath}${mapData.imagePath}`}
            download={mapData.name.replace(/ /g, '_') + '.png'}
            className="px-2 py-1 rounded text-xs font-medium bg-green-600 text-white hover:bg-green-700"
          >
            📥 Baixar
          </a>
        </div>
      )}

      {/* Map Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-gray-800 relative"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleMapClick}
        style={{
          cursor: viewMode === 'view' ? (isDragging ? 'grabbing' : 'grab') : 'crosshair',
          touchAction: 'none'
        }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            position: 'relative',
            willChange: 'transform',
            width: imageSize.width > 0 ? `${imageSize.width}px` : 'auto',
            height: imageSize.height > 0 ? `${imageSize.height}px` : 'auto'
          }}
        >
          <img
            ref={imageRef}
            src={`${basePath}${mapData.imagePath}`}
            alt={mapData.name}
            className="block max-w-none"
            style={{ width: 'auto', height: 'auto' }}
            draggable={false}
            onLoad={handleImageLoad}
          />

          {/* Markers Overlay */}
          {mapData.markers.map(marker => (
            <div
              key={marker.id}
              className="absolute cursor-pointer"
              style={{
                left: `${marker.x}px`,
                top: `${marker.y}px`,
                transform: 'translate(-50%, -100%)'
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleMarkerEdit(marker)
              }}
            >
              <svg className="w-8 h-8 text-red-600 drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          ))}

          {/* Stations Overlay */}
          {isGameMap && showStations && STATIONS_PLANOLJOC.map((station, idx) => (
            <div
              key={idx}
              className="absolute cursor-pointer"
              style={{
                left: `${station.x}px`,
                top: `${station.y}px`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto',
                zIndex: 20
              }}
              onClick={(e) => {
                e.stopPropagation()
                const newStation = selectedStation?.name === station.name ? null : station
                setSelectedStation(newStation)
                if (newStation) {
                  console.log('Estació seleccionada:', newStation.name)
                  console.log('Radi del cercle (px):', 400 / metersPerPixel)
                  console.log('Diàmetre del cercle (px):', 400 / metersPerPixel * 2)
                  console.log('metersPerPixel:', metersPerPixel)
                }
              }}
            >
              <div className={`w-3 h-3 rounded-full border-2 shadow-lg transition-all ${
                selectedStation?.name === station.name 
                  ? 'bg-yellow-400 border-yellow-600 w-4 h-4' 
                  : 'bg-blue-600 border-white'
              }`} />
              <div className={`absolute left-1/2 top-full -translate-x-1/2 mt-0.5 text-white text-[8px] px-1 rounded whitespace-nowrap ${
                selectedStation?.name === station.name 
                  ? 'bg-yellow-600/90 font-bold' 
                  : 'bg-blue-600/90'
              }`}>
                {station.name}
              </div>
            </div>
          ))}

          {/* 400m Circle around selected station */}
          {selectedStation && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${selectedStation.x}px`,
                top: `${selectedStation.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
            >
              <div
                className="rounded-full border-8 bg-yellow-300/30"
                style={{
                  width: `${400 / metersPerPixel * 2}px`,
                  height: `${400 / metersPerPixel * 2}px`,
                  borderColor: 'rgba(234, 179, 8, 0.8)',
                  boxShadow: '0 0 30px rgba(234, 179, 8, 0.6), inset 0 0 30px rgba(234, 179, 8, 0.2)'
                }}
              />
              {/* Label for the circle */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full mb-2 bg-yellow-600 text-white text-sm px-3 py-1.5 rounded-lg font-bold whitespace-nowrap shadow-lg">
                🎯 Àrea de joc (400m)
              </div>
            </div>
          )}

          {/* Nearest Station Highlight */}
          {nearestStationInfo && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${nearestStationInfo.x}px`,
                top: `${nearestStationInfo.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg animate-pulse" />
            </div>
          )}

          {/* Distance Tool Overlay */}
          {viewMode === 'measure' && (
            <DistanceTool mode="circle" zoom={zoom} metersPerPixel={metersPerPixel} activeHider={activeHider} onHiderChange={onHiderChange} />
          )}
        </div>

        {/* Nearest Station Info */}
        {nearestStationInfo && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg z-10 max-w-[90%]">
            <div className="text-center">
              <div className="text-xs opacity-80">Estació més propera:</div>
              <div className="text-base font-bold">{nearestStationInfo.name}</div>
              <div className="text-xs mt-1 opacity-90">
                ~{Math.round(nearestStationInfo.distance * metersPerPixel)} metres
              </div>
              <button
                onClick={() => setNearestStationInfo(null)}
                className="mt-2 px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium"
              >
                Tancar
              </button>
            </div>
          </div>
        )}

        {/* Find Station Instructions */}
        {viewMode === 'findStation' && !nearestStationInfo && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-lg text-sm">
            Toca el mapa per trobar l'estació
          </div>
        )}
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg z-20 overflow-auto">
          <MarkerList
            markers={mapData.markers}
            onMarkerClick={handleMarkerEdit}
            onMarkerDelete={onDeleteMarker}
          />
        </div>
      )}

      {/* Marker Modal */}
      {showMarkerModal && (
        <MarkerModal
          initialNote={editingMarker?.note || ''}
          onSave={handleMarkerSave}
          onCancel={() => {
            setShowMarkerModal(false)
            setEditingMarker(null)
            setPendingMarkerPos(null)
          }}
        />
      )}
    </div>
  )
}

