export function timeToLocalHourLabel(time: number) {
  const localHour = (time - new Date().getTimezoneOffset() / 60 + 24) % 24
  const shortLabel = String(localHour).padStart(2, '0')
  return shortLabel
}
