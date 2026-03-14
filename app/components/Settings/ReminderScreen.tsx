"use client"

import { ArrowLeft, Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Footer from "./Footer"

type ReminderScreenProps = {
  isOpen: boolean
  onClose: () => void
}

export default function ReminderScreen({
  isOpen,
  onClose
}: ReminderScreenProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-[#0B0F1A] text-white flex flex-col"
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
              Reminders
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">

            {/* Notifications Section */}
            <div className="space-y-4">
              <h3 className="text-xs text-gray-400 tracking-widest">
                NOTIFICATIONS
              </h3>

              <div className="bg-[#111827] rounded-2xl overflow-hidden border border-white/5">

                <div className="flex items-center justify-between px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Bell size={18} className="text-blue-400" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Enable Notifications
                      </p>
                      <p className="text-xs text-gray-400">
                        Allow reminders for tasks and habits
                      </p>
                    </div>
                  </div>

                  {/* Placeholder toggle */}
                  <span className="text-xs text-gray-400">
                    Off
                  </span>
                </div>

              </div>
            </div>

            {/* Task Reminders Section */}
            <div className="space-y-4">
              <h3 className="text-xs text-gray-400 tracking-widest">
                TASK REMINDERS
              </h3>

              <div className="bg-[#111827] rounded-2xl border border-white/5 p-4 text-sm text-gray-400">
                Configure reminders for your scheduled tasks.
              </div>
            </div>

            {/* Habit Reminders Section */}
            <div className="space-y-4">
              <h3 className="text-xs text-gray-400 tracking-widest">
                HABIT REMINDERS
              </h3>

              <div className="bg-[#111827] rounded-2xl border border-white/5 p-4 text-sm text-gray-400">
                Configure reminders for your habits.
              </div>
            </div>

          </div>

          {/* Footer */}
          <Footer />

        </motion.div>
      )}
    </AnimatePresence>
  )
}