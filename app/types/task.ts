export interface Task {
  id: number
  title: string
  description: string
  dueDate: Date
  reminderTime: string
  priority: "low" | "medium" | "high"
  category: string
  completed: boolean
  createdAt: Date
}