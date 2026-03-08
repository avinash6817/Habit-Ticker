export interface Task {
  id: number
  title: string
  description: string
  dueDate: Date
  taskScheduledTime: string
  reminderOffsetMinutes: number
  priority: "low" | "medium" | "high"
  category: string
  completed: boolean
  createdAt: Date
}

export type TaskInput = {
  title: string
  description: string
  dueDate: Date
  taskScheduledTime: string
  reminderOffsetMinutes: number
  priority: "low" | "medium" | "high"
  category: string
  completed: boolean
}