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

  const handleSettingsClick = () => {
    if (navigator.vibrate) {
      navigator.vibrate([10, 20, 10])
    }
    onOpenSettings()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0F1A] max-w-[1024px] mx-auto px-4">
      <div className="py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          Today, {day}
          {getOrdinal(day)} {month}, {weekday}
        </h1>

        <button
          onClick={handleSettingsClick}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <Settings size={22} />
        </button>
      </div>
    </header>
  )
}