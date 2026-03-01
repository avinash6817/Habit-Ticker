

"use client"

import { useEffect, useRef } from "react"

interface Habit {
  id: number
  name: string
  completions: string[]
  createdAt: string
}

interface DateScrollerProps {
  habits: Habit[]
  selectedDate: string
  setSelectedDate: (date: string) => void
}

export default function DateScroller({
  habits,
  selectedDate,
  setSelectedDate,
}: DateScrollerProps) {

  const todayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      })
    }
  }, [])

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  const todayDateObj = new Date()
  const today = formatDate(todayDateObj)

  // Generate all days of current month
  const generateCurrentMonthDays = () => {
    const days: string[] = []

    const currentYear = todayDateObj.getFullYear()
    const currentMonth = todayDateObj.getMonth()

    const daysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day)
      days.push(formatDate(dateObj))
    }

    return days
  }

  const days = generateCurrentMonthDays()

  return (
    <div className="flex gap-3 overflow-x-auto p-3 no-scrollbar">
      {days.map((day) => {
        
      // Only habits that existed on this day (string comparison)
        const validHabits = habits.filter(
          (habit) => habit.createdAt <= day
        )

        const totalHabits = validHabits.length

        const completedCount = validHabits.filter((habit) =>
          habit.completions.includes(day)
        ).length

        const ratio = totalHabits === 0 ? 0 : completedCount / totalHabits

        const isToday = day === today
        const isFuture = day > today   // ✅ FIXED (string comparison)
        const isFull = ratio === 1

        return (
            <div
                key={day}
                ref={isToday ? todayRef : null}
                onClick={() => {
                    if (!isFuture) {
                      setSelectedDate(day)
                    }
                }}
                className={`
                    relative
                    w-13 h-13
                    flex-shrink-0
                    rounded-full
                    overflow-hidden 
                    flex items-center justify-center
                    transition-all duration-300
                    border-2
                    ${isFuture ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                    ${isToday ? "border-3 border-green-500" : "border-transparent"}
                    focus:border-green-300
                    ${selectedDate === day ? "scale-110" : ""}
                    ${isFull ? "shadow-[0_0_12px_rgba(34,197,94,0.6)]" : ""}
                `}
                >

                {/* Base Background */}
                <div className="absolute inset-0 rounded-full bg-[#1F2937]" />

                {/* Animated Fill */}
                <div
                  className="absolute bottom-0 left-0 w-full rounded-full bg-green-500 transition-all duration-500 ease-in-out"
                  style={{
                    height: `${ratio * 100}%`,
                  }}
                />

                {/* Day Number */}
                <span className="relative z-10 text-sm text-white font-semibold">
                    {new Date(day).getDate()}
                </span>
            </div>

        )
      })}
    </div>
  )
}