"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Habit } from "@/app/types/habit"
import { restoreHabitAction, deleteHabitAction, getHabitsAction, getArchivedHabitsAction } from "@/app/actions/habit"
import { toLocalDateString } from "@/lib/date"

type HabitContextType = {
    habits: Habit[]
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>

    archivedHabits: Habit[]
    setArchivedHabits: React.Dispatch<React.SetStateAction<Habit[]>>

    selectedDate: string
    setSelectedDate: (date: string) => void

    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>

    restoreHabit: (habit: Habit) => void
    deleteArchivedHabit: (habit: Habit) => void
}

export const HabitContext = createContext<HabitContextType | null>(null)

export function useHabits() {
    const context = useContext(HabitContext)

    if (!context) {
        throw new Error("useHabits must be used inside HabitProvider")
    }

    return context
}

type HabitProviderProps = {
  children: React.ReactNode
}

export function HabitProvider({ children }: HabitProviderProps) {
    const today = new Date()
    
    const [selectedDate, setSelectedDate] = useState(toLocalDateString(today))
    const [habits, setHabits] = useState<Habit[]>([])
    const [archivedHabits, setArchivedHabits] = useState<Habit[]>([])
    const [loading, setLoading] = useState(true)

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

    // SERVER ACTION FUNCTION
    const restoreHabit = async (habit: Habit) => {
        const previousHabits = habits
        const previousArchived = archivedHabits

        setArchivedHabits(prev => prev.filter(h => h.id !== habit.id))

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
        } catch (error) {
        console.error("Restore failed:", error)

        setArchivedHabits(previousArchived)
        setHabits(previousHabits)
        }
    }

    const deleteArchivedHabit = async (habit: Habit) => {
        const previous = archivedHabits

        setArchivedHabits(prev => prev.filter(h => h.id !== habit.id))

        try {
        await deleteHabitAction(habit.id)
        } catch (error) {
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
                selectedDate,
                setSelectedDate,
                loading,
                setLoading,
                restoreHabit,
                deleteArchivedHabit
            }}
            >
            {children}
        </HabitContext.Provider>
    )
}