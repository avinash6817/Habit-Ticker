"use client"

import { ArrowLeft, ChevronRight, Archive } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Footer from "./Footer"

type SettingsScreenProps = {
  isOpen: boolean
  onClose: () => void
  onOpenArchive: () => void
  archivedCount: number
}

export default function SettingsScreen({
  isOpen,
  onClose,
  onOpenArchive,
  archivedCount
}: SettingsScreenProps) {
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

                <h2 className="text-lg font-semibold">Settings</h2>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">

                {/* APP SECTION */}
                <div className="space-y-4">
                <h3 className="text-xs text-gray-400 tracking-widest">
                    APP
                </h3>

                <div className="bg-[#111827] rounded-2xl overflow-hidden border border-white/5">
                    
                    {/* Archived Habits */}
                    <button
                        onClick={onOpenArchive}
                        className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition"
                        >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <Archive size={18} className="text-green-400" />
                            </div>

                            <div className="text-left">
                            <p className="text-sm font-medium">
                                Archived Habits
                            </p>
                            <p className="text-xs text-gray-400">
                                View and restore archived habits
                            </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {archivedCount > 0 && (
                               <span className="w-7 h-7 text-[11px] flex items-center justify-center rounded-full bg-red-500/20 text-red-400 font-bold" >
                                    {archivedCount}
                                </span>
                            )}
                            <ChevronRight size={18} className="text-gray-500" />
                        </div>

                    </button>

                </div>
                </div>

            </div>

            {/* Footer */}
            <Footer/>
            
        </motion.div>
      )}
    </AnimatePresence>
  )
}