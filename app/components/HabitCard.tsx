
"use client"

import { Check, MoreVertical, Pencil, Trash2, Archive,Trophy, Sparkles } from "lucide-react"
import { useState } from "react"
import { habitColorHexMap } from "../utilities/theme"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { IconsMapList } from "../utilities/icons"

import { toggleHabitCompletionAction } from "../actions/habit" 

interface Habit {
  id: number
  name: string
  completions: string[]
  icon: string
  color: string
  createdAt: string
  order: number
}

interface HabitCardProps {
  habit: Habit
  selectedDate: string
  setHabit: any

  // ✅ NEW (only addition)
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
  onArchive: (habit: Habit) => void
}

export default function HabitCard({
  habit,
  selectedDate,
  setHabit,
  onEdit,
  onDelete,
  onArchive
}: HabitCardProps) {

  const {
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
  isDragging,
} = useSortable({ id: habit.id })

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
}

  const [menuOpen, setMenuOpen] = useState(false)

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  const isBeforeCreation = selectedDate < habit.createdAt

  const toggleComplete = async () => {
  // Block marking before creation date
    if (isBeforeCreation) return

    const exists = habit.completions.includes(selectedDate)

    let updatedCompletions

    if (exists) {
      updatedCompletions = habit.completions.filter(
        (d) => d !== selectedDate
      )
    } 
    else {
      updatedCompletions = [...habit.completions, selectedDate]
    }

    const unique = Array.from(new Set(updatedCompletions))
    unique.sort()

    setHabit({ ...habit, completions: unique })

    try {
    // ✅ 2. Sync with DB
      await toggleHabitCompletionAction(habit.id, selectedDate)
    } 
    catch (error) {
      console.error("Toggle failed:", error)

    // ✅ 3. Optional rollback if error
    setHabit(habit)
    }
  }


  const calculateCurrentStreak = () => {
    let streak = 0
    let current = new Date()

    while (true) {
      const dateStr = formatDate(current)

      if (habit.completions.includes(dateStr)) {
        streak++
        current.setDate(current.getDate() - 1)
      } 
      else {
        break
      }
    }

    return streak
  }

  const calculateHighestStreak = () => {
    if (habit.completions.length === 0) return 0

    const sorted = [...habit.completions].sort()

    let maxStreak = 1
    let currentStreak = 1

    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1])
      const curr = new Date(sorted[i])

      prev.setDate(prev.getDate() + 1)

      if (formatDate(prev) === formatDate(curr)) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 1
      }
    }

    return maxStreak
  }

  const currentStreak = calculateCurrentStreak()
  const highestStreak = calculateHighestStreak()

  const generateLast100Days = () => {
    const days: string[] = []
    const current = new Date()

    for (let i = 0; i < 100; i++) {
      const dateStr = formatDate(current)
      days.push(dateStr)
      current.setDate(current.getDate() - 1)
    }

    return days.reverse()
  }

  const last100Days = generateLast100Days()

  const IconComponent = IconsMapList[habit.icon as keyof typeof IconsMapList] || IconsMapList.flame
  const hex = habitColorHexMap[habit.color]


  return (
    <div
        ref={setNodeRef}
        style={{
          ...style,
          border: `2px solid ${hex}80`,
          opacity: isDragging ? 0.6 : 1,
        }}
        {...attributes}
        {...listeners}
        className="bg-[#121826] rounded-2xl p-4 relative"
      >

      {/* Header */}
      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-3">

          {/* Icon */}
          <div className={`${habit.color} text-black p-2 rounded-xl`}>
            <IconComponent size={18} />
          </div>

            <h2 className="text-base font-semibold">
              {habit.name}
            </h2>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 relative">

          {/* Checkbox */}
          <button
            onClick={toggleComplete}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              transition
              ${isBeforeCreation ? "opacity-40 cursor-not-allowed" : ""}
              ${
                habit.completions.includes(selectedDate)
                  ? `${habit.color} text-black`
                  : "bg-[#1F2937]"
              }
            `}
          >
            <Check size={18} />
          </button>

          {/* 3 Dot Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-4 top-12 bg-[#1F2937] rounded-xl shadow-xl w-30 border border-white/10 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

              
              {/* Edit */}
              <button
                  onClick={() => {
                    onEdit(habit)
                    setMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 transition"
                >
                <Pencil
                  size={15}
                  className="text-emerald-400 opacity-80"
                />
                <span>Edit</span>
              </button>

              {/* Delete */}
              <button
                  onClick={() => {
                    onDelete(habit)
                    setMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-500/10 transition"
                >
                <Trash2
                  size={15}
                  className="text-red-400 opacity-90"
                />
                <span className="text-red-400">Delete</span>
              </button>

              {/* Archive */}
              <button
                  onClick={() => {
                    onArchive(habit)
                    setMenuOpen(false)
                  }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-amber-500/10 transition"
              >
                <Archive
                  size={15}
                  className="text-amber-400 opacity-85"
                />
                <span className="text-amber-300">Archive</span>
              </button>

            </div>
          )}

        </div>
      </div>

      {/* Heatmap */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(16px,1fr))] gap-2">
        {last100Days.map((day) => (
          <div
            key={day}
            className={`
              w-4 h-4 rounded-sm
              ${
                habit.completions.includes(day)
                  ? habit.color
                  : "bg-[#1F2937]"
              }
            `}
          />
        ))}
      </div>

      {/* Streak + Date Pill */}
      <div className="flex justify-between mt-3">
          <div className="flex gap-3">

            <div className="flex gap-1 items-center">
                <Sparkles style={{color:hex}} size={14} /> 
                <p className="text-[12px] text-gray-400 font-semibold">
                  CURRENT - {currentStreak}
                </p>
            </div>

              <div className="flex gap-1 items-center">
                <Trophy style={{color:hex}} size={14} /> 
                <p className="text-[12px] text-gray-400 font-semibold">
                  BEST - {highestStreak}
                </p>
              </div>

          </div>
        <span
          className="text-[8px] px-3 py-1 rounded-full font-medium"
          style={{
            backgroundColor: `${hex}20`,
            color: hex,
          }}
        >
          Created on {habit.createdAt}
        </span>
      </div>

    </div>
  )
}