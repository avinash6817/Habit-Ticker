import { prisma } from "@/lib/prisma"
import { sendPush } from "@/lib/sendPush"

export async function GET(req: Request) {

  console.log("Auth header:", req.headers.get("authorization"))

  const url = new URL(req.url)
  const testKey = url.searchParams.get("key")
  const authHeader = req.headers.get("authorization")

  if (
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    testKey !== process.env.CRON_SECRET
  ) {
    return new Response("Unauthorized", { status: 401 })
  }

  const now = new Date()
  console.log("Current time (Local):", now.toString())

  const tasks = await prisma.task.findMany({
    where: {
      completed: false
    }
  })

  console.log("===== CRON RUN START =====")
  
  for (const task of tasks) {

    console.log("Time:", new Date().toString())

    console.log("--------------------------------------------------")
    console.log("Processing task:", task.title)

    const dueDate = new Date(task.dueDate)
    console.log("dueDate from DB (Local):", dueDate.toString())

    console.log("taskScheduledTime (raw):", task.taskScheduledTime)

    const [time, modifier] = task.taskScheduledTime.split(" ")
    console.log("After split -> time:", time, "| modifier:", modifier)

    let [hours, minutes] = time.split(":").map(Number)
    console.log("Parsed hours & minutes:", hours, minutes)

    if (modifier === "PM" && hours !== 12) hours += 12
    if (modifier === "AM" && hours === 12) hours = 0

    console.log("24hr converted hours & minutes:", hours, minutes)

    // ⭐ FIX: convert IST → UTC
    const IST_OFFSET_HOURS = 5
    const IST_OFFSET_MINUTES = 30

    hours -= IST_OFFSET_HOURS
    minutes -= IST_OFFSET_MINUTES

    if (minutes < 0) {
      hours -= 1
      minutes += 60
    }

    console.log("After IST → UTC conversion:", hours, minutes)

    dueDate.setUTCHours(hours, minutes, 0, 0)
    console.log("dueDate after setUTCHours:", dueDate.toString())

    const reminderTime = dueDate.getTime() - task.reminderOffsetMinutes * 60000
    console.log("reminderTime (timestamp):", reminderTime)

    const reminderDate = new Date(reminderTime)
    console.log("reminderDate (Local):", reminderDate.toString())

    const alreadySent = task.lastReminderSentAt !== null
    console.log("lastReminderSentAt:", task.lastReminderSentAt)
    console.log("alreadySent:", alreadySent)

    console.log("Condition check -> now >= reminderDate :", now >= reminderDate)

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