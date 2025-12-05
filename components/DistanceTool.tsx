'use client'

import { useState, useRef } from 'react'

interface DistanceToolProps {
  mode: 'circle' | 'line'
  zoom: number
  metersPerPixel: number
  activeHider?: number
  onHiderChange?: (hider: number) => void
}

interface Shape {
  id: string
  type: 'circle' | 'rectangle'
  color: string
  centerX?: number
  centerY?: number
  radius?: number
  x1?: number
  y1?: number
  x2?: number
  y2?: number
}

const HIDER_COLORS = [
  { name: 'Hider 1', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.15)' },
  { name: 'Hider 2', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.15)' },
  { name: 'Hider 3', color: '#059669', bg: 'rgba(5, 150, 105, 0.15)' },
]

export default function DistanceTool({ zoom, metersPerPixel, activeHider: externalActiveHider, onHiderChange }: DistanceToolProps) {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [internalActiveHider, setInternalActiveHider] = useState(0)
  const activeHider = externalActiveHider ?? internalActiveHider
  const setActiveHider = (hider: number) => {
    setInternalActiveHider(hider)
    onHiderChange?.(hider)
  }
  const [shapeType, setShapeType] = useState<'circle' | 'rectangle'>('circle')
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const getCoordinates = (clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return null

    const rect = svg.getBoundingClientRect()
    return {
      x: (clientX - rect.left) / zoom,
      y: (clientY - rect.top) / zoom
    }
  }

  const handleStart = (clientX: number, clientY: number) => {
    const coords = getCoordinates(clientX, clientY)
    if (!coords) return
    setIsDrawing(true)
    setStartPoint(coords)
    setCurrentPoint(coords)
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDrawing || !startPoint) return
    const coords = getCoordinates(clientX, clientY)
    if (!coords) return
    setCurrentPoint(coords)
  }

  const handleEnd = () => {
    if (!isDrawing || !startPoint || !currentPoint) {
      setIsDrawing(false)
      return
    }

    const hiderColor = HIDER_COLORS[activeHider]
    const newShape: Shape = {
      id: `shape-${Date.now()}`,
      type: shapeType,
      color: hiderColor.color,
    }

    if (shapeType === 'circle') {
      const radius = Math.sqrt(
        Math.pow(currentPoint.x - startPoint.x, 2) +
        Math.pow(currentPoint.y - startPoint.y, 2)
      )
      if (radius > 5) {
        newShape.centerX = startPoint.x
        newShape.centerY = startPoint.y
        newShape.radius = radius
        setShapes([...shapes, newShape])
      }
    } else {
      const width = Math.abs(currentPoint.x - startPoint.x)
      const height = Math.abs(currentPoint.y - startPoint.y)
      if (width > 5 && height > 5) {
        newShape.x1 = Math.min(startPoint.x, currentPoint.x)
        newShape.y1 = Math.min(startPoint.y, currentPoint.y)
        newShape.x2 = Math.max(startPoint.x, currentPoint.x)
        newShape.y2 = Math.max(startPoint.y, currentPoint.y)
        setShapes([...shapes, newShape])
      }
    }

    setIsDrawing(false)
    setStartPoint(null)
    setCurrentPoint(null)
  }

  const handleDeleteShape = (id: string) => {
    setShapes(shapes.filter(s => s.id !== id))
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY)
  const handleMouseUp = () => handleEnd()

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY)
    }
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.touches.length === 1) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY)
    }
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleEnd()
  }

  const handleClearHider = () => {
    const hiderColor = HIDER_COLORS[activeHider].color
    setShapes(shapes.filter(s => s.color !== hiderColor))
  }

  const handleClearAll = () => setShapes([])

  // Calculate preview shape while drawing
  let previewShape: (Shape & { bg: string }) | null = null
  if (isDrawing && startPoint && currentPoint) {
    const hider = HIDER_COLORS[activeHider]
    if (shapeType === 'circle') {
      const radius = Math.sqrt(
        Math.pow(currentPoint.x - startPoint.x, 2) +
        Math.pow(currentPoint.y - startPoint.y, 2)
      )
      previewShape = {
        id: 'preview',
        type: 'circle',
        color: hider.color,
        bg: hider.bg,
        centerX: startPoint.x,
        centerY: startPoint.y,
        radius
      }
    } else {
      previewShape = {
        id: 'preview',
        type: 'rectangle',
        color: hider.color,
        bg: hider.bg,
        x1: Math.min(startPoint.x, currentPoint.x),
        y1: Math.min(startPoint.y, currentPoint.y),
        x2: Math.max(startPoint.x, currentPoint.x),
        y2: Math.max(startPoint.y, currentPoint.y)
      }
    }
  }

  const getBgColor = (color: string) => {
    const hider = HIDER_COLORS.find(h => h.color === color)
    return hider?.bg || 'rgba(0,0,0,0.1)'
  }

  // Get delete button position for a shape
  const getDeleteButtonPos = (shape: Shape) => {
    if (shape.type === 'circle' && shape.centerX !== undefined && shape.centerY !== undefined && shape.radius !== undefined) {
      return { x: shape.centerX + shape.radius * 0.7, y: shape.centerY - shape.radius * 0.7 }
    } else if (shape.x1 !== undefined && shape.y1 !== undefined && shape.x2 !== undefined) {
      return { x: shape.x2, y: shape.y1 }
    }
    return { x: 0, y: 0 }
  }

  return (
    <>
      {/* Control panel */}
      <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-2 z-20">
        <div className="flex gap-1 bg-white rounded-lg shadow p-1">
          {HIDER_COLORS.map((hider, idx) => (
            <button
              key={idx}
              onClick={() => setActiveHider(idx)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                activeHider === idx ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{ backgroundColor: activeHider === idx ? hider.color : 'transparent' }}
            >
              {hider.name}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-white rounded-lg shadow p-1">
          <button
            onClick={() => setShapeType('circle')}
            className={`px-2 py-1 rounded text-xs font-medium ${shapeType === 'circle' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            ◯ Cercle
          </button>
          <button
            onClick={() => setShapeType('rectangle')}
            className={`px-2 py-1 rounded text-xs font-medium ${shapeType === 'rectangle' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            ▢ Rectangle
          </button>
        </div>

        <div className="flex gap-1 bg-white rounded-lg shadow p-1">
          <button onClick={handleClearHider} className="px-2 py-1 rounded text-xs font-medium text-gray-600 hover:bg-gray-100">
            Esborra {HIDER_COLORS[activeHider].name}
          </button>
          <button onClick={handleClearAll} className="px-2 py-1 rounded text-xs font-medium text-red-600 hover:bg-red-50">
            Esborra Tot
          </button>
        </div>
      </div>

      {/* SVG overlay */}
      <svg
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-auto cursor-crosshair"
        style={{ touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {shapes.map(shape => {
          const deletePos = getDeleteButtonPos(shape)
          return (
            <g key={shape.id}>
              {shape.type === 'circle' && shape.centerX !== undefined && shape.radius !== undefined && (
                <>
                  <circle cx={shape.centerX} cy={shape.centerY} r={shape.radius}
                    fill={getBgColor(shape.color)} stroke={shape.color} strokeWidth={3 / zoom} />
                  <circle cx={shape.centerX} cy={shape.centerY} r={6 / zoom} fill={shape.color} />
                  <text x={shape.centerX} y={(shape.centerY || 0) - 10 / zoom}
                    textAnchor="middle" fill={shape.color} fontSize={14 / zoom} fontWeight="bold"
                    style={{ textShadow: '0 0 3px white, 0 0 3px white' }}>
                    {Math.round(shape.radius * metersPerPixel)}m
                  </text>
                </>
              )}
              {shape.type === 'rectangle' && shape.x1 !== undefined && shape.y1 !== undefined && shape.x2 !== undefined && shape.y2 !== undefined && (
                <>
                  <rect x={shape.x1} y={shape.y1} width={shape.x2 - shape.x1} height={shape.y2 - shape.y1}
                    fill={getBgColor(shape.color)} stroke={shape.color} strokeWidth={3 / zoom} />
                  <text x={(shape.x1 + shape.x2) / 2} y={shape.y1 - 5 / zoom}
                    textAnchor="middle" fill={shape.color} fontSize={12 / zoom} fontWeight="bold"
                    style={{ textShadow: '0 0 3px white, 0 0 3px white' }}>
                    {Math.round((shape.x2 - shape.x1) * metersPerPixel)}m
                  </text>
                  <text x={shape.x2 + 5 / zoom} y={(shape.y1 + shape.y2) / 2}
                    textAnchor="start" fill={shape.color} fontSize={12 / zoom} fontWeight="bold"
                    style={{ textShadow: '0 0 3px white, 0 0 3px white' }}>
                    {Math.round((shape.y2 - shape.y1) * metersPerPixel)}m
                  </text>
                </>
              )}
              {/* Delete button */}
              <circle
                cx={deletePos.x}
                cy={deletePos.y}
                r={14 / zoom}
                fill="white"
                stroke={shape.color}
                strokeWidth={2 / zoom}
                style={{ cursor: 'pointer' }}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteShape(shape.id)
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleDeleteShape(shape.id)
                }}
              />
              <text
                x={deletePos.x}
                y={deletePos.y + 5 / zoom}
                textAnchor="middle"
                fill={shape.color}
                fontSize={18 / zoom}
                fontWeight="bold"
                style={{ pointerEvents: 'none' }}
              >
                ×
              </text>
            </g>
          )
        })}

        {previewShape && (
          <g style={{ opacity: 0.7 }}>
            {previewShape.type === 'circle' && previewShape.centerX !== undefined && previewShape.radius !== undefined && (
              <>
                <circle cx={previewShape.centerX} cy={previewShape.centerY} r={previewShape.radius}
                  fill={previewShape.bg} stroke={previewShape.color} strokeWidth={3 / zoom}
                  strokeDasharray={`${10 / zoom} ${5 / zoom}`} />
                <circle cx={previewShape.centerX} cy={previewShape.centerY} r={6 / zoom} fill={previewShape.color} />
                <text x={previewShape.centerX} y={(previewShape.centerY || 0) - 10 / zoom}
                  textAnchor="middle" fill={previewShape.color} fontSize={14 / zoom} fontWeight="bold"
                  style={{ textShadow: '0 0 3px white, 0 0 3px white' }}>
                  {Math.round(previewShape.radius * metersPerPixel)}m
                </text>
              </>
            )}
            {previewShape.type === 'rectangle' && previewShape.x1 !== undefined && previewShape.y1 !== undefined && previewShape.x2 !== undefined && previewShape.y2 !== undefined && (
              <>
                <rect x={previewShape.x1} y={previewShape.y1}
                  width={previewShape.x2 - previewShape.x1} height={previewShape.y2 - previewShape.y1}
                  fill={previewShape.bg} stroke={previewShape.color} strokeWidth={3 / zoom}
                  strokeDasharray={`${10 / zoom} ${5 / zoom}`} />
                <text x={(previewShape.x1 + previewShape.x2) / 2} y={previewShape.y1 - 5 / zoom}
                  textAnchor="middle" fill={previewShape.color} fontSize={12 / zoom} fontWeight="bold"
                  style={{ textShadow: '0 0 3px white, 0 0 3px white' }}>
                  {Math.round((previewShape.x2 - previewShape.x1) * metersPerPixel)}m
                </text>
                <text x={previewShape.x2 + 5 / zoom} y={(previewShape.y1 + previewShape.y2) / 2}
                  textAnchor="start" fill={previewShape.color} fontSize={12 / zoom} fontWeight="bold"
                  style={{ textShadow: '0 0 3px white, 0 0 3px white' }}>
                  {Math.round((previewShape.y2 - previewShape.y1) * metersPerPixel)}m
                </text>
              </>
            )}
          </g>
        )}
      </svg>

      {!isDrawing && shapes.length === 0 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-lg text-sm z-20">
          Toca i arrossega per dibuixar
        </div>
      )}
    </>
  )
}
