const CACHE_NAME = "habit-tracker-v1"

const reminderTimers = {}

const urlsToCache = [
  "/",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
  console.log("Service worker activated and clients claimed")
})


self.addEventListener("push", (event) => {

  console.log("Push event received")

  let data = {}

  if (event.data) {
    try {
      data = event.data.json()
    } catch {
      data = {
        title: "Reminder",
        body: event.data.text()
      }
    }
  }

  const title = data.title || "Reminder"
  const body = data.body || "You have a task reminder"

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/Hab-Icon-192.png",
      badge: "/Hab-Icon-72.png",
      tag: data.tag || "task-reminder"
    })
  )
})


self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/")
      }
    })
  )
})


self.addEventListener("message", (event) => {

  if (event.data?.type === "SCHEDULE_REMINDER") {

    const { id, title, delay, minutes } = event.data.payload

    if (reminderTimers[id]) {
      clearTimeout(reminderTimers[id])
    }

    console.log("SW scheduling reminder:", title)

    reminderTimers[id] = setTimeout(() => {

      self.registration.showNotification("Task Reminder", {
        body: `${title} is starting in ${minutes} minute${minutes !== 1 ? "s" : ""}`,
        icon: "/Hab-Icon-192.png",
        badge: "/Hab-Icon-72.png",
        tag: `task-${id}`
      })

      console.log("Notification triggered:", title)

    }, delay)

  }

  if (event.data?.type === "CANCEL_REMINDER") {

    const { id } = event.data.payload

    if (reminderTimers[id]) {
      clearTimeout(reminderTimers[id])
      delete reminderTimers[id]
    }
  }

})