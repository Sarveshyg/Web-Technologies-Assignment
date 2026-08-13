import { useState, useRef, useCallback } from 'react'

export interface Lap {
  number: number
  splitMs: number
  cumulativeMs: number
}

interface StopwatchAPI {
  elapsedMs: number
  isRunning: boolean
  laps: Lap[]
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  recordLap: () => void
  bestLap: Lap | null
  worstLap: Lap | null
}

export function useStopwatch(): StopwatchAPI {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const startTimeRef = useRef<number>(0)
  const pauseOffsetRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  const tick = useCallback(() => {
    if (startTimeRef.current === 0) return
    const now = performance.now()
    const elapsed = pauseOffsetRef.current + (now - startTimeRef.current)
    setElapsedMs(elapsed)
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const start = useCallback(() => {
    if (isRunning) return
    startTimeRef.current = performance.now()
    setIsRunning(true)
    rafRef.current = requestAnimationFrame(tick)
  }, [isRunning, tick])

  const pause = useCallback(() => {
    if (!isRunning) return
    cancelAnimationFrame(rafRef.current)
    pauseOffsetRef.current = elapsedMs
    setIsRunning(false)
  }, [isRunning, elapsedMs])

  const resume = useCallback(() => {
    if (isRunning) return
    startTimeRef.current = performance.now()
    setIsRunning(true)
    rafRef.current = requestAnimationFrame(tick)
  }, [isRunning, tick])

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setElapsedMs(0)
    setIsRunning(false)
    setLaps([])
    pauseOffsetRef.current = 0
    startTimeRef.current = 0
  }, [])

  const recordLap = useCallback(() => {
    if (!isRunning) return
    setLaps((prev) => {
      const lastCumulative = prev.length > 0 ? prev[prev.length - 1].cumulativeMs : 0
      return [
        ...prev,
        {
          number: prev.length + 1,
          splitMs: elapsedMs - lastCumulative,
          cumulativeMs: elapsedMs,
        },
      ]
    })
  }, [isRunning, elapsedMs])

  const bestLap = laps.length > 0
    ? laps.reduce((best, lap) => (lap.splitMs < best.splitMs ? lap : best), laps[0])
    : null

  const worstLap = laps.length > 0
    ? laps.reduce((worst, lap) => (lap.splitMs > worst.splitMs ? lap : worst), laps[0])
    : null

  return {
    elapsedMs,
    isRunning,
    laps,
    start,
    pause,
    resume,
    reset,
    recordLap,
    bestLap,
    worstLap,
  }
}
