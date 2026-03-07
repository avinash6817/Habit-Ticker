"use server"

import { prisma } from "@/lib/prisma"
import { TaskInput } from "@/app/types/task"


export async function createTaskAction(data: TaskInput) {
  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        reminderTime: data.reminderTime,
        priority: data.priority,
        category: data.category,
        completed: data.completed ?? false
      }
    })

    return task
  } 
  catch (error) {
    console.error("Create Task Error:", error)
    throw new Error("Failed to create task")
  }
}

export async function getTasksAction() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        dueDate: "asc"
      }
    })

    return tasks
  } 
  catch (error) {
    console.error("Get Tasks Error:", error)
    throw new Error("Failed to fetch tasks")
  }
}

export async function updateTaskAction(data: TaskInput & { id: number }) {
  try {
    const task = await prisma.task.update({
      where: {
        id: data.id
      },
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        reminderTime: data.reminderTime,
        priority: data.priority,
        category: data.category,
        completed: data.completed
      }
    })

    return task

  } 
  catch (error) {
    console.error("Update Task Error:", error)
    throw new Error("Failed to update task")
  }
}

export async function deleteTaskAction(id: number) {
  await prisma.task.delete({
    where: {
      id
    }
  })

  return { success: true }
}

export async function toggleTaskCompletionAction(taskId: number) {
  const task = await prisma.task.findUnique({
    where: { id: taskId }
  })

  if (!task) throw new Error("Task not found")

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: !task.completed
    }
  })

  return updatedTask
}