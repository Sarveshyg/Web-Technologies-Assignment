export function formatMs(ms: number, showMs: boolean = false): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const millis = Math.floor(ms % 1000)

  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')

  if (showMs) return `${hh}:${mm}:${ss}.${String(millis).padStart(3, '0')}`
  return `${hh}:${mm}:${ss}`
}

export function formatTime(hours: number, minutes: number, seconds: number, format24h: boolean = true): string {
  if (format24h) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  const period = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 || 12
  return `${String(h12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`
}

export function getAngle(hours: number, minutes: number, seconds: number) {
  return {
    hour: (hours % 12) * 30 + minutes * 0.5,
    minute: minutes * 6 + seconds * 0.1,
    second: seconds * 6,
  }
}
