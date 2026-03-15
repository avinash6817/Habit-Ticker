"use client"

import { useState } from "react"

import HabitDateScroller from "./HabitDateScroller"
import HabitCard from "./HabitCard"
import HabitModal from "./HabitModal"
import HabitCreateButton from "./HabitCreateButton"

import { DndContext, closestCenter,MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"

import { PlusCircle,AlertTriangle } from "lucide-react"

import ConfirmActionModal from "../ConfirmActionModal"

import { Habit } from "@/app/types/habit"

import { useHabits } from "@/app/context/HabitContext"


// Server Functions
import {    updateHabitOrderAction, 
            deleteHabitAction, 
            archiveHabitAction, 
        } 
from "@/app/actions/habit"


export default function HabitsScreen(){
    const [open, setOpen] = useState(false)
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
    const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null)
    const [archivingHabit, setArchivingHabit] = useState<Habit | null>(null)

    const { habits, setHabits, archivedHabits, setArchivedHabits, selectedDate, loading } = useHabits()


    const handleAddHabit = (habit: Habit) => {
        setHabits(prev => [...prev, habit])
    }

    const handleUpdateHabit = (updatedHabit: Habit) => {
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
            setHabits(previous)
        }
    }

    const handleArchiveHabit = async (habit: Habit) => {
        console.log("ARCHIVE HABIT BEFORE : ", habit)

        const previousHabits = habits
        const previousArchived = archivedHabits

        // Remove from active habits
        setHabits(prev => prev.filter(h => h.id !== habit.id))

        // Add to archived habits with current completions preserved
        setArchivedHabits(prev => [
            ...prev,
            {
                ...habit,
                isArchived: true,        // mark it archived
                completions: habit.completions ?? [] // use the updated completions
            }
        ])

        try {
            await archiveHabitAction(habit.id)
        } 
        catch (error) {
            console.error("Archive failed:", error)
            // rollback if server fails
            setHabits(previousHabits)
            setArchivedHabits(previousArchived)
        }

        console.log("ARCHIVE HABIT AFTER : ", habit)
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

        const updatedWithOrder = reordered.map((habit, index) => ({
            ...habit,
            order: index,
        }))

        setHabits(updatedWithOrder)

        try {
            await updateHabitOrderAction(
            updatedWithOrder.map((h) => ({
                id: h.id,
                order: h.order,
            }))
            )
        } 
        catch (error) {
            console.error("Order update failed:", error)
            setHabits(previous)
        }
    }

    return (
        <div className="flex flex-col flex-1">

            {/* Date Scroller */}
            <div className="fixed top-[70px] left-0 right-0 z-30 bg-[#0B0F1A] max-w-[1024px] mx-auto px-4">
                <HabitDateScroller />
            </div>


            {/* HabitCard List */}
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
                    <div className="flex flex-col gap-5 pt-40">
                        {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-3xl border border-purple-300/30 p-5 bg-[#0F172A] animate-pulse"
                        >
                            <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-xl bg-gray-700" />
                                <div className="h-5 w-32 bg-gray-700 rounded" />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gray-700" />
                                <div className="w-6 h-6 rounded bg-gray-700" />
                            </div>
                            </div>

                            <div className="grid grid-cols-[repeat(auto-fit,minmax(16px,1fr))] gap-2 mb-6">
                            {[...Array(56)].map((_, j) => (
                                <div key={j} className="aspect-square rounded bg-gray-700" />
                            ))}
                            </div>

                            <div className="flex justify-between items-center">
                            <div className="h-4 w-28 bg-gray-700 rounded" />
                            <div className="h-6 w-32 bg-gray-700 rounded-full" />
                            </div>
                        </div>
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
                    <div className="flex flex-col gap-5 min-h-[calc(100vh)] pt-40 pb-30">
                       {habits.map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                selectedDate={selectedDate}
                                 setHabit={(updatedHabit: Habit) => {
                                    setHabits(prev =>
                                    prev.map(h =>
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
                                onArchive={() => setArchivingHabit(habit)}
                                onUpdateHabit={(updatedHabit) => {
                                    // Update both active and archived arrays
                                    setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h))
                                    setArchivedHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h))
                                }}
                            />
                        ))}
                    </div>
                    )}
                    
                </SortableContext>
            </DndContext>



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
                        <span className="font-semibold text-white capitalize">
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


            {/* Floating Create Habit button */}
            <HabitCreateButton
                onClick={() => {
                    setEditingHabit(null)
                    setOpen(true)
                }}
            />


            <ConfirmActionModal
                isOpen={!!archivingHabit}
                onClose={() => setArchivingHabit(null)}
                onConfirm={() => {
                    if (archivingHabit) {
                        handleArchiveHabit(archivingHabit)
                        setArchivingHabit(null)
                    }
                }}
                title={`Archive Habit ?`}
                description={
                    <>
                    <span className="font-semibold text-white capitalize">
                        {archivingHabit?.name}
                    </span>
                    {" "} progress will be saved. You can restore it anytime from settings.
                    </>
                }
                confirmText="Archive"
                confirmColor="yellow"
                icon={<AlertTriangle size={22} />}
            />


        </div>
    )
}