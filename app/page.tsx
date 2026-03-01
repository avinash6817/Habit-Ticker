

"use client"

import { AlertTriangle,ArchiveRestore, PlusCircle} from "lucide-react"

import { DndContext, closestCenter,MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"

import { useState, useEffect } from "react"
import Header from "./components/Header"
import DateScroller from "./components/DateScroller"
import FloatingButton from "./components/FloatingButton"
import HabitModal from "./components/HabitModal"
import HabitCard from "./components/HabitCard"
import SettingsScreen from "./components/SettingsScreen"
import ArchiveScreen from "./components/ArchiveScreen"
import ConfirmActionModal from "./components/ConfirmActionModal"
import BottomSwitcher from "./components/BottomSwitcher"
import ScheduleScreen from "./components/ScheduleScreen"


// Importing Server Functions
import {  getHabitsAction, 
          deleteHabitAction, 
          archiveHabitAction, 
          restoreHabitAction,
          updateHabitOrderAction,
          getArchivedHabitsAction
        } 
from "./actions/habit"



interface Habit {
  id: number
  name: string
  completions: string[]
  icon: string
  color: string
  createdAt: string
  order: number
}

export default function Home() {

    useEffect(() => {
      const loadHabits = async () => {
        try {
          const active = await getHabitsAction()
          const archived = await getArchivedHabitsAction()

          // 🔥 Format createdAt for active habits
          const formattedActive = active.map((habit: any) => {
            const dateObj = new Date(habit.createdAt)
            const year = dateObj.getFullYear()
            const month = String(dateObj.getMonth() + 1).padStart(2, "0")
            const day = String(dateObj.getDate()).padStart(2, "0")

            return {
              ...habit,
              createdAt: `${year}-${month}-${day}`,
            }
          })

          // 🔥 Format createdAt for archived habits
          const formattedArchived = archived.map((habit: any) => {
            const dateObj = new Date(habit.createdAt)
            const year = dateObj.getFullYear()
            const month = String(dateObj.getMonth() + 1).padStart(2, "0")
            const day = String(dateObj.getDate()).padStart(2, "0")

            return {
              ...habit,
              createdAt: `${year}-${month}-${day}`,
            }
          })

          setHabits(formattedActive)
          setArchivedHabits(formattedArchived)

        } 
        catch (error) {
          console.error("Failed to load habits:", error)
        }
        finally{
          setLoading(false)
        }
      }

      loadHabits()
    }, [])

  const today = new Date()

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  const [selectedDate, setSelectedDate] = useState(formatDate(today))
  const [open, setOpen] = useState(false)
  const [habits, setHabits] = useState<Habit[]>([])
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [archiveOpen, setArchiveOpen] = useState(false)
  const [archivedHabits, setArchivedHabits] = useState<Habit[]>([])
  const [deletingArchivedHabit, setDeletingArchivedHabit] = useState<Habit | null>(null)
  const [restoringHabit, setRestoringHabit] = useState<Habit | null>(null)

  const [activeScreen, setActiveScreen] = useState<"habits" | "tasks">("habits")

  

  const handleAddHabit = (habit: Habit) => {
    setHabits(prev => [...prev, habit])
  }

  const handleUpdateHabit = async (updatedHabit: Habit) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === updatedHabit.id ? updatedHabit : h
    )
  )
  }
  

  const handleDeleteHabit = async (habitId: number) => {
    const previous = habits

    setHabits(prev => prev.filter(h => h.id !== habitId))

    try {
      await deleteHabitAction(habitId)
    } 
    catch (error) {
      console.error("Delete failed:", error)
      setHabits(previous) // rollback
    }
  }

  const handleArchiveHabit = async (habit: Habit) => {
    const previousHabits = habits
    const previousArchived = archivedHabits

    setHabits(prev => prev.filter(h => h.id !== habit.id))
    setArchivedHabits(prev => [...prev, habit])

    try {
      await archiveHabitAction(habit.id)
    } catch {
      setHabits(previousHabits)
      setArchivedHabits(previousArchived)
    }
  }

  const handleRestoreHabit = async (habit: Habit) => {
    const previousHabits = habits
    const previousArchived = archivedHabits

    // Optimistic update
    setArchivedHabits(prev =>
      prev.filter(h => h.id !== habit.id)
    )

    setHabits(prev => {
      const updated = [...prev, habit]
      return updated.sort((a, b) => a.order - b.order)
    })

    try {
      await restoreHabitAction(habit.id)
    } 
    catch (error) {
      console.error("Restore failed:", error)

      // Rollback
      setArchivedHabits(previousArchived)
      setHabits(previousHabits)
    }
  }

  const handleDeleteArchivedHabit = async (habitId: number) => {
    const previous = archivedHabits

    setArchivedHabits(prev =>
      prev.filter(h => h.id !== habitId)
    )

    try {
      await deleteHabitAction(habitId)
    } 
    catch (error) {
      console.error("Delete failed:", error)
      setArchivedHabits(previous)
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  )

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const previous = habits

    const oldIndex = habits.findIndex((item) => item.id === active.id)
    const newIndex = habits.findIndex((item) => item.id === over.id)

    const reordered = arrayMove(habits, oldIndex, newIndex)

    // Recalculate order based on new position
    const updatedWithOrder = reordered.map((habit, index) => ({
      ...habit,
      order: index,
    }))

    // Optimistic UI
    setHabits(updatedWithOrder)

    try {
      await updateHabitOrderAction(
        updatedWithOrder.map((h) => ({
          id: h.id,
          order: h.order,
        }))
      )
    } catch (error) {
      console.error("Order update failed:", error)
      setHabits(previous) // rollback
    }
  }

  return (
    <main
        className="min-h-screen bg-[#0B0F1A] text-white px-4 max-w-[1024px] mx-auto"
        style={{ ["--primary-color" as any]: "#22c55e" }}
      > 

        {/* Header + DateScroller Components */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#0B0F1A] max-w-[1024px] mx-auto px-4">
          <Header
            onOpenSettings={() => setSettingsOpen(true)}
          />
          {activeScreen === "habits" && (
            <DateScroller
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              habits={habits}
            />
          )}
        </div>


      {/* HabitCard Component */}
      {activeScreen === "habits" && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          >
          <SortableContext
            items={habits.map((h) => h.id)}
            strategy={verticalListSortingStrategy}
          >
            {loading ? (
              <div className="flex flex-col gap-5 px-2 pt-40">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl bg-[#1F2937] animate-pulse"
                  />
                ))}
              </div>
            ) : habits.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] text-center px-6">
                <PlusCircle size={42} className="text-green-400" />

                <h3 className="text-lg font-semibold text-white mb-2">
                  No habits yet
                </h3>

                <p className="text-sm text-gray-400">
                  Tap the + button to add your first habit
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5 min-h-[calc(100vh)] px-2 pt-40 pb-30">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    selectedDate={selectedDate}
                    setHabit={(updatedHabit: Habit) => {
                      setHabits((prev) =>
                        prev.map((h) =>
                          h.id === updatedHabit.id ? updatedHabit : h
                        )
                      )
                    }}
                    onEdit={() => {
                      setEditingHabit(habit)
                      setOpen(true)
                    }}
                    onDelete={() => {
                      setDeletingHabit(habit)
                    }}
                    onArchive={() => handleArchiveHabit(habit)}
                  />
                ))}
              </div>
            )}
            
          </SortableContext>
        </DndContext>
      )}

      {/* Schedule Screen */}
      {activeScreen === "tasks" && <ScheduleScreen />}

      {activeScreen === "habits" && (
        <FloatingButton
          onClick={() => {
            setEditingHabit(null)
            setOpen(true)
          }}
        />
      )}

      {/* HabitModal Component */}
      <HabitModal
        isOpen={open}
        onClose={() => {
          setOpen(false)
          setEditingHabit(null)
        }}
        onAddHabit={handleAddHabit}
        onUpdateHabit={handleUpdateHabit}
        mode={editingHabit ? "edit" : "create"}
        initialHabit={editingHabit}
      />

      {/* Modal for Delete confirm */}
      <ConfirmActionModal
        isOpen={!!deletingHabit}
        onClose={() => setDeletingHabit(null)}
        onConfirm={() => {
          if (deletingHabit) handleDeleteHabit(deletingHabit.id)
        }}
        title="Delete Habit ?"
        description={
          <>
            This action is irreversible. You will permanently lose your streak data{" "}
            {deletingHabit && (
              <>
                for{" "}
                <span className="font-semibold text-white">
                  {deletingHabit.name}
                </span>
              </>
            )}
            .
          </>
        }
        confirmText="Delete"
        confirmColor="red"
        icon={<AlertTriangle size={22} />}
      />


      {/* SettingsScreen Component */}
      <SettingsScreen
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenArchive={() => {
          setArchiveOpen(true)
        }}
        archivedCount={archivedHabits.length}
      />

      {/* ArchiveScreen Component */}
      <ArchiveScreen
        isOpen={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        archivedHabits={archivedHabits}
        onRestore={(habit) => setRestoringHabit(habit)}
        onDelete={(habit) => setDeletingArchivedHabit(habit)}
      />

        {/* Modal for Restore confirm*/}
      <ConfirmActionModal
        isOpen={!!restoringHabit}
        onClose={() => setRestoringHabit(null)}
        onConfirm={() => {
          if (restoringHabit) {
            handleRestoreHabit(restoringHabit)
            setRestoringHabit(null)
          }
        }}
        title="Restore Habit ?"
        description={
          <>
            The habit{" "}
            {restoringHabit && (
              <span className="font-semibold text-white">
                {restoringHabit.name}
              </span>
            )}{" "}
            will be restored along with its completion and streak data.
          </>
        }
        confirmText="Restore"
        confirmColor="green"
        icon={<ArchiveRestore size={22} />}
      />

      {/* Modal for ArchiveDelete confirm */}
      <ConfirmActionModal
        isOpen={!!deletingArchivedHabit}
        onClose={() => setDeletingArchivedHabit(null)}
        onConfirm={() => {
          if (deletingArchivedHabit) {
            handleDeleteArchivedHabit(deletingArchivedHabit.id)
            setDeletingArchivedHabit(null)
          }
        }}
        title="Delete Archived Habit ?"
        description={
          <>
            This action is irreversible.You will permanently lose your streak data for archived habit{" "}
            {deletingArchivedHabit && (
              <span className="font-semibold text-white">
                {deletingArchivedHabit.name}
              </span>
            )}{" "}
          </>
        }
        confirmText="Delete"
        confirmColor="red"
        icon={<AlertTriangle size={22} />}
      />

      <BottomSwitcher
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      />  

    </main>
  )
}