import { useRef } from 'react'

let globalIdCounter = 0

export function useId(prefix: string = 'id'): string {
  const ref = useRef<string | null>(null)
  if (!ref.current) {
    globalIdCounter++
    ref.current = `${prefix}-${globalIdCounter}`
  }
  return ref.current
}
