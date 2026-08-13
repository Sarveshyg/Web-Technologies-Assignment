import { useState, useRef, useCallback } from 'react'

export interface TimerData {
  id: string
  label: string
  durationMs: number
  remainingMs: number
  isRunning: boolean
  isComplete: boolean
}

export function useCountdownTimer(durationMs: number, label: string = '') {
  const id = useRef(`timer_${Math.random().toString(36).slice(2, 8)}`)
  const [remainingMs, setRemainingMs] = useState(durationMs)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const startTimeRef = useRef<number>(0)
  const pauseRemainingRef = useRef<number>(durationMs)
  const rafRef = useRef<number>(0)

  const tick = useCallback(() => {
    const now = performance.now()
    const elapsed = now - startTimeRef.current
    const remaining = Math.max(0, pauseRemainingRef.current - elapsed)
    setRemainingMs(remaining)
    if (remaining <= 0) {
      setIsRunning(false)
      setIsComplete(true)
      cancelAnimationFrame(rafRef.current)
      return
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const start = useCallback(() => {
    if (isRunning) return
    if (isComplete) {
      pauseRemainingRef.current = durationMs
      setIsComplete(false)
    }
    startTimeRef.current = performance.now()
    setIsRunning(true)
    rafRef.current = requestAnimationFrame(tick)
  }, [isRunning, isComplete, durationMs, tick])

  const pause = useCallback(() => {
    if (!isRunning) return
    cancelAnimationFrame(rafRef.current)
    pauseRemainingRef.current = remainingMs
    setIsRunning(false)
  }, [isRunning, remainingMs])

  const resume = useCallback(() => {
    if (isRunning || isComplete) return
    startTimeRef.current = performance.now()
    setIsRunning(true)
    rafRef.current = requestAnimationFrame(tick)
  }, [isRunning, isComplete, tick])

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setRemainingMs(durationMs)
    setIsRunning(false)
    setIsComplete(false)
    pauseRemainingRef.current = durationMs
  }, [durationMs])

  const getTimerData = useCallback((): TimerData => ({
    id: id.current,
    label,
    durationMs,
    remainingMs,
    isRunning,
    isComplete,
  }), [label, durationMs, remainingMs, isRunning, isComplete])

  return { remainingMs, isRunning, isComplete, start, pause, resume, reset, getTimerData }
}
