import React, { createContext, useContext, useMemo, useCallback } from 'react'
import type { SoundContextState } from '../types/sound'
import { getAudioContext } from '../services/soundService'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/constants'

const SoundContext = createContext<SoundContextState | null>(null)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useLocalStorage(STORAGE_KEYS.SETTINGS + '_muted', false)
  const [masterVolume, setMasterVolume] = useLocalStorage(STORAGE_KEYS.SETTINGS + '_volume', 1)

  const audioContext = useMemo(() => {
    try {
      return getAudioContext()
    } catch {
      return null
    }
  }, [])

  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted)
  }, [setIsMuted])

  const setVolume = useCallback((volume: number) => {
    setMasterVolume(Math.max(0, Math.min(1, volume)))
  }, [setMasterVolume])

  const value = useMemo<SoundContextState>(() => ({
    audioContext,
    isMuted,
    masterVolume,
    setMuted,
    setMasterVolume: setVolume,
  }), [audioContext, isMuted, masterVolume, setMuted, setVolume])

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSoundContext(): SoundContextState {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    throw new Error('useSoundContext must be used within a SoundProvider')
  }
  return ctx
}
