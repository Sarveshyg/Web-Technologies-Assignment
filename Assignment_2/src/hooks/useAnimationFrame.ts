import { useEffect, useRef } from 'react'

export function useAnimationFrame(callback: (delta: number) => void, active: boolean = true) {
  const cbRef = useRef(callback)
  cbRef.current = callback
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!active) return
    let rafId: number
    const tick = (time: number) => {
      const delta = time - lastTimeRef.current
      lastTimeRef.current = time
      cbRef.current(delta)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [active])
}
