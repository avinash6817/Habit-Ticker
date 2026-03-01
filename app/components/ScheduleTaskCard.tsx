

"use client"

import { useState } from "react"
import { Flag } from "lucide-react"

interface Task {
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

interface Props {
  task: Task
}

export default function ScheduleTaskCard({ task }: Props) {

  const safeTask = task || {
    id: 0,
    title: "Untitled",
    description: "",
    dueDate: new Date(),
    reminderTime: "09:00 AM",
    priority: "medium" as const,
    category: "personal",
    completed: false,
    createdAt: new Date(),
  }

  // ✅ Local UI toggle (does NOT change your existing logic)
  const [isCompleted, setIsCompleted] = useState(safeTask.completed)

  const priorityStyles = {
    low: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    high: "bg-red-500/15 text-red-400 border-red-500/30",
  }

  // ✅ Date + Short Month
  const dateObj = new Date(safeTask.dueDate)

  const day = dateObj.toLocaleDateString("en-IN", {
    day: "2-digit",
  })

  const month = dateObj.toLocaleDateString("en-IN", {
    month: "short",
  })

  return (
    <div className="relative flex items-center">
      
      {/* Timeline Dot (Now Clickable) */}
      <div className="absolute left-6 -translate-x-1/2 flex items-center justify-center z-20">

        {/* Background mask to hide connector line */}
        <div className="absolute w-10 h-10 bg-[#0B0F1A] rounded-full" />

        <button
          onClick={() => setIsCompleted(prev => !prev)}
          className={`
            relative z-10
            w-10 h-10 rounded-full flex flex-col items-center justify-center
            text-[10px] font-semibold leading-tight
            border-2 transition-all duration-300
            ${isCompleted
              ? "bg-green-500 border-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.7)]"
              : "bg-red-500/20 border-red-300 text-red-300 hover:scale-105"}
          `}
        >
          <span>{day}</span>
          <span className="uppercase text-[8px]">{month}</span>
        </button>

      </div>

      {/* Connector Line */}
      <div className="absolute left-6 w-12 h-[2px] bg-gray-700" />

      {/* Pill Card */}
      <div
        className={`
          ml-18 flex-1 bg-[#1E293B] border border-gray-700
          rounded-full px-3 py-2
          transition-all duration-200
          hover:border-green-500/40
          ${isCompleted ? "opacity-60" : ""}
        `}
      >

        <div className="flex justify-between">

          {/* Left */}
          <div className="flex flex-1 items-center">
            <h3 className={`font-semibold text-[10px] capitalize ${
              isCompleted
                ? "line-through text-gray-400"
                : "text-white"
            }`}>
              {safeTask.title}
            </h3>
          </div>

          {/* Right Meta */}
          <div className="flex gap-2 text-[8px]">

            <div className="flex items-center bg-[#0F172A] px-2 py-1 rounded-full text-gray-300">
              {safeTask.reminderTime}
            </div>

            <div className="flex items-center bg-[#0F172A] px-2 py-1 rounded-full text-gray-300 capitalize">
              {safeTask.category}
            </div>

            <div
              className={`flex items-center px-2 py-1 rounded-full border ${priorityStyles[safeTask.priority]}`}
            >
              <Flag size={8} />
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}