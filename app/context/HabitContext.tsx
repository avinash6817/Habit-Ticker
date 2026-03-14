"use client"

import { createContext, useContext } from "react"
import { Habit } from "@/app/types/habit"
import { Task } from "@/app/types/task"

import { restoreHabitAction,deleteHabitAction } from "@/app/actions/habit"

type HabitContextType = {
    habits: Habit[]
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>

    archivedHabits: Habit[]
    setArchivedHabits: React.Dispatch<React.SetStateAction<Habit[]>>

    tasks: Task[]
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>

    selectedDate: string
    setSelectedDate: (date: string) => void

    loading: boolean
    tasksLoading: boolean

    restoreHabit: (habit: Habit) => void
    deleteArchivedHabit: (habit: Habit) => void
}

export const HabitContext = createContext<HabitContextType | null>(null)

export function useHabits() {
    const context = useContext(HabitContext)

    if (!context) {
        throw new Error("useHabits must be used inside HabitContext Provider")
    }

    return context
}


/* ---------------- PROVIDER ---------------- */

type HabitProviderProps = {
    children: React.ReactNode

    habits: Habit[]
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>

    archivedHabits: Habit[]
    setArchivedHabits: React.Dispatch<React.SetStateAction<Habit[]>>

    tasks: Task[]
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>

    selectedDate: string
    setSelectedDate: (date: string) => void

    loading: boolean
    tasksLoading: boolean
}

export function HabitProvider({
    children,
    habits,
    setHabits,
    archivedHabits,
    setArchivedHabits,
    tasks,
    setTasks,
    selectedDate,
    setSelectedDate,
    loading,
    tasksLoading
}: HabitProviderProps) {

    const restoreHabit = async (habit: Habit) => {
        const previousHabits = habits
        const previousArchived = archivedHabits

        // optimistic update
        setArchivedHabits(prev =>
            prev.filter(h => h.id !== habit.id)
        )

        setHabits(prev => {

            const restoredHabit = {
                ...habit,
                isArchived: false,
                completions: habit.completions ?? []
            }

            const updated = [...prev, restoredHabit]

            return updated.sort((a, b) => a.order - b.order)
        })

        try {
            await restoreHabitAction(habit.id)
        }
        catch (error) {
            console.error("Restore failed:", error)

            // rollback
            setArchivedHabits(previousArchived)
            setHabits(previousHabits)
        }
    }

    const deleteArchivedHabit = async (habit: Habit) => {
       const previous = archivedHabits

        setArchivedHabits(prev =>
            prev.filter(h => h.id !== habit.id)
        )

        try {
            await deleteHabitAction(habit.id)
        }
        catch (error) {
            console.error("Delete failed:", error)

            setArchivedHabits(previous)
        }
    }

    return (
        <HabitContext.Provider
            value={{
                habits,
                setHabits,
                archivedHabits,
                setArchivedHabits,
                tasks,
                setTasks,
                selectedDate,
                setSelectedDate,
                loading,
                tasksLoading,
                restoreHabit,
                deleteArchivedHabit
            }}
        >
            {children}
        </HabitContext.Provider>
    )
}