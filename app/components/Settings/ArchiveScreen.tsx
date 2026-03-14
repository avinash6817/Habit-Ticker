"use client"

import { useState } from "react"

import { ArrowLeft, RotateCcw, Trash2, Archive, ArchiveRestore, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { IconsMapList } from "@/app/utilities/icons"
import ConfirmActionModal from "@/app/components/ConfirmActionModal"

import { Habit } from "@/app/types/habit"

import { useHabits } from "@/app/context/HabitContext"



export default function ArchiveScreen({ onClose }: { onClose: () => void }) {
    const { archivedHabits, restoreHabit, deleteArchivedHabit } = useHabits()

    const [restoringHabit, setRestoringHabit] = useState<Habit | null>(null)
    const [deletingArchivedHabit, setDeletingArchivedHabit] = useState<Habit | null>(null)

    return (
          <motion.div
            className="fixed inset-0 z-60 bg-[#0B0F1A] text-white flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-5 border-b border-white/10">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <ArrowLeft size={22} />
              </button>

              <h2 className="text-lg font-semibold">
                Archived Habits
              </h2>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">

              {archivedHabits.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-5">
                  
                  <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
                    <Archive size={35} className="text-green-400 opacity-80" />
                  </div>

                  <div>
                    <p className="text-base font-semibold text-gray-400">
                      No archived habits
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Archived habits will appear here.
                    </p>
                  </div>

                </div>            ) : (
                <div className="flex flex-col gap-2">
                  {archivedHabits.map((habit) => {
                    console.log("ARCHIVED HABIT CURRENT STATE:", habit)
                    
                    const IconComponent = IconsMapList[habit.icon as keyof typeof IconsMapList]

                    return (
                      <div
                        key={habit.id}
                        className="bg-[#111827] rounded-2xl p-4 border border-white/5 flex items-center justify-between"
                      >
                        {/* Left Section */}
                        <div className="flex items-center gap-3">

                          <div
                            className={`${habit.color} w-10 h-10 rounded-xl flex items-center justify-center text-black`}
                          >
                            <IconComponent size={18} />
                          </div>

                          <div>
                            <p className="text-sm font-medium capitalize">
                              {habit.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              {habit.completions?.length ?? 0} completions
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">

                          {/* Restore */}
                          <button
                            onClick={() => setRestoringHabit(habit)}
                            className="p-2 rounded-lg hover:bg-green-500/10 transition"
                          >
                            <RotateCcw
                              size={18}
                              className="text-green-400"
                            />
                          </button>

                          {/* Permanent Delete */}
                          <button
                            onClick={() => setDeletingArchivedHabit(habit)}
                            className="p-2 rounded-lg hover:bg-red-500/10 transition"
                          >
                            <Trash2
                              size={18}
                              className="text-red-400"
                            />
                          </button>

                        </div>
                      </div>
                    )
                  })}
                </div>
              )}


                {/* Restore Archive Habit */}
              <ConfirmActionModal
                  isOpen={!!restoringHabit}
                  onClose={() => setRestoringHabit(null)}
                  onConfirm={() => {
                      if (restoringHabit) {
                          restoreHabit(restoringHabit)
                          setRestoringHabit(null)
                      }
                  }}
                  title="Restore Habit ?"
                  description={
                      <>
                      The habit{" "}
                      {restoringHabit && (
                          <span className="font-semibold text-white capitalize">
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


                {/* Delete Archive Modal */}
                <ConfirmActionModal
                    isOpen={!!deletingArchivedHabit}
                    onClose={() => setDeletingArchivedHabit(null)}
                    onConfirm={() => {
                        if (deletingArchivedHabit) {
                            deleteArchivedHabit(deletingArchivedHabit)
                            setDeletingArchivedHabit(null)
                        }
                    }}
                    title="Delete Archived Habit ?"
                    description={
                        <>
                        This action is irreversible. You will permanently lose your streak data for archived habit{" "}
                        {deletingArchivedHabit && (
                            <span className="font-semibold text-white capitalize">
                                {deletingArchivedHabit.name}
                            </span>
                        )}{" "}
                        </>
                    }
                    confirmText="Delete"
                    confirmColor="red"
                    icon={<AlertTriangle size={22} />}
                />

            </div>
          </motion.div>
    )
}