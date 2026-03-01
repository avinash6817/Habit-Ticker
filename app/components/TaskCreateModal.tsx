

"use client"

import { useState, useEffect } from "react"
import { X, CalendarDays, ChevronDown, Check, Clock } from "lucide-react"
import DatePicker from "./DatePicker"

interface TaskCreateModalProps {
  isOpen: boolean
  onClose: () => void
  defaultDate: Date
  onCreate: (task: any) => void
}

export default function TaskCreateModal({
  isOpen,
  onClose,
  defaultDate,
  onCreate,
}: TaskCreateModalProps) {

  const today = new Date()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date>(defaultDate || new Date())
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [category, setCategory] = useState("personal")
  const [completed, setCompleted] = useState(false)

  const [selectedHour, setSelectedHour] = useState(9)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const [period, setPeriod] = useState<"AM" | "PM">("AM")

  const [reminderTime, setReminderTime] = useState("09:00 AM")

  const [isDateOpen, setIsDateOpen] = useState(false)
  const [isTimeOpen, setIsTimeOpen] = useState(false)

  /* Keep reminderTime synced */
  useEffect(() => {
    const formatted =
      `${String(selectedHour).padStart(2, "0")}:` +
      `${String(selectedMinute).padStart(2, "0")} ${period}`

    setReminderTime(formatted)
  }, [selectedHour, selectedMinute, period])

  useEffect(() => {
    if (isOpen) {
      setDueDate(defaultDate || new Date())
    }
  }, [isOpen, defaultDate])

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })

  /* Reset dueDate when closing */
  const handleClose = () => {
    setDueDate(today)
    onClose()
  }

  const handleSubmit = () => {
    if (!title.trim()) return

    const newTask = {
      id: Date.now(),
      title,
      description,
      dueDate,
      reminderTime,
      priority,
      category,
      completed,
      createdAt: new Date(),
    }

    onCreate(newTask)
    handleClose()
    setTitle("")
    setDescription("")
  }

  const priorityStyles = {
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    high: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  const categories = ["personal", "work", "study", "health"]

  if (!isOpen) return null

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = [0, 15, 30, 45]

  return (
    <>
      <div className="fixed inset-0 bg-[#111827] z-50 flex flex-col p-6 h-screen">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-semibold text-lg">
            Create Task
          </h3>
          <button onClick={handleClose}>
            <X className="text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col gap-5 flex-1 justify-between max-w-xl mx-auto w-full">

          <div className="flex flex-col gap-5">

            {/* Title */}
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#1F2937] p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Description */}
            <textarea
              maxLength={120}
              placeholder="Description (max 120 chars)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#1F2937] h-24 resize-none p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Due Date */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Due Date
              </label>

              <button
                onClick={() => setIsDateOpen(true)}
                className="w-full flex items-center justify-between bg-[#1F2937] px-4 py-3 rounded-xl text-sm text-green-400"
              >
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {formatDate(dueDate)}
                </div>
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Reminder Button */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Reminder Time
              </label>

              <button
                onClick={() => setIsTimeOpen(true)}
                className="w-full flex items-center justify-between bg-[#1F2937] px-4 py-3 rounded-xl text-sm text-green-400"
              >
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  {reminderTime}
                </div>
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Priority */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Priority
              </label>

              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setPriority(level)}
                    className={`px-3 py-2 rounded-xl border text-sm transition ${
                      priority === level
                        ? priorityStyles[level]
                        : "border-gray-700 text-gray-400"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">
                Category
              </label>

              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-sm transition border ${
                      category === cat
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-[#1F2937] text-gray-400 border-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Completed Toggle */}
            <div
              onClick={() => setCompleted(!completed)}
              className="flex items-center justify-between bg-[#1F2937] px-4 py-3 rounded-xl cursor-pointer"
            >
              <span className="text-sm text-gray-300">
                Mark as completed
              </span>

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                  completed
                    ? "bg-green-500"
                    : "border border-gray-600"
                }`}
              >
                {completed && <Check size={14} />}
              </div>
            </div>

          </div>

          {/* Create Button */}
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-black py-4 rounded-xl font-medium shadow-[0_0_20px_rgba(34,197,94,0.7)] hover:scale-105 transition"
          >
            Create Task
          </button>
        </div>
      </div>

      {/* DatePicker */}
      <DatePicker
        isOpen={isDateOpen}
        onClose={() => setIsDateOpen(false)}
        selectedDate={dueDate}
        onSelect={(date) => {
          setDueDate(date)
          setIsDateOpen(false)
        }}
      />

      {/* CENTERED CLOCK OVERLAY */}
       {isTimeOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">

                {/* TIME DISPLAY (moved outside clock) */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white font-semibold text-2xl">
                    {String(selectedHour).padStart(2, "0")} : {String(selectedMinute).padStart(2, "0")} {period}
                </div>
                
            <div className="relative flex flex-col items-center">

                <button
                    onClick={() => setIsTimeOpen(false)}
                    className="absolute -top-10 text-gray-400 text-sm"
                >
                    Close
                </button>

            {/* CLOCK CENTERED */}
            <div
                className="relative w-72 h-72 rounded-full bg-[#0f172a] border border-gray-700"
                onPointerDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const centerX = rect.left + rect.width / 2
                const centerY = rect.top + rect.height / 2

                const updateHour = (clientX: number, clientY: number) => {
                    const dx = clientX - centerX
                    const dy = clientY - centerY
                    let angle = Math.atan2(dy, dx) * (180 / Math.PI)

                    angle = angle + 90
                    if (angle < 0) angle += 360

                    const hour = Math.round(angle / 30) % 12 || 12
                    setSelectedHour(hour)

                    if (navigator.vibrate) navigator.vibrate(5)
                }

                updateHour(e.clientX, e.clientY)

                const moveHandler = (moveEvent: PointerEvent) => {
                    updateHour(moveEvent.clientX, moveEvent.clientY)
                }

                const upHandler = () => {
                    window.removeEventListener("pointermove", moveHandler)
                    window.removeEventListener("pointerup", upHandler)
                }

                window.addEventListener("pointermove", moveHandler)
                window.addEventListener("pointerup", upHandler)
                }}
            >

                {/* CLOCK NUMBERS */}
                {hours.map((hour) => {
                const angle = (hour % 12) * 30
                const rad = (angle * Math.PI) / 180
                const radius = 105

                const x = radius * Math.sin(rad)
                const y = -radius * Math.cos(rad)

                return (
                    <div
                    key={hour}
                    className={`absolute w-8 h-8 text-sm rounded-full flex items-center justify-center
                    ${
                        selectedHour === hour
                        ? "text-green-400 font-semibold"
                        : "text-gray-500"
                    }`}
                    style={{
                        top: `calc(50% + ${y}px - 16px)`,
                        left: `calc(50% + ${x}px - 16px)`
                    }}
                    >
                    {hour}
                    </div>
                )
                })}

                {/* ROTATING HAND */}
                <div
                className="absolute w-1 bg-green-500 rounded-full transition-transform duration-150"
                style={{
                    height: "95px",
                    top: "50%",
                    left: "50%",
                    transformOrigin: "bottom center",
                    transform: `translate(-50%, -100%) rotate(${selectedHour * 30}deg)`
                }}
                />

                {/* CENTER DOT */}
                <div className="absolute w-4 h-4 bg-green-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />


            </div>

            {/* MINUTES BELOW */}
            <div className="flex gap-3 mt-6">
                {minutes.map(min => (
                <button
                    key={min}
                    onClick={() => setSelectedMinute(min)}
                    className={`px-4 py-2 text-sm rounded-lg
                    ${
                    selectedMinute === min
                        ? "bg-green-500 text-black"
                        : "bg-[#1F2937] text-gray-400"
                    }`}
                >
                    {String(min).padStart(2, "0")}
                </button>
                ))}
            </div>

            {/* AM / PM BELOW MINUTES */}
            <div className="flex gap-4 mt-4">
                {(["AM", "PM"] as const).map(p => (
                <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-6 py-2 rounded-xl text-sm
                    ${
                    period === p
                        ? "bg-green-500 text-black"
                        : "bg-[#1F2937] text-gray-400"
                    }`}
                >
                    {p}
                </button>
                ))}
            </div>

            </div>
        </div>
        )}
    </>
  )
}