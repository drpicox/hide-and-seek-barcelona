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
}

export interface PhotoQuestionData {
  name: string
  description: string
  taken: boolean
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

export type TabId = 'seguimiento' | 'manual'

export interface MeasurementPoint {
  x: number
  y: number
}

export type MeasurementMode = 'circle' | 'line'
