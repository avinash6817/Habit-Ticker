
"use client"

import { useState } from "react"
import { Check, MoreVertical, Pencil, Trash2, Archive,Trophy, Sparkles } from "lucide-react"
import { toLocalDateString } from "@/lib/date"


import { Habit } from "@/app/types/habit"
import { playCompleteSound } from "@/lib/sound/playSound"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { habitColorHexMap } from "@/app/utilities/theme"
import { IconsMapList } from "@/app/utilities/icons"

import { toggleHabitCompletionAction } from "@/app/actions/habit" 


interface HabitCardProps {
  habit: Habit
  selectedDate: string
  setHabit: any

  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
  onArchive: (habit: Habit) => void
  onUpdateHabit?: (habit: Habit) => void  // NEW
}

export default function HabitCard({
  habit,
  selectedDate,
  setHabit,
  onEdit,
  onDelete,
  onArchive,
  onUpdateHabit
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

  // even though log contains only the completed on we are just double checking it
  const completions = habit.completions ??
    habit.logs
    ?.filter((log) => log.completed)
    .map((log) => toLocalDateString(new Date(log.date))) ?? []

  // const completions = habit.completions || []



  const isBeforeCreation = selectedDate < habit.createdAt

  const toggleComplete = async () => {
    // Block marking before creation date
    if (isBeforeCreation) return

    const exists = completions.includes(selectedDate)

    let updatedCompletions

    if (exists) {
      updatedCompletions = completions.filter(
        (d) => d !== selectedDate
      )
    } 
    else {
      updatedCompletions = [...completions, selectedDate]
    }

    const unique = Array.from(new Set(updatedCompletions))
    unique.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    const updatedHabit = { ...habit, completions: unique }

    setHabit(updatedHabit)

    // console.log("✅ Habit after toggle:", {
    //   habit: updatedHabit,
    //   selectedDate,
    // })

        // Propagate to parent
    if (onUpdateHabit) {
      onUpdateHabit(updatedHabit)
    }


    try {
      if (!exists) {
        playCompleteSound()
      }
      await toggleHabitCompletionAction(habit.id, selectedDate)
    } 
    catch (error) {
      console.error("Toggle failed:", error)

    // Optional rollback if error
      setHabit(habit)
    }
  }


  const calculateCurrentStreak = () => {
    let streak = 0
    let current = new Date()

    while (true) {
      const dateStr = toLocalDateString(current)

      if (completions.includes(dateStr)) {
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
    if (completions.length === 0) return 0

    const sorted = [...completions].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )

    let maxStreak = 1
    let currentStreak = 1

    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1])
      const curr = new Date(sorted[i])

      prev.setDate(prev.getDate() + 1)

      if (toLocalDateString(prev) === toLocalDateString(curr)) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } 
      else {
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
      const dateStr = toLocalDateString(current)
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

            <h2 className="text-base font-semibold capitalize">
              {habit.name}
            </h2>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 relative">

          {/* Checkbox */}
          <button
            onClick={toggleComplete}
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              transition
              ${isBeforeCreation ? "opacity-40 cursor-not-allowed" : ""}
              ${
                completions.includes(selectedDate)
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
                completions.includes(day)
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
          Started on {habit.createdAt}
        </span>
      </div>

    </div>
  )
}