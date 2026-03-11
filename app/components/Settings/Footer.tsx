"use client"

import { subscribeUser } from "@/lib/push"

export default function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-gray-500">
      Developed by <span className="font-semibold text-gray-300">Avinash</span>
      <button onClick={subscribeUser}>
        Enable Notifications
      </button>
    </footer>
  )
}