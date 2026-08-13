import React, { useCallback } from 'react'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  'aria-label'?: string
}

export const Slider = React.memo(function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  'aria-label': ariaLabel,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value))
    },
    [onChange],
  )

  return (
    <div style={{ position: 'relative', width: '100%', height: 20, display: 'flex', alignItems: 'center' }}>
      <input
        type="range"
        role="slider"
        aria-label={ariaLabel || 'Slider'}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{
          width: '100%',
          height: 6,
          borderRadius: 3,
          WebkitAppearance: 'none',
          appearance: 'none',
          backgroundColor: 'var(--color-border)',
          outline: 'none',
          cursor: 'pointer',
          background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${percentage}%, var(--color-border) ${percentage}%, var(--color-border) 100%)`,
        }}
      />
    </div>
  )
})
