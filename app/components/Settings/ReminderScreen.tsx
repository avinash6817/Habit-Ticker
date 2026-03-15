"use client"

import { useState } from "react"
import { ArrowLeft, Bell } from "lucide-react"
import { motion } from "framer-motion"
import { subscribeUser } from "@/lib/push"

export default function RemindersScreen({
  onClose
}: {
  onClose: () => void
}) {

  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    setStatusMessage(null)

    try {
      const result = await subscribeUser()

      if (result?.message) {
        setStatusMessage(result.message)
      } else {
        setStatusMessage("Something went wrong")
      }
    } catch (error) {
      console.error(error)
      setStatusMessage("Subscription failed")
    }

    setLoading(false)
  }

  return (
    <div
      className="bg-[#0B0F1A] flex flex-col h-full"
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
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">

        <div className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden">

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition disabled:opacity-50"
          >

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Bell size={18} className="text-blue-400" />
              </div>

              <div className="text-left">
                <p className="text-sm font-medium">
                  Enable Notifications
                </p>

                <p className="text-xs text-gray-400">
                  Allow reminders for tasks and habits
                </p>
              </div>

            </div>

          </button>

        </div>


        {/* Status Message */}
        {statusMessage && (
          <div className="text-center text-sm text-gray-400">
            {statusMessage}
          </div>
        )}

      </div>

    </div>
  )
}