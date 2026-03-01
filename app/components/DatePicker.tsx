

"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date // make optional
  onSelect: (date: Date) => void
}

export default function DatePicker({
  isOpen,
  onClose,
  selectedDate,
  onSelect,
}: DatePickerProps) {
  // fallback to today if selectedDate is undefined
  const initialDate = selectedDate || new Date()

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const safeDate = selectedDate instanceof Date ? selectedDate : new Date()
    return new Date(safeDate.getFullYear(), safeDate.getMonth(), 1)
  })

  useEffect(() => {
    if (isOpen && selectedDate instanceof Date) {
      setCurrentMonth(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      )
    }
  }, [isOpen, selectedDate])

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const generateDays = () => {
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      )

      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString()

      days.push(
        <button
          key={day}
          onClick={() => {
            onSelect(date)
            onClose()
          }}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition
            ${
              isSelected
                ? "bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.7)]"
                : "text-gray-300 hover:bg-gray-700"
            }`}
        >
          {day}
        </button>
      )
    }

    return days
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#111827] rounded-t-3xl p-6 z-50 transition-transform duration-300
        ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-6" />

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1,
                  1
                )
              )
            }
            className="text-gray-400 hover:text-white"
          >
            <ChevronLeft />
          </button>

          <h3 className="text-white font-semibold">
            {currentMonth.toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </h3>

          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                  1
                )
              )
            }
            className="text-gray-400 hover:text-white"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day) => (
              <div key={day}>{day}</div>
            )
          )}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">{generateDays()}</div>
      </div>
    </>
  )
}