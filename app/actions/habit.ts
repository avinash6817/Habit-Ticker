"use server"

import { prisma } from "@/lib/prisma"

export async function createHabitAction(data: {
  name: string
  color: string
  icon: string
}) {
  if (!data.name) throw new Error("Name is required")

  const lastHabit = await prisma.habit.findFirst({
    orderBy: { order: "desc" },
  })

  const newOrder = lastHabit ? lastHabit.order + 1 : 0

  return await prisma.habit.create({
    data: {
      name: data.name,
      color: data.color,
      icon: data.icon,
      order: newOrder,
    },
  })
}

export async function getHabitsAction() {
  const habits = await prisma.habit.findMany({
    where: { isArchived: false },
    include: { logs: true },
    orderBy: { order: "asc" },
  })

  return habits.map((habit) => {
    // ✅ normalize createdAt
    const created = habit.createdAt
    const year = created.getFullYear()
    const month = String(created.getMonth() + 1).padStart(2, "0")
    const day = String(created.getDate()).padStart(2, "0")

    return {
      id: habit.id,
      name: habit.name,
      color: habit.color,
      icon: habit.icon,
      order: habit.order,
      createdAt: `${year}-${month}-${day}`, // ✅ FIXED
      completions: habit.logs.map((log) => {
        const logDate = log.date
        const y = logDate.getFullYear()
        const m = String(logDate.getMonth() + 1).padStart(2, "0")
        const d = String(logDate.getDate()).padStart(2, "0")
        return `${y}-${m}-${d}`
      }),
    }
  })
}

export async function getArchivedHabitsAction() {
  const habits = await prisma.habit.findMany({
    where: { isArchived: true },
    include: { logs: true },
    orderBy: { order: "asc" },
  })

  return habits.map((habit) => {
    // ✅ normalize createdAt
    const created = habit.createdAt
    const year = created.getFullYear()
    const month = String(created.getMonth() + 1).padStart(2, "0")
    const day = String(created.getDate()).padStart(2, "0")

    return {
      id: habit.id,
      name: habit.name,
      color: habit.color,
      icon: habit.icon,
      order: habit.order,
      createdAt: `${year}-${month}-${day}`, // ✅ FIXED
      completions: habit.logs.map((log) => {
        const logDate = log.date
        const y = logDate.getFullYear()
        const m = String(logDate.getMonth() + 1).padStart(2, "0")
        const d = String(logDate.getDate()).padStart(2, "0")
        
        return `${y}-${m}-${d}`
      }),
    }
  })
}

export async function updateHabitAction(
  habitId: number,
  data: {
    name: string
    color: string
    icon: string
  }
) {
  return await prisma.habit.update({
    where: { id: habitId },
    data: {
      name: data.name,
      color: data.color,
      icon: data.icon,
    },
  })
}

export async function toggleHabitCompletionAction(
  habitId: number,
  date: string
) {
  const dateObj = new Date(date)
  dateObj.setHours(0, 0, 0, 0)

  const existing = await prisma.habitLog.findUnique({
    where: {
      habitId_date: {
        habitId,
        date: dateObj,
      },
    },
  })

  if (existing) {
    await prisma.habitLog.delete({
      where: { id: existing.id },
    })
  } 
  else {
    await prisma.habitLog.create({
      data: {
        habitId,
        date: dateObj,
      },
    })
  }
}

export async function deleteHabitAction(habitId: number) {
  return await prisma.habit.delete({
    where: { id: habitId },
  })
}

export async function archiveHabitAction(habitId: number) {
  return await prisma.habit.update({
    where: { id: habitId },
    data: { isArchived: true },
  })
}

export async function restoreHabitAction(habitId: number) {
  return await prisma.habit.update({
    where: { id: habitId },
    data: { isArchived: false },
  })
}



export async function updateHabitOrderAction(
  habits: { id: number; order: number }[]
) {
  const updates = habits.map((habit) =>
    prisma.habit.update({
      where: { id: habit.id },
      data: { order: habit.order },
    })
  )

  await prisma.$transaction(updates)
}



