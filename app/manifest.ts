import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Habit Ticker",
    short_name: "Habit Ticker",
    description: "Track your daily habits and build streaks.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0F1A",
    theme_color: "#0B0F1A",
    orientation: "portrait",
    icons: [
      {
        src: "/Icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/Icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}