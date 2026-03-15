

"use client"

import { useState } from "react"

import Header from "./components/Header"
import HabitsScreen from "./components/Habits/HabitsScreen"
import SettingsScreen from "./components/Settings/SettingsScreen"
import TasksScreen from "./components/Tasks/TasksScreen"
import BottomSwitcher from "./components/BottomSwitcher"


export default function Home() {  
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeScreen, setActiveScreen] = useState<"habits" | "tasks">("habits")


  return (
        <main
            className="min-h-screen bg-[#0B0F1A] text-white px-4 max-w-[1024px] mx-auto"
            style={{ ["--primary-color" as any]: "#22c55e" }}
            > 

            {/* Header */}
            <Header
              onOpenSettings={() => setSettingsOpen(true)}
            />

            {/* Habit Screen */}
            {activeScreen === "habits" && ( <HabitsScreen/> )}

            {/* Task Screen */}
            {activeScreen === "tasks" && ( <TasksScreen />)}


            {/* SettingsScreen Component */}
            <SettingsScreen
              isOpen={settingsOpen}
              onClose={() => setSettingsOpen(false)}
            />

            <BottomSwitcher
              activeScreen={activeScreen}
              setActiveScreen={setActiveScreen}
            />  

        </main>


  )
}