export interface Habit {
  id: number
  name: string
  color: string
  icon: string
  isArchived: boolean 
  order: number
  createdAt: string

  completions?: string[]

  logs?: {
    date: string
    completed: boolean
  }[]
}