import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Habit Ticker",
    short_name: "Habits",
    description: "Track your daily habits and build streaks.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0F1A",
    theme_color: "#22c55e",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}