
export async function subscribeUser() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service workers not supported")
    return
  }

  const registration = await navigator.serviceWorker.ready

  const permission = await Notification.requestPermission()

  if (permission !== "granted") {
    console.log("Notification permission denied")
    return
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    )
  })

  await fetch("/api/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json"
    }
  })

  console.log("Push subscription stored")
}


function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}