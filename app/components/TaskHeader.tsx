"use client"

import { CalendarDays, Plus, ChevronDown } from "lucide-react"
import { useState } from "react"
import DatePicker from "./DatePicker"

interface TaskHeaderProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  onCreateClick: () => void
}

export default function TaskHeader({
  selectedDate,
  onDateChange,
  onCreateClick
}: TaskHeaderProps) {
    const [isOpen, setIsOpen] = useState(false)

    const formatDisplayDate = (date?: Date) => {
        if (!date) return ""
        return date.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        })
    }

  return (
    <>
      <div className="flex items-center justify-between">

        {/* Date */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-sm text-green-400 hover:opacity-80 transition"
        >
          <CalendarDays size={16} />
            {formatDisplayDate(selectedDate)}
          <ChevronDown />
        </button>

        {/* Create */}
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-xl text-sm font-medium shadow-[0_0_15px_rgba(34,197,94,0.6)] transition hover:scale-105"
        >
          <Plus size={16} />
          New Task
        </button>

      </div>

      <DatePicker
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        selectedDate={selectedDate}
        onSelect={(date) => {
          onDateChange(date)
          setIsOpen(false)
        }}
      />
    </>
  )
}
