"use client"

import TaskHeader from "./TaskHeader"
import TaskSchedule from "./ScheduleTaskCard"

export default function TaskScreen() {
  return (
    <div className="flex flex-col min-h-[calc(100vh)] pt-20">
        <TaskHeader />
        <TaskSchedule />
    </div>
  )
}