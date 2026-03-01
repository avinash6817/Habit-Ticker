
"use client"

import { CheckSquare, CalendarDays } from "lucide-react"

interface BottomSwitcherProps {
  activeScreen: "habits" | "tasks"
  setActiveScreen: (screen: "habits" | "tasks") => void
}

export default function BottomSwitcher({
  activeScreen,
  setActiveScreen,
}: BottomSwitcherProps) {
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40">
      <div className="relative inline-flex bg-[#111827]/90 backdrop-blur-md rounded-full p-1 border border-gray-700 shadow-lg">
        
        {/* Animated Glow Background */}
        <div
          className={`absolute top-1 bottom-1 rounded-full bg-green-500 transition-all duration-300 ease-in-out shadow-[0_0_20px_rgba(34,197,94,0.6)] ${
            activeScreen === "habits"
              ? "left-1 right-1/2"
              : "left-1/2 right-1"
          }`}
        />

        {/* Habits Button */}
        <button
          onClick={() => setActiveScreen("habits")}
          className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
            activeScreen === "habits"
              ? "text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <CheckSquare size={16} />
          Habits
        </button>

        {/* Tasks Button */}
        <button
          onClick={() => setActiveScreen("tasks")}
          className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
            activeScreen === "tasks"
              ? "text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <CalendarDays size={16} />
          Tasks
        </button>
      </div>
    </div>
  )
}