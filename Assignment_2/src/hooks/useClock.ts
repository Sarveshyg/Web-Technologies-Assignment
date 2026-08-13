import { useState, useRef, useEffect } from 'react'

export interface ClockState {
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  timestamp: number
  isoString: string
  unixSeconds: number
  unixMs: number
}

function getClockState(): ClockState {
  const now = new Date()
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    milliseconds: now.getMilliseconds(),
    timestamp: now.getTime(),
    isoString: now.toISOString(),
    unixSeconds: Math.floor(now.getTime() / 1000),
    unixMs: now.getTime(),
  }
}

export function useClock(): ClockState {
  const [state, setState] = useState<ClockState>(getClockState)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const tick = () => {
      setState(getClockState())
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return state
}
