

"use client"

import { useState, useEffect } from "react"

import { Habit } from "./types/habit"
import { Task } from "./types/task"
import { toLocalDateString } from "@/lib/date"

import { getTasksAction } from "./actions/task"

import Header from "./components/Header"
import HabitsScreen from "./components/Habits/HabitsScreen"
import SettingsScreen from "./components/Settings/SettingsScreen"
import TasksScreen from "./components/Tasks/TasksScreen"
import BottomSwitcher from "./components/BottomSwitcher"


// Importing Server Functions
import {  getHabitsAction, 
          getArchivedHabitsAction
        } 
from "./actions/habit"

export default function Home() {
    const today = new Date()

    const [selectedDate, setSelectedDate] = useState(toLocalDateString(today))
    const [habits, setHabits] = useState<Habit[]>([])
    const [archivedHabits, setArchivedHabits] = useState<Habit[]>([])

    const [settingsOpen, setSettingsOpen] = useState(false)
    const [archiveOpen, setArchiveOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const [activeScreen, setActiveScreen] = useState<"habits" | "tasks">("habits")

    const [tasks, setTasks] = useState<Task[]>([])
    const [tasksLoading, setTasksLoading] = useState(true)

  useEffect(() => {
    console.log("🌟 Global habits state changed:", habits)
  }, [habits])

  useEffect(() => {
    console.log("🌟 Global archivedHabits state changed:", archivedHabits)
  }, [archivedHabits])


  useEffect(() => {
    const loadHabits = async () => {
      try {
        const active = await getHabitsAction()
        const archived = await getArchivedHabitsAction()

        // Format active habits and add completions
        const formattedActive = active.map((habit: any) => {
          const dateObj = new Date(habit.createdAt)
          const year = dateObj.getFullYear()
          const month = String(dateObj.getMonth() + 1).padStart(2, "0")
          const day = String(dateObj.getDate()).padStart(2, "0")

          // ✅ Add completions from logs
          const completions = habit.logs?.map((log: any) => {
            const logDate = new Date(log.date)
            const y = logDate.getFullYear()
            const m = String(logDate.getMonth() + 1).padStart(2, "0")
            const d = String(logDate.getDate()).padStart(2, "0")
            return `${y}-${m}-${d}`
          }) ?? []

          return {
            ...habit,
            createdAt: `${year}-${month}-${day}`,
            completions,
            isArchived: habit.isArchived
          }
        })

        // console.log("✅ FORMATTED ACTIVE HABITS:", formattedActive)
        // formattedActive.forEach(habit => {
        //   console.log("Habit:", habit.name, "Completions:", habit.completions)
        // })

        // Format archived habits and add completions
        const formattedArchived = archived.map((habit: any) => {
          const dateObj = new Date(habit.createdAt)
          const year = dateObj.getFullYear()
          const month = String(dateObj.getMonth() + 1).padStart(2, "0")
          const day = String(dateObj.getDate()).padStart(2, "0")

          // ✅ Add completions from logs
          const completions = habit.logs?.map((log: any) => {
            const logDate = new Date(log.date)
            const y = logDate.getFullYear()
            const m = String(logDate.getMonth() + 1).padStart(2, "0")
            const d = String(logDate.getDate()).padStart(2, "0")
            return `${y}-${m}-${d}`
          }) ?? []

          return {
            ...habit,
            createdAt: `${year}-${month}-${day}`,
            completions,
            isArchived: habit.isArchived
          }
        })

        // console.log("✅ FORMATTED ARCHIVED HABITS:", formattedArchived)
        // formattedArchived.forEach(habit => {
        //   console.log("Archived Habit:", habit.name, "Completions:", habit.completions)
        // })

        setHabits(formattedActive)
        setArchivedHabits(formattedArchived)

      } 
      catch (error) {
        console.error("Failed to load habits:", error)
      }
      finally {
        setLoading(false)
      }
    }

    loadHabits()
  }, [])

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getTasksAction()

        const formattedTasks: Task[] = data.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
          priority: task.priority as "low" | "medium" | "high"
        }))

        setTasks(formattedTasks)

        // formattedTasks.forEach((task) => {
        //   scheduleReminder(task)
        // })
      }
      catch (error) {
        console.error("Failed to load tasks:", error)
      }
      finally {
        setTasksLoading(false)
      }
    }

  loadTasks()
}, [])

  



  return (
    <main
        className="min-h-screen bg-[#0B0F1A] text-white px-4 max-w-[1024px] mx-auto"
        style={{ ["--primary-color" as any]: "#22c55e" }}
      > 

        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#0B0F1A] max-w-[1024px] mx-auto px-4">
          <Header
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </div>

        {/* Habit Screen */}
        {activeScreen === "habits" && (
          <HabitsScreen
            habits={habits}
            setHabits={setHabits}
            archivedHabits={archivedHabits}
            setArchivedHabits={setArchivedHabits}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            loading={loading}
            archiveOpen={archiveOpen}
            setArchiveOpen={setArchiveOpen}
          />
        )}


         {/* Task Screen */}
        {activeScreen === "tasks" && (
          <TasksScreen
            tasks={tasks}
            setTasks={setTasks}
            loading={tasksLoading}
        />)}


      {/* SettingsScreen Component */}
      <SettingsScreen
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenArchive={() => setArchiveOpen(true)}
        archivedCount={archivedHabits.length}
      />


      <BottomSwitcher
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      />  


    </main>
  )
}