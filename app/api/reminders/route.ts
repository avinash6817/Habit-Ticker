import { prisma } from "@/lib/prisma"
import { sendPush } from "@/lib/sendPush"

export async function GET(req: Request) {

  console.log("Auth header:", req.headers.get("authorization"))

  // 🔒 Protect cron endpoint
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

  for (const task of tasks) {
    console.log("===== CRON RUN START =====")
    console.log("Time:", new Date().toString())

    console.log("--------------------------------------------------")
    console.log("Processing task:", task.title)

    // 1️⃣ dueDate from DB
    const dueDate = new Date(task.dueDate)
    console.log("dueDate from DB (Local):", dueDate.toString())

    // 2️⃣ taskScheduledTime before split
    console.log("taskScheduledTime (raw):", task.taskScheduledTime)

    // 3️⃣ after first split
    const [time, modifier] = task.taskScheduledTime.split(" ")
    console.log("After split -> time:", time, "| modifier:", modifier)

    // 4️⃣ hours + minutes extraction
    let [hours, minutes] = time.split(":").map(Number)
    console.log("Parsed hours & minutes:", hours, minutes)

    // 5️⃣ AM/PM conversion
    if (modifier === "PM" && hours !== 12) hours += 12
    if (modifier === "AM" && hours === 12) hours = 0

    console.log("24hr converted hours & minutes:", hours, minutes)

    // 6️⃣ dueDate after setHours
    dueDate.setHours(hours, minutes, 0, 0)
    console.log("dueDate after setHours (Local):", dueDate.toString())

    // 7️⃣ reminderTime calculation
    const reminderTime = dueDate.getTime() - task.reminderOffsetMinutes * 60000
    console.log("reminderTime (timestamp):", reminderTime)

    // 8️⃣ reminderDate
    const reminderDate = new Date(reminderTime)
    console.log("reminderDate (Local):", reminderDate.toString())

    // 9️⃣ alreadySent check
    const alreadySent = task.lastReminderSentAt !== null
    console.log("lastReminderSentAt:", task.lastReminderSentAt)
    console.log("alreadySent:", alreadySent)

    // 🔟 condition evaluation
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