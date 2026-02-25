"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ReactNode } from "react"

type ConfirmActionModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void

  title: string
  description: React.ReactNode
  confirmText: string

  confirmColor?: "red" | "green" | "yellow"
  icon?: ReactNode
}

export default function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  confirmColor = "red",
  icon,
}: ConfirmActionModalProps) {

  const colorStyles = {
    red: {
      button: "bg-red-500 hover:bg-red-600 text-white",
      iconBg: "bg-red-500/20 text-red-500",
    },
    green: {
      button: "bg-green-500 hover:bg-green-600 text-white",
      iconBg: "bg-green-500/20 text-green-500",
    },
    yellow: {
      button: "bg-yellow-500 hover:bg-yellow-600 text-black",
      iconBg: "bg-yellow-500/20 text-yellow-500",
    },
  }

  const styles = colorStyles[confirmColor]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full max-w-sm bg-[#111827] rounded-2xl p-6 space-y-5 border border-white/10"
          >
            {/* Icon */}
            {icon && (
              <div className="flex justify-center">
                <div className={`p-3 rounded-full ${styles.iconBg}`}>
                  {icon}
                </div>
              </div>
            )}

            {/* Title + Description */}
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold text-white">
                {title}
              </h2>

              <p className="text-sm text-gray-400">
                {description}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-[#1F2937] py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${styles.button}`}
              >
                {confirmText}
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}