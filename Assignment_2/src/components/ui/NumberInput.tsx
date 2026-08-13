import React, { useCallback } from 'react'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  'aria-label'?: string
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  'aria-label': ariaLabel,
}: NumberInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value) || 0
      onChange(Math.min(max, Math.max(min, val)))
    },
    [min, max, onChange],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {label && (
        <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          {label}
        </label>
      )}
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        aria-label={ariaLabel || label}
        style={{
          width: '100%',
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
