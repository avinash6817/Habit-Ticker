import webpush from "web-push"
import { prisma } from "@/lib/prisma"

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function sendPush(title: string, body: string) {

  const subs = await prisma.pushSubscription.findMany()
  console.log(`Sending push to ${subs.length} devices`)

  for (const sub of subs) {

    try {

      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        },
        JSON.stringify({
          title,
          body
        })
      )

    } 
    catch (error: any) {

      console.log("Push failed for:", sub.endpoint)

      // remove invalid subscriptions automatically
      if (error.statusCode === 410 || error.statusCode === 404) {

        console.log("Deleting invalid subscription:", sub.endpoint)

        await prisma.pushSubscription.delete({
          where: { id: sub.id }
        })

      }

    }

  }

}