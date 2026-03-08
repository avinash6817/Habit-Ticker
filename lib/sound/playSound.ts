let completeSound: HTMLAudioElement | null = null

export function playCompleteSound() {
  if (!completeSound) {
    completeSound = new Audio("/Sound/Completed.mp3")
    completeSound.volume = 0.8
  }

  completeSound.currentTime = 0
  completeSound.play().catch(() => {})
}