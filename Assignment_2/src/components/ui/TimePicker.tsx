import React, { useState, useCallback } from 'react'

interface TimePickerProps {
  hour: number
  minute: number
  onChange: (hour: number, minute: number) => void
  label?: string
}

export function TimePicker({ hour, minute, onChange, label }: TimePickerProps) {
  const [h, setH] = useState(hour)
  const [m, setM] = useState(minute)

  const handleHourChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.min(23, Math.max(0, parseInt(e.target.value) || 0))
      setH(val)
      onChange(val, m)
    },
    [m, onChange],
  )

  const handleMinuteChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0))
      setM(val)
      onChange(h, val)
    },
    [h, onChange],
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      {label && (
        <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginRight: 'var(--space-2)' }}>
          {label}
        </label>
      )}
      <input
        type="number"
        min={0}
        max={23}
        value={String(h).padStart(2, '0')}
        onChange={handleHourChange}
        aria-label="Hours"
        style={{
          width: 56,
          padding: 'var(--space-1) var(--space-2)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-card)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--text-lg)',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          outline: 'none',
        }}
      />
      <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)' }}>:</span>
      <input
        type="number"
        min={0}
        max={59}
        value={String(m).padStart(2, '0')}
        onChange={handleMinuteChange}
        aria-label="Minutes"
        style={{
          width: 56,
          padding: 'var(--space-1) var(--space-2)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-card)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--text-lg)',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          outline: 'none',
        }}
      />
    </div>
  )
}
