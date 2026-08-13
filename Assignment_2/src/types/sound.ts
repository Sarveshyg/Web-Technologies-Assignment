export type SoundID = string

export interface SoundMeta {
  id: SoundID
  label: string
  src: string
  duration: number
}

export interface SoundContextState {
  audioContext: AudioContext | null
  isMuted: boolean
  masterVolume: number
  setMuted: (muted: boolean) => void
  setMasterVolume: (volume: number) => void
}
