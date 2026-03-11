"use client"

import { useEffect } from "react"

export default function DevCron() {

  console.log("DevCron component mounted")

  useEffect(() => {

    console.log("DevCron interval started")

    async function runReminderCheck() {
      try {
        await fetch("http://localhost:3000/api/reminders")
        console.log("Dev cron executed:", new Date())
      } catch (err) {
        console.error("Dev cron error", err)
      }
    }

    const interval = setInterval(runReminderCheck, 10000)

    return () => clearInterval(interval)

  }, [])

  return null
}