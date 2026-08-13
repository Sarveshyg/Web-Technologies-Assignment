import React from 'react'

interface DigitalClockProps {
  hours: number
  minutes: number
  seconds: number
  format24h?: boolean
  showSeconds?: boolean
}

export const DigitalClock = React.memo(function DigitalClock({
  hours,
  minutes,
  seconds,
  format24h = true,
  showSeconds = true,
}: DigitalClockProps) {
  const displayHours = format24h
    ? String(hours).padStart(2, '0')
    : String(hours % 12 || 12).padStart(2, '0')
  const displayMinutes = String(minutes).padStart(2, '0')
  const displaySeconds = String(seconds).padStart(2, '0')
  const period = !format24h ? (hours >= 12 ? 'PM' : 'AM') : ''

  return (
    <div
      aria-live="polite"
      aria-label={`Digital clock showing ${displayHours}:${displayMinutes}`}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-4xl)',
        fontWeight: 'var(--font-bold)',
        color: 'var(--color-text-primary)',
        letterSpacing: '0.05em',
        display: 'flex',
        alignItems: 'baseline',
        gap: 'var(--space-1)',
      }}
    >
      <span>{displayHours}</span>
      <span style={{ color: 'var(--color-accent)', animation: 'pulse 1s step-end infinite' }}>:</span>
      <span>{displayMinutes}</span>
      {showSeconds && (
        <>
          <span style={{ color: 'var(--color-accent)', animation: 'pulse 1s step-end infinite' }}>:</span>
          <span style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-text-muted)' }}>
            {displaySeconds}
          </span>
        </>
      )}
      {period && (
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginLeft: 'var(--space-2)' }}>
          {period}
        </span>
      )}
    </div>
  )
})
