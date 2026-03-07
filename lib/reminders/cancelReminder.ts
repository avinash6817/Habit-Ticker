export const cancelReminder = async (taskId: number) => {
  if (!("serviceWorker" in navigator)) return

  const registration = await navigator.serviceWorker.ready

  registration.active?.postMessage({
    type: "CANCEL_REMINDER",
    payload: { id: taskId }
  })
}