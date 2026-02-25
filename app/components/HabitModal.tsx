

"use client"

import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { habitColors, habitColorTextMap } from "../utilities/theme"
import { IconsList, IconsMapList } from "../utilities/icons"

import { createHabitAction, updateHabitAction } from "../actions/habit"

type HabitModalProps = {
  isOpen: boolean
  onClose: () => void
  onAddHabit: (habit: any) => void
  mode?: "create" | "edit"
  initialHabit?: any
  onUpdateHabit?: (habit: any) => void
}

export default function HabitModal({
  isOpen,
  onClose,
  onAddHabit,
  mode = "create",
  initialHabit = null,
  onUpdateHabit,
}: HabitModalProps) {

  const [selectedIcon, setSelectedIcon] = useState("flame")
  const [selectedColor, setSelectedColor] = useState("bg-green-300")
  const [habitName, setHabitName] = useState("")
  const [isSaving, setIsSaving] = useState(false)


  // Prefill data when editing
  useEffect(() => {
    if (mode === "edit" && initialHabit) {
      setHabitName(initialHabit.name)
      setSelectedColor(initialHabit.color)

      // icon is now already a string
      setSelectedIcon(initialHabit.icon)
    }

    if (mode === "create") {
      setHabitName("")
      setSelectedIcon("flame")
      setSelectedColor("bg-green-300")
    }
  }, [mode, initialHabit])

  const handleSave = async () => {
    if (!habitName.trim()) return
    if (isSaving) return

    try {
      setIsSaving(true)

      // ✅ EDIT MODE
      if (mode === "edit" && initialHabit && onUpdateHabit) {
        const updatedHabitFromDB = await updateHabitAction(
          initialHabit.id,
          {
            name: habitName,
            icon: selectedIcon,
            color: selectedColor,
          }
        )

        // 🔥 FORMAT createdAt just like create mode
        const dateObj = new Date(updatedHabitFromDB.createdAt)
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, "0")
        const day = String(dateObj.getDate()).padStart(2, "0")

        const formattedDate = `${year}-${month}-${day}`

        const updatedHabit = {
          ...updatedHabitFromDB,
          createdAt: formattedDate, // ✅ FIXED HERE
          completions: initialHabit.completions ?? [],
        }

        onUpdateHabit(updatedHabit)
        onClose()
        return
      }

      // ✅ CREATE MODE
      const createdHabit = await createHabitAction({
        name: habitName,
        icon: selectedIcon,
        color: selectedColor,
      })

      // 🔥 Format DB createdAt into YYYY-MM-DD
      const dateObj = new Date(createdHabit.createdAt)
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, "0")
      const day = String(dateObj.getDate()).padStart(2, "0")

      const formattedDate = `${year}-${month}-${day}`

      onAddHabit({
        ...createdHabit,
        createdAt: formattedDate, // ✅ formatted for your UI
        completions: [],
      })

      setHabitName("")
      setSelectedIcon("flame")
      setSelectedColor("bg-green-300")

      onClose()

    } 
    catch (error) {
      console.error("Failed to save habit:", error)
    } 
    finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            initial={{ y: 400, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 400, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="w-full max-w-md bg-[#111827] rounded-t-3xl p-6 space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {mode === "edit" ? "Edit Habit" : "New Habit"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition text-xl"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Selected Icon Preview */}
            <div className="flex justify-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-black ${selectedColor}`}
              >
                {(() => {
                  const PreviewIcon =
                    IconsMapList[
                      selectedIcon as keyof typeof IconsMapList
                    ]
                  return <PreviewIcon size={28} strokeWidth={2} />
                })()}
              </div>
            </div>

            {/* Habit Name */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">
                Habit Name *
              </label>
              <input
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="What habit do you want to build?"
                className="w-full bg-[#1F2937] text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Icon Picker */}
            <div className="space-y-3">
              <label className="text-sm text-gray-300">
                Choose Icon
              </label>

              <div className="flex gap-3 overflow-x-auto pt-2 no-scrollbar">
                {IconsList.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    onClick={() => setSelectedIcon(name)}
                    className={`
                      p-3 rounded-xl transition flex-shrink-0
                      ${
                        selectedIcon === name
                          ? `${selectedColor} text-black`
                          : `bg-[#1F2937] ${habitColorTextMap[selectedColor]}`
                      }
                    `}
                  >
                    <Icon size={22} strokeWidth={2} />
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="space-y-3">
              <label className="text-sm text-gray-300">
                Choose Color
              </label>

              <div className="flex gap-3 pt-2">
                {habitColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`
                      w-8 h-8 rounded-full transition
                      ${color}
                      ${
                        selectedColor === color
                          ? "ring-2 ring-white scale-110"
                          : ""
                      }
                    `}
                  />
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`
                w-full 
                ${selectedColor}
                text-black 
                py-4 
                rounded-2xl 
                font-semibold 
                active:scale-95 
                transition
              `}
            >
              {mode === "edit" ? "Update Habit" : "Save Habit"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}