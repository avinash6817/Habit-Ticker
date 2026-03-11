import { sendPush } from "@/lib/sendPush"

export async function GET() {

  await sendPush(
    "Habit Tracker",
    "This is your first server push notification 🚀"
  )

  return Response.json({ success: true })

}