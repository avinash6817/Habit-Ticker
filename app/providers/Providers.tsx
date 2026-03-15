"use client"

import { HabitProvider } from "@/app/context/HabitContext"
import { TaskProvider } from "@/app/context/TaskContext"


export default function Providers({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <TaskProvider>
      <HabitProvider>
        {children}
      </HabitProvider>
    </TaskProvider>
  )
}