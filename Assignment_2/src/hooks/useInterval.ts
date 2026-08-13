import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay: number | null) {
  const cbRef = useRef(callback)
  cbRef.current = callback

  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => cbRef.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}
