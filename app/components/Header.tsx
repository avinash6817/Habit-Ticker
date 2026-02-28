"use client";

import { Settings } from "lucide-react"

type HeaderProps = {
  onOpenSettings: () => void
}

export default function Header({ onOpenSettings }: HeaderProps) {
  const today = new Date()

  const day = today.getDate()
  const month = today.toLocaleString("en-IN", { month: "short" })
  const weekday = today.toLocaleString("en-IN", { weekday: "long" })

  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th"
    switch (n % 10) {
      case 1: return "st"
      case 2: return "nd"
      case 3: return "rd"
      default: return "th"
    }
  }

  return (
    <header className="px-6 py-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold">
        Today, {day}
        {getOrdinal(day)} {month}, {weekday}
      </h1>

      <button
          onClick={onOpenSettings}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
        <Settings size={22} />
      </button>
    </header>
  )
}