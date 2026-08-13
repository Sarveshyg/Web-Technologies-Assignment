import { useCallback, useSyncExternalStore } from 'react'

function getMediaQuery(query: string): MediaQueryList {
  return window.matchMedia(query)
}

function subscribe(query: string, callback: () => void): () => void {
  const mql = getMediaQuery(query)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot(query: string): boolean {
  return getMediaQuery(query).matches
}

export function useMediaQuery(query: string): boolean {
  const subscribeFn = useCallback(
    (cb: () => void) => subscribe(query, cb),
    [query],
  )
  const getSnapshotFn = useCallback(
    () => getSnapshot(query),
    [query],
  )

  return useSyncExternalStore(subscribeFn, getSnapshotFn)
}
