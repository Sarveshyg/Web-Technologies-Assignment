import { useState } from 'react'
import { useCountdownTimer } from '../../hooks/useCountdownTimer'
import { formatMs } from '../../utils/time'

const PRESETS = [
  { label: '1 min', ms: 60000 },
  { label: '5 min', ms: 300000 },
  { label: '15 min', ms: 900000 },
  { label: '30 min', ms: 1800000 },
  { label: '1 hr', ms: 3600000 },
]

function parseInput(value: string): number {
  const parts = value.split(':').map(Number)
  if (parts.length === 3) {
    return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000
  }
  if (parts.length === 2) {
    return (parts[0] * 60 + parts[1]) * 1000
  }
  return 0
}

function formatInput(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function CountdownWidget() {
  const [durationMs, setDurationMs] = useState(300000)
  const [inputValue, setInputValue] = useState(formatInput(300000))
  const timer = useCountdownTimer(durationMs, 'Countdown')
  const progress = durationMs > 0 ? 1 - timer.remainingMs / durationMs : 0

  const handlePreset = (ms: number) => {
    setDurationMs(ms)
    setInputValue(formatInput(ms))
    timer.reset()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    const parsed = parseInput(e.target.value)
    if (parsed > 0) {
      setDurationMs(parsed)
      timer.reset()
    }
  }

  const handleStart = () => {
    if (timer.isComplete || timer.remainingMs === durationMs) {
      const parsed = parseInput(inputValue)
      if (parsed > 0) setDurationMs(parsed)
    }
    timer.start()
  }

  return (
    <div style={{ padding: 'var(--space-2)' }}>
      <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
        Countdown Timer
      </h3>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
        <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={70} cy={70} r={60} fill="none" stroke="var(--color-border)" strokeWidth={6} />
          <circle
            cx={70} cy={70} r={60}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={6}
            strokeDasharray={2 * Math.PI * 60}
            strokeDashoffset={2 * Math.PI * 60 * (1 - Math.min(1, Math.max(0, progress)))}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 140,
          height: 140,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: timer.isComplete ? 'var(--color-error)' : 'var(--color-text-primary)',
          }}>
            {formatMs(timer.remainingMs)}
          </span>
        </div>
      </div>

      {!timer.isRunning && !timer.isComplete && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <input
            value={inputValue}
            onChange={handleInputChange}
            aria-label="Countdown duration"
            placeholder="HH:MM:SS"
            style={{
              width: '100%',
              padding: 'var(--space-2)',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-card)',
              color: 'var(--color-text-primary)',
              outline: 'none',
            }}
          />
        </div>
      )}

      {!timer.isRunning && !timer.isComplete && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePreset(p.ms)}
              style={{
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${durationMs === p.ms ? 'var(--color-accent)' : 'var(--color-border)'}`,
                backgroundColor: durationMs === p.ms ? 'var(--color-accent-light)' : 'transparent',
                color: durationMs === p.ms ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
        {(timer.isRunning || timer.isComplete) ? (
          <button
            onClick={timer.isRunning ? timer.pause : timer.start}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: timer.isRunning ? 'var(--color-warning)' : 'var(--color-accent)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
            }}
          >
            {timer.isRunning ? 'Pause' : 'Restart'}
          </button>
        ) : (
          <button
            onClick={handleStart}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-accent-text)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
            }}
          >
            Start
          </button>
        )}
        {(timer.remainingMs < durationMs || timer.isComplete) && (
          <button
            onClick={timer.reset}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
            }}
          >
            Reset
          </button>
        )}
      </div>

      {timer.isComplete && (
        <p style={{ textAlign: 'center', marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-error)', fontWeight: 600 }}>
          ✅ Time is up!
        </p>
      )}
    </div>
  )
}
