type ReminderTask = {
  id: number
  title: string
  dueDate: Date
  reminderTime?: string | null
}

export const scheduleReminder = async (task: ReminderTask) => {
  if (typeof window === "undefined") return
  if (!("serviceWorker" in navigator)) return
  if (Notification.permission !== "granted") return
  if (!task.reminderTime) return

  const dueDate = new Date(task.dueDate)

  const [time, modifier] = task.reminderTime.split(" ")
  let [hours, minutes] = time.split(":").map(Number)

  if (modifier === "PM" && hours !== 12) hours += 12
  if (modifier === "AM" && hours === 12) hours = 0

  dueDate.setHours(hours, minutes, 0, 0)

  const delay = dueDate.getTime() - Date.now()
  // const delay = 5000

  if (delay <= 0) return

  console.log(`Sending reminder to service worker for task ${task.id}`)

  const registration = await navigator.serviceWorker.ready

  registration.active?.postMessage({
    type: "SCHEDULE_REMINDER",
    payload: {
      id: task.id,
      title: task.title,
      delay,
    }
  })
}