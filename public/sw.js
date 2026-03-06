const CACHE_NAME = "habit-tracker-v1"

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
