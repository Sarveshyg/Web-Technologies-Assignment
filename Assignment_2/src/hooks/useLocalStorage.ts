import { useState, useCallback, useEffect } from 'react'
import { localStorageService } from '../services/localStorageService'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return localStorageService.get<T>(key, defaultValue)
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value
        localStorageService.set(key, nextValue)
        return nextValue
      })
    },
    [key],
  )

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key?.endsWith(key) && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  return [storedValue, setValue]
}
