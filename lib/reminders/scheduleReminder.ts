type ReminderTask = {
  id: number
  title: string
  dueDate: Date
  taskScheduledTime: string
  reminderOffsetMinutes: number
}

export const scheduleReminder = async (task: ReminderTask) => {
  // if (typeof window === "undefined") return
  if (!("serviceWorker" in navigator)) return
  if (Notification.permission !== "granted") return
  if (!task.taskScheduledTime) return

  const dueDate = new Date(task.dueDate)

  const [time, modifier] = task.taskScheduledTime.split(" ")
  let [hours, minutes] = time.split(":").map(Number)

  if (modifier === "PM" && hours !== 12) hours += 12
  if (modifier === "AM" && hours === 12) hours = 0

  dueDate.setHours(hours, minutes, 0, 0)

  console.log("Reminder offset:", task.reminderOffsetMinutes, "minutes")
  const reminderTime = dueDate.getTime() - task.reminderOffsetMinutes * 60000
  console.log("Task time:", dueDate.toLocaleTimeString())
  console.log("Reminder will trigger at:",new Date(reminderTime).toLocaleTimeString())

  const delay = reminderTime - Date.now()
  console.log("Delay (minutes):",Math.round(delay / 60000))

  // const delay = 5000

  if (delay <= 0) return

  console.log(`Sending reminder to service worker for task ${task.title}`)

  const registration = await navigator.serviceWorker.ready

  registration.active?.postMessage({
    type: "SCHEDULE_REMINDER",
    payload: {
      id: task.id,
      title: task.title,
      delay,
      minutes: task.reminderOffsetMinutes
    }
  })
}