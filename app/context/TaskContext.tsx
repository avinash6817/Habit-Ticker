"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Task } from "@/app/types/task"

import { getTasksAction } from "../actions/task"

type TaskContextType = {
    tasks: Task[]
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
    tasksLoading: boolean
    setTasksLoading: React.Dispatch<React.SetStateAction<boolean>>

    /* Future Server Actions */
    // createTask?: (task: Task) => void
    // updateTask?: (task: Task) => void
    // deleteTask?: (taskId: number) => void
    // toggleTaskCompletion?: (taskId: number) => void
}

export const TaskContext = createContext<TaskContextType | null>(null)

export function useTasks() {
    const context = useContext(TaskContext)
    if (!context) throw new Error("useTasks must be used inside TaskProvider")
    return context
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [tasksLoading, setTasksLoading] = useState(true)

    useEffect(() => {
        const loadTasks = async () => {
          try {
            const data = await getTasksAction()
    
            const formattedTasks: Task[] = data.map((task: any) => ({
              ...task,
              dueDate: new Date(task.dueDate),
              createdAt: new Date(task.createdAt),
              priority: task.priority as "low" | "medium" | "high"
            }))
    
            setTasks(formattedTasks)
          }
          catch (error) {
            console.error("Failed to load tasks:", error)
          }
          finally {
            setTasksLoading(false)
          }
        }
    
      loadTasks()
    }, [])

    /* Future Server Actions Area */

    return (
        <TaskContext.Provider
            value={{
                tasks,
                setTasks,
                tasksLoading,
                setTasksLoading
            }}
            >
            {children}
        </TaskContext.Provider>
    )
}