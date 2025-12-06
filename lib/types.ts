export interface QuestionHelp {
  hint: string
  details: string
  tips: string[]
}

export interface CategoryHelp {
  title: string
  format: string
  timeLimit: string
  cardCost: string
  tips: string[]
  examples?: string[]
  important: string
}

export interface HelpContent {
  category: CategoryHelp
  questions: Record<string, QuestionHelp>
}

export interface QuestionData {
  name: string
  checked: boolean
  note?: string
}

export interface PhotoQuestionData {
  name: string
  description: string
  taken: boolean
  note?: string
}

export interface CategoryData {
  matching: QuestionData[]
  measuring: QuestionData[]
  thermometer: QuestionData[]
  radar: QuestionData[]
  photos: PhotoQuestionData[]
}

export type CategoryId = keyof CategoryData

export interface Stats {
  matching: { answered: number; total: number }
  measuring: { answered: number; total: number }
  thermometer: { answered: number; total: number }
  radar: { answered: number; total: number }
  photos: { taken: number; total: number }
}

// Multi-hider support
export interface HiderInfo {
  name: string
  color: string
  bg: string
  data: CategoryData
}

export type AllHidersData = HiderInfo[]

export const DEFAULT_HIDER_COLORS = [
  { color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.15)' },
  { color: '#dc2626', bg: 'rgba(220, 38, 38, 0.15)' },
  { color: '#059669', bg: 'rgba(5, 150, 105, 0.15)' },
  { color: '#ea580c', bg: 'rgba(234, 88, 12, 0.15)' },
  { color: '#0891b2', bg: 'rgba(8, 145, 178, 0.15)' },
  { color: '#db2777', bg: 'rgba(219, 39, 119, 0.15)' },
] as const


export type TabId = 'qa' | 'random' | 'manual' | 'mapa' | 'barris'

export interface MeasurementPoint {
  x: number
  y: number
}

export type MeasurementMode = 'circle' | 'line'

export interface MapMarker {
  id: string
  x: number
  y: number
  note: string
  timestamp: number
}

export interface MapData {
  name: string
  imagePath: string
  markers: MapMarker[]
}

export interface MapsData {
  barrisDistrictes: MapData
  planolJoc: MapData
}

export interface Station {
  name: string
  x: number
  y: number
}
