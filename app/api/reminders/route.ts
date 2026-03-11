import { prisma } from "@/lib/prisma"
import { sendPush } from "@/lib/sendPush"

export async function GET() {

  console.log("Cron running:", new Date())

  const now = new Date()

  const tasks = await prisma.task.findMany({
    where: {
      completed: false
    }
  })

  for (const task of tasks) {

    const dueDate = new Date(task.dueDate)

    const [time, modifier] = task.taskScheduledTime.split(" ")
    let [hours, minutes] = time.split(":").map(Number)

    if (modifier === "PM" && hours !== 12) hours += 12
    if (modifier === "AM" && hours === 12) hours = 0

    dueDate.setHours(hours, minutes, 0, 0)

    const reminderTime = dueDate.getTime() - task.reminderOffsetMinutes * 60000
    const reminderDate = new Date(reminderTime)

    const alreadySent = task.lastReminderSentAt !== null

    console.log("Task:", task.title)
    console.log("Now:", now.toISOString())
    console.log("ReminderDate:", reminderDate.toISOString())
    console.log("AlreadySent:", alreadySent)

    if (now >= reminderDate && !alreadySent) {
       console.log("Triggering reminder for:", task.title)

      await sendPush(
        "Task Reminder",
        `${task.title} is starting soon`
      )

      await prisma.task.update({
        where: { id: task.id },
        data: {
          lastReminderSentAt: new Date()
        }
      })
    }
  }

  return Response.json({ checked: true })

}