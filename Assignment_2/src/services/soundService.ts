let audioContextInstance: AudioContext | null = null

export function getAudioContext(): AudioContext {
  if (!audioContextInstance) {
    audioContextInstance = new AudioContext()
  }
  if (audioContextInstance.state === 'suspended') {
    audioContextInstance.resume().catch(() => {})
  }
  return audioContextInstance
}

export function resumeAudioContext(): Promise<void> {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    return ctx.resume()
  }
  return Promise.resolve()
}

export async function loadSound(src: string): Promise<AudioBuffer> {
  const ctx = getAudioContext()
  const response = await fetch(src)
  const arrayBuffer = await response.arrayBuffer()
  return ctx.decodeAudioData(arrayBuffer)
}

export function playSound(
  buffer: AudioBuffer,
  volume: number = 1,
  loop: boolean = false,
): { source: AudioBufferSourceNode; stop: () => void } {
  const ctx = getAudioContext()
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = loop

  const gainNode = ctx.createGain()
  gainNode.gain.value = volume

  source.connect(gainNode)
  gainNode.connect(ctx.destination)
  source.start()

  return {
    source,
    stop: () => {
      try {
        source.stop()
      } catch {
        // already stopped
      }
    },
  }
}
